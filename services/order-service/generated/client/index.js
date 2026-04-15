
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
} = require('./runtime/library.js')


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




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.PedidoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  numero: 'numero',
  clienteId: 'clienteId',
  clienteNome: 'clienteNome',
  clienteEmail: 'clienteEmail',
  clienteCpfCnpj: 'clienteCpfCnpj',
  origem: 'origem',
  canalOrigem: 'canalOrigem',
  pedidoExternoId: 'pedidoExternoId',
  status: 'status',
  statusPagamento: 'statusPagamento',
  metodoPagamento: 'metodoPagamento',
  parcelas: 'parcelas',
  valorProdutos: 'valorProdutos',
  valorDesconto: 'valorDesconto',
  valorFrete: 'valorFrete',
  valorTotal: 'valorTotal',
  observacao: 'observacao',
  enderecoEntrega: 'enderecoEntrega',
  rastreamento: 'rastreamento',
  codigoRastreio: 'codigoRastreio',
  transportadora: 'transportadora',
  prazoEntrega: 'prazoEntrega',
  dataAprovacao: 'dataAprovacao',
  dataSeparacao: 'dataSeparacao',
  dataFaturamento: 'dataFaturamento',
  dataEnvio: 'dataEnvio',
  dataEntrega: 'dataEntrega',
  dataCancelamento: 'dataCancelamento',
  motivoCancelamento: 'motivoCancelamento',
  notaFiscalId: 'notaFiscalId',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ItemPedidoScalarFieldEnum = {
  id: 'id',
  pedidoId: 'pedidoId',
  produtoId: 'produtoId',
  variacaoId: 'variacaoId',
  sku: 'sku',
  titulo: 'titulo',
  quantidade: 'quantidade',
  valorUnitario: 'valorUnitario',
  valorDesconto: 'valorDesconto',
  valorTotal: 'valorTotal',
  peso: 'peso',
  largura: 'largura',
  altura: 'altura',
  comprimento: 'comprimento',
  criadoEm: 'criadoEm'
};

exports.Prisma.HistoricoPedidoScalarFieldEnum = {
  id: 'id',
  pedidoId: 'pedidoId',
  tenantId: 'tenantId',
  statusAnterior: 'statusAnterior',
  statusNovo: 'statusNovo',
  descricao: 'descricao',
  usuarioId: 'usuarioId',
  dadosExtras: 'dadosExtras',
  criadoEm: 'criadoEm'
};

exports.Prisma.PagamentoScalarFieldEnum = {
  id: 'id',
  pedidoId: 'pedidoId',
  tenantId: 'tenantId',
  tipo: 'tipo',
  status: 'status',
  valor: 'valor',
  parcelas: 'parcelas',
  gateway: 'gateway',
  transacaoExternaId: 'transacaoExternaId',
  dadosGateway: 'dadosGateway',
  dataPagamento: 'dataPagamento',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.DevolucaoScalarFieldEnum = {
  id: 'id',
  pedidoId: 'pedidoId',
  tenantId: 'tenantId',
  motivo: 'motivo',
  status: 'status',
  valorReembolso: 'valorReembolso',
  codigoRastreioRetorno: 'codigoRastreioRetorno',
  observacao: 'observacao',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ItemDevolucaoScalarFieldEnum = {
  id: 'id',
  devolucaoId: 'devolucaoId',
  itemPedidoId: 'itemPedidoId',
  quantidade: 'quantidade',
  motivo: 'motivo',
  criadoEm: 'criadoEm'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Pedido: 'Pedido',
  ItemPedido: 'ItemPedido',
  HistoricoPedido: 'HistoricoPedido',
  Pagamento: 'Pagamento',
  Devolucao: 'Devolucao',
  ItemDevolucao: 'ItemDevolucao'
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
      "value": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\order-service\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\order-service\\prisma\\schema.prisma",
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
  "inlineSchema": "// ═══════════════════════════════════════════════════════════════\n// iMestreDigital - Schema do Order Service (OMS)\n// ═══════════════════════════════════════════════════════════════\n// Gerencia pedidos omnichannel (marketplace, e-commerce, loja física)\n// com integração com inventory-service, fiscal-service e payment-service.\n// ═══════════════════════════════════════════════════════════════\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ─── Pedido (Ordem de Venda) ─────────────────────────────────\n\n/// Pedido completo com informações de cliente, itens, pagamento e entrega.\n/// Suporta múltiplos canais: marketplace, e-commerce, loja física, manual.\nmodel Pedido {\n  id       String @id @default(uuid()) @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  // Numeração\n  numero Int @map(\"numero\")\n\n  // Cliente\n  clienteId      String? @map(\"cliente_id\") @db.Uuid\n  clienteNome    String  @map(\"cliente_nome\")\n  clienteEmail   String? @map(\"cliente_email\")\n  clienteCpfCnpj String? @map(\"cliente_cpf_cnpj\")\n\n  // Origem e Canal\n  origem          String  @default(\"MANUAL\") @map(\"origem\") // LOJA, MARKETPLACE, ECOMMERCE, MANUAL\n  canalOrigem     String? @map(\"canal_origem\") // MERCADOLIVRE, SHOPEE, AMAZON, MAGALU, SITE, LOJA_FISICA, MANUAL\n  pedidoExternoId String? @unique @map(\"pedido_externo_id\") // ID do marketplace\n\n  // Status do Pedido\n  status String @default(\"RASCUNHO\") @map(\"status\")\n  // RASCUNHO -> PENDENTE -> CONFIRMADO -> SEPARANDO -> SEPARADO -> FATURADO -> ENVIADO -> ENTREGUE\n  // CANCELADO, DEVOLVIDO\n\n  // Status do Pagamento\n  statusPagamento String @default(\"PENDENTE\") @map(\"status_pagamento\")\n  // PENDENTE -> AUTORIZADO -> PAGO / ESTORNADO / REEMBOLSADO\n\n  // Pagamento\n  metodoPagamento String? @map(\"metodo_pagamento\")\n  parcelas        Int     @default(1)\n\n  // Valores\n  valorProdutos Decimal @default(0) @map(\"valor_produtos\") @db.Decimal(12, 2)\n  valorDesconto Decimal @default(0) @map(\"valor_desconto\") @db.Decimal(12, 2)\n  valorFrete    Decimal @default(0) @map(\"valor_frete\") @db.Decimal(12, 2)\n  valorTotal    Decimal @default(0) @map(\"valor_total\") @db.Decimal(12, 2)\n\n  // Observações\n  observacao String? @map(\"observacao\")\n\n  // Endereço de Entrega (JSON com: cep, rua, numero, complemento, bairro, cidade, uf)\n  enderecoEntrega Json? @map(\"endereco_entrega\")\n\n  // Rastreamento\n  rastreamento   String? @map(\"rastreamento\")\n  codigoRastreio String? @map(\"codigo_rastreio\")\n  transportadora String? @map(\"transportadora\")\n  prazoEntrega   Int?    @map(\"prazo_entrega\") // dias\n\n  // Datas de Transição de Status\n  dataAprovacao    DateTime? @map(\"data_aprovacao\")\n  dataSeparacao    DateTime? @map(\"data_separacao\")\n  dataFaturamento  DateTime? @map(\"data_faturamento\")\n  dataEnvio        DateTime? @map(\"data_envio\")\n  dataEntrega      DateTime? @map(\"data_entrega\")\n  dataCancelamento DateTime? @map(\"data_cancelamento\")\n\n  // Cancelamento\n  motivoCancelamento String? @map(\"motivo_cancelamento\")\n\n  // Nota Fiscal\n  notaFiscalId String? @map(\"nota_fiscal_id\") @db.Uuid\n\n  // Timestamps\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Relacionamentos\n  itens      ItemPedido[]\n  historico  HistoricoPedido[]\n  pagamentos Pagamento[]\n  devolucoes Devolucao[]\n\n  @@unique([tenantId, numero])\n  @@index([tenantId])\n  @@index([status])\n  @@index([statusPagamento])\n  @@index([canalOrigem])\n  @@index([clienteId])\n  @@index([criadoEm])\n  @@map(\"pedidos\")\n}\n\n// ─── Item do Pedido ──────────────────────────────────────────\n\n/// Itens (produtos) que fazem parte do pedido.\nmodel ItemPedido {\n  id       String @id @default(uuid()) @db.Uuid\n  pedidoId String @map(\"pedido_id\") @db.Uuid\n  pedido   Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)\n\n  produtoId  String  @map(\"produto_id\") @db.Uuid\n  variacaoId String? @map(\"variacao_id\") @db.Uuid\n\n  sku        String @map(\"sku\")\n  titulo     String @map(\"titulo\")\n  quantidade Int    @map(\"quantidade\")\n\n  // Preços\n  valorUnitario Decimal @map(\"valor_unitario\") @db.Decimal(12, 2)\n  valorDesconto Decimal @default(0) @map(\"valor_desconto\") @db.Decimal(12, 2)\n  valorTotal    Decimal @map(\"valor_total\") @db.Decimal(12, 2)\n\n  // Dimensões\n  peso        Decimal? @map(\"peso\") @db.Decimal(10, 3)\n  largura     Decimal? @map(\"largura\") @db.Decimal(10, 2)\n  altura      Decimal? @map(\"altura\") @db.Decimal(10, 2)\n  comprimento Decimal? @map(\"comprimento\") @db.Decimal(10, 2)\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  // Relacionamentos\n  itensDevolvidos ItemDevolucao[]\n\n  @@index([pedidoId])\n  @@index([produtoId])\n  @@map(\"itens_pedidos\")\n}\n\n// ─── Histórico de Pedido ────────────────────────────────────\n\n/// Rastreamento de todas as mudanças de status do pedido.\nmodel HistoricoPedido {\n  id       String @id @default(uuid()) @db.Uuid\n  pedidoId String @map(\"pedido_id\") @db.Uuid\n  pedido   Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)\n\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  statusAnterior String? @map(\"status_anterior\")\n  statusNovo     String  @map(\"status_novo\")\n  descricao      String  @map(\"descricao\")\n\n  usuarioId   String? @map(\"usuario_id\") @db.Uuid\n  dadosExtras Json?   @map(\"dados_extras\")\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([pedidoId])\n  @@index([tenantId])\n  @@index([criadoEm])\n  @@map(\"historicos_pedidos\")\n}\n\n// ─── Pagamento ───────────────────────────────────────────────\n\n/// Informações de pagamento vinculadas ao pedido.\nmodel Pagamento {\n  id       String @id @default(uuid()) @db.Uuid\n  pedidoId String @map(\"pedido_id\") @db.Uuid\n  pedido   Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)\n\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  // Tipo e Status\n  tipo   String @map(\"tipo\")\n  // CARTAO_CREDITO, CARTAO_DEBITO, BOLETO, PIX, TRANSFERENCIA, MARKETPLACE\n  status String @default(\"PENDENTE\") @map(\"status\")\n  // PENDENTE -> PROCESSANDO -> APROVADO / RECUSADO / ESTORNADO\n\n  valor    Decimal @db.Decimal(12, 2)\n  parcelas Int     @default(1)\n\n  // Gateway de Pagamento\n  gateway            String? @map(\"gateway\")\n  transacaoExternaId String? @map(\"transacao_externa_id\")\n  dadosGateway       Json?   @map(\"dados_gateway\")\n\n  dataPagamento DateTime? @map(\"data_pagamento\")\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  @@index([pedidoId])\n  @@index([tenantId])\n  @@index([status])\n  @@map(\"pagamentos\")\n}\n\n// ─── Devolução ───────────────────────────────────────────────\n\n/// Gestão de devoluções e reembolsos.\nmodel Devolucao {\n  id       String @id @default(uuid()) @db.Uuid\n  pedidoId String @map(\"pedido_id\") @db.Uuid\n  pedido   Pedido @relation(fields: [pedidoId], references: [id], onDelete: Cascade)\n\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  motivo String @map(\"motivo\")\n  status String @default(\"SOLICITADA\") @map(\"status\")\n  // SOLICITADA -> APROVADA -> RECEBIDA -> REEMBOLSADA / RECUSADA\n\n  valorReembolso Decimal @map(\"valor_reembolso\") @db.Decimal(12, 2)\n\n  codigoRastreioRetorno String? @map(\"codigo_rastreio_retorno\")\n\n  observacao String? @map(\"observacao\")\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Relacionamentos\n  itens ItemDevolucao[]\n\n  @@index([pedidoId])\n  @@index([tenantId])\n  @@index([status])\n  @@map(\"devolucoes\")\n}\n\n// ─── Item de Devolução ───────────────────────────────────────\n\n/// Itens específicos que fazem parte da devolução.\nmodel ItemDevolucao {\n  id          String    @id @default(uuid()) @db.Uuid\n  devolucaoId String    @map(\"devolucao_id\") @db.Uuid\n  devolucao   Devolucao @relation(fields: [devolucaoId], references: [id], onDelete: Cascade)\n\n  itemPedidoId String     @map(\"item_pedido_id\") @db.Uuid\n  itemPedido   ItemPedido @relation(fields: [itemPedidoId], references: [id], onDelete: Cascade)\n\n  quantidade Int    @map(\"quantidade\")\n  motivo     String @map(\"motivo\")\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([devolucaoId])\n  @@index([itemPedidoId])\n  @@map(\"itens_devolucoes\")\n}\n",
  "inlineSchemaHash": "48fab9d62e449c909619c3741ce2ffb27e77d10b3991c2f70a0276f197da2762",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "generated/client",
    "client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Pedido\":{\"dbName\":\"pedidos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numero\",\"dbName\":\"numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"dbName\":\"cliente_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteNome\",\"dbName\":\"cliente_nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteEmail\",\"dbName\":\"cliente_email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteCpfCnpj\",\"dbName\":\"cliente_cpf_cnpj\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"origem\",\"dbName\":\"origem\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"MANUAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"canalOrigem\",\"dbName\":\"canal_origem\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoExternoId\",\"dbName\":\"pedido_externo_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"dbName\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"RASCUNHO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusPagamento\",\"dbName\":\"status_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"PENDENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metodoPagamento\",\"dbName\":\"metodo_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parcelas\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorProdutos\",\"dbName\":\"valor_produtos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorDesconto\",\"dbName\":\"valor_desconto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorFrete\",\"dbName\":\"valor_frete\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorTotal\",\"dbName\":\"valor_total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacao\",\"dbName\":\"observacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enderecoEntrega\",\"dbName\":\"endereco_entrega\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rastreamento\",\"dbName\":\"rastreamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"codigoRastreio\",\"dbName\":\"codigo_rastreio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transportadora\",\"dbName\":\"transportadora\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prazoEntrega\",\"dbName\":\"prazo_entrega\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataAprovacao\",\"dbName\":\"data_aprovacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataSeparacao\",\"dbName\":\"data_separacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataFaturamento\",\"dbName\":\"data_faturamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataEnvio\",\"dbName\":\"data_envio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataEntrega\",\"dbName\":\"data_entrega\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataCancelamento\",\"dbName\":\"data_cancelamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivoCancelamento\",\"dbName\":\"motivo_cancelamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notaFiscalId\",\"dbName\":\"nota_fiscal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"itens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemPedido\",\"relationName\":\"ItemPedidoToPedido\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"historico\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"HistoricoPedido\",\"relationName\":\"HistoricoPedidoToPedido\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pagamentos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pagamento\",\"relationName\":\"PagamentoToPedido\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"devolucoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Devolucao\",\"relationName\":\"DevolucaoToPedido\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"numero\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"numero\"]}],\"isGenerated\":false,\"documentation\":\"Pedido completo com informações de cliente, itens, pagamento e entrega.\\\\nSuporta múltiplos canais: marketplace, e-commerce, loja física, manual.\"},\"ItemPedido\":{\"dbName\":\"itens_pedidos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedido\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pedido\",\"relationName\":\"ItemPedidoToPedido\",\"relationFromFields\":[\"pedidoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"variacaoId\",\"dbName\":\"variacao_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sku\",\"dbName\":\"sku\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"titulo\",\"dbName\":\"titulo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"dbName\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorUnitario\",\"dbName\":\"valor_unitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorDesconto\",\"dbName\":\"valor_desconto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorTotal\",\"dbName\":\"valor_total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"peso\",\"dbName\":\"peso\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"largura\",\"dbName\":\"largura\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"altura\",\"dbName\":\"altura\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comprimento\",\"dbName\":\"comprimento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itensDevolvidos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemDevolucao\",\"relationName\":\"ItemDevolucaoToItemPedido\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Itens (produtos) que fazem parte do pedido.\"},\"HistoricoPedido\":{\"dbName\":\"historicos_pedidos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedido\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pedido\",\"relationName\":\"HistoricoPedidoToPedido\",\"relationFromFields\":[\"pedidoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusAnterior\",\"dbName\":\"status_anterior\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"statusNovo\",\"dbName\":\"status_novo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"dbName\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dadosExtras\",\"dbName\":\"dados_extras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Rastreamento de todas as mudanças de status do pedido.\"},\"Pagamento\":{\"dbName\":\"pagamentos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedido\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pedido\",\"relationName\":\"PagamentoToPedido\",\"relationFromFields\":[\"pedidoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"dbName\":\"tipo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"dbName\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"PENDENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parcelas\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gateway\",\"dbName\":\"gateway\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transacaoExternaId\",\"dbName\":\"transacao_externa_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dadosGateway\",\"dbName\":\"dados_gateway\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataPagamento\",\"dbName\":\"data_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Informações de pagamento vinculadas ao pedido.\"},\"Devolucao\":{\"dbName\":\"devolucoes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedido\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Pedido\",\"relationName\":\"DevolucaoToPedido\",\"relationFromFields\":[\"pedidoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"dbName\":\"motivo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"dbName\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"SOLICITADA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorReembolso\",\"dbName\":\"valor_reembolso\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"codigoRastreioRetorno\",\"dbName\":\"codigo_rastreio_retorno\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacao\",\"dbName\":\"observacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"itens\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemDevolucao\",\"relationName\":\"DevolucaoToItemDevolucao\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Gestão de devoluções e reembolsos.\"},\"ItemDevolucao\":{\"dbName\":\"itens_devolucoes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"devolucaoId\",\"dbName\":\"devolucao_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"devolucao\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Devolucao\",\"relationName\":\"DevolucaoToItemDevolucao\",\"relationFromFields\":[\"devolucaoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemPedidoId\",\"dbName\":\"item_pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"itemPedido\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ItemPedido\",\"relationName\":\"ItemDevolucaoToItemPedido\",\"relationFromFields\":[\"itemPedidoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"dbName\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"dbName\":\"motivo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Itens específicos que fazem parte da devolução.\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "generated/client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "generated/client/schema.prisma")
