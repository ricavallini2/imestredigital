
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

exports.Prisma.ModelName = {
  Deposito: 'Deposito',
  SaldoEstoque: 'SaldoEstoque',
  ReservaEstoque: 'ReservaEstoque',
  EventoProcessado: 'EventoProcessado',
  Movimentacao: 'Movimentacao'
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
  "inlineSchema": "// ═══════════════════════════════════════════════════════════════\n// iMestreDigital - Schema do Inventory Service\n// ═══════════════════════════════════════════════════════════════\n// Gerencia estoque multi-depósito, reservas e movimentações.\n// ═══════════════════════════════════════════════════════════════\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ─── Enumerações ──────────────────────────────────────────────\n\nenum TipoMovimentacao {\n  ENTRADA\n  SAIDA\n  AJUSTE\n  TRANSFERENCIA\n  DEVOLUCAO\n  RESERVA\n}\n\nenum MotivoMovimentacao {\n  COMPRA\n  VENDA\n  AJUSTE_INVENTARIO\n  TRANSFERENCIA_DEPOSITO\n  DEVOLUCAO_CLIENTE\n  DEVOLUCAO_FORNECEDOR\n  DEVOLUCAO\n  PERDA\n  AVARIA\n  CONSUMO\n  PRODUCAO\n  OUTRO\n}\n\nenum StatusReserva {\n  ATIVA\n  CONFIRMADA\n  CANCELADA\n  EXPIRADA\n}\n\n/// Depósito / armazém / centro de distribuição\nmodel Deposito {\n  id       String  @id @default(uuid()) @db.Uuid\n  tenantId String  @map(\"tenant_id\") @db.Uuid\n  nome     String\n  endereco String?\n  cidade   String?\n  estado   String?\n  padrao   Boolean @default(false) // Depósito padrão do tenant\n  ativo    Boolean @default(true)\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  saldos        SaldoEstoque[]\n  movimentacoes Movimentacao[]\n\n  @@index([tenantId])\n  @@map(\"depositos\")\n}\n\n/// Saldo de estoque de um produto em um depósito específico\nmodel SaldoEstoque {\n  id         String   @id @default(uuid()) @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  produtoId  String   @map(\"produto_id\") @db.Uuid\n  depositoId String   @map(\"deposito_id\") @db.Uuid\n  deposito   Deposito @relation(fields: [depositoId], references: [id])\n\n  quantidadeFisica Int @default(0) @map(\"quantidade_fisica\") // Quantidade real no depósito\n  reservado        Int @default(0) // Quantidade reservada para pedidos\n  estoqueMinimo    Int @default(0) @map(\"estoque_minimo\") // Ponto de pedido\n\n  lote        String? // Número do lote\n  numeroSerie String? @map(\"numero_serie\") // Número de série\n\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Disponível = quantidadeFisica - reservado (calculado no service)\n\n  @@unique([tenantId, produtoId, depositoId], name: \"tenantId_produtoId_depositoId\")\n  @@index([tenantId])\n  @@index([tenantId, produtoId])\n  @@map(\"saldos_estoque\")\n}\n\n/// Reserva de estoque para um pedido (impede venda duplicada)\nmodel ReservaEstoque {\n  id         String        @id @default(uuid()) @db.Uuid\n  tenantId   String        @map(\"tenant_id\") @db.Uuid\n  produtoId  String        @map(\"produto_id\") @db.Uuid\n  /// Depósito de onde o estoque foi reservado. Nulo apenas em reservas\n  /// legadas criadas antes da reserva passar a ser por depósito.\n  depositoId String?       @map(\"deposito_id\") @db.Uuid\n  pedidoId   String        @map(\"pedido_id\") @db.Uuid\n  quantidade Int\n  status     StatusReserva @default(ATIVA)\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([tenantId, pedidoId])\n  @@index([tenantId, produtoId])\n  @@map(\"reservas_estoque\")\n}\n\n/// Registro de eventos já processados (idempotência do consumo Kafka).\n/// Garante que o mesmo evento (ex. pedido.pago para um pedidoId) só produza\n/// efeito colateral uma única vez, mesmo com reentrega do broker.\nmodel EventoProcessado {\n  id           String @id @default(uuid()) @db.Uuid\n  tenantId     String @map(\"tenant_id\") @db.Uuid\n  /// Nome lógico do evento consumido (ex. \"pedido.criado\", \"pedido.pago\").\n  evento       String\n  /// Identificador do agregado de referência (ex. pedidoId).\n  referenciaId String @map(\"referencia_id\")\n\n  processadoEm DateTime @default(now()) @map(\"processado_em\")\n\n  @@unique([evento, referenciaId], name: \"evento_referenciaId\")\n  @@index([tenantId])\n  @@map(\"eventos_processados\")\n}\n\n/// Movimentação (histórico de entrada/saída/ajuste/transferência)\nmodel Movimentacao {\n  id         String   @id @default(uuid()) @db.Uuid\n  tenantId   String   @map(\"tenant_id\") @db.Uuid\n  produtoId  String   @map(\"produto_id\") @db.Uuid\n  depositoId String   @map(\"deposito_id\") @db.Uuid\n  deposito   Deposito @relation(fields: [depositoId], references: [id])\n\n  tipo          TipoMovimentacao\n  motivo        MotivoMovimentacao\n  quantidade    Int // Positivo = entrada, Negativo = saída\n  custoUnitario Decimal?           @map(\"custo_unitario\") @db.Decimal(19, 2)\n  observacao    String?\n  usuarioId     String?            @map(\"usuario_id\") @db.Uuid // Autor da movimentação (auditoria); nulo em movimentações originadas por evento\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@index([tenantId])\n  @@index([tenantId, produtoId])\n  @@index([depositoId])\n  @@index([criadoEm])\n  @@index([tipo])\n  @@map(\"movimentacoes\")\n}\n",
  "inlineSchemaHash": "5970923718ee4e70ffbed66891cb269a2854a203360d75e2b78ee433150b94e1",
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

config.runtimeDataModel = JSON.parse("{\"models\":{\"Deposito\":{\"dbName\":\"depositos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endereco\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"padrao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"saldos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaldoEstoque\",\"relationName\":\"DepositoToSaldoEstoque\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"movimentacoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Movimentacao\",\"relationName\":\"DepositoToMovimentacao\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Depósito / armazém / centro de distribuição\"},\"SaldoEstoque\":{\"dbName\":\"saldos_estoque\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deposito\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deposito\",\"relationName\":\"DepositoToSaldoEstoque\",\"relationFromFields\":[\"depositoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidadeFisica\",\"dbName\":\"quantidade_fisica\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reservado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estoqueMinimo\",\"dbName\":\"estoque_minimo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numeroSerie\",\"dbName\":\"numero_serie\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"produtoId\",\"depositoId\"]],\"uniqueIndexes\":[{\"name\":\"tenantId_produtoId_depositoId\",\"fields\":[\"tenantId\",\"produtoId\",\"depositoId\"]}],\"isGenerated\":false,\"documentation\":\"Saldo de estoque de um produto em um depósito específico\"},\"ReservaEstoque\":{\"dbName\":\"reservas_estoque\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Depósito de onde o estoque foi reservado. Nulo apenas em reservas\\\\nlegadas criadas antes da reserva passar a ser por depósito.\"},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusReserva\",\"default\":\"ATIVA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Reserva de estoque para um pedido (impede venda duplicada)\"},\"EventoProcessado\":{\"dbName\":\"eventos_processados\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Nome lógico do evento consumido (ex. \\\"pedido.criado\\\", \\\"pedido.pago\\\").\"},{\"name\":\"referenciaId\",\"dbName\":\"referencia_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Identificador do agregado de referência (ex. pedidoId).\"},{\"name\":\"processadoEm\",\"dbName\":\"processado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"evento\",\"referenciaId\"]],\"uniqueIndexes\":[{\"name\":\"evento_referenciaId\",\"fields\":[\"evento\",\"referenciaId\"]}],\"isGenerated\":false,\"documentation\":\"Registro de eventos já processados (idempotência do consumo Kafka).\\\\nGarante que o mesmo evento (ex. pedido.pago para um pedidoId) só produza\\\\nefeito colateral uma única vez, mesmo com reentrega do broker.\"},\"Movimentacao\":{\"dbName\":\"movimentacoes\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"produtoId\",\"dbName\":\"produto_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"depositoId\",\"dbName\":\"deposito_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deposito\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Deposito\",\"relationName\":\"DepositoToMovimentacao\",\"relationFromFields\":[\"depositoId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoMovimentacao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"motivo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MotivoMovimentacao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"custoUnitario\",\"dbName\":\"custo_unitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Movimentação (histórico de entrada/saída/ajuste/transferência)\"}},\"enums\":{\"TipoMovimentacao\":{\"values\":[{\"name\":\"ENTRADA\",\"dbName\":null},{\"name\":\"SAIDA\",\"dbName\":null},{\"name\":\"AJUSTE\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null},{\"name\":\"RESERVA\",\"dbName\":null}],\"dbName\":null},\"MotivoMovimentacao\":{\"values\":[{\"name\":\"COMPRA\",\"dbName\":null},{\"name\":\"VENDA\",\"dbName\":null},{\"name\":\"AJUSTE_INVENTARIO\",\"dbName\":null},{\"name\":\"TRANSFERENCIA_DEPOSITO\",\"dbName\":null},{\"name\":\"DEVOLUCAO_CLIENTE\",\"dbName\":null},{\"name\":\"DEVOLUCAO_FORNECEDOR\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null},{\"name\":\"PERDA\",\"dbName\":null},{\"name\":\"AVARIA\",\"dbName\":null},{\"name\":\"CONSUMO\",\"dbName\":null},{\"name\":\"PRODUCAO\",\"dbName\":null},{\"name\":\"OUTRO\",\"dbName\":null}],\"dbName\":null},\"StatusReserva\":{\"values\":[{\"name\":\"ATIVA\",\"dbName\":null},{\"name\":\"CONFIRMADA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null},{\"name\":\"EXPIRADA\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
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
