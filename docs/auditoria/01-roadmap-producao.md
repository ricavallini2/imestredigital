# Roadmap de Produção — iMestreDigital ERP SaaS

> Documento executivo para diretoria e engenharia · Base: auditoria completa de 12 subsistemas · Data: 30/06/2026

---

## 1. Diagnóstico Geral

O iMestreDigital é hoje um **protótipo navegável de altíssima fidelidade, não um produto em produção**. O frontend (Next.js 15) é amplo e visualmente completo — 13 módulos, ~50 páginas, CRUD rico — porém roda **100% sobre rotas mock** em `app/api/v1`. Os 10 microserviços NestJS existem e variam de *scaffold puro* (marketplace, fiscal) a *parcialmente implementado de verdade* (order-service e auth-service são os mais maduros), mas **nenhum está pronto para produção**. A estimativa agregada é de **~70% mock / 30% real**, sendo que a porção "real" sofre de defeitos estruturais que a impedem de operar end-to-end.

O risco dominante é um **padrão sistêmico de drift** — o mesmo bug `origem='WEBSITE'` descoberto no customer-service se repete em quase todos os serviços, em três variantes: (a) **enum drift** entre `packages/types`, schema Prisma e mocks do frontend (catalog `StatusProduto`, order `StatusPedido` triplo, inventory `StatusReserva`/`TipoMovimentacao`, financial `FormaPagamento`/`TipoConta`, ai `TipoInsight`/`TipoSugestao`, notification `TipoNotificacao`, auth `Plano`/`StatusTenant`); (b) **case mismatch** UPPERCASE no banco vs lowercase no código (quebra RBAC do auth com backend real); (c) **contrato front↔back divergente** (envelopes `{dados}` vs `{pedidos}`/`{insights}`/`{lancamentos}`, rotas inexistentes, métodos PATCH vs DELETE/PUT). Como o frontend usa mock em dev, **essas divergências só explodem ao ligar o serviço real em produção** — regressão silenciosa de alto impacto.

Há ainda três classes de risco crítico transversal: **(1) Autenticação cross-service quebrada** — o `JWT_SECRET` não é injetado em 9 dos 10 serviços no `docker-compose.prod.yml`, então 100% dos tokens do auth são rejeitados em produção. **(2) Multi-tenancy frágil ou inexistente** — financial, marketplace, ai e notification têm `TenantMiddleware` nunca registrado (`tenantId` sempre `undefined`); vários serviços fazem `update/delete where:{id}` sem `tenantId` (IDOR cross-tenant). **(3) Fiscal-service é mock integral** — não assina XML, não fala com SEFAZ, não emite um único documento fiscal válido; está a meses-engenheiro de produção. Conclusão: o caminho mock→produção **não é transparente** e exige uma fase de estabilização dedicada antes de qualquer feature nova.

---

## 2. Matriz de Maturidade

| Módulo | Maturidade | Mock/Real | Bloqueadores principais |
|---|---|---|---|
| **auth-service** | Parcial (mais maduro) | Real em prod / mock em dev | Case mismatch UPPERCASE×lowercase quebra RBAC; enum drift Plano/Status; `'REMOVIDO'` inexistente quebra listagem; esqueci/redefinir-senha ausentes; sem brute-force; eventos Kafka 0% |
| **catalog-service** | Parcial | Frontend 100% mock | Enum drift `StatusProduto`; Categoria/Marca são módulos vazios (bloqueia criar produto); eventos não chegam ao marketplace (tópico+padrão errados); cache em memória; sem RBAC |
| **inventory-service** | Parcial | Mock em dev | Enum drift `StatusReserva`/`Tipo`/`MotivoMovimentacao` (toda movimentação falha); consumer Kafka de pedidos nunca dispara (tópico+envelope errados); PUT/DELETE depósito ausentes; sem RBAC |
| **order-service** | Parcial (melhor implementado) | Frontend 100% mock | Sem auth/guard nem RBAC; `tenantId` undefined não barrado; contrato `{pedidos}` vs `{dados}`; enum drift triplo; webhook/estorno stubs; sem idempotência/outbox |
| **financial-service** | Parcial | Predominantemente mock | `TenantMiddleware` não registrado (`tenantId` sempre undefined → tudo quebra); writes cross-tenant; enum drift `FormaPagamento`/`TipoConta`; DRE calcula errado (custos=0); sem RBAC; sem transação atômica |
| **customer-service** | Parcial (mais maduro do CRM) | Mock dev / real prod | **Enum drift `OrigemCliente` (bug raiz)**; filtro tipo PF/PJ não normaliza; consumer Kafka inerte (provider+RMQ em Kafka); soft-delete fictício; sem RBAC |
| **marketplace-service** | Scaffold | 100% mock (quebra em prod) | Sem prefixo/versioning (rewrite→404 total); `TenantMiddleware` não registrado; Kafka producer sem wiring; adapters singleton vazam token cross-tenant; adapters 100% mock |
| **ai-service** | Parcial | 100% mock/desacoplado | Enum drift `TipoInsight`/`TipoSugestao`; coluna `prioridade` inexistente; multi-tenancy desligada (fallback fixo); sem auth; produtor Kafka órfão; chat nunca chama backend |
| **notification-service** | Parcial | 100% mock | `JwtStrategy` ausente (toda rota protegida quebra); multi-tenancy desligada; consumer `@MessagePattern` vs `emit()`; push/SMS ausentes; enum drift `INTERNA` |
| **fiscal-service** | Scaffold | Mock integral SEFAZ | Assinatura digital stub; SEFAZ simulada; XML 4.00 inválido; certificado+senha em texto plano; sem auth real; engine de impostos rudimentar; DANFE/SPED incorretos |
| **frontend (apps/web)** | Parcial | Mock dev / divergente prod | Marketplace 404 total; rotas pedidos/fiscal divergentes; middleware não valida JWT; cookie sem httpOnly; logout não encerra sessão; sem RBAC na UI |
| **infra/DevOps** | Parcial | Real, com gaps | `JWT_SECRET` não compartilhado (auth quebra); healthchecks divergentes; `db push --accept-data-loss`; sem backup off-site; sem observabilidade funcional |

**Mock permanente (sem microserviço nem rewrite):** Caixa/PDV, Compras/Fornecedores, Cobrança, Dashboard/resumo, IA chat, Busca global, Financeiro fluxo-caixa/DRE.

---

## 3. Roadmap em Fases

### Fase 0 — Estabilização *(fundação: nada novo até isto fechar)*

**Objetivo:** eliminar os defeitos que quebram o sistema ao sair do mock — drift de enum/contrato, autenticação cross-service, multi-tenancy e infraestrutura insegura.

**Entregáveis:**
- **Unificar enums numa fonte única** (`packages/types`) e alinhar schema Prisma + mocks. Cobre: `OrigemCliente`, `StatusProduto`, `StatusPedido` (triplo), `StatusReserva`/`Tipo`/`MotivoMovimentacao`, `FormaPagamento`/`TipoConta`, `TipoInsight`/`TipoSugestao`, `TipoNotificacao`, `Plano`/`StatusTenant`/`StatusUsuario`.
- **Resolver case mismatch** UPPERCASE×lowercase do `cargo` (auth) — normalizar no JWT ou comparar case-insensitive no `RolesGuard`.
- **Compartilhar `JWT_SECRET`** em todos os 9 serviços consumidores no `docker-compose.prod.yml`; remover fallback `'dev-secret-trocar-em-producao'` e falhar no boot se ausente.
- **Registrar/corrigir `TenantMiddleware`** em financial, marketplace, ai e notification; reativar isolamento de tenant no ai-service; criar `JwtStrategy` no notification-service.
- **Corrigir writes cross-tenant** (`update/delete where:{id,tenantId}`) em financial, customer, marketplace, notification, order.
- **Alinhar contratos front↔back** críticos: envelope de paginação (`{dados,meta}`), rotas de pedidos (status/cancelar/catalogo), fiscal (validar PUT×POST), marketplace (prefixo/versioning), auth (`/me`×`/perfil`).
- **Migrar cache do catalog** de `memory` para Redis; **trocar `db push --accept-data-loss`** por `prisma migrate deploy` versionado.
- **Segurança frontend:** middleware valida assinatura/exp do JWT; cookie httpOnly+Secure server-side; corrigir logout.

**Critério de pronto:** ligar qualquer microserviço real (sem mock) e ter login + CRUD básico funcionando com isolamento de tenant; nenhuma rota com enum drift gravando no Postgres; suíte CI com type-check ativo (remover `ignoreBuildErrors`).

---

### Fase 1 — Núcleo Transacional

**Objetivo:** fazer o fluxo `catalog → inventory → order → financial` funcionar ponta a ponta com a saga de eventos Kafka real.

**Entregáveis:**
- **Catalog:** implementar módulos Categoria e Marca (hoje stubs — bloqueiam criar produto); API de variações/imagens; corrigir tópicos de evento para o marketplace.
- **Inventory:** corrigir consumer de pedidos (tópico `pedido.*` + envelope plano); adicionar `depositoId` à reserva; endpoints PUT/DELETE depósito; publicar `estoque.reservado`/`estoque.insuficiente`/`estoque.liberado` que o order consome.
- **Order:** adicionar auth+RBAC; idempotência + transactional outbox + DLQ no Kafka; webhook/estorno reais; cálculo monetário em Decimal; campos fiscais por item (NCM/CFOP/CST) para faturamento.
- **Financial:** corrigir cálculo do DRE (custos/despesas reais); transação atômica em transferência/pagamento; scheduler de recorrências; vincular cliente/fornecedor por ID; endpoints de relatório (resumo/fluxo-caixa/dre) no contrato esperado.
- **Saga de eventos:** padronizar envelope `{tenantId,tipo,dados}` e nomenclatura de tópicos entre todos os serviços; validação de schema via `@imestredigital/events`.

**Critério de pronto:** criar produto → estoque inicializado → criar pedido → reserva de estoque automática → confirmar → faturar → lançamento financeiro gerado, tudo via eventos, com isolamento de tenant e sem duplicação em reprocesso.

---

### Fase 2 — Fiscal em Produção *(trilha dedicada — ver plano `fiscal-compliance`)*

**Objetivo:** emitir NF-e/NFC-e juridicamente válidas. Esta é a fase de maior risco regulatório e esforço (XL em múltiplos itens); deve correr em **trilha paralela e independente**.

**Resumo dos bloqueadores** (detalhe completo no mapa `fiscal-deep`/`fiscal-compliance`):
- Assinatura digital XMLDSig real (RSA-SHA1/C14N) — hoje é comentário fake.
- Comunicação SOAP+mTLS com SEFAZ por UF (NFeAutorizacao4 etc.) — hoje 100% simulada, inclusive em produção.
- XML NF-e 4.00 válido (remover hardcodes SP/CNPJ/cDV, casing `NFe/infNFe`, grupo `<pag>`, Signature).
- NFC-e com `infNFeSupl` + QR Code (hash com CSC).
- Engine de impostos completo (ST, DIFAL, FCP, IPI, CSOSN do Simples).
- Criptografia de certificado+senha (hoje texto plano); validação A1 real.
- Numeração atômica; DANFE/cupom PDF; guarda de XML 5 anos; correção do bug de unidade monetária (÷100).

**Recomendação:** **não reimplementar do zero** — adotar biblioteca consolidada de DF-e para assinatura, SOAP/mTLS, QR Code e DANFE.

**Critério de pronto:** emitir, consultar, cancelar e gerar CCe de uma NF-e e uma NFC-e reais em **homologação SEFAZ**, com XML validado contra XSD e DANFE/cupom impressos.

---

### Fase 3 — CRM, Marketplace, IA e Notificações

**Objetivo:** completar os serviços de suporte ao negócio.

**Entregáveis:**
- **Customer:** corrigir consumer Kafka (mover para controller + `KafkaContext`); soft-delete real (LGPD); importação CSV/XLSX real; publicar eventos de cliente; endpoints de score/segmento.
- **Marketplace:** prefixo/versioning + alinhamento de rotas com o front; wiring do Kafka producer; adapters stateless (fim do vazamento cross-tenant); implementar chamadas HTTP reais às plataformas (XL); criptografar tokens; conversão pedido→order-service.
- **IA:** corrigir coluna `prioridade` e enums; criar endpoint de chat real (fim do mock `/v1/ia/chat`); injetar produtor Kafka; consumir dados reais (order/inventory/financial); rate-limit/billing por tenant.
- **Notification:** corrigir consumer (`@EventPattern` + controller); alinhar tópicos com produtores reais; implementar push (tabela + Firebase) e SMS; persistir email/push para auditoria.

**Critério de pronto:** evento de negócio (ex: pedido criado) gera notificação automática; CRM atualiza histórico de compra via Kafka; marketplace sincroniza um anúncio real.

---

### Fase 4 — Hardening de Produção

**Objetivo:** observabilidade, resiliência e segurança de nível produção.

**Entregáveis:**
- **Observabilidade:** `/metrics` nos serviços + Prometheus/Grafana funcional; shipper de logs (Loki/Fluentd) para ES/Kibana; tracing distribuído (OpenTelemetry).
- **Backups:** automatizados na stack, off-site (S3/MinIO), com PITR/WAL e teste de restore.
- **CI/CD:** incluir ai-service no build de staging; deploy de produção automatizado com smoke test e rollback; type-check/lint bloqueantes.
- **Segurança:** gestão de segredos (Vault/SOPS); MFA/2FA no auth; brute-force/rate-limit; tabela de auditoria; CSP no Nginx; revisão de RBAC em todos os serviços.
- **Performance:** padronizar `@db.Timestamptz`; índices `(tenantId, campo)`; Redpanda fora de `dev-container` com replicação/retenção; limites de CPU nos containers.
- **Resiliência:** healthchecks padronizados (Dockerfile×compose); circuit breaker de webhook com half-open; jobs de expiração (reservas, tokens).

**Critério de pronto:** dashboards de SLO ativos; restore de backup testado; deploy com rollback de 1 clique; pen-test básico sem findings críticos.

---

## 4. Top 15 Pendências Priorizadas

| # | Severidade | Item | Módulo | Esforço |
|---|---|---|---|---|
| 1 | Crítica | `JWT_SECRET` não compartilhado — 100% dos tokens rejeitados em prod | infra | S |
| 2 | Crítica | Enum drift `OrigemCliente`/`StatusProduto`/`StatusPedido`/etc. (bug raiz sistêmico) | catalog/customer/order/inventory/financial/ai | M |
| 3 | Crítica | Case mismatch UPPERCASE×lowercase quebra RBAC com backend real | auth | S |
| 4 | Crítica | `TenantMiddleware` nunca registrado → `tenantId` undefined em tudo | financial/marketplace/ai/notification | M |
| 5 | Crítica | `JwtStrategy` ausente → toda rota protegida quebra em runtime | notification | S |
| 6 | Crítica | Sem autenticação/guard nem RBAC; `tenantId` undefined não barrado | order | M |
| 7 | Crítica | Marketplace sem prefixo/versioning → rewrite dá 404 total em prod | marketplace/frontend | M |
| 8 | Crítica | Módulos Categoria e Marca vazios bloqueiam criação de produto | catalog | L |
| 9 | Crítica | Adapters singleton vazam `accessToken` entre tenants | marketplace | M |
| 10 | Crítica | Assinatura digital + comunicação SEFAZ são stubs (não emite NF) | fiscal | XL |
| 11 | Alta | Consumer Kafka de pedidos nunca dispara (tópico+envelope errados) | inventory | M |
| 12 | Alta | Writes cross-tenant (`update where:{id}` sem tenantId — IDOR) | financial/customer/marketplace/notification | M |
| 13 | Alta | Consumer Kafka inerte (provider+RMQ em transporte Kafka) | customer/notification | M |
| 14 | Alta | DRE calcula valores incorretos (custos/despesas hardcoded = 0) | financial | L |
| 15 | Alta | Coluna `prioridade` inexistente + produtor Kafka órfão | ai | S |

---

## 5. Riscos e Dependências Críticas

**Dependências de sequenciamento:**
- **Fase 0 bloqueia tudo.** Sem unificação de enums, `JWT_SECRET` e multi-tenancy, qualquer serviço real falha ao sair do mock. Nenhuma feature nova antes disso.
- **Catalog (Categoria/Marca) bloqueia Order/Inventory** — não há como cadastrar produto sem categoria, logo o núcleo transacional da Fase 1 depende do item #8.
- **Saga de eventos depende de padronização de envelope/tópicos** — order↔inventory↔financial↔notification só fecham quando nomenclatura e formato de payload forem unificados (hoje cada serviço usa um padrão).

**Riscos transversais:**
- **Regressão silenciosa mock→prod:** como o front usa mock em dev, divergências de contrato/enum só aparecem em produção. Mitigação: ambiente de staging que force os rewrites reais + type-check bloqueante no CI.
- **Fiscal como risco regulatório isolado (Fase 2):** maior esforço (múltiplos XL) e maior risco jurídico; corre em trilha paralela e **não deve bloquear** o restante. Decisão estratégica: adotar lib de DF-e consolidada vs reimplementar.
- **Multi-tenancy é risco de vazamento de dados, não só de funcionalidade:** ai-service sem filtro de tenant, `ClienteSegmento` sem `tenantId`, IDOR em writes — exposição cross-tenant é incidente de segurança/LGPD, não bug cosmético.
- **SPOF de infraestrutura:** VPS única, sem replicação de Postgres, Redpanda single-node em `dev-container`, backup só local. Perda de dados em falha de hardware é total até a Fase 4.
- **Cross-service por ID sem validação:** `pedido.clienteId`, `nota.pedidoId` etc. não são verificados; agravado pelo mismatch de tipo `clientes.id` (TEXT/cuid) × `pedidos.cliente_id` (UUID) — joins por convenção podem nunca casar.
- **Segredos em texto plano** (`.env.production`, senha de certificado, tokens de marketplace): comprometimento da VPS expõe tudo. Gestão de segredos (Fase 4) deveria ser antecipada se houver dados reais de cliente.