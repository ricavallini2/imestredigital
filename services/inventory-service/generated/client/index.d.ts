
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
 * Model Deposito
 * Depósito / armazém / centro de distribuição
 */
export type Deposito = $Result.DefaultSelection<Prisma.$DepositoPayload>
/**
 * Model SaldoEstoque
 * Saldo de estoque de um produto em um depósito específico
 */
export type SaldoEstoque = $Result.DefaultSelection<Prisma.$SaldoEstoquePayload>
/**
 * Model ReservaEstoque
 * Reserva de estoque para um pedido (impede venda duplicada)
 */
export type ReservaEstoque = $Result.DefaultSelection<Prisma.$ReservaEstoquePayload>
/**
 * Model Movimentacao
 * Movimentação (histórico de entrada/saída/ajuste/transferência)
 */
export type Movimentacao = $Result.DefaultSelection<Prisma.$MovimentacaoPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Depositos
 * const depositos = await prisma.deposito.findMany()
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
   * // Fetch zero or more Depositos
   * const depositos = await prisma.deposito.findMany()
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
   * `prisma.deposito`: Exposes CRUD operations for the **Deposito** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Depositos
    * const depositos = await prisma.deposito.findMany()
    * ```
    */
  get deposito(): Prisma.DepositoDelegate<ExtArgs>;

  /**
   * `prisma.saldoEstoque`: Exposes CRUD operations for the **SaldoEstoque** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SaldoEstoques
    * const saldoEstoques = await prisma.saldoEstoque.findMany()
    * ```
    */
  get saldoEstoque(): Prisma.SaldoEstoqueDelegate<ExtArgs>;

  /**
   * `prisma.reservaEstoque`: Exposes CRUD operations for the **ReservaEstoque** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReservaEstoques
    * const reservaEstoques = await prisma.reservaEstoque.findMany()
    * ```
    */
  get reservaEstoque(): Prisma.ReservaEstoqueDelegate<ExtArgs>;

  /**
   * `prisma.movimentacao`: Exposes CRUD operations for the **Movimentacao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Movimentacaos
    * const movimentacaos = await prisma.movimentacao.findMany()
    * ```
    */
  get movimentacao(): Prisma.MovimentacaoDelegate<ExtArgs>;
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
    Deposito: 'Deposito',
    SaldoEstoque: 'SaldoEstoque',
    ReservaEstoque: 'ReservaEstoque',
    Movimentacao: 'Movimentacao'
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
      modelProps: "deposito" | "saldoEstoque" | "reservaEstoque" | "movimentacao"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Deposito: {
        payload: Prisma.$DepositoPayload<ExtArgs>
        fields: Prisma.DepositoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepositoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepositoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          findFirst: {
            args: Prisma.DepositoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepositoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          findMany: {
            args: Prisma.DepositoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>[]
          }
          create: {
            args: Prisma.DepositoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          createMany: {
            args: Prisma.DepositoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepositoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>[]
          }
          delete: {
            args: Prisma.DepositoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          update: {
            args: Prisma.DepositoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          deleteMany: {
            args: Prisma.DepositoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepositoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepositoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepositoPayload>
          }
          aggregate: {
            args: Prisma.DepositoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeposito>
          }
          groupBy: {
            args: Prisma.DepositoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepositoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepositoCountArgs<ExtArgs>
            result: $Utils.Optional<DepositoCountAggregateOutputType> | number
          }
        }
      }
      SaldoEstoque: {
        payload: Prisma.$SaldoEstoquePayload<ExtArgs>
        fields: Prisma.SaldoEstoqueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SaldoEstoqueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SaldoEstoqueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          findFirst: {
            args: Prisma.SaldoEstoqueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SaldoEstoqueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          findMany: {
            args: Prisma.SaldoEstoqueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>[]
          }
          create: {
            args: Prisma.SaldoEstoqueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          createMany: {
            args: Prisma.SaldoEstoqueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SaldoEstoqueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>[]
          }
          delete: {
            args: Prisma.SaldoEstoqueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          update: {
            args: Prisma.SaldoEstoqueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          deleteMany: {
            args: Prisma.SaldoEstoqueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SaldoEstoqueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SaldoEstoqueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SaldoEstoquePayload>
          }
          aggregate: {
            args: Prisma.SaldoEstoqueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSaldoEstoque>
          }
          groupBy: {
            args: Prisma.SaldoEstoqueGroupByArgs<ExtArgs>
            result: $Utils.Optional<SaldoEstoqueGroupByOutputType>[]
          }
          count: {
            args: Prisma.SaldoEstoqueCountArgs<ExtArgs>
            result: $Utils.Optional<SaldoEstoqueCountAggregateOutputType> | number
          }
        }
      }
      ReservaEstoque: {
        payload: Prisma.$ReservaEstoquePayload<ExtArgs>
        fields: Prisma.ReservaEstoqueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservaEstoqueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservaEstoqueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          findFirst: {
            args: Prisma.ReservaEstoqueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservaEstoqueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          findMany: {
            args: Prisma.ReservaEstoqueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>[]
          }
          create: {
            args: Prisma.ReservaEstoqueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          createMany: {
            args: Prisma.ReservaEstoqueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservaEstoqueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>[]
          }
          delete: {
            args: Prisma.ReservaEstoqueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          update: {
            args: Prisma.ReservaEstoqueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          deleteMany: {
            args: Prisma.ReservaEstoqueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservaEstoqueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservaEstoqueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaEstoquePayload>
          }
          aggregate: {
            args: Prisma.ReservaEstoqueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservaEstoque>
          }
          groupBy: {
            args: Prisma.ReservaEstoqueGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservaEstoqueGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservaEstoqueCountArgs<ExtArgs>
            result: $Utils.Optional<ReservaEstoqueCountAggregateOutputType> | number
          }
        }
      }
      Movimentacao: {
        payload: Prisma.$MovimentacaoPayload<ExtArgs>
        fields: Prisma.MovimentacaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MovimentacaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MovimentacaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          findFirst: {
            args: Prisma.MovimentacaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MovimentacaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          findMany: {
            args: Prisma.MovimentacaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>[]
          }
          create: {
            args: Prisma.MovimentacaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          createMany: {
            args: Prisma.MovimentacaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MovimentacaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>[]
          }
          delete: {
            args: Prisma.MovimentacaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          update: {
            args: Prisma.MovimentacaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          deleteMany: {
            args: Prisma.MovimentacaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MovimentacaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MovimentacaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MovimentacaoPayload>
          }
          aggregate: {
            args: Prisma.MovimentacaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMovimentacao>
          }
          groupBy: {
            args: Prisma.MovimentacaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<MovimentacaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.MovimentacaoCountArgs<ExtArgs>
            result: $Utils.Optional<MovimentacaoCountAggregateOutputType> | number
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
   * Count Type DepositoCountOutputType
   */

  export type DepositoCountOutputType = {
    saldos: number
    movimentacoes: number
  }

  export type DepositoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saldos?: boolean | DepositoCountOutputTypeCountSaldosArgs
    movimentacoes?: boolean | DepositoCountOutputTypeCountMovimentacoesArgs
  }

  // Custom InputTypes
  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepositoCountOutputType
     */
    select?: DepositoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeCountSaldosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaldoEstoqueWhereInput
  }

  /**
   * DepositoCountOutputType without action
   */
  export type DepositoCountOutputTypeCountMovimentacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimentacaoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Deposito
   */

  export type AggregateDeposito = {
    _count: DepositoCountAggregateOutputType | null
    _min: DepositoMinAggregateOutputType | null
    _max: DepositoMaxAggregateOutputType | null
  }

  export type DepositoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    endereco: string | null
    cidade: string | null
    estado: string | null
    padrao: boolean | null
    ativo: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type DepositoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    endereco: string | null
    cidade: string | null
    estado: string | null
    padrao: boolean | null
    ativo: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type DepositoCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    endereco: number
    cidade: number
    estado: number
    padrao: number
    ativo: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type DepositoMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    endereco?: true
    cidade?: true
    estado?: true
    padrao?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type DepositoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    endereco?: true
    cidade?: true
    estado?: true
    padrao?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type DepositoCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    endereco?: true
    cidade?: true
    estado?: true
    padrao?: true
    ativo?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type DepositoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deposito to aggregate.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Depositos
    **/
    _count?: true | DepositoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepositoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepositoMaxAggregateInputType
  }

  export type GetDepositoAggregateType<T extends DepositoAggregateArgs> = {
        [P in keyof T & keyof AggregateDeposito]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeposito[P]>
      : GetScalarType<T[P], AggregateDeposito[P]>
  }




  export type DepositoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepositoWhereInput
    orderBy?: DepositoOrderByWithAggregationInput | DepositoOrderByWithAggregationInput[]
    by: DepositoScalarFieldEnum[] | DepositoScalarFieldEnum
    having?: DepositoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepositoCountAggregateInputType | true
    _min?: DepositoMinAggregateInputType
    _max?: DepositoMaxAggregateInputType
  }

  export type DepositoGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    endereco: string | null
    cidade: string | null
    estado: string | null
    padrao: boolean
    ativo: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: DepositoCountAggregateOutputType | null
    _min: DepositoMinAggregateOutputType | null
    _max: DepositoMaxAggregateOutputType | null
  }

  type GetDepositoGroupByPayload<T extends DepositoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepositoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepositoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepositoGroupByOutputType[P]>
            : GetScalarType<T[P], DepositoGroupByOutputType[P]>
        }
      >
    >


  export type DepositoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    endereco?: boolean
    cidade?: boolean
    estado?: boolean
    padrao?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    saldos?: boolean | Deposito$saldosArgs<ExtArgs>
    movimentacoes?: boolean | Deposito$movimentacoesArgs<ExtArgs>
    _count?: boolean | DepositoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deposito"]>

  export type DepositoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    endereco?: boolean
    cidade?: boolean
    estado?: boolean
    padrao?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["deposito"]>

  export type DepositoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    endereco?: boolean
    cidade?: boolean
    estado?: boolean
    padrao?: boolean
    ativo?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type DepositoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saldos?: boolean | Deposito$saldosArgs<ExtArgs>
    movimentacoes?: boolean | Deposito$movimentacoesArgs<ExtArgs>
    _count?: boolean | DepositoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepositoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepositoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deposito"
    objects: {
      saldos: Prisma.$SaldoEstoquePayload<ExtArgs>[]
      movimentacoes: Prisma.$MovimentacaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      endereco: string | null
      cidade: string | null
      estado: string | null
      padrao: boolean
      ativo: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["deposito"]>
    composites: {}
  }

  type DepositoGetPayload<S extends boolean | null | undefined | DepositoDefaultArgs> = $Result.GetResult<Prisma.$DepositoPayload, S>

  type DepositoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DepositoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DepositoCountAggregateInputType | true
    }

  export interface DepositoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deposito'], meta: { name: 'Deposito' } }
    /**
     * Find zero or one Deposito that matches the filter.
     * @param {DepositoFindUniqueArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepositoFindUniqueArgs>(args: SelectSubset<T, DepositoFindUniqueArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Deposito that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DepositoFindUniqueOrThrowArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepositoFindUniqueOrThrowArgs>(args: SelectSubset<T, DepositoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Deposito that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindFirstArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepositoFindFirstArgs>(args?: SelectSubset<T, DepositoFindFirstArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Deposito that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindFirstOrThrowArgs} args - Arguments to find a Deposito
     * @example
     * // Get one Deposito
     * const deposito = await prisma.deposito.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepositoFindFirstOrThrowArgs>(args?: SelectSubset<T, DepositoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Depositos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Depositos
     * const depositos = await prisma.deposito.findMany()
     * 
     * // Get first 10 Depositos
     * const depositos = await prisma.deposito.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const depositoWithIdOnly = await prisma.deposito.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepositoFindManyArgs>(args?: SelectSubset<T, DepositoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Deposito.
     * @param {DepositoCreateArgs} args - Arguments to create a Deposito.
     * @example
     * // Create one Deposito
     * const Deposito = await prisma.deposito.create({
     *   data: {
     *     // ... data to create a Deposito
     *   }
     * })
     * 
     */
    create<T extends DepositoCreateArgs>(args: SelectSubset<T, DepositoCreateArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Depositos.
     * @param {DepositoCreateManyArgs} args - Arguments to create many Depositos.
     * @example
     * // Create many Depositos
     * const deposito = await prisma.deposito.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepositoCreateManyArgs>(args?: SelectSubset<T, DepositoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Depositos and returns the data saved in the database.
     * @param {DepositoCreateManyAndReturnArgs} args - Arguments to create many Depositos.
     * @example
     * // Create many Depositos
     * const deposito = await prisma.deposito.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Depositos and only return the `id`
     * const depositoWithIdOnly = await prisma.deposito.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepositoCreateManyAndReturnArgs>(args?: SelectSubset<T, DepositoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Deposito.
     * @param {DepositoDeleteArgs} args - Arguments to delete one Deposito.
     * @example
     * // Delete one Deposito
     * const Deposito = await prisma.deposito.delete({
     *   where: {
     *     // ... filter to delete one Deposito
     *   }
     * })
     * 
     */
    delete<T extends DepositoDeleteArgs>(args: SelectSubset<T, DepositoDeleteArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Deposito.
     * @param {DepositoUpdateArgs} args - Arguments to update one Deposito.
     * @example
     * // Update one Deposito
     * const deposito = await prisma.deposito.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepositoUpdateArgs>(args: SelectSubset<T, DepositoUpdateArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Depositos.
     * @param {DepositoDeleteManyArgs} args - Arguments to filter Depositos to delete.
     * @example
     * // Delete a few Depositos
     * const { count } = await prisma.deposito.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepositoDeleteManyArgs>(args?: SelectSubset<T, DepositoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Depositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Depositos
     * const deposito = await prisma.deposito.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepositoUpdateManyArgs>(args: SelectSubset<T, DepositoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Deposito.
     * @param {DepositoUpsertArgs} args - Arguments to update or create a Deposito.
     * @example
     * // Update or create a Deposito
     * const deposito = await prisma.deposito.upsert({
     *   create: {
     *     // ... data to create a Deposito
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deposito we want to update
     *   }
     * })
     */
    upsert<T extends DepositoUpsertArgs>(args: SelectSubset<T, DepositoUpsertArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Depositos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoCountArgs} args - Arguments to filter Depositos to count.
     * @example
     * // Count the number of Depositos
     * const count = await prisma.deposito.count({
     *   where: {
     *     // ... the filter for the Depositos we want to count
     *   }
     * })
    **/
    count<T extends DepositoCountArgs>(
      args?: Subset<T, DepositoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepositoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DepositoAggregateArgs>(args: Subset<T, DepositoAggregateArgs>): Prisma.PrismaPromise<GetDepositoAggregateType<T>>

    /**
     * Group by Deposito.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepositoGroupByArgs} args - Group by arguments.
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
      T extends DepositoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepositoGroupByArgs['orderBy'] }
        : { orderBy?: DepositoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DepositoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepositoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deposito model
   */
  readonly fields: DepositoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deposito.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepositoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    saldos<T extends Deposito$saldosArgs<ExtArgs> = {}>(args?: Subset<T, Deposito$saldosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findMany"> | Null>
    movimentacoes<T extends Deposito$movimentacoesArgs<ExtArgs> = {}>(args?: Subset<T, Deposito$movimentacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Deposito model
   */ 
  interface DepositoFieldRefs {
    readonly id: FieldRef<"Deposito", 'String'>
    readonly tenantId: FieldRef<"Deposito", 'String'>
    readonly nome: FieldRef<"Deposito", 'String'>
    readonly endereco: FieldRef<"Deposito", 'String'>
    readonly cidade: FieldRef<"Deposito", 'String'>
    readonly estado: FieldRef<"Deposito", 'String'>
    readonly padrao: FieldRef<"Deposito", 'Boolean'>
    readonly ativo: FieldRef<"Deposito", 'Boolean'>
    readonly criadoEm: FieldRef<"Deposito", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Deposito", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Deposito findUnique
   */
  export type DepositoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito findUniqueOrThrow
   */
  export type DepositoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito findFirst
   */
  export type DepositoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Depositos.
     */
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito findFirstOrThrow
   */
  export type DepositoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Deposito to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Depositos.
     */
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito findMany
   */
  export type DepositoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter, which Depositos to fetch.
     */
    where?: DepositoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Depositos to fetch.
     */
    orderBy?: DepositoOrderByWithRelationInput | DepositoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Depositos.
     */
    cursor?: DepositoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Depositos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Depositos.
     */
    skip?: number
    distinct?: DepositoScalarFieldEnum | DepositoScalarFieldEnum[]
  }

  /**
   * Deposito create
   */
  export type DepositoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The data needed to create a Deposito.
     */
    data: XOR<DepositoCreateInput, DepositoUncheckedCreateInput>
  }

  /**
   * Deposito createMany
   */
  export type DepositoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Depositos.
     */
    data: DepositoCreateManyInput | DepositoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deposito createManyAndReturn
   */
  export type DepositoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Depositos.
     */
    data: DepositoCreateManyInput | DepositoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deposito update
   */
  export type DepositoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The data needed to update a Deposito.
     */
    data: XOR<DepositoUpdateInput, DepositoUncheckedUpdateInput>
    /**
     * Choose, which Deposito to update.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito updateMany
   */
  export type DepositoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Depositos.
     */
    data: XOR<DepositoUpdateManyMutationInput, DepositoUncheckedUpdateManyInput>
    /**
     * Filter which Depositos to update
     */
    where?: DepositoWhereInput
  }

  /**
   * Deposito upsert
   */
  export type DepositoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * The filter to search for the Deposito to update in case it exists.
     */
    where: DepositoWhereUniqueInput
    /**
     * In case the Deposito found by the `where` argument doesn't exist, create a new Deposito with this data.
     */
    create: XOR<DepositoCreateInput, DepositoUncheckedCreateInput>
    /**
     * In case the Deposito was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepositoUpdateInput, DepositoUncheckedUpdateInput>
  }

  /**
   * Deposito delete
   */
  export type DepositoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
    /**
     * Filter which Deposito to delete.
     */
    where: DepositoWhereUniqueInput
  }

  /**
   * Deposito deleteMany
   */
  export type DepositoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Depositos to delete
     */
    where?: DepositoWhereInput
  }

  /**
   * Deposito.saldos
   */
  export type Deposito$saldosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    where?: SaldoEstoqueWhereInput
    orderBy?: SaldoEstoqueOrderByWithRelationInput | SaldoEstoqueOrderByWithRelationInput[]
    cursor?: SaldoEstoqueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SaldoEstoqueScalarFieldEnum | SaldoEstoqueScalarFieldEnum[]
  }

  /**
   * Deposito.movimentacoes
   */
  export type Deposito$movimentacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    where?: MovimentacaoWhereInput
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    cursor?: MovimentacaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Deposito without action
   */
  export type DepositoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deposito
     */
    select?: DepositoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepositoInclude<ExtArgs> | null
  }


  /**
   * Model SaldoEstoque
   */

  export type AggregateSaldoEstoque = {
    _count: SaldoEstoqueCountAggregateOutputType | null
    _avg: SaldoEstoqueAvgAggregateOutputType | null
    _sum: SaldoEstoqueSumAggregateOutputType | null
    _min: SaldoEstoqueMinAggregateOutputType | null
    _max: SaldoEstoqueMaxAggregateOutputType | null
  }

  export type SaldoEstoqueAvgAggregateOutputType = {
    quantidadeFisica: number | null
    reservado: number | null
    estoqueMinimo: number | null
  }

  export type SaldoEstoqueSumAggregateOutputType = {
    quantidadeFisica: number | null
    reservado: number | null
    estoqueMinimo: number | null
  }

  export type SaldoEstoqueMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    depositoId: string | null
    quantidadeFisica: number | null
    reservado: number | null
    estoqueMinimo: number | null
    atualizadoEm: Date | null
  }

  export type SaldoEstoqueMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    depositoId: string | null
    quantidadeFisica: number | null
    reservado: number | null
    estoqueMinimo: number | null
    atualizadoEm: Date | null
  }

  export type SaldoEstoqueCountAggregateOutputType = {
    id: number
    tenantId: number
    produtoId: number
    depositoId: number
    quantidadeFisica: number
    reservado: number
    estoqueMinimo: number
    atualizadoEm: number
    _all: number
  }


  export type SaldoEstoqueAvgAggregateInputType = {
    quantidadeFisica?: true
    reservado?: true
    estoqueMinimo?: true
  }

  export type SaldoEstoqueSumAggregateInputType = {
    quantidadeFisica?: true
    reservado?: true
    estoqueMinimo?: true
  }

  export type SaldoEstoqueMinAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    quantidadeFisica?: true
    reservado?: true
    estoqueMinimo?: true
    atualizadoEm?: true
  }

  export type SaldoEstoqueMaxAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    quantidadeFisica?: true
    reservado?: true
    estoqueMinimo?: true
    atualizadoEm?: true
  }

  export type SaldoEstoqueCountAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    quantidadeFisica?: true
    reservado?: true
    estoqueMinimo?: true
    atualizadoEm?: true
    _all?: true
  }

  export type SaldoEstoqueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaldoEstoque to aggregate.
     */
    where?: SaldoEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaldoEstoques to fetch.
     */
    orderBy?: SaldoEstoqueOrderByWithRelationInput | SaldoEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SaldoEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaldoEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaldoEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SaldoEstoques
    **/
    _count?: true | SaldoEstoqueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SaldoEstoqueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SaldoEstoqueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SaldoEstoqueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SaldoEstoqueMaxAggregateInputType
  }

  export type GetSaldoEstoqueAggregateType<T extends SaldoEstoqueAggregateArgs> = {
        [P in keyof T & keyof AggregateSaldoEstoque]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSaldoEstoque[P]>
      : GetScalarType<T[P], AggregateSaldoEstoque[P]>
  }




  export type SaldoEstoqueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SaldoEstoqueWhereInput
    orderBy?: SaldoEstoqueOrderByWithAggregationInput | SaldoEstoqueOrderByWithAggregationInput[]
    by: SaldoEstoqueScalarFieldEnum[] | SaldoEstoqueScalarFieldEnum
    having?: SaldoEstoqueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SaldoEstoqueCountAggregateInputType | true
    _avg?: SaldoEstoqueAvgAggregateInputType
    _sum?: SaldoEstoqueSumAggregateInputType
    _min?: SaldoEstoqueMinAggregateInputType
    _max?: SaldoEstoqueMaxAggregateInputType
  }

  export type SaldoEstoqueGroupByOutputType = {
    id: string
    tenantId: string
    produtoId: string
    depositoId: string
    quantidadeFisica: number
    reservado: number
    estoqueMinimo: number
    atualizadoEm: Date
    _count: SaldoEstoqueCountAggregateOutputType | null
    _avg: SaldoEstoqueAvgAggregateOutputType | null
    _sum: SaldoEstoqueSumAggregateOutputType | null
    _min: SaldoEstoqueMinAggregateOutputType | null
    _max: SaldoEstoqueMaxAggregateOutputType | null
  }

  type GetSaldoEstoqueGroupByPayload<T extends SaldoEstoqueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SaldoEstoqueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SaldoEstoqueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SaldoEstoqueGroupByOutputType[P]>
            : GetScalarType<T[P], SaldoEstoqueGroupByOutputType[P]>
        }
      >
    >


  export type SaldoEstoqueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    quantidadeFisica?: boolean
    reservado?: boolean
    estoqueMinimo?: boolean
    atualizadoEm?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saldoEstoque"]>

  export type SaldoEstoqueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    quantidadeFisica?: boolean
    reservado?: boolean
    estoqueMinimo?: boolean
    atualizadoEm?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["saldoEstoque"]>

  export type SaldoEstoqueSelectScalar = {
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    quantidadeFisica?: boolean
    reservado?: boolean
    estoqueMinimo?: boolean
    atualizadoEm?: boolean
  }

  export type SaldoEstoqueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }
  export type SaldoEstoqueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }

  export type $SaldoEstoquePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SaldoEstoque"
    objects: {
      deposito: Prisma.$DepositoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      produtoId: string
      depositoId: string
      quantidadeFisica: number
      reservado: number
      estoqueMinimo: number
      atualizadoEm: Date
    }, ExtArgs["result"]["saldoEstoque"]>
    composites: {}
  }

  type SaldoEstoqueGetPayload<S extends boolean | null | undefined | SaldoEstoqueDefaultArgs> = $Result.GetResult<Prisma.$SaldoEstoquePayload, S>

  type SaldoEstoqueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SaldoEstoqueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SaldoEstoqueCountAggregateInputType | true
    }

  export interface SaldoEstoqueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SaldoEstoque'], meta: { name: 'SaldoEstoque' } }
    /**
     * Find zero or one SaldoEstoque that matches the filter.
     * @param {SaldoEstoqueFindUniqueArgs} args - Arguments to find a SaldoEstoque
     * @example
     * // Get one SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SaldoEstoqueFindUniqueArgs>(args: SelectSubset<T, SaldoEstoqueFindUniqueArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SaldoEstoque that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SaldoEstoqueFindUniqueOrThrowArgs} args - Arguments to find a SaldoEstoque
     * @example
     * // Get one SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SaldoEstoqueFindUniqueOrThrowArgs>(args: SelectSubset<T, SaldoEstoqueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SaldoEstoque that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueFindFirstArgs} args - Arguments to find a SaldoEstoque
     * @example
     * // Get one SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SaldoEstoqueFindFirstArgs>(args?: SelectSubset<T, SaldoEstoqueFindFirstArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SaldoEstoque that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueFindFirstOrThrowArgs} args - Arguments to find a SaldoEstoque
     * @example
     * // Get one SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SaldoEstoqueFindFirstOrThrowArgs>(args?: SelectSubset<T, SaldoEstoqueFindFirstOrThrowArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SaldoEstoques that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SaldoEstoques
     * const saldoEstoques = await prisma.saldoEstoque.findMany()
     * 
     * // Get first 10 SaldoEstoques
     * const saldoEstoques = await prisma.saldoEstoque.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const saldoEstoqueWithIdOnly = await prisma.saldoEstoque.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SaldoEstoqueFindManyArgs>(args?: SelectSubset<T, SaldoEstoqueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SaldoEstoque.
     * @param {SaldoEstoqueCreateArgs} args - Arguments to create a SaldoEstoque.
     * @example
     * // Create one SaldoEstoque
     * const SaldoEstoque = await prisma.saldoEstoque.create({
     *   data: {
     *     // ... data to create a SaldoEstoque
     *   }
     * })
     * 
     */
    create<T extends SaldoEstoqueCreateArgs>(args: SelectSubset<T, SaldoEstoqueCreateArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SaldoEstoques.
     * @param {SaldoEstoqueCreateManyArgs} args - Arguments to create many SaldoEstoques.
     * @example
     * // Create many SaldoEstoques
     * const saldoEstoque = await prisma.saldoEstoque.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SaldoEstoqueCreateManyArgs>(args?: SelectSubset<T, SaldoEstoqueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SaldoEstoques and returns the data saved in the database.
     * @param {SaldoEstoqueCreateManyAndReturnArgs} args - Arguments to create many SaldoEstoques.
     * @example
     * // Create many SaldoEstoques
     * const saldoEstoque = await prisma.saldoEstoque.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SaldoEstoques and only return the `id`
     * const saldoEstoqueWithIdOnly = await prisma.saldoEstoque.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SaldoEstoqueCreateManyAndReturnArgs>(args?: SelectSubset<T, SaldoEstoqueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SaldoEstoque.
     * @param {SaldoEstoqueDeleteArgs} args - Arguments to delete one SaldoEstoque.
     * @example
     * // Delete one SaldoEstoque
     * const SaldoEstoque = await prisma.saldoEstoque.delete({
     *   where: {
     *     // ... filter to delete one SaldoEstoque
     *   }
     * })
     * 
     */
    delete<T extends SaldoEstoqueDeleteArgs>(args: SelectSubset<T, SaldoEstoqueDeleteArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SaldoEstoque.
     * @param {SaldoEstoqueUpdateArgs} args - Arguments to update one SaldoEstoque.
     * @example
     * // Update one SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SaldoEstoqueUpdateArgs>(args: SelectSubset<T, SaldoEstoqueUpdateArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SaldoEstoques.
     * @param {SaldoEstoqueDeleteManyArgs} args - Arguments to filter SaldoEstoques to delete.
     * @example
     * // Delete a few SaldoEstoques
     * const { count } = await prisma.saldoEstoque.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SaldoEstoqueDeleteManyArgs>(args?: SelectSubset<T, SaldoEstoqueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SaldoEstoques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SaldoEstoques
     * const saldoEstoque = await prisma.saldoEstoque.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SaldoEstoqueUpdateManyArgs>(args: SelectSubset<T, SaldoEstoqueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SaldoEstoque.
     * @param {SaldoEstoqueUpsertArgs} args - Arguments to update or create a SaldoEstoque.
     * @example
     * // Update or create a SaldoEstoque
     * const saldoEstoque = await prisma.saldoEstoque.upsert({
     *   create: {
     *     // ... data to create a SaldoEstoque
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SaldoEstoque we want to update
     *   }
     * })
     */
    upsert<T extends SaldoEstoqueUpsertArgs>(args: SelectSubset<T, SaldoEstoqueUpsertArgs<ExtArgs>>): Prisma__SaldoEstoqueClient<$Result.GetResult<Prisma.$SaldoEstoquePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SaldoEstoques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueCountArgs} args - Arguments to filter SaldoEstoques to count.
     * @example
     * // Count the number of SaldoEstoques
     * const count = await prisma.saldoEstoque.count({
     *   where: {
     *     // ... the filter for the SaldoEstoques we want to count
     *   }
     * })
    **/
    count<T extends SaldoEstoqueCountArgs>(
      args?: Subset<T, SaldoEstoqueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SaldoEstoqueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SaldoEstoque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SaldoEstoqueAggregateArgs>(args: Subset<T, SaldoEstoqueAggregateArgs>): Prisma.PrismaPromise<GetSaldoEstoqueAggregateType<T>>

    /**
     * Group by SaldoEstoque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SaldoEstoqueGroupByArgs} args - Group by arguments.
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
      T extends SaldoEstoqueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SaldoEstoqueGroupByArgs['orderBy'] }
        : { orderBy?: SaldoEstoqueGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SaldoEstoqueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaldoEstoqueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SaldoEstoque model
   */
  readonly fields: SaldoEstoqueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SaldoEstoque.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SaldoEstoqueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deposito<T extends DepositoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepositoDefaultArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SaldoEstoque model
   */ 
  interface SaldoEstoqueFieldRefs {
    readonly id: FieldRef<"SaldoEstoque", 'String'>
    readonly tenantId: FieldRef<"SaldoEstoque", 'String'>
    readonly produtoId: FieldRef<"SaldoEstoque", 'String'>
    readonly depositoId: FieldRef<"SaldoEstoque", 'String'>
    readonly quantidadeFisica: FieldRef<"SaldoEstoque", 'Int'>
    readonly reservado: FieldRef<"SaldoEstoque", 'Int'>
    readonly estoqueMinimo: FieldRef<"SaldoEstoque", 'Int'>
    readonly atualizadoEm: FieldRef<"SaldoEstoque", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SaldoEstoque findUnique
   */
  export type SaldoEstoqueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter, which SaldoEstoque to fetch.
     */
    where: SaldoEstoqueWhereUniqueInput
  }

  /**
   * SaldoEstoque findUniqueOrThrow
   */
  export type SaldoEstoqueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter, which SaldoEstoque to fetch.
     */
    where: SaldoEstoqueWhereUniqueInput
  }

  /**
   * SaldoEstoque findFirst
   */
  export type SaldoEstoqueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter, which SaldoEstoque to fetch.
     */
    where?: SaldoEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaldoEstoques to fetch.
     */
    orderBy?: SaldoEstoqueOrderByWithRelationInput | SaldoEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaldoEstoques.
     */
    cursor?: SaldoEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaldoEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaldoEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaldoEstoques.
     */
    distinct?: SaldoEstoqueScalarFieldEnum | SaldoEstoqueScalarFieldEnum[]
  }

  /**
   * SaldoEstoque findFirstOrThrow
   */
  export type SaldoEstoqueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter, which SaldoEstoque to fetch.
     */
    where?: SaldoEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaldoEstoques to fetch.
     */
    orderBy?: SaldoEstoqueOrderByWithRelationInput | SaldoEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SaldoEstoques.
     */
    cursor?: SaldoEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaldoEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaldoEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SaldoEstoques.
     */
    distinct?: SaldoEstoqueScalarFieldEnum | SaldoEstoqueScalarFieldEnum[]
  }

  /**
   * SaldoEstoque findMany
   */
  export type SaldoEstoqueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter, which SaldoEstoques to fetch.
     */
    where?: SaldoEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SaldoEstoques to fetch.
     */
    orderBy?: SaldoEstoqueOrderByWithRelationInput | SaldoEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SaldoEstoques.
     */
    cursor?: SaldoEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SaldoEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SaldoEstoques.
     */
    skip?: number
    distinct?: SaldoEstoqueScalarFieldEnum | SaldoEstoqueScalarFieldEnum[]
  }

  /**
   * SaldoEstoque create
   */
  export type SaldoEstoqueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * The data needed to create a SaldoEstoque.
     */
    data: XOR<SaldoEstoqueCreateInput, SaldoEstoqueUncheckedCreateInput>
  }

  /**
   * SaldoEstoque createMany
   */
  export type SaldoEstoqueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SaldoEstoques.
     */
    data: SaldoEstoqueCreateManyInput | SaldoEstoqueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SaldoEstoque createManyAndReturn
   */
  export type SaldoEstoqueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SaldoEstoques.
     */
    data: SaldoEstoqueCreateManyInput | SaldoEstoqueCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SaldoEstoque update
   */
  export type SaldoEstoqueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * The data needed to update a SaldoEstoque.
     */
    data: XOR<SaldoEstoqueUpdateInput, SaldoEstoqueUncheckedUpdateInput>
    /**
     * Choose, which SaldoEstoque to update.
     */
    where: SaldoEstoqueWhereUniqueInput
  }

  /**
   * SaldoEstoque updateMany
   */
  export type SaldoEstoqueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SaldoEstoques.
     */
    data: XOR<SaldoEstoqueUpdateManyMutationInput, SaldoEstoqueUncheckedUpdateManyInput>
    /**
     * Filter which SaldoEstoques to update
     */
    where?: SaldoEstoqueWhereInput
  }

  /**
   * SaldoEstoque upsert
   */
  export type SaldoEstoqueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * The filter to search for the SaldoEstoque to update in case it exists.
     */
    where: SaldoEstoqueWhereUniqueInput
    /**
     * In case the SaldoEstoque found by the `where` argument doesn't exist, create a new SaldoEstoque with this data.
     */
    create: XOR<SaldoEstoqueCreateInput, SaldoEstoqueUncheckedCreateInput>
    /**
     * In case the SaldoEstoque was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SaldoEstoqueUpdateInput, SaldoEstoqueUncheckedUpdateInput>
  }

  /**
   * SaldoEstoque delete
   */
  export type SaldoEstoqueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
    /**
     * Filter which SaldoEstoque to delete.
     */
    where: SaldoEstoqueWhereUniqueInput
  }

  /**
   * SaldoEstoque deleteMany
   */
  export type SaldoEstoqueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SaldoEstoques to delete
     */
    where?: SaldoEstoqueWhereInput
  }

  /**
   * SaldoEstoque without action
   */
  export type SaldoEstoqueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SaldoEstoque
     */
    select?: SaldoEstoqueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SaldoEstoqueInclude<ExtArgs> | null
  }


  /**
   * Model ReservaEstoque
   */

  export type AggregateReservaEstoque = {
    _count: ReservaEstoqueCountAggregateOutputType | null
    _avg: ReservaEstoqueAvgAggregateOutputType | null
    _sum: ReservaEstoqueSumAggregateOutputType | null
    _min: ReservaEstoqueMinAggregateOutputType | null
    _max: ReservaEstoqueMaxAggregateOutputType | null
  }

  export type ReservaEstoqueAvgAggregateOutputType = {
    quantidade: number | null
  }

  export type ReservaEstoqueSumAggregateOutputType = {
    quantidade: number | null
  }

  export type ReservaEstoqueMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    pedidoId: string | null
    quantidade: number | null
    status: string | null
    criadoEm: Date | null
  }

  export type ReservaEstoqueMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    pedidoId: string | null
    quantidade: number | null
    status: string | null
    criadoEm: Date | null
  }

  export type ReservaEstoqueCountAggregateOutputType = {
    id: number
    tenantId: number
    produtoId: number
    pedidoId: number
    quantidade: number
    status: number
    criadoEm: number
    _all: number
  }


  export type ReservaEstoqueAvgAggregateInputType = {
    quantidade?: true
  }

  export type ReservaEstoqueSumAggregateInputType = {
    quantidade?: true
  }

  export type ReservaEstoqueMinAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    pedidoId?: true
    quantidade?: true
    status?: true
    criadoEm?: true
  }

  export type ReservaEstoqueMaxAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    pedidoId?: true
    quantidade?: true
    status?: true
    criadoEm?: true
  }

  export type ReservaEstoqueCountAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    pedidoId?: true
    quantidade?: true
    status?: true
    criadoEm?: true
    _all?: true
  }

  export type ReservaEstoqueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservaEstoque to aggregate.
     */
    where?: ReservaEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservaEstoques to fetch.
     */
    orderBy?: ReservaEstoqueOrderByWithRelationInput | ReservaEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservaEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservaEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservaEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReservaEstoques
    **/
    _count?: true | ReservaEstoqueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservaEstoqueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservaEstoqueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservaEstoqueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservaEstoqueMaxAggregateInputType
  }

  export type GetReservaEstoqueAggregateType<T extends ReservaEstoqueAggregateArgs> = {
        [P in keyof T & keyof AggregateReservaEstoque]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservaEstoque[P]>
      : GetScalarType<T[P], AggregateReservaEstoque[P]>
  }




  export type ReservaEstoqueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaEstoqueWhereInput
    orderBy?: ReservaEstoqueOrderByWithAggregationInput | ReservaEstoqueOrderByWithAggregationInput[]
    by: ReservaEstoqueScalarFieldEnum[] | ReservaEstoqueScalarFieldEnum
    having?: ReservaEstoqueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservaEstoqueCountAggregateInputType | true
    _avg?: ReservaEstoqueAvgAggregateInputType
    _sum?: ReservaEstoqueSumAggregateInputType
    _min?: ReservaEstoqueMinAggregateInputType
    _max?: ReservaEstoqueMaxAggregateInputType
  }

  export type ReservaEstoqueGroupByOutputType = {
    id: string
    tenantId: string
    produtoId: string
    pedidoId: string
    quantidade: number
    status: string
    criadoEm: Date
    _count: ReservaEstoqueCountAggregateOutputType | null
    _avg: ReservaEstoqueAvgAggregateOutputType | null
    _sum: ReservaEstoqueSumAggregateOutputType | null
    _min: ReservaEstoqueMinAggregateOutputType | null
    _max: ReservaEstoqueMaxAggregateOutputType | null
  }

  type GetReservaEstoqueGroupByPayload<T extends ReservaEstoqueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservaEstoqueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservaEstoqueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservaEstoqueGroupByOutputType[P]>
            : GetScalarType<T[P], ReservaEstoqueGroupByOutputType[P]>
        }
      >
    >


  export type ReservaEstoqueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    pedidoId?: boolean
    quantidade?: boolean
    status?: boolean
    criadoEm?: boolean
  }, ExtArgs["result"]["reservaEstoque"]>

  export type ReservaEstoqueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    pedidoId?: boolean
    quantidade?: boolean
    status?: boolean
    criadoEm?: boolean
  }, ExtArgs["result"]["reservaEstoque"]>

  export type ReservaEstoqueSelectScalar = {
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    pedidoId?: boolean
    quantidade?: boolean
    status?: boolean
    criadoEm?: boolean
  }


  export type $ReservaEstoquePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReservaEstoque"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      produtoId: string
      pedidoId: string
      quantidade: number
      status: string
      criadoEm: Date
    }, ExtArgs["result"]["reservaEstoque"]>
    composites: {}
  }

  type ReservaEstoqueGetPayload<S extends boolean | null | undefined | ReservaEstoqueDefaultArgs> = $Result.GetResult<Prisma.$ReservaEstoquePayload, S>

  type ReservaEstoqueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReservaEstoqueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReservaEstoqueCountAggregateInputType | true
    }

  export interface ReservaEstoqueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReservaEstoque'], meta: { name: 'ReservaEstoque' } }
    /**
     * Find zero or one ReservaEstoque that matches the filter.
     * @param {ReservaEstoqueFindUniqueArgs} args - Arguments to find a ReservaEstoque
     * @example
     * // Get one ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservaEstoqueFindUniqueArgs>(args: SelectSubset<T, ReservaEstoqueFindUniqueArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReservaEstoque that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReservaEstoqueFindUniqueOrThrowArgs} args - Arguments to find a ReservaEstoque
     * @example
     * // Get one ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservaEstoqueFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservaEstoqueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReservaEstoque that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueFindFirstArgs} args - Arguments to find a ReservaEstoque
     * @example
     * // Get one ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservaEstoqueFindFirstArgs>(args?: SelectSubset<T, ReservaEstoqueFindFirstArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReservaEstoque that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueFindFirstOrThrowArgs} args - Arguments to find a ReservaEstoque
     * @example
     * // Get one ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservaEstoqueFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservaEstoqueFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReservaEstoques that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReservaEstoques
     * const reservaEstoques = await prisma.reservaEstoque.findMany()
     * 
     * // Get first 10 ReservaEstoques
     * const reservaEstoques = await prisma.reservaEstoque.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservaEstoqueWithIdOnly = await prisma.reservaEstoque.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservaEstoqueFindManyArgs>(args?: SelectSubset<T, ReservaEstoqueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReservaEstoque.
     * @param {ReservaEstoqueCreateArgs} args - Arguments to create a ReservaEstoque.
     * @example
     * // Create one ReservaEstoque
     * const ReservaEstoque = await prisma.reservaEstoque.create({
     *   data: {
     *     // ... data to create a ReservaEstoque
     *   }
     * })
     * 
     */
    create<T extends ReservaEstoqueCreateArgs>(args: SelectSubset<T, ReservaEstoqueCreateArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReservaEstoques.
     * @param {ReservaEstoqueCreateManyArgs} args - Arguments to create many ReservaEstoques.
     * @example
     * // Create many ReservaEstoques
     * const reservaEstoque = await prisma.reservaEstoque.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservaEstoqueCreateManyArgs>(args?: SelectSubset<T, ReservaEstoqueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReservaEstoques and returns the data saved in the database.
     * @param {ReservaEstoqueCreateManyAndReturnArgs} args - Arguments to create many ReservaEstoques.
     * @example
     * // Create many ReservaEstoques
     * const reservaEstoque = await prisma.reservaEstoque.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReservaEstoques and only return the `id`
     * const reservaEstoqueWithIdOnly = await prisma.reservaEstoque.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservaEstoqueCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservaEstoqueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReservaEstoque.
     * @param {ReservaEstoqueDeleteArgs} args - Arguments to delete one ReservaEstoque.
     * @example
     * // Delete one ReservaEstoque
     * const ReservaEstoque = await prisma.reservaEstoque.delete({
     *   where: {
     *     // ... filter to delete one ReservaEstoque
     *   }
     * })
     * 
     */
    delete<T extends ReservaEstoqueDeleteArgs>(args: SelectSubset<T, ReservaEstoqueDeleteArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReservaEstoque.
     * @param {ReservaEstoqueUpdateArgs} args - Arguments to update one ReservaEstoque.
     * @example
     * // Update one ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservaEstoqueUpdateArgs>(args: SelectSubset<T, ReservaEstoqueUpdateArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReservaEstoques.
     * @param {ReservaEstoqueDeleteManyArgs} args - Arguments to filter ReservaEstoques to delete.
     * @example
     * // Delete a few ReservaEstoques
     * const { count } = await prisma.reservaEstoque.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservaEstoqueDeleteManyArgs>(args?: SelectSubset<T, ReservaEstoqueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReservaEstoques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReservaEstoques
     * const reservaEstoque = await prisma.reservaEstoque.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservaEstoqueUpdateManyArgs>(args: SelectSubset<T, ReservaEstoqueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReservaEstoque.
     * @param {ReservaEstoqueUpsertArgs} args - Arguments to update or create a ReservaEstoque.
     * @example
     * // Update or create a ReservaEstoque
     * const reservaEstoque = await prisma.reservaEstoque.upsert({
     *   create: {
     *     // ... data to create a ReservaEstoque
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReservaEstoque we want to update
     *   }
     * })
     */
    upsert<T extends ReservaEstoqueUpsertArgs>(args: SelectSubset<T, ReservaEstoqueUpsertArgs<ExtArgs>>): Prisma__ReservaEstoqueClient<$Result.GetResult<Prisma.$ReservaEstoquePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReservaEstoques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueCountArgs} args - Arguments to filter ReservaEstoques to count.
     * @example
     * // Count the number of ReservaEstoques
     * const count = await prisma.reservaEstoque.count({
     *   where: {
     *     // ... the filter for the ReservaEstoques we want to count
     *   }
     * })
    **/
    count<T extends ReservaEstoqueCountArgs>(
      args?: Subset<T, ReservaEstoqueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservaEstoqueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReservaEstoque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReservaEstoqueAggregateArgs>(args: Subset<T, ReservaEstoqueAggregateArgs>): Prisma.PrismaPromise<GetReservaEstoqueAggregateType<T>>

    /**
     * Group by ReservaEstoque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaEstoqueGroupByArgs} args - Group by arguments.
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
      T extends ReservaEstoqueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservaEstoqueGroupByArgs['orderBy'] }
        : { orderBy?: ReservaEstoqueGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReservaEstoqueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservaEstoqueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReservaEstoque model
   */
  readonly fields: ReservaEstoqueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReservaEstoque.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservaEstoqueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ReservaEstoque model
   */ 
  interface ReservaEstoqueFieldRefs {
    readonly id: FieldRef<"ReservaEstoque", 'String'>
    readonly tenantId: FieldRef<"ReservaEstoque", 'String'>
    readonly produtoId: FieldRef<"ReservaEstoque", 'String'>
    readonly pedidoId: FieldRef<"ReservaEstoque", 'String'>
    readonly quantidade: FieldRef<"ReservaEstoque", 'Int'>
    readonly status: FieldRef<"ReservaEstoque", 'String'>
    readonly criadoEm: FieldRef<"ReservaEstoque", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReservaEstoque findUnique
   */
  export type ReservaEstoqueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter, which ReservaEstoque to fetch.
     */
    where: ReservaEstoqueWhereUniqueInput
  }

  /**
   * ReservaEstoque findUniqueOrThrow
   */
  export type ReservaEstoqueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter, which ReservaEstoque to fetch.
     */
    where: ReservaEstoqueWhereUniqueInput
  }

  /**
   * ReservaEstoque findFirst
   */
  export type ReservaEstoqueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter, which ReservaEstoque to fetch.
     */
    where?: ReservaEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservaEstoques to fetch.
     */
    orderBy?: ReservaEstoqueOrderByWithRelationInput | ReservaEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservaEstoques.
     */
    cursor?: ReservaEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservaEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservaEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservaEstoques.
     */
    distinct?: ReservaEstoqueScalarFieldEnum | ReservaEstoqueScalarFieldEnum[]
  }

  /**
   * ReservaEstoque findFirstOrThrow
   */
  export type ReservaEstoqueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter, which ReservaEstoque to fetch.
     */
    where?: ReservaEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservaEstoques to fetch.
     */
    orderBy?: ReservaEstoqueOrderByWithRelationInput | ReservaEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReservaEstoques.
     */
    cursor?: ReservaEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservaEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservaEstoques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReservaEstoques.
     */
    distinct?: ReservaEstoqueScalarFieldEnum | ReservaEstoqueScalarFieldEnum[]
  }

  /**
   * ReservaEstoque findMany
   */
  export type ReservaEstoqueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter, which ReservaEstoques to fetch.
     */
    where?: ReservaEstoqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReservaEstoques to fetch.
     */
    orderBy?: ReservaEstoqueOrderByWithRelationInput | ReservaEstoqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReservaEstoques.
     */
    cursor?: ReservaEstoqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReservaEstoques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReservaEstoques.
     */
    skip?: number
    distinct?: ReservaEstoqueScalarFieldEnum | ReservaEstoqueScalarFieldEnum[]
  }

  /**
   * ReservaEstoque create
   */
  export type ReservaEstoqueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * The data needed to create a ReservaEstoque.
     */
    data: XOR<ReservaEstoqueCreateInput, ReservaEstoqueUncheckedCreateInput>
  }

  /**
   * ReservaEstoque createMany
   */
  export type ReservaEstoqueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReservaEstoques.
     */
    data: ReservaEstoqueCreateManyInput | ReservaEstoqueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReservaEstoque createManyAndReturn
   */
  export type ReservaEstoqueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReservaEstoques.
     */
    data: ReservaEstoqueCreateManyInput | ReservaEstoqueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReservaEstoque update
   */
  export type ReservaEstoqueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * The data needed to update a ReservaEstoque.
     */
    data: XOR<ReservaEstoqueUpdateInput, ReservaEstoqueUncheckedUpdateInput>
    /**
     * Choose, which ReservaEstoque to update.
     */
    where: ReservaEstoqueWhereUniqueInput
  }

  /**
   * ReservaEstoque updateMany
   */
  export type ReservaEstoqueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReservaEstoques.
     */
    data: XOR<ReservaEstoqueUpdateManyMutationInput, ReservaEstoqueUncheckedUpdateManyInput>
    /**
     * Filter which ReservaEstoques to update
     */
    where?: ReservaEstoqueWhereInput
  }

  /**
   * ReservaEstoque upsert
   */
  export type ReservaEstoqueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * The filter to search for the ReservaEstoque to update in case it exists.
     */
    where: ReservaEstoqueWhereUniqueInput
    /**
     * In case the ReservaEstoque found by the `where` argument doesn't exist, create a new ReservaEstoque with this data.
     */
    create: XOR<ReservaEstoqueCreateInput, ReservaEstoqueUncheckedCreateInput>
    /**
     * In case the ReservaEstoque was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservaEstoqueUpdateInput, ReservaEstoqueUncheckedUpdateInput>
  }

  /**
   * ReservaEstoque delete
   */
  export type ReservaEstoqueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
    /**
     * Filter which ReservaEstoque to delete.
     */
    where: ReservaEstoqueWhereUniqueInput
  }

  /**
   * ReservaEstoque deleteMany
   */
  export type ReservaEstoqueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReservaEstoques to delete
     */
    where?: ReservaEstoqueWhereInput
  }

  /**
   * ReservaEstoque without action
   */
  export type ReservaEstoqueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReservaEstoque
     */
    select?: ReservaEstoqueSelect<ExtArgs> | null
  }


  /**
   * Model Movimentacao
   */

  export type AggregateMovimentacao = {
    _count: MovimentacaoCountAggregateOutputType | null
    _avg: MovimentacaoAvgAggregateOutputType | null
    _sum: MovimentacaoSumAggregateOutputType | null
    _min: MovimentacaoMinAggregateOutputType | null
    _max: MovimentacaoMaxAggregateOutputType | null
  }

  export type MovimentacaoAvgAggregateOutputType = {
    quantidade: number | null
    custoUnitario: number | null
  }

  export type MovimentacaoSumAggregateOutputType = {
    quantidade: number | null
    custoUnitario: number | null
  }

  export type MovimentacaoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    depositoId: string | null
    tipo: string | null
    motivo: string | null
    quantidade: number | null
    custoUnitario: number | null
    observacao: string | null
    criadoEm: Date | null
  }

  export type MovimentacaoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    produtoId: string | null
    depositoId: string | null
    tipo: string | null
    motivo: string | null
    quantidade: number | null
    custoUnitario: number | null
    observacao: string | null
    criadoEm: Date | null
  }

  export type MovimentacaoCountAggregateOutputType = {
    id: number
    tenantId: number
    produtoId: number
    depositoId: number
    tipo: number
    motivo: number
    quantidade: number
    custoUnitario: number
    observacao: number
    criadoEm: number
    _all: number
  }


  export type MovimentacaoAvgAggregateInputType = {
    quantidade?: true
    custoUnitario?: true
  }

  export type MovimentacaoSumAggregateInputType = {
    quantidade?: true
    custoUnitario?: true
  }

  export type MovimentacaoMinAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    tipo?: true
    motivo?: true
    quantidade?: true
    custoUnitario?: true
    observacao?: true
    criadoEm?: true
  }

  export type MovimentacaoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    tipo?: true
    motivo?: true
    quantidade?: true
    custoUnitario?: true
    observacao?: true
    criadoEm?: true
  }

  export type MovimentacaoCountAggregateInputType = {
    id?: true
    tenantId?: true
    produtoId?: true
    depositoId?: true
    tipo?: true
    motivo?: true
    quantidade?: true
    custoUnitario?: true
    observacao?: true
    criadoEm?: true
    _all?: true
  }

  export type MovimentacaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimentacao to aggregate.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Movimentacaos
    **/
    _count?: true | MovimentacaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MovimentacaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MovimentacaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MovimentacaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MovimentacaoMaxAggregateInputType
  }

  export type GetMovimentacaoAggregateType<T extends MovimentacaoAggregateArgs> = {
        [P in keyof T & keyof AggregateMovimentacao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMovimentacao[P]>
      : GetScalarType<T[P], AggregateMovimentacao[P]>
  }




  export type MovimentacaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MovimentacaoWhereInput
    orderBy?: MovimentacaoOrderByWithAggregationInput | MovimentacaoOrderByWithAggregationInput[]
    by: MovimentacaoScalarFieldEnum[] | MovimentacaoScalarFieldEnum
    having?: MovimentacaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MovimentacaoCountAggregateInputType | true
    _avg?: MovimentacaoAvgAggregateInputType
    _sum?: MovimentacaoSumAggregateInputType
    _min?: MovimentacaoMinAggregateInputType
    _max?: MovimentacaoMaxAggregateInputType
  }

  export type MovimentacaoGroupByOutputType = {
    id: string
    tenantId: string
    produtoId: string
    depositoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario: number | null
    observacao: string | null
    criadoEm: Date
    _count: MovimentacaoCountAggregateOutputType | null
    _avg: MovimentacaoAvgAggregateOutputType | null
    _sum: MovimentacaoSumAggregateOutputType | null
    _min: MovimentacaoMinAggregateOutputType | null
    _max: MovimentacaoMaxAggregateOutputType | null
  }

  type GetMovimentacaoGroupByPayload<T extends MovimentacaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MovimentacaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MovimentacaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MovimentacaoGroupByOutputType[P]>
            : GetScalarType<T[P], MovimentacaoGroupByOutputType[P]>
        }
      >
    >


  export type MovimentacaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    tipo?: boolean
    motivo?: boolean
    quantidade?: boolean
    custoUnitario?: boolean
    observacao?: boolean
    criadoEm?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimentacao"]>

  export type MovimentacaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    tipo?: boolean
    motivo?: boolean
    quantidade?: boolean
    custoUnitario?: boolean
    observacao?: boolean
    criadoEm?: boolean
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["movimentacao"]>

  export type MovimentacaoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    produtoId?: boolean
    depositoId?: boolean
    tipo?: boolean
    motivo?: boolean
    quantidade?: boolean
    custoUnitario?: boolean
    observacao?: boolean
    criadoEm?: boolean
  }

  export type MovimentacaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }
  export type MovimentacaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deposito?: boolean | DepositoDefaultArgs<ExtArgs>
  }

  export type $MovimentacaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Movimentacao"
    objects: {
      deposito: Prisma.$DepositoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      produtoId: string
      depositoId: string
      tipo: string
      motivo: string
      quantidade: number
      custoUnitario: number | null
      observacao: string | null
      criadoEm: Date
    }, ExtArgs["result"]["movimentacao"]>
    composites: {}
  }

  type MovimentacaoGetPayload<S extends boolean | null | undefined | MovimentacaoDefaultArgs> = $Result.GetResult<Prisma.$MovimentacaoPayload, S>

  type MovimentacaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MovimentacaoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MovimentacaoCountAggregateInputType | true
    }

  export interface MovimentacaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Movimentacao'], meta: { name: 'Movimentacao' } }
    /**
     * Find zero or one Movimentacao that matches the filter.
     * @param {MovimentacaoFindUniqueArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovimentacaoFindUniqueArgs>(args: SelectSubset<T, MovimentacaoFindUniqueArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Movimentacao that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MovimentacaoFindUniqueOrThrowArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovimentacaoFindUniqueOrThrowArgs>(args: SelectSubset<T, MovimentacaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Movimentacao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindFirstArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovimentacaoFindFirstArgs>(args?: SelectSubset<T, MovimentacaoFindFirstArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Movimentacao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindFirstOrThrowArgs} args - Arguments to find a Movimentacao
     * @example
     * // Get one Movimentacao
     * const movimentacao = await prisma.movimentacao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovimentacaoFindFirstOrThrowArgs>(args?: SelectSubset<T, MovimentacaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Movimentacaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Movimentacaos
     * const movimentacaos = await prisma.movimentacao.findMany()
     * 
     * // Get first 10 Movimentacaos
     * const movimentacaos = await prisma.movimentacao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const movimentacaoWithIdOnly = await prisma.movimentacao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MovimentacaoFindManyArgs>(args?: SelectSubset<T, MovimentacaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Movimentacao.
     * @param {MovimentacaoCreateArgs} args - Arguments to create a Movimentacao.
     * @example
     * // Create one Movimentacao
     * const Movimentacao = await prisma.movimentacao.create({
     *   data: {
     *     // ... data to create a Movimentacao
     *   }
     * })
     * 
     */
    create<T extends MovimentacaoCreateArgs>(args: SelectSubset<T, MovimentacaoCreateArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Movimentacaos.
     * @param {MovimentacaoCreateManyArgs} args - Arguments to create many Movimentacaos.
     * @example
     * // Create many Movimentacaos
     * const movimentacao = await prisma.movimentacao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MovimentacaoCreateManyArgs>(args?: SelectSubset<T, MovimentacaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Movimentacaos and returns the data saved in the database.
     * @param {MovimentacaoCreateManyAndReturnArgs} args - Arguments to create many Movimentacaos.
     * @example
     * // Create many Movimentacaos
     * const movimentacao = await prisma.movimentacao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Movimentacaos and only return the `id`
     * const movimentacaoWithIdOnly = await prisma.movimentacao.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MovimentacaoCreateManyAndReturnArgs>(args?: SelectSubset<T, MovimentacaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Movimentacao.
     * @param {MovimentacaoDeleteArgs} args - Arguments to delete one Movimentacao.
     * @example
     * // Delete one Movimentacao
     * const Movimentacao = await prisma.movimentacao.delete({
     *   where: {
     *     // ... filter to delete one Movimentacao
     *   }
     * })
     * 
     */
    delete<T extends MovimentacaoDeleteArgs>(args: SelectSubset<T, MovimentacaoDeleteArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Movimentacao.
     * @param {MovimentacaoUpdateArgs} args - Arguments to update one Movimentacao.
     * @example
     * // Update one Movimentacao
     * const movimentacao = await prisma.movimentacao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MovimentacaoUpdateArgs>(args: SelectSubset<T, MovimentacaoUpdateArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Movimentacaos.
     * @param {MovimentacaoDeleteManyArgs} args - Arguments to filter Movimentacaos to delete.
     * @example
     * // Delete a few Movimentacaos
     * const { count } = await prisma.movimentacao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MovimentacaoDeleteManyArgs>(args?: SelectSubset<T, MovimentacaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Movimentacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Movimentacaos
     * const movimentacao = await prisma.movimentacao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MovimentacaoUpdateManyArgs>(args: SelectSubset<T, MovimentacaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Movimentacao.
     * @param {MovimentacaoUpsertArgs} args - Arguments to update or create a Movimentacao.
     * @example
     * // Update or create a Movimentacao
     * const movimentacao = await prisma.movimentacao.upsert({
     *   create: {
     *     // ... data to create a Movimentacao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Movimentacao we want to update
     *   }
     * })
     */
    upsert<T extends MovimentacaoUpsertArgs>(args: SelectSubset<T, MovimentacaoUpsertArgs<ExtArgs>>): Prisma__MovimentacaoClient<$Result.GetResult<Prisma.$MovimentacaoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Movimentacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoCountArgs} args - Arguments to filter Movimentacaos to count.
     * @example
     * // Count the number of Movimentacaos
     * const count = await prisma.movimentacao.count({
     *   where: {
     *     // ... the filter for the Movimentacaos we want to count
     *   }
     * })
    **/
    count<T extends MovimentacaoCountArgs>(
      args?: Subset<T, MovimentacaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MovimentacaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Movimentacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MovimentacaoAggregateArgs>(args: Subset<T, MovimentacaoAggregateArgs>): Prisma.PrismaPromise<GetMovimentacaoAggregateType<T>>

    /**
     * Group by Movimentacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovimentacaoGroupByArgs} args - Group by arguments.
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
      T extends MovimentacaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MovimentacaoGroupByArgs['orderBy'] }
        : { orderBy?: MovimentacaoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MovimentacaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovimentacaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Movimentacao model
   */
  readonly fields: MovimentacaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Movimentacao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MovimentacaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deposito<T extends DepositoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepositoDefaultArgs<ExtArgs>>): Prisma__DepositoClient<$Result.GetResult<Prisma.$DepositoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Movimentacao model
   */ 
  interface MovimentacaoFieldRefs {
    readonly id: FieldRef<"Movimentacao", 'String'>
    readonly tenantId: FieldRef<"Movimentacao", 'String'>
    readonly produtoId: FieldRef<"Movimentacao", 'String'>
    readonly depositoId: FieldRef<"Movimentacao", 'String'>
    readonly tipo: FieldRef<"Movimentacao", 'String'>
    readonly motivo: FieldRef<"Movimentacao", 'String'>
    readonly quantidade: FieldRef<"Movimentacao", 'Int'>
    readonly custoUnitario: FieldRef<"Movimentacao", 'Int'>
    readonly observacao: FieldRef<"Movimentacao", 'String'>
    readonly criadoEm: FieldRef<"Movimentacao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Movimentacao findUnique
   */
  export type MovimentacaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao findUniqueOrThrow
   */
  export type MovimentacaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao findFirst
   */
  export type MovimentacaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimentacaos.
     */
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao findFirstOrThrow
   */
  export type MovimentacaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacao to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Movimentacaos.
     */
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao findMany
   */
  export type MovimentacaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter, which Movimentacaos to fetch.
     */
    where?: MovimentacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Movimentacaos to fetch.
     */
    orderBy?: MovimentacaoOrderByWithRelationInput | MovimentacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Movimentacaos.
     */
    cursor?: MovimentacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Movimentacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Movimentacaos.
     */
    skip?: number
    distinct?: MovimentacaoScalarFieldEnum | MovimentacaoScalarFieldEnum[]
  }

  /**
   * Movimentacao create
   */
  export type MovimentacaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The data needed to create a Movimentacao.
     */
    data: XOR<MovimentacaoCreateInput, MovimentacaoUncheckedCreateInput>
  }

  /**
   * Movimentacao createMany
   */
  export type MovimentacaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Movimentacaos.
     */
    data: MovimentacaoCreateManyInput | MovimentacaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Movimentacao createManyAndReturn
   */
  export type MovimentacaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Movimentacaos.
     */
    data: MovimentacaoCreateManyInput | MovimentacaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Movimentacao update
   */
  export type MovimentacaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The data needed to update a Movimentacao.
     */
    data: XOR<MovimentacaoUpdateInput, MovimentacaoUncheckedUpdateInput>
    /**
     * Choose, which Movimentacao to update.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao updateMany
   */
  export type MovimentacaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Movimentacaos.
     */
    data: XOR<MovimentacaoUpdateManyMutationInput, MovimentacaoUncheckedUpdateManyInput>
    /**
     * Filter which Movimentacaos to update
     */
    where?: MovimentacaoWhereInput
  }

  /**
   * Movimentacao upsert
   */
  export type MovimentacaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * The filter to search for the Movimentacao to update in case it exists.
     */
    where: MovimentacaoWhereUniqueInput
    /**
     * In case the Movimentacao found by the `where` argument doesn't exist, create a new Movimentacao with this data.
     */
    create: XOR<MovimentacaoCreateInput, MovimentacaoUncheckedCreateInput>
    /**
     * In case the Movimentacao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MovimentacaoUpdateInput, MovimentacaoUncheckedUpdateInput>
  }

  /**
   * Movimentacao delete
   */
  export type MovimentacaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
    /**
     * Filter which Movimentacao to delete.
     */
    where: MovimentacaoWhereUniqueInput
  }

  /**
   * Movimentacao deleteMany
   */
  export type MovimentacaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Movimentacaos to delete
     */
    where?: MovimentacaoWhereInput
  }

  /**
   * Movimentacao without action
   */
  export type MovimentacaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Movimentacao
     */
    select?: MovimentacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MovimentacaoInclude<ExtArgs> | null
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


  export const DepositoScalarFieldEnum: {
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

  export type DepositoScalarFieldEnum = (typeof DepositoScalarFieldEnum)[keyof typeof DepositoScalarFieldEnum]


  export const SaldoEstoqueScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    produtoId: 'produtoId',
    depositoId: 'depositoId',
    quantidadeFisica: 'quantidadeFisica',
    reservado: 'reservado',
    estoqueMinimo: 'estoqueMinimo',
    atualizadoEm: 'atualizadoEm'
  };

  export type SaldoEstoqueScalarFieldEnum = (typeof SaldoEstoqueScalarFieldEnum)[keyof typeof SaldoEstoqueScalarFieldEnum]


  export const ReservaEstoqueScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    produtoId: 'produtoId',
    pedidoId: 'pedidoId',
    quantidade: 'quantidade',
    status: 'status',
    criadoEm: 'criadoEm'
  };

  export type ReservaEstoqueScalarFieldEnum = (typeof ReservaEstoqueScalarFieldEnum)[keyof typeof ReservaEstoqueScalarFieldEnum]


  export const MovimentacaoScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    produtoId: 'produtoId',
    depositoId: 'depositoId',
    tipo: 'tipo',
    motivo: 'motivo',
    quantidade: 'quantidade',
    custoUnitario: 'custoUnitario',
    observacao: 'observacao',
    criadoEm: 'criadoEm'
  };

  export type MovimentacaoScalarFieldEnum = (typeof MovimentacaoScalarFieldEnum)[keyof typeof MovimentacaoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type DepositoWhereInput = {
    AND?: DepositoWhereInput | DepositoWhereInput[]
    OR?: DepositoWhereInput[]
    NOT?: DepositoWhereInput | DepositoWhereInput[]
    id?: UuidFilter<"Deposito"> | string
    tenantId?: UuidFilter<"Deposito"> | string
    nome?: StringFilter<"Deposito"> | string
    endereco?: StringNullableFilter<"Deposito"> | string | null
    cidade?: StringNullableFilter<"Deposito"> | string | null
    estado?: StringNullableFilter<"Deposito"> | string | null
    padrao?: BoolFilter<"Deposito"> | boolean
    ativo?: BoolFilter<"Deposito"> | boolean
    criadoEm?: DateTimeFilter<"Deposito"> | Date | string
    atualizadoEm?: DateTimeFilter<"Deposito"> | Date | string
    saldos?: SaldoEstoqueListRelationFilter
    movimentacoes?: MovimentacaoListRelationFilter
  }

  export type DepositoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    endereco?: SortOrderInput | SortOrder
    cidade?: SortOrderInput | SortOrder
    estado?: SortOrderInput | SortOrder
    padrao?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    saldos?: SaldoEstoqueOrderByRelationAggregateInput
    movimentacoes?: MovimentacaoOrderByRelationAggregateInput
  }

  export type DepositoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DepositoWhereInput | DepositoWhereInput[]
    OR?: DepositoWhereInput[]
    NOT?: DepositoWhereInput | DepositoWhereInput[]
    tenantId?: UuidFilter<"Deposito"> | string
    nome?: StringFilter<"Deposito"> | string
    endereco?: StringNullableFilter<"Deposito"> | string | null
    cidade?: StringNullableFilter<"Deposito"> | string | null
    estado?: StringNullableFilter<"Deposito"> | string | null
    padrao?: BoolFilter<"Deposito"> | boolean
    ativo?: BoolFilter<"Deposito"> | boolean
    criadoEm?: DateTimeFilter<"Deposito"> | Date | string
    atualizadoEm?: DateTimeFilter<"Deposito"> | Date | string
    saldos?: SaldoEstoqueListRelationFilter
    movimentacoes?: MovimentacaoListRelationFilter
  }, "id">

  export type DepositoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    endereco?: SortOrderInput | SortOrder
    cidade?: SortOrderInput | SortOrder
    estado?: SortOrderInput | SortOrder
    padrao?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: DepositoCountOrderByAggregateInput
    _max?: DepositoMaxOrderByAggregateInput
    _min?: DepositoMinOrderByAggregateInput
  }

  export type DepositoScalarWhereWithAggregatesInput = {
    AND?: DepositoScalarWhereWithAggregatesInput | DepositoScalarWhereWithAggregatesInput[]
    OR?: DepositoScalarWhereWithAggregatesInput[]
    NOT?: DepositoScalarWhereWithAggregatesInput | DepositoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Deposito"> | string
    tenantId?: UuidWithAggregatesFilter<"Deposito"> | string
    nome?: StringWithAggregatesFilter<"Deposito"> | string
    endereco?: StringNullableWithAggregatesFilter<"Deposito"> | string | null
    cidade?: StringNullableWithAggregatesFilter<"Deposito"> | string | null
    estado?: StringNullableWithAggregatesFilter<"Deposito"> | string | null
    padrao?: BoolWithAggregatesFilter<"Deposito"> | boolean
    ativo?: BoolWithAggregatesFilter<"Deposito"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"Deposito"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Deposito"> | Date | string
  }

  export type SaldoEstoqueWhereInput = {
    AND?: SaldoEstoqueWhereInput | SaldoEstoqueWhereInput[]
    OR?: SaldoEstoqueWhereInput[]
    NOT?: SaldoEstoqueWhereInput | SaldoEstoqueWhereInput[]
    id?: UuidFilter<"SaldoEstoque"> | string
    tenantId?: UuidFilter<"SaldoEstoque"> | string
    produtoId?: UuidFilter<"SaldoEstoque"> | string
    depositoId?: UuidFilter<"SaldoEstoque"> | string
    quantidadeFisica?: IntFilter<"SaldoEstoque"> | number
    reservado?: IntFilter<"SaldoEstoque"> | number
    estoqueMinimo?: IntFilter<"SaldoEstoque"> | number
    atualizadoEm?: DateTimeFilter<"SaldoEstoque"> | Date | string
    deposito?: XOR<DepositoRelationFilter, DepositoWhereInput>
  }

  export type SaldoEstoqueOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
    atualizadoEm?: SortOrder
    deposito?: DepositoOrderByWithRelationInput
  }

  export type SaldoEstoqueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_produtoId_depositoId?: SaldoEstoqueTenantId_produtoId_depositoIdCompoundUniqueInput
    AND?: SaldoEstoqueWhereInput | SaldoEstoqueWhereInput[]
    OR?: SaldoEstoqueWhereInput[]
    NOT?: SaldoEstoqueWhereInput | SaldoEstoqueWhereInput[]
    tenantId?: UuidFilter<"SaldoEstoque"> | string
    produtoId?: UuidFilter<"SaldoEstoque"> | string
    depositoId?: UuidFilter<"SaldoEstoque"> | string
    quantidadeFisica?: IntFilter<"SaldoEstoque"> | number
    reservado?: IntFilter<"SaldoEstoque"> | number
    estoqueMinimo?: IntFilter<"SaldoEstoque"> | number
    atualizadoEm?: DateTimeFilter<"SaldoEstoque"> | Date | string
    deposito?: XOR<DepositoRelationFilter, DepositoWhereInput>
  }, "id" | "tenantId_produtoId_depositoId">

  export type SaldoEstoqueOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
    atualizadoEm?: SortOrder
    _count?: SaldoEstoqueCountOrderByAggregateInput
    _avg?: SaldoEstoqueAvgOrderByAggregateInput
    _max?: SaldoEstoqueMaxOrderByAggregateInput
    _min?: SaldoEstoqueMinOrderByAggregateInput
    _sum?: SaldoEstoqueSumOrderByAggregateInput
  }

  export type SaldoEstoqueScalarWhereWithAggregatesInput = {
    AND?: SaldoEstoqueScalarWhereWithAggregatesInput | SaldoEstoqueScalarWhereWithAggregatesInput[]
    OR?: SaldoEstoqueScalarWhereWithAggregatesInput[]
    NOT?: SaldoEstoqueScalarWhereWithAggregatesInput | SaldoEstoqueScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SaldoEstoque"> | string
    tenantId?: UuidWithAggregatesFilter<"SaldoEstoque"> | string
    produtoId?: UuidWithAggregatesFilter<"SaldoEstoque"> | string
    depositoId?: UuidWithAggregatesFilter<"SaldoEstoque"> | string
    quantidadeFisica?: IntWithAggregatesFilter<"SaldoEstoque"> | number
    reservado?: IntWithAggregatesFilter<"SaldoEstoque"> | number
    estoqueMinimo?: IntWithAggregatesFilter<"SaldoEstoque"> | number
    atualizadoEm?: DateTimeWithAggregatesFilter<"SaldoEstoque"> | Date | string
  }

  export type ReservaEstoqueWhereInput = {
    AND?: ReservaEstoqueWhereInput | ReservaEstoqueWhereInput[]
    OR?: ReservaEstoqueWhereInput[]
    NOT?: ReservaEstoqueWhereInput | ReservaEstoqueWhereInput[]
    id?: UuidFilter<"ReservaEstoque"> | string
    tenantId?: UuidFilter<"ReservaEstoque"> | string
    produtoId?: UuidFilter<"ReservaEstoque"> | string
    pedidoId?: UuidFilter<"ReservaEstoque"> | string
    quantidade?: IntFilter<"ReservaEstoque"> | number
    status?: StringFilter<"ReservaEstoque"> | string
    criadoEm?: DateTimeFilter<"ReservaEstoque"> | Date | string
  }

  export type ReservaEstoqueOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    pedidoId?: SortOrder
    quantidade?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
  }

  export type ReservaEstoqueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReservaEstoqueWhereInput | ReservaEstoqueWhereInput[]
    OR?: ReservaEstoqueWhereInput[]
    NOT?: ReservaEstoqueWhereInput | ReservaEstoqueWhereInput[]
    tenantId?: UuidFilter<"ReservaEstoque"> | string
    produtoId?: UuidFilter<"ReservaEstoque"> | string
    pedidoId?: UuidFilter<"ReservaEstoque"> | string
    quantidade?: IntFilter<"ReservaEstoque"> | number
    status?: StringFilter<"ReservaEstoque"> | string
    criadoEm?: DateTimeFilter<"ReservaEstoque"> | Date | string
  }, "id">

  export type ReservaEstoqueOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    pedidoId?: SortOrder
    quantidade?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
    _count?: ReservaEstoqueCountOrderByAggregateInput
    _avg?: ReservaEstoqueAvgOrderByAggregateInput
    _max?: ReservaEstoqueMaxOrderByAggregateInput
    _min?: ReservaEstoqueMinOrderByAggregateInput
    _sum?: ReservaEstoqueSumOrderByAggregateInput
  }

  export type ReservaEstoqueScalarWhereWithAggregatesInput = {
    AND?: ReservaEstoqueScalarWhereWithAggregatesInput | ReservaEstoqueScalarWhereWithAggregatesInput[]
    OR?: ReservaEstoqueScalarWhereWithAggregatesInput[]
    NOT?: ReservaEstoqueScalarWhereWithAggregatesInput | ReservaEstoqueScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReservaEstoque"> | string
    tenantId?: UuidWithAggregatesFilter<"ReservaEstoque"> | string
    produtoId?: UuidWithAggregatesFilter<"ReservaEstoque"> | string
    pedidoId?: UuidWithAggregatesFilter<"ReservaEstoque"> | string
    quantidade?: IntWithAggregatesFilter<"ReservaEstoque"> | number
    status?: StringWithAggregatesFilter<"ReservaEstoque"> | string
    criadoEm?: DateTimeWithAggregatesFilter<"ReservaEstoque"> | Date | string
  }

  export type MovimentacaoWhereInput = {
    AND?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    OR?: MovimentacaoWhereInput[]
    NOT?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    id?: UuidFilter<"Movimentacao"> | string
    tenantId?: UuidFilter<"Movimentacao"> | string
    produtoId?: UuidFilter<"Movimentacao"> | string
    depositoId?: UuidFilter<"Movimentacao"> | string
    tipo?: StringFilter<"Movimentacao"> | string
    motivo?: StringFilter<"Movimentacao"> | string
    quantidade?: IntFilter<"Movimentacao"> | number
    custoUnitario?: IntNullableFilter<"Movimentacao"> | number | null
    observacao?: StringNullableFilter<"Movimentacao"> | string | null
    criadoEm?: DateTimeFilter<"Movimentacao"> | Date | string
    deposito?: XOR<DepositoRelationFilter, DepositoWhereInput>
  }

  export type MovimentacaoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    tipo?: SortOrder
    motivo?: SortOrder
    quantidade?: SortOrder
    custoUnitario?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    deposito?: DepositoOrderByWithRelationInput
  }

  export type MovimentacaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    OR?: MovimentacaoWhereInput[]
    NOT?: MovimentacaoWhereInput | MovimentacaoWhereInput[]
    tenantId?: UuidFilter<"Movimentacao"> | string
    produtoId?: UuidFilter<"Movimentacao"> | string
    depositoId?: UuidFilter<"Movimentacao"> | string
    tipo?: StringFilter<"Movimentacao"> | string
    motivo?: StringFilter<"Movimentacao"> | string
    quantidade?: IntFilter<"Movimentacao"> | number
    custoUnitario?: IntNullableFilter<"Movimentacao"> | number | null
    observacao?: StringNullableFilter<"Movimentacao"> | string | null
    criadoEm?: DateTimeFilter<"Movimentacao"> | Date | string
    deposito?: XOR<DepositoRelationFilter, DepositoWhereInput>
  }, "id">

  export type MovimentacaoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    tipo?: SortOrder
    motivo?: SortOrder
    quantidade?: SortOrder
    custoUnitario?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: MovimentacaoCountOrderByAggregateInput
    _avg?: MovimentacaoAvgOrderByAggregateInput
    _max?: MovimentacaoMaxOrderByAggregateInput
    _min?: MovimentacaoMinOrderByAggregateInput
    _sum?: MovimentacaoSumOrderByAggregateInput
  }

  export type MovimentacaoScalarWhereWithAggregatesInput = {
    AND?: MovimentacaoScalarWhereWithAggregatesInput | MovimentacaoScalarWhereWithAggregatesInput[]
    OR?: MovimentacaoScalarWhereWithAggregatesInput[]
    NOT?: MovimentacaoScalarWhereWithAggregatesInput | MovimentacaoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Movimentacao"> | string
    tenantId?: UuidWithAggregatesFilter<"Movimentacao"> | string
    produtoId?: UuidWithAggregatesFilter<"Movimentacao"> | string
    depositoId?: UuidWithAggregatesFilter<"Movimentacao"> | string
    tipo?: StringWithAggregatesFilter<"Movimentacao"> | string
    motivo?: StringWithAggregatesFilter<"Movimentacao"> | string
    quantidade?: IntWithAggregatesFilter<"Movimentacao"> | number
    custoUnitario?: IntNullableWithAggregatesFilter<"Movimentacao"> | number | null
    observacao?: StringNullableWithAggregatesFilter<"Movimentacao"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Movimentacao"> | Date | string
  }

  export type DepositoCreateInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    saldos?: SaldoEstoqueCreateNestedManyWithoutDepositoInput
    movimentacoes?: MovimentacaoCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    saldos?: SaldoEstoqueUncheckedCreateNestedManyWithoutDepositoInput
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    saldos?: SaldoEstoqueUpdateManyWithoutDepositoNestedInput
    movimentacoes?: MovimentacaoUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    saldos?: SaldoEstoqueUncheckedUpdateManyWithoutDepositoNestedInput
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type DepositoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepositoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaldoEstoqueCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
    deposito: DepositoCreateNestedOneWithoutSaldosInput
  }

  export type SaldoEstoqueUncheckedCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    depositoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
  }

  export type SaldoEstoqueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    deposito?: DepositoUpdateOneRequiredWithoutSaldosNestedInput
  }

  export type SaldoEstoqueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    depositoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaldoEstoqueCreateManyInput = {
    id?: string
    tenantId: string
    produtoId: string
    depositoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
  }

  export type SaldoEstoqueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaldoEstoqueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    depositoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaEstoqueCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    pedidoId: string
    quantidade: number
    status?: string
    criadoEm?: Date | string
  }

  export type ReservaEstoqueUncheckedCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    pedidoId: string
    quantidade: number
    status?: string
    criadoEm?: Date | string
  }

  export type ReservaEstoqueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaEstoqueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaEstoqueCreateManyInput = {
    id?: string
    tenantId: string
    produtoId: string
    pedidoId: string
    quantidade: number
    status?: string
    criadoEm?: Date | string
  }

  export type ReservaEstoqueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReservaEstoqueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
    deposito: DepositoCreateNestedOneWithoutMovimentacoesInput
  }

  export type MovimentacaoUncheckedCreateInput = {
    id?: string
    tenantId: string
    produtoId: string
    depositoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
  }

  export type MovimentacaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    deposito?: DepositoUpdateOneRequiredWithoutMovimentacoesNestedInput
  }

  export type MovimentacaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    depositoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoCreateManyInput = {
    id?: string
    tenantId: string
    produtoId: string
    depositoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
  }

  export type MovimentacaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    depositoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SaldoEstoqueListRelationFilter = {
    every?: SaldoEstoqueWhereInput
    some?: SaldoEstoqueWhereInput
    none?: SaldoEstoqueWhereInput
  }

  export type MovimentacaoListRelationFilter = {
    every?: MovimentacaoWhereInput
    some?: MovimentacaoWhereInput
    none?: MovimentacaoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SaldoEstoqueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MovimentacaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepositoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    endereco?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    padrao?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type DepositoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    endereco?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    padrao?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type DepositoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    endereco?: SortOrder
    cidade?: SortOrder
    estado?: SortOrder
    padrao?: SortOrder
    ativo?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
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

  export type DepositoRelationFilter = {
    is?: DepositoWhereInput
    isNot?: DepositoWhereInput
  }

  export type SaldoEstoqueTenantId_produtoId_depositoIdCompoundUniqueInput = {
    tenantId: string
    produtoId: string
    depositoId: string
  }

  export type SaldoEstoqueCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SaldoEstoqueAvgOrderByAggregateInput = {
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
  }

  export type SaldoEstoqueMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SaldoEstoqueMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type SaldoEstoqueSumOrderByAggregateInput = {
    quantidadeFisica?: SortOrder
    reservado?: SortOrder
    estoqueMinimo?: SortOrder
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

  export type ReservaEstoqueCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    pedidoId?: SortOrder
    quantidade?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
  }

  export type ReservaEstoqueAvgOrderByAggregateInput = {
    quantidade?: SortOrder
  }

  export type ReservaEstoqueMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    pedidoId?: SortOrder
    quantidade?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
  }

  export type ReservaEstoqueMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    pedidoId?: SortOrder
    quantidade?: SortOrder
    status?: SortOrder
    criadoEm?: SortOrder
  }

  export type ReservaEstoqueSumOrderByAggregateInput = {
    quantidade?: SortOrder
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

  export type MovimentacaoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    tipo?: SortOrder
    motivo?: SortOrder
    quantidade?: SortOrder
    custoUnitario?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
  }

  export type MovimentacaoAvgOrderByAggregateInput = {
    quantidade?: SortOrder
    custoUnitario?: SortOrder
  }

  export type MovimentacaoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    tipo?: SortOrder
    motivo?: SortOrder
    quantidade?: SortOrder
    custoUnitario?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
  }

  export type MovimentacaoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    produtoId?: SortOrder
    depositoId?: SortOrder
    tipo?: SortOrder
    motivo?: SortOrder
    quantidade?: SortOrder
    custoUnitario?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
  }

  export type MovimentacaoSumOrderByAggregateInput = {
    quantidade?: SortOrder
    custoUnitario?: SortOrder
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

  export type SaldoEstoqueCreateNestedManyWithoutDepositoInput = {
    create?: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput> | SaldoEstoqueCreateWithoutDepositoInput[] | SaldoEstoqueUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: SaldoEstoqueCreateOrConnectWithoutDepositoInput | SaldoEstoqueCreateOrConnectWithoutDepositoInput[]
    createMany?: SaldoEstoqueCreateManyDepositoInputEnvelope
    connect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
  }

  export type MovimentacaoCreateNestedManyWithoutDepositoInput = {
    create?: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput> | MovimentacaoCreateWithoutDepositoInput[] | MovimentacaoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutDepositoInput | MovimentacaoCreateOrConnectWithoutDepositoInput[]
    createMany?: MovimentacaoCreateManyDepositoInputEnvelope
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
  }

  export type SaldoEstoqueUncheckedCreateNestedManyWithoutDepositoInput = {
    create?: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput> | SaldoEstoqueCreateWithoutDepositoInput[] | SaldoEstoqueUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: SaldoEstoqueCreateOrConnectWithoutDepositoInput | SaldoEstoqueCreateOrConnectWithoutDepositoInput[]
    createMany?: SaldoEstoqueCreateManyDepositoInputEnvelope
    connect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
  }

  export type MovimentacaoUncheckedCreateNestedManyWithoutDepositoInput = {
    create?: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput> | MovimentacaoCreateWithoutDepositoInput[] | MovimentacaoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutDepositoInput | MovimentacaoCreateOrConnectWithoutDepositoInput[]
    createMany?: MovimentacaoCreateManyDepositoInputEnvelope
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SaldoEstoqueUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput> | SaldoEstoqueCreateWithoutDepositoInput[] | SaldoEstoqueUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: SaldoEstoqueCreateOrConnectWithoutDepositoInput | SaldoEstoqueCreateOrConnectWithoutDepositoInput[]
    upsert?: SaldoEstoqueUpsertWithWhereUniqueWithoutDepositoInput | SaldoEstoqueUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: SaldoEstoqueCreateManyDepositoInputEnvelope
    set?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    disconnect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    delete?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    connect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    update?: SaldoEstoqueUpdateWithWhereUniqueWithoutDepositoInput | SaldoEstoqueUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: SaldoEstoqueUpdateManyWithWhereWithoutDepositoInput | SaldoEstoqueUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: SaldoEstoqueScalarWhereInput | SaldoEstoqueScalarWhereInput[]
  }

  export type MovimentacaoUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput> | MovimentacaoCreateWithoutDepositoInput[] | MovimentacaoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutDepositoInput | MovimentacaoCreateOrConnectWithoutDepositoInput[]
    upsert?: MovimentacaoUpsertWithWhereUniqueWithoutDepositoInput | MovimentacaoUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: MovimentacaoCreateManyDepositoInputEnvelope
    set?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    disconnect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    delete?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    update?: MovimentacaoUpdateWithWhereUniqueWithoutDepositoInput | MovimentacaoUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: MovimentacaoUpdateManyWithWhereWithoutDepositoInput | MovimentacaoUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
  }

  export type SaldoEstoqueUncheckedUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput> | SaldoEstoqueCreateWithoutDepositoInput[] | SaldoEstoqueUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: SaldoEstoqueCreateOrConnectWithoutDepositoInput | SaldoEstoqueCreateOrConnectWithoutDepositoInput[]
    upsert?: SaldoEstoqueUpsertWithWhereUniqueWithoutDepositoInput | SaldoEstoqueUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: SaldoEstoqueCreateManyDepositoInputEnvelope
    set?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    disconnect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    delete?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    connect?: SaldoEstoqueWhereUniqueInput | SaldoEstoqueWhereUniqueInput[]
    update?: SaldoEstoqueUpdateWithWhereUniqueWithoutDepositoInput | SaldoEstoqueUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: SaldoEstoqueUpdateManyWithWhereWithoutDepositoInput | SaldoEstoqueUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: SaldoEstoqueScalarWhereInput | SaldoEstoqueScalarWhereInput[]
  }

  export type MovimentacaoUncheckedUpdateManyWithoutDepositoNestedInput = {
    create?: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput> | MovimentacaoCreateWithoutDepositoInput[] | MovimentacaoUncheckedCreateWithoutDepositoInput[]
    connectOrCreate?: MovimentacaoCreateOrConnectWithoutDepositoInput | MovimentacaoCreateOrConnectWithoutDepositoInput[]
    upsert?: MovimentacaoUpsertWithWhereUniqueWithoutDepositoInput | MovimentacaoUpsertWithWhereUniqueWithoutDepositoInput[]
    createMany?: MovimentacaoCreateManyDepositoInputEnvelope
    set?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    disconnect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    delete?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    connect?: MovimentacaoWhereUniqueInput | MovimentacaoWhereUniqueInput[]
    update?: MovimentacaoUpdateWithWhereUniqueWithoutDepositoInput | MovimentacaoUpdateWithWhereUniqueWithoutDepositoInput[]
    updateMany?: MovimentacaoUpdateManyWithWhereWithoutDepositoInput | MovimentacaoUpdateManyWithWhereWithoutDepositoInput[]
    deleteMany?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
  }

  export type DepositoCreateNestedOneWithoutSaldosInput = {
    create?: XOR<DepositoCreateWithoutSaldosInput, DepositoUncheckedCreateWithoutSaldosInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutSaldosInput
    connect?: DepositoWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DepositoUpdateOneRequiredWithoutSaldosNestedInput = {
    create?: XOR<DepositoCreateWithoutSaldosInput, DepositoUncheckedCreateWithoutSaldosInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutSaldosInput
    upsert?: DepositoUpsertWithoutSaldosInput
    connect?: DepositoWhereUniqueInput
    update?: XOR<XOR<DepositoUpdateToOneWithWhereWithoutSaldosInput, DepositoUpdateWithoutSaldosInput>, DepositoUncheckedUpdateWithoutSaldosInput>
  }

  export type DepositoCreateNestedOneWithoutMovimentacoesInput = {
    create?: XOR<DepositoCreateWithoutMovimentacoesInput, DepositoUncheckedCreateWithoutMovimentacoesInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutMovimentacoesInput
    connect?: DepositoWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DepositoUpdateOneRequiredWithoutMovimentacoesNestedInput = {
    create?: XOR<DepositoCreateWithoutMovimentacoesInput, DepositoUncheckedCreateWithoutMovimentacoesInput>
    connectOrCreate?: DepositoCreateOrConnectWithoutMovimentacoesInput
    upsert?: DepositoUpsertWithoutMovimentacoesInput
    connect?: DepositoWhereUniqueInput
    update?: XOR<XOR<DepositoUpdateToOneWithWhereWithoutMovimentacoesInput, DepositoUpdateWithoutMovimentacoesInput>, DepositoUncheckedUpdateWithoutMovimentacoesInput>
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

  export type SaldoEstoqueCreateWithoutDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
  }

  export type SaldoEstoqueUncheckedCreateWithoutDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
  }

  export type SaldoEstoqueCreateOrConnectWithoutDepositoInput = {
    where: SaldoEstoqueWhereUniqueInput
    create: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput>
  }

  export type SaldoEstoqueCreateManyDepositoInputEnvelope = {
    data: SaldoEstoqueCreateManyDepositoInput | SaldoEstoqueCreateManyDepositoInput[]
    skipDuplicates?: boolean
  }

  export type MovimentacaoCreateWithoutDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
  }

  export type MovimentacaoUncheckedCreateWithoutDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
  }

  export type MovimentacaoCreateOrConnectWithoutDepositoInput = {
    where: MovimentacaoWhereUniqueInput
    create: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput>
  }

  export type MovimentacaoCreateManyDepositoInputEnvelope = {
    data: MovimentacaoCreateManyDepositoInput | MovimentacaoCreateManyDepositoInput[]
    skipDuplicates?: boolean
  }

  export type SaldoEstoqueUpsertWithWhereUniqueWithoutDepositoInput = {
    where: SaldoEstoqueWhereUniqueInput
    update: XOR<SaldoEstoqueUpdateWithoutDepositoInput, SaldoEstoqueUncheckedUpdateWithoutDepositoInput>
    create: XOR<SaldoEstoqueCreateWithoutDepositoInput, SaldoEstoqueUncheckedCreateWithoutDepositoInput>
  }

  export type SaldoEstoqueUpdateWithWhereUniqueWithoutDepositoInput = {
    where: SaldoEstoqueWhereUniqueInput
    data: XOR<SaldoEstoqueUpdateWithoutDepositoInput, SaldoEstoqueUncheckedUpdateWithoutDepositoInput>
  }

  export type SaldoEstoqueUpdateManyWithWhereWithoutDepositoInput = {
    where: SaldoEstoqueScalarWhereInput
    data: XOR<SaldoEstoqueUpdateManyMutationInput, SaldoEstoqueUncheckedUpdateManyWithoutDepositoInput>
  }

  export type SaldoEstoqueScalarWhereInput = {
    AND?: SaldoEstoqueScalarWhereInput | SaldoEstoqueScalarWhereInput[]
    OR?: SaldoEstoqueScalarWhereInput[]
    NOT?: SaldoEstoqueScalarWhereInput | SaldoEstoqueScalarWhereInput[]
    id?: UuidFilter<"SaldoEstoque"> | string
    tenantId?: UuidFilter<"SaldoEstoque"> | string
    produtoId?: UuidFilter<"SaldoEstoque"> | string
    depositoId?: UuidFilter<"SaldoEstoque"> | string
    quantidadeFisica?: IntFilter<"SaldoEstoque"> | number
    reservado?: IntFilter<"SaldoEstoque"> | number
    estoqueMinimo?: IntFilter<"SaldoEstoque"> | number
    atualizadoEm?: DateTimeFilter<"SaldoEstoque"> | Date | string
  }

  export type MovimentacaoUpsertWithWhereUniqueWithoutDepositoInput = {
    where: MovimentacaoWhereUniqueInput
    update: XOR<MovimentacaoUpdateWithoutDepositoInput, MovimentacaoUncheckedUpdateWithoutDepositoInput>
    create: XOR<MovimentacaoCreateWithoutDepositoInput, MovimentacaoUncheckedCreateWithoutDepositoInput>
  }

  export type MovimentacaoUpdateWithWhereUniqueWithoutDepositoInput = {
    where: MovimentacaoWhereUniqueInput
    data: XOR<MovimentacaoUpdateWithoutDepositoInput, MovimentacaoUncheckedUpdateWithoutDepositoInput>
  }

  export type MovimentacaoUpdateManyWithWhereWithoutDepositoInput = {
    where: MovimentacaoScalarWhereInput
    data: XOR<MovimentacaoUpdateManyMutationInput, MovimentacaoUncheckedUpdateManyWithoutDepositoInput>
  }

  export type MovimentacaoScalarWhereInput = {
    AND?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
    OR?: MovimentacaoScalarWhereInput[]
    NOT?: MovimentacaoScalarWhereInput | MovimentacaoScalarWhereInput[]
    id?: UuidFilter<"Movimentacao"> | string
    tenantId?: UuidFilter<"Movimentacao"> | string
    produtoId?: UuidFilter<"Movimentacao"> | string
    depositoId?: UuidFilter<"Movimentacao"> | string
    tipo?: StringFilter<"Movimentacao"> | string
    motivo?: StringFilter<"Movimentacao"> | string
    quantidade?: IntFilter<"Movimentacao"> | number
    custoUnitario?: IntNullableFilter<"Movimentacao"> | number | null
    observacao?: StringNullableFilter<"Movimentacao"> | string | null
    criadoEm?: DateTimeFilter<"Movimentacao"> | Date | string
  }

  export type DepositoCreateWithoutSaldosInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    movimentacoes?: MovimentacaoCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateWithoutSaldosInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    movimentacoes?: MovimentacaoUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoCreateOrConnectWithoutSaldosInput = {
    where: DepositoWhereUniqueInput
    create: XOR<DepositoCreateWithoutSaldosInput, DepositoUncheckedCreateWithoutSaldosInput>
  }

  export type DepositoUpsertWithoutSaldosInput = {
    update: XOR<DepositoUpdateWithoutSaldosInput, DepositoUncheckedUpdateWithoutSaldosInput>
    create: XOR<DepositoCreateWithoutSaldosInput, DepositoUncheckedCreateWithoutSaldosInput>
    where?: DepositoWhereInput
  }

  export type DepositoUpdateToOneWithWhereWithoutSaldosInput = {
    where?: DepositoWhereInput
    data: XOR<DepositoUpdateWithoutSaldosInput, DepositoUncheckedUpdateWithoutSaldosInput>
  }

  export type DepositoUpdateWithoutSaldosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    movimentacoes?: MovimentacaoUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateWithoutSaldosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    movimentacoes?: MovimentacaoUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoCreateWithoutMovimentacoesInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    saldos?: SaldoEstoqueCreateNestedManyWithoutDepositoInput
  }

  export type DepositoUncheckedCreateWithoutMovimentacoesInput = {
    id?: string
    tenantId: string
    nome: string
    endereco?: string | null
    cidade?: string | null
    estado?: string | null
    padrao?: boolean
    ativo?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    saldos?: SaldoEstoqueUncheckedCreateNestedManyWithoutDepositoInput
  }

  export type DepositoCreateOrConnectWithoutMovimentacoesInput = {
    where: DepositoWhereUniqueInput
    create: XOR<DepositoCreateWithoutMovimentacoesInput, DepositoUncheckedCreateWithoutMovimentacoesInput>
  }

  export type DepositoUpsertWithoutMovimentacoesInput = {
    update: XOR<DepositoUpdateWithoutMovimentacoesInput, DepositoUncheckedUpdateWithoutMovimentacoesInput>
    create: XOR<DepositoCreateWithoutMovimentacoesInput, DepositoUncheckedCreateWithoutMovimentacoesInput>
    where?: DepositoWhereInput
  }

  export type DepositoUpdateToOneWithWhereWithoutMovimentacoesInput = {
    where?: DepositoWhereInput
    data: XOR<DepositoUpdateWithoutMovimentacoesInput, DepositoUncheckedUpdateWithoutMovimentacoesInput>
  }

  export type DepositoUpdateWithoutMovimentacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    saldos?: SaldoEstoqueUpdateManyWithoutDepositoNestedInput
  }

  export type DepositoUncheckedUpdateWithoutMovimentacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    cidade?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: NullableStringFieldUpdateOperationsInput | string | null
    padrao?: BoolFieldUpdateOperationsInput | boolean
    ativo?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    saldos?: SaldoEstoqueUncheckedUpdateManyWithoutDepositoNestedInput
  }

  export type SaldoEstoqueCreateManyDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    quantidadeFisica?: number
    reservado?: number
    estoqueMinimo?: number
    atualizadoEm?: Date | string
  }

  export type MovimentacaoCreateManyDepositoInput = {
    id?: string
    tenantId: string
    produtoId: string
    tipo: string
    motivo: string
    quantidade: number
    custoUnitario?: number | null
    observacao?: string | null
    criadoEm?: Date | string
  }

  export type SaldoEstoqueUpdateWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaldoEstoqueUncheckedUpdateWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SaldoEstoqueUncheckedUpdateManyWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    quantidadeFisica?: IntFieldUpdateOperationsInput | number
    reservado?: IntFieldUpdateOperationsInput | number
    estoqueMinimo?: IntFieldUpdateOperationsInput | number
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUpdateWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MovimentacaoUncheckedUpdateManyWithoutDepositoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    custoUnitario?: NullableIntFieldUpdateOperationsInput | number | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DepositoCountOutputTypeDefaultArgs instead
     */
    export type DepositoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DepositoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DepositoDefaultArgs instead
     */
    export type DepositoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DepositoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SaldoEstoqueDefaultArgs instead
     */
    export type SaldoEstoqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SaldoEstoqueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReservaEstoqueDefaultArgs instead
     */
    export type ReservaEstoqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReservaEstoqueDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MovimentacaoDefaultArgs instead
     */
    export type MovimentacaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MovimentacaoDefaultArgs<ExtArgs>

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