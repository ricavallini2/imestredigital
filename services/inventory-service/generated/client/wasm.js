
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
