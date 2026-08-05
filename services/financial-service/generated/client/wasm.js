
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.Prisma.TituloCobrancaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  lancamentoId: 'lancamentoId',
  pedidoId: 'pedidoId',
  clienteId: 'clienteId',
  clienteNome: 'clienteNome',
  clienteTelefone: 'clienteTelefone',
  clienteEmail: 'clienteEmail',
  descricao: 'descricao',
  valor: 'valor',
  dataVencimento: 'dataVencimento',
  status: 'status',
  prioridade: 'prioridade',
  tentativas: 'tentativas',
  ultimaAcaoEm: 'ultimaAcaoEm',
  canalUltimaAcao: 'canalUltimaAcao',
  observacao: 'observacao',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.AcaoCobrancaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  tituloId: 'tituloId',
  clienteNome: 'clienteNome',
  tipo: 'tipo',
  mensagem: 'mensagem',
  status: 'status',
  automatica: 'automatica',
  detalhe: 'detalhe',
  criadoEm: 'criadoEm'
};

exports.Prisma.AcordoCobrancaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  tituloId: 'tituloId',
  clienteId: 'clienteId',
  clienteNome: 'clienteNome',
  valorOriginal: 'valorOriginal',
  descontoAplicado: 'descontoAplicado',
  valorFinal: 'valorFinal',
  numeroParcelas: 'numeroParcelas',
  status: 'status',
  observacao: 'observacao',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.ParcelaAcordoScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  acordoId: 'acordoId',
  numero: 'numero',
  valor: 'valor',
  vencimento: 'vencimento',
  pago: 'pago',
  pagoEm: 'pagoEm'
};

exports.Prisma.ConfiguracaoCobrancaScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  ativo: 'ativo',
  webhookN8n: 'webhookN8n',
  callbackUrl: 'callbackUrl',
  regras: 'regras',
  descontoMaximo: 'descontoMaximo',
  parcelasMaximas: 'parcelasMaximas',
  horarioInicio: 'horarioInicio',
  horarioFim: 'horarioFim',
  pausarFimDeSemana: 'pausarFimDeSemana',
  criadoEm: 'criadoEm',
  atualizadoEm: 'atualizadoEm'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
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

exports.StatusTituloCobranca = exports.$Enums.StatusTituloCobranca = {
  EM_ABERTO: 'EM_ABERTO',
  EM_COBRANCA: 'EM_COBRANCA',
  NEGOCIANDO: 'NEGOCIANDO',
  ACORDO: 'ACORDO',
  PAGO: 'PAGO',
  PERDIDO: 'PERDIDO'
};

exports.PrioridadeCobranca = exports.$Enums.PrioridadeCobranca = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA'
};

exports.TipoAcaoCobranca = exports.$Enums.TipoAcaoCobranca = {
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  LIGACAO: 'LIGACAO'
};

exports.StatusAcaoCobranca = exports.$Enums.StatusAcaoCobranca = {
  ENVIADO: 'ENVIADO',
  ENTREGUE: 'ENTREGUE',
  LIDO: 'LIDO',
  RESPONDIDO: 'RESPONDIDO',
  FALHOU: 'FALHOU'
};

exports.StatusAcordoCobranca = exports.$Enums.StatusAcordoCobranca = {
  ATIVO: 'ATIVO',
  CUMPRIDO: 'CUMPRIDO',
  QUEBRADO: 'QUEBRADO'
};

exports.Prisma.ModelName = {
  ContaFinanceira: 'ContaFinanceira',
  Lancamento: 'Lancamento',
  CategoriaFinanceira: 'CategoriaFinanceira',
  Recorrencia: 'Recorrencia',
  ConciliacaoBancaria: 'ConciliacaoBancaria',
  EventoProcessado: 'EventoProcessado',
  DRE: 'DRE',
  TituloCobranca: 'TituloCobranca',
  AcaoCobranca: 'AcaoCobranca',
  AcordoCobranca: 'AcordoCobranca',
  ParcelaAcordo: 'ParcelaAcordo',
  ConfiguracaoCobranca: 'ConfiguracaoCobranca'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
