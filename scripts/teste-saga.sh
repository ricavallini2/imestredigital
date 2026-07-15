#!/usr/bin/env bash
# ============================================================================
# teste-saga.sh — Smoke test permanente da saga transacional do iMestreDigital
# ----------------------------------------------------------------------------
# Exercita, ponta a ponta, o fluxo orquestrado por eventos Kafka:
#
#   pedido (order) → reserva (inventory) → NF-e fake autorizada (fiscal)
#                                        → conta a receber (financial)
#
# Etapas verificadas (cada uma com timeout independente):
#   1. LOGIN         POST  auth /api/v1/auth/login                → accessToken
#   2. CRIAR PEDIDO  POST  order /api/v1/pedidos (origem=LOJA_FISICA)
#   3. RESERVA       poll  inventory /api/v1/estoque/produto/:id  (totalReservado sobe)
#                    +     order status == EM_SEPARACAO
#   4. SEPARADO      PATCH order /api/v1/pedidos/:id/separado
#   5. FATURAR       PATCH order /api/v1/pedidos/:id/faturar
#   6. FATURADO      poll  order /api/v1/pedidos/:id (status == FATURADO)
#   7. FINANCEIRO    poll  financial /api/v1/lancamentos (lançamento c/ pedidoId)
#
# Cada etapa imprime PASS/FAIL. Timeout padrão de 60s por etapa de espera.
# Saída: exit 0 se TODAS passarem; exit 1 na primeira falha.
#
# Requisitos: bash, curl, node (para parse de JSON — sem dependência de jq).
# Os serviços 3001/3005/3006/3011 devem estar de pé (ambiente local real).
#
# Uso:
#   bash scripts/teste-saga.sh
#   TIMEOUT=90 PRODUTO_ID=... bash scripts/teste-saga.sh
# ============================================================================

set -uo pipefail

# ─── Configuração (sobrescrevível por variável de ambiente) ─────────────────
AUTH_URL="${AUTH_URL:-http://localhost:3001}"
ORDER_URL="${ORDER_URL:-http://localhost:3005}"
FINANCIAL_URL="${FINANCIAL_URL:-http://localhost:3006}"
INVENTORY_URL="${INVENTORY_URL:-http://localhost:3011}"

EMAIL="${EMAIL:-teste@teste.com}"
SENHA="${SENHA:-Senha123}"

# Produto com estoque folgado no seed (Mouse Ergonômico Sem Fio 2.4GHz).
PRODUTO_ID="${PRODUTO_ID:-50000000-0000-0000-0000-000000000003}"
PRODUTO_SKU="${PRODUTO_SKU:-TECH-MOUSE-001}"
PRODUTO_TITULO="${PRODUTO_TITULO:-Mouse Ergonômico Sem Fio 2.4GHz}"
PRODUTO_VALOR="${PRODUTO_VALOR:-89.90}"
QUANTIDADE="${QUANTIDADE:-1}"

TIMEOUT="${TIMEOUT:-60}"        # segundos por etapa de espera
INTERVALO="${INTERVALO:-2}"     # segundos entre tentativas de poll

# ─── Cores (desativa se não for TTY) ────────────────────────────────────────
if [ -t 1 ]; then
  VERDE=$'\033[0;32m'; VERMELHO=$'\033[0;31m'; AMARELO=$'\033[0;33m'
  AZUL=$'\033[0;34m'; NEGRITO=$'\033[1m'; RESET=$'\033[0m'
else
  VERDE=''; VERMELHO=''; AMARELO=''; AZUL=''; NEGRITO=''; RESET=''
fi

ETAPA_ATUAL=""

log()   { printf '%s\n' "$*"; }
info()  { printf '%s→%s %s\n' "$AZUL" "$RESET" "$*"; }
pass()  { printf '%s✔ PASS%s  %s\n' "$VERDE" "$RESET" "$*"; }
falha() {
  printf '%s✗ FAIL%s  %s\n' "$VERMELHO" "$RESET" "$*" >&2
  printf '\n%s══════════════════════════════════════════════════%s\n' "$VERMELHO" "$RESET" >&2
  printf '%sSAGA FALHOU%s na etapa: %s%s%s\n' "$VERMELHO$NEGRITO" "$RESET" "$NEGRITO" "${ETAPA_ATUAL:-?}" "$RESET" >&2
  printf '%s══════════════════════════════════════════════════%s\n' "$VERMELHO" "$RESET" >&2
  exit 1
}
titulo() {
  ETAPA_ATUAL="$1"
  printf '\n%s%s%s\n' "$NEGRITO" "$1" "$RESET"
}

# ─── Extrator de campo JSON (via node — robusto, sem jq) ────────────────────
# Uso: json_get "<json>" "caminho.do.campo"
# Retorna string vazia se ausente/erro.
json_get() {
  node -e '
    let raw = "";
    process.stdin.on("data", d => raw += d);
    process.stdin.on("end", () => {
      try {
        const obj = JSON.parse(raw);
        const val = process.argv[1].split(".").reduce(
          (acc, k) => (acc == null ? undefined : acc[k]), obj);
        if (val === undefined || val === null) process.stdout.write("");
        else if (typeof val === "object") process.stdout.write(JSON.stringify(val));
        else process.stdout.write(String(val));
      } catch (_) { process.stdout.write(""); }
    });
  ' "$2" <<<"$1"
}

# Verifica se, na lista financial (envelope { dados: [...] }), existe algum
# lançamento cujo pedidoId === $1. Imprime "SIM" ou "NAO".
lancamento_tem_pedido() {
  node -e '
    let raw = "";
    process.stdin.on("data", d => raw += d);
    process.stdin.on("end", () => {
      try {
        const obj = JSON.parse(raw);
        const lista = Array.isArray(obj) ? obj : (obj.dados || obj.data || []);
        const alvo = process.argv[1];
        const achou = lista.some(l => l && l.pedidoId === alvo);
        process.stdout.write(achou ? "SIM" : "NAO");
      } catch (_) { process.stdout.write("NAO"); }
    });
  ' "$2" <<<"$1"
}

# curl helpers — sempre com timeout de conexão curto para não pendurar.
CURL="curl -sS --max-time 15 --connect-timeout 5"

# ============================================================================
# ETAPA 1 — LOGIN
# ============================================================================
titulo "1) LOGIN (auth-service)"
info "POST ${AUTH_URL}/api/v1/auth/login  (${EMAIL})"

LOGIN_RESP=$($CURL -X POST "${AUTH_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"senha\":\"${SENHA}\"}" 2>/dev/null)

TOKEN=$(json_get "$LOGIN_RESP" "accessToken")
TENANT_ID=$(json_get "$LOGIN_RESP" "usuario.tenant.id")

if [ -z "$TOKEN" ]; then
  log "${AMARELO}Resposta:${RESET} $(printf '%.300s' "$LOGIN_RESP")"
  falha "login não retornou accessToken (auth-service no ar em ${AUTH_URL}?)"
fi
pass "login ok — tenant ${TENANT_ID:-?}, token ${TOKEN:0:18}…"

AUTH_HEADER="Authorization: Bearer ${TOKEN}"

# ============================================================================
# ETAPA 2 — BASELINE DE ESTOQUE + CRIAR PEDIDO
# ============================================================================
titulo "2) CRIAR PEDIDO (order-service)"

# Baseline do reservado ANTES do pedido (para detectar o incremento da reserva).
SALDO_RESP=$($CURL "${INVENTORY_URL}/api/v1/estoque/produto/${PRODUTO_ID}" \
  -H "$AUTH_HEADER" 2>/dev/null)
RESERVADO_BASE=$(json_get "$SALDO_RESP" "totalReservado")
[ -z "$RESERVADO_BASE" ] && RESERVADO_BASE=0
info "reservado baseline do produto ${PRODUTO_SKU}: ${RESERVADO_BASE}"

PEDIDO_PAYLOAD=$(cat <<JSON
{
  "origem": "LOJA_FISICA",
  "clienteNome": "Cliente Smoke Test Saga",
  "clienteCpfCnpj": "12345678909",
  "metodoPagamento": "PIX",
  "itens": [
    {
      "produtoId": "${PRODUTO_ID}",
      "sku": "${PRODUTO_SKU}",
      "titulo": "${PRODUTO_TITULO}",
      "quantidade": ${QUANTIDADE},
      "valorUnitario": ${PRODUTO_VALOR}
    }
  ]
}
JSON
)

info "POST ${ORDER_URL}/api/v1/pedidos  (origem=LOJA_FISICA, ${QUANTIDADE}x ${PRODUTO_SKU})"
PEDIDO_RESP=$($CURL -X POST "${ORDER_URL}/api/v1/pedidos" \
  -H "$AUTH_HEADER" -H "Content-Type: application/json" \
  -d "$PEDIDO_PAYLOAD" 2>/dev/null)

PEDIDO_ID=$(json_get "$PEDIDO_RESP" "id")
PEDIDO_NUMERO=$(json_get "$PEDIDO_RESP" "numero")
PEDIDO_STATUS=$(json_get "$PEDIDO_RESP" "status")

if [ -z "$PEDIDO_ID" ]; then
  log "${AMARELO}Resposta:${RESET} $(printf '%.400s' "$PEDIDO_RESP")"
  falha "criação de pedido não retornou id"
fi
pass "pedido criado — id ${PEDIDO_ID}, numero ${PEDIDO_NUMERO:-?}, status ${PEDIDO_STATUS:-?}"

# ============================================================================
# ETAPA 3 — RESERVA DE ESTOQUE (assíncrona via Kafka)
# ============================================================================
titulo "3) RESERVA DE ESTOQUE (inventory-service, via Kafka)"
info "poll (até ${TIMEOUT}s): totalReservado > ${RESERVADO_BASE} E pedido em EM_SEPARACAO"

RESERVA_OK="nao"
DEADLINE=$(( $(date +%s) + TIMEOUT ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  SALDO_RESP=$($CURL "${INVENTORY_URL}/api/v1/estoque/produto/${PRODUTO_ID}" \
    -H "$AUTH_HEADER" 2>/dev/null)
  RESERVADO_AGORA=$(json_get "$SALDO_RESP" "totalReservado")
  [ -z "$RESERVADO_AGORA" ] && RESERVADO_AGORA=0

  PED_RESP=$($CURL "${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}" -H "$AUTH_HEADER" 2>/dev/null)
  PED_STATUS=$(json_get "$PED_RESP" "status")

  # Reserva confirmada quando o reservado do produto subiu (estoque efetivamente
  # reservado) e o order avançou para EM_SEPARACAO (consumo de estoque.reservado).
  if [ "$RESERVADO_AGORA" -gt "$RESERVADO_BASE" ] 2>/dev/null && [ "$PED_STATUS" = "EM_SEPARACAO" ]; then
    RESERVA_OK="sim"
    break
  fi
  printf '  … reservado=%s (base %s) · pedido=%s\n' "$RESERVADO_AGORA" "$RESERVADO_BASE" "${PED_STATUS:-?}"
  sleep "$INTERVALO"
done

if [ "$RESERVA_OK" != "sim" ]; then
  falha "estoque não reservado / pedido não chegou a EM_SEPARACAO em ${TIMEOUT}s (status=${PED_STATUS:-?}, reservado=${RESERVADO_AGORA:-?})"
fi
pass "reserva confirmada — reservado ${RESERVADO_BASE}→${RESERVADO_AGORA}, pedido em EM_SEPARACAO"

# ============================================================================
# ETAPA 4 — FINALIZAR SEPARAÇÃO
# ============================================================================
titulo "4) SEPARADO (order-service)"
info "PATCH ${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}/separado"

SEP_RESP=$($CURL -X PATCH "${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}/separado" \
  -H "$AUTH_HEADER" 2>/dev/null)
# O endpoint retorna o pedido (status permanece EM_SEPARACAO). Consideramos OK
# se não houve erro HTTP e o pedido continua íntegro.
SEP_STATUS=$(json_get "$SEP_RESP" "status")
SEP_ERRO=$(json_get "$SEP_RESP" "statusCode")
if [ -n "$SEP_ERRO" ] && [ "$SEP_ERRO" != "200" ] && [ "$SEP_ERRO" != "201" ]; then
  log "${AMARELO}Resposta:${RESET} $(printf '%.300s' "$SEP_RESP")"
  falha "PATCH /separado retornou erro (statusCode=${SEP_ERRO})"
fi
pass "separação finalizada (evento PEDIDO_SEPARADO emitido; status ${SEP_STATUS:-EM_SEPARACAO})"

# ============================================================================
# ETAPA 5 — FATURAR (dispara NF-e no fiscal-service)
# ============================================================================
titulo "5) FATURAR (order-service → fiscal-service)"
info "PATCH ${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}/faturar"

FAT_RESP=$($CURL -X PATCH "${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}/faturar" \
  -H "$AUTH_HEADER" 2>/dev/null)
FAT_ERRO=$(json_get "$FAT_RESP" "statusCode")
if [ -n "$FAT_ERRO" ] && [ "$FAT_ERRO" != "200" ] && [ "$FAT_ERRO" != "201" ]; then
  log "${AMARELO}Resposta:${RESET} $(printf '%.300s' "$FAT_RESP")"
  falha "PATCH /faturar retornou erro (statusCode=${FAT_ERRO})"
fi
pass "faturamento solicitado (evento PEDIDO_FATURAR emitido ao fiscal-service)"

# ============================================================================
# ETAPA 6 — PEDIDO FATURADO (após nota.autorizada do fiscal)
# ============================================================================
titulo "6) PEDIDO FATURADO (order-service, após NF-e autorizada)"
info "poll (até ${TIMEOUT}s): status do pedido == FATURADO"

FATURADO_OK="nao"
DEADLINE=$(( $(date +%s) + TIMEOUT ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  PED_RESP=$($CURL "${ORDER_URL}/api/v1/pedidos/${PEDIDO_ID}" -H "$AUTH_HEADER" 2>/dev/null)
  PED_STATUS=$(json_get "$PED_RESP" "status")
  if [ "$PED_STATUS" = "FATURADO" ]; then
    FATURADO_OK="sim"
    NOTA_ID=$(json_get "$PED_RESP" "notaFiscalId")
    break
  fi
  printf '  … status atual: %s\n' "${PED_STATUS:-?}"
  sleep "$INTERVALO"
done

if [ "$FATURADO_OK" != "sim" ]; then
  falha "pedido não chegou a FATURADO em ${TIMEOUT}s (status=${PED_STATUS:-?})"
fi
pass "pedido FATURADO — nota fiscal ${NOTA_ID:-<vinculada>}"

# ============================================================================
# ETAPA 7 — LANÇAMENTO NO FINANCEIRO (conta a receber via pedido.faturado)
# ============================================================================
titulo "7) LANÇAMENTO FINANCEIRO (financial-service, via Kafka)"
info "poll (até ${TIMEOUT}s): existe lançamento com pedidoId == ${PEDIDO_ID}"

FIN_OK="nao"
DEADLINE=$(( $(date +%s) + TIMEOUT ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  # Busca as páginas mais recentes; o recebível recém-criado aparece no topo.
  LANC_RESP=$($CURL "${FINANCIAL_URL}/api/v1/lancamentos?limite=100" -H "$AUTH_HEADER" 2>/dev/null)
  TEM=$(lancamento_tem_pedido "$LANC_RESP" "$PEDIDO_ID")
  if [ "$TEM" = "SIM" ]; then
    FIN_OK="sim"
    break
  fi
  printf '  … ainda sem lançamento para o pedido\n'
  sleep "$INTERVALO"
done

if [ "$FIN_OK" != "sim" ]; then
  falha "nenhum lançamento financeiro vinculado ao pedido ${PEDIDO_ID} em ${TIMEOUT}s"
fi
pass "lançamento financeiro criado e vinculado ao pedido ${PEDIDO_ID}"

# ============================================================================
# RESUMO
# ============================================================================
printf '\n%s══════════════════════════════════════════════════%s\n' "$VERDE" "$RESET"
printf '%s%s✔ SAGA COMPLETA — TODAS AS ETAPAS PASSARAM%s\n' "$VERDE" "$NEGRITO" "$RESET"
printf '%s══════════════════════════════════════════════════%s\n' "$VERDE" "$RESET"
printf '  pedido ....... %s (%s)\n' "$PEDIDO_ID" "${PEDIDO_NUMERO:-?}"
printf '  status ....... FATURADO\n'
printf '  nota fiscal .. %s\n' "${NOTA_ID:-<vinculada>}"
printf '  financeiro ... conta a receber criada\n\n'
exit 0
