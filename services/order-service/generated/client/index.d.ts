
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
 * Model Pedido
 * Pedido completo com informações de cliente, itens, pagamento e entrega.
 * Suporta múltiplos canais: marketplace, e-commerce, loja física, manual.
 */
export type Pedido = $Result.DefaultSelection<Prisma.$PedidoPayload>
/**
 * Model ItemPedido
 * Itens (produtos) que fazem parte do pedido.
 */
export type ItemPedido = $Result.DefaultSelection<Prisma.$ItemPedidoPayload>
/**
 * Model HistoricoPedido
 * Rastreamento de todas as mudanças de status do pedido.
 */
export type HistoricoPedido = $Result.DefaultSelection<Prisma.$HistoricoPedidoPayload>
/**
 * Model Pagamento
 * Informações de pagamento vinculadas ao pedido.
 */
export type Pagamento = $Result.DefaultSelection<Prisma.$PagamentoPayload>
/**
 * Model Devolucao
 * Gestão de devoluções e reembolsos.
 */
export type Devolucao = $Result.DefaultSelection<Prisma.$DevolucaoPayload>
/**
 * Model ItemDevolucao
 * Itens específicos que fazem parte da devolução.
 */
export type ItemDevolucao = $Result.DefaultSelection<Prisma.$ItemDevolucaoPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Pedidos
 * const pedidos = await prisma.pedido.findMany()
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
   * // Fetch zero or more Pedidos
   * const pedidos = await prisma.pedido.findMany()
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
   * `prisma.pedido`: Exposes CRUD operations for the **Pedido** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pedidos
    * const pedidos = await prisma.pedido.findMany()
    * ```
    */
  get pedido(): Prisma.PedidoDelegate<ExtArgs>;

  /**
   * `prisma.itemPedido`: Exposes CRUD operations for the **ItemPedido** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemPedidos
    * const itemPedidos = await prisma.itemPedido.findMany()
    * ```
    */
  get itemPedido(): Prisma.ItemPedidoDelegate<ExtArgs>;

  /**
   * `prisma.historicoPedido`: Exposes CRUD operations for the **HistoricoPedido** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HistoricoPedidos
    * const historicoPedidos = await prisma.historicoPedido.findMany()
    * ```
    */
  get historicoPedido(): Prisma.HistoricoPedidoDelegate<ExtArgs>;

  /**
   * `prisma.pagamento`: Exposes CRUD operations for the **Pagamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pagamentos
    * const pagamentos = await prisma.pagamento.findMany()
    * ```
    */
  get pagamento(): Prisma.PagamentoDelegate<ExtArgs>;

  /**
   * `prisma.devolucao`: Exposes CRUD operations for the **Devolucao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devolucaos
    * const devolucaos = await prisma.devolucao.findMany()
    * ```
    */
  get devolucao(): Prisma.DevolucaoDelegate<ExtArgs>;

  /**
   * `prisma.itemDevolucao`: Exposes CRUD operations for the **ItemDevolucao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemDevolucaos
    * const itemDevolucaos = await prisma.itemDevolucao.findMany()
    * ```
    */
  get itemDevolucao(): Prisma.ItemDevolucaoDelegate<ExtArgs>;
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
    Pedido: 'Pedido',
    ItemPedido: 'ItemPedido',
    HistoricoPedido: 'HistoricoPedido',
    Pagamento: 'Pagamento',
    Devolucao: 'Devolucao',
    ItemDevolucao: 'ItemDevolucao'
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
      modelProps: "pedido" | "itemPedido" | "historicoPedido" | "pagamento" | "devolucao" | "itemDevolucao"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Pedido: {
        payload: Prisma.$PedidoPayload<ExtArgs>
        fields: Prisma.PedidoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PedidoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PedidoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          findFirst: {
            args: Prisma.PedidoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PedidoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          findMany: {
            args: Prisma.PedidoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>[]
          }
          create: {
            args: Prisma.PedidoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          createMany: {
            args: Prisma.PedidoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PedidoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>[]
          }
          delete: {
            args: Prisma.PedidoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          update: {
            args: Prisma.PedidoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          deleteMany: {
            args: Prisma.PedidoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PedidoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PedidoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PedidoPayload>
          }
          aggregate: {
            args: Prisma.PedidoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePedido>
          }
          groupBy: {
            args: Prisma.PedidoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PedidoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PedidoCountArgs<ExtArgs>
            result: $Utils.Optional<PedidoCountAggregateOutputType> | number
          }
        }
      }
      ItemPedido: {
        payload: Prisma.$ItemPedidoPayload<ExtArgs>
        fields: Prisma.ItemPedidoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemPedidoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemPedidoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          findFirst: {
            args: Prisma.ItemPedidoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemPedidoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          findMany: {
            args: Prisma.ItemPedidoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>[]
          }
          create: {
            args: Prisma.ItemPedidoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          createMany: {
            args: Prisma.ItemPedidoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItemPedidoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>[]
          }
          delete: {
            args: Prisma.ItemPedidoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          update: {
            args: Prisma.ItemPedidoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          deleteMany: {
            args: Prisma.ItemPedidoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemPedidoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemPedidoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPedidoPayload>
          }
          aggregate: {
            args: Prisma.ItemPedidoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemPedido>
          }
          groupBy: {
            args: Prisma.ItemPedidoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemPedidoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemPedidoCountArgs<ExtArgs>
            result: $Utils.Optional<ItemPedidoCountAggregateOutputType> | number
          }
        }
      }
      HistoricoPedido: {
        payload: Prisma.$HistoricoPedidoPayload<ExtArgs>
        fields: Prisma.HistoricoPedidoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HistoricoPedidoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HistoricoPedidoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          findFirst: {
            args: Prisma.HistoricoPedidoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HistoricoPedidoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          findMany: {
            args: Prisma.HistoricoPedidoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>[]
          }
          create: {
            args: Prisma.HistoricoPedidoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          createMany: {
            args: Prisma.HistoricoPedidoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HistoricoPedidoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>[]
          }
          delete: {
            args: Prisma.HistoricoPedidoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          update: {
            args: Prisma.HistoricoPedidoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          deleteMany: {
            args: Prisma.HistoricoPedidoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HistoricoPedidoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HistoricoPedidoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoricoPedidoPayload>
          }
          aggregate: {
            args: Prisma.HistoricoPedidoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHistoricoPedido>
          }
          groupBy: {
            args: Prisma.HistoricoPedidoGroupByArgs<ExtArgs>
            result: $Utils.Optional<HistoricoPedidoGroupByOutputType>[]
          }
          count: {
            args: Prisma.HistoricoPedidoCountArgs<ExtArgs>
            result: $Utils.Optional<HistoricoPedidoCountAggregateOutputType> | number
          }
        }
      }
      Pagamento: {
        payload: Prisma.$PagamentoPayload<ExtArgs>
        fields: Prisma.PagamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PagamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PagamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          findFirst: {
            args: Prisma.PagamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PagamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          findMany: {
            args: Prisma.PagamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>[]
          }
          create: {
            args: Prisma.PagamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          createMany: {
            args: Prisma.PagamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PagamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>[]
          }
          delete: {
            args: Prisma.PagamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          update: {
            args: Prisma.PagamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          deleteMany: {
            args: Prisma.PagamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PagamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PagamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          aggregate: {
            args: Prisma.PagamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePagamento>
          }
          groupBy: {
            args: Prisma.PagamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PagamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PagamentoCountArgs<ExtArgs>
            result: $Utils.Optional<PagamentoCountAggregateOutputType> | number
          }
        }
      }
      Devolucao: {
        payload: Prisma.$DevolucaoPayload<ExtArgs>
        fields: Prisma.DevolucaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DevolucaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DevolucaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          findFirst: {
            args: Prisma.DevolucaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DevolucaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          findMany: {
            args: Prisma.DevolucaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>[]
          }
          create: {
            args: Prisma.DevolucaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          createMany: {
            args: Prisma.DevolucaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DevolucaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>[]
          }
          delete: {
            args: Prisma.DevolucaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          update: {
            args: Prisma.DevolucaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          deleteMany: {
            args: Prisma.DevolucaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DevolucaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DevolucaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevolucaoPayload>
          }
          aggregate: {
            args: Prisma.DevolucaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevolucao>
          }
          groupBy: {
            args: Prisma.DevolucaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DevolucaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DevolucaoCountArgs<ExtArgs>
            result: $Utils.Optional<DevolucaoCountAggregateOutputType> | number
          }
        }
      }
      ItemDevolucao: {
        payload: Prisma.$ItemDevolucaoPayload<ExtArgs>
        fields: Prisma.ItemDevolucaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemDevolucaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemDevolucaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          findFirst: {
            args: Prisma.ItemDevolucaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemDevolucaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          findMany: {
            args: Prisma.ItemDevolucaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>[]
          }
          create: {
            args: Prisma.ItemDevolucaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          createMany: {
            args: Prisma.ItemDevolucaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ItemDevolucaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>[]
          }
          delete: {
            args: Prisma.ItemDevolucaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          update: {
            args: Prisma.ItemDevolucaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          deleteMany: {
            args: Prisma.ItemDevolucaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemDevolucaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemDevolucaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemDevolucaoPayload>
          }
          aggregate: {
            args: Prisma.ItemDevolucaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemDevolucao>
          }
          groupBy: {
            args: Prisma.ItemDevolucaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemDevolucaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemDevolucaoCountArgs<ExtArgs>
            result: $Utils.Optional<ItemDevolucaoCountAggregateOutputType> | number
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
   * Count Type PedidoCountOutputType
   */

  export type PedidoCountOutputType = {
    itens: number
    historico: number
    pagamentos: number
    devolucoes: number
  }

  export type PedidoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itens?: boolean | PedidoCountOutputTypeCountItensArgs
    historico?: boolean | PedidoCountOutputTypeCountHistoricoArgs
    pagamentos?: boolean | PedidoCountOutputTypeCountPagamentosArgs
    devolucoes?: boolean | PedidoCountOutputTypeCountDevolucoesArgs
  }

  // Custom InputTypes
  /**
   * PedidoCountOutputType without action
   */
  export type PedidoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PedidoCountOutputType
     */
    select?: PedidoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PedidoCountOutputType without action
   */
  export type PedidoCountOutputTypeCountItensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemPedidoWhereInput
  }

  /**
   * PedidoCountOutputType without action
   */
  export type PedidoCountOutputTypeCountHistoricoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoricoPedidoWhereInput
  }

  /**
   * PedidoCountOutputType without action
   */
  export type PedidoCountOutputTypeCountPagamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagamentoWhereInput
  }

  /**
   * PedidoCountOutputType without action
   */
  export type PedidoCountOutputTypeCountDevolucoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DevolucaoWhereInput
  }


  /**
   * Count Type ItemPedidoCountOutputType
   */

  export type ItemPedidoCountOutputType = {
    itensDevolvidos: number
  }

  export type ItemPedidoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itensDevolvidos?: boolean | ItemPedidoCountOutputTypeCountItensDevolvidosArgs
  }

  // Custom InputTypes
  /**
   * ItemPedidoCountOutputType without action
   */
  export type ItemPedidoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedidoCountOutputType
     */
    select?: ItemPedidoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemPedidoCountOutputType without action
   */
  export type ItemPedidoCountOutputTypeCountItensDevolvidosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemDevolucaoWhereInput
  }


  /**
   * Count Type DevolucaoCountOutputType
   */

  export type DevolucaoCountOutputType = {
    itens: number
  }

  export type DevolucaoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itens?: boolean | DevolucaoCountOutputTypeCountItensArgs
  }

  // Custom InputTypes
  /**
   * DevolucaoCountOutputType without action
   */
  export type DevolucaoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DevolucaoCountOutputType
     */
    select?: DevolucaoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DevolucaoCountOutputType without action
   */
  export type DevolucaoCountOutputTypeCountItensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemDevolucaoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Pedido
   */

  export type AggregatePedido = {
    _count: PedidoCountAggregateOutputType | null
    _avg: PedidoAvgAggregateOutputType | null
    _sum: PedidoSumAggregateOutputType | null
    _min: PedidoMinAggregateOutputType | null
    _max: PedidoMaxAggregateOutputType | null
  }

  export type PedidoAvgAggregateOutputType = {
    numero: number | null
    parcelas: number | null
    valorProdutos: Decimal | null
    valorDesconto: Decimal | null
    valorFrete: Decimal | null
    valorTotal: Decimal | null
    prazoEntrega: number | null
  }

  export type PedidoSumAggregateOutputType = {
    numero: number | null
    parcelas: number | null
    valorProdutos: Decimal | null
    valorDesconto: Decimal | null
    valorFrete: Decimal | null
    valorTotal: Decimal | null
    prazoEntrega: number | null
  }

  export type PedidoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    numero: number | null
    clienteId: string | null
    clienteNome: string | null
    clienteEmail: string | null
    clienteCpfCnpj: string | null
    origem: string | null
    canalOrigem: string | null
    pedidoExternoId: string | null
    status: string | null
    statusPagamento: string | null
    metodoPagamento: string | null
    parcelas: number | null
    valorProdutos: Decimal | null
    valorDesconto: Decimal | null
    valorFrete: Decimal | null
    valorTotal: Decimal | null
    observacao: string | null
    rastreamento: string | null
    codigoRastreio: string | null
    transportadora: string | null
    prazoEntrega: number | null
    dataAprovacao: Date | null
    dataSeparacao: Date | null
    dataFaturamento: Date | null
    dataEnvio: Date | null
    dataEntrega: Date | null
    dataCancelamento: Date | null
    motivoCancelamento: string | null
    notaFiscalId: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type PedidoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    numero: number | null
    clienteId: string | null
    clienteNome: string | null
    clienteEmail: string | null
    clienteCpfCnpj: string | null
    origem: string | null
    canalOrigem: string | null
    pedidoExternoId: string | null
    status: string | null
    statusPagamento: string | null
    metodoPagamento: string | null
    parcelas: number | null
    valorProdutos: Decimal | null
    valorDesconto: Decimal | null
    valorFrete: Decimal | null
    valorTotal: Decimal | null
    observacao: string | null
    rastreamento: string | null
    codigoRastreio: string | null
    transportadora: string | null
    prazoEntrega: number | null
    dataAprovacao: Date | null
    dataSeparacao: Date | null
    dataFaturamento: Date | null
    dataEnvio: Date | null
    dataEntrega: Date | null
    dataCancelamento: Date | null
    motivoCancelamento: string | null
    notaFiscalId: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type PedidoCountAggregateOutputType = {
    id: number
    tenantId: number
    numero: number
    clienteId: number
    clienteNome: number
    clienteEmail: number
    clienteCpfCnpj: number
    origem: number
    canalOrigem: number
    pedidoExternoId: number
    status: number
    statusPagamento: number
    metodoPagamento: number
    parcelas: number
    valorProdutos: number
    valorDesconto: number
    valorFrete: number
    valorTotal: number
    observacao: number
    enderecoEntrega: number
    rastreamento: number
    codigoRastreio: number
    transportadora: number
    prazoEntrega: number
    dataAprovacao: number
    dataSeparacao: number
    dataFaturamento: number
    dataEnvio: number
    dataEntrega: number
    dataCancelamento: number
    motivoCancelamento: number
    notaFiscalId: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type PedidoAvgAggregateInputType = {
    numero?: true
    parcelas?: true
    valorProdutos?: true
    valorDesconto?: true
    valorFrete?: true
    valorTotal?: true
    prazoEntrega?: true
  }

  export type PedidoSumAggregateInputType = {
    numero?: true
    parcelas?: true
    valorProdutos?: true
    valorDesconto?: true
    valorFrete?: true
    valorTotal?: true
    prazoEntrega?: true
  }

  export type PedidoMinAggregateInputType = {
    id?: true
    tenantId?: true
    numero?: true
    clienteId?: true
    clienteNome?: true
    clienteEmail?: true
    clienteCpfCnpj?: true
    origem?: true
    canalOrigem?: true
    pedidoExternoId?: true
    status?: true
    statusPagamento?: true
    metodoPagamento?: true
    parcelas?: true
    valorProdutos?: true
    valorDesconto?: true
    valorFrete?: true
    valorTotal?: true
    observacao?: true
    rastreamento?: true
    codigoRastreio?: true
    transportadora?: true
    prazoEntrega?: true
    dataAprovacao?: true
    dataSeparacao?: true
    dataFaturamento?: true
    dataEnvio?: true
    dataEntrega?: true
    dataCancelamento?: true
    motivoCancelamento?: true
    notaFiscalId?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type PedidoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    numero?: true
    clienteId?: true
    clienteNome?: true
    clienteEmail?: true
    clienteCpfCnpj?: true
    origem?: true
    canalOrigem?: true
    pedidoExternoId?: true
    status?: true
    statusPagamento?: true
    metodoPagamento?: true
    parcelas?: true
    valorProdutos?: true
    valorDesconto?: true
    valorFrete?: true
    valorTotal?: true
    observacao?: true
    rastreamento?: true
    codigoRastreio?: true
    transportadora?: true
    prazoEntrega?: true
    dataAprovacao?: true
    dataSeparacao?: true
    dataFaturamento?: true
    dataEnvio?: true
    dataEntrega?: true
    dataCancelamento?: true
    motivoCancelamento?: true
    notaFiscalId?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type PedidoCountAggregateInputType = {
    id?: true
    tenantId?: true
    numero?: true
    clienteId?: true
    clienteNome?: true
    clienteEmail?: true
    clienteCpfCnpj?: true
    origem?: true
    canalOrigem?: true
    pedidoExternoId?: true
    status?: true
    statusPagamento?: true
    metodoPagamento?: true
    parcelas?: true
    valorProdutos?: true
    valorDesconto?: true
    valorFrete?: true
    valorTotal?: true
    observacao?: true
    enderecoEntrega?: true
    rastreamento?: true
    codigoRastreio?: true
    transportadora?: true
    prazoEntrega?: true
    dataAprovacao?: true
    dataSeparacao?: true
    dataFaturamento?: true
    dataEnvio?: true
    dataEntrega?: true
    dataCancelamento?: true
    motivoCancelamento?: true
    notaFiscalId?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type PedidoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pedido to aggregate.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pedidos
    **/
    _count?: true | PedidoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PedidoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PedidoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PedidoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PedidoMaxAggregateInputType
  }

  export type GetPedidoAggregateType<T extends PedidoAggregateArgs> = {
        [P in keyof T & keyof AggregatePedido]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePedido[P]>
      : GetScalarType<T[P], AggregatePedido[P]>
  }




  export type PedidoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PedidoWhereInput
    orderBy?: PedidoOrderByWithAggregationInput | PedidoOrderByWithAggregationInput[]
    by: PedidoScalarFieldEnum[] | PedidoScalarFieldEnum
    having?: PedidoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PedidoCountAggregateInputType | true
    _avg?: PedidoAvgAggregateInputType
    _sum?: PedidoSumAggregateInputType
    _min?: PedidoMinAggregateInputType
    _max?: PedidoMaxAggregateInputType
  }

  export type PedidoGroupByOutputType = {
    id: string
    tenantId: string
    numero: number
    clienteId: string | null
    clienteNome: string
    clienteEmail: string | null
    clienteCpfCnpj: string | null
    origem: string
    canalOrigem: string | null
    pedidoExternoId: string | null
    status: string
    statusPagamento: string
    metodoPagamento: string | null
    parcelas: number
    valorProdutos: Decimal
    valorDesconto: Decimal
    valorFrete: Decimal
    valorTotal: Decimal
    observacao: string | null
    enderecoEntrega: JsonValue | null
    rastreamento: string | null
    codigoRastreio: string | null
    transportadora: string | null
    prazoEntrega: number | null
    dataAprovacao: Date | null
    dataSeparacao: Date | null
    dataFaturamento: Date | null
    dataEnvio: Date | null
    dataEntrega: Date | null
    dataCancelamento: Date | null
    motivoCancelamento: string | null
    notaFiscalId: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: PedidoCountAggregateOutputType | null
    _avg: PedidoAvgAggregateOutputType | null
    _sum: PedidoSumAggregateOutputType | null
    _min: PedidoMinAggregateOutputType | null
    _max: PedidoMaxAggregateOutputType | null
  }

  type GetPedidoGroupByPayload<T extends PedidoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PedidoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PedidoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PedidoGroupByOutputType[P]>
            : GetScalarType<T[P], PedidoGroupByOutputType[P]>
        }
      >
    >


  export type PedidoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    numero?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteEmail?: boolean
    clienteCpfCnpj?: boolean
    origem?: boolean
    canalOrigem?: boolean
    pedidoExternoId?: boolean
    status?: boolean
    statusPagamento?: boolean
    metodoPagamento?: boolean
    parcelas?: boolean
    valorProdutos?: boolean
    valorDesconto?: boolean
    valorFrete?: boolean
    valorTotal?: boolean
    observacao?: boolean
    enderecoEntrega?: boolean
    rastreamento?: boolean
    codigoRastreio?: boolean
    transportadora?: boolean
    prazoEntrega?: boolean
    dataAprovacao?: boolean
    dataSeparacao?: boolean
    dataFaturamento?: boolean
    dataEnvio?: boolean
    dataEntrega?: boolean
    dataCancelamento?: boolean
    motivoCancelamento?: boolean
    notaFiscalId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    itens?: boolean | Pedido$itensArgs<ExtArgs>
    historico?: boolean | Pedido$historicoArgs<ExtArgs>
    pagamentos?: boolean | Pedido$pagamentosArgs<ExtArgs>
    devolucoes?: boolean | Pedido$devolucoesArgs<ExtArgs>
    _count?: boolean | PedidoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pedido"]>

  export type PedidoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    numero?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteEmail?: boolean
    clienteCpfCnpj?: boolean
    origem?: boolean
    canalOrigem?: boolean
    pedidoExternoId?: boolean
    status?: boolean
    statusPagamento?: boolean
    metodoPagamento?: boolean
    parcelas?: boolean
    valorProdutos?: boolean
    valorDesconto?: boolean
    valorFrete?: boolean
    valorTotal?: boolean
    observacao?: boolean
    enderecoEntrega?: boolean
    rastreamento?: boolean
    codigoRastreio?: boolean
    transportadora?: boolean
    prazoEntrega?: boolean
    dataAprovacao?: boolean
    dataSeparacao?: boolean
    dataFaturamento?: boolean
    dataEnvio?: boolean
    dataEntrega?: boolean
    dataCancelamento?: boolean
    motivoCancelamento?: boolean
    notaFiscalId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["pedido"]>

  export type PedidoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    numero?: boolean
    clienteId?: boolean
    clienteNome?: boolean
    clienteEmail?: boolean
    clienteCpfCnpj?: boolean
    origem?: boolean
    canalOrigem?: boolean
    pedidoExternoId?: boolean
    status?: boolean
    statusPagamento?: boolean
    metodoPagamento?: boolean
    parcelas?: boolean
    valorProdutos?: boolean
    valorDesconto?: boolean
    valorFrete?: boolean
    valorTotal?: boolean
    observacao?: boolean
    enderecoEntrega?: boolean
    rastreamento?: boolean
    codigoRastreio?: boolean
    transportadora?: boolean
    prazoEntrega?: boolean
    dataAprovacao?: boolean
    dataSeparacao?: boolean
    dataFaturamento?: boolean
    dataEnvio?: boolean
    dataEntrega?: boolean
    dataCancelamento?: boolean
    motivoCancelamento?: boolean
    notaFiscalId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type PedidoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    itens?: boolean | Pedido$itensArgs<ExtArgs>
    historico?: boolean | Pedido$historicoArgs<ExtArgs>
    pagamentos?: boolean | Pedido$pagamentosArgs<ExtArgs>
    devolucoes?: boolean | Pedido$devolucoesArgs<ExtArgs>
    _count?: boolean | PedidoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PedidoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PedidoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pedido"
    objects: {
      itens: Prisma.$ItemPedidoPayload<ExtArgs>[]
      historico: Prisma.$HistoricoPedidoPayload<ExtArgs>[]
      pagamentos: Prisma.$PagamentoPayload<ExtArgs>[]
      devolucoes: Prisma.$DevolucaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      numero: number
      clienteId: string | null
      clienteNome: string
      clienteEmail: string | null
      clienteCpfCnpj: string | null
      origem: string
      canalOrigem: string | null
      pedidoExternoId: string | null
      status: string
      statusPagamento: string
      metodoPagamento: string | null
      parcelas: number
      valorProdutos: Prisma.Decimal
      valorDesconto: Prisma.Decimal
      valorFrete: Prisma.Decimal
      valorTotal: Prisma.Decimal
      observacao: string | null
      enderecoEntrega: Prisma.JsonValue | null
      rastreamento: string | null
      codigoRastreio: string | null
      transportadora: string | null
      prazoEntrega: number | null
      dataAprovacao: Date | null
      dataSeparacao: Date | null
      dataFaturamento: Date | null
      dataEnvio: Date | null
      dataEntrega: Date | null
      dataCancelamento: Date | null
      motivoCancelamento: string | null
      notaFiscalId: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["pedido"]>
    composites: {}
  }

  type PedidoGetPayload<S extends boolean | null | undefined | PedidoDefaultArgs> = $Result.GetResult<Prisma.$PedidoPayload, S>

  type PedidoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PedidoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PedidoCountAggregateInputType | true
    }

  export interface PedidoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pedido'], meta: { name: 'Pedido' } }
    /**
     * Find zero or one Pedido that matches the filter.
     * @param {PedidoFindUniqueArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PedidoFindUniqueArgs>(args: SelectSubset<T, PedidoFindUniqueArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Pedido that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PedidoFindUniqueOrThrowArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PedidoFindUniqueOrThrowArgs>(args: SelectSubset<T, PedidoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Pedido that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindFirstArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PedidoFindFirstArgs>(args?: SelectSubset<T, PedidoFindFirstArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Pedido that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindFirstOrThrowArgs} args - Arguments to find a Pedido
     * @example
     * // Get one Pedido
     * const pedido = await prisma.pedido.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PedidoFindFirstOrThrowArgs>(args?: SelectSubset<T, PedidoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Pedidos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pedidos
     * const pedidos = await prisma.pedido.findMany()
     * 
     * // Get first 10 Pedidos
     * const pedidos = await prisma.pedido.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pedidoWithIdOnly = await prisma.pedido.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PedidoFindManyArgs>(args?: SelectSubset<T, PedidoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Pedido.
     * @param {PedidoCreateArgs} args - Arguments to create a Pedido.
     * @example
     * // Create one Pedido
     * const Pedido = await prisma.pedido.create({
     *   data: {
     *     // ... data to create a Pedido
     *   }
     * })
     * 
     */
    create<T extends PedidoCreateArgs>(args: SelectSubset<T, PedidoCreateArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Pedidos.
     * @param {PedidoCreateManyArgs} args - Arguments to create many Pedidos.
     * @example
     * // Create many Pedidos
     * const pedido = await prisma.pedido.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PedidoCreateManyArgs>(args?: SelectSubset<T, PedidoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pedidos and returns the data saved in the database.
     * @param {PedidoCreateManyAndReturnArgs} args - Arguments to create many Pedidos.
     * @example
     * // Create many Pedidos
     * const pedido = await prisma.pedido.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pedidos and only return the `id`
     * const pedidoWithIdOnly = await prisma.pedido.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PedidoCreateManyAndReturnArgs>(args?: SelectSubset<T, PedidoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Pedido.
     * @param {PedidoDeleteArgs} args - Arguments to delete one Pedido.
     * @example
     * // Delete one Pedido
     * const Pedido = await prisma.pedido.delete({
     *   where: {
     *     // ... filter to delete one Pedido
     *   }
     * })
     * 
     */
    delete<T extends PedidoDeleteArgs>(args: SelectSubset<T, PedidoDeleteArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Pedido.
     * @param {PedidoUpdateArgs} args - Arguments to update one Pedido.
     * @example
     * // Update one Pedido
     * const pedido = await prisma.pedido.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PedidoUpdateArgs>(args: SelectSubset<T, PedidoUpdateArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Pedidos.
     * @param {PedidoDeleteManyArgs} args - Arguments to filter Pedidos to delete.
     * @example
     * // Delete a few Pedidos
     * const { count } = await prisma.pedido.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PedidoDeleteManyArgs>(args?: SelectSubset<T, PedidoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pedidos
     * const pedido = await prisma.pedido.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PedidoUpdateManyArgs>(args: SelectSubset<T, PedidoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pedido.
     * @param {PedidoUpsertArgs} args - Arguments to update or create a Pedido.
     * @example
     * // Update or create a Pedido
     * const pedido = await prisma.pedido.upsert({
     *   create: {
     *     // ... data to create a Pedido
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pedido we want to update
     *   }
     * })
     */
    upsert<T extends PedidoUpsertArgs>(args: SelectSubset<T, PedidoUpsertArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Pedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoCountArgs} args - Arguments to filter Pedidos to count.
     * @example
     * // Count the number of Pedidos
     * const count = await prisma.pedido.count({
     *   where: {
     *     // ... the filter for the Pedidos we want to count
     *   }
     * })
    **/
    count<T extends PedidoCountArgs>(
      args?: Subset<T, PedidoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PedidoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PedidoAggregateArgs>(args: Subset<T, PedidoAggregateArgs>): Prisma.PrismaPromise<GetPedidoAggregateType<T>>

    /**
     * Group by Pedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PedidoGroupByArgs} args - Group by arguments.
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
      T extends PedidoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PedidoGroupByArgs['orderBy'] }
        : { orderBy?: PedidoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PedidoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPedidoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pedido model
   */
  readonly fields: PedidoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pedido.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PedidoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    itens<T extends Pedido$itensArgs<ExtArgs> = {}>(args?: Subset<T, Pedido$itensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findMany"> | Null>
    historico<T extends Pedido$historicoArgs<ExtArgs> = {}>(args?: Subset<T, Pedido$historicoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findMany"> | Null>
    pagamentos<T extends Pedido$pagamentosArgs<ExtArgs> = {}>(args?: Subset<T, Pedido$pagamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findMany"> | Null>
    devolucoes<T extends Pedido$devolucoesArgs<ExtArgs> = {}>(args?: Subset<T, Pedido$devolucoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Pedido model
   */ 
  interface PedidoFieldRefs {
    readonly id: FieldRef<"Pedido", 'String'>
    readonly tenantId: FieldRef<"Pedido", 'String'>
    readonly numero: FieldRef<"Pedido", 'Int'>
    readonly clienteId: FieldRef<"Pedido", 'String'>
    readonly clienteNome: FieldRef<"Pedido", 'String'>
    readonly clienteEmail: FieldRef<"Pedido", 'String'>
    readonly clienteCpfCnpj: FieldRef<"Pedido", 'String'>
    readonly origem: FieldRef<"Pedido", 'String'>
    readonly canalOrigem: FieldRef<"Pedido", 'String'>
    readonly pedidoExternoId: FieldRef<"Pedido", 'String'>
    readonly status: FieldRef<"Pedido", 'String'>
    readonly statusPagamento: FieldRef<"Pedido", 'String'>
    readonly metodoPagamento: FieldRef<"Pedido", 'String'>
    readonly parcelas: FieldRef<"Pedido", 'Int'>
    readonly valorProdutos: FieldRef<"Pedido", 'Decimal'>
    readonly valorDesconto: FieldRef<"Pedido", 'Decimal'>
    readonly valorFrete: FieldRef<"Pedido", 'Decimal'>
    readonly valorTotal: FieldRef<"Pedido", 'Decimal'>
    readonly observacao: FieldRef<"Pedido", 'String'>
    readonly enderecoEntrega: FieldRef<"Pedido", 'Json'>
    readonly rastreamento: FieldRef<"Pedido", 'String'>
    readonly codigoRastreio: FieldRef<"Pedido", 'String'>
    readonly transportadora: FieldRef<"Pedido", 'String'>
    readonly prazoEntrega: FieldRef<"Pedido", 'Int'>
    readonly dataAprovacao: FieldRef<"Pedido", 'DateTime'>
    readonly dataSeparacao: FieldRef<"Pedido", 'DateTime'>
    readonly dataFaturamento: FieldRef<"Pedido", 'DateTime'>
    readonly dataEnvio: FieldRef<"Pedido", 'DateTime'>
    readonly dataEntrega: FieldRef<"Pedido", 'DateTime'>
    readonly dataCancelamento: FieldRef<"Pedido", 'DateTime'>
    readonly motivoCancelamento: FieldRef<"Pedido", 'String'>
    readonly notaFiscalId: FieldRef<"Pedido", 'String'>
    readonly criadoEm: FieldRef<"Pedido", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Pedido", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pedido findUnique
   */
  export type PedidoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido findUniqueOrThrow
   */
  export type PedidoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido findFirst
   */
  export type PedidoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pedidos.
     */
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido findFirstOrThrow
   */
  export type PedidoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter, which Pedido to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pedidos.
     */
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido findMany
   */
  export type PedidoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter, which Pedidos to fetch.
     */
    where?: PedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pedidos to fetch.
     */
    orderBy?: PedidoOrderByWithRelationInput | PedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pedidos.
     */
    cursor?: PedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pedidos.
     */
    skip?: number
    distinct?: PedidoScalarFieldEnum | PedidoScalarFieldEnum[]
  }

  /**
   * Pedido create
   */
  export type PedidoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * The data needed to create a Pedido.
     */
    data: XOR<PedidoCreateInput, PedidoUncheckedCreateInput>
  }

  /**
   * Pedido createMany
   */
  export type PedidoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pedidos.
     */
    data: PedidoCreateManyInput | PedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pedido createManyAndReturn
   */
  export type PedidoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Pedidos.
     */
    data: PedidoCreateManyInput | PedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pedido update
   */
  export type PedidoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * The data needed to update a Pedido.
     */
    data: XOR<PedidoUpdateInput, PedidoUncheckedUpdateInput>
    /**
     * Choose, which Pedido to update.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido updateMany
   */
  export type PedidoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pedidos.
     */
    data: XOR<PedidoUpdateManyMutationInput, PedidoUncheckedUpdateManyInput>
    /**
     * Filter which Pedidos to update
     */
    where?: PedidoWhereInput
  }

  /**
   * Pedido upsert
   */
  export type PedidoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * The filter to search for the Pedido to update in case it exists.
     */
    where: PedidoWhereUniqueInput
    /**
     * In case the Pedido found by the `where` argument doesn't exist, create a new Pedido with this data.
     */
    create: XOR<PedidoCreateInput, PedidoUncheckedCreateInput>
    /**
     * In case the Pedido was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PedidoUpdateInput, PedidoUncheckedUpdateInput>
  }

  /**
   * Pedido delete
   */
  export type PedidoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
    /**
     * Filter which Pedido to delete.
     */
    where: PedidoWhereUniqueInput
  }

  /**
   * Pedido deleteMany
   */
  export type PedidoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pedidos to delete
     */
    where?: PedidoWhereInput
  }

  /**
   * Pedido.itens
   */
  export type Pedido$itensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    where?: ItemPedidoWhereInput
    orderBy?: ItemPedidoOrderByWithRelationInput | ItemPedidoOrderByWithRelationInput[]
    cursor?: ItemPedidoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemPedidoScalarFieldEnum | ItemPedidoScalarFieldEnum[]
  }

  /**
   * Pedido.historico
   */
  export type Pedido$historicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    where?: HistoricoPedidoWhereInput
    orderBy?: HistoricoPedidoOrderByWithRelationInput | HistoricoPedidoOrderByWithRelationInput[]
    cursor?: HistoricoPedidoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HistoricoPedidoScalarFieldEnum | HistoricoPedidoScalarFieldEnum[]
  }

  /**
   * Pedido.pagamentos
   */
  export type Pedido$pagamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    where?: PagamentoWhereInput
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    cursor?: PagamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pedido.devolucoes
   */
  export type Pedido$devolucoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    where?: DevolucaoWhereInput
    orderBy?: DevolucaoOrderByWithRelationInput | DevolucaoOrderByWithRelationInput[]
    cursor?: DevolucaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DevolucaoScalarFieldEnum | DevolucaoScalarFieldEnum[]
  }

  /**
   * Pedido without action
   */
  export type PedidoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pedido
     */
    select?: PedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PedidoInclude<ExtArgs> | null
  }


  /**
   * Model ItemPedido
   */

  export type AggregateItemPedido = {
    _count: ItemPedidoCountAggregateOutputType | null
    _avg: ItemPedidoAvgAggregateOutputType | null
    _sum: ItemPedidoSumAggregateOutputType | null
    _min: ItemPedidoMinAggregateOutputType | null
    _max: ItemPedidoMaxAggregateOutputType | null
  }

  export type ItemPedidoAvgAggregateOutputType = {
    quantidade: number | null
    valorUnitario: Decimal | null
    valorDesconto: Decimal | null
    valorTotal: Decimal | null
    peso: Decimal | null
    largura: Decimal | null
    altura: Decimal | null
    comprimento: Decimal | null
  }

  export type ItemPedidoSumAggregateOutputType = {
    quantidade: number | null
    valorUnitario: Decimal | null
    valorDesconto: Decimal | null
    valorTotal: Decimal | null
    peso: Decimal | null
    largura: Decimal | null
    altura: Decimal | null
    comprimento: Decimal | null
  }

  export type ItemPedidoMinAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    produtoId: string | null
    variacaoId: string | null
    sku: string | null
    titulo: string | null
    quantidade: number | null
    valorUnitario: Decimal | null
    valorDesconto: Decimal | null
    valorTotal: Decimal | null
    peso: Decimal | null
    largura: Decimal | null
    altura: Decimal | null
    comprimento: Decimal | null
    criadoEm: Date | null
  }

  export type ItemPedidoMaxAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    produtoId: string | null
    variacaoId: string | null
    sku: string | null
    titulo: string | null
    quantidade: number | null
    valorUnitario: Decimal | null
    valorDesconto: Decimal | null
    valorTotal: Decimal | null
    peso: Decimal | null
    largura: Decimal | null
    altura: Decimal | null
    comprimento: Decimal | null
    criadoEm: Date | null
  }

  export type ItemPedidoCountAggregateOutputType = {
    id: number
    pedidoId: number
    produtoId: number
    variacaoId: number
    sku: number
    titulo: number
    quantidade: number
    valorUnitario: number
    valorDesconto: number
    valorTotal: number
    peso: number
    largura: number
    altura: number
    comprimento: number
    criadoEm: number
    _all: number
  }


  export type ItemPedidoAvgAggregateInputType = {
    quantidade?: true
    valorUnitario?: true
    valorDesconto?: true
    valorTotal?: true
    peso?: true
    largura?: true
    altura?: true
    comprimento?: true
  }

  export type ItemPedidoSumAggregateInputType = {
    quantidade?: true
    valorUnitario?: true
    valorDesconto?: true
    valorTotal?: true
    peso?: true
    largura?: true
    altura?: true
    comprimento?: true
  }

  export type ItemPedidoMinAggregateInputType = {
    id?: true
    pedidoId?: true
    produtoId?: true
    variacaoId?: true
    sku?: true
    titulo?: true
    quantidade?: true
    valorUnitario?: true
    valorDesconto?: true
    valorTotal?: true
    peso?: true
    largura?: true
    altura?: true
    comprimento?: true
    criadoEm?: true
  }

  export type ItemPedidoMaxAggregateInputType = {
    id?: true
    pedidoId?: true
    produtoId?: true
    variacaoId?: true
    sku?: true
    titulo?: true
    quantidade?: true
    valorUnitario?: true
    valorDesconto?: true
    valorTotal?: true
    peso?: true
    largura?: true
    altura?: true
    comprimento?: true
    criadoEm?: true
  }

  export type ItemPedidoCountAggregateInputType = {
    id?: true
    pedidoId?: true
    produtoId?: true
    variacaoId?: true
    sku?: true
    titulo?: true
    quantidade?: true
    valorUnitario?: true
    valorDesconto?: true
    valorTotal?: true
    peso?: true
    largura?: true
    altura?: true
    comprimento?: true
    criadoEm?: true
    _all?: true
  }

  export type ItemPedidoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemPedido to aggregate.
     */
    where?: ItemPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPedidos to fetch.
     */
    orderBy?: ItemPedidoOrderByWithRelationInput | ItemPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemPedidos
    **/
    _count?: true | ItemPedidoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemPedidoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemPedidoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemPedidoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemPedidoMaxAggregateInputType
  }

  export type GetItemPedidoAggregateType<T extends ItemPedidoAggregateArgs> = {
        [P in keyof T & keyof AggregateItemPedido]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemPedido[P]>
      : GetScalarType<T[P], AggregateItemPedido[P]>
  }




  export type ItemPedidoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemPedidoWhereInput
    orderBy?: ItemPedidoOrderByWithAggregationInput | ItemPedidoOrderByWithAggregationInput[]
    by: ItemPedidoScalarFieldEnum[] | ItemPedidoScalarFieldEnum
    having?: ItemPedidoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemPedidoCountAggregateInputType | true
    _avg?: ItemPedidoAvgAggregateInputType
    _sum?: ItemPedidoSumAggregateInputType
    _min?: ItemPedidoMinAggregateInputType
    _max?: ItemPedidoMaxAggregateInputType
  }

  export type ItemPedidoGroupByOutputType = {
    id: string
    pedidoId: string
    produtoId: string
    variacaoId: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal
    valorDesconto: Decimal
    valorTotal: Decimal
    peso: Decimal | null
    largura: Decimal | null
    altura: Decimal | null
    comprimento: Decimal | null
    criadoEm: Date
    _count: ItemPedidoCountAggregateOutputType | null
    _avg: ItemPedidoAvgAggregateOutputType | null
    _sum: ItemPedidoSumAggregateOutputType | null
    _min: ItemPedidoMinAggregateOutputType | null
    _max: ItemPedidoMaxAggregateOutputType | null
  }

  type GetItemPedidoGroupByPayload<T extends ItemPedidoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemPedidoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemPedidoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemPedidoGroupByOutputType[P]>
            : GetScalarType<T[P], ItemPedidoGroupByOutputType[P]>
        }
      >
    >


  export type ItemPedidoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    produtoId?: boolean
    variacaoId?: boolean
    sku?: boolean
    titulo?: boolean
    quantidade?: boolean
    valorUnitario?: boolean
    valorDesconto?: boolean
    valorTotal?: boolean
    peso?: boolean
    largura?: boolean
    altura?: boolean
    comprimento?: boolean
    criadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
    itensDevolvidos?: boolean | ItemPedido$itensDevolvidosArgs<ExtArgs>
    _count?: boolean | ItemPedidoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemPedido"]>

  export type ItemPedidoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    produtoId?: boolean
    variacaoId?: boolean
    sku?: boolean
    titulo?: boolean
    quantidade?: boolean
    valorUnitario?: boolean
    valorDesconto?: boolean
    valorTotal?: boolean
    peso?: boolean
    largura?: boolean
    altura?: boolean
    comprimento?: boolean
    criadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemPedido"]>

  export type ItemPedidoSelectScalar = {
    id?: boolean
    pedidoId?: boolean
    produtoId?: boolean
    variacaoId?: boolean
    sku?: boolean
    titulo?: boolean
    quantidade?: boolean
    valorUnitario?: boolean
    valorDesconto?: boolean
    valorTotal?: boolean
    peso?: boolean
    largura?: boolean
    altura?: boolean
    comprimento?: boolean
    criadoEm?: boolean
  }

  export type ItemPedidoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
    itensDevolvidos?: boolean | ItemPedido$itensDevolvidosArgs<ExtArgs>
    _count?: boolean | ItemPedidoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ItemPedidoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }

  export type $ItemPedidoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemPedido"
    objects: {
      pedido: Prisma.$PedidoPayload<ExtArgs>
      itensDevolvidos: Prisma.$ItemDevolucaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pedidoId: string
      produtoId: string
      variacaoId: string | null
      sku: string
      titulo: string
      quantidade: number
      valorUnitario: Prisma.Decimal
      valorDesconto: Prisma.Decimal
      valorTotal: Prisma.Decimal
      peso: Prisma.Decimal | null
      largura: Prisma.Decimal | null
      altura: Prisma.Decimal | null
      comprimento: Prisma.Decimal | null
      criadoEm: Date
    }, ExtArgs["result"]["itemPedido"]>
    composites: {}
  }

  type ItemPedidoGetPayload<S extends boolean | null | undefined | ItemPedidoDefaultArgs> = $Result.GetResult<Prisma.$ItemPedidoPayload, S>

  type ItemPedidoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ItemPedidoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ItemPedidoCountAggregateInputType | true
    }

  export interface ItemPedidoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemPedido'], meta: { name: 'ItemPedido' } }
    /**
     * Find zero or one ItemPedido that matches the filter.
     * @param {ItemPedidoFindUniqueArgs} args - Arguments to find a ItemPedido
     * @example
     * // Get one ItemPedido
     * const itemPedido = await prisma.itemPedido.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemPedidoFindUniqueArgs>(args: SelectSubset<T, ItemPedidoFindUniqueArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ItemPedido that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ItemPedidoFindUniqueOrThrowArgs} args - Arguments to find a ItemPedido
     * @example
     * // Get one ItemPedido
     * const itemPedido = await prisma.itemPedido.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemPedidoFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemPedidoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ItemPedido that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoFindFirstArgs} args - Arguments to find a ItemPedido
     * @example
     * // Get one ItemPedido
     * const itemPedido = await prisma.itemPedido.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemPedidoFindFirstArgs>(args?: SelectSubset<T, ItemPedidoFindFirstArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ItemPedido that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoFindFirstOrThrowArgs} args - Arguments to find a ItemPedido
     * @example
     * // Get one ItemPedido
     * const itemPedido = await prisma.itemPedido.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemPedidoFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemPedidoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ItemPedidos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemPedidos
     * const itemPedidos = await prisma.itemPedido.findMany()
     * 
     * // Get first 10 ItemPedidos
     * const itemPedidos = await prisma.itemPedido.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemPedidoWithIdOnly = await prisma.itemPedido.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemPedidoFindManyArgs>(args?: SelectSubset<T, ItemPedidoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ItemPedido.
     * @param {ItemPedidoCreateArgs} args - Arguments to create a ItemPedido.
     * @example
     * // Create one ItemPedido
     * const ItemPedido = await prisma.itemPedido.create({
     *   data: {
     *     // ... data to create a ItemPedido
     *   }
     * })
     * 
     */
    create<T extends ItemPedidoCreateArgs>(args: SelectSubset<T, ItemPedidoCreateArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ItemPedidos.
     * @param {ItemPedidoCreateManyArgs} args - Arguments to create many ItemPedidos.
     * @example
     * // Create many ItemPedidos
     * const itemPedido = await prisma.itemPedido.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemPedidoCreateManyArgs>(args?: SelectSubset<T, ItemPedidoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ItemPedidos and returns the data saved in the database.
     * @param {ItemPedidoCreateManyAndReturnArgs} args - Arguments to create many ItemPedidos.
     * @example
     * // Create many ItemPedidos
     * const itemPedido = await prisma.itemPedido.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ItemPedidos and only return the `id`
     * const itemPedidoWithIdOnly = await prisma.itemPedido.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItemPedidoCreateManyAndReturnArgs>(args?: SelectSubset<T, ItemPedidoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ItemPedido.
     * @param {ItemPedidoDeleteArgs} args - Arguments to delete one ItemPedido.
     * @example
     * // Delete one ItemPedido
     * const ItemPedido = await prisma.itemPedido.delete({
     *   where: {
     *     // ... filter to delete one ItemPedido
     *   }
     * })
     * 
     */
    delete<T extends ItemPedidoDeleteArgs>(args: SelectSubset<T, ItemPedidoDeleteArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ItemPedido.
     * @param {ItemPedidoUpdateArgs} args - Arguments to update one ItemPedido.
     * @example
     * // Update one ItemPedido
     * const itemPedido = await prisma.itemPedido.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemPedidoUpdateArgs>(args: SelectSubset<T, ItemPedidoUpdateArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ItemPedidos.
     * @param {ItemPedidoDeleteManyArgs} args - Arguments to filter ItemPedidos to delete.
     * @example
     * // Delete a few ItemPedidos
     * const { count } = await prisma.itemPedido.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemPedidoDeleteManyArgs>(args?: SelectSubset<T, ItemPedidoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemPedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemPedidos
     * const itemPedido = await prisma.itemPedido.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemPedidoUpdateManyArgs>(args: SelectSubset<T, ItemPedidoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemPedido.
     * @param {ItemPedidoUpsertArgs} args - Arguments to update or create a ItemPedido.
     * @example
     * // Update or create a ItemPedido
     * const itemPedido = await prisma.itemPedido.upsert({
     *   create: {
     *     // ... data to create a ItemPedido
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemPedido we want to update
     *   }
     * })
     */
    upsert<T extends ItemPedidoUpsertArgs>(args: SelectSubset<T, ItemPedidoUpsertArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ItemPedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoCountArgs} args - Arguments to filter ItemPedidos to count.
     * @example
     * // Count the number of ItemPedidos
     * const count = await prisma.itemPedido.count({
     *   where: {
     *     // ... the filter for the ItemPedidos we want to count
     *   }
     * })
    **/
    count<T extends ItemPedidoCountArgs>(
      args?: Subset<T, ItemPedidoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemPedidoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemPedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemPedidoAggregateArgs>(args: Subset<T, ItemPedidoAggregateArgs>): Prisma.PrismaPromise<GetItemPedidoAggregateType<T>>

    /**
     * Group by ItemPedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPedidoGroupByArgs} args - Group by arguments.
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
      T extends ItemPedidoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemPedidoGroupByArgs['orderBy'] }
        : { orderBy?: ItemPedidoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemPedidoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemPedidoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemPedido model
   */
  readonly fields: ItemPedidoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemPedido.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemPedidoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pedido<T extends PedidoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PedidoDefaultArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    itensDevolvidos<T extends ItemPedido$itensDevolvidosArgs<ExtArgs> = {}>(args?: Subset<T, ItemPedido$itensDevolvidosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ItemPedido model
   */ 
  interface ItemPedidoFieldRefs {
    readonly id: FieldRef<"ItemPedido", 'String'>
    readonly pedidoId: FieldRef<"ItemPedido", 'String'>
    readonly produtoId: FieldRef<"ItemPedido", 'String'>
    readonly variacaoId: FieldRef<"ItemPedido", 'String'>
    readonly sku: FieldRef<"ItemPedido", 'String'>
    readonly titulo: FieldRef<"ItemPedido", 'String'>
    readonly quantidade: FieldRef<"ItemPedido", 'Int'>
    readonly valorUnitario: FieldRef<"ItemPedido", 'Decimal'>
    readonly valorDesconto: FieldRef<"ItemPedido", 'Decimal'>
    readonly valorTotal: FieldRef<"ItemPedido", 'Decimal'>
    readonly peso: FieldRef<"ItemPedido", 'Decimal'>
    readonly largura: FieldRef<"ItemPedido", 'Decimal'>
    readonly altura: FieldRef<"ItemPedido", 'Decimal'>
    readonly comprimento: FieldRef<"ItemPedido", 'Decimal'>
    readonly criadoEm: FieldRef<"ItemPedido", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemPedido findUnique
   */
  export type ItemPedidoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter, which ItemPedido to fetch.
     */
    where: ItemPedidoWhereUniqueInput
  }

  /**
   * ItemPedido findUniqueOrThrow
   */
  export type ItemPedidoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter, which ItemPedido to fetch.
     */
    where: ItemPedidoWhereUniqueInput
  }

  /**
   * ItemPedido findFirst
   */
  export type ItemPedidoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter, which ItemPedido to fetch.
     */
    where?: ItemPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPedidos to fetch.
     */
    orderBy?: ItemPedidoOrderByWithRelationInput | ItemPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemPedidos.
     */
    cursor?: ItemPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemPedidos.
     */
    distinct?: ItemPedidoScalarFieldEnum | ItemPedidoScalarFieldEnum[]
  }

  /**
   * ItemPedido findFirstOrThrow
   */
  export type ItemPedidoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter, which ItemPedido to fetch.
     */
    where?: ItemPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPedidos to fetch.
     */
    orderBy?: ItemPedidoOrderByWithRelationInput | ItemPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemPedidos.
     */
    cursor?: ItemPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemPedidos.
     */
    distinct?: ItemPedidoScalarFieldEnum | ItemPedidoScalarFieldEnum[]
  }

  /**
   * ItemPedido findMany
   */
  export type ItemPedidoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter, which ItemPedidos to fetch.
     */
    where?: ItemPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPedidos to fetch.
     */
    orderBy?: ItemPedidoOrderByWithRelationInput | ItemPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemPedidos.
     */
    cursor?: ItemPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPedidos.
     */
    skip?: number
    distinct?: ItemPedidoScalarFieldEnum | ItemPedidoScalarFieldEnum[]
  }

  /**
   * ItemPedido create
   */
  export type ItemPedidoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemPedido.
     */
    data: XOR<ItemPedidoCreateInput, ItemPedidoUncheckedCreateInput>
  }

  /**
   * ItemPedido createMany
   */
  export type ItemPedidoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemPedidos.
     */
    data: ItemPedidoCreateManyInput | ItemPedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemPedido createManyAndReturn
   */
  export type ItemPedidoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ItemPedidos.
     */
    data: ItemPedidoCreateManyInput | ItemPedidoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ItemPedido update
   */
  export type ItemPedidoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemPedido.
     */
    data: XOR<ItemPedidoUpdateInput, ItemPedidoUncheckedUpdateInput>
    /**
     * Choose, which ItemPedido to update.
     */
    where: ItemPedidoWhereUniqueInput
  }

  /**
   * ItemPedido updateMany
   */
  export type ItemPedidoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemPedidos.
     */
    data: XOR<ItemPedidoUpdateManyMutationInput, ItemPedidoUncheckedUpdateManyInput>
    /**
     * Filter which ItemPedidos to update
     */
    where?: ItemPedidoWhereInput
  }

  /**
   * ItemPedido upsert
   */
  export type ItemPedidoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemPedido to update in case it exists.
     */
    where: ItemPedidoWhereUniqueInput
    /**
     * In case the ItemPedido found by the `where` argument doesn't exist, create a new ItemPedido with this data.
     */
    create: XOR<ItemPedidoCreateInput, ItemPedidoUncheckedCreateInput>
    /**
     * In case the ItemPedido was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemPedidoUpdateInput, ItemPedidoUncheckedUpdateInput>
  }

  /**
   * ItemPedido delete
   */
  export type ItemPedidoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
    /**
     * Filter which ItemPedido to delete.
     */
    where: ItemPedidoWhereUniqueInput
  }

  /**
   * ItemPedido deleteMany
   */
  export type ItemPedidoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemPedidos to delete
     */
    where?: ItemPedidoWhereInput
  }

  /**
   * ItemPedido.itensDevolvidos
   */
  export type ItemPedido$itensDevolvidosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    where?: ItemDevolucaoWhereInput
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    cursor?: ItemDevolucaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemDevolucaoScalarFieldEnum | ItemDevolucaoScalarFieldEnum[]
  }

  /**
   * ItemPedido without action
   */
  export type ItemPedidoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPedido
     */
    select?: ItemPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPedidoInclude<ExtArgs> | null
  }


  /**
   * Model HistoricoPedido
   */

  export type AggregateHistoricoPedido = {
    _count: HistoricoPedidoCountAggregateOutputType | null
    _min: HistoricoPedidoMinAggregateOutputType | null
    _max: HistoricoPedidoMaxAggregateOutputType | null
  }

  export type HistoricoPedidoMinAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    statusAnterior: string | null
    statusNovo: string | null
    descricao: string | null
    usuarioId: string | null
    criadoEm: Date | null
  }

  export type HistoricoPedidoMaxAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    statusAnterior: string | null
    statusNovo: string | null
    descricao: string | null
    usuarioId: string | null
    criadoEm: Date | null
  }

  export type HistoricoPedidoCountAggregateOutputType = {
    id: number
    pedidoId: number
    tenantId: number
    statusAnterior: number
    statusNovo: number
    descricao: number
    usuarioId: number
    dadosExtras: number
    criadoEm: number
    _all: number
  }


  export type HistoricoPedidoMinAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    statusAnterior?: true
    statusNovo?: true
    descricao?: true
    usuarioId?: true
    criadoEm?: true
  }

  export type HistoricoPedidoMaxAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    statusAnterior?: true
    statusNovo?: true
    descricao?: true
    usuarioId?: true
    criadoEm?: true
  }

  export type HistoricoPedidoCountAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    statusAnterior?: true
    statusNovo?: true
    descricao?: true
    usuarioId?: true
    dadosExtras?: true
    criadoEm?: true
    _all?: true
  }

  export type HistoricoPedidoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoricoPedido to aggregate.
     */
    where?: HistoricoPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricoPedidos to fetch.
     */
    orderBy?: HistoricoPedidoOrderByWithRelationInput | HistoricoPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HistoricoPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricoPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricoPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HistoricoPedidos
    **/
    _count?: true | HistoricoPedidoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HistoricoPedidoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HistoricoPedidoMaxAggregateInputType
  }

  export type GetHistoricoPedidoAggregateType<T extends HistoricoPedidoAggregateArgs> = {
        [P in keyof T & keyof AggregateHistoricoPedido]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHistoricoPedido[P]>
      : GetScalarType<T[P], AggregateHistoricoPedido[P]>
  }




  export type HistoricoPedidoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoricoPedidoWhereInput
    orderBy?: HistoricoPedidoOrderByWithAggregationInput | HistoricoPedidoOrderByWithAggregationInput[]
    by: HistoricoPedidoScalarFieldEnum[] | HistoricoPedidoScalarFieldEnum
    having?: HistoricoPedidoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HistoricoPedidoCountAggregateInputType | true
    _min?: HistoricoPedidoMinAggregateInputType
    _max?: HistoricoPedidoMaxAggregateInputType
  }

  export type HistoricoPedidoGroupByOutputType = {
    id: string
    pedidoId: string
    tenantId: string
    statusAnterior: string | null
    statusNovo: string
    descricao: string
    usuarioId: string | null
    dadosExtras: JsonValue | null
    criadoEm: Date
    _count: HistoricoPedidoCountAggregateOutputType | null
    _min: HistoricoPedidoMinAggregateOutputType | null
    _max: HistoricoPedidoMaxAggregateOutputType | null
  }

  type GetHistoricoPedidoGroupByPayload<T extends HistoricoPedidoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HistoricoPedidoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HistoricoPedidoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HistoricoPedidoGroupByOutputType[P]>
            : GetScalarType<T[P], HistoricoPedidoGroupByOutputType[P]>
        }
      >
    >


  export type HistoricoPedidoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    statusAnterior?: boolean
    statusNovo?: boolean
    descricao?: boolean
    usuarioId?: boolean
    dadosExtras?: boolean
    criadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historicoPedido"]>

  export type HistoricoPedidoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    statusAnterior?: boolean
    statusNovo?: boolean
    descricao?: boolean
    usuarioId?: boolean
    dadosExtras?: boolean
    criadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historicoPedido"]>

  export type HistoricoPedidoSelectScalar = {
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    statusAnterior?: boolean
    statusNovo?: boolean
    descricao?: boolean
    usuarioId?: boolean
    dadosExtras?: boolean
    criadoEm?: boolean
  }

  export type HistoricoPedidoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }
  export type HistoricoPedidoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }

  export type $HistoricoPedidoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HistoricoPedido"
    objects: {
      pedido: Prisma.$PedidoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pedidoId: string
      tenantId: string
      statusAnterior: string | null
      statusNovo: string
      descricao: string
      usuarioId: string | null
      dadosExtras: Prisma.JsonValue | null
      criadoEm: Date
    }, ExtArgs["result"]["historicoPedido"]>
    composites: {}
  }

  type HistoricoPedidoGetPayload<S extends boolean | null | undefined | HistoricoPedidoDefaultArgs> = $Result.GetResult<Prisma.$HistoricoPedidoPayload, S>

  type HistoricoPedidoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HistoricoPedidoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HistoricoPedidoCountAggregateInputType | true
    }

  export interface HistoricoPedidoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HistoricoPedido'], meta: { name: 'HistoricoPedido' } }
    /**
     * Find zero or one HistoricoPedido that matches the filter.
     * @param {HistoricoPedidoFindUniqueArgs} args - Arguments to find a HistoricoPedido
     * @example
     * // Get one HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HistoricoPedidoFindUniqueArgs>(args: SelectSubset<T, HistoricoPedidoFindUniqueArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HistoricoPedido that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HistoricoPedidoFindUniqueOrThrowArgs} args - Arguments to find a HistoricoPedido
     * @example
     * // Get one HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HistoricoPedidoFindUniqueOrThrowArgs>(args: SelectSubset<T, HistoricoPedidoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HistoricoPedido that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoFindFirstArgs} args - Arguments to find a HistoricoPedido
     * @example
     * // Get one HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HistoricoPedidoFindFirstArgs>(args?: SelectSubset<T, HistoricoPedidoFindFirstArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HistoricoPedido that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoFindFirstOrThrowArgs} args - Arguments to find a HistoricoPedido
     * @example
     * // Get one HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HistoricoPedidoFindFirstOrThrowArgs>(args?: SelectSubset<T, HistoricoPedidoFindFirstOrThrowArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HistoricoPedidos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HistoricoPedidos
     * const historicoPedidos = await prisma.historicoPedido.findMany()
     * 
     * // Get first 10 HistoricoPedidos
     * const historicoPedidos = await prisma.historicoPedido.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const historicoPedidoWithIdOnly = await prisma.historicoPedido.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HistoricoPedidoFindManyArgs>(args?: SelectSubset<T, HistoricoPedidoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HistoricoPedido.
     * @param {HistoricoPedidoCreateArgs} args - Arguments to create a HistoricoPedido.
     * @example
     * // Create one HistoricoPedido
     * const HistoricoPedido = await prisma.historicoPedido.create({
     *   data: {
     *     // ... data to create a HistoricoPedido
     *   }
     * })
     * 
     */
    create<T extends HistoricoPedidoCreateArgs>(args: SelectSubset<T, HistoricoPedidoCreateArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HistoricoPedidos.
     * @param {HistoricoPedidoCreateManyArgs} args - Arguments to create many HistoricoPedidos.
     * @example
     * // Create many HistoricoPedidos
     * const historicoPedido = await prisma.historicoPedido.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HistoricoPedidoCreateManyArgs>(args?: SelectSubset<T, HistoricoPedidoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HistoricoPedidos and returns the data saved in the database.
     * @param {HistoricoPedidoCreateManyAndReturnArgs} args - Arguments to create many HistoricoPedidos.
     * @example
     * // Create many HistoricoPedidos
     * const historicoPedido = await prisma.historicoPedido.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HistoricoPedidos and only return the `id`
     * const historicoPedidoWithIdOnly = await prisma.historicoPedido.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HistoricoPedidoCreateManyAndReturnArgs>(args?: SelectSubset<T, HistoricoPedidoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HistoricoPedido.
     * @param {HistoricoPedidoDeleteArgs} args - Arguments to delete one HistoricoPedido.
     * @example
     * // Delete one HistoricoPedido
     * const HistoricoPedido = await prisma.historicoPedido.delete({
     *   where: {
     *     // ... filter to delete one HistoricoPedido
     *   }
     * })
     * 
     */
    delete<T extends HistoricoPedidoDeleteArgs>(args: SelectSubset<T, HistoricoPedidoDeleteArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HistoricoPedido.
     * @param {HistoricoPedidoUpdateArgs} args - Arguments to update one HistoricoPedido.
     * @example
     * // Update one HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HistoricoPedidoUpdateArgs>(args: SelectSubset<T, HistoricoPedidoUpdateArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HistoricoPedidos.
     * @param {HistoricoPedidoDeleteManyArgs} args - Arguments to filter HistoricoPedidos to delete.
     * @example
     * // Delete a few HistoricoPedidos
     * const { count } = await prisma.historicoPedido.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HistoricoPedidoDeleteManyArgs>(args?: SelectSubset<T, HistoricoPedidoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistoricoPedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HistoricoPedidos
     * const historicoPedido = await prisma.historicoPedido.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HistoricoPedidoUpdateManyArgs>(args: SelectSubset<T, HistoricoPedidoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HistoricoPedido.
     * @param {HistoricoPedidoUpsertArgs} args - Arguments to update or create a HistoricoPedido.
     * @example
     * // Update or create a HistoricoPedido
     * const historicoPedido = await prisma.historicoPedido.upsert({
     *   create: {
     *     // ... data to create a HistoricoPedido
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HistoricoPedido we want to update
     *   }
     * })
     */
    upsert<T extends HistoricoPedidoUpsertArgs>(args: SelectSubset<T, HistoricoPedidoUpsertArgs<ExtArgs>>): Prisma__HistoricoPedidoClient<$Result.GetResult<Prisma.$HistoricoPedidoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HistoricoPedidos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoCountArgs} args - Arguments to filter HistoricoPedidos to count.
     * @example
     * // Count the number of HistoricoPedidos
     * const count = await prisma.historicoPedido.count({
     *   where: {
     *     // ... the filter for the HistoricoPedidos we want to count
     *   }
     * })
    **/
    count<T extends HistoricoPedidoCountArgs>(
      args?: Subset<T, HistoricoPedidoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HistoricoPedidoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HistoricoPedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HistoricoPedidoAggregateArgs>(args: Subset<T, HistoricoPedidoAggregateArgs>): Prisma.PrismaPromise<GetHistoricoPedidoAggregateType<T>>

    /**
     * Group by HistoricoPedido.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoricoPedidoGroupByArgs} args - Group by arguments.
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
      T extends HistoricoPedidoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HistoricoPedidoGroupByArgs['orderBy'] }
        : { orderBy?: HistoricoPedidoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, HistoricoPedidoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistoricoPedidoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HistoricoPedido model
   */
  readonly fields: HistoricoPedidoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HistoricoPedido.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HistoricoPedidoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pedido<T extends PedidoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PedidoDefaultArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the HistoricoPedido model
   */ 
  interface HistoricoPedidoFieldRefs {
    readonly id: FieldRef<"HistoricoPedido", 'String'>
    readonly pedidoId: FieldRef<"HistoricoPedido", 'String'>
    readonly tenantId: FieldRef<"HistoricoPedido", 'String'>
    readonly statusAnterior: FieldRef<"HistoricoPedido", 'String'>
    readonly statusNovo: FieldRef<"HistoricoPedido", 'String'>
    readonly descricao: FieldRef<"HistoricoPedido", 'String'>
    readonly usuarioId: FieldRef<"HistoricoPedido", 'String'>
    readonly dadosExtras: FieldRef<"HistoricoPedido", 'Json'>
    readonly criadoEm: FieldRef<"HistoricoPedido", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HistoricoPedido findUnique
   */
  export type HistoricoPedidoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter, which HistoricoPedido to fetch.
     */
    where: HistoricoPedidoWhereUniqueInput
  }

  /**
   * HistoricoPedido findUniqueOrThrow
   */
  export type HistoricoPedidoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter, which HistoricoPedido to fetch.
     */
    where: HistoricoPedidoWhereUniqueInput
  }

  /**
   * HistoricoPedido findFirst
   */
  export type HistoricoPedidoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter, which HistoricoPedido to fetch.
     */
    where?: HistoricoPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricoPedidos to fetch.
     */
    orderBy?: HistoricoPedidoOrderByWithRelationInput | HistoricoPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoricoPedidos.
     */
    cursor?: HistoricoPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricoPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricoPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoricoPedidos.
     */
    distinct?: HistoricoPedidoScalarFieldEnum | HistoricoPedidoScalarFieldEnum[]
  }

  /**
   * HistoricoPedido findFirstOrThrow
   */
  export type HistoricoPedidoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter, which HistoricoPedido to fetch.
     */
    where?: HistoricoPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricoPedidos to fetch.
     */
    orderBy?: HistoricoPedidoOrderByWithRelationInput | HistoricoPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoricoPedidos.
     */
    cursor?: HistoricoPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricoPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricoPedidos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoricoPedidos.
     */
    distinct?: HistoricoPedidoScalarFieldEnum | HistoricoPedidoScalarFieldEnum[]
  }

  /**
   * HistoricoPedido findMany
   */
  export type HistoricoPedidoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter, which HistoricoPedidos to fetch.
     */
    where?: HistoricoPedidoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoricoPedidos to fetch.
     */
    orderBy?: HistoricoPedidoOrderByWithRelationInput | HistoricoPedidoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HistoricoPedidos.
     */
    cursor?: HistoricoPedidoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoricoPedidos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoricoPedidos.
     */
    skip?: number
    distinct?: HistoricoPedidoScalarFieldEnum | HistoricoPedidoScalarFieldEnum[]
  }

  /**
   * HistoricoPedido create
   */
  export type HistoricoPedidoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * The data needed to create a HistoricoPedido.
     */
    data: XOR<HistoricoPedidoCreateInput, HistoricoPedidoUncheckedCreateInput>
  }

  /**
   * HistoricoPedido createMany
   */
  export type HistoricoPedidoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HistoricoPedidos.
     */
    data: HistoricoPedidoCreateManyInput | HistoricoPedidoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HistoricoPedido createManyAndReturn
   */
  export type HistoricoPedidoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HistoricoPedidos.
     */
    data: HistoricoPedidoCreateManyInput | HistoricoPedidoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistoricoPedido update
   */
  export type HistoricoPedidoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * The data needed to update a HistoricoPedido.
     */
    data: XOR<HistoricoPedidoUpdateInput, HistoricoPedidoUncheckedUpdateInput>
    /**
     * Choose, which HistoricoPedido to update.
     */
    where: HistoricoPedidoWhereUniqueInput
  }

  /**
   * HistoricoPedido updateMany
   */
  export type HistoricoPedidoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HistoricoPedidos.
     */
    data: XOR<HistoricoPedidoUpdateManyMutationInput, HistoricoPedidoUncheckedUpdateManyInput>
    /**
     * Filter which HistoricoPedidos to update
     */
    where?: HistoricoPedidoWhereInput
  }

  /**
   * HistoricoPedido upsert
   */
  export type HistoricoPedidoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * The filter to search for the HistoricoPedido to update in case it exists.
     */
    where: HistoricoPedidoWhereUniqueInput
    /**
     * In case the HistoricoPedido found by the `where` argument doesn't exist, create a new HistoricoPedido with this data.
     */
    create: XOR<HistoricoPedidoCreateInput, HistoricoPedidoUncheckedCreateInput>
    /**
     * In case the HistoricoPedido was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HistoricoPedidoUpdateInput, HistoricoPedidoUncheckedUpdateInput>
  }

  /**
   * HistoricoPedido delete
   */
  export type HistoricoPedidoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
    /**
     * Filter which HistoricoPedido to delete.
     */
    where: HistoricoPedidoWhereUniqueInput
  }

  /**
   * HistoricoPedido deleteMany
   */
  export type HistoricoPedidoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoricoPedidos to delete
     */
    where?: HistoricoPedidoWhereInput
  }

  /**
   * HistoricoPedido without action
   */
  export type HistoricoPedidoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoricoPedido
     */
    select?: HistoricoPedidoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoricoPedidoInclude<ExtArgs> | null
  }


  /**
   * Model Pagamento
   */

  export type AggregatePagamento = {
    _count: PagamentoCountAggregateOutputType | null
    _avg: PagamentoAvgAggregateOutputType | null
    _sum: PagamentoSumAggregateOutputType | null
    _min: PagamentoMinAggregateOutputType | null
    _max: PagamentoMaxAggregateOutputType | null
  }

  export type PagamentoAvgAggregateOutputType = {
    valor: Decimal | null
    parcelas: number | null
  }

  export type PagamentoSumAggregateOutputType = {
    valor: Decimal | null
    parcelas: number | null
  }

  export type PagamentoMinAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    tipo: string | null
    status: string | null
    valor: Decimal | null
    parcelas: number | null
    gateway: string | null
    transacaoExternaId: string | null
    dataPagamento: Date | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type PagamentoMaxAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    tipo: string | null
    status: string | null
    valor: Decimal | null
    parcelas: number | null
    gateway: string | null
    transacaoExternaId: string | null
    dataPagamento: Date | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type PagamentoCountAggregateOutputType = {
    id: number
    pedidoId: number
    tenantId: number
    tipo: number
    status: number
    valor: number
    parcelas: number
    gateway: number
    transacaoExternaId: number
    dadosGateway: number
    dataPagamento: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type PagamentoAvgAggregateInputType = {
    valor?: true
    parcelas?: true
  }

  export type PagamentoSumAggregateInputType = {
    valor?: true
    parcelas?: true
  }

  export type PagamentoMinAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    tipo?: true
    status?: true
    valor?: true
    parcelas?: true
    gateway?: true
    transacaoExternaId?: true
    dataPagamento?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type PagamentoMaxAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    tipo?: true
    status?: true
    valor?: true
    parcelas?: true
    gateway?: true
    transacaoExternaId?: true
    dataPagamento?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type PagamentoCountAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    tipo?: true
    status?: true
    valor?: true
    parcelas?: true
    gateway?: true
    transacaoExternaId?: true
    dadosGateway?: true
    dataPagamento?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type PagamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pagamento to aggregate.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pagamentos
    **/
    _count?: true | PagamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PagamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PagamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PagamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PagamentoMaxAggregateInputType
  }

  export type GetPagamentoAggregateType<T extends PagamentoAggregateArgs> = {
        [P in keyof T & keyof AggregatePagamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePagamento[P]>
      : GetScalarType<T[P], AggregatePagamento[P]>
  }




  export type PagamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagamentoWhereInput
    orderBy?: PagamentoOrderByWithAggregationInput | PagamentoOrderByWithAggregationInput[]
    by: PagamentoScalarFieldEnum[] | PagamentoScalarFieldEnum
    having?: PagamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PagamentoCountAggregateInputType | true
    _avg?: PagamentoAvgAggregateInputType
    _sum?: PagamentoSumAggregateInputType
    _min?: PagamentoMinAggregateInputType
    _max?: PagamentoMaxAggregateInputType
  }

  export type PagamentoGroupByOutputType = {
    id: string
    pedidoId: string
    tenantId: string
    tipo: string
    status: string
    valor: Decimal
    parcelas: number
    gateway: string | null
    transacaoExternaId: string | null
    dadosGateway: JsonValue | null
    dataPagamento: Date | null
    criadoEm: Date
    atualizadoEm: Date
    _count: PagamentoCountAggregateOutputType | null
    _avg: PagamentoAvgAggregateOutputType | null
    _sum: PagamentoSumAggregateOutputType | null
    _min: PagamentoMinAggregateOutputType | null
    _max: PagamentoMaxAggregateOutputType | null
  }

  type GetPagamentoGroupByPayload<T extends PagamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PagamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PagamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PagamentoGroupByOutputType[P]>
            : GetScalarType<T[P], PagamentoGroupByOutputType[P]>
        }
      >
    >


  export type PagamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    tipo?: boolean
    status?: boolean
    valor?: boolean
    parcelas?: boolean
    gateway?: boolean
    transacaoExternaId?: boolean
    dadosGateway?: boolean
    dataPagamento?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pagamento"]>

  export type PagamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    tipo?: boolean
    status?: boolean
    valor?: boolean
    parcelas?: boolean
    gateway?: boolean
    transacaoExternaId?: boolean
    dadosGateway?: boolean
    dataPagamento?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pagamento"]>

  export type PagamentoSelectScalar = {
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    tipo?: boolean
    status?: boolean
    valor?: boolean
    parcelas?: boolean
    gateway?: boolean
    transacaoExternaId?: boolean
    dadosGateway?: boolean
    dataPagamento?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type PagamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }
  export type PagamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }

  export type $PagamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pagamento"
    objects: {
      pedido: Prisma.$PedidoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pedidoId: string
      tenantId: string
      tipo: string
      status: string
      valor: Prisma.Decimal
      parcelas: number
      gateway: string | null
      transacaoExternaId: string | null
      dadosGateway: Prisma.JsonValue | null
      dataPagamento: Date | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["pagamento"]>
    composites: {}
  }

  type PagamentoGetPayload<S extends boolean | null | undefined | PagamentoDefaultArgs> = $Result.GetResult<Prisma.$PagamentoPayload, S>

  type PagamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PagamentoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PagamentoCountAggregateInputType | true
    }

  export interface PagamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pagamento'], meta: { name: 'Pagamento' } }
    /**
     * Find zero or one Pagamento that matches the filter.
     * @param {PagamentoFindUniqueArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PagamentoFindUniqueArgs>(args: SelectSubset<T, PagamentoFindUniqueArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Pagamento that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PagamentoFindUniqueOrThrowArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PagamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, PagamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Pagamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindFirstArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PagamentoFindFirstArgs>(args?: SelectSubset<T, PagamentoFindFirstArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Pagamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindFirstOrThrowArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PagamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, PagamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Pagamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pagamentos
     * const pagamentos = await prisma.pagamento.findMany()
     * 
     * // Get first 10 Pagamentos
     * const pagamentos = await prisma.pagamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pagamentoWithIdOnly = await prisma.pagamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PagamentoFindManyArgs>(args?: SelectSubset<T, PagamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Pagamento.
     * @param {PagamentoCreateArgs} args - Arguments to create a Pagamento.
     * @example
     * // Create one Pagamento
     * const Pagamento = await prisma.pagamento.create({
     *   data: {
     *     // ... data to create a Pagamento
     *   }
     * })
     * 
     */
    create<T extends PagamentoCreateArgs>(args: SelectSubset<T, PagamentoCreateArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Pagamentos.
     * @param {PagamentoCreateManyArgs} args - Arguments to create many Pagamentos.
     * @example
     * // Create many Pagamentos
     * const pagamento = await prisma.pagamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PagamentoCreateManyArgs>(args?: SelectSubset<T, PagamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pagamentos and returns the data saved in the database.
     * @param {PagamentoCreateManyAndReturnArgs} args - Arguments to create many Pagamentos.
     * @example
     * // Create many Pagamentos
     * const pagamento = await prisma.pagamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pagamentos and only return the `id`
     * const pagamentoWithIdOnly = await prisma.pagamento.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PagamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, PagamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Pagamento.
     * @param {PagamentoDeleteArgs} args - Arguments to delete one Pagamento.
     * @example
     * // Delete one Pagamento
     * const Pagamento = await prisma.pagamento.delete({
     *   where: {
     *     // ... filter to delete one Pagamento
     *   }
     * })
     * 
     */
    delete<T extends PagamentoDeleteArgs>(args: SelectSubset<T, PagamentoDeleteArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Pagamento.
     * @param {PagamentoUpdateArgs} args - Arguments to update one Pagamento.
     * @example
     * // Update one Pagamento
     * const pagamento = await prisma.pagamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PagamentoUpdateArgs>(args: SelectSubset<T, PagamentoUpdateArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Pagamentos.
     * @param {PagamentoDeleteManyArgs} args - Arguments to filter Pagamentos to delete.
     * @example
     * // Delete a few Pagamentos
     * const { count } = await prisma.pagamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PagamentoDeleteManyArgs>(args?: SelectSubset<T, PagamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pagamentos
     * const pagamento = await prisma.pagamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PagamentoUpdateManyArgs>(args: SelectSubset<T, PagamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pagamento.
     * @param {PagamentoUpsertArgs} args - Arguments to update or create a Pagamento.
     * @example
     * // Update or create a Pagamento
     * const pagamento = await prisma.pagamento.upsert({
     *   create: {
     *     // ... data to create a Pagamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pagamento we want to update
     *   }
     * })
     */
    upsert<T extends PagamentoUpsertArgs>(args: SelectSubset<T, PagamentoUpsertArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Pagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoCountArgs} args - Arguments to filter Pagamentos to count.
     * @example
     * // Count the number of Pagamentos
     * const count = await prisma.pagamento.count({
     *   where: {
     *     // ... the filter for the Pagamentos we want to count
     *   }
     * })
    **/
    count<T extends PagamentoCountArgs>(
      args?: Subset<T, PagamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PagamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PagamentoAggregateArgs>(args: Subset<T, PagamentoAggregateArgs>): Prisma.PrismaPromise<GetPagamentoAggregateType<T>>

    /**
     * Group by Pagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoGroupByArgs} args - Group by arguments.
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
      T extends PagamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PagamentoGroupByArgs['orderBy'] }
        : { orderBy?: PagamentoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PagamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPagamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pagamento model
   */
  readonly fields: PagamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pagamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PagamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pedido<T extends PedidoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PedidoDefaultArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Pagamento model
   */ 
  interface PagamentoFieldRefs {
    readonly id: FieldRef<"Pagamento", 'String'>
    readonly pedidoId: FieldRef<"Pagamento", 'String'>
    readonly tenantId: FieldRef<"Pagamento", 'String'>
    readonly tipo: FieldRef<"Pagamento", 'String'>
    readonly status: FieldRef<"Pagamento", 'String'>
    readonly valor: FieldRef<"Pagamento", 'Decimal'>
    readonly parcelas: FieldRef<"Pagamento", 'Int'>
    readonly gateway: FieldRef<"Pagamento", 'String'>
    readonly transacaoExternaId: FieldRef<"Pagamento", 'String'>
    readonly dadosGateway: FieldRef<"Pagamento", 'Json'>
    readonly dataPagamento: FieldRef<"Pagamento", 'DateTime'>
    readonly criadoEm: FieldRef<"Pagamento", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Pagamento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pagamento findUnique
   */
  export type PagamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento findUniqueOrThrow
   */
  export type PagamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento findFirst
   */
  export type PagamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagamentos.
     */
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento findFirstOrThrow
   */
  export type PagamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagamentos.
     */
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento findMany
   */
  export type PagamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamentos to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento create
   */
  export type PagamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a Pagamento.
     */
    data: XOR<PagamentoCreateInput, PagamentoUncheckedCreateInput>
  }

  /**
   * Pagamento createMany
   */
  export type PagamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pagamentos.
     */
    data: PagamentoCreateManyInput | PagamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pagamento createManyAndReturn
   */
  export type PagamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Pagamentos.
     */
    data: PagamentoCreateManyInput | PagamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pagamento update
   */
  export type PagamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a Pagamento.
     */
    data: XOR<PagamentoUpdateInput, PagamentoUncheckedUpdateInput>
    /**
     * Choose, which Pagamento to update.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento updateMany
   */
  export type PagamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pagamentos.
     */
    data: XOR<PagamentoUpdateManyMutationInput, PagamentoUncheckedUpdateManyInput>
    /**
     * Filter which Pagamentos to update
     */
    where?: PagamentoWhereInput
  }

  /**
   * Pagamento upsert
   */
  export type PagamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the Pagamento to update in case it exists.
     */
    where: PagamentoWhereUniqueInput
    /**
     * In case the Pagamento found by the `where` argument doesn't exist, create a new Pagamento with this data.
     */
    create: XOR<PagamentoCreateInput, PagamentoUncheckedCreateInput>
    /**
     * In case the Pagamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PagamentoUpdateInput, PagamentoUncheckedUpdateInput>
  }

  /**
   * Pagamento delete
   */
  export type PagamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter which Pagamento to delete.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento deleteMany
   */
  export type PagamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pagamentos to delete
     */
    where?: PagamentoWhereInput
  }

  /**
   * Pagamento without action
   */
  export type PagamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
  }


  /**
   * Model Devolucao
   */

  export type AggregateDevolucao = {
    _count: DevolucaoCountAggregateOutputType | null
    _avg: DevolucaoAvgAggregateOutputType | null
    _sum: DevolucaoSumAggregateOutputType | null
    _min: DevolucaoMinAggregateOutputType | null
    _max: DevolucaoMaxAggregateOutputType | null
  }

  export type DevolucaoAvgAggregateOutputType = {
    valorReembolso: Decimal | null
  }

  export type DevolucaoSumAggregateOutputType = {
    valorReembolso: Decimal | null
  }

  export type DevolucaoMinAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    motivo: string | null
    status: string | null
    valorReembolso: Decimal | null
    codigoRastreioRetorno: string | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type DevolucaoMaxAggregateOutputType = {
    id: string | null
    pedidoId: string | null
    tenantId: string | null
    motivo: string | null
    status: string | null
    valorReembolso: Decimal | null
    codigoRastreioRetorno: string | null
    observacao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type DevolucaoCountAggregateOutputType = {
    id: number
    pedidoId: number
    tenantId: number
    motivo: number
    status: number
    valorReembolso: number
    codigoRastreioRetorno: number
    observacao: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type DevolucaoAvgAggregateInputType = {
    valorReembolso?: true
  }

  export type DevolucaoSumAggregateInputType = {
    valorReembolso?: true
  }

  export type DevolucaoMinAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    motivo?: true
    status?: true
    valorReembolso?: true
    codigoRastreioRetorno?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type DevolucaoMaxAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    motivo?: true
    status?: true
    valorReembolso?: true
    codigoRastreioRetorno?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type DevolucaoCountAggregateInputType = {
    id?: true
    pedidoId?: true
    tenantId?: true
    motivo?: true
    status?: true
    valorReembolso?: true
    codigoRastreioRetorno?: true
    observacao?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type DevolucaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devolucao to aggregate.
     */
    where?: DevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devolucaos to fetch.
     */
    orderBy?: DevolucaoOrderByWithRelationInput | DevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devolucaos
    **/
    _count?: true | DevolucaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DevolucaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DevolucaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DevolucaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DevolucaoMaxAggregateInputType
  }

  export type GetDevolucaoAggregateType<T extends DevolucaoAggregateArgs> = {
        [P in keyof T & keyof AggregateDevolucao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevolucao[P]>
      : GetScalarType<T[P], AggregateDevolucao[P]>
  }




  export type DevolucaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DevolucaoWhereInput
    orderBy?: DevolucaoOrderByWithAggregationInput | DevolucaoOrderByWithAggregationInput[]
    by: DevolucaoScalarFieldEnum[] | DevolucaoScalarFieldEnum
    having?: DevolucaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DevolucaoCountAggregateInputType | true
    _avg?: DevolucaoAvgAggregateInputType
    _sum?: DevolucaoSumAggregateInputType
    _min?: DevolucaoMinAggregateInputType
    _max?: DevolucaoMaxAggregateInputType
  }

  export type DevolucaoGroupByOutputType = {
    id: string
    pedidoId: string
    tenantId: string
    motivo: string
    status: string
    valorReembolso: Decimal
    codigoRastreioRetorno: string | null
    observacao: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: DevolucaoCountAggregateOutputType | null
    _avg: DevolucaoAvgAggregateOutputType | null
    _sum: DevolucaoSumAggregateOutputType | null
    _min: DevolucaoMinAggregateOutputType | null
    _max: DevolucaoMaxAggregateOutputType | null
  }

  type GetDevolucaoGroupByPayload<T extends DevolucaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DevolucaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DevolucaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DevolucaoGroupByOutputType[P]>
            : GetScalarType<T[P], DevolucaoGroupByOutputType[P]>
        }
      >
    >


  export type DevolucaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    motivo?: boolean
    status?: boolean
    valorReembolso?: boolean
    codigoRastreioRetorno?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
    itens?: boolean | Devolucao$itensArgs<ExtArgs>
    _count?: boolean | DevolucaoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["devolucao"]>

  export type DevolucaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    motivo?: boolean
    status?: boolean
    valorReembolso?: boolean
    codigoRastreioRetorno?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["devolucao"]>

  export type DevolucaoSelectScalar = {
    id?: boolean
    pedidoId?: boolean
    tenantId?: boolean
    motivo?: boolean
    status?: boolean
    valorReembolso?: boolean
    codigoRastreioRetorno?: boolean
    observacao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type DevolucaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
    itens?: boolean | Devolucao$itensArgs<ExtArgs>
    _count?: boolean | DevolucaoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DevolucaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pedido?: boolean | PedidoDefaultArgs<ExtArgs>
  }

  export type $DevolucaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Devolucao"
    objects: {
      pedido: Prisma.$PedidoPayload<ExtArgs>
      itens: Prisma.$ItemDevolucaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pedidoId: string
      tenantId: string
      motivo: string
      status: string
      valorReembolso: Prisma.Decimal
      codigoRastreioRetorno: string | null
      observacao: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["devolucao"]>
    composites: {}
  }

  type DevolucaoGetPayload<S extends boolean | null | undefined | DevolucaoDefaultArgs> = $Result.GetResult<Prisma.$DevolucaoPayload, S>

  type DevolucaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DevolucaoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DevolucaoCountAggregateInputType | true
    }

  export interface DevolucaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Devolucao'], meta: { name: 'Devolucao' } }
    /**
     * Find zero or one Devolucao that matches the filter.
     * @param {DevolucaoFindUniqueArgs} args - Arguments to find a Devolucao
     * @example
     * // Get one Devolucao
     * const devolucao = await prisma.devolucao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DevolucaoFindUniqueArgs>(args: SelectSubset<T, DevolucaoFindUniqueArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Devolucao that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DevolucaoFindUniqueOrThrowArgs} args - Arguments to find a Devolucao
     * @example
     * // Get one Devolucao
     * const devolucao = await prisma.devolucao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DevolucaoFindUniqueOrThrowArgs>(args: SelectSubset<T, DevolucaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Devolucao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoFindFirstArgs} args - Arguments to find a Devolucao
     * @example
     * // Get one Devolucao
     * const devolucao = await prisma.devolucao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DevolucaoFindFirstArgs>(args?: SelectSubset<T, DevolucaoFindFirstArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Devolucao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoFindFirstOrThrowArgs} args - Arguments to find a Devolucao
     * @example
     * // Get one Devolucao
     * const devolucao = await prisma.devolucao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DevolucaoFindFirstOrThrowArgs>(args?: SelectSubset<T, DevolucaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Devolucaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devolucaos
     * const devolucaos = await prisma.devolucao.findMany()
     * 
     * // Get first 10 Devolucaos
     * const devolucaos = await prisma.devolucao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const devolucaoWithIdOnly = await prisma.devolucao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DevolucaoFindManyArgs>(args?: SelectSubset<T, DevolucaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Devolucao.
     * @param {DevolucaoCreateArgs} args - Arguments to create a Devolucao.
     * @example
     * // Create one Devolucao
     * const Devolucao = await prisma.devolucao.create({
     *   data: {
     *     // ... data to create a Devolucao
     *   }
     * })
     * 
     */
    create<T extends DevolucaoCreateArgs>(args: SelectSubset<T, DevolucaoCreateArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Devolucaos.
     * @param {DevolucaoCreateManyArgs} args - Arguments to create many Devolucaos.
     * @example
     * // Create many Devolucaos
     * const devolucao = await prisma.devolucao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DevolucaoCreateManyArgs>(args?: SelectSubset<T, DevolucaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devolucaos and returns the data saved in the database.
     * @param {DevolucaoCreateManyAndReturnArgs} args - Arguments to create many Devolucaos.
     * @example
     * // Create many Devolucaos
     * const devolucao = await prisma.devolucao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devolucaos and only return the `id`
     * const devolucaoWithIdOnly = await prisma.devolucao.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DevolucaoCreateManyAndReturnArgs>(args?: SelectSubset<T, DevolucaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Devolucao.
     * @param {DevolucaoDeleteArgs} args - Arguments to delete one Devolucao.
     * @example
     * // Delete one Devolucao
     * const Devolucao = await prisma.devolucao.delete({
     *   where: {
     *     // ... filter to delete one Devolucao
     *   }
     * })
     * 
     */
    delete<T extends DevolucaoDeleteArgs>(args: SelectSubset<T, DevolucaoDeleteArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Devolucao.
     * @param {DevolucaoUpdateArgs} args - Arguments to update one Devolucao.
     * @example
     * // Update one Devolucao
     * const devolucao = await prisma.devolucao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DevolucaoUpdateArgs>(args: SelectSubset<T, DevolucaoUpdateArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Devolucaos.
     * @param {DevolucaoDeleteManyArgs} args - Arguments to filter Devolucaos to delete.
     * @example
     * // Delete a few Devolucaos
     * const { count } = await prisma.devolucao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DevolucaoDeleteManyArgs>(args?: SelectSubset<T, DevolucaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devolucaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devolucaos
     * const devolucao = await prisma.devolucao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DevolucaoUpdateManyArgs>(args: SelectSubset<T, DevolucaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Devolucao.
     * @param {DevolucaoUpsertArgs} args - Arguments to update or create a Devolucao.
     * @example
     * // Update or create a Devolucao
     * const devolucao = await prisma.devolucao.upsert({
     *   create: {
     *     // ... data to create a Devolucao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Devolucao we want to update
     *   }
     * })
     */
    upsert<T extends DevolucaoUpsertArgs>(args: SelectSubset<T, DevolucaoUpsertArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Devolucaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoCountArgs} args - Arguments to filter Devolucaos to count.
     * @example
     * // Count the number of Devolucaos
     * const count = await prisma.devolucao.count({
     *   where: {
     *     // ... the filter for the Devolucaos we want to count
     *   }
     * })
    **/
    count<T extends DevolucaoCountArgs>(
      args?: Subset<T, DevolucaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DevolucaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Devolucao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DevolucaoAggregateArgs>(args: Subset<T, DevolucaoAggregateArgs>): Prisma.PrismaPromise<GetDevolucaoAggregateType<T>>

    /**
     * Group by Devolucao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevolucaoGroupByArgs} args - Group by arguments.
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
      T extends DevolucaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DevolucaoGroupByArgs['orderBy'] }
        : { orderBy?: DevolucaoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DevolucaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDevolucaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Devolucao model
   */
  readonly fields: DevolucaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Devolucao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DevolucaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pedido<T extends PedidoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PedidoDefaultArgs<ExtArgs>>): Prisma__PedidoClient<$Result.GetResult<Prisma.$PedidoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    itens<T extends Devolucao$itensArgs<ExtArgs> = {}>(args?: Subset<T, Devolucao$itensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Devolucao model
   */ 
  interface DevolucaoFieldRefs {
    readonly id: FieldRef<"Devolucao", 'String'>
    readonly pedidoId: FieldRef<"Devolucao", 'String'>
    readonly tenantId: FieldRef<"Devolucao", 'String'>
    readonly motivo: FieldRef<"Devolucao", 'String'>
    readonly status: FieldRef<"Devolucao", 'String'>
    readonly valorReembolso: FieldRef<"Devolucao", 'Decimal'>
    readonly codigoRastreioRetorno: FieldRef<"Devolucao", 'String'>
    readonly observacao: FieldRef<"Devolucao", 'String'>
    readonly criadoEm: FieldRef<"Devolucao", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Devolucao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Devolucao findUnique
   */
  export type DevolucaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which Devolucao to fetch.
     */
    where: DevolucaoWhereUniqueInput
  }

  /**
   * Devolucao findUniqueOrThrow
   */
  export type DevolucaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which Devolucao to fetch.
     */
    where: DevolucaoWhereUniqueInput
  }

  /**
   * Devolucao findFirst
   */
  export type DevolucaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which Devolucao to fetch.
     */
    where?: DevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devolucaos to fetch.
     */
    orderBy?: DevolucaoOrderByWithRelationInput | DevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devolucaos.
     */
    cursor?: DevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devolucaos.
     */
    distinct?: DevolucaoScalarFieldEnum | DevolucaoScalarFieldEnum[]
  }

  /**
   * Devolucao findFirstOrThrow
   */
  export type DevolucaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which Devolucao to fetch.
     */
    where?: DevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devolucaos to fetch.
     */
    orderBy?: DevolucaoOrderByWithRelationInput | DevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devolucaos.
     */
    cursor?: DevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devolucaos.
     */
    distinct?: DevolucaoScalarFieldEnum | DevolucaoScalarFieldEnum[]
  }

  /**
   * Devolucao findMany
   */
  export type DevolucaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which Devolucaos to fetch.
     */
    where?: DevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devolucaos to fetch.
     */
    orderBy?: DevolucaoOrderByWithRelationInput | DevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devolucaos.
     */
    cursor?: DevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devolucaos.
     */
    skip?: number
    distinct?: DevolucaoScalarFieldEnum | DevolucaoScalarFieldEnum[]
  }

  /**
   * Devolucao create
   */
  export type DevolucaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * The data needed to create a Devolucao.
     */
    data: XOR<DevolucaoCreateInput, DevolucaoUncheckedCreateInput>
  }

  /**
   * Devolucao createMany
   */
  export type DevolucaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devolucaos.
     */
    data: DevolucaoCreateManyInput | DevolucaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Devolucao createManyAndReturn
   */
  export type DevolucaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Devolucaos.
     */
    data: DevolucaoCreateManyInput | DevolucaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Devolucao update
   */
  export type DevolucaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * The data needed to update a Devolucao.
     */
    data: XOR<DevolucaoUpdateInput, DevolucaoUncheckedUpdateInput>
    /**
     * Choose, which Devolucao to update.
     */
    where: DevolucaoWhereUniqueInput
  }

  /**
   * Devolucao updateMany
   */
  export type DevolucaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devolucaos.
     */
    data: XOR<DevolucaoUpdateManyMutationInput, DevolucaoUncheckedUpdateManyInput>
    /**
     * Filter which Devolucaos to update
     */
    where?: DevolucaoWhereInput
  }

  /**
   * Devolucao upsert
   */
  export type DevolucaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * The filter to search for the Devolucao to update in case it exists.
     */
    where: DevolucaoWhereUniqueInput
    /**
     * In case the Devolucao found by the `where` argument doesn't exist, create a new Devolucao with this data.
     */
    create: XOR<DevolucaoCreateInput, DevolucaoUncheckedCreateInput>
    /**
     * In case the Devolucao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DevolucaoUpdateInput, DevolucaoUncheckedUpdateInput>
  }

  /**
   * Devolucao delete
   */
  export type DevolucaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
    /**
     * Filter which Devolucao to delete.
     */
    where: DevolucaoWhereUniqueInput
  }

  /**
   * Devolucao deleteMany
   */
  export type DevolucaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devolucaos to delete
     */
    where?: DevolucaoWhereInput
  }

  /**
   * Devolucao.itens
   */
  export type Devolucao$itensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    where?: ItemDevolucaoWhereInput
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    cursor?: ItemDevolucaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemDevolucaoScalarFieldEnum | ItemDevolucaoScalarFieldEnum[]
  }

  /**
   * Devolucao without action
   */
  export type DevolucaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Devolucao
     */
    select?: DevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DevolucaoInclude<ExtArgs> | null
  }


  /**
   * Model ItemDevolucao
   */

  export type AggregateItemDevolucao = {
    _count: ItemDevolucaoCountAggregateOutputType | null
    _avg: ItemDevolucaoAvgAggregateOutputType | null
    _sum: ItemDevolucaoSumAggregateOutputType | null
    _min: ItemDevolucaoMinAggregateOutputType | null
    _max: ItemDevolucaoMaxAggregateOutputType | null
  }

  export type ItemDevolucaoAvgAggregateOutputType = {
    quantidade: number | null
  }

  export type ItemDevolucaoSumAggregateOutputType = {
    quantidade: number | null
  }

  export type ItemDevolucaoMinAggregateOutputType = {
    id: string | null
    devolucaoId: string | null
    itemPedidoId: string | null
    quantidade: number | null
    motivo: string | null
    criadoEm: Date | null
  }

  export type ItemDevolucaoMaxAggregateOutputType = {
    id: string | null
    devolucaoId: string | null
    itemPedidoId: string | null
    quantidade: number | null
    motivo: string | null
    criadoEm: Date | null
  }

  export type ItemDevolucaoCountAggregateOutputType = {
    id: number
    devolucaoId: number
    itemPedidoId: number
    quantidade: number
    motivo: number
    criadoEm: number
    _all: number
  }


  export type ItemDevolucaoAvgAggregateInputType = {
    quantidade?: true
  }

  export type ItemDevolucaoSumAggregateInputType = {
    quantidade?: true
  }

  export type ItemDevolucaoMinAggregateInputType = {
    id?: true
    devolucaoId?: true
    itemPedidoId?: true
    quantidade?: true
    motivo?: true
    criadoEm?: true
  }

  export type ItemDevolucaoMaxAggregateInputType = {
    id?: true
    devolucaoId?: true
    itemPedidoId?: true
    quantidade?: true
    motivo?: true
    criadoEm?: true
  }

  export type ItemDevolucaoCountAggregateInputType = {
    id?: true
    devolucaoId?: true
    itemPedidoId?: true
    quantidade?: true
    motivo?: true
    criadoEm?: true
    _all?: true
  }

  export type ItemDevolucaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemDevolucao to aggregate.
     */
    where?: ItemDevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemDevolucaos to fetch.
     */
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemDevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemDevolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemDevolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemDevolucaos
    **/
    _count?: true | ItemDevolucaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemDevolucaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemDevolucaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemDevolucaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemDevolucaoMaxAggregateInputType
  }

  export type GetItemDevolucaoAggregateType<T extends ItemDevolucaoAggregateArgs> = {
        [P in keyof T & keyof AggregateItemDevolucao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemDevolucao[P]>
      : GetScalarType<T[P], AggregateItemDevolucao[P]>
  }




  export type ItemDevolucaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemDevolucaoWhereInput
    orderBy?: ItemDevolucaoOrderByWithAggregationInput | ItemDevolucaoOrderByWithAggregationInput[]
    by: ItemDevolucaoScalarFieldEnum[] | ItemDevolucaoScalarFieldEnum
    having?: ItemDevolucaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemDevolucaoCountAggregateInputType | true
    _avg?: ItemDevolucaoAvgAggregateInputType
    _sum?: ItemDevolucaoSumAggregateInputType
    _min?: ItemDevolucaoMinAggregateInputType
    _max?: ItemDevolucaoMaxAggregateInputType
  }

  export type ItemDevolucaoGroupByOutputType = {
    id: string
    devolucaoId: string
    itemPedidoId: string
    quantidade: number
    motivo: string
    criadoEm: Date
    _count: ItemDevolucaoCountAggregateOutputType | null
    _avg: ItemDevolucaoAvgAggregateOutputType | null
    _sum: ItemDevolucaoSumAggregateOutputType | null
    _min: ItemDevolucaoMinAggregateOutputType | null
    _max: ItemDevolucaoMaxAggregateOutputType | null
  }

  type GetItemDevolucaoGroupByPayload<T extends ItemDevolucaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemDevolucaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemDevolucaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemDevolucaoGroupByOutputType[P]>
            : GetScalarType<T[P], ItemDevolucaoGroupByOutputType[P]>
        }
      >
    >


  export type ItemDevolucaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    devolucaoId?: boolean
    itemPedidoId?: boolean
    quantidade?: boolean
    motivo?: boolean
    criadoEm?: boolean
    devolucao?: boolean | DevolucaoDefaultArgs<ExtArgs>
    itemPedido?: boolean | ItemPedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemDevolucao"]>

  export type ItemDevolucaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    devolucaoId?: boolean
    itemPedidoId?: boolean
    quantidade?: boolean
    motivo?: boolean
    criadoEm?: boolean
    devolucao?: boolean | DevolucaoDefaultArgs<ExtArgs>
    itemPedido?: boolean | ItemPedidoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemDevolucao"]>

  export type ItemDevolucaoSelectScalar = {
    id?: boolean
    devolucaoId?: boolean
    itemPedidoId?: boolean
    quantidade?: boolean
    motivo?: boolean
    criadoEm?: boolean
  }

  export type ItemDevolucaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    devolucao?: boolean | DevolucaoDefaultArgs<ExtArgs>
    itemPedido?: boolean | ItemPedidoDefaultArgs<ExtArgs>
  }
  export type ItemDevolucaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    devolucao?: boolean | DevolucaoDefaultArgs<ExtArgs>
    itemPedido?: boolean | ItemPedidoDefaultArgs<ExtArgs>
  }

  export type $ItemDevolucaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemDevolucao"
    objects: {
      devolucao: Prisma.$DevolucaoPayload<ExtArgs>
      itemPedido: Prisma.$ItemPedidoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      devolucaoId: string
      itemPedidoId: string
      quantidade: number
      motivo: string
      criadoEm: Date
    }, ExtArgs["result"]["itemDevolucao"]>
    composites: {}
  }

  type ItemDevolucaoGetPayload<S extends boolean | null | undefined | ItemDevolucaoDefaultArgs> = $Result.GetResult<Prisma.$ItemDevolucaoPayload, S>

  type ItemDevolucaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ItemDevolucaoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ItemDevolucaoCountAggregateInputType | true
    }

  export interface ItemDevolucaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemDevolucao'], meta: { name: 'ItemDevolucao' } }
    /**
     * Find zero or one ItemDevolucao that matches the filter.
     * @param {ItemDevolucaoFindUniqueArgs} args - Arguments to find a ItemDevolucao
     * @example
     * // Get one ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemDevolucaoFindUniqueArgs>(args: SelectSubset<T, ItemDevolucaoFindUniqueArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ItemDevolucao that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ItemDevolucaoFindUniqueOrThrowArgs} args - Arguments to find a ItemDevolucao
     * @example
     * // Get one ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemDevolucaoFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemDevolucaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ItemDevolucao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoFindFirstArgs} args - Arguments to find a ItemDevolucao
     * @example
     * // Get one ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemDevolucaoFindFirstArgs>(args?: SelectSubset<T, ItemDevolucaoFindFirstArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ItemDevolucao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoFindFirstOrThrowArgs} args - Arguments to find a ItemDevolucao
     * @example
     * // Get one ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemDevolucaoFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemDevolucaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ItemDevolucaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemDevolucaos
     * const itemDevolucaos = await prisma.itemDevolucao.findMany()
     * 
     * // Get first 10 ItemDevolucaos
     * const itemDevolucaos = await prisma.itemDevolucao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemDevolucaoWithIdOnly = await prisma.itemDevolucao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemDevolucaoFindManyArgs>(args?: SelectSubset<T, ItemDevolucaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ItemDevolucao.
     * @param {ItemDevolucaoCreateArgs} args - Arguments to create a ItemDevolucao.
     * @example
     * // Create one ItemDevolucao
     * const ItemDevolucao = await prisma.itemDevolucao.create({
     *   data: {
     *     // ... data to create a ItemDevolucao
     *   }
     * })
     * 
     */
    create<T extends ItemDevolucaoCreateArgs>(args: SelectSubset<T, ItemDevolucaoCreateArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ItemDevolucaos.
     * @param {ItemDevolucaoCreateManyArgs} args - Arguments to create many ItemDevolucaos.
     * @example
     * // Create many ItemDevolucaos
     * const itemDevolucao = await prisma.itemDevolucao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemDevolucaoCreateManyArgs>(args?: SelectSubset<T, ItemDevolucaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ItemDevolucaos and returns the data saved in the database.
     * @param {ItemDevolucaoCreateManyAndReturnArgs} args - Arguments to create many ItemDevolucaos.
     * @example
     * // Create many ItemDevolucaos
     * const itemDevolucao = await prisma.itemDevolucao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ItemDevolucaos and only return the `id`
     * const itemDevolucaoWithIdOnly = await prisma.itemDevolucao.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ItemDevolucaoCreateManyAndReturnArgs>(args?: SelectSubset<T, ItemDevolucaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ItemDevolucao.
     * @param {ItemDevolucaoDeleteArgs} args - Arguments to delete one ItemDevolucao.
     * @example
     * // Delete one ItemDevolucao
     * const ItemDevolucao = await prisma.itemDevolucao.delete({
     *   where: {
     *     // ... filter to delete one ItemDevolucao
     *   }
     * })
     * 
     */
    delete<T extends ItemDevolucaoDeleteArgs>(args: SelectSubset<T, ItemDevolucaoDeleteArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ItemDevolucao.
     * @param {ItemDevolucaoUpdateArgs} args - Arguments to update one ItemDevolucao.
     * @example
     * // Update one ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemDevolucaoUpdateArgs>(args: SelectSubset<T, ItemDevolucaoUpdateArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ItemDevolucaos.
     * @param {ItemDevolucaoDeleteManyArgs} args - Arguments to filter ItemDevolucaos to delete.
     * @example
     * // Delete a few ItemDevolucaos
     * const { count } = await prisma.itemDevolucao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemDevolucaoDeleteManyArgs>(args?: SelectSubset<T, ItemDevolucaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemDevolucaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemDevolucaos
     * const itemDevolucao = await prisma.itemDevolucao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemDevolucaoUpdateManyArgs>(args: SelectSubset<T, ItemDevolucaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemDevolucao.
     * @param {ItemDevolucaoUpsertArgs} args - Arguments to update or create a ItemDevolucao.
     * @example
     * // Update or create a ItemDevolucao
     * const itemDevolucao = await prisma.itemDevolucao.upsert({
     *   create: {
     *     // ... data to create a ItemDevolucao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemDevolucao we want to update
     *   }
     * })
     */
    upsert<T extends ItemDevolucaoUpsertArgs>(args: SelectSubset<T, ItemDevolucaoUpsertArgs<ExtArgs>>): Prisma__ItemDevolucaoClient<$Result.GetResult<Prisma.$ItemDevolucaoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ItemDevolucaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoCountArgs} args - Arguments to filter ItemDevolucaos to count.
     * @example
     * // Count the number of ItemDevolucaos
     * const count = await prisma.itemDevolucao.count({
     *   where: {
     *     // ... the filter for the ItemDevolucaos we want to count
     *   }
     * })
    **/
    count<T extends ItemDevolucaoCountArgs>(
      args?: Subset<T, ItemDevolucaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemDevolucaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemDevolucao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemDevolucaoAggregateArgs>(args: Subset<T, ItemDevolucaoAggregateArgs>): Prisma.PrismaPromise<GetItemDevolucaoAggregateType<T>>

    /**
     * Group by ItemDevolucao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemDevolucaoGroupByArgs} args - Group by arguments.
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
      T extends ItemDevolucaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemDevolucaoGroupByArgs['orderBy'] }
        : { orderBy?: ItemDevolucaoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemDevolucaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemDevolucaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemDevolucao model
   */
  readonly fields: ItemDevolucaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemDevolucao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemDevolucaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    devolucao<T extends DevolucaoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DevolucaoDefaultArgs<ExtArgs>>): Prisma__DevolucaoClient<$Result.GetResult<Prisma.$DevolucaoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    itemPedido<T extends ItemPedidoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemPedidoDefaultArgs<ExtArgs>>): Prisma__ItemPedidoClient<$Result.GetResult<Prisma.$ItemPedidoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ItemDevolucao model
   */ 
  interface ItemDevolucaoFieldRefs {
    readonly id: FieldRef<"ItemDevolucao", 'String'>
    readonly devolucaoId: FieldRef<"ItemDevolucao", 'String'>
    readonly itemPedidoId: FieldRef<"ItemDevolucao", 'String'>
    readonly quantidade: FieldRef<"ItemDevolucao", 'Int'>
    readonly motivo: FieldRef<"ItemDevolucao", 'String'>
    readonly criadoEm: FieldRef<"ItemDevolucao", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemDevolucao findUnique
   */
  export type ItemDevolucaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which ItemDevolucao to fetch.
     */
    where: ItemDevolucaoWhereUniqueInput
  }

  /**
   * ItemDevolucao findUniqueOrThrow
   */
  export type ItemDevolucaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which ItemDevolucao to fetch.
     */
    where: ItemDevolucaoWhereUniqueInput
  }

  /**
   * ItemDevolucao findFirst
   */
  export type ItemDevolucaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which ItemDevolucao to fetch.
     */
    where?: ItemDevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemDevolucaos to fetch.
     */
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemDevolucaos.
     */
    cursor?: ItemDevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemDevolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemDevolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemDevolucaos.
     */
    distinct?: ItemDevolucaoScalarFieldEnum | ItemDevolucaoScalarFieldEnum[]
  }

  /**
   * ItemDevolucao findFirstOrThrow
   */
  export type ItemDevolucaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which ItemDevolucao to fetch.
     */
    where?: ItemDevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemDevolucaos to fetch.
     */
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemDevolucaos.
     */
    cursor?: ItemDevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemDevolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemDevolucaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemDevolucaos.
     */
    distinct?: ItemDevolucaoScalarFieldEnum | ItemDevolucaoScalarFieldEnum[]
  }

  /**
   * ItemDevolucao findMany
   */
  export type ItemDevolucaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter, which ItemDevolucaos to fetch.
     */
    where?: ItemDevolucaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemDevolucaos to fetch.
     */
    orderBy?: ItemDevolucaoOrderByWithRelationInput | ItemDevolucaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemDevolucaos.
     */
    cursor?: ItemDevolucaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemDevolucaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemDevolucaos.
     */
    skip?: number
    distinct?: ItemDevolucaoScalarFieldEnum | ItemDevolucaoScalarFieldEnum[]
  }

  /**
   * ItemDevolucao create
   */
  export type ItemDevolucaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemDevolucao.
     */
    data: XOR<ItemDevolucaoCreateInput, ItemDevolucaoUncheckedCreateInput>
  }

  /**
   * ItemDevolucao createMany
   */
  export type ItemDevolucaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemDevolucaos.
     */
    data: ItemDevolucaoCreateManyInput | ItemDevolucaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemDevolucao createManyAndReturn
   */
  export type ItemDevolucaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ItemDevolucaos.
     */
    data: ItemDevolucaoCreateManyInput | ItemDevolucaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ItemDevolucao update
   */
  export type ItemDevolucaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemDevolucao.
     */
    data: XOR<ItemDevolucaoUpdateInput, ItemDevolucaoUncheckedUpdateInput>
    /**
     * Choose, which ItemDevolucao to update.
     */
    where: ItemDevolucaoWhereUniqueInput
  }

  /**
   * ItemDevolucao updateMany
   */
  export type ItemDevolucaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemDevolucaos.
     */
    data: XOR<ItemDevolucaoUpdateManyMutationInput, ItemDevolucaoUncheckedUpdateManyInput>
    /**
     * Filter which ItemDevolucaos to update
     */
    where?: ItemDevolucaoWhereInput
  }

  /**
   * ItemDevolucao upsert
   */
  export type ItemDevolucaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemDevolucao to update in case it exists.
     */
    where: ItemDevolucaoWhereUniqueInput
    /**
     * In case the ItemDevolucao found by the `where` argument doesn't exist, create a new ItemDevolucao with this data.
     */
    create: XOR<ItemDevolucaoCreateInput, ItemDevolucaoUncheckedCreateInput>
    /**
     * In case the ItemDevolucao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemDevolucaoUpdateInput, ItemDevolucaoUncheckedUpdateInput>
  }

  /**
   * ItemDevolucao delete
   */
  export type ItemDevolucaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
    /**
     * Filter which ItemDevolucao to delete.
     */
    where: ItemDevolucaoWhereUniqueInput
  }

  /**
   * ItemDevolucao deleteMany
   */
  export type ItemDevolucaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemDevolucaos to delete
     */
    where?: ItemDevolucaoWhereInput
  }

  /**
   * ItemDevolucao without action
   */
  export type ItemDevolucaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemDevolucao
     */
    select?: ItemDevolucaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemDevolucaoInclude<ExtArgs> | null
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


  export const PedidoScalarFieldEnum: {
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

  export type PedidoScalarFieldEnum = (typeof PedidoScalarFieldEnum)[keyof typeof PedidoScalarFieldEnum]


  export const ItemPedidoScalarFieldEnum: {
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

  export type ItemPedidoScalarFieldEnum = (typeof ItemPedidoScalarFieldEnum)[keyof typeof ItemPedidoScalarFieldEnum]


  export const HistoricoPedidoScalarFieldEnum: {
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

  export type HistoricoPedidoScalarFieldEnum = (typeof HistoricoPedidoScalarFieldEnum)[keyof typeof HistoricoPedidoScalarFieldEnum]


  export const PagamentoScalarFieldEnum: {
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

  export type PagamentoScalarFieldEnum = (typeof PagamentoScalarFieldEnum)[keyof typeof PagamentoScalarFieldEnum]


  export const DevolucaoScalarFieldEnum: {
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

  export type DevolucaoScalarFieldEnum = (typeof DevolucaoScalarFieldEnum)[keyof typeof DevolucaoScalarFieldEnum]


  export const ItemDevolucaoScalarFieldEnum: {
    id: 'id',
    devolucaoId: 'devolucaoId',
    itemPedidoId: 'itemPedidoId',
    quantidade: 'quantidade',
    motivo: 'motivo',
    criadoEm: 'criadoEm'
  };

  export type ItemDevolucaoScalarFieldEnum = (typeof ItemDevolucaoScalarFieldEnum)[keyof typeof ItemDevolucaoScalarFieldEnum]


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


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type PedidoWhereInput = {
    AND?: PedidoWhereInput | PedidoWhereInput[]
    OR?: PedidoWhereInput[]
    NOT?: PedidoWhereInput | PedidoWhereInput[]
    id?: UuidFilter<"Pedido"> | string
    tenantId?: UuidFilter<"Pedido"> | string
    numero?: IntFilter<"Pedido"> | number
    clienteId?: UuidNullableFilter<"Pedido"> | string | null
    clienteNome?: StringFilter<"Pedido"> | string
    clienteEmail?: StringNullableFilter<"Pedido"> | string | null
    clienteCpfCnpj?: StringNullableFilter<"Pedido"> | string | null
    origem?: StringFilter<"Pedido"> | string
    canalOrigem?: StringNullableFilter<"Pedido"> | string | null
    pedidoExternoId?: StringNullableFilter<"Pedido"> | string | null
    status?: StringFilter<"Pedido"> | string
    statusPagamento?: StringFilter<"Pedido"> | string
    metodoPagamento?: StringNullableFilter<"Pedido"> | string | null
    parcelas?: IntFilter<"Pedido"> | number
    valorProdutos?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    observacao?: StringNullableFilter<"Pedido"> | string | null
    enderecoEntrega?: JsonNullableFilter<"Pedido">
    rastreamento?: StringNullableFilter<"Pedido"> | string | null
    codigoRastreio?: StringNullableFilter<"Pedido"> | string | null
    transportadora?: StringNullableFilter<"Pedido"> | string | null
    prazoEntrega?: IntNullableFilter<"Pedido"> | number | null
    dataAprovacao?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataSeparacao?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataFaturamento?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataEnvio?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataEntrega?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataCancelamento?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    motivoCancelamento?: StringNullableFilter<"Pedido"> | string | null
    notaFiscalId?: UuidNullableFilter<"Pedido"> | string | null
    criadoEm?: DateTimeFilter<"Pedido"> | Date | string
    atualizadoEm?: DateTimeFilter<"Pedido"> | Date | string
    itens?: ItemPedidoListRelationFilter
    historico?: HistoricoPedidoListRelationFilter
    pagamentos?: PagamentoListRelationFilter
    devolucoes?: DevolucaoListRelationFilter
  }

  export type PedidoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    numero?: SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    clienteEmail?: SortOrderInput | SortOrder
    clienteCpfCnpj?: SortOrderInput | SortOrder
    origem?: SortOrder
    canalOrigem?: SortOrderInput | SortOrder
    pedidoExternoId?: SortOrderInput | SortOrder
    status?: SortOrder
    statusPagamento?: SortOrder
    metodoPagamento?: SortOrderInput | SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    observacao?: SortOrderInput | SortOrder
    enderecoEntrega?: SortOrderInput | SortOrder
    rastreamento?: SortOrderInput | SortOrder
    codigoRastreio?: SortOrderInput | SortOrder
    transportadora?: SortOrderInput | SortOrder
    prazoEntrega?: SortOrderInput | SortOrder
    dataAprovacao?: SortOrderInput | SortOrder
    dataSeparacao?: SortOrderInput | SortOrder
    dataFaturamento?: SortOrderInput | SortOrder
    dataEnvio?: SortOrderInput | SortOrder
    dataEntrega?: SortOrderInput | SortOrder
    dataCancelamento?: SortOrderInput | SortOrder
    motivoCancelamento?: SortOrderInput | SortOrder
    notaFiscalId?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    itens?: ItemPedidoOrderByRelationAggregateInput
    historico?: HistoricoPedidoOrderByRelationAggregateInput
    pagamentos?: PagamentoOrderByRelationAggregateInput
    devolucoes?: DevolucaoOrderByRelationAggregateInput
  }

  export type PedidoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    pedidoExternoId?: string
    tenantId_numero?: PedidoTenantIdNumeroCompoundUniqueInput
    AND?: PedidoWhereInput | PedidoWhereInput[]
    OR?: PedidoWhereInput[]
    NOT?: PedidoWhereInput | PedidoWhereInput[]
    tenantId?: UuidFilter<"Pedido"> | string
    numero?: IntFilter<"Pedido"> | number
    clienteId?: UuidNullableFilter<"Pedido"> | string | null
    clienteNome?: StringFilter<"Pedido"> | string
    clienteEmail?: StringNullableFilter<"Pedido"> | string | null
    clienteCpfCnpj?: StringNullableFilter<"Pedido"> | string | null
    origem?: StringFilter<"Pedido"> | string
    canalOrigem?: StringNullableFilter<"Pedido"> | string | null
    status?: StringFilter<"Pedido"> | string
    statusPagamento?: StringFilter<"Pedido"> | string
    metodoPagamento?: StringNullableFilter<"Pedido"> | string | null
    parcelas?: IntFilter<"Pedido"> | number
    valorProdutos?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    observacao?: StringNullableFilter<"Pedido"> | string | null
    enderecoEntrega?: JsonNullableFilter<"Pedido">
    rastreamento?: StringNullableFilter<"Pedido"> | string | null
    codigoRastreio?: StringNullableFilter<"Pedido"> | string | null
    transportadora?: StringNullableFilter<"Pedido"> | string | null
    prazoEntrega?: IntNullableFilter<"Pedido"> | number | null
    dataAprovacao?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataSeparacao?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataFaturamento?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataEnvio?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataEntrega?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    dataCancelamento?: DateTimeNullableFilter<"Pedido"> | Date | string | null
    motivoCancelamento?: StringNullableFilter<"Pedido"> | string | null
    notaFiscalId?: UuidNullableFilter<"Pedido"> | string | null
    criadoEm?: DateTimeFilter<"Pedido"> | Date | string
    atualizadoEm?: DateTimeFilter<"Pedido"> | Date | string
    itens?: ItemPedidoListRelationFilter
    historico?: HistoricoPedidoListRelationFilter
    pagamentos?: PagamentoListRelationFilter
    devolucoes?: DevolucaoListRelationFilter
  }, "id" | "pedidoExternoId" | "tenantId_numero">

  export type PedidoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    numero?: SortOrder
    clienteId?: SortOrderInput | SortOrder
    clienteNome?: SortOrder
    clienteEmail?: SortOrderInput | SortOrder
    clienteCpfCnpj?: SortOrderInput | SortOrder
    origem?: SortOrder
    canalOrigem?: SortOrderInput | SortOrder
    pedidoExternoId?: SortOrderInput | SortOrder
    status?: SortOrder
    statusPagamento?: SortOrder
    metodoPagamento?: SortOrderInput | SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    observacao?: SortOrderInput | SortOrder
    enderecoEntrega?: SortOrderInput | SortOrder
    rastreamento?: SortOrderInput | SortOrder
    codigoRastreio?: SortOrderInput | SortOrder
    transportadora?: SortOrderInput | SortOrder
    prazoEntrega?: SortOrderInput | SortOrder
    dataAprovacao?: SortOrderInput | SortOrder
    dataSeparacao?: SortOrderInput | SortOrder
    dataFaturamento?: SortOrderInput | SortOrder
    dataEnvio?: SortOrderInput | SortOrder
    dataEntrega?: SortOrderInput | SortOrder
    dataCancelamento?: SortOrderInput | SortOrder
    motivoCancelamento?: SortOrderInput | SortOrder
    notaFiscalId?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: PedidoCountOrderByAggregateInput
    _avg?: PedidoAvgOrderByAggregateInput
    _max?: PedidoMaxOrderByAggregateInput
    _min?: PedidoMinOrderByAggregateInput
    _sum?: PedidoSumOrderByAggregateInput
  }

  export type PedidoScalarWhereWithAggregatesInput = {
    AND?: PedidoScalarWhereWithAggregatesInput | PedidoScalarWhereWithAggregatesInput[]
    OR?: PedidoScalarWhereWithAggregatesInput[]
    NOT?: PedidoScalarWhereWithAggregatesInput | PedidoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Pedido"> | string
    tenantId?: UuidWithAggregatesFilter<"Pedido"> | string
    numero?: IntWithAggregatesFilter<"Pedido"> | number
    clienteId?: UuidNullableWithAggregatesFilter<"Pedido"> | string | null
    clienteNome?: StringWithAggregatesFilter<"Pedido"> | string
    clienteEmail?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    clienteCpfCnpj?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    origem?: StringWithAggregatesFilter<"Pedido"> | string
    canalOrigem?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    pedidoExternoId?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    status?: StringWithAggregatesFilter<"Pedido"> | string
    statusPagamento?: StringWithAggregatesFilter<"Pedido"> | string
    metodoPagamento?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    parcelas?: IntWithAggregatesFilter<"Pedido"> | number
    valorProdutos?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalWithAggregatesFilter<"Pedido"> | Decimal | DecimalJsLike | number | string
    observacao?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    enderecoEntrega?: JsonNullableWithAggregatesFilter<"Pedido">
    rastreamento?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    codigoRastreio?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    transportadora?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    prazoEntrega?: IntNullableWithAggregatesFilter<"Pedido"> | number | null
    dataAprovacao?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    dataSeparacao?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    dataFaturamento?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    dataEnvio?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    dataEntrega?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    dataCancelamento?: DateTimeNullableWithAggregatesFilter<"Pedido"> | Date | string | null
    motivoCancelamento?: StringNullableWithAggregatesFilter<"Pedido"> | string | null
    notaFiscalId?: UuidNullableWithAggregatesFilter<"Pedido"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Pedido"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Pedido"> | Date | string
  }

  export type ItemPedidoWhereInput = {
    AND?: ItemPedidoWhereInput | ItemPedidoWhereInput[]
    OR?: ItemPedidoWhereInput[]
    NOT?: ItemPedidoWhereInput | ItemPedidoWhereInput[]
    id?: UuidFilter<"ItemPedido"> | string
    pedidoId?: UuidFilter<"ItemPedido"> | string
    produtoId?: UuidFilter<"ItemPedido"> | string
    variacaoId?: UuidNullableFilter<"ItemPedido"> | string | null
    sku?: StringFilter<"ItemPedido"> | string
    titulo?: StringFilter<"ItemPedido"> | string
    quantidade?: IntFilter<"ItemPedido"> | number
    valorUnitario?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    peso?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    largura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    altura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    comprimento?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFilter<"ItemPedido"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
    itensDevolvidos?: ItemDevolucaoListRelationFilter
  }

  export type ItemPedidoOrderByWithRelationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    produtoId?: SortOrder
    variacaoId?: SortOrderInput | SortOrder
    sku?: SortOrder
    titulo?: SortOrder
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrderInput | SortOrder
    largura?: SortOrderInput | SortOrder
    altura?: SortOrderInput | SortOrder
    comprimento?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    pedido?: PedidoOrderByWithRelationInput
    itensDevolvidos?: ItemDevolucaoOrderByRelationAggregateInput
  }

  export type ItemPedidoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ItemPedidoWhereInput | ItemPedidoWhereInput[]
    OR?: ItemPedidoWhereInput[]
    NOT?: ItemPedidoWhereInput | ItemPedidoWhereInput[]
    pedidoId?: UuidFilter<"ItemPedido"> | string
    produtoId?: UuidFilter<"ItemPedido"> | string
    variacaoId?: UuidNullableFilter<"ItemPedido"> | string | null
    sku?: StringFilter<"ItemPedido"> | string
    titulo?: StringFilter<"ItemPedido"> | string
    quantidade?: IntFilter<"ItemPedido"> | number
    valorUnitario?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    peso?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    largura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    altura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    comprimento?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFilter<"ItemPedido"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
    itensDevolvidos?: ItemDevolucaoListRelationFilter
  }, "id">

  export type ItemPedidoOrderByWithAggregationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    produtoId?: SortOrder
    variacaoId?: SortOrderInput | SortOrder
    sku?: SortOrder
    titulo?: SortOrder
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrderInput | SortOrder
    largura?: SortOrderInput | SortOrder
    altura?: SortOrderInput | SortOrder
    comprimento?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: ItemPedidoCountOrderByAggregateInput
    _avg?: ItemPedidoAvgOrderByAggregateInput
    _max?: ItemPedidoMaxOrderByAggregateInput
    _min?: ItemPedidoMinOrderByAggregateInput
    _sum?: ItemPedidoSumOrderByAggregateInput
  }

  export type ItemPedidoScalarWhereWithAggregatesInput = {
    AND?: ItemPedidoScalarWhereWithAggregatesInput | ItemPedidoScalarWhereWithAggregatesInput[]
    OR?: ItemPedidoScalarWhereWithAggregatesInput[]
    NOT?: ItemPedidoScalarWhereWithAggregatesInput | ItemPedidoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ItemPedido"> | string
    pedidoId?: UuidWithAggregatesFilter<"ItemPedido"> | string
    produtoId?: UuidWithAggregatesFilter<"ItemPedido"> | string
    variacaoId?: UuidNullableWithAggregatesFilter<"ItemPedido"> | string | null
    sku?: StringWithAggregatesFilter<"ItemPedido"> | string
    titulo?: StringWithAggregatesFilter<"ItemPedido"> | string
    quantidade?: IntWithAggregatesFilter<"ItemPedido"> | number
    valorUnitario?: DecimalWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    peso?: DecimalNullableWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    largura?: DecimalNullableWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    altura?: DecimalNullableWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    comprimento?: DecimalNullableWithAggregatesFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"ItemPedido"> | Date | string
  }

  export type HistoricoPedidoWhereInput = {
    AND?: HistoricoPedidoWhereInput | HistoricoPedidoWhereInput[]
    OR?: HistoricoPedidoWhereInput[]
    NOT?: HistoricoPedidoWhereInput | HistoricoPedidoWhereInput[]
    id?: UuidFilter<"HistoricoPedido"> | string
    pedidoId?: UuidFilter<"HistoricoPedido"> | string
    tenantId?: UuidFilter<"HistoricoPedido"> | string
    statusAnterior?: StringNullableFilter<"HistoricoPedido"> | string | null
    statusNovo?: StringFilter<"HistoricoPedido"> | string
    descricao?: StringFilter<"HistoricoPedido"> | string
    usuarioId?: UuidNullableFilter<"HistoricoPedido"> | string | null
    dadosExtras?: JsonNullableFilter<"HistoricoPedido">
    criadoEm?: DateTimeFilter<"HistoricoPedido"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
  }

  export type HistoricoPedidoOrderByWithRelationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    statusAnterior?: SortOrderInput | SortOrder
    statusNovo?: SortOrder
    descricao?: SortOrder
    usuarioId?: SortOrderInput | SortOrder
    dadosExtras?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    pedido?: PedidoOrderByWithRelationInput
  }

  export type HistoricoPedidoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HistoricoPedidoWhereInput | HistoricoPedidoWhereInput[]
    OR?: HistoricoPedidoWhereInput[]
    NOT?: HistoricoPedidoWhereInput | HistoricoPedidoWhereInput[]
    pedidoId?: UuidFilter<"HistoricoPedido"> | string
    tenantId?: UuidFilter<"HistoricoPedido"> | string
    statusAnterior?: StringNullableFilter<"HistoricoPedido"> | string | null
    statusNovo?: StringFilter<"HistoricoPedido"> | string
    descricao?: StringFilter<"HistoricoPedido"> | string
    usuarioId?: UuidNullableFilter<"HistoricoPedido"> | string | null
    dadosExtras?: JsonNullableFilter<"HistoricoPedido">
    criadoEm?: DateTimeFilter<"HistoricoPedido"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
  }, "id">

  export type HistoricoPedidoOrderByWithAggregationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    statusAnterior?: SortOrderInput | SortOrder
    statusNovo?: SortOrder
    descricao?: SortOrder
    usuarioId?: SortOrderInput | SortOrder
    dadosExtras?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: HistoricoPedidoCountOrderByAggregateInput
    _max?: HistoricoPedidoMaxOrderByAggregateInput
    _min?: HistoricoPedidoMinOrderByAggregateInput
  }

  export type HistoricoPedidoScalarWhereWithAggregatesInput = {
    AND?: HistoricoPedidoScalarWhereWithAggregatesInput | HistoricoPedidoScalarWhereWithAggregatesInput[]
    OR?: HistoricoPedidoScalarWhereWithAggregatesInput[]
    NOT?: HistoricoPedidoScalarWhereWithAggregatesInput | HistoricoPedidoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"HistoricoPedido"> | string
    pedidoId?: UuidWithAggregatesFilter<"HistoricoPedido"> | string
    tenantId?: UuidWithAggregatesFilter<"HistoricoPedido"> | string
    statusAnterior?: StringNullableWithAggregatesFilter<"HistoricoPedido"> | string | null
    statusNovo?: StringWithAggregatesFilter<"HistoricoPedido"> | string
    descricao?: StringWithAggregatesFilter<"HistoricoPedido"> | string
    usuarioId?: UuidNullableWithAggregatesFilter<"HistoricoPedido"> | string | null
    dadosExtras?: JsonNullableWithAggregatesFilter<"HistoricoPedido">
    criadoEm?: DateTimeWithAggregatesFilter<"HistoricoPedido"> | Date | string
  }

  export type PagamentoWhereInput = {
    AND?: PagamentoWhereInput | PagamentoWhereInput[]
    OR?: PagamentoWhereInput[]
    NOT?: PagamentoWhereInput | PagamentoWhereInput[]
    id?: UuidFilter<"Pagamento"> | string
    pedidoId?: UuidFilter<"Pagamento"> | string
    tenantId?: UuidFilter<"Pagamento"> | string
    tipo?: StringFilter<"Pagamento"> | string
    status?: StringFilter<"Pagamento"> | string
    valor?: DecimalFilter<"Pagamento"> | Decimal | DecimalJsLike | number | string
    parcelas?: IntFilter<"Pagamento"> | number
    gateway?: StringNullableFilter<"Pagamento"> | string | null
    transacaoExternaId?: StringNullableFilter<"Pagamento"> | string | null
    dadosGateway?: JsonNullableFilter<"Pagamento">
    dataPagamento?: DateTimeNullableFilter<"Pagamento"> | Date | string | null
    criadoEm?: DateTimeFilter<"Pagamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Pagamento"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
  }

  export type PagamentoOrderByWithRelationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    valor?: SortOrder
    parcelas?: SortOrder
    gateway?: SortOrderInput | SortOrder
    transacaoExternaId?: SortOrderInput | SortOrder
    dadosGateway?: SortOrderInput | SortOrder
    dataPagamento?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    pedido?: PedidoOrderByWithRelationInput
  }

  export type PagamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PagamentoWhereInput | PagamentoWhereInput[]
    OR?: PagamentoWhereInput[]
    NOT?: PagamentoWhereInput | PagamentoWhereInput[]
    pedidoId?: UuidFilter<"Pagamento"> | string
    tenantId?: UuidFilter<"Pagamento"> | string
    tipo?: StringFilter<"Pagamento"> | string
    status?: StringFilter<"Pagamento"> | string
    valor?: DecimalFilter<"Pagamento"> | Decimal | DecimalJsLike | number | string
    parcelas?: IntFilter<"Pagamento"> | number
    gateway?: StringNullableFilter<"Pagamento"> | string | null
    transacaoExternaId?: StringNullableFilter<"Pagamento"> | string | null
    dadosGateway?: JsonNullableFilter<"Pagamento">
    dataPagamento?: DateTimeNullableFilter<"Pagamento"> | Date | string | null
    criadoEm?: DateTimeFilter<"Pagamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Pagamento"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
  }, "id">

  export type PagamentoOrderByWithAggregationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    valor?: SortOrder
    parcelas?: SortOrder
    gateway?: SortOrderInput | SortOrder
    transacaoExternaId?: SortOrderInput | SortOrder
    dadosGateway?: SortOrderInput | SortOrder
    dataPagamento?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: PagamentoCountOrderByAggregateInput
    _avg?: PagamentoAvgOrderByAggregateInput
    _max?: PagamentoMaxOrderByAggregateInput
    _min?: PagamentoMinOrderByAggregateInput
    _sum?: PagamentoSumOrderByAggregateInput
  }

  export type PagamentoScalarWhereWithAggregatesInput = {
    AND?: PagamentoScalarWhereWithAggregatesInput | PagamentoScalarWhereWithAggregatesInput[]
    OR?: PagamentoScalarWhereWithAggregatesInput[]
    NOT?: PagamentoScalarWhereWithAggregatesInput | PagamentoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Pagamento"> | string
    pedidoId?: UuidWithAggregatesFilter<"Pagamento"> | string
    tenantId?: UuidWithAggregatesFilter<"Pagamento"> | string
    tipo?: StringWithAggregatesFilter<"Pagamento"> | string
    status?: StringWithAggregatesFilter<"Pagamento"> | string
    valor?: DecimalWithAggregatesFilter<"Pagamento"> | Decimal | DecimalJsLike | number | string
    parcelas?: IntWithAggregatesFilter<"Pagamento"> | number
    gateway?: StringNullableWithAggregatesFilter<"Pagamento"> | string | null
    transacaoExternaId?: StringNullableWithAggregatesFilter<"Pagamento"> | string | null
    dadosGateway?: JsonNullableWithAggregatesFilter<"Pagamento">
    dataPagamento?: DateTimeNullableWithAggregatesFilter<"Pagamento"> | Date | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Pagamento"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Pagamento"> | Date | string
  }

  export type DevolucaoWhereInput = {
    AND?: DevolucaoWhereInput | DevolucaoWhereInput[]
    OR?: DevolucaoWhereInput[]
    NOT?: DevolucaoWhereInput | DevolucaoWhereInput[]
    id?: UuidFilter<"Devolucao"> | string
    pedidoId?: UuidFilter<"Devolucao"> | string
    tenantId?: UuidFilter<"Devolucao"> | string
    motivo?: StringFilter<"Devolucao"> | string
    status?: StringFilter<"Devolucao"> | string
    valorReembolso?: DecimalFilter<"Devolucao"> | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: StringNullableFilter<"Devolucao"> | string | null
    observacao?: StringNullableFilter<"Devolucao"> | string | null
    criadoEm?: DateTimeFilter<"Devolucao"> | Date | string
    atualizadoEm?: DateTimeFilter<"Devolucao"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
    itens?: ItemDevolucaoListRelationFilter
  }

  export type DevolucaoOrderByWithRelationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    motivo?: SortOrder
    status?: SortOrder
    valorReembolso?: SortOrder
    codigoRastreioRetorno?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    pedido?: PedidoOrderByWithRelationInput
    itens?: ItemDevolucaoOrderByRelationAggregateInput
  }

  export type DevolucaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DevolucaoWhereInput | DevolucaoWhereInput[]
    OR?: DevolucaoWhereInput[]
    NOT?: DevolucaoWhereInput | DevolucaoWhereInput[]
    pedidoId?: UuidFilter<"Devolucao"> | string
    tenantId?: UuidFilter<"Devolucao"> | string
    motivo?: StringFilter<"Devolucao"> | string
    status?: StringFilter<"Devolucao"> | string
    valorReembolso?: DecimalFilter<"Devolucao"> | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: StringNullableFilter<"Devolucao"> | string | null
    observacao?: StringNullableFilter<"Devolucao"> | string | null
    criadoEm?: DateTimeFilter<"Devolucao"> | Date | string
    atualizadoEm?: DateTimeFilter<"Devolucao"> | Date | string
    pedido?: XOR<PedidoRelationFilter, PedidoWhereInput>
    itens?: ItemDevolucaoListRelationFilter
  }, "id">

  export type DevolucaoOrderByWithAggregationInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    motivo?: SortOrder
    status?: SortOrder
    valorReembolso?: SortOrder
    codigoRastreioRetorno?: SortOrderInput | SortOrder
    observacao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: DevolucaoCountOrderByAggregateInput
    _avg?: DevolucaoAvgOrderByAggregateInput
    _max?: DevolucaoMaxOrderByAggregateInput
    _min?: DevolucaoMinOrderByAggregateInput
    _sum?: DevolucaoSumOrderByAggregateInput
  }

  export type DevolucaoScalarWhereWithAggregatesInput = {
    AND?: DevolucaoScalarWhereWithAggregatesInput | DevolucaoScalarWhereWithAggregatesInput[]
    OR?: DevolucaoScalarWhereWithAggregatesInput[]
    NOT?: DevolucaoScalarWhereWithAggregatesInput | DevolucaoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Devolucao"> | string
    pedidoId?: UuidWithAggregatesFilter<"Devolucao"> | string
    tenantId?: UuidWithAggregatesFilter<"Devolucao"> | string
    motivo?: StringWithAggregatesFilter<"Devolucao"> | string
    status?: StringWithAggregatesFilter<"Devolucao"> | string
    valorReembolso?: DecimalWithAggregatesFilter<"Devolucao"> | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: StringNullableWithAggregatesFilter<"Devolucao"> | string | null
    observacao?: StringNullableWithAggregatesFilter<"Devolucao"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Devolucao"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Devolucao"> | Date | string
  }

  export type ItemDevolucaoWhereInput = {
    AND?: ItemDevolucaoWhereInput | ItemDevolucaoWhereInput[]
    OR?: ItemDevolucaoWhereInput[]
    NOT?: ItemDevolucaoWhereInput | ItemDevolucaoWhereInput[]
    id?: UuidFilter<"ItemDevolucao"> | string
    devolucaoId?: UuidFilter<"ItemDevolucao"> | string
    itemPedidoId?: UuidFilter<"ItemDevolucao"> | string
    quantidade?: IntFilter<"ItemDevolucao"> | number
    motivo?: StringFilter<"ItemDevolucao"> | string
    criadoEm?: DateTimeFilter<"ItemDevolucao"> | Date | string
    devolucao?: XOR<DevolucaoRelationFilter, DevolucaoWhereInput>
    itemPedido?: XOR<ItemPedidoRelationFilter, ItemPedidoWhereInput>
  }

  export type ItemDevolucaoOrderByWithRelationInput = {
    id?: SortOrder
    devolucaoId?: SortOrder
    itemPedidoId?: SortOrder
    quantidade?: SortOrder
    motivo?: SortOrder
    criadoEm?: SortOrder
    devolucao?: DevolucaoOrderByWithRelationInput
    itemPedido?: ItemPedidoOrderByWithRelationInput
  }

  export type ItemDevolucaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ItemDevolucaoWhereInput | ItemDevolucaoWhereInput[]
    OR?: ItemDevolucaoWhereInput[]
    NOT?: ItemDevolucaoWhereInput | ItemDevolucaoWhereInput[]
    devolucaoId?: UuidFilter<"ItemDevolucao"> | string
    itemPedidoId?: UuidFilter<"ItemDevolucao"> | string
    quantidade?: IntFilter<"ItemDevolucao"> | number
    motivo?: StringFilter<"ItemDevolucao"> | string
    criadoEm?: DateTimeFilter<"ItemDevolucao"> | Date | string
    devolucao?: XOR<DevolucaoRelationFilter, DevolucaoWhereInput>
    itemPedido?: XOR<ItemPedidoRelationFilter, ItemPedidoWhereInput>
  }, "id">

  export type ItemDevolucaoOrderByWithAggregationInput = {
    id?: SortOrder
    devolucaoId?: SortOrder
    itemPedidoId?: SortOrder
    quantidade?: SortOrder
    motivo?: SortOrder
    criadoEm?: SortOrder
    _count?: ItemDevolucaoCountOrderByAggregateInput
    _avg?: ItemDevolucaoAvgOrderByAggregateInput
    _max?: ItemDevolucaoMaxOrderByAggregateInput
    _min?: ItemDevolucaoMinOrderByAggregateInput
    _sum?: ItemDevolucaoSumOrderByAggregateInput
  }

  export type ItemDevolucaoScalarWhereWithAggregatesInput = {
    AND?: ItemDevolucaoScalarWhereWithAggregatesInput | ItemDevolucaoScalarWhereWithAggregatesInput[]
    OR?: ItemDevolucaoScalarWhereWithAggregatesInput[]
    NOT?: ItemDevolucaoScalarWhereWithAggregatesInput | ItemDevolucaoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ItemDevolucao"> | string
    devolucaoId?: UuidWithAggregatesFilter<"ItemDevolucao"> | string
    itemPedidoId?: UuidWithAggregatesFilter<"ItemDevolucao"> | string
    quantidade?: IntWithAggregatesFilter<"ItemDevolucao"> | number
    motivo?: StringWithAggregatesFilter<"ItemDevolucao"> | string
    criadoEm?: DateTimeWithAggregatesFilter<"ItemDevolucao"> | Date | string
  }

  export type PedidoCreateInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUncheckedCreateInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoUncheckedCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoUncheckedCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoUncheckedCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUncheckedUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUncheckedUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoCreateManyInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type PedidoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PedidoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPedidoCreateInput = {
    id?: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutItensInput
    itensDevolvidos?: ItemDevolucaoCreateNestedManyWithoutItemPedidoInput
  }

  export type ItemPedidoUncheckedCreateInput = {
    id?: string
    pedidoId: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
    itensDevolvidos?: ItemDevolucaoUncheckedCreateNestedManyWithoutItemPedidoInput
  }

  export type ItemPedidoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutItensNestedInput
    itensDevolvidos?: ItemDevolucaoUpdateManyWithoutItemPedidoNestedInput
  }

  export type ItemPedidoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itensDevolvidos?: ItemDevolucaoUncheckedUpdateManyWithoutItemPedidoNestedInput
  }

  export type ItemPedidoCreateManyInput = {
    id?: string
    pedidoId: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
  }

  export type ItemPedidoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPedidoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoCreateInput = {
    id?: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutHistoricoInput
  }

  export type HistoricoPedidoUncheckedCreateInput = {
    id?: string
    pedidoId: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type HistoricoPedidoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutHistoricoNestedInput
  }

  export type HistoricoPedidoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoCreateManyInput = {
    id?: string
    pedidoId: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type HistoricoPedidoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoCreateInput = {
    id?: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutPagamentosInput
  }

  export type PagamentoUncheckedCreateInput = {
    id?: string
    pedidoId: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type PagamentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutPagamentosNestedInput
  }

  export type PagamentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoCreateManyInput = {
    id?: string
    pedidoId: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type PagamentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DevolucaoCreateInput = {
    id?: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutDevolucoesInput
    itens?: ItemDevolucaoCreateNestedManyWithoutDevolucaoInput
  }

  export type DevolucaoUncheckedCreateInput = {
    id?: string
    pedidoId: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemDevolucaoUncheckedCreateNestedManyWithoutDevolucaoInput
  }

  export type DevolucaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutDevolucoesNestedInput
    itens?: ItemDevolucaoUpdateManyWithoutDevolucaoNestedInput
  }

  export type DevolucaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemDevolucaoUncheckedUpdateManyWithoutDevolucaoNestedInput
  }

  export type DevolucaoCreateManyInput = {
    id?: string
    pedidoId: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type DevolucaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DevolucaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoCreateInput = {
    id?: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
    devolucao: DevolucaoCreateNestedOneWithoutItensInput
    itemPedido: ItemPedidoCreateNestedOneWithoutItensDevolvidosInput
  }

  export type ItemDevolucaoUncheckedCreateInput = {
    id?: string
    devolucaoId: string
    itemPedidoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    devolucao?: DevolucaoUpdateOneRequiredWithoutItensNestedInput
    itemPedido?: ItemPedidoUpdateOneRequiredWithoutItensDevolvidosNestedInput
  }

  export type ItemDevolucaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    devolucaoId?: StringFieldUpdateOperationsInput | string
    itemPedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoCreateManyInput = {
    id?: string
    devolucaoId: string
    itemPedidoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    devolucaoId?: StringFieldUpdateOperationsInput | string
    itemPedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
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

  export type ItemPedidoListRelationFilter = {
    every?: ItemPedidoWhereInput
    some?: ItemPedidoWhereInput
    none?: ItemPedidoWhereInput
  }

  export type HistoricoPedidoListRelationFilter = {
    every?: HistoricoPedidoWhereInput
    some?: HistoricoPedidoWhereInput
    none?: HistoricoPedidoWhereInput
  }

  export type PagamentoListRelationFilter = {
    every?: PagamentoWhereInput
    some?: PagamentoWhereInput
    none?: PagamentoWhereInput
  }

  export type DevolucaoListRelationFilter = {
    every?: DevolucaoWhereInput
    some?: DevolucaoWhereInput
    none?: DevolucaoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ItemPedidoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HistoricoPedidoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PagamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DevolucaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PedidoTenantIdNumeroCompoundUniqueInput = {
    tenantId: string
    numero: number
  }

  export type PedidoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    numero?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteEmail?: SortOrder
    clienteCpfCnpj?: SortOrder
    origem?: SortOrder
    canalOrigem?: SortOrder
    pedidoExternoId?: SortOrder
    status?: SortOrder
    statusPagamento?: SortOrder
    metodoPagamento?: SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    observacao?: SortOrder
    enderecoEntrega?: SortOrder
    rastreamento?: SortOrder
    codigoRastreio?: SortOrder
    transportadora?: SortOrder
    prazoEntrega?: SortOrder
    dataAprovacao?: SortOrder
    dataSeparacao?: SortOrder
    dataFaturamento?: SortOrder
    dataEnvio?: SortOrder
    dataEntrega?: SortOrder
    dataCancelamento?: SortOrder
    motivoCancelamento?: SortOrder
    notaFiscalId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PedidoAvgOrderByAggregateInput = {
    numero?: SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    prazoEntrega?: SortOrder
  }

  export type PedidoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    numero?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteEmail?: SortOrder
    clienteCpfCnpj?: SortOrder
    origem?: SortOrder
    canalOrigem?: SortOrder
    pedidoExternoId?: SortOrder
    status?: SortOrder
    statusPagamento?: SortOrder
    metodoPagamento?: SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    observacao?: SortOrder
    rastreamento?: SortOrder
    codigoRastreio?: SortOrder
    transportadora?: SortOrder
    prazoEntrega?: SortOrder
    dataAprovacao?: SortOrder
    dataSeparacao?: SortOrder
    dataFaturamento?: SortOrder
    dataEnvio?: SortOrder
    dataEntrega?: SortOrder
    dataCancelamento?: SortOrder
    motivoCancelamento?: SortOrder
    notaFiscalId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PedidoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    numero?: SortOrder
    clienteId?: SortOrder
    clienteNome?: SortOrder
    clienteEmail?: SortOrder
    clienteCpfCnpj?: SortOrder
    origem?: SortOrder
    canalOrigem?: SortOrder
    pedidoExternoId?: SortOrder
    status?: SortOrder
    statusPagamento?: SortOrder
    metodoPagamento?: SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    observacao?: SortOrder
    rastreamento?: SortOrder
    codigoRastreio?: SortOrder
    transportadora?: SortOrder
    prazoEntrega?: SortOrder
    dataAprovacao?: SortOrder
    dataSeparacao?: SortOrder
    dataFaturamento?: SortOrder
    dataEnvio?: SortOrder
    dataEntrega?: SortOrder
    dataCancelamento?: SortOrder
    motivoCancelamento?: SortOrder
    notaFiscalId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PedidoSumOrderByAggregateInput = {
    numero?: SortOrder
    parcelas?: SortOrder
    valorProdutos?: SortOrder
    valorDesconto?: SortOrder
    valorFrete?: SortOrder
    valorTotal?: SortOrder
    prazoEntrega?: SortOrder
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

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type PedidoRelationFilter = {
    is?: PedidoWhereInput
    isNot?: PedidoWhereInput
  }

  export type ItemDevolucaoListRelationFilter = {
    every?: ItemDevolucaoWhereInput
    some?: ItemDevolucaoWhereInput
    none?: ItemDevolucaoWhereInput
  }

  export type ItemDevolucaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ItemPedidoCountOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    produtoId?: SortOrder
    variacaoId?: SortOrder
    sku?: SortOrder
    titulo?: SortOrder
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrder
    largura?: SortOrder
    altura?: SortOrder
    comprimento?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemPedidoAvgOrderByAggregateInput = {
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrder
    largura?: SortOrder
    altura?: SortOrder
    comprimento?: SortOrder
  }

  export type ItemPedidoMaxOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    produtoId?: SortOrder
    variacaoId?: SortOrder
    sku?: SortOrder
    titulo?: SortOrder
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrder
    largura?: SortOrder
    altura?: SortOrder
    comprimento?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemPedidoMinOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    produtoId?: SortOrder
    variacaoId?: SortOrder
    sku?: SortOrder
    titulo?: SortOrder
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrder
    largura?: SortOrder
    altura?: SortOrder
    comprimento?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemPedidoSumOrderByAggregateInput = {
    quantidade?: SortOrder
    valorUnitario?: SortOrder
    valorDesconto?: SortOrder
    valorTotal?: SortOrder
    peso?: SortOrder
    largura?: SortOrder
    altura?: SortOrder
    comprimento?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type HistoricoPedidoCountOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    statusAnterior?: SortOrder
    statusNovo?: SortOrder
    descricao?: SortOrder
    usuarioId?: SortOrder
    dadosExtras?: SortOrder
    criadoEm?: SortOrder
  }

  export type HistoricoPedidoMaxOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    statusAnterior?: SortOrder
    statusNovo?: SortOrder
    descricao?: SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
  }

  export type HistoricoPedidoMinOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    statusAnterior?: SortOrder
    statusNovo?: SortOrder
    descricao?: SortOrder
    usuarioId?: SortOrder
    criadoEm?: SortOrder
  }

  export type PagamentoCountOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    valor?: SortOrder
    parcelas?: SortOrder
    gateway?: SortOrder
    transacaoExternaId?: SortOrder
    dadosGateway?: SortOrder
    dataPagamento?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PagamentoAvgOrderByAggregateInput = {
    valor?: SortOrder
    parcelas?: SortOrder
  }

  export type PagamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    valor?: SortOrder
    parcelas?: SortOrder
    gateway?: SortOrder
    transacaoExternaId?: SortOrder
    dataPagamento?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PagamentoMinOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    tipo?: SortOrder
    status?: SortOrder
    valor?: SortOrder
    parcelas?: SortOrder
    gateway?: SortOrder
    transacaoExternaId?: SortOrder
    dataPagamento?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type PagamentoSumOrderByAggregateInput = {
    valor?: SortOrder
    parcelas?: SortOrder
  }

  export type DevolucaoCountOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    motivo?: SortOrder
    status?: SortOrder
    valorReembolso?: SortOrder
    codigoRastreioRetorno?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type DevolucaoAvgOrderByAggregateInput = {
    valorReembolso?: SortOrder
  }

  export type DevolucaoMaxOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    motivo?: SortOrder
    status?: SortOrder
    valorReembolso?: SortOrder
    codigoRastreioRetorno?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type DevolucaoMinOrderByAggregateInput = {
    id?: SortOrder
    pedidoId?: SortOrder
    tenantId?: SortOrder
    motivo?: SortOrder
    status?: SortOrder
    valorReembolso?: SortOrder
    codigoRastreioRetorno?: SortOrder
    observacao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type DevolucaoSumOrderByAggregateInput = {
    valorReembolso?: SortOrder
  }

  export type DevolucaoRelationFilter = {
    is?: DevolucaoWhereInput
    isNot?: DevolucaoWhereInput
  }

  export type ItemPedidoRelationFilter = {
    is?: ItemPedidoWhereInput
    isNot?: ItemPedidoWhereInput
  }

  export type ItemDevolucaoCountOrderByAggregateInput = {
    id?: SortOrder
    devolucaoId?: SortOrder
    itemPedidoId?: SortOrder
    quantidade?: SortOrder
    motivo?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemDevolucaoAvgOrderByAggregateInput = {
    quantidade?: SortOrder
  }

  export type ItemDevolucaoMaxOrderByAggregateInput = {
    id?: SortOrder
    devolucaoId?: SortOrder
    itemPedidoId?: SortOrder
    quantidade?: SortOrder
    motivo?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemDevolucaoMinOrderByAggregateInput = {
    id?: SortOrder
    devolucaoId?: SortOrder
    itemPedidoId?: SortOrder
    quantidade?: SortOrder
    motivo?: SortOrder
    criadoEm?: SortOrder
  }

  export type ItemDevolucaoSumOrderByAggregateInput = {
    quantidade?: SortOrder
  }

  export type ItemPedidoCreateNestedManyWithoutPedidoInput = {
    create?: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput> | ItemPedidoCreateWithoutPedidoInput[] | ItemPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutPedidoInput | ItemPedidoCreateOrConnectWithoutPedidoInput[]
    createMany?: ItemPedidoCreateManyPedidoInputEnvelope
    connect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
  }

  export type HistoricoPedidoCreateNestedManyWithoutPedidoInput = {
    create?: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput> | HistoricoPedidoCreateWithoutPedidoInput[] | HistoricoPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: HistoricoPedidoCreateOrConnectWithoutPedidoInput | HistoricoPedidoCreateOrConnectWithoutPedidoInput[]
    createMany?: HistoricoPedidoCreateManyPedidoInputEnvelope
    connect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
  }

  export type PagamentoCreateNestedManyWithoutPedidoInput = {
    create?: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput> | PagamentoCreateWithoutPedidoInput[] | PagamentoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutPedidoInput | PagamentoCreateOrConnectWithoutPedidoInput[]
    createMany?: PagamentoCreateManyPedidoInputEnvelope
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
  }

  export type DevolucaoCreateNestedManyWithoutPedidoInput = {
    create?: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput> | DevolucaoCreateWithoutPedidoInput[] | DevolucaoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: DevolucaoCreateOrConnectWithoutPedidoInput | DevolucaoCreateOrConnectWithoutPedidoInput[]
    createMany?: DevolucaoCreateManyPedidoInputEnvelope
    connect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
  }

  export type ItemPedidoUncheckedCreateNestedManyWithoutPedidoInput = {
    create?: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput> | ItemPedidoCreateWithoutPedidoInput[] | ItemPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutPedidoInput | ItemPedidoCreateOrConnectWithoutPedidoInput[]
    createMany?: ItemPedidoCreateManyPedidoInputEnvelope
    connect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
  }

  export type HistoricoPedidoUncheckedCreateNestedManyWithoutPedidoInput = {
    create?: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput> | HistoricoPedidoCreateWithoutPedidoInput[] | HistoricoPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: HistoricoPedidoCreateOrConnectWithoutPedidoInput | HistoricoPedidoCreateOrConnectWithoutPedidoInput[]
    createMany?: HistoricoPedidoCreateManyPedidoInputEnvelope
    connect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
  }

  export type PagamentoUncheckedCreateNestedManyWithoutPedidoInput = {
    create?: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput> | PagamentoCreateWithoutPedidoInput[] | PagamentoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutPedidoInput | PagamentoCreateOrConnectWithoutPedidoInput[]
    createMany?: PagamentoCreateManyPedidoInputEnvelope
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
  }

  export type DevolucaoUncheckedCreateNestedManyWithoutPedidoInput = {
    create?: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput> | DevolucaoCreateWithoutPedidoInput[] | DevolucaoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: DevolucaoCreateOrConnectWithoutPedidoInput | DevolucaoCreateOrConnectWithoutPedidoInput[]
    createMany?: DevolucaoCreateManyPedidoInputEnvelope
    connect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ItemPedidoUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput> | ItemPedidoCreateWithoutPedidoInput[] | ItemPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutPedidoInput | ItemPedidoCreateOrConnectWithoutPedidoInput[]
    upsert?: ItemPedidoUpsertWithWhereUniqueWithoutPedidoInput | ItemPedidoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: ItemPedidoCreateManyPedidoInputEnvelope
    set?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    disconnect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    delete?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    connect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    update?: ItemPedidoUpdateWithWhereUniqueWithoutPedidoInput | ItemPedidoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: ItemPedidoUpdateManyWithWhereWithoutPedidoInput | ItemPedidoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: ItemPedidoScalarWhereInput | ItemPedidoScalarWhereInput[]
  }

  export type HistoricoPedidoUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput> | HistoricoPedidoCreateWithoutPedidoInput[] | HistoricoPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: HistoricoPedidoCreateOrConnectWithoutPedidoInput | HistoricoPedidoCreateOrConnectWithoutPedidoInput[]
    upsert?: HistoricoPedidoUpsertWithWhereUniqueWithoutPedidoInput | HistoricoPedidoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: HistoricoPedidoCreateManyPedidoInputEnvelope
    set?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    disconnect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    delete?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    connect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    update?: HistoricoPedidoUpdateWithWhereUniqueWithoutPedidoInput | HistoricoPedidoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: HistoricoPedidoUpdateManyWithWhereWithoutPedidoInput | HistoricoPedidoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: HistoricoPedidoScalarWhereInput | HistoricoPedidoScalarWhereInput[]
  }

  export type PagamentoUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput> | PagamentoCreateWithoutPedidoInput[] | PagamentoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutPedidoInput | PagamentoCreateOrConnectWithoutPedidoInput[]
    upsert?: PagamentoUpsertWithWhereUniqueWithoutPedidoInput | PagamentoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: PagamentoCreateManyPedidoInputEnvelope
    set?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    disconnect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    delete?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    update?: PagamentoUpdateWithWhereUniqueWithoutPedidoInput | PagamentoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: PagamentoUpdateManyWithWhereWithoutPedidoInput | PagamentoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
  }

  export type DevolucaoUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput> | DevolucaoCreateWithoutPedidoInput[] | DevolucaoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: DevolucaoCreateOrConnectWithoutPedidoInput | DevolucaoCreateOrConnectWithoutPedidoInput[]
    upsert?: DevolucaoUpsertWithWhereUniqueWithoutPedidoInput | DevolucaoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: DevolucaoCreateManyPedidoInputEnvelope
    set?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    disconnect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    delete?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    connect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    update?: DevolucaoUpdateWithWhereUniqueWithoutPedidoInput | DevolucaoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: DevolucaoUpdateManyWithWhereWithoutPedidoInput | DevolucaoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: DevolucaoScalarWhereInput | DevolucaoScalarWhereInput[]
  }

  export type ItemPedidoUncheckedUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput> | ItemPedidoCreateWithoutPedidoInput[] | ItemPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutPedidoInput | ItemPedidoCreateOrConnectWithoutPedidoInput[]
    upsert?: ItemPedidoUpsertWithWhereUniqueWithoutPedidoInput | ItemPedidoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: ItemPedidoCreateManyPedidoInputEnvelope
    set?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    disconnect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    delete?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    connect?: ItemPedidoWhereUniqueInput | ItemPedidoWhereUniqueInput[]
    update?: ItemPedidoUpdateWithWhereUniqueWithoutPedidoInput | ItemPedidoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: ItemPedidoUpdateManyWithWhereWithoutPedidoInput | ItemPedidoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: ItemPedidoScalarWhereInput | ItemPedidoScalarWhereInput[]
  }

  export type HistoricoPedidoUncheckedUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput> | HistoricoPedidoCreateWithoutPedidoInput[] | HistoricoPedidoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: HistoricoPedidoCreateOrConnectWithoutPedidoInput | HistoricoPedidoCreateOrConnectWithoutPedidoInput[]
    upsert?: HistoricoPedidoUpsertWithWhereUniqueWithoutPedidoInput | HistoricoPedidoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: HistoricoPedidoCreateManyPedidoInputEnvelope
    set?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    disconnect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    delete?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    connect?: HistoricoPedidoWhereUniqueInput | HistoricoPedidoWhereUniqueInput[]
    update?: HistoricoPedidoUpdateWithWhereUniqueWithoutPedidoInput | HistoricoPedidoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: HistoricoPedidoUpdateManyWithWhereWithoutPedidoInput | HistoricoPedidoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: HistoricoPedidoScalarWhereInput | HistoricoPedidoScalarWhereInput[]
  }

  export type PagamentoUncheckedUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput> | PagamentoCreateWithoutPedidoInput[] | PagamentoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutPedidoInput | PagamentoCreateOrConnectWithoutPedidoInput[]
    upsert?: PagamentoUpsertWithWhereUniqueWithoutPedidoInput | PagamentoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: PagamentoCreateManyPedidoInputEnvelope
    set?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    disconnect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    delete?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    update?: PagamentoUpdateWithWhereUniqueWithoutPedidoInput | PagamentoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: PagamentoUpdateManyWithWhereWithoutPedidoInput | PagamentoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
  }

  export type DevolucaoUncheckedUpdateManyWithoutPedidoNestedInput = {
    create?: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput> | DevolucaoCreateWithoutPedidoInput[] | DevolucaoUncheckedCreateWithoutPedidoInput[]
    connectOrCreate?: DevolucaoCreateOrConnectWithoutPedidoInput | DevolucaoCreateOrConnectWithoutPedidoInput[]
    upsert?: DevolucaoUpsertWithWhereUniqueWithoutPedidoInput | DevolucaoUpsertWithWhereUniqueWithoutPedidoInput[]
    createMany?: DevolucaoCreateManyPedidoInputEnvelope
    set?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    disconnect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    delete?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    connect?: DevolucaoWhereUniqueInput | DevolucaoWhereUniqueInput[]
    update?: DevolucaoUpdateWithWhereUniqueWithoutPedidoInput | DevolucaoUpdateWithWhereUniqueWithoutPedidoInput[]
    updateMany?: DevolucaoUpdateManyWithWhereWithoutPedidoInput | DevolucaoUpdateManyWithWhereWithoutPedidoInput[]
    deleteMany?: DevolucaoScalarWhereInput | DevolucaoScalarWhereInput[]
  }

  export type PedidoCreateNestedOneWithoutItensInput = {
    create?: XOR<PedidoCreateWithoutItensInput, PedidoUncheckedCreateWithoutItensInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutItensInput
    connect?: PedidoWhereUniqueInput
  }

  export type ItemDevolucaoCreateNestedManyWithoutItemPedidoInput = {
    create?: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput> | ItemDevolucaoCreateWithoutItemPedidoInput[] | ItemDevolucaoUncheckedCreateWithoutItemPedidoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutItemPedidoInput | ItemDevolucaoCreateOrConnectWithoutItemPedidoInput[]
    createMany?: ItemDevolucaoCreateManyItemPedidoInputEnvelope
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
  }

  export type ItemDevolucaoUncheckedCreateNestedManyWithoutItemPedidoInput = {
    create?: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput> | ItemDevolucaoCreateWithoutItemPedidoInput[] | ItemDevolucaoUncheckedCreateWithoutItemPedidoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutItemPedidoInput | ItemDevolucaoCreateOrConnectWithoutItemPedidoInput[]
    createMany?: ItemDevolucaoCreateManyItemPedidoInputEnvelope
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type PedidoUpdateOneRequiredWithoutItensNestedInput = {
    create?: XOR<PedidoCreateWithoutItensInput, PedidoUncheckedCreateWithoutItensInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutItensInput
    upsert?: PedidoUpsertWithoutItensInput
    connect?: PedidoWhereUniqueInput
    update?: XOR<XOR<PedidoUpdateToOneWithWhereWithoutItensInput, PedidoUpdateWithoutItensInput>, PedidoUncheckedUpdateWithoutItensInput>
  }

  export type ItemDevolucaoUpdateManyWithoutItemPedidoNestedInput = {
    create?: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput> | ItemDevolucaoCreateWithoutItemPedidoInput[] | ItemDevolucaoUncheckedCreateWithoutItemPedidoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutItemPedidoInput | ItemDevolucaoCreateOrConnectWithoutItemPedidoInput[]
    upsert?: ItemDevolucaoUpsertWithWhereUniqueWithoutItemPedidoInput | ItemDevolucaoUpsertWithWhereUniqueWithoutItemPedidoInput[]
    createMany?: ItemDevolucaoCreateManyItemPedidoInputEnvelope
    set?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    disconnect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    delete?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    update?: ItemDevolucaoUpdateWithWhereUniqueWithoutItemPedidoInput | ItemDevolucaoUpdateWithWhereUniqueWithoutItemPedidoInput[]
    updateMany?: ItemDevolucaoUpdateManyWithWhereWithoutItemPedidoInput | ItemDevolucaoUpdateManyWithWhereWithoutItemPedidoInput[]
    deleteMany?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
  }

  export type ItemDevolucaoUncheckedUpdateManyWithoutItemPedidoNestedInput = {
    create?: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput> | ItemDevolucaoCreateWithoutItemPedidoInput[] | ItemDevolucaoUncheckedCreateWithoutItemPedidoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutItemPedidoInput | ItemDevolucaoCreateOrConnectWithoutItemPedidoInput[]
    upsert?: ItemDevolucaoUpsertWithWhereUniqueWithoutItemPedidoInput | ItemDevolucaoUpsertWithWhereUniqueWithoutItemPedidoInput[]
    createMany?: ItemDevolucaoCreateManyItemPedidoInputEnvelope
    set?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    disconnect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    delete?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    update?: ItemDevolucaoUpdateWithWhereUniqueWithoutItemPedidoInput | ItemDevolucaoUpdateWithWhereUniqueWithoutItemPedidoInput[]
    updateMany?: ItemDevolucaoUpdateManyWithWhereWithoutItemPedidoInput | ItemDevolucaoUpdateManyWithWhereWithoutItemPedidoInput[]
    deleteMany?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
  }

  export type PedidoCreateNestedOneWithoutHistoricoInput = {
    create?: XOR<PedidoCreateWithoutHistoricoInput, PedidoUncheckedCreateWithoutHistoricoInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutHistoricoInput
    connect?: PedidoWhereUniqueInput
  }

  export type PedidoUpdateOneRequiredWithoutHistoricoNestedInput = {
    create?: XOR<PedidoCreateWithoutHistoricoInput, PedidoUncheckedCreateWithoutHistoricoInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutHistoricoInput
    upsert?: PedidoUpsertWithoutHistoricoInput
    connect?: PedidoWhereUniqueInput
    update?: XOR<XOR<PedidoUpdateToOneWithWhereWithoutHistoricoInput, PedidoUpdateWithoutHistoricoInput>, PedidoUncheckedUpdateWithoutHistoricoInput>
  }

  export type PedidoCreateNestedOneWithoutPagamentosInput = {
    create?: XOR<PedidoCreateWithoutPagamentosInput, PedidoUncheckedCreateWithoutPagamentosInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutPagamentosInput
    connect?: PedidoWhereUniqueInput
  }

  export type PedidoUpdateOneRequiredWithoutPagamentosNestedInput = {
    create?: XOR<PedidoCreateWithoutPagamentosInput, PedidoUncheckedCreateWithoutPagamentosInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutPagamentosInput
    upsert?: PedidoUpsertWithoutPagamentosInput
    connect?: PedidoWhereUniqueInput
    update?: XOR<XOR<PedidoUpdateToOneWithWhereWithoutPagamentosInput, PedidoUpdateWithoutPagamentosInput>, PedidoUncheckedUpdateWithoutPagamentosInput>
  }

  export type PedidoCreateNestedOneWithoutDevolucoesInput = {
    create?: XOR<PedidoCreateWithoutDevolucoesInput, PedidoUncheckedCreateWithoutDevolucoesInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutDevolucoesInput
    connect?: PedidoWhereUniqueInput
  }

  export type ItemDevolucaoCreateNestedManyWithoutDevolucaoInput = {
    create?: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput> | ItemDevolucaoCreateWithoutDevolucaoInput[] | ItemDevolucaoUncheckedCreateWithoutDevolucaoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutDevolucaoInput | ItemDevolucaoCreateOrConnectWithoutDevolucaoInput[]
    createMany?: ItemDevolucaoCreateManyDevolucaoInputEnvelope
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
  }

  export type ItemDevolucaoUncheckedCreateNestedManyWithoutDevolucaoInput = {
    create?: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput> | ItemDevolucaoCreateWithoutDevolucaoInput[] | ItemDevolucaoUncheckedCreateWithoutDevolucaoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutDevolucaoInput | ItemDevolucaoCreateOrConnectWithoutDevolucaoInput[]
    createMany?: ItemDevolucaoCreateManyDevolucaoInputEnvelope
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
  }

  export type PedidoUpdateOneRequiredWithoutDevolucoesNestedInput = {
    create?: XOR<PedidoCreateWithoutDevolucoesInput, PedidoUncheckedCreateWithoutDevolucoesInput>
    connectOrCreate?: PedidoCreateOrConnectWithoutDevolucoesInput
    upsert?: PedidoUpsertWithoutDevolucoesInput
    connect?: PedidoWhereUniqueInput
    update?: XOR<XOR<PedidoUpdateToOneWithWhereWithoutDevolucoesInput, PedidoUpdateWithoutDevolucoesInput>, PedidoUncheckedUpdateWithoutDevolucoesInput>
  }

  export type ItemDevolucaoUpdateManyWithoutDevolucaoNestedInput = {
    create?: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput> | ItemDevolucaoCreateWithoutDevolucaoInput[] | ItemDevolucaoUncheckedCreateWithoutDevolucaoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutDevolucaoInput | ItemDevolucaoCreateOrConnectWithoutDevolucaoInput[]
    upsert?: ItemDevolucaoUpsertWithWhereUniqueWithoutDevolucaoInput | ItemDevolucaoUpsertWithWhereUniqueWithoutDevolucaoInput[]
    createMany?: ItemDevolucaoCreateManyDevolucaoInputEnvelope
    set?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    disconnect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    delete?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    update?: ItemDevolucaoUpdateWithWhereUniqueWithoutDevolucaoInput | ItemDevolucaoUpdateWithWhereUniqueWithoutDevolucaoInput[]
    updateMany?: ItemDevolucaoUpdateManyWithWhereWithoutDevolucaoInput | ItemDevolucaoUpdateManyWithWhereWithoutDevolucaoInput[]
    deleteMany?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
  }

  export type ItemDevolucaoUncheckedUpdateManyWithoutDevolucaoNestedInput = {
    create?: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput> | ItemDevolucaoCreateWithoutDevolucaoInput[] | ItemDevolucaoUncheckedCreateWithoutDevolucaoInput[]
    connectOrCreate?: ItemDevolucaoCreateOrConnectWithoutDevolucaoInput | ItemDevolucaoCreateOrConnectWithoutDevolucaoInput[]
    upsert?: ItemDevolucaoUpsertWithWhereUniqueWithoutDevolucaoInput | ItemDevolucaoUpsertWithWhereUniqueWithoutDevolucaoInput[]
    createMany?: ItemDevolucaoCreateManyDevolucaoInputEnvelope
    set?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    disconnect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    delete?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    connect?: ItemDevolucaoWhereUniqueInput | ItemDevolucaoWhereUniqueInput[]
    update?: ItemDevolucaoUpdateWithWhereUniqueWithoutDevolucaoInput | ItemDevolucaoUpdateWithWhereUniqueWithoutDevolucaoInput[]
    updateMany?: ItemDevolucaoUpdateManyWithWhereWithoutDevolucaoInput | ItemDevolucaoUpdateManyWithWhereWithoutDevolucaoInput[]
    deleteMany?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
  }

  export type DevolucaoCreateNestedOneWithoutItensInput = {
    create?: XOR<DevolucaoCreateWithoutItensInput, DevolucaoUncheckedCreateWithoutItensInput>
    connectOrCreate?: DevolucaoCreateOrConnectWithoutItensInput
    connect?: DevolucaoWhereUniqueInput
  }

  export type ItemPedidoCreateNestedOneWithoutItensDevolvidosInput = {
    create?: XOR<ItemPedidoCreateWithoutItensDevolvidosInput, ItemPedidoUncheckedCreateWithoutItensDevolvidosInput>
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutItensDevolvidosInput
    connect?: ItemPedidoWhereUniqueInput
  }

  export type DevolucaoUpdateOneRequiredWithoutItensNestedInput = {
    create?: XOR<DevolucaoCreateWithoutItensInput, DevolucaoUncheckedCreateWithoutItensInput>
    connectOrCreate?: DevolucaoCreateOrConnectWithoutItensInput
    upsert?: DevolucaoUpsertWithoutItensInput
    connect?: DevolucaoWhereUniqueInput
    update?: XOR<XOR<DevolucaoUpdateToOneWithWhereWithoutItensInput, DevolucaoUpdateWithoutItensInput>, DevolucaoUncheckedUpdateWithoutItensInput>
  }

  export type ItemPedidoUpdateOneRequiredWithoutItensDevolvidosNestedInput = {
    create?: XOR<ItemPedidoCreateWithoutItensDevolvidosInput, ItemPedidoUncheckedCreateWithoutItensDevolvidosInput>
    connectOrCreate?: ItemPedidoCreateOrConnectWithoutItensDevolvidosInput
    upsert?: ItemPedidoUpsertWithoutItensDevolvidosInput
    connect?: ItemPedidoWhereUniqueInput
    update?: XOR<XOR<ItemPedidoUpdateToOneWithWhereWithoutItensDevolvidosInput, ItemPedidoUpdateWithoutItensDevolvidosInput>, ItemPedidoUncheckedUpdateWithoutItensDevolvidosInput>
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

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type ItemPedidoCreateWithoutPedidoInput = {
    id?: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
    itensDevolvidos?: ItemDevolucaoCreateNestedManyWithoutItemPedidoInput
  }

  export type ItemPedidoUncheckedCreateWithoutPedidoInput = {
    id?: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
    itensDevolvidos?: ItemDevolucaoUncheckedCreateNestedManyWithoutItemPedidoInput
  }

  export type ItemPedidoCreateOrConnectWithoutPedidoInput = {
    where: ItemPedidoWhereUniqueInput
    create: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput>
  }

  export type ItemPedidoCreateManyPedidoInputEnvelope = {
    data: ItemPedidoCreateManyPedidoInput | ItemPedidoCreateManyPedidoInput[]
    skipDuplicates?: boolean
  }

  export type HistoricoPedidoCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type HistoricoPedidoUncheckedCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type HistoricoPedidoCreateOrConnectWithoutPedidoInput = {
    where: HistoricoPedidoWhereUniqueInput
    create: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput>
  }

  export type HistoricoPedidoCreateManyPedidoInputEnvelope = {
    data: HistoricoPedidoCreateManyPedidoInput | HistoricoPedidoCreateManyPedidoInput[]
    skipDuplicates?: boolean
  }

  export type PagamentoCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type PagamentoUncheckedCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type PagamentoCreateOrConnectWithoutPedidoInput = {
    where: PagamentoWhereUniqueInput
    create: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput>
  }

  export type PagamentoCreateManyPedidoInputEnvelope = {
    data: PagamentoCreateManyPedidoInput | PagamentoCreateManyPedidoInput[]
    skipDuplicates?: boolean
  }

  export type DevolucaoCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemDevolucaoCreateNestedManyWithoutDevolucaoInput
  }

  export type DevolucaoUncheckedCreateWithoutPedidoInput = {
    id?: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemDevolucaoUncheckedCreateNestedManyWithoutDevolucaoInput
  }

  export type DevolucaoCreateOrConnectWithoutPedidoInput = {
    where: DevolucaoWhereUniqueInput
    create: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput>
  }

  export type DevolucaoCreateManyPedidoInputEnvelope = {
    data: DevolucaoCreateManyPedidoInput | DevolucaoCreateManyPedidoInput[]
    skipDuplicates?: boolean
  }

  export type ItemPedidoUpsertWithWhereUniqueWithoutPedidoInput = {
    where: ItemPedidoWhereUniqueInput
    update: XOR<ItemPedidoUpdateWithoutPedidoInput, ItemPedidoUncheckedUpdateWithoutPedidoInput>
    create: XOR<ItemPedidoCreateWithoutPedidoInput, ItemPedidoUncheckedCreateWithoutPedidoInput>
  }

  export type ItemPedidoUpdateWithWhereUniqueWithoutPedidoInput = {
    where: ItemPedidoWhereUniqueInput
    data: XOR<ItemPedidoUpdateWithoutPedidoInput, ItemPedidoUncheckedUpdateWithoutPedidoInput>
  }

  export type ItemPedidoUpdateManyWithWhereWithoutPedidoInput = {
    where: ItemPedidoScalarWhereInput
    data: XOR<ItemPedidoUpdateManyMutationInput, ItemPedidoUncheckedUpdateManyWithoutPedidoInput>
  }

  export type ItemPedidoScalarWhereInput = {
    AND?: ItemPedidoScalarWhereInput | ItemPedidoScalarWhereInput[]
    OR?: ItemPedidoScalarWhereInput[]
    NOT?: ItemPedidoScalarWhereInput | ItemPedidoScalarWhereInput[]
    id?: UuidFilter<"ItemPedido"> | string
    pedidoId?: UuidFilter<"ItemPedido"> | string
    produtoId?: UuidFilter<"ItemPedido"> | string
    variacaoId?: UuidNullableFilter<"ItemPedido"> | string | null
    sku?: StringFilter<"ItemPedido"> | string
    titulo?: StringFilter<"ItemPedido"> | string
    quantidade?: IntFilter<"ItemPedido"> | number
    valorUnitario?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string
    peso?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    largura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    altura?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    comprimento?: DecimalNullableFilter<"ItemPedido"> | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFilter<"ItemPedido"> | Date | string
  }

  export type HistoricoPedidoUpsertWithWhereUniqueWithoutPedidoInput = {
    where: HistoricoPedidoWhereUniqueInput
    update: XOR<HistoricoPedidoUpdateWithoutPedidoInput, HistoricoPedidoUncheckedUpdateWithoutPedidoInput>
    create: XOR<HistoricoPedidoCreateWithoutPedidoInput, HistoricoPedidoUncheckedCreateWithoutPedidoInput>
  }

  export type HistoricoPedidoUpdateWithWhereUniqueWithoutPedidoInput = {
    where: HistoricoPedidoWhereUniqueInput
    data: XOR<HistoricoPedidoUpdateWithoutPedidoInput, HistoricoPedidoUncheckedUpdateWithoutPedidoInput>
  }

  export type HistoricoPedidoUpdateManyWithWhereWithoutPedidoInput = {
    where: HistoricoPedidoScalarWhereInput
    data: XOR<HistoricoPedidoUpdateManyMutationInput, HistoricoPedidoUncheckedUpdateManyWithoutPedidoInput>
  }

  export type HistoricoPedidoScalarWhereInput = {
    AND?: HistoricoPedidoScalarWhereInput | HistoricoPedidoScalarWhereInput[]
    OR?: HistoricoPedidoScalarWhereInput[]
    NOT?: HistoricoPedidoScalarWhereInput | HistoricoPedidoScalarWhereInput[]
    id?: UuidFilter<"HistoricoPedido"> | string
    pedidoId?: UuidFilter<"HistoricoPedido"> | string
    tenantId?: UuidFilter<"HistoricoPedido"> | string
    statusAnterior?: StringNullableFilter<"HistoricoPedido"> | string | null
    statusNovo?: StringFilter<"HistoricoPedido"> | string
    descricao?: StringFilter<"HistoricoPedido"> | string
    usuarioId?: UuidNullableFilter<"HistoricoPedido"> | string | null
    dadosExtras?: JsonNullableFilter<"HistoricoPedido">
    criadoEm?: DateTimeFilter<"HistoricoPedido"> | Date | string
  }

  export type PagamentoUpsertWithWhereUniqueWithoutPedidoInput = {
    where: PagamentoWhereUniqueInput
    update: XOR<PagamentoUpdateWithoutPedidoInput, PagamentoUncheckedUpdateWithoutPedidoInput>
    create: XOR<PagamentoCreateWithoutPedidoInput, PagamentoUncheckedCreateWithoutPedidoInput>
  }

  export type PagamentoUpdateWithWhereUniqueWithoutPedidoInput = {
    where: PagamentoWhereUniqueInput
    data: XOR<PagamentoUpdateWithoutPedidoInput, PagamentoUncheckedUpdateWithoutPedidoInput>
  }

  export type PagamentoUpdateManyWithWhereWithoutPedidoInput = {
    where: PagamentoScalarWhereInput
    data: XOR<PagamentoUpdateManyMutationInput, PagamentoUncheckedUpdateManyWithoutPedidoInput>
  }

  export type PagamentoScalarWhereInput = {
    AND?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
    OR?: PagamentoScalarWhereInput[]
    NOT?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
    id?: UuidFilter<"Pagamento"> | string
    pedidoId?: UuidFilter<"Pagamento"> | string
    tenantId?: UuidFilter<"Pagamento"> | string
    tipo?: StringFilter<"Pagamento"> | string
    status?: StringFilter<"Pagamento"> | string
    valor?: DecimalFilter<"Pagamento"> | Decimal | DecimalJsLike | number | string
    parcelas?: IntFilter<"Pagamento"> | number
    gateway?: StringNullableFilter<"Pagamento"> | string | null
    transacaoExternaId?: StringNullableFilter<"Pagamento"> | string | null
    dadosGateway?: JsonNullableFilter<"Pagamento">
    dataPagamento?: DateTimeNullableFilter<"Pagamento"> | Date | string | null
    criadoEm?: DateTimeFilter<"Pagamento"> | Date | string
    atualizadoEm?: DateTimeFilter<"Pagamento"> | Date | string
  }

  export type DevolucaoUpsertWithWhereUniqueWithoutPedidoInput = {
    where: DevolucaoWhereUniqueInput
    update: XOR<DevolucaoUpdateWithoutPedidoInput, DevolucaoUncheckedUpdateWithoutPedidoInput>
    create: XOR<DevolucaoCreateWithoutPedidoInput, DevolucaoUncheckedCreateWithoutPedidoInput>
  }

  export type DevolucaoUpdateWithWhereUniqueWithoutPedidoInput = {
    where: DevolucaoWhereUniqueInput
    data: XOR<DevolucaoUpdateWithoutPedidoInput, DevolucaoUncheckedUpdateWithoutPedidoInput>
  }

  export type DevolucaoUpdateManyWithWhereWithoutPedidoInput = {
    where: DevolucaoScalarWhereInput
    data: XOR<DevolucaoUpdateManyMutationInput, DevolucaoUncheckedUpdateManyWithoutPedidoInput>
  }

  export type DevolucaoScalarWhereInput = {
    AND?: DevolucaoScalarWhereInput | DevolucaoScalarWhereInput[]
    OR?: DevolucaoScalarWhereInput[]
    NOT?: DevolucaoScalarWhereInput | DevolucaoScalarWhereInput[]
    id?: UuidFilter<"Devolucao"> | string
    pedidoId?: UuidFilter<"Devolucao"> | string
    tenantId?: UuidFilter<"Devolucao"> | string
    motivo?: StringFilter<"Devolucao"> | string
    status?: StringFilter<"Devolucao"> | string
    valorReembolso?: DecimalFilter<"Devolucao"> | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: StringNullableFilter<"Devolucao"> | string | null
    observacao?: StringNullableFilter<"Devolucao"> | string | null
    criadoEm?: DateTimeFilter<"Devolucao"> | Date | string
    atualizadoEm?: DateTimeFilter<"Devolucao"> | Date | string
  }

  export type PedidoCreateWithoutItensInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    historico?: HistoricoPedidoCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUncheckedCreateWithoutItensInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    historico?: HistoricoPedidoUncheckedCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoUncheckedCreateNestedManyWithoutPedidoInput
  }

  export type PedidoCreateOrConnectWithoutItensInput = {
    where: PedidoWhereUniqueInput
    create: XOR<PedidoCreateWithoutItensInput, PedidoUncheckedCreateWithoutItensInput>
  }

  export type ItemDevolucaoCreateWithoutItemPedidoInput = {
    id?: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
    devolucao: DevolucaoCreateNestedOneWithoutItensInput
  }

  export type ItemDevolucaoUncheckedCreateWithoutItemPedidoInput = {
    id?: string
    devolucaoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoCreateOrConnectWithoutItemPedidoInput = {
    where: ItemDevolucaoWhereUniqueInput
    create: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput>
  }

  export type ItemDevolucaoCreateManyItemPedidoInputEnvelope = {
    data: ItemDevolucaoCreateManyItemPedidoInput | ItemDevolucaoCreateManyItemPedidoInput[]
    skipDuplicates?: boolean
  }

  export type PedidoUpsertWithoutItensInput = {
    update: XOR<PedidoUpdateWithoutItensInput, PedidoUncheckedUpdateWithoutItensInput>
    create: XOR<PedidoCreateWithoutItensInput, PedidoUncheckedCreateWithoutItensInput>
    where?: PedidoWhereInput
  }

  export type PedidoUpdateToOneWithWhereWithoutItensInput = {
    where?: PedidoWhereInput
    data: XOR<PedidoUpdateWithoutItensInput, PedidoUncheckedUpdateWithoutItensInput>
  }

  export type PedidoUpdateWithoutItensInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    historico?: HistoricoPedidoUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoUncheckedUpdateWithoutItensInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    historico?: HistoricoPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUncheckedUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUncheckedUpdateManyWithoutPedidoNestedInput
  }

  export type ItemDevolucaoUpsertWithWhereUniqueWithoutItemPedidoInput = {
    where: ItemDevolucaoWhereUniqueInput
    update: XOR<ItemDevolucaoUpdateWithoutItemPedidoInput, ItemDevolucaoUncheckedUpdateWithoutItemPedidoInput>
    create: XOR<ItemDevolucaoCreateWithoutItemPedidoInput, ItemDevolucaoUncheckedCreateWithoutItemPedidoInput>
  }

  export type ItemDevolucaoUpdateWithWhereUniqueWithoutItemPedidoInput = {
    where: ItemDevolucaoWhereUniqueInput
    data: XOR<ItemDevolucaoUpdateWithoutItemPedidoInput, ItemDevolucaoUncheckedUpdateWithoutItemPedidoInput>
  }

  export type ItemDevolucaoUpdateManyWithWhereWithoutItemPedidoInput = {
    where: ItemDevolucaoScalarWhereInput
    data: XOR<ItemDevolucaoUpdateManyMutationInput, ItemDevolucaoUncheckedUpdateManyWithoutItemPedidoInput>
  }

  export type ItemDevolucaoScalarWhereInput = {
    AND?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
    OR?: ItemDevolucaoScalarWhereInput[]
    NOT?: ItemDevolucaoScalarWhereInput | ItemDevolucaoScalarWhereInput[]
    id?: UuidFilter<"ItemDevolucao"> | string
    devolucaoId?: UuidFilter<"ItemDevolucao"> | string
    itemPedidoId?: UuidFilter<"ItemDevolucao"> | string
    quantidade?: IntFilter<"ItemDevolucao"> | number
    motivo?: StringFilter<"ItemDevolucao"> | string
    criadoEm?: DateTimeFilter<"ItemDevolucao"> | Date | string
  }

  export type PedidoCreateWithoutHistoricoInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUncheckedCreateWithoutHistoricoInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoUncheckedCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoUncheckedCreateNestedManyWithoutPedidoInput
  }

  export type PedidoCreateOrConnectWithoutHistoricoInput = {
    where: PedidoWhereUniqueInput
    create: XOR<PedidoCreateWithoutHistoricoInput, PedidoUncheckedCreateWithoutHistoricoInput>
  }

  export type PedidoUpsertWithoutHistoricoInput = {
    update: XOR<PedidoUpdateWithoutHistoricoInput, PedidoUncheckedUpdateWithoutHistoricoInput>
    create: XOR<PedidoCreateWithoutHistoricoInput, PedidoUncheckedCreateWithoutHistoricoInput>
    where?: PedidoWhereInput
  }

  export type PedidoUpdateToOneWithWhereWithoutHistoricoInput = {
    where?: PedidoWhereInput
    data: XOR<PedidoUpdateWithoutHistoricoInput, PedidoUncheckedUpdateWithoutHistoricoInput>
  }

  export type PedidoUpdateWithoutHistoricoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoUncheckedUpdateWithoutHistoricoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUncheckedUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUncheckedUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoCreateWithoutPagamentosInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUncheckedCreateWithoutPagamentosInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoUncheckedCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoUncheckedCreateNestedManyWithoutPedidoInput
    devolucoes?: DevolucaoUncheckedCreateNestedManyWithoutPedidoInput
  }

  export type PedidoCreateOrConnectWithoutPagamentosInput = {
    where: PedidoWhereUniqueInput
    create: XOR<PedidoCreateWithoutPagamentosInput, PedidoUncheckedCreateWithoutPagamentosInput>
  }

  export type PedidoUpsertWithoutPagamentosInput = {
    update: XOR<PedidoUpdateWithoutPagamentosInput, PedidoUncheckedUpdateWithoutPagamentosInput>
    create: XOR<PedidoCreateWithoutPagamentosInput, PedidoUncheckedCreateWithoutPagamentosInput>
    where?: PedidoWhereInput
  }

  export type PedidoUpdateToOneWithWhereWithoutPagamentosInput = {
    where?: PedidoWhereInput
    data: XOR<PedidoUpdateWithoutPagamentosInput, PedidoUncheckedUpdateWithoutPagamentosInput>
  }

  export type PedidoUpdateWithoutPagamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoUncheckedUpdateWithoutPagamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    devolucoes?: DevolucaoUncheckedUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoCreateWithoutDevolucoesInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoCreateNestedManyWithoutPedidoInput
  }

  export type PedidoUncheckedCreateWithoutDevolucoesInput = {
    id?: string
    tenantId: string
    numero: number
    clienteId?: string | null
    clienteNome: string
    clienteEmail?: string | null
    clienteCpfCnpj?: string | null
    origem?: string
    canalOrigem?: string | null
    pedidoExternoId?: string | null
    status?: string
    statusPagamento?: string
    metodoPagamento?: string | null
    parcelas?: number
    valorProdutos?: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorFrete?: Decimal | DecimalJsLike | number | string
    valorTotal?: Decimal | DecimalJsLike | number | string
    observacao?: string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: string | null
    codigoRastreio?: string | null
    transportadora?: string | null
    prazoEntrega?: number | null
    dataAprovacao?: Date | string | null
    dataSeparacao?: Date | string | null
    dataFaturamento?: Date | string | null
    dataEnvio?: Date | string | null
    dataEntrega?: Date | string | null
    dataCancelamento?: Date | string | null
    motivoCancelamento?: string | null
    notaFiscalId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    itens?: ItemPedidoUncheckedCreateNestedManyWithoutPedidoInput
    historico?: HistoricoPedidoUncheckedCreateNestedManyWithoutPedidoInput
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutPedidoInput
  }

  export type PedidoCreateOrConnectWithoutDevolucoesInput = {
    where: PedidoWhereUniqueInput
    create: XOR<PedidoCreateWithoutDevolucoesInput, PedidoUncheckedCreateWithoutDevolucoesInput>
  }

  export type ItemDevolucaoCreateWithoutDevolucaoInput = {
    id?: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
    itemPedido: ItemPedidoCreateNestedOneWithoutItensDevolvidosInput
  }

  export type ItemDevolucaoUncheckedCreateWithoutDevolucaoInput = {
    id?: string
    itemPedidoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoCreateOrConnectWithoutDevolucaoInput = {
    where: ItemDevolucaoWhereUniqueInput
    create: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput>
  }

  export type ItemDevolucaoCreateManyDevolucaoInputEnvelope = {
    data: ItemDevolucaoCreateManyDevolucaoInput | ItemDevolucaoCreateManyDevolucaoInput[]
    skipDuplicates?: boolean
  }

  export type PedidoUpsertWithoutDevolucoesInput = {
    update: XOR<PedidoUpdateWithoutDevolucoesInput, PedidoUncheckedUpdateWithoutDevolucoesInput>
    create: XOR<PedidoCreateWithoutDevolucoesInput, PedidoUncheckedCreateWithoutDevolucoesInput>
    where?: PedidoWhereInput
  }

  export type PedidoUpdateToOneWithWhereWithoutDevolucoesInput = {
    where?: PedidoWhereInput
    data: XOR<PedidoUpdateWithoutDevolucoesInput, PedidoUncheckedUpdateWithoutDevolucoesInput>
  }

  export type PedidoUpdateWithoutDevolucoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUpdateManyWithoutPedidoNestedInput
  }

  export type PedidoUncheckedUpdateWithoutDevolucoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    numero?: IntFieldUpdateOperationsInput | number
    clienteId?: NullableStringFieldUpdateOperationsInput | string | null
    clienteNome?: StringFieldUpdateOperationsInput | string
    clienteEmail?: NullableStringFieldUpdateOperationsInput | string | null
    clienteCpfCnpj?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: StringFieldUpdateOperationsInput | string
    canalOrigem?: NullableStringFieldUpdateOperationsInput | string | null
    pedidoExternoId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusPagamento?: StringFieldUpdateOperationsInput | string
    metodoPagamento?: NullableStringFieldUpdateOperationsInput | string | null
    parcelas?: IntFieldUpdateOperationsInput | number
    valorProdutos?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorFrete?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    enderecoEntrega?: NullableJsonNullValueInput | InputJsonValue
    rastreamento?: NullableStringFieldUpdateOperationsInput | string | null
    codigoRastreio?: NullableStringFieldUpdateOperationsInput | string | null
    transportadora?: NullableStringFieldUpdateOperationsInput | string | null
    prazoEntrega?: NullableIntFieldUpdateOperationsInput | number | null
    dataAprovacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataSeparacao?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataFaturamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEnvio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataEntrega?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dataCancelamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motivoCancelamento?: NullableStringFieldUpdateOperationsInput | string | null
    notaFiscalId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    historico?: HistoricoPedidoUncheckedUpdateManyWithoutPedidoNestedInput
    pagamentos?: PagamentoUncheckedUpdateManyWithoutPedidoNestedInput
  }

  export type ItemDevolucaoUpsertWithWhereUniqueWithoutDevolucaoInput = {
    where: ItemDevolucaoWhereUniqueInput
    update: XOR<ItemDevolucaoUpdateWithoutDevolucaoInput, ItemDevolucaoUncheckedUpdateWithoutDevolucaoInput>
    create: XOR<ItemDevolucaoCreateWithoutDevolucaoInput, ItemDevolucaoUncheckedCreateWithoutDevolucaoInput>
  }

  export type ItemDevolucaoUpdateWithWhereUniqueWithoutDevolucaoInput = {
    where: ItemDevolucaoWhereUniqueInput
    data: XOR<ItemDevolucaoUpdateWithoutDevolucaoInput, ItemDevolucaoUncheckedUpdateWithoutDevolucaoInput>
  }

  export type ItemDevolucaoUpdateManyWithWhereWithoutDevolucaoInput = {
    where: ItemDevolucaoScalarWhereInput
    data: XOR<ItemDevolucaoUpdateManyMutationInput, ItemDevolucaoUncheckedUpdateManyWithoutDevolucaoInput>
  }

  export type DevolucaoCreateWithoutItensInput = {
    id?: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutDevolucoesInput
  }

  export type DevolucaoUncheckedCreateWithoutItensInput = {
    id?: string
    pedidoId: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type DevolucaoCreateOrConnectWithoutItensInput = {
    where: DevolucaoWhereUniqueInput
    create: XOR<DevolucaoCreateWithoutItensInput, DevolucaoUncheckedCreateWithoutItensInput>
  }

  export type ItemPedidoCreateWithoutItensDevolvidosInput = {
    id?: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
    pedido: PedidoCreateNestedOneWithoutItensInput
  }

  export type ItemPedidoUncheckedCreateWithoutItensDevolvidosInput = {
    id?: string
    pedidoId: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
  }

  export type ItemPedidoCreateOrConnectWithoutItensDevolvidosInput = {
    where: ItemPedidoWhereUniqueInput
    create: XOR<ItemPedidoCreateWithoutItensDevolvidosInput, ItemPedidoUncheckedCreateWithoutItensDevolvidosInput>
  }

  export type DevolucaoUpsertWithoutItensInput = {
    update: XOR<DevolucaoUpdateWithoutItensInput, DevolucaoUncheckedUpdateWithoutItensInput>
    create: XOR<DevolucaoCreateWithoutItensInput, DevolucaoUncheckedCreateWithoutItensInput>
    where?: DevolucaoWhereInput
  }

  export type DevolucaoUpdateToOneWithWhereWithoutItensInput = {
    where?: DevolucaoWhereInput
    data: XOR<DevolucaoUpdateWithoutItensInput, DevolucaoUncheckedUpdateWithoutItensInput>
  }

  export type DevolucaoUpdateWithoutItensInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutDevolucoesNestedInput
  }

  export type DevolucaoUncheckedUpdateWithoutItensInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPedidoUpsertWithoutItensDevolvidosInput = {
    update: XOR<ItemPedidoUpdateWithoutItensDevolvidosInput, ItemPedidoUncheckedUpdateWithoutItensDevolvidosInput>
    create: XOR<ItemPedidoCreateWithoutItensDevolvidosInput, ItemPedidoUncheckedCreateWithoutItensDevolvidosInput>
    where?: ItemPedidoWhereInput
  }

  export type ItemPedidoUpdateToOneWithWhereWithoutItensDevolvidosInput = {
    where?: ItemPedidoWhereInput
    data: XOR<ItemPedidoUpdateWithoutItensDevolvidosInput, ItemPedidoUncheckedUpdateWithoutItensDevolvidosInput>
  }

  export type ItemPedidoUpdateWithoutItensDevolvidosInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    pedido?: PedidoUpdateOneRequiredWithoutItensNestedInput
  }

  export type ItemPedidoUncheckedUpdateWithoutItensDevolvidosInput = {
    id?: StringFieldUpdateOperationsInput | string
    pedidoId?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPedidoCreateManyPedidoInput = {
    id?: string
    produtoId: string
    variacaoId?: string | null
    sku: string
    titulo: string
    quantidade: number
    valorUnitario: Decimal | DecimalJsLike | number | string
    valorDesconto?: Decimal | DecimalJsLike | number | string
    valorTotal: Decimal | DecimalJsLike | number | string
    peso?: Decimal | DecimalJsLike | number | string | null
    largura?: Decimal | DecimalJsLike | number | string | null
    altura?: Decimal | DecimalJsLike | number | string | null
    comprimento?: Decimal | DecimalJsLike | number | string | null
    criadoEm?: Date | string
  }

  export type HistoricoPedidoCreateManyPedidoInput = {
    id?: string
    tenantId: string
    statusAnterior?: string | null
    statusNovo: string
    descricao: string
    usuarioId?: string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: Date | string
  }

  export type PagamentoCreateManyPedidoInput = {
    id?: string
    tenantId: string
    tipo: string
    status?: string
    valor: Decimal | DecimalJsLike | number | string
    parcelas?: number
    gateway?: string | null
    transacaoExternaId?: string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: Date | string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type DevolucaoCreateManyPedidoInput = {
    id?: string
    tenantId: string
    motivo: string
    status?: string
    valorReembolso: Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: string | null
    observacao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ItemPedidoUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itensDevolvidos?: ItemDevolucaoUpdateManyWithoutItemPedidoNestedInput
  }

  export type ItemPedidoUncheckedUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itensDevolvidos?: ItemDevolucaoUncheckedUpdateManyWithoutItemPedidoNestedInput
  }

  export type ItemPedidoUncheckedUpdateManyWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    variacaoId?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    valorUnitario?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorDesconto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    valorTotal?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    peso?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    largura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    altura?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    comprimento?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoUncheckedUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoricoPedidoUncheckedUpdateManyWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    statusAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    statusNovo?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    usuarioId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosExtras?: NullableJsonNullValueInput | InputJsonValue
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateManyWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valor?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    parcelas?: IntFieldUpdateOperationsInput | number
    gateway?: NullableStringFieldUpdateOperationsInput | string | null
    transacaoExternaId?: NullableStringFieldUpdateOperationsInput | string | null
    dadosGateway?: NullableJsonNullValueInput | InputJsonValue
    dataPagamento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DevolucaoUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemDevolucaoUpdateManyWithoutDevolucaoNestedInput
  }

  export type DevolucaoUncheckedUpdateWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itens?: ItemDevolucaoUncheckedUpdateManyWithoutDevolucaoNestedInput
  }

  export type DevolucaoUncheckedUpdateManyWithoutPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    motivo?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    valorReembolso?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    codigoRastreioRetorno?: NullableStringFieldUpdateOperationsInput | string | null
    observacao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoCreateManyItemPedidoInput = {
    id?: string
    devolucaoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoUpdateWithoutItemPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    devolucao?: DevolucaoUpdateOneRequiredWithoutItensNestedInput
  }

  export type ItemDevolucaoUncheckedUpdateWithoutItemPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    devolucaoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoUncheckedUpdateManyWithoutItemPedidoInput = {
    id?: StringFieldUpdateOperationsInput | string
    devolucaoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoCreateManyDevolucaoInput = {
    id?: string
    itemPedidoId: string
    quantidade: number
    motivo: string
    criadoEm?: Date | string
  }

  export type ItemDevolucaoUpdateWithoutDevolucaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    itemPedido?: ItemPedidoUpdateOneRequiredWithoutItensDevolvidosNestedInput
  }

  export type ItemDevolucaoUncheckedUpdateWithoutDevolucaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemPedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemDevolucaoUncheckedUpdateManyWithoutDevolucaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemPedidoId?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PedidoCountOutputTypeDefaultArgs instead
     */
    export type PedidoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PedidoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemPedidoCountOutputTypeDefaultArgs instead
     */
    export type ItemPedidoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemPedidoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DevolucaoCountOutputTypeDefaultArgs instead
     */
    export type DevolucaoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DevolucaoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PedidoDefaultArgs instead
     */
    export type PedidoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PedidoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemPedidoDefaultArgs instead
     */
    export type ItemPedidoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemPedidoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HistoricoPedidoDefaultArgs instead
     */
    export type HistoricoPedidoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HistoricoPedidoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PagamentoDefaultArgs instead
     */
    export type PagamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PagamentoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DevolucaoDefaultArgs instead
     */
    export type DevolucaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DevolucaoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ItemDevolucaoDefaultArgs instead
     */
    export type ItemDevolucaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ItemDevolucaoDefaultArgs<ExtArgs>

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