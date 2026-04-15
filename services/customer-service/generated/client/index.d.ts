
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
 * Model Cliente
 * 
 */
export type Cliente = $Result.DefaultSelection<Prisma.$ClientePayload>
/**
 * Model EnderecoCliente
 * 
 */
export type EnderecoCliente = $Result.DefaultSelection<Prisma.$EnderecoClientePayload>
/**
 * Model ContatoCliente
 * 
 */
export type ContatoCliente = $Result.DefaultSelection<Prisma.$ContatoClientePayload>
/**
 * Model InteracaoCliente
 * 
 */
export type InteracaoCliente = $Result.DefaultSelection<Prisma.$InteracaoClientePayload>
/**
 * Model SegmentoCliente
 * 
 */
export type SegmentoCliente = $Result.DefaultSelection<Prisma.$SegmentoClientePayload>
/**
 * Model ClienteSegmento
 * 
 */
export type ClienteSegmento = $Result.DefaultSelection<Prisma.$ClienteSegmentoPayload>
/**
 * Model ImportacaoCliente
 * 
 */
export type ImportacaoCliente = $Result.DefaultSelection<Prisma.$ImportacaoClientePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoCliente: {
  PESSOA_FISICA: 'PESSOA_FISICA',
  PESSOA_JURIDICA: 'PESSOA_JURIDICA'
};

export type TipoCliente = (typeof TipoCliente)[keyof typeof TipoCliente]


export const StatusCliente: {
  PROSPECT: 'PROSPECT',
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  BLOQUEADO: 'BLOQUEADO'
};

export type StatusCliente = (typeof StatusCliente)[keyof typeof StatusCliente]


export const OrigemCliente: {
  MANUAL: 'MANUAL',
  MARKETPLACE: 'MARKETPLACE',
  SITE: 'SITE',
  INDICACAO: 'INDICACAO',
  IMPORTACAO: 'IMPORTACAO'
};

export type OrigemCliente = (typeof OrigemCliente)[keyof typeof OrigemCliente]


export const TipoEndereco: {
  ENTREGA: 'ENTREGA',
  COBRANCA: 'COBRANCA',
  AMBOS: 'AMBOS'
};

export type TipoEndereco = (typeof TipoEndereco)[keyof typeof TipoEndereco]


export const TipoInteracao: {
  VENDA: 'VENDA',
  ATENDIMENTO: 'ATENDIMENTO',
  RECLAMACAO: 'RECLAMACAO',
  DEVOLUCAO: 'DEVOLUCAO',
  EMAIL: 'EMAIL',
  TELEFONE: 'TELEFONE',
  CHAT: 'CHAT',
  MARKETPLACE: 'MARKETPLACE',
  NOTA: 'NOTA'
};

export type TipoInteracao = (typeof TipoInteracao)[keyof typeof TipoInteracao]


export const CanalInteracao: {
  TELEFONE: 'TELEFONE',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  CHAT: 'CHAT',
  PRESENCIAL: 'PRESENCIAL',
  MARKETPLACE: 'MARKETPLACE'
};

export type CanalInteracao = (typeof CanalInteracao)[keyof typeof CanalInteracao]


export const FormatoImportacao: {
  CSV: 'CSV',
  XLSX: 'XLSX'
};

export type FormatoImportacao = (typeof FormatoImportacao)[keyof typeof FormatoImportacao]


export const StatusImportacao: {
  PENDENTE: 'PENDENTE',
  PROCESSANDO: 'PROCESSANDO',
  CONCLUIDO: 'CONCLUIDO',
  ERRO: 'ERRO'
};

export type StatusImportacao = (typeof StatusImportacao)[keyof typeof StatusImportacao]

}

export type TipoCliente = $Enums.TipoCliente

export const TipoCliente: typeof $Enums.TipoCliente

export type StatusCliente = $Enums.StatusCliente

export const StatusCliente: typeof $Enums.StatusCliente

export type OrigemCliente = $Enums.OrigemCliente

export const OrigemCliente: typeof $Enums.OrigemCliente

export type TipoEndereco = $Enums.TipoEndereco

export const TipoEndereco: typeof $Enums.TipoEndereco

export type TipoInteracao = $Enums.TipoInteracao

export const TipoInteracao: typeof $Enums.TipoInteracao

export type CanalInteracao = $Enums.CanalInteracao

export const CanalInteracao: typeof $Enums.CanalInteracao

export type FormatoImportacao = $Enums.FormatoImportacao

export const FormatoImportacao: typeof $Enums.FormatoImportacao

export type StatusImportacao = $Enums.StatusImportacao

export const StatusImportacao: typeof $Enums.StatusImportacao

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Clientes
 * const clientes = await prisma.cliente.findMany()
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
   * // Fetch zero or more Clientes
   * const clientes = await prisma.cliente.findMany()
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
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<ExtArgs>;

  /**
   * `prisma.enderecoCliente`: Exposes CRUD operations for the **EnderecoCliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EnderecoClientes
    * const enderecoClientes = await prisma.enderecoCliente.findMany()
    * ```
    */
  get enderecoCliente(): Prisma.EnderecoClienteDelegate<ExtArgs>;

  /**
   * `prisma.contatoCliente`: Exposes CRUD operations for the **ContatoCliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ContatoClientes
    * const contatoClientes = await prisma.contatoCliente.findMany()
    * ```
    */
  get contatoCliente(): Prisma.ContatoClienteDelegate<ExtArgs>;

  /**
   * `prisma.interacaoCliente`: Exposes CRUD operations for the **InteracaoCliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InteracaoClientes
    * const interacaoClientes = await prisma.interacaoCliente.findMany()
    * ```
    */
  get interacaoCliente(): Prisma.InteracaoClienteDelegate<ExtArgs>;

  /**
   * `prisma.segmentoCliente`: Exposes CRUD operations for the **SegmentoCliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SegmentoClientes
    * const segmentoClientes = await prisma.segmentoCliente.findMany()
    * ```
    */
  get segmentoCliente(): Prisma.SegmentoClienteDelegate<ExtArgs>;

  /**
   * `prisma.clienteSegmento`: Exposes CRUD operations for the **ClienteSegmento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClienteSegmentos
    * const clienteSegmentos = await prisma.clienteSegmento.findMany()
    * ```
    */
  get clienteSegmento(): Prisma.ClienteSegmentoDelegate<ExtArgs>;

  /**
   * `prisma.importacaoCliente`: Exposes CRUD operations for the **ImportacaoCliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportacaoClientes
    * const importacaoClientes = await prisma.importacaoCliente.findMany()
    * ```
    */
  get importacaoCliente(): Prisma.ImportacaoClienteDelegate<ExtArgs>;
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
    Cliente: 'Cliente',
    EnderecoCliente: 'EnderecoCliente',
    ContatoCliente: 'ContatoCliente',
    InteracaoCliente: 'InteracaoCliente',
    SegmentoCliente: 'SegmentoCliente',
    ClienteSegmento: 'ClienteSegmento',
    ImportacaoCliente: 'ImportacaoCliente'
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
      modelProps: "cliente" | "enderecoCliente" | "contatoCliente" | "interacaoCliente" | "segmentoCliente" | "clienteSegmento" | "importacaoCliente"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Cliente: {
        payload: Prisma.$ClientePayload<ExtArgs>
        fields: Prisma.ClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findFirst: {
            args: Prisma.ClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findMany: {
            args: Prisma.ClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          create: {
            args: Prisma.ClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          createMany: {
            args: Prisma.ClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          delete: {
            args: Prisma.ClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          update: {
            args: Prisma.ClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          deleteMany: {
            args: Prisma.ClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          aggregate: {
            args: Prisma.ClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCliente>
          }
          groupBy: {
            args: Prisma.ClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteCountAggregateOutputType> | number
          }
        }
      }
      EnderecoCliente: {
        payload: Prisma.$EnderecoClientePayload<ExtArgs>
        fields: Prisma.EnderecoClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnderecoClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnderecoClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          findFirst: {
            args: Prisma.EnderecoClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnderecoClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          findMany: {
            args: Prisma.EnderecoClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>[]
          }
          create: {
            args: Prisma.EnderecoClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          createMany: {
            args: Prisma.EnderecoClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnderecoClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>[]
          }
          delete: {
            args: Prisma.EnderecoClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          update: {
            args: Prisma.EnderecoClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          deleteMany: {
            args: Prisma.EnderecoClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnderecoClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnderecoClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnderecoClientePayload>
          }
          aggregate: {
            args: Prisma.EnderecoClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnderecoCliente>
          }
          groupBy: {
            args: Prisma.EnderecoClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnderecoClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnderecoClienteCountArgs<ExtArgs>
            result: $Utils.Optional<EnderecoClienteCountAggregateOutputType> | number
          }
        }
      }
      ContatoCliente: {
        payload: Prisma.$ContatoClientePayload<ExtArgs>
        fields: Prisma.ContatoClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ContatoClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ContatoClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          findFirst: {
            args: Prisma.ContatoClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ContatoClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          findMany: {
            args: Prisma.ContatoClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>[]
          }
          create: {
            args: Prisma.ContatoClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          createMany: {
            args: Prisma.ContatoClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ContatoClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>[]
          }
          delete: {
            args: Prisma.ContatoClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          update: {
            args: Prisma.ContatoClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          deleteMany: {
            args: Prisma.ContatoClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ContatoClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ContatoClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ContatoClientePayload>
          }
          aggregate: {
            args: Prisma.ContatoClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateContatoCliente>
          }
          groupBy: {
            args: Prisma.ContatoClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ContatoClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ContatoClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ContatoClienteCountAggregateOutputType> | number
          }
        }
      }
      InteracaoCliente: {
        payload: Prisma.$InteracaoClientePayload<ExtArgs>
        fields: Prisma.InteracaoClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InteracaoClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InteracaoClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          findFirst: {
            args: Prisma.InteracaoClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InteracaoClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          findMany: {
            args: Prisma.InteracaoClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>[]
          }
          create: {
            args: Prisma.InteracaoClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          createMany: {
            args: Prisma.InteracaoClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InteracaoClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>[]
          }
          delete: {
            args: Prisma.InteracaoClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          update: {
            args: Prisma.InteracaoClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          deleteMany: {
            args: Prisma.InteracaoClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InteracaoClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InteracaoClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteracaoClientePayload>
          }
          aggregate: {
            args: Prisma.InteracaoClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInteracaoCliente>
          }
          groupBy: {
            args: Prisma.InteracaoClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<InteracaoClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.InteracaoClienteCountArgs<ExtArgs>
            result: $Utils.Optional<InteracaoClienteCountAggregateOutputType> | number
          }
        }
      }
      SegmentoCliente: {
        payload: Prisma.$SegmentoClientePayload<ExtArgs>
        fields: Prisma.SegmentoClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SegmentoClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SegmentoClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          findFirst: {
            args: Prisma.SegmentoClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SegmentoClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          findMany: {
            args: Prisma.SegmentoClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>[]
          }
          create: {
            args: Prisma.SegmentoClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          createMany: {
            args: Prisma.SegmentoClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SegmentoClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>[]
          }
          delete: {
            args: Prisma.SegmentoClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          update: {
            args: Prisma.SegmentoClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          deleteMany: {
            args: Prisma.SegmentoClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SegmentoClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SegmentoClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SegmentoClientePayload>
          }
          aggregate: {
            args: Prisma.SegmentoClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSegmentoCliente>
          }
          groupBy: {
            args: Prisma.SegmentoClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<SegmentoClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.SegmentoClienteCountArgs<ExtArgs>
            result: $Utils.Optional<SegmentoClienteCountAggregateOutputType> | number
          }
        }
      }
      ClienteSegmento: {
        payload: Prisma.$ClienteSegmentoPayload<ExtArgs>
        fields: Prisma.ClienteSegmentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteSegmentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteSegmentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          findFirst: {
            args: Prisma.ClienteSegmentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteSegmentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          findMany: {
            args: Prisma.ClienteSegmentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>[]
          }
          create: {
            args: Prisma.ClienteSegmentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          createMany: {
            args: Prisma.ClienteSegmentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteSegmentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>[]
          }
          delete: {
            args: Prisma.ClienteSegmentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          update: {
            args: Prisma.ClienteSegmentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          deleteMany: {
            args: Prisma.ClienteSegmentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteSegmentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClienteSegmentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClienteSegmentoPayload>
          }
          aggregate: {
            args: Prisma.ClienteSegmentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClienteSegmento>
          }
          groupBy: {
            args: Prisma.ClienteSegmentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteSegmentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteSegmentoCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteSegmentoCountAggregateOutputType> | number
          }
        }
      }
      ImportacaoCliente: {
        payload: Prisma.$ImportacaoClientePayload<ExtArgs>
        fields: Prisma.ImportacaoClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportacaoClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportacaoClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          findFirst: {
            args: Prisma.ImportacaoClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportacaoClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          findMany: {
            args: Prisma.ImportacaoClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>[]
          }
          create: {
            args: Prisma.ImportacaoClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          createMany: {
            args: Prisma.ImportacaoClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportacaoClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>[]
          }
          delete: {
            args: Prisma.ImportacaoClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          update: {
            args: Prisma.ImportacaoClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          deleteMany: {
            args: Prisma.ImportacaoClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportacaoClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImportacaoClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportacaoClientePayload>
          }
          aggregate: {
            args: Prisma.ImportacaoClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportacaoCliente>
          }
          groupBy: {
            args: Prisma.ImportacaoClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportacaoClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportacaoClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ImportacaoClienteCountAggregateOutputType> | number
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
   * Count Type ClienteCountOutputType
   */

  export type ClienteCountOutputType = {
    enderecos: number
    contatos: number
    interacoes: number
    segmentos: number
  }

  export type ClienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enderecos?: boolean | ClienteCountOutputTypeCountEnderecosArgs
    contatos?: boolean | ClienteCountOutputTypeCountContatosArgs
    interacoes?: boolean | ClienteCountOutputTypeCountInteracoesArgs
    segmentos?: boolean | ClienteCountOutputTypeCountSegmentosArgs
  }

  // Custom InputTypes
  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteCountOutputType
     */
    select?: ClienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountEnderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoClienteWhereInput
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountContatosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContatoClienteWhereInput
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountInteracoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteracaoClienteWhereInput
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountSegmentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteSegmentoWhereInput
  }


  /**
   * Count Type SegmentoClienteCountOutputType
   */

  export type SegmentoClienteCountOutputType = {
    clientes: number
  }

  export type SegmentoClienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientes?: boolean | SegmentoClienteCountOutputTypeCountClientesArgs
  }

  // Custom InputTypes
  /**
   * SegmentoClienteCountOutputType without action
   */
  export type SegmentoClienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoClienteCountOutputType
     */
    select?: SegmentoClienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SegmentoClienteCountOutputType without action
   */
  export type SegmentoClienteCountOutputTypeCountClientesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteSegmentoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Cliente
   */

  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteAvgAggregateOutputType = {
    score: number | null
    totalCompras: number | null
    valorTotalCompras: number | null
  }

  export type ClienteSumAggregateOutputType = {
    score: number | null
    totalCompras: number | null
    valorTotalCompras: number | null
  }

  export type ClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tipo: $Enums.TipoCliente | null
    nome: string | null
    nomeFantasia: string | null
    razaoSocial: string | null
    cpf: string | null
    cnpj: string | null
    inscricaoEstadual: string | null
    email: string | null
    emailSecundario: string | null
    telefone: string | null
    celular: string | null
    dataNascimento: Date | null
    genero: string | null
    observacoes: string | null
    score: number | null
    status: $Enums.StatusCliente | null
    origem: $Enums.OrigemCliente | null
    ultimaCompra: Date | null
    totalCompras: number | null
    valorTotalCompras: number | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    tipo: $Enums.TipoCliente | null
    nome: string | null
    nomeFantasia: string | null
    razaoSocial: string | null
    cpf: string | null
    cnpj: string | null
    inscricaoEstadual: string | null
    email: string | null
    emailSecundario: string | null
    telefone: string | null
    celular: string | null
    dataNascimento: Date | null
    genero: string | null
    observacoes: string | null
    score: number | null
    status: $Enums.StatusCliente | null
    origem: $Enums.OrigemCliente | null
    ultimaCompra: Date | null
    totalCompras: number | null
    valorTotalCompras: number | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    tipo: number
    nome: number
    nomeFantasia: number
    razaoSocial: number
    cpf: number
    cnpj: number
    inscricaoEstadual: number
    email: number
    emailSecundario: number
    telefone: number
    celular: number
    dataNascimento: number
    genero: number
    observacoes: number
    tags: number
    score: number
    status: number
    origem: number
    ultimaCompra: number
    totalCompras: number
    valorTotalCompras: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type ClienteAvgAggregateInputType = {
    score?: true
    totalCompras?: true
    valorTotalCompras?: true
  }

  export type ClienteSumAggregateInputType = {
    score?: true
    totalCompras?: true
    valorTotalCompras?: true
  }

  export type ClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    tipo?: true
    nome?: true
    nomeFantasia?: true
    razaoSocial?: true
    cpf?: true
    cnpj?: true
    inscricaoEstadual?: true
    email?: true
    emailSecundario?: true
    telefone?: true
    celular?: true
    dataNascimento?: true
    genero?: true
    observacoes?: true
    score?: true
    status?: true
    origem?: true
    ultimaCompra?: true
    totalCompras?: true
    valorTotalCompras?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    tipo?: true
    nome?: true
    nomeFantasia?: true
    razaoSocial?: true
    cpf?: true
    cnpj?: true
    inscricaoEstadual?: true
    email?: true
    emailSecundario?: true
    telefone?: true
    celular?: true
    dataNascimento?: true
    genero?: true
    observacoes?: true
    score?: true
    status?: true
    origem?: true
    ultimaCompra?: true
    totalCompras?: true
    valorTotalCompras?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    tipo?: true
    nome?: true
    nomeFantasia?: true
    razaoSocial?: true
    cpf?: true
    cnpj?: true
    inscricaoEstadual?: true
    email?: true
    emailSecundario?: true
    telefone?: true
    celular?: true
    dataNascimento?: true
    genero?: true
    observacoes?: true
    tags?: true
    score?: true
    status?: true
    origem?: true
    ultimaCompra?: true
    totalCompras?: true
    valorTotalCompras?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type ClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cliente to aggregate.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteWhereInput
    orderBy?: ClienteOrderByWithAggregationInput | ClienteOrderByWithAggregationInput[]
    by: ClienteScalarFieldEnum[] | ClienteScalarFieldEnum
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _avg?: ClienteAvgAggregateInputType
    _sum?: ClienteSumAggregateInputType
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }

  export type ClienteGroupByOutputType = {
    id: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia: string | null
    razaoSocial: string | null
    cpf: string | null
    cnpj: string | null
    inscricaoEstadual: string | null
    email: string
    emailSecundario: string | null
    telefone: string | null
    celular: string | null
    dataNascimento: Date | null
    genero: string | null
    observacoes: string | null
    tags: string[]
    score: number
    status: $Enums.StatusCliente
    origem: $Enums.OrigemCliente
    ultimaCompra: Date | null
    totalCompras: number
    valorTotalCompras: number
    criadoEm: Date
    atualizadoEm: Date
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tipo?: boolean
    nome?: boolean
    nomeFantasia?: boolean
    razaoSocial?: boolean
    cpf?: boolean
    cnpj?: boolean
    inscricaoEstadual?: boolean
    email?: boolean
    emailSecundario?: boolean
    telefone?: boolean
    celular?: boolean
    dataNascimento?: boolean
    genero?: boolean
    observacoes?: boolean
    tags?: boolean
    score?: boolean
    status?: boolean
    origem?: boolean
    ultimaCompra?: boolean
    totalCompras?: boolean
    valorTotalCompras?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    enderecos?: boolean | Cliente$enderecosArgs<ExtArgs>
    contatos?: boolean | Cliente$contatosArgs<ExtArgs>
    interacoes?: boolean | Cliente$interacoesArgs<ExtArgs>
    segmentos?: boolean | Cliente$segmentosArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    tipo?: boolean
    nome?: boolean
    nomeFantasia?: boolean
    razaoSocial?: boolean
    cpf?: boolean
    cnpj?: boolean
    inscricaoEstadual?: boolean
    email?: boolean
    emailSecundario?: boolean
    telefone?: boolean
    celular?: boolean
    dataNascimento?: boolean
    genero?: boolean
    observacoes?: boolean
    tags?: boolean
    score?: boolean
    status?: boolean
    origem?: boolean
    ultimaCompra?: boolean
    totalCompras?: boolean
    valorTotalCompras?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    tipo?: boolean
    nome?: boolean
    nomeFantasia?: boolean
    razaoSocial?: boolean
    cpf?: boolean
    cnpj?: boolean
    inscricaoEstadual?: boolean
    email?: boolean
    emailSecundario?: boolean
    telefone?: boolean
    celular?: boolean
    dataNascimento?: boolean
    genero?: boolean
    observacoes?: boolean
    tags?: boolean
    score?: boolean
    status?: boolean
    origem?: boolean
    ultimaCompra?: boolean
    totalCompras?: boolean
    valorTotalCompras?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type ClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enderecos?: boolean | Cliente$enderecosArgs<ExtArgs>
    contatos?: boolean | Cliente$contatosArgs<ExtArgs>
    interacoes?: boolean | Cliente$interacoesArgs<ExtArgs>
    segmentos?: boolean | Cliente$segmentosArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cliente"
    objects: {
      enderecos: Prisma.$EnderecoClientePayload<ExtArgs>[]
      contatos: Prisma.$ContatoClientePayload<ExtArgs>[]
      interacoes: Prisma.$InteracaoClientePayload<ExtArgs>[]
      segmentos: Prisma.$ClienteSegmentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      tipo: $Enums.TipoCliente
      nome: string
      nomeFantasia: string | null
      razaoSocial: string | null
      cpf: string | null
      cnpj: string | null
      inscricaoEstadual: string | null
      email: string
      emailSecundario: string | null
      telefone: string | null
      celular: string | null
      dataNascimento: Date | null
      genero: string | null
      observacoes: string | null
      tags: string[]
      score: number
      status: $Enums.StatusCliente
      origem: $Enums.OrigemCliente
      ultimaCompra: Date | null
      totalCompras: number
      valorTotalCompras: number
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["cliente"]>
    composites: {}
  }

  type ClienteGetPayload<S extends boolean | null | undefined | ClienteDefaultArgs> = $Result.GetResult<Prisma.$ClientePayload, S>

  type ClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClienteCountAggregateInputType | true
    }

  export interface ClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cliente'], meta: { name: 'Cliente' } }
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteFindUniqueArgs>(args: SelectSubset<T, ClienteFindUniqueArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Cliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClienteFindUniqueOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteFindFirstArgs>(args?: SelectSubset<T, ClienteFindFirstArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteFindManyArgs>(args?: SelectSubset<T, ClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
     */
    create<T extends ClienteCreateArgs>(args: SelectSubset<T, ClienteCreateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Clientes.
     * @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteCreateManyArgs>(args?: SelectSubset<T, ClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clientes and returns the data saved in the database.
     * @param {ClienteCreateManyAndReturnArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
     */
    delete<T extends ClienteDeleteArgs>(args: SelectSubset<T, ClienteDeleteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteUpdateArgs>(args: SelectSubset<T, ClienteUpdateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteDeleteManyArgs>(args?: SelectSubset<T, ClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteUpdateManyArgs>(args: SelectSubset<T, ClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
     */
    upsert<T extends ClienteUpsertArgs>(args: SelectSubset<T, ClienteUpsertArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): Prisma.PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
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
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cliente model
   */
  readonly fields: ClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enderecos<T extends Cliente$enderecosArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$enderecosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findMany"> | Null>
    contatos<T extends Cliente$contatosArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$contatosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findMany"> | Null>
    interacoes<T extends Cliente$interacoesArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$interacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findMany"> | Null>
    segmentos<T extends Cliente$segmentosArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$segmentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Cliente model
   */ 
  interface ClienteFieldRefs {
    readonly id: FieldRef<"Cliente", 'String'>
    readonly tenantId: FieldRef<"Cliente", 'String'>
    readonly tipo: FieldRef<"Cliente", 'TipoCliente'>
    readonly nome: FieldRef<"Cliente", 'String'>
    readonly nomeFantasia: FieldRef<"Cliente", 'String'>
    readonly razaoSocial: FieldRef<"Cliente", 'String'>
    readonly cpf: FieldRef<"Cliente", 'String'>
    readonly cnpj: FieldRef<"Cliente", 'String'>
    readonly inscricaoEstadual: FieldRef<"Cliente", 'String'>
    readonly email: FieldRef<"Cliente", 'String'>
    readonly emailSecundario: FieldRef<"Cliente", 'String'>
    readonly telefone: FieldRef<"Cliente", 'String'>
    readonly celular: FieldRef<"Cliente", 'String'>
    readonly dataNascimento: FieldRef<"Cliente", 'DateTime'>
    readonly genero: FieldRef<"Cliente", 'String'>
    readonly observacoes: FieldRef<"Cliente", 'String'>
    readonly tags: FieldRef<"Cliente", 'String[]'>
    readonly score: FieldRef<"Cliente", 'Int'>
    readonly status: FieldRef<"Cliente", 'StatusCliente'>
    readonly origem: FieldRef<"Cliente", 'OrigemCliente'>
    readonly ultimaCompra: FieldRef<"Cliente", 'DateTime'>
    readonly totalCompras: FieldRef<"Cliente", 'Int'>
    readonly valorTotalCompras: FieldRef<"Cliente", 'Int'>
    readonly criadoEm: FieldRef<"Cliente", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findUniqueOrThrow
   */
  export type ClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findFirstOrThrow
   */
  export type ClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Clientes to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente create
   */
  export type ClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a Cliente.
     */
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }

  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente createManyAndReturn
   */
  export type ClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente update
   */
  export type ClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a Cliente.
     */
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
  }

  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     */
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     */
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }

  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter which Cliente to delete.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clientes to delete
     */
    where?: ClienteWhereInput
  }

  /**
   * Cliente.enderecos
   */
  export type Cliente$enderecosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    where?: EnderecoClienteWhereInput
    orderBy?: EnderecoClienteOrderByWithRelationInput | EnderecoClienteOrderByWithRelationInput[]
    cursor?: EnderecoClienteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnderecoClienteScalarFieldEnum | EnderecoClienteScalarFieldEnum[]
  }

  /**
   * Cliente.contatos
   */
  export type Cliente$contatosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    where?: ContatoClienteWhereInput
    orderBy?: ContatoClienteOrderByWithRelationInput | ContatoClienteOrderByWithRelationInput[]
    cursor?: ContatoClienteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ContatoClienteScalarFieldEnum | ContatoClienteScalarFieldEnum[]
  }

  /**
   * Cliente.interacoes
   */
  export type Cliente$interacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    where?: InteracaoClienteWhereInput
    orderBy?: InteracaoClienteOrderByWithRelationInput | InteracaoClienteOrderByWithRelationInput[]
    cursor?: InteracaoClienteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InteracaoClienteScalarFieldEnum | InteracaoClienteScalarFieldEnum[]
  }

  /**
   * Cliente.segmentos
   */
  export type Cliente$segmentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    where?: ClienteSegmentoWhereInput
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    cursor?: ClienteSegmentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClienteSegmentoScalarFieldEnum | ClienteSegmentoScalarFieldEnum[]
  }

  /**
   * Cliente without action
   */
  export type ClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
  }


  /**
   * Model EnderecoCliente
   */

  export type AggregateEnderecoCliente = {
    _count: EnderecoClienteCountAggregateOutputType | null
    _min: EnderecoClienteMinAggregateOutputType | null
    _max: EnderecoClienteMaxAggregateOutputType | null
  }

  export type EnderecoClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    tipo: $Enums.TipoEndereco | null
    logradouro: string | null
    numero: string | null
    complemento: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
    cep: string | null
    pais: string | null
    padrao: boolean | null
    criadoEm: Date | null
  }

  export type EnderecoClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    tipo: $Enums.TipoEndereco | null
    logradouro: string | null
    numero: string | null
    complemento: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
    cep: string | null
    pais: string | null
    padrao: boolean | null
    criadoEm: Date | null
  }

  export type EnderecoClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    clienteId: number
    tipo: number
    logradouro: number
    numero: number
    complemento: number
    bairro: number
    cidade: number
    estado: number
    cep: number
    pais: number
    padrao: number
    criadoEm: number
    _all: number
  }


  export type EnderecoClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    logradouro?: true
    numero?: true
    complemento?: true
    bairro?: true
    cidade?: true
    estado?: true
    cep?: true
    pais?: true
    padrao?: true
    criadoEm?: true
  }

  export type EnderecoClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    logradouro?: true
    numero?: true
    complemento?: true
    bairro?: true
    cidade?: true
    estado?: true
    cep?: true
    pais?: true
    padrao?: true
    criadoEm?: true
  }

  export type EnderecoClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    logradouro?: true
    numero?: true
    complemento?: true
    bairro?: true
    cidade?: true
    estado?: true
    cep?: true
    pais?: true
    padrao?: true
    criadoEm?: true
    _all?: true
  }

  export type EnderecoClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnderecoCliente to aggregate.
     */
    where?: EnderecoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnderecoClientes to fetch.
     */
    orderBy?: EnderecoClienteOrderByWithRelationInput | EnderecoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnderecoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnderecoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnderecoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EnderecoClientes
    **/
    _count?: true | EnderecoClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnderecoClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnderecoClienteMaxAggregateInputType
  }

  export type GetEnderecoClienteAggregateType<T extends EnderecoClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateEnderecoCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnderecoCliente[P]>
      : GetScalarType<T[P], AggregateEnderecoCliente[P]>
  }




  export type EnderecoClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnderecoClienteWhereInput
    orderBy?: EnderecoClienteOrderByWithAggregationInput | EnderecoClienteOrderByWithAggregationInput[]
    by: EnderecoClienteScalarFieldEnum[] | EnderecoClienteScalarFieldEnum
    having?: EnderecoClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnderecoClienteCountAggregateInputType | true
    _min?: EnderecoClienteMinAggregateInputType
    _max?: EnderecoClienteMaxAggregateInputType
  }

  export type EnderecoClienteGroupByOutputType = {
    id: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais: string
    padrao: boolean
    criadoEm: Date
    _count: EnderecoClienteCountAggregateOutputType | null
    _min: EnderecoClienteMinAggregateOutputType | null
    _max: EnderecoClienteMaxAggregateOutputType | null
  }

  type GetEnderecoClienteGroupByPayload<T extends EnderecoClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnderecoClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnderecoClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnderecoClienteGroupByOutputType[P]>
            : GetScalarType<T[P], EnderecoClienteGroupByOutputType[P]>
        }
      >
    >


  export type EnderecoClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    logradouro?: boolean
    numero?: boolean
    complemento?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
    cep?: boolean
    pais?: boolean
    padrao?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enderecoCliente"]>

  export type EnderecoClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    logradouro?: boolean
    numero?: boolean
    complemento?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
    cep?: boolean
    pais?: boolean
    padrao?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enderecoCliente"]>

  export type EnderecoClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    logradouro?: boolean
    numero?: boolean
    complemento?: boolean
    bairro?: boolean
    cidade?: boolean
    estado?: boolean
    cep?: boolean
    pais?: boolean
    padrao?: boolean
    criadoEm?: boolean
  }

  export type EnderecoClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }
  export type EnderecoClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }

  export type $EnderecoClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EnderecoCliente"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      clienteId: string
      tipo: $Enums.TipoEndereco
      logradouro: string
      numero: string
      complemento: string | null
      bairro: string
      cidade: string
      estado: string
      cep: string
      pais: string
      padrao: boolean
      criadoEm: Date
    }, ExtArgs["result"]["enderecoCliente"]>
    composites: {}
  }

  type EnderecoClienteGetPayload<S extends boolean | null | undefined | EnderecoClienteDefaultArgs> = $Result.GetResult<Prisma.$EnderecoClientePayload, S>

  type EnderecoClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EnderecoClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EnderecoClienteCountAggregateInputType | true
    }

  export interface EnderecoClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EnderecoCliente'], meta: { name: 'EnderecoCliente' } }
    /**
     * Find zero or one EnderecoCliente that matches the filter.
     * @param {EnderecoClienteFindUniqueArgs} args - Arguments to find a EnderecoCliente
     * @example
     * // Get one EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnderecoClienteFindUniqueArgs>(args: SelectSubset<T, EnderecoClienteFindUniqueArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EnderecoCliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EnderecoClienteFindUniqueOrThrowArgs} args - Arguments to find a EnderecoCliente
     * @example
     * // Get one EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnderecoClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, EnderecoClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EnderecoCliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteFindFirstArgs} args - Arguments to find a EnderecoCliente
     * @example
     * // Get one EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnderecoClienteFindFirstArgs>(args?: SelectSubset<T, EnderecoClienteFindFirstArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EnderecoCliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteFindFirstOrThrowArgs} args - Arguments to find a EnderecoCliente
     * @example
     * // Get one EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnderecoClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, EnderecoClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EnderecoClientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EnderecoClientes
     * const enderecoClientes = await prisma.enderecoCliente.findMany()
     * 
     * // Get first 10 EnderecoClientes
     * const enderecoClientes = await prisma.enderecoCliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enderecoClienteWithIdOnly = await prisma.enderecoCliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnderecoClienteFindManyArgs>(args?: SelectSubset<T, EnderecoClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EnderecoCliente.
     * @param {EnderecoClienteCreateArgs} args - Arguments to create a EnderecoCliente.
     * @example
     * // Create one EnderecoCliente
     * const EnderecoCliente = await prisma.enderecoCliente.create({
     *   data: {
     *     // ... data to create a EnderecoCliente
     *   }
     * })
     * 
     */
    create<T extends EnderecoClienteCreateArgs>(args: SelectSubset<T, EnderecoClienteCreateArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EnderecoClientes.
     * @param {EnderecoClienteCreateManyArgs} args - Arguments to create many EnderecoClientes.
     * @example
     * // Create many EnderecoClientes
     * const enderecoCliente = await prisma.enderecoCliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnderecoClienteCreateManyArgs>(args?: SelectSubset<T, EnderecoClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EnderecoClientes and returns the data saved in the database.
     * @param {EnderecoClienteCreateManyAndReturnArgs} args - Arguments to create many EnderecoClientes.
     * @example
     * // Create many EnderecoClientes
     * const enderecoCliente = await prisma.enderecoCliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EnderecoClientes and only return the `id`
     * const enderecoClienteWithIdOnly = await prisma.enderecoCliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnderecoClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, EnderecoClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EnderecoCliente.
     * @param {EnderecoClienteDeleteArgs} args - Arguments to delete one EnderecoCliente.
     * @example
     * // Delete one EnderecoCliente
     * const EnderecoCliente = await prisma.enderecoCliente.delete({
     *   where: {
     *     // ... filter to delete one EnderecoCliente
     *   }
     * })
     * 
     */
    delete<T extends EnderecoClienteDeleteArgs>(args: SelectSubset<T, EnderecoClienteDeleteArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EnderecoCliente.
     * @param {EnderecoClienteUpdateArgs} args - Arguments to update one EnderecoCliente.
     * @example
     * // Update one EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnderecoClienteUpdateArgs>(args: SelectSubset<T, EnderecoClienteUpdateArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EnderecoClientes.
     * @param {EnderecoClienteDeleteManyArgs} args - Arguments to filter EnderecoClientes to delete.
     * @example
     * // Delete a few EnderecoClientes
     * const { count } = await prisma.enderecoCliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnderecoClienteDeleteManyArgs>(args?: SelectSubset<T, EnderecoClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnderecoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EnderecoClientes
     * const enderecoCliente = await prisma.enderecoCliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnderecoClienteUpdateManyArgs>(args: SelectSubset<T, EnderecoClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EnderecoCliente.
     * @param {EnderecoClienteUpsertArgs} args - Arguments to update or create a EnderecoCliente.
     * @example
     * // Update or create a EnderecoCliente
     * const enderecoCliente = await prisma.enderecoCliente.upsert({
     *   create: {
     *     // ... data to create a EnderecoCliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EnderecoCliente we want to update
     *   }
     * })
     */
    upsert<T extends EnderecoClienteUpsertArgs>(args: SelectSubset<T, EnderecoClienteUpsertArgs<ExtArgs>>): Prisma__EnderecoClienteClient<$Result.GetResult<Prisma.$EnderecoClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EnderecoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteCountArgs} args - Arguments to filter EnderecoClientes to count.
     * @example
     * // Count the number of EnderecoClientes
     * const count = await prisma.enderecoCliente.count({
     *   where: {
     *     // ... the filter for the EnderecoClientes we want to count
     *   }
     * })
    **/
    count<T extends EnderecoClienteCountArgs>(
      args?: Subset<T, EnderecoClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnderecoClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EnderecoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EnderecoClienteAggregateArgs>(args: Subset<T, EnderecoClienteAggregateArgs>): Prisma.PrismaPromise<GetEnderecoClienteAggregateType<T>>

    /**
     * Group by EnderecoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnderecoClienteGroupByArgs} args - Group by arguments.
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
      T extends EnderecoClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnderecoClienteGroupByArgs['orderBy'] }
        : { orderBy?: EnderecoClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EnderecoClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnderecoClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EnderecoCliente model
   */
  readonly fields: EnderecoClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EnderecoCliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnderecoClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EnderecoCliente model
   */ 
  interface EnderecoClienteFieldRefs {
    readonly id: FieldRef<"EnderecoCliente", 'String'>
    readonly tenantId: FieldRef<"EnderecoCliente", 'String'>
    readonly clienteId: FieldRef<"EnderecoCliente", 'String'>
    readonly tipo: FieldRef<"EnderecoCliente", 'TipoEndereco'>
    readonly logradouro: FieldRef<"EnderecoCliente", 'String'>
    readonly numero: FieldRef<"EnderecoCliente", 'String'>
    readonly complemento: FieldRef<"EnderecoCliente", 'String'>
    readonly bairro: FieldRef<"EnderecoCliente", 'String'>
    readonly cidade: FieldRef<"EnderecoCliente", 'String'>
    readonly estado: FieldRef<"EnderecoCliente", 'String'>
    readonly cep: FieldRef<"EnderecoCliente", 'String'>
    readonly pais: FieldRef<"EnderecoCliente", 'String'>
    readonly padrao: FieldRef<"EnderecoCliente", 'Boolean'>
    readonly criadoEm: FieldRef<"EnderecoCliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EnderecoCliente findUnique
   */
  export type EnderecoClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter, which EnderecoCliente to fetch.
     */
    where: EnderecoClienteWhereUniqueInput
  }

  /**
   * EnderecoCliente findUniqueOrThrow
   */
  export type EnderecoClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter, which EnderecoCliente to fetch.
     */
    where: EnderecoClienteWhereUniqueInput
  }

  /**
   * EnderecoCliente findFirst
   */
  export type EnderecoClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter, which EnderecoCliente to fetch.
     */
    where?: EnderecoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnderecoClientes to fetch.
     */
    orderBy?: EnderecoClienteOrderByWithRelationInput | EnderecoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnderecoClientes.
     */
    cursor?: EnderecoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnderecoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnderecoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnderecoClientes.
     */
    distinct?: EnderecoClienteScalarFieldEnum | EnderecoClienteScalarFieldEnum[]
  }

  /**
   * EnderecoCliente findFirstOrThrow
   */
  export type EnderecoClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter, which EnderecoCliente to fetch.
     */
    where?: EnderecoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnderecoClientes to fetch.
     */
    orderBy?: EnderecoClienteOrderByWithRelationInput | EnderecoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnderecoClientes.
     */
    cursor?: EnderecoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnderecoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnderecoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnderecoClientes.
     */
    distinct?: EnderecoClienteScalarFieldEnum | EnderecoClienteScalarFieldEnum[]
  }

  /**
   * EnderecoCliente findMany
   */
  export type EnderecoClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter, which EnderecoClientes to fetch.
     */
    where?: EnderecoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnderecoClientes to fetch.
     */
    orderBy?: EnderecoClienteOrderByWithRelationInput | EnderecoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EnderecoClientes.
     */
    cursor?: EnderecoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnderecoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnderecoClientes.
     */
    skip?: number
    distinct?: EnderecoClienteScalarFieldEnum | EnderecoClienteScalarFieldEnum[]
  }

  /**
   * EnderecoCliente create
   */
  export type EnderecoClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a EnderecoCliente.
     */
    data: XOR<EnderecoClienteCreateInput, EnderecoClienteUncheckedCreateInput>
  }

  /**
   * EnderecoCliente createMany
   */
  export type EnderecoClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EnderecoClientes.
     */
    data: EnderecoClienteCreateManyInput | EnderecoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnderecoCliente createManyAndReturn
   */
  export type EnderecoClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EnderecoClientes.
     */
    data: EnderecoClienteCreateManyInput | EnderecoClienteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EnderecoCliente update
   */
  export type EnderecoClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a EnderecoCliente.
     */
    data: XOR<EnderecoClienteUpdateInput, EnderecoClienteUncheckedUpdateInput>
    /**
     * Choose, which EnderecoCliente to update.
     */
    where: EnderecoClienteWhereUniqueInput
  }

  /**
   * EnderecoCliente updateMany
   */
  export type EnderecoClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EnderecoClientes.
     */
    data: XOR<EnderecoClienteUpdateManyMutationInput, EnderecoClienteUncheckedUpdateManyInput>
    /**
     * Filter which EnderecoClientes to update
     */
    where?: EnderecoClienteWhereInput
  }

  /**
   * EnderecoCliente upsert
   */
  export type EnderecoClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the EnderecoCliente to update in case it exists.
     */
    where: EnderecoClienteWhereUniqueInput
    /**
     * In case the EnderecoCliente found by the `where` argument doesn't exist, create a new EnderecoCliente with this data.
     */
    create: XOR<EnderecoClienteCreateInput, EnderecoClienteUncheckedCreateInput>
    /**
     * In case the EnderecoCliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnderecoClienteUpdateInput, EnderecoClienteUncheckedUpdateInput>
  }

  /**
   * EnderecoCliente delete
   */
  export type EnderecoClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
    /**
     * Filter which EnderecoCliente to delete.
     */
    where: EnderecoClienteWhereUniqueInput
  }

  /**
   * EnderecoCliente deleteMany
   */
  export type EnderecoClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnderecoClientes to delete
     */
    where?: EnderecoClienteWhereInput
  }

  /**
   * EnderecoCliente without action
   */
  export type EnderecoClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnderecoCliente
     */
    select?: EnderecoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnderecoClienteInclude<ExtArgs> | null
  }


  /**
   * Model ContatoCliente
   */

  export type AggregateContatoCliente = {
    _count: ContatoClienteCountAggregateOutputType | null
    _min: ContatoClienteMinAggregateOutputType | null
    _max: ContatoClienteMaxAggregateOutputType | null
  }

  export type ContatoClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    nome: string | null
    cargo: string | null
    email: string | null
    telefone: string | null
    celular: string | null
    principal: boolean | null
    observacoes: string | null
    criadoEm: Date | null
  }

  export type ContatoClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    nome: string | null
    cargo: string | null
    email: string | null
    telefone: string | null
    celular: string | null
    principal: boolean | null
    observacoes: string | null
    criadoEm: Date | null
  }

  export type ContatoClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    clienteId: number
    nome: number
    cargo: number
    email: number
    telefone: number
    celular: number
    principal: number
    observacoes: number
    criadoEm: number
    _all: number
  }


  export type ContatoClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    celular?: true
    principal?: true
    observacoes?: true
    criadoEm?: true
  }

  export type ContatoClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    celular?: true
    principal?: true
    observacoes?: true
    criadoEm?: true
  }

  export type ContatoClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    nome?: true
    cargo?: true
    email?: true
    telefone?: true
    celular?: true
    principal?: true
    observacoes?: true
    criadoEm?: true
    _all?: true
  }

  export type ContatoClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContatoCliente to aggregate.
     */
    where?: ContatoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContatoClientes to fetch.
     */
    orderBy?: ContatoClienteOrderByWithRelationInput | ContatoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ContatoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContatoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContatoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ContatoClientes
    **/
    _count?: true | ContatoClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ContatoClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ContatoClienteMaxAggregateInputType
  }

  export type GetContatoClienteAggregateType<T extends ContatoClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateContatoCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateContatoCliente[P]>
      : GetScalarType<T[P], AggregateContatoCliente[P]>
  }




  export type ContatoClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ContatoClienteWhereInput
    orderBy?: ContatoClienteOrderByWithAggregationInput | ContatoClienteOrderByWithAggregationInput[]
    by: ContatoClienteScalarFieldEnum[] | ContatoClienteScalarFieldEnum
    having?: ContatoClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ContatoClienteCountAggregateInputType | true
    _min?: ContatoClienteMinAggregateInputType
    _max?: ContatoClienteMaxAggregateInputType
  }

  export type ContatoClienteGroupByOutputType = {
    id: string
    tenantId: string
    clienteId: string
    nome: string
    cargo: string | null
    email: string | null
    telefone: string | null
    celular: string | null
    principal: boolean
    observacoes: string | null
    criadoEm: Date
    _count: ContatoClienteCountAggregateOutputType | null
    _min: ContatoClienteMinAggregateOutputType | null
    _max: ContatoClienteMaxAggregateOutputType | null
  }

  type GetContatoClienteGroupByPayload<T extends ContatoClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ContatoClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ContatoClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ContatoClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ContatoClienteGroupByOutputType[P]>
        }
      >
    >


  export type ContatoClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    nome?: boolean
    cargo?: boolean
    email?: boolean
    telefone?: boolean
    celular?: boolean
    principal?: boolean
    observacoes?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contatoCliente"]>

  export type ContatoClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    nome?: boolean
    cargo?: boolean
    email?: boolean
    telefone?: boolean
    celular?: boolean
    principal?: boolean
    observacoes?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["contatoCliente"]>

  export type ContatoClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    nome?: boolean
    cargo?: boolean
    email?: boolean
    telefone?: boolean
    celular?: boolean
    principal?: boolean
    observacoes?: boolean
    criadoEm?: boolean
  }

  export type ContatoClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }
  export type ContatoClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }

  export type $ContatoClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ContatoCliente"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      clienteId: string
      nome: string
      cargo: string | null
      email: string | null
      telefone: string | null
      celular: string | null
      principal: boolean
      observacoes: string | null
      criadoEm: Date
    }, ExtArgs["result"]["contatoCliente"]>
    composites: {}
  }

  type ContatoClienteGetPayload<S extends boolean | null | undefined | ContatoClienteDefaultArgs> = $Result.GetResult<Prisma.$ContatoClientePayload, S>

  type ContatoClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ContatoClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ContatoClienteCountAggregateInputType | true
    }

  export interface ContatoClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ContatoCliente'], meta: { name: 'ContatoCliente' } }
    /**
     * Find zero or one ContatoCliente that matches the filter.
     * @param {ContatoClienteFindUniqueArgs} args - Arguments to find a ContatoCliente
     * @example
     * // Get one ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ContatoClienteFindUniqueArgs>(args: SelectSubset<T, ContatoClienteFindUniqueArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ContatoCliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ContatoClienteFindUniqueOrThrowArgs} args - Arguments to find a ContatoCliente
     * @example
     * // Get one ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ContatoClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ContatoClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ContatoCliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteFindFirstArgs} args - Arguments to find a ContatoCliente
     * @example
     * // Get one ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ContatoClienteFindFirstArgs>(args?: SelectSubset<T, ContatoClienteFindFirstArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ContatoCliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteFindFirstOrThrowArgs} args - Arguments to find a ContatoCliente
     * @example
     * // Get one ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ContatoClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ContatoClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ContatoClientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ContatoClientes
     * const contatoClientes = await prisma.contatoCliente.findMany()
     * 
     * // Get first 10 ContatoClientes
     * const contatoClientes = await prisma.contatoCliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const contatoClienteWithIdOnly = await prisma.contatoCliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ContatoClienteFindManyArgs>(args?: SelectSubset<T, ContatoClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ContatoCliente.
     * @param {ContatoClienteCreateArgs} args - Arguments to create a ContatoCliente.
     * @example
     * // Create one ContatoCliente
     * const ContatoCliente = await prisma.contatoCliente.create({
     *   data: {
     *     // ... data to create a ContatoCliente
     *   }
     * })
     * 
     */
    create<T extends ContatoClienteCreateArgs>(args: SelectSubset<T, ContatoClienteCreateArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ContatoClientes.
     * @param {ContatoClienteCreateManyArgs} args - Arguments to create many ContatoClientes.
     * @example
     * // Create many ContatoClientes
     * const contatoCliente = await prisma.contatoCliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ContatoClienteCreateManyArgs>(args?: SelectSubset<T, ContatoClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ContatoClientes and returns the data saved in the database.
     * @param {ContatoClienteCreateManyAndReturnArgs} args - Arguments to create many ContatoClientes.
     * @example
     * // Create many ContatoClientes
     * const contatoCliente = await prisma.contatoCliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ContatoClientes and only return the `id`
     * const contatoClienteWithIdOnly = await prisma.contatoCliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ContatoClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ContatoClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ContatoCliente.
     * @param {ContatoClienteDeleteArgs} args - Arguments to delete one ContatoCliente.
     * @example
     * // Delete one ContatoCliente
     * const ContatoCliente = await prisma.contatoCliente.delete({
     *   where: {
     *     // ... filter to delete one ContatoCliente
     *   }
     * })
     * 
     */
    delete<T extends ContatoClienteDeleteArgs>(args: SelectSubset<T, ContatoClienteDeleteArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ContatoCliente.
     * @param {ContatoClienteUpdateArgs} args - Arguments to update one ContatoCliente.
     * @example
     * // Update one ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ContatoClienteUpdateArgs>(args: SelectSubset<T, ContatoClienteUpdateArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ContatoClientes.
     * @param {ContatoClienteDeleteManyArgs} args - Arguments to filter ContatoClientes to delete.
     * @example
     * // Delete a few ContatoClientes
     * const { count } = await prisma.contatoCliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ContatoClienteDeleteManyArgs>(args?: SelectSubset<T, ContatoClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ContatoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ContatoClientes
     * const contatoCliente = await prisma.contatoCliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ContatoClienteUpdateManyArgs>(args: SelectSubset<T, ContatoClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ContatoCliente.
     * @param {ContatoClienteUpsertArgs} args - Arguments to update or create a ContatoCliente.
     * @example
     * // Update or create a ContatoCliente
     * const contatoCliente = await prisma.contatoCliente.upsert({
     *   create: {
     *     // ... data to create a ContatoCliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ContatoCliente we want to update
     *   }
     * })
     */
    upsert<T extends ContatoClienteUpsertArgs>(args: SelectSubset<T, ContatoClienteUpsertArgs<ExtArgs>>): Prisma__ContatoClienteClient<$Result.GetResult<Prisma.$ContatoClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ContatoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteCountArgs} args - Arguments to filter ContatoClientes to count.
     * @example
     * // Count the number of ContatoClientes
     * const count = await prisma.contatoCliente.count({
     *   where: {
     *     // ... the filter for the ContatoClientes we want to count
     *   }
     * })
    **/
    count<T extends ContatoClienteCountArgs>(
      args?: Subset<T, ContatoClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ContatoClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ContatoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ContatoClienteAggregateArgs>(args: Subset<T, ContatoClienteAggregateArgs>): Prisma.PrismaPromise<GetContatoClienteAggregateType<T>>

    /**
     * Group by ContatoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ContatoClienteGroupByArgs} args - Group by arguments.
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
      T extends ContatoClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ContatoClienteGroupByArgs['orderBy'] }
        : { orderBy?: ContatoClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ContatoClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContatoClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ContatoCliente model
   */
  readonly fields: ContatoClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ContatoCliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ContatoClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ContatoCliente model
   */ 
  interface ContatoClienteFieldRefs {
    readonly id: FieldRef<"ContatoCliente", 'String'>
    readonly tenantId: FieldRef<"ContatoCliente", 'String'>
    readonly clienteId: FieldRef<"ContatoCliente", 'String'>
    readonly nome: FieldRef<"ContatoCliente", 'String'>
    readonly cargo: FieldRef<"ContatoCliente", 'String'>
    readonly email: FieldRef<"ContatoCliente", 'String'>
    readonly telefone: FieldRef<"ContatoCliente", 'String'>
    readonly celular: FieldRef<"ContatoCliente", 'String'>
    readonly principal: FieldRef<"ContatoCliente", 'Boolean'>
    readonly observacoes: FieldRef<"ContatoCliente", 'String'>
    readonly criadoEm: FieldRef<"ContatoCliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ContatoCliente findUnique
   */
  export type ContatoClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter, which ContatoCliente to fetch.
     */
    where: ContatoClienteWhereUniqueInput
  }

  /**
   * ContatoCliente findUniqueOrThrow
   */
  export type ContatoClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter, which ContatoCliente to fetch.
     */
    where: ContatoClienteWhereUniqueInput
  }

  /**
   * ContatoCliente findFirst
   */
  export type ContatoClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter, which ContatoCliente to fetch.
     */
    where?: ContatoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContatoClientes to fetch.
     */
    orderBy?: ContatoClienteOrderByWithRelationInput | ContatoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContatoClientes.
     */
    cursor?: ContatoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContatoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContatoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContatoClientes.
     */
    distinct?: ContatoClienteScalarFieldEnum | ContatoClienteScalarFieldEnum[]
  }

  /**
   * ContatoCliente findFirstOrThrow
   */
  export type ContatoClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter, which ContatoCliente to fetch.
     */
    where?: ContatoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContatoClientes to fetch.
     */
    orderBy?: ContatoClienteOrderByWithRelationInput | ContatoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ContatoClientes.
     */
    cursor?: ContatoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContatoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContatoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ContatoClientes.
     */
    distinct?: ContatoClienteScalarFieldEnum | ContatoClienteScalarFieldEnum[]
  }

  /**
   * ContatoCliente findMany
   */
  export type ContatoClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter, which ContatoClientes to fetch.
     */
    where?: ContatoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ContatoClientes to fetch.
     */
    orderBy?: ContatoClienteOrderByWithRelationInput | ContatoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ContatoClientes.
     */
    cursor?: ContatoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ContatoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ContatoClientes.
     */
    skip?: number
    distinct?: ContatoClienteScalarFieldEnum | ContatoClienteScalarFieldEnum[]
  }

  /**
   * ContatoCliente create
   */
  export type ContatoClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a ContatoCliente.
     */
    data: XOR<ContatoClienteCreateInput, ContatoClienteUncheckedCreateInput>
  }

  /**
   * ContatoCliente createMany
   */
  export type ContatoClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ContatoClientes.
     */
    data: ContatoClienteCreateManyInput | ContatoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ContatoCliente createManyAndReturn
   */
  export type ContatoClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ContatoClientes.
     */
    data: ContatoClienteCreateManyInput | ContatoClienteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ContatoCliente update
   */
  export type ContatoClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a ContatoCliente.
     */
    data: XOR<ContatoClienteUpdateInput, ContatoClienteUncheckedUpdateInput>
    /**
     * Choose, which ContatoCliente to update.
     */
    where: ContatoClienteWhereUniqueInput
  }

  /**
   * ContatoCliente updateMany
   */
  export type ContatoClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ContatoClientes.
     */
    data: XOR<ContatoClienteUpdateManyMutationInput, ContatoClienteUncheckedUpdateManyInput>
    /**
     * Filter which ContatoClientes to update
     */
    where?: ContatoClienteWhereInput
  }

  /**
   * ContatoCliente upsert
   */
  export type ContatoClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the ContatoCliente to update in case it exists.
     */
    where: ContatoClienteWhereUniqueInput
    /**
     * In case the ContatoCliente found by the `where` argument doesn't exist, create a new ContatoCliente with this data.
     */
    create: XOR<ContatoClienteCreateInput, ContatoClienteUncheckedCreateInput>
    /**
     * In case the ContatoCliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ContatoClienteUpdateInput, ContatoClienteUncheckedUpdateInput>
  }

  /**
   * ContatoCliente delete
   */
  export type ContatoClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
    /**
     * Filter which ContatoCliente to delete.
     */
    where: ContatoClienteWhereUniqueInput
  }

  /**
   * ContatoCliente deleteMany
   */
  export type ContatoClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ContatoClientes to delete
     */
    where?: ContatoClienteWhereInput
  }

  /**
   * ContatoCliente without action
   */
  export type ContatoClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ContatoCliente
     */
    select?: ContatoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ContatoClienteInclude<ExtArgs> | null
  }


  /**
   * Model InteracaoCliente
   */

  export type AggregateInteracaoCliente = {
    _count: InteracaoClienteCountAggregateOutputType | null
    _min: InteracaoClienteMinAggregateOutputType | null
    _max: InteracaoClienteMaxAggregateOutputType | null
  }

  export type InteracaoClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    tipo: $Enums.TipoInteracao | null
    canal: $Enums.CanalInteracao | null
    titulo: string | null
    descricao: string | null
    data: Date | null
    usuarioId: string | null
    pedidoId: string | null
    criadoEm: Date | null
  }

  export type InteracaoClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    clienteId: string | null
    tipo: $Enums.TipoInteracao | null
    canal: $Enums.CanalInteracao | null
    titulo: string | null
    descricao: string | null
    data: Date | null
    usuarioId: string | null
    pedidoId: string | null
    criadoEm: Date | null
  }

  export type InteracaoClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    clienteId: number
    tipo: number
    canal: number
    titulo: number
    descricao: number
    data: number
    usuarioId: number
    pedidoId: number
    metadata: number
    criadoEm: number
    _all: number
  }


  export type InteracaoClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    canal?: true
    titulo?: true
    descricao?: true
    data?: true
    usuarioId?: true
    pedidoId?: true
    criadoEm?: true
  }

  export type InteracaoClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    canal?: true
    titulo?: true
    descricao?: true
    data?: true
    usuarioId?: true
    pedidoId?: true
    criadoEm?: true
  }

  export type InteracaoClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    clienteId?: true
    tipo?: true
    canal?: true
    titulo?: true
    descricao?: true
    data?: true
    usuarioId?: true
    pedidoId?: true
    metadata?: true
    criadoEm?: true
    _all?: true
  }

  export type InteracaoClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InteracaoCliente to aggregate.
     */
    where?: InteracaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteracaoClientes to fetch.
     */
    orderBy?: InteracaoClienteOrderByWithRelationInput | InteracaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InteracaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteracaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteracaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InteracaoClientes
    **/
    _count?: true | InteracaoClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InteracaoClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InteracaoClienteMaxAggregateInputType
  }

  export type GetInteracaoClienteAggregateType<T extends InteracaoClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateInteracaoCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInteracaoCliente[P]>
      : GetScalarType<T[P], AggregateInteracaoCliente[P]>
  }




  export type InteracaoClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteracaoClienteWhereInput
    orderBy?: InteracaoClienteOrderByWithAggregationInput | InteracaoClienteOrderByWithAggregationInput[]
    by: InteracaoClienteScalarFieldEnum[] | InteracaoClienteScalarFieldEnum
    having?: InteracaoClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InteracaoClienteCountAggregateInputType | true
    _min?: InteracaoClienteMinAggregateInputType
    _max?: InteracaoClienteMaxAggregateInputType
  }

  export type InteracaoClienteGroupByOutputType = {
    id: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data: Date
    usuarioId: string
    pedidoId: string | null
    metadata: JsonValue | null
    criadoEm: Date
    _count: InteracaoClienteCountAggregateOutputType | null
    _min: InteracaoClienteMinAggregateOutputType | null
    _max: InteracaoClienteMaxAggregateOutputType | null
  }

  type GetInteracaoClienteGroupByPayload<T extends InteracaoClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InteracaoClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InteracaoClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InteracaoClienteGroupByOutputType[P]>
            : GetScalarType<T[P], InteracaoClienteGroupByOutputType[P]>
        }
      >
    >


  export type InteracaoClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    canal?: boolean
    titulo?: boolean
    descricao?: boolean
    data?: boolean
    usuarioId?: boolean
    pedidoId?: boolean
    metadata?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interacaoCliente"]>

  export type InteracaoClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    canal?: boolean
    titulo?: boolean
    descricao?: boolean
    data?: boolean
    usuarioId?: boolean
    pedidoId?: boolean
    metadata?: boolean
    criadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interacaoCliente"]>

  export type InteracaoClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    clienteId?: boolean
    tipo?: boolean
    canal?: boolean
    titulo?: boolean
    descricao?: boolean
    data?: boolean
    usuarioId?: boolean
    pedidoId?: boolean
    metadata?: boolean
    criadoEm?: boolean
  }

  export type InteracaoClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }
  export type InteracaoClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }

  export type $InteracaoClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InteracaoCliente"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      clienteId: string
      tipo: $Enums.TipoInteracao
      canal: $Enums.CanalInteracao
      titulo: string
      descricao: string
      data: Date
      usuarioId: string
      pedidoId: string | null
      metadata: Prisma.JsonValue | null
      criadoEm: Date
    }, ExtArgs["result"]["interacaoCliente"]>
    composites: {}
  }

  type InteracaoClienteGetPayload<S extends boolean | null | undefined | InteracaoClienteDefaultArgs> = $Result.GetResult<Prisma.$InteracaoClientePayload, S>

  type InteracaoClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InteracaoClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InteracaoClienteCountAggregateInputType | true
    }

  export interface InteracaoClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InteracaoCliente'], meta: { name: 'InteracaoCliente' } }
    /**
     * Find zero or one InteracaoCliente that matches the filter.
     * @param {InteracaoClienteFindUniqueArgs} args - Arguments to find a InteracaoCliente
     * @example
     * // Get one InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InteracaoClienteFindUniqueArgs>(args: SelectSubset<T, InteracaoClienteFindUniqueArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InteracaoCliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InteracaoClienteFindUniqueOrThrowArgs} args - Arguments to find a InteracaoCliente
     * @example
     * // Get one InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InteracaoClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, InteracaoClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InteracaoCliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteFindFirstArgs} args - Arguments to find a InteracaoCliente
     * @example
     * // Get one InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InteracaoClienteFindFirstArgs>(args?: SelectSubset<T, InteracaoClienteFindFirstArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InteracaoCliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteFindFirstOrThrowArgs} args - Arguments to find a InteracaoCliente
     * @example
     * // Get one InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InteracaoClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, InteracaoClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InteracaoClientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InteracaoClientes
     * const interacaoClientes = await prisma.interacaoCliente.findMany()
     * 
     * // Get first 10 InteracaoClientes
     * const interacaoClientes = await prisma.interacaoCliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interacaoClienteWithIdOnly = await prisma.interacaoCliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InteracaoClienteFindManyArgs>(args?: SelectSubset<T, InteracaoClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InteracaoCliente.
     * @param {InteracaoClienteCreateArgs} args - Arguments to create a InteracaoCliente.
     * @example
     * // Create one InteracaoCliente
     * const InteracaoCliente = await prisma.interacaoCliente.create({
     *   data: {
     *     // ... data to create a InteracaoCliente
     *   }
     * })
     * 
     */
    create<T extends InteracaoClienteCreateArgs>(args: SelectSubset<T, InteracaoClienteCreateArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InteracaoClientes.
     * @param {InteracaoClienteCreateManyArgs} args - Arguments to create many InteracaoClientes.
     * @example
     * // Create many InteracaoClientes
     * const interacaoCliente = await prisma.interacaoCliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InteracaoClienteCreateManyArgs>(args?: SelectSubset<T, InteracaoClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InteracaoClientes and returns the data saved in the database.
     * @param {InteracaoClienteCreateManyAndReturnArgs} args - Arguments to create many InteracaoClientes.
     * @example
     * // Create many InteracaoClientes
     * const interacaoCliente = await prisma.interacaoCliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InteracaoClientes and only return the `id`
     * const interacaoClienteWithIdOnly = await prisma.interacaoCliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InteracaoClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, InteracaoClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InteracaoCliente.
     * @param {InteracaoClienteDeleteArgs} args - Arguments to delete one InteracaoCliente.
     * @example
     * // Delete one InteracaoCliente
     * const InteracaoCliente = await prisma.interacaoCliente.delete({
     *   where: {
     *     // ... filter to delete one InteracaoCliente
     *   }
     * })
     * 
     */
    delete<T extends InteracaoClienteDeleteArgs>(args: SelectSubset<T, InteracaoClienteDeleteArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InteracaoCliente.
     * @param {InteracaoClienteUpdateArgs} args - Arguments to update one InteracaoCliente.
     * @example
     * // Update one InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InteracaoClienteUpdateArgs>(args: SelectSubset<T, InteracaoClienteUpdateArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InteracaoClientes.
     * @param {InteracaoClienteDeleteManyArgs} args - Arguments to filter InteracaoClientes to delete.
     * @example
     * // Delete a few InteracaoClientes
     * const { count } = await prisma.interacaoCliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InteracaoClienteDeleteManyArgs>(args?: SelectSubset<T, InteracaoClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InteracaoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InteracaoClientes
     * const interacaoCliente = await prisma.interacaoCliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InteracaoClienteUpdateManyArgs>(args: SelectSubset<T, InteracaoClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InteracaoCliente.
     * @param {InteracaoClienteUpsertArgs} args - Arguments to update or create a InteracaoCliente.
     * @example
     * // Update or create a InteracaoCliente
     * const interacaoCliente = await prisma.interacaoCliente.upsert({
     *   create: {
     *     // ... data to create a InteracaoCliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InteracaoCliente we want to update
     *   }
     * })
     */
    upsert<T extends InteracaoClienteUpsertArgs>(args: SelectSubset<T, InteracaoClienteUpsertArgs<ExtArgs>>): Prisma__InteracaoClienteClient<$Result.GetResult<Prisma.$InteracaoClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InteracaoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteCountArgs} args - Arguments to filter InteracaoClientes to count.
     * @example
     * // Count the number of InteracaoClientes
     * const count = await prisma.interacaoCliente.count({
     *   where: {
     *     // ... the filter for the InteracaoClientes we want to count
     *   }
     * })
    **/
    count<T extends InteracaoClienteCountArgs>(
      args?: Subset<T, InteracaoClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InteracaoClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InteracaoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InteracaoClienteAggregateArgs>(args: Subset<T, InteracaoClienteAggregateArgs>): Prisma.PrismaPromise<GetInteracaoClienteAggregateType<T>>

    /**
     * Group by InteracaoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteracaoClienteGroupByArgs} args - Group by arguments.
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
      T extends InteracaoClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InteracaoClienteGroupByArgs['orderBy'] }
        : { orderBy?: InteracaoClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InteracaoClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInteracaoClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InteracaoCliente model
   */
  readonly fields: InteracaoClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InteracaoCliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InteracaoClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the InteracaoCliente model
   */ 
  interface InteracaoClienteFieldRefs {
    readonly id: FieldRef<"InteracaoCliente", 'String'>
    readonly tenantId: FieldRef<"InteracaoCliente", 'String'>
    readonly clienteId: FieldRef<"InteracaoCliente", 'String'>
    readonly tipo: FieldRef<"InteracaoCliente", 'TipoInteracao'>
    readonly canal: FieldRef<"InteracaoCliente", 'CanalInteracao'>
    readonly titulo: FieldRef<"InteracaoCliente", 'String'>
    readonly descricao: FieldRef<"InteracaoCliente", 'String'>
    readonly data: FieldRef<"InteracaoCliente", 'DateTime'>
    readonly usuarioId: FieldRef<"InteracaoCliente", 'String'>
    readonly pedidoId: FieldRef<"InteracaoCliente", 'String'>
    readonly metadata: FieldRef<"InteracaoCliente", 'Json'>
    readonly criadoEm: FieldRef<"InteracaoCliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InteracaoCliente findUnique
   */
  export type InteracaoClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter, which InteracaoCliente to fetch.
     */
    where: InteracaoClienteWhereUniqueInput
  }

  /**
   * InteracaoCliente findUniqueOrThrow
   */
  export type InteracaoClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter, which InteracaoCliente to fetch.
     */
    where: InteracaoClienteWhereUniqueInput
  }

  /**
   * InteracaoCliente findFirst
   */
  export type InteracaoClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter, which InteracaoCliente to fetch.
     */
    where?: InteracaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteracaoClientes to fetch.
     */
    orderBy?: InteracaoClienteOrderByWithRelationInput | InteracaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InteracaoClientes.
     */
    cursor?: InteracaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteracaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteracaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InteracaoClientes.
     */
    distinct?: InteracaoClienteScalarFieldEnum | InteracaoClienteScalarFieldEnum[]
  }

  /**
   * InteracaoCliente findFirstOrThrow
   */
  export type InteracaoClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter, which InteracaoCliente to fetch.
     */
    where?: InteracaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteracaoClientes to fetch.
     */
    orderBy?: InteracaoClienteOrderByWithRelationInput | InteracaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InteracaoClientes.
     */
    cursor?: InteracaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteracaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteracaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InteracaoClientes.
     */
    distinct?: InteracaoClienteScalarFieldEnum | InteracaoClienteScalarFieldEnum[]
  }

  /**
   * InteracaoCliente findMany
   */
  export type InteracaoClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter, which InteracaoClientes to fetch.
     */
    where?: InteracaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteracaoClientes to fetch.
     */
    orderBy?: InteracaoClienteOrderByWithRelationInput | InteracaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InteracaoClientes.
     */
    cursor?: InteracaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteracaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteracaoClientes.
     */
    skip?: number
    distinct?: InteracaoClienteScalarFieldEnum | InteracaoClienteScalarFieldEnum[]
  }

  /**
   * InteracaoCliente create
   */
  export type InteracaoClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a InteracaoCliente.
     */
    data: XOR<InteracaoClienteCreateInput, InteracaoClienteUncheckedCreateInput>
  }

  /**
   * InteracaoCliente createMany
   */
  export type InteracaoClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InteracaoClientes.
     */
    data: InteracaoClienteCreateManyInput | InteracaoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InteracaoCliente createManyAndReturn
   */
  export type InteracaoClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InteracaoClientes.
     */
    data: InteracaoClienteCreateManyInput | InteracaoClienteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InteracaoCliente update
   */
  export type InteracaoClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a InteracaoCliente.
     */
    data: XOR<InteracaoClienteUpdateInput, InteracaoClienteUncheckedUpdateInput>
    /**
     * Choose, which InteracaoCliente to update.
     */
    where: InteracaoClienteWhereUniqueInput
  }

  /**
   * InteracaoCliente updateMany
   */
  export type InteracaoClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InteracaoClientes.
     */
    data: XOR<InteracaoClienteUpdateManyMutationInput, InteracaoClienteUncheckedUpdateManyInput>
    /**
     * Filter which InteracaoClientes to update
     */
    where?: InteracaoClienteWhereInput
  }

  /**
   * InteracaoCliente upsert
   */
  export type InteracaoClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the InteracaoCliente to update in case it exists.
     */
    where: InteracaoClienteWhereUniqueInput
    /**
     * In case the InteracaoCliente found by the `where` argument doesn't exist, create a new InteracaoCliente with this data.
     */
    create: XOR<InteracaoClienteCreateInput, InteracaoClienteUncheckedCreateInput>
    /**
     * In case the InteracaoCliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InteracaoClienteUpdateInput, InteracaoClienteUncheckedUpdateInput>
  }

  /**
   * InteracaoCliente delete
   */
  export type InteracaoClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
    /**
     * Filter which InteracaoCliente to delete.
     */
    where: InteracaoClienteWhereUniqueInput
  }

  /**
   * InteracaoCliente deleteMany
   */
  export type InteracaoClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InteracaoClientes to delete
     */
    where?: InteracaoClienteWhereInput
  }

  /**
   * InteracaoCliente without action
   */
  export type InteracaoClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteracaoCliente
     */
    select?: InteracaoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteracaoClienteInclude<ExtArgs> | null
  }


  /**
   * Model SegmentoCliente
   */

  export type AggregateSegmentoCliente = {
    _count: SegmentoClienteCountAggregateOutputType | null
    _avg: SegmentoClienteAvgAggregateOutputType | null
    _sum: SegmentoClienteSumAggregateOutputType | null
    _min: SegmentoClienteMinAggregateOutputType | null
    _max: SegmentoClienteMaxAggregateOutputType | null
  }

  export type SegmentoClienteAvgAggregateOutputType = {
    totalClientes: number | null
  }

  export type SegmentoClienteSumAggregateOutputType = {
    totalClientes: number | null
  }

  export type SegmentoClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    descricao: string | null
    totalClientes: number | null
    ativo: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type SegmentoClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    descricao: string | null
    totalClientes: number | null
    ativo: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type SegmentoClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    descricao: number
    regras: number
    totalClientes: number
    ativo: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type SegmentoClienteAvgAggregateInputType = {
    totalClientes?: true
  }

  export type SegmentoClienteSumAggregateInputType = {
    totalClientes?: true
  }

  export type SegmentoClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    descricao?: true
    totalClientes?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type SegmentoClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    descricao?: true
    totalClientes?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type SegmentoClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    descricao?: true
    regras?: true
    totalClientes?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type SegmentoClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SegmentoCliente to aggregate.
     */
    where?: SegmentoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SegmentoClientes to fetch.
     */
    orderBy?: SegmentoClienteOrderByWithRelationInput | SegmentoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SegmentoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SegmentoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SegmentoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SegmentoClientes
    **/
    _count?: true | SegmentoClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SegmentoClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SegmentoClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SegmentoClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SegmentoClienteMaxAggregateInputType
  }

  export type GetSegmentoClienteAggregateType<T extends SegmentoClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateSegmentoCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSegmentoCliente[P]>
      : GetScalarType<T[P], AggregateSegmentoCliente[P]>
  }




  export type SegmentoClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SegmentoClienteWhereInput
    orderBy?: SegmentoClienteOrderByWithAggregationInput | SegmentoClienteOrderByWithAggregationInput[]
    by: SegmentoClienteScalarFieldEnum[] | SegmentoClienteScalarFieldEnum
    having?: SegmentoClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SegmentoClienteCountAggregateInputType | true
    _avg?: SegmentoClienteAvgAggregateInputType
    _sum?: SegmentoClienteSumAggregateInputType
    _min?: SegmentoClienteMinAggregateInputType
    _max?: SegmentoClienteMaxAggregateInputType
  }

  export type SegmentoClienteGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    descricao: string | null
    regras: JsonValue
    totalClientes: number
    ativo: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: SegmentoClienteCountAggregateOutputType | null
    _avg: SegmentoClienteAvgAggregateOutputType | null
    _sum: SegmentoClienteSumAggregateOutputType | null
    _min: SegmentoClienteMinAggregateOutputType | null
    _max: SegmentoClienteMaxAggregateOutputType | null
  }

  type GetSegmentoClienteGroupByPayload<T extends SegmentoClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SegmentoClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SegmentoClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SegmentoClienteGroupByOutputType[P]>
            : GetScalarType<T[P], SegmentoClienteGroupByOutputType[P]>
        }
      >
    >


  export type SegmentoClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    descricao?: boolean
    regras?: boolean
    totalClientes?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    clientes?: boolean | SegmentoCliente$clientesArgs<ExtArgs>
    _count?: boolean | SegmentoClienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["segmentoCliente"]>

  export type SegmentoClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    descricao?: boolean
    regras?: boolean
    totalClientes?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["segmentoCliente"]>

  export type SegmentoClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    descricao?: boolean
    regras?: boolean
    totalClientes?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type SegmentoClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientes?: boolean | SegmentoCliente$clientesArgs<ExtArgs>
    _count?: boolean | SegmentoClienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SegmentoClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SegmentoClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SegmentoCliente"
    objects: {
      clientes: Prisma.$ClienteSegmentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      descricao: string | null
      regras: Prisma.JsonValue
      totalClientes: number
      ativo: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["segmentoCliente"]>
    composites: {}
  }

  type SegmentoClienteGetPayload<S extends boolean | null | undefined | SegmentoClienteDefaultArgs> = $Result.GetResult<Prisma.$SegmentoClientePayload, S>

  type SegmentoClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SegmentoClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SegmentoClienteCountAggregateInputType | true
    }

  export interface SegmentoClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SegmentoCliente'], meta: { name: 'SegmentoCliente' } }
    /**
     * Find zero or one SegmentoCliente that matches the filter.
     * @param {SegmentoClienteFindUniqueArgs} args - Arguments to find a SegmentoCliente
     * @example
     * // Get one SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SegmentoClienteFindUniqueArgs>(args: SelectSubset<T, SegmentoClienteFindUniqueArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SegmentoCliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SegmentoClienteFindUniqueOrThrowArgs} args - Arguments to find a SegmentoCliente
     * @example
     * // Get one SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SegmentoClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, SegmentoClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SegmentoCliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteFindFirstArgs} args - Arguments to find a SegmentoCliente
     * @example
     * // Get one SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SegmentoClienteFindFirstArgs>(args?: SelectSubset<T, SegmentoClienteFindFirstArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SegmentoCliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteFindFirstOrThrowArgs} args - Arguments to find a SegmentoCliente
     * @example
     * // Get one SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SegmentoClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, SegmentoClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SegmentoClientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SegmentoClientes
     * const segmentoClientes = await prisma.segmentoCliente.findMany()
     * 
     * // Get first 10 SegmentoClientes
     * const segmentoClientes = await prisma.segmentoCliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const segmentoClienteWithIdOnly = await prisma.segmentoCliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SegmentoClienteFindManyArgs>(args?: SelectSubset<T, SegmentoClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SegmentoCliente.
     * @param {SegmentoClienteCreateArgs} args - Arguments to create a SegmentoCliente.
     * @example
     * // Create one SegmentoCliente
     * const SegmentoCliente = await prisma.segmentoCliente.create({
     *   data: {
     *     // ... data to create a SegmentoCliente
     *   }
     * })
     * 
     */
    create<T extends SegmentoClienteCreateArgs>(args: SelectSubset<T, SegmentoClienteCreateArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SegmentoClientes.
     * @param {SegmentoClienteCreateManyArgs} args - Arguments to create many SegmentoClientes.
     * @example
     * // Create many SegmentoClientes
     * const segmentoCliente = await prisma.segmentoCliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SegmentoClienteCreateManyArgs>(args?: SelectSubset<T, SegmentoClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SegmentoClientes and returns the data saved in the database.
     * @param {SegmentoClienteCreateManyAndReturnArgs} args - Arguments to create many SegmentoClientes.
     * @example
     * // Create many SegmentoClientes
     * const segmentoCliente = await prisma.segmentoCliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SegmentoClientes and only return the `id`
     * const segmentoClienteWithIdOnly = await prisma.segmentoCliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SegmentoClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, SegmentoClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SegmentoCliente.
     * @param {SegmentoClienteDeleteArgs} args - Arguments to delete one SegmentoCliente.
     * @example
     * // Delete one SegmentoCliente
     * const SegmentoCliente = await prisma.segmentoCliente.delete({
     *   where: {
     *     // ... filter to delete one SegmentoCliente
     *   }
     * })
     * 
     */
    delete<T extends SegmentoClienteDeleteArgs>(args: SelectSubset<T, SegmentoClienteDeleteArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SegmentoCliente.
     * @param {SegmentoClienteUpdateArgs} args - Arguments to update one SegmentoCliente.
     * @example
     * // Update one SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SegmentoClienteUpdateArgs>(args: SelectSubset<T, SegmentoClienteUpdateArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SegmentoClientes.
     * @param {SegmentoClienteDeleteManyArgs} args - Arguments to filter SegmentoClientes to delete.
     * @example
     * // Delete a few SegmentoClientes
     * const { count } = await prisma.segmentoCliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SegmentoClienteDeleteManyArgs>(args?: SelectSubset<T, SegmentoClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SegmentoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SegmentoClientes
     * const segmentoCliente = await prisma.segmentoCliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SegmentoClienteUpdateManyArgs>(args: SelectSubset<T, SegmentoClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SegmentoCliente.
     * @param {SegmentoClienteUpsertArgs} args - Arguments to update or create a SegmentoCliente.
     * @example
     * // Update or create a SegmentoCliente
     * const segmentoCliente = await prisma.segmentoCliente.upsert({
     *   create: {
     *     // ... data to create a SegmentoCliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SegmentoCliente we want to update
     *   }
     * })
     */
    upsert<T extends SegmentoClienteUpsertArgs>(args: SelectSubset<T, SegmentoClienteUpsertArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SegmentoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteCountArgs} args - Arguments to filter SegmentoClientes to count.
     * @example
     * // Count the number of SegmentoClientes
     * const count = await prisma.segmentoCliente.count({
     *   where: {
     *     // ... the filter for the SegmentoClientes we want to count
     *   }
     * })
    **/
    count<T extends SegmentoClienteCountArgs>(
      args?: Subset<T, SegmentoClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SegmentoClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SegmentoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SegmentoClienteAggregateArgs>(args: Subset<T, SegmentoClienteAggregateArgs>): Prisma.PrismaPromise<GetSegmentoClienteAggregateType<T>>

    /**
     * Group by SegmentoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SegmentoClienteGroupByArgs} args - Group by arguments.
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
      T extends SegmentoClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SegmentoClienteGroupByArgs['orderBy'] }
        : { orderBy?: SegmentoClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SegmentoClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSegmentoClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SegmentoCliente model
   */
  readonly fields: SegmentoClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SegmentoCliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SegmentoClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientes<T extends SegmentoCliente$clientesArgs<ExtArgs> = {}>(args?: Subset<T, SegmentoCliente$clientesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the SegmentoCliente model
   */ 
  interface SegmentoClienteFieldRefs {
    readonly id: FieldRef<"SegmentoCliente", 'String'>
    readonly tenantId: FieldRef<"SegmentoCliente", 'String'>
    readonly nome: FieldRef<"SegmentoCliente", 'String'>
    readonly descricao: FieldRef<"SegmentoCliente", 'String'>
    readonly regras: FieldRef<"SegmentoCliente", 'Json'>
    readonly totalClientes: FieldRef<"SegmentoCliente", 'Int'>
    readonly ativo: FieldRef<"SegmentoCliente", 'Boolean'>
    readonly criadoEm: FieldRef<"SegmentoCliente", 'DateTime'>
    readonly atualizadoEm: FieldRef<"SegmentoCliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SegmentoCliente findUnique
   */
  export type SegmentoClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter, which SegmentoCliente to fetch.
     */
    where: SegmentoClienteWhereUniqueInput
  }

  /**
   * SegmentoCliente findUniqueOrThrow
   */
  export type SegmentoClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter, which SegmentoCliente to fetch.
     */
    where: SegmentoClienteWhereUniqueInput
  }

  /**
   * SegmentoCliente findFirst
   */
  export type SegmentoClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter, which SegmentoCliente to fetch.
     */
    where?: SegmentoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SegmentoClientes to fetch.
     */
    orderBy?: SegmentoClienteOrderByWithRelationInput | SegmentoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SegmentoClientes.
     */
    cursor?: SegmentoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SegmentoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SegmentoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SegmentoClientes.
     */
    distinct?: SegmentoClienteScalarFieldEnum | SegmentoClienteScalarFieldEnum[]
  }

  /**
   * SegmentoCliente findFirstOrThrow
   */
  export type SegmentoClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter, which SegmentoCliente to fetch.
     */
    where?: SegmentoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SegmentoClientes to fetch.
     */
    orderBy?: SegmentoClienteOrderByWithRelationInput | SegmentoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SegmentoClientes.
     */
    cursor?: SegmentoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SegmentoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SegmentoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SegmentoClientes.
     */
    distinct?: SegmentoClienteScalarFieldEnum | SegmentoClienteScalarFieldEnum[]
  }

  /**
   * SegmentoCliente findMany
   */
  export type SegmentoClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter, which SegmentoClientes to fetch.
     */
    where?: SegmentoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SegmentoClientes to fetch.
     */
    orderBy?: SegmentoClienteOrderByWithRelationInput | SegmentoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SegmentoClientes.
     */
    cursor?: SegmentoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SegmentoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SegmentoClientes.
     */
    skip?: number
    distinct?: SegmentoClienteScalarFieldEnum | SegmentoClienteScalarFieldEnum[]
  }

  /**
   * SegmentoCliente create
   */
  export type SegmentoClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a SegmentoCliente.
     */
    data: XOR<SegmentoClienteCreateInput, SegmentoClienteUncheckedCreateInput>
  }

  /**
   * SegmentoCliente createMany
   */
  export type SegmentoClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SegmentoClientes.
     */
    data: SegmentoClienteCreateManyInput | SegmentoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SegmentoCliente createManyAndReturn
   */
  export type SegmentoClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SegmentoClientes.
     */
    data: SegmentoClienteCreateManyInput | SegmentoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SegmentoCliente update
   */
  export type SegmentoClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a SegmentoCliente.
     */
    data: XOR<SegmentoClienteUpdateInput, SegmentoClienteUncheckedUpdateInput>
    /**
     * Choose, which SegmentoCliente to update.
     */
    where: SegmentoClienteWhereUniqueInput
  }

  /**
   * SegmentoCliente updateMany
   */
  export type SegmentoClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SegmentoClientes.
     */
    data: XOR<SegmentoClienteUpdateManyMutationInput, SegmentoClienteUncheckedUpdateManyInput>
    /**
     * Filter which SegmentoClientes to update
     */
    where?: SegmentoClienteWhereInput
  }

  /**
   * SegmentoCliente upsert
   */
  export type SegmentoClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the SegmentoCliente to update in case it exists.
     */
    where: SegmentoClienteWhereUniqueInput
    /**
     * In case the SegmentoCliente found by the `where` argument doesn't exist, create a new SegmentoCliente with this data.
     */
    create: XOR<SegmentoClienteCreateInput, SegmentoClienteUncheckedCreateInput>
    /**
     * In case the SegmentoCliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SegmentoClienteUpdateInput, SegmentoClienteUncheckedUpdateInput>
  }

  /**
   * SegmentoCliente delete
   */
  export type SegmentoClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
    /**
     * Filter which SegmentoCliente to delete.
     */
    where: SegmentoClienteWhereUniqueInput
  }

  /**
   * SegmentoCliente deleteMany
   */
  export type SegmentoClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SegmentoClientes to delete
     */
    where?: SegmentoClienteWhereInput
  }

  /**
   * SegmentoCliente.clientes
   */
  export type SegmentoCliente$clientesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    where?: ClienteSegmentoWhereInput
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    cursor?: ClienteSegmentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClienteSegmentoScalarFieldEnum | ClienteSegmentoScalarFieldEnum[]
  }

  /**
   * SegmentoCliente without action
   */
  export type SegmentoClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SegmentoCliente
     */
    select?: SegmentoClienteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SegmentoClienteInclude<ExtArgs> | null
  }


  /**
   * Model ClienteSegmento
   */

  export type AggregateClienteSegmento = {
    _count: ClienteSegmentoCountAggregateOutputType | null
    _min: ClienteSegmentoMinAggregateOutputType | null
    _max: ClienteSegmentoMaxAggregateOutputType | null
  }

  export type ClienteSegmentoMinAggregateOutputType = {
    id: string | null
    clienteId: string | null
    segmentoId: string | null
    adicionadoEm: Date | null
  }

  export type ClienteSegmentoMaxAggregateOutputType = {
    id: string | null
    clienteId: string | null
    segmentoId: string | null
    adicionadoEm: Date | null
  }

  export type ClienteSegmentoCountAggregateOutputType = {
    id: number
    clienteId: number
    segmentoId: number
    adicionadoEm: number
    _all: number
  }


  export type ClienteSegmentoMinAggregateInputType = {
    id?: true
    clienteId?: true
    segmentoId?: true
    adicionadoEm?: true
  }

  export type ClienteSegmentoMaxAggregateInputType = {
    id?: true
    clienteId?: true
    segmentoId?: true
    adicionadoEm?: true
  }

  export type ClienteSegmentoCountAggregateInputType = {
    id?: true
    clienteId?: true
    segmentoId?: true
    adicionadoEm?: true
    _all?: true
  }

  export type ClienteSegmentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClienteSegmento to aggregate.
     */
    where?: ClienteSegmentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClienteSegmentos to fetch.
     */
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteSegmentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClienteSegmentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClienteSegmentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClienteSegmentos
    **/
    _count?: true | ClienteSegmentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteSegmentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteSegmentoMaxAggregateInputType
  }

  export type GetClienteSegmentoAggregateType<T extends ClienteSegmentoAggregateArgs> = {
        [P in keyof T & keyof AggregateClienteSegmento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClienteSegmento[P]>
      : GetScalarType<T[P], AggregateClienteSegmento[P]>
  }




  export type ClienteSegmentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteSegmentoWhereInput
    orderBy?: ClienteSegmentoOrderByWithAggregationInput | ClienteSegmentoOrderByWithAggregationInput[]
    by: ClienteSegmentoScalarFieldEnum[] | ClienteSegmentoScalarFieldEnum
    having?: ClienteSegmentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteSegmentoCountAggregateInputType | true
    _min?: ClienteSegmentoMinAggregateInputType
    _max?: ClienteSegmentoMaxAggregateInputType
  }

  export type ClienteSegmentoGroupByOutputType = {
    id: string
    clienteId: string
    segmentoId: string
    adicionadoEm: Date
    _count: ClienteSegmentoCountAggregateOutputType | null
    _min: ClienteSegmentoMinAggregateOutputType | null
    _max: ClienteSegmentoMaxAggregateOutputType | null
  }

  type GetClienteSegmentoGroupByPayload<T extends ClienteSegmentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteSegmentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteSegmentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteSegmentoGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteSegmentoGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSegmentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clienteId?: boolean
    segmentoId?: boolean
    adicionadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    segmento?: boolean | SegmentoClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clienteSegmento"]>

  export type ClienteSegmentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clienteId?: boolean
    segmentoId?: boolean
    adicionadoEm?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    segmento?: boolean | SegmentoClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clienteSegmento"]>

  export type ClienteSegmentoSelectScalar = {
    id?: boolean
    clienteId?: boolean
    segmentoId?: boolean
    adicionadoEm?: boolean
  }

  export type ClienteSegmentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    segmento?: boolean | SegmentoClienteDefaultArgs<ExtArgs>
  }
  export type ClienteSegmentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    segmento?: boolean | SegmentoClienteDefaultArgs<ExtArgs>
  }

  export type $ClienteSegmentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClienteSegmento"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
      segmento: Prisma.$SegmentoClientePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clienteId: string
      segmentoId: string
      adicionadoEm: Date
    }, ExtArgs["result"]["clienteSegmento"]>
    composites: {}
  }

  type ClienteSegmentoGetPayload<S extends boolean | null | undefined | ClienteSegmentoDefaultArgs> = $Result.GetResult<Prisma.$ClienteSegmentoPayload, S>

  type ClienteSegmentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClienteSegmentoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClienteSegmentoCountAggregateInputType | true
    }

  export interface ClienteSegmentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClienteSegmento'], meta: { name: 'ClienteSegmento' } }
    /**
     * Find zero or one ClienteSegmento that matches the filter.
     * @param {ClienteSegmentoFindUniqueArgs} args - Arguments to find a ClienteSegmento
     * @example
     * // Get one ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteSegmentoFindUniqueArgs>(args: SelectSubset<T, ClienteSegmentoFindUniqueArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClienteSegmento that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClienteSegmentoFindUniqueOrThrowArgs} args - Arguments to find a ClienteSegmento
     * @example
     * // Get one ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteSegmentoFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteSegmentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClienteSegmento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoFindFirstArgs} args - Arguments to find a ClienteSegmento
     * @example
     * // Get one ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteSegmentoFindFirstArgs>(args?: SelectSubset<T, ClienteSegmentoFindFirstArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClienteSegmento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoFindFirstOrThrowArgs} args - Arguments to find a ClienteSegmento
     * @example
     * // Get one ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteSegmentoFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteSegmentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClienteSegmentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClienteSegmentos
     * const clienteSegmentos = await prisma.clienteSegmento.findMany()
     * 
     * // Get first 10 ClienteSegmentos
     * const clienteSegmentos = await prisma.clienteSegmento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteSegmentoWithIdOnly = await prisma.clienteSegmento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteSegmentoFindManyArgs>(args?: SelectSubset<T, ClienteSegmentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClienteSegmento.
     * @param {ClienteSegmentoCreateArgs} args - Arguments to create a ClienteSegmento.
     * @example
     * // Create one ClienteSegmento
     * const ClienteSegmento = await prisma.clienteSegmento.create({
     *   data: {
     *     // ... data to create a ClienteSegmento
     *   }
     * })
     * 
     */
    create<T extends ClienteSegmentoCreateArgs>(args: SelectSubset<T, ClienteSegmentoCreateArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClienteSegmentos.
     * @param {ClienteSegmentoCreateManyArgs} args - Arguments to create many ClienteSegmentos.
     * @example
     * // Create many ClienteSegmentos
     * const clienteSegmento = await prisma.clienteSegmento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteSegmentoCreateManyArgs>(args?: SelectSubset<T, ClienteSegmentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClienteSegmentos and returns the data saved in the database.
     * @param {ClienteSegmentoCreateManyAndReturnArgs} args - Arguments to create many ClienteSegmentos.
     * @example
     * // Create many ClienteSegmentos
     * const clienteSegmento = await prisma.clienteSegmento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClienteSegmentos and only return the `id`
     * const clienteSegmentoWithIdOnly = await prisma.clienteSegmento.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteSegmentoCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteSegmentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClienteSegmento.
     * @param {ClienteSegmentoDeleteArgs} args - Arguments to delete one ClienteSegmento.
     * @example
     * // Delete one ClienteSegmento
     * const ClienteSegmento = await prisma.clienteSegmento.delete({
     *   where: {
     *     // ... filter to delete one ClienteSegmento
     *   }
     * })
     * 
     */
    delete<T extends ClienteSegmentoDeleteArgs>(args: SelectSubset<T, ClienteSegmentoDeleteArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClienteSegmento.
     * @param {ClienteSegmentoUpdateArgs} args - Arguments to update one ClienteSegmento.
     * @example
     * // Update one ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteSegmentoUpdateArgs>(args: SelectSubset<T, ClienteSegmentoUpdateArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClienteSegmentos.
     * @param {ClienteSegmentoDeleteManyArgs} args - Arguments to filter ClienteSegmentos to delete.
     * @example
     * // Delete a few ClienteSegmentos
     * const { count } = await prisma.clienteSegmento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteSegmentoDeleteManyArgs>(args?: SelectSubset<T, ClienteSegmentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClienteSegmentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClienteSegmentos
     * const clienteSegmento = await prisma.clienteSegmento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteSegmentoUpdateManyArgs>(args: SelectSubset<T, ClienteSegmentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClienteSegmento.
     * @param {ClienteSegmentoUpsertArgs} args - Arguments to update or create a ClienteSegmento.
     * @example
     * // Update or create a ClienteSegmento
     * const clienteSegmento = await prisma.clienteSegmento.upsert({
     *   create: {
     *     // ... data to create a ClienteSegmento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClienteSegmento we want to update
     *   }
     * })
     */
    upsert<T extends ClienteSegmentoUpsertArgs>(args: SelectSubset<T, ClienteSegmentoUpsertArgs<ExtArgs>>): Prisma__ClienteSegmentoClient<$Result.GetResult<Prisma.$ClienteSegmentoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClienteSegmentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoCountArgs} args - Arguments to filter ClienteSegmentos to count.
     * @example
     * // Count the number of ClienteSegmentos
     * const count = await prisma.clienteSegmento.count({
     *   where: {
     *     // ... the filter for the ClienteSegmentos we want to count
     *   }
     * })
    **/
    count<T extends ClienteSegmentoCountArgs>(
      args?: Subset<T, ClienteSegmentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteSegmentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClienteSegmento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClienteSegmentoAggregateArgs>(args: Subset<T, ClienteSegmentoAggregateArgs>): Prisma.PrismaPromise<GetClienteSegmentoAggregateType<T>>

    /**
     * Group by ClienteSegmento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteSegmentoGroupByArgs} args - Group by arguments.
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
      T extends ClienteSegmentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteSegmentoGroupByArgs['orderBy'] }
        : { orderBy?: ClienteSegmentoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClienteSegmentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteSegmentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClienteSegmento model
   */
  readonly fields: ClienteSegmentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClienteSegmento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteSegmentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    segmento<T extends SegmentoClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SegmentoClienteDefaultArgs<ExtArgs>>): Prisma__SegmentoClienteClient<$Result.GetResult<Prisma.$SegmentoClientePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ClienteSegmento model
   */ 
  interface ClienteSegmentoFieldRefs {
    readonly id: FieldRef<"ClienteSegmento", 'String'>
    readonly clienteId: FieldRef<"ClienteSegmento", 'String'>
    readonly segmentoId: FieldRef<"ClienteSegmento", 'String'>
    readonly adicionadoEm: FieldRef<"ClienteSegmento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClienteSegmento findUnique
   */
  export type ClienteSegmentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter, which ClienteSegmento to fetch.
     */
    where: ClienteSegmentoWhereUniqueInput
  }

  /**
   * ClienteSegmento findUniqueOrThrow
   */
  export type ClienteSegmentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter, which ClienteSegmento to fetch.
     */
    where: ClienteSegmentoWhereUniqueInput
  }

  /**
   * ClienteSegmento findFirst
   */
  export type ClienteSegmentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter, which ClienteSegmento to fetch.
     */
    where?: ClienteSegmentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClienteSegmentos to fetch.
     */
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClienteSegmentos.
     */
    cursor?: ClienteSegmentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClienteSegmentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClienteSegmentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClienteSegmentos.
     */
    distinct?: ClienteSegmentoScalarFieldEnum | ClienteSegmentoScalarFieldEnum[]
  }

  /**
   * ClienteSegmento findFirstOrThrow
   */
  export type ClienteSegmentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter, which ClienteSegmento to fetch.
     */
    where?: ClienteSegmentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClienteSegmentos to fetch.
     */
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClienteSegmentos.
     */
    cursor?: ClienteSegmentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClienteSegmentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClienteSegmentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClienteSegmentos.
     */
    distinct?: ClienteSegmentoScalarFieldEnum | ClienteSegmentoScalarFieldEnum[]
  }

  /**
   * ClienteSegmento findMany
   */
  export type ClienteSegmentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter, which ClienteSegmentos to fetch.
     */
    where?: ClienteSegmentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClienteSegmentos to fetch.
     */
    orderBy?: ClienteSegmentoOrderByWithRelationInput | ClienteSegmentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClienteSegmentos.
     */
    cursor?: ClienteSegmentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClienteSegmentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClienteSegmentos.
     */
    skip?: number
    distinct?: ClienteSegmentoScalarFieldEnum | ClienteSegmentoScalarFieldEnum[]
  }

  /**
   * ClienteSegmento create
   */
  export type ClienteSegmentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * The data needed to create a ClienteSegmento.
     */
    data: XOR<ClienteSegmentoCreateInput, ClienteSegmentoUncheckedCreateInput>
  }

  /**
   * ClienteSegmento createMany
   */
  export type ClienteSegmentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClienteSegmentos.
     */
    data: ClienteSegmentoCreateManyInput | ClienteSegmentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClienteSegmento createManyAndReturn
   */
  export type ClienteSegmentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClienteSegmentos.
     */
    data: ClienteSegmentoCreateManyInput | ClienteSegmentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClienteSegmento update
   */
  export type ClienteSegmentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * The data needed to update a ClienteSegmento.
     */
    data: XOR<ClienteSegmentoUpdateInput, ClienteSegmentoUncheckedUpdateInput>
    /**
     * Choose, which ClienteSegmento to update.
     */
    where: ClienteSegmentoWhereUniqueInput
  }

  /**
   * ClienteSegmento updateMany
   */
  export type ClienteSegmentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClienteSegmentos.
     */
    data: XOR<ClienteSegmentoUpdateManyMutationInput, ClienteSegmentoUncheckedUpdateManyInput>
    /**
     * Filter which ClienteSegmentos to update
     */
    where?: ClienteSegmentoWhereInput
  }

  /**
   * ClienteSegmento upsert
   */
  export type ClienteSegmentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * The filter to search for the ClienteSegmento to update in case it exists.
     */
    where: ClienteSegmentoWhereUniqueInput
    /**
     * In case the ClienteSegmento found by the `where` argument doesn't exist, create a new ClienteSegmento with this data.
     */
    create: XOR<ClienteSegmentoCreateInput, ClienteSegmentoUncheckedCreateInput>
    /**
     * In case the ClienteSegmento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteSegmentoUpdateInput, ClienteSegmentoUncheckedUpdateInput>
  }

  /**
   * ClienteSegmento delete
   */
  export type ClienteSegmentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
    /**
     * Filter which ClienteSegmento to delete.
     */
    where: ClienteSegmentoWhereUniqueInput
  }

  /**
   * ClienteSegmento deleteMany
   */
  export type ClienteSegmentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClienteSegmentos to delete
     */
    where?: ClienteSegmentoWhereInput
  }

  /**
   * ClienteSegmento without action
   */
  export type ClienteSegmentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteSegmento
     */
    select?: ClienteSegmentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteSegmentoInclude<ExtArgs> | null
  }


  /**
   * Model ImportacaoCliente
   */

  export type AggregateImportacaoCliente = {
    _count: ImportacaoClienteCountAggregateOutputType | null
    _avg: ImportacaoClienteAvgAggregateOutputType | null
    _sum: ImportacaoClienteSumAggregateOutputType | null
    _min: ImportacaoClienteMinAggregateOutputType | null
    _max: ImportacaoClienteMaxAggregateOutputType | null
  }

  export type ImportacaoClienteAvgAggregateOutputType = {
    totalRegistros: number | null
    importados: number | null
    erros: number | null
  }

  export type ImportacaoClienteSumAggregateOutputType = {
    totalRegistros: number | null
    importados: number | null
    erros: number | null
  }

  export type ImportacaoClienteMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    arquivo: string | null
    formato: $Enums.FormatoImportacao | null
    status: $Enums.StatusImportacao | null
    totalRegistros: number | null
    importados: number | null
    erros: number | null
    usuarioId: string | null
    criadoEm: Date | null
    concluidoEm: Date | null
  }

  export type ImportacaoClienteMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    arquivo: string | null
    formato: $Enums.FormatoImportacao | null
    status: $Enums.StatusImportacao | null
    totalRegistros: number | null
    importados: number | null
    erros: number | null
    usuarioId: string | null
    criadoEm: Date | null
    concluidoEm: Date | null
  }

  export type ImportacaoClienteCountAggregateOutputType = {
    id: number
    tenantId: number
    arquivo: number
    formato: number
    status: number
    totalRegistros: number
    importados: number
    erros: number
    logErros: number
    usuarioId: number
    criadoEm: number
    concluidoEm: number
    _all: number
  }


  export type ImportacaoClienteAvgAggregateInputType = {
    totalRegistros?: true
    importados?: true
    erros?: true
  }

  export type ImportacaoClienteSumAggregateInputType = {
    totalRegistros?: true
    importados?: true
    erros?: true
  }

  export type ImportacaoClienteMinAggregateInputType = {
    id?: true
    tenantId?: true
    arquivo?: true
    formato?: true
    status?: true
    totalRegistros?: true
    importados?: true
    erros?: true
    usuarioId?: true
    criadoEm?: true
    concluidoEm?: true
  }

  export type ImportacaoClienteMaxAggregateInputType = {
    id?: true
    tenantId?: true
    arquivo?: true
    formato?: true
    status?: true
    totalRegistros?: true
    importados?: true
    erros?: true
    usuarioId?: true
    criadoEm?: true
    concluidoEm?: true
  }

  export type ImportacaoClienteCountAggregateInputType = {
    id?: true
    tenantId?: true
    arquivo?: true
    formato?: true
    status?: true
    totalRegistros?: true
    importados?: true
    erros?: true
    logErros?: true
    usuarioId?: true
    criadoEm?: true
    concluidoEm?: true
    _all?: true
  }

  export type ImportacaoClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportacaoCliente to aggregate.
     */
    where?: ImportacaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportacaoClientes to fetch.
     */
    orderBy?: ImportacaoClienteOrderByWithRelationInput | ImportacaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportacaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportacaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportacaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportacaoClientes
    **/
    _count?: true | ImportacaoClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImportacaoClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImportacaoClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportacaoClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportacaoClienteMaxAggregateInputType
  }

  export type GetImportacaoClienteAggregateType<T extends ImportacaoClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateImportacaoCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportacaoCliente[P]>
      : GetScalarType<T[P], AggregateImportacaoCliente[P]>
  }




  export type ImportacaoClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportacaoClienteWhereInput
    orderBy?: ImportacaoClienteOrderByWithAggregationInput | ImportacaoClienteOrderByWithAggregationInput[]
    by: ImportacaoClienteScalarFieldEnum[] | ImportacaoClienteScalarFieldEnum
    having?: ImportacaoClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportacaoClienteCountAggregateInputType | true
    _avg?: ImportacaoClienteAvgAggregateInputType
    _sum?: ImportacaoClienteSumAggregateInputType
    _min?: ImportacaoClienteMinAggregateInputType
    _max?: ImportacaoClienteMaxAggregateInputType
  }

  export type ImportacaoClienteGroupByOutputType = {
    id: string
    tenantId: string
    arquivo: string
    formato: $Enums.FormatoImportacao
    status: $Enums.StatusImportacao
    totalRegistros: number
    importados: number
    erros: number
    logErros: JsonValue | null
    usuarioId: string
    criadoEm: Date
    concluidoEm: Date | null
    _count: ImportacaoClienteCountAggregateOutputType | null
    _avg: ImportacaoClienteAvgAggregateOutputType | null
    _sum: ImportacaoClienteSumAggregateOutputType | null
    _min: ImportacaoClienteMinAggregateOutputType | null
    _max: ImportacaoClienteMaxAggregateOutputType | null
  }

  type GetImportacaoClienteGroupByPayload<T extends ImportacaoClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportacaoClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportacaoClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportacaoClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ImportacaoClienteGroupByOutputType[P]>
        }
      >
    >


  export type ImportacaoClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    arquivo?: boolean
    formato?: boolean
    status?: boolean
    totalRegistros?: boolean
    importados?: boolean
    erros?: boolean
    logErros?: boolean
    usuarioId?: boolean
    criadoEm?: boolean
    concluidoEm?: boolean
  }, ExtArgs["result"]["importacaoCliente"]>

  export type ImportacaoClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    arquivo?: boolean
    formato?: boolean
    status?: boolean
    totalRegistros?: boolean
    importados?: boolean
    erros?: boolean
    logErros?: boolean
    usuarioId?: boolean
    criadoEm?: boolean
    concluidoEm?: boolean
  }, ExtArgs["result"]["importacaoCliente"]>

  export type ImportacaoClienteSelectScalar = {
    id?: boolean
    tenantId?: boolean
    arquivo?: boolean
    formato?: boolean
    status?: boolean
    totalRegistros?: boolean
    importados?: boolean
    erros?: boolean
    logErros?: boolean
    usuarioId?: boolean
    criadoEm?: boolean
    concluidoEm?: boolean
  }


  export type $ImportacaoClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportacaoCliente"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      arquivo: string
      formato: $Enums.FormatoImportacao
      status: $Enums.StatusImportacao
      totalRegistros: number
      importados: number
      erros: number
      logErros: Prisma.JsonValue | null
      usuarioId: string
      criadoEm: Date
      concluidoEm: Date | null
    }, ExtArgs["result"]["importacaoCliente"]>
    composites: {}
  }

  type ImportacaoClienteGetPayload<S extends boolean | null | undefined | ImportacaoClienteDefaultArgs> = $Result.GetResult<Prisma.$ImportacaoClientePayload, S>

  type ImportacaoClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImportacaoClienteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImportacaoClienteCountAggregateInputType | true
    }

  export interface ImportacaoClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportacaoCliente'], meta: { name: 'ImportacaoCliente' } }
    /**
     * Find zero or one ImportacaoCliente that matches the filter.
     * @param {ImportacaoClienteFindUniqueArgs} args - Arguments to find a ImportacaoCliente
     * @example
     * // Get one ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportacaoClienteFindUniqueArgs>(args: SelectSubset<T, ImportacaoClienteFindUniqueArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ImportacaoCliente that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImportacaoClienteFindUniqueOrThrowArgs} args - Arguments to find a ImportacaoCliente
     * @example
     * // Get one ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportacaoClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportacaoClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ImportacaoCliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteFindFirstArgs} args - Arguments to find a ImportacaoCliente
     * @example
     * // Get one ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportacaoClienteFindFirstArgs>(args?: SelectSubset<T, ImportacaoClienteFindFirstArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ImportacaoCliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteFindFirstOrThrowArgs} args - Arguments to find a ImportacaoCliente
     * @example
     * // Get one ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportacaoClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportacaoClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ImportacaoClientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportacaoClientes
     * const importacaoClientes = await prisma.importacaoCliente.findMany()
     * 
     * // Get first 10 ImportacaoClientes
     * const importacaoClientes = await prisma.importacaoCliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importacaoClienteWithIdOnly = await prisma.importacaoCliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportacaoClienteFindManyArgs>(args?: SelectSubset<T, ImportacaoClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ImportacaoCliente.
     * @param {ImportacaoClienteCreateArgs} args - Arguments to create a ImportacaoCliente.
     * @example
     * // Create one ImportacaoCliente
     * const ImportacaoCliente = await prisma.importacaoCliente.create({
     *   data: {
     *     // ... data to create a ImportacaoCliente
     *   }
     * })
     * 
     */
    create<T extends ImportacaoClienteCreateArgs>(args: SelectSubset<T, ImportacaoClienteCreateArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ImportacaoClientes.
     * @param {ImportacaoClienteCreateManyArgs} args - Arguments to create many ImportacaoClientes.
     * @example
     * // Create many ImportacaoClientes
     * const importacaoCliente = await prisma.importacaoCliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportacaoClienteCreateManyArgs>(args?: SelectSubset<T, ImportacaoClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportacaoClientes and returns the data saved in the database.
     * @param {ImportacaoClienteCreateManyAndReturnArgs} args - Arguments to create many ImportacaoClientes.
     * @example
     * // Create many ImportacaoClientes
     * const importacaoCliente = await prisma.importacaoCliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportacaoClientes and only return the `id`
     * const importacaoClienteWithIdOnly = await prisma.importacaoCliente.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportacaoClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportacaoClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ImportacaoCliente.
     * @param {ImportacaoClienteDeleteArgs} args - Arguments to delete one ImportacaoCliente.
     * @example
     * // Delete one ImportacaoCliente
     * const ImportacaoCliente = await prisma.importacaoCliente.delete({
     *   where: {
     *     // ... filter to delete one ImportacaoCliente
     *   }
     * })
     * 
     */
    delete<T extends ImportacaoClienteDeleteArgs>(args: SelectSubset<T, ImportacaoClienteDeleteArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ImportacaoCliente.
     * @param {ImportacaoClienteUpdateArgs} args - Arguments to update one ImportacaoCliente.
     * @example
     * // Update one ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportacaoClienteUpdateArgs>(args: SelectSubset<T, ImportacaoClienteUpdateArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ImportacaoClientes.
     * @param {ImportacaoClienteDeleteManyArgs} args - Arguments to filter ImportacaoClientes to delete.
     * @example
     * // Delete a few ImportacaoClientes
     * const { count } = await prisma.importacaoCliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportacaoClienteDeleteManyArgs>(args?: SelectSubset<T, ImportacaoClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportacaoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportacaoClientes
     * const importacaoCliente = await prisma.importacaoCliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportacaoClienteUpdateManyArgs>(args: SelectSubset<T, ImportacaoClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImportacaoCliente.
     * @param {ImportacaoClienteUpsertArgs} args - Arguments to update or create a ImportacaoCliente.
     * @example
     * // Update or create a ImportacaoCliente
     * const importacaoCliente = await prisma.importacaoCliente.upsert({
     *   create: {
     *     // ... data to create a ImportacaoCliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportacaoCliente we want to update
     *   }
     * })
     */
    upsert<T extends ImportacaoClienteUpsertArgs>(args: SelectSubset<T, ImportacaoClienteUpsertArgs<ExtArgs>>): Prisma__ImportacaoClienteClient<$Result.GetResult<Prisma.$ImportacaoClientePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ImportacaoClientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteCountArgs} args - Arguments to filter ImportacaoClientes to count.
     * @example
     * // Count the number of ImportacaoClientes
     * const count = await prisma.importacaoCliente.count({
     *   where: {
     *     // ... the filter for the ImportacaoClientes we want to count
     *   }
     * })
    **/
    count<T extends ImportacaoClienteCountArgs>(
      args?: Subset<T, ImportacaoClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportacaoClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportacaoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImportacaoClienteAggregateArgs>(args: Subset<T, ImportacaoClienteAggregateArgs>): Prisma.PrismaPromise<GetImportacaoClienteAggregateType<T>>

    /**
     * Group by ImportacaoCliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportacaoClienteGroupByArgs} args - Group by arguments.
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
      T extends ImportacaoClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportacaoClienteGroupByArgs['orderBy'] }
        : { orderBy?: ImportacaoClienteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImportacaoClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportacaoClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportacaoCliente model
   */
  readonly fields: ImportacaoClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportacaoCliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportacaoClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ImportacaoCliente model
   */ 
  interface ImportacaoClienteFieldRefs {
    readonly id: FieldRef<"ImportacaoCliente", 'String'>
    readonly tenantId: FieldRef<"ImportacaoCliente", 'String'>
    readonly arquivo: FieldRef<"ImportacaoCliente", 'String'>
    readonly formato: FieldRef<"ImportacaoCliente", 'FormatoImportacao'>
    readonly status: FieldRef<"ImportacaoCliente", 'StatusImportacao'>
    readonly totalRegistros: FieldRef<"ImportacaoCliente", 'Int'>
    readonly importados: FieldRef<"ImportacaoCliente", 'Int'>
    readonly erros: FieldRef<"ImportacaoCliente", 'Int'>
    readonly logErros: FieldRef<"ImportacaoCliente", 'Json'>
    readonly usuarioId: FieldRef<"ImportacaoCliente", 'String'>
    readonly criadoEm: FieldRef<"ImportacaoCliente", 'DateTime'>
    readonly concluidoEm: FieldRef<"ImportacaoCliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImportacaoCliente findUnique
   */
  export type ImportacaoClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter, which ImportacaoCliente to fetch.
     */
    where: ImportacaoClienteWhereUniqueInput
  }

  /**
   * ImportacaoCliente findUniqueOrThrow
   */
  export type ImportacaoClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter, which ImportacaoCliente to fetch.
     */
    where: ImportacaoClienteWhereUniqueInput
  }

  /**
   * ImportacaoCliente findFirst
   */
  export type ImportacaoClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter, which ImportacaoCliente to fetch.
     */
    where?: ImportacaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportacaoClientes to fetch.
     */
    orderBy?: ImportacaoClienteOrderByWithRelationInput | ImportacaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportacaoClientes.
     */
    cursor?: ImportacaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportacaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportacaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportacaoClientes.
     */
    distinct?: ImportacaoClienteScalarFieldEnum | ImportacaoClienteScalarFieldEnum[]
  }

  /**
   * ImportacaoCliente findFirstOrThrow
   */
  export type ImportacaoClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter, which ImportacaoCliente to fetch.
     */
    where?: ImportacaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportacaoClientes to fetch.
     */
    orderBy?: ImportacaoClienteOrderByWithRelationInput | ImportacaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportacaoClientes.
     */
    cursor?: ImportacaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportacaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportacaoClientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportacaoClientes.
     */
    distinct?: ImportacaoClienteScalarFieldEnum | ImportacaoClienteScalarFieldEnum[]
  }

  /**
   * ImportacaoCliente findMany
   */
  export type ImportacaoClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter, which ImportacaoClientes to fetch.
     */
    where?: ImportacaoClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportacaoClientes to fetch.
     */
    orderBy?: ImportacaoClienteOrderByWithRelationInput | ImportacaoClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportacaoClientes.
     */
    cursor?: ImportacaoClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportacaoClientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportacaoClientes.
     */
    skip?: number
    distinct?: ImportacaoClienteScalarFieldEnum | ImportacaoClienteScalarFieldEnum[]
  }

  /**
   * ImportacaoCliente create
   */
  export type ImportacaoClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * The data needed to create a ImportacaoCliente.
     */
    data: XOR<ImportacaoClienteCreateInput, ImportacaoClienteUncheckedCreateInput>
  }

  /**
   * ImportacaoCliente createMany
   */
  export type ImportacaoClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportacaoClientes.
     */
    data: ImportacaoClienteCreateManyInput | ImportacaoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportacaoCliente createManyAndReturn
   */
  export type ImportacaoClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ImportacaoClientes.
     */
    data: ImportacaoClienteCreateManyInput | ImportacaoClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportacaoCliente update
   */
  export type ImportacaoClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * The data needed to update a ImportacaoCliente.
     */
    data: XOR<ImportacaoClienteUpdateInput, ImportacaoClienteUncheckedUpdateInput>
    /**
     * Choose, which ImportacaoCliente to update.
     */
    where: ImportacaoClienteWhereUniqueInput
  }

  /**
   * ImportacaoCliente updateMany
   */
  export type ImportacaoClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportacaoClientes.
     */
    data: XOR<ImportacaoClienteUpdateManyMutationInput, ImportacaoClienteUncheckedUpdateManyInput>
    /**
     * Filter which ImportacaoClientes to update
     */
    where?: ImportacaoClienteWhereInput
  }

  /**
   * ImportacaoCliente upsert
   */
  export type ImportacaoClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * The filter to search for the ImportacaoCliente to update in case it exists.
     */
    where: ImportacaoClienteWhereUniqueInput
    /**
     * In case the ImportacaoCliente found by the `where` argument doesn't exist, create a new ImportacaoCliente with this data.
     */
    create: XOR<ImportacaoClienteCreateInput, ImportacaoClienteUncheckedCreateInput>
    /**
     * In case the ImportacaoCliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportacaoClienteUpdateInput, ImportacaoClienteUncheckedUpdateInput>
  }

  /**
   * ImportacaoCliente delete
   */
  export type ImportacaoClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
    /**
     * Filter which ImportacaoCliente to delete.
     */
    where: ImportacaoClienteWhereUniqueInput
  }

  /**
   * ImportacaoCliente deleteMany
   */
  export type ImportacaoClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportacaoClientes to delete
     */
    where?: ImportacaoClienteWhereInput
  }

  /**
   * ImportacaoCliente without action
   */
  export type ImportacaoClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportacaoCliente
     */
    select?: ImportacaoClienteSelect<ExtArgs> | null
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


  export const ClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    tipo: 'tipo',
    nome: 'nome',
    nomeFantasia: 'nomeFantasia',
    razaoSocial: 'razaoSocial',
    cpf: 'cpf',
    cnpj: 'cnpj',
    inscricaoEstadual: 'inscricaoEstadual',
    email: 'email',
    emailSecundario: 'emailSecundario',
    telefone: 'telefone',
    celular: 'celular',
    dataNascimento: 'dataNascimento',
    genero: 'genero',
    observacoes: 'observacoes',
    tags: 'tags',
    score: 'score',
    status: 'status',
    origem: 'origem',
    ultimaCompra: 'ultimaCompra',
    totalCompras: 'totalCompras',
    valorTotalCompras: 'valorTotalCompras',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const EnderecoClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    clienteId: 'clienteId',
    tipo: 'tipo',
    logradouro: 'logradouro',
    numero: 'numero',
    complemento: 'complemento',
    bairro: 'bairro',
    cidade: 'cidade',
    estado: 'estado',
    cep: 'cep',
    pais: 'pais',
    padrao: 'padrao',
    criadoEm: 'criadoEm'
  };

  export type EnderecoClienteScalarFieldEnum = (typeof EnderecoClienteScalarFieldEnum)[keyof typeof EnderecoClienteScalarFieldEnum]


  export const ContatoClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    clienteId: 'clienteId',
    nome: 'nome',
    cargo: 'cargo',
    email: 'email',
    telefone: 'telefone',
    celular: 'celular',
    principal: 'principal',
    observacoes: 'observacoes',
    criadoEm: 'criadoEm'
  };

  export type ContatoClienteScalarFieldEnum = (typeof ContatoClienteScalarFieldEnum)[keyof typeof ContatoClienteScalarFieldEnum]


  export const InteracaoClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    clienteId: 'clienteId',
    tipo: 'tipo',
    canal: 'canal',
    titulo: 'titulo',
    descricao: 'descricao',
    data: 'data',
    usuarioId: 'usuarioId',
    pedidoId: 'pedidoId',
    metadata: 'metadata',
    criadoEm: 'criadoEm'
  };

  export type InteracaoClienteScalarFieldEnum = (typeof InteracaoClienteScalarFieldEnum)[keyof typeof InteracaoClienteScalarFieldEnum]


  export const SegmentoClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    nome: 'nome',
    descricao: 'descricao',
    regras: 'regras',
    totalClientes: 'totalClientes',
    ativo: 'ativo',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm'
  };

  export type SegmentoClienteScalarFieldEnum = (typeof SegmentoClienteScalarFieldEnum)[keyof typeof SegmentoClienteScalarFieldEnum]


  export const ClienteSegmentoScalarFieldEnum: {
    id: 'id',
    clienteId: 'clienteId',
    segmentoId: 'segmentoId',
    adicionadoEm: 'adicionadoEm'
  };

  export type ClienteSegmentoScalarFieldEnum = (typeof ClienteSegmentoScalarFieldEnum)[keyof typeof ClienteSegmentoScalarFieldEnum]


  export const ImportacaoClienteScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    arquivo: 'arquivo',
    formato: 'formato',
    status: 'status',
    totalRegistros: 'totalRegistros',
    importados: 'importados',
    erros: 'erros',
    logErros: 'logErros',
    usuarioId: 'usuarioId',
    criadoEm: 'criadoEm',
    concluidoEm: 'concluidoEm'
  };

  export type ImportacaoClienteScalarFieldEnum = (typeof ImportacaoClienteScalarFieldEnum)[keyof typeof ImportacaoClienteScalarFieldEnum]


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
   * Reference to a field of type 'TipoCliente'
   */
  export type EnumTipoClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoCliente'>
    


  /**
   * Reference to a field of type 'TipoCliente[]'
   */
  export type ListEnumTipoClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoCliente[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'StatusCliente'
   */
  export type EnumStatusClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusCliente'>
    


  /**
   * Reference to a field of type 'StatusCliente[]'
   */
  export type ListEnumStatusClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusCliente[]'>
    


  /**
   * Reference to a field of type 'OrigemCliente'
   */
  export type EnumOrigemClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrigemCliente'>
    


  /**
   * Reference to a field of type 'OrigemCliente[]'
   */
  export type ListEnumOrigemClienteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrigemCliente[]'>
    


  /**
   * Reference to a field of type 'TipoEndereco'
   */
  export type EnumTipoEnderecoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoEndereco'>
    


  /**
   * Reference to a field of type 'TipoEndereco[]'
   */
  export type ListEnumTipoEnderecoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoEndereco[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TipoInteracao'
   */
  export type EnumTipoInteracaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoInteracao'>
    


  /**
   * Reference to a field of type 'TipoInteracao[]'
   */
  export type ListEnumTipoInteracaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoInteracao[]'>
    


  /**
   * Reference to a field of type 'CanalInteracao'
   */
  export type EnumCanalInteracaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CanalInteracao'>
    


  /**
   * Reference to a field of type 'CanalInteracao[]'
   */
  export type ListEnumCanalInteracaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CanalInteracao[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'FormatoImportacao'
   */
  export type EnumFormatoImportacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormatoImportacao'>
    


  /**
   * Reference to a field of type 'FormatoImportacao[]'
   */
  export type ListEnumFormatoImportacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FormatoImportacao[]'>
    


  /**
   * Reference to a field of type 'StatusImportacao'
   */
  export type EnumStatusImportacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusImportacao'>
    


  /**
   * Reference to a field of type 'StatusImportacao[]'
   */
  export type ListEnumStatusImportacaoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusImportacao[]'>
    


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


  export type ClienteWhereInput = {
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    id?: StringFilter<"Cliente"> | string
    tenantId?: StringFilter<"Cliente"> | string
    tipo?: EnumTipoClienteFilter<"Cliente"> | $Enums.TipoCliente
    nome?: StringFilter<"Cliente"> | string
    nomeFantasia?: StringNullableFilter<"Cliente"> | string | null
    razaoSocial?: StringNullableFilter<"Cliente"> | string | null
    cpf?: StringNullableFilter<"Cliente"> | string | null
    cnpj?: StringNullableFilter<"Cliente"> | string | null
    inscricaoEstadual?: StringNullableFilter<"Cliente"> | string | null
    email?: StringFilter<"Cliente"> | string
    emailSecundario?: StringNullableFilter<"Cliente"> | string | null
    telefone?: StringNullableFilter<"Cliente"> | string | null
    celular?: StringNullableFilter<"Cliente"> | string | null
    dataNascimento?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    genero?: StringNullableFilter<"Cliente"> | string | null
    observacoes?: StringNullableFilter<"Cliente"> | string | null
    tags?: StringNullableListFilter<"Cliente">
    score?: IntFilter<"Cliente"> | number
    status?: EnumStatusClienteFilter<"Cliente"> | $Enums.StatusCliente
    origem?: EnumOrigemClienteFilter<"Cliente"> | $Enums.OrigemCliente
    ultimaCompra?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    totalCompras?: IntFilter<"Cliente"> | number
    valorTotalCompras?: IntFilter<"Cliente"> | number
    criadoEm?: DateTimeFilter<"Cliente"> | Date | string
    atualizadoEm?: DateTimeFilter<"Cliente"> | Date | string
    enderecos?: EnderecoClienteListRelationFilter
    contatos?: ContatoClienteListRelationFilter
    interacoes?: InteracaoClienteListRelationFilter
    segmentos?: ClienteSegmentoListRelationFilter
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    nome?: SortOrder
    nomeFantasia?: SortOrderInput | SortOrder
    razaoSocial?: SortOrderInput | SortOrder
    cpf?: SortOrderInput | SortOrder
    cnpj?: SortOrderInput | SortOrder
    inscricaoEstadual?: SortOrderInput | SortOrder
    email?: SortOrder
    emailSecundario?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    celular?: SortOrderInput | SortOrder
    dataNascimento?: SortOrderInput | SortOrder
    genero?: SortOrderInput | SortOrder
    observacoes?: SortOrderInput | SortOrder
    tags?: SortOrder
    score?: SortOrder
    status?: SortOrder
    origem?: SortOrder
    ultimaCompra?: SortOrderInput | SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    enderecos?: EnderecoClienteOrderByRelationAggregateInput
    contatos?: ContatoClienteOrderByRelationAggregateInput
    interacoes?: InteracaoClienteOrderByRelationAggregateInput
    segmentos?: ClienteSegmentoOrderByRelationAggregateInput
  }

  export type ClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_cpf?: ClienteTenantIdCpfCompoundUniqueInput
    tenantId_cnpj?: ClienteTenantIdCnpjCompoundUniqueInput
    tenantId_email?: ClienteTenantIdEmailCompoundUniqueInput
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    tenantId?: StringFilter<"Cliente"> | string
    tipo?: EnumTipoClienteFilter<"Cliente"> | $Enums.TipoCliente
    nome?: StringFilter<"Cliente"> | string
    nomeFantasia?: StringNullableFilter<"Cliente"> | string | null
    razaoSocial?: StringNullableFilter<"Cliente"> | string | null
    cpf?: StringNullableFilter<"Cliente"> | string | null
    cnpj?: StringNullableFilter<"Cliente"> | string | null
    inscricaoEstadual?: StringNullableFilter<"Cliente"> | string | null
    email?: StringFilter<"Cliente"> | string
    emailSecundario?: StringNullableFilter<"Cliente"> | string | null
    telefone?: StringNullableFilter<"Cliente"> | string | null
    celular?: StringNullableFilter<"Cliente"> | string | null
    dataNascimento?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    genero?: StringNullableFilter<"Cliente"> | string | null
    observacoes?: StringNullableFilter<"Cliente"> | string | null
    tags?: StringNullableListFilter<"Cliente">
    score?: IntFilter<"Cliente"> | number
    status?: EnumStatusClienteFilter<"Cliente"> | $Enums.StatusCliente
    origem?: EnumOrigemClienteFilter<"Cliente"> | $Enums.OrigemCliente
    ultimaCompra?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    totalCompras?: IntFilter<"Cliente"> | number
    valorTotalCompras?: IntFilter<"Cliente"> | number
    criadoEm?: DateTimeFilter<"Cliente"> | Date | string
    atualizadoEm?: DateTimeFilter<"Cliente"> | Date | string
    enderecos?: EnderecoClienteListRelationFilter
    contatos?: ContatoClienteListRelationFilter
    interacoes?: InteracaoClienteListRelationFilter
    segmentos?: ClienteSegmentoListRelationFilter
  }, "id" | "tenantId_cpf" | "tenantId_cnpj" | "tenantId_email">

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    nome?: SortOrder
    nomeFantasia?: SortOrderInput | SortOrder
    razaoSocial?: SortOrderInput | SortOrder
    cpf?: SortOrderInput | SortOrder
    cnpj?: SortOrderInput | SortOrder
    inscricaoEstadual?: SortOrderInput | SortOrder
    email?: SortOrder
    emailSecundario?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    celular?: SortOrderInput | SortOrder
    dataNascimento?: SortOrderInput | SortOrder
    genero?: SortOrderInput | SortOrder
    observacoes?: SortOrderInput | SortOrder
    tags?: SortOrder
    score?: SortOrder
    status?: SortOrder
    origem?: SortOrder
    ultimaCompra?: SortOrderInput | SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _avg?: ClienteAvgOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
    _sum?: ClienteSumOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    OR?: ClienteScalarWhereWithAggregatesInput[]
    NOT?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cliente"> | string
    tenantId?: StringWithAggregatesFilter<"Cliente"> | string
    tipo?: EnumTipoClienteWithAggregatesFilter<"Cliente"> | $Enums.TipoCliente
    nome?: StringWithAggregatesFilter<"Cliente"> | string
    nomeFantasia?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    razaoSocial?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    cpf?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    cnpj?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    inscricaoEstadual?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    email?: StringWithAggregatesFilter<"Cliente"> | string
    emailSecundario?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    telefone?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    celular?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    dataNascimento?: DateTimeNullableWithAggregatesFilter<"Cliente"> | Date | string | null
    genero?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    observacoes?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    tags?: StringNullableListFilter<"Cliente">
    score?: IntWithAggregatesFilter<"Cliente"> | number
    status?: EnumStatusClienteWithAggregatesFilter<"Cliente"> | $Enums.StatusCliente
    origem?: EnumOrigemClienteWithAggregatesFilter<"Cliente"> | $Enums.OrigemCliente
    ultimaCompra?: DateTimeNullableWithAggregatesFilter<"Cliente"> | Date | string | null
    totalCompras?: IntWithAggregatesFilter<"Cliente"> | number
    valorTotalCompras?: IntWithAggregatesFilter<"Cliente"> | number
    criadoEm?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
  }

  export type EnderecoClienteWhereInput = {
    AND?: EnderecoClienteWhereInput | EnderecoClienteWhereInput[]
    OR?: EnderecoClienteWhereInput[]
    NOT?: EnderecoClienteWhereInput | EnderecoClienteWhereInput[]
    id?: StringFilter<"EnderecoCliente"> | string
    tenantId?: StringFilter<"EnderecoCliente"> | string
    clienteId?: StringFilter<"EnderecoCliente"> | string
    tipo?: EnumTipoEnderecoFilter<"EnderecoCliente"> | $Enums.TipoEndereco
    logradouro?: StringFilter<"EnderecoCliente"> | string
    numero?: StringFilter<"EnderecoCliente"> | string
    complemento?: StringNullableFilter<"EnderecoCliente"> | string | null
    bairro?: StringFilter<"EnderecoCliente"> | string
    cidade?: StringFilter<"EnderecoCliente"> | string
    estado?: StringFilter<"EnderecoCliente"> | string
    cep?: StringFilter<"EnderecoCliente"> | string
    pais?: StringFilter<"EnderecoCliente"> | string
    padrao?: BoolFilter<"EnderecoCliente"> | boolean
    criadoEm?: DateTimeFilter<"EnderecoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }

  export type EnderecoClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    complemento?: SortOrderInput | SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    cep?: SortOrder
    pais?: SortOrder
    padrao?: SortOrder
    criadoEm?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
  }

  export type EnderecoClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EnderecoClienteWhereInput | EnderecoClienteWhereInput[]
    OR?: EnderecoClienteWhereInput[]
    NOT?: EnderecoClienteWhereInput | EnderecoClienteWhereInput[]
    tenantId?: StringFilter<"EnderecoCliente"> | string
    clienteId?: StringFilter<"EnderecoCliente"> | string
    tipo?: EnumTipoEnderecoFilter<"EnderecoCliente"> | $Enums.TipoEndereco
    logradouro?: StringFilter<"EnderecoCliente"> | string
    numero?: StringFilter<"EnderecoCliente"> | string
    complemento?: StringNullableFilter<"EnderecoCliente"> | string | null
    bairro?: StringFilter<"EnderecoCliente"> | string
    cidade?: StringFilter<"EnderecoCliente"> | string
    estado?: StringFilter<"EnderecoCliente"> | string
    cep?: StringFilter<"EnderecoCliente"> | string
    pais?: StringFilter<"EnderecoCliente"> | string
    padrao?: BoolFilter<"EnderecoCliente"> | boolean
    criadoEm?: DateTimeFilter<"EnderecoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }, "id">

  export type EnderecoClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    complemento?: SortOrderInput | SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    cep?: SortOrder
    pais?: SortOrder
    padrao?: SortOrder
    criadoEm?: SortOrder
    _count?: EnderecoClienteCountOrderByAggregateInput
    _max?: EnderecoClienteMaxOrderByAggregateInput
    _min?: EnderecoClienteMinOrderByAggregateInput
  }

  export type EnderecoClienteScalarWhereWithAggregatesInput = {
    AND?: EnderecoClienteScalarWhereWithAggregatesInput | EnderecoClienteScalarWhereWithAggregatesInput[]
    OR?: EnderecoClienteScalarWhereWithAggregatesInput[]
    NOT?: EnderecoClienteScalarWhereWithAggregatesInput | EnderecoClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    tenantId?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    clienteId?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    tipo?: EnumTipoEnderecoWithAggregatesFilter<"EnderecoCliente"> | $Enums.TipoEndereco
    logradouro?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    numero?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    complemento?: StringNullableWithAggregatesFilter<"EnderecoCliente"> | string | null
    bairro?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    cidade?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    estado?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    cep?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    pais?: StringWithAggregatesFilter<"EnderecoCliente"> | string
    padrao?: BoolWithAggregatesFilter<"EnderecoCliente"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"EnderecoCliente"> | Date | string
  }

  export type ContatoClienteWhereInput = {
    AND?: ContatoClienteWhereInput | ContatoClienteWhereInput[]
    OR?: ContatoClienteWhereInput[]
    NOT?: ContatoClienteWhereInput | ContatoClienteWhereInput[]
    id?: StringFilter<"ContatoCliente"> | string
    tenantId?: StringFilter<"ContatoCliente"> | string
    clienteId?: StringFilter<"ContatoCliente"> | string
    nome?: StringFilter<"ContatoCliente"> | string
    cargo?: StringNullableFilter<"ContatoCliente"> | string | null
    email?: StringNullableFilter<"ContatoCliente"> | string | null
    telefone?: StringNullableFilter<"ContatoCliente"> | string | null
    celular?: StringNullableFilter<"ContatoCliente"> | string | null
    principal?: BoolFilter<"ContatoCliente"> | boolean
    observacoes?: StringNullableFilter<"ContatoCliente"> | string | null
    criadoEm?: DateTimeFilter<"ContatoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }

  export type ContatoClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    celular?: SortOrderInput | SortOrder
    principal?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
  }

  export type ContatoClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ContatoClienteWhereInput | ContatoClienteWhereInput[]
    OR?: ContatoClienteWhereInput[]
    NOT?: ContatoClienteWhereInput | ContatoClienteWhereInput[]
    tenantId?: StringFilter<"ContatoCliente"> | string
    clienteId?: StringFilter<"ContatoCliente"> | string
    nome?: StringFilter<"ContatoCliente"> | string
    cargo?: StringNullableFilter<"ContatoCliente"> | string | null
    email?: StringNullableFilter<"ContatoCliente"> | string | null
    telefone?: StringNullableFilter<"ContatoCliente"> | string | null
    celular?: StringNullableFilter<"ContatoCliente"> | string | null
    principal?: BoolFilter<"ContatoCliente"> | boolean
    observacoes?: StringNullableFilter<"ContatoCliente"> | string | null
    criadoEm?: DateTimeFilter<"ContatoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }, "id">

  export type ContatoClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    celular?: SortOrderInput | SortOrder
    principal?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: ContatoClienteCountOrderByAggregateInput
    _max?: ContatoClienteMaxOrderByAggregateInput
    _min?: ContatoClienteMinOrderByAggregateInput
  }

  export type ContatoClienteScalarWhereWithAggregatesInput = {
    AND?: ContatoClienteScalarWhereWithAggregatesInput | ContatoClienteScalarWhereWithAggregatesInput[]
    OR?: ContatoClienteScalarWhereWithAggregatesInput[]
    NOT?: ContatoClienteScalarWhereWithAggregatesInput | ContatoClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ContatoCliente"> | string
    tenantId?: StringWithAggregatesFilter<"ContatoCliente"> | string
    clienteId?: StringWithAggregatesFilter<"ContatoCliente"> | string
    nome?: StringWithAggregatesFilter<"ContatoCliente"> | string
    cargo?: StringNullableWithAggregatesFilter<"ContatoCliente"> | string | null
    email?: StringNullableWithAggregatesFilter<"ContatoCliente"> | string | null
    telefone?: StringNullableWithAggregatesFilter<"ContatoCliente"> | string | null
    celular?: StringNullableWithAggregatesFilter<"ContatoCliente"> | string | null
    principal?: BoolWithAggregatesFilter<"ContatoCliente"> | boolean
    observacoes?: StringNullableWithAggregatesFilter<"ContatoCliente"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"ContatoCliente"> | Date | string
  }

  export type InteracaoClienteWhereInput = {
    AND?: InteracaoClienteWhereInput | InteracaoClienteWhereInput[]
    OR?: InteracaoClienteWhereInput[]
    NOT?: InteracaoClienteWhereInput | InteracaoClienteWhereInput[]
    id?: StringFilter<"InteracaoCliente"> | string
    tenantId?: StringFilter<"InteracaoCliente"> | string
    clienteId?: StringFilter<"InteracaoCliente"> | string
    tipo?: EnumTipoInteracaoFilter<"InteracaoCliente"> | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFilter<"InteracaoCliente"> | $Enums.CanalInteracao
    titulo?: StringFilter<"InteracaoCliente"> | string
    descricao?: StringFilter<"InteracaoCliente"> | string
    data?: DateTimeFilter<"InteracaoCliente"> | Date | string
    usuarioId?: StringFilter<"InteracaoCliente"> | string
    pedidoId?: StringNullableFilter<"InteracaoCliente"> | string | null
    metadata?: JsonNullableFilter<"InteracaoCliente">
    criadoEm?: DateTimeFilter<"InteracaoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }

  export type InteracaoClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    canal?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data?: SortOrder
    usuarioId?: SortOrder
    pedidoId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
  }

  export type InteracaoClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InteracaoClienteWhereInput | InteracaoClienteWhereInput[]
    OR?: InteracaoClienteWhereInput[]
    NOT?: InteracaoClienteWhereInput | InteracaoClienteWhereInput[]
    tenantId?: StringFilter<"InteracaoCliente"> | string
    clienteId?: StringFilter<"InteracaoCliente"> | string
    tipo?: EnumTipoInteracaoFilter<"InteracaoCliente"> | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFilter<"InteracaoCliente"> | $Enums.CanalInteracao
    titulo?: StringFilter<"InteracaoCliente"> | string
    descricao?: StringFilter<"InteracaoCliente"> | string
    data?: DateTimeFilter<"InteracaoCliente"> | Date | string
    usuarioId?: StringFilter<"InteracaoCliente"> | string
    pedidoId?: StringNullableFilter<"InteracaoCliente"> | string | null
    metadata?: JsonNullableFilter<"InteracaoCliente">
    criadoEm?: DateTimeFilter<"InteracaoCliente"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
  }, "id">

  export type InteracaoClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    canal?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data?: SortOrder
    usuarioId?: SortOrder
    pedidoId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: InteracaoClienteCountOrderByAggregateInput
    _max?: InteracaoClienteMaxOrderByAggregateInput
    _min?: InteracaoClienteMinOrderByAggregateInput
  }

  export type InteracaoClienteScalarWhereWithAggregatesInput = {
    AND?: InteracaoClienteScalarWhereWithAggregatesInput | InteracaoClienteScalarWhereWithAggregatesInput[]
    OR?: InteracaoClienteScalarWhereWithAggregatesInput[]
    NOT?: InteracaoClienteScalarWhereWithAggregatesInput | InteracaoClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    tenantId?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    clienteId?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    tipo?: EnumTipoInteracaoWithAggregatesFilter<"InteracaoCliente"> | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoWithAggregatesFilter<"InteracaoCliente"> | $Enums.CanalInteracao
    titulo?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    descricao?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    data?: DateTimeWithAggregatesFilter<"InteracaoCliente"> | Date | string
    usuarioId?: StringWithAggregatesFilter<"InteracaoCliente"> | string
    pedidoId?: StringNullableWithAggregatesFilter<"InteracaoCliente"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"InteracaoCliente">
    criadoEm?: DateTimeWithAggregatesFilter<"InteracaoCliente"> | Date | string
  }

  export type SegmentoClienteWhereInput = {
    AND?: SegmentoClienteWhereInput | SegmentoClienteWhereInput[]
    OR?: SegmentoClienteWhereInput[]
    NOT?: SegmentoClienteWhereInput | SegmentoClienteWhereInput[]
    id?: StringFilter<"SegmentoCliente"> | string
    tenantId?: StringFilter<"SegmentoCliente"> | string
    nome?: StringFilter<"SegmentoCliente"> | string
    descricao?: StringNullableFilter<"SegmentoCliente"> | string | null
    regras?: JsonFilter<"SegmentoCliente">
    totalClientes?: IntFilter<"SegmentoCliente"> | number
    ativo?: BoolFilter<"SegmentoCliente"> | boolean
    criadoEm?: DateTimeFilter<"SegmentoCliente"> | Date | string
    atualizadoEm?: DateTimeFilter<"SegmentoCliente"> | Date | string
    clientes?: ClienteSegmentoListRelationFilter
  }

  export type SegmentoClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    regras?: SortOrder
    totalClientes?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    clientes?: ClienteSegmentoOrderByRelationAggregateInput
  }

  export type SegmentoClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SegmentoClienteWhereInput | SegmentoClienteWhereInput[]
    OR?: SegmentoClienteWhereInput[]
    NOT?: SegmentoClienteWhereInput | SegmentoClienteWhereInput[]
    tenantId?: StringFilter<"SegmentoCliente"> | string
    nome?: StringFilter<"SegmentoCliente"> | string
    descricao?: StringNullableFilter<"SegmentoCliente"> | string | null
    regras?: JsonFilter<"SegmentoCliente">
    totalClientes?: IntFilter<"SegmentoCliente"> | number
    ativo?: BoolFilter<"SegmentoCliente"> | boolean
    criadoEm?: DateTimeFilter<"SegmentoCliente"> | Date | string
    atualizadoEm?: DateTimeFilter<"SegmentoCliente"> | Date | string
    clientes?: ClienteSegmentoListRelationFilter
  }, "id">

  export type SegmentoClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    regras?: SortOrder
    totalClientes?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: SegmentoClienteCountOrderByAggregateInput
    _avg?: SegmentoClienteAvgOrderByAggregateInput
    _max?: SegmentoClienteMaxOrderByAggregateInput
    _min?: SegmentoClienteMinOrderByAggregateInput
    _sum?: SegmentoClienteSumOrderByAggregateInput
  }

  export type SegmentoClienteScalarWhereWithAggregatesInput = {
    AND?: SegmentoClienteScalarWhereWithAggregatesInput | SegmentoClienteScalarWhereWithAggregatesInput[]
    OR?: SegmentoClienteScalarWhereWithAggregatesInput[]
    NOT?: SegmentoClienteScalarWhereWithAggregatesInput | SegmentoClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SegmentoCliente"> | string
    tenantId?: StringWithAggregatesFilter<"SegmentoCliente"> | string
    nome?: StringWithAggregatesFilter<"SegmentoCliente"> | string
    descricao?: StringNullableWithAggregatesFilter<"SegmentoCliente"> | string | null
    regras?: JsonWithAggregatesFilter<"SegmentoCliente">
    totalClientes?: IntWithAggregatesFilter<"SegmentoCliente"> | number
    ativo?: BoolWithAggregatesFilter<"SegmentoCliente"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"SegmentoCliente"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"SegmentoCliente"> | Date | string
  }

  export type ClienteSegmentoWhereInput = {
    AND?: ClienteSegmentoWhereInput | ClienteSegmentoWhereInput[]
    OR?: ClienteSegmentoWhereInput[]
    NOT?: ClienteSegmentoWhereInput | ClienteSegmentoWhereInput[]
    id?: StringFilter<"ClienteSegmento"> | string
    clienteId?: StringFilter<"ClienteSegmento"> | string
    segmentoId?: StringFilter<"ClienteSegmento"> | string
    adicionadoEm?: DateTimeFilter<"ClienteSegmento"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
    segmento?: XOR<SegmentoClienteRelationFilter, SegmentoClienteWhereInput>
  }

  export type ClienteSegmentoOrderByWithRelationInput = {
    id?: SortOrder
    clienteId?: SortOrder
    segmentoId?: SortOrder
    adicionadoEm?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    segmento?: SegmentoClienteOrderByWithRelationInput
  }

  export type ClienteSegmentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clienteId_segmentoId?: ClienteSegmentoClienteIdSegmentoIdCompoundUniqueInput
    AND?: ClienteSegmentoWhereInput | ClienteSegmentoWhereInput[]
    OR?: ClienteSegmentoWhereInput[]
    NOT?: ClienteSegmentoWhereInput | ClienteSegmentoWhereInput[]
    clienteId?: StringFilter<"ClienteSegmento"> | string
    segmentoId?: StringFilter<"ClienteSegmento"> | string
    adicionadoEm?: DateTimeFilter<"ClienteSegmento"> | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
    segmento?: XOR<SegmentoClienteRelationFilter, SegmentoClienteWhereInput>
  }, "id" | "clienteId_segmentoId">

  export type ClienteSegmentoOrderByWithAggregationInput = {
    id?: SortOrder
    clienteId?: SortOrder
    segmentoId?: SortOrder
    adicionadoEm?: SortOrder
    _count?: ClienteSegmentoCountOrderByAggregateInput
    _max?: ClienteSegmentoMaxOrderByAggregateInput
    _min?: ClienteSegmentoMinOrderByAggregateInput
  }

  export type ClienteSegmentoScalarWhereWithAggregatesInput = {
    AND?: ClienteSegmentoScalarWhereWithAggregatesInput | ClienteSegmentoScalarWhereWithAggregatesInput[]
    OR?: ClienteSegmentoScalarWhereWithAggregatesInput[]
    NOT?: ClienteSegmentoScalarWhereWithAggregatesInput | ClienteSegmentoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClienteSegmento"> | string
    clienteId?: StringWithAggregatesFilter<"ClienteSegmento"> | string
    segmentoId?: StringWithAggregatesFilter<"ClienteSegmento"> | string
    adicionadoEm?: DateTimeWithAggregatesFilter<"ClienteSegmento"> | Date | string
  }

  export type ImportacaoClienteWhereInput = {
    AND?: ImportacaoClienteWhereInput | ImportacaoClienteWhereInput[]
    OR?: ImportacaoClienteWhereInput[]
    NOT?: ImportacaoClienteWhereInput | ImportacaoClienteWhereInput[]
    id?: StringFilter<"ImportacaoCliente"> | string
    tenantId?: StringFilter<"ImportacaoCliente"> | string
    arquivo?: StringFilter<"ImportacaoCliente"> | string
    formato?: EnumFormatoImportacaoFilter<"ImportacaoCliente"> | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFilter<"ImportacaoCliente"> | $Enums.StatusImportacao
    totalRegistros?: IntFilter<"ImportacaoCliente"> | number
    importados?: IntFilter<"ImportacaoCliente"> | number
    erros?: IntFilter<"ImportacaoCliente"> | number
    logErros?: JsonNullableFilter<"ImportacaoCliente">
    usuarioId?: StringFilter<"ImportacaoCliente"> | string
    criadoEm?: DateTimeFilter<"ImportacaoCliente"> | Date | string
    concluidoEm?: DateTimeNullableFilter<"ImportacaoCliente"> | Date | string | null
  }

  export type ImportacaoClienteOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    arquivo?: SortOrder
    formato?: SortOrder
    status?: SortOrder
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
    logErros?: SortOrderInput | SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
    concluidoEm?: SortOrderInput | SortOrder
  }

  export type ImportacaoClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImportacaoClienteWhereInput | ImportacaoClienteWhereInput[]
    OR?: ImportacaoClienteWhereInput[]
    NOT?: ImportacaoClienteWhereInput | ImportacaoClienteWhereInput[]
    tenantId?: StringFilter<"ImportacaoCliente"> | string
    arquivo?: StringFilter<"ImportacaoCliente"> | string
    formato?: EnumFormatoImportacaoFilter<"ImportacaoCliente"> | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFilter<"ImportacaoCliente"> | $Enums.StatusImportacao
    totalRegistros?: IntFilter<"ImportacaoCliente"> | number
    importados?: IntFilter<"ImportacaoCliente"> | number
    erros?: IntFilter<"ImportacaoCliente"> | number
    logErros?: JsonNullableFilter<"ImportacaoCliente">
    usuarioId?: StringFilter<"ImportacaoCliente"> | string
    criadoEm?: DateTimeFilter<"ImportacaoCliente"> | Date | string
    concluidoEm?: DateTimeNullableFilter<"ImportacaoCliente"> | Date | string | null
  }, "id">

  export type ImportacaoClienteOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    arquivo?: SortOrder
    formato?: SortOrder
    status?: SortOrder
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
    logErros?: SortOrderInput | SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
    concluidoEm?: SortOrderInput | SortOrder
    _count?: ImportacaoClienteCountOrderByAggregateInput
    _avg?: ImportacaoClienteAvgOrderByAggregateInput
    _max?: ImportacaoClienteMaxOrderByAggregateInput
    _min?: ImportacaoClienteMinOrderByAggregateInput
    _sum?: ImportacaoClienteSumOrderByAggregateInput
  }

  export type ImportacaoClienteScalarWhereWithAggregatesInput = {
    AND?: ImportacaoClienteScalarWhereWithAggregatesInput | ImportacaoClienteScalarWhereWithAggregatesInput[]
    OR?: ImportacaoClienteScalarWhereWithAggregatesInput[]
    NOT?: ImportacaoClienteScalarWhereWithAggregatesInput | ImportacaoClienteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImportacaoCliente"> | string
    tenantId?: StringWithAggregatesFilter<"ImportacaoCliente"> | string
    arquivo?: StringWithAggregatesFilter<"ImportacaoCliente"> | string
    formato?: EnumFormatoImportacaoWithAggregatesFilter<"ImportacaoCliente"> | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoWithAggregatesFilter<"ImportacaoCliente"> | $Enums.StatusImportacao
    totalRegistros?: IntWithAggregatesFilter<"ImportacaoCliente"> | number
    importados?: IntWithAggregatesFilter<"ImportacaoCliente"> | number
    erros?: IntWithAggregatesFilter<"ImportacaoCliente"> | number
    logErros?: JsonNullableWithAggregatesFilter<"ImportacaoCliente">
    usuarioId?: StringWithAggregatesFilter<"ImportacaoCliente"> | string
    criadoEm?: DateTimeWithAggregatesFilter<"ImportacaoCliente"> | Date | string
    concluidoEm?: DateTimeNullableWithAggregatesFilter<"ImportacaoCliente"> | Date | string | null
  }

  export type ClienteCreateInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteUncheckedCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteUncheckedCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteUncheckedCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUncheckedUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUncheckedUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUncheckedUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateManyInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteCreateInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
    cliente: ClienteCreateNestedOneWithoutEnderecosInput
  }

  export type EnderecoClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
  }

  export type EnderecoClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutEnderecosNestedInput
  }

  export type EnderecoClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteCreateManyInput = {
    id?: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
  }

  export type EnderecoClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteCreateInput = {
    id?: string
    tenantId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
    cliente: ClienteCreateNestedOneWithoutContatosInput
  }

  export type ContatoClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    clienteId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
  }

  export type ContatoClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutContatosNestedInput
  }

  export type ContatoClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteCreateManyInput = {
    id?: string
    tenantId: string
    clienteId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
  }

  export type ContatoClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteCreateInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    cliente: ClienteCreateNestedOneWithoutInteracoesInput
  }

  export type InteracaoClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type InteracaoClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutInteracoesNestedInput
  }

  export type InteracaoClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteCreateManyInput = {
    id?: string
    tenantId: string
    clienteId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type InteracaoClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SegmentoClienteCreateInput = {
    id?: string
    tenantId: string
    nome: string
    descricao?: string | null
    regras: JsonNullValueInput | InputJsonValue
    totalClientes?: number
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    clientes?: ClienteSegmentoCreateNestedManyWithoutSegmentoInput
  }

  export type SegmentoClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    descricao?: string | null
    regras: JsonNullValueInput | InputJsonValue
    totalClientes?: number
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    clientes?: ClienteSegmentoUncheckedCreateNestedManyWithoutSegmentoInput
  }

  export type SegmentoClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    clientes?: ClienteSegmentoUpdateManyWithoutSegmentoNestedInput
  }

  export type SegmentoClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    clientes?: ClienteSegmentoUncheckedUpdateManyWithoutSegmentoNestedInput
  }

  export type SegmentoClienteCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    descricao?: string | null
    regras: JsonNullValueInput | InputJsonValue
    totalClientes?: number
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type SegmentoClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SegmentoClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoCreateInput = {
    id?: string
    adicionadoEm?: Date | string
    cliente: ClienteCreateNestedOneWithoutSegmentosInput
    segmento: SegmentoClienteCreateNestedOneWithoutClientesInput
  }

  export type ClienteSegmentoUncheckedCreateInput = {
    id?: string
    clienteId: string
    segmentoId: string
    adicionadoEm?: Date | string
  }

  export type ClienteSegmentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutSegmentosNestedInput
    segmento?: SegmentoClienteUpdateOneRequiredWithoutClientesNestedInput
  }

  export type ClienteSegmentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    segmentoId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoCreateManyInput = {
    id?: string
    clienteId: string
    segmentoId: string
    adicionadoEm?: Date | string
  }

  export type ClienteSegmentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    segmentoId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportacaoClienteCreateInput = {
    id?: string
    tenantId: string
    arquivo: string
    formato: $Enums.FormatoImportacao
    status?: $Enums.StatusImportacao
    totalRegistros: number
    importados?: number
    erros?: number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId: string
    criadoEm?: Date | string
    concluidoEm?: Date | string | null
  }

  export type ImportacaoClienteUncheckedCreateInput = {
    id?: string
    tenantId: string
    arquivo: string
    formato: $Enums.FormatoImportacao
    status?: $Enums.StatusImportacao
    totalRegistros: number
    importados?: number
    erros?: number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId: string
    criadoEm?: Date | string
    concluidoEm?: Date | string | null
  }

  export type ImportacaoClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    arquivo?: StringFieldUpdateOperationsInput | string
    formato?: EnumFormatoImportacaoFieldUpdateOperationsInput | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFieldUpdateOperationsInput | $Enums.StatusImportacao
    totalRegistros?: IntFieldUpdateOperationsInput | number
    importados?: IntFieldUpdateOperationsInput | number
    erros?: IntFieldUpdateOperationsInput | number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    concluidoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportacaoClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    arquivo?: StringFieldUpdateOperationsInput | string
    formato?: EnumFormatoImportacaoFieldUpdateOperationsInput | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFieldUpdateOperationsInput | $Enums.StatusImportacao
    totalRegistros?: IntFieldUpdateOperationsInput | number
    importados?: IntFieldUpdateOperationsInput | number
    erros?: IntFieldUpdateOperationsInput | number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    concluidoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportacaoClienteCreateManyInput = {
    id?: string
    tenantId: string
    arquivo: string
    formato: $Enums.FormatoImportacao
    status?: $Enums.StatusImportacao
    totalRegistros: number
    importados?: number
    erros?: number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId: string
    criadoEm?: Date | string
    concluidoEm?: Date | string | null
  }

  export type ImportacaoClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    arquivo?: StringFieldUpdateOperationsInput | string
    formato?: EnumFormatoImportacaoFieldUpdateOperationsInput | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFieldUpdateOperationsInput | $Enums.StatusImportacao
    totalRegistros?: IntFieldUpdateOperationsInput | number
    importados?: IntFieldUpdateOperationsInput | number
    erros?: IntFieldUpdateOperationsInput | number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    concluidoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportacaoClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    arquivo?: StringFieldUpdateOperationsInput | string
    formato?: EnumFormatoImportacaoFieldUpdateOperationsInput | $Enums.FormatoImportacao
    status?: EnumStatusImportacaoFieldUpdateOperationsInput | $Enums.StatusImportacao
    totalRegistros?: IntFieldUpdateOperationsInput | number
    importados?: IntFieldUpdateOperationsInput | number
    erros?: IntFieldUpdateOperationsInput | number
    logErros?: NullableJsonNullValueInput | InputJsonValue
    usuarioId?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    concluidoEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type EnumTipoClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCliente | EnumTipoClienteFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoClienteFilter<$PrismaModel> | $Enums.TipoCliente
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type EnumStatusClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusCliente | EnumStatusClienteFieldRefInput<$PrismaModel>
    in?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusClienteFilter<$PrismaModel> | $Enums.StatusCliente
  }

  export type EnumOrigemClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.OrigemCliente | EnumOrigemClienteFieldRefInput<$PrismaModel>
    in?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumOrigemClienteFilter<$PrismaModel> | $Enums.OrigemCliente
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

  export type EnderecoClienteListRelationFilter = {
    every?: EnderecoClienteWhereInput
    some?: EnderecoClienteWhereInput
    none?: EnderecoClienteWhereInput
  }

  export type ContatoClienteListRelationFilter = {
    every?: ContatoClienteWhereInput
    some?: ContatoClienteWhereInput
    none?: ContatoClienteWhereInput
  }

  export type InteracaoClienteListRelationFilter = {
    every?: InteracaoClienteWhereInput
    some?: InteracaoClienteWhereInput
    none?: InteracaoClienteWhereInput
  }

  export type ClienteSegmentoListRelationFilter = {
    every?: ClienteSegmentoWhereInput
    some?: ClienteSegmentoWhereInput
    none?: ClienteSegmentoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EnderecoClienteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ContatoClienteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InteracaoClienteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClienteSegmentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClienteTenantIdCpfCompoundUniqueInput = {
    tenantId: string
    cpf: string
  }

  export type ClienteTenantIdCnpjCompoundUniqueInput = {
    tenantId: string
    cnpj: string
  }

  export type ClienteTenantIdEmailCompoundUniqueInput = {
    tenantId: string
    email: string
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    nome?: SortOrder
    nomeFantasia?: SortOrder
    razaoSocial?: SortOrder
    cpf?: SortOrder
    cnpj?: SortOrder
    inscricaoEstadual?: SortOrder
    email?: SortOrder
    emailSecundario?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    dataNascimento?: SortOrder
    genero?: SortOrder
    observacoes?: SortOrder
    tags?: SortOrder
    score?: SortOrder
    status?: SortOrder
    origem?: SortOrder
    ultimaCompra?: SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ClienteAvgOrderByAggregateInput = {
    score?: SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    nome?: SortOrder
    nomeFantasia?: SortOrder
    razaoSocial?: SortOrder
    cpf?: SortOrder
    cnpj?: SortOrder
    inscricaoEstadual?: SortOrder
    email?: SortOrder
    emailSecundario?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    dataNascimento?: SortOrder
    genero?: SortOrder
    observacoes?: SortOrder
    score?: SortOrder
    status?: SortOrder
    origem?: SortOrder
    ultimaCompra?: SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    nome?: SortOrder
    nomeFantasia?: SortOrder
    razaoSocial?: SortOrder
    cpf?: SortOrder
    cnpj?: SortOrder
    inscricaoEstadual?: SortOrder
    email?: SortOrder
    emailSecundario?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    dataNascimento?: SortOrder
    genero?: SortOrder
    observacoes?: SortOrder
    score?: SortOrder
    status?: SortOrder
    origem?: SortOrder
    ultimaCompra?: SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ClienteSumOrderByAggregateInput = {
    score?: SortOrder
    totalCompras?: SortOrder
    valorTotalCompras?: SortOrder
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

  export type EnumTipoClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCliente | EnumTipoClienteFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoClienteWithAggregatesFilter<$PrismaModel> | $Enums.TipoCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoClienteFilter<$PrismaModel>
    _max?: NestedEnumTipoClienteFilter<$PrismaModel>
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

  export type EnumStatusClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusCliente | EnumStatusClienteFieldRefInput<$PrismaModel>
    in?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusClienteWithAggregatesFilter<$PrismaModel> | $Enums.StatusCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusClienteFilter<$PrismaModel>
    _max?: NestedEnumStatusClienteFilter<$PrismaModel>
  }

  export type EnumOrigemClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrigemCliente | EnumOrigemClienteFieldRefInput<$PrismaModel>
    in?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumOrigemClienteWithAggregatesFilter<$PrismaModel> | $Enums.OrigemCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrigemClienteFilter<$PrismaModel>
    _max?: NestedEnumOrigemClienteFilter<$PrismaModel>
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

  export type EnumTipoEnderecoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoEndereco | EnumTipoEnderecoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoEnderecoFilter<$PrismaModel> | $Enums.TipoEndereco
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ClienteRelationFilter = {
    is?: ClienteWhereInput
    isNot?: ClienteWhereInput
  }

  export type EnderecoClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    cep?: SortOrder
    pais?: SortOrder
    padrao?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnderecoClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    cep?: SortOrder
    pais?: SortOrder
    padrao?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnderecoClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    logradouro?: SortOrder
    numero?: SortOrder
    complemento?: SortOrder
    bairro?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    cep?: SortOrder
    pais?: SortOrder
    padrao?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnumTipoEnderecoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoEndereco | EnumTipoEnderecoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoEnderecoWithAggregatesFilter<$PrismaModel> | $Enums.TipoEndereco
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoEnderecoFilter<$PrismaModel>
    _max?: NestedEnumTipoEnderecoFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ContatoClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    principal?: SortOrder
    observacoes?: SortOrder
    criadoEm?: SortOrder
  }

  export type ContatoClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    principal?: SortOrder
    observacoes?: SortOrder
    criadoEm?: SortOrder
  }

  export type ContatoClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    email?: SortOrder
    telefone?: SortOrder
    celular?: SortOrder
    principal?: SortOrder
    observacoes?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnumTipoInteracaoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoInteracao | EnumTipoInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoInteracaoFilter<$PrismaModel> | $Enums.TipoInteracao
  }

  export type EnumCanalInteracaoFilter<$PrismaModel = never> = {
    equals?: $Enums.CanalInteracao | EnumCanalInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumCanalInteracaoFilter<$PrismaModel> | $Enums.CanalInteracao
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

  export type InteracaoClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    canal?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data?: SortOrder
    usuarioId?: SortOrder
    pedidoId?: SortOrder
    metadata?: SortOrder
    criadoEm?: SortOrder
  }

  export type InteracaoClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    canal?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data?: SortOrder
    usuarioId?: SortOrder
    pedidoId?: SortOrder
    criadoEm?: SortOrder
  }

  export type InteracaoClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    clienteId?: SortOrder
    tipo?: SortOrder
    canal?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    data?: SortOrder
    usuarioId?: SortOrder
    pedidoId?: SortOrder
    criadoEm?: SortOrder
  }

  export type EnumTipoInteracaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoInteracao | EnumTipoInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoInteracaoWithAggregatesFilter<$PrismaModel> | $Enums.TipoInteracao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoInteracaoFilter<$PrismaModel>
    _max?: NestedEnumTipoInteracaoFilter<$PrismaModel>
  }

  export type EnumCanalInteracaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CanalInteracao | EnumCanalInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumCanalInteracaoWithAggregatesFilter<$PrismaModel> | $Enums.CanalInteracao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCanalInteracaoFilter<$PrismaModel>
    _max?: NestedEnumCanalInteracaoFilter<$PrismaModel>
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

  export type SegmentoClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    regras?: SortOrder
    totalClientes?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SegmentoClienteAvgOrderByAggregateInput = {
    totalClientes?: SortOrder
  }

  export type SegmentoClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    totalClientes?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SegmentoClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    totalClientes?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SegmentoClienteSumOrderByAggregateInput = {
    totalClientes?: SortOrder
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

  export type SegmentoClienteRelationFilter = {
    is?: SegmentoClienteWhereInput
    isNot?: SegmentoClienteWhereInput
  }

  export type ClienteSegmentoClienteIdSegmentoIdCompoundUniqueInput = {
    clienteId: string
    segmentoId: string
  }

  export type ClienteSegmentoCountOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    segmentoId?: SortOrder
    adicionadoEm?: SortOrder
  }

  export type ClienteSegmentoMaxOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    segmentoId?: SortOrder
    adicionadoEm?: SortOrder
  }

  export type ClienteSegmentoMinOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    segmentoId?: SortOrder
    adicionadoEm?: SortOrder
  }

  export type EnumFormatoImportacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.FormatoImportacao | EnumFormatoImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumFormatoImportacaoFilter<$PrismaModel> | $Enums.FormatoImportacao
  }

  export type EnumStatusImportacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusImportacao | EnumStatusImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusImportacaoFilter<$PrismaModel> | $Enums.StatusImportacao
  }

  export type ImportacaoClienteCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    arquivo?: SortOrder
    formato?: SortOrder
    status?: SortOrder
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
    logErros?: SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
    concluidoEm?: SortOrder
  }

  export type ImportacaoClienteAvgOrderByAggregateInput = {
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
  }

  export type ImportacaoClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    arquivo?: SortOrder
    formato?: SortOrder
    status?: SortOrder
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
    concluidoEm?: SortOrder
  }

  export type ImportacaoClienteMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    arquivo?: SortOrder
    formato?: SortOrder
    status?: SortOrder
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
    concluidoEm?: SortOrder
  }

  export type ImportacaoClienteSumOrderByAggregateInput = {
    totalRegistros?: SortOrder
    importados?: SortOrder
    erros?: SortOrder
  }

  export type EnumFormatoImportacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormatoImportacao | EnumFormatoImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumFormatoImportacaoWithAggregatesFilter<$PrismaModel> | $Enums.FormatoImportacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormatoImportacaoFilter<$PrismaModel>
    _max?: NestedEnumFormatoImportacaoFilter<$PrismaModel>
  }

  export type EnumStatusImportacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusImportacao | EnumStatusImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusImportacaoWithAggregatesFilter<$PrismaModel> | $Enums.StatusImportacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusImportacaoFilter<$PrismaModel>
    _max?: NestedEnumStatusImportacaoFilter<$PrismaModel>
  }

  export type ClienteCreatetagsInput = {
    set: string[]
  }

  export type EnderecoClienteCreateNestedManyWithoutClienteInput = {
    create?: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput> | EnderecoClienteCreateWithoutClienteInput[] | EnderecoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EnderecoClienteCreateOrConnectWithoutClienteInput | EnderecoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: EnderecoClienteCreateManyClienteInputEnvelope
    connect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
  }

  export type ContatoClienteCreateNestedManyWithoutClienteInput = {
    create?: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput> | ContatoClienteCreateWithoutClienteInput[] | ContatoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ContatoClienteCreateOrConnectWithoutClienteInput | ContatoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: ContatoClienteCreateManyClienteInputEnvelope
    connect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
  }

  export type InteracaoClienteCreateNestedManyWithoutClienteInput = {
    create?: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput> | InteracaoClienteCreateWithoutClienteInput[] | InteracaoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: InteracaoClienteCreateOrConnectWithoutClienteInput | InteracaoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: InteracaoClienteCreateManyClienteInputEnvelope
    connect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
  }

  export type ClienteSegmentoCreateNestedManyWithoutClienteInput = {
    create?: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput> | ClienteSegmentoCreateWithoutClienteInput[] | ClienteSegmentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutClienteInput | ClienteSegmentoCreateOrConnectWithoutClienteInput[]
    createMany?: ClienteSegmentoCreateManyClienteInputEnvelope
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
  }

  export type EnderecoClienteUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput> | EnderecoClienteCreateWithoutClienteInput[] | EnderecoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EnderecoClienteCreateOrConnectWithoutClienteInput | EnderecoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: EnderecoClienteCreateManyClienteInputEnvelope
    connect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
  }

  export type ContatoClienteUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput> | ContatoClienteCreateWithoutClienteInput[] | ContatoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ContatoClienteCreateOrConnectWithoutClienteInput | ContatoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: ContatoClienteCreateManyClienteInputEnvelope
    connect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
  }

  export type InteracaoClienteUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput> | InteracaoClienteCreateWithoutClienteInput[] | InteracaoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: InteracaoClienteCreateOrConnectWithoutClienteInput | InteracaoClienteCreateOrConnectWithoutClienteInput[]
    createMany?: InteracaoClienteCreateManyClienteInputEnvelope
    connect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
  }

  export type ClienteSegmentoUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput> | ClienteSegmentoCreateWithoutClienteInput[] | ClienteSegmentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutClienteInput | ClienteSegmentoCreateOrConnectWithoutClienteInput[]
    createMany?: ClienteSegmentoCreateManyClienteInputEnvelope
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumTipoClienteFieldUpdateOperationsInput = {
    set?: $Enums.TipoCliente
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ClienteUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumStatusClienteFieldUpdateOperationsInput = {
    set?: $Enums.StatusCliente
  }

  export type EnumOrigemClienteFieldUpdateOperationsInput = {
    set?: $Enums.OrigemCliente
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnderecoClienteUpdateManyWithoutClienteNestedInput = {
    create?: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput> | EnderecoClienteCreateWithoutClienteInput[] | EnderecoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EnderecoClienteCreateOrConnectWithoutClienteInput | EnderecoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: EnderecoClienteUpsertWithWhereUniqueWithoutClienteInput | EnderecoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: EnderecoClienteCreateManyClienteInputEnvelope
    set?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    disconnect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    delete?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    connect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    update?: EnderecoClienteUpdateWithWhereUniqueWithoutClienteInput | EnderecoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: EnderecoClienteUpdateManyWithWhereWithoutClienteInput | EnderecoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: EnderecoClienteScalarWhereInput | EnderecoClienteScalarWhereInput[]
  }

  export type ContatoClienteUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput> | ContatoClienteCreateWithoutClienteInput[] | ContatoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ContatoClienteCreateOrConnectWithoutClienteInput | ContatoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: ContatoClienteUpsertWithWhereUniqueWithoutClienteInput | ContatoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ContatoClienteCreateManyClienteInputEnvelope
    set?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    disconnect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    delete?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    connect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    update?: ContatoClienteUpdateWithWhereUniqueWithoutClienteInput | ContatoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ContatoClienteUpdateManyWithWhereWithoutClienteInput | ContatoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ContatoClienteScalarWhereInput | ContatoClienteScalarWhereInput[]
  }

  export type InteracaoClienteUpdateManyWithoutClienteNestedInput = {
    create?: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput> | InteracaoClienteCreateWithoutClienteInput[] | InteracaoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: InteracaoClienteCreateOrConnectWithoutClienteInput | InteracaoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: InteracaoClienteUpsertWithWhereUniqueWithoutClienteInput | InteracaoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: InteracaoClienteCreateManyClienteInputEnvelope
    set?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    disconnect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    delete?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    connect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    update?: InteracaoClienteUpdateWithWhereUniqueWithoutClienteInput | InteracaoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: InteracaoClienteUpdateManyWithWhereWithoutClienteInput | InteracaoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: InteracaoClienteScalarWhereInput | InteracaoClienteScalarWhereInput[]
  }

  export type ClienteSegmentoUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput> | ClienteSegmentoCreateWithoutClienteInput[] | ClienteSegmentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutClienteInput | ClienteSegmentoCreateOrConnectWithoutClienteInput[]
    upsert?: ClienteSegmentoUpsertWithWhereUniqueWithoutClienteInput | ClienteSegmentoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ClienteSegmentoCreateManyClienteInputEnvelope
    set?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    disconnect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    delete?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    update?: ClienteSegmentoUpdateWithWhereUniqueWithoutClienteInput | ClienteSegmentoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ClienteSegmentoUpdateManyWithWhereWithoutClienteInput | ClienteSegmentoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
  }

  export type EnderecoClienteUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput> | EnderecoClienteCreateWithoutClienteInput[] | EnderecoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EnderecoClienteCreateOrConnectWithoutClienteInput | EnderecoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: EnderecoClienteUpsertWithWhereUniqueWithoutClienteInput | EnderecoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: EnderecoClienteCreateManyClienteInputEnvelope
    set?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    disconnect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    delete?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    connect?: EnderecoClienteWhereUniqueInput | EnderecoClienteWhereUniqueInput[]
    update?: EnderecoClienteUpdateWithWhereUniqueWithoutClienteInput | EnderecoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: EnderecoClienteUpdateManyWithWhereWithoutClienteInput | EnderecoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: EnderecoClienteScalarWhereInput | EnderecoClienteScalarWhereInput[]
  }

  export type ContatoClienteUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput> | ContatoClienteCreateWithoutClienteInput[] | ContatoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ContatoClienteCreateOrConnectWithoutClienteInput | ContatoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: ContatoClienteUpsertWithWhereUniqueWithoutClienteInput | ContatoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ContatoClienteCreateManyClienteInputEnvelope
    set?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    disconnect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    delete?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    connect?: ContatoClienteWhereUniqueInput | ContatoClienteWhereUniqueInput[]
    update?: ContatoClienteUpdateWithWhereUniqueWithoutClienteInput | ContatoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ContatoClienteUpdateManyWithWhereWithoutClienteInput | ContatoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ContatoClienteScalarWhereInput | ContatoClienteScalarWhereInput[]
  }

  export type InteracaoClienteUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput> | InteracaoClienteCreateWithoutClienteInput[] | InteracaoClienteUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: InteracaoClienteCreateOrConnectWithoutClienteInput | InteracaoClienteCreateOrConnectWithoutClienteInput[]
    upsert?: InteracaoClienteUpsertWithWhereUniqueWithoutClienteInput | InteracaoClienteUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: InteracaoClienteCreateManyClienteInputEnvelope
    set?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    disconnect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    delete?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    connect?: InteracaoClienteWhereUniqueInput | InteracaoClienteWhereUniqueInput[]
    update?: InteracaoClienteUpdateWithWhereUniqueWithoutClienteInput | InteracaoClienteUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: InteracaoClienteUpdateManyWithWhereWithoutClienteInput | InteracaoClienteUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: InteracaoClienteScalarWhereInput | InteracaoClienteScalarWhereInput[]
  }

  export type ClienteSegmentoUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput> | ClienteSegmentoCreateWithoutClienteInput[] | ClienteSegmentoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutClienteInput | ClienteSegmentoCreateOrConnectWithoutClienteInput[]
    upsert?: ClienteSegmentoUpsertWithWhereUniqueWithoutClienteInput | ClienteSegmentoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: ClienteSegmentoCreateManyClienteInputEnvelope
    set?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    disconnect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    delete?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    update?: ClienteSegmentoUpdateWithWhereUniqueWithoutClienteInput | ClienteSegmentoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: ClienteSegmentoUpdateManyWithWhereWithoutClienteInput | ClienteSegmentoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
  }

  export type ClienteCreateNestedOneWithoutEnderecosInput = {
    create?: XOR<ClienteCreateWithoutEnderecosInput, ClienteUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutEnderecosInput
    connect?: ClienteWhereUniqueInput
  }

  export type EnumTipoEnderecoFieldUpdateOperationsInput = {
    set?: $Enums.TipoEndereco
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ClienteUpdateOneRequiredWithoutEnderecosNestedInput = {
    create?: XOR<ClienteCreateWithoutEnderecosInput, ClienteUncheckedCreateWithoutEnderecosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutEnderecosInput
    upsert?: ClienteUpsertWithoutEnderecosInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutEnderecosInput, ClienteUpdateWithoutEnderecosInput>, ClienteUncheckedUpdateWithoutEnderecosInput>
  }

  export type ClienteCreateNestedOneWithoutContatosInput = {
    create?: XOR<ClienteCreateWithoutContatosInput, ClienteUncheckedCreateWithoutContatosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutContatosInput
    connect?: ClienteWhereUniqueInput
  }

  export type ClienteUpdateOneRequiredWithoutContatosNestedInput = {
    create?: XOR<ClienteCreateWithoutContatosInput, ClienteUncheckedCreateWithoutContatosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutContatosInput
    upsert?: ClienteUpsertWithoutContatosInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutContatosInput, ClienteUpdateWithoutContatosInput>, ClienteUncheckedUpdateWithoutContatosInput>
  }

  export type ClienteCreateNestedOneWithoutInteracoesInput = {
    create?: XOR<ClienteCreateWithoutInteracoesInput, ClienteUncheckedCreateWithoutInteracoesInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutInteracoesInput
    connect?: ClienteWhereUniqueInput
  }

  export type EnumTipoInteracaoFieldUpdateOperationsInput = {
    set?: $Enums.TipoInteracao
  }

  export type EnumCanalInteracaoFieldUpdateOperationsInput = {
    set?: $Enums.CanalInteracao
  }

  export type ClienteUpdateOneRequiredWithoutInteracoesNestedInput = {
    create?: XOR<ClienteCreateWithoutInteracoesInput, ClienteUncheckedCreateWithoutInteracoesInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutInteracoesInput
    upsert?: ClienteUpsertWithoutInteracoesInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutInteracoesInput, ClienteUpdateWithoutInteracoesInput>, ClienteUncheckedUpdateWithoutInteracoesInput>
  }

  export type ClienteSegmentoCreateNestedManyWithoutSegmentoInput = {
    create?: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput> | ClienteSegmentoCreateWithoutSegmentoInput[] | ClienteSegmentoUncheckedCreateWithoutSegmentoInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutSegmentoInput | ClienteSegmentoCreateOrConnectWithoutSegmentoInput[]
    createMany?: ClienteSegmentoCreateManySegmentoInputEnvelope
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
  }

  export type ClienteSegmentoUncheckedCreateNestedManyWithoutSegmentoInput = {
    create?: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput> | ClienteSegmentoCreateWithoutSegmentoInput[] | ClienteSegmentoUncheckedCreateWithoutSegmentoInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutSegmentoInput | ClienteSegmentoCreateOrConnectWithoutSegmentoInput[]
    createMany?: ClienteSegmentoCreateManySegmentoInputEnvelope
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
  }

  export type ClienteSegmentoUpdateManyWithoutSegmentoNestedInput = {
    create?: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput> | ClienteSegmentoCreateWithoutSegmentoInput[] | ClienteSegmentoUncheckedCreateWithoutSegmentoInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutSegmentoInput | ClienteSegmentoCreateOrConnectWithoutSegmentoInput[]
    upsert?: ClienteSegmentoUpsertWithWhereUniqueWithoutSegmentoInput | ClienteSegmentoUpsertWithWhereUniqueWithoutSegmentoInput[]
    createMany?: ClienteSegmentoCreateManySegmentoInputEnvelope
    set?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    disconnect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    delete?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    update?: ClienteSegmentoUpdateWithWhereUniqueWithoutSegmentoInput | ClienteSegmentoUpdateWithWhereUniqueWithoutSegmentoInput[]
    updateMany?: ClienteSegmentoUpdateManyWithWhereWithoutSegmentoInput | ClienteSegmentoUpdateManyWithWhereWithoutSegmentoInput[]
    deleteMany?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
  }

  export type ClienteSegmentoUncheckedUpdateManyWithoutSegmentoNestedInput = {
    create?: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput> | ClienteSegmentoCreateWithoutSegmentoInput[] | ClienteSegmentoUncheckedCreateWithoutSegmentoInput[]
    connectOrCreate?: ClienteSegmentoCreateOrConnectWithoutSegmentoInput | ClienteSegmentoCreateOrConnectWithoutSegmentoInput[]
    upsert?: ClienteSegmentoUpsertWithWhereUniqueWithoutSegmentoInput | ClienteSegmentoUpsertWithWhereUniqueWithoutSegmentoInput[]
    createMany?: ClienteSegmentoCreateManySegmentoInputEnvelope
    set?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    disconnect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    delete?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    connect?: ClienteSegmentoWhereUniqueInput | ClienteSegmentoWhereUniqueInput[]
    update?: ClienteSegmentoUpdateWithWhereUniqueWithoutSegmentoInput | ClienteSegmentoUpdateWithWhereUniqueWithoutSegmentoInput[]
    updateMany?: ClienteSegmentoUpdateManyWithWhereWithoutSegmentoInput | ClienteSegmentoUpdateManyWithWhereWithoutSegmentoInput[]
    deleteMany?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
  }

  export type ClienteCreateNestedOneWithoutSegmentosInput = {
    create?: XOR<ClienteCreateWithoutSegmentosInput, ClienteUncheckedCreateWithoutSegmentosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutSegmentosInput
    connect?: ClienteWhereUniqueInput
  }

  export type SegmentoClienteCreateNestedOneWithoutClientesInput = {
    create?: XOR<SegmentoClienteCreateWithoutClientesInput, SegmentoClienteUncheckedCreateWithoutClientesInput>
    connectOrCreate?: SegmentoClienteCreateOrConnectWithoutClientesInput
    connect?: SegmentoClienteWhereUniqueInput
  }

  export type ClienteUpdateOneRequiredWithoutSegmentosNestedInput = {
    create?: XOR<ClienteCreateWithoutSegmentosInput, ClienteUncheckedCreateWithoutSegmentosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutSegmentosInput
    upsert?: ClienteUpsertWithoutSegmentosInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutSegmentosInput, ClienteUpdateWithoutSegmentosInput>, ClienteUncheckedUpdateWithoutSegmentosInput>
  }

  export type SegmentoClienteUpdateOneRequiredWithoutClientesNestedInput = {
    create?: XOR<SegmentoClienteCreateWithoutClientesInput, SegmentoClienteUncheckedCreateWithoutClientesInput>
    connectOrCreate?: SegmentoClienteCreateOrConnectWithoutClientesInput
    upsert?: SegmentoClienteUpsertWithoutClientesInput
    connect?: SegmentoClienteWhereUniqueInput
    update?: XOR<XOR<SegmentoClienteUpdateToOneWithWhereWithoutClientesInput, SegmentoClienteUpdateWithoutClientesInput>, SegmentoClienteUncheckedUpdateWithoutClientesInput>
  }

  export type EnumFormatoImportacaoFieldUpdateOperationsInput = {
    set?: $Enums.FormatoImportacao
  }

  export type EnumStatusImportacaoFieldUpdateOperationsInput = {
    set?: $Enums.StatusImportacao
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

  export type NestedEnumTipoClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCliente | EnumTipoClienteFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoClienteFilter<$PrismaModel> | $Enums.TipoCliente
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

  export type NestedEnumStatusClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusCliente | EnumStatusClienteFieldRefInput<$PrismaModel>
    in?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusClienteFilter<$PrismaModel> | $Enums.StatusCliente
  }

  export type NestedEnumOrigemClienteFilter<$PrismaModel = never> = {
    equals?: $Enums.OrigemCliente | EnumOrigemClienteFieldRefInput<$PrismaModel>
    in?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumOrigemClienteFilter<$PrismaModel> | $Enums.OrigemCliente
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

  export type NestedEnumTipoClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoCliente | EnumTipoClienteFieldRefInput<$PrismaModel>
    in?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoCliente[] | ListEnumTipoClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoClienteWithAggregatesFilter<$PrismaModel> | $Enums.TipoCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoClienteFilter<$PrismaModel>
    _max?: NestedEnumTipoClienteFilter<$PrismaModel>
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

  export type NestedEnumStatusClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusCliente | EnumStatusClienteFieldRefInput<$PrismaModel>
    in?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusCliente[] | ListEnumStatusClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusClienteWithAggregatesFilter<$PrismaModel> | $Enums.StatusCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusClienteFilter<$PrismaModel>
    _max?: NestedEnumStatusClienteFilter<$PrismaModel>
  }

  export type NestedEnumOrigemClienteWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrigemCliente | EnumOrigemClienteFieldRefInput<$PrismaModel>
    in?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrigemCliente[] | ListEnumOrigemClienteFieldRefInput<$PrismaModel>
    not?: NestedEnumOrigemClienteWithAggregatesFilter<$PrismaModel> | $Enums.OrigemCliente
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrigemClienteFilter<$PrismaModel>
    _max?: NestedEnumOrigemClienteFilter<$PrismaModel>
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

  export type NestedEnumTipoEnderecoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoEndereco | EnumTipoEnderecoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoEnderecoFilter<$PrismaModel> | $Enums.TipoEndereco
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTipoEnderecoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoEndereco | EnumTipoEnderecoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoEndereco[] | ListEnumTipoEnderecoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoEnderecoWithAggregatesFilter<$PrismaModel> | $Enums.TipoEndereco
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoEnderecoFilter<$PrismaModel>
    _max?: NestedEnumTipoEnderecoFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumTipoInteracaoFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoInteracao | EnumTipoInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoInteracaoFilter<$PrismaModel> | $Enums.TipoInteracao
  }

  export type NestedEnumCanalInteracaoFilter<$PrismaModel = never> = {
    equals?: $Enums.CanalInteracao | EnumCanalInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumCanalInteracaoFilter<$PrismaModel> | $Enums.CanalInteracao
  }

  export type NestedEnumTipoInteracaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoInteracao | EnumTipoInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoInteracao[] | ListEnumTipoInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoInteracaoWithAggregatesFilter<$PrismaModel> | $Enums.TipoInteracao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoInteracaoFilter<$PrismaModel>
    _max?: NestedEnumTipoInteracaoFilter<$PrismaModel>
  }

  export type NestedEnumCanalInteracaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CanalInteracao | EnumCanalInteracaoFieldRefInput<$PrismaModel>
    in?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.CanalInteracao[] | ListEnumCanalInteracaoFieldRefInput<$PrismaModel>
    not?: NestedEnumCanalInteracaoWithAggregatesFilter<$PrismaModel> | $Enums.CanalInteracao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCanalInteracaoFilter<$PrismaModel>
    _max?: NestedEnumCanalInteracaoFilter<$PrismaModel>
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

  export type NestedEnumFormatoImportacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.FormatoImportacao | EnumFormatoImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumFormatoImportacaoFilter<$PrismaModel> | $Enums.FormatoImportacao
  }

  export type NestedEnumStatusImportacaoFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusImportacao | EnumStatusImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusImportacaoFilter<$PrismaModel> | $Enums.StatusImportacao
  }

  export type NestedEnumFormatoImportacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FormatoImportacao | EnumFormatoImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.FormatoImportacao[] | ListEnumFormatoImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumFormatoImportacaoWithAggregatesFilter<$PrismaModel> | $Enums.FormatoImportacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFormatoImportacaoFilter<$PrismaModel>
    _max?: NestedEnumFormatoImportacaoFilter<$PrismaModel>
  }

  export type NestedEnumStatusImportacaoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusImportacao | EnumStatusImportacaoFieldRefInput<$PrismaModel>
    in?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusImportacao[] | ListEnumStatusImportacaoFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusImportacaoWithAggregatesFilter<$PrismaModel> | $Enums.StatusImportacao
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusImportacaoFilter<$PrismaModel>
    _max?: NestedEnumStatusImportacaoFilter<$PrismaModel>
  }

  export type EnderecoClienteCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
  }

  export type EnderecoClienteUncheckedCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
  }

  export type EnderecoClienteCreateOrConnectWithoutClienteInput = {
    where: EnderecoClienteWhereUniqueInput
    create: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput>
  }

  export type EnderecoClienteCreateManyClienteInputEnvelope = {
    data: EnderecoClienteCreateManyClienteInput | EnderecoClienteCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type ContatoClienteCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
  }

  export type ContatoClienteUncheckedCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
  }

  export type ContatoClienteCreateOrConnectWithoutClienteInput = {
    where: ContatoClienteWhereUniqueInput
    create: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput>
  }

  export type ContatoClienteCreateManyClienteInputEnvelope = {
    data: ContatoClienteCreateManyClienteInput | ContatoClienteCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type InteracaoClienteCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type InteracaoClienteUncheckedCreateWithoutClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type InteracaoClienteCreateOrConnectWithoutClienteInput = {
    where: InteracaoClienteWhereUniqueInput
    create: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput>
  }

  export type InteracaoClienteCreateManyClienteInputEnvelope = {
    data: InteracaoClienteCreateManyClienteInput | InteracaoClienteCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type ClienteSegmentoCreateWithoutClienteInput = {
    id?: string
    adicionadoEm?: Date | string
    segmento: SegmentoClienteCreateNestedOneWithoutClientesInput
  }

  export type ClienteSegmentoUncheckedCreateWithoutClienteInput = {
    id?: string
    segmentoId: string
    adicionadoEm?: Date | string
  }

  export type ClienteSegmentoCreateOrConnectWithoutClienteInput = {
    where: ClienteSegmentoWhereUniqueInput
    create: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput>
  }

  export type ClienteSegmentoCreateManyClienteInputEnvelope = {
    data: ClienteSegmentoCreateManyClienteInput | ClienteSegmentoCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type EnderecoClienteUpsertWithWhereUniqueWithoutClienteInput = {
    where: EnderecoClienteWhereUniqueInput
    update: XOR<EnderecoClienteUpdateWithoutClienteInput, EnderecoClienteUncheckedUpdateWithoutClienteInput>
    create: XOR<EnderecoClienteCreateWithoutClienteInput, EnderecoClienteUncheckedCreateWithoutClienteInput>
  }

  export type EnderecoClienteUpdateWithWhereUniqueWithoutClienteInput = {
    where: EnderecoClienteWhereUniqueInput
    data: XOR<EnderecoClienteUpdateWithoutClienteInput, EnderecoClienteUncheckedUpdateWithoutClienteInput>
  }

  export type EnderecoClienteUpdateManyWithWhereWithoutClienteInput = {
    where: EnderecoClienteScalarWhereInput
    data: XOR<EnderecoClienteUpdateManyMutationInput, EnderecoClienteUncheckedUpdateManyWithoutClienteInput>
  }

  export type EnderecoClienteScalarWhereInput = {
    AND?: EnderecoClienteScalarWhereInput | EnderecoClienteScalarWhereInput[]
    OR?: EnderecoClienteScalarWhereInput[]
    NOT?: EnderecoClienteScalarWhereInput | EnderecoClienteScalarWhereInput[]
    id?: StringFilter<"EnderecoCliente"> | string
    tenantId?: StringFilter<"EnderecoCliente"> | string
    clienteId?: StringFilter<"EnderecoCliente"> | string
    tipo?: EnumTipoEnderecoFilter<"EnderecoCliente"> | $Enums.TipoEndereco
    logradouro?: StringFilter<"EnderecoCliente"> | string
    numero?: StringFilter<"EnderecoCliente"> | string
    complemento?: StringNullableFilter<"EnderecoCliente"> | string | null
    bairro?: StringFilter<"EnderecoCliente"> | string
    cidade?: StringFilter<"EnderecoCliente"> | string
    estado?: StringFilter<"EnderecoCliente"> | string
    cep?: StringFilter<"EnderecoCliente"> | string
    pais?: StringFilter<"EnderecoCliente"> | string
    padrao?: BoolFilter<"EnderecoCliente"> | boolean
    criadoEm?: DateTimeFilter<"EnderecoCliente"> | Date | string
  }

  export type ContatoClienteUpsertWithWhereUniqueWithoutClienteInput = {
    where: ContatoClienteWhereUniqueInput
    update: XOR<ContatoClienteUpdateWithoutClienteInput, ContatoClienteUncheckedUpdateWithoutClienteInput>
    create: XOR<ContatoClienteCreateWithoutClienteInput, ContatoClienteUncheckedCreateWithoutClienteInput>
  }

  export type ContatoClienteUpdateWithWhereUniqueWithoutClienteInput = {
    where: ContatoClienteWhereUniqueInput
    data: XOR<ContatoClienteUpdateWithoutClienteInput, ContatoClienteUncheckedUpdateWithoutClienteInput>
  }

  export type ContatoClienteUpdateManyWithWhereWithoutClienteInput = {
    where: ContatoClienteScalarWhereInput
    data: XOR<ContatoClienteUpdateManyMutationInput, ContatoClienteUncheckedUpdateManyWithoutClienteInput>
  }

  export type ContatoClienteScalarWhereInput = {
    AND?: ContatoClienteScalarWhereInput | ContatoClienteScalarWhereInput[]
    OR?: ContatoClienteScalarWhereInput[]
    NOT?: ContatoClienteScalarWhereInput | ContatoClienteScalarWhereInput[]
    id?: StringFilter<"ContatoCliente"> | string
    tenantId?: StringFilter<"ContatoCliente"> | string
    clienteId?: StringFilter<"ContatoCliente"> | string
    nome?: StringFilter<"ContatoCliente"> | string
    cargo?: StringNullableFilter<"ContatoCliente"> | string | null
    email?: StringNullableFilter<"ContatoCliente"> | string | null
    telefone?: StringNullableFilter<"ContatoCliente"> | string | null
    celular?: StringNullableFilter<"ContatoCliente"> | string | null
    principal?: BoolFilter<"ContatoCliente"> | boolean
    observacoes?: StringNullableFilter<"ContatoCliente"> | string | null
    criadoEm?: DateTimeFilter<"ContatoCliente"> | Date | string
  }

  export type InteracaoClienteUpsertWithWhereUniqueWithoutClienteInput = {
    where: InteracaoClienteWhereUniqueInput
    update: XOR<InteracaoClienteUpdateWithoutClienteInput, InteracaoClienteUncheckedUpdateWithoutClienteInput>
    create: XOR<InteracaoClienteCreateWithoutClienteInput, InteracaoClienteUncheckedCreateWithoutClienteInput>
  }

  export type InteracaoClienteUpdateWithWhereUniqueWithoutClienteInput = {
    where: InteracaoClienteWhereUniqueInput
    data: XOR<InteracaoClienteUpdateWithoutClienteInput, InteracaoClienteUncheckedUpdateWithoutClienteInput>
  }

  export type InteracaoClienteUpdateManyWithWhereWithoutClienteInput = {
    where: InteracaoClienteScalarWhereInput
    data: XOR<InteracaoClienteUpdateManyMutationInput, InteracaoClienteUncheckedUpdateManyWithoutClienteInput>
  }

  export type InteracaoClienteScalarWhereInput = {
    AND?: InteracaoClienteScalarWhereInput | InteracaoClienteScalarWhereInput[]
    OR?: InteracaoClienteScalarWhereInput[]
    NOT?: InteracaoClienteScalarWhereInput | InteracaoClienteScalarWhereInput[]
    id?: StringFilter<"InteracaoCliente"> | string
    tenantId?: StringFilter<"InteracaoCliente"> | string
    clienteId?: StringFilter<"InteracaoCliente"> | string
    tipo?: EnumTipoInteracaoFilter<"InteracaoCliente"> | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFilter<"InteracaoCliente"> | $Enums.CanalInteracao
    titulo?: StringFilter<"InteracaoCliente"> | string
    descricao?: StringFilter<"InteracaoCliente"> | string
    data?: DateTimeFilter<"InteracaoCliente"> | Date | string
    usuarioId?: StringFilter<"InteracaoCliente"> | string
    pedidoId?: StringNullableFilter<"InteracaoCliente"> | string | null
    metadata?: JsonNullableFilter<"InteracaoCliente">
    criadoEm?: DateTimeFilter<"InteracaoCliente"> | Date | string
  }

  export type ClienteSegmentoUpsertWithWhereUniqueWithoutClienteInput = {
    where: ClienteSegmentoWhereUniqueInput
    update: XOR<ClienteSegmentoUpdateWithoutClienteInput, ClienteSegmentoUncheckedUpdateWithoutClienteInput>
    create: XOR<ClienteSegmentoCreateWithoutClienteInput, ClienteSegmentoUncheckedCreateWithoutClienteInput>
  }

  export type ClienteSegmentoUpdateWithWhereUniqueWithoutClienteInput = {
    where: ClienteSegmentoWhereUniqueInput
    data: XOR<ClienteSegmentoUpdateWithoutClienteInput, ClienteSegmentoUncheckedUpdateWithoutClienteInput>
  }

  export type ClienteSegmentoUpdateManyWithWhereWithoutClienteInput = {
    where: ClienteSegmentoScalarWhereInput
    data: XOR<ClienteSegmentoUpdateManyMutationInput, ClienteSegmentoUncheckedUpdateManyWithoutClienteInput>
  }

  export type ClienteSegmentoScalarWhereInput = {
    AND?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
    OR?: ClienteSegmentoScalarWhereInput[]
    NOT?: ClienteSegmentoScalarWhereInput | ClienteSegmentoScalarWhereInput[]
    id?: StringFilter<"ClienteSegmento"> | string
    clienteId?: StringFilter<"ClienteSegmento"> | string
    segmentoId?: StringFilter<"ClienteSegmento"> | string
    adicionadoEm?: DateTimeFilter<"ClienteSegmento"> | Date | string
  }

  export type ClienteCreateWithoutEnderecosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contatos?: ContatoClienteCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutEnderecosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    contatos?: ContatoClienteUncheckedCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteUncheckedCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutEnderecosInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutEnderecosInput, ClienteUncheckedCreateWithoutEnderecosInput>
  }

  export type ClienteUpsertWithoutEnderecosInput = {
    update: XOR<ClienteUpdateWithoutEnderecosInput, ClienteUncheckedUpdateWithoutEnderecosInput>
    create: XOR<ClienteCreateWithoutEnderecosInput, ClienteUncheckedCreateWithoutEnderecosInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutEnderecosInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutEnderecosInput, ClienteUncheckedUpdateWithoutEnderecosInput>
  }

  export type ClienteUpdateWithoutEnderecosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: ContatoClienteUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutEnderecosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    contatos?: ContatoClienteUncheckedUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUncheckedUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateWithoutContatosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutContatosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteUncheckedCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteUncheckedCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutContatosInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutContatosInput, ClienteUncheckedCreateWithoutContatosInput>
  }

  export type ClienteUpsertWithoutContatosInput = {
    update: XOR<ClienteUpdateWithoutContatosInput, ClienteUncheckedUpdateWithoutContatosInput>
    create: XOR<ClienteCreateWithoutContatosInput, ClienteUncheckedCreateWithoutContatosInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutContatosInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutContatosInput, ClienteUncheckedUpdateWithoutContatosInput>
  }

  export type ClienteUpdateWithoutContatosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutContatosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUncheckedUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUncheckedUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateWithoutInteracoesInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutInteracoesInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteUncheckedCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteUncheckedCreateNestedManyWithoutClienteInput
    segmentos?: ClienteSegmentoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutInteracoesInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutInteracoesInput, ClienteUncheckedCreateWithoutInteracoesInput>
  }

  export type ClienteUpsertWithoutInteracoesInput = {
    update: XOR<ClienteUpdateWithoutInteracoesInput, ClienteUncheckedUpdateWithoutInteracoesInput>
    create: XOR<ClienteCreateWithoutInteracoesInput, ClienteUncheckedCreateWithoutInteracoesInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutInteracoesInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutInteracoesInput, ClienteUncheckedUpdateWithoutInteracoesInput>
  }

  export type ClienteUpdateWithoutInteracoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutInteracoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUncheckedUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUncheckedUpdateManyWithoutClienteNestedInput
    segmentos?: ClienteSegmentoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteSegmentoCreateWithoutSegmentoInput = {
    id?: string
    adicionadoEm?: Date | string
    cliente: ClienteCreateNestedOneWithoutSegmentosInput
  }

  export type ClienteSegmentoUncheckedCreateWithoutSegmentoInput = {
    id?: string
    clienteId: string
    adicionadoEm?: Date | string
  }

  export type ClienteSegmentoCreateOrConnectWithoutSegmentoInput = {
    where: ClienteSegmentoWhereUniqueInput
    create: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput>
  }

  export type ClienteSegmentoCreateManySegmentoInputEnvelope = {
    data: ClienteSegmentoCreateManySegmentoInput | ClienteSegmentoCreateManySegmentoInput[]
    skipDuplicates?: boolean
  }

  export type ClienteSegmentoUpsertWithWhereUniqueWithoutSegmentoInput = {
    where: ClienteSegmentoWhereUniqueInput
    update: XOR<ClienteSegmentoUpdateWithoutSegmentoInput, ClienteSegmentoUncheckedUpdateWithoutSegmentoInput>
    create: XOR<ClienteSegmentoCreateWithoutSegmentoInput, ClienteSegmentoUncheckedCreateWithoutSegmentoInput>
  }

  export type ClienteSegmentoUpdateWithWhereUniqueWithoutSegmentoInput = {
    where: ClienteSegmentoWhereUniqueInput
    data: XOR<ClienteSegmentoUpdateWithoutSegmentoInput, ClienteSegmentoUncheckedUpdateWithoutSegmentoInput>
  }

  export type ClienteSegmentoUpdateManyWithWhereWithoutSegmentoInput = {
    where: ClienteSegmentoScalarWhereInput
    data: XOR<ClienteSegmentoUpdateManyMutationInput, ClienteSegmentoUncheckedUpdateManyWithoutSegmentoInput>
  }

  export type ClienteCreateWithoutSegmentosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutSegmentosInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoCliente
    nome: string
    nomeFantasia?: string | null
    razaoSocial?: string | null
    cpf?: string | null
    cnpj?: string | null
    inscricaoEstadual?: string | null
    email: string
    emailSecundario?: string | null
    telefone?: string | null
    celular?: string | null
    dataNascimento?: Date | string | null
    genero?: string | null
    observacoes?: string | null
    tags?: ClienteCreatetagsInput | string[]
    score?: number
    status?: $Enums.StatusCliente
    origem?: $Enums.OrigemCliente
    ultimaCompra?: Date | string | null
    totalCompras?: number
    valorTotalCompras?: number
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    enderecos?: EnderecoClienteUncheckedCreateNestedManyWithoutClienteInput
    contatos?: ContatoClienteUncheckedCreateNestedManyWithoutClienteInput
    interacoes?: InteracaoClienteUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutSegmentosInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutSegmentosInput, ClienteUncheckedCreateWithoutSegmentosInput>
  }

  export type SegmentoClienteCreateWithoutClientesInput = {
    id?: string
    tenantId: string
    nome: string
    descricao?: string | null
    regras: JsonNullValueInput | InputJsonValue
    totalClientes?: number
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type SegmentoClienteUncheckedCreateWithoutClientesInput = {
    id?: string
    tenantId: string
    nome: string
    descricao?: string | null
    regras: JsonNullValueInput | InputJsonValue
    totalClientes?: number
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type SegmentoClienteCreateOrConnectWithoutClientesInput = {
    where: SegmentoClienteWhereUniqueInput
    create: XOR<SegmentoClienteCreateWithoutClientesInput, SegmentoClienteUncheckedCreateWithoutClientesInput>
  }

  export type ClienteUpsertWithoutSegmentosInput = {
    update: XOR<ClienteUpdateWithoutSegmentosInput, ClienteUncheckedUpdateWithoutSegmentosInput>
    create: XOR<ClienteCreateWithoutSegmentosInput, ClienteUncheckedCreateWithoutSegmentosInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutSegmentosInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutSegmentosInput, ClienteUncheckedUpdateWithoutSegmentosInput>
  }

  export type ClienteUpdateWithoutSegmentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutSegmentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoClienteFieldUpdateOperationsInput | $Enums.TipoCliente
    nome?: StringFieldUpdateOperationsInput | string
    nomeFantasia?: NullableStringFieldUpdateOperationsInput | string | null
    razaoSocial?: NullableStringFieldUpdateOperationsInput | string | null
    cpf?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: NullableStringFieldUpdateOperationsInput | string | null
    inscricaoEstadual?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailSecundario?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    dataNascimento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    genero?: NullableStringFieldUpdateOperationsInput | string | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ClienteUpdatetagsInput | string[]
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusClienteFieldUpdateOperationsInput | $Enums.StatusCliente
    origem?: EnumOrigemClienteFieldUpdateOperationsInput | $Enums.OrigemCliente
    ultimaCompra?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalCompras?: IntFieldUpdateOperationsInput | number
    valorTotalCompras?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    enderecos?: EnderecoClienteUncheckedUpdateManyWithoutClienteNestedInput
    contatos?: ContatoClienteUncheckedUpdateManyWithoutClienteNestedInput
    interacoes?: InteracaoClienteUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type SegmentoClienteUpsertWithoutClientesInput = {
    update: XOR<SegmentoClienteUpdateWithoutClientesInput, SegmentoClienteUncheckedUpdateWithoutClientesInput>
    create: XOR<SegmentoClienteCreateWithoutClientesInput, SegmentoClienteUncheckedCreateWithoutClientesInput>
    where?: SegmentoClienteWhereInput
  }

  export type SegmentoClienteUpdateToOneWithWhereWithoutClientesInput = {
    where?: SegmentoClienteWhereInput
    data: XOR<SegmentoClienteUpdateWithoutClientesInput, SegmentoClienteUncheckedUpdateWithoutClientesInput>
  }

  export type SegmentoClienteUpdateWithoutClientesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SegmentoClienteUncheckedUpdateWithoutClientesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    regras?: JsonNullValueInput | InputJsonValue
    totalClientes?: IntFieldUpdateOperationsInput | number
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteCreateManyClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoEndereco
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    pais?: string
    padrao?: boolean
    criadoEm?: Date | string
  }

  export type ContatoClienteCreateManyClienteInput = {
    id?: string
    tenantId: string
    nome: string
    cargo?: string | null
    email?: string | null
    telefone?: string | null
    celular?: string | null
    principal?: boolean
    observacoes?: string | null
    criadoEm?: Date | string
  }

  export type InteracaoClienteCreateManyClienteInput = {
    id?: string
    tenantId: string
    tipo: $Enums.TipoInteracao
    canal: $Enums.CanalInteracao
    titulo: string
    descricao: string
    data?: Date | string
    usuarioId: string
    pedidoId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type ClienteSegmentoCreateManyClienteInput = {
    id?: string
    segmentoId: string
    adicionadoEm?: Date | string
  }

  export type EnderecoClienteUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnderecoClienteUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoEnderecoFieldUpdateOperationsInput | $Enums.TipoEndereco
    logradouro?: StringFieldUpdateOperationsInput | string
    numero?: StringFieldUpdateOperationsInput | string
    complemento?: NullableStringFieldUpdateOperationsInput | string | null
    bairro?: StringFieldUpdateOperationsInput | string
    cidade?: StringFieldUpdateOperationsInput | string
    estado?: StringFieldUpdateOperationsInput | string
    cep?: StringFieldUpdateOperationsInput | string
    pais?: StringFieldUpdateOperationsInput | string
    padrao?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ContatoClienteUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    celular?: NullableStringFieldUpdateOperationsInput | string | null
    principal?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteracaoClienteUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoInteracaoFieldUpdateOperationsInput | $Enums.TipoInteracao
    canal?: EnumCanalInteracaoFieldUpdateOperationsInput | $Enums.CanalInteracao
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarioId?: StringFieldUpdateOperationsInput | string
    pedidoId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    segmento?: SegmentoClienteUpdateOneRequiredWithoutClientesNestedInput
  }

  export type ClienteSegmentoUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    segmentoId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    segmentoId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoCreateManySegmentoInput = {
    id?: string
    clienteId: string
    adicionadoEm?: Date | string
  }

  export type ClienteSegmentoUpdateWithoutSegmentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutSegmentosNestedInput
  }

  export type ClienteSegmentoUncheckedUpdateWithoutSegmentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteSegmentoUncheckedUpdateManyWithoutSegmentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    clienteId?: StringFieldUpdateOperationsInput | string
    adicionadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ClienteCountOutputTypeDefaultArgs instead
     */
    export type ClienteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClienteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SegmentoClienteCountOutputTypeDefaultArgs instead
     */
    export type SegmentoClienteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SegmentoClienteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClienteDefaultArgs instead
     */
    export type ClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EnderecoClienteDefaultArgs instead
     */
    export type EnderecoClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnderecoClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ContatoClienteDefaultArgs instead
     */
    export type ContatoClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ContatoClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InteracaoClienteDefaultArgs instead
     */
    export type InteracaoClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InteracaoClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SegmentoClienteDefaultArgs instead
     */
    export type SegmentoClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SegmentoClienteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClienteSegmentoDefaultArgs instead
     */
    export type ClienteSegmentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClienteSegmentoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImportacaoClienteDefaultArgs instead
     */
    export type ImportacaoClienteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImportacaoClienteDefaultArgs<ExtArgs>

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