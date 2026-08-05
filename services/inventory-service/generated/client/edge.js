
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.DepositoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  nome: 'nome',
  endereco: 'endereco',
  cidade: 'cidade',
  estado: 'estado',
  padrao: 'padrao',
  ativo: 'ativo',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.SaldoEstoqueScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  produtoId: 'produtoId',
  depositoId: 'depositoId',
  quantidadeFisica: 'quantidadeFisica',
  reservado: 'reservado',
  estoqueMinimo: 'estoqueMinimo',
  lote: 'lote',
  numeroSerie: 'numeroSerie',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ReservaEstoqueScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  produtoId: 'produtoId',
  depositoId: 'depositoId',
  pedidoId: 'pedidoId',
  quantidade: 'quantidade',
  status: 'status',
  criadoEm: 'criadoEm'
};

exports.Prisma.EventoProcessadoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  evento: 'evento',
  referenciaId: 'referenciaId',
  processadoEm: 'processadoEm'
};

exports.Prisma.MovimentacaoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  produtoId: 'produtoId',
  depositoId: 'depositoId',
  tipo: 'tipo',
  motivo: 'motivo',
  quantidade: 'quantidade',
  custoUnitario: 'custoUnitario',
  observacao: 'observacao',
  usuarioId: 'usuarioId',
  criadoEm: 'criadoEm'
};

exports.Prisma.PedidoCompraScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  numero: 'numero',
  fornecedorId: 'fornecedorId',
  fornecedorNome: 'fornecedorNome',
  status: 'status',
  valorProdutos: 'valorProdutos',
  valorFrete: 'valorFrete',
  valorImpostos: 'valorImpostos',
  valorTotal: 'valorTotal',
  dataEmissao: 'dataEmissao',
  dataPrevistaEntrega: 'dataPrevistaEntrega',
  dataRecebimento: 'dataRecebimento',
  nfeNumero: 'nfeNumero',
  nfeSerie: 'nfeSerie',
  nfeChave: 'nfeChave',
  condicaoPagamento: 'condicaoPagamento',
  formaPagamento: 'formaPagamento',
  observacoes: 'observacoes',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ItemPedidoCompraScalarFieldEnum = {
  id: 'id',
  pedidoCompraId: 'pedidoCompraId',
  produtoId: 'produtoId',
  produtoNome: 'produtoNome',
  sku: 'sku',
  ncm: 'ncm',
  cfop: 'cfop',
  unidade: 'unidade',
  quantidade: 'quantidade',
  quantidadeRecebida: 'quantidadeRecebida',
  valorUnitario: 'valorUnitario',
  valorTotal: 'valorTotal',
  valorIcms: 'valorIcms',
  valorIpi: 'valorIpi',
  valorPis: 'valorPis',
  valorCofins: 'valorCofins',
  criadoEm: 'criadoEm'
};

exports.Prisma.VinculoProdutoFornecedorScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  fornecedorCnpj: 'fornecedorCnpj',
  codigoFornecedor: 'codigoFornecedor',
  produtoId: 'produtoId',
  produtoSku: 'produtoSku',
  produtoNome: 'produtoNome',
  descricaoNfe: 'descricaoNfe',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.StatusReserva = exports.$Enums.StatusReserva = {
  ATIVA: 'ATIVA',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
  EXPIRADA: 'EXPIRADA'
};

exports.TipoMovimentacao = exports.$Enums.TipoMovimentacao = {
  ENTRADA: 'ENTRADA',
  SAIDA: 'SAIDA',
  AJUSTE: 'AJUSTE',
  TRANSFERENCIA: 'TRANSFERENCIA',
  DEVOLUCAO: 'DEVOLUCAO',
  RESERVA: 'RESERVA'
};

exports.MotivoMovimentacao = exports.$Enums.MotivoMovimentacao = {
  COMPRA: 'COMPRA',
  VENDA: 'VENDA',
  AJUSTE_INVENTARIO: 'AJUSTE_INVENTARIO',
  TRANSFERENCIA_DEPOSITO: 'TRANSFERENCIA_DEPOSITO',
  DEVOLUCAO_CLIENTE: 'DEVOLUCAO_CLIENTE',
  DEVOLUCAO_FORNECEDOR: 'DEVOLUCAO_FORNECEDOR',
  DEVOLUCAO: 'DEVOLUCAO',
  PERDA: 'PERDA',
  AVARIA: 'AVARIA',
  CONSUMO: 'CONSUMO',
  PRODUCAO: 'PRODUCAO',
  OUTRO: 'OUTRO'
};

exports.StatusCompra = exports.$Enums.StatusCompra = {
  RASCUNHO: 'RASCUNHO',
  ENVIADO: 'ENVIADO',
  AGUARDANDO_RECEBIMENTO: 'AGUARDANDO_RECEBIMENTO',
  RECEBIDO_PARCIAL: 'RECEBIDO_PARCIAL',
  RECEBIDO: 'RECEBIDO',
  CANCELADO: 'CANCELADO'
};

exports.Prisma.ModelName = {
  Deposito: 'Deposito',
  SaldoEstoque: 'SaldoEstoque',
  ReservaEstoque: 'ReservaEstoque',
  EventoProcessado: 'EventoProcessado',
  Movimentacao: 'Movimentacao',
  PedidoCompra: 'PedidoCompra',
  ItemPedidoCompra: 'ItemPedidoCompra',
  VinculoProdutoFornecedor: 'VinculoProdutoFornecedor'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\inventory-service\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\inventory-service\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// ═══════════════════════════════════════════════════════════════\n// iMestreDigital - Schema do Inventory Service\n// ═══════════════════════════════════════════════════════════════\n// Gerencia estoque multi-depósito, reservas e movimentações.\n// ═══════════════════════════════════════════════════════════════\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ─── Enumerações ──────────────────────────────────────────────\n\nenum TipoMovimentacao {\n  ENTRADA\n  SAIDA\n  AJUSTE\n  TRANSFERENCIA\n  DEVOLUCAO\n  RESERVA\n}\n\nenum MotivoMovimentacao {\n  COMPRA\n  VENDA\n  AJUSTE_INVENTARIO\n  TRANSFERENCIA_DEPOSITO\n  DEVOLUCAO_CLIENTE\n  DEVOLUCAO_FORNECEDOR\n  DEVOLUCAO\n  PERDA\n  AVARIA\n  CONSUMO\n  PRODUCAO\n  OUTRO\n}\n\nenum StatusReserva {\n  ATIVA\n  CONFIRMADA\n  CANCELADA\n  EXPIRADA\n}\n\n/// Depósito / armazém / centro de distribuição\nmodel Deposito {\n  id       String  @id @default(uuid()) @db.Uuid\n  tenantId String  @map(\"tenant_id\") @db.Uuid\n  nome     String\n  endereco String?\n  cidade   String?\n  estado   String?\n  padrao   Boolean @default(false) // Depósito padrão do tenant\n  ativo    Boolean @default(true)\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  saldos        SaldoEstoque[]\n  movimentacoes Movimentacao[]\n\n  @@index([tenantId])\n  @@map(\"depositos\")\n}\n\n/// Saldo de estoque de um produto em um depósito específico\nmodel SaldoEstoque {\n  id         String   @id @default(uuid()) @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  produtoId  String   @map(\"produto_id\") @db.Uuid\n  depositoId String   @map(\"deposito_id\") @db.Uuid\n  deposito   Deposito @relation(fields: [depositoId], references: [id])\n\n  quantidadeFisica Int @default(0) @map(\"quantidade_fisica\") // Quantidade real no depósito\n  reservado        Int @default(0) // Quantidade reservada para pedidos\n  estoqueMinimo    Int @default(0) @map(\"estoque_minimo\") // Ponto de pedido\n\n  lote        String? // Número do lote\n  numeroSerie String? @map(\"numero_serie\") // Número de série\n\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Disponível = quantidadeFisica - reservado (calculado no service)\n\n  @@unique([tenantId, produtoId, depositoId], name: \"tenantId_produtoId_depositoId\")\n  @@index([tenantId])\n  @@index([tenantId, produtoId])\n  @@map(\"saldos_estoque\")\n}\n\n/// Reserva de estoque para um pedido (impede venda duplicada)\nmodel ReservaEstoque {\n  id         String        @id @default(uuid()) @db.Uuid\n  tenantId   String        @map(\"tenant_id\") @db.Uuid\n  produtoId  String        @map(\"produto_id\") @db.Uuid\n  /// Depósito de onde o estoque foi reservado. Nulo apenas em reservas\n  /// legadas criadas antes da reserva passar a ser por depósito.\n  depositoId String?       @map(\"deposito_id\") @db.Uuid\n  pedidoId   String        @map(\"pedido_id\") @db.Uuid\n  quantidade Int\n  status     StatusReserva @default(ATIVA)\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([tenantId, pedidoId])\n  @@index([tenantId, produtoId])\n  @@map(\"reservas_estoque\")\n}\n\n/// Registro de eventos já processados (idempotência do consumo Kafka).\n/// Garante que o mesmo evento (ex. pedido.pago para um pedidoId) só produza\n/// efeito colateral uma única vez, mesmo com reentrega do broker.\nmodel EventoProcessado {\n  id           String @id @default(uuid()) @db.Uuid\n  tenantId     String @map(\"tenant_id\") @db.Uuid\n  /// Nome lógico do evento consumido (ex. \"pedido.criado\", \"pedido.pago\").\n  evento       String\n  /// Identificador do agregado de referência (ex. pedidoId).\n  referenciaId String @map(\"referencia_id\")\n\n  processadoEm DateTime @default(now()) @map(\"processado_em\")\n\n  @@unique([evento, referenciaId], name: \"evento_referenciaId\")\n  @@index([tenantId])\n  @@map(\"eventos_processados\")\n}\n\n/// Movimentação (histórico de entrada/saída/ajuste/transferência)\nmodel Movimentacao {\n  id         String   @id @default(uuid()) @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  produtoId  String   @map(\"produto_id\") @db.Uuid\n  depositoId String   @map(\"deposito_id\") @db.Uuid\n  deposito   Deposito @relation(fields: [depositoId], references: [id])\n\n  tipo          TipoMovimentacao\n  motivo        MotivoMovimentacao\n  quantidade    Int // Positivo = entrada, Negativo = saída\n  custoUnitario Decimal?           @map(\"custo_unitario\") @db.Decimal(19, 2)\n  observacao    String?\n  usuarioId     String?            @map(\"usuario_id\") @db.Uuid // Autor da movimentação (auditoria); nulo em movimentações originadas por evento\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([tenantId])\n  @@index([tenantId, produtoId])\n  @@index([depositoId])\n  @@index([criadoEm])\n  @@index([tipo])\n  @@map(\"movimentacoes\")\n}\n\n// ─── Compras (suprimento) ─────────────────────────────────────\n\n/// O pedido de compra vive no inventory porque o efeito físico do\n/// RECEBIMENTO é a entrada no estoque: receber e movimentar acontecem\n/// no mesmo banco (mesma razão do caixa morar junto do pagamento no\n/// order-service). Fornecedor é referência por id+nome (mora no\n/// customer-service; sem FK cross-service, padrão do projeto).\nenum StatusCompra {\n  RASCUNHO\n  ENVIADO\n  AGUARDANDO_RECEBIMENTO\n  RECEBIDO_PARCIAL\n  RECEBIDO\n  CANCELADO\n}\n\nmodel PedidoCompra {\n  id       String @id @default(uuid()) @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  /// Sequencial por tenant, formatado na exibição (ex: \"000012\").\n  numero         Int\n  fornecedorId   String? @map(\"fornecedor_id\") @db.Uuid\n  fornecedorNome String  @map(\"fornecedor_nome\")\n\n  status StatusCompra @default(RASCUNHO)\n\n  // Totais (dinheiro SEMPRE Decimal)\n  valorProdutos Decimal @default(0) @map(\"valor_produtos\") @db.Decimal(12, 2)\n  valorFrete    Decimal @default(0) @map(\"valor_frete\") @db.Decimal(12, 2)\n  valorImpostos Decimal @default(0) @map(\"valor_impostos\") @db.Decimal(12, 2)\n  valorTotal    Decimal @default(0) @map(\"valor_total\") @db.Decimal(12, 2)\n\n  dataEmissao         DateTime  @default(now()) @map(\"data_emissao\")\n  dataPrevistaEntrega DateTime? @map(\"data_prevista_entrega\")\n  dataRecebimento     DateTime? @map(\"data_recebimento\")\n\n  // NF-e de origem (importação): chave única por tenant deduplica reimportação.\n  nfeNumero String? @map(\"nfe_numero\")\n  nfeSerie  String? @map(\"nfe_serie\")\n  nfeChave  String? @map(\"nfe_chave\")\n\n  condicaoPagamento String? @map(\"condicao_pagamento\")\n  formaPagamento    String? @map(\"forma_pagamento\")\n  observacoes       String? @db.Text\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  itens ItemPedidoCompra[]\n\n  @@unique([tenantId, numero])\n  @@unique([tenantId, nfeChave])\n  @@index([tenantId])\n  @@index([tenantId, status])\n  @@index([tenantId, fornecedorId])\n  @@map(\"pedidos_compra\")\n}\n\nmodel ItemPedidoCompra {\n  id             String       @id @default(uuid()) @db.Uuid\n  pedidoCompraId String       @map(\"pedido_compra_id\") @db.Uuid\n  pedidoCompra   PedidoCompra @relation(fields: [pedidoCompraId], references: [id], onDelete: Cascade)\n\n  /// Nulo quando o item veio de NF-e e o produto ainda não existe no\n  /// catálogo (v1 não cria produto automaticamente; casa por SKU quando dá).\n  produtoId   String? @map(\"produto_id\") @db.Uuid\n  produtoNome String  @map(\"produto_nome\")\n  sku         String\n  ncm         String?\n  cfop        String?\n  unidade     String  @default(\"UN\")\n\n  quantidade         Decimal @db.Decimal(12, 3)\n  quantidadeRecebida Decimal @default(0) @map(\"quantidade_recebida\") @db.Decimal(12, 3)\n\n  valorUnitario Decimal @map(\"valor_unitario\") @db.Decimal(12, 4)\n  valorTotal    Decimal @map(\"valor_total\") @db.Decimal(12, 2)\n  valorIcms     Decimal @default(0) @map(\"valor_icms\") @db.Decimal(12, 2)\n  valorIpi      Decimal @default(0) @map(\"valor_ipi\") @db.Decimal(12, 2)\n  valorPis      Decimal @default(0) @map(\"valor_pis\") @db.Decimal(12, 2)\n  valorCofins   Decimal @default(0) @map(\"valor_cofins\") @db.Decimal(12, 2)\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([pedidoCompraId])\n  @@index([produtoId])\n  @@map(\"itens_pedidos_compra\")\n}\n\n/// De-Para entre o código do produto NO FORNECEDOR (cProd da NF-e) e o produto\n/// do nosso catálogo. Gravado quando o usuário resolve um item na conferência da\n/// importação; nas próximas notas do mesmo CNPJ o item já entra reconhecido.\nmodel VinculoProdutoFornecedor {\n  id               String   @id @default(uuid()) @db.Uuid\n  tenantId         String   @map(\"tenant_id\") @db.Uuid\n  /// CNPJ do fornecedor NORMALIZADO (só dígitos) — a NF-e varia a formatação.\n  fornecedorCnpj   String   @map(\"fornecedor_cnpj\")\n  /// cProd exatamente como veio na nota.\n  codigoFornecedor String   @map(\"codigo_fornecedor\")\n  produtoId        String   @map(\"produto_id\") @db.Uuid\n  /// Desnormalizados só para exibir o vínculo sem ir ao catálogo.\n  produtoSku       String?  @map(\"produto_sku\")\n  produtoNome      String?  @map(\"produto_nome\")\n  /// Descrição como veio na nota (ajuda a auditar o vínculo depois).\n  descricaoNfe     String?  @map(\"descricao_nfe\")\n  criadoEm         DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm     DateTime @updatedAt @map(\"atualizado_em\")\n\n  @@unique([tenantId, fornecedorCnpj, codigoFornecedor])\n  @@index([tenantId])\n  @@index([tenantId, produtoId])\n  @@map(\"vinculos_produto_fornecedor\")\n}\n",
  "inlineSchemaHash": "081c6604c5ecf3cabb809614fb5e355511852b7fbcfc7d4669c4a1391010c0ae",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Deposito\":{\"dbName\":\"depositos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endereco\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"padrao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"saldos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaldoEstoque\",\"relationName\":\"DepositoToSaldoEstoque\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"movimentacoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Movimentacao\",\"relationName\":\"DepositoToMovimentacao\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Depósito / armazém / centro de distribuição\"},\"SaldoEstoque\":{\"dbName\":\"saldos_estoque\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deposito\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deposito\",\"relationName\":\"DepositoToSaldoEstoque\",\"relationFromFields\":[\"depositoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidadeFisica\",\"dbName\":\"quantidade_fisica\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reservado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estoqueMinimo\",\"dbName\":\"estoque_minimo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numeroSerie\",\"dbName\":\"numero_serie\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"produtoId\",\"depositoId\"]],\"uniqueIndexes\":[{\"name\":\"tenantId_produtoId_depositoId\",\"fields\":[\"tenantId\",\"produtoId\",\"depositoId\"]}],\"isGenerated\":false,\"documentation\":\"Saldo de estoque de um produto em um depósito específico\"},\"ReservaEstoque\":{\"dbName\":\"reservas_estoque\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Depósito de onde o estoque foi reservado. Nulo apenas em reservas\\\\nlegadas criadas antes da reserva passar a ser por depósito.\"},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusReserva\",\"default\":\"ATIVA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Reserva de estoque para um pedido (impede venda duplicada)\"},\"EventoProcessado\":{\"dbName\":\"eventos_processados\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Nome lógico do evento consumido (ex. \\\"pedido.criado\\\", \\\"pedido.pago\\\").\"},{\"name\":\"referenciaId\",\"dbName\":\"referencia_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Identificador do agregado de referência (ex. pedidoId).\"},{\"name\":\"processadoEm\",\"dbName\":\"processado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"evento\",\"referenciaId\"]],\"uniqueIndexes\":[{\"name\":\"evento_referenciaId\",\"fields\":[\"evento\",\"referenciaId\"]}],\"isGenerated\":false,\"documentation\":\"Registro de eventos já processados (idempotência do consumo Kafka).\\\\nGarante que o mesmo evento (ex. pedido.pago para um pedidoId) só produza\\\\nefeito colateral uma única vez, mesmo com reentrega do broker.\"},\"Movimentacao\":{\"dbName\":\"movimentacoes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deposito\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deposito\",\"relationName\":\"DepositoToMovimentacao\",\"relationFromFields\":[\"depositoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoMovimentacao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MotivoMovimentacao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"custoUnitario\",\"dbName\":\"custo_unitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Movimentação (histórico de entrada/saída/ajuste/transferência)\"},\"PedidoCompra\":{\"dbName\":\"pedidos_compra\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Sequencial por tenant, formatado na exibição (ex: \\\"000012\\\").\"},{\"name\":\"fornecedorId\",\"dbName\":\"fornecedor_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fornecedorNome\",\"dbName\":\"fornecedor_nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusCompra\",\"default\":\"RASCUNHO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorProdutos\",\"dbName\":\"valor_produtos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorFrete\",\"dbName\":\"valor_frete\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorImpostos\",\"dbName\":\"valor_impostos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorTotal\",\"dbName\":\"valor_total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataEmissao\",\"dbName\":\"data_emissao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataPrevistaEntrega\",\"dbName\":\"data_prevista_entrega\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataRecebimento\",\"dbName\":\"data_recebimento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nfeNumero\",\"dbName\":\"nfe_numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nfeSerie\",\"dbName\":\"nfe_serie\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nfeChave\",\"dbName\":\"nfe_chave\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condicaoPagamento\",\"dbName\":\"condicao_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"formaPagamento\",\"dbName\":\"forma_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"itens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemPedidoCompra\",\"relationName\":\"ItemPedidoCompraToPedidoCompra\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"numero\"],[\"tenantId\",\"nfeChave\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"numero\"]},{\"name\":null,\"fields\":[\"tenantId\",\"nfeChave\"]}],\"isGenerated\":false},\"ItemPedidoCompra\":{\"dbName\":\"itens_pedidos_compra\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoCompraId\",\"dbName\":\"pedido_compra_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoCompra\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PedidoCompra\",\"relationName\":\"ItemPedidoCompraToPedidoCompra\",\"relationFromFields\":[\"pedidoCompraId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Nulo quando o item veio de NF-e e o produto ainda não existe no\\\\ncatálogo (v1 não cria produto automaticamente; casa por SKU quando dá).\"},{\"name\":\"produtoNome\",\"dbName\":\"produto_nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sku\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ncm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cfop\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"UN\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidadeRecebida\",\"dbName\":\"quantidade_recebida\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorUnitario\",\"dbName\":\"valor_unitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorTotal\",\"dbName\":\"valor_total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorIcms\",\"dbName\":\"valor_icms\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorIpi\",\"dbName\":\"valor_ipi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorPis\",\"dbName\":\"valor_pis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorCofins\",\"dbName\":\"valor_cofins\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"VinculoProdutoFornecedor\":{\"dbName\":\"vinculos_produto_fornecedor\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fornecedorCnpj\",\"dbName\":\"fornecedor_cnpj\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"CNPJ do fornecedor NORMALIZADO (só dígitos) — a NF-e varia a formatação.\"},{\"name\":\"codigoFornecedor\",\"dbName\":\"codigo_fornecedor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"cProd exatamente como veio na nota.\"},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoSku\",\"dbName\":\"produto_sku\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Desnormalizados só para exibir o vínculo sem ir ao catálogo.\"},{\"name\":\"produtoNome\",\"dbName\":\"produto_nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricaoNfe\",\"dbName\":\"descricao_nfe\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Descrição como veio na nota (ajuda a auditar o vínculo depois).\"},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"fornecedorCnpj\",\"codigoFornecedor\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"fornecedorCnpj\",\"codigoFornecedor\"]}],\"isGenerated\":false,\"documentation\":\"De-Para entre o código do produto NO FORNECEDOR (cProd da NF-e) e o produto\\\\ndo nosso catálogo. Gravado quando o usuário resolve um item na conferência da\\\\nimportação; nas próximas notas do mesmo CNPJ o item já entra reconhecido.\"}},\"enums\":{\"TipoMovimentacao\":{\"values\":[{\"name\":\"ENTRADA\",\"dbName\":null},{\"name\":\"SAIDA\",\"dbName\":null},{\"name\":\"AJUSTE\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null},{\"name\":\"RESERVA\",\"dbName\":null}],\"dbName\":null},\"MotivoMovimentacao\":{\"values\":[{\"name\":\"COMPRA\",\"dbName\":null},{\"name\":\"VENDA\",\"dbName\":null},{\"name\":\"AJUSTE_INVENTARIO\",\"dbName\":null},{\"name\":\"TRANSFERENCIA_DEPOSITO\",\"dbName\":null},{\"name\":\"DEVOLUCAO_CLIENTE\",\"dbName\":null},{\"name\":\"DEVOLUCAO_FORNECEDOR\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null},{\"name\":\"PERDA\",\"dbName\":null},{\"name\":\"AVARIA\",\"dbName\":null},{\"name\":\"CONSUMO\",\"dbName\":null},{\"name\":\"PRODUCAO\",\"dbName\":null},{\"name\":\"OUTRO\",\"dbName\":null}],\"dbName\":null},\"StatusReserva\":{\"values\":[{\"name\":\"ATIVA\",\"dbName\":null},{\"name\":\"CONFIRMADA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null},{\"name\":\"EXPIRADA\",\"dbName\":null}],\"dbName\":null},\"StatusCompra\":{\"values\":[{\"name\":\"RASCUNHO\",\"dbName\":null},{\"name\":\"ENVIADO\",\"dbName\":null},{\"name\":\"AGUARDANDO_RECEBIMENTO\",\"dbName\":null},{\"name\":\"RECEBIDO_PARCIAL\",\"dbName\":null},{\"name\":\"RECEBIDO\",\"dbName\":null},{\"name\":\"CANCELADO\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"O pedido de compra vive no inventory porque o efeito físico do\\\\nRECEBIMENTO é a entrada no estoque: receber e movimentar acontecem\\\\nno mesmo banco (mesma razão do caixa morar junto do pagamento no\\\\norder-service). Fornecedor é referência por id+nome (mora no\\\\ncustomer-service; sem FK cross-service, padrão do projeto).\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

