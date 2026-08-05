
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ContaFinanceira
 * Representação de uma conta bancária ou financeira da empresa.
 * Tipos: corrente, poupança, caixa, cartão, digital, etc.
 */
export type ContaFinanceira = $Result.DefaultSelection<Prisma.$ContaFinanceiraPayload>
/**
 * Model Lancamento
 * Transação financeira: receita, despesa ou transferência.
 * Pode ser pago/recebido ou permanecer em aberto.
 */
export type Lancamento = $Result.DefaultSelection<Prisma.$LancamentoPayload>
/**
 * Model CategoriaFinanceira
 * 
 */
export type CategoriaFinanceira = $Result.DefaultSelection<Prisma.$CategoriaFinanceiraPayload>
/**
 * Model Recorrencia
 * Configuração para gerar lançamentos automaticamente.
 * Exemplo: aluguel todo mês, no dia 5.
 */
export type Recorrencia = $Result.DefaultSelection<Prisma.$RecorrenciaPayload>
/**
 * Model ConciliacaoBancaria
 * Processo de reconciliar saldo do sistema com extrato bancário.
 */
export type ConciliacaoBancaria = $Result.DefaultSelection<Prisma.$ConciliacaoBancariaPayload>
/**
 * Model EventoProcessado
 * Registra eventos já consumidos para garantir idempotência no processamento
 * da SAGA (reentregas do broker não reaplicam o efeito colateral).
 * Dedup por (evento, referenciaId) — ex. ("pedido.faturado", pedidoId).
 */
export type EventoProcessado = $Result.DefaultSelection<Prisma.$EventoProcessadoPayload>
/**
 * Model DRE
 * Relatório financeiro mensal/anual.
 */
export type DRE = $Result.DefaultSelection<Prisma.$DREPayload>
/**
 * Model TituloCobranca
 * 
 */
export type TituloCobranca = $Result.DefaultSelection<Prisma.$TituloCobrancaPayload>
/**
 * Model AcaoCobranca
 * 
 */
export type AcaoCobranca = $Result.DefaultSelection<Prisma.$AcaoCobrancaPayload>
/**
 * Model AcordoCobranca
 * 
 */
export type AcordoCobranca = $Result.DefaultSelection<Prisma.$AcordoCobrancaPayload>
/**
 * Model ParcelaAcordo
 * 
 */
export type ParcelaAcordo = $Result.DefaultSelection<Prisma.$ParcelaAcordoPayload>
/**
 * Model ConfiguracaoCobranca
 * 
 */
export type ConfiguracaoCobranca = $Result.DefaultSelection<Prisma.$ConfiguracaoCobrancaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoConta: {
  CORRENTE: 'CORRENTE',
  POUPANCA: 'POUPANCA',
  INVESTIMENTO: 'INVESTIMENTO',
  CAIXA: 'CAIXA',
  CARTAO: 'CARTAO',
  DIGITAL: 'DIGITAL'
};

export type TipoConta = (typeof TipoConta)[keyof typeof TipoConta]


export const TipoLancamento: {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA',
  TRANSFERENCIA: 'TRANSFERENCIA'
};

export type TipoLancamento = (typeof TipoLancamento)[keyof typeof TipoLancamento]


export const StatusLancamento: {
  PENDENTE: 'PENDENTE',
  PAGO: 'PAGO',
  ATRASADO: 'ATRASADO',
  CANCELADO: 'CANCELADO',
  PARCIAL: 'PARCIAL'
};

export type StatusLancamento = (typeof StatusLancamento)[keyof typeof StatusLancamento]


export const FormaPagamento: {
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

export type FormaPagamento = (typeof FormaPagamento)[keyof typeof FormaPagamento]


export const TipoCategoriaFinanceira: {
  RECEITA: 'RECEITA',
  DESPESA: 'DESPESA'
};

export type TipoCategoriaFinanceira = (typeof TipoCategoriaFinanceira)[keyof typeof TipoCategoriaFinanceira]


export const FrequenciaRecorrencia: {
  DIARIA: 'DIARIA',
  SEMANAL: 'SEMANAL',
  QUINZENAL: 'QUINZENAL',
  MENSAL: 'MENSAL',
  BIMESTRAL: 'BIMESTRAL',
  TRIMESTRAL: 'TRIMESTRAL',
  SEMESTRAL: 'SEMESTRAL',
  ANUAL: 'ANUAL'
};

export type FrequenciaRecorrencia = (typeof FrequenciaRecorrencia)[keyof typeof FrequenciaRecorrencia]


export const StatusConciliacao: {
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  DIVERGENTE: 'DIVERGENTE'
};

export type StatusConciliacao = (typeof StatusConciliacao)[keyof typeof StatusConciliacao]


export const StatusTituloCobranca: {
  EM_ABERTO: 'EM_ABERTO',
  EM_COBRANCA: 'EM_COBRANCA',
  NEGOCIANDO: 'NEGOCIANDO',
  ACORDO: 'ACORDO',
  PAGO: 'PAGO',
  PERDIDO: 'PERDIDO'
};

export type StatusTituloCobranca = (typeof StatusTituloCobranca)[keyof typeof StatusTituloCobranca]


export const PrioridadeCobranca: {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA'
};

export type PrioridadeCobranca = (typeof PrioridadeCobranca)[keyof typeof PrioridadeCobranca]


export const TipoAcaoCobranca: {
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  LIGACAO: 'LIGACAO'
};

export type TipoAcaoCobranca = (typeof TipoAcaoCobranca)[keyof typeof TipoAcaoCobranca]


export const StatusAcaoCobranca: {
  ENVIADO: 'ENVIADO',
  ENTREGUE: 'ENTREGUE',
  LIDO: 'LIDO',
  RESPONDIDO: 'RESPONDIDO',
  FALHOU: 'FALHOU'
};

export type StatusAcaoCobranca = (typeof StatusAcaoCobranca)[keyof typeof StatusAcaoCobranca]


export const StatusAcordoCobranca: {
  ATIVO: 'ATIVO',
  CUMPRIDO: 'CUMPRIDO',
  QUEBRADO: 'QUEBRADO'
};

export type StatusAcordoCobranca = (typeof StatusAcordoCobranca)[keyof typeof StatusAcordoCobranca]

}

export type TipoConta = $Enums.TipoConta

export const TipoConta: typeof $Enums.TipoConta

export type TipoLancamento = $Enums.TipoLancamento

export const TipoLancamento: typeof $Enums.TipoLancamento

export type StatusLancamento = $Enums.StatusLancamento

export const StatusLancamento: typeof $Enums.StatusLancamento

export type FormaPagamento = $Enums.FormaPagamento

export const FormaPagamento: typeof $Enums.FormaPagamento

export type TipoCategoriaFinanceira = $Enums.TipoCategoriaFinanceira

export const TipoCategoriaFinanceira: typeof $Enums.TipoCategoriaFinanceira

export type FrequenciaRecorrencia = $Enums.FrequenciaRecorrencia

export const FrequenciaRecorrencia: typeof $Enums.FrequenciaRecorrencia

export type StatusConciliacao = $Enums.StatusConciliacao

export const StatusConciliacao: typeof $Enums.StatusConciliacao

export type StatusTituloCobranca = $Enums.StatusTituloCobranca

export const StatusTituloCobranca: typeof $Enums.StatusTituloCobranca

export type PrioridadeCobranca = $Enums.PrioridadeCobranca

export const PrioridadeCobranca: typeof $Enums.PrioridadeCobranca

export type TipoAcaoCobranca = $Enums.TipoAcaoCobranca

export const TipoAcaoCobranca: typeof $Enums.TipoAcaoCobranca

export type StatusAcaoCobranca = $Enums.StatusAcaoCobranca

export const StatusAcaoCobranca: typeof $Enums.StatusAcaoCobranca

export type StatusAcordoCobranca = $Enums.StatusAcordoCobranca

export const StatusAcordoCobranca: typeof $Enums.StatusAcordoCobranca

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ContaFinanceiras
 * const contaFinanceiras = await prisma.contaFinanceira.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ContaFinanceiras
   * const contaFinanceiras = await prisma.contaFinanceira.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.contaFinanceira`: Exposes CRUD operations for the **ContaFinanceira** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContaFinanceiras
    * const contaFinanceiras = await prisma.contaFinanceira.findMany()
    * ```
    */
  get contaFinanceira(): Prisma.ContaFinanceiraDelegate<ExtArgs>;

  /**
   * `prisma.lancamento`: Exposes CRUD operations for the **Lancamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lancamentos
    * const lancamentos = await prisma.lancamento.findMany()
    * ```
    */
  get lancamento(): Prisma.LancamentoDelegate<ExtArgs>;

  /**
   * `prisma.categoriaFinanceira`: Exposes CRUD operations for the **CategoriaFinanceira** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CategoriaFinanceiras
    * const categoriaFinanceiras = await prisma.categoriaFinanceira.findMany()
    * ```
    */
  get categoriaFinanceira(): Prisma.CategoriaFinanceiraDelegate<ExtArgs>;

  /**
   * `prisma.recorrencia`: Exposes CRUD operations for the **Recorrencia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Recorrencias
    * const recorrencias = await prisma.recorrencia.findMany()
    * ```
    */
  get recorrencia(): Prisma.RecorrenciaDelegate<ExtArgs>;

  /**
   * `prisma.conciliacaoBancaria`: Exposes CRUD operations for the **ConciliacaoBancaria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConciliacaoBancarias
    * const conciliacaoBancarias = await prisma.conciliacaoBancaria.findMany()
    * ```
    */
  get conciliacaoBancaria(): Prisma.ConciliacaoBancariaDelegate<ExtArgs>;

  /**
   * `prisma.eventoProcessado`: Exposes CRUD operations for the **EventoProcessado** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventoProcessados
    * const eventoProcessados = await prisma.eventoProcessado.findMany()
    * ```
    */
  get eventoProcessado(): Prisma.EventoProcessadoDelegate<ExtArgs>;

  /**
   * `prisma.dRE`: Exposes CRUD operations for the **DRE** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DRES
    * const dRES = await prisma.dRE.findMany()
    * ```
    */
  get dRE(): Prisma.DREDelegate<ExtArgs>;

  /**
   * `prisma.tituloCobranca`: Exposes CRUD operations for the **TituloCobranca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TituloCobrancas
    * const tituloCobrancas = await prisma.tituloCobranca.findMany()
    * ```
    */
  get tituloCobranca(): Prisma.TituloCobrancaDelegate<ExtArgs>;

  /**
   * `prisma.acaoCobranca`: Exposes CRUD operations for the **AcaoCobranca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AcaoCobrancas
    * const acaoCobrancas = await prisma.acaoCobranca.findMany()
    * ```
    */
  get acaoCobranca(): Prisma.AcaoCobrancaDelegate<ExtArgs>;

  /**
   * `prisma.acordoCobranca`: Exposes CRUD operations for the **AcordoCobranca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AcordoCobrancas
    * const acordoCobrancas = await prisma.acordoCobranca.findMany()
    * ```
    */
  get acordoCobranca(): Prisma.AcordoCobrancaDelegate<ExtArgs>;

  /**
   * `prisma.parcelaAcordo`: Exposes CRUD operations for the **ParcelaAcordo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ParcelaAcordos
    * const parcelaAcordos = await prisma.parcelaAcordo.findMany()
    * ```
    */
  get parcelaAcordo(): Prisma.ParcelaAcordoDelegate<ExtArgs>;

  /**
   * `prisma.configuracaoCobranca`: Exposes CRUD operations for the **ConfiguracaoCobranca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfiguracaoCobrancas
    * const configuracaoCobrancas = await prisma.configuracaoCobranca.findMany()
    * ```
    */
  get configuracaoCobranca(): Prisma.ConfiguracaoCobrancaDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "contaFinanceira" | "lancamento" | "categoriaFinanceira" | "recorrencia" | "conciliacaoBancaria" | "eventoProcessado" | "dRE" | "tituloCobranca" | "acaoCobranca" | "acordoCobranca" | "parcelaAcordo" | "configuracaoCobranca"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ContaFinanceira: {
        payload: Prisma.$ContaFinanceiraPayload<ExtArgs>
        fields: Prisma.ContaFinanceiraFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContaFinanceiraFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContaFinanceiraFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          findFirst: {
            args: Prisma.ContaFinanceiraFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContaFinanceiraFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          findMany: {
            args: Prisma.ContaFinanceiraFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>[]
          }
          create: {
            args: Prisma.ContaFinanceiraCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          createMany: {
            args: Prisma.ContaFinanceiraCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContaFinanceiraCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>[]
          }
          delete: {
            args: Prisma.ContaFinanceiraDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          update: {
            args: Prisma.ContaFinanceiraUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          deleteMany: {
            args: Prisma.ContaFinanceiraDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContaFinanceiraUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ContaFinanceiraUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContaFinanceiraPayload>
          }
          aggregate: {
            args: Prisma.ContaFinanceiraAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContaFinanceira>
          }
          groupBy: {
            args: Prisma.ContaFinanceiraGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContaFinanceiraGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContaFinanceiraCountArgs<ExtArgs>
            result: $Utils.Optional<ContaFinanceiraCountAggregateOutputType> | number
          }
        }
      }
      Lancamento: {
        payload: Prisma.$LancamentoPayload<ExtArgs>
        fields: Prisma.LancamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LancamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LancamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          findFirst: {
            args: Prisma.LancamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LancamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          findMany: {
            args: Prisma.LancamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>[]
          }
          create: {
            args: Prisma.LancamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          createMany: {
            args: Prisma.LancamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LancamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>[]
          }
          delete: {
            args: Prisma.LancamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          update: {
            args: Prisma.LancamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          deleteMany: {
            args: Prisma.LancamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LancamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LancamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LancamentoPayload>
          }
          aggregate: {
            args: Prisma.LancamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLancamento>
          }
          groupBy: {
            args: Prisma.LancamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<LancamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.LancamentoCountArgs<ExtArgs>
            result: $Utils.Optional<LancamentoCountAggregateOutputType> | number
          }
        }
      }
      CategoriaFinanceira: {
        payload: Prisma.$CategoriaFinanceiraPayload<ExtArgs>
        fields: Prisma.CategoriaFinanceiraFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoriaFinanceiraFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoriaFinanceiraFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          findFirst: {
            args: Prisma.CategoriaFinanceiraFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoriaFinanceiraFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          findMany: {
            args: Prisma.CategoriaFinanceiraFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>[]
          }
          create: {
            args: Prisma.CategoriaFinanceiraCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          createMany: {
            args: Prisma.CategoriaFinanceiraCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoriaFinanceiraCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>[]
          }
          delete: {
            args: Prisma.CategoriaFinanceiraDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          update: {
            args: Prisma.CategoriaFinanceiraUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          deleteMany: {
            args: Prisma.CategoriaFinanceiraDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoriaFinanceiraUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoriaFinanceiraUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaFinanceiraPayload>
          }
          aggregate: {
            args: Prisma.CategoriaFinanceiraAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoriaFinanceira>
          }
          groupBy: {
            args: Prisma.CategoriaFinanceiraGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoriaFinanceiraGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoriaFinanceiraCountArgs<ExtArgs>
            result: $Utils.Optional<CategoriaFinanceiraCountAggregateOutputType> | number
          }
        }
      }
      Recorrencia: {
        payload: Prisma.$RecorrenciaPayload<ExtArgs>
        fields: Prisma.RecorrenciaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecorrenciaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecorrenciaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          findFirst: {
            args: Prisma.RecorrenciaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecorrenciaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          findMany: {
            args: Prisma.RecorrenciaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>[]
          }
          create: {
            args: Prisma.RecorrenciaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          createMany: {
            args: Prisma.RecorrenciaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecorrenciaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>[]
          }
          delete: {
            args: Prisma.RecorrenciaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          update: {
            args: Prisma.RecorrenciaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          deleteMany: {
            args: Prisma.RecorrenciaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecorrenciaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RecorrenciaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecorrenciaPayload>
          }
          aggregate: {
            args: Prisma.RecorrenciaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecorrencia>
          }
          groupBy: {
            args: Prisma.RecorrenciaGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecorrenciaGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecorrenciaCountArgs<ExtArgs>
            result: $Utils.Optional<RecorrenciaCountAggregateOutputType> | number
          }
        }
      }
      ConciliacaoBancaria: {
        payload: Prisma.$ConciliacaoBancariaPayload<ExtArgs>
        fields: Prisma.ConciliacaoBancariaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConciliacaoBancariaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConciliacaoBancariaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          findFirst: {
            args: Prisma.ConciliacaoBancariaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConciliacaoBancariaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          findMany: {
            args: Prisma.ConciliacaoBancariaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>[]
          }
          create: {
            args: Prisma.ConciliacaoBancariaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          createMany: {
            args: Prisma.ConciliacaoBancariaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConciliacaoBancariaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>[]
          }
          delete: {
            args: Prisma.ConciliacaoBancariaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          update: {
            args: Prisma.ConciliacaoBancariaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          deleteMany: {
            args: Prisma.ConciliacaoBancariaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConciliacaoBancariaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConciliacaoBancariaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConciliacaoBancariaPayload>
          }
          aggregate: {
            args: Prisma.ConciliacaoBancariaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConciliacaoBancaria>
          }
          groupBy: {
            args: Prisma.ConciliacaoBancariaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConciliacaoBancariaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConciliacaoBancariaCountArgs<ExtArgs>
            result: $Utils.Optional<ConciliacaoBancariaCountAggregateOutputType> | number
          }
        }
      }
      EventoProcessado: {
        payload: Prisma.$EventoProcessadoPayload<ExtArgs>
        fields: Prisma.EventoProcessadoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventoProcessadoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventoProcessadoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          findFirst: {
            args: Prisma.EventoProcessadoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventoProcessadoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          findMany: {
            args: Prisma.EventoProcessadoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>[]
          }
          create: {
            args: Prisma.EventoProcessadoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          createMany: {
            args: Prisma.EventoProcessadoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventoProcessadoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>[]
          }
          delete: {
            args: Prisma.EventoProcessadoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          update: {
            args: Prisma.EventoProcessadoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          deleteMany: {
            args: Prisma.EventoProcessadoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventoProcessadoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EventoProcessadoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventoProcessadoPayload>
          }
          aggregate: {
            args: Prisma.EventoProcessadoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventoProcessado>
          }
          groupBy: {
            args: Prisma.EventoProcessadoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventoProcessadoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventoProcessadoCountArgs<ExtArgs>
            result: $Utils.Optional<EventoProcessadoCountAggregateOutputType> | number
          }
        }
      }
      DRE: {
        payload: Prisma.$DREPayload<ExtArgs>
        fields: Prisma.DREFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DREFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DREFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          findFirst: {
            args: Prisma.DREFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DREFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          findMany: {
            args: Prisma.DREFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>[]
          }
          create: {
            args: Prisma.DRECreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          createMany: {
            args: Prisma.DRECreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DRECreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>[]
          }
          delete: {
            args: Prisma.DREDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          update: {
            args: Prisma.DREUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          deleteMany: {
            args: Prisma.DREDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DREUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DREUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DREPayload>
          }
          aggregate: {
            args: Prisma.DREAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDRE>
          }
          groupBy: {
            args: Prisma.DREGroupByArgs<ExtArgs>
            result: $Utils.Optional<DREGroupByOutputType>[]
          }
          count: {
            args: Prisma.DRECountArgs<ExtArgs>
            result: $Utils.Optional<DRECountAggregateOutputType> | number
          }
        }
      }
      TituloCobranca: {
        payload: Prisma.$TituloCobrancaPayload<ExtArgs>
        fields: Prisma.TituloCobrancaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TituloCobrancaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TituloCobrancaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          findFirst: {
            args: Prisma.TituloCobrancaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TituloCobrancaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          findMany: {
            args: Prisma.TituloCobrancaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>[]
          }
          create: {
            args: Prisma.TituloCobrancaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          createMany: {
            args: Prisma.TituloCobrancaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TituloCobrancaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>[]
          }
          delete: {
            args: Prisma.TituloCobrancaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          update: {
            args: Prisma.TituloCobrancaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          deleteMany: {
            args: Prisma.TituloCobrancaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TituloCobrancaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TituloCobrancaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TituloCobrancaPayload>
          }
          aggregate: {
            args: Prisma.TituloCobrancaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTituloCobranca>
          }
          groupBy: {
            args: Prisma.TituloCobrancaGroupByArgs<ExtArgs>
            result: $Utils.Optional<TituloCobrancaGroupByOutputType>[]
          }
          count: {
            args: Prisma.TituloCobrancaCountArgs<ExtArgs>
            result: $Utils.Optional<TituloCobrancaCountAggregateOutputType> | number
          }
        }
      }
      AcaoCobranca: {
        payload: Prisma.$AcaoCobrancaPayload<ExtArgs>
        fields: Prisma.AcaoCobrancaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AcaoCobrancaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AcaoCobrancaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          findFirst: {
            args: Prisma.AcaoCobrancaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AcaoCobrancaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          findMany: {
            args: Prisma.AcaoCobrancaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>[]
          }
          create: {
            args: Prisma.AcaoCobrancaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          createMany: {
            args: Prisma.AcaoCobrancaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AcaoCobrancaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>[]
          }
          delete: {
            args: Prisma.AcaoCobrancaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          update: {
            args: Prisma.AcaoCobrancaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          deleteMany: {
            args: Prisma.AcaoCobrancaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AcaoCobrancaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AcaoCobrancaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcaoCobrancaPayload>
          }
          aggregate: {
            args: Prisma.AcaoCobrancaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAcaoCobranca>
          }
          groupBy: {
            args: Prisma.AcaoCobrancaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AcaoCobrancaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AcaoCobrancaCountArgs<ExtArgs>
            result: $Utils.Optional<AcaoCobrancaCountAggregateOutputType> | number
          }
        }
      }
      AcordoCobranca: {
        payload: Prisma.$AcordoCobrancaPayload<ExtArgs>
        fields: Prisma.AcordoCobrancaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AcordoCobrancaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AcordoCobrancaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          findFirst: {
            args: Prisma.AcordoCobrancaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AcordoCobrancaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          findMany: {
            args: Prisma.AcordoCobrancaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>[]
          }
          create: {
            args: Prisma.AcordoCobrancaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          createMany: {
            args: Prisma.AcordoCobrancaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AcordoCobrancaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>[]
          }
          delete: {
            args: Prisma.AcordoCobrancaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          update: {
            args: Prisma.AcordoCobrancaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          deleteMany: {
            args: Prisma.AcordoCobrancaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AcordoCobrancaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AcordoCobrancaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AcordoCobrancaPayload>
          }
          aggregate: {
            args: Prisma.AcordoCobrancaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAcordoCobranca>
          }
          groupBy: {
            args: Prisma.AcordoCobrancaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AcordoCobrancaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AcordoCobrancaCountArgs<ExtArgs>
            result: $Utils.Optional<AcordoCobrancaCountAggregateOutputType> | number
          }
        }
      }
      ParcelaAcordo: {
        payload: Prisma.$ParcelaAcordoPayload<ExtArgs>
        fields: Prisma.ParcelaAcordoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ParcelaAcordoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ParcelaAcordoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          findFirst: {
            args: Prisma.ParcelaAcordoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ParcelaAcordoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          findMany: {
            args: Prisma.ParcelaAcordoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>[]
          }
          create: {
            args: Prisma.ParcelaAcordoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          createMany: {
            args: Prisma.ParcelaAcordoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ParcelaAcordoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>[]
          }
          delete: {
            args: Prisma.ParcelaAcordoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          update: {
            args: Prisma.ParcelaAcordoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          deleteMany: {
            args: Prisma.ParcelaAcordoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ParcelaAcordoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ParcelaAcordoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ParcelaAcordoPayload>
          }
          aggregate: {
            args: Prisma.ParcelaAcordoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParcelaAcordo>
          }
          groupBy: {
            args: Prisma.ParcelaAcordoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ParcelaAcordoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ParcelaAcordoCountArgs<ExtArgs>
            result: $Utils.Optional<ParcelaAcordoCountAggregateOutputType> | number
          }
        }
      }
      ConfiguracaoCobranca: {
        payload: Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>
        fields: Prisma.ConfiguracaoCobrancaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfiguracaoCobrancaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfiguracaoCobrancaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          findFirst: {
            args: Prisma.ConfiguracaoCobrancaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfiguracaoCobrancaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          findMany: {
            args: Prisma.ConfiguracaoCobrancaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>[]
          }
          create: {
            args: Prisma.ConfiguracaoCobrancaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          createMany: {
            args: Prisma.ConfiguracaoCobrancaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfiguracaoCobrancaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>[]
          }
          delete: {
            args: Prisma.ConfiguracaoCobrancaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          update: {
            args: Prisma.ConfiguracaoCobrancaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          deleteMany: {
            args: Prisma.ConfiguracaoCobrancaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfiguracaoCobrancaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConfiguracaoCobrancaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoCobrancaPayload>
          }
          aggregate: {
            args: Prisma.ConfiguracaoCobrancaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfiguracaoCobranca>
          }
          groupBy: {
            args: Prisma.ConfiguracaoCobrancaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoCobrancaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfiguracaoCobrancaCountArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoCobrancaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ContaFinanceiraCountOutputType
   */

  export type ContaFinanceiraCountOutputType = {
    lancamentos: number
    transferenciasOrigem: number
    transferenciasDestino: number
    recorrencias: number
    conciliacoes: number
  }

  export type ContaFinanceiraCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lancamentos?: boolean | ContaFinanceiraCountOutputTypeCountLancamentosArgs
    transferenciasOrigem?: boolean | ContaFinanceiraCountOutputTypeCountTransferenciasOrigemArgs
    transferenciasDestino?: boolean | ContaFinanceiraCountOutputTypeCountTransferenciasDestinoArgs
    recorrencias?: boolean | ContaFinanceiraCountOutputTypeCountRecorrenciasArgs
    conciliacoes?: boolean | ContaFinanceiraCountOutputTypeCountConciliacoesArgs
  }

  // Custom InputTypes
  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceiraCountOutputType
     */
    select?: ContaFinanceiraCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeCountLancamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LancamentoWhereInput
  }

  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeCountTransferenciasOrigemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LancamentoWhereInput
  }

  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeCountTransferenciasDestinoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LancamentoWhereInput
  }

  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeCountRecorrenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecorrenciaWhereInput
  }

  /**
   * ContaFinanceiraCountOutputType without action
   */
  export type ContaFinanceiraCountOutputTypeCountConciliacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConciliacaoBancariaWhereInput
  }


  /**
   * Count Type CategoriaFinanceiraCountOutputType
   */

  export type CategoriaFinanceiraCountOutputType = {
    filhos: number
  }

  export type CategoriaFinanceiraCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    filhos?: boolean | CategoriaFinanceiraCountOutputTypeCountFilhosArgs
  }

  // Custom InputTypes
  /**
   * CategoriaFinanceiraCountOutputType without action
   */
  export type CategoriaFinanceiraCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceiraCountOutputType
     */
    select?: CategoriaFinanceiraCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoriaFinanceiraCountOutputType without action
   */
  export type CategoriaFinanceiraCountOutputTypeCountFilhosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriaFinanceiraWhereInput
  }


  /**
   * Count Type RecorrenciaCountOutputType
   */

  export type RecorrenciaCountOutputType = {
    lancamentos: number
  }

  export type RecorrenciaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lancamentos?: boolean | RecorrenciaCountOutputTypeCountLancamentosArgs
  }

  // Custom InputTypes
  /**
   * RecorrenciaCountOutputType without action
   */
  export type RecorrenciaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecorrenciaCountOutputType
     */
    select?: RecorrenciaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RecorrenciaCountOutputType without action
   */
  export type RecorrenciaCountOutputTypeCountLancamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LancamentoWhereInput
  }


  /**
   * Count Type TituloCobrancaCountOutputType
   */

  export type TituloCobrancaCountOutputType = {
    acoes: number
    acordos: number
  }

  export type TituloCobrancaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acoes?: boolean | TituloCobrancaCountOutputTypeCountAcoesArgs
    acordos?: boolean | TituloCobrancaCountOutputTypeCountAcordosArgs
  }

  // Custom InputTypes
  /**
   * TituloCobrancaCountOutputType without action
   */
  export type TituloCobrancaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobrancaCountOutputType
     */
    select?: TituloCobrancaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TituloCobrancaCountOutputType without action
   */
  export type TituloCobrancaCountOutputTypeCountAcoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AcaoCobrancaWhereInput
  }

  /**
   * TituloCobrancaCountOutputType without action
   */
  export type TituloCobrancaCountOutputTypeCountAcordosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AcordoCobrancaWhereInput
  }


  /**
   * Count Type AcordoCobrancaCountOutputType
   */

  export type AcordoCobrancaCountOutputType = {
    parcelas: number
  }

  export type AcordoCobrancaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parcelas?: boolean | AcordoCobrancaCountOutputTypeCountParcelasArgs
  }

  // Custom InputTypes
  /**
   * AcordoCobrancaCountOutputType without action
   */
  export type AcordoCobrancaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobrancaCountOutputType
     */
    select?: AcordoCobrancaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AcordoCobrancaCountOutputType without action
   */
  export type AcordoCobrancaCountOutputTypeCountParcelasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParcelaAcordoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ContaFinanceira
   */

  export type AggregateContaFinanceira = {
    _count: ContaFinanceiraCountAggregateOutputType | null
    _avg: ContaFinanceiraAvgAggregateOutputType | null
    _sum: ContaFinanceiraSumAggregateOutputType | null
    _min: ContaFinanceiraMinAggregateOutputType | null
    _max: ContaFinanceiraMaxAggregateOutputType | null
  }

  export type ContaFinanceiraAvgAggregateOutputType = {
    saldoAtual: Decimal | null
    saldoInicial: Decimal | null
  }

  export type ContaFinanceiraSumAggregateOutputType = {
    saldoAtual: Decimal | null
    saldoInicial: Decimal | null
  }

  export type ContaFinanceiraMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    tipo: $Enums.TipoConta | null
    banco: string | null
    agencia: string | null
    conta: string | null
    saldoAtual: Decimal | null
    saldoInicial: Decimal | null
    ativa: boolean | null
    cor: string | null
    icone: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ContaFinanceiraMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    tipo: $Enums.TipoConta | null
    banco: string | null
    agencia: string | null
    conta: string | null
    saldoAtual: Decimal | null
    saldoInicial: Decimal | null
    ativa: boolean | null
    cor: string | null
    icone: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ContaFinanceiraCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    tipo: number
    banco: number
    agencia: number
    conta: number
    saldoAtual: number
    saldoInicial: number
    ativa: number
    cor: number
    icone: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type ContaFinanceiraAvgAggregateInputType = {
    saldoAtual?: true
    saldoInicial?: true
  }

  export type ContaFinanceiraSumAggregateInputType = {
    saldoAtual?: true
    saldoInicial?: true
  }

  export type ContaFinanceiraMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    banco?: true
    agencia?: true
    conta?: true
    saldoAtual?: true
    saldoInicial?: true
    ativa?: true
    cor?: true
    icone?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ContaFinanceiraMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    banco?: true
    agencia?: true
    conta?: true
    saldoAtual?: true
    saldoInicial?: true
    ativa?: true
    cor?: true
    icone?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ContaFinanceiraCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    banco?: true
    agencia?: true
    conta?: true
    saldoAtual?: true
    saldoInicial?: true
    ativa?: true
    cor?: true
    icone?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type ContaFinanceiraAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContaFinanceira to aggregate.
     */
    where?: ContaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContaFinanceiras to fetch.
     */
    orderBy?: ContaFinanceiraOrderByWithRelationInput | ContaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContaFinanceiras
    **/
    _count?: true | ContaFinanceiraCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ContaFinanceiraAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ContaFinanceiraSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContaFinanceiraMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContaFinanceiraMaxAggregateInputType
  }

  export type GetContaFinanceiraAggregateType<T extends ContaFinanceiraAggregateArgs> = {
        [P in keyof T & keyof AggregateContaFinanceira]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContaFinanceira[P]>
      : GetScalarType<T[P], AggregateContaFinanceira[P]>
  }




  export type ContaFinanceiraGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContaFinanceiraWhereInput
    orderBy?: ContaFinanceiraOrderByWithAggregationInput | ContaFinanceiraOrderByWithAggregationInput[]
    by: ContaFinanceiraScalarFieldEnum[] | ContaFinanceiraScalarFieldEnum
    having?: ContaFinanceiraScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContaFinanceiraCountAggregateInputType | true
    _avg?: ContaFinanceiraAvgAggregateInputType
    _sum?: ContaFinanceiraSumAggregateInputType
    _min?: ContaFinanceiraMinAggregateInputType
    _max?: ContaFinanceiraMaxAggregateInputType
  }

  export type ContaFinanceiraGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco: string | null
    agencia: string | null
    conta: string | null
    saldoAtual: Decimal
    saldoInicial: Decimal
    ativa: boolean
    cor: string | null
    icone: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: ContaFinanceiraCountAggregateOutputType | null
    _avg: ContaFinanceiraAvgAggregateOutputType | null
    _sum: ContaFinanceiraSumAggregateOutputType | null
    _min: ContaFinanceiraMinAggregateOutputType | null
    _max: ContaFinanceiraMaxAggregateOutputType | null
  }

  type GetContaFinanceiraGroupByPayload<T extends ContaFinanceiraGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContaFinanceiraGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContaFinanceiraGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContaFinanceiraGroupByOutputType[P]>
            : GetScalarType<T[P], ContaFinanceiraGroupByOutputType[P]>
        }
      >
    >


  export type ContaFinanceiraSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    banco?: boolean
    agencia?: boolean
    conta?: boolean
    saldoAtual?: boolean
    saldoInicial?: boolean
    ativa?: boolean
    cor?: boolean
    icone?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    lancamentos?: boolean | ContaFinanceira$lancamentosArgs<ExtArgs>
    transferenciasOrigem?: boolean | ContaFinanceira$transferenciasOrigemArgs<ExtArgs>
    transferenciasDestino?: boolean | ContaFinanceira$transferenciasDestinoArgs<ExtArgs>
    recorrencias?: boolean | ContaFinanceira$recorrenciasArgs<ExtArgs>
    conciliacoes?: boolean | ContaFinanceira$conciliacoesArgs<ExtArgs>
    _count?: boolean | ContaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contaFinanceira"]>

  export type ContaFinanceiraSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    banco?: boolean
    agencia?: boolean
    conta?: boolean
    saldoAtual?: boolean
    saldoInicial?: boolean
    ativa?: boolean
    cor?: boolean
    icone?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["contaFinanceira"]>

  export type ContaFinanceiraSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    banco?: boolean
    agencia?: boolean
    conta?: boolean
    saldoAtual?: boolean
    saldoInicial?: boolean
    ativa?: boolean
    cor?: boolean
    icone?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type ContaFinanceiraInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lancamentos?: boolean | ContaFinanceira$lancamentosArgs<ExtArgs>
    transferenciasOrigem?: boolean | ContaFinanceira$transferenciasOrigemArgs<ExtArgs>
    transferenciasDestino?: boolean | ContaFinanceira$transferenciasDestinoArgs<ExtArgs>
    recorrencias?: boolean | ContaFinanceira$recorrenciasArgs<ExtArgs>
    conciliacoes?: boolean | ContaFinanceira$conciliacoesArgs<ExtArgs>
    _count?: boolean | ContaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ContaFinanceiraIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ContaFinanceiraPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContaFinanceira"
    objects: {
      lancamentos: Prisma.$LancamentoPayload<ExtArgs>[]
      transferenciasOrigem: Prisma.$LancamentoPayload<ExtArgs>[]
      transferenciasDestino: Prisma.$LancamentoPayload<ExtArgs>[]
      recorrencias: Prisma.$RecorrenciaPayload<ExtArgs>[]
      conciliacoes: Prisma.$ConciliacaoBancariaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      tipo: $Enums.TipoConta
      banco: string | null
      agencia: string | null
      conta: string | null
      saldoAtual: Prisma.Decimal
      saldoInicial: Prisma.Decimal
      ativa: boolean
      cor: string | null
      icone: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["contaFinanceira"]>
    composites: {}
  }

  type ContaFinanceiraGetPayload<S extends boolean | null | undefined | ContaFinanceiraDefaultArgs> = $Result.GetResult<Prisma.$ContaFinanceiraPayload, S>

  type ContaFinanceiraCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ContaFinanceiraFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ContaFinanceiraCountAggregateInputType | true
    }

  export interface ContaFinanceiraDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContaFinanceira'], meta: { name: 'ContaFinanceira' } }
    /**
     * Find zero or one ContaFinanceira that matches the filter.
     * @param {ContaFinanceiraFindUniqueArgs} args - Arguments to find a ContaFinanceira
     * @example
     * // Get one ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContaFinanceiraFindUniqueArgs>(args: SelectSubset<T, ContaFinanceiraFindUniqueArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ContaFinanceira that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ContaFinanceiraFindUniqueOrThrowArgs} args - Arguments to find a ContaFinanceira
     * @example
     * // Get one ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContaFinanceiraFindUniqueOrThrowArgs>(args: SelectSubset<T, ContaFinanceiraFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ContaFinanceira that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraFindFirstArgs} args - Arguments to find a ContaFinanceira
     * @example
     * // Get one ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContaFinanceiraFindFirstArgs>(args?: SelectSubset<T, ContaFinanceiraFindFirstArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ContaFinanceira that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraFindFirstOrThrowArgs} args - Arguments to find a ContaFinanceira
     * @example
     * // Get one ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContaFinanceiraFindFirstOrThrowArgs>(args?: SelectSubset<T, ContaFinanceiraFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ContaFinanceiras that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContaFinanceiras
     * const contaFinanceiras = await prisma.contaFinanceira.findMany()
     * 
     * // Get first 10 ContaFinanceiras
     * const contaFinanceiras = await prisma.contaFinanceira.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contaFinanceiraWithIdOnly = await prisma.contaFinanceira.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContaFinanceiraFindManyArgs>(args?: SelectSubset<T, ContaFinanceiraFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ContaFinanceira.
     * @param {ContaFinanceiraCreateArgs} args - Arguments to create a ContaFinanceira.
     * @example
     * // Create one ContaFinanceira
     * const ContaFinanceira = await prisma.contaFinanceira.create({
     *   data: {
     *     // ... data to create a ContaFinanceira
     *   }
     * })
     * 
     */
    create<T extends ContaFinanceiraCreateArgs>(args: SelectSubset<T, ContaFinanceiraCreateArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ContaFinanceiras.
     * @param {ContaFinanceiraCreateManyArgs} args - Arguments to create many ContaFinanceiras.
     * @example
     * // Create many ContaFinanceiras
     * const contaFinanceira = await prisma.contaFinanceira.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContaFinanceiraCreateManyArgs>(args?: SelectSubset<T, ContaFinanceiraCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContaFinanceiras and returns the data saved in the database.
     * @param {ContaFinanceiraCreateManyAndReturnArgs} args - Arguments to create many ContaFinanceiras.
     * @example
     * // Create many ContaFinanceiras
     * const contaFinanceira = await prisma.contaFinanceira.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContaFinanceiras and only return the `id`
     * const contaFinanceiraWithIdOnly = await prisma.contaFinanceira.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContaFinanceiraCreateManyAndReturnArgs>(args?: SelectSubset<T, ContaFinanceiraCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ContaFinanceira.
     * @param {ContaFinanceiraDeleteArgs} args - Arguments to delete one ContaFinanceira.
     * @example
     * // Delete one ContaFinanceira
     * const ContaFinanceira = await prisma.contaFinanceira.delete({
     *   where: {
     *     // ... filter to delete one ContaFinanceira
     *   }
     * })
     * 
     */
    delete<T extends ContaFinanceiraDeleteArgs>(args: SelectSubset<T, ContaFinanceiraDeleteArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ContaFinanceira.
     * @param {ContaFinanceiraUpdateArgs} args - Arguments to update one ContaFinanceira.
     * @example
     * // Update one ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContaFinanceiraUpdateArgs>(args: SelectSubset<T, ContaFinanceiraUpdateArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ContaFinanceiras.
     * @param {ContaFinanceiraDeleteManyArgs} args - Arguments to filter ContaFinanceiras to delete.
     * @example
     * // Delete a few ContaFinanceiras
     * const { count } = await prisma.contaFinanceira.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContaFinanceiraDeleteManyArgs>(args?: SelectSubset<T, ContaFinanceiraDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContaFinanceiras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContaFinanceiras
     * const contaFinanceira = await prisma.contaFinanceira.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContaFinanceiraUpdateManyArgs>(args: SelectSubset<T, ContaFinanceiraUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ContaFinanceira.
     * @param {ContaFinanceiraUpsertArgs} args - Arguments to update or create a ContaFinanceira.
     * @example
     * // Update or create a ContaFinanceira
     * const contaFinanceira = await prisma.contaFinanceira.upsert({
     *   create: {
     *     // ... data to create a ContaFinanceira
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContaFinanceira we want to update
     *   }
     * })
     */
    upsert<T extends ContaFinanceiraUpsertArgs>(args: SelectSubset<T, ContaFinanceiraUpsertArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ContaFinanceiras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraCountArgs} args - Arguments to filter ContaFinanceiras to count.
     * @example
     * // Count the number of ContaFinanceiras
     * const count = await prisma.contaFinanceira.count({
     *   where: {
     *     // ... the filter for the ContaFinanceiras we want to count
     *   }
     * })
    **/
    count<T extends ContaFinanceiraCountArgs>(
      args?: Subset<T, ContaFinanceiraCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContaFinanceiraCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContaFinanceira.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ContaFinanceiraAggregateArgs>(args: Subset<T, ContaFinanceiraAggregateArgs>): Prisma.PrismaPromise<GetContaFinanceiraAggregateType<T>>

    /**
     * Group by ContaFinanceira.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContaFinanceiraGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ContaFinanceiraGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContaFinanceiraGroupByArgs['orderBy'] }
        : { orderBy?: ContaFinanceiraGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ContaFinanceiraGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContaFinanceiraGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContaFinanceira model
   */
  readonly fields: ContaFinanceiraFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContaFinanceira.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContaFinanceiraClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lancamentos<T extends ContaFinanceira$lancamentosArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceira$lancamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findMany"> | Null>
    transferenciasOrigem<T extends ContaFinanceira$transferenciasOrigemArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceira$transferenciasOrigemArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findMany"> | Null>
    transferenciasDestino<T extends ContaFinanceira$transferenciasDestinoArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceira$transferenciasDestinoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findMany"> | Null>
    recorrencias<T extends ContaFinanceira$recorrenciasArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceira$recorrenciasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findMany"> | Null>
    conciliacoes<T extends ContaFinanceira$conciliacoesArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceira$conciliacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ContaFinanceira model
   */ 
  interface ContaFinanceiraFieldRefs {
    readonly id: FieldRef<"ContaFinanceira", 'String'>
    readonly tenantId: FieldRef<"ContaFinanceira", 'String'>
    readonly nome: FieldRef<"ContaFinanceira", 'String'>
    readonly tipo: FieldRef<"ContaFinanceira", 'TipoConta'>
    readonly banco: FieldRef<"ContaFinanceira", 'String'>
    readonly agencia: FieldRef<"ContaFinanceira", 'String'>
    readonly conta: FieldRef<"ContaFinanceira", 'String'>
    readonly saldoAtual: FieldRef<"ContaFinanceira", 'Decimal'>
    readonly saldoInicial: FieldRef<"ContaFinanceira", 'Decimal'>
    readonly ativa: FieldRef<"ContaFinanceira", 'Boolean'>
    readonly cor: FieldRef<"ContaFinanceira", 'String'>
    readonly icone: FieldRef<"ContaFinanceira", 'String'>
    readonly criadoEm: FieldRef<"ContaFinanceira", 'DateTime'>
    readonly atualizadoEm: FieldRef<"ContaFinanceira", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContaFinanceira findUnique
   */
  export type ContaFinanceiraFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which ContaFinanceira to fetch.
     */
    where: ContaFinanceiraWhereUniqueInput
  }

  /**
   * ContaFinanceira findUniqueOrThrow
   */
  export type ContaFinanceiraFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which ContaFinanceira to fetch.
     */
    where: ContaFinanceiraWhereUniqueInput
  }

  /**
   * ContaFinanceira findFirst
   */
  export type ContaFinanceiraFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which ContaFinanceira to fetch.
     */
    where?: ContaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContaFinanceiras to fetch.
     */
    orderBy?: ContaFinanceiraOrderByWithRelationInput | ContaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContaFinanceiras.
     */
    cursor?: ContaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContaFinanceiras.
     */
    distinct?: ContaFinanceiraScalarFieldEnum | ContaFinanceiraScalarFieldEnum[]
  }

  /**
   * ContaFinanceira findFirstOrThrow
   */
  export type ContaFinanceiraFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which ContaFinanceira to fetch.
     */
    where?: ContaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContaFinanceiras to fetch.
     */
    orderBy?: ContaFinanceiraOrderByWithRelationInput | ContaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContaFinanceiras.
     */
    cursor?: ContaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContaFinanceiras.
     */
    distinct?: ContaFinanceiraScalarFieldEnum | ContaFinanceiraScalarFieldEnum[]
  }

  /**
   * ContaFinanceira findMany
   */
  export type ContaFinanceiraFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which ContaFinanceiras to fetch.
     */
    where?: ContaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContaFinanceiras to fetch.
     */
    orderBy?: ContaFinanceiraOrderByWithRelationInput | ContaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContaFinanceiras.
     */
    cursor?: ContaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContaFinanceiras.
     */
    skip?: number
    distinct?: ContaFinanceiraScalarFieldEnum | ContaFinanceiraScalarFieldEnum[]
  }

  /**
   * ContaFinanceira create
   */
  export type ContaFinanceiraCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * The data needed to create a ContaFinanceira.
     */
    data: XOR<ContaFinanceiraCreateInput, ContaFinanceiraUncheckedCreateInput>
  }

  /**
   * ContaFinanceira createMany
   */
  export type ContaFinanceiraCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContaFinanceiras.
     */
    data: ContaFinanceiraCreateManyInput | ContaFinanceiraCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContaFinanceira createManyAndReturn
   */
  export type ContaFinanceiraCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ContaFinanceiras.
     */
    data: ContaFinanceiraCreateManyInput | ContaFinanceiraCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContaFinanceira update
   */
  export type ContaFinanceiraUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * The data needed to update a ContaFinanceira.
     */
    data: XOR<ContaFinanceiraUpdateInput, ContaFinanceiraUncheckedUpdateInput>
    /**
     * Choose, which ContaFinanceira to update.
     */
    where: ContaFinanceiraWhereUniqueInput
  }

  /**
   * ContaFinanceira updateMany
   */
  export type ContaFinanceiraUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContaFinanceiras.
     */
    data: XOR<ContaFinanceiraUpdateManyMutationInput, ContaFinanceiraUncheckedUpdateManyInput>
    /**
     * Filter which ContaFinanceiras to update
     */
    where?: ContaFinanceiraWhereInput
  }

  /**
   * ContaFinanceira upsert
   */
  export type ContaFinanceiraUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * The filter to search for the ContaFinanceira to update in case it exists.
     */
    where: ContaFinanceiraWhereUniqueInput
    /**
     * In case the ContaFinanceira found by the `where` argument doesn't exist, create a new ContaFinanceira with this data.
     */
    create: XOR<ContaFinanceiraCreateInput, ContaFinanceiraUncheckedCreateInput>
    /**
     * In case the ContaFinanceira was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContaFinanceiraUpdateInput, ContaFinanceiraUncheckedUpdateInput>
  }

  /**
   * ContaFinanceira delete
   */
  export type ContaFinanceiraDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter which ContaFinanceira to delete.
     */
    where: ContaFinanceiraWhereUniqueInput
  }

  /**
   * ContaFinanceira deleteMany
   */
  export type ContaFinanceiraDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContaFinanceiras to delete
     */
    where?: ContaFinanceiraWhereInput
  }

  /**
   * ContaFinanceira.lancamentos
   */
  export type ContaFinanceira$lancamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    where?: LancamentoWhereInput
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    cursor?: LancamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * ContaFinanceira.transferenciasOrigem
   */
  export type ContaFinanceira$transferenciasOrigemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    where?: LancamentoWhereInput
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    cursor?: LancamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * ContaFinanceira.transferenciasDestino
   */
  export type ContaFinanceira$transferenciasDestinoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    where?: LancamentoWhereInput
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    cursor?: LancamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * ContaFinanceira.recorrencias
   */
  export type ContaFinanceira$recorrenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    where?: RecorrenciaWhereInput
    orderBy?: RecorrenciaOrderByWithRelationInput | RecorrenciaOrderByWithRelationInput[]
    cursor?: RecorrenciaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RecorrenciaScalarFieldEnum | RecorrenciaScalarFieldEnum[]
  }

  /**
   * ContaFinanceira.conciliacoes
   */
  export type ContaFinanceira$conciliacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    where?: ConciliacaoBancariaWhereInput
    orderBy?: ConciliacaoBancariaOrderByWithRelationInput | ConciliacaoBancariaOrderByWithRelationInput[]
    cursor?: ConciliacaoBancariaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConciliacaoBancariaScalarFieldEnum | ConciliacaoBancariaScalarFieldEnum[]
  }

  /**
   * ContaFinanceira without action
   */
  export type ContaFinanceiraDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
  }


  /**
   * Model Lancamento
   */

  export type AggregateLancamento = {
    _count: LancamentoCountAggregateOutputType | null
    _avg: LancamentoAvgAggregateOutputType | null
    _sum: LancamentoSumAggregateOutputType | null
    _min: LancamentoMinAggregateOutputType | null
    _max: LancamentoMaxAggregateOutputType | null
  }

  export type LancamentoAvgAggregateOutputType = {
    valor: Decimal | null
    numeroParcela: number | null
    totalParcelas: number | null
  }

  export type LancamentoSumAggregateOutputType = {
    valor: Decimal | null
    numeroParcela: number | null
    totalParcelas: number | null
  }

  export type LancamentoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    usuarioId: string | null
    tipo: $Enums.TipoLancamento | null
    categoria: string | null
    subcategoria: string | null
    descricao: string | null
    valor: Decimal | null
    dataVencimento: Date | null
    dataPagamento: Date | null
    dataCompetencia: Date | null
    status: $Enums.StatusLancamento | null
    formaPagamento: $Enums.FormaPagamento | null
    numeroParcela: number | null
    totalParcelas: number | null
    parcelaOrigemId: string | null
    pedidoId: string | null
    notaFiscalId: string | null
    fornecedor: string | null
    cliente: string | null
    observacao: string | null
    recorrente: boolean | null
    recorrenciaId: string | null
    anexoUrl: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
    contaOrigemId: string | null
    contaDestinoId: string | null
  }

  export type LancamentoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    usuarioId: string | null
    tipo: $Enums.TipoLancamento | null
    categoria: string | null
    subcategoria: string | null
    descricao: string | null
    valor: Decimal | null
    dataVencimento: Date | null
    dataPagamento: Date | null
    dataCompetencia: Date | null
    status: $Enums.StatusLancamento | null
    formaPagamento: $Enums.FormaPagamento | null
    numeroParcela: number | null
    totalParcelas: number | null
    parcelaOrigemId: string | null
    pedidoId: string | null
    notaFiscalId: string | null
    fornecedor: string | null
    cliente: string | null
    observacao: string | null
    recorrente: boolean | null
    recorrenciaId: string | null
    anexoUrl: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
    contaOrigemId: string | null
    contaDestinoId: string | null
  }

  export type LancamentoCountAggregateOutputType = {
    id: number
    tenantId: number
    contaId: number
    usuarioId: number
    tipo: number
    categoria: number
    subcategoria: number
    descricao: number
    valor: number
    dataVencimento: number
    dataPagamento: number
    dataCompetencia: number
    status: number
    formaPagamento: number
    numeroParcela: number
    totalParcelas: number
    parcelaOrigemId: number
    pedidoId: number
    notaFiscalId: number
    fornecedor: number
    cliente: number
    observacao: number
    tags: number
    recorrente: number
    recorrenciaId: number
    anexoUrl: number
    criadoEm: number
    atualizadoEm: number
    contaOrigemId: number
    contaDestinoId: number
    _all: number
  }


  export type LancamentoAvgAggregateInputType = {
    valor?: true
    numeroParcela?: true
    totalParcelas?: true
  }

  export type LancamentoSumAggregateInputType = {
    valor?: true
    numeroParcela?: true
    totalParcelas?: true
  }

  export type LancamentoMinAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    usuarioId?: true
    tipo?: true
    categoria?: true
    subcategoria?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    dataPagamento?: true
    dataCompetencia?: true
    status?: true
    formaPagamento?: true
    numeroParcela?: true
    totalParcelas?: true
    parcelaOrigemId?: true
    pedidoId?: true
    notaFiscalId?: true
    fornecedor?: true
    cliente?: true
    observacao?: true
    recorrente?: true
    recorrenciaId?: true
    anexoUrl?: true
    criadoEm?: true
    atualizadoEm?: true
    contaOrigemId?: true
    contaDestinoId?: true
  }

  export type LancamentoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    usuarioId?: true
    tipo?: true
    categoria?: true
    subcategoria?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    dataPagamento?: true
    dataCompetencia?: true
    status?: true
    formaPagamento?: true
    numeroParcela?: true
    totalParcelas?: true
    parcelaOrigemId?: true
    pedidoId?: true
    notaFiscalId?: true
    fornecedor?: true
    cliente?: true
    observacao?: true
    recorrente?: true
    recorrenciaId?: true
    anexoUrl?: true
    criadoEm?: true
    atualizadoEm?: true
    contaOrigemId?: true
    contaDestinoId?: true
  }

  export type LancamentoCountAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    usuarioId?: true
    tipo?: true
    categoria?: true
    subcategoria?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    dataPagamento?: true
    dataCompetencia?: true
    status?: true
    formaPagamento?: true
    numeroParcela?: true
    totalParcelas?: true
    parcelaOrigemId?: true
    pedidoId?: true
    notaFiscalId?: true
    fornecedor?: true
    cliente?: true
    observacao?: true
    tags?: true
    recorrente?: true
    recorrenciaId?: true
    anexoUrl?: true
    criadoEm?: true
    atualizadoEm?: true
    contaOrigemId?: true
    contaDestinoId?: true
    _all?: true
  }

  export type LancamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lancamento to aggregate.
     */
    where?: LancamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lancamentos to fetch.
     */
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LancamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lancamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lancamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lancamentos
    **/
    _count?: true | LancamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LancamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LancamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LancamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LancamentoMaxAggregateInputType
  }

  export type GetLancamentoAggregateType<T extends LancamentoAggregateArgs> = {
        [P in keyof T & keyof AggregateLancamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLancamento[P]>
      : GetScalarType<T[P], AggregateLancamento[P]>
  }




  export type LancamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LancamentoWhereInput
    orderBy?: LancamentoOrderByWithAggregationInput | LancamentoOrderByWithAggregationInput[]
    by: LancamentoScalarFieldEnum[] | LancamentoScalarFieldEnum
    having?: LancamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LancamentoCountAggregateInputType | true
    _avg?: LancamentoAvgAggregateInputType
    _sum?: LancamentoSumAggregateInputType
    _min?: LancamentoMinAggregateInputType
    _max?: LancamentoMaxAggregateInputType
  }

  export type LancamentoGroupByOutputType = {
    id: string
    tenantId: string
    contaId: string | null
    usuarioId: string | null
    tipo: $Enums.TipoLancamento
    categoria: string | null
    subcategoria: string | null
    descricao: string
    valor: Decimal
    dataVencimento: Date
    dataPagamento: Date | null
    dataCompetencia: Date | null
    status: $Enums.StatusLancamento
    formaPagamento: $Enums.FormaPagamento | null
    numeroParcela: number | null
    totalParcelas: number | null
    parcelaOrigemId: string | null
    pedidoId: string | null
    notaFiscalId: string | null
    fornecedor: string | null
    cliente: string | null
    observacao: string | null
    tags: string[]
    recorrente: boolean
    recorrenciaId: string | null
    anexoUrl: string | null
    criadoEm: Date
    atualizadoEm: Date
    contaOrigemId: string | null
    contaDestinoId: string | null
    _count: LancamentoCountAggregateOutputType | null
    _avg: LancamentoAvgAggregateOutputType | null
    _sum: LancamentoSumAggregateOutputType | null
    _min: LancamentoMinAggregateOutputType | null
    _max: LancamentoMaxAggregateOutputType | null
  }

  type GetLancamentoGroupByPayload<T extends LancamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LancamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LancamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LancamentoGroupByOutputType[P]>
            : GetScalarType<T[P], LancamentoGroupByOutputType[P]>
        }
      >
    >


  export type LancamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    usuarioId?: boolean
    tipo?: boolean
    categoria?: boolean
    subcategoria?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    dataPagamento?: boolean
    dataCompetencia?: boolean
    status?: boolean
    formaPagamento?: boolean
    numeroParcela?: boolean
    totalParcelas?: boolean
    parcelaOrigemId?: boolean
    pedidoId?: boolean
    notaFiscalId?: boolean
    fornecedor?: boolean
    cliente?: boolean
    observacao?: boolean
    tags?: boolean
    recorrente?: boolean
    recorrenciaId?: boolean
    anexoUrl?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    contaOrigemId?: boolean
    contaDestinoId?: boolean
    conta?: boolean | Lancamento$contaArgs<ExtArgs>
    recorrencia?: boolean | Lancamento$recorrenciaArgs<ExtArgs>
    contaOrigem?: boolean | Lancamento$contaOrigemArgs<ExtArgs>
    contaDestino?: boolean | Lancamento$contaDestinoArgs<ExtArgs>
  }, ExtArgs["result"]["lancamento"]>

  export type LancamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    usuarioId?: boolean
    tipo?: boolean
    categoria?: boolean
    subcategoria?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    dataPagamento?: boolean
    dataCompetencia?: boolean
    status?: boolean
    formaPagamento?: boolean
    numeroParcela?: boolean
    totalParcelas?: boolean
    parcelaOrigemId?: boolean
    pedidoId?: boolean
    notaFiscalId?: boolean
    fornecedor?: boolean
    cliente?: boolean
    observacao?: boolean
    tags?: boolean
    recorrente?: boolean
    recorrenciaId?: boolean
    anexoUrl?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    contaOrigemId?: boolean
    contaDestinoId?: boolean
    conta?: boolean | Lancamento$contaArgs<ExtArgs>
    recorrencia?: boolean | Lancamento$recorrenciaArgs<ExtArgs>
    contaOrigem?: boolean | Lancamento$contaOrigemArgs<ExtArgs>
    contaDestino?: boolean | Lancamento$contaDestinoArgs<ExtArgs>
  }, ExtArgs["result"]["lancamento"]>

  export type LancamentoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    usuarioId?: boolean
    tipo?: boolean
    categoria?: boolean
    subcategoria?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    dataPagamento?: boolean
    dataCompetencia?: boolean
    status?: boolean
    formaPagamento?: boolean
    numeroParcela?: boolean
    totalParcelas?: boolean
    parcelaOrigemId?: boolean
    pedidoId?: boolean
    notaFiscalId?: boolean
    fornecedor?: boolean
    cliente?: boolean
    observacao?: boolean
    tags?: boolean
    recorrente?: boolean
    recorrenciaId?: boolean
    anexoUrl?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    contaOrigemId?: boolean
    contaDestinoId?: boolean
  }

  export type LancamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | Lancamento$contaArgs<ExtArgs>
    recorrencia?: boolean | Lancamento$recorrenciaArgs<ExtArgs>
    contaOrigem?: boolean | Lancamento$contaOrigemArgs<ExtArgs>
    contaDestino?: boolean | Lancamento$contaDestinoArgs<ExtArgs>
  }
  export type LancamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | Lancamento$contaArgs<ExtArgs>
    recorrencia?: boolean | Lancamento$recorrenciaArgs<ExtArgs>
    contaOrigem?: boolean | Lancamento$contaOrigemArgs<ExtArgs>
    contaDestino?: boolean | Lancamento$contaDestinoArgs<ExtArgs>
  }

  export type $LancamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lancamento"
    objects: {
      conta: Prisma.$ContaFinanceiraPayload<ExtArgs> | null
      recorrencia: Prisma.$RecorrenciaPayload<ExtArgs> | null
      contaOrigem: Prisma.$ContaFinanceiraPayload<ExtArgs> | null
      contaDestino: Prisma.$ContaFinanceiraPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      contaId: string | null
      usuarioId: string | null
      tipo: $Enums.TipoLancamento
      categoria: string | null
      subcategoria: string | null
      descricao: string
      valor: Prisma.Decimal
      dataVencimento: Date
      dataPagamento: Date | null
      dataCompetencia: Date | null
      status: $Enums.StatusLancamento
      formaPagamento: $Enums.FormaPagamento | null
      numeroParcela: number | null
      totalParcelas: number | null
      parcelaOrigemId: string | null
      pedidoId: string | null
      notaFiscalId: string | null
      fornecedor: string | null
      cliente: string | null
      observacao: string | null
      tags: string[]
      recorrente: boolean
      recorrenciaId: string | null
      anexoUrl: string | null
      criadoEm: Date
      atualizadoEm: Date
      contaOrigemId: string | null
      contaDestinoId: string | null
    }, ExtArgs["result"]["lancamento"]>
    composites: {}
  }

  type LancamentoGetPayload<S extends boolean | null | undefined | LancamentoDefaultArgs> = $Result.GetResult<Prisma.$LancamentoPayload, S>

  type LancamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LancamentoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LancamentoCountAggregateInputType | true
    }

  export interface LancamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lancamento'], meta: { name: 'Lancamento' } }
    /**
     * Find zero or one Lancamento that matches the filter.
     * @param {LancamentoFindUniqueArgs} args - Arguments to find a Lancamento
     * @example
     * // Get one Lancamento
     * const lancamento = await prisma.lancamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LancamentoFindUniqueArgs>(args: SelectSubset<T, LancamentoFindUniqueArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Lancamento that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LancamentoFindUniqueOrThrowArgs} args - Arguments to find a Lancamento
     * @example
     * // Get one Lancamento
     * const lancamento = await prisma.lancamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LancamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, LancamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Lancamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoFindFirstArgs} args - Arguments to find a Lancamento
     * @example
     * // Get one Lancamento
     * const lancamento = await prisma.lancamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LancamentoFindFirstArgs>(args?: SelectSubset<T, LancamentoFindFirstArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Lancamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoFindFirstOrThrowArgs} args - Arguments to find a Lancamento
     * @example
     * // Get one Lancamento
     * const lancamento = await prisma.lancamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LancamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, LancamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Lancamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lancamentos
     * const lancamentos = await prisma.lancamento.findMany()
     * 
     * // Get first 10 Lancamentos
     * const lancamentos = await prisma.lancamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lancamentoWithIdOnly = await prisma.lancamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LancamentoFindManyArgs>(args?: SelectSubset<T, LancamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Lancamento.
     * @param {LancamentoCreateArgs} args - Arguments to create a Lancamento.
     * @example
     * // Create one Lancamento
     * const Lancamento = await prisma.lancamento.create({
     *   data: {
     *     // ... data to create a Lancamento
     *   }
     * })
     * 
     */
    create<T extends LancamentoCreateArgs>(args: SelectSubset<T, LancamentoCreateArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Lancamentos.
     * @param {LancamentoCreateManyArgs} args - Arguments to create many Lancamentos.
     * @example
     * // Create many Lancamentos
     * const lancamento = await prisma.lancamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LancamentoCreateManyArgs>(args?: SelectSubset<T, LancamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lancamentos and returns the data saved in the database.
     * @param {LancamentoCreateManyAndReturnArgs} args - Arguments to create many Lancamentos.
     * @example
     * // Create many Lancamentos
     * const lancamento = await prisma.lancamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lancamentos and only return the `id`
     * const lancamentoWithIdOnly = await prisma.lancamento.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LancamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, LancamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Lancamento.
     * @param {LancamentoDeleteArgs} args - Arguments to delete one Lancamento.
     * @example
     * // Delete one Lancamento
     * const Lancamento = await prisma.lancamento.delete({
     *   where: {
     *     // ... filter to delete one Lancamento
     *   }
     * })
     * 
     */
    delete<T extends LancamentoDeleteArgs>(args: SelectSubset<T, LancamentoDeleteArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Lancamento.
     * @param {LancamentoUpdateArgs} args - Arguments to update one Lancamento.
     * @example
     * // Update one Lancamento
     * const lancamento = await prisma.lancamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LancamentoUpdateArgs>(args: SelectSubset<T, LancamentoUpdateArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Lancamentos.
     * @param {LancamentoDeleteManyArgs} args - Arguments to filter Lancamentos to delete.
     * @example
     * // Delete a few Lancamentos
     * const { count } = await prisma.lancamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LancamentoDeleteManyArgs>(args?: SelectSubset<T, LancamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lancamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lancamentos
     * const lancamento = await prisma.lancamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LancamentoUpdateManyArgs>(args: SelectSubset<T, LancamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Lancamento.
     * @param {LancamentoUpsertArgs} args - Arguments to update or create a Lancamento.
     * @example
     * // Update or create a Lancamento
     * const lancamento = await prisma.lancamento.upsert({
     *   create: {
     *     // ... data to create a Lancamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lancamento we want to update
     *   }
     * })
     */
    upsert<T extends LancamentoUpsertArgs>(args: SelectSubset<T, LancamentoUpsertArgs<ExtArgs>>): Prisma__LancamentoClient<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Lancamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoCountArgs} args - Arguments to filter Lancamentos to count.
     * @example
     * // Count the number of Lancamentos
     * const count = await prisma.lancamento.count({
     *   where: {
     *     // ... the filter for the Lancamentos we want to count
     *   }
     * })
    **/
    count<T extends LancamentoCountArgs>(
      args?: Subset<T, LancamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LancamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lancamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LancamentoAggregateArgs>(args: Subset<T, LancamentoAggregateArgs>): Prisma.PrismaPromise<GetLancamentoAggregateType<T>>

    /**
     * Group by Lancamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LancamentoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LancamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LancamentoGroupByArgs['orderBy'] }
        : { orderBy?: LancamentoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LancamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLancamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lancamento model
   */
  readonly fields: LancamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lancamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LancamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conta<T extends Lancamento$contaArgs<ExtArgs> = {}>(args?: Subset<T, Lancamento$contaArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    recorrencia<T extends Lancamento$recorrenciaArgs<ExtArgs> = {}>(args?: Subset<T, Lancamento$recorrenciaArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    contaOrigem<T extends Lancamento$contaOrigemArgs<ExtArgs> = {}>(args?: Subset<T, Lancamento$contaOrigemArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    contaDestino<T extends Lancamento$contaDestinoArgs<ExtArgs> = {}>(args?: Subset<T, Lancamento$contaDestinoArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lancamento model
   */ 
  interface LancamentoFieldRefs {
    readonly id: FieldRef<"Lancamento", 'String'>
    readonly tenantId: FieldRef<"Lancamento", 'String'>
    readonly contaId: FieldRef<"Lancamento", 'String'>
    readonly usuarioId: FieldRef<"Lancamento", 'String'>
    readonly tipo: FieldRef<"Lancamento", 'TipoLancamento'>
    readonly categoria: FieldRef<"Lancamento", 'String'>
    readonly subcategoria: FieldRef<"Lancamento", 'String'>
    readonly descricao: FieldRef<"Lancamento", 'String'>
    readonly valor: FieldRef<"Lancamento", 'Decimal'>
    readonly dataVencimento: FieldRef<"Lancamento", 'DateTime'>
    readonly dataPagamento: FieldRef<"Lancamento", 'DateTime'>
    readonly dataCompetencia: FieldRef<"Lancamento", 'DateTime'>
    readonly status: FieldRef<"Lancamento", 'StatusLancamento'>
    readonly formaPagamento: FieldRef<"Lancamento", 'FormaPagamento'>
    readonly numeroParcela: FieldRef<"Lancamento", 'Int'>
    readonly totalParcelas: FieldRef<"Lancamento", 'Int'>
    readonly parcelaOrigemId: FieldRef<"Lancamento", 'String'>
    readonly pedidoId: FieldRef<"Lancamento", 'String'>
    readonly notaFiscalId: FieldRef<"Lancamento", 'String'>
    readonly fornecedor: FieldRef<"Lancamento", 'String'>
    readonly cliente: FieldRef<"Lancamento", 'String'>
    readonly observacao: FieldRef<"Lancamento", 'String'>
    readonly tags: FieldRef<"Lancamento", 'String[]'>
    readonly recorrente: FieldRef<"Lancamento", 'Boolean'>
    readonly recorrenciaId: FieldRef<"Lancamento", 'String'>
    readonly anexoUrl: FieldRef<"Lancamento", 'String'>
    readonly criadoEm: FieldRef<"Lancamento", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Lancamento", 'DateTime'>
    readonly contaOrigemId: FieldRef<"Lancamento", 'String'>
    readonly contaDestinoId: FieldRef<"Lancamento", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lancamento findUnique
   */
  export type LancamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter, which Lancamento to fetch.
     */
    where: LancamentoWhereUniqueInput
  }

  /**
   * Lancamento findUniqueOrThrow
   */
  export type LancamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter, which Lancamento to fetch.
     */
    where: LancamentoWhereUniqueInput
  }

  /**
   * Lancamento findFirst
   */
  export type LancamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter, which Lancamento to fetch.
     */
    where?: LancamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lancamentos to fetch.
     */
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lancamentos.
     */
    cursor?: LancamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lancamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lancamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lancamentos.
     */
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * Lancamento findFirstOrThrow
   */
  export type LancamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter, which Lancamento to fetch.
     */
    where?: LancamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lancamentos to fetch.
     */
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lancamentos.
     */
    cursor?: LancamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lancamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lancamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lancamentos.
     */
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * Lancamento findMany
   */
  export type LancamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter, which Lancamentos to fetch.
     */
    where?: LancamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lancamentos to fetch.
     */
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lancamentos.
     */
    cursor?: LancamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lancamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lancamentos.
     */
    skip?: number
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * Lancamento create
   */
  export type LancamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a Lancamento.
     */
    data: XOR<LancamentoCreateInput, LancamentoUncheckedCreateInput>
  }

  /**
   * Lancamento createMany
   */
  export type LancamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lancamentos.
     */
    data: LancamentoCreateManyInput | LancamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lancamento createManyAndReturn
   */
  export type LancamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Lancamentos.
     */
    data: LancamentoCreateManyInput | LancamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lancamento update
   */
  export type LancamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a Lancamento.
     */
    data: XOR<LancamentoUpdateInput, LancamentoUncheckedUpdateInput>
    /**
     * Choose, which Lancamento to update.
     */
    where: LancamentoWhereUniqueInput
  }

  /**
   * Lancamento updateMany
   */
  export type LancamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lancamentos.
     */
    data: XOR<LancamentoUpdateManyMutationInput, LancamentoUncheckedUpdateManyInput>
    /**
     * Filter which Lancamentos to update
     */
    where?: LancamentoWhereInput
  }

  /**
   * Lancamento upsert
   */
  export type LancamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the Lancamento to update in case it exists.
     */
    where: LancamentoWhereUniqueInput
    /**
     * In case the Lancamento found by the `where` argument doesn't exist, create a new Lancamento with this data.
     */
    create: XOR<LancamentoCreateInput, LancamentoUncheckedCreateInput>
    /**
     * In case the Lancamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LancamentoUpdateInput, LancamentoUncheckedUpdateInput>
  }

  /**
   * Lancamento delete
   */
  export type LancamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    /**
     * Filter which Lancamento to delete.
     */
    where: LancamentoWhereUniqueInput
  }

  /**
   * Lancamento deleteMany
   */
  export type LancamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lancamentos to delete
     */
    where?: LancamentoWhereInput
  }

  /**
   * Lancamento.conta
   */
  export type Lancamento$contaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    where?: ContaFinanceiraWhereInput
  }

  /**
   * Lancamento.recorrencia
   */
  export type Lancamento$recorrenciaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    where?: RecorrenciaWhereInput
  }

  /**
   * Lancamento.contaOrigem
   */
  export type Lancamento$contaOrigemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    where?: ContaFinanceiraWhereInput
  }

  /**
   * Lancamento.contaDestino
   */
  export type Lancamento$contaDestinoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    where?: ContaFinanceiraWhereInput
  }

  /**
   * Lancamento without action
   */
  export type LancamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
  }


  /**
   * Model CategoriaFinanceira
   */

  export type AggregateCategoriaFinanceira = {
    _count: CategoriaFinanceiraCountAggregateOutputType | null
    _min: CategoriaFinanceiraMinAggregateOutputType | null
    _max: CategoriaFinanceiraMaxAggregateOutputType | null
  }

  export type CategoriaFinanceiraMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    tipo: $Enums.TipoCategoriaFinanceira | null
    icone: string | null
    cor: string | null
    paiId: string | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type CategoriaFinanceiraMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    tipo: $Enums.TipoCategoriaFinanceira | null
    icone: string | null
    cor: string | null
    paiId: string | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type CategoriaFinanceiraCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    tipo: number
    icone: number
    cor: number
    paiId: number
    ativa: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type CategoriaFinanceiraMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    icone?: true
    cor?: true
    paiId?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type CategoriaFinanceiraMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    icone?: true
    cor?: true
    paiId?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type CategoriaFinanceiraCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    tipo?: true
    icone?: true
    cor?: true
    paiId?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type CategoriaFinanceiraAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoriaFinanceira to aggregate.
     */
    where?: CategoriaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoriaFinanceiras to fetch.
     */
    orderBy?: CategoriaFinanceiraOrderByWithRelationInput | CategoriaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoriaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoriaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoriaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CategoriaFinanceiras
    **/
    _count?: true | CategoriaFinanceiraCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoriaFinanceiraMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoriaFinanceiraMaxAggregateInputType
  }

  export type GetCategoriaFinanceiraAggregateType<T extends CategoriaFinanceiraAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoriaFinanceira]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoriaFinanceira[P]>
      : GetScalarType<T[P], AggregateCategoriaFinanceira[P]>
  }




  export type CategoriaFinanceiraGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriaFinanceiraWhereInput
    orderBy?: CategoriaFinanceiraOrderByWithAggregationInput | CategoriaFinanceiraOrderByWithAggregationInput[]
    by: CategoriaFinanceiraScalarFieldEnum[] | CategoriaFinanceiraScalarFieldEnum
    having?: CategoriaFinanceiraScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoriaFinanceiraCountAggregateInputType | true
    _min?: CategoriaFinanceiraMinAggregateInputType
    _max?: CategoriaFinanceiraMaxAggregateInputType
  }

  export type CategoriaFinanceiraGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone: string | null
    cor: string | null
    paiId: string | null
    ativa: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: CategoriaFinanceiraCountAggregateOutputType | null
    _min: CategoriaFinanceiraMinAggregateOutputType | null
    _max: CategoriaFinanceiraMaxAggregateOutputType | null
  }

  type GetCategoriaFinanceiraGroupByPayload<T extends CategoriaFinanceiraGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoriaFinanceiraGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoriaFinanceiraGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriaFinanceiraGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriaFinanceiraGroupByOutputType[P]>
        }
      >
    >


  export type CategoriaFinanceiraSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    icone?: boolean
    cor?: boolean
    paiId?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pai?: boolean | CategoriaFinanceira$paiArgs<ExtArgs>
    filhos?: boolean | CategoriaFinanceira$filhosArgs<ExtArgs>
    _count?: boolean | CategoriaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoriaFinanceira"]>

  export type CategoriaFinanceiraSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    icone?: boolean
    cor?: boolean
    paiId?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pai?: boolean | CategoriaFinanceira$paiArgs<ExtArgs>
  }, ExtArgs["result"]["categoriaFinanceira"]>

  export type CategoriaFinanceiraSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    tipo?: boolean
    icone?: boolean
    cor?: boolean
    paiId?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type CategoriaFinanceiraInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pai?: boolean | CategoriaFinanceira$paiArgs<ExtArgs>
    filhos?: boolean | CategoriaFinanceira$filhosArgs<ExtArgs>
    _count?: boolean | CategoriaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoriaFinanceiraIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pai?: boolean | CategoriaFinanceira$paiArgs<ExtArgs>
  }

  export type $CategoriaFinanceiraPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CategoriaFinanceira"
    objects: {
      pai: Prisma.$CategoriaFinanceiraPayload<ExtArgs> | null
      filhos: Prisma.$CategoriaFinanceiraPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      tipo: $Enums.TipoCategoriaFinanceira
      icone: string | null
      cor: string | null
      paiId: string | null
      ativa: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["categoriaFinanceira"]>
    composites: {}
  }

  type CategoriaFinanceiraGetPayload<S extends boolean | null | undefined | CategoriaFinanceiraDefaultArgs> = $Result.GetResult<Prisma.$CategoriaFinanceiraPayload, S>

  type CategoriaFinanceiraCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoriaFinanceiraFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoriaFinanceiraCountAggregateInputType | true
    }

  export interface CategoriaFinanceiraDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CategoriaFinanceira'], meta: { name: 'CategoriaFinanceira' } }
    /**
     * Find zero or one CategoriaFinanceira that matches the filter.
     * @param {CategoriaFinanceiraFindUniqueArgs} args - Arguments to find a CategoriaFinanceira
     * @example
     * // Get one CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoriaFinanceiraFindUniqueArgs>(args: SelectSubset<T, CategoriaFinanceiraFindUniqueArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CategoriaFinanceira that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoriaFinanceiraFindUniqueOrThrowArgs} args - Arguments to find a CategoriaFinanceira
     * @example
     * // Get one CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoriaFinanceiraFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoriaFinanceiraFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CategoriaFinanceira that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraFindFirstArgs} args - Arguments to find a CategoriaFinanceira
     * @example
     * // Get one CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoriaFinanceiraFindFirstArgs>(args?: SelectSubset<T, CategoriaFinanceiraFindFirstArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CategoriaFinanceira that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraFindFirstOrThrowArgs} args - Arguments to find a CategoriaFinanceira
     * @example
     * // Get one CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoriaFinanceiraFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoriaFinanceiraFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CategoriaFinanceiras that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CategoriaFinanceiras
     * const categoriaFinanceiras = await prisma.categoriaFinanceira.findMany()
     * 
     * // Get first 10 CategoriaFinanceiras
     * const categoriaFinanceiras = await prisma.categoriaFinanceira.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoriaFinanceiraWithIdOnly = await prisma.categoriaFinanceira.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoriaFinanceiraFindManyArgs>(args?: SelectSubset<T, CategoriaFinanceiraFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CategoriaFinanceira.
     * @param {CategoriaFinanceiraCreateArgs} args - Arguments to create a CategoriaFinanceira.
     * @example
     * // Create one CategoriaFinanceira
     * const CategoriaFinanceira = await prisma.categoriaFinanceira.create({
     *   data: {
     *     // ... data to create a CategoriaFinanceira
     *   }
     * })
     * 
     */
    create<T extends CategoriaFinanceiraCreateArgs>(args: SelectSubset<T, CategoriaFinanceiraCreateArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CategoriaFinanceiras.
     * @param {CategoriaFinanceiraCreateManyArgs} args - Arguments to create many CategoriaFinanceiras.
     * @example
     * // Create many CategoriaFinanceiras
     * const categoriaFinanceira = await prisma.categoriaFinanceira.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoriaFinanceiraCreateManyArgs>(args?: SelectSubset<T, CategoriaFinanceiraCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CategoriaFinanceiras and returns the data saved in the database.
     * @param {CategoriaFinanceiraCreateManyAndReturnArgs} args - Arguments to create many CategoriaFinanceiras.
     * @example
     * // Create many CategoriaFinanceiras
     * const categoriaFinanceira = await prisma.categoriaFinanceira.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CategoriaFinanceiras and only return the `id`
     * const categoriaFinanceiraWithIdOnly = await prisma.categoriaFinanceira.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoriaFinanceiraCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoriaFinanceiraCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CategoriaFinanceira.
     * @param {CategoriaFinanceiraDeleteArgs} args - Arguments to delete one CategoriaFinanceira.
     * @example
     * // Delete one CategoriaFinanceira
     * const CategoriaFinanceira = await prisma.categoriaFinanceira.delete({
     *   where: {
     *     // ... filter to delete one CategoriaFinanceira
     *   }
     * })
     * 
     */
    delete<T extends CategoriaFinanceiraDeleteArgs>(args: SelectSubset<T, CategoriaFinanceiraDeleteArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CategoriaFinanceira.
     * @param {CategoriaFinanceiraUpdateArgs} args - Arguments to update one CategoriaFinanceira.
     * @example
     * // Update one CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoriaFinanceiraUpdateArgs>(args: SelectSubset<T, CategoriaFinanceiraUpdateArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CategoriaFinanceiras.
     * @param {CategoriaFinanceiraDeleteManyArgs} args - Arguments to filter CategoriaFinanceiras to delete.
     * @example
     * // Delete a few CategoriaFinanceiras
     * const { count } = await prisma.categoriaFinanceira.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoriaFinanceiraDeleteManyArgs>(args?: SelectSubset<T, CategoriaFinanceiraDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CategoriaFinanceiras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CategoriaFinanceiras
     * const categoriaFinanceira = await prisma.categoriaFinanceira.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoriaFinanceiraUpdateManyArgs>(args: SelectSubset<T, CategoriaFinanceiraUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CategoriaFinanceira.
     * @param {CategoriaFinanceiraUpsertArgs} args - Arguments to update or create a CategoriaFinanceira.
     * @example
     * // Update or create a CategoriaFinanceira
     * const categoriaFinanceira = await prisma.categoriaFinanceira.upsert({
     *   create: {
     *     // ... data to create a CategoriaFinanceira
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CategoriaFinanceira we want to update
     *   }
     * })
     */
    upsert<T extends CategoriaFinanceiraUpsertArgs>(args: SelectSubset<T, CategoriaFinanceiraUpsertArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CategoriaFinanceiras.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraCountArgs} args - Arguments to filter CategoriaFinanceiras to count.
     * @example
     * // Count the number of CategoriaFinanceiras
     * const count = await prisma.categoriaFinanceira.count({
     *   where: {
     *     // ... the filter for the CategoriaFinanceiras we want to count
     *   }
     * })
    **/
    count<T extends CategoriaFinanceiraCountArgs>(
      args?: Subset<T, CategoriaFinanceiraCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriaFinanceiraCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CategoriaFinanceira.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoriaFinanceiraAggregateArgs>(args: Subset<T, CategoriaFinanceiraAggregateArgs>): Prisma.PrismaPromise<GetCategoriaFinanceiraAggregateType<T>>

    /**
     * Group by CategoriaFinanceira.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFinanceiraGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoriaFinanceiraGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoriaFinanceiraGroupByArgs['orderBy'] }
        : { orderBy?: CategoriaFinanceiraGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoriaFinanceiraGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriaFinanceiraGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CategoriaFinanceira model
   */
  readonly fields: CategoriaFinanceiraFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CategoriaFinanceira.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoriaFinanceiraClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pai<T extends CategoriaFinanceira$paiArgs<ExtArgs> = {}>(args?: Subset<T, CategoriaFinanceira$paiArgs<ExtArgs>>): Prisma__CategoriaFinanceiraClient<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    filhos<T extends CategoriaFinanceira$filhosArgs<ExtArgs> = {}>(args?: Subset<T, CategoriaFinanceira$filhosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaFinanceiraPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CategoriaFinanceira model
   */ 
  interface CategoriaFinanceiraFieldRefs {
    readonly id: FieldRef<"CategoriaFinanceira", 'String'>
    readonly tenantId: FieldRef<"CategoriaFinanceira", 'String'>
    readonly nome: FieldRef<"CategoriaFinanceira", 'String'>
    readonly tipo: FieldRef<"CategoriaFinanceira", 'TipoCategoriaFinanceira'>
    readonly icone: FieldRef<"CategoriaFinanceira", 'String'>
    readonly cor: FieldRef<"CategoriaFinanceira", 'String'>
    readonly paiId: FieldRef<"CategoriaFinanceira", 'String'>
    readonly ativa: FieldRef<"CategoriaFinanceira", 'Boolean'>
    readonly criadoEm: FieldRef<"CategoriaFinanceira", 'DateTime'>
    readonly atualizadoEm: FieldRef<"CategoriaFinanceira", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CategoriaFinanceira findUnique
   */
  export type CategoriaFinanceiraFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which CategoriaFinanceira to fetch.
     */
    where: CategoriaFinanceiraWhereUniqueInput
  }

  /**
   * CategoriaFinanceira findUniqueOrThrow
   */
  export type CategoriaFinanceiraFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which CategoriaFinanceira to fetch.
     */
    where: CategoriaFinanceiraWhereUniqueInput
  }

  /**
   * CategoriaFinanceira findFirst
   */
  export type CategoriaFinanceiraFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which CategoriaFinanceira to fetch.
     */
    where?: CategoriaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoriaFinanceiras to fetch.
     */
    orderBy?: CategoriaFinanceiraOrderByWithRelationInput | CategoriaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoriaFinanceiras.
     */
    cursor?: CategoriaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoriaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoriaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoriaFinanceiras.
     */
    distinct?: CategoriaFinanceiraScalarFieldEnum | CategoriaFinanceiraScalarFieldEnum[]
  }

  /**
   * CategoriaFinanceira findFirstOrThrow
   */
  export type CategoriaFinanceiraFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which CategoriaFinanceira to fetch.
     */
    where?: CategoriaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoriaFinanceiras to fetch.
     */
    orderBy?: CategoriaFinanceiraOrderByWithRelationInput | CategoriaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CategoriaFinanceiras.
     */
    cursor?: CategoriaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoriaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoriaFinanceiras.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CategoriaFinanceiras.
     */
    distinct?: CategoriaFinanceiraScalarFieldEnum | CategoriaFinanceiraScalarFieldEnum[]
  }

  /**
   * CategoriaFinanceira findMany
   */
  export type CategoriaFinanceiraFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter, which CategoriaFinanceiras to fetch.
     */
    where?: CategoriaFinanceiraWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CategoriaFinanceiras to fetch.
     */
    orderBy?: CategoriaFinanceiraOrderByWithRelationInput | CategoriaFinanceiraOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CategoriaFinanceiras.
     */
    cursor?: CategoriaFinanceiraWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CategoriaFinanceiras from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CategoriaFinanceiras.
     */
    skip?: number
    distinct?: CategoriaFinanceiraScalarFieldEnum | CategoriaFinanceiraScalarFieldEnum[]
  }

  /**
   * CategoriaFinanceira create
   */
  export type CategoriaFinanceiraCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * The data needed to create a CategoriaFinanceira.
     */
    data: XOR<CategoriaFinanceiraCreateInput, CategoriaFinanceiraUncheckedCreateInput>
  }

  /**
   * CategoriaFinanceira createMany
   */
  export type CategoriaFinanceiraCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CategoriaFinanceiras.
     */
    data: CategoriaFinanceiraCreateManyInput | CategoriaFinanceiraCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CategoriaFinanceira createManyAndReturn
   */
  export type CategoriaFinanceiraCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CategoriaFinanceiras.
     */
    data: CategoriaFinanceiraCreateManyInput | CategoriaFinanceiraCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CategoriaFinanceira update
   */
  export type CategoriaFinanceiraUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * The data needed to update a CategoriaFinanceira.
     */
    data: XOR<CategoriaFinanceiraUpdateInput, CategoriaFinanceiraUncheckedUpdateInput>
    /**
     * Choose, which CategoriaFinanceira to update.
     */
    where: CategoriaFinanceiraWhereUniqueInput
  }

  /**
   * CategoriaFinanceira updateMany
   */
  export type CategoriaFinanceiraUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CategoriaFinanceiras.
     */
    data: XOR<CategoriaFinanceiraUpdateManyMutationInput, CategoriaFinanceiraUncheckedUpdateManyInput>
    /**
     * Filter which CategoriaFinanceiras to update
     */
    where?: CategoriaFinanceiraWhereInput
  }

  /**
   * CategoriaFinanceira upsert
   */
  export type CategoriaFinanceiraUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * The filter to search for the CategoriaFinanceira to update in case it exists.
     */
    where: CategoriaFinanceiraWhereUniqueInput
    /**
     * In case the CategoriaFinanceira found by the `where` argument doesn't exist, create a new CategoriaFinanceira with this data.
     */
    create: XOR<CategoriaFinanceiraCreateInput, CategoriaFinanceiraUncheckedCreateInput>
    /**
     * In case the CategoriaFinanceira was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoriaFinanceiraUpdateInput, CategoriaFinanceiraUncheckedUpdateInput>
  }

  /**
   * CategoriaFinanceira delete
   */
  export type CategoriaFinanceiraDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    /**
     * Filter which CategoriaFinanceira to delete.
     */
    where: CategoriaFinanceiraWhereUniqueInput
  }

  /**
   * CategoriaFinanceira deleteMany
   */
  export type CategoriaFinanceiraDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CategoriaFinanceiras to delete
     */
    where?: CategoriaFinanceiraWhereInput
  }

  /**
   * CategoriaFinanceira.pai
   */
  export type CategoriaFinanceira$paiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    where?: CategoriaFinanceiraWhereInput
  }

  /**
   * CategoriaFinanceira.filhos
   */
  export type CategoriaFinanceira$filhosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
    where?: CategoriaFinanceiraWhereInput
    orderBy?: CategoriaFinanceiraOrderByWithRelationInput | CategoriaFinanceiraOrderByWithRelationInput[]
    cursor?: CategoriaFinanceiraWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoriaFinanceiraScalarFieldEnum | CategoriaFinanceiraScalarFieldEnum[]
  }

  /**
   * CategoriaFinanceira without action
   */
  export type CategoriaFinanceiraDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaFinanceira
     */
    select?: CategoriaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaFinanceiraInclude<ExtArgs> | null
  }


  /**
   * Model Recorrencia
   */

  export type AggregateRecorrencia = {
    _count: RecorrenciaCountAggregateOutputType | null
    _avg: RecorrenciaAvgAggregateOutputType | null
    _sum: RecorrenciaSumAggregateOutputType | null
    _min: RecorrenciaMinAggregateOutputType | null
    _max: RecorrenciaMaxAggregateOutputType | null
  }

  export type RecorrenciaAvgAggregateOutputType = {
    valor: Decimal | null
    diaVencimento: number | null
  }

  export type RecorrenciaSumAggregateOutputType = {
    valor: Decimal | null
    diaVencimento: number | null
  }

  export type RecorrenciaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    descricao: string | null
    tipo: $Enums.TipoLancamento | null
    categoria: string | null
    valor: Decimal | null
    frequencia: $Enums.FrequenciaRecorrencia | null
    diaVencimento: number | null
    proximaGeracao: Date | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type RecorrenciaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    descricao: string | null
    tipo: $Enums.TipoLancamento | null
    categoria: string | null
    valor: Decimal | null
    frequencia: $Enums.FrequenciaRecorrencia | null
    diaVencimento: number | null
    proximaGeracao: Date | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type RecorrenciaCountAggregateOutputType = {
    id: number
    tenantId: number
    contaId: number
    descricao: number
    tipo: number
    categoria: number
    valor: number
    frequencia: number
    diaVencimento: number
    proximaGeracao: number
    ativa: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type RecorrenciaAvgAggregateInputType = {
    valor?: true
    diaVencimento?: true
  }

  export type RecorrenciaSumAggregateInputType = {
    valor?: true
    diaVencimento?: true
  }

  export type RecorrenciaMinAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    descricao?: true
    tipo?: true
    categoria?: true
    valor?: true
    frequencia?: true
    diaVencimento?: true
    proximaGeracao?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type RecorrenciaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    descricao?: true
    tipo?: true
    categoria?: true
    valor?: true
    frequencia?: true
    diaVencimento?: true
    proximaGeracao?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type RecorrenciaCountAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    descricao?: true
    tipo?: true
    categoria?: true
    valor?: true
    frequencia?: true
    diaVencimento?: true
    proximaGeracao?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type RecorrenciaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recorrencia to aggregate.
     */
    where?: RecorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recorrencias to fetch.
     */
    orderBy?: RecorrenciaOrderByWithRelationInput | RecorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Recorrencias
    **/
    _count?: true | RecorrenciaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecorrenciaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecorrenciaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecorrenciaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecorrenciaMaxAggregateInputType
  }

  export type GetRecorrenciaAggregateType<T extends RecorrenciaAggregateArgs> = {
        [P in keyof T & keyof AggregateRecorrencia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecorrencia[P]>
      : GetScalarType<T[P], AggregateRecorrencia[P]>
  }




  export type RecorrenciaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecorrenciaWhereInput
    orderBy?: RecorrenciaOrderByWithAggregationInput | RecorrenciaOrderByWithAggregationInput[]
    by: RecorrenciaScalarFieldEnum[] | RecorrenciaScalarFieldEnum
    having?: RecorrenciaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecorrenciaCountAggregateInputType | true
    _avg?: RecorrenciaAvgAggregateInputType
    _sum?: RecorrenciaSumAggregateInputType
    _min?: RecorrenciaMinAggregateInputType
    _max?: RecorrenciaMaxAggregateInputType
  }

  export type RecorrenciaGroupByOutputType = {
    id: string
    tenantId: string
    contaId: string | null
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria: string | null
    valor: Decimal
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento: number | null
    proximaGeracao: Date
    ativa: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: RecorrenciaCountAggregateOutputType | null
    _avg: RecorrenciaAvgAggregateOutputType | null
    _sum: RecorrenciaSumAggregateOutputType | null
    _min: RecorrenciaMinAggregateOutputType | null
    _max: RecorrenciaMaxAggregateOutputType | null
  }

  type GetRecorrenciaGroupByPayload<T extends RecorrenciaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecorrenciaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecorrenciaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecorrenciaGroupByOutputType[P]>
            : GetScalarType<T[P], RecorrenciaGroupByOutputType[P]>
        }
      >
    >


  export type RecorrenciaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    descricao?: boolean
    tipo?: boolean
    categoria?: boolean
    valor?: boolean
    frequencia?: boolean
    diaVencimento?: boolean
    proximaGeracao?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    conta?: boolean | Recorrencia$contaArgs<ExtArgs>
    lancamentos?: boolean | Recorrencia$lancamentosArgs<ExtArgs>
    _count?: boolean | RecorrenciaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["recorrencia"]>

  export type RecorrenciaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    descricao?: boolean
    tipo?: boolean
    categoria?: boolean
    valor?: boolean
    frequencia?: boolean
    diaVencimento?: boolean
    proximaGeracao?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    conta?: boolean | Recorrencia$contaArgs<ExtArgs>
  }, ExtArgs["result"]["recorrencia"]>

  export type RecorrenciaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    descricao?: boolean
    tipo?: boolean
    categoria?: boolean
    valor?: boolean
    frequencia?: boolean
    diaVencimento?: boolean
    proximaGeracao?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type RecorrenciaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | Recorrencia$contaArgs<ExtArgs>
    lancamentos?: boolean | Recorrencia$lancamentosArgs<ExtArgs>
    _count?: boolean | RecorrenciaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RecorrenciaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | Recorrencia$contaArgs<ExtArgs>
  }

  export type $RecorrenciaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Recorrencia"
    objects: {
      conta: Prisma.$ContaFinanceiraPayload<ExtArgs> | null
      lancamentos: Prisma.$LancamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      contaId: string | null
      descricao: string
      tipo: $Enums.TipoLancamento
      categoria: string | null
      valor: Prisma.Decimal
      frequencia: $Enums.FrequenciaRecorrencia
      diaVencimento: number | null
      proximaGeracao: Date
      ativa: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["recorrencia"]>
    composites: {}
  }

  type RecorrenciaGetPayload<S extends boolean | null | undefined | RecorrenciaDefaultArgs> = $Result.GetResult<Prisma.$RecorrenciaPayload, S>

  type RecorrenciaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RecorrenciaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RecorrenciaCountAggregateInputType | true
    }

  export interface RecorrenciaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Recorrencia'], meta: { name: 'Recorrencia' } }
    /**
     * Find zero or one Recorrencia that matches the filter.
     * @param {RecorrenciaFindUniqueArgs} args - Arguments to find a Recorrencia
     * @example
     * // Get one Recorrencia
     * const recorrencia = await prisma.recorrencia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecorrenciaFindUniqueArgs>(args: SelectSubset<T, RecorrenciaFindUniqueArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Recorrencia that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RecorrenciaFindUniqueOrThrowArgs} args - Arguments to find a Recorrencia
     * @example
     * // Get one Recorrencia
     * const recorrencia = await prisma.recorrencia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecorrenciaFindUniqueOrThrowArgs>(args: SelectSubset<T, RecorrenciaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Recorrencia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaFindFirstArgs} args - Arguments to find a Recorrencia
     * @example
     * // Get one Recorrencia
     * const recorrencia = await prisma.recorrencia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecorrenciaFindFirstArgs>(args?: SelectSubset<T, RecorrenciaFindFirstArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Recorrencia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaFindFirstOrThrowArgs} args - Arguments to find a Recorrencia
     * @example
     * // Get one Recorrencia
     * const recorrencia = await prisma.recorrencia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecorrenciaFindFirstOrThrowArgs>(args?: SelectSubset<T, RecorrenciaFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Recorrencias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Recorrencias
     * const recorrencias = await prisma.recorrencia.findMany()
     * 
     * // Get first 10 Recorrencias
     * const recorrencias = await prisma.recorrencia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const recorrenciaWithIdOnly = await prisma.recorrencia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RecorrenciaFindManyArgs>(args?: SelectSubset<T, RecorrenciaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Recorrencia.
     * @param {RecorrenciaCreateArgs} args - Arguments to create a Recorrencia.
     * @example
     * // Create one Recorrencia
     * const Recorrencia = await prisma.recorrencia.create({
     *   data: {
     *     // ... data to create a Recorrencia
     *   }
     * })
     * 
     */
    create<T extends RecorrenciaCreateArgs>(args: SelectSubset<T, RecorrenciaCreateArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Recorrencias.
     * @param {RecorrenciaCreateManyArgs} args - Arguments to create many Recorrencias.
     * @example
     * // Create many Recorrencias
     * const recorrencia = await prisma.recorrencia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecorrenciaCreateManyArgs>(args?: SelectSubset<T, RecorrenciaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Recorrencias and returns the data saved in the database.
     * @param {RecorrenciaCreateManyAndReturnArgs} args - Arguments to create many Recorrencias.
     * @example
     * // Create many Recorrencias
     * const recorrencia = await prisma.recorrencia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Recorrencias and only return the `id`
     * const recorrenciaWithIdOnly = await prisma.recorrencia.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecorrenciaCreateManyAndReturnArgs>(args?: SelectSubset<T, RecorrenciaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Recorrencia.
     * @param {RecorrenciaDeleteArgs} args - Arguments to delete one Recorrencia.
     * @example
     * // Delete one Recorrencia
     * const Recorrencia = await prisma.recorrencia.delete({
     *   where: {
     *     // ... filter to delete one Recorrencia
     *   }
     * })
     * 
     */
    delete<T extends RecorrenciaDeleteArgs>(args: SelectSubset<T, RecorrenciaDeleteArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Recorrencia.
     * @param {RecorrenciaUpdateArgs} args - Arguments to update one Recorrencia.
     * @example
     * // Update one Recorrencia
     * const recorrencia = await prisma.recorrencia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecorrenciaUpdateArgs>(args: SelectSubset<T, RecorrenciaUpdateArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Recorrencias.
     * @param {RecorrenciaDeleteManyArgs} args - Arguments to filter Recorrencias to delete.
     * @example
     * // Delete a few Recorrencias
     * const { count } = await prisma.recorrencia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecorrenciaDeleteManyArgs>(args?: SelectSubset<T, RecorrenciaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Recorrencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Recorrencias
     * const recorrencia = await prisma.recorrencia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecorrenciaUpdateManyArgs>(args: SelectSubset<T, RecorrenciaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Recorrencia.
     * @param {RecorrenciaUpsertArgs} args - Arguments to update or create a Recorrencia.
     * @example
     * // Update or create a Recorrencia
     * const recorrencia = await prisma.recorrencia.upsert({
     *   create: {
     *     // ... data to create a Recorrencia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Recorrencia we want to update
     *   }
     * })
     */
    upsert<T extends RecorrenciaUpsertArgs>(args: SelectSubset<T, RecorrenciaUpsertArgs<ExtArgs>>): Prisma__RecorrenciaClient<$Result.GetResult<Prisma.$RecorrenciaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Recorrencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaCountArgs} args - Arguments to filter Recorrencias to count.
     * @example
     * // Count the number of Recorrencias
     * const count = await prisma.recorrencia.count({
     *   where: {
     *     // ... the filter for the Recorrencias we want to count
     *   }
     * })
    **/
    count<T extends RecorrenciaCountArgs>(
      args?: Subset<T, RecorrenciaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecorrenciaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Recorrencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecorrenciaAggregateArgs>(args: Subset<T, RecorrenciaAggregateArgs>): Prisma.PrismaPromise<GetRecorrenciaAggregateType<T>>

    /**
     * Group by Recorrencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecorrenciaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecorrenciaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecorrenciaGroupByArgs['orderBy'] }
        : { orderBy?: RecorrenciaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecorrenciaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecorrenciaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Recorrencia model
   */
  readonly fields: RecorrenciaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Recorrencia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecorrenciaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conta<T extends Recorrencia$contaArgs<ExtArgs> = {}>(args?: Subset<T, Recorrencia$contaArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lancamentos<T extends Recorrencia$lancamentosArgs<ExtArgs> = {}>(args?: Subset<T, Recorrencia$lancamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LancamentoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Recorrencia model
   */ 
  interface RecorrenciaFieldRefs {
    readonly id: FieldRef<"Recorrencia", 'String'>
    readonly tenantId: FieldRef<"Recorrencia", 'String'>
    readonly contaId: FieldRef<"Recorrencia", 'String'>
    readonly descricao: FieldRef<"Recorrencia", 'String'>
    readonly tipo: FieldRef<"Recorrencia", 'TipoLancamento'>
    readonly categoria: FieldRef<"Recorrencia", 'String'>
    readonly valor: FieldRef<"Recorrencia", 'Decimal'>
    readonly frequencia: FieldRef<"Recorrencia", 'FrequenciaRecorrencia'>
    readonly diaVencimento: FieldRef<"Recorrencia", 'Int'>
    readonly proximaGeracao: FieldRef<"Recorrencia", 'DateTime'>
    readonly ativa: FieldRef<"Recorrencia", 'Boolean'>
    readonly criadoEm: FieldRef<"Recorrencia", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Recorrencia", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Recorrencia findUnique
   */
  export type RecorrenciaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter, which Recorrencia to fetch.
     */
    where: RecorrenciaWhereUniqueInput
  }

  /**
   * Recorrencia findUniqueOrThrow
   */
  export type RecorrenciaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter, which Recorrencia to fetch.
     */
    where: RecorrenciaWhereUniqueInput
  }

  /**
   * Recorrencia findFirst
   */
  export type RecorrenciaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter, which Recorrencia to fetch.
     */
    where?: RecorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recorrencias to fetch.
     */
    orderBy?: RecorrenciaOrderByWithRelationInput | RecorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recorrencias.
     */
    cursor?: RecorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recorrencias.
     */
    distinct?: RecorrenciaScalarFieldEnum | RecorrenciaScalarFieldEnum[]
  }

  /**
   * Recorrencia findFirstOrThrow
   */
  export type RecorrenciaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter, which Recorrencia to fetch.
     */
    where?: RecorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recorrencias to fetch.
     */
    orderBy?: RecorrenciaOrderByWithRelationInput | RecorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Recorrencias.
     */
    cursor?: RecorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Recorrencias.
     */
    distinct?: RecorrenciaScalarFieldEnum | RecorrenciaScalarFieldEnum[]
  }

  /**
   * Recorrencia findMany
   */
  export type RecorrenciaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter, which Recorrencias to fetch.
     */
    where?: RecorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Recorrencias to fetch.
     */
    orderBy?: RecorrenciaOrderByWithRelationInput | RecorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Recorrencias.
     */
    cursor?: RecorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Recorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Recorrencias.
     */
    skip?: number
    distinct?: RecorrenciaScalarFieldEnum | RecorrenciaScalarFieldEnum[]
  }

  /**
   * Recorrencia create
   */
  export type RecorrenciaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * The data needed to create a Recorrencia.
     */
    data: XOR<RecorrenciaCreateInput, RecorrenciaUncheckedCreateInput>
  }

  /**
   * Recorrencia createMany
   */
  export type RecorrenciaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Recorrencias.
     */
    data: RecorrenciaCreateManyInput | RecorrenciaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Recorrencia createManyAndReturn
   */
  export type RecorrenciaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Recorrencias.
     */
    data: RecorrenciaCreateManyInput | RecorrenciaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Recorrencia update
   */
  export type RecorrenciaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * The data needed to update a Recorrencia.
     */
    data: XOR<RecorrenciaUpdateInput, RecorrenciaUncheckedUpdateInput>
    /**
     * Choose, which Recorrencia to update.
     */
    where: RecorrenciaWhereUniqueInput
  }

  /**
   * Recorrencia updateMany
   */
  export type RecorrenciaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Recorrencias.
     */
    data: XOR<RecorrenciaUpdateManyMutationInput, RecorrenciaUncheckedUpdateManyInput>
    /**
     * Filter which Recorrencias to update
     */
    where?: RecorrenciaWhereInput
  }

  /**
   * Recorrencia upsert
   */
  export type RecorrenciaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * The filter to search for the Recorrencia to update in case it exists.
     */
    where: RecorrenciaWhereUniqueInput
    /**
     * In case the Recorrencia found by the `where` argument doesn't exist, create a new Recorrencia with this data.
     */
    create: XOR<RecorrenciaCreateInput, RecorrenciaUncheckedCreateInput>
    /**
     * In case the Recorrencia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecorrenciaUpdateInput, RecorrenciaUncheckedUpdateInput>
  }

  /**
   * Recorrencia delete
   */
  export type RecorrenciaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
    /**
     * Filter which Recorrencia to delete.
     */
    where: RecorrenciaWhereUniqueInput
  }

  /**
   * Recorrencia deleteMany
   */
  export type RecorrenciaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Recorrencias to delete
     */
    where?: RecorrenciaWhereInput
  }

  /**
   * Recorrencia.conta
   */
  export type Recorrencia$contaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContaFinanceira
     */
    select?: ContaFinanceiraSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContaFinanceiraInclude<ExtArgs> | null
    where?: ContaFinanceiraWhereInput
  }

  /**
   * Recorrencia.lancamentos
   */
  export type Recorrencia$lancamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lancamento
     */
    select?: LancamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LancamentoInclude<ExtArgs> | null
    where?: LancamentoWhereInput
    orderBy?: LancamentoOrderByWithRelationInput | LancamentoOrderByWithRelationInput[]
    cursor?: LancamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LancamentoScalarFieldEnum | LancamentoScalarFieldEnum[]
  }

  /**
   * Recorrencia without action
   */
  export type RecorrenciaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Recorrencia
     */
    select?: RecorrenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RecorrenciaInclude<ExtArgs> | null
  }


  /**
   * Model ConciliacaoBancaria
   */

  export type AggregateConciliacaoBancaria = {
    _count: ConciliacaoBancariaCountAggregateOutputType | null
    _avg: ConciliacaoBancariaAvgAggregateOutputType | null
    _sum: ConciliacaoBancariaSumAggregateOutputType | null
    _min: ConciliacaoBancariaMinAggregateOutputType | null
    _max: ConciliacaoBancariaMaxAggregateOutputType | null
  }

  export type ConciliacaoBancariaAvgAggregateOutputType = {
    saldoInicial: Decimal | null
    saldoFinal: Decimal | null
  }

  export type ConciliacaoBancariaSumAggregateOutputType = {
    saldoInicial: Decimal | null
    saldoFinal: Decimal | null
  }

  export type ConciliacaoBancariaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    dataInicio: Date | null
    dataFim: Date | null
    saldoInicial: Decimal | null
    saldoFinal: Decimal | null
    status: $Enums.StatusConciliacao | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ConciliacaoBancariaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    contaId: string | null
    dataInicio: Date | null
    dataFim: Date | null
    saldoInicial: Decimal | null
    saldoFinal: Decimal | null
    status: $Enums.StatusConciliacao | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ConciliacaoBancariaCountAggregateOutputType = {
    id: number
    tenantId: number
    contaId: number
    dataInicio: number
    dataFim: number
    saldoInicial: number
    saldoFinal: number
    status: number
    divergencias: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type ConciliacaoBancariaAvgAggregateInputType = {
    saldoInicial?: true
    saldoFinal?: true
  }

  export type ConciliacaoBancariaSumAggregateInputType = {
    saldoInicial?: true
    saldoFinal?: true
  }

  export type ConciliacaoBancariaMinAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    dataInicio?: true
    dataFim?: true
    saldoInicial?: true
    saldoFinal?: true
    status?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ConciliacaoBancariaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    dataInicio?: true
    dataFim?: true
    saldoInicial?: true
    saldoFinal?: true
    status?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ConciliacaoBancariaCountAggregateInputType = {
    id?: true
    tenantId?: true
    contaId?: true
    dataInicio?: true
    dataFim?: true
    saldoInicial?: true
    saldoFinal?: true
    status?: true
    divergencias?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type ConciliacaoBancariaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConciliacaoBancaria to aggregate.
     */
    where?: ConciliacaoBancariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConciliacaoBancarias to fetch.
     */
    orderBy?: ConciliacaoBancariaOrderByWithRelationInput | ConciliacaoBancariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConciliacaoBancariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConciliacaoBancarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConciliacaoBancarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConciliacaoBancarias
    **/
    _count?: true | ConciliacaoBancariaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConciliacaoBancariaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConciliacaoBancariaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConciliacaoBancariaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConciliacaoBancariaMaxAggregateInputType
  }

  export type GetConciliacaoBancariaAggregateType<T extends ConciliacaoBancariaAggregateArgs> = {
        [P in keyof T & keyof AggregateConciliacaoBancaria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConciliacaoBancaria[P]>
      : GetScalarType<T[P], AggregateConciliacaoBancaria[P]>
  }




  export type ConciliacaoBancariaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConciliacaoBancariaWhereInput
    orderBy?: ConciliacaoBancariaOrderByWithAggregationInput | ConciliacaoBancariaOrderByWithAggregationInput[]
    by: ConciliacaoBancariaScalarFieldEnum[] | ConciliacaoBancariaScalarFieldEnum
    having?: ConciliacaoBancariaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConciliacaoBancariaCountAggregateInputType | true
    _avg?: ConciliacaoBancariaAvgAggregateInputType
    _sum?: ConciliacaoBancariaSumAggregateInputType
    _min?: ConciliacaoBancariaMinAggregateInputType
    _max?: ConciliacaoBancariaMaxAggregateInputType
  }

  export type ConciliacaoBancariaGroupByOutputType = {
    id: string
    tenantId: string
    contaId: string
    dataInicio: Date
    dataFim: Date
    saldoInicial: Decimal
    saldoFinal: Decimal
    status: $Enums.StatusConciliacao
    divergencias: JsonValue | null
    criadoEm: Date
    atualizadoEm: Date
    _count: ConciliacaoBancariaCountAggregateOutputType | null
    _avg: ConciliacaoBancariaAvgAggregateOutputType | null
    _sum: ConciliacaoBancariaSumAggregateOutputType | null
    _min: ConciliacaoBancariaMinAggregateOutputType | null
    _max: ConciliacaoBancariaMaxAggregateOutputType | null
  }

  type GetConciliacaoBancariaGroupByPayload<T extends ConciliacaoBancariaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConciliacaoBancariaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConciliacaoBancariaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConciliacaoBancariaGroupByOutputType[P]>
            : GetScalarType<T[P], ConciliacaoBancariaGroupByOutputType[P]>
        }
      >
    >


  export type ConciliacaoBancariaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    dataInicio?: boolean
    dataFim?: boolean
    saldoInicial?: boolean
    saldoFinal?: boolean
    status?: boolean
    divergencias?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    conta?: boolean | ContaFinanceiraDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conciliacaoBancaria"]>

  export type ConciliacaoBancariaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    dataInicio?: boolean
    dataFim?: boolean
    saldoInicial?: boolean
    saldoFinal?: boolean
    status?: boolean
    divergencias?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    conta?: boolean | ContaFinanceiraDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conciliacaoBancaria"]>

  export type ConciliacaoBancariaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    contaId?: boolean
    dataInicio?: boolean
    dataFim?: boolean
    saldoInicial?: boolean
    saldoFinal?: boolean
    status?: boolean
    divergencias?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type ConciliacaoBancariaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | ContaFinanceiraDefaultArgs<ExtArgs>
  }
  export type ConciliacaoBancariaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conta?: boolean | ContaFinanceiraDefaultArgs<ExtArgs>
  }

  export type $ConciliacaoBancariaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConciliacaoBancaria"
    objects: {
      conta: Prisma.$ContaFinanceiraPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      contaId: string
      dataInicio: Date
      dataFim: Date
      saldoInicial: Prisma.Decimal
      saldoFinal: Prisma.Decimal
      status: $Enums.StatusConciliacao
      divergencias: Prisma.JsonValue | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["conciliacaoBancaria"]>
    composites: {}
  }

  type ConciliacaoBancariaGetPayload<S extends boolean | null | undefined | ConciliacaoBancariaDefaultArgs> = $Result.GetResult<Prisma.$ConciliacaoBancariaPayload, S>

  type ConciliacaoBancariaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConciliacaoBancariaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConciliacaoBancariaCountAggregateInputType | true
    }

  export interface ConciliacaoBancariaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConciliacaoBancaria'], meta: { name: 'ConciliacaoBancaria' } }
    /**
     * Find zero or one ConciliacaoBancaria that matches the filter.
     * @param {ConciliacaoBancariaFindUniqueArgs} args - Arguments to find a ConciliacaoBancaria
     * @example
     * // Get one ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConciliacaoBancariaFindUniqueArgs>(args: SelectSubset<T, ConciliacaoBancariaFindUniqueArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConciliacaoBancaria that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConciliacaoBancariaFindUniqueOrThrowArgs} args - Arguments to find a ConciliacaoBancaria
     * @example
     * // Get one ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConciliacaoBancariaFindUniqueOrThrowArgs>(args: SelectSubset<T, ConciliacaoBancariaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConciliacaoBancaria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaFindFirstArgs} args - Arguments to find a ConciliacaoBancaria
     * @example
     * // Get one ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConciliacaoBancariaFindFirstArgs>(args?: SelectSubset<T, ConciliacaoBancariaFindFirstArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConciliacaoBancaria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaFindFirstOrThrowArgs} args - Arguments to find a ConciliacaoBancaria
     * @example
     * // Get one ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConciliacaoBancariaFindFirstOrThrowArgs>(args?: SelectSubset<T, ConciliacaoBancariaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConciliacaoBancarias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConciliacaoBancarias
     * const conciliacaoBancarias = await prisma.conciliacaoBancaria.findMany()
     * 
     * // Get first 10 ConciliacaoBancarias
     * const conciliacaoBancarias = await prisma.conciliacaoBancaria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conciliacaoBancariaWithIdOnly = await prisma.conciliacaoBancaria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConciliacaoBancariaFindManyArgs>(args?: SelectSubset<T, ConciliacaoBancariaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConciliacaoBancaria.
     * @param {ConciliacaoBancariaCreateArgs} args - Arguments to create a ConciliacaoBancaria.
     * @example
     * // Create one ConciliacaoBancaria
     * const ConciliacaoBancaria = await prisma.conciliacaoBancaria.create({
     *   data: {
     *     // ... data to create a ConciliacaoBancaria
     *   }
     * })
     * 
     */
    create<T extends ConciliacaoBancariaCreateArgs>(args: SelectSubset<T, ConciliacaoBancariaCreateArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConciliacaoBancarias.
     * @param {ConciliacaoBancariaCreateManyArgs} args - Arguments to create many ConciliacaoBancarias.
     * @example
     * // Create many ConciliacaoBancarias
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConciliacaoBancariaCreateManyArgs>(args?: SelectSubset<T, ConciliacaoBancariaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConciliacaoBancarias and returns the data saved in the database.
     * @param {ConciliacaoBancariaCreateManyAndReturnArgs} args - Arguments to create many ConciliacaoBancarias.
     * @example
     * // Create many ConciliacaoBancarias
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConciliacaoBancarias and only return the `id`
     * const conciliacaoBancariaWithIdOnly = await prisma.conciliacaoBancaria.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConciliacaoBancariaCreateManyAndReturnArgs>(args?: SelectSubset<T, ConciliacaoBancariaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConciliacaoBancaria.
     * @param {ConciliacaoBancariaDeleteArgs} args - Arguments to delete one ConciliacaoBancaria.
     * @example
     * // Delete one ConciliacaoBancaria
     * const ConciliacaoBancaria = await prisma.conciliacaoBancaria.delete({
     *   where: {
     *     // ... filter to delete one ConciliacaoBancaria
     *   }
     * })
     * 
     */
    delete<T extends ConciliacaoBancariaDeleteArgs>(args: SelectSubset<T, ConciliacaoBancariaDeleteArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConciliacaoBancaria.
     * @param {ConciliacaoBancariaUpdateArgs} args - Arguments to update one ConciliacaoBancaria.
     * @example
     * // Update one ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConciliacaoBancariaUpdateArgs>(args: SelectSubset<T, ConciliacaoBancariaUpdateArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConciliacaoBancarias.
     * @param {ConciliacaoBancariaDeleteManyArgs} args - Arguments to filter ConciliacaoBancarias to delete.
     * @example
     * // Delete a few ConciliacaoBancarias
     * const { count } = await prisma.conciliacaoBancaria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConciliacaoBancariaDeleteManyArgs>(args?: SelectSubset<T, ConciliacaoBancariaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConciliacaoBancarias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConciliacaoBancarias
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConciliacaoBancariaUpdateManyArgs>(args: SelectSubset<T, ConciliacaoBancariaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConciliacaoBancaria.
     * @param {ConciliacaoBancariaUpsertArgs} args - Arguments to update or create a ConciliacaoBancaria.
     * @example
     * // Update or create a ConciliacaoBancaria
     * const conciliacaoBancaria = await prisma.conciliacaoBancaria.upsert({
     *   create: {
     *     // ... data to create a ConciliacaoBancaria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConciliacaoBancaria we want to update
     *   }
     * })
     */
    upsert<T extends ConciliacaoBancariaUpsertArgs>(args: SelectSubset<T, ConciliacaoBancariaUpsertArgs<ExtArgs>>): Prisma__ConciliacaoBancariaClient<$Result.GetResult<Prisma.$ConciliacaoBancariaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConciliacaoBancarias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaCountArgs} args - Arguments to filter ConciliacaoBancarias to count.
     * @example
     * // Count the number of ConciliacaoBancarias
     * const count = await prisma.conciliacaoBancaria.count({
     *   where: {
     *     // ... the filter for the ConciliacaoBancarias we want to count
     *   }
     * })
    **/
    count<T extends ConciliacaoBancariaCountArgs>(
      args?: Subset<T, ConciliacaoBancariaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConciliacaoBancariaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConciliacaoBancaria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConciliacaoBancariaAggregateArgs>(args: Subset<T, ConciliacaoBancariaAggregateArgs>): Prisma.PrismaPromise<GetConciliacaoBancariaAggregateType<T>>

    /**
     * Group by ConciliacaoBancaria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConciliacaoBancariaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConciliacaoBancariaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConciliacaoBancariaGroupByArgs['orderBy'] }
        : { orderBy?: ConciliacaoBancariaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConciliacaoBancariaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConciliacaoBancariaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConciliacaoBancaria model
   */
  readonly fields: ConciliacaoBancariaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConciliacaoBancaria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConciliacaoBancariaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conta<T extends ContaFinanceiraDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ContaFinanceiraDefaultArgs<ExtArgs>>): Prisma__ContaFinanceiraClient<$Result.GetResult<Prisma.$ContaFinanceiraPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConciliacaoBancaria model
   */ 
  interface ConciliacaoBancariaFieldRefs {
    readonly id: FieldRef<"ConciliacaoBancaria", 'String'>
    readonly tenantId: FieldRef<"ConciliacaoBancaria", 'String'>
    readonly contaId: FieldRef<"ConciliacaoBancaria", 'String'>
    readonly dataInicio: FieldRef<"ConciliacaoBancaria", 'DateTime'>
    readonly dataFim: FieldRef<"ConciliacaoBancaria", 'DateTime'>
    readonly saldoInicial: FieldRef<"ConciliacaoBancaria", 'Decimal'>
    readonly saldoFinal: FieldRef<"ConciliacaoBancaria", 'Decimal'>
    readonly status: FieldRef<"ConciliacaoBancaria", 'StatusConciliacao'>
    readonly divergencias: FieldRef<"ConciliacaoBancaria", 'Json'>
    readonly criadoEm: FieldRef<"ConciliacaoBancaria", 'DateTime'>
    readonly atualizadoEm: FieldRef<"ConciliacaoBancaria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConciliacaoBancaria findUnique
   */
  export type ConciliacaoBancariaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter, which ConciliacaoBancaria to fetch.
     */
    where: ConciliacaoBancariaWhereUniqueInput
  }

  /**
   * ConciliacaoBancaria findUniqueOrThrow
   */
  export type ConciliacaoBancariaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter, which ConciliacaoBancaria to fetch.
     */
    where: ConciliacaoBancariaWhereUniqueInput
  }

  /**
   * ConciliacaoBancaria findFirst
   */
  export type ConciliacaoBancariaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter, which ConciliacaoBancaria to fetch.
     */
    where?: ConciliacaoBancariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConciliacaoBancarias to fetch.
     */
    orderBy?: ConciliacaoBancariaOrderByWithRelationInput | ConciliacaoBancariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConciliacaoBancarias.
     */
    cursor?: ConciliacaoBancariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConciliacaoBancarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConciliacaoBancarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConciliacaoBancarias.
     */
    distinct?: ConciliacaoBancariaScalarFieldEnum | ConciliacaoBancariaScalarFieldEnum[]
  }

  /**
   * ConciliacaoBancaria findFirstOrThrow
   */
  export type ConciliacaoBancariaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter, which ConciliacaoBancaria to fetch.
     */
    where?: ConciliacaoBancariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConciliacaoBancarias to fetch.
     */
    orderBy?: ConciliacaoBancariaOrderByWithRelationInput | ConciliacaoBancariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConciliacaoBancarias.
     */
    cursor?: ConciliacaoBancariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConciliacaoBancarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConciliacaoBancarias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConciliacaoBancarias.
     */
    distinct?: ConciliacaoBancariaScalarFieldEnum | ConciliacaoBancariaScalarFieldEnum[]
  }

  /**
   * ConciliacaoBancaria findMany
   */
  export type ConciliacaoBancariaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter, which ConciliacaoBancarias to fetch.
     */
    where?: ConciliacaoBancariaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConciliacaoBancarias to fetch.
     */
    orderBy?: ConciliacaoBancariaOrderByWithRelationInput | ConciliacaoBancariaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConciliacaoBancarias.
     */
    cursor?: ConciliacaoBancariaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConciliacaoBancarias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConciliacaoBancarias.
     */
    skip?: number
    distinct?: ConciliacaoBancariaScalarFieldEnum | ConciliacaoBancariaScalarFieldEnum[]
  }

  /**
   * ConciliacaoBancaria create
   */
  export type ConciliacaoBancariaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * The data needed to create a ConciliacaoBancaria.
     */
    data: XOR<ConciliacaoBancariaCreateInput, ConciliacaoBancariaUncheckedCreateInput>
  }

  /**
   * ConciliacaoBancaria createMany
   */
  export type ConciliacaoBancariaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConciliacaoBancarias.
     */
    data: ConciliacaoBancariaCreateManyInput | ConciliacaoBancariaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConciliacaoBancaria createManyAndReturn
   */
  export type ConciliacaoBancariaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConciliacaoBancarias.
     */
    data: ConciliacaoBancariaCreateManyInput | ConciliacaoBancariaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConciliacaoBancaria update
   */
  export type ConciliacaoBancariaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * The data needed to update a ConciliacaoBancaria.
     */
    data: XOR<ConciliacaoBancariaUpdateInput, ConciliacaoBancariaUncheckedUpdateInput>
    /**
     * Choose, which ConciliacaoBancaria to update.
     */
    where: ConciliacaoBancariaWhereUniqueInput
  }

  /**
   * ConciliacaoBancaria updateMany
   */
  export type ConciliacaoBancariaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConciliacaoBancarias.
     */
    data: XOR<ConciliacaoBancariaUpdateManyMutationInput, ConciliacaoBancariaUncheckedUpdateManyInput>
    /**
     * Filter which ConciliacaoBancarias to update
     */
    where?: ConciliacaoBancariaWhereInput
  }

  /**
   * ConciliacaoBancaria upsert
   */
  export type ConciliacaoBancariaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * The filter to search for the ConciliacaoBancaria to update in case it exists.
     */
    where: ConciliacaoBancariaWhereUniqueInput
    /**
     * In case the ConciliacaoBancaria found by the `where` argument doesn't exist, create a new ConciliacaoBancaria with this data.
     */
    create: XOR<ConciliacaoBancariaCreateInput, ConciliacaoBancariaUncheckedCreateInput>
    /**
     * In case the ConciliacaoBancaria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConciliacaoBancariaUpdateInput, ConciliacaoBancariaUncheckedUpdateInput>
  }

  /**
   * ConciliacaoBancaria delete
   */
  export type ConciliacaoBancariaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
    /**
     * Filter which ConciliacaoBancaria to delete.
     */
    where: ConciliacaoBancariaWhereUniqueInput
  }

  /**
   * ConciliacaoBancaria deleteMany
   */
  export type ConciliacaoBancariaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConciliacaoBancarias to delete
     */
    where?: ConciliacaoBancariaWhereInput
  }

  /**
   * ConciliacaoBancaria without action
   */
  export type ConciliacaoBancariaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConciliacaoBancaria
     */
    select?: ConciliacaoBancariaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConciliacaoBancariaInclude<ExtArgs> | null
  }


  /**
   * Model EventoProcessado
   */

  export type AggregateEventoProcessado = {
    _count: EventoProcessadoCountAggregateOutputType | null
    _min: EventoProcessadoMinAggregateOutputType | null
    _max: EventoProcessadoMaxAggregateOutputType | null
  }

  export type EventoProcessadoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    evento: string | null
    referenciaId: string | null
    processadoEm: Date | null
  }

  export type EventoProcessadoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    evento: string | null
    referenciaId: string | null
    processadoEm: Date | null
  }

  export type EventoProcessadoCountAggregateOutputType = {
    id: number
    tenantId: number
    evento: number
    referenciaId: number
    processadoEm: number
    _all: number
  }


  export type EventoProcessadoMinAggregateInputType = {
    id?: true
    tenantId?: true
    evento?: true
    referenciaId?: true
    processadoEm?: true
  }

  export type EventoProcessadoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    evento?: true
    referenciaId?: true
    processadoEm?: true
  }

  export type EventoProcessadoCountAggregateInputType = {
    id?: true
    tenantId?: true
    evento?: true
    referenciaId?: true
    processadoEm?: true
    _all?: true
  }

  export type EventoProcessadoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventoProcessado to aggregate.
     */
    where?: EventoProcessadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventoProcessados to fetch.
     */
    orderBy?: EventoProcessadoOrderByWithRelationInput | EventoProcessadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventoProcessadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventoProcessados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventoProcessados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventoProcessados
    **/
    _count?: true | EventoProcessadoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventoProcessadoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventoProcessadoMaxAggregateInputType
  }

  export type GetEventoProcessadoAggregateType<T extends EventoProcessadoAggregateArgs> = {
        [P in keyof T & keyof AggregateEventoProcessado]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventoProcessado[P]>
      : GetScalarType<T[P], AggregateEventoProcessado[P]>
  }




  export type EventoProcessadoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventoProcessadoWhereInput
    orderBy?: EventoProcessadoOrderByWithAggregationInput | EventoProcessadoOrderByWithAggregationInput[]
    by: EventoProcessadoScalarFieldEnum[] | EventoProcessadoScalarFieldEnum
    having?: EventoProcessadoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventoProcessadoCountAggregateInputType | true
    _min?: EventoProcessadoMinAggregateInputType
    _max?: EventoProcessadoMaxAggregateInputType
  }

  export type EventoProcessadoGroupByOutputType = {
    id: string
    tenantId: string
    evento: string
    referenciaId: string
    processadoEm: Date
    _count: EventoProcessadoCountAggregateOutputType | null
    _min: EventoProcessadoMinAggregateOutputType | null
    _max: EventoProcessadoMaxAggregateOutputType | null
  }

  type GetEventoProcessadoGroupByPayload<T extends EventoProcessadoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventoProcessadoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventoProcessadoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventoProcessadoGroupByOutputType[P]>
            : GetScalarType<T[P], EventoProcessadoGroupByOutputType[P]>
        }
      >
    >


  export type EventoProcessadoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    evento?: boolean
    referenciaId?: boolean
    processadoEm?: boolean
  }, ExtArgs["result"]["eventoProcessado"]>

  export type EventoProcessadoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    evento?: boolean
    referenciaId?: boolean
    processadoEm?: boolean
  }, ExtArgs["result"]["eventoProcessado"]>

  export type EventoProcessadoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    evento?: boolean
    referenciaId?: boolean
    processadoEm?: boolean
  }


  export type $EventoProcessadoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventoProcessado"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      /**
       * Nome lógico do evento consumido (ex. "pedido.faturado", "pedido.pago").
       */
      evento: string
      /**
       * Identificador do agregado de referência (ex. pedidoId).
       */
      referenciaId: string
      processadoEm: Date
    }, ExtArgs["result"]["eventoProcessado"]>
    composites: {}
  }

  type EventoProcessadoGetPayload<S extends boolean | null | undefined | EventoProcessadoDefaultArgs> = $Result.GetResult<Prisma.$EventoProcessadoPayload, S>

  type EventoProcessadoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EventoProcessadoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EventoProcessadoCountAggregateInputType | true
    }

  export interface EventoProcessadoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventoProcessado'], meta: { name: 'EventoProcessado' } }
    /**
     * Find zero or one EventoProcessado that matches the filter.
     * @param {EventoProcessadoFindUniqueArgs} args - Arguments to find a EventoProcessado
     * @example
     * // Get one EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventoProcessadoFindUniqueArgs>(args: SelectSubset<T, EventoProcessadoFindUniqueArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EventoProcessado that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EventoProcessadoFindUniqueOrThrowArgs} args - Arguments to find a EventoProcessado
     * @example
     * // Get one EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventoProcessadoFindUniqueOrThrowArgs>(args: SelectSubset<T, EventoProcessadoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EventoProcessado that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoFindFirstArgs} args - Arguments to find a EventoProcessado
     * @example
     * // Get one EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventoProcessadoFindFirstArgs>(args?: SelectSubset<T, EventoProcessadoFindFirstArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EventoProcessado that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoFindFirstOrThrowArgs} args - Arguments to find a EventoProcessado
     * @example
     * // Get one EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventoProcessadoFindFirstOrThrowArgs>(args?: SelectSubset<T, EventoProcessadoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EventoProcessados that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventoProcessados
     * const eventoProcessados = await prisma.eventoProcessado.findMany()
     * 
     * // Get first 10 EventoProcessados
     * const eventoProcessados = await prisma.eventoProcessado.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventoProcessadoWithIdOnly = await prisma.eventoProcessado.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventoProcessadoFindManyArgs>(args?: SelectSubset<T, EventoProcessadoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EventoProcessado.
     * @param {EventoProcessadoCreateArgs} args - Arguments to create a EventoProcessado.
     * @example
     * // Create one EventoProcessado
     * const EventoProcessado = await prisma.eventoProcessado.create({
     *   data: {
     *     // ... data to create a EventoProcessado
     *   }
     * })
     * 
     */
    create<T extends EventoProcessadoCreateArgs>(args: SelectSubset<T, EventoProcessadoCreateArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EventoProcessados.
     * @param {EventoProcessadoCreateManyArgs} args - Arguments to create many EventoProcessados.
     * @example
     * // Create many EventoProcessados
     * const eventoProcessado = await prisma.eventoProcessado.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventoProcessadoCreateManyArgs>(args?: SelectSubset<T, EventoProcessadoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventoProcessados and returns the data saved in the database.
     * @param {EventoProcessadoCreateManyAndReturnArgs} args - Arguments to create many EventoProcessados.
     * @example
     * // Create many EventoProcessados
     * const eventoProcessado = await prisma.eventoProcessado.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventoProcessados and only return the `id`
     * const eventoProcessadoWithIdOnly = await prisma.eventoProcessado.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventoProcessadoCreateManyAndReturnArgs>(args?: SelectSubset<T, EventoProcessadoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EventoProcessado.
     * @param {EventoProcessadoDeleteArgs} args - Arguments to delete one EventoProcessado.
     * @example
     * // Delete one EventoProcessado
     * const EventoProcessado = await prisma.eventoProcessado.delete({
     *   where: {
     *     // ... filter to delete one EventoProcessado
     *   }
     * })
     * 
     */
    delete<T extends EventoProcessadoDeleteArgs>(args: SelectSubset<T, EventoProcessadoDeleteArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EventoProcessado.
     * @param {EventoProcessadoUpdateArgs} args - Arguments to update one EventoProcessado.
     * @example
     * // Update one EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventoProcessadoUpdateArgs>(args: SelectSubset<T, EventoProcessadoUpdateArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EventoProcessados.
     * @param {EventoProcessadoDeleteManyArgs} args - Arguments to filter EventoProcessados to delete.
     * @example
     * // Delete a few EventoProcessados
     * const { count } = await prisma.eventoProcessado.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventoProcessadoDeleteManyArgs>(args?: SelectSubset<T, EventoProcessadoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventoProcessados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventoProcessados
     * const eventoProcessado = await prisma.eventoProcessado.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventoProcessadoUpdateManyArgs>(args: SelectSubset<T, EventoProcessadoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EventoProcessado.
     * @param {EventoProcessadoUpsertArgs} args - Arguments to update or create a EventoProcessado.
     * @example
     * // Update or create a EventoProcessado
     * const eventoProcessado = await prisma.eventoProcessado.upsert({
     *   create: {
     *     // ... data to create a EventoProcessado
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventoProcessado we want to update
     *   }
     * })
     */
    upsert<T extends EventoProcessadoUpsertArgs>(args: SelectSubset<T, EventoProcessadoUpsertArgs<ExtArgs>>): Prisma__EventoProcessadoClient<$Result.GetResult<Prisma.$EventoProcessadoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EventoProcessados.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoCountArgs} args - Arguments to filter EventoProcessados to count.
     * @example
     * // Count the number of EventoProcessados
     * const count = await prisma.eventoProcessado.count({
     *   where: {
     *     // ... the filter for the EventoProcessados we want to count
     *   }
     * })
    **/
    count<T extends EventoProcessadoCountArgs>(
      args?: Subset<T, EventoProcessadoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventoProcessadoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventoProcessado.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventoProcessadoAggregateArgs>(args: Subset<T, EventoProcessadoAggregateArgs>): Prisma.PrismaPromise<GetEventoProcessadoAggregateType<T>>

    /**
     * Group by EventoProcessado.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventoProcessadoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventoProcessadoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventoProcessadoGroupByArgs['orderBy'] }
        : { orderBy?: EventoProcessadoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventoProcessadoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventoProcessadoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventoProcessado model
   */
  readonly fields: EventoProcessadoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventoProcessado.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventoProcessadoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventoProcessado model
   */ 
  interface EventoProcessadoFieldRefs {
    readonly id: FieldRef<"EventoProcessado", 'String'>
    readonly tenantId: FieldRef<"EventoProcessado", 'String'>
    readonly evento: FieldRef<"EventoProcessado", 'String'>
    readonly referenciaId: FieldRef<"EventoProcessado", 'String'>
    readonly processadoEm: FieldRef<"EventoProcessado", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EventoProcessado findUnique
   */
  export type EventoProcessadoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter, which EventoProcessado to fetch.
     */
    where: EventoProcessadoWhereUniqueInput
  }

  /**
   * EventoProcessado findUniqueOrThrow
   */
  export type EventoProcessadoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter, which EventoProcessado to fetch.
     */
    where: EventoProcessadoWhereUniqueInput
  }

  /**
   * EventoProcessado findFirst
   */
  export type EventoProcessadoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter, which EventoProcessado to fetch.
     */
    where?: EventoProcessadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventoProcessados to fetch.
     */
    orderBy?: EventoProcessadoOrderByWithRelationInput | EventoProcessadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventoProcessados.
     */
    cursor?: EventoProcessadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventoProcessados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventoProcessados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventoProcessados.
     */
    distinct?: EventoProcessadoScalarFieldEnum | EventoProcessadoScalarFieldEnum[]
  }

  /**
   * EventoProcessado findFirstOrThrow
   */
  export type EventoProcessadoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter, which EventoProcessado to fetch.
     */
    where?: EventoProcessadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventoProcessados to fetch.
     */
    orderBy?: EventoProcessadoOrderByWithRelationInput | EventoProcessadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventoProcessados.
     */
    cursor?: EventoProcessadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventoProcessados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventoProcessados.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventoProcessados.
     */
    distinct?: EventoProcessadoScalarFieldEnum | EventoProcessadoScalarFieldEnum[]
  }

  /**
   * EventoProcessado findMany
   */
  export type EventoProcessadoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter, which EventoProcessados to fetch.
     */
    where?: EventoProcessadoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventoProcessados to fetch.
     */
    orderBy?: EventoProcessadoOrderByWithRelationInput | EventoProcessadoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventoProcessados.
     */
    cursor?: EventoProcessadoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventoProcessados from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventoProcessados.
     */
    skip?: number
    distinct?: EventoProcessadoScalarFieldEnum | EventoProcessadoScalarFieldEnum[]
  }

  /**
   * EventoProcessado create
   */
  export type EventoProcessadoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * The data needed to create a EventoProcessado.
     */
    data: XOR<EventoProcessadoCreateInput, EventoProcessadoUncheckedCreateInput>
  }

  /**
   * EventoProcessado createMany
   */
  export type EventoProcessadoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventoProcessados.
     */
    data: EventoProcessadoCreateManyInput | EventoProcessadoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventoProcessado createManyAndReturn
   */
  export type EventoProcessadoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EventoProcessados.
     */
    data: EventoProcessadoCreateManyInput | EventoProcessadoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventoProcessado update
   */
  export type EventoProcessadoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * The data needed to update a EventoProcessado.
     */
    data: XOR<EventoProcessadoUpdateInput, EventoProcessadoUncheckedUpdateInput>
    /**
     * Choose, which EventoProcessado to update.
     */
    where: EventoProcessadoWhereUniqueInput
  }

  /**
   * EventoProcessado updateMany
   */
  export type EventoProcessadoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventoProcessados.
     */
    data: XOR<EventoProcessadoUpdateManyMutationInput, EventoProcessadoUncheckedUpdateManyInput>
    /**
     * Filter which EventoProcessados to update
     */
    where?: EventoProcessadoWhereInput
  }

  /**
   * EventoProcessado upsert
   */
  export type EventoProcessadoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * The filter to search for the EventoProcessado to update in case it exists.
     */
    where: EventoProcessadoWhereUniqueInput
    /**
     * In case the EventoProcessado found by the `where` argument doesn't exist, create a new EventoProcessado with this data.
     */
    create: XOR<EventoProcessadoCreateInput, EventoProcessadoUncheckedCreateInput>
    /**
     * In case the EventoProcessado was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventoProcessadoUpdateInput, EventoProcessadoUncheckedUpdateInput>
  }

  /**
   * EventoProcessado delete
   */
  export type EventoProcessadoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
    /**
     * Filter which EventoProcessado to delete.
     */
    where: EventoProcessadoWhereUniqueInput
  }

  /**
   * EventoProcessado deleteMany
   */
  export type EventoProcessadoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventoProcessados to delete
     */
    where?: EventoProcessadoWhereInput
  }

  /**
   * EventoProcessado without action
   */
  export type EventoProcessadoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventoProcessado
     */
    select?: EventoProcessadoSelect<ExtArgs> | null
  }


  /**
   * Model DRE
   */

  export type AggregateDRE = {
    _count: DRECountAggregateOutputType | null
    _avg: DREAvgAggregateOutputType | null
    _sum: DRESumAggregateOutputType | null
    _min: DREMinAggregateOutputType | null
    _max: DREMaxAggregateOutputType | null
  }

  export type DREAvgAggregateOutputType = {
    ano: number | null
    mes: number | null
    receitaBruta: Decimal | null
    deducoes: Decimal | null
    receitaLiquida: Decimal | null
    custosMercadorias: Decimal | null
    lucroBruto: Decimal | null
    despesasOperacionais: Decimal | null
    despesasAdministrativas: Decimal | null
    despesasComerciais: Decimal | null
    resultadoOperacional: Decimal | null
    despesasFinanceiras: Decimal | null
    receitasFinanceiras: Decimal | null
    lucroLiquido: Decimal | null
  }

  export type DRESumAggregateOutputType = {
    ano: number | null
    mes: number | null
    receitaBruta: Decimal | null
    deducoes: Decimal | null
    receitaLiquida: Decimal | null
    custosMercadorias: Decimal | null
    lucroBruto: Decimal | null
    despesasOperacionais: Decimal | null
    despesasAdministrativas: Decimal | null
    despesasComerciais: Decimal | null
    resultadoOperacional: Decimal | null
    despesasFinanceiras: Decimal | null
    receitasFinanceiras: Decimal | null
    lucroLiquido: Decimal | null
  }

  export type DREMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    periodo: string | null
    ano: number | null
    mes: number | null
    receitaBruta: Decimal | null
    deducoes: Decimal | null
    receitaLiquida: Decimal | null
    custosMercadorias: Decimal | null
    lucroBruto: Decimal | null
    despesasOperacionais: Decimal | null
    despesasAdministrativas: Decimal | null
    despesasComerciais: Decimal | null
    resultadoOperacional: Decimal | null
    despesasFinanceiras: Decimal | null
    receitasFinanceiras: Decimal | null
    lucroLiquido: Decimal | null
    criadoEm: Date | null
  }

  export type DREMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    periodo: string | null
    ano: number | null
    mes: number | null
    receitaBruta: Decimal | null
    deducoes: Decimal | null
    receitaLiquida: Decimal | null
    custosMercadorias: Decimal | null
    lucroBruto: Decimal | null
    despesasOperacionais: Decimal | null
    despesasAdministrativas: Decimal | null
    despesasComerciais: Decimal | null
    resultadoOperacional: Decimal | null
    despesasFinanceiras: Decimal | null
    receitasFinanceiras: Decimal | null
    lucroLiquido: Decimal | null
    criadoEm: Date | null
  }

  export type DRECountAggregateOutputType = {
    id: number
    tenantId: number
    periodo: number
    ano: number
    mes: number
    receitaBruta: number
    deducoes: number
    receitaLiquida: number
    custosMercadorias: number
    lucroBruto: number
    despesasOperacionais: number
    despesasAdministrativas: number
    despesasComerciais: number
    resultadoOperacional: number
    despesasFinanceiras: number
    receitasFinanceiras: number
    lucroLiquido: number
    criadoEm: number
    _all: number
  }


  export type DREAvgAggregateInputType = {
    ano?: true
    mes?: true
    receitaBruta?: true
    deducoes?: true
    receitaLiquida?: true
    custosMercadorias?: true
    lucroBruto?: true
    despesasOperacionais?: true
    despesasAdministrativas?: true
    despesasComerciais?: true
    resultadoOperacional?: true
    despesasFinanceiras?: true
    receitasFinanceiras?: true
    lucroLiquido?: true
  }

  export type DRESumAggregateInputType = {
    ano?: true
    mes?: true
    receitaBruta?: true
    deducoes?: true
    receitaLiquida?: true
    custosMercadorias?: true
    lucroBruto?: true
    despesasOperacionais?: true
    despesasAdministrativas?: true
    despesasComerciais?: true
    resultadoOperacional?: true
    despesasFinanceiras?: true
    receitasFinanceiras?: true
    lucroLiquido?: true
  }

  export type DREMinAggregateInputType = {
    id?: true
    tenantId?: true
    periodo?: true
    ano?: true
    mes?: true
    receitaBruta?: true
    deducoes?: true
    receitaLiquida?: true
    custosMercadorias?: true
    lucroBruto?: true
    despesasOperacionais?: true
    despesasAdministrativas?: true
    despesasComerciais?: true
    resultadoOperacional?: true
    despesasFinanceiras?: true
    receitasFinanceiras?: true
    lucroLiquido?: true
    criadoEm?: true
  }

  export type DREMaxAggregateInputType = {
    id?: true
    tenantId?: true
    periodo?: true
    ano?: true
    mes?: true
    receitaBruta?: true
    deducoes?: true
    receitaLiquida?: true
    custosMercadorias?: true
    lucroBruto?: true
    despesasOperacionais?: true
    despesasAdministrativas?: true
    despesasComerciais?: true
    resultadoOperacional?: true
    despesasFinanceiras?: true
    receitasFinanceiras?: true
    lucroLiquido?: true
    criadoEm?: true
  }

  export type DRECountAggregateInputType = {
    id?: true
    tenantId?: true
    periodo?: true
    ano?: true
    mes?: true
    receitaBruta?: true
    deducoes?: true
    receitaLiquida?: true
    custosMercadorias?: true
    lucroBruto?: true
    despesasOperacionais?: true
    despesasAdministrativas?: true
    despesasComerciais?: true
    resultadoOperacional?: true
    despesasFinanceiras?: true
    receitasFinanceiras?: true
    lucroLiquido?: true
    criadoEm?: true
    _all?: true
  }

  export type DREAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DRE to aggregate.
     */
    where?: DREWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DRES to fetch.
     */
    orderBy?: DREOrderByWithRelationInput | DREOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DREWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DRES from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DRES.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DRES
    **/
    _count?: true | DRECountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DREAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DRESumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DREMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DREMaxAggregateInputType
  }

  export type GetDREAggregateType<T extends DREAggregateArgs> = {
        [P in keyof T & keyof AggregateDRE]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDRE[P]>
      : GetScalarType<T[P], AggregateDRE[P]>
  }




  export type DREGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DREWhereInput
    orderBy?: DREOrderByWithAggregationInput | DREOrderByWithAggregationInput[]
    by: DREScalarFieldEnum[] | DREScalarFieldEnum
    having?: DREScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DRECountAggregateInputType | true
    _avg?: DREAvgAggregateInputType
    _sum?: DRESumAggregateInputType
    _min?: DREMinAggregateInputType
    _max?: DREMaxAggregateInputType
  }

  export type DREGroupByOutputType = {
    id: string
    tenantId: string
    periodo: string
    ano: number
    mes: number | null
    receitaBruta: Decimal
    deducoes: Decimal
    receitaLiquida: Decimal
    custosMercadorias: Decimal
    lucroBruto: Decimal
    despesasOperacionais: Decimal
    despesasAdministrativas: Decimal
    despesasComerciais: Decimal
    resultadoOperacional: Decimal
    despesasFinanceiras: Decimal
    receitasFinanceiras: Decimal
    lucroLiquido: Decimal
    criadoEm: Date
    _count: DRECountAggregateOutputType | null
    _avg: DREAvgAggregateOutputType | null
    _sum: DRESumAggregateOutputType | null
    _min: DREMinAggregateOutputType | null
    _max: DREMaxAggregateOutputType | null
  }

  type GetDREGroupByPayload<T extends DREGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DREGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DREGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DREGroupByOutputType[P]>
            : GetScalarType<T[P], DREGroupByOutputType[P]>
        }
      >
    >


  export type DRESelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    periodo?: boolean
    ano?: boolean
    mes?: boolean
    receitaBruta?: boolean
    deducoes?: boolean
    receitaLiquida?: boolean
    custosMercadorias?: boolean
    lucroBruto?: boolean
    despesasOperacionais?: boolean
    despesasAdministrativas?: boolean
    despesasComerciais?: boolean
    resultadoOperacional?: boolean
    despesasFinanceiras?: boolean
    receitasFinanceiras?: boolean
    lucroLiquido?: boolean
    criadoEm?: boolean
  }, ExtArgs["result"]["dRE"]>

  export type DRESelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    periodo?: boolean
    ano?: boolean
    mes?: boolean
    receitaBruta?: boolean
    deducoes?: boolean
    receitaLiquida?: boolean
    custosMercadorias?: boolean
    lucroBruto?: boolean
    despesasOperacionais?: boolean
    despesasAdministrativas?: boolean
    despesasComerciais?: boolean
    resultadoOperacional?: boolean
    despesasFinanceiras?: boolean
    receitasFinanceiras?: boolean
    lucroLiquido?: boolean
    criadoEm?: boolean
  }, ExtArgs["result"]["dRE"]>

  export type DRESelectScalar = {
    id?: boolean
    tenantId?: boolean
    periodo?: boolean
    ano?: boolean
    mes?: boolean
    receitaBruta?: boolean
    deducoes?: boolean
    receitaLiquida?: boolean
    custosMercadorias?: boolean
    lucroBruto?: boolean
    despesasOperacionais?: boolean
    despesasAdministrativas?: boolean
    despesasComerciais?: boolean
    resultadoOperacional?: boolean
    despesasFinanceiras?: boolean
    receitasFinanceiras?: boolean
    lucroLiquido?: boolean
    criadoEm?: boolean
  }


  export type $DREPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DRE"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      periodo: string
      ano: number
      mes: number | null
      receitaBruta: Prisma.Decimal
      deducoes: Prisma.Decimal
      receitaLiquida: Prisma.Decimal
      custosMercadorias: Prisma.Decimal
      lucroBruto: Prisma.Decimal
      despesasOperacionais: Prisma.Decimal
      despesasAdministrativas: Prisma.Decimal
      despesasComerciais: Prisma.Decimal
      resultadoOperacional: Prisma.Decimal
      despesasFinanceiras: Prisma.Decimal
      receitasFinanceiras: Prisma.Decimal
      lucroLiquido: Prisma.Decimal
      criadoEm: Date
    }, ExtArgs["result"]["dRE"]>
    composites: {}
  }

  type DREGetPayload<S extends boolean | null | undefined | DREDefaultArgs> = $Result.GetResult<Prisma.$DREPayload, S>

  type DRECountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DREFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DRECountAggregateInputType | true
    }

  export interface DREDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DRE'], meta: { name: 'DRE' } }
    /**
     * Find zero or one DRE that matches the filter.
     * @param {DREFindUniqueArgs} args - Arguments to find a DRE
     * @example
     * // Get one DRE
     * const dRE = await prisma.dRE.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DREFindUniqueArgs>(args: SelectSubset<T, DREFindUniqueArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DRE that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DREFindUniqueOrThrowArgs} args - Arguments to find a DRE
     * @example
     * // Get one DRE
     * const dRE = await prisma.dRE.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DREFindUniqueOrThrowArgs>(args: SelectSubset<T, DREFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DRE that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREFindFirstArgs} args - Arguments to find a DRE
     * @example
     * // Get one DRE
     * const dRE = await prisma.dRE.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DREFindFirstArgs>(args?: SelectSubset<T, DREFindFirstArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DRE that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREFindFirstOrThrowArgs} args - Arguments to find a DRE
     * @example
     * // Get one DRE
     * const dRE = await prisma.dRE.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DREFindFirstOrThrowArgs>(args?: SelectSubset<T, DREFindFirstOrThrowArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DRES that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DRES
     * const dRES = await prisma.dRE.findMany()
     * 
     * // Get first 10 DRES
     * const dRES = await prisma.dRE.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dREWithIdOnly = await prisma.dRE.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DREFindManyArgs>(args?: SelectSubset<T, DREFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DRE.
     * @param {DRECreateArgs} args - Arguments to create a DRE.
     * @example
     * // Create one DRE
     * const DRE = await prisma.dRE.create({
     *   data: {
     *     // ... data to create a DRE
     *   }
     * })
     * 
     */
    create<T extends DRECreateArgs>(args: SelectSubset<T, DRECreateArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DRES.
     * @param {DRECreateManyArgs} args - Arguments to create many DRES.
     * @example
     * // Create many DRES
     * const dRE = await prisma.dRE.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DRECreateManyArgs>(args?: SelectSubset<T, DRECreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DRES and returns the data saved in the database.
     * @param {DRECreateManyAndReturnArgs} args - Arguments to create many DRES.
     * @example
     * // Create many DRES
     * const dRE = await prisma.dRE.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DRES and only return the `id`
     * const dREWithIdOnly = await prisma.dRE.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DRECreateManyAndReturnArgs>(args?: SelectSubset<T, DRECreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DRE.
     * @param {DREDeleteArgs} args - Arguments to delete one DRE.
     * @example
     * // Delete one DRE
     * const DRE = await prisma.dRE.delete({
     *   where: {
     *     // ... filter to delete one DRE
     *   }
     * })
     * 
     */
    delete<T extends DREDeleteArgs>(args: SelectSubset<T, DREDeleteArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DRE.
     * @param {DREUpdateArgs} args - Arguments to update one DRE.
     * @example
     * // Update one DRE
     * const dRE = await prisma.dRE.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DREUpdateArgs>(args: SelectSubset<T, DREUpdateArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DRES.
     * @param {DREDeleteManyArgs} args - Arguments to filter DRES to delete.
     * @example
     * // Delete a few DRES
     * const { count } = await prisma.dRE.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DREDeleteManyArgs>(args?: SelectSubset<T, DREDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DRES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DRES
     * const dRE = await prisma.dRE.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DREUpdateManyArgs>(args: SelectSubset<T, DREUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DRE.
     * @param {DREUpsertArgs} args - Arguments to update or create a DRE.
     * @example
     * // Update or create a DRE
     * const dRE = await prisma.dRE.upsert({
     *   create: {
     *     // ... data to create a DRE
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DRE we want to update
     *   }
     * })
     */
    upsert<T extends DREUpsertArgs>(args: SelectSubset<T, DREUpsertArgs<ExtArgs>>): Prisma__DREClient<$Result.GetResult<Prisma.$DREPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DRES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DRECountArgs} args - Arguments to filter DRES to count.
     * @example
     * // Count the number of DRES
     * const count = await prisma.dRE.count({
     *   where: {
     *     // ... the filter for the DRES we want to count
     *   }
     * })
    **/
    count<T extends DRECountArgs>(
      args?: Subset<T, DRECountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DRECountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DRE.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DREAggregateArgs>(args: Subset<T, DREAggregateArgs>): Prisma.PrismaPromise<GetDREAggregateType<T>>

    /**
     * Group by DRE.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DREGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DREGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DREGroupByArgs['orderBy'] }
        : { orderBy?: DREGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DREGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDREGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DRE model
   */
  readonly fields: DREFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DRE.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DREClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DRE model
   */ 
  interface DREFieldRefs {
    readonly id: FieldRef<"DRE", 'String'>
    readonly tenantId: FieldRef<"DRE", 'String'>
    readonly periodo: FieldRef<"DRE", 'String'>
    readonly ano: FieldRef<"DRE", 'Int'>
    readonly mes: FieldRef<"DRE", 'Int'>
    readonly receitaBruta: FieldRef<"DRE", 'Decimal'>
    readonly deducoes: FieldRef<"DRE", 'Decimal'>
    readonly receitaLiquida: FieldRef<"DRE", 'Decimal'>
    readonly custosMercadorias: FieldRef<"DRE", 'Decimal'>
    readonly lucroBruto: FieldRef<"DRE", 'Decimal'>
    readonly despesasOperacionais: FieldRef<"DRE", 'Decimal'>
    readonly despesasAdministrativas: FieldRef<"DRE", 'Decimal'>
    readonly despesasComerciais: FieldRef<"DRE", 'Decimal'>
    readonly resultadoOperacional: FieldRef<"DRE", 'Decimal'>
    readonly despesasFinanceiras: FieldRef<"DRE", 'Decimal'>
    readonly receitasFinanceiras: FieldRef<"DRE", 'Decimal'>
    readonly lucroLiquido: FieldRef<"DRE", 'Decimal'>
    readonly criadoEm: FieldRef<"DRE", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DRE findUnique
   */
  export type DREFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter, which DRE to fetch.
     */
    where: DREWhereUniqueInput
  }

  /**
   * DRE findUniqueOrThrow
   */
  export type DREFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter, which DRE to fetch.
     */
    where: DREWhereUniqueInput
  }

  /**
   * DRE findFirst
   */
  export type DREFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter, which DRE to fetch.
     */
    where?: DREWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DRES to fetch.
     */
    orderBy?: DREOrderByWithRelationInput | DREOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DRES.
     */
    cursor?: DREWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DRES from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DRES.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DRES.
     */
    distinct?: DREScalarFieldEnum | DREScalarFieldEnum[]
  }

  /**
   * DRE findFirstOrThrow
   */
  export type DREFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter, which DRE to fetch.
     */
    where?: DREWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DRES to fetch.
     */
    orderBy?: DREOrderByWithRelationInput | DREOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DRES.
     */
    cursor?: DREWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DRES from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DRES.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DRES.
     */
    distinct?: DREScalarFieldEnum | DREScalarFieldEnum[]
  }

  /**
   * DRE findMany
   */
  export type DREFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter, which DRES to fetch.
     */
    where?: DREWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DRES to fetch.
     */
    orderBy?: DREOrderByWithRelationInput | DREOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DRES.
     */
    cursor?: DREWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DRES from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DRES.
     */
    skip?: number
    distinct?: DREScalarFieldEnum | DREScalarFieldEnum[]
  }

  /**
   * DRE create
   */
  export type DRECreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * The data needed to create a DRE.
     */
    data: XOR<DRECreateInput, DREUncheckedCreateInput>
  }

  /**
   * DRE createMany
   */
  export type DRECreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DRES.
     */
    data: DRECreateManyInput | DRECreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DRE createManyAndReturn
   */
  export type DRECreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DRES.
     */
    data: DRECreateManyInput | DRECreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DRE update
   */
  export type DREUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * The data needed to update a DRE.
     */
    data: XOR<DREUpdateInput, DREUncheckedUpdateInput>
    /**
     * Choose, which DRE to update.
     */
    where: DREWhereUniqueInput
  }

  /**
   * DRE updateMany
   */
  export type DREUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DRES.
     */
    data: XOR<DREUpdateManyMutationInput, DREUncheckedUpdateManyInput>
    /**
     * Filter which DRES to update
     */
    where?: DREWhereInput
  }

  /**
   * DRE upsert
   */
  export type DREUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * The filter to search for the DRE to update in case it exists.
     */
    where: DREWhereUniqueInput
    /**
     * In case the DRE found by the `where` argument doesn't exist, create a new DRE with this data.
     */
    create: XOR<DRECreateInput, DREUncheckedCreateInput>
    /**
     * In case the DRE was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DREUpdateInput, DREUncheckedUpdateInput>
  }

  /**
   * DRE delete
   */
  export type DREDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
    /**
     * Filter which DRE to delete.
     */
    where: DREWhereUniqueInput
  }

  /**
   * DRE deleteMany
   */
  export type DREDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DRES to delete
     */
    where?: DREWhereInput
  }

  /**
   * DRE without action
   */
  export type DREDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DRE
     */
    select?: DRESelect<ExtArgs> | null
  }


  /**
   * Model TituloCobranca
   */

  export type AggregateTituloCobranca = {
    _count: TituloCobrancaCountAggregateOutputType | null
    _avg: TituloCobrancaAvgAggregateOutputType | null
    _sum: TituloCobrancaSumAggregateOutputType | null
    _min: TituloCobrancaMinAggregateOutputType | null
    _max: TituloCobrancaMaxAggregateOutputType | null
  }

  export type TituloCobrancaAvgAggregateOutputType = {
    valor: Decimal | null
    tentativas: number | null
  }

  export type TituloCobrancaSumAggregateOutputType = {
    valor: Decimal | null
    tentativas: number | null
  }

  export type TituloCobrancaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    lancamentoId: string | null
    pedidoId: string | null
    clienteId: string | null
    clienteNome: string | null
    clienteTelefone: string | null
    clienteEmail: string | null
    descricao: string | null
    valor: Decimal | null
    dataVencimento: Date | null
    status: $Enums.StatusTituloCobranca | null
    prioridade: $Enums.PrioridadeCobranca | null
    tentativas: number | null
    ultimaAcaoEm: Date | null
    canalUltimaAcao: string | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type TituloCobrancaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    lancamentoId: string | null
    pedidoId: string | null
    clienteId: string | null
    clienteNome: string | null
    clienteTelefone: string | null
    clienteEmail: string | null
    descricao: string | null
    valor: Decimal | null
    dataVencimento: Date | null
    status: $Enums.StatusTituloCobranca | null
    prioridade: $Enums.PrioridadeCobranca | null
    tentativas: number | null
    ultimaAcaoEm: Date | null
    canalUltimaAcao: string | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type TituloCobrancaCountAggregateOutputType = {
    id: number
    tenantId: number
    lancamentoId: number
    pedidoId: number
    clienteId: number
    clienteNome: number
    clienteTelefone: number
    clienteEmail: number
    descricao: number
    valor: number
    dataVencimento: number
    status: number
    prioridade: number
    tentativas: number
    ultimaAcaoEm: number
    canalUltimaAcao: number
    observacao: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type TituloCobrancaAvgAggregateInputType = {
    valor?: true
    tentativas?: true
  }

  export type TituloCobrancaSumAggregateInputType = {
    valor?: true
    tentativas?: true
  }

  export type TituloCobrancaMinAggregateInputType = {
    id?: true
    tenantId?: true
    lancamentoId?: true
    pedidoId?: true
    clienteId?: true
    clienteNome?: true
    clienteTelefone?: true
    clienteEmail?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    status?: true
    prioridade?: true
    tentativas?: true
    ultimaAcaoEm?: true
    canalUltimaAcao?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type TituloCobrancaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    lancamentoId?: true
    pedidoId?: true
    clienteId?: true
    clienteNome?: true
    clienteTelefone?: true
    clienteEmail?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    status?: true
    prioridade?: true
    tentativas?: true
    ultimaAcaoEm?: true
    canalUltimaAcao?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type TituloCobrancaCountAggregateInputType = {
    id?: true
    tenantId?: true
    lancamentoId?: true
    pedidoId?: true
    clienteId?: true
    clienteNome?: true
    clienteTelefone?: true
    clienteEmail?: true
    descricao?: true
    valor?: true
    dataVencimento?: true
    status?: true
    prioridade?: true
    tentativas?: true
    ultimaAcaoEm?: true
    canalUltimaAcao?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type TituloCobrancaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TituloCobranca to aggregate.
     */
    where?: TituloCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TituloCobrancas to fetch.
     */
    orderBy?: TituloCobrancaOrderByWithRelationInput | TituloCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TituloCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TituloCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TituloCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TituloCobrancas
    **/
    _count?: true | TituloCobrancaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TituloCobrancaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TituloCobrancaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TituloCobrancaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TituloCobrancaMaxAggregateInputType
  }

  export type GetTituloCobrancaAggregateType<T extends TituloCobrancaAggregateArgs> = {
        [P in keyof T & keyof AggregateTituloCobranca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTituloCobranca[P]>
      : GetScalarType<T[P], AggregateTituloCobranca[P]>
  }




  export type TituloCobrancaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TituloCobrancaWhereInput
    orderBy?: TituloCobrancaOrderByWithAggregationInput | TituloCobrancaOrderByWithAggregationInput[]
    by: TituloCobrancaScalarFieldEnum[] | TituloCobrancaScalarFieldEnum
    having?: TituloCobrancaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TituloCobrancaCountAggregateInputType | true
    _avg?: TituloCobrancaAvgAggregateInputType
    _sum?: TituloCobrancaSumAggregateInputType
    _min?: TituloCobrancaMinAggregateInputType
    _max?: TituloCobrancaMaxAggregateInputType
  }

  export type TituloCobrancaGroupByOutputType = {
    id: string
    tenantId: string
    lancamentoId: string | null
    pedidoId: string | null
    clienteId: string | null
    clienteNome: string
    clienteTelefone: string | null
    clienteEmail: string | null
    descricao: string
    valor: Decimal
    dataVencimento: Date
    status: $Enums.StatusTituloCobranca
    prioridade: $Enums.PrioridadeCobranca
    tentativas: number
    ultimaAcaoEm: Date | null
    canalUltimaAcao: string | null
    observacao: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: TituloCobrancaCountAggregateOutputType | null
    _avg: TituloCobrancaAvgAggregateOutputType | null
    _sum: TituloCobrancaSumAggregateOutputType | null
    _min: TituloCobrancaMinAggregateOutputType | null
    _max: TituloCobrancaMaxAggregateOutputType | null
  }

  type GetTituloCobrancaGroupByPayload<T extends TituloCobrancaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TituloCobrancaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TituloCobrancaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TituloCobrancaGroupByOutputType[P]>
            : GetScalarType<T[P], TituloCobrancaGroupByOutputType[P]>
        }
      >
    >


  export type TituloCobrancaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    lancamentoId?: boolean
    pedidoId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteTelefone?: boolean
    clienteEmail?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    status?: boolean
    prioridade?: boolean
    tentativas?: boolean
    ultimaAcaoEm?: boolean
    canalUltimaAcao?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    acoes?: boolean | TituloCobranca$acoesArgs<ExtArgs>
    acordos?: boolean | TituloCobranca$acordosArgs<ExtArgs>
    _count?: boolean | TituloCobrancaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tituloCobranca"]>

  export type TituloCobrancaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    lancamentoId?: boolean
    pedidoId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteTelefone?: boolean
    clienteEmail?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    status?: boolean
    prioridade?: boolean
    tentativas?: boolean
    ultimaAcaoEm?: boolean
    canalUltimaAcao?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["tituloCobranca"]>

  export type TituloCobrancaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    lancamentoId?: boolean
    pedidoId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteTelefone?: boolean
    clienteEmail?: boolean
    descricao?: boolean
    valor?: boolean
    dataVencimento?: boolean
    status?: boolean
    prioridade?: boolean
    tentativas?: boolean
    ultimaAcaoEm?: boolean
    canalUltimaAcao?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type TituloCobrancaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acoes?: boolean | TituloCobranca$acoesArgs<ExtArgs>
    acordos?: boolean | TituloCobranca$acordosArgs<ExtArgs>
    _count?: boolean | TituloCobrancaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TituloCobrancaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TituloCobrancaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TituloCobranca"
    objects: {
      acoes: Prisma.$AcaoCobrancaPayload<ExtArgs>[]
      acordos: Prisma.$AcordoCobrancaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      lancamentoId: string | null
      pedidoId: string | null
      clienteId: string | null
      clienteNome: string
      clienteTelefone: string | null
      clienteEmail: string | null
      descricao: string
      valor: Prisma.Decimal
      dataVencimento: Date
      status: $Enums.StatusTituloCobranca
      prioridade: $Enums.PrioridadeCobranca
      tentativas: number
      ultimaAcaoEm: Date | null
      canalUltimaAcao: string | null
      observacao: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["tituloCobranca"]>
    composites: {}
  }

  type TituloCobrancaGetPayload<S extends boolean | null | undefined | TituloCobrancaDefaultArgs> = $Result.GetResult<Prisma.$TituloCobrancaPayload, S>

  type TituloCobrancaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TituloCobrancaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TituloCobrancaCountAggregateInputType | true
    }

  export interface TituloCobrancaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TituloCobranca'], meta: { name: 'TituloCobranca' } }
    /**
     * Find zero or one TituloCobranca that matches the filter.
     * @param {TituloCobrancaFindUniqueArgs} args - Arguments to find a TituloCobranca
     * @example
     * // Get one TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TituloCobrancaFindUniqueArgs>(args: SelectSubset<T, TituloCobrancaFindUniqueArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TituloCobranca that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TituloCobrancaFindUniqueOrThrowArgs} args - Arguments to find a TituloCobranca
     * @example
     * // Get one TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TituloCobrancaFindUniqueOrThrowArgs>(args: SelectSubset<T, TituloCobrancaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TituloCobranca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaFindFirstArgs} args - Arguments to find a TituloCobranca
     * @example
     * // Get one TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TituloCobrancaFindFirstArgs>(args?: SelectSubset<T, TituloCobrancaFindFirstArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TituloCobranca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaFindFirstOrThrowArgs} args - Arguments to find a TituloCobranca
     * @example
     * // Get one TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TituloCobrancaFindFirstOrThrowArgs>(args?: SelectSubset<T, TituloCobrancaFindFirstOrThrowArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TituloCobrancas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TituloCobrancas
     * const tituloCobrancas = await prisma.tituloCobranca.findMany()
     * 
     * // Get first 10 TituloCobrancas
     * const tituloCobrancas = await prisma.tituloCobranca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tituloCobrancaWithIdOnly = await prisma.tituloCobranca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TituloCobrancaFindManyArgs>(args?: SelectSubset<T, TituloCobrancaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TituloCobranca.
     * @param {TituloCobrancaCreateArgs} args - Arguments to create a TituloCobranca.
     * @example
     * // Create one TituloCobranca
     * const TituloCobranca = await prisma.tituloCobranca.create({
     *   data: {
     *     // ... data to create a TituloCobranca
     *   }
     * })
     * 
     */
    create<T extends TituloCobrancaCreateArgs>(args: SelectSubset<T, TituloCobrancaCreateArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TituloCobrancas.
     * @param {TituloCobrancaCreateManyArgs} args - Arguments to create many TituloCobrancas.
     * @example
     * // Create many TituloCobrancas
     * const tituloCobranca = await prisma.tituloCobranca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TituloCobrancaCreateManyArgs>(args?: SelectSubset<T, TituloCobrancaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TituloCobrancas and returns the data saved in the database.
     * @param {TituloCobrancaCreateManyAndReturnArgs} args - Arguments to create many TituloCobrancas.
     * @example
     * // Create many TituloCobrancas
     * const tituloCobranca = await prisma.tituloCobranca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TituloCobrancas and only return the `id`
     * const tituloCobrancaWithIdOnly = await prisma.tituloCobranca.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TituloCobrancaCreateManyAndReturnArgs>(args?: SelectSubset<T, TituloCobrancaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TituloCobranca.
     * @param {TituloCobrancaDeleteArgs} args - Arguments to delete one TituloCobranca.
     * @example
     * // Delete one TituloCobranca
     * const TituloCobranca = await prisma.tituloCobranca.delete({
     *   where: {
     *     // ... filter to delete one TituloCobranca
     *   }
     * })
     * 
     */
    delete<T extends TituloCobrancaDeleteArgs>(args: SelectSubset<T, TituloCobrancaDeleteArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TituloCobranca.
     * @param {TituloCobrancaUpdateArgs} args - Arguments to update one TituloCobranca.
     * @example
     * // Update one TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TituloCobrancaUpdateArgs>(args: SelectSubset<T, TituloCobrancaUpdateArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TituloCobrancas.
     * @param {TituloCobrancaDeleteManyArgs} args - Arguments to filter TituloCobrancas to delete.
     * @example
     * // Delete a few TituloCobrancas
     * const { count } = await prisma.tituloCobranca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TituloCobrancaDeleteManyArgs>(args?: SelectSubset<T, TituloCobrancaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TituloCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TituloCobrancas
     * const tituloCobranca = await prisma.tituloCobranca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TituloCobrancaUpdateManyArgs>(args: SelectSubset<T, TituloCobrancaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TituloCobranca.
     * @param {TituloCobrancaUpsertArgs} args - Arguments to update or create a TituloCobranca.
     * @example
     * // Update or create a TituloCobranca
     * const tituloCobranca = await prisma.tituloCobranca.upsert({
     *   create: {
     *     // ... data to create a TituloCobranca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TituloCobranca we want to update
     *   }
     * })
     */
    upsert<T extends TituloCobrancaUpsertArgs>(args: SelectSubset<T, TituloCobrancaUpsertArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TituloCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaCountArgs} args - Arguments to filter TituloCobrancas to count.
     * @example
     * // Count the number of TituloCobrancas
     * const count = await prisma.tituloCobranca.count({
     *   where: {
     *     // ... the filter for the TituloCobrancas we want to count
     *   }
     * })
    **/
    count<T extends TituloCobrancaCountArgs>(
      args?: Subset<T, TituloCobrancaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TituloCobrancaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TituloCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TituloCobrancaAggregateArgs>(args: Subset<T, TituloCobrancaAggregateArgs>): Prisma.PrismaPromise<GetTituloCobrancaAggregateType<T>>

    /**
     * Group by TituloCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TituloCobrancaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TituloCobrancaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TituloCobrancaGroupByArgs['orderBy'] }
        : { orderBy?: TituloCobrancaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TituloCobrancaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTituloCobrancaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TituloCobranca model
   */
  readonly fields: TituloCobrancaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TituloCobranca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TituloCobrancaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    acoes<T extends TituloCobranca$acoesArgs<ExtArgs> = {}>(args?: Subset<T, TituloCobranca$acoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findMany"> | Null>
    acordos<T extends TituloCobranca$acordosArgs<ExtArgs> = {}>(args?: Subset<T, TituloCobranca$acordosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TituloCobranca model
   */ 
  interface TituloCobrancaFieldRefs {
    readonly id: FieldRef<"TituloCobranca", 'String'>
    readonly tenantId: FieldRef<"TituloCobranca", 'String'>
    readonly lancamentoId: FieldRef<"TituloCobranca", 'String'>
    readonly pedidoId: FieldRef<"TituloCobranca", 'String'>
    readonly clienteId: FieldRef<"TituloCobranca", 'String'>
    readonly clienteNome: FieldRef<"TituloCobranca", 'String'>
    readonly clienteTelefone: FieldRef<"TituloCobranca", 'String'>
    readonly clienteEmail: FieldRef<"TituloCobranca", 'String'>
    readonly descricao: FieldRef<"TituloCobranca", 'String'>
    readonly valor: FieldRef<"TituloCobranca", 'Decimal'>
    readonly dataVencimento: FieldRef<"TituloCobranca", 'DateTime'>
    readonly status: FieldRef<"TituloCobranca", 'StatusTituloCobranca'>
    readonly prioridade: FieldRef<"TituloCobranca", 'PrioridadeCobranca'>
    readonly tentativas: FieldRef<"TituloCobranca", 'Int'>
    readonly ultimaAcaoEm: FieldRef<"TituloCobranca", 'DateTime'>
    readonly canalUltimaAcao: FieldRef<"TituloCobranca", 'String'>
    readonly observacao: FieldRef<"TituloCobranca", 'String'>
    readonly criadoEm: FieldRef<"TituloCobranca", 'DateTime'>
    readonly atualizadoEm: FieldRef<"TituloCobranca", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TituloCobranca findUnique
   */
  export type TituloCobrancaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which TituloCobranca to fetch.
     */
    where: TituloCobrancaWhereUniqueInput
  }

  /**
   * TituloCobranca findUniqueOrThrow
   */
  export type TituloCobrancaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which TituloCobranca to fetch.
     */
    where: TituloCobrancaWhereUniqueInput
  }

  /**
   * TituloCobranca findFirst
   */
  export type TituloCobrancaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which TituloCobranca to fetch.
     */
    where?: TituloCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TituloCobrancas to fetch.
     */
    orderBy?: TituloCobrancaOrderByWithRelationInput | TituloCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TituloCobrancas.
     */
    cursor?: TituloCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TituloCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TituloCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TituloCobrancas.
     */
    distinct?: TituloCobrancaScalarFieldEnum | TituloCobrancaScalarFieldEnum[]
  }

  /**
   * TituloCobranca findFirstOrThrow
   */
  export type TituloCobrancaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which TituloCobranca to fetch.
     */
    where?: TituloCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TituloCobrancas to fetch.
     */
    orderBy?: TituloCobrancaOrderByWithRelationInput | TituloCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TituloCobrancas.
     */
    cursor?: TituloCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TituloCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TituloCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TituloCobrancas.
     */
    distinct?: TituloCobrancaScalarFieldEnum | TituloCobrancaScalarFieldEnum[]
  }

  /**
   * TituloCobranca findMany
   */
  export type TituloCobrancaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which TituloCobrancas to fetch.
     */
    where?: TituloCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TituloCobrancas to fetch.
     */
    orderBy?: TituloCobrancaOrderByWithRelationInput | TituloCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TituloCobrancas.
     */
    cursor?: TituloCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TituloCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TituloCobrancas.
     */
    skip?: number
    distinct?: TituloCobrancaScalarFieldEnum | TituloCobrancaScalarFieldEnum[]
  }

  /**
   * TituloCobranca create
   */
  export type TituloCobrancaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to create a TituloCobranca.
     */
    data: XOR<TituloCobrancaCreateInput, TituloCobrancaUncheckedCreateInput>
  }

  /**
   * TituloCobranca createMany
   */
  export type TituloCobrancaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TituloCobrancas.
     */
    data: TituloCobrancaCreateManyInput | TituloCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TituloCobranca createManyAndReturn
   */
  export type TituloCobrancaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TituloCobrancas.
     */
    data: TituloCobrancaCreateManyInput | TituloCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TituloCobranca update
   */
  export type TituloCobrancaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to update a TituloCobranca.
     */
    data: XOR<TituloCobrancaUpdateInput, TituloCobrancaUncheckedUpdateInput>
    /**
     * Choose, which TituloCobranca to update.
     */
    where: TituloCobrancaWhereUniqueInput
  }

  /**
   * TituloCobranca updateMany
   */
  export type TituloCobrancaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TituloCobrancas.
     */
    data: XOR<TituloCobrancaUpdateManyMutationInput, TituloCobrancaUncheckedUpdateManyInput>
    /**
     * Filter which TituloCobrancas to update
     */
    where?: TituloCobrancaWhereInput
  }

  /**
   * TituloCobranca upsert
   */
  export type TituloCobrancaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * The filter to search for the TituloCobranca to update in case it exists.
     */
    where: TituloCobrancaWhereUniqueInput
    /**
     * In case the TituloCobranca found by the `where` argument doesn't exist, create a new TituloCobranca with this data.
     */
    create: XOR<TituloCobrancaCreateInput, TituloCobrancaUncheckedCreateInput>
    /**
     * In case the TituloCobranca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TituloCobrancaUpdateInput, TituloCobrancaUncheckedUpdateInput>
  }

  /**
   * TituloCobranca delete
   */
  export type TituloCobrancaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
    /**
     * Filter which TituloCobranca to delete.
     */
    where: TituloCobrancaWhereUniqueInput
  }

  /**
   * TituloCobranca deleteMany
   */
  export type TituloCobrancaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TituloCobrancas to delete
     */
    where?: TituloCobrancaWhereInput
  }

  /**
   * TituloCobranca.acoes
   */
  export type TituloCobranca$acoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    where?: AcaoCobrancaWhereInput
    orderBy?: AcaoCobrancaOrderByWithRelationInput | AcaoCobrancaOrderByWithRelationInput[]
    cursor?: AcaoCobrancaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AcaoCobrancaScalarFieldEnum | AcaoCobrancaScalarFieldEnum[]
  }

  /**
   * TituloCobranca.acordos
   */
  export type TituloCobranca$acordosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    where?: AcordoCobrancaWhereInput
    orderBy?: AcordoCobrancaOrderByWithRelationInput | AcordoCobrancaOrderByWithRelationInput[]
    cursor?: AcordoCobrancaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AcordoCobrancaScalarFieldEnum | AcordoCobrancaScalarFieldEnum[]
  }

  /**
   * TituloCobranca without action
   */
  export type TituloCobrancaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TituloCobranca
     */
    select?: TituloCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TituloCobrancaInclude<ExtArgs> | null
  }


  /**
   * Model AcaoCobranca
   */

  export type AggregateAcaoCobranca = {
    _count: AcaoCobrancaCountAggregateOutputType | null
    _min: AcaoCobrancaMinAggregateOutputType | null
    _max: AcaoCobrancaMaxAggregateOutputType | null
  }

  export type AcaoCobrancaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tituloId: string | null
    clienteNome: string | null
    tipo: $Enums.TipoAcaoCobranca | null
    mensagem: string | null
    status: $Enums.StatusAcaoCobranca | null
    automatica: boolean | null
    detalhe: string | null
    criadoEm: Date | null
  }

  export type AcaoCobrancaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tituloId: string | null
    clienteNome: string | null
    tipo: $Enums.TipoAcaoCobranca | null
    mensagem: string | null
    status: $Enums.StatusAcaoCobranca | null
    automatica: boolean | null
    detalhe: string | null
    criadoEm: Date | null
  }

  export type AcaoCobrancaCountAggregateOutputType = {
    id: number
    tenantId: number
    tituloId: number
    clienteNome: number
    tipo: number
    mensagem: number
    status: number
    automatica: number
    detalhe: number
    criadoEm: number
    _all: number
  }


  export type AcaoCobrancaMinAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteNome?: true
    tipo?: true
    mensagem?: true
    status?: true
    automatica?: true
    detalhe?: true
    criadoEm?: true
  }

  export type AcaoCobrancaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteNome?: true
    tipo?: true
    mensagem?: true
    status?: true
    automatica?: true
    detalhe?: true
    criadoEm?: true
  }

  export type AcaoCobrancaCountAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteNome?: true
    tipo?: true
    mensagem?: true
    status?: true
    automatica?: true
    detalhe?: true
    criadoEm?: true
    _all?: true
  }

  export type AcaoCobrancaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AcaoCobranca to aggregate.
     */
    where?: AcaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcaoCobrancas to fetch.
     */
    orderBy?: AcaoCobrancaOrderByWithRelationInput | AcaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AcaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AcaoCobrancas
    **/
    _count?: true | AcaoCobrancaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AcaoCobrancaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AcaoCobrancaMaxAggregateInputType
  }

  export type GetAcaoCobrancaAggregateType<T extends AcaoCobrancaAggregateArgs> = {
        [P in keyof T & keyof AggregateAcaoCobranca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAcaoCobranca[P]>
      : GetScalarType<T[P], AggregateAcaoCobranca[P]>
  }




  export type AcaoCobrancaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AcaoCobrancaWhereInput
    orderBy?: AcaoCobrancaOrderByWithAggregationInput | AcaoCobrancaOrderByWithAggregationInput[]
    by: AcaoCobrancaScalarFieldEnum[] | AcaoCobrancaScalarFieldEnum
    having?: AcaoCobrancaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AcaoCobrancaCountAggregateInputType | true
    _min?: AcaoCobrancaMinAggregateInputType
    _max?: AcaoCobrancaMaxAggregateInputType
  }

  export type AcaoCobrancaGroupByOutputType = {
    id: string
    tenantId: string
    tituloId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status: $Enums.StatusAcaoCobranca
    automatica: boolean
    detalhe: string | null
    criadoEm: Date
    _count: AcaoCobrancaCountAggregateOutputType | null
    _min: AcaoCobrancaMinAggregateOutputType | null
    _max: AcaoCobrancaMaxAggregateOutputType | null
  }

  type GetAcaoCobrancaGroupByPayload<T extends AcaoCobrancaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AcaoCobrancaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AcaoCobrancaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AcaoCobrancaGroupByOutputType[P]>
            : GetScalarType<T[P], AcaoCobrancaGroupByOutputType[P]>
        }
      >
    >


  export type AcaoCobrancaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteNome?: boolean
    tipo?: boolean
    mensagem?: boolean
    status?: boolean
    automatica?: boolean
    detalhe?: boolean
    criadoEm?: boolean
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acaoCobranca"]>

  export type AcaoCobrancaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteNome?: boolean
    tipo?: boolean
    mensagem?: boolean
    status?: boolean
    automatica?: boolean
    detalhe?: boolean
    criadoEm?: boolean
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acaoCobranca"]>

  export type AcaoCobrancaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteNome?: boolean
    tipo?: boolean
    mensagem?: boolean
    status?: boolean
    automatica?: boolean
    detalhe?: boolean
    criadoEm?: boolean
  }

  export type AcaoCobrancaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }
  export type AcaoCobrancaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }

  export type $AcaoCobrancaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AcaoCobranca"
    objects: {
      titulo: Prisma.$TituloCobrancaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      tituloId: string
      clienteNome: string
      tipo: $Enums.TipoAcaoCobranca
      mensagem: string
      status: $Enums.StatusAcaoCobranca
      automatica: boolean
      detalhe: string | null
      criadoEm: Date
    }, ExtArgs["result"]["acaoCobranca"]>
    composites: {}
  }

  type AcaoCobrancaGetPayload<S extends boolean | null | undefined | AcaoCobrancaDefaultArgs> = $Result.GetResult<Prisma.$AcaoCobrancaPayload, S>

  type AcaoCobrancaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AcaoCobrancaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AcaoCobrancaCountAggregateInputType | true
    }

  export interface AcaoCobrancaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AcaoCobranca'], meta: { name: 'AcaoCobranca' } }
    /**
     * Find zero or one AcaoCobranca that matches the filter.
     * @param {AcaoCobrancaFindUniqueArgs} args - Arguments to find a AcaoCobranca
     * @example
     * // Get one AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AcaoCobrancaFindUniqueArgs>(args: SelectSubset<T, AcaoCobrancaFindUniqueArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AcaoCobranca that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AcaoCobrancaFindUniqueOrThrowArgs} args - Arguments to find a AcaoCobranca
     * @example
     * // Get one AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AcaoCobrancaFindUniqueOrThrowArgs>(args: SelectSubset<T, AcaoCobrancaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AcaoCobranca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaFindFirstArgs} args - Arguments to find a AcaoCobranca
     * @example
     * // Get one AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AcaoCobrancaFindFirstArgs>(args?: SelectSubset<T, AcaoCobrancaFindFirstArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AcaoCobranca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaFindFirstOrThrowArgs} args - Arguments to find a AcaoCobranca
     * @example
     * // Get one AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AcaoCobrancaFindFirstOrThrowArgs>(args?: SelectSubset<T, AcaoCobrancaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AcaoCobrancas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AcaoCobrancas
     * const acaoCobrancas = await prisma.acaoCobranca.findMany()
     * 
     * // Get first 10 AcaoCobrancas
     * const acaoCobrancas = await prisma.acaoCobranca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const acaoCobrancaWithIdOnly = await prisma.acaoCobranca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AcaoCobrancaFindManyArgs>(args?: SelectSubset<T, AcaoCobrancaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AcaoCobranca.
     * @param {AcaoCobrancaCreateArgs} args - Arguments to create a AcaoCobranca.
     * @example
     * // Create one AcaoCobranca
     * const AcaoCobranca = await prisma.acaoCobranca.create({
     *   data: {
     *     // ... data to create a AcaoCobranca
     *   }
     * })
     * 
     */
    create<T extends AcaoCobrancaCreateArgs>(args: SelectSubset<T, AcaoCobrancaCreateArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AcaoCobrancas.
     * @param {AcaoCobrancaCreateManyArgs} args - Arguments to create many AcaoCobrancas.
     * @example
     * // Create many AcaoCobrancas
     * const acaoCobranca = await prisma.acaoCobranca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AcaoCobrancaCreateManyArgs>(args?: SelectSubset<T, AcaoCobrancaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AcaoCobrancas and returns the data saved in the database.
     * @param {AcaoCobrancaCreateManyAndReturnArgs} args - Arguments to create many AcaoCobrancas.
     * @example
     * // Create many AcaoCobrancas
     * const acaoCobranca = await prisma.acaoCobranca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AcaoCobrancas and only return the `id`
     * const acaoCobrancaWithIdOnly = await prisma.acaoCobranca.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AcaoCobrancaCreateManyAndReturnArgs>(args?: SelectSubset<T, AcaoCobrancaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AcaoCobranca.
     * @param {AcaoCobrancaDeleteArgs} args - Arguments to delete one AcaoCobranca.
     * @example
     * // Delete one AcaoCobranca
     * const AcaoCobranca = await prisma.acaoCobranca.delete({
     *   where: {
     *     // ... filter to delete one AcaoCobranca
     *   }
     * })
     * 
     */
    delete<T extends AcaoCobrancaDeleteArgs>(args: SelectSubset<T, AcaoCobrancaDeleteArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AcaoCobranca.
     * @param {AcaoCobrancaUpdateArgs} args - Arguments to update one AcaoCobranca.
     * @example
     * // Update one AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AcaoCobrancaUpdateArgs>(args: SelectSubset<T, AcaoCobrancaUpdateArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AcaoCobrancas.
     * @param {AcaoCobrancaDeleteManyArgs} args - Arguments to filter AcaoCobrancas to delete.
     * @example
     * // Delete a few AcaoCobrancas
     * const { count } = await prisma.acaoCobranca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AcaoCobrancaDeleteManyArgs>(args?: SelectSubset<T, AcaoCobrancaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AcaoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AcaoCobrancas
     * const acaoCobranca = await prisma.acaoCobranca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AcaoCobrancaUpdateManyArgs>(args: SelectSubset<T, AcaoCobrancaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AcaoCobranca.
     * @param {AcaoCobrancaUpsertArgs} args - Arguments to update or create a AcaoCobranca.
     * @example
     * // Update or create a AcaoCobranca
     * const acaoCobranca = await prisma.acaoCobranca.upsert({
     *   create: {
     *     // ... data to create a AcaoCobranca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AcaoCobranca we want to update
     *   }
     * })
     */
    upsert<T extends AcaoCobrancaUpsertArgs>(args: SelectSubset<T, AcaoCobrancaUpsertArgs<ExtArgs>>): Prisma__AcaoCobrancaClient<$Result.GetResult<Prisma.$AcaoCobrancaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AcaoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaCountArgs} args - Arguments to filter AcaoCobrancas to count.
     * @example
     * // Count the number of AcaoCobrancas
     * const count = await prisma.acaoCobranca.count({
     *   where: {
     *     // ... the filter for the AcaoCobrancas we want to count
     *   }
     * })
    **/
    count<T extends AcaoCobrancaCountArgs>(
      args?: Subset<T, AcaoCobrancaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AcaoCobrancaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AcaoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AcaoCobrancaAggregateArgs>(args: Subset<T, AcaoCobrancaAggregateArgs>): Prisma.PrismaPromise<GetAcaoCobrancaAggregateType<T>>

    /**
     * Group by AcaoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcaoCobrancaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AcaoCobrancaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AcaoCobrancaGroupByArgs['orderBy'] }
        : { orderBy?: AcaoCobrancaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AcaoCobrancaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAcaoCobrancaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AcaoCobranca model
   */
  readonly fields: AcaoCobrancaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AcaoCobranca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AcaoCobrancaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    titulo<T extends TituloCobrancaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TituloCobrancaDefaultArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AcaoCobranca model
   */ 
  interface AcaoCobrancaFieldRefs {
    readonly id: FieldRef<"AcaoCobranca", 'String'>
    readonly tenantId: FieldRef<"AcaoCobranca", 'String'>
    readonly tituloId: FieldRef<"AcaoCobranca", 'String'>
    readonly clienteNome: FieldRef<"AcaoCobranca", 'String'>
    readonly tipo: FieldRef<"AcaoCobranca", 'TipoAcaoCobranca'>
    readonly mensagem: FieldRef<"AcaoCobranca", 'String'>
    readonly status: FieldRef<"AcaoCobranca", 'StatusAcaoCobranca'>
    readonly automatica: FieldRef<"AcaoCobranca", 'Boolean'>
    readonly detalhe: FieldRef<"AcaoCobranca", 'String'>
    readonly criadoEm: FieldRef<"AcaoCobranca", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AcaoCobranca findUnique
   */
  export type AcaoCobrancaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcaoCobranca to fetch.
     */
    where: AcaoCobrancaWhereUniqueInput
  }

  /**
   * AcaoCobranca findUniqueOrThrow
   */
  export type AcaoCobrancaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcaoCobranca to fetch.
     */
    where: AcaoCobrancaWhereUniqueInput
  }

  /**
   * AcaoCobranca findFirst
   */
  export type AcaoCobrancaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcaoCobranca to fetch.
     */
    where?: AcaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcaoCobrancas to fetch.
     */
    orderBy?: AcaoCobrancaOrderByWithRelationInput | AcaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AcaoCobrancas.
     */
    cursor?: AcaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AcaoCobrancas.
     */
    distinct?: AcaoCobrancaScalarFieldEnum | AcaoCobrancaScalarFieldEnum[]
  }

  /**
   * AcaoCobranca findFirstOrThrow
   */
  export type AcaoCobrancaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcaoCobranca to fetch.
     */
    where?: AcaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcaoCobrancas to fetch.
     */
    orderBy?: AcaoCobrancaOrderByWithRelationInput | AcaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AcaoCobrancas.
     */
    cursor?: AcaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AcaoCobrancas.
     */
    distinct?: AcaoCobrancaScalarFieldEnum | AcaoCobrancaScalarFieldEnum[]
  }

  /**
   * AcaoCobranca findMany
   */
  export type AcaoCobrancaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcaoCobrancas to fetch.
     */
    where?: AcaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcaoCobrancas to fetch.
     */
    orderBy?: AcaoCobrancaOrderByWithRelationInput | AcaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AcaoCobrancas.
     */
    cursor?: AcaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcaoCobrancas.
     */
    skip?: number
    distinct?: AcaoCobrancaScalarFieldEnum | AcaoCobrancaScalarFieldEnum[]
  }

  /**
   * AcaoCobranca create
   */
  export type AcaoCobrancaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to create a AcaoCobranca.
     */
    data: XOR<AcaoCobrancaCreateInput, AcaoCobrancaUncheckedCreateInput>
  }

  /**
   * AcaoCobranca createMany
   */
  export type AcaoCobrancaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AcaoCobrancas.
     */
    data: AcaoCobrancaCreateManyInput | AcaoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AcaoCobranca createManyAndReturn
   */
  export type AcaoCobrancaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AcaoCobrancas.
     */
    data: AcaoCobrancaCreateManyInput | AcaoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AcaoCobranca update
   */
  export type AcaoCobrancaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to update a AcaoCobranca.
     */
    data: XOR<AcaoCobrancaUpdateInput, AcaoCobrancaUncheckedUpdateInput>
    /**
     * Choose, which AcaoCobranca to update.
     */
    where: AcaoCobrancaWhereUniqueInput
  }

  /**
   * AcaoCobranca updateMany
   */
  export type AcaoCobrancaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AcaoCobrancas.
     */
    data: XOR<AcaoCobrancaUpdateManyMutationInput, AcaoCobrancaUncheckedUpdateManyInput>
    /**
     * Filter which AcaoCobrancas to update
     */
    where?: AcaoCobrancaWhereInput
  }

  /**
   * AcaoCobranca upsert
   */
  export type AcaoCobrancaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * The filter to search for the AcaoCobranca to update in case it exists.
     */
    where: AcaoCobrancaWhereUniqueInput
    /**
     * In case the AcaoCobranca found by the `where` argument doesn't exist, create a new AcaoCobranca with this data.
     */
    create: XOR<AcaoCobrancaCreateInput, AcaoCobrancaUncheckedCreateInput>
    /**
     * In case the AcaoCobranca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AcaoCobrancaUpdateInput, AcaoCobrancaUncheckedUpdateInput>
  }

  /**
   * AcaoCobranca delete
   */
  export type AcaoCobrancaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
    /**
     * Filter which AcaoCobranca to delete.
     */
    where: AcaoCobrancaWhereUniqueInput
  }

  /**
   * AcaoCobranca deleteMany
   */
  export type AcaoCobrancaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AcaoCobrancas to delete
     */
    where?: AcaoCobrancaWhereInput
  }

  /**
   * AcaoCobranca without action
   */
  export type AcaoCobrancaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcaoCobranca
     */
    select?: AcaoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcaoCobrancaInclude<ExtArgs> | null
  }


  /**
   * Model AcordoCobranca
   */

  export type AggregateAcordoCobranca = {
    _count: AcordoCobrancaCountAggregateOutputType | null
    _avg: AcordoCobrancaAvgAggregateOutputType | null
    _sum: AcordoCobrancaSumAggregateOutputType | null
    _min: AcordoCobrancaMinAggregateOutputType | null
    _max: AcordoCobrancaMaxAggregateOutputType | null
  }

  export type AcordoCobrancaAvgAggregateOutputType = {
    valorOriginal: Decimal | null
    descontoAplicado: Decimal | null
    valorFinal: Decimal | null
    numeroParcelas: number | null
  }

  export type AcordoCobrancaSumAggregateOutputType = {
    valorOriginal: Decimal | null
    descontoAplicado: Decimal | null
    valorFinal: Decimal | null
    numeroParcelas: number | null
  }

  export type AcordoCobrancaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tituloId: string | null
    clienteId: string | null
    clienteNome: string | null
    valorOriginal: Decimal | null
    descontoAplicado: Decimal | null
    valorFinal: Decimal | null
    numeroParcelas: number | null
    status: $Enums.StatusAcordoCobranca | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type AcordoCobrancaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tituloId: string | null
    clienteId: string | null
    clienteNome: string | null
    valorOriginal: Decimal | null
    descontoAplicado: Decimal | null
    valorFinal: Decimal | null
    numeroParcelas: number | null
    status: $Enums.StatusAcordoCobranca | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type AcordoCobrancaCountAggregateOutputType = {
    id: number
    tenantId: number
    tituloId: number
    clienteId: number
    clienteNome: number
    valorOriginal: number
    descontoAplicado: number
    valorFinal: number
    numeroParcelas: number
    status: number
    observacao: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type AcordoCobrancaAvgAggregateInputType = {
    valorOriginal?: true
    descontoAplicado?: true
    valorFinal?: true
    numeroParcelas?: true
  }

  export type AcordoCobrancaSumAggregateInputType = {
    valorOriginal?: true
    descontoAplicado?: true
    valorFinal?: true
    numeroParcelas?: true
  }

  export type AcordoCobrancaMinAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteId?: true
    clienteNome?: true
    valorOriginal?: true
    descontoAplicado?: true
    valorFinal?: true
    numeroParcelas?: true
    status?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type AcordoCobrancaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteId?: true
    clienteNome?: true
    valorOriginal?: true
    descontoAplicado?: true
    valorFinal?: true
    numeroParcelas?: true
    status?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type AcordoCobrancaCountAggregateInputType = {
    id?: true
    tenantId?: true
    tituloId?: true
    clienteId?: true
    clienteNome?: true
    valorOriginal?: true
    descontoAplicado?: true
    valorFinal?: true
    numeroParcelas?: true
    status?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type AcordoCobrancaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AcordoCobranca to aggregate.
     */
    where?: AcordoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcordoCobrancas to fetch.
     */
    orderBy?: AcordoCobrancaOrderByWithRelationInput | AcordoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AcordoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcordoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcordoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AcordoCobrancas
    **/
    _count?: true | AcordoCobrancaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AcordoCobrancaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AcordoCobrancaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AcordoCobrancaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AcordoCobrancaMaxAggregateInputType
  }

  export type GetAcordoCobrancaAggregateType<T extends AcordoCobrancaAggregateArgs> = {
        [P in keyof T & keyof AggregateAcordoCobranca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAcordoCobranca[P]>
      : GetScalarType<T[P], AggregateAcordoCobranca[P]>
  }




  export type AcordoCobrancaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AcordoCobrancaWhereInput
    orderBy?: AcordoCobrancaOrderByWithAggregationInput | AcordoCobrancaOrderByWithAggregationInput[]
    by: AcordoCobrancaScalarFieldEnum[] | AcordoCobrancaScalarFieldEnum
    having?: AcordoCobrancaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AcordoCobrancaCountAggregateInputType | true
    _avg?: AcordoCobrancaAvgAggregateInputType
    _sum?: AcordoCobrancaSumAggregateInputType
    _min?: AcordoCobrancaMinAggregateInputType
    _max?: AcordoCobrancaMaxAggregateInputType
  }

  export type AcordoCobrancaGroupByOutputType = {
    id: string
    tenantId: string
    tituloId: string
    clienteId: string | null
    clienteNome: string
    valorOriginal: Decimal
    descontoAplicado: Decimal
    valorFinal: Decimal
    numeroParcelas: number
    status: $Enums.StatusAcordoCobranca
    observacao: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: AcordoCobrancaCountAggregateOutputType | null
    _avg: AcordoCobrancaAvgAggregateOutputType | null
    _sum: AcordoCobrancaSumAggregateOutputType | null
    _min: AcordoCobrancaMinAggregateOutputType | null
    _max: AcordoCobrancaMaxAggregateOutputType | null
  }

  type GetAcordoCobrancaGroupByPayload<T extends AcordoCobrancaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AcordoCobrancaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AcordoCobrancaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AcordoCobrancaGroupByOutputType[P]>
            : GetScalarType<T[P], AcordoCobrancaGroupByOutputType[P]>
        }
      >
    >


  export type AcordoCobrancaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    valorOriginal?: boolean
    descontoAplicado?: boolean
    valorFinal?: boolean
    numeroParcelas?: boolean
    status?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
    parcelas?: boolean | AcordoCobranca$parcelasArgs<ExtArgs>
    _count?: boolean | AcordoCobrancaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acordoCobranca"]>

  export type AcordoCobrancaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    valorOriginal?: boolean
    descontoAplicado?: boolean
    valorFinal?: boolean
    numeroParcelas?: boolean
    status?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acordoCobranca"]>

  export type AcordoCobrancaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    tituloId?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    valorOriginal?: boolean
    descontoAplicado?: boolean
    valorFinal?: boolean
    numeroParcelas?: boolean
    status?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type AcordoCobrancaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
    parcelas?: boolean | AcordoCobranca$parcelasArgs<ExtArgs>
    _count?: boolean | AcordoCobrancaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AcordoCobrancaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    titulo?: boolean | TituloCobrancaDefaultArgs<ExtArgs>
  }

  export type $AcordoCobrancaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AcordoCobranca"
    objects: {
      titulo: Prisma.$TituloCobrancaPayload<ExtArgs>
      parcelas: Prisma.$ParcelaAcordoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      tituloId: string
      clienteId: string | null
      clienteNome: string
      valorOriginal: Prisma.Decimal
      descontoAplicado: Prisma.Decimal
      valorFinal: Prisma.Decimal
      numeroParcelas: number
      status: $Enums.StatusAcordoCobranca
      observacao: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["acordoCobranca"]>
    composites: {}
  }

  type AcordoCobrancaGetPayload<S extends boolean | null | undefined | AcordoCobrancaDefaultArgs> = $Result.GetResult<Prisma.$AcordoCobrancaPayload, S>

  type AcordoCobrancaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AcordoCobrancaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AcordoCobrancaCountAggregateInputType | true
    }

  export interface AcordoCobrancaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AcordoCobranca'], meta: { name: 'AcordoCobranca' } }
    /**
     * Find zero or one AcordoCobranca that matches the filter.
     * @param {AcordoCobrancaFindUniqueArgs} args - Arguments to find a AcordoCobranca
     * @example
     * // Get one AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AcordoCobrancaFindUniqueArgs>(args: SelectSubset<T, AcordoCobrancaFindUniqueArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AcordoCobranca that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AcordoCobrancaFindUniqueOrThrowArgs} args - Arguments to find a AcordoCobranca
     * @example
     * // Get one AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AcordoCobrancaFindUniqueOrThrowArgs>(args: SelectSubset<T, AcordoCobrancaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AcordoCobranca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaFindFirstArgs} args - Arguments to find a AcordoCobranca
     * @example
     * // Get one AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AcordoCobrancaFindFirstArgs>(args?: SelectSubset<T, AcordoCobrancaFindFirstArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AcordoCobranca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaFindFirstOrThrowArgs} args - Arguments to find a AcordoCobranca
     * @example
     * // Get one AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AcordoCobrancaFindFirstOrThrowArgs>(args?: SelectSubset<T, AcordoCobrancaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AcordoCobrancas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AcordoCobrancas
     * const acordoCobrancas = await prisma.acordoCobranca.findMany()
     * 
     * // Get first 10 AcordoCobrancas
     * const acordoCobrancas = await prisma.acordoCobranca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const acordoCobrancaWithIdOnly = await prisma.acordoCobranca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AcordoCobrancaFindManyArgs>(args?: SelectSubset<T, AcordoCobrancaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AcordoCobranca.
     * @param {AcordoCobrancaCreateArgs} args - Arguments to create a AcordoCobranca.
     * @example
     * // Create one AcordoCobranca
     * const AcordoCobranca = await prisma.acordoCobranca.create({
     *   data: {
     *     // ... data to create a AcordoCobranca
     *   }
     * })
     * 
     */
    create<T extends AcordoCobrancaCreateArgs>(args: SelectSubset<T, AcordoCobrancaCreateArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AcordoCobrancas.
     * @param {AcordoCobrancaCreateManyArgs} args - Arguments to create many AcordoCobrancas.
     * @example
     * // Create many AcordoCobrancas
     * const acordoCobranca = await prisma.acordoCobranca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AcordoCobrancaCreateManyArgs>(args?: SelectSubset<T, AcordoCobrancaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AcordoCobrancas and returns the data saved in the database.
     * @param {AcordoCobrancaCreateManyAndReturnArgs} args - Arguments to create many AcordoCobrancas.
     * @example
     * // Create many AcordoCobrancas
     * const acordoCobranca = await prisma.acordoCobranca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AcordoCobrancas and only return the `id`
     * const acordoCobrancaWithIdOnly = await prisma.acordoCobranca.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AcordoCobrancaCreateManyAndReturnArgs>(args?: SelectSubset<T, AcordoCobrancaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AcordoCobranca.
     * @param {AcordoCobrancaDeleteArgs} args - Arguments to delete one AcordoCobranca.
     * @example
     * // Delete one AcordoCobranca
     * const AcordoCobranca = await prisma.acordoCobranca.delete({
     *   where: {
     *     // ... filter to delete one AcordoCobranca
     *   }
     * })
     * 
     */
    delete<T extends AcordoCobrancaDeleteArgs>(args: SelectSubset<T, AcordoCobrancaDeleteArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AcordoCobranca.
     * @param {AcordoCobrancaUpdateArgs} args - Arguments to update one AcordoCobranca.
     * @example
     * // Update one AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AcordoCobrancaUpdateArgs>(args: SelectSubset<T, AcordoCobrancaUpdateArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AcordoCobrancas.
     * @param {AcordoCobrancaDeleteManyArgs} args - Arguments to filter AcordoCobrancas to delete.
     * @example
     * // Delete a few AcordoCobrancas
     * const { count } = await prisma.acordoCobranca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AcordoCobrancaDeleteManyArgs>(args?: SelectSubset<T, AcordoCobrancaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AcordoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AcordoCobrancas
     * const acordoCobranca = await prisma.acordoCobranca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AcordoCobrancaUpdateManyArgs>(args: SelectSubset<T, AcordoCobrancaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AcordoCobranca.
     * @param {AcordoCobrancaUpsertArgs} args - Arguments to update or create a AcordoCobranca.
     * @example
     * // Update or create a AcordoCobranca
     * const acordoCobranca = await prisma.acordoCobranca.upsert({
     *   create: {
     *     // ... data to create a AcordoCobranca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AcordoCobranca we want to update
     *   }
     * })
     */
    upsert<T extends AcordoCobrancaUpsertArgs>(args: SelectSubset<T, AcordoCobrancaUpsertArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AcordoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaCountArgs} args - Arguments to filter AcordoCobrancas to count.
     * @example
     * // Count the number of AcordoCobrancas
     * const count = await prisma.acordoCobranca.count({
     *   where: {
     *     // ... the filter for the AcordoCobrancas we want to count
     *   }
     * })
    **/
    count<T extends AcordoCobrancaCountArgs>(
      args?: Subset<T, AcordoCobrancaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AcordoCobrancaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AcordoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AcordoCobrancaAggregateArgs>(args: Subset<T, AcordoCobrancaAggregateArgs>): Prisma.PrismaPromise<GetAcordoCobrancaAggregateType<T>>

    /**
     * Group by AcordoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AcordoCobrancaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AcordoCobrancaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AcordoCobrancaGroupByArgs['orderBy'] }
        : { orderBy?: AcordoCobrancaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AcordoCobrancaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAcordoCobrancaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AcordoCobranca model
   */
  readonly fields: AcordoCobrancaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AcordoCobranca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AcordoCobrancaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    titulo<T extends TituloCobrancaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TituloCobrancaDefaultArgs<ExtArgs>>): Prisma__TituloCobrancaClient<$Result.GetResult<Prisma.$TituloCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    parcelas<T extends AcordoCobranca$parcelasArgs<ExtArgs> = {}>(args?: Subset<T, AcordoCobranca$parcelasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AcordoCobranca model
   */ 
  interface AcordoCobrancaFieldRefs {
    readonly id: FieldRef<"AcordoCobranca", 'String'>
    readonly tenantId: FieldRef<"AcordoCobranca", 'String'>
    readonly tituloId: FieldRef<"AcordoCobranca", 'String'>
    readonly clienteId: FieldRef<"AcordoCobranca", 'String'>
    readonly clienteNome: FieldRef<"AcordoCobranca", 'String'>
    readonly valorOriginal: FieldRef<"AcordoCobranca", 'Decimal'>
    readonly descontoAplicado: FieldRef<"AcordoCobranca", 'Decimal'>
    readonly valorFinal: FieldRef<"AcordoCobranca", 'Decimal'>
    readonly numeroParcelas: FieldRef<"AcordoCobranca", 'Int'>
    readonly status: FieldRef<"AcordoCobranca", 'StatusAcordoCobranca'>
    readonly observacao: FieldRef<"AcordoCobranca", 'String'>
    readonly criadoEm: FieldRef<"AcordoCobranca", 'DateTime'>
    readonly atualizadoEm: FieldRef<"AcordoCobranca", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AcordoCobranca findUnique
   */
  export type AcordoCobrancaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcordoCobranca to fetch.
     */
    where: AcordoCobrancaWhereUniqueInput
  }

  /**
   * AcordoCobranca findUniqueOrThrow
   */
  export type AcordoCobrancaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcordoCobranca to fetch.
     */
    where: AcordoCobrancaWhereUniqueInput
  }

  /**
   * AcordoCobranca findFirst
   */
  export type AcordoCobrancaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcordoCobranca to fetch.
     */
    where?: AcordoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcordoCobrancas to fetch.
     */
    orderBy?: AcordoCobrancaOrderByWithRelationInput | AcordoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AcordoCobrancas.
     */
    cursor?: AcordoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcordoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcordoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AcordoCobrancas.
     */
    distinct?: AcordoCobrancaScalarFieldEnum | AcordoCobrancaScalarFieldEnum[]
  }

  /**
   * AcordoCobranca findFirstOrThrow
   */
  export type AcordoCobrancaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcordoCobranca to fetch.
     */
    where?: AcordoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcordoCobrancas to fetch.
     */
    orderBy?: AcordoCobrancaOrderByWithRelationInput | AcordoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AcordoCobrancas.
     */
    cursor?: AcordoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcordoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcordoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AcordoCobrancas.
     */
    distinct?: AcordoCobrancaScalarFieldEnum | AcordoCobrancaScalarFieldEnum[]
  }

  /**
   * AcordoCobranca findMany
   */
  export type AcordoCobrancaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter, which AcordoCobrancas to fetch.
     */
    where?: AcordoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AcordoCobrancas to fetch.
     */
    orderBy?: AcordoCobrancaOrderByWithRelationInput | AcordoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AcordoCobrancas.
     */
    cursor?: AcordoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AcordoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AcordoCobrancas.
     */
    skip?: number
    distinct?: AcordoCobrancaScalarFieldEnum | AcordoCobrancaScalarFieldEnum[]
  }

  /**
   * AcordoCobranca create
   */
  export type AcordoCobrancaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to create a AcordoCobranca.
     */
    data: XOR<AcordoCobrancaCreateInput, AcordoCobrancaUncheckedCreateInput>
  }

  /**
   * AcordoCobranca createMany
   */
  export type AcordoCobrancaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AcordoCobrancas.
     */
    data: AcordoCobrancaCreateManyInput | AcordoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AcordoCobranca createManyAndReturn
   */
  export type AcordoCobrancaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AcordoCobrancas.
     */
    data: AcordoCobrancaCreateManyInput | AcordoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AcordoCobranca update
   */
  export type AcordoCobrancaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * The data needed to update a AcordoCobranca.
     */
    data: XOR<AcordoCobrancaUpdateInput, AcordoCobrancaUncheckedUpdateInput>
    /**
     * Choose, which AcordoCobranca to update.
     */
    where: AcordoCobrancaWhereUniqueInput
  }

  /**
   * AcordoCobranca updateMany
   */
  export type AcordoCobrancaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AcordoCobrancas.
     */
    data: XOR<AcordoCobrancaUpdateManyMutationInput, AcordoCobrancaUncheckedUpdateManyInput>
    /**
     * Filter which AcordoCobrancas to update
     */
    where?: AcordoCobrancaWhereInput
  }

  /**
   * AcordoCobranca upsert
   */
  export type AcordoCobrancaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * The filter to search for the AcordoCobranca to update in case it exists.
     */
    where: AcordoCobrancaWhereUniqueInput
    /**
     * In case the AcordoCobranca found by the `where` argument doesn't exist, create a new AcordoCobranca with this data.
     */
    create: XOR<AcordoCobrancaCreateInput, AcordoCobrancaUncheckedCreateInput>
    /**
     * In case the AcordoCobranca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AcordoCobrancaUpdateInput, AcordoCobrancaUncheckedUpdateInput>
  }

  /**
   * AcordoCobranca delete
   */
  export type AcordoCobrancaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
    /**
     * Filter which AcordoCobranca to delete.
     */
    where: AcordoCobrancaWhereUniqueInput
  }

  /**
   * AcordoCobranca deleteMany
   */
  export type AcordoCobrancaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AcordoCobrancas to delete
     */
    where?: AcordoCobrancaWhereInput
  }

  /**
   * AcordoCobranca.parcelas
   */
  export type AcordoCobranca$parcelasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    where?: ParcelaAcordoWhereInput
    orderBy?: ParcelaAcordoOrderByWithRelationInput | ParcelaAcordoOrderByWithRelationInput[]
    cursor?: ParcelaAcordoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ParcelaAcordoScalarFieldEnum | ParcelaAcordoScalarFieldEnum[]
  }

  /**
   * AcordoCobranca without action
   */
  export type AcordoCobrancaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AcordoCobranca
     */
    select?: AcordoCobrancaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AcordoCobrancaInclude<ExtArgs> | null
  }


  /**
   * Model ParcelaAcordo
   */

  export type AggregateParcelaAcordo = {
    _count: ParcelaAcordoCountAggregateOutputType | null
    _avg: ParcelaAcordoAvgAggregateOutputType | null
    _sum: ParcelaAcordoSumAggregateOutputType | null
    _min: ParcelaAcordoMinAggregateOutputType | null
    _max: ParcelaAcordoMaxAggregateOutputType | null
  }

  export type ParcelaAcordoAvgAggregateOutputType = {
    numero: number | null
    valor: Decimal | null
  }

  export type ParcelaAcordoSumAggregateOutputType = {
    numero: number | null
    valor: Decimal | null
  }

  export type ParcelaAcordoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    acordoId: string | null
    numero: number | null
    valor: Decimal | null
    vencimento: Date | null
    pago: boolean | null
    pagoEm: Date | null
  }

  export type ParcelaAcordoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    acordoId: string | null
    numero: number | null
    valor: Decimal | null
    vencimento: Date | null
    pago: boolean | null
    pagoEm: Date | null
  }

  export type ParcelaAcordoCountAggregateOutputType = {
    id: number
    tenantId: number
    acordoId: number
    numero: number
    valor: number
    vencimento: number
    pago: number
    pagoEm: number
    _all: number
  }


  export type ParcelaAcordoAvgAggregateInputType = {
    numero?: true
    valor?: true
  }

  export type ParcelaAcordoSumAggregateInputType = {
    numero?: true
    valor?: true
  }

  export type ParcelaAcordoMinAggregateInputType = {
    id?: true
    tenantId?: true
    acordoId?: true
    numero?: true
    valor?: true
    vencimento?: true
    pago?: true
    pagoEm?: true
  }

  export type ParcelaAcordoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    acordoId?: true
    numero?: true
    valor?: true
    vencimento?: true
    pago?: true
    pagoEm?: true
  }

  export type ParcelaAcordoCountAggregateInputType = {
    id?: true
    tenantId?: true
    acordoId?: true
    numero?: true
    valor?: true
    vencimento?: true
    pago?: true
    pagoEm?: true
    _all?: true
  }

  export type ParcelaAcordoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParcelaAcordo to aggregate.
     */
    where?: ParcelaAcordoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParcelaAcordos to fetch.
     */
    orderBy?: ParcelaAcordoOrderByWithRelationInput | ParcelaAcordoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ParcelaAcordoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParcelaAcordos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParcelaAcordos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ParcelaAcordos
    **/
    _count?: true | ParcelaAcordoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ParcelaAcordoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ParcelaAcordoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ParcelaAcordoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ParcelaAcordoMaxAggregateInputType
  }

  export type GetParcelaAcordoAggregateType<T extends ParcelaAcordoAggregateArgs> = {
        [P in keyof T & keyof AggregateParcelaAcordo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParcelaAcordo[P]>
      : GetScalarType<T[P], AggregateParcelaAcordo[P]>
  }




  export type ParcelaAcordoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ParcelaAcordoWhereInput
    orderBy?: ParcelaAcordoOrderByWithAggregationInput | ParcelaAcordoOrderByWithAggregationInput[]
    by: ParcelaAcordoScalarFieldEnum[] | ParcelaAcordoScalarFieldEnum
    having?: ParcelaAcordoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ParcelaAcordoCountAggregateInputType | true
    _avg?: ParcelaAcordoAvgAggregateInputType
    _sum?: ParcelaAcordoSumAggregateInputType
    _min?: ParcelaAcordoMinAggregateInputType
    _max?: ParcelaAcordoMaxAggregateInputType
  }

  export type ParcelaAcordoGroupByOutputType = {
    id: string
    tenantId: string
    acordoId: string
    numero: number
    valor: Decimal
    vencimento: Date
    pago: boolean
    pagoEm: Date | null
    _count: ParcelaAcordoCountAggregateOutputType | null
    _avg: ParcelaAcordoAvgAggregateOutputType | null
    _sum: ParcelaAcordoSumAggregateOutputType | null
    _min: ParcelaAcordoMinAggregateOutputType | null
    _max: ParcelaAcordoMaxAggregateOutputType | null
  }

  type GetParcelaAcordoGroupByPayload<T extends ParcelaAcordoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ParcelaAcordoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ParcelaAcordoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ParcelaAcordoGroupByOutputType[P]>
            : GetScalarType<T[P], ParcelaAcordoGroupByOutputType[P]>
        }
      >
    >


  export type ParcelaAcordoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    acordoId?: boolean
    numero?: boolean
    valor?: boolean
    vencimento?: boolean
    pago?: boolean
    pagoEm?: boolean
    acordo?: boolean | AcordoCobrancaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["parcelaAcordo"]>

  export type ParcelaAcordoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    acordoId?: boolean
    numero?: boolean
    valor?: boolean
    vencimento?: boolean
    pago?: boolean
    pagoEm?: boolean
    acordo?: boolean | AcordoCobrancaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["parcelaAcordo"]>

  export type ParcelaAcordoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    acordoId?: boolean
    numero?: boolean
    valor?: boolean
    vencimento?: boolean
    pago?: boolean
    pagoEm?: boolean
  }

  export type ParcelaAcordoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acordo?: boolean | AcordoCobrancaDefaultArgs<ExtArgs>
  }
  export type ParcelaAcordoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acordo?: boolean | AcordoCobrancaDefaultArgs<ExtArgs>
  }

  export type $ParcelaAcordoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ParcelaAcordo"
    objects: {
      acordo: Prisma.$AcordoCobrancaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      acordoId: string
      numero: number
      valor: Prisma.Decimal
      vencimento: Date
      pago: boolean
      pagoEm: Date | null
    }, ExtArgs["result"]["parcelaAcordo"]>
    composites: {}
  }

  type ParcelaAcordoGetPayload<S extends boolean | null | undefined | ParcelaAcordoDefaultArgs> = $Result.GetResult<Prisma.$ParcelaAcordoPayload, S>

  type ParcelaAcordoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ParcelaAcordoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ParcelaAcordoCountAggregateInputType | true
    }

  export interface ParcelaAcordoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ParcelaAcordo'], meta: { name: 'ParcelaAcordo' } }
    /**
     * Find zero or one ParcelaAcordo that matches the filter.
     * @param {ParcelaAcordoFindUniqueArgs} args - Arguments to find a ParcelaAcordo
     * @example
     * // Get one ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ParcelaAcordoFindUniqueArgs>(args: SelectSubset<T, ParcelaAcordoFindUniqueArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ParcelaAcordo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ParcelaAcordoFindUniqueOrThrowArgs} args - Arguments to find a ParcelaAcordo
     * @example
     * // Get one ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ParcelaAcordoFindUniqueOrThrowArgs>(args: SelectSubset<T, ParcelaAcordoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ParcelaAcordo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoFindFirstArgs} args - Arguments to find a ParcelaAcordo
     * @example
     * // Get one ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ParcelaAcordoFindFirstArgs>(args?: SelectSubset<T, ParcelaAcordoFindFirstArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ParcelaAcordo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoFindFirstOrThrowArgs} args - Arguments to find a ParcelaAcordo
     * @example
     * // Get one ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ParcelaAcordoFindFirstOrThrowArgs>(args?: SelectSubset<T, ParcelaAcordoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ParcelaAcordos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ParcelaAcordos
     * const parcelaAcordos = await prisma.parcelaAcordo.findMany()
     * 
     * // Get first 10 ParcelaAcordos
     * const parcelaAcordos = await prisma.parcelaAcordo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const parcelaAcordoWithIdOnly = await prisma.parcelaAcordo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ParcelaAcordoFindManyArgs>(args?: SelectSubset<T, ParcelaAcordoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ParcelaAcordo.
     * @param {ParcelaAcordoCreateArgs} args - Arguments to create a ParcelaAcordo.
     * @example
     * // Create one ParcelaAcordo
     * const ParcelaAcordo = await prisma.parcelaAcordo.create({
     *   data: {
     *     // ... data to create a ParcelaAcordo
     *   }
     * })
     * 
     */
    create<T extends ParcelaAcordoCreateArgs>(args: SelectSubset<T, ParcelaAcordoCreateArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ParcelaAcordos.
     * @param {ParcelaAcordoCreateManyArgs} args - Arguments to create many ParcelaAcordos.
     * @example
     * // Create many ParcelaAcordos
     * const parcelaAcordo = await prisma.parcelaAcordo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ParcelaAcordoCreateManyArgs>(args?: SelectSubset<T, ParcelaAcordoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ParcelaAcordos and returns the data saved in the database.
     * @param {ParcelaAcordoCreateManyAndReturnArgs} args - Arguments to create many ParcelaAcordos.
     * @example
     * // Create many ParcelaAcordos
     * const parcelaAcordo = await prisma.parcelaAcordo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ParcelaAcordos and only return the `id`
     * const parcelaAcordoWithIdOnly = await prisma.parcelaAcordo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ParcelaAcordoCreateManyAndReturnArgs>(args?: SelectSubset<T, ParcelaAcordoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ParcelaAcordo.
     * @param {ParcelaAcordoDeleteArgs} args - Arguments to delete one ParcelaAcordo.
     * @example
     * // Delete one ParcelaAcordo
     * const ParcelaAcordo = await prisma.parcelaAcordo.delete({
     *   where: {
     *     // ... filter to delete one ParcelaAcordo
     *   }
     * })
     * 
     */
    delete<T extends ParcelaAcordoDeleteArgs>(args: SelectSubset<T, ParcelaAcordoDeleteArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ParcelaAcordo.
     * @param {ParcelaAcordoUpdateArgs} args - Arguments to update one ParcelaAcordo.
     * @example
     * // Update one ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ParcelaAcordoUpdateArgs>(args: SelectSubset<T, ParcelaAcordoUpdateArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ParcelaAcordos.
     * @param {ParcelaAcordoDeleteManyArgs} args - Arguments to filter ParcelaAcordos to delete.
     * @example
     * // Delete a few ParcelaAcordos
     * const { count } = await prisma.parcelaAcordo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ParcelaAcordoDeleteManyArgs>(args?: SelectSubset<T, ParcelaAcordoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ParcelaAcordos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ParcelaAcordos
     * const parcelaAcordo = await prisma.parcelaAcordo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ParcelaAcordoUpdateManyArgs>(args: SelectSubset<T, ParcelaAcordoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ParcelaAcordo.
     * @param {ParcelaAcordoUpsertArgs} args - Arguments to update or create a ParcelaAcordo.
     * @example
     * // Update or create a ParcelaAcordo
     * const parcelaAcordo = await prisma.parcelaAcordo.upsert({
     *   create: {
     *     // ... data to create a ParcelaAcordo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ParcelaAcordo we want to update
     *   }
     * })
     */
    upsert<T extends ParcelaAcordoUpsertArgs>(args: SelectSubset<T, ParcelaAcordoUpsertArgs<ExtArgs>>): Prisma__ParcelaAcordoClient<$Result.GetResult<Prisma.$ParcelaAcordoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ParcelaAcordos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoCountArgs} args - Arguments to filter ParcelaAcordos to count.
     * @example
     * // Count the number of ParcelaAcordos
     * const count = await prisma.parcelaAcordo.count({
     *   where: {
     *     // ... the filter for the ParcelaAcordos we want to count
     *   }
     * })
    **/
    count<T extends ParcelaAcordoCountArgs>(
      args?: Subset<T, ParcelaAcordoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ParcelaAcordoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ParcelaAcordo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ParcelaAcordoAggregateArgs>(args: Subset<T, ParcelaAcordoAggregateArgs>): Prisma.PrismaPromise<GetParcelaAcordoAggregateType<T>>

    /**
     * Group by ParcelaAcordo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ParcelaAcordoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ParcelaAcordoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ParcelaAcordoGroupByArgs['orderBy'] }
        : { orderBy?: ParcelaAcordoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ParcelaAcordoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParcelaAcordoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ParcelaAcordo model
   */
  readonly fields: ParcelaAcordoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ParcelaAcordo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ParcelaAcordoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    acordo<T extends AcordoCobrancaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AcordoCobrancaDefaultArgs<ExtArgs>>): Prisma__AcordoCobrancaClient<$Result.GetResult<Prisma.$AcordoCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ParcelaAcordo model
   */ 
  interface ParcelaAcordoFieldRefs {
    readonly id: FieldRef<"ParcelaAcordo", 'String'>
    readonly tenantId: FieldRef<"ParcelaAcordo", 'String'>
    readonly acordoId: FieldRef<"ParcelaAcordo", 'String'>
    readonly numero: FieldRef<"ParcelaAcordo", 'Int'>
    readonly valor: FieldRef<"ParcelaAcordo", 'Decimal'>
    readonly vencimento: FieldRef<"ParcelaAcordo", 'DateTime'>
    readonly pago: FieldRef<"ParcelaAcordo", 'Boolean'>
    readonly pagoEm: FieldRef<"ParcelaAcordo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ParcelaAcordo findUnique
   */
  export type ParcelaAcordoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter, which ParcelaAcordo to fetch.
     */
    where: ParcelaAcordoWhereUniqueInput
  }

  /**
   * ParcelaAcordo findUniqueOrThrow
   */
  export type ParcelaAcordoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter, which ParcelaAcordo to fetch.
     */
    where: ParcelaAcordoWhereUniqueInput
  }

  /**
   * ParcelaAcordo findFirst
   */
  export type ParcelaAcordoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter, which ParcelaAcordo to fetch.
     */
    where?: ParcelaAcordoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParcelaAcordos to fetch.
     */
    orderBy?: ParcelaAcordoOrderByWithRelationInput | ParcelaAcordoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParcelaAcordos.
     */
    cursor?: ParcelaAcordoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParcelaAcordos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParcelaAcordos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParcelaAcordos.
     */
    distinct?: ParcelaAcordoScalarFieldEnum | ParcelaAcordoScalarFieldEnum[]
  }

  /**
   * ParcelaAcordo findFirstOrThrow
   */
  export type ParcelaAcordoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter, which ParcelaAcordo to fetch.
     */
    where?: ParcelaAcordoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParcelaAcordos to fetch.
     */
    orderBy?: ParcelaAcordoOrderByWithRelationInput | ParcelaAcordoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ParcelaAcordos.
     */
    cursor?: ParcelaAcordoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParcelaAcordos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParcelaAcordos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ParcelaAcordos.
     */
    distinct?: ParcelaAcordoScalarFieldEnum | ParcelaAcordoScalarFieldEnum[]
  }

  /**
   * ParcelaAcordo findMany
   */
  export type ParcelaAcordoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter, which ParcelaAcordos to fetch.
     */
    where?: ParcelaAcordoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ParcelaAcordos to fetch.
     */
    orderBy?: ParcelaAcordoOrderByWithRelationInput | ParcelaAcordoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ParcelaAcordos.
     */
    cursor?: ParcelaAcordoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ParcelaAcordos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ParcelaAcordos.
     */
    skip?: number
    distinct?: ParcelaAcordoScalarFieldEnum | ParcelaAcordoScalarFieldEnum[]
  }

  /**
   * ParcelaAcordo create
   */
  export type ParcelaAcordoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * The data needed to create a ParcelaAcordo.
     */
    data: XOR<ParcelaAcordoCreateInput, ParcelaAcordoUncheckedCreateInput>
  }

  /**
   * ParcelaAcordo createMany
   */
  export type ParcelaAcordoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ParcelaAcordos.
     */
    data: ParcelaAcordoCreateManyInput | ParcelaAcordoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ParcelaAcordo createManyAndReturn
   */
  export type ParcelaAcordoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ParcelaAcordos.
     */
    data: ParcelaAcordoCreateManyInput | ParcelaAcordoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ParcelaAcordo update
   */
  export type ParcelaAcordoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * The data needed to update a ParcelaAcordo.
     */
    data: XOR<ParcelaAcordoUpdateInput, ParcelaAcordoUncheckedUpdateInput>
    /**
     * Choose, which ParcelaAcordo to update.
     */
    where: ParcelaAcordoWhereUniqueInput
  }

  /**
   * ParcelaAcordo updateMany
   */
  export type ParcelaAcordoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ParcelaAcordos.
     */
    data: XOR<ParcelaAcordoUpdateManyMutationInput, ParcelaAcordoUncheckedUpdateManyInput>
    /**
     * Filter which ParcelaAcordos to update
     */
    where?: ParcelaAcordoWhereInput
  }

  /**
   * ParcelaAcordo upsert
   */
  export type ParcelaAcordoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * The filter to search for the ParcelaAcordo to update in case it exists.
     */
    where: ParcelaAcordoWhereUniqueInput
    /**
     * In case the ParcelaAcordo found by the `where` argument doesn't exist, create a new ParcelaAcordo with this data.
     */
    create: XOR<ParcelaAcordoCreateInput, ParcelaAcordoUncheckedCreateInput>
    /**
     * In case the ParcelaAcordo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ParcelaAcordoUpdateInput, ParcelaAcordoUncheckedUpdateInput>
  }

  /**
   * ParcelaAcordo delete
   */
  export type ParcelaAcordoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
    /**
     * Filter which ParcelaAcordo to delete.
     */
    where: ParcelaAcordoWhereUniqueInput
  }

  /**
   * ParcelaAcordo deleteMany
   */
  export type ParcelaAcordoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ParcelaAcordos to delete
     */
    where?: ParcelaAcordoWhereInput
  }

  /**
   * ParcelaAcordo without action
   */
  export type ParcelaAcordoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ParcelaAcordo
     */
    select?: ParcelaAcordoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ParcelaAcordoInclude<ExtArgs> | null
  }


  /**
   * Model ConfiguracaoCobranca
   */

  export type AggregateConfiguracaoCobranca = {
    _count: ConfiguracaoCobrancaCountAggregateOutputType | null
    _avg: ConfiguracaoCobrancaAvgAggregateOutputType | null
    _sum: ConfiguracaoCobrancaSumAggregateOutputType | null
    _min: ConfiguracaoCobrancaMinAggregateOutputType | null
    _max: ConfiguracaoCobrancaMaxAggregateOutputType | null
  }

  export type ConfiguracaoCobrancaAvgAggregateOutputType = {
    descontoMaximo: Decimal | null
    parcelasMaximas: number | null
  }

  export type ConfiguracaoCobrancaSumAggregateOutputType = {
    descontoMaximo: Decimal | null
    parcelasMaximas: number | null
  }

  export type ConfiguracaoCobrancaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ativo: boolean | null
    webhookN8n: string | null
    callbackUrl: string | null
    descontoMaximo: Decimal | null
    parcelasMaximas: number | null
    horarioInicio: string | null
    horarioFim: string | null
    pausarFimDeSemana: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ConfiguracaoCobrancaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ativo: boolean | null
    webhookN8n: string | null
    callbackUrl: string | null
    descontoMaximo: Decimal | null
    parcelasMaximas: number | null
    horarioInicio: string | null
    horarioFim: string | null
    pausarFimDeSemana: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ConfiguracaoCobrancaCountAggregateOutputType = {
    id: number
    tenantId: number
    ativo: number
    webhookN8n: number
    callbackUrl: number
    regras: number
    descontoMaximo: number
    parcelasMaximas: number
    horarioInicio: number
    horarioFim: number
    pausarFimDeSemana: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type ConfiguracaoCobrancaAvgAggregateInputType = {
    descontoMaximo?: true
    parcelasMaximas?: true
  }

  export type ConfiguracaoCobrancaSumAggregateInputType = {
    descontoMaximo?: true
    parcelasMaximas?: true
  }

  export type ConfiguracaoCobrancaMinAggregateInputType = {
    id?: true
    tenantId?: true
    ativo?: true
    webhookN8n?: true
    callbackUrl?: true
    descontoMaximo?: true
    parcelasMaximas?: true
    horarioInicio?: true
    horarioFim?: true
    pausarFimDeSemana?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ConfiguracaoCobrancaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    ativo?: true
    webhookN8n?: true
    callbackUrl?: true
    descontoMaximo?: true
    parcelasMaximas?: true
    horarioInicio?: true
    horarioFim?: true
    pausarFimDeSemana?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ConfiguracaoCobrancaCountAggregateInputType = {
    id?: true
    tenantId?: true
    ativo?: true
    webhookN8n?: true
    callbackUrl?: true
    regras?: true
    descontoMaximo?: true
    parcelasMaximas?: true
    horarioInicio?: true
    horarioFim?: true
    pausarFimDeSemana?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type ConfiguracaoCobrancaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracaoCobranca to aggregate.
     */
    where?: ConfiguracaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoCobrancas to fetch.
     */
    orderBy?: ConfiguracaoCobrancaOrderByWithRelationInput | ConfiguracaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfiguracaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfiguracaoCobrancas
    **/
    _count?: true | ConfiguracaoCobrancaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConfiguracaoCobrancaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConfiguracaoCobrancaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfiguracaoCobrancaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfiguracaoCobrancaMaxAggregateInputType
  }

  export type GetConfiguracaoCobrancaAggregateType<T extends ConfiguracaoCobrancaAggregateArgs> = {
        [P in keyof T & keyof AggregateConfiguracaoCobranca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfiguracaoCobranca[P]>
      : GetScalarType<T[P], AggregateConfiguracaoCobranca[P]>
  }




  export type ConfiguracaoCobrancaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfiguracaoCobrancaWhereInput
    orderBy?: ConfiguracaoCobrancaOrderByWithAggregationInput | ConfiguracaoCobrancaOrderByWithAggregationInput[]
    by: ConfiguracaoCobrancaScalarFieldEnum[] | ConfiguracaoCobrancaScalarFieldEnum
    having?: ConfiguracaoCobrancaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfiguracaoCobrancaCountAggregateInputType | true
    _avg?: ConfiguracaoCobrancaAvgAggregateInputType
    _sum?: ConfiguracaoCobrancaSumAggregateInputType
    _min?: ConfiguracaoCobrancaMinAggregateInputType
    _max?: ConfiguracaoCobrancaMaxAggregateInputType
  }

  export type ConfiguracaoCobrancaGroupByOutputType = {
    id: string
    tenantId: string
    ativo: boolean
    webhookN8n: string | null
    callbackUrl: string | null
    regras: JsonValue
    descontoMaximo: Decimal
    parcelasMaximas: number
    horarioInicio: string
    horarioFim: string
    pausarFimDeSemana: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: ConfiguracaoCobrancaCountAggregateOutputType | null
    _avg: ConfiguracaoCobrancaAvgAggregateOutputType | null
    _sum: ConfiguracaoCobrancaSumAggregateOutputType | null
    _min: ConfiguracaoCobrancaMinAggregateOutputType | null
    _max: ConfiguracaoCobrancaMaxAggregateOutputType | null
  }

  type GetConfiguracaoCobrancaGroupByPayload<T extends ConfiguracaoCobrancaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfiguracaoCobrancaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfiguracaoCobrancaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfiguracaoCobrancaGroupByOutputType[P]>
            : GetScalarType<T[P], ConfiguracaoCobrancaGroupByOutputType[P]>
        }
      >
    >


  export type ConfiguracaoCobrancaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ativo?: boolean
    webhookN8n?: boolean
    callbackUrl?: boolean
    regras?: boolean
    descontoMaximo?: boolean
    parcelasMaximas?: boolean
    horarioInicio?: boolean
    horarioFim?: boolean
    pausarFimDeSemana?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["configuracaoCobranca"]>

  export type ConfiguracaoCobrancaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ativo?: boolean
    webhookN8n?: boolean
    callbackUrl?: boolean
    regras?: boolean
    descontoMaximo?: boolean
    parcelasMaximas?: boolean
    horarioInicio?: boolean
    horarioFim?: boolean
    pausarFimDeSemana?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["configuracaoCobranca"]>

  export type ConfiguracaoCobrancaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    ativo?: boolean
    webhookN8n?: boolean
    callbackUrl?: boolean
    regras?: boolean
    descontoMaximo?: boolean
    parcelasMaximas?: boolean
    horarioInicio?: boolean
    horarioFim?: boolean
    pausarFimDeSemana?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }


  export type $ConfiguracaoCobrancaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfiguracaoCobranca"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      ativo: boolean
      webhookN8n: string | null
      callbackUrl: string | null
      regras: Prisma.JsonValue
      descontoMaximo: Prisma.Decimal
      parcelasMaximas: number
      horarioInicio: string
      horarioFim: string
      pausarFimDeSemana: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["configuracaoCobranca"]>
    composites: {}
  }

  type ConfiguracaoCobrancaGetPayload<S extends boolean | null | undefined | ConfiguracaoCobrancaDefaultArgs> = $Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload, S>

  type ConfiguracaoCobrancaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConfiguracaoCobrancaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConfiguracaoCobrancaCountAggregateInputType | true
    }

  export interface ConfiguracaoCobrancaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfiguracaoCobranca'], meta: { name: 'ConfiguracaoCobranca' } }
    /**
     * Find zero or one ConfiguracaoCobranca that matches the filter.
     * @param {ConfiguracaoCobrancaFindUniqueArgs} args - Arguments to find a ConfiguracaoCobranca
     * @example
     * // Get one ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfiguracaoCobrancaFindUniqueArgs>(args: SelectSubset<T, ConfiguracaoCobrancaFindUniqueArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConfiguracaoCobranca that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConfiguracaoCobrancaFindUniqueOrThrowArgs} args - Arguments to find a ConfiguracaoCobranca
     * @example
     * // Get one ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfiguracaoCobrancaFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfiguracaoCobrancaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConfiguracaoCobranca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaFindFirstArgs} args - Arguments to find a ConfiguracaoCobranca
     * @example
     * // Get one ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfiguracaoCobrancaFindFirstArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaFindFirstArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConfiguracaoCobranca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaFindFirstOrThrowArgs} args - Arguments to find a ConfiguracaoCobranca
     * @example
     * // Get one ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfiguracaoCobrancaFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConfiguracaoCobrancas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfiguracaoCobrancas
     * const configuracaoCobrancas = await prisma.configuracaoCobranca.findMany()
     * 
     * // Get first 10 ConfiguracaoCobrancas
     * const configuracaoCobrancas = await prisma.configuracaoCobranca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configuracaoCobrancaWithIdOnly = await prisma.configuracaoCobranca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfiguracaoCobrancaFindManyArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConfiguracaoCobranca.
     * @param {ConfiguracaoCobrancaCreateArgs} args - Arguments to create a ConfiguracaoCobranca.
     * @example
     * // Create one ConfiguracaoCobranca
     * const ConfiguracaoCobranca = await prisma.configuracaoCobranca.create({
     *   data: {
     *     // ... data to create a ConfiguracaoCobranca
     *   }
     * })
     * 
     */
    create<T extends ConfiguracaoCobrancaCreateArgs>(args: SelectSubset<T, ConfiguracaoCobrancaCreateArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConfiguracaoCobrancas.
     * @param {ConfiguracaoCobrancaCreateManyArgs} args - Arguments to create many ConfiguracaoCobrancas.
     * @example
     * // Create many ConfiguracaoCobrancas
     * const configuracaoCobranca = await prisma.configuracaoCobranca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfiguracaoCobrancaCreateManyArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfiguracaoCobrancas and returns the data saved in the database.
     * @param {ConfiguracaoCobrancaCreateManyAndReturnArgs} args - Arguments to create many ConfiguracaoCobrancas.
     * @example
     * // Create many ConfiguracaoCobrancas
     * const configuracaoCobranca = await prisma.configuracaoCobranca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfiguracaoCobrancas and only return the `id`
     * const configuracaoCobrancaWithIdOnly = await prisma.configuracaoCobranca.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfiguracaoCobrancaCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConfiguracaoCobranca.
     * @param {ConfiguracaoCobrancaDeleteArgs} args - Arguments to delete one ConfiguracaoCobranca.
     * @example
     * // Delete one ConfiguracaoCobranca
     * const ConfiguracaoCobranca = await prisma.configuracaoCobranca.delete({
     *   where: {
     *     // ... filter to delete one ConfiguracaoCobranca
     *   }
     * })
     * 
     */
    delete<T extends ConfiguracaoCobrancaDeleteArgs>(args: SelectSubset<T, ConfiguracaoCobrancaDeleteArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConfiguracaoCobranca.
     * @param {ConfiguracaoCobrancaUpdateArgs} args - Arguments to update one ConfiguracaoCobranca.
     * @example
     * // Update one ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfiguracaoCobrancaUpdateArgs>(args: SelectSubset<T, ConfiguracaoCobrancaUpdateArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConfiguracaoCobrancas.
     * @param {ConfiguracaoCobrancaDeleteManyArgs} args - Arguments to filter ConfiguracaoCobrancas to delete.
     * @example
     * // Delete a few ConfiguracaoCobrancas
     * const { count } = await prisma.configuracaoCobranca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfiguracaoCobrancaDeleteManyArgs>(args?: SelectSubset<T, ConfiguracaoCobrancaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfiguracaoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfiguracaoCobrancas
     * const configuracaoCobranca = await prisma.configuracaoCobranca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfiguracaoCobrancaUpdateManyArgs>(args: SelectSubset<T, ConfiguracaoCobrancaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConfiguracaoCobranca.
     * @param {ConfiguracaoCobrancaUpsertArgs} args - Arguments to update or create a ConfiguracaoCobranca.
     * @example
     * // Update or create a ConfiguracaoCobranca
     * const configuracaoCobranca = await prisma.configuracaoCobranca.upsert({
     *   create: {
     *     // ... data to create a ConfiguracaoCobranca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfiguracaoCobranca we want to update
     *   }
     * })
     */
    upsert<T extends ConfiguracaoCobrancaUpsertArgs>(args: SelectSubset<T, ConfiguracaoCobrancaUpsertArgs<ExtArgs>>): Prisma__ConfiguracaoCobrancaClient<$Result.GetResult<Prisma.$ConfiguracaoCobrancaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConfiguracaoCobrancas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaCountArgs} args - Arguments to filter ConfiguracaoCobrancas to count.
     * @example
     * // Count the number of ConfiguracaoCobrancas
     * const count = await prisma.configuracaoCobranca.count({
     *   where: {
     *     // ... the filter for the ConfiguracaoCobrancas we want to count
     *   }
     * })
    **/
    count<T extends ConfiguracaoCobrancaCountArgs>(
      args?: Subset<T, ConfiguracaoCobrancaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfiguracaoCobrancaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfiguracaoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfiguracaoCobrancaAggregateArgs>(args: Subset<T, ConfiguracaoCobrancaAggregateArgs>): Prisma.PrismaPromise<GetConfiguracaoCobrancaAggregateType<T>>

    /**
     * Group by ConfiguracaoCobranca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoCobrancaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfiguracaoCobrancaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfiguracaoCobrancaGroupByArgs['orderBy'] }
        : { orderBy?: ConfiguracaoCobrancaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfiguracaoCobrancaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfiguracaoCobrancaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfiguracaoCobranca model
   */
  readonly fields: ConfiguracaoCobrancaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfiguracaoCobranca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfiguracaoCobrancaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConfiguracaoCobranca model
   */ 
  interface ConfiguracaoCobrancaFieldRefs {
    readonly id: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly tenantId: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly ativo: FieldRef<"ConfiguracaoCobranca", 'Boolean'>
    readonly webhookN8n: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly callbackUrl: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly regras: FieldRef<"ConfiguracaoCobranca", 'Json'>
    readonly descontoMaximo: FieldRef<"ConfiguracaoCobranca", 'Decimal'>
    readonly parcelasMaximas: FieldRef<"ConfiguracaoCobranca", 'Int'>
    readonly horarioInicio: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly horarioFim: FieldRef<"ConfiguracaoCobranca", 'String'>
    readonly pausarFimDeSemana: FieldRef<"ConfiguracaoCobranca", 'Boolean'>
    readonly criadoEm: FieldRef<"ConfiguracaoCobranca", 'DateTime'>
    readonly atualizadoEm: FieldRef<"ConfiguracaoCobranca", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfiguracaoCobranca findUnique
   */
  export type ConfiguracaoCobrancaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoCobranca to fetch.
     */
    where: ConfiguracaoCobrancaWhereUniqueInput
  }

  /**
   * ConfiguracaoCobranca findUniqueOrThrow
   */
  export type ConfiguracaoCobrancaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoCobranca to fetch.
     */
    where: ConfiguracaoCobrancaWhereUniqueInput
  }

  /**
   * ConfiguracaoCobranca findFirst
   */
  export type ConfiguracaoCobrancaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoCobranca to fetch.
     */
    where?: ConfiguracaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoCobrancas to fetch.
     */
    orderBy?: ConfiguracaoCobrancaOrderByWithRelationInput | ConfiguracaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracaoCobrancas.
     */
    cursor?: ConfiguracaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracaoCobrancas.
     */
    distinct?: ConfiguracaoCobrancaScalarFieldEnum | ConfiguracaoCobrancaScalarFieldEnum[]
  }

  /**
   * ConfiguracaoCobranca findFirstOrThrow
   */
  export type ConfiguracaoCobrancaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoCobranca to fetch.
     */
    where?: ConfiguracaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoCobrancas to fetch.
     */
    orderBy?: ConfiguracaoCobrancaOrderByWithRelationInput | ConfiguracaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracaoCobrancas.
     */
    cursor?: ConfiguracaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoCobrancas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracaoCobrancas.
     */
    distinct?: ConfiguracaoCobrancaScalarFieldEnum | ConfiguracaoCobrancaScalarFieldEnum[]
  }

  /**
   * ConfiguracaoCobranca findMany
   */
  export type ConfiguracaoCobrancaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoCobrancas to fetch.
     */
    where?: ConfiguracaoCobrancaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoCobrancas to fetch.
     */
    orderBy?: ConfiguracaoCobrancaOrderByWithRelationInput | ConfiguracaoCobrancaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfiguracaoCobrancas.
     */
    cursor?: ConfiguracaoCobrancaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoCobrancas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoCobrancas.
     */
    skip?: number
    distinct?: ConfiguracaoCobrancaScalarFieldEnum | ConfiguracaoCobrancaScalarFieldEnum[]
  }

  /**
   * ConfiguracaoCobranca create
   */
  export type ConfiguracaoCobrancaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * The data needed to create a ConfiguracaoCobranca.
     */
    data: XOR<ConfiguracaoCobrancaCreateInput, ConfiguracaoCobrancaUncheckedCreateInput>
  }

  /**
   * ConfiguracaoCobranca createMany
   */
  export type ConfiguracaoCobrancaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfiguracaoCobrancas.
     */
    data: ConfiguracaoCobrancaCreateManyInput | ConfiguracaoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfiguracaoCobranca createManyAndReturn
   */
  export type ConfiguracaoCobrancaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConfiguracaoCobrancas.
     */
    data: ConfiguracaoCobrancaCreateManyInput | ConfiguracaoCobrancaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfiguracaoCobranca update
   */
  export type ConfiguracaoCobrancaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * The data needed to update a ConfiguracaoCobranca.
     */
    data: XOR<ConfiguracaoCobrancaUpdateInput, ConfiguracaoCobrancaUncheckedUpdateInput>
    /**
     * Choose, which ConfiguracaoCobranca to update.
     */
    where: ConfiguracaoCobrancaWhereUniqueInput
  }

  /**
   * ConfiguracaoCobranca updateMany
   */
  export type ConfiguracaoCobrancaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfiguracaoCobrancas.
     */
    data: XOR<ConfiguracaoCobrancaUpdateManyMutationInput, ConfiguracaoCobrancaUncheckedUpdateManyInput>
    /**
     * Filter which ConfiguracaoCobrancas to update
     */
    where?: ConfiguracaoCobrancaWhereInput
  }

  /**
   * ConfiguracaoCobranca upsert
   */
  export type ConfiguracaoCobrancaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * The filter to search for the ConfiguracaoCobranca to update in case it exists.
     */
    where: ConfiguracaoCobrancaWhereUniqueInput
    /**
     * In case the ConfiguracaoCobranca found by the `where` argument doesn't exist, create a new ConfiguracaoCobranca with this data.
     */
    create: XOR<ConfiguracaoCobrancaCreateInput, ConfiguracaoCobrancaUncheckedCreateInput>
    /**
     * In case the ConfiguracaoCobranca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfiguracaoCobrancaUpdateInput, ConfiguracaoCobrancaUncheckedUpdateInput>
  }

  /**
   * ConfiguracaoCobranca delete
   */
  export type ConfiguracaoCobrancaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
    /**
     * Filter which ConfiguracaoCobranca to delete.
     */
    where: ConfiguracaoCobrancaWhereUniqueInput
  }

  /**
   * ConfiguracaoCobranca deleteMany
   */
  export type ConfiguracaoCobrancaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracaoCobrancas to delete
     */
    where?: ConfiguracaoCobrancaWhereInput
  }

  /**
   * ConfiguracaoCobranca without action
   */
  export type ConfiguracaoCobrancaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoCobranca
     */
    select?: ConfiguracaoCobrancaSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ContaFinanceiraScalarFieldEnum: {
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

  export type ContaFinanceiraScalarFieldEnum = (typeof ContaFinanceiraScalarFieldEnum)[keyof typeof ContaFinanceiraScalarFieldEnum]


  export const LancamentoScalarFieldEnum: {
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

  export type LancamentoScalarFieldEnum = (typeof LancamentoScalarFieldEnum)[keyof typeof LancamentoScalarFieldEnum]


  export const CategoriaFinanceiraScalarFieldEnum: {
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

  export type CategoriaFinanceiraScalarFieldEnum = (typeof CategoriaFinanceiraScalarFieldEnum)[keyof typeof CategoriaFinanceiraScalarFieldEnum]


  export const RecorrenciaScalarFieldEnum: {
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

  export type RecorrenciaScalarFieldEnum = (typeof RecorrenciaScalarFieldEnum)[keyof typeof RecorrenciaScalarFieldEnum]


  export const ConciliacaoBancariaScalarFieldEnum: {
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

  export type ConciliacaoBancariaScalarFieldEnum = (typeof ConciliacaoBancariaScalarFieldEnum)[keyof typeof ConciliacaoBancariaScalarFieldEnum]


  export const EventoProcessadoScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    evento: 'evento',
    referenciaId: 'referenciaId',
    processadoEm: 'processadoEm'
  };

  export type EventoProcessadoScalarFieldEnum = (typeof EventoProcessadoScalarFieldEnum)[keyof typeof EventoProcessadoScalarFieldEnum]


  export const DREScalarFieldEnum: {
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

  export type DREScalarFieldEnum = (typeof DREScalarFieldEnum)[keyof typeof DREScalarFieldEnum]


  export const TituloCobrancaScalarFieldEnum: {
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

  export type TituloCobrancaScalarFieldEnum = (typeof TituloCobrancaScalarFieldEnum)[keyof typeof TituloCobrancaScalarFieldEnum]


  export const AcaoCobrancaScalarFieldEnum: {
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

  export type AcaoCobrancaScalarFieldEnum = (typeof AcaoCobrancaScalarFieldEnum)[keyof typeof AcaoCobrancaScalarFieldEnum]


  export const AcordoCobrancaScalarFieldEnum: {
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

  export type AcordoCobrancaScalarFieldEnum = (typeof AcordoCobrancaScalarFieldEnum)[keyof typeof AcordoCobrancaScalarFieldEnum]


  export const ParcelaAcordoScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    acordoId: 'acordoId',
    numero: 'numero',
    valor: 'valor',
    vencimento: 'vencimento',
    pago: 'pago',
    pagoEm: 'pagoEm'
  };

  export type ParcelaAcordoScalarFieldEnum = (typeof ParcelaAcordoScalarFieldEnum)[keyof typeof ParcelaAcordoScalarFieldEnum]


  export const ConfiguracaoCobrancaScalarFieldEnum: {
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

  export type ConfiguracaoCobrancaScalarFieldEnum = (typeof ConfiguracaoCobrancaScalarFieldEnum)[keyof typeof ConfiguracaoCobrancaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TipoConta'
   */
  export type EnumTipoContaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoConta'>
    


  /**
   * Reference to a field of type 'TipoConta[]'
   */
  export type ListEnumTipoContaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoConta[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TipoLancamento'
   */
  export type EnumTipoLancamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoLancamento'>
    


  /**
   * Reference to a field of type 'TipoLancamento[]'
   */
  export type ListEnumTipoLancamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoLancamento[]'>
    


  /**
   * Reference to a field of type 'StatusLancamento'
   */
  export type EnumStatusLancamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusLancamento'>
    


  /**
   * Reference to a field of type 'StatusLancamento[]'
   */
  export type ListEnumStatusLancamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusLancamento[]'>
    


  /**
   * Reference to a field of type 'FormaPagamento'
   */
  export type EnumFormaPagamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormaPagamento'>
    


  /**
   * Reference to a field of type 'FormaPagamento[]'
   */
  export type ListEnumFormaPagamentoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormaPagamento[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TipoCategoriaFinanceira'
   */
  export type EnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoCategoriaFinanceira'>
    


  /**
   * Reference to a field of type 'TipoCategoriaFinanceira[]'
   */
  export type ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoCategoriaFinanceira[]'>
    


  /**
   * Reference to a field of type 'FrequenciaRecorrencia'
   */
  export type EnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FrequenciaRecorrencia'>
    


  /**
   * Reference to a field of type 'FrequenciaRecorrencia[]'
   */
  export type ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FrequenciaRecorrencia[]'>
    


  /**
   * Reference to a field of type 'StatusConciliacao'
   */
  export type EnumStatusConciliacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusConciliacao'>
    


  /**
   * Reference to a field of type 'StatusConciliacao[]'
   */
  export type ListEnumStatusConciliacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusConciliacao[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'StatusTituloCobranca'
   */
  export type EnumStatusTituloCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTituloCobranca'>
    


  /**
   * Reference to a field of type 'StatusTituloCobranca[]'
   */
  export type ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTituloCobranca[]'>
    


  /**
   * Reference to a field of type 'PrioridadeCobranca'
   */
  export type EnumPrioridadeCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PrioridadeCobranca'>
    


  /**
   * Reference to a field of type 'PrioridadeCobranca[]'
   */
  export type ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PrioridadeCobranca[]'>
    


  /**
   * Reference to a field of type 'TipoAcaoCobranca'
   */
  export type EnumTipoAcaoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoAcaoCobranca'>
    


  /**
   * Reference to a field of type 'TipoAcaoCobranca[]'
   */
  export type ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoAcaoCobranca[]'>
    


  /**
   * Reference to a field of type 'StatusAcaoCobranca'
   */
  export type EnumStatusAcaoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAcaoCobranca'>
    


  /**
   * Reference to a field of type 'StatusAcaoCobranca[]'
   */
  export type ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAcaoCobranca[]'>
    


  /**
   * Reference to a field of type 'StatusAcordoCobranca'
   */
  export type EnumStatusAcordoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAcordoCobranca'>
    


  /**
   * Reference to a field of type 'StatusAcordoCobranca[]'
   */
  export type ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusAcordoCobranca[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ContaFinanceiraWhereInput = {
    AND?: ContaFinanceiraWhereInput | ContaFinanceiraWhereInput[]
    OR?: ContaFinanceiraWhereInput[]
    NOT?: ContaFinanceiraWhereInput | ContaFinanceiraWhereInput[]
    id?: UuidFilter<"ContaFinanceira"> | string
    tenantId?: UuidFilter<"ContaFinanceira"> | string
    nome?: StringFilter<"ContaFinanceira"> | string
    tipo?: EnumTipoContaFilter<"ContaFinanceira"> | $Enums.TipoConta
    banco?: StringNullableFilter<"ContaFinanceira"> | string | null
    agencia?: StringNullableFilter<"ContaFinanceira"> | string | null
    conta?: StringNullableFilter<"ContaFinanceira"> | string | null
    saldoAtual?: DecimalFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    ativa?: BoolFilter<"ContaFinanceira"> | boolean
    cor?: StringNullableFilter<"ContaFinanceira"> | string | null
    icone?: StringNullableFilter<"ContaFinanceira"> | string | null
    criadoEm?: DateTimeFilter<"ContaFinanceira"> | Date | string
    atualizadoEm?: DateTimeFilter<"ContaFinanceira"> | Date | string
    lancamentos?: LancamentoListRelationFilter
    transferenciasOrigem?: LancamentoListRelationFilter
    transferenciasDestino?: LancamentoListRelationFilter
    recorrencias?: RecorrenciaListRelationFilter
    conciliacoes?: ConciliacaoBancariaListRelationFilter
  }

  export type ContaFinanceiraOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    banco?: SortOrderInput | SortOrder
    agencia?: SortOrderInput | SortOrder
    conta?: SortOrderInput | SortOrder
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
    ativa?: SortOrder
    cor?: SortOrderInput | SortOrder
    icone?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    lancamentos?: LancamentoOrderByRelationAggregateInput
    transferenciasOrigem?: LancamentoOrderByRelationAggregateInput
    transferenciasDestino?: LancamentoOrderByRelationAggregateInput
    recorrencias?: RecorrenciaOrderByRelationAggregateInput
    conciliacoes?: ConciliacaoBancariaOrderByRelationAggregateInput
  }

  export type ContaFinanceiraWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContaFinanceiraWhereInput | ContaFinanceiraWhereInput[]
    OR?: ContaFinanceiraWhereInput[]
    NOT?: ContaFinanceiraWhereInput | ContaFinanceiraWhereInput[]
    tenantId?: UuidFilter<"ContaFinanceira"> | string
    nome?: StringFilter<"ContaFinanceira"> | string
    tipo?: EnumTipoContaFilter<"ContaFinanceira"> | $Enums.TipoConta
    banco?: StringNullableFilter<"ContaFinanceira"> | string | null
    agencia?: StringNullableFilter<"ContaFinanceira"> | string | null
    conta?: StringNullableFilter<"ContaFinanceira"> | string | null
    saldoAtual?: DecimalFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    ativa?: BoolFilter<"ContaFinanceira"> | boolean
    cor?: StringNullableFilter<"ContaFinanceira"> | string | null
    icone?: StringNullableFilter<"ContaFinanceira"> | string | null
    criadoEm?: DateTimeFilter<"ContaFinanceira"> | Date | string
    atualizadoEm?: DateTimeFilter<"ContaFinanceira"> | Date | string
    lancamentos?: LancamentoListRelationFilter
    transferenciasOrigem?: LancamentoListRelationFilter
    transferenciasDestino?: LancamentoListRelationFilter
    recorrencias?: RecorrenciaListRelationFilter
    conciliacoes?: ConciliacaoBancariaListRelationFilter
  }, "id">

  export type ContaFinanceiraOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    banco?: SortOrderInput | SortOrder
    agencia?: SortOrderInput | SortOrder
    conta?: SortOrderInput | SortOrder
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
    ativa?: SortOrder
    cor?: SortOrderInput | SortOrder
    icone?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: ContaFinanceiraCountOrderByAggregateInput
    _avg?: ContaFinanceiraAvgOrderByAggregateInput
    _max?: ContaFinanceiraMaxOrderByAggregateInput
    _min?: ContaFinanceiraMinOrderByAggregateInput
    _sum?: ContaFinanceiraSumOrderByAggregateInput
  }

  export type ContaFinanceiraScalarWhereWithAggregatesInput = {
    AND?: ContaFinanceiraScalarWhereWithAggregatesInput | ContaFinanceiraScalarWhereWithAggregatesInput[]
    OR?: ContaFinanceiraScalarWhereWithAggregatesInput[]
    NOT?: ContaFinanceiraScalarWhereWithAggregatesInput | ContaFinanceiraScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ContaFinanceira"> | string
    tenantId?: UuidWithAggregatesFilter<"ContaFinanceira"> | string
    nome?: StringWithAggregatesFilter<"ContaFinanceira"> | string
    tipo?: EnumTipoContaWithAggregatesFilter<"ContaFinanceira"> | $Enums.TipoConta
    banco?: StringNullableWithAggregatesFilter<"ContaFinanceira"> | string | null
    agencia?: StringNullableWithAggregatesFilter<"ContaFinanceira"> | string | null
    conta?: StringNullableWithAggregatesFilter<"ContaFinanceira"> | string | null
    saldoAtual?: DecimalWithAggregatesFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalWithAggregatesFilter<"ContaFinanceira"> | Decimal | DecimalJsLike | number | string
    ativa?: BoolWithAggregatesFilter<"ContaFinanceira"> | boolean
    cor?: StringNullableWithAggregatesFilter<"ContaFinanceira"> | string | null
    icone?: StringNullableWithAggregatesFilter<"ContaFinanceira"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"ContaFinanceira"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"ContaFinanceira"> | Date | string
  }

  export type LancamentoWhereInput = {
    AND?: LancamentoWhereInput | LancamentoWhereInput[]
    OR?: LancamentoWhereInput[]
    NOT?: LancamentoWhereInput | LancamentoWhereInput[]
    id?: UuidFilter<"Lancamento"> | string
    tenantId?: UuidFilter<"Lancamento"> | string
    contaId?: UuidNullableFilter<"Lancamento"> | string | null
    usuarioId?: UuidNullableFilter<"Lancamento"> | string | null
    tipo?: EnumTipoLancamentoFilter<"Lancamento"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Lancamento"> | string | null
    subcategoria?: StringNullableFilter<"Lancamento"> | string | null
    descricao?: StringFilter<"Lancamento"> | string
    valor?: DecimalFilter<"Lancamento"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFilter<"Lancamento"> | Date | string
    dataPagamento?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    dataCompetencia?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    status?: EnumStatusLancamentoFilter<"Lancamento"> | $Enums.StatusLancamento
    formaPagamento?: EnumFormaPagamentoNullableFilter<"Lancamento"> | $Enums.FormaPagamento | null
    numeroParcela?: IntNullableFilter<"Lancamento"> | number | null
    totalParcelas?: IntNullableFilter<"Lancamento"> | number | null
    parcelaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    pedidoId?: UuidNullableFilter<"Lancamento"> | string | null
    notaFiscalId?: UuidNullableFilter<"Lancamento"> | string | null
    fornecedor?: StringNullableFilter<"Lancamento"> | string | null
    cliente?: StringNullableFilter<"Lancamento"> | string | null
    observacao?: StringNullableFilter<"Lancamento"> | string | null
    tags?: StringNullableListFilter<"Lancamento">
    recorrente?: BoolFilter<"Lancamento"> | boolean
    recorrenciaId?: UuidNullableFilter<"Lancamento"> | string | null
    anexoUrl?: StringNullableFilter<"Lancamento"> | string | null
    criadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    contaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    contaDestinoId?: UuidNullableFilter<"Lancamento"> | string | null
    conta?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    recorrencia?: XOR<RecorrenciaNullableRelationFilter, RecorrenciaWhereInput> | null
    contaOrigem?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    contaDestino?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
  }

  export type LancamentoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrderInput | SortOrder
    usuarioId?: SortOrderInput | SortOrder
    tipo?: SortOrder
    categoria?: SortOrderInput | SortOrder
    subcategoria?: SortOrderInput | SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    dataPagamento?: SortOrderInput | SortOrder
    dataCompetencia?: SortOrderInput | SortOrder
    status?: SortOrder
    formaPagamento?: SortOrderInput | SortOrder
    numeroParcela?: SortOrderInput | SortOrder
    totalParcelas?: SortOrderInput | SortOrder
    parcelaOrigemId?: SortOrderInput | SortOrder
    pedidoId?: SortOrderInput | SortOrder
    notaFiscalId?: SortOrderInput | SortOrder
    fornecedor?: SortOrderInput | SortOrder
    cliente?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    tags?: SortOrder
    recorrente?: SortOrder
    recorrenciaId?: SortOrderInput | SortOrder
    anexoUrl?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    contaOrigemId?: SortOrderInput | SortOrder
    contaDestinoId?: SortOrderInput | SortOrder
    conta?: ContaFinanceiraOrderByWithRelationInput
    recorrencia?: RecorrenciaOrderByWithRelationInput
    contaOrigem?: ContaFinanceiraOrderByWithRelationInput
    contaDestino?: ContaFinanceiraOrderByWithRelationInput
  }

  export type LancamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LancamentoWhereInput | LancamentoWhereInput[]
    OR?: LancamentoWhereInput[]
    NOT?: LancamentoWhereInput | LancamentoWhereInput[]
    tenantId?: UuidFilter<"Lancamento"> | string
    contaId?: UuidNullableFilter<"Lancamento"> | string | null
    usuarioId?: UuidNullableFilter<"Lancamento"> | string | null
    tipo?: EnumTipoLancamentoFilter<"Lancamento"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Lancamento"> | string | null
    subcategoria?: StringNullableFilter<"Lancamento"> | string | null
    descricao?: StringFilter<"Lancamento"> | string
    valor?: DecimalFilter<"Lancamento"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFilter<"Lancamento"> | Date | string
    dataPagamento?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    dataCompetencia?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    status?: EnumStatusLancamentoFilter<"Lancamento"> | $Enums.StatusLancamento
    formaPagamento?: EnumFormaPagamentoNullableFilter<"Lancamento"> | $Enums.FormaPagamento | null
    numeroParcela?: IntNullableFilter<"Lancamento"> | number | null
    totalParcelas?: IntNullableFilter<"Lancamento"> | number | null
    parcelaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    pedidoId?: UuidNullableFilter<"Lancamento"> | string | null
    notaFiscalId?: UuidNullableFilter<"Lancamento"> | string | null
    fornecedor?: StringNullableFilter<"Lancamento"> | string | null
    cliente?: StringNullableFilter<"Lancamento"> | string | null
    observacao?: StringNullableFilter<"Lancamento"> | string | null
    tags?: StringNullableListFilter<"Lancamento">
    recorrente?: BoolFilter<"Lancamento"> | boolean
    recorrenciaId?: UuidNullableFilter<"Lancamento"> | string | null
    anexoUrl?: StringNullableFilter<"Lancamento"> | string | null
    criadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    contaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    contaDestinoId?: UuidNullableFilter<"Lancamento"> | string | null
    conta?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    recorrencia?: XOR<RecorrenciaNullableRelationFilter, RecorrenciaWhereInput> | null
    contaOrigem?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    contaDestino?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
  }, "id">

  export type LancamentoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrderInput | SortOrder
    usuarioId?: SortOrderInput | SortOrder
    tipo?: SortOrder
    categoria?: SortOrderInput | SortOrder
    subcategoria?: SortOrderInput | SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    dataPagamento?: SortOrderInput | SortOrder
    dataCompetencia?: SortOrderInput | SortOrder
    status?: SortOrder
    formaPagamento?: SortOrderInput | SortOrder
    numeroParcela?: SortOrderInput | SortOrder
    totalParcelas?: SortOrderInput | SortOrder
    parcelaOrigemId?: SortOrderInput | SortOrder
    pedidoId?: SortOrderInput | SortOrder
    notaFiscalId?: SortOrderInput | SortOrder
    fornecedor?: SortOrderInput | SortOrder
    cliente?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    tags?: SortOrder
    recorrente?: SortOrder
    recorrenciaId?: SortOrderInput | SortOrder
    anexoUrl?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    contaOrigemId?: SortOrderInput | SortOrder
    contaDestinoId?: SortOrderInput | SortOrder
    _count?: LancamentoCountOrderByAggregateInput
    _avg?: LancamentoAvgOrderByAggregateInput
    _max?: LancamentoMaxOrderByAggregateInput
    _min?: LancamentoMinOrderByAggregateInput
    _sum?: LancamentoSumOrderByAggregateInput
  }

  export type LancamentoScalarWhereWithAggregatesInput = {
    AND?: LancamentoScalarWhereWithAggregatesInput | LancamentoScalarWhereWithAggregatesInput[]
    OR?: LancamentoScalarWhereWithAggregatesInput[]
    NOT?: LancamentoScalarWhereWithAggregatesInput | LancamentoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Lancamento"> | string
    tenantId?: UuidWithAggregatesFilter<"Lancamento"> | string
    contaId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    usuarioId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    tipo?: EnumTipoLancamentoWithAggregatesFilter<"Lancamento"> | $Enums.TipoLancamento
    categoria?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    subcategoria?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    descricao?: StringWithAggregatesFilter<"Lancamento"> | string
    valor?: DecimalWithAggregatesFilter<"Lancamento"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeWithAggregatesFilter<"Lancamento"> | Date | string
    dataPagamento?: DateTimeNullableWithAggregatesFilter<"Lancamento"> | Date | string | null
    dataCompetencia?: DateTimeNullableWithAggregatesFilter<"Lancamento"> | Date | string | null
    status?: EnumStatusLancamentoWithAggregatesFilter<"Lancamento"> | $Enums.StatusLancamento
    formaPagamento?: EnumFormaPagamentoNullableWithAggregatesFilter<"Lancamento"> | $Enums.FormaPagamento | null
    numeroParcela?: IntNullableWithAggregatesFilter<"Lancamento"> | number | null
    totalParcelas?: IntNullableWithAggregatesFilter<"Lancamento"> | number | null
    parcelaOrigemId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    pedidoId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    notaFiscalId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    fornecedor?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    cliente?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    observacao?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    tags?: StringNullableListFilter<"Lancamento">
    recorrente?: BoolWithAggregatesFilter<"Lancamento"> | boolean
    recorrenciaId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    anexoUrl?: StringNullableWithAggregatesFilter<"Lancamento"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Lancamento"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Lancamento"> | Date | string
    contaOrigemId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
    contaDestinoId?: UuidNullableWithAggregatesFilter<"Lancamento"> | string | null
  }

  export type CategoriaFinanceiraWhereInput = {
    AND?: CategoriaFinanceiraWhereInput | CategoriaFinanceiraWhereInput[]
    OR?: CategoriaFinanceiraWhereInput[]
    NOT?: CategoriaFinanceiraWhereInput | CategoriaFinanceiraWhereInput[]
    id?: UuidFilter<"CategoriaFinanceira"> | string
    tenantId?: UuidFilter<"CategoriaFinanceira"> | string
    nome?: StringFilter<"CategoriaFinanceira"> | string
    tipo?: EnumTipoCategoriaFinanceiraFilter<"CategoriaFinanceira"> | $Enums.TipoCategoriaFinanceira
    icone?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    cor?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    paiId?: UuidNullableFilter<"CategoriaFinanceira"> | string | null
    ativa?: BoolFilter<"CategoriaFinanceira"> | boolean
    criadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
    atualizadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
    pai?: XOR<CategoriaFinanceiraNullableRelationFilter, CategoriaFinanceiraWhereInput> | null
    filhos?: CategoriaFinanceiraListRelationFilter
  }

  export type CategoriaFinanceiraOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    icone?: SortOrderInput | SortOrder
    cor?: SortOrderInput | SortOrder
    paiId?: SortOrderInput | SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    pai?: CategoriaFinanceiraOrderByWithRelationInput
    filhos?: CategoriaFinanceiraOrderByRelationAggregateInput
  }

  export type CategoriaFinanceiraWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoriaFinanceiraWhereInput | CategoriaFinanceiraWhereInput[]
    OR?: CategoriaFinanceiraWhereInput[]
    NOT?: CategoriaFinanceiraWhereInput | CategoriaFinanceiraWhereInput[]
    tenantId?: UuidFilter<"CategoriaFinanceira"> | string
    nome?: StringFilter<"CategoriaFinanceira"> | string
    tipo?: EnumTipoCategoriaFinanceiraFilter<"CategoriaFinanceira"> | $Enums.TipoCategoriaFinanceira
    icone?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    cor?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    paiId?: UuidNullableFilter<"CategoriaFinanceira"> | string | null
    ativa?: BoolFilter<"CategoriaFinanceira"> | boolean
    criadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
    atualizadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
    pai?: XOR<CategoriaFinanceiraNullableRelationFilter, CategoriaFinanceiraWhereInput> | null
    filhos?: CategoriaFinanceiraListRelationFilter
  }, "id">

  export type CategoriaFinanceiraOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    icone?: SortOrderInput | SortOrder
    cor?: SortOrderInput | SortOrder
    paiId?: SortOrderInput | SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: CategoriaFinanceiraCountOrderByAggregateInput
    _max?: CategoriaFinanceiraMaxOrderByAggregateInput
    _min?: CategoriaFinanceiraMinOrderByAggregateInput
  }

  export type CategoriaFinanceiraScalarWhereWithAggregatesInput = {
    AND?: CategoriaFinanceiraScalarWhereWithAggregatesInput | CategoriaFinanceiraScalarWhereWithAggregatesInput[]
    OR?: CategoriaFinanceiraScalarWhereWithAggregatesInput[]
    NOT?: CategoriaFinanceiraScalarWhereWithAggregatesInput | CategoriaFinanceiraScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CategoriaFinanceira"> | string
    tenantId?: UuidWithAggregatesFilter<"CategoriaFinanceira"> | string
    nome?: StringWithAggregatesFilter<"CategoriaFinanceira"> | string
    tipo?: EnumTipoCategoriaFinanceiraWithAggregatesFilter<"CategoriaFinanceira"> | $Enums.TipoCategoriaFinanceira
    icone?: StringNullableWithAggregatesFilter<"CategoriaFinanceira"> | string | null
    cor?: StringNullableWithAggregatesFilter<"CategoriaFinanceira"> | string | null
    paiId?: UuidNullableWithAggregatesFilter<"CategoriaFinanceira"> | string | null
    ativa?: BoolWithAggregatesFilter<"CategoriaFinanceira"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"CategoriaFinanceira"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"CategoriaFinanceira"> | Date | string
  }

  export type RecorrenciaWhereInput = {
    AND?: RecorrenciaWhereInput | RecorrenciaWhereInput[]
    OR?: RecorrenciaWhereInput[]
    NOT?: RecorrenciaWhereInput | RecorrenciaWhereInput[]
    id?: UuidFilter<"Recorrencia"> | string
    tenantId?: UuidFilter<"Recorrencia"> | string
    contaId?: UuidNullableFilter<"Recorrencia"> | string | null
    descricao?: StringFilter<"Recorrencia"> | string
    tipo?: EnumTipoLancamentoFilter<"Recorrencia"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Recorrencia"> | string | null
    valor?: DecimalFilter<"Recorrencia"> | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFilter<"Recorrencia"> | $Enums.FrequenciaRecorrencia
    diaVencimento?: IntNullableFilter<"Recorrencia"> | number | null
    proximaGeracao?: DateTimeFilter<"Recorrencia"> | Date | string
    ativa?: BoolFilter<"Recorrencia"> | boolean
    criadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
    atualizadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
    conta?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    lancamentos?: LancamentoListRelationFilter
  }

  export type RecorrenciaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrderInput | SortOrder
    descricao?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrderInput | SortOrder
    valor?: SortOrder
    frequencia?: SortOrder
    diaVencimento?: SortOrderInput | SortOrder
    proximaGeracao?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    conta?: ContaFinanceiraOrderByWithRelationInput
    lancamentos?: LancamentoOrderByRelationAggregateInput
  }

  export type RecorrenciaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RecorrenciaWhereInput | RecorrenciaWhereInput[]
    OR?: RecorrenciaWhereInput[]
    NOT?: RecorrenciaWhereInput | RecorrenciaWhereInput[]
    tenantId?: UuidFilter<"Recorrencia"> | string
    contaId?: UuidNullableFilter<"Recorrencia"> | string | null
    descricao?: StringFilter<"Recorrencia"> | string
    tipo?: EnumTipoLancamentoFilter<"Recorrencia"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Recorrencia"> | string | null
    valor?: DecimalFilter<"Recorrencia"> | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFilter<"Recorrencia"> | $Enums.FrequenciaRecorrencia
    diaVencimento?: IntNullableFilter<"Recorrencia"> | number | null
    proximaGeracao?: DateTimeFilter<"Recorrencia"> | Date | string
    ativa?: BoolFilter<"Recorrencia"> | boolean
    criadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
    atualizadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
    conta?: XOR<ContaFinanceiraNullableRelationFilter, ContaFinanceiraWhereInput> | null
    lancamentos?: LancamentoListRelationFilter
  }, "id">

  export type RecorrenciaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrderInput | SortOrder
    descricao?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrderInput | SortOrder
    valor?: SortOrder
    frequencia?: SortOrder
    diaVencimento?: SortOrderInput | SortOrder
    proximaGeracao?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: RecorrenciaCountOrderByAggregateInput
    _avg?: RecorrenciaAvgOrderByAggregateInput
    _max?: RecorrenciaMaxOrderByAggregateInput
    _min?: RecorrenciaMinOrderByAggregateInput
    _sum?: RecorrenciaSumOrderByAggregateInput
  }

  export type RecorrenciaScalarWhereWithAggregatesInput = {
    AND?: RecorrenciaScalarWhereWithAggregatesInput | RecorrenciaScalarWhereWithAggregatesInput[]
    OR?: RecorrenciaScalarWhereWithAggregatesInput[]
    NOT?: RecorrenciaScalarWhereWithAggregatesInput | RecorrenciaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Recorrencia"> | string
    tenantId?: UuidWithAggregatesFilter<"Recorrencia"> | string
    contaId?: UuidNullableWithAggregatesFilter<"Recorrencia"> | string | null
    descricao?: StringWithAggregatesFilter<"Recorrencia"> | string
    tipo?: EnumTipoLancamentoWithAggregatesFilter<"Recorrencia"> | $Enums.TipoLancamento
    categoria?: StringNullableWithAggregatesFilter<"Recorrencia"> | string | null
    valor?: DecimalWithAggregatesFilter<"Recorrencia"> | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaWithAggregatesFilter<"Recorrencia"> | $Enums.FrequenciaRecorrencia
    diaVencimento?: IntNullableWithAggregatesFilter<"Recorrencia"> | number | null
    proximaGeracao?: DateTimeWithAggregatesFilter<"Recorrencia"> | Date | string
    ativa?: BoolWithAggregatesFilter<"Recorrencia"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"Recorrencia"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Recorrencia"> | Date | string
  }

  export type ConciliacaoBancariaWhereInput = {
    AND?: ConciliacaoBancariaWhereInput | ConciliacaoBancariaWhereInput[]
    OR?: ConciliacaoBancariaWhereInput[]
    NOT?: ConciliacaoBancariaWhereInput | ConciliacaoBancariaWhereInput[]
    id?: UuidFilter<"ConciliacaoBancaria"> | string
    tenantId?: UuidFilter<"ConciliacaoBancaria"> | string
    contaId?: UuidFilter<"ConciliacaoBancaria"> | string
    dataInicio?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    dataFim?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    saldoInicial?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFilter<"ConciliacaoBancaria"> | $Enums.StatusConciliacao
    divergencias?: JsonNullableFilter<"ConciliacaoBancaria">
    criadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    atualizadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    conta?: XOR<ContaFinanceiraRelationFilter, ContaFinanceiraWhereInput>
  }

  export type ConciliacaoBancariaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
    status?: SortOrder
    divergencias?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    conta?: ContaFinanceiraOrderByWithRelationInput
  }

  export type ConciliacaoBancariaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConciliacaoBancariaWhereInput | ConciliacaoBancariaWhereInput[]
    OR?: ConciliacaoBancariaWhereInput[]
    NOT?: ConciliacaoBancariaWhereInput | ConciliacaoBancariaWhereInput[]
    tenantId?: UuidFilter<"ConciliacaoBancaria"> | string
    contaId?: UuidFilter<"ConciliacaoBancaria"> | string
    dataInicio?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    dataFim?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    saldoInicial?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFilter<"ConciliacaoBancaria"> | $Enums.StatusConciliacao
    divergencias?: JsonNullableFilter<"ConciliacaoBancaria">
    criadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    atualizadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    conta?: XOR<ContaFinanceiraRelationFilter, ContaFinanceiraWhereInput>
  }, "id">

  export type ConciliacaoBancariaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
    status?: SortOrder
    divergencias?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: ConciliacaoBancariaCountOrderByAggregateInput
    _avg?: ConciliacaoBancariaAvgOrderByAggregateInput
    _max?: ConciliacaoBancariaMaxOrderByAggregateInput
    _min?: ConciliacaoBancariaMinOrderByAggregateInput
    _sum?: ConciliacaoBancariaSumOrderByAggregateInput
  }

  export type ConciliacaoBancariaScalarWhereWithAggregatesInput = {
    AND?: ConciliacaoBancariaScalarWhereWithAggregatesInput | ConciliacaoBancariaScalarWhereWithAggregatesInput[]
    OR?: ConciliacaoBancariaScalarWhereWithAggregatesInput[]
    NOT?: ConciliacaoBancariaScalarWhereWithAggregatesInput | ConciliacaoBancariaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ConciliacaoBancaria"> | string
    tenantId?: UuidWithAggregatesFilter<"ConciliacaoBancaria"> | string
    contaId?: UuidWithAggregatesFilter<"ConciliacaoBancaria"> | string
    dataInicio?: DateTimeWithAggregatesFilter<"ConciliacaoBancaria"> | Date | string
    dataFim?: DateTimeWithAggregatesFilter<"ConciliacaoBancaria"> | Date | string
    saldoInicial?: DecimalWithAggregatesFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalWithAggregatesFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoWithAggregatesFilter<"ConciliacaoBancaria"> | $Enums.StatusConciliacao
    divergencias?: JsonNullableWithAggregatesFilter<"ConciliacaoBancaria">
    criadoEm?: DateTimeWithAggregatesFilter<"ConciliacaoBancaria"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"ConciliacaoBancaria"> | Date | string
  }

  export type EventoProcessadoWhereInput = {
    AND?: EventoProcessadoWhereInput | EventoProcessadoWhereInput[]
    OR?: EventoProcessadoWhereInput[]
    NOT?: EventoProcessadoWhereInput | EventoProcessadoWhereInput[]
    id?: UuidFilter<"EventoProcessado"> | string
    tenantId?: UuidFilter<"EventoProcessado"> | string
    evento?: StringFilter<"EventoProcessado"> | string
    referenciaId?: StringFilter<"EventoProcessado"> | string
    processadoEm?: DateTimeFilter<"EventoProcessado"> | Date | string
  }

  export type EventoProcessadoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    evento?: SortOrder
    referenciaId?: SortOrder
    processadoEm?: SortOrder
  }

  export type EventoProcessadoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    evento_referenciaId?: EventoProcessadoEvento_referenciaIdCompoundUniqueInput
    AND?: EventoProcessadoWhereInput | EventoProcessadoWhereInput[]
    OR?: EventoProcessadoWhereInput[]
    NOT?: EventoProcessadoWhereInput | EventoProcessadoWhereInput[]
    tenantId?: UuidFilter<"EventoProcessado"> | string
    evento?: StringFilter<"EventoProcessado"> | string
    referenciaId?: StringFilter<"EventoProcessado"> | string
    processadoEm?: DateTimeFilter<"EventoProcessado"> | Date | string
  }, "id" | "evento_referenciaId">

  export type EventoProcessadoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    evento?: SortOrder
    referenciaId?: SortOrder
    processadoEm?: SortOrder
    _count?: EventoProcessadoCountOrderByAggregateInput
    _max?: EventoProcessadoMaxOrderByAggregateInput
    _min?: EventoProcessadoMinOrderByAggregateInput
  }

  export type EventoProcessadoScalarWhereWithAggregatesInput = {
    AND?: EventoProcessadoScalarWhereWithAggregatesInput | EventoProcessadoScalarWhereWithAggregatesInput[]
    OR?: EventoProcessadoScalarWhereWithAggregatesInput[]
    NOT?: EventoProcessadoScalarWhereWithAggregatesInput | EventoProcessadoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EventoProcessado"> | string
    tenantId?: UuidWithAggregatesFilter<"EventoProcessado"> | string
    evento?: StringWithAggregatesFilter<"EventoProcessado"> | string
    referenciaId?: StringWithAggregatesFilter<"EventoProcessado"> | string
    processadoEm?: DateTimeWithAggregatesFilter<"EventoProcessado"> | Date | string
  }

  export type DREWhereInput = {
    AND?: DREWhereInput | DREWhereInput[]
    OR?: DREWhereInput[]
    NOT?: DREWhereInput | DREWhereInput[]
    id?: UuidFilter<"DRE"> | string
    tenantId?: UuidFilter<"DRE"> | string
    periodo?: StringFilter<"DRE"> | string
    ano?: IntFilter<"DRE"> | number
    mes?: IntNullableFilter<"DRE"> | number | null
    receitaBruta?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFilter<"DRE"> | Date | string
  }

  export type DREOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    periodo?: SortOrder
    ano?: SortOrder
    mes?: SortOrderInput | SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
    criadoEm?: SortOrder
  }

  export type DREWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_ano_mes?: DRETenantId_ano_mesCompoundUniqueInput
    AND?: DREWhereInput | DREWhereInput[]
    OR?: DREWhereInput[]
    NOT?: DREWhereInput | DREWhereInput[]
    tenantId?: UuidFilter<"DRE"> | string
    periodo?: StringFilter<"DRE"> | string
    ano?: IntFilter<"DRE"> | number
    mes?: IntNullableFilter<"DRE"> | number | null
    receitaBruta?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFilter<"DRE"> | Date | string
  }, "id" | "tenantId_ano_mes">

  export type DREOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    periodo?: SortOrder
    ano?: SortOrder
    mes?: SortOrderInput | SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
    criadoEm?: SortOrder
    _count?: DRECountOrderByAggregateInput
    _avg?: DREAvgOrderByAggregateInput
    _max?: DREMaxOrderByAggregateInput
    _min?: DREMinOrderByAggregateInput
    _sum?: DRESumOrderByAggregateInput
  }

  export type DREScalarWhereWithAggregatesInput = {
    AND?: DREScalarWhereWithAggregatesInput | DREScalarWhereWithAggregatesInput[]
    OR?: DREScalarWhereWithAggregatesInput[]
    NOT?: DREScalarWhereWithAggregatesInput | DREScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DRE"> | string
    tenantId?: UuidWithAggregatesFilter<"DRE"> | string
    periodo?: StringWithAggregatesFilter<"DRE"> | string
    ano?: IntWithAggregatesFilter<"DRE"> | number
    mes?: IntNullableWithAggregatesFilter<"DRE"> | number | null
    receitaBruta?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalWithAggregatesFilter<"DRE"> | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeWithAggregatesFilter<"DRE"> | Date | string
  }

  export type TituloCobrancaWhereInput = {
    AND?: TituloCobrancaWhereInput | TituloCobrancaWhereInput[]
    OR?: TituloCobrancaWhereInput[]
    NOT?: TituloCobrancaWhereInput | TituloCobrancaWhereInput[]
    id?: UuidFilter<"TituloCobranca"> | string
    tenantId?: UuidFilter<"TituloCobranca"> | string
    lancamentoId?: UuidNullableFilter<"TituloCobranca"> | string | null
    pedidoId?: UuidNullableFilter<"TituloCobranca"> | string | null
    clienteId?: UuidNullableFilter<"TituloCobranca"> | string | null
    clienteNome?: StringFilter<"TituloCobranca"> | string
    clienteTelefone?: StringNullableFilter<"TituloCobranca"> | string | null
    clienteEmail?: StringNullableFilter<"TituloCobranca"> | string | null
    descricao?: StringFilter<"TituloCobranca"> | string
    valor?: DecimalFilter<"TituloCobranca"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFilter<"TituloCobranca"> | Date | string
    status?: EnumStatusTituloCobrancaFilter<"TituloCobranca"> | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFilter<"TituloCobranca"> | $Enums.PrioridadeCobranca
    tentativas?: IntFilter<"TituloCobranca"> | number
    ultimaAcaoEm?: DateTimeNullableFilter<"TituloCobranca"> | Date | string | null
    canalUltimaAcao?: StringNullableFilter<"TituloCobranca"> | string | null
    observacao?: StringNullableFilter<"TituloCobranca"> | string | null
    criadoEm?: DateTimeFilter<"TituloCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"TituloCobranca"> | Date | string
    acoes?: AcaoCobrancaListRelationFilter
    acordos?: AcordoCobrancaListRelationFilter
  }

  export type TituloCobrancaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    lancamentoId?: SortOrderInput | SortOrder
    pedidoId?: SortOrderInput | SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    clienteTelefone?: SortOrderInput | SortOrder
    clienteEmail?: SortOrderInput | SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    status?: SortOrder
    prioridade?: SortOrder
    tentativas?: SortOrder
    ultimaAcaoEm?: SortOrderInput | SortOrder
    canalUltimaAcao?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    acoes?: AcaoCobrancaOrderByRelationAggregateInput
    acordos?: AcordoCobrancaOrderByRelationAggregateInput
  }

  export type TituloCobrancaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_lancamentoId?: TituloCobrancaTenantIdLancamentoIdCompoundUniqueInput
    AND?: TituloCobrancaWhereInput | TituloCobrancaWhereInput[]
    OR?: TituloCobrancaWhereInput[]
    NOT?: TituloCobrancaWhereInput | TituloCobrancaWhereInput[]
    tenantId?: UuidFilter<"TituloCobranca"> | string
    lancamentoId?: UuidNullableFilter<"TituloCobranca"> | string | null
    pedidoId?: UuidNullableFilter<"TituloCobranca"> | string | null
    clienteId?: UuidNullableFilter<"TituloCobranca"> | string | null
    clienteNome?: StringFilter<"TituloCobranca"> | string
    clienteTelefone?: StringNullableFilter<"TituloCobranca"> | string | null
    clienteEmail?: StringNullableFilter<"TituloCobranca"> | string | null
    descricao?: StringFilter<"TituloCobranca"> | string
    valor?: DecimalFilter<"TituloCobranca"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFilter<"TituloCobranca"> | Date | string
    status?: EnumStatusTituloCobrancaFilter<"TituloCobranca"> | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFilter<"TituloCobranca"> | $Enums.PrioridadeCobranca
    tentativas?: IntFilter<"TituloCobranca"> | number
    ultimaAcaoEm?: DateTimeNullableFilter<"TituloCobranca"> | Date | string | null
    canalUltimaAcao?: StringNullableFilter<"TituloCobranca"> | string | null
    observacao?: StringNullableFilter<"TituloCobranca"> | string | null
    criadoEm?: DateTimeFilter<"TituloCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"TituloCobranca"> | Date | string
    acoes?: AcaoCobrancaListRelationFilter
    acordos?: AcordoCobrancaListRelationFilter
  }, "id" | "tenantId_lancamentoId">

  export type TituloCobrancaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    lancamentoId?: SortOrderInput | SortOrder
    pedidoId?: SortOrderInput | SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    clienteTelefone?: SortOrderInput | SortOrder
    clienteEmail?: SortOrderInput | SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    status?: SortOrder
    prioridade?: SortOrder
    tentativas?: SortOrder
    ultimaAcaoEm?: SortOrderInput | SortOrder
    canalUltimaAcao?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: TituloCobrancaCountOrderByAggregateInput
    _avg?: TituloCobrancaAvgOrderByAggregateInput
    _max?: TituloCobrancaMaxOrderByAggregateInput
    _min?: TituloCobrancaMinOrderByAggregateInput
    _sum?: TituloCobrancaSumOrderByAggregateInput
  }

  export type TituloCobrancaScalarWhereWithAggregatesInput = {
    AND?: TituloCobrancaScalarWhereWithAggregatesInput | TituloCobrancaScalarWhereWithAggregatesInput[]
    OR?: TituloCobrancaScalarWhereWithAggregatesInput[]
    NOT?: TituloCobrancaScalarWhereWithAggregatesInput | TituloCobrancaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TituloCobranca"> | string
    tenantId?: UuidWithAggregatesFilter<"TituloCobranca"> | string
    lancamentoId?: UuidNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    pedidoId?: UuidNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    clienteId?: UuidNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    clienteNome?: StringWithAggregatesFilter<"TituloCobranca"> | string
    clienteTelefone?: StringNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    clienteEmail?: StringNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    descricao?: StringWithAggregatesFilter<"TituloCobranca"> | string
    valor?: DecimalWithAggregatesFilter<"TituloCobranca"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeWithAggregatesFilter<"TituloCobranca"> | Date | string
    status?: EnumStatusTituloCobrancaWithAggregatesFilter<"TituloCobranca"> | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaWithAggregatesFilter<"TituloCobranca"> | $Enums.PrioridadeCobranca
    tentativas?: IntWithAggregatesFilter<"TituloCobranca"> | number
    ultimaAcaoEm?: DateTimeNullableWithAggregatesFilter<"TituloCobranca"> | Date | string | null
    canalUltimaAcao?: StringNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    observacao?: StringNullableWithAggregatesFilter<"TituloCobranca"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"TituloCobranca"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"TituloCobranca"> | Date | string
  }

  export type AcaoCobrancaWhereInput = {
    AND?: AcaoCobrancaWhereInput | AcaoCobrancaWhereInput[]
    OR?: AcaoCobrancaWhereInput[]
    NOT?: AcaoCobrancaWhereInput | AcaoCobrancaWhereInput[]
    id?: UuidFilter<"AcaoCobranca"> | string
    tenantId?: UuidFilter<"AcaoCobranca"> | string
    tituloId?: UuidFilter<"AcaoCobranca"> | string
    clienteNome?: StringFilter<"AcaoCobranca"> | string
    tipo?: EnumTipoAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.TipoAcaoCobranca
    mensagem?: StringFilter<"AcaoCobranca"> | string
    status?: EnumStatusAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.StatusAcaoCobranca
    automatica?: BoolFilter<"AcaoCobranca"> | boolean
    detalhe?: StringNullableFilter<"AcaoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcaoCobranca"> | Date | string
    titulo?: XOR<TituloCobrancaRelationFilter, TituloCobrancaWhereInput>
  }

  export type AcaoCobrancaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteNome?: SortOrder
    tipo?: SortOrder
    mensagem?: SortOrder
    status?: SortOrder
    automatica?: SortOrder
    detalhe?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    titulo?: TituloCobrancaOrderByWithRelationInput
  }

  export type AcaoCobrancaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AcaoCobrancaWhereInput | AcaoCobrancaWhereInput[]
    OR?: AcaoCobrancaWhereInput[]
    NOT?: AcaoCobrancaWhereInput | AcaoCobrancaWhereInput[]
    tenantId?: UuidFilter<"AcaoCobranca"> | string
    tituloId?: UuidFilter<"AcaoCobranca"> | string
    clienteNome?: StringFilter<"AcaoCobranca"> | string
    tipo?: EnumTipoAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.TipoAcaoCobranca
    mensagem?: StringFilter<"AcaoCobranca"> | string
    status?: EnumStatusAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.StatusAcaoCobranca
    automatica?: BoolFilter<"AcaoCobranca"> | boolean
    detalhe?: StringNullableFilter<"AcaoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcaoCobranca"> | Date | string
    titulo?: XOR<TituloCobrancaRelationFilter, TituloCobrancaWhereInput>
  }, "id">

  export type AcaoCobrancaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteNome?: SortOrder
    tipo?: SortOrder
    mensagem?: SortOrder
    status?: SortOrder
    automatica?: SortOrder
    detalhe?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: AcaoCobrancaCountOrderByAggregateInput
    _max?: AcaoCobrancaMaxOrderByAggregateInput
    _min?: AcaoCobrancaMinOrderByAggregateInput
  }

  export type AcaoCobrancaScalarWhereWithAggregatesInput = {
    AND?: AcaoCobrancaScalarWhereWithAggregatesInput | AcaoCobrancaScalarWhereWithAggregatesInput[]
    OR?: AcaoCobrancaScalarWhereWithAggregatesInput[]
    NOT?: AcaoCobrancaScalarWhereWithAggregatesInput | AcaoCobrancaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AcaoCobranca"> | string
    tenantId?: UuidWithAggregatesFilter<"AcaoCobranca"> | string
    tituloId?: UuidWithAggregatesFilter<"AcaoCobranca"> | string
    clienteNome?: StringWithAggregatesFilter<"AcaoCobranca"> | string
    tipo?: EnumTipoAcaoCobrancaWithAggregatesFilter<"AcaoCobranca"> | $Enums.TipoAcaoCobranca
    mensagem?: StringWithAggregatesFilter<"AcaoCobranca"> | string
    status?: EnumStatusAcaoCobrancaWithAggregatesFilter<"AcaoCobranca"> | $Enums.StatusAcaoCobranca
    automatica?: BoolWithAggregatesFilter<"AcaoCobranca"> | boolean
    detalhe?: StringNullableWithAggregatesFilter<"AcaoCobranca"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"AcaoCobranca"> | Date | string
  }

  export type AcordoCobrancaWhereInput = {
    AND?: AcordoCobrancaWhereInput | AcordoCobrancaWhereInput[]
    OR?: AcordoCobrancaWhereInput[]
    NOT?: AcordoCobrancaWhereInput | AcordoCobrancaWhereInput[]
    id?: UuidFilter<"AcordoCobranca"> | string
    tenantId?: UuidFilter<"AcordoCobranca"> | string
    tituloId?: UuidFilter<"AcordoCobranca"> | string
    clienteId?: UuidNullableFilter<"AcordoCobranca"> | string | null
    clienteNome?: StringFilter<"AcordoCobranca"> | string
    valorOriginal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFilter<"AcordoCobranca"> | number
    status?: EnumStatusAcordoCobrancaFilter<"AcordoCobranca"> | $Enums.StatusAcordoCobranca
    observacao?: StringNullableFilter<"AcordoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
    titulo?: XOR<TituloCobrancaRelationFilter, TituloCobrancaWhereInput>
    parcelas?: ParcelaAcordoListRelationFilter
  }

  export type AcordoCobrancaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
    status?: SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    titulo?: TituloCobrancaOrderByWithRelationInput
    parcelas?: ParcelaAcordoOrderByRelationAggregateInput
  }

  export type AcordoCobrancaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AcordoCobrancaWhereInput | AcordoCobrancaWhereInput[]
    OR?: AcordoCobrancaWhereInput[]
    NOT?: AcordoCobrancaWhereInput | AcordoCobrancaWhereInput[]
    tenantId?: UuidFilter<"AcordoCobranca"> | string
    tituloId?: UuidFilter<"AcordoCobranca"> | string
    clienteId?: UuidNullableFilter<"AcordoCobranca"> | string | null
    clienteNome?: StringFilter<"AcordoCobranca"> | string
    valorOriginal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFilter<"AcordoCobranca"> | number
    status?: EnumStatusAcordoCobrancaFilter<"AcordoCobranca"> | $Enums.StatusAcordoCobranca
    observacao?: StringNullableFilter<"AcordoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
    titulo?: XOR<TituloCobrancaRelationFilter, TituloCobrancaWhereInput>
    parcelas?: ParcelaAcordoListRelationFilter
  }, "id">

  export type AcordoCobrancaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
    status?: SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: AcordoCobrancaCountOrderByAggregateInput
    _avg?: AcordoCobrancaAvgOrderByAggregateInput
    _max?: AcordoCobrancaMaxOrderByAggregateInput
    _min?: AcordoCobrancaMinOrderByAggregateInput
    _sum?: AcordoCobrancaSumOrderByAggregateInput
  }

  export type AcordoCobrancaScalarWhereWithAggregatesInput = {
    AND?: AcordoCobrancaScalarWhereWithAggregatesInput | AcordoCobrancaScalarWhereWithAggregatesInput[]
    OR?: AcordoCobrancaScalarWhereWithAggregatesInput[]
    NOT?: AcordoCobrancaScalarWhereWithAggregatesInput | AcordoCobrancaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AcordoCobranca"> | string
    tenantId?: UuidWithAggregatesFilter<"AcordoCobranca"> | string
    tituloId?: UuidWithAggregatesFilter<"AcordoCobranca"> | string
    clienteId?: UuidNullableWithAggregatesFilter<"AcordoCobranca"> | string | null
    clienteNome?: StringWithAggregatesFilter<"AcordoCobranca"> | string
    valorOriginal?: DecimalWithAggregatesFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalWithAggregatesFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalWithAggregatesFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntWithAggregatesFilter<"AcordoCobranca"> | number
    status?: EnumStatusAcordoCobrancaWithAggregatesFilter<"AcordoCobranca"> | $Enums.StatusAcordoCobranca
    observacao?: StringNullableWithAggregatesFilter<"AcordoCobranca"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"AcordoCobranca"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"AcordoCobranca"> | Date | string
  }

  export type ParcelaAcordoWhereInput = {
    AND?: ParcelaAcordoWhereInput | ParcelaAcordoWhereInput[]
    OR?: ParcelaAcordoWhereInput[]
    NOT?: ParcelaAcordoWhereInput | ParcelaAcordoWhereInput[]
    id?: UuidFilter<"ParcelaAcordo"> | string
    tenantId?: UuidFilter<"ParcelaAcordo"> | string
    acordoId?: UuidFilter<"ParcelaAcordo"> | string
    numero?: IntFilter<"ParcelaAcordo"> | number
    valor?: DecimalFilter<"ParcelaAcordo"> | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFilter<"ParcelaAcordo"> | Date | string
    pago?: BoolFilter<"ParcelaAcordo"> | boolean
    pagoEm?: DateTimeNullableFilter<"ParcelaAcordo"> | Date | string | null
    acordo?: XOR<AcordoCobrancaRelationFilter, AcordoCobrancaWhereInput>
  }

  export type ParcelaAcordoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    acordoId?: SortOrder
    numero?: SortOrder
    valor?: SortOrder
    vencimento?: SortOrder
    pago?: SortOrder
    pagoEm?: SortOrderInput | SortOrder
    acordo?: AcordoCobrancaOrderByWithRelationInput
  }

  export type ParcelaAcordoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ParcelaAcordoWhereInput | ParcelaAcordoWhereInput[]
    OR?: ParcelaAcordoWhereInput[]
    NOT?: ParcelaAcordoWhereInput | ParcelaAcordoWhereInput[]
    tenantId?: UuidFilter<"ParcelaAcordo"> | string
    acordoId?: UuidFilter<"ParcelaAcordo"> | string
    numero?: IntFilter<"ParcelaAcordo"> | number
    valor?: DecimalFilter<"ParcelaAcordo"> | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFilter<"ParcelaAcordo"> | Date | string
    pago?: BoolFilter<"ParcelaAcordo"> | boolean
    pagoEm?: DateTimeNullableFilter<"ParcelaAcordo"> | Date | string | null
    acordo?: XOR<AcordoCobrancaRelationFilter, AcordoCobrancaWhereInput>
  }, "id">

  export type ParcelaAcordoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    acordoId?: SortOrder
    numero?: SortOrder
    valor?: SortOrder
    vencimento?: SortOrder
    pago?: SortOrder
    pagoEm?: SortOrderInput | SortOrder
    _count?: ParcelaAcordoCountOrderByAggregateInput
    _avg?: ParcelaAcordoAvgOrderByAggregateInput
    _max?: ParcelaAcordoMaxOrderByAggregateInput
    _min?: ParcelaAcordoMinOrderByAggregateInput
    _sum?: ParcelaAcordoSumOrderByAggregateInput
  }

  export type ParcelaAcordoScalarWhereWithAggregatesInput = {
    AND?: ParcelaAcordoScalarWhereWithAggregatesInput | ParcelaAcordoScalarWhereWithAggregatesInput[]
    OR?: ParcelaAcordoScalarWhereWithAggregatesInput[]
    NOT?: ParcelaAcordoScalarWhereWithAggregatesInput | ParcelaAcordoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ParcelaAcordo"> | string
    tenantId?: UuidWithAggregatesFilter<"ParcelaAcordo"> | string
    acordoId?: UuidWithAggregatesFilter<"ParcelaAcordo"> | string
    numero?: IntWithAggregatesFilter<"ParcelaAcordo"> | number
    valor?: DecimalWithAggregatesFilter<"ParcelaAcordo"> | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeWithAggregatesFilter<"ParcelaAcordo"> | Date | string
    pago?: BoolWithAggregatesFilter<"ParcelaAcordo"> | boolean
    pagoEm?: DateTimeNullableWithAggregatesFilter<"ParcelaAcordo"> | Date | string | null
  }

  export type ConfiguracaoCobrancaWhereInput = {
    AND?: ConfiguracaoCobrancaWhereInput | ConfiguracaoCobrancaWhereInput[]
    OR?: ConfiguracaoCobrancaWhereInput[]
    NOT?: ConfiguracaoCobrancaWhereInput | ConfiguracaoCobrancaWhereInput[]
    id?: UuidFilter<"ConfiguracaoCobranca"> | string
    tenantId?: UuidFilter<"ConfiguracaoCobranca"> | string
    ativo?: BoolFilter<"ConfiguracaoCobranca"> | boolean
    webhookN8n?: StringNullableFilter<"ConfiguracaoCobranca"> | string | null
    callbackUrl?: StringNullableFilter<"ConfiguracaoCobranca"> | string | null
    regras?: JsonFilter<"ConfiguracaoCobranca">
    descontoMaximo?: DecimalFilter<"ConfiguracaoCobranca"> | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFilter<"ConfiguracaoCobranca"> | number
    horarioInicio?: StringFilter<"ConfiguracaoCobranca"> | string
    horarioFim?: StringFilter<"ConfiguracaoCobranca"> | string
    pausarFimDeSemana?: BoolFilter<"ConfiguracaoCobranca"> | boolean
    criadoEm?: DateTimeFilter<"ConfiguracaoCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"ConfiguracaoCobranca"> | Date | string
  }

  export type ConfiguracaoCobrancaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ativo?: SortOrder
    webhookN8n?: SortOrderInput | SortOrder
    callbackUrl?: SortOrderInput | SortOrder
    regras?: SortOrder
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
    horarioInicio?: SortOrder
    horarioFim?: SortOrder
    pausarFimDeSemana?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConfiguracaoCobrancaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId?: string
    AND?: ConfiguracaoCobrancaWhereInput | ConfiguracaoCobrancaWhereInput[]
    OR?: ConfiguracaoCobrancaWhereInput[]
    NOT?: ConfiguracaoCobrancaWhereInput | ConfiguracaoCobrancaWhereInput[]
    ativo?: BoolFilter<"ConfiguracaoCobranca"> | boolean
    webhookN8n?: StringNullableFilter<"ConfiguracaoCobranca"> | string | null
    callbackUrl?: StringNullableFilter<"ConfiguracaoCobranca"> | string | null
    regras?: JsonFilter<"ConfiguracaoCobranca">
    descontoMaximo?: DecimalFilter<"ConfiguracaoCobranca"> | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFilter<"ConfiguracaoCobranca"> | number
    horarioInicio?: StringFilter<"ConfiguracaoCobranca"> | string
    horarioFim?: StringFilter<"ConfiguracaoCobranca"> | string
    pausarFimDeSemana?: BoolFilter<"ConfiguracaoCobranca"> | boolean
    criadoEm?: DateTimeFilter<"ConfiguracaoCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"ConfiguracaoCobranca"> | Date | string
  }, "id" | "tenantId">

  export type ConfiguracaoCobrancaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ativo?: SortOrder
    webhookN8n?: SortOrderInput | SortOrder
    callbackUrl?: SortOrderInput | SortOrder
    regras?: SortOrder
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
    horarioInicio?: SortOrder
    horarioFim?: SortOrder
    pausarFimDeSemana?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: ConfiguracaoCobrancaCountOrderByAggregateInput
    _avg?: ConfiguracaoCobrancaAvgOrderByAggregateInput
    _max?: ConfiguracaoCobrancaMaxOrderByAggregateInput
    _min?: ConfiguracaoCobrancaMinOrderByAggregateInput
    _sum?: ConfiguracaoCobrancaSumOrderByAggregateInput
  }

  export type ConfiguracaoCobrancaScalarWhereWithAggregatesInput = {
    AND?: ConfiguracaoCobrancaScalarWhereWithAggregatesInput | ConfiguracaoCobrancaScalarWhereWithAggregatesInput[]
    OR?: ConfiguracaoCobrancaScalarWhereWithAggregatesInput[]
    NOT?: ConfiguracaoCobrancaScalarWhereWithAggregatesInput | ConfiguracaoCobrancaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ConfiguracaoCobranca"> | string
    tenantId?: UuidWithAggregatesFilter<"ConfiguracaoCobranca"> | string
    ativo?: BoolWithAggregatesFilter<"ConfiguracaoCobranca"> | boolean
    webhookN8n?: StringNullableWithAggregatesFilter<"ConfiguracaoCobranca"> | string | null
    callbackUrl?: StringNullableWithAggregatesFilter<"ConfiguracaoCobranca"> | string | null
    regras?: JsonWithAggregatesFilter<"ConfiguracaoCobranca">
    descontoMaximo?: DecimalWithAggregatesFilter<"ConfiguracaoCobranca"> | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntWithAggregatesFilter<"ConfiguracaoCobranca"> | number
    horarioInicio?: StringWithAggregatesFilter<"ConfiguracaoCobranca"> | string
    horarioFim?: StringWithAggregatesFilter<"ConfiguracaoCobranca"> | string
    pausarFimDeSemana?: BoolWithAggregatesFilter<"ConfiguracaoCobranca"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"ConfiguracaoCobranca"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"ConfiguracaoCobranca"> | Date | string
  }

  export type ContaFinanceiraCreateInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaUncheckedCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUncheckedUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ContaFinanceiraUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContaFinanceiraUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LancamentoCreateInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutLancamentosInput
    recorrencia?: RecorrenciaCreateNestedOneWithoutLancamentosInput
    contaOrigem?: ContaFinanceiraCreateNestedOneWithoutTransferenciasOrigemInput
    contaDestino?: ContaFinanceiraCreateNestedOneWithoutTransferenciasDestinoInput
  }

  export type LancamentoUncheckedCreateInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutLancamentosNestedInput
    recorrencia?: RecorrenciaUpdateOneWithoutLancamentosNestedInput
    contaOrigem?: ContaFinanceiraUpdateOneWithoutTransferenciasOrigemNestedInput
    contaDestino?: ContaFinanceiraUpdateOneWithoutTransferenciasDestinoNestedInput
  }

  export type LancamentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoCreateManyInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LancamentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CategoriaFinanceiraCreateInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    pai?: CategoriaFinanceiraCreateNestedOneWithoutFilhosInput
    filhos?: CategoriaFinanceiraCreateNestedManyWithoutPaiInput
  }

  export type CategoriaFinanceiraUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    paiId?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    filhos?: CategoriaFinanceiraUncheckedCreateNestedManyWithoutPaiInput
  }

  export type CategoriaFinanceiraUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pai?: CategoriaFinanceiraUpdateOneWithoutFilhosNestedInput
    filhos?: CategoriaFinanceiraUpdateManyWithoutPaiNestedInput
  }

  export type CategoriaFinanceiraUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    paiId?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    filhos?: CategoriaFinanceiraUncheckedUpdateManyWithoutPaiNestedInput
  }

  export type CategoriaFinanceiraCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    paiId?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type CategoriaFinanceiraUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoriaFinanceiraUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    paiId?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecorrenciaCreateInput = {
    id?: string
    tenantId: string
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutRecorrenciasInput
    lancamentos?: LancamentoCreateNestedManyWithoutRecorrenciaInput
  }

  export type RecorrenciaUncheckedCreateInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutRecorrenciaInput
  }

  export type RecorrenciaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutRecorrenciasNestedInput
    lancamentos?: LancamentoUpdateManyWithoutRecorrenciaNestedInput
  }

  export type RecorrenciaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutRecorrenciaNestedInput
  }

  export type RecorrenciaCreateManyInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type RecorrenciaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecorrenciaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaCreateInput = {
    id?: string
    tenantId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta: ContaFinanceiraCreateNestedOneWithoutConciliacoesInput
  }

  export type ConciliacaoBancariaUncheckedCreateInput = {
    id?: string
    tenantId: string
    contaId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConciliacaoBancariaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneRequiredWithoutConciliacoesNestedInput
  }

  export type ConciliacaoBancariaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaCreateManyInput = {
    id?: string
    tenantId: string
    contaId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConciliacaoBancariaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventoProcessadoCreateInput = {
    id?: string
    tenantId: string
    evento: string
    referenciaId: string
    processadoEm?: Date | string
  }

  export type EventoProcessadoUncheckedCreateInput = {
    id?: string
    tenantId: string
    evento: string
    referenciaId: string
    processadoEm?: Date | string
  }

  export type EventoProcessadoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    referenciaId?: StringFieldUpdateOperationsInput | string
    processadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventoProcessadoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    referenciaId?: StringFieldUpdateOperationsInput | string
    processadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventoProcessadoCreateManyInput = {
    id?: string
    tenantId: string
    evento: string
    referenciaId: string
    processadoEm?: Date | string
  }

  export type EventoProcessadoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    referenciaId?: StringFieldUpdateOperationsInput | string
    processadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventoProcessadoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    referenciaId?: StringFieldUpdateOperationsInput | string
    processadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DRECreateInput = {
    id?: string
    tenantId: string
    periodo: string
    ano: number
    mes?: number | null
    receitaBruta: Decimal | DecimalJsLike | number | string
    deducoes?: Decimal | DecimalJsLike | number | string
    receitaLiquida: Decimal | DecimalJsLike | number | string
    custosMercadorias?: Decimal | DecimalJsLike | number | string
    lucroBruto: Decimal | DecimalJsLike | number | string
    despesasOperacionais?: Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: Decimal | DecimalJsLike | number | string
    despesasComerciais?: Decimal | DecimalJsLike | number | string
    resultadoOperacional: Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: Decimal | DecimalJsLike | number | string
    lucroLiquido: Decimal | DecimalJsLike | number | string
    criadoEm?: Date | string
  }

  export type DREUncheckedCreateInput = {
    id?: string
    tenantId: string
    periodo: string
    ano: number
    mes?: number | null
    receitaBruta: Decimal | DecimalJsLike | number | string
    deducoes?: Decimal | DecimalJsLike | number | string
    receitaLiquida: Decimal | DecimalJsLike | number | string
    custosMercadorias?: Decimal | DecimalJsLike | number | string
    lucroBruto: Decimal | DecimalJsLike | number | string
    despesasOperacionais?: Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: Decimal | DecimalJsLike | number | string
    despesasComerciais?: Decimal | DecimalJsLike | number | string
    resultadoOperacional: Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: Decimal | DecimalJsLike | number | string
    lucroLiquido: Decimal | DecimalJsLike | number | string
    criadoEm?: Date | string
  }

  export type DREUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    periodo?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    mes?: NullableIntFieldUpdateOperationsInput | number | null
    receitaBruta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DREUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    periodo?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    mes?: NullableIntFieldUpdateOperationsInput | number | null
    receitaBruta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DRECreateManyInput = {
    id?: string
    tenantId: string
    periodo: string
    ano: number
    mes?: number | null
    receitaBruta: Decimal | DecimalJsLike | number | string
    deducoes?: Decimal | DecimalJsLike | number | string
    receitaLiquida: Decimal | DecimalJsLike | number | string
    custosMercadorias?: Decimal | DecimalJsLike | number | string
    lucroBruto: Decimal | DecimalJsLike | number | string
    despesasOperacionais?: Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: Decimal | DecimalJsLike | number | string
    despesasComerciais?: Decimal | DecimalJsLike | number | string
    resultadoOperacional: Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: Decimal | DecimalJsLike | number | string
    lucroLiquido: Decimal | DecimalJsLike | number | string
    criadoEm?: Date | string
  }

  export type DREUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    periodo?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    mes?: NullableIntFieldUpdateOperationsInput | number | null
    receitaBruta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DREUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    periodo?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    mes?: NullableIntFieldUpdateOperationsInput | number | null
    receitaBruta?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deducoes?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitaLiquida?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    custosMercadorias?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroBruto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasOperacionais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasAdministrativas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasComerciais?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    resultadoOperacional?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    despesasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    receitasFinanceiras?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lucroLiquido?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TituloCobrancaCreateInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acoes?: AcaoCobrancaCreateNestedManyWithoutTituloInput
    acordos?: AcordoCobrancaCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaUncheckedCreateInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acoes?: AcaoCobrancaUncheckedCreateNestedManyWithoutTituloInput
    acordos?: AcordoCobrancaUncheckedCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acoes?: AcaoCobrancaUpdateManyWithoutTituloNestedInput
    acordos?: AcordoCobrancaUpdateManyWithoutTituloNestedInput
  }

  export type TituloCobrancaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acoes?: AcaoCobrancaUncheckedUpdateManyWithoutTituloNestedInput
    acordos?: AcordoCobrancaUncheckedUpdateManyWithoutTituloNestedInput
  }

  export type TituloCobrancaCreateManyInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type TituloCobrancaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TituloCobrancaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcaoCobrancaCreateInput = {
    id?: string
    tenantId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
    titulo: TituloCobrancaCreateNestedOneWithoutAcoesInput
  }

  export type AcaoCobrancaUncheckedCreateInput = {
    id?: string
    tenantId: string
    tituloId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
  }

  export type AcaoCobrancaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    titulo?: TituloCobrancaUpdateOneRequiredWithoutAcoesNestedInput
  }

  export type AcaoCobrancaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tituloId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcaoCobrancaCreateManyInput = {
    id?: string
    tenantId: string
    tituloId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
  }

  export type AcaoCobrancaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcaoCobrancaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tituloId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcordoCobrancaCreateInput = {
    id?: string
    tenantId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    titulo: TituloCobrancaCreateNestedOneWithoutAcordosInput
    parcelas?: ParcelaAcordoCreateNestedManyWithoutAcordoInput
  }

  export type AcordoCobrancaUncheckedCreateInput = {
    id?: string
    tenantId: string
    tituloId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    parcelas?: ParcelaAcordoUncheckedCreateNestedManyWithoutAcordoInput
  }

  export type AcordoCobrancaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    titulo?: TituloCobrancaUpdateOneRequiredWithoutAcordosNestedInput
    parcelas?: ParcelaAcordoUpdateManyWithoutAcordoNestedInput
  }

  export type AcordoCobrancaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tituloId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    parcelas?: ParcelaAcordoUncheckedUpdateManyWithoutAcordoNestedInput
  }

  export type AcordoCobrancaCreateManyInput = {
    id?: string
    tenantId: string
    tituloId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type AcordoCobrancaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcordoCobrancaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tituloId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParcelaAcordoCreateInput = {
    id?: string
    tenantId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
    acordo: AcordoCobrancaCreateNestedOneWithoutParcelasInput
  }

  export type ParcelaAcordoUncheckedCreateInput = {
    id?: string
    tenantId: string
    acordoId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
  }

  export type ParcelaAcordoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acordo?: AcordoCobrancaUpdateOneRequiredWithoutParcelasNestedInput
  }

  export type ParcelaAcordoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    acordoId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParcelaAcordoCreateManyInput = {
    id?: string
    tenantId: string
    acordoId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
  }

  export type ParcelaAcordoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParcelaAcordoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    acordoId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConfiguracaoCobrancaCreateInput = {
    id?: string
    tenantId: string
    ativo?: boolean
    webhookN8n?: string | null
    callbackUrl?: string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: Decimal | DecimalJsLike | number | string
    parcelasMaximas?: number
    horarioInicio?: string
    horarioFim?: string
    pausarFimDeSemana?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConfiguracaoCobrancaUncheckedCreateInput = {
    id?: string
    tenantId: string
    ativo?: boolean
    webhookN8n?: string | null
    callbackUrl?: string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: Decimal | DecimalJsLike | number | string
    parcelasMaximas?: number
    horarioInicio?: string
    horarioFim?: string
    pausarFimDeSemana?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConfiguracaoCobrancaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    webhookN8n?: NullableStringFieldUpdateOperationsInput | string | null
    callbackUrl?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFieldUpdateOperationsInput | number
    horarioInicio?: StringFieldUpdateOperationsInput | string
    horarioFim?: StringFieldUpdateOperationsInput | string
    pausarFimDeSemana?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoCobrancaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    webhookN8n?: NullableStringFieldUpdateOperationsInput | string | null
    callbackUrl?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFieldUpdateOperationsInput | number
    horarioInicio?: StringFieldUpdateOperationsInput | string
    horarioFim?: StringFieldUpdateOperationsInput | string
    pausarFimDeSemana?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoCobrancaCreateManyInput = {
    id?: string
    tenantId: string
    ativo?: boolean
    webhookN8n?: string | null
    callbackUrl?: string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: Decimal | DecimalJsLike | number | string
    parcelasMaximas?: number
    horarioInicio?: string
    horarioFim?: string
    pausarFimDeSemana?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConfiguracaoCobrancaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    webhookN8n?: NullableStringFieldUpdateOperationsInput | string | null
    callbackUrl?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFieldUpdateOperationsInput | number
    horarioInicio?: StringFieldUpdateOperationsInput | string
    horarioFim?: StringFieldUpdateOperationsInput | string
    pausarFimDeSemana?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoCobrancaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    webhookN8n?: NullableStringFieldUpdateOperationsInput | string | null
    callbackUrl?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    descontoMaximo?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelasMaximas?: IntFieldUpdateOperationsInput | number
    horarioInicio?: StringFieldUpdateOperationsInput | string
    horarioFim?: StringFieldUpdateOperationsInput | string
    pausarFimDeSemana?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumTipoContaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoConta | EnumTipoContaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoContaFilter<$PrismaModel> | $Enums.TipoConta
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LancamentoListRelationFilter = {
    every?: LancamentoWhereInput
    some?: LancamentoWhereInput
    none?: LancamentoWhereInput
  }

  export type RecorrenciaListRelationFilter = {
    every?: RecorrenciaWhereInput
    some?: RecorrenciaWhereInput
    none?: RecorrenciaWhereInput
  }

  export type ConciliacaoBancariaListRelationFilter = {
    every?: ConciliacaoBancariaWhereInput
    some?: ConciliacaoBancariaWhereInput
    none?: ConciliacaoBancariaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LancamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RecorrenciaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConciliacaoBancariaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContaFinanceiraCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    banco?: SortOrder
    agencia?: SortOrder
    conta?: SortOrder
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
    ativa?: SortOrder
    cor?: SortOrder
    icone?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ContaFinanceiraAvgOrderByAggregateInput = {
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
  }

  export type ContaFinanceiraMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    banco?: SortOrder
    agencia?: SortOrder
    conta?: SortOrder
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
    ativa?: SortOrder
    cor?: SortOrder
    icone?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ContaFinanceiraMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    banco?: SortOrder
    agencia?: SortOrder
    conta?: SortOrder
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
    ativa?: SortOrder
    cor?: SortOrder
    icone?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ContaFinanceiraSumOrderByAggregateInput = {
    saldoAtual?: SortOrder
    saldoInicial?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumTipoContaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoConta | EnumTipoContaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoContaWithAggregatesFilter<$PrismaModel> | $Enums.TipoConta
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoContaFilter<$PrismaModel>
    _max?: NestedEnumTipoContaFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type EnumTipoLancamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoLancamento | EnumTipoLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoLancamentoFilter<$PrismaModel> | $Enums.TipoLancamento
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumStatusLancamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLancamento | EnumStatusLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusLancamentoFilter<$PrismaModel> | $Enums.StatusLancamento
  }

  export type EnumFormaPagamentoNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.FormaPagamento | EnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    in?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel> | $Enums.FormaPagamento | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ContaFinanceiraNullableRelationFilter = {
    is?: ContaFinanceiraWhereInput | null
    isNot?: ContaFinanceiraWhereInput | null
  }

  export type RecorrenciaNullableRelationFilter = {
    is?: RecorrenciaWhereInput | null
    isNot?: RecorrenciaWhereInput | null
  }

  export type LancamentoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    usuarioId?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    subcategoria?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    dataPagamento?: SortOrder
    dataCompetencia?: SortOrder
    status?: SortOrder
    formaPagamento?: SortOrder
    numeroParcela?: SortOrder
    totalParcelas?: SortOrder
    parcelaOrigemId?: SortOrder
    pedidoId?: SortOrder
    notaFiscalId?: SortOrder
    fornecedor?: SortOrder
    cliente?: SortOrder
    observacao?: SortOrder
    tags?: SortOrder
    recorrente?: SortOrder
    recorrenciaId?: SortOrder
    anexoUrl?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    contaOrigemId?: SortOrder
    contaDestinoId?: SortOrder
  }

  export type LancamentoAvgOrderByAggregateInput = {
    valor?: SortOrder
    numeroParcela?: SortOrder
    totalParcelas?: SortOrder
  }

  export type LancamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    usuarioId?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    subcategoria?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    dataPagamento?: SortOrder
    dataCompetencia?: SortOrder
    status?: SortOrder
    formaPagamento?: SortOrder
    numeroParcela?: SortOrder
    totalParcelas?: SortOrder
    parcelaOrigemId?: SortOrder
    pedidoId?: SortOrder
    notaFiscalId?: SortOrder
    fornecedor?: SortOrder
    cliente?: SortOrder
    observacao?: SortOrder
    recorrente?: SortOrder
    recorrenciaId?: SortOrder
    anexoUrl?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    contaOrigemId?: SortOrder
    contaDestinoId?: SortOrder
  }

  export type LancamentoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    usuarioId?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    subcategoria?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    dataPagamento?: SortOrder
    dataCompetencia?: SortOrder
    status?: SortOrder
    formaPagamento?: SortOrder
    numeroParcela?: SortOrder
    totalParcelas?: SortOrder
    parcelaOrigemId?: SortOrder
    pedidoId?: SortOrder
    notaFiscalId?: SortOrder
    fornecedor?: SortOrder
    cliente?: SortOrder
    observacao?: SortOrder
    recorrente?: SortOrder
    recorrenciaId?: SortOrder
    anexoUrl?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    contaOrigemId?: SortOrder
    contaDestinoId?: SortOrder
  }

  export type LancamentoSumOrderByAggregateInput = {
    valor?: SortOrder
    numeroParcela?: SortOrder
    totalParcelas?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTipoLancamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoLancamento | EnumTipoLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoLancamentoWithAggregatesFilter<$PrismaModel> | $Enums.TipoLancamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoLancamentoFilter<$PrismaModel>
    _max?: NestedEnumTipoLancamentoFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumStatusLancamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLancamento | EnumStatusLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusLancamentoWithAggregatesFilter<$PrismaModel> | $Enums.StatusLancamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusLancamentoFilter<$PrismaModel>
    _max?: NestedEnumStatusLancamentoFilter<$PrismaModel>
  }

  export type EnumFormaPagamentoNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormaPagamento | EnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    in?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFormaPagamentoNullableWithAggregatesFilter<$PrismaModel> | $Enums.FormaPagamento | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel>
    _max?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumTipoCategoriaFinanceiraFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCategoriaFinanceira | EnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel> | $Enums.TipoCategoriaFinanceira
  }

  export type CategoriaFinanceiraNullableRelationFilter = {
    is?: CategoriaFinanceiraWhereInput | null
    isNot?: CategoriaFinanceiraWhereInput | null
  }

  export type CategoriaFinanceiraListRelationFilter = {
    every?: CategoriaFinanceiraWhereInput
    some?: CategoriaFinanceiraWhereInput
    none?: CategoriaFinanceiraWhereInput
  }

  export type CategoriaFinanceiraOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoriaFinanceiraCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    icone?: SortOrder
    cor?: SortOrder
    paiId?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type CategoriaFinanceiraMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    icone?: SortOrder
    cor?: SortOrder
    paiId?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type CategoriaFinanceiraMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    icone?: SortOrder
    cor?: SortOrder
    paiId?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type EnumTipoCategoriaFinanceiraWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCategoriaFinanceira | EnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoCategoriaFinanceiraWithAggregatesFilter<$PrismaModel> | $Enums.TipoCategoriaFinanceira
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel>
    _max?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel>
  }

  export type EnumFrequenciaRecorrenciaFilter<$PrismaModel = never> = {
    equals?: $Enums.FrequenciaRecorrencia | EnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    notIn?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    not?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel> | $Enums.FrequenciaRecorrencia
  }

  export type RecorrenciaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    descricao?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    valor?: SortOrder
    frequencia?: SortOrder
    diaVencimento?: SortOrder
    proximaGeracao?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type RecorrenciaAvgOrderByAggregateInput = {
    valor?: SortOrder
    diaVencimento?: SortOrder
  }

  export type RecorrenciaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    descricao?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    valor?: SortOrder
    frequencia?: SortOrder
    diaVencimento?: SortOrder
    proximaGeracao?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type RecorrenciaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    descricao?: SortOrder
    tipo?: SortOrder
    categoria?: SortOrder
    valor?: SortOrder
    frequencia?: SortOrder
    diaVencimento?: SortOrder
    proximaGeracao?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type RecorrenciaSumOrderByAggregateInput = {
    valor?: SortOrder
    diaVencimento?: SortOrder
  }

  export type EnumFrequenciaRecorrenciaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FrequenciaRecorrencia | EnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    notIn?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    not?: NestedEnumFrequenciaRecorrenciaWithAggregatesFilter<$PrismaModel> | $Enums.FrequenciaRecorrencia
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel>
    _max?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel>
  }

  export type EnumStatusConciliacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusConciliacao | EnumStatusConciliacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusConciliacaoFilter<$PrismaModel> | $Enums.StatusConciliacao
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ContaFinanceiraRelationFilter = {
    is?: ContaFinanceiraWhereInput
    isNot?: ContaFinanceiraWhereInput
  }

  export type ConciliacaoBancariaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
    status?: SortOrder
    divergencias?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConciliacaoBancariaAvgOrderByAggregateInput = {
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
  }

  export type ConciliacaoBancariaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConciliacaoBancariaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    contaId?: SortOrder
    dataInicio?: SortOrder
    dataFim?: SortOrder
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConciliacaoBancariaSumOrderByAggregateInput = {
    saldoInicial?: SortOrder
    saldoFinal?: SortOrder
  }

  export type EnumStatusConciliacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusConciliacao | EnumStatusConciliacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusConciliacaoWithAggregatesFilter<$PrismaModel> | $Enums.StatusConciliacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusConciliacaoFilter<$PrismaModel>
    _max?: NestedEnumStatusConciliacaoFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EventoProcessadoEvento_referenciaIdCompoundUniqueInput = {
    evento: string
    referenciaId: string
  }

  export type EventoProcessadoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    evento?: SortOrder
    referenciaId?: SortOrder
    processadoEm?: SortOrder
  }

  export type EventoProcessadoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    evento?: SortOrder
    referenciaId?: SortOrder
    processadoEm?: SortOrder
  }

  export type EventoProcessadoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    evento?: SortOrder
    referenciaId?: SortOrder
    processadoEm?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DRETenantId_ano_mesCompoundUniqueInput = {
    tenantId: string
    ano: number
    mes: number
  }

  export type DRECountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    periodo?: SortOrder
    ano?: SortOrder
    mes?: SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
    criadoEm?: SortOrder
  }

  export type DREAvgOrderByAggregateInput = {
    ano?: SortOrder
    mes?: SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
  }

  export type DREMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    periodo?: SortOrder
    ano?: SortOrder
    mes?: SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
    criadoEm?: SortOrder
  }

  export type DREMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    periodo?: SortOrder
    ano?: SortOrder
    mes?: SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
    criadoEm?: SortOrder
  }

  export type DRESumOrderByAggregateInput = {
    ano?: SortOrder
    mes?: SortOrder
    receitaBruta?: SortOrder
    deducoes?: SortOrder
    receitaLiquida?: SortOrder
    custosMercadorias?: SortOrder
    lucroBruto?: SortOrder
    despesasOperacionais?: SortOrder
    despesasAdministrativas?: SortOrder
    despesasComerciais?: SortOrder
    resultadoOperacional?: SortOrder
    despesasFinanceiras?: SortOrder
    receitasFinanceiras?: SortOrder
    lucroLiquido?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumStatusTituloCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTituloCobranca | EnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel> | $Enums.StatusTituloCobranca
  }

  export type EnumPrioridadeCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.PrioridadeCobranca | EnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel> | $Enums.PrioridadeCobranca
  }

  export type AcaoCobrancaListRelationFilter = {
    every?: AcaoCobrancaWhereInput
    some?: AcaoCobrancaWhereInput
    none?: AcaoCobrancaWhereInput
  }

  export type AcordoCobrancaListRelationFilter = {
    every?: AcordoCobrancaWhereInput
    some?: AcordoCobrancaWhereInput
    none?: AcordoCobrancaWhereInput
  }

  export type AcaoCobrancaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AcordoCobrancaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TituloCobrancaTenantIdLancamentoIdCompoundUniqueInput = {
    tenantId: string
    lancamentoId: string
  }

  export type TituloCobrancaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    lancamentoId?: SortOrder
    pedidoId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteTelefone?: SortOrder
    clienteEmail?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    status?: SortOrder
    prioridade?: SortOrder
    tentativas?: SortOrder
    ultimaAcaoEm?: SortOrder
    canalUltimaAcao?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type TituloCobrancaAvgOrderByAggregateInput = {
    valor?: SortOrder
    tentativas?: SortOrder
  }

  export type TituloCobrancaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    lancamentoId?: SortOrder
    pedidoId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteTelefone?: SortOrder
    clienteEmail?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    status?: SortOrder
    prioridade?: SortOrder
    tentativas?: SortOrder
    ultimaAcaoEm?: SortOrder
    canalUltimaAcao?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type TituloCobrancaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    lancamentoId?: SortOrder
    pedidoId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteTelefone?: SortOrder
    clienteEmail?: SortOrder
    descricao?: SortOrder
    valor?: SortOrder
    dataVencimento?: SortOrder
    status?: SortOrder
    prioridade?: SortOrder
    tentativas?: SortOrder
    ultimaAcaoEm?: SortOrder
    canalUltimaAcao?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type TituloCobrancaSumOrderByAggregateInput = {
    valor?: SortOrder
    tentativas?: SortOrder
  }

  export type EnumStatusTituloCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTituloCobranca | EnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTituloCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusTituloCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel>
  }

  export type EnumPrioridadeCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrioridadeCobranca | EnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumPrioridadeCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.PrioridadeCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel>
    _max?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel>
  }

  export type EnumTipoAcaoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAcaoCobranca | EnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel> | $Enums.TipoAcaoCobranca
  }

  export type EnumStatusAcaoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcaoCobranca | EnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel> | $Enums.StatusAcaoCobranca
  }

  export type TituloCobrancaRelationFilter = {
    is?: TituloCobrancaWhereInput
    isNot?: TituloCobrancaWhereInput
  }

  export type AcaoCobrancaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteNome?: SortOrder
    tipo?: SortOrder
    mensagem?: SortOrder
    status?: SortOrder
    automatica?: SortOrder
    detalhe?: SortOrder
    criadoEm?: SortOrder
  }

  export type AcaoCobrancaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteNome?: SortOrder
    tipo?: SortOrder
    mensagem?: SortOrder
    status?: SortOrder
    automatica?: SortOrder
    detalhe?: SortOrder
    criadoEm?: SortOrder
  }

  export type AcaoCobrancaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteNome?: SortOrder
    tipo?: SortOrder
    mensagem?: SortOrder
    status?: SortOrder
    automatica?: SortOrder
    detalhe?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnumTipoAcaoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAcaoCobranca | EnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAcaoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.TipoAcaoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel>
  }

  export type EnumStatusAcaoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcaoCobranca | EnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcaoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusAcaoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel>
  }

  export type EnumStatusAcordoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcordoCobranca | EnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel> | $Enums.StatusAcordoCobranca
  }

  export type ParcelaAcordoListRelationFilter = {
    every?: ParcelaAcordoWhereInput
    some?: ParcelaAcordoWhereInput
    none?: ParcelaAcordoWhereInput
  }

  export type ParcelaAcordoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AcordoCobrancaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type AcordoCobrancaAvgOrderByAggregateInput = {
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
  }

  export type AcordoCobrancaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type AcordoCobrancaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tituloId?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
    status?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type AcordoCobrancaSumOrderByAggregateInput = {
    valorOriginal?: SortOrder
    descontoAplicado?: SortOrder
    valorFinal?: SortOrder
    numeroParcelas?: SortOrder
  }

  export type EnumStatusAcordoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcordoCobranca | EnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcordoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusAcordoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel>
  }

  export type AcordoCobrancaRelationFilter = {
    is?: AcordoCobrancaWhereInput
    isNot?: AcordoCobrancaWhereInput
  }

  export type ParcelaAcordoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    acordoId?: SortOrder
    numero?: SortOrder
    valor?: SortOrder
    vencimento?: SortOrder
    pago?: SortOrder
    pagoEm?: SortOrder
  }

  export type ParcelaAcordoAvgOrderByAggregateInput = {
    numero?: SortOrder
    valor?: SortOrder
  }

  export type ParcelaAcordoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    acordoId?: SortOrder
    numero?: SortOrder
    valor?: SortOrder
    vencimento?: SortOrder
    pago?: SortOrder
    pagoEm?: SortOrder
  }

  export type ParcelaAcordoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    acordoId?: SortOrder
    numero?: SortOrder
    valor?: SortOrder
    vencimento?: SortOrder
    pago?: SortOrder
    pagoEm?: SortOrder
  }

  export type ParcelaAcordoSumOrderByAggregateInput = {
    numero?: SortOrder
    valor?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ConfiguracaoCobrancaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ativo?: SortOrder
    webhookN8n?: SortOrder
    callbackUrl?: SortOrder
    regras?: SortOrder
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
    horarioInicio?: SortOrder
    horarioFim?: SortOrder
    pausarFimDeSemana?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConfiguracaoCobrancaAvgOrderByAggregateInput = {
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
  }

  export type ConfiguracaoCobrancaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ativo?: SortOrder
    webhookN8n?: SortOrder
    callbackUrl?: SortOrder
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
    horarioInicio?: SortOrder
    horarioFim?: SortOrder
    pausarFimDeSemana?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConfiguracaoCobrancaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ativo?: SortOrder
    webhookN8n?: SortOrder
    callbackUrl?: SortOrder
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
    horarioInicio?: SortOrder
    horarioFim?: SortOrder
    pausarFimDeSemana?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ConfiguracaoCobrancaSumOrderByAggregateInput = {
    descontoMaximo?: SortOrder
    parcelasMaximas?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type LancamentoCreateNestedManyWithoutContaInput = {
    create?: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput> | LancamentoCreateWithoutContaInput[] | LancamentoUncheckedCreateWithoutContaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaInput | LancamentoCreateOrConnectWithoutContaInput[]
    createMany?: LancamentoCreateManyContaInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type LancamentoCreateNestedManyWithoutContaOrigemInput = {
    create?: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput> | LancamentoCreateWithoutContaOrigemInput[] | LancamentoUncheckedCreateWithoutContaOrigemInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaOrigemInput | LancamentoCreateOrConnectWithoutContaOrigemInput[]
    createMany?: LancamentoCreateManyContaOrigemInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type LancamentoCreateNestedManyWithoutContaDestinoInput = {
    create?: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput> | LancamentoCreateWithoutContaDestinoInput[] | LancamentoUncheckedCreateWithoutContaDestinoInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaDestinoInput | LancamentoCreateOrConnectWithoutContaDestinoInput[]
    createMany?: LancamentoCreateManyContaDestinoInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type RecorrenciaCreateNestedManyWithoutContaInput = {
    create?: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput> | RecorrenciaCreateWithoutContaInput[] | RecorrenciaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutContaInput | RecorrenciaCreateOrConnectWithoutContaInput[]
    createMany?: RecorrenciaCreateManyContaInputEnvelope
    connect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
  }

  export type ConciliacaoBancariaCreateNestedManyWithoutContaInput = {
    create?: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput> | ConciliacaoBancariaCreateWithoutContaInput[] | ConciliacaoBancariaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: ConciliacaoBancariaCreateOrConnectWithoutContaInput | ConciliacaoBancariaCreateOrConnectWithoutContaInput[]
    createMany?: ConciliacaoBancariaCreateManyContaInputEnvelope
    connect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
  }

  export type LancamentoUncheckedCreateNestedManyWithoutContaInput = {
    create?: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput> | LancamentoCreateWithoutContaInput[] | LancamentoUncheckedCreateWithoutContaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaInput | LancamentoCreateOrConnectWithoutContaInput[]
    createMany?: LancamentoCreateManyContaInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput = {
    create?: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput> | LancamentoCreateWithoutContaOrigemInput[] | LancamentoUncheckedCreateWithoutContaOrigemInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaOrigemInput | LancamentoCreateOrConnectWithoutContaOrigemInput[]
    createMany?: LancamentoCreateManyContaOrigemInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput = {
    create?: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput> | LancamentoCreateWithoutContaDestinoInput[] | LancamentoUncheckedCreateWithoutContaDestinoInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaDestinoInput | LancamentoCreateOrConnectWithoutContaDestinoInput[]
    createMany?: LancamentoCreateManyContaDestinoInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type RecorrenciaUncheckedCreateNestedManyWithoutContaInput = {
    create?: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput> | RecorrenciaCreateWithoutContaInput[] | RecorrenciaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutContaInput | RecorrenciaCreateOrConnectWithoutContaInput[]
    createMany?: RecorrenciaCreateManyContaInputEnvelope
    connect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
  }

  export type ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput = {
    create?: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput> | ConciliacaoBancariaCreateWithoutContaInput[] | ConciliacaoBancariaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: ConciliacaoBancariaCreateOrConnectWithoutContaInput | ConciliacaoBancariaCreateOrConnectWithoutContaInput[]
    createMany?: ConciliacaoBancariaCreateManyContaInputEnvelope
    connect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumTipoContaFieldUpdateOperationsInput = {
    set?: $Enums.TipoConta
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LancamentoUpdateManyWithoutContaNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput> | LancamentoCreateWithoutContaInput[] | LancamentoUncheckedCreateWithoutContaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaInput | LancamentoCreateOrConnectWithoutContaInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaInput | LancamentoUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: LancamentoCreateManyContaInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaInput | LancamentoUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaInput | LancamentoUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type LancamentoUpdateManyWithoutContaOrigemNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput> | LancamentoCreateWithoutContaOrigemInput[] | LancamentoUncheckedCreateWithoutContaOrigemInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaOrigemInput | LancamentoCreateOrConnectWithoutContaOrigemInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaOrigemInput | LancamentoUpsertWithWhereUniqueWithoutContaOrigemInput[]
    createMany?: LancamentoCreateManyContaOrigemInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaOrigemInput | LancamentoUpdateWithWhereUniqueWithoutContaOrigemInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaOrigemInput | LancamentoUpdateManyWithWhereWithoutContaOrigemInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type LancamentoUpdateManyWithoutContaDestinoNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput> | LancamentoCreateWithoutContaDestinoInput[] | LancamentoUncheckedCreateWithoutContaDestinoInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaDestinoInput | LancamentoCreateOrConnectWithoutContaDestinoInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaDestinoInput | LancamentoUpsertWithWhereUniqueWithoutContaDestinoInput[]
    createMany?: LancamentoCreateManyContaDestinoInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaDestinoInput | LancamentoUpdateWithWhereUniqueWithoutContaDestinoInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaDestinoInput | LancamentoUpdateManyWithWhereWithoutContaDestinoInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type RecorrenciaUpdateManyWithoutContaNestedInput = {
    create?: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput> | RecorrenciaCreateWithoutContaInput[] | RecorrenciaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutContaInput | RecorrenciaCreateOrConnectWithoutContaInput[]
    upsert?: RecorrenciaUpsertWithWhereUniqueWithoutContaInput | RecorrenciaUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: RecorrenciaCreateManyContaInputEnvelope
    set?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    disconnect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    delete?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    connect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    update?: RecorrenciaUpdateWithWhereUniqueWithoutContaInput | RecorrenciaUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: RecorrenciaUpdateManyWithWhereWithoutContaInput | RecorrenciaUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: RecorrenciaScalarWhereInput | RecorrenciaScalarWhereInput[]
  }

  export type ConciliacaoBancariaUpdateManyWithoutContaNestedInput = {
    create?: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput> | ConciliacaoBancariaCreateWithoutContaInput[] | ConciliacaoBancariaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: ConciliacaoBancariaCreateOrConnectWithoutContaInput | ConciliacaoBancariaCreateOrConnectWithoutContaInput[]
    upsert?: ConciliacaoBancariaUpsertWithWhereUniqueWithoutContaInput | ConciliacaoBancariaUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: ConciliacaoBancariaCreateManyContaInputEnvelope
    set?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    disconnect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    delete?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    connect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    update?: ConciliacaoBancariaUpdateWithWhereUniqueWithoutContaInput | ConciliacaoBancariaUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: ConciliacaoBancariaUpdateManyWithWhereWithoutContaInput | ConciliacaoBancariaUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: ConciliacaoBancariaScalarWhereInput | ConciliacaoBancariaScalarWhereInput[]
  }

  export type LancamentoUncheckedUpdateManyWithoutContaNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput> | LancamentoCreateWithoutContaInput[] | LancamentoUncheckedCreateWithoutContaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaInput | LancamentoCreateOrConnectWithoutContaInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaInput | LancamentoUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: LancamentoCreateManyContaInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaInput | LancamentoUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaInput | LancamentoUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput> | LancamentoCreateWithoutContaOrigemInput[] | LancamentoUncheckedCreateWithoutContaOrigemInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaOrigemInput | LancamentoCreateOrConnectWithoutContaOrigemInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaOrigemInput | LancamentoUpsertWithWhereUniqueWithoutContaOrigemInput[]
    createMany?: LancamentoCreateManyContaOrigemInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaOrigemInput | LancamentoUpdateWithWhereUniqueWithoutContaOrigemInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaOrigemInput | LancamentoUpdateManyWithWhereWithoutContaOrigemInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput = {
    create?: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput> | LancamentoCreateWithoutContaDestinoInput[] | LancamentoUncheckedCreateWithoutContaDestinoInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutContaDestinoInput | LancamentoCreateOrConnectWithoutContaDestinoInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutContaDestinoInput | LancamentoUpsertWithWhereUniqueWithoutContaDestinoInput[]
    createMany?: LancamentoCreateManyContaDestinoInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutContaDestinoInput | LancamentoUpdateWithWhereUniqueWithoutContaDestinoInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutContaDestinoInput | LancamentoUpdateManyWithWhereWithoutContaDestinoInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type RecorrenciaUncheckedUpdateManyWithoutContaNestedInput = {
    create?: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput> | RecorrenciaCreateWithoutContaInput[] | RecorrenciaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutContaInput | RecorrenciaCreateOrConnectWithoutContaInput[]
    upsert?: RecorrenciaUpsertWithWhereUniqueWithoutContaInput | RecorrenciaUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: RecorrenciaCreateManyContaInputEnvelope
    set?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    disconnect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    delete?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    connect?: RecorrenciaWhereUniqueInput | RecorrenciaWhereUniqueInput[]
    update?: RecorrenciaUpdateWithWhereUniqueWithoutContaInput | RecorrenciaUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: RecorrenciaUpdateManyWithWhereWithoutContaInput | RecorrenciaUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: RecorrenciaScalarWhereInput | RecorrenciaScalarWhereInput[]
  }

  export type ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput = {
    create?: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput> | ConciliacaoBancariaCreateWithoutContaInput[] | ConciliacaoBancariaUncheckedCreateWithoutContaInput[]
    connectOrCreate?: ConciliacaoBancariaCreateOrConnectWithoutContaInput | ConciliacaoBancariaCreateOrConnectWithoutContaInput[]
    upsert?: ConciliacaoBancariaUpsertWithWhereUniqueWithoutContaInput | ConciliacaoBancariaUpsertWithWhereUniqueWithoutContaInput[]
    createMany?: ConciliacaoBancariaCreateManyContaInputEnvelope
    set?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    disconnect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    delete?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    connect?: ConciliacaoBancariaWhereUniqueInput | ConciliacaoBancariaWhereUniqueInput[]
    update?: ConciliacaoBancariaUpdateWithWhereUniqueWithoutContaInput | ConciliacaoBancariaUpdateWithWhereUniqueWithoutContaInput[]
    updateMany?: ConciliacaoBancariaUpdateManyWithWhereWithoutContaInput | ConciliacaoBancariaUpdateManyWithWhereWithoutContaInput[]
    deleteMany?: ConciliacaoBancariaScalarWhereInput | ConciliacaoBancariaScalarWhereInput[]
  }

  export type LancamentoCreatetagsInput = {
    set: string[]
  }

  export type ContaFinanceiraCreateNestedOneWithoutLancamentosInput = {
    create?: XOR<ContaFinanceiraCreateWithoutLancamentosInput, ContaFinanceiraUncheckedCreateWithoutLancamentosInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutLancamentosInput
    connect?: ContaFinanceiraWhereUniqueInput
  }

  export type RecorrenciaCreateNestedOneWithoutLancamentosInput = {
    create?: XOR<RecorrenciaCreateWithoutLancamentosInput, RecorrenciaUncheckedCreateWithoutLancamentosInput>
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutLancamentosInput
    connect?: RecorrenciaWhereUniqueInput
  }

  export type ContaFinanceiraCreateNestedOneWithoutTransferenciasOrigemInput = {
    create?: XOR<ContaFinanceiraCreateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasOrigemInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutTransferenciasOrigemInput
    connect?: ContaFinanceiraWhereUniqueInput
  }

  export type ContaFinanceiraCreateNestedOneWithoutTransferenciasDestinoInput = {
    create?: XOR<ContaFinanceiraCreateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasDestinoInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutTransferenciasDestinoInput
    connect?: ContaFinanceiraWhereUniqueInput
  }

  export type EnumTipoLancamentoFieldUpdateOperationsInput = {
    set?: $Enums.TipoLancamento
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumStatusLancamentoFieldUpdateOperationsInput = {
    set?: $Enums.StatusLancamento
  }

  export type NullableEnumFormaPagamentoFieldUpdateOperationsInput = {
    set?: $Enums.FormaPagamento | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LancamentoUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ContaFinanceiraUpdateOneWithoutLancamentosNestedInput = {
    create?: XOR<ContaFinanceiraCreateWithoutLancamentosInput, ContaFinanceiraUncheckedCreateWithoutLancamentosInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutLancamentosInput
    upsert?: ContaFinanceiraUpsertWithoutLancamentosInput
    disconnect?: ContaFinanceiraWhereInput | boolean
    delete?: ContaFinanceiraWhereInput | boolean
    connect?: ContaFinanceiraWhereUniqueInput
    update?: XOR<XOR<ContaFinanceiraUpdateToOneWithWhereWithoutLancamentosInput, ContaFinanceiraUpdateWithoutLancamentosInput>, ContaFinanceiraUncheckedUpdateWithoutLancamentosInput>
  }

  export type RecorrenciaUpdateOneWithoutLancamentosNestedInput = {
    create?: XOR<RecorrenciaCreateWithoutLancamentosInput, RecorrenciaUncheckedCreateWithoutLancamentosInput>
    connectOrCreate?: RecorrenciaCreateOrConnectWithoutLancamentosInput
    upsert?: RecorrenciaUpsertWithoutLancamentosInput
    disconnect?: RecorrenciaWhereInput | boolean
    delete?: RecorrenciaWhereInput | boolean
    connect?: RecorrenciaWhereUniqueInput
    update?: XOR<XOR<RecorrenciaUpdateToOneWithWhereWithoutLancamentosInput, RecorrenciaUpdateWithoutLancamentosInput>, RecorrenciaUncheckedUpdateWithoutLancamentosInput>
  }

  export type ContaFinanceiraUpdateOneWithoutTransferenciasOrigemNestedInput = {
    create?: XOR<ContaFinanceiraCreateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasOrigemInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutTransferenciasOrigemInput
    upsert?: ContaFinanceiraUpsertWithoutTransferenciasOrigemInput
    disconnect?: ContaFinanceiraWhereInput | boolean
    delete?: ContaFinanceiraWhereInput | boolean
    connect?: ContaFinanceiraWhereUniqueInput
    update?: XOR<XOR<ContaFinanceiraUpdateToOneWithWhereWithoutTransferenciasOrigemInput, ContaFinanceiraUpdateWithoutTransferenciasOrigemInput>, ContaFinanceiraUncheckedUpdateWithoutTransferenciasOrigemInput>
  }

  export type ContaFinanceiraUpdateOneWithoutTransferenciasDestinoNestedInput = {
    create?: XOR<ContaFinanceiraCreateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasDestinoInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutTransferenciasDestinoInput
    upsert?: ContaFinanceiraUpsertWithoutTransferenciasDestinoInput
    disconnect?: ContaFinanceiraWhereInput | boolean
    delete?: ContaFinanceiraWhereInput | boolean
    connect?: ContaFinanceiraWhereUniqueInput
    update?: XOR<XOR<ContaFinanceiraUpdateToOneWithWhereWithoutTransferenciasDestinoInput, ContaFinanceiraUpdateWithoutTransferenciasDestinoInput>, ContaFinanceiraUncheckedUpdateWithoutTransferenciasDestinoInput>
  }

  export type CategoriaFinanceiraCreateNestedOneWithoutFilhosInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutFilhosInput, CategoriaFinanceiraUncheckedCreateWithoutFilhosInput>
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutFilhosInput
    connect?: CategoriaFinanceiraWhereUniqueInput
  }

  export type CategoriaFinanceiraCreateNestedManyWithoutPaiInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput> | CategoriaFinanceiraCreateWithoutPaiInput[] | CategoriaFinanceiraUncheckedCreateWithoutPaiInput[]
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutPaiInput | CategoriaFinanceiraCreateOrConnectWithoutPaiInput[]
    createMany?: CategoriaFinanceiraCreateManyPaiInputEnvelope
    connect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
  }

  export type CategoriaFinanceiraUncheckedCreateNestedManyWithoutPaiInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput> | CategoriaFinanceiraCreateWithoutPaiInput[] | CategoriaFinanceiraUncheckedCreateWithoutPaiInput[]
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutPaiInput | CategoriaFinanceiraCreateOrConnectWithoutPaiInput[]
    createMany?: CategoriaFinanceiraCreateManyPaiInputEnvelope
    connect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
  }

  export type EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput = {
    set?: $Enums.TipoCategoriaFinanceira
  }

  export type CategoriaFinanceiraUpdateOneWithoutFilhosNestedInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutFilhosInput, CategoriaFinanceiraUncheckedCreateWithoutFilhosInput>
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutFilhosInput
    upsert?: CategoriaFinanceiraUpsertWithoutFilhosInput
    disconnect?: CategoriaFinanceiraWhereInput | boolean
    delete?: CategoriaFinanceiraWhereInput | boolean
    connect?: CategoriaFinanceiraWhereUniqueInput
    update?: XOR<XOR<CategoriaFinanceiraUpdateToOneWithWhereWithoutFilhosInput, CategoriaFinanceiraUpdateWithoutFilhosInput>, CategoriaFinanceiraUncheckedUpdateWithoutFilhosInput>
  }

  export type CategoriaFinanceiraUpdateManyWithoutPaiNestedInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput> | CategoriaFinanceiraCreateWithoutPaiInput[] | CategoriaFinanceiraUncheckedCreateWithoutPaiInput[]
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutPaiInput | CategoriaFinanceiraCreateOrConnectWithoutPaiInput[]
    upsert?: CategoriaFinanceiraUpsertWithWhereUniqueWithoutPaiInput | CategoriaFinanceiraUpsertWithWhereUniqueWithoutPaiInput[]
    createMany?: CategoriaFinanceiraCreateManyPaiInputEnvelope
    set?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    disconnect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    delete?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    connect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    update?: CategoriaFinanceiraUpdateWithWhereUniqueWithoutPaiInput | CategoriaFinanceiraUpdateWithWhereUniqueWithoutPaiInput[]
    updateMany?: CategoriaFinanceiraUpdateManyWithWhereWithoutPaiInput | CategoriaFinanceiraUpdateManyWithWhereWithoutPaiInput[]
    deleteMany?: CategoriaFinanceiraScalarWhereInput | CategoriaFinanceiraScalarWhereInput[]
  }

  export type CategoriaFinanceiraUncheckedUpdateManyWithoutPaiNestedInput = {
    create?: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput> | CategoriaFinanceiraCreateWithoutPaiInput[] | CategoriaFinanceiraUncheckedCreateWithoutPaiInput[]
    connectOrCreate?: CategoriaFinanceiraCreateOrConnectWithoutPaiInput | CategoriaFinanceiraCreateOrConnectWithoutPaiInput[]
    upsert?: CategoriaFinanceiraUpsertWithWhereUniqueWithoutPaiInput | CategoriaFinanceiraUpsertWithWhereUniqueWithoutPaiInput[]
    createMany?: CategoriaFinanceiraCreateManyPaiInputEnvelope
    set?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    disconnect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    delete?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    connect?: CategoriaFinanceiraWhereUniqueInput | CategoriaFinanceiraWhereUniqueInput[]
    update?: CategoriaFinanceiraUpdateWithWhereUniqueWithoutPaiInput | CategoriaFinanceiraUpdateWithWhereUniqueWithoutPaiInput[]
    updateMany?: CategoriaFinanceiraUpdateManyWithWhereWithoutPaiInput | CategoriaFinanceiraUpdateManyWithWhereWithoutPaiInput[]
    deleteMany?: CategoriaFinanceiraScalarWhereInput | CategoriaFinanceiraScalarWhereInput[]
  }

  export type ContaFinanceiraCreateNestedOneWithoutRecorrenciasInput = {
    create?: XOR<ContaFinanceiraCreateWithoutRecorrenciasInput, ContaFinanceiraUncheckedCreateWithoutRecorrenciasInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutRecorrenciasInput
    connect?: ContaFinanceiraWhereUniqueInput
  }

  export type LancamentoCreateNestedManyWithoutRecorrenciaInput = {
    create?: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput> | LancamentoCreateWithoutRecorrenciaInput[] | LancamentoUncheckedCreateWithoutRecorrenciaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutRecorrenciaInput | LancamentoCreateOrConnectWithoutRecorrenciaInput[]
    createMany?: LancamentoCreateManyRecorrenciaInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type LancamentoUncheckedCreateNestedManyWithoutRecorrenciaInput = {
    create?: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput> | LancamentoCreateWithoutRecorrenciaInput[] | LancamentoUncheckedCreateWithoutRecorrenciaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutRecorrenciaInput | LancamentoCreateOrConnectWithoutRecorrenciaInput[]
    createMany?: LancamentoCreateManyRecorrenciaInputEnvelope
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
  }

  export type EnumFrequenciaRecorrenciaFieldUpdateOperationsInput = {
    set?: $Enums.FrequenciaRecorrencia
  }

  export type ContaFinanceiraUpdateOneWithoutRecorrenciasNestedInput = {
    create?: XOR<ContaFinanceiraCreateWithoutRecorrenciasInput, ContaFinanceiraUncheckedCreateWithoutRecorrenciasInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutRecorrenciasInput
    upsert?: ContaFinanceiraUpsertWithoutRecorrenciasInput
    disconnect?: ContaFinanceiraWhereInput | boolean
    delete?: ContaFinanceiraWhereInput | boolean
    connect?: ContaFinanceiraWhereUniqueInput
    update?: XOR<XOR<ContaFinanceiraUpdateToOneWithWhereWithoutRecorrenciasInput, ContaFinanceiraUpdateWithoutRecorrenciasInput>, ContaFinanceiraUncheckedUpdateWithoutRecorrenciasInput>
  }

  export type LancamentoUpdateManyWithoutRecorrenciaNestedInput = {
    create?: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput> | LancamentoCreateWithoutRecorrenciaInput[] | LancamentoUncheckedCreateWithoutRecorrenciaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutRecorrenciaInput | LancamentoCreateOrConnectWithoutRecorrenciaInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutRecorrenciaInput | LancamentoUpsertWithWhereUniqueWithoutRecorrenciaInput[]
    createMany?: LancamentoCreateManyRecorrenciaInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutRecorrenciaInput | LancamentoUpdateWithWhereUniqueWithoutRecorrenciaInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutRecorrenciaInput | LancamentoUpdateManyWithWhereWithoutRecorrenciaInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type LancamentoUncheckedUpdateManyWithoutRecorrenciaNestedInput = {
    create?: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput> | LancamentoCreateWithoutRecorrenciaInput[] | LancamentoUncheckedCreateWithoutRecorrenciaInput[]
    connectOrCreate?: LancamentoCreateOrConnectWithoutRecorrenciaInput | LancamentoCreateOrConnectWithoutRecorrenciaInput[]
    upsert?: LancamentoUpsertWithWhereUniqueWithoutRecorrenciaInput | LancamentoUpsertWithWhereUniqueWithoutRecorrenciaInput[]
    createMany?: LancamentoCreateManyRecorrenciaInputEnvelope
    set?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    disconnect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    delete?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    connect?: LancamentoWhereUniqueInput | LancamentoWhereUniqueInput[]
    update?: LancamentoUpdateWithWhereUniqueWithoutRecorrenciaInput | LancamentoUpdateWithWhereUniqueWithoutRecorrenciaInput[]
    updateMany?: LancamentoUpdateManyWithWhereWithoutRecorrenciaInput | LancamentoUpdateManyWithWhereWithoutRecorrenciaInput[]
    deleteMany?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
  }

  export type ContaFinanceiraCreateNestedOneWithoutConciliacoesInput = {
    create?: XOR<ContaFinanceiraCreateWithoutConciliacoesInput, ContaFinanceiraUncheckedCreateWithoutConciliacoesInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutConciliacoesInput
    connect?: ContaFinanceiraWhereUniqueInput
  }

  export type EnumStatusConciliacaoFieldUpdateOperationsInput = {
    set?: $Enums.StatusConciliacao
  }

  export type ContaFinanceiraUpdateOneRequiredWithoutConciliacoesNestedInput = {
    create?: XOR<ContaFinanceiraCreateWithoutConciliacoesInput, ContaFinanceiraUncheckedCreateWithoutConciliacoesInput>
    connectOrCreate?: ContaFinanceiraCreateOrConnectWithoutConciliacoesInput
    upsert?: ContaFinanceiraUpsertWithoutConciliacoesInput
    connect?: ContaFinanceiraWhereUniqueInput
    update?: XOR<XOR<ContaFinanceiraUpdateToOneWithWhereWithoutConciliacoesInput, ContaFinanceiraUpdateWithoutConciliacoesInput>, ContaFinanceiraUncheckedUpdateWithoutConciliacoesInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AcaoCobrancaCreateNestedManyWithoutTituloInput = {
    create?: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput> | AcaoCobrancaCreateWithoutTituloInput[] | AcaoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcaoCobrancaCreateOrConnectWithoutTituloInput | AcaoCobrancaCreateOrConnectWithoutTituloInput[]
    createMany?: AcaoCobrancaCreateManyTituloInputEnvelope
    connect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
  }

  export type AcordoCobrancaCreateNestedManyWithoutTituloInput = {
    create?: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput> | AcordoCobrancaCreateWithoutTituloInput[] | AcordoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutTituloInput | AcordoCobrancaCreateOrConnectWithoutTituloInput[]
    createMany?: AcordoCobrancaCreateManyTituloInputEnvelope
    connect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
  }

  export type AcaoCobrancaUncheckedCreateNestedManyWithoutTituloInput = {
    create?: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput> | AcaoCobrancaCreateWithoutTituloInput[] | AcaoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcaoCobrancaCreateOrConnectWithoutTituloInput | AcaoCobrancaCreateOrConnectWithoutTituloInput[]
    createMany?: AcaoCobrancaCreateManyTituloInputEnvelope
    connect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
  }

  export type AcordoCobrancaUncheckedCreateNestedManyWithoutTituloInput = {
    create?: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput> | AcordoCobrancaCreateWithoutTituloInput[] | AcordoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutTituloInput | AcordoCobrancaCreateOrConnectWithoutTituloInput[]
    createMany?: AcordoCobrancaCreateManyTituloInputEnvelope
    connect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
  }

  export type EnumStatusTituloCobrancaFieldUpdateOperationsInput = {
    set?: $Enums.StatusTituloCobranca
  }

  export type EnumPrioridadeCobrancaFieldUpdateOperationsInput = {
    set?: $Enums.PrioridadeCobranca
  }

  export type AcaoCobrancaUpdateManyWithoutTituloNestedInput = {
    create?: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput> | AcaoCobrancaCreateWithoutTituloInput[] | AcaoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcaoCobrancaCreateOrConnectWithoutTituloInput | AcaoCobrancaCreateOrConnectWithoutTituloInput[]
    upsert?: AcaoCobrancaUpsertWithWhereUniqueWithoutTituloInput | AcaoCobrancaUpsertWithWhereUniqueWithoutTituloInput[]
    createMany?: AcaoCobrancaCreateManyTituloInputEnvelope
    set?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    disconnect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    delete?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    connect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    update?: AcaoCobrancaUpdateWithWhereUniqueWithoutTituloInput | AcaoCobrancaUpdateWithWhereUniqueWithoutTituloInput[]
    updateMany?: AcaoCobrancaUpdateManyWithWhereWithoutTituloInput | AcaoCobrancaUpdateManyWithWhereWithoutTituloInput[]
    deleteMany?: AcaoCobrancaScalarWhereInput | AcaoCobrancaScalarWhereInput[]
  }

  export type AcordoCobrancaUpdateManyWithoutTituloNestedInput = {
    create?: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput> | AcordoCobrancaCreateWithoutTituloInput[] | AcordoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutTituloInput | AcordoCobrancaCreateOrConnectWithoutTituloInput[]
    upsert?: AcordoCobrancaUpsertWithWhereUniqueWithoutTituloInput | AcordoCobrancaUpsertWithWhereUniqueWithoutTituloInput[]
    createMany?: AcordoCobrancaCreateManyTituloInputEnvelope
    set?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    disconnect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    delete?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    connect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    update?: AcordoCobrancaUpdateWithWhereUniqueWithoutTituloInput | AcordoCobrancaUpdateWithWhereUniqueWithoutTituloInput[]
    updateMany?: AcordoCobrancaUpdateManyWithWhereWithoutTituloInput | AcordoCobrancaUpdateManyWithWhereWithoutTituloInput[]
    deleteMany?: AcordoCobrancaScalarWhereInput | AcordoCobrancaScalarWhereInput[]
  }

  export type AcaoCobrancaUncheckedUpdateManyWithoutTituloNestedInput = {
    create?: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput> | AcaoCobrancaCreateWithoutTituloInput[] | AcaoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcaoCobrancaCreateOrConnectWithoutTituloInput | AcaoCobrancaCreateOrConnectWithoutTituloInput[]
    upsert?: AcaoCobrancaUpsertWithWhereUniqueWithoutTituloInput | AcaoCobrancaUpsertWithWhereUniqueWithoutTituloInput[]
    createMany?: AcaoCobrancaCreateManyTituloInputEnvelope
    set?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    disconnect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    delete?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    connect?: AcaoCobrancaWhereUniqueInput | AcaoCobrancaWhereUniqueInput[]
    update?: AcaoCobrancaUpdateWithWhereUniqueWithoutTituloInput | AcaoCobrancaUpdateWithWhereUniqueWithoutTituloInput[]
    updateMany?: AcaoCobrancaUpdateManyWithWhereWithoutTituloInput | AcaoCobrancaUpdateManyWithWhereWithoutTituloInput[]
    deleteMany?: AcaoCobrancaScalarWhereInput | AcaoCobrancaScalarWhereInput[]
  }

  export type AcordoCobrancaUncheckedUpdateManyWithoutTituloNestedInput = {
    create?: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput> | AcordoCobrancaCreateWithoutTituloInput[] | AcordoCobrancaUncheckedCreateWithoutTituloInput[]
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutTituloInput | AcordoCobrancaCreateOrConnectWithoutTituloInput[]
    upsert?: AcordoCobrancaUpsertWithWhereUniqueWithoutTituloInput | AcordoCobrancaUpsertWithWhereUniqueWithoutTituloInput[]
    createMany?: AcordoCobrancaCreateManyTituloInputEnvelope
    set?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    disconnect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    delete?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    connect?: AcordoCobrancaWhereUniqueInput | AcordoCobrancaWhereUniqueInput[]
    update?: AcordoCobrancaUpdateWithWhereUniqueWithoutTituloInput | AcordoCobrancaUpdateWithWhereUniqueWithoutTituloInput[]
    updateMany?: AcordoCobrancaUpdateManyWithWhereWithoutTituloInput | AcordoCobrancaUpdateManyWithWhereWithoutTituloInput[]
    deleteMany?: AcordoCobrancaScalarWhereInput | AcordoCobrancaScalarWhereInput[]
  }

  export type TituloCobrancaCreateNestedOneWithoutAcoesInput = {
    create?: XOR<TituloCobrancaCreateWithoutAcoesInput, TituloCobrancaUncheckedCreateWithoutAcoesInput>
    connectOrCreate?: TituloCobrancaCreateOrConnectWithoutAcoesInput
    connect?: TituloCobrancaWhereUniqueInput
  }

  export type EnumTipoAcaoCobrancaFieldUpdateOperationsInput = {
    set?: $Enums.TipoAcaoCobranca
  }

  export type EnumStatusAcaoCobrancaFieldUpdateOperationsInput = {
    set?: $Enums.StatusAcaoCobranca
  }

  export type TituloCobrancaUpdateOneRequiredWithoutAcoesNestedInput = {
    create?: XOR<TituloCobrancaCreateWithoutAcoesInput, TituloCobrancaUncheckedCreateWithoutAcoesInput>
    connectOrCreate?: TituloCobrancaCreateOrConnectWithoutAcoesInput
    upsert?: TituloCobrancaUpsertWithoutAcoesInput
    connect?: TituloCobrancaWhereUniqueInput
    update?: XOR<XOR<TituloCobrancaUpdateToOneWithWhereWithoutAcoesInput, TituloCobrancaUpdateWithoutAcoesInput>, TituloCobrancaUncheckedUpdateWithoutAcoesInput>
  }

  export type TituloCobrancaCreateNestedOneWithoutAcordosInput = {
    create?: XOR<TituloCobrancaCreateWithoutAcordosInput, TituloCobrancaUncheckedCreateWithoutAcordosInput>
    connectOrCreate?: TituloCobrancaCreateOrConnectWithoutAcordosInput
    connect?: TituloCobrancaWhereUniqueInput
  }

  export type ParcelaAcordoCreateNestedManyWithoutAcordoInput = {
    create?: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput> | ParcelaAcordoCreateWithoutAcordoInput[] | ParcelaAcordoUncheckedCreateWithoutAcordoInput[]
    connectOrCreate?: ParcelaAcordoCreateOrConnectWithoutAcordoInput | ParcelaAcordoCreateOrConnectWithoutAcordoInput[]
    createMany?: ParcelaAcordoCreateManyAcordoInputEnvelope
    connect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
  }

  export type ParcelaAcordoUncheckedCreateNestedManyWithoutAcordoInput = {
    create?: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput> | ParcelaAcordoCreateWithoutAcordoInput[] | ParcelaAcordoUncheckedCreateWithoutAcordoInput[]
    connectOrCreate?: ParcelaAcordoCreateOrConnectWithoutAcordoInput | ParcelaAcordoCreateOrConnectWithoutAcordoInput[]
    createMany?: ParcelaAcordoCreateManyAcordoInputEnvelope
    connect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
  }

  export type EnumStatusAcordoCobrancaFieldUpdateOperationsInput = {
    set?: $Enums.StatusAcordoCobranca
  }

  export type TituloCobrancaUpdateOneRequiredWithoutAcordosNestedInput = {
    create?: XOR<TituloCobrancaCreateWithoutAcordosInput, TituloCobrancaUncheckedCreateWithoutAcordosInput>
    connectOrCreate?: TituloCobrancaCreateOrConnectWithoutAcordosInput
    upsert?: TituloCobrancaUpsertWithoutAcordosInput
    connect?: TituloCobrancaWhereUniqueInput
    update?: XOR<XOR<TituloCobrancaUpdateToOneWithWhereWithoutAcordosInput, TituloCobrancaUpdateWithoutAcordosInput>, TituloCobrancaUncheckedUpdateWithoutAcordosInput>
  }

  export type ParcelaAcordoUpdateManyWithoutAcordoNestedInput = {
    create?: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput> | ParcelaAcordoCreateWithoutAcordoInput[] | ParcelaAcordoUncheckedCreateWithoutAcordoInput[]
    connectOrCreate?: ParcelaAcordoCreateOrConnectWithoutAcordoInput | ParcelaAcordoCreateOrConnectWithoutAcordoInput[]
    upsert?: ParcelaAcordoUpsertWithWhereUniqueWithoutAcordoInput | ParcelaAcordoUpsertWithWhereUniqueWithoutAcordoInput[]
    createMany?: ParcelaAcordoCreateManyAcordoInputEnvelope
    set?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    disconnect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    delete?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    connect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    update?: ParcelaAcordoUpdateWithWhereUniqueWithoutAcordoInput | ParcelaAcordoUpdateWithWhereUniqueWithoutAcordoInput[]
    updateMany?: ParcelaAcordoUpdateManyWithWhereWithoutAcordoInput | ParcelaAcordoUpdateManyWithWhereWithoutAcordoInput[]
    deleteMany?: ParcelaAcordoScalarWhereInput | ParcelaAcordoScalarWhereInput[]
  }

  export type ParcelaAcordoUncheckedUpdateManyWithoutAcordoNestedInput = {
    create?: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput> | ParcelaAcordoCreateWithoutAcordoInput[] | ParcelaAcordoUncheckedCreateWithoutAcordoInput[]
    connectOrCreate?: ParcelaAcordoCreateOrConnectWithoutAcordoInput | ParcelaAcordoCreateOrConnectWithoutAcordoInput[]
    upsert?: ParcelaAcordoUpsertWithWhereUniqueWithoutAcordoInput | ParcelaAcordoUpsertWithWhereUniqueWithoutAcordoInput[]
    createMany?: ParcelaAcordoCreateManyAcordoInputEnvelope
    set?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    disconnect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    delete?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    connect?: ParcelaAcordoWhereUniqueInput | ParcelaAcordoWhereUniqueInput[]
    update?: ParcelaAcordoUpdateWithWhereUniqueWithoutAcordoInput | ParcelaAcordoUpdateWithWhereUniqueWithoutAcordoInput[]
    updateMany?: ParcelaAcordoUpdateManyWithWhereWithoutAcordoInput | ParcelaAcordoUpdateManyWithWhereWithoutAcordoInput[]
    deleteMany?: ParcelaAcordoScalarWhereInput | ParcelaAcordoScalarWhereInput[]
  }

  export type AcordoCobrancaCreateNestedOneWithoutParcelasInput = {
    create?: XOR<AcordoCobrancaCreateWithoutParcelasInput, AcordoCobrancaUncheckedCreateWithoutParcelasInput>
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutParcelasInput
    connect?: AcordoCobrancaWhereUniqueInput
  }

  export type AcordoCobrancaUpdateOneRequiredWithoutParcelasNestedInput = {
    create?: XOR<AcordoCobrancaCreateWithoutParcelasInput, AcordoCobrancaUncheckedCreateWithoutParcelasInput>
    connectOrCreate?: AcordoCobrancaCreateOrConnectWithoutParcelasInput
    upsert?: AcordoCobrancaUpsertWithoutParcelasInput
    connect?: AcordoCobrancaWhereUniqueInput
    update?: XOR<XOR<AcordoCobrancaUpdateToOneWithWhereWithoutParcelasInput, AcordoCobrancaUpdateWithoutParcelasInput>, AcordoCobrancaUncheckedUpdateWithoutParcelasInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumTipoContaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoConta | EnumTipoContaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoContaFilter<$PrismaModel> | $Enums.TipoConta
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumTipoContaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoConta | EnumTipoContaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoConta[] | ListEnumTipoContaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoContaWithAggregatesFilter<$PrismaModel> | $Enums.TipoConta
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoContaFilter<$PrismaModel>
    _max?: NestedEnumTipoContaFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTipoLancamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoLancamento | EnumTipoLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoLancamentoFilter<$PrismaModel> | $Enums.TipoLancamento
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumStatusLancamentoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLancamento | EnumStatusLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusLancamentoFilter<$PrismaModel> | $Enums.StatusLancamento
  }

  export type NestedEnumFormaPagamentoNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.FormaPagamento | EnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    in?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel> | $Enums.FormaPagamento | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumTipoLancamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoLancamento | EnumTipoLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoLancamento[] | ListEnumTipoLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoLancamentoWithAggregatesFilter<$PrismaModel> | $Enums.TipoLancamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoLancamentoFilter<$PrismaModel>
    _max?: NestedEnumTipoLancamentoFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumStatusLancamentoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusLancamento | EnumStatusLancamentoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusLancamento[] | ListEnumStatusLancamentoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusLancamentoWithAggregatesFilter<$PrismaModel> | $Enums.StatusLancamento
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusLancamentoFilter<$PrismaModel>
    _max?: NestedEnumStatusLancamentoFilter<$PrismaModel>
  }

  export type NestedEnumFormaPagamentoNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormaPagamento | EnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    in?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.FormaPagamento[] | ListEnumFormaPagamentoFieldRefInput<$PrismaModel> | null
    not?: NestedEnumFormaPagamentoNullableWithAggregatesFilter<$PrismaModel> | $Enums.FormaPagamento | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel>
    _max?: NestedEnumFormaPagamentoNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCategoriaFinanceira | EnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel> | $Enums.TipoCategoriaFinanceira
  }

  export type NestedEnumTipoCategoriaFinanceiraWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCategoriaFinanceira | EnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCategoriaFinanceira[] | ListEnumTipoCategoriaFinanceiraFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoCategoriaFinanceiraWithAggregatesFilter<$PrismaModel> | $Enums.TipoCategoriaFinanceira
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel>
    _max?: NestedEnumTipoCategoriaFinanceiraFilter<$PrismaModel>
  }

  export type NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel = never> = {
    equals?: $Enums.FrequenciaRecorrencia | EnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    notIn?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    not?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel> | $Enums.FrequenciaRecorrencia
  }

  export type NestedEnumFrequenciaRecorrenciaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FrequenciaRecorrencia | EnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    in?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    notIn?: $Enums.FrequenciaRecorrencia[] | ListEnumFrequenciaRecorrenciaFieldRefInput<$PrismaModel>
    not?: NestedEnumFrequenciaRecorrenciaWithAggregatesFilter<$PrismaModel> | $Enums.FrequenciaRecorrencia
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel>
    _max?: NestedEnumFrequenciaRecorrenciaFilter<$PrismaModel>
  }

  export type NestedEnumStatusConciliacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusConciliacao | EnumStatusConciliacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusConciliacaoFilter<$PrismaModel> | $Enums.StatusConciliacao
  }

  export type NestedEnumStatusConciliacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusConciliacao | EnumStatusConciliacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusConciliacao[] | ListEnumStatusConciliacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusConciliacaoWithAggregatesFilter<$PrismaModel> | $Enums.StatusConciliacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusConciliacaoFilter<$PrismaModel>
    _max?: NestedEnumStatusConciliacaoFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStatusTituloCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTituloCobranca | EnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel> | $Enums.StatusTituloCobranca
  }

  export type NestedEnumPrioridadeCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.PrioridadeCobranca | EnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel> | $Enums.PrioridadeCobranca
  }

  export type NestedEnumStatusTituloCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTituloCobranca | EnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTituloCobranca[] | ListEnumStatusTituloCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTituloCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusTituloCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusTituloCobrancaFilter<$PrismaModel>
  }

  export type NestedEnumPrioridadeCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PrioridadeCobranca | EnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.PrioridadeCobranca[] | ListEnumPrioridadeCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumPrioridadeCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.PrioridadeCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel>
    _max?: NestedEnumPrioridadeCobrancaFilter<$PrismaModel>
  }

  export type NestedEnumTipoAcaoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAcaoCobranca | EnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel> | $Enums.TipoAcaoCobranca
  }

  export type NestedEnumStatusAcaoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcaoCobranca | EnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel> | $Enums.StatusAcaoCobranca
  }

  export type NestedEnumTipoAcaoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoAcaoCobranca | EnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoAcaoCobranca[] | ListEnumTipoAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoAcaoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.TipoAcaoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumTipoAcaoCobrancaFilter<$PrismaModel>
  }

  export type NestedEnumStatusAcaoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcaoCobranca | EnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcaoCobranca[] | ListEnumStatusAcaoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcaoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusAcaoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusAcaoCobrancaFilter<$PrismaModel>
  }

  export type NestedEnumStatusAcordoCobrancaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcordoCobranca | EnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel> | $Enums.StatusAcordoCobranca
  }

  export type NestedEnumStatusAcordoCobrancaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusAcordoCobranca | EnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusAcordoCobranca[] | ListEnumStatusAcordoCobrancaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusAcordoCobrancaWithAggregatesFilter<$PrismaModel> | $Enums.StatusAcordoCobranca
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel>
    _max?: NestedEnumStatusAcordoCobrancaFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LancamentoCreateWithoutContaInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    recorrencia?: RecorrenciaCreateNestedOneWithoutLancamentosInput
    contaOrigem?: ContaFinanceiraCreateNestedOneWithoutTransferenciasOrigemInput
    contaDestino?: ContaFinanceiraCreateNestedOneWithoutTransferenciasDestinoInput
  }

  export type LancamentoUncheckedCreateWithoutContaInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoCreateOrConnectWithoutContaInput = {
    where: LancamentoWhereUniqueInput
    create: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput>
  }

  export type LancamentoCreateManyContaInputEnvelope = {
    data: LancamentoCreateManyContaInput | LancamentoCreateManyContaInput[]
    skipDuplicates?: boolean
  }

  export type LancamentoCreateWithoutContaOrigemInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutLancamentosInput
    recorrencia?: RecorrenciaCreateNestedOneWithoutLancamentosInput
    contaDestino?: ContaFinanceiraCreateNestedOneWithoutTransferenciasDestinoInput
  }

  export type LancamentoUncheckedCreateWithoutContaOrigemInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaDestinoId?: string | null
  }

  export type LancamentoCreateOrConnectWithoutContaOrigemInput = {
    where: LancamentoWhereUniqueInput
    create: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput>
  }

  export type LancamentoCreateManyContaOrigemInputEnvelope = {
    data: LancamentoCreateManyContaOrigemInput | LancamentoCreateManyContaOrigemInput[]
    skipDuplicates?: boolean
  }

  export type LancamentoCreateWithoutContaDestinoInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutLancamentosInput
    recorrencia?: RecorrenciaCreateNestedOneWithoutLancamentosInput
    contaOrigem?: ContaFinanceiraCreateNestedOneWithoutTransferenciasOrigemInput
  }

  export type LancamentoUncheckedCreateWithoutContaDestinoInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
  }

  export type LancamentoCreateOrConnectWithoutContaDestinoInput = {
    where: LancamentoWhereUniqueInput
    create: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput>
  }

  export type LancamentoCreateManyContaDestinoInputEnvelope = {
    data: LancamentoCreateManyContaDestinoInput | LancamentoCreateManyContaDestinoInput[]
    skipDuplicates?: boolean
  }

  export type RecorrenciaCreateWithoutContaInput = {
    id?: string
    tenantId: string
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutRecorrenciaInput
  }

  export type RecorrenciaUncheckedCreateWithoutContaInput = {
    id?: string
    tenantId: string
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutRecorrenciaInput
  }

  export type RecorrenciaCreateOrConnectWithoutContaInput = {
    where: RecorrenciaWhereUniqueInput
    create: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput>
  }

  export type RecorrenciaCreateManyContaInputEnvelope = {
    data: RecorrenciaCreateManyContaInput | RecorrenciaCreateManyContaInput[]
    skipDuplicates?: boolean
  }

  export type ConciliacaoBancariaCreateWithoutContaInput = {
    id?: string
    tenantId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConciliacaoBancariaUncheckedCreateWithoutContaInput = {
    id?: string
    tenantId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConciliacaoBancariaCreateOrConnectWithoutContaInput = {
    where: ConciliacaoBancariaWhereUniqueInput
    create: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput>
  }

  export type ConciliacaoBancariaCreateManyContaInputEnvelope = {
    data: ConciliacaoBancariaCreateManyContaInput | ConciliacaoBancariaCreateManyContaInput[]
    skipDuplicates?: boolean
  }

  export type LancamentoUpsertWithWhereUniqueWithoutContaInput = {
    where: LancamentoWhereUniqueInput
    update: XOR<LancamentoUpdateWithoutContaInput, LancamentoUncheckedUpdateWithoutContaInput>
    create: XOR<LancamentoCreateWithoutContaInput, LancamentoUncheckedCreateWithoutContaInput>
  }

  export type LancamentoUpdateWithWhereUniqueWithoutContaInput = {
    where: LancamentoWhereUniqueInput
    data: XOR<LancamentoUpdateWithoutContaInput, LancamentoUncheckedUpdateWithoutContaInput>
  }

  export type LancamentoUpdateManyWithWhereWithoutContaInput = {
    where: LancamentoScalarWhereInput
    data: XOR<LancamentoUpdateManyMutationInput, LancamentoUncheckedUpdateManyWithoutContaInput>
  }

  export type LancamentoScalarWhereInput = {
    AND?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
    OR?: LancamentoScalarWhereInput[]
    NOT?: LancamentoScalarWhereInput | LancamentoScalarWhereInput[]
    id?: UuidFilter<"Lancamento"> | string
    tenantId?: UuidFilter<"Lancamento"> | string
    contaId?: UuidNullableFilter<"Lancamento"> | string | null
    usuarioId?: UuidNullableFilter<"Lancamento"> | string | null
    tipo?: EnumTipoLancamentoFilter<"Lancamento"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Lancamento"> | string | null
    subcategoria?: StringNullableFilter<"Lancamento"> | string | null
    descricao?: StringFilter<"Lancamento"> | string
    valor?: DecimalFilter<"Lancamento"> | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFilter<"Lancamento"> | Date | string
    dataPagamento?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    dataCompetencia?: DateTimeNullableFilter<"Lancamento"> | Date | string | null
    status?: EnumStatusLancamentoFilter<"Lancamento"> | $Enums.StatusLancamento
    formaPagamento?: EnumFormaPagamentoNullableFilter<"Lancamento"> | $Enums.FormaPagamento | null
    numeroParcela?: IntNullableFilter<"Lancamento"> | number | null
    totalParcelas?: IntNullableFilter<"Lancamento"> | number | null
    parcelaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    pedidoId?: UuidNullableFilter<"Lancamento"> | string | null
    notaFiscalId?: UuidNullableFilter<"Lancamento"> | string | null
    fornecedor?: StringNullableFilter<"Lancamento"> | string | null
    cliente?: StringNullableFilter<"Lancamento"> | string | null
    observacao?: StringNullableFilter<"Lancamento"> | string | null
    tags?: StringNullableListFilter<"Lancamento">
    recorrente?: BoolFilter<"Lancamento"> | boolean
    recorrenciaId?: UuidNullableFilter<"Lancamento"> | string | null
    anexoUrl?: StringNullableFilter<"Lancamento"> | string | null
    criadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Lancamento"> | Date | string
    contaOrigemId?: UuidNullableFilter<"Lancamento"> | string | null
    contaDestinoId?: UuidNullableFilter<"Lancamento"> | string | null
  }

  export type LancamentoUpsertWithWhereUniqueWithoutContaOrigemInput = {
    where: LancamentoWhereUniqueInput
    update: XOR<LancamentoUpdateWithoutContaOrigemInput, LancamentoUncheckedUpdateWithoutContaOrigemInput>
    create: XOR<LancamentoCreateWithoutContaOrigemInput, LancamentoUncheckedCreateWithoutContaOrigemInput>
  }

  export type LancamentoUpdateWithWhereUniqueWithoutContaOrigemInput = {
    where: LancamentoWhereUniqueInput
    data: XOR<LancamentoUpdateWithoutContaOrigemInput, LancamentoUncheckedUpdateWithoutContaOrigemInput>
  }

  export type LancamentoUpdateManyWithWhereWithoutContaOrigemInput = {
    where: LancamentoScalarWhereInput
    data: XOR<LancamentoUpdateManyMutationInput, LancamentoUncheckedUpdateManyWithoutContaOrigemInput>
  }

  export type LancamentoUpsertWithWhereUniqueWithoutContaDestinoInput = {
    where: LancamentoWhereUniqueInput
    update: XOR<LancamentoUpdateWithoutContaDestinoInput, LancamentoUncheckedUpdateWithoutContaDestinoInput>
    create: XOR<LancamentoCreateWithoutContaDestinoInput, LancamentoUncheckedCreateWithoutContaDestinoInput>
  }

  export type LancamentoUpdateWithWhereUniqueWithoutContaDestinoInput = {
    where: LancamentoWhereUniqueInput
    data: XOR<LancamentoUpdateWithoutContaDestinoInput, LancamentoUncheckedUpdateWithoutContaDestinoInput>
  }

  export type LancamentoUpdateManyWithWhereWithoutContaDestinoInput = {
    where: LancamentoScalarWhereInput
    data: XOR<LancamentoUpdateManyMutationInput, LancamentoUncheckedUpdateManyWithoutContaDestinoInput>
  }

  export type RecorrenciaUpsertWithWhereUniqueWithoutContaInput = {
    where: RecorrenciaWhereUniqueInput
    update: XOR<RecorrenciaUpdateWithoutContaInput, RecorrenciaUncheckedUpdateWithoutContaInput>
    create: XOR<RecorrenciaCreateWithoutContaInput, RecorrenciaUncheckedCreateWithoutContaInput>
  }

  export type RecorrenciaUpdateWithWhereUniqueWithoutContaInput = {
    where: RecorrenciaWhereUniqueInput
    data: XOR<RecorrenciaUpdateWithoutContaInput, RecorrenciaUncheckedUpdateWithoutContaInput>
  }

  export type RecorrenciaUpdateManyWithWhereWithoutContaInput = {
    where: RecorrenciaScalarWhereInput
    data: XOR<RecorrenciaUpdateManyMutationInput, RecorrenciaUncheckedUpdateManyWithoutContaInput>
  }

  export type RecorrenciaScalarWhereInput = {
    AND?: RecorrenciaScalarWhereInput | RecorrenciaScalarWhereInput[]
    OR?: RecorrenciaScalarWhereInput[]
    NOT?: RecorrenciaScalarWhereInput | RecorrenciaScalarWhereInput[]
    id?: UuidFilter<"Recorrencia"> | string
    tenantId?: UuidFilter<"Recorrencia"> | string
    contaId?: UuidNullableFilter<"Recorrencia"> | string | null
    descricao?: StringFilter<"Recorrencia"> | string
    tipo?: EnumTipoLancamentoFilter<"Recorrencia"> | $Enums.TipoLancamento
    categoria?: StringNullableFilter<"Recorrencia"> | string | null
    valor?: DecimalFilter<"Recorrencia"> | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFilter<"Recorrencia"> | $Enums.FrequenciaRecorrencia
    diaVencimento?: IntNullableFilter<"Recorrencia"> | number | null
    proximaGeracao?: DateTimeFilter<"Recorrencia"> | Date | string
    ativa?: BoolFilter<"Recorrencia"> | boolean
    criadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
    atualizadoEm?: DateTimeFilter<"Recorrencia"> | Date | string
  }

  export type ConciliacaoBancariaUpsertWithWhereUniqueWithoutContaInput = {
    where: ConciliacaoBancariaWhereUniqueInput
    update: XOR<ConciliacaoBancariaUpdateWithoutContaInput, ConciliacaoBancariaUncheckedUpdateWithoutContaInput>
    create: XOR<ConciliacaoBancariaCreateWithoutContaInput, ConciliacaoBancariaUncheckedCreateWithoutContaInput>
  }

  export type ConciliacaoBancariaUpdateWithWhereUniqueWithoutContaInput = {
    where: ConciliacaoBancariaWhereUniqueInput
    data: XOR<ConciliacaoBancariaUpdateWithoutContaInput, ConciliacaoBancariaUncheckedUpdateWithoutContaInput>
  }

  export type ConciliacaoBancariaUpdateManyWithWhereWithoutContaInput = {
    where: ConciliacaoBancariaScalarWhereInput
    data: XOR<ConciliacaoBancariaUpdateManyMutationInput, ConciliacaoBancariaUncheckedUpdateManyWithoutContaInput>
  }

  export type ConciliacaoBancariaScalarWhereInput = {
    AND?: ConciliacaoBancariaScalarWhereInput | ConciliacaoBancariaScalarWhereInput[]
    OR?: ConciliacaoBancariaScalarWhereInput[]
    NOT?: ConciliacaoBancariaScalarWhereInput | ConciliacaoBancariaScalarWhereInput[]
    id?: UuidFilter<"ConciliacaoBancaria"> | string
    tenantId?: UuidFilter<"ConciliacaoBancaria"> | string
    contaId?: UuidFilter<"ConciliacaoBancaria"> | string
    dataInicio?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    dataFim?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    saldoInicial?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFilter<"ConciliacaoBancaria"> | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFilter<"ConciliacaoBancaria"> | $Enums.StatusConciliacao
    divergencias?: JsonNullableFilter<"ConciliacaoBancaria">
    criadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
    atualizadoEm?: DateTimeFilter<"ConciliacaoBancaria"> | Date | string
  }

  export type ContaFinanceiraCreateWithoutLancamentosInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    transferenciasOrigem?: LancamentoCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateWithoutLancamentosInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    transferenciasOrigem?: LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaUncheckedCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraCreateOrConnectWithoutLancamentosInput = {
    where: ContaFinanceiraWhereUniqueInput
    create: XOR<ContaFinanceiraCreateWithoutLancamentosInput, ContaFinanceiraUncheckedCreateWithoutLancamentosInput>
  }

  export type RecorrenciaCreateWithoutLancamentosInput = {
    id?: string
    tenantId: string
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutRecorrenciasInput
  }

  export type RecorrenciaUncheckedCreateWithoutLancamentosInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type RecorrenciaCreateOrConnectWithoutLancamentosInput = {
    where: RecorrenciaWhereUniqueInput
    create: XOR<RecorrenciaCreateWithoutLancamentosInput, RecorrenciaUncheckedCreateWithoutLancamentosInput>
  }

  export type ContaFinanceiraCreateWithoutTransferenciasOrigemInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutContaInput
    transferenciasDestino?: LancamentoCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateWithoutTransferenciasOrigemInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutContaInput
    transferenciasDestino?: LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaUncheckedCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraCreateOrConnectWithoutTransferenciasOrigemInput = {
    where: ContaFinanceiraWhereUniqueInput
    create: XOR<ContaFinanceiraCreateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasOrigemInput>
  }

  export type ContaFinanceiraCreateWithoutTransferenciasDestinoInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoCreateNestedManyWithoutContaOrigemInput
    recorrencias?: RecorrenciaCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateWithoutTransferenciasDestinoInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput
    recorrencias?: RecorrenciaUncheckedCreateNestedManyWithoutContaInput
    conciliacoes?: ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraCreateOrConnectWithoutTransferenciasDestinoInput = {
    where: ContaFinanceiraWhereUniqueInput
    create: XOR<ContaFinanceiraCreateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasDestinoInput>
  }

  export type ContaFinanceiraUpsertWithoutLancamentosInput = {
    update: XOR<ContaFinanceiraUpdateWithoutLancamentosInput, ContaFinanceiraUncheckedUpdateWithoutLancamentosInput>
    create: XOR<ContaFinanceiraCreateWithoutLancamentosInput, ContaFinanceiraUncheckedCreateWithoutLancamentosInput>
    where?: ContaFinanceiraWhereInput
  }

  export type ContaFinanceiraUpdateToOneWithWhereWithoutLancamentosInput = {
    where?: ContaFinanceiraWhereInput
    data: XOR<ContaFinanceiraUpdateWithoutLancamentosInput, ContaFinanceiraUncheckedUpdateWithoutLancamentosInput>
  }

  export type ContaFinanceiraUpdateWithoutLancamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    transferenciasOrigem?: LancamentoUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateWithoutLancamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    transferenciasOrigem?: LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUncheckedUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type RecorrenciaUpsertWithoutLancamentosInput = {
    update: XOR<RecorrenciaUpdateWithoutLancamentosInput, RecorrenciaUncheckedUpdateWithoutLancamentosInput>
    create: XOR<RecorrenciaCreateWithoutLancamentosInput, RecorrenciaUncheckedCreateWithoutLancamentosInput>
    where?: RecorrenciaWhereInput
  }

  export type RecorrenciaUpdateToOneWithWhereWithoutLancamentosInput = {
    where?: RecorrenciaWhereInput
    data: XOR<RecorrenciaUpdateWithoutLancamentosInput, RecorrenciaUncheckedUpdateWithoutLancamentosInput>
  }

  export type RecorrenciaUpdateWithoutLancamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutRecorrenciasNestedInput
  }

  export type RecorrenciaUncheckedUpdateWithoutLancamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContaFinanceiraUpsertWithoutTransferenciasOrigemInput = {
    update: XOR<ContaFinanceiraUpdateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedUpdateWithoutTransferenciasOrigemInput>
    create: XOR<ContaFinanceiraCreateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasOrigemInput>
    where?: ContaFinanceiraWhereInput
  }

  export type ContaFinanceiraUpdateToOneWithWhereWithoutTransferenciasOrigemInput = {
    where?: ContaFinanceiraWhereInput
    data: XOR<ContaFinanceiraUpdateWithoutTransferenciasOrigemInput, ContaFinanceiraUncheckedUpdateWithoutTransferenciasOrigemInput>
  }

  export type ContaFinanceiraUpdateWithoutTransferenciasOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutContaNestedInput
    transferenciasDestino?: LancamentoUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateWithoutTransferenciasOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutContaNestedInput
    transferenciasDestino?: LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUncheckedUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUpsertWithoutTransferenciasDestinoInput = {
    update: XOR<ContaFinanceiraUpdateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedUpdateWithoutTransferenciasDestinoInput>
    create: XOR<ContaFinanceiraCreateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedCreateWithoutTransferenciasDestinoInput>
    where?: ContaFinanceiraWhereInput
  }

  export type ContaFinanceiraUpdateToOneWithWhereWithoutTransferenciasDestinoInput = {
    where?: ContaFinanceiraWhereInput
    data: XOR<ContaFinanceiraUpdateWithoutTransferenciasDestinoInput, ContaFinanceiraUncheckedUpdateWithoutTransferenciasDestinoInput>
  }

  export type ContaFinanceiraUpdateWithoutTransferenciasDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUpdateManyWithoutContaOrigemNestedInput
    recorrencias?: RecorrenciaUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateWithoutTransferenciasDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput
    recorrencias?: RecorrenciaUncheckedUpdateManyWithoutContaNestedInput
    conciliacoes?: ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type CategoriaFinanceiraCreateWithoutFilhosInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    pai?: CategoriaFinanceiraCreateNestedOneWithoutFilhosInput
  }

  export type CategoriaFinanceiraUncheckedCreateWithoutFilhosInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    paiId?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type CategoriaFinanceiraCreateOrConnectWithoutFilhosInput = {
    where: CategoriaFinanceiraWhereUniqueInput
    create: XOR<CategoriaFinanceiraCreateWithoutFilhosInput, CategoriaFinanceiraUncheckedCreateWithoutFilhosInput>
  }

  export type CategoriaFinanceiraCreateWithoutPaiInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    filhos?: CategoriaFinanceiraCreateNestedManyWithoutPaiInput
  }

  export type CategoriaFinanceiraUncheckedCreateWithoutPaiInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    filhos?: CategoriaFinanceiraUncheckedCreateNestedManyWithoutPaiInput
  }

  export type CategoriaFinanceiraCreateOrConnectWithoutPaiInput = {
    where: CategoriaFinanceiraWhereUniqueInput
    create: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput>
  }

  export type CategoriaFinanceiraCreateManyPaiInputEnvelope = {
    data: CategoriaFinanceiraCreateManyPaiInput | CategoriaFinanceiraCreateManyPaiInput[]
    skipDuplicates?: boolean
  }

  export type CategoriaFinanceiraUpsertWithoutFilhosInput = {
    update: XOR<CategoriaFinanceiraUpdateWithoutFilhosInput, CategoriaFinanceiraUncheckedUpdateWithoutFilhosInput>
    create: XOR<CategoriaFinanceiraCreateWithoutFilhosInput, CategoriaFinanceiraUncheckedCreateWithoutFilhosInput>
    where?: CategoriaFinanceiraWhereInput
  }

  export type CategoriaFinanceiraUpdateToOneWithWhereWithoutFilhosInput = {
    where?: CategoriaFinanceiraWhereInput
    data: XOR<CategoriaFinanceiraUpdateWithoutFilhosInput, CategoriaFinanceiraUncheckedUpdateWithoutFilhosInput>
  }

  export type CategoriaFinanceiraUpdateWithoutFilhosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pai?: CategoriaFinanceiraUpdateOneWithoutFilhosNestedInput
  }

  export type CategoriaFinanceiraUncheckedUpdateWithoutFilhosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    paiId?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoriaFinanceiraUpsertWithWhereUniqueWithoutPaiInput = {
    where: CategoriaFinanceiraWhereUniqueInput
    update: XOR<CategoriaFinanceiraUpdateWithoutPaiInput, CategoriaFinanceiraUncheckedUpdateWithoutPaiInput>
    create: XOR<CategoriaFinanceiraCreateWithoutPaiInput, CategoriaFinanceiraUncheckedCreateWithoutPaiInput>
  }

  export type CategoriaFinanceiraUpdateWithWhereUniqueWithoutPaiInput = {
    where: CategoriaFinanceiraWhereUniqueInput
    data: XOR<CategoriaFinanceiraUpdateWithoutPaiInput, CategoriaFinanceiraUncheckedUpdateWithoutPaiInput>
  }

  export type CategoriaFinanceiraUpdateManyWithWhereWithoutPaiInput = {
    where: CategoriaFinanceiraScalarWhereInput
    data: XOR<CategoriaFinanceiraUpdateManyMutationInput, CategoriaFinanceiraUncheckedUpdateManyWithoutPaiInput>
  }

  export type CategoriaFinanceiraScalarWhereInput = {
    AND?: CategoriaFinanceiraScalarWhereInput | CategoriaFinanceiraScalarWhereInput[]
    OR?: CategoriaFinanceiraScalarWhereInput[]
    NOT?: CategoriaFinanceiraScalarWhereInput | CategoriaFinanceiraScalarWhereInput[]
    id?: UuidFilter<"CategoriaFinanceira"> | string
    tenantId?: UuidFilter<"CategoriaFinanceira"> | string
    nome?: StringFilter<"CategoriaFinanceira"> | string
    tipo?: EnumTipoCategoriaFinanceiraFilter<"CategoriaFinanceira"> | $Enums.TipoCategoriaFinanceira
    icone?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    cor?: StringNullableFilter<"CategoriaFinanceira"> | string | null
    paiId?: UuidNullableFilter<"CategoriaFinanceira"> | string | null
    ativa?: BoolFilter<"CategoriaFinanceira"> | boolean
    criadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
    atualizadoEm?: DateTimeFilter<"CategoriaFinanceira"> | Date | string
  }

  export type ContaFinanceiraCreateWithoutRecorrenciasInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoCreateNestedManyWithoutContaDestinoInput
    conciliacoes?: ConciliacaoBancariaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateWithoutRecorrenciasInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput
    conciliacoes?: ConciliacaoBancariaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraCreateOrConnectWithoutRecorrenciasInput = {
    where: ContaFinanceiraWhereUniqueInput
    create: XOR<ContaFinanceiraCreateWithoutRecorrenciasInput, ContaFinanceiraUncheckedCreateWithoutRecorrenciasInput>
  }

  export type LancamentoCreateWithoutRecorrenciaInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    conta?: ContaFinanceiraCreateNestedOneWithoutLancamentosInput
    contaOrigem?: ContaFinanceiraCreateNestedOneWithoutTransferenciasOrigemInput
    contaDestino?: ContaFinanceiraCreateNestedOneWithoutTransferenciasDestinoInput
  }

  export type LancamentoUncheckedCreateWithoutRecorrenciaInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoCreateOrConnectWithoutRecorrenciaInput = {
    where: LancamentoWhereUniqueInput
    create: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput>
  }

  export type LancamentoCreateManyRecorrenciaInputEnvelope = {
    data: LancamentoCreateManyRecorrenciaInput | LancamentoCreateManyRecorrenciaInput[]
    skipDuplicates?: boolean
  }

  export type ContaFinanceiraUpsertWithoutRecorrenciasInput = {
    update: XOR<ContaFinanceiraUpdateWithoutRecorrenciasInput, ContaFinanceiraUncheckedUpdateWithoutRecorrenciasInput>
    create: XOR<ContaFinanceiraCreateWithoutRecorrenciasInput, ContaFinanceiraUncheckedCreateWithoutRecorrenciasInput>
    where?: ContaFinanceiraWhereInput
  }

  export type ContaFinanceiraUpdateToOneWithWhereWithoutRecorrenciasInput = {
    where?: ContaFinanceiraWhereInput
    data: XOR<ContaFinanceiraUpdateWithoutRecorrenciasInput, ContaFinanceiraUncheckedUpdateWithoutRecorrenciasInput>
  }

  export type ContaFinanceiraUpdateWithoutRecorrenciasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUpdateManyWithoutContaDestinoNestedInput
    conciliacoes?: ConciliacaoBancariaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateWithoutRecorrenciasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput
    conciliacoes?: ConciliacaoBancariaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type LancamentoUpsertWithWhereUniqueWithoutRecorrenciaInput = {
    where: LancamentoWhereUniqueInput
    update: XOR<LancamentoUpdateWithoutRecorrenciaInput, LancamentoUncheckedUpdateWithoutRecorrenciaInput>
    create: XOR<LancamentoCreateWithoutRecorrenciaInput, LancamentoUncheckedCreateWithoutRecorrenciaInput>
  }

  export type LancamentoUpdateWithWhereUniqueWithoutRecorrenciaInput = {
    where: LancamentoWhereUniqueInput
    data: XOR<LancamentoUpdateWithoutRecorrenciaInput, LancamentoUncheckedUpdateWithoutRecorrenciaInput>
  }

  export type LancamentoUpdateManyWithWhereWithoutRecorrenciaInput = {
    where: LancamentoScalarWhereInput
    data: XOR<LancamentoUpdateManyMutationInput, LancamentoUncheckedUpdateManyWithoutRecorrenciaInput>
  }

  export type ContaFinanceiraCreateWithoutConciliacoesInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraUncheckedCreateWithoutConciliacoesInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoConta
    banco?: string | null
    agencia?: string | null
    conta?: string | null
    saldoAtual?: Decimal | DecimalJsLike | number | string
    saldoInicial?: Decimal | DecimalJsLike | number | string
    ativa?: boolean
    cor?: string | null
    icone?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    lancamentos?: LancamentoUncheckedCreateNestedManyWithoutContaInput
    transferenciasOrigem?: LancamentoUncheckedCreateNestedManyWithoutContaOrigemInput
    transferenciasDestino?: LancamentoUncheckedCreateNestedManyWithoutContaDestinoInput
    recorrencias?: RecorrenciaUncheckedCreateNestedManyWithoutContaInput
  }

  export type ContaFinanceiraCreateOrConnectWithoutConciliacoesInput = {
    where: ContaFinanceiraWhereUniqueInput
    create: XOR<ContaFinanceiraCreateWithoutConciliacoesInput, ContaFinanceiraUncheckedCreateWithoutConciliacoesInput>
  }

  export type ContaFinanceiraUpsertWithoutConciliacoesInput = {
    update: XOR<ContaFinanceiraUpdateWithoutConciliacoesInput, ContaFinanceiraUncheckedUpdateWithoutConciliacoesInput>
    create: XOR<ContaFinanceiraCreateWithoutConciliacoesInput, ContaFinanceiraUncheckedCreateWithoutConciliacoesInput>
    where?: ContaFinanceiraWhereInput
  }

  export type ContaFinanceiraUpdateToOneWithWhereWithoutConciliacoesInput = {
    where?: ContaFinanceiraWhereInput
    data: XOR<ContaFinanceiraUpdateWithoutConciliacoesInput, ContaFinanceiraUncheckedUpdateWithoutConciliacoesInput>
  }

  export type ContaFinanceiraUpdateWithoutConciliacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUpdateManyWithoutContaNestedInput
  }

  export type ContaFinanceiraUncheckedUpdateWithoutConciliacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoContaFieldUpdateOperationsInput | $Enums.TipoConta
    banco?: NullableStringFieldUpdateOperationsInput | string | null
    agencia?: NullableStringFieldUpdateOperationsInput | string | null
    conta?: NullableStringFieldUpdateOperationsInput | string | null
    saldoAtual?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutContaNestedInput
    transferenciasOrigem?: LancamentoUncheckedUpdateManyWithoutContaOrigemNestedInput
    transferenciasDestino?: LancamentoUncheckedUpdateManyWithoutContaDestinoNestedInput
    recorrencias?: RecorrenciaUncheckedUpdateManyWithoutContaNestedInput
  }

  export type AcaoCobrancaCreateWithoutTituloInput = {
    id?: string
    tenantId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
  }

  export type AcaoCobrancaUncheckedCreateWithoutTituloInput = {
    id?: string
    tenantId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
  }

  export type AcaoCobrancaCreateOrConnectWithoutTituloInput = {
    where: AcaoCobrancaWhereUniqueInput
    create: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput>
  }

  export type AcaoCobrancaCreateManyTituloInputEnvelope = {
    data: AcaoCobrancaCreateManyTituloInput | AcaoCobrancaCreateManyTituloInput[]
    skipDuplicates?: boolean
  }

  export type AcordoCobrancaCreateWithoutTituloInput = {
    id?: string
    tenantId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    parcelas?: ParcelaAcordoCreateNestedManyWithoutAcordoInput
  }

  export type AcordoCobrancaUncheckedCreateWithoutTituloInput = {
    id?: string
    tenantId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    parcelas?: ParcelaAcordoUncheckedCreateNestedManyWithoutAcordoInput
  }

  export type AcordoCobrancaCreateOrConnectWithoutTituloInput = {
    where: AcordoCobrancaWhereUniqueInput
    create: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput>
  }

  export type AcordoCobrancaCreateManyTituloInputEnvelope = {
    data: AcordoCobrancaCreateManyTituloInput | AcordoCobrancaCreateManyTituloInput[]
    skipDuplicates?: boolean
  }

  export type AcaoCobrancaUpsertWithWhereUniqueWithoutTituloInput = {
    where: AcaoCobrancaWhereUniqueInput
    update: XOR<AcaoCobrancaUpdateWithoutTituloInput, AcaoCobrancaUncheckedUpdateWithoutTituloInput>
    create: XOR<AcaoCobrancaCreateWithoutTituloInput, AcaoCobrancaUncheckedCreateWithoutTituloInput>
  }

  export type AcaoCobrancaUpdateWithWhereUniqueWithoutTituloInput = {
    where: AcaoCobrancaWhereUniqueInput
    data: XOR<AcaoCobrancaUpdateWithoutTituloInput, AcaoCobrancaUncheckedUpdateWithoutTituloInput>
  }

  export type AcaoCobrancaUpdateManyWithWhereWithoutTituloInput = {
    where: AcaoCobrancaScalarWhereInput
    data: XOR<AcaoCobrancaUpdateManyMutationInput, AcaoCobrancaUncheckedUpdateManyWithoutTituloInput>
  }

  export type AcaoCobrancaScalarWhereInput = {
    AND?: AcaoCobrancaScalarWhereInput | AcaoCobrancaScalarWhereInput[]
    OR?: AcaoCobrancaScalarWhereInput[]
    NOT?: AcaoCobrancaScalarWhereInput | AcaoCobrancaScalarWhereInput[]
    id?: UuidFilter<"AcaoCobranca"> | string
    tenantId?: UuidFilter<"AcaoCobranca"> | string
    tituloId?: UuidFilter<"AcaoCobranca"> | string
    clienteNome?: StringFilter<"AcaoCobranca"> | string
    tipo?: EnumTipoAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.TipoAcaoCobranca
    mensagem?: StringFilter<"AcaoCobranca"> | string
    status?: EnumStatusAcaoCobrancaFilter<"AcaoCobranca"> | $Enums.StatusAcaoCobranca
    automatica?: BoolFilter<"AcaoCobranca"> | boolean
    detalhe?: StringNullableFilter<"AcaoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcaoCobranca"> | Date | string
  }

  export type AcordoCobrancaUpsertWithWhereUniqueWithoutTituloInput = {
    where: AcordoCobrancaWhereUniqueInput
    update: XOR<AcordoCobrancaUpdateWithoutTituloInput, AcordoCobrancaUncheckedUpdateWithoutTituloInput>
    create: XOR<AcordoCobrancaCreateWithoutTituloInput, AcordoCobrancaUncheckedCreateWithoutTituloInput>
  }

  export type AcordoCobrancaUpdateWithWhereUniqueWithoutTituloInput = {
    where: AcordoCobrancaWhereUniqueInput
    data: XOR<AcordoCobrancaUpdateWithoutTituloInput, AcordoCobrancaUncheckedUpdateWithoutTituloInput>
  }

  export type AcordoCobrancaUpdateManyWithWhereWithoutTituloInput = {
    where: AcordoCobrancaScalarWhereInput
    data: XOR<AcordoCobrancaUpdateManyMutationInput, AcordoCobrancaUncheckedUpdateManyWithoutTituloInput>
  }

  export type AcordoCobrancaScalarWhereInput = {
    AND?: AcordoCobrancaScalarWhereInput | AcordoCobrancaScalarWhereInput[]
    OR?: AcordoCobrancaScalarWhereInput[]
    NOT?: AcordoCobrancaScalarWhereInput | AcordoCobrancaScalarWhereInput[]
    id?: UuidFilter<"AcordoCobranca"> | string
    tenantId?: UuidFilter<"AcordoCobranca"> | string
    tituloId?: UuidFilter<"AcordoCobranca"> | string
    clienteId?: UuidNullableFilter<"AcordoCobranca"> | string | null
    clienteNome?: StringFilter<"AcordoCobranca"> | string
    valorOriginal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFilter<"AcordoCobranca"> | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFilter<"AcordoCobranca"> | number
    status?: EnumStatusAcordoCobrancaFilter<"AcordoCobranca"> | $Enums.StatusAcordoCobranca
    observacao?: StringNullableFilter<"AcordoCobranca"> | string | null
    criadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
    atualizadoEm?: DateTimeFilter<"AcordoCobranca"> | Date | string
  }

  export type TituloCobrancaCreateWithoutAcoesInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acordos?: AcordoCobrancaCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaUncheckedCreateWithoutAcoesInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acordos?: AcordoCobrancaUncheckedCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaCreateOrConnectWithoutAcoesInput = {
    where: TituloCobrancaWhereUniqueInput
    create: XOR<TituloCobrancaCreateWithoutAcoesInput, TituloCobrancaUncheckedCreateWithoutAcoesInput>
  }

  export type TituloCobrancaUpsertWithoutAcoesInput = {
    update: XOR<TituloCobrancaUpdateWithoutAcoesInput, TituloCobrancaUncheckedUpdateWithoutAcoesInput>
    create: XOR<TituloCobrancaCreateWithoutAcoesInput, TituloCobrancaUncheckedCreateWithoutAcoesInput>
    where?: TituloCobrancaWhereInput
  }

  export type TituloCobrancaUpdateToOneWithWhereWithoutAcoesInput = {
    where?: TituloCobrancaWhereInput
    data: XOR<TituloCobrancaUpdateWithoutAcoesInput, TituloCobrancaUncheckedUpdateWithoutAcoesInput>
  }

  export type TituloCobrancaUpdateWithoutAcoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acordos?: AcordoCobrancaUpdateManyWithoutTituloNestedInput
  }

  export type TituloCobrancaUncheckedUpdateWithoutAcoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acordos?: AcordoCobrancaUncheckedUpdateManyWithoutTituloNestedInput
  }

  export type TituloCobrancaCreateWithoutAcordosInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acoes?: AcaoCobrancaCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaUncheckedCreateWithoutAcordosInput = {
    id?: string
    tenantId: string
    lancamentoId?: string | null
    pedidoId?: string | null
    clienteId?: string | null
    clienteNome: string
    clienteTelefone?: string | null
    clienteEmail?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    status?: $Enums.StatusTituloCobranca
    prioridade?: $Enums.PrioridadeCobranca
    tentativas?: number
    ultimaAcaoEm?: Date | string | null
    canalUltimaAcao?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    acoes?: AcaoCobrancaUncheckedCreateNestedManyWithoutTituloInput
  }

  export type TituloCobrancaCreateOrConnectWithoutAcordosInput = {
    where: TituloCobrancaWhereUniqueInput
    create: XOR<TituloCobrancaCreateWithoutAcordosInput, TituloCobrancaUncheckedCreateWithoutAcordosInput>
  }

  export type ParcelaAcordoCreateWithoutAcordoInput = {
    id?: string
    tenantId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
  }

  export type ParcelaAcordoUncheckedCreateWithoutAcordoInput = {
    id?: string
    tenantId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
  }

  export type ParcelaAcordoCreateOrConnectWithoutAcordoInput = {
    where: ParcelaAcordoWhereUniqueInput
    create: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput>
  }

  export type ParcelaAcordoCreateManyAcordoInputEnvelope = {
    data: ParcelaAcordoCreateManyAcordoInput | ParcelaAcordoCreateManyAcordoInput[]
    skipDuplicates?: boolean
  }

  export type TituloCobrancaUpsertWithoutAcordosInput = {
    update: XOR<TituloCobrancaUpdateWithoutAcordosInput, TituloCobrancaUncheckedUpdateWithoutAcordosInput>
    create: XOR<TituloCobrancaCreateWithoutAcordosInput, TituloCobrancaUncheckedCreateWithoutAcordosInput>
    where?: TituloCobrancaWhereInput
  }

  export type TituloCobrancaUpdateToOneWithWhereWithoutAcordosInput = {
    where?: TituloCobrancaWhereInput
    data: XOR<TituloCobrancaUpdateWithoutAcordosInput, TituloCobrancaUncheckedUpdateWithoutAcordosInput>
  }

  export type TituloCobrancaUpdateWithoutAcordosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acoes?: AcaoCobrancaUpdateManyWithoutTituloNestedInput
  }

  export type TituloCobrancaUncheckedUpdateWithoutAcordosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    lancamentoId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteTelefone?: NullableStringFieldUpdateOperationsInput | string | null
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumStatusTituloCobrancaFieldUpdateOperationsInput | $Enums.StatusTituloCobranca
    prioridade?: EnumPrioridadeCobrancaFieldUpdateOperationsInput | $Enums.PrioridadeCobranca
    tentativas?: IntFieldUpdateOperationsInput | number
    ultimaAcaoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canalUltimaAcao?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    acoes?: AcaoCobrancaUncheckedUpdateManyWithoutTituloNestedInput
  }

  export type ParcelaAcordoUpsertWithWhereUniqueWithoutAcordoInput = {
    where: ParcelaAcordoWhereUniqueInput
    update: XOR<ParcelaAcordoUpdateWithoutAcordoInput, ParcelaAcordoUncheckedUpdateWithoutAcordoInput>
    create: XOR<ParcelaAcordoCreateWithoutAcordoInput, ParcelaAcordoUncheckedCreateWithoutAcordoInput>
  }

  export type ParcelaAcordoUpdateWithWhereUniqueWithoutAcordoInput = {
    where: ParcelaAcordoWhereUniqueInput
    data: XOR<ParcelaAcordoUpdateWithoutAcordoInput, ParcelaAcordoUncheckedUpdateWithoutAcordoInput>
  }

  export type ParcelaAcordoUpdateManyWithWhereWithoutAcordoInput = {
    where: ParcelaAcordoScalarWhereInput
    data: XOR<ParcelaAcordoUpdateManyMutationInput, ParcelaAcordoUncheckedUpdateManyWithoutAcordoInput>
  }

  export type ParcelaAcordoScalarWhereInput = {
    AND?: ParcelaAcordoScalarWhereInput | ParcelaAcordoScalarWhereInput[]
    OR?: ParcelaAcordoScalarWhereInput[]
    NOT?: ParcelaAcordoScalarWhereInput | ParcelaAcordoScalarWhereInput[]
    id?: UuidFilter<"ParcelaAcordo"> | string
    tenantId?: UuidFilter<"ParcelaAcordo"> | string
    acordoId?: UuidFilter<"ParcelaAcordo"> | string
    numero?: IntFilter<"ParcelaAcordo"> | number
    valor?: DecimalFilter<"ParcelaAcordo"> | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFilter<"ParcelaAcordo"> | Date | string
    pago?: BoolFilter<"ParcelaAcordo"> | boolean
    pagoEm?: DateTimeNullableFilter<"ParcelaAcordo"> | Date | string | null
  }

  export type AcordoCobrancaCreateWithoutParcelasInput = {
    id?: string
    tenantId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    titulo: TituloCobrancaCreateNestedOneWithoutAcordosInput
  }

  export type AcordoCobrancaUncheckedCreateWithoutParcelasInput = {
    id?: string
    tenantId: string
    tituloId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type AcordoCobrancaCreateOrConnectWithoutParcelasInput = {
    where: AcordoCobrancaWhereUniqueInput
    create: XOR<AcordoCobrancaCreateWithoutParcelasInput, AcordoCobrancaUncheckedCreateWithoutParcelasInput>
  }

  export type AcordoCobrancaUpsertWithoutParcelasInput = {
    update: XOR<AcordoCobrancaUpdateWithoutParcelasInput, AcordoCobrancaUncheckedUpdateWithoutParcelasInput>
    create: XOR<AcordoCobrancaCreateWithoutParcelasInput, AcordoCobrancaUncheckedCreateWithoutParcelasInput>
    where?: AcordoCobrancaWhereInput
  }

  export type AcordoCobrancaUpdateToOneWithWhereWithoutParcelasInput = {
    where?: AcordoCobrancaWhereInput
    data: XOR<AcordoCobrancaUpdateWithoutParcelasInput, AcordoCobrancaUncheckedUpdateWithoutParcelasInput>
  }

  export type AcordoCobrancaUpdateWithoutParcelasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    titulo?: TituloCobrancaUpdateOneRequiredWithoutAcordosNestedInput
  }

  export type AcordoCobrancaUncheckedUpdateWithoutParcelasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tituloId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LancamentoCreateManyContaInput = {
    id?: string
    tenantId: string
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoCreateManyContaOrigemInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaDestinoId?: string | null
  }

  export type LancamentoCreateManyContaDestinoInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    recorrenciaId?: string | null
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
  }

  export type RecorrenciaCreateManyContaInput = {
    id?: string
    tenantId: string
    descricao: string
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    valor: Decimal | DecimalJsLike | number | string
    frequencia: $Enums.FrequenciaRecorrencia
    diaVencimento?: number | null
    proximaGeracao: Date | string
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ConciliacaoBancariaCreateManyContaInput = {
    id?: string
    tenantId: string
    dataInicio: Date | string
    dataFim: Date | string
    saldoInicial: Decimal | DecimalJsLike | number | string
    saldoFinal: Decimal | DecimalJsLike | number | string
    status?: $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type LancamentoUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    recorrencia?: RecorrenciaUpdateOneWithoutLancamentosNestedInput
    contaOrigem?: ContaFinanceiraUpdateOneWithoutTransferenciasOrigemNestedInput
    contaDestino?: ContaFinanceiraUpdateOneWithoutTransferenciasDestinoNestedInput
  }

  export type LancamentoUncheckedUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUncheckedUpdateManyWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUpdateWithoutContaOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutLancamentosNestedInput
    recorrencia?: RecorrenciaUpdateOneWithoutLancamentosNestedInput
    contaDestino?: ContaFinanceiraUpdateOneWithoutTransferenciasDestinoNestedInput
  }

  export type LancamentoUncheckedUpdateWithoutContaOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUncheckedUpdateManyWithoutContaOrigemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUpdateWithoutContaDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutLancamentosNestedInput
    recorrencia?: RecorrenciaUpdateOneWithoutLancamentosNestedInput
    contaOrigem?: ContaFinanceiraUpdateOneWithoutTransferenciasOrigemNestedInput
  }

  export type LancamentoUncheckedUpdateWithoutContaDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUncheckedUpdateManyWithoutContaDestinoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    recorrenciaId?: NullableStringFieldUpdateOperationsInput | string | null
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RecorrenciaUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUpdateManyWithoutRecorrenciaNestedInput
  }

  export type RecorrenciaUncheckedUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lancamentos?: LancamentoUncheckedUpdateManyWithoutRecorrenciaNestedInput
  }

  export type RecorrenciaUncheckedUpdateManyWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequencia?: EnumFrequenciaRecorrenciaFieldUpdateOperationsInput | $Enums.FrequenciaRecorrencia
    diaVencimento?: NullableIntFieldUpdateOperationsInput | number | null
    proximaGeracao?: DateTimeFieldUpdateOperationsInput | Date | string
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaUncheckedUpdateWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConciliacaoBancariaUncheckedUpdateManyWithoutContaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    dataInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    dataFim?: DateTimeFieldUpdateOperationsInput | Date | string
    saldoInicial?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    saldoFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumStatusConciliacaoFieldUpdateOperationsInput | $Enums.StatusConciliacao
    divergencias?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoriaFinanceiraCreateManyPaiInput = {
    id?: string
    tenantId: string
    nome: string
    tipo: $Enums.TipoCategoriaFinanceira
    icone?: string | null
    cor?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type CategoriaFinanceiraUpdateWithoutPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    filhos?: CategoriaFinanceiraUpdateManyWithoutPaiNestedInput
  }

  export type CategoriaFinanceiraUncheckedUpdateWithoutPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    filhos?: CategoriaFinanceiraUncheckedUpdateManyWithoutPaiNestedInput
  }

  export type CategoriaFinanceiraUncheckedUpdateManyWithoutPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoCategoriaFinanceiraFieldUpdateOperationsInput | $Enums.TipoCategoriaFinanceira
    icone?: NullableStringFieldUpdateOperationsInput | string | null
    cor?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LancamentoCreateManyRecorrenciaInput = {
    id?: string
    tenantId: string
    contaId?: string | null
    usuarioId?: string | null
    tipo: $Enums.TipoLancamento
    categoria?: string | null
    subcategoria?: string | null
    descricao: string
    valor: Decimal | DecimalJsLike | number | string
    dataVencimento: Date | string
    dataPagamento?: Date | string | null
    dataCompetencia?: Date | string | null
    status?: $Enums.StatusLancamento
    formaPagamento?: $Enums.FormaPagamento | null
    numeroParcela?: number | null
    totalParcelas?: number | null
    parcelaOrigemId?: string | null
    pedidoId?: string | null
    notaFiscalId?: string | null
    fornecedor?: string | null
    cliente?: string | null
    observacao?: string | null
    tags?: LancamentoCreatetagsInput | string[]
    recorrente?: boolean
    anexoUrl?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contaOrigemId?: string | null
    contaDestinoId?: string | null
  }

  export type LancamentoUpdateWithoutRecorrenciaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    conta?: ContaFinanceiraUpdateOneWithoutLancamentosNestedInput
    contaOrigem?: ContaFinanceiraUpdateOneWithoutTransferenciasOrigemNestedInput
    contaDestino?: ContaFinanceiraUpdateOneWithoutTransferenciasDestinoNestedInput
  }

  export type LancamentoUncheckedUpdateWithoutRecorrenciaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LancamentoUncheckedUpdateManyWithoutRecorrenciaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    contaId?: NullableStringFieldUpdateOperationsInput | string | null
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    tipo?: EnumTipoLancamentoFieldUpdateOperationsInput | $Enums.TipoLancamento
    categoria?: NullableStringFieldUpdateOperationsInput | string | null
    subcategoria?: NullableStringFieldUpdateOperationsInput | string | null
    descricao?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    dataVencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCompetencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusLancamentoFieldUpdateOperationsInput | $Enums.StatusLancamento
    formaPagamento?: NullableEnumFormaPagamentoFieldUpdateOperationsInput | $Enums.FormaPagamento | null
    numeroParcela?: NullableIntFieldUpdateOperationsInput | number | null
    totalParcelas?: NullableIntFieldUpdateOperationsInput | number | null
    parcelaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    fornecedor?: NullableStringFieldUpdateOperationsInput | string | null
    cliente?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: LancamentoUpdatetagsInput | string[]
    recorrente?: BoolFieldUpdateOperationsInput | boolean
    anexoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contaOrigemId?: NullableStringFieldUpdateOperationsInput | string | null
    contaDestinoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AcaoCobrancaCreateManyTituloInput = {
    id?: string
    tenantId: string
    clienteNome: string
    tipo: $Enums.TipoAcaoCobranca
    mensagem: string
    status?: $Enums.StatusAcaoCobranca
    automatica?: boolean
    detalhe?: string | null
    criadoEm?: Date | string
  }

  export type AcordoCobrancaCreateManyTituloInput = {
    id?: string
    tenantId: string
    clienteId?: string | null
    clienteNome: string
    valorOriginal: Decimal | DecimalJsLike | number | string
    descontoAplicado: Decimal | DecimalJsLike | number | string
    valorFinal: Decimal | DecimalJsLike | number | string
    numeroParcelas: number
    status?: $Enums.StatusAcordoCobranca
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type AcaoCobrancaUpdateWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcaoCobrancaUncheckedUpdateWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcaoCobrancaUncheckedUpdateManyWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteNome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoAcaoCobrancaFieldUpdateOperationsInput | $Enums.TipoAcaoCobranca
    mensagem?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusAcaoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcaoCobranca
    automatica?: BoolFieldUpdateOperationsInput | boolean
    detalhe?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AcordoCobrancaUpdateWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    parcelas?: ParcelaAcordoUpdateManyWithoutAcordoNestedInput
  }

  export type AcordoCobrancaUncheckedUpdateWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    parcelas?: ParcelaAcordoUncheckedUpdateManyWithoutAcordoNestedInput
  }

  export type AcordoCobrancaUncheckedUpdateManyWithoutTituloInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    valorOriginal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    descontoAplicado?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFinal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    numeroParcelas?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusAcordoCobrancaFieldUpdateOperationsInput | $Enums.StatusAcordoCobranca
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ParcelaAcordoCreateManyAcordoInput = {
    id?: string
    tenantId: string
    numero: number
    valor: Decimal | DecimalJsLike | number | string
    vencimento: Date | string
    pago?: boolean
    pagoEm?: Date | string | null
  }

  export type ParcelaAcordoUpdateWithoutAcordoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParcelaAcordoUncheckedUpdateWithoutAcordoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ParcelaAcordoUncheckedUpdateManyWithoutAcordoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vencimento?: DateTimeFieldUpdateOperationsInput | Date | string
    pago?: BoolFieldUpdateOperationsInput | boolean
    pagoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ContaFinanceiraCountOutputTypeDefaultArgs instead
     */
    export type ContaFinanceiraCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoriaFinanceiraCountOutputTypeDefaultArgs instead
     */
    export type CategoriaFinanceiraCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoriaFinanceiraCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecorrenciaCountOutputTypeDefaultArgs instead
     */
    export type RecorrenciaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecorrenciaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TituloCobrancaCountOutputTypeDefaultArgs instead
     */
    export type TituloCobrancaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TituloCobrancaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AcordoCobrancaCountOutputTypeDefaultArgs instead
     */
    export type AcordoCobrancaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AcordoCobrancaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ContaFinanceiraDefaultArgs instead
     */
    export type ContaFinanceiraArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContaFinanceiraDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LancamentoDefaultArgs instead
     */
    export type LancamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LancamentoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoriaFinanceiraDefaultArgs instead
     */
    export type CategoriaFinanceiraArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoriaFinanceiraDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RecorrenciaDefaultArgs instead
     */
    export type RecorrenciaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RecorrenciaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConciliacaoBancariaDefaultArgs instead
     */
    export type ConciliacaoBancariaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConciliacaoBancariaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EventoProcessadoDefaultArgs instead
     */
    export type EventoProcessadoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EventoProcessadoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DREDefaultArgs instead
     */
    export type DREArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DREDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TituloCobrancaDefaultArgs instead
     */
    export type TituloCobrancaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TituloCobrancaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AcaoCobrancaDefaultArgs instead
     */
    export type AcaoCobrancaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AcaoCobrancaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AcordoCobrancaDefaultArgs instead
     */
    export type AcordoCobrancaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AcordoCobrancaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ParcelaAcordoDefaultArgs instead
     */
    export type ParcelaAcordoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ParcelaAcordoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConfiguracaoCobrancaDefaultArgs instead
     */
    export type ConfiguracaoCobrancaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConfiguracaoCobrancaDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}