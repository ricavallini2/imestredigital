
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

exports.Prisma.ContaFinanceiraScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  nome: 'nome',
  tipo: 'tipo',
  banco: 'banco',
  agencia: 'agencia',
  conta: 'conta',
  saldoAtual: 'saldoAtual',
  saldoInicial: 'saldoInicial',
  ativa: 'ativa',
  cor: 'cor',
  icone: 'icone',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.LancamentoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  contaId: 'contaId',
  usuarioId: 'usuarioId',
  tipo: 'tipo',
  categoria: 'categoria',
  subcategoria: 'subcategoria',
  descricao: 'descricao',
  valor: 'valor',
  dataVencimento: 'dataVencimento',
  dataPagamento: 'dataPagamento',
  dataCompetencia: 'dataCompetencia',
  status: 'status',
  formaPagamento: 'formaPagamento',
  numeroParcela: 'numeroParcela',
  totalParcelas: 'totalParcelas',
  parcelaOrigemId: 'parcelaOrigemId',
  pedidoId: 'pedidoId',
  notaFiscalId: 'notaFiscalId',
  fornecedor: 'fornecedor',
  cliente: 'cliente',
  observacao: 'observacao',
  tags: 'tags',
  recorrente: 'recorrente',
  recorrenciaId: 'recorrenciaId',
  anexoUrl: 'anexoUrl',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm',
  contaOrigemId: 'contaOrigemId',
  contaDestinoId: 'contaDestinoId'
};

exports.Prisma.CategoriaFinanceiraScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  nome: 'nome',
  tipo: 'tipo',
  icone: 'icone',
  cor: 'cor',
  paiId: 'paiId',
  ativa: 'ativa',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.RecorrenciaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  contaId: 'contaId',
  descricao: 'descricao',
  tipo: 'tipo',
  categoria: 'categoria',
  valor: 'valor',
  frequencia: 'frequencia',
  diaVencimento: 'diaVencimento',
  proximaGeracao: 'proximaGeracao',
  ativa: 'ativa',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ConciliacaoBancariaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  contaId: 'contaId',
  dataInicio: 'dataInicio',
  dataFim: 'dataFim',
  saldoInicial: 'saldoInicial',
  saldoFinal: 'saldoFinal',
  status: 'status',
  divergencias: 'divergencias',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.EventoProcessadoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  evento: 'evento',
  referenciaId: 'referenciaId',
  processadoEm: 'processadoEm'
};

exports.Prisma.DREScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  periodo: 'periodo',
  ano: 'ano',
  mes: 'mes',
  receitaBruta: 'receitaBruta',
  deducoes: 'deducoes',
  receitaLiquida: 'receitaLiquida',
  custosMercadorias: 'custosMercadorias',
  lucroBruto: 'lucroBruto',
  despesasOperacionais: 'despesasOperacionais',
  despesasAdministrativas: 'despesasAdministrativas',
  despesasComerciais: 'despesasComerciais',
  resultadoOperacional: 'resultadoOperacional',
  despesasFinanceiras: 'despesasFinanceiras',
  receitasFinanceiras: 'receitasFinanceiras',
  lucroLiquido: 'lucroLiquido',
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

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.TipoConta = exports.$Enums.TipoConta = {
  CORRENTE: 'CORRENTE',
  POUPANCA: 'POUPANCA',
  INVESTIMENTO: 'INVESTIMENTO',
  CAIXA: 'CAIXA',
  CARTAO: 'CARTAO',
  DIGITAL: 'DIGITAL'
};

exports.TipoLancamento = exports.$Enums.TipoLancamento = {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA',
  TRANSFERENCIA: 'TRANSFERENCIA'
};

exports.StatusLancamento = exports.$Enums.StatusLancamento = {
  PENDENTE: 'PENDENTE',
  PAGO: 'PAGO',
  ATRASADO: 'ATRASADO',
  CANCELADO: 'CANCELADO',
  PARCIAL: 'PARCIAL'
};

exports.FormaPagamento = exports.$Enums.FormaPagamento = {
  DINHEIRO: 'DINHEIRO',
  PIX: 'PIX',
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  CARTAO_DEBITO: 'CARTAO_DEBITO',
  BOLETO: 'BOLETO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  TED: 'TED',
  DOC: 'DOC',
  CHEQUE: 'CHEQUE',
  OUTRO: 'OUTRO'
};

exports.TipoCategoriaFinanceira = exports.$Enums.TipoCategoriaFinanceira = {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA'
};

exports.FrequenciaRecorrencia = exports.$Enums.FrequenciaRecorrencia = {
  DIARIA: 'DIARIA',
  SEMANAL: 'SEMANAL',
  QUINZENAL: 'QUINZENAL',
  MENSAL: 'MENSAL',
  BIMESTRAL: 'BIMESTRAL',
  TRIMESTRAL: 'TRIMESTRAL',
  SEMESTRAL: 'SEMESTRAL',
  ANUAL: 'ANUAL'
};

exports.StatusConciliacao = exports.$Enums.StatusConciliacao = {
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  DIVERGENTE: 'DIVERGENTE'
};

exports.Prisma.ModelName = {
  ContaFinanceira: 'ContaFinanceira',
  Lancamento: 'Lancamento',
  CategoriaFinanceira: 'CategoriaFinanceira',
  Recorrencia: 'Recorrencia',
  ConciliacaoBancaria: 'ConciliacaoBancaria',
  EventoProcessado: 'EventoProcessado',
  DRE: 'DRE'
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
      "value": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\financial-service\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\financial-service\\prisma\\schema.prisma",
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
  "inlineSchema": "// ═══════════════════════════════════════════════════════════════\n// iMestreDigital - Schema do Financial Service\n// ═══════════════════════════════════════════════════════════════\n// Gerencia:\n// - Contas bancárias e financeiras\n// - Lançamentos (contas a receber/pagar)\n// - Categorias financeiras hierárquicas\n// - Recorrências automáticas\n// - Fluxo de caixa e DRE\n// - Conciliação bancária\n// ═══════════════════════════════════════════════════════════════\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// ─── Enumerações ──────────────────────────────────────────────\n\nenum TipoLancamento {\n  RECEITA\n  DESPESA\n  TRANSFERENCIA\n}\n\nenum StatusLancamento {\n  PENDENTE\n  PAGO\n  ATRASADO\n  CANCELADO\n  PARCIAL\n}\n\nenum FormaPagamento {\n  DINHEIRO\n  PIX\n  CARTAO_CREDITO\n  CARTAO_DEBITO\n  BOLETO\n  TRANSFERENCIA\n  TED\n  DOC\n  CHEQUE\n  OUTRO\n}\n\nenum TipoConta {\n  CORRENTE\n  POUPANCA\n  INVESTIMENTO\n  CAIXA\n  CARTAO\n  DIGITAL\n}\n\n// ─── Conta Financeira ─────────────────────────────────────────\n/// Representação de uma conta bancária ou financeira da empresa.\n/// Tipos: corrente, poupança, caixa, cartão, digital, etc.\nmodel ContaFinanceira {\n  id       String @id @default(uuid()) @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  nome    String\n  tipo    TipoConta // CORRENTE, POUPANCA, INVESTIMENTO, CAIXA, CARTAO\n  banco   String?\n  agencia String?\n  conta   String?\n\n  saldoAtual   Decimal @default(0) @map(\"saldo_atual\") @db.Decimal(19, 2)\n  saldoInicial Decimal @default(0) @map(\"saldo_inicial\") @db.Decimal(19, 2)\n\n  ativa Boolean @default(true)\n  cor   String? @default(\"#3B82F6\")\n  icone String? @default(\"bank\")\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Relacionamentos\n  lancamentos           Lancamento[]\n  transferenciasOrigem  Lancamento[]          @relation(\"TransferenciaOrigem\")\n  transferenciasDestino Lancamento[]          @relation(\"TransferenciaDestino\")\n  recorrencias          Recorrencia[]\n  conciliacoes          ConciliacaoBancaria[]\n\n  @@index([tenantId])\n  @@index([ativa])\n  @@map(\"contas_financeiras\")\n}\n\n// ─── Lançamento (Contas a Pagar/Receber) ──────────────────────\n/// Transação financeira: receita, despesa ou transferência.\n/// Pode ser pago/recebido ou permanecer em aberto.\nmodel Lancamento {\n  id        String           @id @default(uuid()) @db.Uuid\n  tenantId  String           @map(\"tenant_id\") @db.Uuid\n  contaId   String?          @map(\"conta_id\") @db.Uuid\n  conta     ContaFinanceira? @relation(fields: [contaId], references: [id], onDelete: SetNull)\n  usuarioId String?          @map(\"usuario_id\") @db.Uuid\n\n  tipo         TipoLancamento\n  categoria    String?\n  subcategoria String?\n  descricao    String         @db.Text\n  valor        Decimal        @db.Decimal(19, 2)\n\n  dataVencimento  DateTime  @map(\"data_vencimento\")\n  dataPagamento   DateTime? @map(\"data_pagamento\")\n  dataCompetencia DateTime? @map(\"data_competencia\")\n\n  status         StatusLancamento @default(PENDENTE)\n  formaPagamento FormaPagamento?  @map(\"forma_pagamento\")\n\n  // Parcelamento\n  numeroParcela   Int?    @map(\"numero_parcela\")\n  totalParcelas   Int?    @map(\"total_parcelas\")\n  parcelaOrigemId String? @map(\"parcela_origem_id\") @db.Uuid\n\n  // Integrações\n  pedidoId     String? @map(\"pedido_id\") @db.Uuid\n  notaFiscalId String? @map(\"nota_fiscal_id\") @db.Uuid\n\n  fornecedor String?\n  cliente    String?\n  observacao String?  @db.Text\n  tags       String[] @default([])\n\n  // Recorrência\n  recorrente    Boolean      @default(false)\n  recorrenciaId String?      @map(\"recorrencia_id\") @db.Uuid\n  recorrencia   Recorrencia? @relation(fields: [recorrenciaId], references: [id], onDelete: SetNull)\n\n  anexoUrl String? @map(\"anexo_url\")\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Relacionamentos para transferências\n  contaOrigemId String?          @map(\"conta_origem_id\") @db.Uuid\n  contaOrigem   ContaFinanceira? @relation(\"TransferenciaOrigem\", fields: [contaOrigemId], references: [id], onDelete: SetNull)\n\n  contaDestinoId String?          @map(\"conta_destino_id\") @db.Uuid\n  contaDestino   ContaFinanceira? @relation(\"TransferenciaDestino\", fields: [contaDestinoId], references: [id], onDelete: SetNull)\n\n  @@index([tenantId])\n  @@index([tipo])\n  @@index([status])\n  @@index([dataVencimento])\n  @@index([dataPagamento])\n  @@index([contaId])\n  @@index([recorrenciaId])\n  @@map(\"lancamentos\")\n}\n\n// ─── Categoria Financeira ──────────────────────────────────────\n/// Categorias hierárquicas para organizar receitas e despesas.\nenum TipoCategoriaFinanceira {\n  RECEITA\n  DESPESA\n}\n\nmodel CategoriaFinanceira {\n  id       String @id @default(uuid()) @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  nome  String\n  tipo  TipoCategoriaFinanceira\n  icone String?                 @default(\"tag\")\n  cor   String?                 @default(\"#6B7280\")\n\n  paiId  String?               @map(\"pai_id\") @db.Uuid\n  pai    CategoriaFinanceira?  @relation(\"CategoriaPai\", fields: [paiId], references: [id], onDelete: SetNull)\n  filhos CategoriaFinanceira[] @relation(\"CategoriaPai\")\n\n  ativa Boolean @default(true)\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  @@index([tenantId])\n  @@index([tipo])\n  @@index([paiId])\n  @@map(\"categorias_financeiras\")\n}\n\n// ─── Recorrência ──────────────────────────────────────────────\nenum FrequenciaRecorrencia {\n  DIARIA\n  SEMANAL\n  QUINZENAL\n  MENSAL\n  BIMESTRAL\n  TRIMESTRAL\n  SEMESTRAL\n  ANUAL\n}\n\n/// Configuração para gerar lançamentos automaticamente.\n/// Exemplo: aluguel todo mês, no dia 5.\nmodel Recorrencia {\n  id       String           @id @default(uuid()) @db.Uuid\n  tenantId String           @map(\"tenant_id\") @db.Uuid\n  contaId  String?          @map(\"conta_id\") @db.Uuid\n  conta    ContaFinanceira? @relation(fields: [contaId], references: [id], onDelete: SetNull)\n\n  descricao String\n  tipo      TipoLancamento\n  categoria String?\n  valor     Decimal        @db.Decimal(19, 2)\n\n  frequencia    FrequenciaRecorrencia\n  diaVencimento Int?                  @map(\"dia_vencimento\") // 1-31, ou null se semanal\n\n  proximaGeracao DateTime @map(\"proxima_geracao\")\n  ativa          Boolean  @default(true)\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  // Relacionamentos\n  lancamentos Lancamento[]\n\n  @@index([tenantId])\n  @@index([frequencia])\n  @@index([ativa])\n  @@map(\"recorrencias\")\n}\n\n// ─── Conciliação Bancária ────────────────────────────────────\nenum StatusConciliacao {\n  EM_ANDAMENTO\n  CONCLUIDA\n  DIVERGENTE\n}\n\n/// Processo de reconciliar saldo do sistema com extrato bancário.\nmodel ConciliacaoBancaria {\n  id       String          @id @default(uuid()) @db.Uuid\n  tenantId String          @map(\"tenant_id\") @db.Uuid\n  contaId  String          @map(\"conta_id\") @db.Uuid\n  conta    ContaFinanceira @relation(fields: [contaId], references: [id], onDelete: Cascade)\n\n  dataInicio DateTime @map(\"data_inicio\")\n  dataFim    DateTime @map(\"data_fim\")\n\n  saldoInicial Decimal @map(\"saldo_inicial\") @db.Decimal(19, 2)\n  saldoFinal   Decimal @map(\"saldo_final\") @db.Decimal(19, 2)\n\n  status       StatusConciliacao @default(EM_ANDAMENTO)\n  divergencias Json?             @default(\"[]\")\n\n  criadoEm     DateTime @default(now()) @map(\"criado_em\")\n  atualizadoEm DateTime @updatedAt @map(\"atualizado_em\")\n\n  @@index([tenantId])\n  @@index([contaId])\n  @@index([status])\n  @@map(\"conciliacoes_bancarias\")\n}\n\n// ─── Idempotência de Eventos Kafka ────────────────────────────\n/// Registra eventos já consumidos para garantir idempotência no processamento\n/// da SAGA (reentregas do broker não reaplicam o efeito colateral).\n/// Dedup por (evento, referenciaId) — ex. (\"pedido.faturado\", pedidoId).\nmodel EventoProcessado {\n  id           String @id @default(uuid()) @db.Uuid\n  tenantId     String @map(\"tenant_id\") @db.Uuid\n  /// Nome lógico do evento consumido (ex. \"pedido.faturado\", \"pedido.pago\").\n  evento       String\n  /// Identificador do agregado de referência (ex. pedidoId).\n  referenciaId String @map(\"referencia_id\")\n\n  processadoEm DateTime @default(now()) @map(\"processado_em\")\n\n  @@unique([evento, referenciaId], name: \"evento_referenciaId\")\n  @@index([tenantId])\n  @@map(\"eventos_processados\")\n}\n\n// ─── DRE (Demonstração de Resultado do Exercício) ─────────────\n/// Relatório financeiro mensal/anual.\nmodel DRE {\n  id       String @id @default(uuid()) @db.Uuid\n  tenantId String @map(\"tenant_id\") @db.Uuid\n\n  periodo String // MENSAL, TRIMESTRAL, ANUAL\n  ano     Int\n  mes     Int?\n\n  receitaBruta   Decimal @map(\"receita_bruta\") @db.Decimal(19, 2)\n  deducoes       Decimal @default(0) @db.Decimal(19, 2)\n  receitaLiquida Decimal @map(\"receita_liquida\") @db.Decimal(19, 2)\n\n  custosMercadorias Decimal @default(0) @map(\"custos_mercadorias\") @db.Decimal(19, 2)\n  lucroBruto        Decimal @map(\"lucro_bruto\") @db.Decimal(19, 2)\n\n  despesasOperacionais    Decimal @default(0) @map(\"despesas_operacionais\") @db.Decimal(19, 2)\n  despesasAdministrativas Decimal @default(0) @map(\"despesas_administrativas\") @db.Decimal(19, 2)\n  despesasComerciais      Decimal @default(0) @map(\"despesas_comerciais\") @db.Decimal(19, 2)\n\n  resultadoOperacional Decimal @map(\"resultado_operacional\") @db.Decimal(19, 2)\n\n  despesasFinanceiras Decimal @default(0) @map(\"despesas_financeiras\") @db.Decimal(19, 2)\n  receitasFinanceiras Decimal @default(0) @map(\"receitas_financeiras\") @db.Decimal(19, 2)\n\n  lucroLiquido Decimal @map(\"lucro_liquido\") @db.Decimal(19, 2)\n\n  criadoEm DateTime @default(now()) @map(\"criado_em\")\n\n  @@unique([tenantId, ano, mes], name: \"tenantId_ano_mes\")\n  @@index([tenantId])\n  @@index([ano])\n  @@index([mes])\n  @@map(\"dres\")\n}\n",
  "inlineSchemaHash": "d4c61b86d7b46d69e3a059d3711de10165105e767edc243b2210307c6231818e",
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

config.runtimeDataModel = JSON.parse("{\"models\":{\"ContaFinanceira\":{\"dbName\":\"contas_financeiras\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoConta\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"banco\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"agencia\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conta\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoAtual\",\"dbName\":\"saldo_atual\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoInicial\",\"dbName\":\"saldo_inicial\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativa\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"#3B82F6\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"bank\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lancamentos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Lancamento\",\"relationName\":\"ContaFinanceiraToLancamento\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transferenciasOrigem\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Lancamento\",\"relationName\":\"TransferenciaOrigem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"transferenciasDestino\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Lancamento\",\"relationName\":\"TransferenciaDestino\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recorrencias\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Recorrencia\",\"relationName\":\"ContaFinanceiraToRecorrencia\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conciliacoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ConciliacaoBancaria\",\"relationName\":\"ConciliacaoBancariaToContaFinanceira\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Representação de uma conta bancária ou financeira da empresa.\\\\nTipos: corrente, poupança, caixa, cartão, digital, etc.\"},\"Lancamento\":{\"dbName\":\"lancamentos\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaId\",\"dbName\":\"conta_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conta\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContaFinanceira\",\"relationName\":\"ContaFinanceiraToLancamento\",\"relationFromFields\":[\"contaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"dbName\":\"usuario_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoLancamento\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subcategoria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataVencimento\",\"dbName\":\"data_vencimento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataPagamento\",\"dbName\":\"data_pagamento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataCompetencia\",\"dbName\":\"data_competencia\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusLancamento\",\"default\":\"PENDENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"formaPagamento\",\"dbName\":\"forma_pagamento\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FormaPagamento\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numeroParcela\",\"dbName\":\"numero_parcela\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalParcelas\",\"dbName\":\"total_parcelas\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parcelaOrigemId\",\"dbName\":\"parcela_origem_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"dbName\":\"pedido_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notaFiscalId\",\"dbName\":\"nota_fiscal_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fornecedor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recorrente\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recorrenciaId\",\"dbName\":\"recorrencia_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recorrencia\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Recorrencia\",\"relationName\":\"LancamentoToRecorrencia\",\"relationFromFields\":[\"recorrenciaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anexoUrl\",\"dbName\":\"anexo_url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"contaOrigemId\",\"dbName\":\"conta_origem_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaOrigem\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContaFinanceira\",\"relationName\":\"TransferenciaOrigem\",\"relationFromFields\":[\"contaOrigemId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaDestinoId\",\"dbName\":\"conta_destino_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaDestino\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContaFinanceira\",\"relationName\":\"TransferenciaDestino\",\"relationFromFields\":[\"contaDestinoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Transação financeira: receita, despesa ou transferência.\\\\nPode ser pago/recebido ou permanecer em aberto.\"},\"CategoriaFinanceira\":{\"dbName\":\"categorias_financeiras\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoCategoriaFinanceira\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"tag\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"#6B7280\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paiId\",\"dbName\":\"pai_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pai\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CategoriaFinanceira\",\"relationName\":\"CategoriaPai\",\"relationFromFields\":[\"paiId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filhos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CategoriaFinanceira\",\"relationName\":\"CategoriaPai\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativa\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Recorrencia\":{\"dbName\":\"recorrencias\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaId\",\"dbName\":\"conta_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conta\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContaFinanceira\",\"relationName\":\"ContaFinanceiraToRecorrencia\",\"relationFromFields\":[\"contaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoLancamento\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"categoria\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"frequencia\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FrequenciaRecorrencia\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"diaVencimento\",\"dbName\":\"dia_vencimento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proximaGeracao\",\"dbName\":\"proxima_geracao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativa\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"lancamentos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Lancamento\",\"relationName\":\"LancamentoToRecorrencia\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Configuração para gerar lançamentos automaticamente.\\\\nExemplo: aluguel todo mês, no dia 5.\"},\"ConciliacaoBancaria\":{\"dbName\":\"conciliacoes_bancarias\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contaId\",\"dbName\":\"conta_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"conta\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContaFinanceira\",\"relationName\":\"ConciliacaoBancariaToContaFinanceira\",\"relationFromFields\":[\"contaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataInicio\",\"dbName\":\"data_inicio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataFim\",\"dbName\":\"data_fim\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoInicial\",\"dbName\":\"saldo_inicial\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoFinal\",\"dbName\":\"saldo_final\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusConciliacao\",\"default\":\"EM_ANDAMENTO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divergencias\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Json\",\"default\":\"[]\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"dbName\":\"atualizado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false,\"documentation\":\"Processo de reconciliar saldo do sistema com extrato bancário.\"},\"EventoProcessado\":{\"dbName\":\"eventos_processados\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Nome lógico do evento consumido (ex. \\\"pedido.faturado\\\", \\\"pedido.pago\\\").\"},{\"name\":\"referenciaId\",\"dbName\":\"referencia_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false,\"documentation\":\"Identificador do agregado de referência (ex. pedidoId).\"},{\"name\":\"processadoEm\",\"dbName\":\"processado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"evento\",\"referenciaId\"]],\"uniqueIndexes\":[{\"name\":\"evento_referenciaId\",\"fields\":[\"evento\",\"referenciaId\"]}],\"isGenerated\":false,\"documentation\":\"Registra eventos já consumidos para garantir idempotência no processamento\\\\nda SAGA (reentregas do broker não reaplicam o efeito colateral).\\\\nDedup por (evento, referenciaId) — ex. (\\\"pedido.faturado\\\", pedidoId).\"},\"DRE\":{\"dbName\":\"dres\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"dbName\":\"tenant_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ano\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receitaBruta\",\"dbName\":\"receita_bruta\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deducoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receitaLiquida\",\"dbName\":\"receita_liquida\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"custosMercadorias\",\"dbName\":\"custos_mercadorias\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lucroBruto\",\"dbName\":\"lucro_bruto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"despesasOperacionais\",\"dbName\":\"despesas_operacionais\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"despesasAdministrativas\",\"dbName\":\"despesas_administrativas\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"despesasComerciais\",\"dbName\":\"despesas_comerciais\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resultadoOperacional\",\"dbName\":\"resultado_operacional\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"despesasFinanceiras\",\"dbName\":\"despesas_financeiras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"receitasFinanceiras\",\"dbName\":\"receitas_financeiras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lucroLiquido\",\"dbName\":\"lucro_liquido\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"dbName\":\"criado_em\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"ano\",\"mes\"]],\"uniqueIndexes\":[{\"name\":\"tenantId_ano_mes\",\"fields\":[\"tenantId\",\"ano\",\"mes\"]}],\"isGenerated\":false,\"documentation\":\"Relatório financeiro mensal/anual.\"}},\"enums\":{\"TipoLancamento\":{\"values\":[{\"name\":\"RECEITA\",\"dbName\":null},{\"name\":\"DESPESA\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null}],\"dbName\":null},\"StatusLancamento\":{\"values\":[{\"name\":\"PENDENTE\",\"dbName\":null},{\"name\":\"PAGO\",\"dbName\":null},{\"name\":\"ATRASADO\",\"dbName\":null},{\"name\":\"CANCELADO\",\"dbName\":null},{\"name\":\"PARCIAL\",\"dbName\":null}],\"dbName\":null},\"FormaPagamento\":{\"values\":[{\"name\":\"DINHEIRO\",\"dbName\":null},{\"name\":\"PIX\",\"dbName\":null},{\"name\":\"CARTAO_CREDITO\",\"dbName\":null},{\"name\":\"CARTAO_DEBITO\",\"dbName\":null},{\"name\":\"BOLETO\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"TED\",\"dbName\":null},{\"name\":\"DOC\",\"dbName\":null},{\"name\":\"CHEQUE\",\"dbName\":null},{\"name\":\"OUTRO\",\"dbName\":null}],\"dbName\":null},\"TipoConta\":{\"values\":[{\"name\":\"CORRENTE\",\"dbName\":null},{\"name\":\"POUPANCA\",\"dbName\":null},{\"name\":\"INVESTIMENTO\",\"dbName\":null},{\"name\":\"CAIXA\",\"dbName\":null},{\"name\":\"CARTAO\",\"dbName\":null},{\"name\":\"DIGITAL\",\"dbName\":null}],\"dbName\":null},\"TipoCategoriaFinanceira\":{\"values\":[{\"name\":\"RECEITA\",\"dbName\":null},{\"name\":\"DESPESA\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Categorias hierárquicas para organizar receitas e despesas.\"},\"FrequenciaRecorrencia\":{\"values\":[{\"name\":\"DIARIA\",\"dbName\":null},{\"name\":\"SEMANAL\",\"dbName\":null},{\"name\":\"QUINZENAL\",\"dbName\":null},{\"name\":\"MENSAL\",\"dbName\":null},{\"name\":\"BIMESTRAL\",\"dbName\":null},{\"name\":\"TRIMESTRAL\",\"dbName\":null},{\"name\":\"SEMESTRAL\",\"dbName\":null},{\"name\":\"ANUAL\",\"dbName\":null}],\"dbName\":null},\"StatusConciliacao\":{\"values\":[{\"name\":\"EM_ANDAMENTO\",\"dbName\":null},{\"name\":\"CONCLUIDA\",\"dbName\":null},{\"name\":\"DIVERGENTE\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
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
