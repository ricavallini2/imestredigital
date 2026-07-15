# Modelo de Parceiro de Negócio (cadastro unificado cliente + fornecedor)

> Decisão (30/06/2026): cadastro **unificado** de parceiros, diferenciado por **papéis**,
> com **telas separadas** (Clientes no CRM, Fornecedores em Compras) lendo a mesma base.
> Padrão SAP Business Partner / Odoo `res.partner` / TOTVS.
>
> Implementação v1: por baixo risco, o **modelo Prisma continua chamado `Cliente`**
> em `customer-service` (evita renomear ~15 arquivos e migrar dados agora). A unificação
> é obtida pelo campo `papeis[]`. Renomear o modelo para `Parceiro` fica para uma migração
> posterior dedicada.

## Contrato canônico (fonte da verdade)

Toda camada (schema Prisma, DTOs, service, mocks, frontend, `packages/types`) DEVE usar
exatamente estes nomes/valores. Divergência aqui é a causa do enum drift recorrente.

### Enums

```
Papel              = CLIENTE | FORNECEDOR | TRANSPORTADORA
TipoCliente        = PESSOA_FISICA | PESSOA_JURIDICA            (já existe)
RegimeTributario   = SIMPLES_NACIONAL | MEI | LUCRO_PRESUMIDO | LUCRO_REAL | ISENTO
OrigemCliente      = MANUAL | MARKETPLACE | SITE | INDICACAO | IMPORTACAO
                     | WEBSITE | INSTAGRAM | FACEBOOK | WHATSAPP | VENDA_DIRETA
                     | FEIRA | TELEFONE | EMAIL | OUTRO         (alinhado ao banco)
StatusCliente      = PROSPECT | ATIVO | INATIVO | BLOQUEADO     (já existe)
```

### Campos do Parceiro (modelo `Cliente`)

| Campo | Tipo | Aplica a | Observação |
|---|---|---|---|
| `papeis` | `Papel[]` | todos | default `[CLIENTE]`; define se é cliente/fornecedor |
| `tipo` | `TipoCliente` | todos | PF ou PJ |
| `nome` | `String` | todos | nome (PF) ou nome fantasia/identificação (PJ) |
| `nomeFantasia` | `String?` | PJ | |
| `razaoSocial` | `String?` | PJ | |
| `cpf` | `String?` | PF | 11 dígitos, sem máscara |
| `cnpj` | `String?` | PJ | 14 dígitos, sem máscara |
| `rg` | `String?` | PF | novo |
| `inscricaoEstadual` | `String?` | PJ | vazio quando isento |
| `ieIsento` | `Boolean` | PJ | novo, default false (IE = ISENTO) |
| `inscricaoMunicipal` | `String?` | PJ | novo |
| `regimeTributario` | `RegimeTributario?` | PJ | novo |
| `dataNascimento` | `DateTime?` | PF | |
| `genero` | `String?` | PF | |
| `email` / `emailSecundario` | `String` / `String?` | todos | |
| `telefone` / `celular` | `String?` | todos | |
| `observacoes` | `String?` | todos | |
| `tags` | `String[]` | todos | |
| `score` | `Int` | cliente | |
| `status` | `StatusCliente` | todos | |
| `origem` | `OrigemCliente` | todos | |
| `ultimaCompra` / `totalCompras` / `valorTotalCompras` | — | cliente | histórico de venda |
| **Grupo cliente** | | | |
| `limiteCredito` | `Decimal?` | cliente | novo |
| `vendedorId` | `String?` | cliente | novo (responsável) |
| **Grupo fornecedor** | | | |
| `prazoPagamento` | `Int?` | fornecedor | novo (dias) |
| `condicoesPagamento` | `String?` | fornecedor | novo (ex: 30/60/90) |
| `pixChave` | `String?` | fornecedor | novo (pagamento) |
| `categoriasFornecidas` | `String[]` | fornecedor | novo |
| `avaliacaoFornecedor` | `Int?` | fornecedor | novo (1–5) |
| `ultimaCompraFornecedor` / `totalComprasFornecedor` / `valorTotalComprasFornecedor` | — | fornecedor | histórico de compra (a/p) |

### Regras de validação por tipo
- **PF**: `cpf` obrigatório e válido; `cnpj`/`razaoSocial`/`ie` não se aplicam.
- **PJ**: `cnpj` obrigatório e válido; `razaoSocial` obrigatório; `inscricaoEstadual`
  obrigatório **a menos que** `ieIsento = true`.
- `papeis` não pode ser vazio; default `[CLIENTE]`.

### Telas
- **Clientes (CRM)** → `useClientes({ papel: 'CLIENTE' })` → lista/forma parceiros com papel `CLIENTE`. Campos do grupo cliente.
- **Fornecedores (Compras)** → `useFornecedores` → `GET /v1/clientes?papel=FORNECEDOR` → lista/forma parceiros com papel `FORNECEDOR`. Campos do grupo fornecedor. Mapeamento Parceiro↔Fornecedor em `apps/web/src/hooks/useCompras.ts` (`parceiroParaFornecedor` / `fornecedorParaParceiro`).
- Um parceiro pode ter ambos os papéis e aparecer nas duas telas (sem duplicar cadastro/CNPJ).

### Status da implementação (30/06/2026)
- ✅ Backend `customer-service` (schema/DTOs/service) com `papeis`, campos fiscais e filtros `papel`/`tipo`.
- ✅ Frontend: form Novo/Editar "Parceiro" (PF/PJ + papéis + grupo fornecedor), detalhe, tipos, mocks.
- ✅ **Cadastro (tela) de Fornecedores (Compras) unificado** sobre `/v1/clientes?papel=FORNECEDOR` — não há mais cadastro paralelo. Os hooks de `useCompras` (`useFornecedores`/`useFornecedor`/`useCriarFornecedor`) leem/gravam via `/v1/clientes?papel=FORNECEDOR`, mapeando Parceiro↔Fornecedor (`parceiroParaFornecedor`/`fornecedorParaParceiro` em `apps/web/src/hooks/useCompras.ts`).
- ⚠️ **As rotas mock `/v1/fornecedores` e o `FORNECEDORES_MOCK` NÃO estão órfãos** — permanecem como *store de apoio* do subsistema mock de **Compras**. Os pedidos de compra (`apps/web/src/app/api/v1/compras/_mock-data.ts`) referenciam fornecedores por `fornecedorId` no formato `f-*`, e o dataset é consumido por `compras/estatisticas` (ativos + Top Fornecedores), `compras/[id]/receber` (resolve o fornecedor do pedido), `compras/importar-nfe` (localiza/cria fornecedor a partir da NF-e) e `ia/chat` (contexto do módulo de Compras). Não podem ser simplesmente removidos.
- ✅ Papel `TRANSPORTADORA` disponível no seletor de papéis dos forms Novo/Editar.
- ✅ Histórico de compras do fornecedor (`valorTotalComprasFornecedor`/`totalComprasFornecedor`/`ultimaCompraFornecedor`) populado nos fornecedores mock e exibido na página de detalhe.
- ✅ Card de fornecedor: "Editar" → edição unificada do parceiro; "Ver Compras" → lista de compras filtrada por `fornecedorId` (retorna vazio hoje pelo descasamento de ids `f-*` vs parceiro — ver follow-up).
- ⏳ Pendência menor: validação PJ (razão social/CNPJ obrigatórios) existe só no front (não na API mock).

### Follow-up: unificação completa do subsistema de Compras
O **cadastro** de fornecedor já está unificado sobre parceiros, mas o **subsistema de Compras** (pedidos de compra, estatísticas, importação de NF-e e contexto da IA) ainda usa o `FORNECEDORES_MOCK` como backing store, com pedidos referenciando ids `f-*`. Unificar por completo significa repointar os pedidos de compra e as rotas de Compras para referenciarem **parceiros** (papel `FORNECEDOR`) em vez de `f-*`, migrando estatísticas/importação/IA para o store de `/v1/clientes`. É uma tarefa **maior** (migração de dados + reescrita das rotas de Compras), rastreada como follow-up — não é um simples "remover o mock".
