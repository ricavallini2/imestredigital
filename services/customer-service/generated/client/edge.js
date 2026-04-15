
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
} = require('./runtime/edge.js')


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





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ClienteScalarFieldEnum = {
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

exports.Prisma.EnderecoClienteScalarFieldEnum = {
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

exports.Prisma.ContatoClienteScalarFieldEnum = {
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

exports.Prisma.InteracaoClienteScalarFieldEnum = {
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

exports.Prisma.SegmentoClienteScalarFieldEnum = {
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

exports.Prisma.ClienteSegmentoScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  segmentoId: 'segmentoId',
  adicionadoEm: 'adicionadoEm'
};

exports.Prisma.ImportacaoClienteScalarFieldEnum = {
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
exports.TipoCliente = exports.$Enums.TipoCliente = {
  PESSOA_FISICA: 'PESSOA_FISICA',
  PESSOA_JURIDICA: 'PESSOA_JURIDICA'
};

exports.StatusCliente = exports.$Enums.StatusCliente = {
  PROSPECT: 'PROSPECT',
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  BLOQUEADO: 'BLOQUEADO'
};

exports.OrigemCliente = exports.$Enums.OrigemCliente = {
  MANUAL: 'MANUAL',
  MARKETPLACE: 'MARKETPLACE',
  SITE: 'SITE',
  INDICACAO: 'INDICACAO',
  IMPORTACAO: 'IMPORTACAO'
};

exports.TipoEndereco = exports.$Enums.TipoEndereco = {
  ENTREGA: 'ENTREGA',
  COBRANCA: 'COBRANCA',
  AMBOS: 'AMBOS'
};

exports.TipoInteracao = exports.$Enums.TipoInteracao = {
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

exports.CanalInteracao = exports.$Enums.CanalInteracao = {
  TELEFONE: 'TELEFONE',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  CHAT: 'CHAT',
  PRESENCIAL: 'PRESENCIAL',
  MARKETPLACE: 'MARKETPLACE'
};

exports.FormatoImportacao = exports.$Enums.FormatoImportacao = {
  CSV: 'CSV',
  XLSX: 'XLSX'
};

exports.StatusImportacao = exports.$Enums.StatusImportacao = {
  PENDENTE: 'PENDENTE',
  PROCESSANDO: 'PROCESSANDO',
  CONCLUIDO: 'CONCLUIDO',
  ERRO: 'ERRO'
};

exports.Prisma.ModelName = {
  Cliente: 'Cliente',
  EnderecoCliente: 'EnderecoCliente',
  ContatoCliente: 'ContatoCliente',
  InteracaoCliente: 'InteracaoCliente',
  SegmentoCliente: 'SegmentoCliente',
  ClienteSegmento: 'ClienteSegmento',
  ImportacaoCliente: 'ImportacaoCliente'
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
      "value": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\customer-service\\generated\\client",
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
    "sourceFilePath": "C:\\Users\\ricav\\Documents\\Claude\\Projects\\Saas - ERP IA\\services\\customer-service\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../.env",
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
  "inlineSchema": "// ═══════════════════════════════════════════════════════════════\n// iMestreDigital - Customer Service (CRM) - Schema Prisma\n// ═══════════════════════════════════════════════════════════════\n// Modelos de dados para gerenciamento de clientes, contatos,\n// endereços, histórico de interações e segmentação de clientes.\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../generated/client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Cliente - Registro principal de cliente (pessoa física ou jurídica)\n// Armazena informações essenciais do cliente com multi-tenancy.\n// Pode ser do tipo PESSOA_FISICA (cpf, dataNascimento, genero) ou\n// PESSOA_JURIDICA (cnpj, razaoSocial, inscrição estadual).\nmodel Cliente {\n  id       String @id @default(cuid())\n  tenantId String // ID da empresa/tenant\n\n  // Tipo de cliente\n  tipo TipoCliente // PESSOA_FISICA ou PESSOA_JURIDICA\n\n  // Dados básicos\n  nome         String // Nome da pessoa ou fantasia\n  nomeFantasia String? // Nome fantasia (opcional para PJ)\n  razaoSocial  String? // Razão social (apenas PJ)\n\n  // Documentos\n  cpf               String? // CPF (apenas PF), sem formatação\n  cnpj              String? // CNPJ (apenas PJ), sem formatação\n  inscricaoEstadual String? // Inscrição estadual (PJ)\n\n  // Contato\n  email           String // Email principal (único por tenant+email)\n  emailSecundario String? // Email secundário\n  telefone        String? // Telefone comercial\n  celular         String? // Celular/WhatsApp\n\n  // Dados pessoais (apenas PF)\n  dataNascimento DateTime? // Data de nascimento\n  genero         String? // M/F/O\n\n  // Observações e categorização\n  observacoes String? // Notas internas\n  tags        String[] // Categorias/tags do cliente\n\n  // Scoring e status\n  score  Int           @default(0) // Pontuação do cliente\n  status StatusCliente @default(PROSPECT) // Ativo, inativo, bloqueado, prospect\n  origem OrigemCliente @default(MANUAL) // Como foi criado\n\n  // Histórico de vendas\n  ultimaCompra      DateTime? // Data da última compra\n  totalCompras      Int       @default(0) // Total de pedidos\n  valorTotalCompras Int       @default(0) // Valor total em centavos\n\n  // Relacionamentos\n  enderecos  EnderecoCliente[]\n  contatos   ContatoCliente[]\n  interacoes InteracaoCliente[]\n  segmentos  ClienteSegmento[]\n\n  // Auditoria\n  criadoEm     DateTime @default(now())\n  atualizadoEm DateTime @updatedAt\n\n  // Índices\n  @@unique([tenantId, cpf], map: \"uk_cliente_tenant_cpf\") // CPF único por tenant\n  @@unique([tenantId, cnpj], map: \"uk_cliente_tenant_cnpj\") // CNPJ único por tenant\n  @@unique([tenantId, email], map: \"uk_cliente_tenant_email\") // Email único por tenant\n  @@index([tenantId])\n  @@index([tenantId, status])\n  @@index([tenantId, origem])\n  @@index([tenantId, criadoEm])\n}\n\n// EnderecoCliente - Endereço de entrega ou cobrança do cliente\n// Um cliente pode ter múltiplos endereços marcados como\n// padrão, entrega ou cobrança.\nmodel EnderecoCliente {\n  id       String @id @default(cuid())\n  tenantId String\n\n  // Relacionamento com cliente\n  clienteId String\n  cliente   Cliente @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  // Tipo de endereço\n  tipo TipoEndereco // ENTREGA, COBRANCA ou AMBOS\n\n  // Dados do endereço\n  logradouro  String // Rua, avenida, etc\n  numero      String // Número do imóvel\n  complemento String? // Complemento (apto, sala, etc)\n  bairro      String // Bairro\n  cidade      String // Cidade\n  estado      String  @db.Char(2) // UF (SP, RJ, etc)\n  cep         String  @db.Char(8) // CEP sem formatação\n  pais        String  @default(\"BR\") // País (padrão Brasil)\n\n  // Padrão\n  padrao Boolean @default(false) // Endereço padrão\n\n  // Auditoria\n  criadoEm DateTime @default(now())\n\n  @@index([tenantId, clienteId])\n}\n\n// ContatoCliente - Contatos adicionais do cliente\n// Permite armazenar múltiplos pontos de contato (pessoas específicas)\n// dentro da empresa do cliente.\nmodel ContatoCliente {\n  id       String @id @default(cuid())\n  tenantId String\n\n  // Relacionamento com cliente\n  clienteId String\n  cliente   Cliente @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  // Dados do contato\n  nome     String // Nome do contato\n  cargo    String? // Cargo na empresa\n  email    String? // Email do contato\n  telefone String? // Telefone\n  celular  String? // Celular/WhatsApp\n\n  // Marcação\n  principal   Boolean @default(false) // Contato principal\n  observacoes String? // Notas sobre este contato\n\n  // Auditoria\n  criadoEm DateTime @default(now())\n\n  @@index([tenantId, clienteId])\n}\n\n// InteracaoCliente - Histórico de interações com o cliente\n// Registra todas as interações: vendas, atendimentos, reclamações,\n// devoluções, emails, mensagens, etc.\nmodel InteracaoCliente {\n  id       String @id @default(cuid())\n  tenantId String\n\n  // Relacionamento com cliente\n  clienteId String\n  cliente   Cliente @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  // Tipo e canal\n  tipo  TipoInteracao // VENDA, ATENDIMENTO, RECLAMACAO, DEVOLUCAO, EMAIL, TELEFONE, CHAT, MARKETPLACE, NOTA\n  canal CanalInteracao // TELEFONE, EMAIL, WHATSAPP, CHAT, PRESENCIAL, MARKETPLACE\n\n  // Conteúdo\n  titulo    String // Assunto/resumo\n  descricao String // Descrição completa\n\n  // Contexto\n  data      DateTime @default(now()) // Data da interação\n  usuarioId String // ID do usuário que registrou\n  pedidoId  String? // ID do pedido relacionado (se houver)\n\n  // Metadados adicionais\n  metadata Json? // Dados adicionais em JSON\n\n  // Auditoria\n  criadoEm DateTime @default(now())\n\n  @@index([tenantId, clienteId])\n  @@index([tenantId, tipo])\n  @@index([tenantId, data])\n}\n\n// SegmentoCliente - Definição de um segmento de clientes\n// Permite criar segmentos dinâmicos baseados em regras\n// (ex: \"Clientes que gastaram mais de R$10k nos últimos 30 dias\").\nmodel SegmentoCliente {\n  id       String @id @default(cuid())\n  tenantId String\n\n  // Identificação\n  nome      String // Nome do segmento\n  descricao String? // Descrição\n\n  // Regras dinâmicas em JSON\n  // Ex: { \"valor_minimo\": 10000, \"dias\": 30, \"campos\": [\"status\", \"tags\"] }\n  regras Json // Regras de filtro dinâmicas\n\n  // Estatísticas\n  totalClientes Int     @default(0) // Total de clientes neste segmento\n  ativo         Boolean @default(true)\n\n  // Relacionamentos\n  clientes ClienteSegmento[]\n\n  // Auditoria\n  criadoEm     DateTime @default(now())\n  atualizadoEm DateTime @updatedAt\n\n  @@index([tenantId])\n  @@index([tenantId, ativo])\n}\n\n// ClienteSegmento - Tabela associativa entre Cliente e SegmentoCliente\n// Associa clientes aos segmentos dos quais fazem parte.\nmodel ClienteSegmento {\n  id String @id @default(cuid())\n\n  // Relacionamentos\n  clienteId String\n  cliente   Cliente @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  segmentoId String\n  segmento   SegmentoCliente @relation(fields: [segmentoId], references: [id], onDelete: Cascade)\n\n  // Data de adição ao segmento\n  adicionadoEm DateTime @default(now())\n\n  @@unique([clienteId, segmentoId])\n  @@index([segmentoId])\n}\n\n// ImportacaoCliente - Registro de importações em lote\n// Controla o processo de importação de clientes a partir de\n// arquivos CSV ou XLSX.\nmodel ImportacaoCliente {\n  id       String @id @default(cuid())\n  tenantId String\n\n  // Arquivo\n  arquivo String // Caminho ou nome do arquivo\n  formato FormatoImportacao // CSV ou XLSX\n\n  // Status da importação\n  status StatusImportacao @default(PENDENTE) // PENDENTE, PROCESSANDO, CONCLUIDO, ERRO\n\n  // Contadores\n  totalRegistros Int // Total de linhas no arquivo\n  importados     Int @default(0) // Linhas processadas com sucesso\n  erros          Int @default(0) // Linhas com erro\n\n  // Log de erros em JSON\n  logErros Json? // Array de erros: [{ linha: 2, campo: \"email\", erro: \"email inválido\" }]\n\n  // Contexto\n  usuarioId String // Usuário que iniciou a importação\n\n  // Auditoria\n  criadoEm    DateTime  @default(now())\n  concluidoEm DateTime? // Quando a importação foi concluída\n\n  @@index([tenantId, status])\n  @@index([tenantId, criadoEm])\n}\n\n// ═══════════════════════════════════════════════════════════════\n// ENUMS - Tipos de Cliente, Status, Origem, etc\n// ═══════════════════════════════════════════════════════════════\n\n/// Tipo de cliente: Pessoa Física ou Jurídica\nenum TipoCliente {\n  PESSOA_FISICA\n  PESSOA_JURIDICA\n}\n\n/// Status do cliente\nenum StatusCliente {\n  PROSPECT // Interessado, ainda não comprou\n  ATIVO // Cliente ativo com compras\n  INATIVO // Cliente que parou de comprar\n  BLOQUEADO // Cliente com inadimplência ou problemas\n}\n\n/// Origem do cliente (como foi adicionado)\nenum OrigemCliente {\n  MANUAL // Criado manualmente\n  MARKETPLACE // Vindo de marketplace\n  SITE // Cadastro via site\n  INDICACAO // Indicação de outro cliente\n  IMPORTACAO // Importado em lote\n}\n\n/// Tipo de endereço\nenum TipoEndereco {\n  ENTREGA\n  COBRANCA\n  AMBOS\n}\n\n/// Tipo de interação com cliente\nenum TipoInteracao {\n  VENDA\n  ATENDIMENTO\n  RECLAMACAO\n  DEVOLUCAO\n  EMAIL\n  TELEFONE\n  CHAT\n  MARKETPLACE\n  NOTA\n}\n\n/// Canal de comunicação\nenum CanalInteracao {\n  TELEFONE\n  EMAIL\n  WHATSAPP\n  CHAT\n  PRESENCIAL\n  MARKETPLACE\n}\n\n/// Formato de arquivo para importação\nenum FormatoImportacao {\n  CSV\n  XLSX\n}\n\n/// Status da importação\nenum StatusImportacao {\n  PENDENTE\n  PROCESSANDO\n  CONCLUIDO\n  ERRO\n}\n",
  "inlineSchemaHash": "1b426b8abf3b3acd60445310ecea6fe1873d2d35529475fc13ed0247e3553fe9",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Cliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoCliente\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nomeFantasia\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"razaoSocial\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cpf\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cnpj\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"inscricaoEstadual\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"emailSecundario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"celular\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dataNascimento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"genero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"score\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusCliente\",\"default\":\"PROSPECT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"origem\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"OrigemCliente\",\"default\":\"MANUAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ultimaCompra\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalCompras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"valorTotalCompras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enderecos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EnderecoCliente\",\"relationName\":\"ClienteToEnderecoCliente\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contatos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContatoCliente\",\"relationName\":\"ClienteToContatoCliente\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"interacoes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"InteracaoCliente\",\"relationName\":\"ClienteToInteracaoCliente\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"segmentos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteSegmento\",\"relationName\":\"ClienteToClienteSegmento\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"tenantId\",\"cpf\"],[\"tenantId\",\"cnpj\"],[\"tenantId\",\"email\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"tenantId\",\"cpf\"]},{\"name\":null,\"fields\":[\"tenantId\",\"cnpj\"]},{\"name\":null,\"fields\":[\"tenantId\",\"email\"]}],\"isGenerated\":false},\"EnderecoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cliente\",\"relationName\":\"ClienteToEnderecoCliente\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoEndereco\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logradouro\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"numero\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"complemento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bairro\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cidade\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cep\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pais\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"BR\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"padrao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ContatoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cliente\",\"relationName\":\"ClienteToContatoCliente\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cargo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"celular\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"principal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observacoes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"InteracaoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cliente\",\"relationName\":\"ClienteToInteracaoCliente\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipo\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoInteracao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"canal\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CanalInteracao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"titulo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pedidoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SegmentoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nome\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descricao\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"regras\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalClientes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ativo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteSegmento\",\"relationName\":\"ClienteSegmentoToSegmentoCliente\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"atualizadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ClienteSegmento\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Cliente\",\"relationName\":\"ClienteToClienteSegmento\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"segmentoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"segmento\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SegmentoCliente\",\"relationName\":\"ClienteSegmentoToSegmentoCliente\",\"relationFromFields\":[\"segmentoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"adicionadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"clienteId\",\"segmentoId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"clienteId\",\"segmentoId\"]}],\"isGenerated\":false},\"ImportacaoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tenantId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"arquivo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"formato\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FormatoImportacao\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"StatusImportacao\",\"default\":\"PENDENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalRegistros\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"importados\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"erros\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logErros\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criadoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"concluidoEm\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"TipoCliente\":{\"values\":[{\"name\":\"PESSOA_FISICA\",\"dbName\":null},{\"name\":\"PESSOA_JURIDICA\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Tipo de cliente: Pessoa Física ou Jurídica\"},\"StatusCliente\":{\"values\":[{\"name\":\"PROSPECT\",\"dbName\":null},{\"name\":\"ATIVO\",\"dbName\":null},{\"name\":\"INATIVO\",\"dbName\":null},{\"name\":\"BLOQUEADO\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Status do cliente\"},\"OrigemCliente\":{\"values\":[{\"name\":\"MANUAL\",\"dbName\":null},{\"name\":\"MARKETPLACE\",\"dbName\":null},{\"name\":\"SITE\",\"dbName\":null},{\"name\":\"INDICACAO\",\"dbName\":null},{\"name\":\"IMPORTACAO\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Origem do cliente (como foi adicionado)\"},\"TipoEndereco\":{\"values\":[{\"name\":\"ENTREGA\",\"dbName\":null},{\"name\":\"COBRANCA\",\"dbName\":null},{\"name\":\"AMBOS\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Tipo de endereço\"},\"TipoInteracao\":{\"values\":[{\"name\":\"VENDA\",\"dbName\":null},{\"name\":\"ATENDIMENTO\",\"dbName\":null},{\"name\":\"RECLAMACAO\",\"dbName\":null},{\"name\":\"DEVOLUCAO\",\"dbName\":null},{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"TELEFONE\",\"dbName\":null},{\"name\":\"CHAT\",\"dbName\":null},{\"name\":\"MARKETPLACE\",\"dbName\":null},{\"name\":\"NOTA\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Tipo de interação com cliente\"},\"CanalInteracao\":{\"values\":[{\"name\":\"TELEFONE\",\"dbName\":null},{\"name\":\"EMAIL\",\"dbName\":null},{\"name\":\"WHATSAPP\",\"dbName\":null},{\"name\":\"CHAT\",\"dbName\":null},{\"name\":\"PRESENCIAL\",\"dbName\":null},{\"name\":\"MARKETPLACE\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Canal de comunicação\"},\"FormatoImportacao\":{\"values\":[{\"name\":\"CSV\",\"dbName\":null},{\"name\":\"XLSX\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Formato de arquivo para importação\"},\"StatusImportacao\":{\"values\":[{\"name\":\"PENDENTE\",\"dbName\":null},{\"name\":\"PROCESSANDO\",\"dbName\":null},{\"name\":\"CONCLUIDO\",\"dbName\":null},{\"name\":\"ERRO\",\"dbName\":null}],\"dbName\":null,\"documentation\":\"Status da importação\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

