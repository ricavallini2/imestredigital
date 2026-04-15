
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
 * Model Produto
 * Produto principal do catálogo
 */
export type Produto = $Result.DefaultSelection<Prisma.$ProdutoPayload>
/**
 * Model ImagemProduto
 * Imagem associada a um produto ou variação
 */
export type ImagemProduto = $Result.DefaultSelection<Prisma.$ImagemProdutoPayload>
/**
 * Model VariacaoProduto
 * Variação de um produto (cor, tamanho, etc.)
 */
export type VariacaoProduto = $Result.DefaultSelection<Prisma.$VariacaoProdutoPayload>
/**
 * Model AtributoVariacao
 * Atributo de uma variação (ex: Cor=Azul, Tamanho=M)
 */
export type AtributoVariacao = $Result.DefaultSelection<Prisma.$AtributoVariacaoPayload>
/**
 * Model ImagemVariacao
 * Imagem específica de uma variação
 */
export type ImagemVariacao = $Result.DefaultSelection<Prisma.$ImagemVariacaoPayload>
/**
 * Model Categoria
 * Categoria de produto com suporte a hierarquia
 */
export type Categoria = $Result.DefaultSelection<Prisma.$CategoriaPayload>
/**
 * Model Marca
 * Marca de produto
 */
export type Marca = $Result.DefaultSelection<Prisma.$MarcaPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Produtos
 * const produtos = await prisma.produto.findMany()
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
   * // Fetch zero or more Produtos
   * const produtos = await prisma.produto.findMany()
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
   * `prisma.produto`: Exposes CRUD operations for the **Produto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Produtos
    * const produtos = await prisma.produto.findMany()
    * ```
    */
  get produto(): Prisma.ProdutoDelegate<ExtArgs>;

  /**
   * `prisma.imagemProduto`: Exposes CRUD operations for the **ImagemProduto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImagemProdutos
    * const imagemProdutos = await prisma.imagemProduto.findMany()
    * ```
    */
  get imagemProduto(): Prisma.ImagemProdutoDelegate<ExtArgs>;

  /**
   * `prisma.variacaoProduto`: Exposes CRUD operations for the **VariacaoProduto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VariacaoProdutos
    * const variacaoProdutos = await prisma.variacaoProduto.findMany()
    * ```
    */
  get variacaoProduto(): Prisma.VariacaoProdutoDelegate<ExtArgs>;

  /**
   * `prisma.atributoVariacao`: Exposes CRUD operations for the **AtributoVariacao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AtributoVariacaos
    * const atributoVariacaos = await prisma.atributoVariacao.findMany()
    * ```
    */
  get atributoVariacao(): Prisma.AtributoVariacaoDelegate<ExtArgs>;

  /**
   * `prisma.imagemVariacao`: Exposes CRUD operations for the **ImagemVariacao** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImagemVariacaos
    * const imagemVariacaos = await prisma.imagemVariacao.findMany()
    * ```
    */
  get imagemVariacao(): Prisma.ImagemVariacaoDelegate<ExtArgs>;

  /**
   * `prisma.categoria`: Exposes CRUD operations for the **Categoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categorias
    * const categorias = await prisma.categoria.findMany()
    * ```
    */
  get categoria(): Prisma.CategoriaDelegate<ExtArgs>;

  /**
   * `prisma.marca`: Exposes CRUD operations for the **Marca** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Marcas
    * const marcas = await prisma.marca.findMany()
    * ```
    */
  get marca(): Prisma.MarcaDelegate<ExtArgs>;
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
    Produto: 'Produto',
    ImagemProduto: 'ImagemProduto',
    VariacaoProduto: 'VariacaoProduto',
    AtributoVariacao: 'AtributoVariacao',
    ImagemVariacao: 'ImagemVariacao',
    Categoria: 'Categoria',
    Marca: 'Marca'
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
      modelProps: "produto" | "imagemProduto" | "variacaoProduto" | "atributoVariacao" | "imagemVariacao" | "categoria" | "marca"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Produto: {
        payload: Prisma.$ProdutoPayload<ExtArgs>
        fields: Prisma.ProdutoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProdutoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProdutoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          findFirst: {
            args: Prisma.ProdutoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProdutoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          findMany: {
            args: Prisma.ProdutoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>[]
          }
          create: {
            args: Prisma.ProdutoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          createMany: {
            args: Prisma.ProdutoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProdutoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>[]
          }
          delete: {
            args: Prisma.ProdutoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          update: {
            args: Prisma.ProdutoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          deleteMany: {
            args: Prisma.ProdutoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProdutoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProdutoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProdutoPayload>
          }
          aggregate: {
            args: Prisma.ProdutoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduto>
          }
          groupBy: {
            args: Prisma.ProdutoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProdutoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProdutoCountArgs<ExtArgs>
            result: $Utils.Optional<ProdutoCountAggregateOutputType> | number
          }
        }
      }
      ImagemProduto: {
        payload: Prisma.$ImagemProdutoPayload<ExtArgs>
        fields: Prisma.ImagemProdutoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImagemProdutoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImagemProdutoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          findFirst: {
            args: Prisma.ImagemProdutoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImagemProdutoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          findMany: {
            args: Prisma.ImagemProdutoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>[]
          }
          create: {
            args: Prisma.ImagemProdutoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          createMany: {
            args: Prisma.ImagemProdutoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImagemProdutoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>[]
          }
          delete: {
            args: Prisma.ImagemProdutoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          update: {
            args: Prisma.ImagemProdutoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          deleteMany: {
            args: Prisma.ImagemProdutoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImagemProdutoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImagemProdutoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemProdutoPayload>
          }
          aggregate: {
            args: Prisma.ImagemProdutoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImagemProduto>
          }
          groupBy: {
            args: Prisma.ImagemProdutoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImagemProdutoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImagemProdutoCountArgs<ExtArgs>
            result: $Utils.Optional<ImagemProdutoCountAggregateOutputType> | number
          }
        }
      }
      VariacaoProduto: {
        payload: Prisma.$VariacaoProdutoPayload<ExtArgs>
        fields: Prisma.VariacaoProdutoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VariacaoProdutoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VariacaoProdutoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          findFirst: {
            args: Prisma.VariacaoProdutoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VariacaoProdutoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          findMany: {
            args: Prisma.VariacaoProdutoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>[]
          }
          create: {
            args: Prisma.VariacaoProdutoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          createMany: {
            args: Prisma.VariacaoProdutoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VariacaoProdutoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>[]
          }
          delete: {
            args: Prisma.VariacaoProdutoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          update: {
            args: Prisma.VariacaoProdutoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          deleteMany: {
            args: Prisma.VariacaoProdutoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VariacaoProdutoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VariacaoProdutoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VariacaoProdutoPayload>
          }
          aggregate: {
            args: Prisma.VariacaoProdutoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVariacaoProduto>
          }
          groupBy: {
            args: Prisma.VariacaoProdutoGroupByArgs<ExtArgs>
            result: $Utils.Optional<VariacaoProdutoGroupByOutputType>[]
          }
          count: {
            args: Prisma.VariacaoProdutoCountArgs<ExtArgs>
            result: $Utils.Optional<VariacaoProdutoCountAggregateOutputType> | number
          }
        }
      }
      AtributoVariacao: {
        payload: Prisma.$AtributoVariacaoPayload<ExtArgs>
        fields: Prisma.AtributoVariacaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AtributoVariacaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AtributoVariacaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          findFirst: {
            args: Prisma.AtributoVariacaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AtributoVariacaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          findMany: {
            args: Prisma.AtributoVariacaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>[]
          }
          create: {
            args: Prisma.AtributoVariacaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          createMany: {
            args: Prisma.AtributoVariacaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AtributoVariacaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>[]
          }
          delete: {
            args: Prisma.AtributoVariacaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          update: {
            args: Prisma.AtributoVariacaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          deleteMany: {
            args: Prisma.AtributoVariacaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AtributoVariacaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AtributoVariacaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AtributoVariacaoPayload>
          }
          aggregate: {
            args: Prisma.AtributoVariacaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAtributoVariacao>
          }
          groupBy: {
            args: Prisma.AtributoVariacaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AtributoVariacaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AtributoVariacaoCountArgs<ExtArgs>
            result: $Utils.Optional<AtributoVariacaoCountAggregateOutputType> | number
          }
        }
      }
      ImagemVariacao: {
        payload: Prisma.$ImagemVariacaoPayload<ExtArgs>
        fields: Prisma.ImagemVariacaoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImagemVariacaoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImagemVariacaoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          findFirst: {
            args: Prisma.ImagemVariacaoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImagemVariacaoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          findMany: {
            args: Prisma.ImagemVariacaoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>[]
          }
          create: {
            args: Prisma.ImagemVariacaoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          createMany: {
            args: Prisma.ImagemVariacaoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImagemVariacaoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>[]
          }
          delete: {
            args: Prisma.ImagemVariacaoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          update: {
            args: Prisma.ImagemVariacaoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          deleteMany: {
            args: Prisma.ImagemVariacaoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImagemVariacaoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImagemVariacaoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagemVariacaoPayload>
          }
          aggregate: {
            args: Prisma.ImagemVariacaoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImagemVariacao>
          }
          groupBy: {
            args: Prisma.ImagemVariacaoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImagemVariacaoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImagemVariacaoCountArgs<ExtArgs>
            result: $Utils.Optional<ImagemVariacaoCountAggregateOutputType> | number
          }
        }
      }
      Categoria: {
        payload: Prisma.$CategoriaPayload<ExtArgs>
        fields: Prisma.CategoriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          findFirst: {
            args: Prisma.CategoriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          findMany: {
            args: Prisma.CategoriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[]
          }
          create: {
            args: Prisma.CategoriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          createMany: {
            args: Prisma.CategoriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>[]
          }
          delete: {
            args: Prisma.CategoriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          update: {
            args: Prisma.CategoriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          deleteMany: {
            args: Prisma.CategoriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriaPayload>
          }
          aggregate: {
            args: Prisma.CategoriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategoria>
          }
          groupBy: {
            args: Prisma.CategoriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoriaCountArgs<ExtArgs>
            result: $Utils.Optional<CategoriaCountAggregateOutputType> | number
          }
        }
      }
      Marca: {
        payload: Prisma.$MarcaPayload<ExtArgs>
        fields: Prisma.MarcaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarcaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarcaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          findFirst: {
            args: Prisma.MarcaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarcaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          findMany: {
            args: Prisma.MarcaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>[]
          }
          create: {
            args: Prisma.MarcaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          createMany: {
            args: Prisma.MarcaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MarcaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>[]
          }
          delete: {
            args: Prisma.MarcaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          update: {
            args: Prisma.MarcaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          deleteMany: {
            args: Prisma.MarcaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarcaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MarcaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarcaPayload>
          }
          aggregate: {
            args: Prisma.MarcaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarca>
          }
          groupBy: {
            args: Prisma.MarcaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarcaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MarcaCountArgs<ExtArgs>
            result: $Utils.Optional<MarcaCountAggregateOutputType> | number
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
   * Count Type ProdutoCountOutputType
   */

  export type ProdutoCountOutputType = {
    imagens: number
    variacoes: number
  }

  export type ProdutoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    imagens?: boolean | ProdutoCountOutputTypeCountImagensArgs
    variacoes?: boolean | ProdutoCountOutputTypeCountVariacoesArgs
  }

  // Custom InputTypes
  /**
   * ProdutoCountOutputType without action
   */
  export type ProdutoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProdutoCountOutputType
     */
    select?: ProdutoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProdutoCountOutputType without action
   */
  export type ProdutoCountOutputTypeCountImagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagemProdutoWhereInput
  }

  /**
   * ProdutoCountOutputType without action
   */
  export type ProdutoCountOutputTypeCountVariacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VariacaoProdutoWhereInput
  }


  /**
   * Count Type VariacaoProdutoCountOutputType
   */

  export type VariacaoProdutoCountOutputType = {
    atributos: number
    imagens: number
  }

  export type VariacaoProdutoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    atributos?: boolean | VariacaoProdutoCountOutputTypeCountAtributosArgs
    imagens?: boolean | VariacaoProdutoCountOutputTypeCountImagensArgs
  }

  // Custom InputTypes
  /**
   * VariacaoProdutoCountOutputType without action
   */
  export type VariacaoProdutoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProdutoCountOutputType
     */
    select?: VariacaoProdutoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VariacaoProdutoCountOutputType without action
   */
  export type VariacaoProdutoCountOutputTypeCountAtributosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AtributoVariacaoWhereInput
  }

  /**
   * VariacaoProdutoCountOutputType without action
   */
  export type VariacaoProdutoCountOutputTypeCountImagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagemVariacaoWhereInput
  }


  /**
   * Count Type CategoriaCountOutputType
   */

  export type CategoriaCountOutputType = {
    subcategorias: number
    produtos: number
  }

  export type CategoriaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subcategorias?: boolean | CategoriaCountOutputTypeCountSubcategoriasArgs
    produtos?: boolean | CategoriaCountOutputTypeCountProdutosArgs
  }

  // Custom InputTypes
  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriaCountOutputType
     */
    select?: CategoriaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeCountSubcategoriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriaWhereInput
  }

  /**
   * CategoriaCountOutputType without action
   */
  export type CategoriaCountOutputTypeCountProdutosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProdutoWhereInput
  }


  /**
   * Count Type MarcaCountOutputType
   */

  export type MarcaCountOutputType = {
    produtos: number
  }

  export type MarcaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produtos?: boolean | MarcaCountOutputTypeCountProdutosArgs
  }

  // Custom InputTypes
  /**
   * MarcaCountOutputType without action
   */
  export type MarcaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarcaCountOutputType
     */
    select?: MarcaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MarcaCountOutputType without action
   */
  export type MarcaCountOutputTypeCountProdutosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProdutoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Produto
   */

  export type AggregateProduto = {
    _count: ProdutoCountAggregateOutputType | null
    _avg: ProdutoAvgAggregateOutputType | null
    _sum: ProdutoSumAggregateOutputType | null
    _min: ProdutoMinAggregateOutputType | null
    _max: ProdutoMaxAggregateOutputType | null
  }

  export type ProdutoAvgAggregateOutputType = {
    origem: number | null
    precoCusto: number | null
    precoVenda: number | null
    precoPromocional: number | null
    peso: number | null
    altura: number | null
    largura: number | null
    comprimento: number | null
  }

  export type ProdutoSumAggregateOutputType = {
    origem: number | null
    precoCusto: number | null
    precoVenda: number | null
    precoPromocional: number | null
    peso: number | null
    altura: number | null
    largura: number | null
    comprimento: number | null
  }

  export type ProdutoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    sku: string | null
    gtin: string | null
    nome: string | null
    descricao: string | null
    descricaoCurta: string | null
    status: string | null
    ncm: string | null
    cest: string | null
    origem: number | null
    precoCusto: number | null
    precoVenda: number | null
    precoPromocional: number | null
    peso: number | null
    altura: number | null
    largura: number | null
    comprimento: number | null
    metaTitulo: string | null
    metaDescricao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
    categoriaId: string | null
    marcaId: string | null
  }

  export type ProdutoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    sku: string | null
    gtin: string | null
    nome: string | null
    descricao: string | null
    descricaoCurta: string | null
    status: string | null
    ncm: string | null
    cest: string | null
    origem: number | null
    precoCusto: number | null
    precoVenda: number | null
    precoPromocional: number | null
    peso: number | null
    altura: number | null
    largura: number | null
    comprimento: number | null
    metaTitulo: string | null
    metaDescricao: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
    categoriaId: string | null
    marcaId: string | null
  }

  export type ProdutoCountAggregateOutputType = {
    id: number
    tenantId: number
    sku: number
    gtin: number
    nome: number
    descricao: number
    descricaoCurta: number
    status: number
    ncm: number
    cest: number
    origem: number
    precoCusto: number
    precoVenda: number
    precoPromocional: number
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags: number
    metaTitulo: number
    metaDescricao: number
    criadoEm: number
    atualizadoEm: number
    categoriaId: number
    marcaId: number
    _all: number
  }


  export type ProdutoAvgAggregateInputType = {
    origem?: true
    precoCusto?: true
    precoVenda?: true
    precoPromocional?: true
    peso?: true
    altura?: true
    largura?: true
    comprimento?: true
  }

  export type ProdutoSumAggregateInputType = {
    origem?: true
    precoCusto?: true
    precoVenda?: true
    precoPromocional?: true
    peso?: true
    altura?: true
    largura?: true
    comprimento?: true
  }

  export type ProdutoMinAggregateInputType = {
    id?: true
    tenantId?: true
    sku?: true
    gtin?: true
    nome?: true
    descricao?: true
    descricaoCurta?: true
    status?: true
    ncm?: true
    cest?: true
    origem?: true
    precoCusto?: true
    precoVenda?: true
    precoPromocional?: true
    peso?: true
    altura?: true
    largura?: true
    comprimento?: true
    metaTitulo?: true
    metaDescricao?: true
    criadoEm?: true
    atualizadoEm?: true
    categoriaId?: true
    marcaId?: true
  }

  export type ProdutoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    sku?: true
    gtin?: true
    nome?: true
    descricao?: true
    descricaoCurta?: true
    status?: true
    ncm?: true
    cest?: true
    origem?: true
    precoCusto?: true
    precoVenda?: true
    precoPromocional?: true
    peso?: true
    altura?: true
    largura?: true
    comprimento?: true
    metaTitulo?: true
    metaDescricao?: true
    criadoEm?: true
    atualizadoEm?: true
    categoriaId?: true
    marcaId?: true
  }

  export type ProdutoCountAggregateInputType = {
    id?: true
    tenantId?: true
    sku?: true
    gtin?: true
    nome?: true
    descricao?: true
    descricaoCurta?: true
    status?: true
    ncm?: true
    cest?: true
    origem?: true
    precoCusto?: true
    precoVenda?: true
    precoPromocional?: true
    peso?: true
    altura?: true
    largura?: true
    comprimento?: true
    tags?: true
    metaTitulo?: true
    metaDescricao?: true
    criadoEm?: true
    atualizadoEm?: true
    categoriaId?: true
    marcaId?: true
    _all?: true
  }

  export type ProdutoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Produto to aggregate.
     */
    where?: ProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Produtos to fetch.
     */
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Produtos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Produtos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Produtos
    **/
    _count?: true | ProdutoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProdutoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProdutoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProdutoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProdutoMaxAggregateInputType
  }

  export type GetProdutoAggregateType<T extends ProdutoAggregateArgs> = {
        [P in keyof T & keyof AggregateProduto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduto[P]>
      : GetScalarType<T[P], AggregateProduto[P]>
  }




  export type ProdutoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProdutoWhereInput
    orderBy?: ProdutoOrderByWithAggregationInput | ProdutoOrderByWithAggregationInput[]
    by: ProdutoScalarFieldEnum[] | ProdutoScalarFieldEnum
    having?: ProdutoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProdutoCountAggregateInputType | true
    _avg?: ProdutoAvgAggregateInputType
    _sum?: ProdutoSumAggregateInputType
    _min?: ProdutoMinAggregateInputType
    _max?: ProdutoMaxAggregateInputType
  }

  export type ProdutoGroupByOutputType = {
    id: string
    tenantId: string
    sku: string
    gtin: string | null
    nome: string
    descricao: string
    descricaoCurta: string | null
    status: string
    ncm: string
    cest: string | null
    origem: number
    precoCusto: number
    precoVenda: number
    precoPromocional: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags: string[]
    metaTitulo: string | null
    metaDescricao: string | null
    criadoEm: Date
    atualizadoEm: Date
    categoriaId: string
    marcaId: string | null
    _count: ProdutoCountAggregateOutputType | null
    _avg: ProdutoAvgAggregateOutputType | null
    _sum: ProdutoSumAggregateOutputType | null
    _min: ProdutoMinAggregateOutputType | null
    _max: ProdutoMaxAggregateOutputType | null
  }

  type GetProdutoGroupByPayload<T extends ProdutoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProdutoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProdutoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProdutoGroupByOutputType[P]>
            : GetScalarType<T[P], ProdutoGroupByOutputType[P]>
        }
      >
    >


  export type ProdutoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    descricao?: boolean
    descricaoCurta?: boolean
    status?: boolean
    ncm?: boolean
    cest?: boolean
    origem?: boolean
    precoCusto?: boolean
    precoVenda?: boolean
    precoPromocional?: boolean
    peso?: boolean
    altura?: boolean
    largura?: boolean
    comprimento?: boolean
    tags?: boolean
    metaTitulo?: boolean
    metaDescricao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    categoriaId?: boolean
    marcaId?: boolean
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    marca?: boolean | Produto$marcaArgs<ExtArgs>
    imagens?: boolean | Produto$imagensArgs<ExtArgs>
    variacoes?: boolean | Produto$variacoesArgs<ExtArgs>
    _count?: boolean | ProdutoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produto"]>

  export type ProdutoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    descricao?: boolean
    descricaoCurta?: boolean
    status?: boolean
    ncm?: boolean
    cest?: boolean
    origem?: boolean
    precoCusto?: boolean
    precoVenda?: boolean
    precoPromocional?: boolean
    peso?: boolean
    altura?: boolean
    largura?: boolean
    comprimento?: boolean
    tags?: boolean
    metaTitulo?: boolean
    metaDescricao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    categoriaId?: boolean
    marcaId?: boolean
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    marca?: boolean | Produto$marcaArgs<ExtArgs>
  }, ExtArgs["result"]["produto"]>

  export type ProdutoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    descricao?: boolean
    descricaoCurta?: boolean
    status?: boolean
    ncm?: boolean
    cest?: boolean
    origem?: boolean
    precoCusto?: boolean
    precoVenda?: boolean
    precoPromocional?: boolean
    peso?: boolean
    altura?: boolean
    largura?: boolean
    comprimento?: boolean
    tags?: boolean
    metaTitulo?: boolean
    metaDescricao?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    categoriaId?: boolean
    marcaId?: boolean
  }

  export type ProdutoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    marca?: boolean | Produto$marcaArgs<ExtArgs>
    imagens?: boolean | Produto$imagensArgs<ExtArgs>
    variacoes?: boolean | Produto$variacoesArgs<ExtArgs>
    _count?: boolean | ProdutoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProdutoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categoria?: boolean | CategoriaDefaultArgs<ExtArgs>
    marca?: boolean | Produto$marcaArgs<ExtArgs>
  }

  export type $ProdutoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Produto"
    objects: {
      categoria: Prisma.$CategoriaPayload<ExtArgs>
      marca: Prisma.$MarcaPayload<ExtArgs> | null
      imagens: Prisma.$ImagemProdutoPayload<ExtArgs>[]
      variacoes: Prisma.$VariacaoProdutoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      sku: string
      gtin: string | null
      nome: string
      descricao: string
      descricaoCurta: string | null
      status: string
      ncm: string
      cest: string | null
      origem: number
      precoCusto: number
      precoVenda: number
      precoPromocional: number | null
      peso: number
      altura: number
      largura: number
      comprimento: number
      tags: string[]
      metaTitulo: string | null
      metaDescricao: string | null
      criadoEm: Date
      atualizadoEm: Date
      categoriaId: string
      marcaId: string | null
    }, ExtArgs["result"]["produto"]>
    composites: {}
  }

  type ProdutoGetPayload<S extends boolean | null | undefined | ProdutoDefaultArgs> = $Result.GetResult<Prisma.$ProdutoPayload, S>

  type ProdutoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProdutoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProdutoCountAggregateInputType | true
    }

  export interface ProdutoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Produto'], meta: { name: 'Produto' } }
    /**
     * Find zero or one Produto that matches the filter.
     * @param {ProdutoFindUniqueArgs} args - Arguments to find a Produto
     * @example
     * // Get one Produto
     * const produto = await prisma.produto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProdutoFindUniqueArgs>(args: SelectSubset<T, ProdutoFindUniqueArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Produto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProdutoFindUniqueOrThrowArgs} args - Arguments to find a Produto
     * @example
     * // Get one Produto
     * const produto = await prisma.produto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProdutoFindUniqueOrThrowArgs>(args: SelectSubset<T, ProdutoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Produto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoFindFirstArgs} args - Arguments to find a Produto
     * @example
     * // Get one Produto
     * const produto = await prisma.produto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProdutoFindFirstArgs>(args?: SelectSubset<T, ProdutoFindFirstArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Produto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoFindFirstOrThrowArgs} args - Arguments to find a Produto
     * @example
     * // Get one Produto
     * const produto = await prisma.produto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProdutoFindFirstOrThrowArgs>(args?: SelectSubset<T, ProdutoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Produtos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Produtos
     * const produtos = await prisma.produto.findMany()
     * 
     * // Get first 10 Produtos
     * const produtos = await prisma.produto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const produtoWithIdOnly = await prisma.produto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProdutoFindManyArgs>(args?: SelectSubset<T, ProdutoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Produto.
     * @param {ProdutoCreateArgs} args - Arguments to create a Produto.
     * @example
     * // Create one Produto
     * const Produto = await prisma.produto.create({
     *   data: {
     *     // ... data to create a Produto
     *   }
     * })
     * 
     */
    create<T extends ProdutoCreateArgs>(args: SelectSubset<T, ProdutoCreateArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Produtos.
     * @param {ProdutoCreateManyArgs} args - Arguments to create many Produtos.
     * @example
     * // Create many Produtos
     * const produto = await prisma.produto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProdutoCreateManyArgs>(args?: SelectSubset<T, ProdutoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Produtos and returns the data saved in the database.
     * @param {ProdutoCreateManyAndReturnArgs} args - Arguments to create many Produtos.
     * @example
     * // Create many Produtos
     * const produto = await prisma.produto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Produtos and only return the `id`
     * const produtoWithIdOnly = await prisma.produto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProdutoCreateManyAndReturnArgs>(args?: SelectSubset<T, ProdutoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Produto.
     * @param {ProdutoDeleteArgs} args - Arguments to delete one Produto.
     * @example
     * // Delete one Produto
     * const Produto = await prisma.produto.delete({
     *   where: {
     *     // ... filter to delete one Produto
     *   }
     * })
     * 
     */
    delete<T extends ProdutoDeleteArgs>(args: SelectSubset<T, ProdutoDeleteArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Produto.
     * @param {ProdutoUpdateArgs} args - Arguments to update one Produto.
     * @example
     * // Update one Produto
     * const produto = await prisma.produto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProdutoUpdateArgs>(args: SelectSubset<T, ProdutoUpdateArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Produtos.
     * @param {ProdutoDeleteManyArgs} args - Arguments to filter Produtos to delete.
     * @example
     * // Delete a few Produtos
     * const { count } = await prisma.produto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProdutoDeleteManyArgs>(args?: SelectSubset<T, ProdutoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Produtos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Produtos
     * const produto = await prisma.produto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProdutoUpdateManyArgs>(args: SelectSubset<T, ProdutoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Produto.
     * @param {ProdutoUpsertArgs} args - Arguments to update or create a Produto.
     * @example
     * // Update or create a Produto
     * const produto = await prisma.produto.upsert({
     *   create: {
     *     // ... data to create a Produto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Produto we want to update
     *   }
     * })
     */
    upsert<T extends ProdutoUpsertArgs>(args: SelectSubset<T, ProdutoUpsertArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Produtos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoCountArgs} args - Arguments to filter Produtos to count.
     * @example
     * // Count the number of Produtos
     * const count = await prisma.produto.count({
     *   where: {
     *     // ... the filter for the Produtos we want to count
     *   }
     * })
    **/
    count<T extends ProdutoCountArgs>(
      args?: Subset<T, ProdutoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProdutoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Produto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProdutoAggregateArgs>(args: Subset<T, ProdutoAggregateArgs>): Prisma.PrismaPromise<GetProdutoAggregateType<T>>

    /**
     * Group by Produto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProdutoGroupByArgs} args - Group by arguments.
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
      T extends ProdutoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProdutoGroupByArgs['orderBy'] }
        : { orderBy?: ProdutoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProdutoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProdutoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Produto model
   */
  readonly fields: ProdutoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Produto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProdutoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categoria<T extends CategoriaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoriaDefaultArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    marca<T extends Produto$marcaArgs<ExtArgs> = {}>(args?: Subset<T, Produto$marcaArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    imagens<T extends Produto$imagensArgs<ExtArgs> = {}>(args?: Subset<T, Produto$imagensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findMany"> | Null>
    variacoes<T extends Produto$variacoesArgs<ExtArgs> = {}>(args?: Subset<T, Produto$variacoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Produto model
   */ 
  interface ProdutoFieldRefs {
    readonly id: FieldRef<"Produto", 'String'>
    readonly tenantId: FieldRef<"Produto", 'String'>
    readonly sku: FieldRef<"Produto", 'String'>
    readonly gtin: FieldRef<"Produto", 'String'>
    readonly nome: FieldRef<"Produto", 'String'>
    readonly descricao: FieldRef<"Produto", 'String'>
    readonly descricaoCurta: FieldRef<"Produto", 'String'>
    readonly status: FieldRef<"Produto", 'String'>
    readonly ncm: FieldRef<"Produto", 'String'>
    readonly cest: FieldRef<"Produto", 'String'>
    readonly origem: FieldRef<"Produto", 'Int'>
    readonly precoCusto: FieldRef<"Produto", 'Int'>
    readonly precoVenda: FieldRef<"Produto", 'Int'>
    readonly precoPromocional: FieldRef<"Produto", 'Int'>
    readonly peso: FieldRef<"Produto", 'Int'>
    readonly altura: FieldRef<"Produto", 'Float'>
    readonly largura: FieldRef<"Produto", 'Float'>
    readonly comprimento: FieldRef<"Produto", 'Float'>
    readonly tags: FieldRef<"Produto", 'String[]'>
    readonly metaTitulo: FieldRef<"Produto", 'String'>
    readonly metaDescricao: FieldRef<"Produto", 'String'>
    readonly criadoEm: FieldRef<"Produto", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Produto", 'DateTime'>
    readonly categoriaId: FieldRef<"Produto", 'String'>
    readonly marcaId: FieldRef<"Produto", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Produto findUnique
   */
  export type ProdutoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter, which Produto to fetch.
     */
    where: ProdutoWhereUniqueInput
  }

  /**
   * Produto findUniqueOrThrow
   */
  export type ProdutoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter, which Produto to fetch.
     */
    where: ProdutoWhereUniqueInput
  }

  /**
   * Produto findFirst
   */
  export type ProdutoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter, which Produto to fetch.
     */
    where?: ProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Produtos to fetch.
     */
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Produtos.
     */
    cursor?: ProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Produtos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Produtos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Produtos.
     */
    distinct?: ProdutoScalarFieldEnum | ProdutoScalarFieldEnum[]
  }

  /**
   * Produto findFirstOrThrow
   */
  export type ProdutoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter, which Produto to fetch.
     */
    where?: ProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Produtos to fetch.
     */
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Produtos.
     */
    cursor?: ProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Produtos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Produtos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Produtos.
     */
    distinct?: ProdutoScalarFieldEnum | ProdutoScalarFieldEnum[]
  }

  /**
   * Produto findMany
   */
  export type ProdutoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter, which Produtos to fetch.
     */
    where?: ProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Produtos to fetch.
     */
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Produtos.
     */
    cursor?: ProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Produtos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Produtos.
     */
    skip?: number
    distinct?: ProdutoScalarFieldEnum | ProdutoScalarFieldEnum[]
  }

  /**
   * Produto create
   */
  export type ProdutoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * The data needed to create a Produto.
     */
    data: XOR<ProdutoCreateInput, ProdutoUncheckedCreateInput>
  }

  /**
   * Produto createMany
   */
  export type ProdutoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Produtos.
     */
    data: ProdutoCreateManyInput | ProdutoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Produto createManyAndReturn
   */
  export type ProdutoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Produtos.
     */
    data: ProdutoCreateManyInput | ProdutoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Produto update
   */
  export type ProdutoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * The data needed to update a Produto.
     */
    data: XOR<ProdutoUpdateInput, ProdutoUncheckedUpdateInput>
    /**
     * Choose, which Produto to update.
     */
    where: ProdutoWhereUniqueInput
  }

  /**
   * Produto updateMany
   */
  export type ProdutoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Produtos.
     */
    data: XOR<ProdutoUpdateManyMutationInput, ProdutoUncheckedUpdateManyInput>
    /**
     * Filter which Produtos to update
     */
    where?: ProdutoWhereInput
  }

  /**
   * Produto upsert
   */
  export type ProdutoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * The filter to search for the Produto to update in case it exists.
     */
    where: ProdutoWhereUniqueInput
    /**
     * In case the Produto found by the `where` argument doesn't exist, create a new Produto with this data.
     */
    create: XOR<ProdutoCreateInput, ProdutoUncheckedCreateInput>
    /**
     * In case the Produto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProdutoUpdateInput, ProdutoUncheckedUpdateInput>
  }

  /**
   * Produto delete
   */
  export type ProdutoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    /**
     * Filter which Produto to delete.
     */
    where: ProdutoWhereUniqueInput
  }

  /**
   * Produto deleteMany
   */
  export type ProdutoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Produtos to delete
     */
    where?: ProdutoWhereInput
  }

  /**
   * Produto.marca
   */
  export type Produto$marcaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    where?: MarcaWhereInput
  }

  /**
   * Produto.imagens
   */
  export type Produto$imagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    where?: ImagemProdutoWhereInput
    orderBy?: ImagemProdutoOrderByWithRelationInput | ImagemProdutoOrderByWithRelationInput[]
    cursor?: ImagemProdutoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImagemProdutoScalarFieldEnum | ImagemProdutoScalarFieldEnum[]
  }

  /**
   * Produto.variacoes
   */
  export type Produto$variacoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    where?: VariacaoProdutoWhereInput
    orderBy?: VariacaoProdutoOrderByWithRelationInput | VariacaoProdutoOrderByWithRelationInput[]
    cursor?: VariacaoProdutoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VariacaoProdutoScalarFieldEnum | VariacaoProdutoScalarFieldEnum[]
  }

  /**
   * Produto without action
   */
  export type ProdutoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
  }


  /**
   * Model ImagemProduto
   */

  export type AggregateImagemProduto = {
    _count: ImagemProdutoCountAggregateOutputType | null
    _avg: ImagemProdutoAvgAggregateOutputType | null
    _sum: ImagemProdutoSumAggregateOutputType | null
    _min: ImagemProdutoMinAggregateOutputType | null
    _max: ImagemProdutoMaxAggregateOutputType | null
  }

  export type ImagemProdutoAvgAggregateOutputType = {
    ordem: number | null
  }

  export type ImagemProdutoSumAggregateOutputType = {
    ordem: number | null
  }

  export type ImagemProdutoMinAggregateOutputType = {
    id: string | null
    produtoId: string | null
    url: string | null
    urlMiniatura: string | null
    altText: string | null
    ordem: number | null
    principal: boolean | null
    criadoEm: Date | null
  }

  export type ImagemProdutoMaxAggregateOutputType = {
    id: string | null
    produtoId: string | null
    url: string | null
    urlMiniatura: string | null
    altText: string | null
    ordem: number | null
    principal: boolean | null
    criadoEm: Date | null
  }

  export type ImagemProdutoCountAggregateOutputType = {
    id: number
    produtoId: number
    url: number
    urlMiniatura: number
    altText: number
    ordem: number
    principal: number
    criadoEm: number
    _all: number
  }


  export type ImagemProdutoAvgAggregateInputType = {
    ordem?: true
  }

  export type ImagemProdutoSumAggregateInputType = {
    ordem?: true
  }

  export type ImagemProdutoMinAggregateInputType = {
    id?: true
    produtoId?: true
    url?: true
    urlMiniatura?: true
    altText?: true
    ordem?: true
    principal?: true
    criadoEm?: true
  }

  export type ImagemProdutoMaxAggregateInputType = {
    id?: true
    produtoId?: true
    url?: true
    urlMiniatura?: true
    altText?: true
    ordem?: true
    principal?: true
    criadoEm?: true
  }

  export type ImagemProdutoCountAggregateInputType = {
    id?: true
    produtoId?: true
    url?: true
    urlMiniatura?: true
    altText?: true
    ordem?: true
    principal?: true
    criadoEm?: true
    _all?: true
  }

  export type ImagemProdutoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagemProduto to aggregate.
     */
    where?: ImagemProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemProdutos to fetch.
     */
    orderBy?: ImagemProdutoOrderByWithRelationInput | ImagemProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImagemProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImagemProdutos
    **/
    _count?: true | ImagemProdutoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImagemProdutoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImagemProdutoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImagemProdutoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImagemProdutoMaxAggregateInputType
  }

  export type GetImagemProdutoAggregateType<T extends ImagemProdutoAggregateArgs> = {
        [P in keyof T & keyof AggregateImagemProduto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImagemProduto[P]>
      : GetScalarType<T[P], AggregateImagemProduto[P]>
  }




  export type ImagemProdutoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagemProdutoWhereInput
    orderBy?: ImagemProdutoOrderByWithAggregationInput | ImagemProdutoOrderByWithAggregationInput[]
    by: ImagemProdutoScalarFieldEnum[] | ImagemProdutoScalarFieldEnum
    having?: ImagemProdutoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImagemProdutoCountAggregateInputType | true
    _avg?: ImagemProdutoAvgAggregateInputType
    _sum?: ImagemProdutoSumAggregateInputType
    _min?: ImagemProdutoMinAggregateInputType
    _max?: ImagemProdutoMaxAggregateInputType
  }

  export type ImagemProdutoGroupByOutputType = {
    id: string
    produtoId: string
    url: string
    urlMiniatura: string | null
    altText: string | null
    ordem: number
    principal: boolean
    criadoEm: Date
    _count: ImagemProdutoCountAggregateOutputType | null
    _avg: ImagemProdutoAvgAggregateOutputType | null
    _sum: ImagemProdutoSumAggregateOutputType | null
    _min: ImagemProdutoMinAggregateOutputType | null
    _max: ImagemProdutoMaxAggregateOutputType | null
  }

  type GetImagemProdutoGroupByPayload<T extends ImagemProdutoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImagemProdutoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImagemProdutoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImagemProdutoGroupByOutputType[P]>
            : GetScalarType<T[P], ImagemProdutoGroupByOutputType[P]>
        }
      >
    >


  export type ImagemProdutoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    produtoId?: boolean
    url?: boolean
    urlMiniatura?: boolean
    altText?: boolean
    ordem?: boolean
    principal?: boolean
    criadoEm?: boolean
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imagemProduto"]>

  export type ImagemProdutoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    produtoId?: boolean
    url?: boolean
    urlMiniatura?: boolean
    altText?: boolean
    ordem?: boolean
    principal?: boolean
    criadoEm?: boolean
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imagemProduto"]>

  export type ImagemProdutoSelectScalar = {
    id?: boolean
    produtoId?: boolean
    url?: boolean
    urlMiniatura?: boolean
    altText?: boolean
    ordem?: boolean
    principal?: boolean
    criadoEm?: boolean
  }

  export type ImagemProdutoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }
  export type ImagemProdutoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }

  export type $ImagemProdutoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImagemProduto"
    objects: {
      produto: Prisma.$ProdutoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      produtoId: string
      url: string
      urlMiniatura: string | null
      altText: string | null
      ordem: number
      principal: boolean
      criadoEm: Date
    }, ExtArgs["result"]["imagemProduto"]>
    composites: {}
  }

  type ImagemProdutoGetPayload<S extends boolean | null | undefined | ImagemProdutoDefaultArgs> = $Result.GetResult<Prisma.$ImagemProdutoPayload, S>

  type ImagemProdutoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImagemProdutoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImagemProdutoCountAggregateInputType | true
    }

  export interface ImagemProdutoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImagemProduto'], meta: { name: 'ImagemProduto' } }
    /**
     * Find zero or one ImagemProduto that matches the filter.
     * @param {ImagemProdutoFindUniqueArgs} args - Arguments to find a ImagemProduto
     * @example
     * // Get one ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImagemProdutoFindUniqueArgs>(args: SelectSubset<T, ImagemProdutoFindUniqueArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ImagemProduto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImagemProdutoFindUniqueOrThrowArgs} args - Arguments to find a ImagemProduto
     * @example
     * // Get one ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImagemProdutoFindUniqueOrThrowArgs>(args: SelectSubset<T, ImagemProdutoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ImagemProduto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoFindFirstArgs} args - Arguments to find a ImagemProduto
     * @example
     * // Get one ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImagemProdutoFindFirstArgs>(args?: SelectSubset<T, ImagemProdutoFindFirstArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ImagemProduto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoFindFirstOrThrowArgs} args - Arguments to find a ImagemProduto
     * @example
     * // Get one ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImagemProdutoFindFirstOrThrowArgs>(args?: SelectSubset<T, ImagemProdutoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ImagemProdutos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImagemProdutos
     * const imagemProdutos = await prisma.imagemProduto.findMany()
     * 
     * // Get first 10 ImagemProdutos
     * const imagemProdutos = await prisma.imagemProduto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imagemProdutoWithIdOnly = await prisma.imagemProduto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImagemProdutoFindManyArgs>(args?: SelectSubset<T, ImagemProdutoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ImagemProduto.
     * @param {ImagemProdutoCreateArgs} args - Arguments to create a ImagemProduto.
     * @example
     * // Create one ImagemProduto
     * const ImagemProduto = await prisma.imagemProduto.create({
     *   data: {
     *     // ... data to create a ImagemProduto
     *   }
     * })
     * 
     */
    create<T extends ImagemProdutoCreateArgs>(args: SelectSubset<T, ImagemProdutoCreateArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ImagemProdutos.
     * @param {ImagemProdutoCreateManyArgs} args - Arguments to create many ImagemProdutos.
     * @example
     * // Create many ImagemProdutos
     * const imagemProduto = await prisma.imagemProduto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImagemProdutoCreateManyArgs>(args?: SelectSubset<T, ImagemProdutoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImagemProdutos and returns the data saved in the database.
     * @param {ImagemProdutoCreateManyAndReturnArgs} args - Arguments to create many ImagemProdutos.
     * @example
     * // Create many ImagemProdutos
     * const imagemProduto = await prisma.imagemProduto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImagemProdutos and only return the `id`
     * const imagemProdutoWithIdOnly = await prisma.imagemProduto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImagemProdutoCreateManyAndReturnArgs>(args?: SelectSubset<T, ImagemProdutoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ImagemProduto.
     * @param {ImagemProdutoDeleteArgs} args - Arguments to delete one ImagemProduto.
     * @example
     * // Delete one ImagemProduto
     * const ImagemProduto = await prisma.imagemProduto.delete({
     *   where: {
     *     // ... filter to delete one ImagemProduto
     *   }
     * })
     * 
     */
    delete<T extends ImagemProdutoDeleteArgs>(args: SelectSubset<T, ImagemProdutoDeleteArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ImagemProduto.
     * @param {ImagemProdutoUpdateArgs} args - Arguments to update one ImagemProduto.
     * @example
     * // Update one ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImagemProdutoUpdateArgs>(args: SelectSubset<T, ImagemProdutoUpdateArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ImagemProdutos.
     * @param {ImagemProdutoDeleteManyArgs} args - Arguments to filter ImagemProdutos to delete.
     * @example
     * // Delete a few ImagemProdutos
     * const { count } = await prisma.imagemProduto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImagemProdutoDeleteManyArgs>(args?: SelectSubset<T, ImagemProdutoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImagemProdutos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImagemProdutos
     * const imagemProduto = await prisma.imagemProduto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImagemProdutoUpdateManyArgs>(args: SelectSubset<T, ImagemProdutoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImagemProduto.
     * @param {ImagemProdutoUpsertArgs} args - Arguments to update or create a ImagemProduto.
     * @example
     * // Update or create a ImagemProduto
     * const imagemProduto = await prisma.imagemProduto.upsert({
     *   create: {
     *     // ... data to create a ImagemProduto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImagemProduto we want to update
     *   }
     * })
     */
    upsert<T extends ImagemProdutoUpsertArgs>(args: SelectSubset<T, ImagemProdutoUpsertArgs<ExtArgs>>): Prisma__ImagemProdutoClient<$Result.GetResult<Prisma.$ImagemProdutoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ImagemProdutos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoCountArgs} args - Arguments to filter ImagemProdutos to count.
     * @example
     * // Count the number of ImagemProdutos
     * const count = await prisma.imagemProduto.count({
     *   where: {
     *     // ... the filter for the ImagemProdutos we want to count
     *   }
     * })
    **/
    count<T extends ImagemProdutoCountArgs>(
      args?: Subset<T, ImagemProdutoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImagemProdutoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImagemProduto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImagemProdutoAggregateArgs>(args: Subset<T, ImagemProdutoAggregateArgs>): Prisma.PrismaPromise<GetImagemProdutoAggregateType<T>>

    /**
     * Group by ImagemProduto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemProdutoGroupByArgs} args - Group by arguments.
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
      T extends ImagemProdutoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImagemProdutoGroupByArgs['orderBy'] }
        : { orderBy?: ImagemProdutoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImagemProdutoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImagemProdutoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImagemProduto model
   */
  readonly fields: ImagemProdutoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImagemProduto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImagemProdutoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produto<T extends ProdutoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProdutoDefaultArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ImagemProduto model
   */ 
  interface ImagemProdutoFieldRefs {
    readonly id: FieldRef<"ImagemProduto", 'String'>
    readonly produtoId: FieldRef<"ImagemProduto", 'String'>
    readonly url: FieldRef<"ImagemProduto", 'String'>
    readonly urlMiniatura: FieldRef<"ImagemProduto", 'String'>
    readonly altText: FieldRef<"ImagemProduto", 'String'>
    readonly ordem: FieldRef<"ImagemProduto", 'Int'>
    readonly principal: FieldRef<"ImagemProduto", 'Boolean'>
    readonly criadoEm: FieldRef<"ImagemProduto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImagemProduto findUnique
   */
  export type ImagemProdutoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemProduto to fetch.
     */
    where: ImagemProdutoWhereUniqueInput
  }

  /**
   * ImagemProduto findUniqueOrThrow
   */
  export type ImagemProdutoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemProduto to fetch.
     */
    where: ImagemProdutoWhereUniqueInput
  }

  /**
   * ImagemProduto findFirst
   */
  export type ImagemProdutoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemProduto to fetch.
     */
    where?: ImagemProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemProdutos to fetch.
     */
    orderBy?: ImagemProdutoOrderByWithRelationInput | ImagemProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagemProdutos.
     */
    cursor?: ImagemProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagemProdutos.
     */
    distinct?: ImagemProdutoScalarFieldEnum | ImagemProdutoScalarFieldEnum[]
  }

  /**
   * ImagemProduto findFirstOrThrow
   */
  export type ImagemProdutoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemProduto to fetch.
     */
    where?: ImagemProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemProdutos to fetch.
     */
    orderBy?: ImagemProdutoOrderByWithRelationInput | ImagemProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagemProdutos.
     */
    cursor?: ImagemProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagemProdutos.
     */
    distinct?: ImagemProdutoScalarFieldEnum | ImagemProdutoScalarFieldEnum[]
  }

  /**
   * ImagemProduto findMany
   */
  export type ImagemProdutoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemProdutos to fetch.
     */
    where?: ImagemProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemProdutos to fetch.
     */
    orderBy?: ImagemProdutoOrderByWithRelationInput | ImagemProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImagemProdutos.
     */
    cursor?: ImagemProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemProdutos.
     */
    skip?: number
    distinct?: ImagemProdutoScalarFieldEnum | ImagemProdutoScalarFieldEnum[]
  }

  /**
   * ImagemProduto create
   */
  export type ImagemProdutoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * The data needed to create a ImagemProduto.
     */
    data: XOR<ImagemProdutoCreateInput, ImagemProdutoUncheckedCreateInput>
  }

  /**
   * ImagemProduto createMany
   */
  export type ImagemProdutoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImagemProdutos.
     */
    data: ImagemProdutoCreateManyInput | ImagemProdutoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagemProduto createManyAndReturn
   */
  export type ImagemProdutoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ImagemProdutos.
     */
    data: ImagemProdutoCreateManyInput | ImagemProdutoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImagemProduto update
   */
  export type ImagemProdutoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * The data needed to update a ImagemProduto.
     */
    data: XOR<ImagemProdutoUpdateInput, ImagemProdutoUncheckedUpdateInput>
    /**
     * Choose, which ImagemProduto to update.
     */
    where: ImagemProdutoWhereUniqueInput
  }

  /**
   * ImagemProduto updateMany
   */
  export type ImagemProdutoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImagemProdutos.
     */
    data: XOR<ImagemProdutoUpdateManyMutationInput, ImagemProdutoUncheckedUpdateManyInput>
    /**
     * Filter which ImagemProdutos to update
     */
    where?: ImagemProdutoWhereInput
  }

  /**
   * ImagemProduto upsert
   */
  export type ImagemProdutoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * The filter to search for the ImagemProduto to update in case it exists.
     */
    where: ImagemProdutoWhereUniqueInput
    /**
     * In case the ImagemProduto found by the `where` argument doesn't exist, create a new ImagemProduto with this data.
     */
    create: XOR<ImagemProdutoCreateInput, ImagemProdutoUncheckedCreateInput>
    /**
     * In case the ImagemProduto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImagemProdutoUpdateInput, ImagemProdutoUncheckedUpdateInput>
  }

  /**
   * ImagemProduto delete
   */
  export type ImagemProdutoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
    /**
     * Filter which ImagemProduto to delete.
     */
    where: ImagemProdutoWhereUniqueInput
  }

  /**
   * ImagemProduto deleteMany
   */
  export type ImagemProdutoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagemProdutos to delete
     */
    where?: ImagemProdutoWhereInput
  }

  /**
   * ImagemProduto without action
   */
  export type ImagemProdutoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemProduto
     */
    select?: ImagemProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemProdutoInclude<ExtArgs> | null
  }


  /**
   * Model VariacaoProduto
   */

  export type AggregateVariacaoProduto = {
    _count: VariacaoProdutoCountAggregateOutputType | null
    _avg: VariacaoProdutoAvgAggregateOutputType | null
    _sum: VariacaoProdutoSumAggregateOutputType | null
    _min: VariacaoProdutoMinAggregateOutputType | null
    _max: VariacaoProdutoMaxAggregateOutputType | null
  }

  export type VariacaoProdutoAvgAggregateOutputType = {
    precoVenda: number | null
    peso: number | null
  }

  export type VariacaoProdutoSumAggregateOutputType = {
    precoVenda: number | null
    peso: number | null
  }

  export type VariacaoProdutoMinAggregateOutputType = {
    id: string | null
    produtoId: string | null
    sku: string | null
    gtin: string | null
    nome: string | null
    precoVenda: number | null
    peso: number | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type VariacaoProdutoMaxAggregateOutputType = {
    id: string | null
    produtoId: string | null
    sku: string | null
    gtin: string | null
    nome: string | null
    precoVenda: number | null
    peso: number | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type VariacaoProdutoCountAggregateOutputType = {
    id: number
    produtoId: number
    sku: number
    gtin: number
    nome: number
    precoVenda: number
    peso: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type VariacaoProdutoAvgAggregateInputType = {
    precoVenda?: true
    peso?: true
  }

  export type VariacaoProdutoSumAggregateInputType = {
    precoVenda?: true
    peso?: true
  }

  export type VariacaoProdutoMinAggregateInputType = {
    id?: true
    produtoId?: true
    sku?: true
    gtin?: true
    nome?: true
    precoVenda?: true
    peso?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type VariacaoProdutoMaxAggregateInputType = {
    id?: true
    produtoId?: true
    sku?: true
    gtin?: true
    nome?: true
    precoVenda?: true
    peso?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type VariacaoProdutoCountAggregateInputType = {
    id?: true
    produtoId?: true
    sku?: true
    gtin?: true
    nome?: true
    precoVenda?: true
    peso?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type VariacaoProdutoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VariacaoProduto to aggregate.
     */
    where?: VariacaoProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VariacaoProdutos to fetch.
     */
    orderBy?: VariacaoProdutoOrderByWithRelationInput | VariacaoProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VariacaoProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VariacaoProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VariacaoProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VariacaoProdutos
    **/
    _count?: true | VariacaoProdutoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VariacaoProdutoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VariacaoProdutoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VariacaoProdutoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VariacaoProdutoMaxAggregateInputType
  }

  export type GetVariacaoProdutoAggregateType<T extends VariacaoProdutoAggregateArgs> = {
        [P in keyof T & keyof AggregateVariacaoProduto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVariacaoProduto[P]>
      : GetScalarType<T[P], AggregateVariacaoProduto[P]>
  }




  export type VariacaoProdutoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VariacaoProdutoWhereInput
    orderBy?: VariacaoProdutoOrderByWithAggregationInput | VariacaoProdutoOrderByWithAggregationInput[]
    by: VariacaoProdutoScalarFieldEnum[] | VariacaoProdutoScalarFieldEnum
    having?: VariacaoProdutoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VariacaoProdutoCountAggregateInputType | true
    _avg?: VariacaoProdutoAvgAggregateInputType
    _sum?: VariacaoProdutoSumAggregateInputType
    _min?: VariacaoProdutoMinAggregateInputType
    _max?: VariacaoProdutoMaxAggregateInputType
  }

  export type VariacaoProdutoGroupByOutputType = {
    id: string
    produtoId: string
    sku: string
    gtin: string | null
    nome: string
    precoVenda: number | null
    peso: number | null
    criadoEm: Date
    atualizadoEm: Date
    _count: VariacaoProdutoCountAggregateOutputType | null
    _avg: VariacaoProdutoAvgAggregateOutputType | null
    _sum: VariacaoProdutoSumAggregateOutputType | null
    _min: VariacaoProdutoMinAggregateOutputType | null
    _max: VariacaoProdutoMaxAggregateOutputType | null
  }

  type GetVariacaoProdutoGroupByPayload<T extends VariacaoProdutoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VariacaoProdutoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VariacaoProdutoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VariacaoProdutoGroupByOutputType[P]>
            : GetScalarType<T[P], VariacaoProdutoGroupByOutputType[P]>
        }
      >
    >


  export type VariacaoProdutoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    produtoId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    precoVenda?: boolean
    peso?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
    atributos?: boolean | VariacaoProduto$atributosArgs<ExtArgs>
    imagens?: boolean | VariacaoProduto$imagensArgs<ExtArgs>
    _count?: boolean | VariacaoProdutoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["variacaoProduto"]>

  export type VariacaoProdutoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    produtoId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    precoVenda?: boolean
    peso?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["variacaoProduto"]>

  export type VariacaoProdutoSelectScalar = {
    id?: boolean
    produtoId?: boolean
    sku?: boolean
    gtin?: boolean
    nome?: boolean
    precoVenda?: boolean
    peso?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type VariacaoProdutoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
    atributos?: boolean | VariacaoProduto$atributosArgs<ExtArgs>
    imagens?: boolean | VariacaoProduto$imagensArgs<ExtArgs>
    _count?: boolean | VariacaoProdutoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VariacaoProdutoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produto?: boolean | ProdutoDefaultArgs<ExtArgs>
  }

  export type $VariacaoProdutoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VariacaoProduto"
    objects: {
      produto: Prisma.$ProdutoPayload<ExtArgs>
      atributos: Prisma.$AtributoVariacaoPayload<ExtArgs>[]
      imagens: Prisma.$ImagemVariacaoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      produtoId: string
      sku: string
      gtin: string | null
      nome: string
      precoVenda: number | null
      peso: number | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["variacaoProduto"]>
    composites: {}
  }

  type VariacaoProdutoGetPayload<S extends boolean | null | undefined | VariacaoProdutoDefaultArgs> = $Result.GetResult<Prisma.$VariacaoProdutoPayload, S>

  type VariacaoProdutoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VariacaoProdutoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VariacaoProdutoCountAggregateInputType | true
    }

  export interface VariacaoProdutoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VariacaoProduto'], meta: { name: 'VariacaoProduto' } }
    /**
     * Find zero or one VariacaoProduto that matches the filter.
     * @param {VariacaoProdutoFindUniqueArgs} args - Arguments to find a VariacaoProduto
     * @example
     * // Get one VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VariacaoProdutoFindUniqueArgs>(args: SelectSubset<T, VariacaoProdutoFindUniqueArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VariacaoProduto that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VariacaoProdutoFindUniqueOrThrowArgs} args - Arguments to find a VariacaoProduto
     * @example
     * // Get one VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VariacaoProdutoFindUniqueOrThrowArgs>(args: SelectSubset<T, VariacaoProdutoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VariacaoProduto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoFindFirstArgs} args - Arguments to find a VariacaoProduto
     * @example
     * // Get one VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VariacaoProdutoFindFirstArgs>(args?: SelectSubset<T, VariacaoProdutoFindFirstArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VariacaoProduto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoFindFirstOrThrowArgs} args - Arguments to find a VariacaoProduto
     * @example
     * // Get one VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VariacaoProdutoFindFirstOrThrowArgs>(args?: SelectSubset<T, VariacaoProdutoFindFirstOrThrowArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VariacaoProdutos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VariacaoProdutos
     * const variacaoProdutos = await prisma.variacaoProduto.findMany()
     * 
     * // Get first 10 VariacaoProdutos
     * const variacaoProdutos = await prisma.variacaoProduto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const variacaoProdutoWithIdOnly = await prisma.variacaoProduto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VariacaoProdutoFindManyArgs>(args?: SelectSubset<T, VariacaoProdutoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VariacaoProduto.
     * @param {VariacaoProdutoCreateArgs} args - Arguments to create a VariacaoProduto.
     * @example
     * // Create one VariacaoProduto
     * const VariacaoProduto = await prisma.variacaoProduto.create({
     *   data: {
     *     // ... data to create a VariacaoProduto
     *   }
     * })
     * 
     */
    create<T extends VariacaoProdutoCreateArgs>(args: SelectSubset<T, VariacaoProdutoCreateArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VariacaoProdutos.
     * @param {VariacaoProdutoCreateManyArgs} args - Arguments to create many VariacaoProdutos.
     * @example
     * // Create many VariacaoProdutos
     * const variacaoProduto = await prisma.variacaoProduto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VariacaoProdutoCreateManyArgs>(args?: SelectSubset<T, VariacaoProdutoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VariacaoProdutos and returns the data saved in the database.
     * @param {VariacaoProdutoCreateManyAndReturnArgs} args - Arguments to create many VariacaoProdutos.
     * @example
     * // Create many VariacaoProdutos
     * const variacaoProduto = await prisma.variacaoProduto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VariacaoProdutos and only return the `id`
     * const variacaoProdutoWithIdOnly = await prisma.variacaoProduto.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VariacaoProdutoCreateManyAndReturnArgs>(args?: SelectSubset<T, VariacaoProdutoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VariacaoProduto.
     * @param {VariacaoProdutoDeleteArgs} args - Arguments to delete one VariacaoProduto.
     * @example
     * // Delete one VariacaoProduto
     * const VariacaoProduto = await prisma.variacaoProduto.delete({
     *   where: {
     *     // ... filter to delete one VariacaoProduto
     *   }
     * })
     * 
     */
    delete<T extends VariacaoProdutoDeleteArgs>(args: SelectSubset<T, VariacaoProdutoDeleteArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VariacaoProduto.
     * @param {VariacaoProdutoUpdateArgs} args - Arguments to update one VariacaoProduto.
     * @example
     * // Update one VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VariacaoProdutoUpdateArgs>(args: SelectSubset<T, VariacaoProdutoUpdateArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VariacaoProdutos.
     * @param {VariacaoProdutoDeleteManyArgs} args - Arguments to filter VariacaoProdutos to delete.
     * @example
     * // Delete a few VariacaoProdutos
     * const { count } = await prisma.variacaoProduto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VariacaoProdutoDeleteManyArgs>(args?: SelectSubset<T, VariacaoProdutoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VariacaoProdutos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VariacaoProdutos
     * const variacaoProduto = await prisma.variacaoProduto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VariacaoProdutoUpdateManyArgs>(args: SelectSubset<T, VariacaoProdutoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VariacaoProduto.
     * @param {VariacaoProdutoUpsertArgs} args - Arguments to update or create a VariacaoProduto.
     * @example
     * // Update or create a VariacaoProduto
     * const variacaoProduto = await prisma.variacaoProduto.upsert({
     *   create: {
     *     // ... data to create a VariacaoProduto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VariacaoProduto we want to update
     *   }
     * })
     */
    upsert<T extends VariacaoProdutoUpsertArgs>(args: SelectSubset<T, VariacaoProdutoUpsertArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VariacaoProdutos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoCountArgs} args - Arguments to filter VariacaoProdutos to count.
     * @example
     * // Count the number of VariacaoProdutos
     * const count = await prisma.variacaoProduto.count({
     *   where: {
     *     // ... the filter for the VariacaoProdutos we want to count
     *   }
     * })
    **/
    count<T extends VariacaoProdutoCountArgs>(
      args?: Subset<T, VariacaoProdutoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VariacaoProdutoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VariacaoProduto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VariacaoProdutoAggregateArgs>(args: Subset<T, VariacaoProdutoAggregateArgs>): Prisma.PrismaPromise<GetVariacaoProdutoAggregateType<T>>

    /**
     * Group by VariacaoProduto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VariacaoProdutoGroupByArgs} args - Group by arguments.
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
      T extends VariacaoProdutoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VariacaoProdutoGroupByArgs['orderBy'] }
        : { orderBy?: VariacaoProdutoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VariacaoProdutoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVariacaoProdutoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VariacaoProduto model
   */
  readonly fields: VariacaoProdutoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VariacaoProduto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VariacaoProdutoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produto<T extends ProdutoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProdutoDefaultArgs<ExtArgs>>): Prisma__ProdutoClient<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    atributos<T extends VariacaoProduto$atributosArgs<ExtArgs> = {}>(args?: Subset<T, VariacaoProduto$atributosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findMany"> | Null>
    imagens<T extends VariacaoProduto$imagensArgs<ExtArgs> = {}>(args?: Subset<T, VariacaoProduto$imagensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the VariacaoProduto model
   */ 
  interface VariacaoProdutoFieldRefs {
    readonly id: FieldRef<"VariacaoProduto", 'String'>
    readonly produtoId: FieldRef<"VariacaoProduto", 'String'>
    readonly sku: FieldRef<"VariacaoProduto", 'String'>
    readonly gtin: FieldRef<"VariacaoProduto", 'String'>
    readonly nome: FieldRef<"VariacaoProduto", 'String'>
    readonly precoVenda: FieldRef<"VariacaoProduto", 'Int'>
    readonly peso: FieldRef<"VariacaoProduto", 'Int'>
    readonly criadoEm: FieldRef<"VariacaoProduto", 'DateTime'>
    readonly atualizadoEm: FieldRef<"VariacaoProduto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VariacaoProduto findUnique
   */
  export type VariacaoProdutoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter, which VariacaoProduto to fetch.
     */
    where: VariacaoProdutoWhereUniqueInput
  }

  /**
   * VariacaoProduto findUniqueOrThrow
   */
  export type VariacaoProdutoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter, which VariacaoProduto to fetch.
     */
    where: VariacaoProdutoWhereUniqueInput
  }

  /**
   * VariacaoProduto findFirst
   */
  export type VariacaoProdutoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter, which VariacaoProduto to fetch.
     */
    where?: VariacaoProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VariacaoProdutos to fetch.
     */
    orderBy?: VariacaoProdutoOrderByWithRelationInput | VariacaoProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VariacaoProdutos.
     */
    cursor?: VariacaoProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VariacaoProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VariacaoProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VariacaoProdutos.
     */
    distinct?: VariacaoProdutoScalarFieldEnum | VariacaoProdutoScalarFieldEnum[]
  }

  /**
   * VariacaoProduto findFirstOrThrow
   */
  export type VariacaoProdutoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter, which VariacaoProduto to fetch.
     */
    where?: VariacaoProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VariacaoProdutos to fetch.
     */
    orderBy?: VariacaoProdutoOrderByWithRelationInput | VariacaoProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VariacaoProdutos.
     */
    cursor?: VariacaoProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VariacaoProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VariacaoProdutos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VariacaoProdutos.
     */
    distinct?: VariacaoProdutoScalarFieldEnum | VariacaoProdutoScalarFieldEnum[]
  }

  /**
   * VariacaoProduto findMany
   */
  export type VariacaoProdutoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter, which VariacaoProdutos to fetch.
     */
    where?: VariacaoProdutoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VariacaoProdutos to fetch.
     */
    orderBy?: VariacaoProdutoOrderByWithRelationInput | VariacaoProdutoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VariacaoProdutos.
     */
    cursor?: VariacaoProdutoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VariacaoProdutos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VariacaoProdutos.
     */
    skip?: number
    distinct?: VariacaoProdutoScalarFieldEnum | VariacaoProdutoScalarFieldEnum[]
  }

  /**
   * VariacaoProduto create
   */
  export type VariacaoProdutoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * The data needed to create a VariacaoProduto.
     */
    data: XOR<VariacaoProdutoCreateInput, VariacaoProdutoUncheckedCreateInput>
  }

  /**
   * VariacaoProduto createMany
   */
  export type VariacaoProdutoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VariacaoProdutos.
     */
    data: VariacaoProdutoCreateManyInput | VariacaoProdutoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VariacaoProduto createManyAndReturn
   */
  export type VariacaoProdutoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VariacaoProdutos.
     */
    data: VariacaoProdutoCreateManyInput | VariacaoProdutoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VariacaoProduto update
   */
  export type VariacaoProdutoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * The data needed to update a VariacaoProduto.
     */
    data: XOR<VariacaoProdutoUpdateInput, VariacaoProdutoUncheckedUpdateInput>
    /**
     * Choose, which VariacaoProduto to update.
     */
    where: VariacaoProdutoWhereUniqueInput
  }

  /**
   * VariacaoProduto updateMany
   */
  export type VariacaoProdutoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VariacaoProdutos.
     */
    data: XOR<VariacaoProdutoUpdateManyMutationInput, VariacaoProdutoUncheckedUpdateManyInput>
    /**
     * Filter which VariacaoProdutos to update
     */
    where?: VariacaoProdutoWhereInput
  }

  /**
   * VariacaoProduto upsert
   */
  export type VariacaoProdutoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * The filter to search for the VariacaoProduto to update in case it exists.
     */
    where: VariacaoProdutoWhereUniqueInput
    /**
     * In case the VariacaoProduto found by the `where` argument doesn't exist, create a new VariacaoProduto with this data.
     */
    create: XOR<VariacaoProdutoCreateInput, VariacaoProdutoUncheckedCreateInput>
    /**
     * In case the VariacaoProduto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VariacaoProdutoUpdateInput, VariacaoProdutoUncheckedUpdateInput>
  }

  /**
   * VariacaoProduto delete
   */
  export type VariacaoProdutoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
    /**
     * Filter which VariacaoProduto to delete.
     */
    where: VariacaoProdutoWhereUniqueInput
  }

  /**
   * VariacaoProduto deleteMany
   */
  export type VariacaoProdutoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VariacaoProdutos to delete
     */
    where?: VariacaoProdutoWhereInput
  }

  /**
   * VariacaoProduto.atributos
   */
  export type VariacaoProduto$atributosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    where?: AtributoVariacaoWhereInput
    orderBy?: AtributoVariacaoOrderByWithRelationInput | AtributoVariacaoOrderByWithRelationInput[]
    cursor?: AtributoVariacaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AtributoVariacaoScalarFieldEnum | AtributoVariacaoScalarFieldEnum[]
  }

  /**
   * VariacaoProduto.imagens
   */
  export type VariacaoProduto$imagensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    where?: ImagemVariacaoWhereInput
    orderBy?: ImagemVariacaoOrderByWithRelationInput | ImagemVariacaoOrderByWithRelationInput[]
    cursor?: ImagemVariacaoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImagemVariacaoScalarFieldEnum | ImagemVariacaoScalarFieldEnum[]
  }

  /**
   * VariacaoProduto without action
   */
  export type VariacaoProdutoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VariacaoProduto
     */
    select?: VariacaoProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VariacaoProdutoInclude<ExtArgs> | null
  }


  /**
   * Model AtributoVariacao
   */

  export type AggregateAtributoVariacao = {
    _count: AtributoVariacaoCountAggregateOutputType | null
    _min: AtributoVariacaoMinAggregateOutputType | null
    _max: AtributoVariacaoMaxAggregateOutputType | null
  }

  export type AtributoVariacaoMinAggregateOutputType = {
    id: string | null
    variacaoId: string | null
    nome: string | null
    valor: string | null
  }

  export type AtributoVariacaoMaxAggregateOutputType = {
    id: string | null
    variacaoId: string | null
    nome: string | null
    valor: string | null
  }

  export type AtributoVariacaoCountAggregateOutputType = {
    id: number
    variacaoId: number
    nome: number
    valor: number
    _all: number
  }


  export type AtributoVariacaoMinAggregateInputType = {
    id?: true
    variacaoId?: true
    nome?: true
    valor?: true
  }

  export type AtributoVariacaoMaxAggregateInputType = {
    id?: true
    variacaoId?: true
    nome?: true
    valor?: true
  }

  export type AtributoVariacaoCountAggregateInputType = {
    id?: true
    variacaoId?: true
    nome?: true
    valor?: true
    _all?: true
  }

  export type AtributoVariacaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AtributoVariacao to aggregate.
     */
    where?: AtributoVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtributoVariacaos to fetch.
     */
    orderBy?: AtributoVariacaoOrderByWithRelationInput | AtributoVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AtributoVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtributoVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtributoVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AtributoVariacaos
    **/
    _count?: true | AtributoVariacaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AtributoVariacaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AtributoVariacaoMaxAggregateInputType
  }

  export type GetAtributoVariacaoAggregateType<T extends AtributoVariacaoAggregateArgs> = {
        [P in keyof T & keyof AggregateAtributoVariacao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAtributoVariacao[P]>
      : GetScalarType<T[P], AggregateAtributoVariacao[P]>
  }




  export type AtributoVariacaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AtributoVariacaoWhereInput
    orderBy?: AtributoVariacaoOrderByWithAggregationInput | AtributoVariacaoOrderByWithAggregationInput[]
    by: AtributoVariacaoScalarFieldEnum[] | AtributoVariacaoScalarFieldEnum
    having?: AtributoVariacaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AtributoVariacaoCountAggregateInputType | true
    _min?: AtributoVariacaoMinAggregateInputType
    _max?: AtributoVariacaoMaxAggregateInputType
  }

  export type AtributoVariacaoGroupByOutputType = {
    id: string
    variacaoId: string
    nome: string
    valor: string
    _count: AtributoVariacaoCountAggregateOutputType | null
    _min: AtributoVariacaoMinAggregateOutputType | null
    _max: AtributoVariacaoMaxAggregateOutputType | null
  }

  type GetAtributoVariacaoGroupByPayload<T extends AtributoVariacaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AtributoVariacaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AtributoVariacaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AtributoVariacaoGroupByOutputType[P]>
            : GetScalarType<T[P], AtributoVariacaoGroupByOutputType[P]>
        }
      >
    >


  export type AtributoVariacaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    variacaoId?: boolean
    nome?: boolean
    valor?: boolean
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["atributoVariacao"]>

  export type AtributoVariacaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    variacaoId?: boolean
    nome?: boolean
    valor?: boolean
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["atributoVariacao"]>

  export type AtributoVariacaoSelectScalar = {
    id?: boolean
    variacaoId?: boolean
    nome?: boolean
    valor?: boolean
  }

  export type AtributoVariacaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }
  export type AtributoVariacaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }

  export type $AtributoVariacaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AtributoVariacao"
    objects: {
      variacao: Prisma.$VariacaoProdutoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      variacaoId: string
      nome: string
      valor: string
    }, ExtArgs["result"]["atributoVariacao"]>
    composites: {}
  }

  type AtributoVariacaoGetPayload<S extends boolean | null | undefined | AtributoVariacaoDefaultArgs> = $Result.GetResult<Prisma.$AtributoVariacaoPayload, S>

  type AtributoVariacaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AtributoVariacaoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AtributoVariacaoCountAggregateInputType | true
    }

  export interface AtributoVariacaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AtributoVariacao'], meta: { name: 'AtributoVariacao' } }
    /**
     * Find zero or one AtributoVariacao that matches the filter.
     * @param {AtributoVariacaoFindUniqueArgs} args - Arguments to find a AtributoVariacao
     * @example
     * // Get one AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AtributoVariacaoFindUniqueArgs>(args: SelectSubset<T, AtributoVariacaoFindUniqueArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AtributoVariacao that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AtributoVariacaoFindUniqueOrThrowArgs} args - Arguments to find a AtributoVariacao
     * @example
     * // Get one AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AtributoVariacaoFindUniqueOrThrowArgs>(args: SelectSubset<T, AtributoVariacaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AtributoVariacao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoFindFirstArgs} args - Arguments to find a AtributoVariacao
     * @example
     * // Get one AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AtributoVariacaoFindFirstArgs>(args?: SelectSubset<T, AtributoVariacaoFindFirstArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AtributoVariacao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoFindFirstOrThrowArgs} args - Arguments to find a AtributoVariacao
     * @example
     * // Get one AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AtributoVariacaoFindFirstOrThrowArgs>(args?: SelectSubset<T, AtributoVariacaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AtributoVariacaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AtributoVariacaos
     * const atributoVariacaos = await prisma.atributoVariacao.findMany()
     * 
     * // Get first 10 AtributoVariacaos
     * const atributoVariacaos = await prisma.atributoVariacao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const atributoVariacaoWithIdOnly = await prisma.atributoVariacao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AtributoVariacaoFindManyArgs>(args?: SelectSubset<T, AtributoVariacaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AtributoVariacao.
     * @param {AtributoVariacaoCreateArgs} args - Arguments to create a AtributoVariacao.
     * @example
     * // Create one AtributoVariacao
     * const AtributoVariacao = await prisma.atributoVariacao.create({
     *   data: {
     *     // ... data to create a AtributoVariacao
     *   }
     * })
     * 
     */
    create<T extends AtributoVariacaoCreateArgs>(args: SelectSubset<T, AtributoVariacaoCreateArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AtributoVariacaos.
     * @param {AtributoVariacaoCreateManyArgs} args - Arguments to create many AtributoVariacaos.
     * @example
     * // Create many AtributoVariacaos
     * const atributoVariacao = await prisma.atributoVariacao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AtributoVariacaoCreateManyArgs>(args?: SelectSubset<T, AtributoVariacaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AtributoVariacaos and returns the data saved in the database.
     * @param {AtributoVariacaoCreateManyAndReturnArgs} args - Arguments to create many AtributoVariacaos.
     * @example
     * // Create many AtributoVariacaos
     * const atributoVariacao = await prisma.atributoVariacao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AtributoVariacaos and only return the `id`
     * const atributoVariacaoWithIdOnly = await prisma.atributoVariacao.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AtributoVariacaoCreateManyAndReturnArgs>(args?: SelectSubset<T, AtributoVariacaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AtributoVariacao.
     * @param {AtributoVariacaoDeleteArgs} args - Arguments to delete one AtributoVariacao.
     * @example
     * // Delete one AtributoVariacao
     * const AtributoVariacao = await prisma.atributoVariacao.delete({
     *   where: {
     *     // ... filter to delete one AtributoVariacao
     *   }
     * })
     * 
     */
    delete<T extends AtributoVariacaoDeleteArgs>(args: SelectSubset<T, AtributoVariacaoDeleteArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AtributoVariacao.
     * @param {AtributoVariacaoUpdateArgs} args - Arguments to update one AtributoVariacao.
     * @example
     * // Update one AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AtributoVariacaoUpdateArgs>(args: SelectSubset<T, AtributoVariacaoUpdateArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AtributoVariacaos.
     * @param {AtributoVariacaoDeleteManyArgs} args - Arguments to filter AtributoVariacaos to delete.
     * @example
     * // Delete a few AtributoVariacaos
     * const { count } = await prisma.atributoVariacao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AtributoVariacaoDeleteManyArgs>(args?: SelectSubset<T, AtributoVariacaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AtributoVariacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AtributoVariacaos
     * const atributoVariacao = await prisma.atributoVariacao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AtributoVariacaoUpdateManyArgs>(args: SelectSubset<T, AtributoVariacaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AtributoVariacao.
     * @param {AtributoVariacaoUpsertArgs} args - Arguments to update or create a AtributoVariacao.
     * @example
     * // Update or create a AtributoVariacao
     * const atributoVariacao = await prisma.atributoVariacao.upsert({
     *   create: {
     *     // ... data to create a AtributoVariacao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AtributoVariacao we want to update
     *   }
     * })
     */
    upsert<T extends AtributoVariacaoUpsertArgs>(args: SelectSubset<T, AtributoVariacaoUpsertArgs<ExtArgs>>): Prisma__AtributoVariacaoClient<$Result.GetResult<Prisma.$AtributoVariacaoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AtributoVariacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoCountArgs} args - Arguments to filter AtributoVariacaos to count.
     * @example
     * // Count the number of AtributoVariacaos
     * const count = await prisma.atributoVariacao.count({
     *   where: {
     *     // ... the filter for the AtributoVariacaos we want to count
     *   }
     * })
    **/
    count<T extends AtributoVariacaoCountArgs>(
      args?: Subset<T, AtributoVariacaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AtributoVariacaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AtributoVariacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AtributoVariacaoAggregateArgs>(args: Subset<T, AtributoVariacaoAggregateArgs>): Prisma.PrismaPromise<GetAtributoVariacaoAggregateType<T>>

    /**
     * Group by AtributoVariacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AtributoVariacaoGroupByArgs} args - Group by arguments.
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
      T extends AtributoVariacaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AtributoVariacaoGroupByArgs['orderBy'] }
        : { orderBy?: AtributoVariacaoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AtributoVariacaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAtributoVariacaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AtributoVariacao model
   */
  readonly fields: AtributoVariacaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AtributoVariacao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AtributoVariacaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    variacao<T extends VariacaoProdutoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VariacaoProdutoDefaultArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the AtributoVariacao model
   */ 
  interface AtributoVariacaoFieldRefs {
    readonly id: FieldRef<"AtributoVariacao", 'String'>
    readonly variacaoId: FieldRef<"AtributoVariacao", 'String'>
    readonly nome: FieldRef<"AtributoVariacao", 'String'>
    readonly valor: FieldRef<"AtributoVariacao", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AtributoVariacao findUnique
   */
  export type AtributoVariacaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which AtributoVariacao to fetch.
     */
    where: AtributoVariacaoWhereUniqueInput
  }

  /**
   * AtributoVariacao findUniqueOrThrow
   */
  export type AtributoVariacaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which AtributoVariacao to fetch.
     */
    where: AtributoVariacaoWhereUniqueInput
  }

  /**
   * AtributoVariacao findFirst
   */
  export type AtributoVariacaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which AtributoVariacao to fetch.
     */
    where?: AtributoVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtributoVariacaos to fetch.
     */
    orderBy?: AtributoVariacaoOrderByWithRelationInput | AtributoVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AtributoVariacaos.
     */
    cursor?: AtributoVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtributoVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtributoVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AtributoVariacaos.
     */
    distinct?: AtributoVariacaoScalarFieldEnum | AtributoVariacaoScalarFieldEnum[]
  }

  /**
   * AtributoVariacao findFirstOrThrow
   */
  export type AtributoVariacaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which AtributoVariacao to fetch.
     */
    where?: AtributoVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtributoVariacaos to fetch.
     */
    orderBy?: AtributoVariacaoOrderByWithRelationInput | AtributoVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AtributoVariacaos.
     */
    cursor?: AtributoVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtributoVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtributoVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AtributoVariacaos.
     */
    distinct?: AtributoVariacaoScalarFieldEnum | AtributoVariacaoScalarFieldEnum[]
  }

  /**
   * AtributoVariacao findMany
   */
  export type AtributoVariacaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which AtributoVariacaos to fetch.
     */
    where?: AtributoVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AtributoVariacaos to fetch.
     */
    orderBy?: AtributoVariacaoOrderByWithRelationInput | AtributoVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AtributoVariacaos.
     */
    cursor?: AtributoVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AtributoVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AtributoVariacaos.
     */
    skip?: number
    distinct?: AtributoVariacaoScalarFieldEnum | AtributoVariacaoScalarFieldEnum[]
  }

  /**
   * AtributoVariacao create
   */
  export type AtributoVariacaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * The data needed to create a AtributoVariacao.
     */
    data: XOR<AtributoVariacaoCreateInput, AtributoVariacaoUncheckedCreateInput>
  }

  /**
   * AtributoVariacao createMany
   */
  export type AtributoVariacaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AtributoVariacaos.
     */
    data: AtributoVariacaoCreateManyInput | AtributoVariacaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AtributoVariacao createManyAndReturn
   */
  export type AtributoVariacaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AtributoVariacaos.
     */
    data: AtributoVariacaoCreateManyInput | AtributoVariacaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AtributoVariacao update
   */
  export type AtributoVariacaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * The data needed to update a AtributoVariacao.
     */
    data: XOR<AtributoVariacaoUpdateInput, AtributoVariacaoUncheckedUpdateInput>
    /**
     * Choose, which AtributoVariacao to update.
     */
    where: AtributoVariacaoWhereUniqueInput
  }

  /**
   * AtributoVariacao updateMany
   */
  export type AtributoVariacaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AtributoVariacaos.
     */
    data: XOR<AtributoVariacaoUpdateManyMutationInput, AtributoVariacaoUncheckedUpdateManyInput>
    /**
     * Filter which AtributoVariacaos to update
     */
    where?: AtributoVariacaoWhereInput
  }

  /**
   * AtributoVariacao upsert
   */
  export type AtributoVariacaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * The filter to search for the AtributoVariacao to update in case it exists.
     */
    where: AtributoVariacaoWhereUniqueInput
    /**
     * In case the AtributoVariacao found by the `where` argument doesn't exist, create a new AtributoVariacao with this data.
     */
    create: XOR<AtributoVariacaoCreateInput, AtributoVariacaoUncheckedCreateInput>
    /**
     * In case the AtributoVariacao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AtributoVariacaoUpdateInput, AtributoVariacaoUncheckedUpdateInput>
  }

  /**
   * AtributoVariacao delete
   */
  export type AtributoVariacaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
    /**
     * Filter which AtributoVariacao to delete.
     */
    where: AtributoVariacaoWhereUniqueInput
  }

  /**
   * AtributoVariacao deleteMany
   */
  export type AtributoVariacaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AtributoVariacaos to delete
     */
    where?: AtributoVariacaoWhereInput
  }

  /**
   * AtributoVariacao without action
   */
  export type AtributoVariacaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AtributoVariacao
     */
    select?: AtributoVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AtributoVariacaoInclude<ExtArgs> | null
  }


  /**
   * Model ImagemVariacao
   */

  export type AggregateImagemVariacao = {
    _count: ImagemVariacaoCountAggregateOutputType | null
    _avg: ImagemVariacaoAvgAggregateOutputType | null
    _sum: ImagemVariacaoSumAggregateOutputType | null
    _min: ImagemVariacaoMinAggregateOutputType | null
    _max: ImagemVariacaoMaxAggregateOutputType | null
  }

  export type ImagemVariacaoAvgAggregateOutputType = {
    ordem: number | null
  }

  export type ImagemVariacaoSumAggregateOutputType = {
    ordem: number | null
  }

  export type ImagemVariacaoMinAggregateOutputType = {
    id: string | null
    variacaoId: string | null
    url: string | null
    ordem: number | null
  }

  export type ImagemVariacaoMaxAggregateOutputType = {
    id: string | null
    variacaoId: string | null
    url: string | null
    ordem: number | null
  }

  export type ImagemVariacaoCountAggregateOutputType = {
    id: number
    variacaoId: number
    url: number
    ordem: number
    _all: number
  }


  export type ImagemVariacaoAvgAggregateInputType = {
    ordem?: true
  }

  export type ImagemVariacaoSumAggregateInputType = {
    ordem?: true
  }

  export type ImagemVariacaoMinAggregateInputType = {
    id?: true
    variacaoId?: true
    url?: true
    ordem?: true
  }

  export type ImagemVariacaoMaxAggregateInputType = {
    id?: true
    variacaoId?: true
    url?: true
    ordem?: true
  }

  export type ImagemVariacaoCountAggregateInputType = {
    id?: true
    variacaoId?: true
    url?: true
    ordem?: true
    _all?: true
  }

  export type ImagemVariacaoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagemVariacao to aggregate.
     */
    where?: ImagemVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemVariacaos to fetch.
     */
    orderBy?: ImagemVariacaoOrderByWithRelationInput | ImagemVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImagemVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImagemVariacaos
    **/
    _count?: true | ImagemVariacaoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImagemVariacaoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImagemVariacaoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImagemVariacaoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImagemVariacaoMaxAggregateInputType
  }

  export type GetImagemVariacaoAggregateType<T extends ImagemVariacaoAggregateArgs> = {
        [P in keyof T & keyof AggregateImagemVariacao]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImagemVariacao[P]>
      : GetScalarType<T[P], AggregateImagemVariacao[P]>
  }




  export type ImagemVariacaoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImagemVariacaoWhereInput
    orderBy?: ImagemVariacaoOrderByWithAggregationInput | ImagemVariacaoOrderByWithAggregationInput[]
    by: ImagemVariacaoScalarFieldEnum[] | ImagemVariacaoScalarFieldEnum
    having?: ImagemVariacaoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImagemVariacaoCountAggregateInputType | true
    _avg?: ImagemVariacaoAvgAggregateInputType
    _sum?: ImagemVariacaoSumAggregateInputType
    _min?: ImagemVariacaoMinAggregateInputType
    _max?: ImagemVariacaoMaxAggregateInputType
  }

  export type ImagemVariacaoGroupByOutputType = {
    id: string
    variacaoId: string
    url: string
    ordem: number
    _count: ImagemVariacaoCountAggregateOutputType | null
    _avg: ImagemVariacaoAvgAggregateOutputType | null
    _sum: ImagemVariacaoSumAggregateOutputType | null
    _min: ImagemVariacaoMinAggregateOutputType | null
    _max: ImagemVariacaoMaxAggregateOutputType | null
  }

  type GetImagemVariacaoGroupByPayload<T extends ImagemVariacaoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImagemVariacaoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImagemVariacaoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImagemVariacaoGroupByOutputType[P]>
            : GetScalarType<T[P], ImagemVariacaoGroupByOutputType[P]>
        }
      >
    >


  export type ImagemVariacaoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    variacaoId?: boolean
    url?: boolean
    ordem?: boolean
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imagemVariacao"]>

  export type ImagemVariacaoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    variacaoId?: boolean
    url?: boolean
    ordem?: boolean
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["imagemVariacao"]>

  export type ImagemVariacaoSelectScalar = {
    id?: boolean
    variacaoId?: boolean
    url?: boolean
    ordem?: boolean
  }

  export type ImagemVariacaoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }
  export type ImagemVariacaoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variacao?: boolean | VariacaoProdutoDefaultArgs<ExtArgs>
  }

  export type $ImagemVariacaoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImagemVariacao"
    objects: {
      variacao: Prisma.$VariacaoProdutoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      variacaoId: string
      url: string
      ordem: number
    }, ExtArgs["result"]["imagemVariacao"]>
    composites: {}
  }

  type ImagemVariacaoGetPayload<S extends boolean | null | undefined | ImagemVariacaoDefaultArgs> = $Result.GetResult<Prisma.$ImagemVariacaoPayload, S>

  type ImagemVariacaoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ImagemVariacaoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ImagemVariacaoCountAggregateInputType | true
    }

  export interface ImagemVariacaoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImagemVariacao'], meta: { name: 'ImagemVariacao' } }
    /**
     * Find zero or one ImagemVariacao that matches the filter.
     * @param {ImagemVariacaoFindUniqueArgs} args - Arguments to find a ImagemVariacao
     * @example
     * // Get one ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImagemVariacaoFindUniqueArgs>(args: SelectSubset<T, ImagemVariacaoFindUniqueArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ImagemVariacao that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ImagemVariacaoFindUniqueOrThrowArgs} args - Arguments to find a ImagemVariacao
     * @example
     * // Get one ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImagemVariacaoFindUniqueOrThrowArgs>(args: SelectSubset<T, ImagemVariacaoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ImagemVariacao that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoFindFirstArgs} args - Arguments to find a ImagemVariacao
     * @example
     * // Get one ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImagemVariacaoFindFirstArgs>(args?: SelectSubset<T, ImagemVariacaoFindFirstArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ImagemVariacao that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoFindFirstOrThrowArgs} args - Arguments to find a ImagemVariacao
     * @example
     * // Get one ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImagemVariacaoFindFirstOrThrowArgs>(args?: SelectSubset<T, ImagemVariacaoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ImagemVariacaos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImagemVariacaos
     * const imagemVariacaos = await prisma.imagemVariacao.findMany()
     * 
     * // Get first 10 ImagemVariacaos
     * const imagemVariacaos = await prisma.imagemVariacao.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imagemVariacaoWithIdOnly = await prisma.imagemVariacao.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImagemVariacaoFindManyArgs>(args?: SelectSubset<T, ImagemVariacaoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ImagemVariacao.
     * @param {ImagemVariacaoCreateArgs} args - Arguments to create a ImagemVariacao.
     * @example
     * // Create one ImagemVariacao
     * const ImagemVariacao = await prisma.imagemVariacao.create({
     *   data: {
     *     // ... data to create a ImagemVariacao
     *   }
     * })
     * 
     */
    create<T extends ImagemVariacaoCreateArgs>(args: SelectSubset<T, ImagemVariacaoCreateArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ImagemVariacaos.
     * @param {ImagemVariacaoCreateManyArgs} args - Arguments to create many ImagemVariacaos.
     * @example
     * // Create many ImagemVariacaos
     * const imagemVariacao = await prisma.imagemVariacao.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImagemVariacaoCreateManyArgs>(args?: SelectSubset<T, ImagemVariacaoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImagemVariacaos and returns the data saved in the database.
     * @param {ImagemVariacaoCreateManyAndReturnArgs} args - Arguments to create many ImagemVariacaos.
     * @example
     * // Create many ImagemVariacaos
     * const imagemVariacao = await prisma.imagemVariacao.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImagemVariacaos and only return the `id`
     * const imagemVariacaoWithIdOnly = await prisma.imagemVariacao.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImagemVariacaoCreateManyAndReturnArgs>(args?: SelectSubset<T, ImagemVariacaoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ImagemVariacao.
     * @param {ImagemVariacaoDeleteArgs} args - Arguments to delete one ImagemVariacao.
     * @example
     * // Delete one ImagemVariacao
     * const ImagemVariacao = await prisma.imagemVariacao.delete({
     *   where: {
     *     // ... filter to delete one ImagemVariacao
     *   }
     * })
     * 
     */
    delete<T extends ImagemVariacaoDeleteArgs>(args: SelectSubset<T, ImagemVariacaoDeleteArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ImagemVariacao.
     * @param {ImagemVariacaoUpdateArgs} args - Arguments to update one ImagemVariacao.
     * @example
     * // Update one ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImagemVariacaoUpdateArgs>(args: SelectSubset<T, ImagemVariacaoUpdateArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ImagemVariacaos.
     * @param {ImagemVariacaoDeleteManyArgs} args - Arguments to filter ImagemVariacaos to delete.
     * @example
     * // Delete a few ImagemVariacaos
     * const { count } = await prisma.imagemVariacao.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImagemVariacaoDeleteManyArgs>(args?: SelectSubset<T, ImagemVariacaoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImagemVariacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImagemVariacaos
     * const imagemVariacao = await prisma.imagemVariacao.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImagemVariacaoUpdateManyArgs>(args: SelectSubset<T, ImagemVariacaoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ImagemVariacao.
     * @param {ImagemVariacaoUpsertArgs} args - Arguments to update or create a ImagemVariacao.
     * @example
     * // Update or create a ImagemVariacao
     * const imagemVariacao = await prisma.imagemVariacao.upsert({
     *   create: {
     *     // ... data to create a ImagemVariacao
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImagemVariacao we want to update
     *   }
     * })
     */
    upsert<T extends ImagemVariacaoUpsertArgs>(args: SelectSubset<T, ImagemVariacaoUpsertArgs<ExtArgs>>): Prisma__ImagemVariacaoClient<$Result.GetResult<Prisma.$ImagemVariacaoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ImagemVariacaos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoCountArgs} args - Arguments to filter ImagemVariacaos to count.
     * @example
     * // Count the number of ImagemVariacaos
     * const count = await prisma.imagemVariacao.count({
     *   where: {
     *     // ... the filter for the ImagemVariacaos we want to count
     *   }
     * })
    **/
    count<T extends ImagemVariacaoCountArgs>(
      args?: Subset<T, ImagemVariacaoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImagemVariacaoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImagemVariacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImagemVariacaoAggregateArgs>(args: Subset<T, ImagemVariacaoAggregateArgs>): Prisma.PrismaPromise<GetImagemVariacaoAggregateType<T>>

    /**
     * Group by ImagemVariacao.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImagemVariacaoGroupByArgs} args - Group by arguments.
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
      T extends ImagemVariacaoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImagemVariacaoGroupByArgs['orderBy'] }
        : { orderBy?: ImagemVariacaoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImagemVariacaoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImagemVariacaoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImagemVariacao model
   */
  readonly fields: ImagemVariacaoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImagemVariacao.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImagemVariacaoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    variacao<T extends VariacaoProdutoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VariacaoProdutoDefaultArgs<ExtArgs>>): Prisma__VariacaoProdutoClient<$Result.GetResult<Prisma.$VariacaoProdutoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ImagemVariacao model
   */ 
  interface ImagemVariacaoFieldRefs {
    readonly id: FieldRef<"ImagemVariacao", 'String'>
    readonly variacaoId: FieldRef<"ImagemVariacao", 'String'>
    readonly url: FieldRef<"ImagemVariacao", 'String'>
    readonly ordem: FieldRef<"ImagemVariacao", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ImagemVariacao findUnique
   */
  export type ImagemVariacaoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemVariacao to fetch.
     */
    where: ImagemVariacaoWhereUniqueInput
  }

  /**
   * ImagemVariacao findUniqueOrThrow
   */
  export type ImagemVariacaoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemVariacao to fetch.
     */
    where: ImagemVariacaoWhereUniqueInput
  }

  /**
   * ImagemVariacao findFirst
   */
  export type ImagemVariacaoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemVariacao to fetch.
     */
    where?: ImagemVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemVariacaos to fetch.
     */
    orderBy?: ImagemVariacaoOrderByWithRelationInput | ImagemVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagemVariacaos.
     */
    cursor?: ImagemVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagemVariacaos.
     */
    distinct?: ImagemVariacaoScalarFieldEnum | ImagemVariacaoScalarFieldEnum[]
  }

  /**
   * ImagemVariacao findFirstOrThrow
   */
  export type ImagemVariacaoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemVariacao to fetch.
     */
    where?: ImagemVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemVariacaos to fetch.
     */
    orderBy?: ImagemVariacaoOrderByWithRelationInput | ImagemVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImagemVariacaos.
     */
    cursor?: ImagemVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemVariacaos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImagemVariacaos.
     */
    distinct?: ImagemVariacaoScalarFieldEnum | ImagemVariacaoScalarFieldEnum[]
  }

  /**
   * ImagemVariacao findMany
   */
  export type ImagemVariacaoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter, which ImagemVariacaos to fetch.
     */
    where?: ImagemVariacaoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImagemVariacaos to fetch.
     */
    orderBy?: ImagemVariacaoOrderByWithRelationInput | ImagemVariacaoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImagemVariacaos.
     */
    cursor?: ImagemVariacaoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImagemVariacaos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImagemVariacaos.
     */
    skip?: number
    distinct?: ImagemVariacaoScalarFieldEnum | ImagemVariacaoScalarFieldEnum[]
  }

  /**
   * ImagemVariacao create
   */
  export type ImagemVariacaoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * The data needed to create a ImagemVariacao.
     */
    data: XOR<ImagemVariacaoCreateInput, ImagemVariacaoUncheckedCreateInput>
  }

  /**
   * ImagemVariacao createMany
   */
  export type ImagemVariacaoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImagemVariacaos.
     */
    data: ImagemVariacaoCreateManyInput | ImagemVariacaoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImagemVariacao createManyAndReturn
   */
  export type ImagemVariacaoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ImagemVariacaos.
     */
    data: ImagemVariacaoCreateManyInput | ImagemVariacaoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImagemVariacao update
   */
  export type ImagemVariacaoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * The data needed to update a ImagemVariacao.
     */
    data: XOR<ImagemVariacaoUpdateInput, ImagemVariacaoUncheckedUpdateInput>
    /**
     * Choose, which ImagemVariacao to update.
     */
    where: ImagemVariacaoWhereUniqueInput
  }

  /**
   * ImagemVariacao updateMany
   */
  export type ImagemVariacaoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImagemVariacaos.
     */
    data: XOR<ImagemVariacaoUpdateManyMutationInput, ImagemVariacaoUncheckedUpdateManyInput>
    /**
     * Filter which ImagemVariacaos to update
     */
    where?: ImagemVariacaoWhereInput
  }

  /**
   * ImagemVariacao upsert
   */
  export type ImagemVariacaoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * The filter to search for the ImagemVariacao to update in case it exists.
     */
    where: ImagemVariacaoWhereUniqueInput
    /**
     * In case the ImagemVariacao found by the `where` argument doesn't exist, create a new ImagemVariacao with this data.
     */
    create: XOR<ImagemVariacaoCreateInput, ImagemVariacaoUncheckedCreateInput>
    /**
     * In case the ImagemVariacao was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImagemVariacaoUpdateInput, ImagemVariacaoUncheckedUpdateInput>
  }

  /**
   * ImagemVariacao delete
   */
  export type ImagemVariacaoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
    /**
     * Filter which ImagemVariacao to delete.
     */
    where: ImagemVariacaoWhereUniqueInput
  }

  /**
   * ImagemVariacao deleteMany
   */
  export type ImagemVariacaoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImagemVariacaos to delete
     */
    where?: ImagemVariacaoWhereInput
  }

  /**
   * ImagemVariacao without action
   */
  export type ImagemVariacaoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImagemVariacao
     */
    select?: ImagemVariacaoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImagemVariacaoInclude<ExtArgs> | null
  }


  /**
   * Model Categoria
   */

  export type AggregateCategoria = {
    _count: CategoriaCountAggregateOutputType | null
    _avg: CategoriaAvgAggregateOutputType | null
    _sum: CategoriaSumAggregateOutputType | null
    _min: CategoriaMinAggregateOutputType | null
    _max: CategoriaMaxAggregateOutputType | null
  }

  export type CategoriaAvgAggregateOutputType = {
    nivel: number | null
  }

  export type CategoriaSumAggregateOutputType = {
    nivel: number | null
  }

  export type CategoriaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    slug: string | null
    nivel: number | null
    ativa: boolean | null
    categoriaPaiId: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type CategoriaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    slug: string | null
    nivel: number | null
    ativa: boolean | null
    categoriaPaiId: string | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type CategoriaCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    slug: number
    nivel: number
    ativa: number
    categoriaPaiId: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type CategoriaAvgAggregateInputType = {
    nivel?: true
  }

  export type CategoriaSumAggregateInputType = {
    nivel?: true
  }

  export type CategoriaMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    nivel?: true
    ativa?: true
    categoriaPaiId?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type CategoriaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    nivel?: true
    ativa?: true
    categoriaPaiId?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type CategoriaCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    nivel?: true
    ativa?: true
    categoriaPaiId?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type CategoriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categoria to aggregate.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categorias
    **/
    _count?: true | CategoriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoriaMaxAggregateInputType
  }

  export type GetCategoriaAggregateType<T extends CategoriaAggregateArgs> = {
        [P in keyof T & keyof AggregateCategoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategoria[P]>
      : GetScalarType<T[P], AggregateCategoria[P]>
  }




  export type CategoriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriaWhereInput
    orderBy?: CategoriaOrderByWithAggregationInput | CategoriaOrderByWithAggregationInput[]
    by: CategoriaScalarFieldEnum[] | CategoriaScalarFieldEnum
    having?: CategoriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoriaCountAggregateInputType | true
    _avg?: CategoriaAvgAggregateInputType
    _sum?: CategoriaSumAggregateInputType
    _min?: CategoriaMinAggregateInputType
    _max?: CategoriaMaxAggregateInputType
  }

  export type CategoriaGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    slug: string
    nivel: number
    ativa: boolean
    categoriaPaiId: string | null
    criadoEm: Date
    atualizadoEm: Date
    _count: CategoriaCountAggregateOutputType | null
    _avg: CategoriaAvgAggregateOutputType | null
    _sum: CategoriaSumAggregateOutputType | null
    _min: CategoriaMinAggregateOutputType | null
    _max: CategoriaMaxAggregateOutputType | null
  }

  type GetCategoriaGroupByPayload<T extends CategoriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriaGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriaGroupByOutputType[P]>
        }
      >
    >


  export type CategoriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    nivel?: boolean
    ativa?: boolean
    categoriaPaiId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    categoriaPai?: boolean | Categoria$categoriaPaiArgs<ExtArgs>
    subcategorias?: boolean | Categoria$subcategoriasArgs<ExtArgs>
    produtos?: boolean | Categoria$produtosArgs<ExtArgs>
    _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categoria"]>

  export type CategoriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    nivel?: boolean
    ativa?: boolean
    categoriaPaiId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    categoriaPai?: boolean | Categoria$categoriaPaiArgs<ExtArgs>
  }, ExtArgs["result"]["categoria"]>

  export type CategoriaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    nivel?: boolean
    ativa?: boolean
    categoriaPaiId?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type CategoriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categoriaPai?: boolean | Categoria$categoriaPaiArgs<ExtArgs>
    subcategorias?: boolean | Categoria$subcategoriasArgs<ExtArgs>
    produtos?: boolean | Categoria$produtosArgs<ExtArgs>
    _count?: boolean | CategoriaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoriaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categoriaPai?: boolean | Categoria$categoriaPaiArgs<ExtArgs>
  }

  export type $CategoriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Categoria"
    objects: {
      categoriaPai: Prisma.$CategoriaPayload<ExtArgs> | null
      subcategorias: Prisma.$CategoriaPayload<ExtArgs>[]
      produtos: Prisma.$ProdutoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      slug: string
      nivel: number
      ativa: boolean
      categoriaPaiId: string | null
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["categoria"]>
    composites: {}
  }

  type CategoriaGetPayload<S extends boolean | null | undefined | CategoriaDefaultArgs> = $Result.GetResult<Prisma.$CategoriaPayload, S>

  type CategoriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoriaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoriaCountAggregateInputType | true
    }

  export interface CategoriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Categoria'], meta: { name: 'Categoria' } }
    /**
     * Find zero or one Categoria that matches the filter.
     * @param {CategoriaFindUniqueArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoriaFindUniqueArgs>(args: SelectSubset<T, CategoriaFindUniqueArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Categoria that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoriaFindUniqueOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoriaFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Categoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoriaFindFirstArgs>(args?: SelectSubset<T, CategoriaFindFirstArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Categoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindFirstOrThrowArgs} args - Arguments to find a Categoria
     * @example
     * // Get one Categoria
     * const categoria = await prisma.categoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoriaFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Categorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categorias
     * const categorias = await prisma.categoria.findMany()
     * 
     * // Get first 10 Categorias
     * const categorias = await prisma.categoria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoriaWithIdOnly = await prisma.categoria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoriaFindManyArgs>(args?: SelectSubset<T, CategoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Categoria.
     * @param {CategoriaCreateArgs} args - Arguments to create a Categoria.
     * @example
     * // Create one Categoria
     * const Categoria = await prisma.categoria.create({
     *   data: {
     *     // ... data to create a Categoria
     *   }
     * })
     * 
     */
    create<T extends CategoriaCreateArgs>(args: SelectSubset<T, CategoriaCreateArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Categorias.
     * @param {CategoriaCreateManyArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoriaCreateManyArgs>(args?: SelectSubset<T, CategoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categorias and returns the data saved in the database.
     * @param {CategoriaCreateManyAndReturnArgs} args - Arguments to create many Categorias.
     * @example
     * // Create many Categorias
     * const categoria = await prisma.categoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categorias and only return the `id`
     * const categoriaWithIdOnly = await prisma.categoria.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoriaCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Categoria.
     * @param {CategoriaDeleteArgs} args - Arguments to delete one Categoria.
     * @example
     * // Delete one Categoria
     * const Categoria = await prisma.categoria.delete({
     *   where: {
     *     // ... filter to delete one Categoria
     *   }
     * })
     * 
     */
    delete<T extends CategoriaDeleteArgs>(args: SelectSubset<T, CategoriaDeleteArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Categoria.
     * @param {CategoriaUpdateArgs} args - Arguments to update one Categoria.
     * @example
     * // Update one Categoria
     * const categoria = await prisma.categoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoriaUpdateArgs>(args: SelectSubset<T, CategoriaUpdateArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Categorias.
     * @param {CategoriaDeleteManyArgs} args - Arguments to filter Categorias to delete.
     * @example
     * // Delete a few Categorias
     * const { count } = await prisma.categoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoriaDeleteManyArgs>(args?: SelectSubset<T, CategoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categorias
     * const categoria = await prisma.categoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoriaUpdateManyArgs>(args: SelectSubset<T, CategoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Categoria.
     * @param {CategoriaUpsertArgs} args - Arguments to update or create a Categoria.
     * @example
     * // Update or create a Categoria
     * const categoria = await prisma.categoria.upsert({
     *   create: {
     *     // ... data to create a Categoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categoria we want to update
     *   }
     * })
     */
    upsert<T extends CategoriaUpsertArgs>(args: SelectSubset<T, CategoriaUpsertArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Categorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaCountArgs} args - Arguments to filter Categorias to count.
     * @example
     * // Count the number of Categorias
     * const count = await prisma.categoria.count({
     *   where: {
     *     // ... the filter for the Categorias we want to count
     *   }
     * })
    **/
    count<T extends CategoriaCountArgs>(
      args?: Subset<T, CategoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoriaAggregateArgs>(args: Subset<T, CategoriaAggregateArgs>): Prisma.PrismaPromise<GetCategoriaAggregateType<T>>

    /**
     * Group by Categoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriaGroupByArgs} args - Group by arguments.
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
      T extends CategoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoriaGroupByArgs['orderBy'] }
        : { orderBy?: CategoriaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CategoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Categoria model
   */
  readonly fields: CategoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Categoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categoriaPai<T extends Categoria$categoriaPaiArgs<ExtArgs> = {}>(args?: Subset<T, Categoria$categoriaPaiArgs<ExtArgs>>): Prisma__CategoriaClient<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    subcategorias<T extends Categoria$subcategoriasArgs<ExtArgs> = {}>(args?: Subset<T, Categoria$subcategoriasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriaPayload<ExtArgs>, T, "findMany"> | Null>
    produtos<T extends Categoria$produtosArgs<ExtArgs> = {}>(args?: Subset<T, Categoria$produtosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Categoria model
   */ 
  interface CategoriaFieldRefs {
    readonly id: FieldRef<"Categoria", 'String'>
    readonly tenantId: FieldRef<"Categoria", 'String'>
    readonly nome: FieldRef<"Categoria", 'String'>
    readonly slug: FieldRef<"Categoria", 'String'>
    readonly nivel: FieldRef<"Categoria", 'Int'>
    readonly ativa: FieldRef<"Categoria", 'Boolean'>
    readonly categoriaPaiId: FieldRef<"Categoria", 'String'>
    readonly criadoEm: FieldRef<"Categoria", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Categoria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Categoria findUnique
   */
  export type CategoriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria findUniqueOrThrow
   */
  export type CategoriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria findFirst
   */
  export type CategoriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria findFirstOrThrow
   */
  export type CategoriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categoria to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categorias.
     */
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria findMany
   */
  export type CategoriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter, which Categorias to fetch.
     */
    where?: CategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categorias to fetch.
     */
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categorias.
     */
    cursor?: CategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categorias.
     */
    skip?: number
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria create
   */
  export type CategoriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The data needed to create a Categoria.
     */
    data: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>
  }

  /**
   * Categoria createMany
   */
  export type CategoriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Categoria createManyAndReturn
   */
  export type CategoriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Categorias.
     */
    data: CategoriaCreateManyInput | CategoriaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Categoria update
   */
  export type CategoriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The data needed to update a Categoria.
     */
    data: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>
    /**
     * Choose, which Categoria to update.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria updateMany
   */
  export type CategoriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categorias.
     */
    data: XOR<CategoriaUpdateManyMutationInput, CategoriaUncheckedUpdateManyInput>
    /**
     * Filter which Categorias to update
     */
    where?: CategoriaWhereInput
  }

  /**
   * Categoria upsert
   */
  export type CategoriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * The filter to search for the Categoria to update in case it exists.
     */
    where: CategoriaWhereUniqueInput
    /**
     * In case the Categoria found by the `where` argument doesn't exist, create a new Categoria with this data.
     */
    create: XOR<CategoriaCreateInput, CategoriaUncheckedCreateInput>
    /**
     * In case the Categoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoriaUpdateInput, CategoriaUncheckedUpdateInput>
  }

  /**
   * Categoria delete
   */
  export type CategoriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    /**
     * Filter which Categoria to delete.
     */
    where: CategoriaWhereUniqueInput
  }

  /**
   * Categoria deleteMany
   */
  export type CategoriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categorias to delete
     */
    where?: CategoriaWhereInput
  }

  /**
   * Categoria.categoriaPai
   */
  export type Categoria$categoriaPaiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    where?: CategoriaWhereInput
  }

  /**
   * Categoria.subcategorias
   */
  export type Categoria$subcategoriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
    where?: CategoriaWhereInput
    orderBy?: CategoriaOrderByWithRelationInput | CategoriaOrderByWithRelationInput[]
    cursor?: CategoriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoriaScalarFieldEnum | CategoriaScalarFieldEnum[]
  }

  /**
   * Categoria.produtos
   */
  export type Categoria$produtosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    where?: ProdutoWhereInput
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    cursor?: ProdutoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProdutoScalarFieldEnum | ProdutoScalarFieldEnum[]
  }

  /**
   * Categoria without action
   */
  export type CategoriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categoria
     */
    select?: CategoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriaInclude<ExtArgs> | null
  }


  /**
   * Model Marca
   */

  export type AggregateMarca = {
    _count: MarcaCountAggregateOutputType | null
    _min: MarcaMinAggregateOutputType | null
    _max: MarcaMaxAggregateOutputType | null
  }

  export type MarcaMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    slug: string | null
    logoUrl: string | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type MarcaMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    nome: string | null
    slug: string | null
    logoUrl: string | null
    ativa: boolean | null
    criadoEm: Date | null
    atualizadoEm: Date | null
  }

  export type MarcaCountAggregateOutputType = {
    id: number
    tenantId: number
    nome: number
    slug: number
    logoUrl: number
    ativa: number
    criadoEm: number
    atualizadoEm: number
    _all: number
  }


  export type MarcaMinAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    logoUrl?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type MarcaMaxAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    logoUrl?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
  }

  export type MarcaCountAggregateInputType = {
    id?: true
    tenantId?: true
    nome?: true
    slug?: true
    logoUrl?: true
    ativa?: true
    criadoEm?: true
    atualizadoEm?: true
    _all?: true
  }

  export type MarcaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Marca to aggregate.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Marcas
    **/
    _count?: true | MarcaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarcaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarcaMaxAggregateInputType
  }

  export type GetMarcaAggregateType<T extends MarcaAggregateArgs> = {
        [P in keyof T & keyof AggregateMarca]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarca[P]>
      : GetScalarType<T[P], AggregateMarca[P]>
  }




  export type MarcaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarcaWhereInput
    orderBy?: MarcaOrderByWithAggregationInput | MarcaOrderByWithAggregationInput[]
    by: MarcaScalarFieldEnum[] | MarcaScalarFieldEnum
    having?: MarcaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarcaCountAggregateInputType | true
    _min?: MarcaMinAggregateInputType
    _max?: MarcaMaxAggregateInputType
  }

  export type MarcaGroupByOutputType = {
    id: string
    tenantId: string
    nome: string
    slug: string
    logoUrl: string | null
    ativa: boolean
    criadoEm: Date
    atualizadoEm: Date
    _count: MarcaCountAggregateOutputType | null
    _min: MarcaMinAggregateOutputType | null
    _max: MarcaMaxAggregateOutputType | null
  }

  type GetMarcaGroupByPayload<T extends MarcaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarcaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarcaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarcaGroupByOutputType[P]>
            : GetScalarType<T[P], MarcaGroupByOutputType[P]>
        }
      >
    >


  export type MarcaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    logoUrl?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
    produtos?: boolean | Marca$produtosArgs<ExtArgs>
    _count?: boolean | MarcaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["marca"]>

  export type MarcaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    logoUrl?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }, ExtArgs["result"]["marca"]>

  export type MarcaSelectScalar = {
    id?: boolean
    tenantId?: boolean
    nome?: boolean
    slug?: boolean
    logoUrl?: boolean
    ativa?: boolean
    criadoEm?: boolean
    atualizadoEm?: boolean
  }

  export type MarcaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produtos?: boolean | Marca$produtosArgs<ExtArgs>
    _count?: boolean | MarcaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MarcaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MarcaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Marca"
    objects: {
      produtos: Prisma.$ProdutoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      nome: string
      slug: string
      logoUrl: string | null
      ativa: boolean
      criadoEm: Date
      atualizadoEm: Date
    }, ExtArgs["result"]["marca"]>
    composites: {}
  }

  type MarcaGetPayload<S extends boolean | null | undefined | MarcaDefaultArgs> = $Result.GetResult<Prisma.$MarcaPayload, S>

  type MarcaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MarcaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MarcaCountAggregateInputType | true
    }

  export interface MarcaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Marca'], meta: { name: 'Marca' } }
    /**
     * Find zero or one Marca that matches the filter.
     * @param {MarcaFindUniqueArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarcaFindUniqueArgs>(args: SelectSubset<T, MarcaFindUniqueArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Marca that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MarcaFindUniqueOrThrowArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarcaFindUniqueOrThrowArgs>(args: SelectSubset<T, MarcaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Marca that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindFirstArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarcaFindFirstArgs>(args?: SelectSubset<T, MarcaFindFirstArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Marca that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindFirstOrThrowArgs} args - Arguments to find a Marca
     * @example
     * // Get one Marca
     * const marca = await prisma.marca.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarcaFindFirstOrThrowArgs>(args?: SelectSubset<T, MarcaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Marcas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Marcas
     * const marcas = await prisma.marca.findMany()
     * 
     * // Get first 10 Marcas
     * const marcas = await prisma.marca.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marcaWithIdOnly = await prisma.marca.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarcaFindManyArgs>(args?: SelectSubset<T, MarcaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Marca.
     * @param {MarcaCreateArgs} args - Arguments to create a Marca.
     * @example
     * // Create one Marca
     * const Marca = await prisma.marca.create({
     *   data: {
     *     // ... data to create a Marca
     *   }
     * })
     * 
     */
    create<T extends MarcaCreateArgs>(args: SelectSubset<T, MarcaCreateArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Marcas.
     * @param {MarcaCreateManyArgs} args - Arguments to create many Marcas.
     * @example
     * // Create many Marcas
     * const marca = await prisma.marca.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarcaCreateManyArgs>(args?: SelectSubset<T, MarcaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Marcas and returns the data saved in the database.
     * @param {MarcaCreateManyAndReturnArgs} args - Arguments to create many Marcas.
     * @example
     * // Create many Marcas
     * const marca = await prisma.marca.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Marcas and only return the `id`
     * const marcaWithIdOnly = await prisma.marca.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MarcaCreateManyAndReturnArgs>(args?: SelectSubset<T, MarcaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Marca.
     * @param {MarcaDeleteArgs} args - Arguments to delete one Marca.
     * @example
     * // Delete one Marca
     * const Marca = await prisma.marca.delete({
     *   where: {
     *     // ... filter to delete one Marca
     *   }
     * })
     * 
     */
    delete<T extends MarcaDeleteArgs>(args: SelectSubset<T, MarcaDeleteArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Marca.
     * @param {MarcaUpdateArgs} args - Arguments to update one Marca.
     * @example
     * // Update one Marca
     * const marca = await prisma.marca.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarcaUpdateArgs>(args: SelectSubset<T, MarcaUpdateArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Marcas.
     * @param {MarcaDeleteManyArgs} args - Arguments to filter Marcas to delete.
     * @example
     * // Delete a few Marcas
     * const { count } = await prisma.marca.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarcaDeleteManyArgs>(args?: SelectSubset<T, MarcaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Marcas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Marcas
     * const marca = await prisma.marca.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarcaUpdateManyArgs>(args: SelectSubset<T, MarcaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Marca.
     * @param {MarcaUpsertArgs} args - Arguments to update or create a Marca.
     * @example
     * // Update or create a Marca
     * const marca = await prisma.marca.upsert({
     *   create: {
     *     // ... data to create a Marca
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Marca we want to update
     *   }
     * })
     */
    upsert<T extends MarcaUpsertArgs>(args: SelectSubset<T, MarcaUpsertArgs<ExtArgs>>): Prisma__MarcaClient<$Result.GetResult<Prisma.$MarcaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Marcas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaCountArgs} args - Arguments to filter Marcas to count.
     * @example
     * // Count the number of Marcas
     * const count = await prisma.marca.count({
     *   where: {
     *     // ... the filter for the Marcas we want to count
     *   }
     * })
    **/
    count<T extends MarcaCountArgs>(
      args?: Subset<T, MarcaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarcaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Marca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MarcaAggregateArgs>(args: Subset<T, MarcaAggregateArgs>): Prisma.PrismaPromise<GetMarcaAggregateType<T>>

    /**
     * Group by Marca.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarcaGroupByArgs} args - Group by arguments.
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
      T extends MarcaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarcaGroupByArgs['orderBy'] }
        : { orderBy?: MarcaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MarcaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarcaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Marca model
   */
  readonly fields: MarcaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Marca.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarcaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produtos<T extends Marca$produtosArgs<ExtArgs> = {}>(args?: Subset<T, Marca$produtosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProdutoPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Marca model
   */ 
  interface MarcaFieldRefs {
    readonly id: FieldRef<"Marca", 'String'>
    readonly tenantId: FieldRef<"Marca", 'String'>
    readonly nome: FieldRef<"Marca", 'String'>
    readonly slug: FieldRef<"Marca", 'String'>
    readonly logoUrl: FieldRef<"Marca", 'String'>
    readonly ativa: FieldRef<"Marca", 'Boolean'>
    readonly criadoEm: FieldRef<"Marca", 'DateTime'>
    readonly atualizadoEm: FieldRef<"Marca", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Marca findUnique
   */
  export type MarcaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca findUniqueOrThrow
   */
  export type MarcaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca findFirst
   */
  export type MarcaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Marcas.
     */
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca findFirstOrThrow
   */
  export type MarcaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marca to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Marcas.
     */
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca findMany
   */
  export type MarcaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter, which Marcas to fetch.
     */
    where?: MarcaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Marcas to fetch.
     */
    orderBy?: MarcaOrderByWithRelationInput | MarcaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Marcas.
     */
    cursor?: MarcaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Marcas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Marcas.
     */
    skip?: number
    distinct?: MarcaScalarFieldEnum | MarcaScalarFieldEnum[]
  }

  /**
   * Marca create
   */
  export type MarcaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The data needed to create a Marca.
     */
    data: XOR<MarcaCreateInput, MarcaUncheckedCreateInput>
  }

  /**
   * Marca createMany
   */
  export type MarcaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Marcas.
     */
    data: MarcaCreateManyInput | MarcaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Marca createManyAndReturn
   */
  export type MarcaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Marcas.
     */
    data: MarcaCreateManyInput | MarcaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Marca update
   */
  export type MarcaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The data needed to update a Marca.
     */
    data: XOR<MarcaUpdateInput, MarcaUncheckedUpdateInput>
    /**
     * Choose, which Marca to update.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca updateMany
   */
  export type MarcaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Marcas.
     */
    data: XOR<MarcaUpdateManyMutationInput, MarcaUncheckedUpdateManyInput>
    /**
     * Filter which Marcas to update
     */
    where?: MarcaWhereInput
  }

  /**
   * Marca upsert
   */
  export type MarcaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * The filter to search for the Marca to update in case it exists.
     */
    where: MarcaWhereUniqueInput
    /**
     * In case the Marca found by the `where` argument doesn't exist, create a new Marca with this data.
     */
    create: XOR<MarcaCreateInput, MarcaUncheckedCreateInput>
    /**
     * In case the Marca was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarcaUpdateInput, MarcaUncheckedUpdateInput>
  }

  /**
   * Marca delete
   */
  export type MarcaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
    /**
     * Filter which Marca to delete.
     */
    where: MarcaWhereUniqueInput
  }

  /**
   * Marca deleteMany
   */
  export type MarcaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Marcas to delete
     */
    where?: MarcaWhereInput
  }

  /**
   * Marca.produtos
   */
  export type Marca$produtosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Produto
     */
    select?: ProdutoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProdutoInclude<ExtArgs> | null
    where?: ProdutoWhereInput
    orderBy?: ProdutoOrderByWithRelationInput | ProdutoOrderByWithRelationInput[]
    cursor?: ProdutoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProdutoScalarFieldEnum | ProdutoScalarFieldEnum[]
  }

  /**
   * Marca without action
   */
  export type MarcaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Marca
     */
    select?: MarcaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MarcaInclude<ExtArgs> | null
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


  export const ProdutoScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    sku: 'sku',
    gtin: 'gtin',
    nome: 'nome',
    descricao: 'descricao',
    descricaoCurta: 'descricaoCurta',
    status: 'status',
    ncm: 'ncm',
    cest: 'cest',
    origem: 'origem',
    precoCusto: 'precoCusto',
    precoVenda: 'precoVenda',
    precoPromocional: 'precoPromocional',
    peso: 'peso',
    altura: 'altura',
    largura: 'largura',
    comprimento: 'comprimento',
    tags: 'tags',
    metaTitulo: 'metaTitulo',
    metaDescricao: 'metaDescricao',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm',
    categoriaId: 'categoriaId',
    marcaId: 'marcaId'
  };

  export type ProdutoScalarFieldEnum = (typeof ProdutoScalarFieldEnum)[keyof typeof ProdutoScalarFieldEnum]


  export const ImagemProdutoScalarFieldEnum: {
    id: 'id',
    produtoId: 'produtoId',
    url: 'url',
    urlMiniatura: 'urlMiniatura',
    altText: 'altText',
    ordem: 'ordem',
    principal: 'principal',
    criadoEm: 'criadoEm'
  };

  export type ImagemProdutoScalarFieldEnum = (typeof ImagemProdutoScalarFieldEnum)[keyof typeof ImagemProdutoScalarFieldEnum]


  export const VariacaoProdutoScalarFieldEnum: {
    id: 'id',
    produtoId: 'produtoId',
    sku: 'sku',
    gtin: 'gtin',
    nome: 'nome',
    precoVenda: 'precoVenda',
    peso: 'peso',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm'
  };

  export type VariacaoProdutoScalarFieldEnum = (typeof VariacaoProdutoScalarFieldEnum)[keyof typeof VariacaoProdutoScalarFieldEnum]


  export const AtributoVariacaoScalarFieldEnum: {
    id: 'id',
    variacaoId: 'variacaoId',
    nome: 'nome',
    valor: 'valor'
  };

  export type AtributoVariacaoScalarFieldEnum = (typeof AtributoVariacaoScalarFieldEnum)[keyof typeof AtributoVariacaoScalarFieldEnum]


  export const ImagemVariacaoScalarFieldEnum: {
    id: 'id',
    variacaoId: 'variacaoId',
    url: 'url',
    ordem: 'ordem'
  };

  export type ImagemVariacaoScalarFieldEnum = (typeof ImagemVariacaoScalarFieldEnum)[keyof typeof ImagemVariacaoScalarFieldEnum]


  export const CategoriaScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    nome: 'nome',
    slug: 'slug',
    nivel: 'nivel',
    ativa: 'ativa',
    categoriaPaiId: 'categoriaPaiId',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm'
  };

  export type CategoriaScalarFieldEnum = (typeof CategoriaScalarFieldEnum)[keyof typeof CategoriaScalarFieldEnum]


  export const MarcaScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    nome: 'nome',
    slug: 'slug',
    logoUrl: 'logoUrl',
    ativa: 'ativa',
    criadoEm: 'criadoEm',
    atualizadoEm: 'atualizadoEm'
  };

  export type MarcaScalarFieldEnum = (typeof MarcaScalarFieldEnum)[keyof typeof MarcaScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type ProdutoWhereInput = {
    AND?: ProdutoWhereInput | ProdutoWhereInput[]
    OR?: ProdutoWhereInput[]
    NOT?: ProdutoWhereInput | ProdutoWhereInput[]
    id?: UuidFilter<"Produto"> | string
    tenantId?: UuidFilter<"Produto"> | string
    sku?: StringFilter<"Produto"> | string
    gtin?: StringNullableFilter<"Produto"> | string | null
    nome?: StringFilter<"Produto"> | string
    descricao?: StringFilter<"Produto"> | string
    descricaoCurta?: StringNullableFilter<"Produto"> | string | null
    status?: StringFilter<"Produto"> | string
    ncm?: StringFilter<"Produto"> | string
    cest?: StringNullableFilter<"Produto"> | string | null
    origem?: IntFilter<"Produto"> | number
    precoCusto?: IntFilter<"Produto"> | number
    precoVenda?: IntFilter<"Produto"> | number
    precoPromocional?: IntNullableFilter<"Produto"> | number | null
    peso?: IntFilter<"Produto"> | number
    altura?: FloatFilter<"Produto"> | number
    largura?: FloatFilter<"Produto"> | number
    comprimento?: FloatFilter<"Produto"> | number
    tags?: StringNullableListFilter<"Produto">
    metaTitulo?: StringNullableFilter<"Produto"> | string | null
    metaDescricao?: StringNullableFilter<"Produto"> | string | null
    criadoEm?: DateTimeFilter<"Produto"> | Date | string
    atualizadoEm?: DateTimeFilter<"Produto"> | Date | string
    categoriaId?: UuidFilter<"Produto"> | string
    marcaId?: UuidNullableFilter<"Produto"> | string | null
    categoria?: XOR<CategoriaRelationFilter, CategoriaWhereInput>
    marca?: XOR<MarcaNullableRelationFilter, MarcaWhereInput> | null
    imagens?: ImagemProdutoListRelationFilter
    variacoes?: VariacaoProdutoListRelationFilter
  }

  export type ProdutoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrderInput | SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    descricaoCurta?: SortOrderInput | SortOrder
    status?: SortOrder
    ncm?: SortOrder
    cest?: SortOrderInput | SortOrder
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrderInput | SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
    tags?: SortOrder
    metaTitulo?: SortOrderInput | SortOrder
    metaDescricao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaId?: SortOrder
    marcaId?: SortOrderInput | SortOrder
    categoria?: CategoriaOrderByWithRelationInput
    marca?: MarcaOrderByWithRelationInput
    imagens?: ImagemProdutoOrderByRelationAggregateInput
    variacoes?: VariacaoProdutoOrderByRelationAggregateInput
  }

  export type ProdutoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_sku?: ProdutoTenantIdSkuCompoundUniqueInput
    AND?: ProdutoWhereInput | ProdutoWhereInput[]
    OR?: ProdutoWhereInput[]
    NOT?: ProdutoWhereInput | ProdutoWhereInput[]
    tenantId?: UuidFilter<"Produto"> | string
    sku?: StringFilter<"Produto"> | string
    gtin?: StringNullableFilter<"Produto"> | string | null
    nome?: StringFilter<"Produto"> | string
    descricao?: StringFilter<"Produto"> | string
    descricaoCurta?: StringNullableFilter<"Produto"> | string | null
    status?: StringFilter<"Produto"> | string
    ncm?: StringFilter<"Produto"> | string
    cest?: StringNullableFilter<"Produto"> | string | null
    origem?: IntFilter<"Produto"> | number
    precoCusto?: IntFilter<"Produto"> | number
    precoVenda?: IntFilter<"Produto"> | number
    precoPromocional?: IntNullableFilter<"Produto"> | number | null
    peso?: IntFilter<"Produto"> | number
    altura?: FloatFilter<"Produto"> | number
    largura?: FloatFilter<"Produto"> | number
    comprimento?: FloatFilter<"Produto"> | number
    tags?: StringNullableListFilter<"Produto">
    metaTitulo?: StringNullableFilter<"Produto"> | string | null
    metaDescricao?: StringNullableFilter<"Produto"> | string | null
    criadoEm?: DateTimeFilter<"Produto"> | Date | string
    atualizadoEm?: DateTimeFilter<"Produto"> | Date | string
    categoriaId?: UuidFilter<"Produto"> | string
    marcaId?: UuidNullableFilter<"Produto"> | string | null
    categoria?: XOR<CategoriaRelationFilter, CategoriaWhereInput>
    marca?: XOR<MarcaNullableRelationFilter, MarcaWhereInput> | null
    imagens?: ImagemProdutoListRelationFilter
    variacoes?: VariacaoProdutoListRelationFilter
  }, "id" | "tenantId_sku">

  export type ProdutoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrderInput | SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    descricaoCurta?: SortOrderInput | SortOrder
    status?: SortOrder
    ncm?: SortOrder
    cest?: SortOrderInput | SortOrder
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrderInput | SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
    tags?: SortOrder
    metaTitulo?: SortOrderInput | SortOrder
    metaDescricao?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaId?: SortOrder
    marcaId?: SortOrderInput | SortOrder
    _count?: ProdutoCountOrderByAggregateInput
    _avg?: ProdutoAvgOrderByAggregateInput
    _max?: ProdutoMaxOrderByAggregateInput
    _min?: ProdutoMinOrderByAggregateInput
    _sum?: ProdutoSumOrderByAggregateInput
  }

  export type ProdutoScalarWhereWithAggregatesInput = {
    AND?: ProdutoScalarWhereWithAggregatesInput | ProdutoScalarWhereWithAggregatesInput[]
    OR?: ProdutoScalarWhereWithAggregatesInput[]
    NOT?: ProdutoScalarWhereWithAggregatesInput | ProdutoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Produto"> | string
    tenantId?: UuidWithAggregatesFilter<"Produto"> | string
    sku?: StringWithAggregatesFilter<"Produto"> | string
    gtin?: StringNullableWithAggregatesFilter<"Produto"> | string | null
    nome?: StringWithAggregatesFilter<"Produto"> | string
    descricao?: StringWithAggregatesFilter<"Produto"> | string
    descricaoCurta?: StringNullableWithAggregatesFilter<"Produto"> | string | null
    status?: StringWithAggregatesFilter<"Produto"> | string
    ncm?: StringWithAggregatesFilter<"Produto"> | string
    cest?: StringNullableWithAggregatesFilter<"Produto"> | string | null
    origem?: IntWithAggregatesFilter<"Produto"> | number
    precoCusto?: IntWithAggregatesFilter<"Produto"> | number
    precoVenda?: IntWithAggregatesFilter<"Produto"> | number
    precoPromocional?: IntNullableWithAggregatesFilter<"Produto"> | number | null
    peso?: IntWithAggregatesFilter<"Produto"> | number
    altura?: FloatWithAggregatesFilter<"Produto"> | number
    largura?: FloatWithAggregatesFilter<"Produto"> | number
    comprimento?: FloatWithAggregatesFilter<"Produto"> | number
    tags?: StringNullableListFilter<"Produto">
    metaTitulo?: StringNullableWithAggregatesFilter<"Produto"> | string | null
    metaDescricao?: StringNullableWithAggregatesFilter<"Produto"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Produto"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Produto"> | Date | string
    categoriaId?: UuidWithAggregatesFilter<"Produto"> | string
    marcaId?: UuidNullableWithAggregatesFilter<"Produto"> | string | null
  }

  export type ImagemProdutoWhereInput = {
    AND?: ImagemProdutoWhereInput | ImagemProdutoWhereInput[]
    OR?: ImagemProdutoWhereInput[]
    NOT?: ImagemProdutoWhereInput | ImagemProdutoWhereInput[]
    id?: UuidFilter<"ImagemProduto"> | string
    produtoId?: UuidFilter<"ImagemProduto"> | string
    url?: StringFilter<"ImagemProduto"> | string
    urlMiniatura?: StringNullableFilter<"ImagemProduto"> | string | null
    altText?: StringNullableFilter<"ImagemProduto"> | string | null
    ordem?: IntFilter<"ImagemProduto"> | number
    principal?: BoolFilter<"ImagemProduto"> | boolean
    criadoEm?: DateTimeFilter<"ImagemProduto"> | Date | string
    produto?: XOR<ProdutoRelationFilter, ProdutoWhereInput>
  }

  export type ImagemProdutoOrderByWithRelationInput = {
    id?: SortOrder
    produtoId?: SortOrder
    url?: SortOrder
    urlMiniatura?: SortOrderInput | SortOrder
    altText?: SortOrderInput | SortOrder
    ordem?: SortOrder
    principal?: SortOrder
    criadoEm?: SortOrder
    produto?: ProdutoOrderByWithRelationInput
  }

  export type ImagemProdutoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImagemProdutoWhereInput | ImagemProdutoWhereInput[]
    OR?: ImagemProdutoWhereInput[]
    NOT?: ImagemProdutoWhereInput | ImagemProdutoWhereInput[]
    produtoId?: UuidFilter<"ImagemProduto"> | string
    url?: StringFilter<"ImagemProduto"> | string
    urlMiniatura?: StringNullableFilter<"ImagemProduto"> | string | null
    altText?: StringNullableFilter<"ImagemProduto"> | string | null
    ordem?: IntFilter<"ImagemProduto"> | number
    principal?: BoolFilter<"ImagemProduto"> | boolean
    criadoEm?: DateTimeFilter<"ImagemProduto"> | Date | string
    produto?: XOR<ProdutoRelationFilter, ProdutoWhereInput>
  }, "id">

  export type ImagemProdutoOrderByWithAggregationInput = {
    id?: SortOrder
    produtoId?: SortOrder
    url?: SortOrder
    urlMiniatura?: SortOrderInput | SortOrder
    altText?: SortOrderInput | SortOrder
    ordem?: SortOrder
    principal?: SortOrder
    criadoEm?: SortOrder
    _count?: ImagemProdutoCountOrderByAggregateInput
    _avg?: ImagemProdutoAvgOrderByAggregateInput
    _max?: ImagemProdutoMaxOrderByAggregateInput
    _min?: ImagemProdutoMinOrderByAggregateInput
    _sum?: ImagemProdutoSumOrderByAggregateInput
  }

  export type ImagemProdutoScalarWhereWithAggregatesInput = {
    AND?: ImagemProdutoScalarWhereWithAggregatesInput | ImagemProdutoScalarWhereWithAggregatesInput[]
    OR?: ImagemProdutoScalarWhereWithAggregatesInput[]
    NOT?: ImagemProdutoScalarWhereWithAggregatesInput | ImagemProdutoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ImagemProduto"> | string
    produtoId?: UuidWithAggregatesFilter<"ImagemProduto"> | string
    url?: StringWithAggregatesFilter<"ImagemProduto"> | string
    urlMiniatura?: StringNullableWithAggregatesFilter<"ImagemProduto"> | string | null
    altText?: StringNullableWithAggregatesFilter<"ImagemProduto"> | string | null
    ordem?: IntWithAggregatesFilter<"ImagemProduto"> | number
    principal?: BoolWithAggregatesFilter<"ImagemProduto"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"ImagemProduto"> | Date | string
  }

  export type VariacaoProdutoWhereInput = {
    AND?: VariacaoProdutoWhereInput | VariacaoProdutoWhereInput[]
    OR?: VariacaoProdutoWhereInput[]
    NOT?: VariacaoProdutoWhereInput | VariacaoProdutoWhereInput[]
    id?: UuidFilter<"VariacaoProduto"> | string
    produtoId?: UuidFilter<"VariacaoProduto"> | string
    sku?: StringFilter<"VariacaoProduto"> | string
    gtin?: StringNullableFilter<"VariacaoProduto"> | string | null
    nome?: StringFilter<"VariacaoProduto"> | string
    precoVenda?: IntNullableFilter<"VariacaoProduto"> | number | null
    peso?: IntNullableFilter<"VariacaoProduto"> | number | null
    criadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
    atualizadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
    produto?: XOR<ProdutoRelationFilter, ProdutoWhereInput>
    atributos?: AtributoVariacaoListRelationFilter
    imagens?: ImagemVariacaoListRelationFilter
  }

  export type VariacaoProdutoOrderByWithRelationInput = {
    id?: SortOrder
    produtoId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrderInput | SortOrder
    nome?: SortOrder
    precoVenda?: SortOrderInput | SortOrder
    peso?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    produto?: ProdutoOrderByWithRelationInput
    atributos?: AtributoVariacaoOrderByRelationAggregateInput
    imagens?: ImagemVariacaoOrderByRelationAggregateInput
  }

  export type VariacaoProdutoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VariacaoProdutoWhereInput | VariacaoProdutoWhereInput[]
    OR?: VariacaoProdutoWhereInput[]
    NOT?: VariacaoProdutoWhereInput | VariacaoProdutoWhereInput[]
    produtoId?: UuidFilter<"VariacaoProduto"> | string
    sku?: StringFilter<"VariacaoProduto"> | string
    gtin?: StringNullableFilter<"VariacaoProduto"> | string | null
    nome?: StringFilter<"VariacaoProduto"> | string
    precoVenda?: IntNullableFilter<"VariacaoProduto"> | number | null
    peso?: IntNullableFilter<"VariacaoProduto"> | number | null
    criadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
    atualizadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
    produto?: XOR<ProdutoRelationFilter, ProdutoWhereInput>
    atributos?: AtributoVariacaoListRelationFilter
    imagens?: ImagemVariacaoListRelationFilter
  }, "id">

  export type VariacaoProdutoOrderByWithAggregationInput = {
    id?: SortOrder
    produtoId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrderInput | SortOrder
    nome?: SortOrder
    precoVenda?: SortOrderInput | SortOrder
    peso?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: VariacaoProdutoCountOrderByAggregateInput
    _avg?: VariacaoProdutoAvgOrderByAggregateInput
    _max?: VariacaoProdutoMaxOrderByAggregateInput
    _min?: VariacaoProdutoMinOrderByAggregateInput
    _sum?: VariacaoProdutoSumOrderByAggregateInput
  }

  export type VariacaoProdutoScalarWhereWithAggregatesInput = {
    AND?: VariacaoProdutoScalarWhereWithAggregatesInput | VariacaoProdutoScalarWhereWithAggregatesInput[]
    OR?: VariacaoProdutoScalarWhereWithAggregatesInput[]
    NOT?: VariacaoProdutoScalarWhereWithAggregatesInput | VariacaoProdutoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VariacaoProduto"> | string
    produtoId?: UuidWithAggregatesFilter<"VariacaoProduto"> | string
    sku?: StringWithAggregatesFilter<"VariacaoProduto"> | string
    gtin?: StringNullableWithAggregatesFilter<"VariacaoProduto"> | string | null
    nome?: StringWithAggregatesFilter<"VariacaoProduto"> | string
    precoVenda?: IntNullableWithAggregatesFilter<"VariacaoProduto"> | number | null
    peso?: IntNullableWithAggregatesFilter<"VariacaoProduto"> | number | null
    criadoEm?: DateTimeWithAggregatesFilter<"VariacaoProduto"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"VariacaoProduto"> | Date | string
  }

  export type AtributoVariacaoWhereInput = {
    AND?: AtributoVariacaoWhereInput | AtributoVariacaoWhereInput[]
    OR?: AtributoVariacaoWhereInput[]
    NOT?: AtributoVariacaoWhereInput | AtributoVariacaoWhereInput[]
    id?: UuidFilter<"AtributoVariacao"> | string
    variacaoId?: UuidFilter<"AtributoVariacao"> | string
    nome?: StringFilter<"AtributoVariacao"> | string
    valor?: StringFilter<"AtributoVariacao"> | string
    variacao?: XOR<VariacaoProdutoRelationFilter, VariacaoProdutoWhereInput>
  }

  export type AtributoVariacaoOrderByWithRelationInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    nome?: SortOrder
    valor?: SortOrder
    variacao?: VariacaoProdutoOrderByWithRelationInput
  }

  export type AtributoVariacaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AtributoVariacaoWhereInput | AtributoVariacaoWhereInput[]
    OR?: AtributoVariacaoWhereInput[]
    NOT?: AtributoVariacaoWhereInput | AtributoVariacaoWhereInput[]
    variacaoId?: UuidFilter<"AtributoVariacao"> | string
    nome?: StringFilter<"AtributoVariacao"> | string
    valor?: StringFilter<"AtributoVariacao"> | string
    variacao?: XOR<VariacaoProdutoRelationFilter, VariacaoProdutoWhereInput>
  }, "id">

  export type AtributoVariacaoOrderByWithAggregationInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    nome?: SortOrder
    valor?: SortOrder
    _count?: AtributoVariacaoCountOrderByAggregateInput
    _max?: AtributoVariacaoMaxOrderByAggregateInput
    _min?: AtributoVariacaoMinOrderByAggregateInput
  }

  export type AtributoVariacaoScalarWhereWithAggregatesInput = {
    AND?: AtributoVariacaoScalarWhereWithAggregatesInput | AtributoVariacaoScalarWhereWithAggregatesInput[]
    OR?: AtributoVariacaoScalarWhereWithAggregatesInput[]
    NOT?: AtributoVariacaoScalarWhereWithAggregatesInput | AtributoVariacaoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AtributoVariacao"> | string
    variacaoId?: UuidWithAggregatesFilter<"AtributoVariacao"> | string
    nome?: StringWithAggregatesFilter<"AtributoVariacao"> | string
    valor?: StringWithAggregatesFilter<"AtributoVariacao"> | string
  }

  export type ImagemVariacaoWhereInput = {
    AND?: ImagemVariacaoWhereInput | ImagemVariacaoWhereInput[]
    OR?: ImagemVariacaoWhereInput[]
    NOT?: ImagemVariacaoWhereInput | ImagemVariacaoWhereInput[]
    id?: UuidFilter<"ImagemVariacao"> | string
    variacaoId?: UuidFilter<"ImagemVariacao"> | string
    url?: StringFilter<"ImagemVariacao"> | string
    ordem?: IntFilter<"ImagemVariacao"> | number
    variacao?: XOR<VariacaoProdutoRelationFilter, VariacaoProdutoWhereInput>
  }

  export type ImagemVariacaoOrderByWithRelationInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    url?: SortOrder
    ordem?: SortOrder
    variacao?: VariacaoProdutoOrderByWithRelationInput
  }

  export type ImagemVariacaoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImagemVariacaoWhereInput | ImagemVariacaoWhereInput[]
    OR?: ImagemVariacaoWhereInput[]
    NOT?: ImagemVariacaoWhereInput | ImagemVariacaoWhereInput[]
    variacaoId?: UuidFilter<"ImagemVariacao"> | string
    url?: StringFilter<"ImagemVariacao"> | string
    ordem?: IntFilter<"ImagemVariacao"> | number
    variacao?: XOR<VariacaoProdutoRelationFilter, VariacaoProdutoWhereInput>
  }, "id">

  export type ImagemVariacaoOrderByWithAggregationInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    url?: SortOrder
    ordem?: SortOrder
    _count?: ImagemVariacaoCountOrderByAggregateInput
    _avg?: ImagemVariacaoAvgOrderByAggregateInput
    _max?: ImagemVariacaoMaxOrderByAggregateInput
    _min?: ImagemVariacaoMinOrderByAggregateInput
    _sum?: ImagemVariacaoSumOrderByAggregateInput
  }

  export type ImagemVariacaoScalarWhereWithAggregatesInput = {
    AND?: ImagemVariacaoScalarWhereWithAggregatesInput | ImagemVariacaoScalarWhereWithAggregatesInput[]
    OR?: ImagemVariacaoScalarWhereWithAggregatesInput[]
    NOT?: ImagemVariacaoScalarWhereWithAggregatesInput | ImagemVariacaoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ImagemVariacao"> | string
    variacaoId?: UuidWithAggregatesFilter<"ImagemVariacao"> | string
    url?: StringWithAggregatesFilter<"ImagemVariacao"> | string
    ordem?: IntWithAggregatesFilter<"ImagemVariacao"> | number
  }

  export type CategoriaWhereInput = {
    AND?: CategoriaWhereInput | CategoriaWhereInput[]
    OR?: CategoriaWhereInput[]
    NOT?: CategoriaWhereInput | CategoriaWhereInput[]
    id?: UuidFilter<"Categoria"> | string
    tenantId?: UuidFilter<"Categoria"> | string
    nome?: StringFilter<"Categoria"> | string
    slug?: StringFilter<"Categoria"> | string
    nivel?: IntFilter<"Categoria"> | number
    ativa?: BoolFilter<"Categoria"> | boolean
    categoriaPaiId?: UuidNullableFilter<"Categoria"> | string | null
    criadoEm?: DateTimeFilter<"Categoria"> | Date | string
    atualizadoEm?: DateTimeFilter<"Categoria"> | Date | string
    categoriaPai?: XOR<CategoriaNullableRelationFilter, CategoriaWhereInput> | null
    subcategorias?: CategoriaListRelationFilter
    produtos?: ProdutoListRelationFilter
  }

  export type CategoriaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    nivel?: SortOrder
    ativa?: SortOrder
    categoriaPaiId?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaPai?: CategoriaOrderByWithRelationInput
    subcategorias?: CategoriaOrderByRelationAggregateInput
    produtos?: ProdutoOrderByRelationAggregateInput
  }

  export type CategoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_slug?: CategoriaTenantIdSlugCompoundUniqueInput
    AND?: CategoriaWhereInput | CategoriaWhereInput[]
    OR?: CategoriaWhereInput[]
    NOT?: CategoriaWhereInput | CategoriaWhereInput[]
    tenantId?: UuidFilter<"Categoria"> | string
    nome?: StringFilter<"Categoria"> | string
    slug?: StringFilter<"Categoria"> | string
    nivel?: IntFilter<"Categoria"> | number
    ativa?: BoolFilter<"Categoria"> | boolean
    categoriaPaiId?: UuidNullableFilter<"Categoria"> | string | null
    criadoEm?: DateTimeFilter<"Categoria"> | Date | string
    atualizadoEm?: DateTimeFilter<"Categoria"> | Date | string
    categoriaPai?: XOR<CategoriaNullableRelationFilter, CategoriaWhereInput> | null
    subcategorias?: CategoriaListRelationFilter
    produtos?: ProdutoListRelationFilter
  }, "id" | "tenantId_slug">

  export type CategoriaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    nivel?: SortOrder
    ativa?: SortOrder
    categoriaPaiId?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: CategoriaCountOrderByAggregateInput
    _avg?: CategoriaAvgOrderByAggregateInput
    _max?: CategoriaMaxOrderByAggregateInput
    _min?: CategoriaMinOrderByAggregateInput
    _sum?: CategoriaSumOrderByAggregateInput
  }

  export type CategoriaScalarWhereWithAggregatesInput = {
    AND?: CategoriaScalarWhereWithAggregatesInput | CategoriaScalarWhereWithAggregatesInput[]
    OR?: CategoriaScalarWhereWithAggregatesInput[]
    NOT?: CategoriaScalarWhereWithAggregatesInput | CategoriaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Categoria"> | string
    tenantId?: UuidWithAggregatesFilter<"Categoria"> | string
    nome?: StringWithAggregatesFilter<"Categoria"> | string
    slug?: StringWithAggregatesFilter<"Categoria"> | string
    nivel?: IntWithAggregatesFilter<"Categoria"> | number
    ativa?: BoolWithAggregatesFilter<"Categoria"> | boolean
    categoriaPaiId?: UuidNullableWithAggregatesFilter<"Categoria"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"Categoria"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Categoria"> | Date | string
  }

  export type MarcaWhereInput = {
    AND?: MarcaWhereInput | MarcaWhereInput[]
    OR?: MarcaWhereInput[]
    NOT?: MarcaWhereInput | MarcaWhereInput[]
    id?: UuidFilter<"Marca"> | string
    tenantId?: UuidFilter<"Marca"> | string
    nome?: StringFilter<"Marca"> | string
    slug?: StringFilter<"Marca"> | string
    logoUrl?: StringNullableFilter<"Marca"> | string | null
    ativa?: BoolFilter<"Marca"> | boolean
    criadoEm?: DateTimeFilter<"Marca"> | Date | string
    atualizadoEm?: DateTimeFilter<"Marca"> | Date | string
    produtos?: ProdutoListRelationFilter
  }

  export type MarcaOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    produtos?: ProdutoOrderByRelationAggregateInput
  }

  export type MarcaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_slug?: MarcaTenantIdSlugCompoundUniqueInput
    AND?: MarcaWhereInput | MarcaWhereInput[]
    OR?: MarcaWhereInput[]
    NOT?: MarcaWhereInput | MarcaWhereInput[]
    tenantId?: UuidFilter<"Marca"> | string
    nome?: StringFilter<"Marca"> | string
    slug?: StringFilter<"Marca"> | string
    logoUrl?: StringNullableFilter<"Marca"> | string | null
    ativa?: BoolFilter<"Marca"> | boolean
    criadoEm?: DateTimeFilter<"Marca"> | Date | string
    atualizadoEm?: DateTimeFilter<"Marca"> | Date | string
    produtos?: ProdutoListRelationFilter
  }, "id" | "tenantId_slug">

  export type MarcaOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    _count?: MarcaCountOrderByAggregateInput
    _max?: MarcaMaxOrderByAggregateInput
    _min?: MarcaMinOrderByAggregateInput
  }

  export type MarcaScalarWhereWithAggregatesInput = {
    AND?: MarcaScalarWhereWithAggregatesInput | MarcaScalarWhereWithAggregatesInput[]
    OR?: MarcaScalarWhereWithAggregatesInput[]
    NOT?: MarcaScalarWhereWithAggregatesInput | MarcaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Marca"> | string
    tenantId?: UuidWithAggregatesFilter<"Marca"> | string
    nome?: StringWithAggregatesFilter<"Marca"> | string
    slug?: StringWithAggregatesFilter<"Marca"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Marca"> | string | null
    ativa?: BoolWithAggregatesFilter<"Marca"> | boolean
    criadoEm?: DateTimeWithAggregatesFilter<"Marca"> | Date | string
    atualizadoEm?: DateTimeWithAggregatesFilter<"Marca"> | Date | string
  }

  export type ProdutoCreateInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoria: CategoriaCreateNestedOneWithoutProdutosInput
    marca?: MarcaCreateNestedOneWithoutProdutosInput
    imagens?: ImagemProdutoCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUncheckedCreateInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
    marcaId?: string | null
    imagens?: ImagemProdutoUncheckedCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoUncheckedCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoria?: CategoriaUpdateOneRequiredWithoutProdutosNestedInput
    marca?: MarcaUpdateOneWithoutProdutosNestedInput
    imagens?: ImagemProdutoUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
    imagens?: ImagemProdutoUncheckedUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUncheckedUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoCreateManyInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
    marcaId?: string | null
  }

  export type ProdutoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProdutoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImagemProdutoCreateInput = {
    id?: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
    produto: ProdutoCreateNestedOneWithoutImagensInput
  }

  export type ImagemProdutoUncheckedCreateInput = {
    id?: string
    produtoId: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
  }

  export type ImagemProdutoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produto?: ProdutoUpdateOneRequiredWithoutImagensNestedInput
  }

  export type ImagemProdutoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagemProdutoCreateManyInput = {
    id?: string
    produtoId: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
  }

  export type ImagemProdutoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagemProdutoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VariacaoProdutoCreateInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produto: ProdutoCreateNestedOneWithoutVariacoesInput
    atributos?: AtributoVariacaoCreateNestedManyWithoutVariacaoInput
    imagens?: ImagemVariacaoCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoUncheckedCreateInput = {
    id?: string
    produtoId: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    atributos?: AtributoVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
    imagens?: ImagemVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produto?: ProdutoUpdateOneRequiredWithoutVariacoesNestedInput
    atributos?: AtributoVariacaoUpdateManyWithoutVariacaoNestedInput
    imagens?: ImagemVariacaoUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atributos?: AtributoVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
    imagens?: ImagemVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoCreateManyInput = {
    id?: string
    produtoId: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type VariacaoProdutoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VariacaoProdutoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AtributoVariacaoCreateInput = {
    id?: string
    nome: string
    valor: string
    variacao: VariacaoProdutoCreateNestedOneWithoutAtributosInput
  }

  export type AtributoVariacaoUncheckedCreateInput = {
    id?: string
    variacaoId: string
    nome: string
    valor: string
  }

  export type AtributoVariacaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    variacao?: VariacaoProdutoUpdateOneRequiredWithoutAtributosNestedInput
  }

  export type AtributoVariacaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    variacaoId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type AtributoVariacaoCreateManyInput = {
    id?: string
    variacaoId: string
    nome: string
    valor: string
  }

  export type AtributoVariacaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type AtributoVariacaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    variacaoId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type ImagemVariacaoCreateInput = {
    id?: string
    url: string
    ordem?: number
    variacao: VariacaoProdutoCreateNestedOneWithoutImagensInput
  }

  export type ImagemVariacaoUncheckedCreateInput = {
    id?: string
    variacaoId: string
    url: string
    ordem?: number
  }

  export type ImagemVariacaoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    variacao?: VariacaoProdutoUpdateOneRequiredWithoutImagensNestedInput
  }

  export type ImagemVariacaoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    variacaoId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type ImagemVariacaoCreateManyInput = {
    id?: string
    variacaoId: string
    url: string
    ordem?: number
  }

  export type ImagemVariacaoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type ImagemVariacaoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    variacaoId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type CategoriaCreateInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaPai?: CategoriaCreateNestedOneWithoutSubcategoriasInput
    subcategorias?: CategoriaCreateNestedManyWithoutCategoriaPaiInput
    produtos?: ProdutoCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    categoriaPaiId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    subcategorias?: CategoriaUncheckedCreateNestedManyWithoutCategoriaPaiInput
    produtos?: ProdutoUncheckedCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaPai?: CategoriaUpdateOneWithoutSubcategoriasNestedInput
    subcategorias?: CategoriaUpdateManyWithoutCategoriaPaiNestedInput
    produtos?: ProdutoUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    categoriaPaiId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategorias?: CategoriaUncheckedUpdateManyWithoutCategoriaPaiNestedInput
    produtos?: ProdutoUncheckedUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    categoriaPaiId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type CategoriaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoriaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    categoriaPaiId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarcaCreateInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    logoUrl?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produtos?: ProdutoCreateNestedManyWithoutMarcaInput
  }

  export type MarcaUncheckedCreateInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    logoUrl?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produtos?: ProdutoUncheckedCreateNestedManyWithoutMarcaInput
  }

  export type MarcaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produtos?: ProdutoUpdateManyWithoutMarcaNestedInput
  }

  export type MarcaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produtos?: ProdutoUncheckedUpdateManyWithoutMarcaNestedInput
  }

  export type MarcaCreateManyInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    logoUrl?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type MarcaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarcaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type CategoriaRelationFilter = {
    is?: CategoriaWhereInput
    isNot?: CategoriaWhereInput
  }

  export type MarcaNullableRelationFilter = {
    is?: MarcaWhereInput | null
    isNot?: MarcaWhereInput | null
  }

  export type ImagemProdutoListRelationFilter = {
    every?: ImagemProdutoWhereInput
    some?: ImagemProdutoWhereInput
    none?: ImagemProdutoWhereInput
  }

  export type VariacaoProdutoListRelationFilter = {
    every?: VariacaoProdutoWhereInput
    some?: VariacaoProdutoWhereInput
    none?: VariacaoProdutoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ImagemProdutoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VariacaoProdutoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProdutoTenantIdSkuCompoundUniqueInput = {
    tenantId: string
    sku: string
  }

  export type ProdutoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    descricaoCurta?: SortOrder
    status?: SortOrder
    ncm?: SortOrder
    cest?: SortOrder
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
    tags?: SortOrder
    metaTitulo?: SortOrder
    metaDescricao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaId?: SortOrder
    marcaId?: SortOrder
  }

  export type ProdutoAvgOrderByAggregateInput = {
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
  }

  export type ProdutoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    descricaoCurta?: SortOrder
    status?: SortOrder
    ncm?: SortOrder
    cest?: SortOrder
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
    metaTitulo?: SortOrder
    metaDescricao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaId?: SortOrder
    marcaId?: SortOrder
  }

  export type ProdutoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
    descricaoCurta?: SortOrder
    status?: SortOrder
    ncm?: SortOrder
    cest?: SortOrder
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
    metaTitulo?: SortOrder
    metaDescricao?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
    categoriaId?: SortOrder
    marcaId?: SortOrder
  }

  export type ProdutoSumOrderByAggregateInput = {
    origem?: SortOrder
    precoCusto?: SortOrder
    precoVenda?: SortOrder
    precoPromocional?: SortOrder
    peso?: SortOrder
    altura?: SortOrder
    largura?: SortOrder
    comprimento?: SortOrder
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

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProdutoRelationFilter = {
    is?: ProdutoWhereInput
    isNot?: ProdutoWhereInput
  }

  export type ImagemProdutoCountOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    url?: SortOrder
    urlMiniatura?: SortOrder
    altText?: SortOrder
    ordem?: SortOrder
    principal?: SortOrder
    criadoEm?: SortOrder
  }

  export type ImagemProdutoAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type ImagemProdutoMaxOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    url?: SortOrder
    urlMiniatura?: SortOrder
    altText?: SortOrder
    ordem?: SortOrder
    principal?: SortOrder
    criadoEm?: SortOrder
  }

  export type ImagemProdutoMinOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    url?: SortOrder
    urlMiniatura?: SortOrder
    altText?: SortOrder
    ordem?: SortOrder
    principal?: SortOrder
    criadoEm?: SortOrder
  }

  export type ImagemProdutoSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AtributoVariacaoListRelationFilter = {
    every?: AtributoVariacaoWhereInput
    some?: AtributoVariacaoWhereInput
    none?: AtributoVariacaoWhereInput
  }

  export type ImagemVariacaoListRelationFilter = {
    every?: ImagemVariacaoWhereInput
    some?: ImagemVariacaoWhereInput
    none?: ImagemVariacaoWhereInput
  }

  export type AtributoVariacaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImagemVariacaoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VariacaoProdutoCountOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    precoVenda?: SortOrder
    peso?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type VariacaoProdutoAvgOrderByAggregateInput = {
    precoVenda?: SortOrder
    peso?: SortOrder
  }

  export type VariacaoProdutoMaxOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    precoVenda?: SortOrder
    peso?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type VariacaoProdutoMinOrderByAggregateInput = {
    id?: SortOrder
    produtoId?: SortOrder
    sku?: SortOrder
    gtin?: SortOrder
    nome?: SortOrder
    precoVenda?: SortOrder
    peso?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type VariacaoProdutoSumOrderByAggregateInput = {
    precoVenda?: SortOrder
    peso?: SortOrder
  }

  export type VariacaoProdutoRelationFilter = {
    is?: VariacaoProdutoWhereInput
    isNot?: VariacaoProdutoWhereInput
  }

  export type AtributoVariacaoCountOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    nome?: SortOrder
    valor?: SortOrder
  }

  export type AtributoVariacaoMaxOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    nome?: SortOrder
    valor?: SortOrder
  }

  export type AtributoVariacaoMinOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    nome?: SortOrder
    valor?: SortOrder
  }

  export type ImagemVariacaoCountOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    url?: SortOrder
    ordem?: SortOrder
  }

  export type ImagemVariacaoAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type ImagemVariacaoMaxOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    url?: SortOrder
    ordem?: SortOrder
  }

  export type ImagemVariacaoMinOrderByAggregateInput = {
    id?: SortOrder
    variacaoId?: SortOrder
    url?: SortOrder
    ordem?: SortOrder
  }

  export type ImagemVariacaoSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type CategoriaNullableRelationFilter = {
    is?: CategoriaWhereInput | null
    isNot?: CategoriaWhereInput | null
  }

  export type CategoriaListRelationFilter = {
    every?: CategoriaWhereInput
    some?: CategoriaWhereInput
    none?: CategoriaWhereInput
  }

  export type ProdutoListRelationFilter = {
    every?: ProdutoWhereInput
    some?: ProdutoWhereInput
    none?: ProdutoWhereInput
  }

  export type CategoriaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProdutoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoriaTenantIdSlugCompoundUniqueInput = {
    tenantId: string
    slug: string
  }

  export type CategoriaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    nivel?: SortOrder
    ativa?: SortOrder
    categoriaPaiId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type CategoriaAvgOrderByAggregateInput = {
    nivel?: SortOrder
  }

  export type CategoriaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    nivel?: SortOrder
    ativa?: SortOrder
    categoriaPaiId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type CategoriaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    nivel?: SortOrder
    ativa?: SortOrder
    categoriaPaiId?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type CategoriaSumOrderByAggregateInput = {
    nivel?: SortOrder
  }

  export type MarcaTenantIdSlugCompoundUniqueInput = {
    tenantId: string
    slug: string
  }

  export type MarcaCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type MarcaMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type MarcaMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    nome?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    ativa?: SortOrder
    criadoEm?: SortOrder
    atualizadoEm?: SortOrder
  }

  export type ProdutoCreatetagsInput = {
    set: string[]
  }

  export type CategoriaCreateNestedOneWithoutProdutosInput = {
    create?: XOR<CategoriaCreateWithoutProdutosInput, CategoriaUncheckedCreateWithoutProdutosInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProdutosInput
    connect?: CategoriaWhereUniqueInput
  }

  export type MarcaCreateNestedOneWithoutProdutosInput = {
    create?: XOR<MarcaCreateWithoutProdutosInput, MarcaUncheckedCreateWithoutProdutosInput>
    connectOrCreate?: MarcaCreateOrConnectWithoutProdutosInput
    connect?: MarcaWhereUniqueInput
  }

  export type ImagemProdutoCreateNestedManyWithoutProdutoInput = {
    create?: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput> | ImagemProdutoCreateWithoutProdutoInput[] | ImagemProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: ImagemProdutoCreateOrConnectWithoutProdutoInput | ImagemProdutoCreateOrConnectWithoutProdutoInput[]
    createMany?: ImagemProdutoCreateManyProdutoInputEnvelope
    connect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
  }

  export type VariacaoProdutoCreateNestedManyWithoutProdutoInput = {
    create?: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput> | VariacaoProdutoCreateWithoutProdutoInput[] | VariacaoProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutProdutoInput | VariacaoProdutoCreateOrConnectWithoutProdutoInput[]
    createMany?: VariacaoProdutoCreateManyProdutoInputEnvelope
    connect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
  }

  export type ImagemProdutoUncheckedCreateNestedManyWithoutProdutoInput = {
    create?: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput> | ImagemProdutoCreateWithoutProdutoInput[] | ImagemProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: ImagemProdutoCreateOrConnectWithoutProdutoInput | ImagemProdutoCreateOrConnectWithoutProdutoInput[]
    createMany?: ImagemProdutoCreateManyProdutoInputEnvelope
    connect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
  }

  export type VariacaoProdutoUncheckedCreateNestedManyWithoutProdutoInput = {
    create?: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput> | VariacaoProdutoCreateWithoutProdutoInput[] | VariacaoProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutProdutoInput | VariacaoProdutoCreateOrConnectWithoutProdutoInput[]
    createMany?: VariacaoProdutoCreateManyProdutoInputEnvelope
    connect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProdutoUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CategoriaUpdateOneRequiredWithoutProdutosNestedInput = {
    create?: XOR<CategoriaCreateWithoutProdutosInput, CategoriaUncheckedCreateWithoutProdutosInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutProdutosInput
    upsert?: CategoriaUpsertWithoutProdutosInput
    connect?: CategoriaWhereUniqueInput
    update?: XOR<XOR<CategoriaUpdateToOneWithWhereWithoutProdutosInput, CategoriaUpdateWithoutProdutosInput>, CategoriaUncheckedUpdateWithoutProdutosInput>
  }

  export type MarcaUpdateOneWithoutProdutosNestedInput = {
    create?: XOR<MarcaCreateWithoutProdutosInput, MarcaUncheckedCreateWithoutProdutosInput>
    connectOrCreate?: MarcaCreateOrConnectWithoutProdutosInput
    upsert?: MarcaUpsertWithoutProdutosInput
    disconnect?: MarcaWhereInput | boolean
    delete?: MarcaWhereInput | boolean
    connect?: MarcaWhereUniqueInput
    update?: XOR<XOR<MarcaUpdateToOneWithWhereWithoutProdutosInput, MarcaUpdateWithoutProdutosInput>, MarcaUncheckedUpdateWithoutProdutosInput>
  }

  export type ImagemProdutoUpdateManyWithoutProdutoNestedInput = {
    create?: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput> | ImagemProdutoCreateWithoutProdutoInput[] | ImagemProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: ImagemProdutoCreateOrConnectWithoutProdutoInput | ImagemProdutoCreateOrConnectWithoutProdutoInput[]
    upsert?: ImagemProdutoUpsertWithWhereUniqueWithoutProdutoInput | ImagemProdutoUpsertWithWhereUniqueWithoutProdutoInput[]
    createMany?: ImagemProdutoCreateManyProdutoInputEnvelope
    set?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    disconnect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    delete?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    connect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    update?: ImagemProdutoUpdateWithWhereUniqueWithoutProdutoInput | ImagemProdutoUpdateWithWhereUniqueWithoutProdutoInput[]
    updateMany?: ImagemProdutoUpdateManyWithWhereWithoutProdutoInput | ImagemProdutoUpdateManyWithWhereWithoutProdutoInput[]
    deleteMany?: ImagemProdutoScalarWhereInput | ImagemProdutoScalarWhereInput[]
  }

  export type VariacaoProdutoUpdateManyWithoutProdutoNestedInput = {
    create?: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput> | VariacaoProdutoCreateWithoutProdutoInput[] | VariacaoProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutProdutoInput | VariacaoProdutoCreateOrConnectWithoutProdutoInput[]
    upsert?: VariacaoProdutoUpsertWithWhereUniqueWithoutProdutoInput | VariacaoProdutoUpsertWithWhereUniqueWithoutProdutoInput[]
    createMany?: VariacaoProdutoCreateManyProdutoInputEnvelope
    set?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    disconnect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    delete?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    connect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    update?: VariacaoProdutoUpdateWithWhereUniqueWithoutProdutoInput | VariacaoProdutoUpdateWithWhereUniqueWithoutProdutoInput[]
    updateMany?: VariacaoProdutoUpdateManyWithWhereWithoutProdutoInput | VariacaoProdutoUpdateManyWithWhereWithoutProdutoInput[]
    deleteMany?: VariacaoProdutoScalarWhereInput | VariacaoProdutoScalarWhereInput[]
  }

  export type ImagemProdutoUncheckedUpdateManyWithoutProdutoNestedInput = {
    create?: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput> | ImagemProdutoCreateWithoutProdutoInput[] | ImagemProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: ImagemProdutoCreateOrConnectWithoutProdutoInput | ImagemProdutoCreateOrConnectWithoutProdutoInput[]
    upsert?: ImagemProdutoUpsertWithWhereUniqueWithoutProdutoInput | ImagemProdutoUpsertWithWhereUniqueWithoutProdutoInput[]
    createMany?: ImagemProdutoCreateManyProdutoInputEnvelope
    set?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    disconnect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    delete?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    connect?: ImagemProdutoWhereUniqueInput | ImagemProdutoWhereUniqueInput[]
    update?: ImagemProdutoUpdateWithWhereUniqueWithoutProdutoInput | ImagemProdutoUpdateWithWhereUniqueWithoutProdutoInput[]
    updateMany?: ImagemProdutoUpdateManyWithWhereWithoutProdutoInput | ImagemProdutoUpdateManyWithWhereWithoutProdutoInput[]
    deleteMany?: ImagemProdutoScalarWhereInput | ImagemProdutoScalarWhereInput[]
  }

  export type VariacaoProdutoUncheckedUpdateManyWithoutProdutoNestedInput = {
    create?: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput> | VariacaoProdutoCreateWithoutProdutoInput[] | VariacaoProdutoUncheckedCreateWithoutProdutoInput[]
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutProdutoInput | VariacaoProdutoCreateOrConnectWithoutProdutoInput[]
    upsert?: VariacaoProdutoUpsertWithWhereUniqueWithoutProdutoInput | VariacaoProdutoUpsertWithWhereUniqueWithoutProdutoInput[]
    createMany?: VariacaoProdutoCreateManyProdutoInputEnvelope
    set?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    disconnect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    delete?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    connect?: VariacaoProdutoWhereUniqueInput | VariacaoProdutoWhereUniqueInput[]
    update?: VariacaoProdutoUpdateWithWhereUniqueWithoutProdutoInput | VariacaoProdutoUpdateWithWhereUniqueWithoutProdutoInput[]
    updateMany?: VariacaoProdutoUpdateManyWithWhereWithoutProdutoInput | VariacaoProdutoUpdateManyWithWhereWithoutProdutoInput[]
    deleteMany?: VariacaoProdutoScalarWhereInput | VariacaoProdutoScalarWhereInput[]
  }

  export type ProdutoCreateNestedOneWithoutImagensInput = {
    create?: XOR<ProdutoCreateWithoutImagensInput, ProdutoUncheckedCreateWithoutImagensInput>
    connectOrCreate?: ProdutoCreateOrConnectWithoutImagensInput
    connect?: ProdutoWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProdutoUpdateOneRequiredWithoutImagensNestedInput = {
    create?: XOR<ProdutoCreateWithoutImagensInput, ProdutoUncheckedCreateWithoutImagensInput>
    connectOrCreate?: ProdutoCreateOrConnectWithoutImagensInput
    upsert?: ProdutoUpsertWithoutImagensInput
    connect?: ProdutoWhereUniqueInput
    update?: XOR<XOR<ProdutoUpdateToOneWithWhereWithoutImagensInput, ProdutoUpdateWithoutImagensInput>, ProdutoUncheckedUpdateWithoutImagensInput>
  }

  export type ProdutoCreateNestedOneWithoutVariacoesInput = {
    create?: XOR<ProdutoCreateWithoutVariacoesInput, ProdutoUncheckedCreateWithoutVariacoesInput>
    connectOrCreate?: ProdutoCreateOrConnectWithoutVariacoesInput
    connect?: ProdutoWhereUniqueInput
  }

  export type AtributoVariacaoCreateNestedManyWithoutVariacaoInput = {
    create?: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput> | AtributoVariacaoCreateWithoutVariacaoInput[] | AtributoVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: AtributoVariacaoCreateOrConnectWithoutVariacaoInput | AtributoVariacaoCreateOrConnectWithoutVariacaoInput[]
    createMany?: AtributoVariacaoCreateManyVariacaoInputEnvelope
    connect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
  }

  export type ImagemVariacaoCreateNestedManyWithoutVariacaoInput = {
    create?: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput> | ImagemVariacaoCreateWithoutVariacaoInput[] | ImagemVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: ImagemVariacaoCreateOrConnectWithoutVariacaoInput | ImagemVariacaoCreateOrConnectWithoutVariacaoInput[]
    createMany?: ImagemVariacaoCreateManyVariacaoInputEnvelope
    connect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
  }

  export type AtributoVariacaoUncheckedCreateNestedManyWithoutVariacaoInput = {
    create?: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput> | AtributoVariacaoCreateWithoutVariacaoInput[] | AtributoVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: AtributoVariacaoCreateOrConnectWithoutVariacaoInput | AtributoVariacaoCreateOrConnectWithoutVariacaoInput[]
    createMany?: AtributoVariacaoCreateManyVariacaoInputEnvelope
    connect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
  }

  export type ImagemVariacaoUncheckedCreateNestedManyWithoutVariacaoInput = {
    create?: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput> | ImagemVariacaoCreateWithoutVariacaoInput[] | ImagemVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: ImagemVariacaoCreateOrConnectWithoutVariacaoInput | ImagemVariacaoCreateOrConnectWithoutVariacaoInput[]
    createMany?: ImagemVariacaoCreateManyVariacaoInputEnvelope
    connect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
  }

  export type ProdutoUpdateOneRequiredWithoutVariacoesNestedInput = {
    create?: XOR<ProdutoCreateWithoutVariacoesInput, ProdutoUncheckedCreateWithoutVariacoesInput>
    connectOrCreate?: ProdutoCreateOrConnectWithoutVariacoesInput
    upsert?: ProdutoUpsertWithoutVariacoesInput
    connect?: ProdutoWhereUniqueInput
    update?: XOR<XOR<ProdutoUpdateToOneWithWhereWithoutVariacoesInput, ProdutoUpdateWithoutVariacoesInput>, ProdutoUncheckedUpdateWithoutVariacoesInput>
  }

  export type AtributoVariacaoUpdateManyWithoutVariacaoNestedInput = {
    create?: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput> | AtributoVariacaoCreateWithoutVariacaoInput[] | AtributoVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: AtributoVariacaoCreateOrConnectWithoutVariacaoInput | AtributoVariacaoCreateOrConnectWithoutVariacaoInput[]
    upsert?: AtributoVariacaoUpsertWithWhereUniqueWithoutVariacaoInput | AtributoVariacaoUpsertWithWhereUniqueWithoutVariacaoInput[]
    createMany?: AtributoVariacaoCreateManyVariacaoInputEnvelope
    set?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    disconnect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    delete?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    connect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    update?: AtributoVariacaoUpdateWithWhereUniqueWithoutVariacaoInput | AtributoVariacaoUpdateWithWhereUniqueWithoutVariacaoInput[]
    updateMany?: AtributoVariacaoUpdateManyWithWhereWithoutVariacaoInput | AtributoVariacaoUpdateManyWithWhereWithoutVariacaoInput[]
    deleteMany?: AtributoVariacaoScalarWhereInput | AtributoVariacaoScalarWhereInput[]
  }

  export type ImagemVariacaoUpdateManyWithoutVariacaoNestedInput = {
    create?: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput> | ImagemVariacaoCreateWithoutVariacaoInput[] | ImagemVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: ImagemVariacaoCreateOrConnectWithoutVariacaoInput | ImagemVariacaoCreateOrConnectWithoutVariacaoInput[]
    upsert?: ImagemVariacaoUpsertWithWhereUniqueWithoutVariacaoInput | ImagemVariacaoUpsertWithWhereUniqueWithoutVariacaoInput[]
    createMany?: ImagemVariacaoCreateManyVariacaoInputEnvelope
    set?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    disconnect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    delete?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    connect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    update?: ImagemVariacaoUpdateWithWhereUniqueWithoutVariacaoInput | ImagemVariacaoUpdateWithWhereUniqueWithoutVariacaoInput[]
    updateMany?: ImagemVariacaoUpdateManyWithWhereWithoutVariacaoInput | ImagemVariacaoUpdateManyWithWhereWithoutVariacaoInput[]
    deleteMany?: ImagemVariacaoScalarWhereInput | ImagemVariacaoScalarWhereInput[]
  }

  export type AtributoVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput = {
    create?: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput> | AtributoVariacaoCreateWithoutVariacaoInput[] | AtributoVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: AtributoVariacaoCreateOrConnectWithoutVariacaoInput | AtributoVariacaoCreateOrConnectWithoutVariacaoInput[]
    upsert?: AtributoVariacaoUpsertWithWhereUniqueWithoutVariacaoInput | AtributoVariacaoUpsertWithWhereUniqueWithoutVariacaoInput[]
    createMany?: AtributoVariacaoCreateManyVariacaoInputEnvelope
    set?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    disconnect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    delete?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    connect?: AtributoVariacaoWhereUniqueInput | AtributoVariacaoWhereUniqueInput[]
    update?: AtributoVariacaoUpdateWithWhereUniqueWithoutVariacaoInput | AtributoVariacaoUpdateWithWhereUniqueWithoutVariacaoInput[]
    updateMany?: AtributoVariacaoUpdateManyWithWhereWithoutVariacaoInput | AtributoVariacaoUpdateManyWithWhereWithoutVariacaoInput[]
    deleteMany?: AtributoVariacaoScalarWhereInput | AtributoVariacaoScalarWhereInput[]
  }

  export type ImagemVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput = {
    create?: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput> | ImagemVariacaoCreateWithoutVariacaoInput[] | ImagemVariacaoUncheckedCreateWithoutVariacaoInput[]
    connectOrCreate?: ImagemVariacaoCreateOrConnectWithoutVariacaoInput | ImagemVariacaoCreateOrConnectWithoutVariacaoInput[]
    upsert?: ImagemVariacaoUpsertWithWhereUniqueWithoutVariacaoInput | ImagemVariacaoUpsertWithWhereUniqueWithoutVariacaoInput[]
    createMany?: ImagemVariacaoCreateManyVariacaoInputEnvelope
    set?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    disconnect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    delete?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    connect?: ImagemVariacaoWhereUniqueInput | ImagemVariacaoWhereUniqueInput[]
    update?: ImagemVariacaoUpdateWithWhereUniqueWithoutVariacaoInput | ImagemVariacaoUpdateWithWhereUniqueWithoutVariacaoInput[]
    updateMany?: ImagemVariacaoUpdateManyWithWhereWithoutVariacaoInput | ImagemVariacaoUpdateManyWithWhereWithoutVariacaoInput[]
    deleteMany?: ImagemVariacaoScalarWhereInput | ImagemVariacaoScalarWhereInput[]
  }

  export type VariacaoProdutoCreateNestedOneWithoutAtributosInput = {
    create?: XOR<VariacaoProdutoCreateWithoutAtributosInput, VariacaoProdutoUncheckedCreateWithoutAtributosInput>
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutAtributosInput
    connect?: VariacaoProdutoWhereUniqueInput
  }

  export type VariacaoProdutoUpdateOneRequiredWithoutAtributosNestedInput = {
    create?: XOR<VariacaoProdutoCreateWithoutAtributosInput, VariacaoProdutoUncheckedCreateWithoutAtributosInput>
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutAtributosInput
    upsert?: VariacaoProdutoUpsertWithoutAtributosInput
    connect?: VariacaoProdutoWhereUniqueInput
    update?: XOR<XOR<VariacaoProdutoUpdateToOneWithWhereWithoutAtributosInput, VariacaoProdutoUpdateWithoutAtributosInput>, VariacaoProdutoUncheckedUpdateWithoutAtributosInput>
  }

  export type VariacaoProdutoCreateNestedOneWithoutImagensInput = {
    create?: XOR<VariacaoProdutoCreateWithoutImagensInput, VariacaoProdutoUncheckedCreateWithoutImagensInput>
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutImagensInput
    connect?: VariacaoProdutoWhereUniqueInput
  }

  export type VariacaoProdutoUpdateOneRequiredWithoutImagensNestedInput = {
    create?: XOR<VariacaoProdutoCreateWithoutImagensInput, VariacaoProdutoUncheckedCreateWithoutImagensInput>
    connectOrCreate?: VariacaoProdutoCreateOrConnectWithoutImagensInput
    upsert?: VariacaoProdutoUpsertWithoutImagensInput
    connect?: VariacaoProdutoWhereUniqueInput
    update?: XOR<XOR<VariacaoProdutoUpdateToOneWithWhereWithoutImagensInput, VariacaoProdutoUpdateWithoutImagensInput>, VariacaoProdutoUncheckedUpdateWithoutImagensInput>
  }

  export type CategoriaCreateNestedOneWithoutSubcategoriasInput = {
    create?: XOR<CategoriaCreateWithoutSubcategoriasInput, CategoriaUncheckedCreateWithoutSubcategoriasInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutSubcategoriasInput
    connect?: CategoriaWhereUniqueInput
  }

  export type CategoriaCreateNestedManyWithoutCategoriaPaiInput = {
    create?: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput> | CategoriaCreateWithoutCategoriaPaiInput[] | CategoriaUncheckedCreateWithoutCategoriaPaiInput[]
    connectOrCreate?: CategoriaCreateOrConnectWithoutCategoriaPaiInput | CategoriaCreateOrConnectWithoutCategoriaPaiInput[]
    createMany?: CategoriaCreateManyCategoriaPaiInputEnvelope
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
  }

  export type ProdutoCreateNestedManyWithoutCategoriaInput = {
    create?: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput> | ProdutoCreateWithoutCategoriaInput[] | ProdutoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutCategoriaInput | ProdutoCreateOrConnectWithoutCategoriaInput[]
    createMany?: ProdutoCreateManyCategoriaInputEnvelope
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
  }

  export type CategoriaUncheckedCreateNestedManyWithoutCategoriaPaiInput = {
    create?: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput> | CategoriaCreateWithoutCategoriaPaiInput[] | CategoriaUncheckedCreateWithoutCategoriaPaiInput[]
    connectOrCreate?: CategoriaCreateOrConnectWithoutCategoriaPaiInput | CategoriaCreateOrConnectWithoutCategoriaPaiInput[]
    createMany?: CategoriaCreateManyCategoriaPaiInputEnvelope
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
  }

  export type ProdutoUncheckedCreateNestedManyWithoutCategoriaInput = {
    create?: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput> | ProdutoCreateWithoutCategoriaInput[] | ProdutoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutCategoriaInput | ProdutoCreateOrConnectWithoutCategoriaInput[]
    createMany?: ProdutoCreateManyCategoriaInputEnvelope
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
  }

  export type CategoriaUpdateOneWithoutSubcategoriasNestedInput = {
    create?: XOR<CategoriaCreateWithoutSubcategoriasInput, CategoriaUncheckedCreateWithoutSubcategoriasInput>
    connectOrCreate?: CategoriaCreateOrConnectWithoutSubcategoriasInput
    upsert?: CategoriaUpsertWithoutSubcategoriasInput
    disconnect?: CategoriaWhereInput | boolean
    delete?: CategoriaWhereInput | boolean
    connect?: CategoriaWhereUniqueInput
    update?: XOR<XOR<CategoriaUpdateToOneWithWhereWithoutSubcategoriasInput, CategoriaUpdateWithoutSubcategoriasInput>, CategoriaUncheckedUpdateWithoutSubcategoriasInput>
  }

  export type CategoriaUpdateManyWithoutCategoriaPaiNestedInput = {
    create?: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput> | CategoriaCreateWithoutCategoriaPaiInput[] | CategoriaUncheckedCreateWithoutCategoriaPaiInput[]
    connectOrCreate?: CategoriaCreateOrConnectWithoutCategoriaPaiInput | CategoriaCreateOrConnectWithoutCategoriaPaiInput[]
    upsert?: CategoriaUpsertWithWhereUniqueWithoutCategoriaPaiInput | CategoriaUpsertWithWhereUniqueWithoutCategoriaPaiInput[]
    createMany?: CategoriaCreateManyCategoriaPaiInputEnvelope
    set?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    disconnect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    delete?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    update?: CategoriaUpdateWithWhereUniqueWithoutCategoriaPaiInput | CategoriaUpdateWithWhereUniqueWithoutCategoriaPaiInput[]
    updateMany?: CategoriaUpdateManyWithWhereWithoutCategoriaPaiInput | CategoriaUpdateManyWithWhereWithoutCategoriaPaiInput[]
    deleteMany?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[]
  }

  export type ProdutoUpdateManyWithoutCategoriaNestedInput = {
    create?: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput> | ProdutoCreateWithoutCategoriaInput[] | ProdutoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutCategoriaInput | ProdutoCreateOrConnectWithoutCategoriaInput[]
    upsert?: ProdutoUpsertWithWhereUniqueWithoutCategoriaInput | ProdutoUpsertWithWhereUniqueWithoutCategoriaInput[]
    createMany?: ProdutoCreateManyCategoriaInputEnvelope
    set?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    disconnect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    delete?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    update?: ProdutoUpdateWithWhereUniqueWithoutCategoriaInput | ProdutoUpdateWithWhereUniqueWithoutCategoriaInput[]
    updateMany?: ProdutoUpdateManyWithWhereWithoutCategoriaInput | ProdutoUpdateManyWithWhereWithoutCategoriaInput[]
    deleteMany?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
  }

  export type CategoriaUncheckedUpdateManyWithoutCategoriaPaiNestedInput = {
    create?: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput> | CategoriaCreateWithoutCategoriaPaiInput[] | CategoriaUncheckedCreateWithoutCategoriaPaiInput[]
    connectOrCreate?: CategoriaCreateOrConnectWithoutCategoriaPaiInput | CategoriaCreateOrConnectWithoutCategoriaPaiInput[]
    upsert?: CategoriaUpsertWithWhereUniqueWithoutCategoriaPaiInput | CategoriaUpsertWithWhereUniqueWithoutCategoriaPaiInput[]
    createMany?: CategoriaCreateManyCategoriaPaiInputEnvelope
    set?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    disconnect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    delete?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    connect?: CategoriaWhereUniqueInput | CategoriaWhereUniqueInput[]
    update?: CategoriaUpdateWithWhereUniqueWithoutCategoriaPaiInput | CategoriaUpdateWithWhereUniqueWithoutCategoriaPaiInput[]
    updateMany?: CategoriaUpdateManyWithWhereWithoutCategoriaPaiInput | CategoriaUpdateManyWithWhereWithoutCategoriaPaiInput[]
    deleteMany?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[]
  }

  export type ProdutoUncheckedUpdateManyWithoutCategoriaNestedInput = {
    create?: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput> | ProdutoCreateWithoutCategoriaInput[] | ProdutoUncheckedCreateWithoutCategoriaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutCategoriaInput | ProdutoCreateOrConnectWithoutCategoriaInput[]
    upsert?: ProdutoUpsertWithWhereUniqueWithoutCategoriaInput | ProdutoUpsertWithWhereUniqueWithoutCategoriaInput[]
    createMany?: ProdutoCreateManyCategoriaInputEnvelope
    set?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    disconnect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    delete?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    update?: ProdutoUpdateWithWhereUniqueWithoutCategoriaInput | ProdutoUpdateWithWhereUniqueWithoutCategoriaInput[]
    updateMany?: ProdutoUpdateManyWithWhereWithoutCategoriaInput | ProdutoUpdateManyWithWhereWithoutCategoriaInput[]
    deleteMany?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
  }

  export type ProdutoCreateNestedManyWithoutMarcaInput = {
    create?: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput> | ProdutoCreateWithoutMarcaInput[] | ProdutoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutMarcaInput | ProdutoCreateOrConnectWithoutMarcaInput[]
    createMany?: ProdutoCreateManyMarcaInputEnvelope
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
  }

  export type ProdutoUncheckedCreateNestedManyWithoutMarcaInput = {
    create?: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput> | ProdutoCreateWithoutMarcaInput[] | ProdutoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutMarcaInput | ProdutoCreateOrConnectWithoutMarcaInput[]
    createMany?: ProdutoCreateManyMarcaInputEnvelope
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
  }

  export type ProdutoUpdateManyWithoutMarcaNestedInput = {
    create?: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput> | ProdutoCreateWithoutMarcaInput[] | ProdutoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutMarcaInput | ProdutoCreateOrConnectWithoutMarcaInput[]
    upsert?: ProdutoUpsertWithWhereUniqueWithoutMarcaInput | ProdutoUpsertWithWhereUniqueWithoutMarcaInput[]
    createMany?: ProdutoCreateManyMarcaInputEnvelope
    set?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    disconnect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    delete?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    update?: ProdutoUpdateWithWhereUniqueWithoutMarcaInput | ProdutoUpdateWithWhereUniqueWithoutMarcaInput[]
    updateMany?: ProdutoUpdateManyWithWhereWithoutMarcaInput | ProdutoUpdateManyWithWhereWithoutMarcaInput[]
    deleteMany?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
  }

  export type ProdutoUncheckedUpdateManyWithoutMarcaNestedInput = {
    create?: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput> | ProdutoCreateWithoutMarcaInput[] | ProdutoUncheckedCreateWithoutMarcaInput[]
    connectOrCreate?: ProdutoCreateOrConnectWithoutMarcaInput | ProdutoCreateOrConnectWithoutMarcaInput[]
    upsert?: ProdutoUpsertWithWhereUniqueWithoutMarcaInput | ProdutoUpsertWithWhereUniqueWithoutMarcaInput[]
    createMany?: ProdutoCreateManyMarcaInputEnvelope
    set?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    disconnect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    delete?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    connect?: ProdutoWhereUniqueInput | ProdutoWhereUniqueInput[]
    update?: ProdutoUpdateWithWhereUniqueWithoutMarcaInput | ProdutoUpdateWithWhereUniqueWithoutMarcaInput[]
    updateMany?: ProdutoUpdateManyWithWhereWithoutMarcaInput | ProdutoUpdateManyWithWhereWithoutMarcaInput[]
    deleteMany?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CategoriaCreateWithoutProdutosInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaPai?: CategoriaCreateNestedOneWithoutSubcategoriasInput
    subcategorias?: CategoriaCreateNestedManyWithoutCategoriaPaiInput
  }

  export type CategoriaUncheckedCreateWithoutProdutosInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    categoriaPaiId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    subcategorias?: CategoriaUncheckedCreateNestedManyWithoutCategoriaPaiInput
  }

  export type CategoriaCreateOrConnectWithoutProdutosInput = {
    where: CategoriaWhereUniqueInput
    create: XOR<CategoriaCreateWithoutProdutosInput, CategoriaUncheckedCreateWithoutProdutosInput>
  }

  export type MarcaCreateWithoutProdutosInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    logoUrl?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type MarcaUncheckedCreateWithoutProdutosInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    logoUrl?: string | null
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type MarcaCreateOrConnectWithoutProdutosInput = {
    where: MarcaWhereUniqueInput
    create: XOR<MarcaCreateWithoutProdutosInput, MarcaUncheckedCreateWithoutProdutosInput>
  }

  export type ImagemProdutoCreateWithoutProdutoInput = {
    id?: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
  }

  export type ImagemProdutoUncheckedCreateWithoutProdutoInput = {
    id?: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
  }

  export type ImagemProdutoCreateOrConnectWithoutProdutoInput = {
    where: ImagemProdutoWhereUniqueInput
    create: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput>
  }

  export type ImagemProdutoCreateManyProdutoInputEnvelope = {
    data: ImagemProdutoCreateManyProdutoInput | ImagemProdutoCreateManyProdutoInput[]
    skipDuplicates?: boolean
  }

  export type VariacaoProdutoCreateWithoutProdutoInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    atributos?: AtributoVariacaoCreateNestedManyWithoutVariacaoInput
    imagens?: ImagemVariacaoCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoUncheckedCreateWithoutProdutoInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    atributos?: AtributoVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
    imagens?: ImagemVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoCreateOrConnectWithoutProdutoInput = {
    where: VariacaoProdutoWhereUniqueInput
    create: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput>
  }

  export type VariacaoProdutoCreateManyProdutoInputEnvelope = {
    data: VariacaoProdutoCreateManyProdutoInput | VariacaoProdutoCreateManyProdutoInput[]
    skipDuplicates?: boolean
  }

  export type CategoriaUpsertWithoutProdutosInput = {
    update: XOR<CategoriaUpdateWithoutProdutosInput, CategoriaUncheckedUpdateWithoutProdutosInput>
    create: XOR<CategoriaCreateWithoutProdutosInput, CategoriaUncheckedCreateWithoutProdutosInput>
    where?: CategoriaWhereInput
  }

  export type CategoriaUpdateToOneWithWhereWithoutProdutosInput = {
    where?: CategoriaWhereInput
    data: XOR<CategoriaUpdateWithoutProdutosInput, CategoriaUncheckedUpdateWithoutProdutosInput>
  }

  export type CategoriaUpdateWithoutProdutosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaPai?: CategoriaUpdateOneWithoutSubcategoriasNestedInput
    subcategorias?: CategoriaUpdateManyWithoutCategoriaPaiNestedInput
  }

  export type CategoriaUncheckedUpdateWithoutProdutosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    categoriaPaiId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategorias?: CategoriaUncheckedUpdateManyWithoutCategoriaPaiNestedInput
  }

  export type MarcaUpsertWithoutProdutosInput = {
    update: XOR<MarcaUpdateWithoutProdutosInput, MarcaUncheckedUpdateWithoutProdutosInput>
    create: XOR<MarcaCreateWithoutProdutosInput, MarcaUncheckedCreateWithoutProdutosInput>
    where?: MarcaWhereInput
  }

  export type MarcaUpdateToOneWithWhereWithoutProdutosInput = {
    where?: MarcaWhereInput
    data: XOR<MarcaUpdateWithoutProdutosInput, MarcaUncheckedUpdateWithoutProdutosInput>
  }

  export type MarcaUpdateWithoutProdutosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarcaUncheckedUpdateWithoutProdutosInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagemProdutoUpsertWithWhereUniqueWithoutProdutoInput = {
    where: ImagemProdutoWhereUniqueInput
    update: XOR<ImagemProdutoUpdateWithoutProdutoInput, ImagemProdutoUncheckedUpdateWithoutProdutoInput>
    create: XOR<ImagemProdutoCreateWithoutProdutoInput, ImagemProdutoUncheckedCreateWithoutProdutoInput>
  }

  export type ImagemProdutoUpdateWithWhereUniqueWithoutProdutoInput = {
    where: ImagemProdutoWhereUniqueInput
    data: XOR<ImagemProdutoUpdateWithoutProdutoInput, ImagemProdutoUncheckedUpdateWithoutProdutoInput>
  }

  export type ImagemProdutoUpdateManyWithWhereWithoutProdutoInput = {
    where: ImagemProdutoScalarWhereInput
    data: XOR<ImagemProdutoUpdateManyMutationInput, ImagemProdutoUncheckedUpdateManyWithoutProdutoInput>
  }

  export type ImagemProdutoScalarWhereInput = {
    AND?: ImagemProdutoScalarWhereInput | ImagemProdutoScalarWhereInput[]
    OR?: ImagemProdutoScalarWhereInput[]
    NOT?: ImagemProdutoScalarWhereInput | ImagemProdutoScalarWhereInput[]
    id?: UuidFilter<"ImagemProduto"> | string
    produtoId?: UuidFilter<"ImagemProduto"> | string
    url?: StringFilter<"ImagemProduto"> | string
    urlMiniatura?: StringNullableFilter<"ImagemProduto"> | string | null
    altText?: StringNullableFilter<"ImagemProduto"> | string | null
    ordem?: IntFilter<"ImagemProduto"> | number
    principal?: BoolFilter<"ImagemProduto"> | boolean
    criadoEm?: DateTimeFilter<"ImagemProduto"> | Date | string
  }

  export type VariacaoProdutoUpsertWithWhereUniqueWithoutProdutoInput = {
    where: VariacaoProdutoWhereUniqueInput
    update: XOR<VariacaoProdutoUpdateWithoutProdutoInput, VariacaoProdutoUncheckedUpdateWithoutProdutoInput>
    create: XOR<VariacaoProdutoCreateWithoutProdutoInput, VariacaoProdutoUncheckedCreateWithoutProdutoInput>
  }

  export type VariacaoProdutoUpdateWithWhereUniqueWithoutProdutoInput = {
    where: VariacaoProdutoWhereUniqueInput
    data: XOR<VariacaoProdutoUpdateWithoutProdutoInput, VariacaoProdutoUncheckedUpdateWithoutProdutoInput>
  }

  export type VariacaoProdutoUpdateManyWithWhereWithoutProdutoInput = {
    where: VariacaoProdutoScalarWhereInput
    data: XOR<VariacaoProdutoUpdateManyMutationInput, VariacaoProdutoUncheckedUpdateManyWithoutProdutoInput>
  }

  export type VariacaoProdutoScalarWhereInput = {
    AND?: VariacaoProdutoScalarWhereInput | VariacaoProdutoScalarWhereInput[]
    OR?: VariacaoProdutoScalarWhereInput[]
    NOT?: VariacaoProdutoScalarWhereInput | VariacaoProdutoScalarWhereInput[]
    id?: UuidFilter<"VariacaoProduto"> | string
    produtoId?: UuidFilter<"VariacaoProduto"> | string
    sku?: StringFilter<"VariacaoProduto"> | string
    gtin?: StringNullableFilter<"VariacaoProduto"> | string | null
    nome?: StringFilter<"VariacaoProduto"> | string
    precoVenda?: IntNullableFilter<"VariacaoProduto"> | number | null
    peso?: IntNullableFilter<"VariacaoProduto"> | number | null
    criadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
    atualizadoEm?: DateTimeFilter<"VariacaoProduto"> | Date | string
  }

  export type ProdutoCreateWithoutImagensInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoria: CategoriaCreateNestedOneWithoutProdutosInput
    marca?: MarcaCreateNestedOneWithoutProdutosInput
    variacoes?: VariacaoProdutoCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUncheckedCreateWithoutImagensInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
    marcaId?: string | null
    variacoes?: VariacaoProdutoUncheckedCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoCreateOrConnectWithoutImagensInput = {
    where: ProdutoWhereUniqueInput
    create: XOR<ProdutoCreateWithoutImagensInput, ProdutoUncheckedCreateWithoutImagensInput>
  }

  export type ProdutoUpsertWithoutImagensInput = {
    update: XOR<ProdutoUpdateWithoutImagensInput, ProdutoUncheckedUpdateWithoutImagensInput>
    create: XOR<ProdutoCreateWithoutImagensInput, ProdutoUncheckedCreateWithoutImagensInput>
    where?: ProdutoWhereInput
  }

  export type ProdutoUpdateToOneWithWhereWithoutImagensInput = {
    where?: ProdutoWhereInput
    data: XOR<ProdutoUpdateWithoutImagensInput, ProdutoUncheckedUpdateWithoutImagensInput>
  }

  export type ProdutoUpdateWithoutImagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoria?: CategoriaUpdateOneRequiredWithoutProdutosNestedInput
    marca?: MarcaUpdateOneWithoutProdutosNestedInput
    variacoes?: VariacaoProdutoUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateWithoutImagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
    variacoes?: VariacaoProdutoUncheckedUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoCreateWithoutVariacoesInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoria: CategoriaCreateNestedOneWithoutProdutosInput
    marca?: MarcaCreateNestedOneWithoutProdutosInput
    imagens?: ImagemProdutoCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUncheckedCreateWithoutVariacoesInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
    marcaId?: string | null
    imagens?: ImagemProdutoUncheckedCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoCreateOrConnectWithoutVariacoesInput = {
    where: ProdutoWhereUniqueInput
    create: XOR<ProdutoCreateWithoutVariacoesInput, ProdutoUncheckedCreateWithoutVariacoesInput>
  }

  export type AtributoVariacaoCreateWithoutVariacaoInput = {
    id?: string
    nome: string
    valor: string
  }

  export type AtributoVariacaoUncheckedCreateWithoutVariacaoInput = {
    id?: string
    nome: string
    valor: string
  }

  export type AtributoVariacaoCreateOrConnectWithoutVariacaoInput = {
    where: AtributoVariacaoWhereUniqueInput
    create: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput>
  }

  export type AtributoVariacaoCreateManyVariacaoInputEnvelope = {
    data: AtributoVariacaoCreateManyVariacaoInput | AtributoVariacaoCreateManyVariacaoInput[]
    skipDuplicates?: boolean
  }

  export type ImagemVariacaoCreateWithoutVariacaoInput = {
    id?: string
    url: string
    ordem?: number
  }

  export type ImagemVariacaoUncheckedCreateWithoutVariacaoInput = {
    id?: string
    url: string
    ordem?: number
  }

  export type ImagemVariacaoCreateOrConnectWithoutVariacaoInput = {
    where: ImagemVariacaoWhereUniqueInput
    create: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput>
  }

  export type ImagemVariacaoCreateManyVariacaoInputEnvelope = {
    data: ImagemVariacaoCreateManyVariacaoInput | ImagemVariacaoCreateManyVariacaoInput[]
    skipDuplicates?: boolean
  }

  export type ProdutoUpsertWithoutVariacoesInput = {
    update: XOR<ProdutoUpdateWithoutVariacoesInput, ProdutoUncheckedUpdateWithoutVariacoesInput>
    create: XOR<ProdutoCreateWithoutVariacoesInput, ProdutoUncheckedCreateWithoutVariacoesInput>
    where?: ProdutoWhereInput
  }

  export type ProdutoUpdateToOneWithWhereWithoutVariacoesInput = {
    where?: ProdutoWhereInput
    data: XOR<ProdutoUpdateWithoutVariacoesInput, ProdutoUncheckedUpdateWithoutVariacoesInput>
  }

  export type ProdutoUpdateWithoutVariacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoria?: CategoriaUpdateOneRequiredWithoutProdutosNestedInput
    marca?: MarcaUpdateOneWithoutProdutosNestedInput
    imagens?: ImagemProdutoUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateWithoutVariacoesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
    imagens?: ImagemProdutoUncheckedUpdateManyWithoutProdutoNestedInput
  }

  export type AtributoVariacaoUpsertWithWhereUniqueWithoutVariacaoInput = {
    where: AtributoVariacaoWhereUniqueInput
    update: XOR<AtributoVariacaoUpdateWithoutVariacaoInput, AtributoVariacaoUncheckedUpdateWithoutVariacaoInput>
    create: XOR<AtributoVariacaoCreateWithoutVariacaoInput, AtributoVariacaoUncheckedCreateWithoutVariacaoInput>
  }

  export type AtributoVariacaoUpdateWithWhereUniqueWithoutVariacaoInput = {
    where: AtributoVariacaoWhereUniqueInput
    data: XOR<AtributoVariacaoUpdateWithoutVariacaoInput, AtributoVariacaoUncheckedUpdateWithoutVariacaoInput>
  }

  export type AtributoVariacaoUpdateManyWithWhereWithoutVariacaoInput = {
    where: AtributoVariacaoScalarWhereInput
    data: XOR<AtributoVariacaoUpdateManyMutationInput, AtributoVariacaoUncheckedUpdateManyWithoutVariacaoInput>
  }

  export type AtributoVariacaoScalarWhereInput = {
    AND?: AtributoVariacaoScalarWhereInput | AtributoVariacaoScalarWhereInput[]
    OR?: AtributoVariacaoScalarWhereInput[]
    NOT?: AtributoVariacaoScalarWhereInput | AtributoVariacaoScalarWhereInput[]
    id?: UuidFilter<"AtributoVariacao"> | string
    variacaoId?: UuidFilter<"AtributoVariacao"> | string
    nome?: StringFilter<"AtributoVariacao"> | string
    valor?: StringFilter<"AtributoVariacao"> | string
  }

  export type ImagemVariacaoUpsertWithWhereUniqueWithoutVariacaoInput = {
    where: ImagemVariacaoWhereUniqueInput
    update: XOR<ImagemVariacaoUpdateWithoutVariacaoInput, ImagemVariacaoUncheckedUpdateWithoutVariacaoInput>
    create: XOR<ImagemVariacaoCreateWithoutVariacaoInput, ImagemVariacaoUncheckedCreateWithoutVariacaoInput>
  }

  export type ImagemVariacaoUpdateWithWhereUniqueWithoutVariacaoInput = {
    where: ImagemVariacaoWhereUniqueInput
    data: XOR<ImagemVariacaoUpdateWithoutVariacaoInput, ImagemVariacaoUncheckedUpdateWithoutVariacaoInput>
  }

  export type ImagemVariacaoUpdateManyWithWhereWithoutVariacaoInput = {
    where: ImagemVariacaoScalarWhereInput
    data: XOR<ImagemVariacaoUpdateManyMutationInput, ImagemVariacaoUncheckedUpdateManyWithoutVariacaoInput>
  }

  export type ImagemVariacaoScalarWhereInput = {
    AND?: ImagemVariacaoScalarWhereInput | ImagemVariacaoScalarWhereInput[]
    OR?: ImagemVariacaoScalarWhereInput[]
    NOT?: ImagemVariacaoScalarWhereInput | ImagemVariacaoScalarWhereInput[]
    id?: UuidFilter<"ImagemVariacao"> | string
    variacaoId?: UuidFilter<"ImagemVariacao"> | string
    url?: StringFilter<"ImagemVariacao"> | string
    ordem?: IntFilter<"ImagemVariacao"> | number
  }

  export type VariacaoProdutoCreateWithoutAtributosInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produto: ProdutoCreateNestedOneWithoutVariacoesInput
    imagens?: ImagemVariacaoCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoUncheckedCreateWithoutAtributosInput = {
    id?: string
    produtoId: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    imagens?: ImagemVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoCreateOrConnectWithoutAtributosInput = {
    where: VariacaoProdutoWhereUniqueInput
    create: XOR<VariacaoProdutoCreateWithoutAtributosInput, VariacaoProdutoUncheckedCreateWithoutAtributosInput>
  }

  export type VariacaoProdutoUpsertWithoutAtributosInput = {
    update: XOR<VariacaoProdutoUpdateWithoutAtributosInput, VariacaoProdutoUncheckedUpdateWithoutAtributosInput>
    create: XOR<VariacaoProdutoCreateWithoutAtributosInput, VariacaoProdutoUncheckedCreateWithoutAtributosInput>
    where?: VariacaoProdutoWhereInput
  }

  export type VariacaoProdutoUpdateToOneWithWhereWithoutAtributosInput = {
    where?: VariacaoProdutoWhereInput
    data: XOR<VariacaoProdutoUpdateWithoutAtributosInput, VariacaoProdutoUncheckedUpdateWithoutAtributosInput>
  }

  export type VariacaoProdutoUpdateWithoutAtributosInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produto?: ProdutoUpdateOneRequiredWithoutVariacoesNestedInput
    imagens?: ImagemVariacaoUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoUncheckedUpdateWithoutAtributosInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    imagens?: ImagemVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoCreateWithoutImagensInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produto: ProdutoCreateNestedOneWithoutVariacoesInput
    atributos?: AtributoVariacaoCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoUncheckedCreateWithoutImagensInput = {
    id?: string
    produtoId: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    atributos?: AtributoVariacaoUncheckedCreateNestedManyWithoutVariacaoInput
  }

  export type VariacaoProdutoCreateOrConnectWithoutImagensInput = {
    where: VariacaoProdutoWhereUniqueInput
    create: XOR<VariacaoProdutoCreateWithoutImagensInput, VariacaoProdutoUncheckedCreateWithoutImagensInput>
  }

  export type VariacaoProdutoUpsertWithoutImagensInput = {
    update: XOR<VariacaoProdutoUpdateWithoutImagensInput, VariacaoProdutoUncheckedUpdateWithoutImagensInput>
    create: XOR<VariacaoProdutoCreateWithoutImagensInput, VariacaoProdutoUncheckedCreateWithoutImagensInput>
    where?: VariacaoProdutoWhereInput
  }

  export type VariacaoProdutoUpdateToOneWithWhereWithoutImagensInput = {
    where?: VariacaoProdutoWhereInput
    data: XOR<VariacaoProdutoUpdateWithoutImagensInput, VariacaoProdutoUncheckedUpdateWithoutImagensInput>
  }

  export type VariacaoProdutoUpdateWithoutImagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produto?: ProdutoUpdateOneRequiredWithoutVariacoesNestedInput
    atributos?: AtributoVariacaoUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoUncheckedUpdateWithoutImagensInput = {
    id?: StringFieldUpdateOperationsInput | string
    produtoId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atributos?: AtributoVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
  }

  export type CategoriaCreateWithoutSubcategoriasInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaPai?: CategoriaCreateNestedOneWithoutSubcategoriasInput
    produtos?: ProdutoCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUncheckedCreateWithoutSubcategoriasInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    categoriaPaiId?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    produtos?: ProdutoUncheckedCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaCreateOrConnectWithoutSubcategoriasInput = {
    where: CategoriaWhereUniqueInput
    create: XOR<CategoriaCreateWithoutSubcategoriasInput, CategoriaUncheckedCreateWithoutSubcategoriasInput>
  }

  export type CategoriaCreateWithoutCategoriaPaiInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    subcategorias?: CategoriaCreateNestedManyWithoutCategoriaPaiInput
    produtos?: ProdutoCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaUncheckedCreateWithoutCategoriaPaiInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    subcategorias?: CategoriaUncheckedCreateNestedManyWithoutCategoriaPaiInput
    produtos?: ProdutoUncheckedCreateNestedManyWithoutCategoriaInput
  }

  export type CategoriaCreateOrConnectWithoutCategoriaPaiInput = {
    where: CategoriaWhereUniqueInput
    create: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput>
  }

  export type CategoriaCreateManyCategoriaPaiInputEnvelope = {
    data: CategoriaCreateManyCategoriaPaiInput | CategoriaCreateManyCategoriaPaiInput[]
    skipDuplicates?: boolean
  }

  export type ProdutoCreateWithoutCategoriaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    marca?: MarcaCreateNestedOneWithoutProdutosInput
    imagens?: ImagemProdutoCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUncheckedCreateWithoutCategoriaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    marcaId?: string | null
    imagens?: ImagemProdutoUncheckedCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoUncheckedCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoCreateOrConnectWithoutCategoriaInput = {
    where: ProdutoWhereUniqueInput
    create: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput>
  }

  export type ProdutoCreateManyCategoriaInputEnvelope = {
    data: ProdutoCreateManyCategoriaInput | ProdutoCreateManyCategoriaInput[]
    skipDuplicates?: boolean
  }

  export type CategoriaUpsertWithoutSubcategoriasInput = {
    update: XOR<CategoriaUpdateWithoutSubcategoriasInput, CategoriaUncheckedUpdateWithoutSubcategoriasInput>
    create: XOR<CategoriaCreateWithoutSubcategoriasInput, CategoriaUncheckedCreateWithoutSubcategoriasInput>
    where?: CategoriaWhereInput
  }

  export type CategoriaUpdateToOneWithWhereWithoutSubcategoriasInput = {
    where?: CategoriaWhereInput
    data: XOR<CategoriaUpdateWithoutSubcategoriasInput, CategoriaUncheckedUpdateWithoutSubcategoriasInput>
  }

  export type CategoriaUpdateWithoutSubcategoriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaPai?: CategoriaUpdateOneWithoutSubcategoriasNestedInput
    produtos?: ProdutoUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUncheckedUpdateWithoutSubcategoriasInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    categoriaPaiId?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    produtos?: ProdutoUncheckedUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUpsertWithWhereUniqueWithoutCategoriaPaiInput = {
    where: CategoriaWhereUniqueInput
    update: XOR<CategoriaUpdateWithoutCategoriaPaiInput, CategoriaUncheckedUpdateWithoutCategoriaPaiInput>
    create: XOR<CategoriaCreateWithoutCategoriaPaiInput, CategoriaUncheckedCreateWithoutCategoriaPaiInput>
  }

  export type CategoriaUpdateWithWhereUniqueWithoutCategoriaPaiInput = {
    where: CategoriaWhereUniqueInput
    data: XOR<CategoriaUpdateWithoutCategoriaPaiInput, CategoriaUncheckedUpdateWithoutCategoriaPaiInput>
  }

  export type CategoriaUpdateManyWithWhereWithoutCategoriaPaiInput = {
    where: CategoriaScalarWhereInput
    data: XOR<CategoriaUpdateManyMutationInput, CategoriaUncheckedUpdateManyWithoutCategoriaPaiInput>
  }

  export type CategoriaScalarWhereInput = {
    AND?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[]
    OR?: CategoriaScalarWhereInput[]
    NOT?: CategoriaScalarWhereInput | CategoriaScalarWhereInput[]
    id?: UuidFilter<"Categoria"> | string
    tenantId?: UuidFilter<"Categoria"> | string
    nome?: StringFilter<"Categoria"> | string
    slug?: StringFilter<"Categoria"> | string
    nivel?: IntFilter<"Categoria"> | number
    ativa?: BoolFilter<"Categoria"> | boolean
    categoriaPaiId?: UuidNullableFilter<"Categoria"> | string | null
    criadoEm?: DateTimeFilter<"Categoria"> | Date | string
    atualizadoEm?: DateTimeFilter<"Categoria"> | Date | string
  }

  export type ProdutoUpsertWithWhereUniqueWithoutCategoriaInput = {
    where: ProdutoWhereUniqueInput
    update: XOR<ProdutoUpdateWithoutCategoriaInput, ProdutoUncheckedUpdateWithoutCategoriaInput>
    create: XOR<ProdutoCreateWithoutCategoriaInput, ProdutoUncheckedCreateWithoutCategoriaInput>
  }

  export type ProdutoUpdateWithWhereUniqueWithoutCategoriaInput = {
    where: ProdutoWhereUniqueInput
    data: XOR<ProdutoUpdateWithoutCategoriaInput, ProdutoUncheckedUpdateWithoutCategoriaInput>
  }

  export type ProdutoUpdateManyWithWhereWithoutCategoriaInput = {
    where: ProdutoScalarWhereInput
    data: XOR<ProdutoUpdateManyMutationInput, ProdutoUncheckedUpdateManyWithoutCategoriaInput>
  }

  export type ProdutoScalarWhereInput = {
    AND?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
    OR?: ProdutoScalarWhereInput[]
    NOT?: ProdutoScalarWhereInput | ProdutoScalarWhereInput[]
    id?: UuidFilter<"Produto"> | string
    tenantId?: UuidFilter<"Produto"> | string
    sku?: StringFilter<"Produto"> | string
    gtin?: StringNullableFilter<"Produto"> | string | null
    nome?: StringFilter<"Produto"> | string
    descricao?: StringFilter<"Produto"> | string
    descricaoCurta?: StringNullableFilter<"Produto"> | string | null
    status?: StringFilter<"Produto"> | string
    ncm?: StringFilter<"Produto"> | string
    cest?: StringNullableFilter<"Produto"> | string | null
    origem?: IntFilter<"Produto"> | number
    precoCusto?: IntFilter<"Produto"> | number
    precoVenda?: IntFilter<"Produto"> | number
    precoPromocional?: IntNullableFilter<"Produto"> | number | null
    peso?: IntFilter<"Produto"> | number
    altura?: FloatFilter<"Produto"> | number
    largura?: FloatFilter<"Produto"> | number
    comprimento?: FloatFilter<"Produto"> | number
    tags?: StringNullableListFilter<"Produto">
    metaTitulo?: StringNullableFilter<"Produto"> | string | null
    metaDescricao?: StringNullableFilter<"Produto"> | string | null
    criadoEm?: DateTimeFilter<"Produto"> | Date | string
    atualizadoEm?: DateTimeFilter<"Produto"> | Date | string
    categoriaId?: UuidFilter<"Produto"> | string
    marcaId?: UuidNullableFilter<"Produto"> | string | null
  }

  export type ProdutoCreateWithoutMarcaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoria: CategoriaCreateNestedOneWithoutProdutosInput
    imagens?: ImagemProdutoCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoUncheckedCreateWithoutMarcaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
    imagens?: ImagemProdutoUncheckedCreateNestedManyWithoutProdutoInput
    variacoes?: VariacaoProdutoUncheckedCreateNestedManyWithoutProdutoInput
  }

  export type ProdutoCreateOrConnectWithoutMarcaInput = {
    where: ProdutoWhereUniqueInput
    create: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput>
  }

  export type ProdutoCreateManyMarcaInputEnvelope = {
    data: ProdutoCreateManyMarcaInput | ProdutoCreateManyMarcaInput[]
    skipDuplicates?: boolean
  }

  export type ProdutoUpsertWithWhereUniqueWithoutMarcaInput = {
    where: ProdutoWhereUniqueInput
    update: XOR<ProdutoUpdateWithoutMarcaInput, ProdutoUncheckedUpdateWithoutMarcaInput>
    create: XOR<ProdutoCreateWithoutMarcaInput, ProdutoUncheckedCreateWithoutMarcaInput>
  }

  export type ProdutoUpdateWithWhereUniqueWithoutMarcaInput = {
    where: ProdutoWhereUniqueInput
    data: XOR<ProdutoUpdateWithoutMarcaInput, ProdutoUncheckedUpdateWithoutMarcaInput>
  }

  export type ProdutoUpdateManyWithWhereWithoutMarcaInput = {
    where: ProdutoScalarWhereInput
    data: XOR<ProdutoUpdateManyMutationInput, ProdutoUncheckedUpdateManyWithoutMarcaInput>
  }

  export type ImagemProdutoCreateManyProdutoInput = {
    id?: string
    url: string
    urlMiniatura?: string | null
    altText?: string | null
    ordem?: number
    principal?: boolean
    criadoEm?: Date | string
  }

  export type VariacaoProdutoCreateManyProdutoInput = {
    id?: string
    sku: string
    gtin?: string | null
    nome: string
    precoVenda?: number | null
    peso?: number | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ImagemProdutoUpdateWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagemProdutoUncheckedUpdateWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImagemProdutoUncheckedUpdateManyWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    urlMiniatura?: NullableStringFieldUpdateOperationsInput | string | null
    altText?: NullableStringFieldUpdateOperationsInput | string | null
    ordem?: IntFieldUpdateOperationsInput | number
    principal?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VariacaoProdutoUpdateWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atributos?: AtributoVariacaoUpdateManyWithoutVariacaoNestedInput
    imagens?: ImagemVariacaoUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoUncheckedUpdateWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atributos?: AtributoVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
    imagens?: ImagemVariacaoUncheckedUpdateManyWithoutVariacaoNestedInput
  }

  export type VariacaoProdutoUncheckedUpdateManyWithoutProdutoInput = {
    id?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    precoVenda?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: NullableIntFieldUpdateOperationsInput | number | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AtributoVariacaoCreateManyVariacaoInput = {
    id?: string
    nome: string
    valor: string
  }

  export type ImagemVariacaoCreateManyVariacaoInput = {
    id?: string
    url: string
    ordem?: number
  }

  export type AtributoVariacaoUpdateWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type AtributoVariacaoUncheckedUpdateWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type AtributoVariacaoUncheckedUpdateManyWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
  }

  export type ImagemVariacaoUpdateWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type ImagemVariacaoUncheckedUpdateWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type ImagemVariacaoUncheckedUpdateManyWithoutVariacaoInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
  }

  export type CategoriaCreateManyCategoriaPaiInput = {
    id?: string
    tenantId: string
    nome: string
    slug: string
    nivel?: number
    ativa?: boolean
    criadoEm?: Date | string
    atualizadoEm?: Date | string
  }

  export type ProdutoCreateManyCategoriaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    marcaId?: string | null
  }

  export type CategoriaUpdateWithoutCategoriaPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategorias?: CategoriaUpdateManyWithoutCategoriaPaiNestedInput
    produtos?: ProdutoUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUncheckedUpdateWithoutCategoriaPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategorias?: CategoriaUncheckedUpdateManyWithoutCategoriaPaiNestedInput
    produtos?: ProdutoUncheckedUpdateManyWithoutCategoriaNestedInput
  }

  export type CategoriaUncheckedUpdateManyWithoutCategoriaPaiInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    nivel?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProdutoUpdateWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    marca?: MarcaUpdateOneWithoutProdutosNestedInput
    imagens?: ImagemProdutoUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
    imagens?: ImagemProdutoUncheckedUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUncheckedUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateManyWithoutCategoriaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    marcaId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProdutoCreateManyMarcaInput = {
    id?: string
    tenantId: string
    sku: string
    gtin?: string | null
    nome: string
    descricao: string
    descricaoCurta?: string | null
    status?: string
    ncm: string
    cest?: string | null
    origem?: number
    precoCusto: number
    precoVenda: number
    precoPromocional?: number | null
    peso: number
    altura: number
    largura: number
    comprimento: number
    tags?: ProdutoCreatetagsInput | string[]
    metaTitulo?: string | null
    metaDescricao?: string | null
    criadoEm?: Date | string
    atualizadoEm?: Date | string
    categoriaId: string
  }

  export type ProdutoUpdateWithoutMarcaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoria?: CategoriaUpdateOneRequiredWithoutProdutosNestedInput
    imagens?: ImagemProdutoUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateWithoutMarcaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
    imagens?: ImagemProdutoUncheckedUpdateManyWithoutProdutoNestedInput
    variacoes?: VariacaoProdutoUncheckedUpdateManyWithoutProdutoNestedInput
  }

  export type ProdutoUncheckedUpdateManyWithoutMarcaInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    sku?: StringFieldUpdateOperationsInput | string
    gtin?: NullableStringFieldUpdateOperationsInput | string | null
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: StringFieldUpdateOperationsInput | string
    descricaoCurta?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    ncm?: StringFieldUpdateOperationsInput | string
    cest?: NullableStringFieldUpdateOperationsInput | string | null
    origem?: IntFieldUpdateOperationsInput | number
    precoCusto?: IntFieldUpdateOperationsInput | number
    precoVenda?: IntFieldUpdateOperationsInput | number
    precoPromocional?: NullableIntFieldUpdateOperationsInput | number | null
    peso?: IntFieldUpdateOperationsInput | number
    altura?: FloatFieldUpdateOperationsInput | number
    largura?: FloatFieldUpdateOperationsInput | number
    comprimento?: FloatFieldUpdateOperationsInput | number
    tags?: ProdutoUpdatetagsInput | string[]
    metaTitulo?: NullableStringFieldUpdateOperationsInput | string | null
    metaDescricao?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    categoriaId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ProdutoCountOutputTypeDefaultArgs instead
     */
    export type ProdutoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProdutoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VariacaoProdutoCountOutputTypeDefaultArgs instead
     */
    export type VariacaoProdutoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VariacaoProdutoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoriaCountOutputTypeDefaultArgs instead
     */
    export type CategoriaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoriaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MarcaCountOutputTypeDefaultArgs instead
     */
    export type MarcaCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MarcaCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProdutoDefaultArgs instead
     */
    export type ProdutoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProdutoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImagemProdutoDefaultArgs instead
     */
    export type ImagemProdutoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImagemProdutoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VariacaoProdutoDefaultArgs instead
     */
    export type VariacaoProdutoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VariacaoProdutoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AtributoVariacaoDefaultArgs instead
     */
    export type AtributoVariacaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AtributoVariacaoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImagemVariacaoDefaultArgs instead
     */
    export type ImagemVariacaoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImagemVariacaoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoriaDefaultArgs instead
     */
    export type CategoriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoriaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MarcaDefaultArgs instead
     */
    export type MarcaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MarcaDefaultArgs<ExtArgs>

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