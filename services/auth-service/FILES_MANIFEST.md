# Auth Service - Manifest de Arquivos

Documentação completa de todos os arquivos do Auth Service.

## Configuração do Projeto

### `package.json` (31 scripts, 27 dependências)
Gerenciador de dependências e scripts do projeto.
- Dependências principais: NestJS, Prisma, Passport, JWT, bcrypt, Kafka
- Scripts: dev, build, test, lint, db:migrate, db:seed

### `tsconfig.json`
Configuração do TypeScript (extends da config compartilhada).

### `nest-cli.json`
Configuração do CLI do NestJS (geração de código).

### `jest.config.js`
Configuração do Jest para testes unitários.

### `.prettierrc`
Formatação automática de código (espaçamento, aspas, etc).

### `.eslintrc.js`
Linting de código (padrões, segurança, best practices).

### `.gitignore`
Arquivos ignorados pelo Git (node_modules, .env, dist, etc).

### `.env.example`
Template de variáveis de ambiente (deve ser copiado para .env.local).

## Ponto de Entrada

### `src/main.ts` (146 linhas)
Arquivo principal da aplicação.
- Cria aplicação NestFactory
- Configura validação global
- Ativa CORS
- Configura Swagger/OpenAPI
- Conecta Kafka
- Inicia servidor na porta 3001

### `src/app.module.ts` (53 linhas)
Módulo raiz que registra todos os submódulos.
- Configuração de variáveis de ambiente
- Passport e JWT globais
- Health checks (Terminus)
- Prisma, Auth, Tenant, Usuario modules

## Controllers

### `src/controllers/health.controller.ts` (20 linhas)
Health checks para Kubernetes/Docker.
- GET /health → HealthCheck
- Usado por livenessProbe e readinessProbe

## Módulo de Autenticação

### `src/modules/auth/auth.module.ts` (23 linhas)
Módulo que agrupa toda a autenticação.
- Importa TenantModule e UsuarioModule
- Registra AuthController, AuthService, JwtStrategy

### `src/modules/auth/auth.controller.ts` (87 linhas)
Endpoints de autenticação.

**Endpoints públicos (sem JWT):**
- `POST /auth/registrar` → Cria tenant + admin
- `POST /auth/login` → Login (email + senha)
- `POST /auth/refresh` → Renovar token
- `POST /auth/trocar-senha` → Troca de senha

**Endpoints autenticados (exigem JWT):**
- `GET /auth/perfil` → Dados do usuário
- `POST /auth/trocar-senha` → Troca de senha

### `src/modules/auth/auth.service.ts` (356 linhas)
Lógica central de autenticação.

**Métodos públicos:**
- `registrar(dto)` → Cria novo tenant + admin
- `login(dto)` → Autentica usuário
- `refresh(dto)` → Renova tokens (rotação)
- `obterPerfil(usuarioId)` → Dados do usuário
- `trocarSenha(usuarioId, dto)` → Muda senha

**Métodos privados:**
- `gerarTokens(payload)` → Cria access + refresh tokens

### `src/modules/auth/strategies/jwt.strategy.ts` (68 linhas)
Estratégia Passport para JWT.
- Extrai JWT do header Authorization
- Valida assinatura (secret, issuer, audience)
- Verifica se usuário ainda existe e está ativo
- Injeta dados em req.user

### `src/modules/auth/guards/jwt-auth.guard.ts` (17 linhas)
Guard que protege rotas com autenticação JWT.
- Usa JwtStrategy do Passport
- Retorna 401 Unauthorized se falhar

### `src/modules/auth/guards/roles.guard.ts` (50 linhas)
Guard de autorização baseada em cargos (RBAC).
- Verifica @Roles() decorator
- Compara cargo do usuário com cargos exigidos
- Retorna 403 Forbidden se sem permissão

### `src/modules/auth/decorators/roles.decorator.ts` (13 linhas)
Decorator @Roles('admin', 'gerente') para especificar cargos.

### `src/modules/auth/decorators/current-user.decorator.ts` (20 linhas)
Decorator @CurrentUser() para injetar dados do usuário nos parâmetros.

### `src/modules/auth/decorators/tenant-id.decorator.ts` (18 linhas)
Decorator @TenantId() para injetar ID do tenant nos parâmetros.

## Módulo de Tenants

### `src/modules/tenant/tenant.module.ts` (18 linhas)
Módulo de gerenciamento de empresas.

### `src/modules/tenant/tenant.controller.ts` (53 linhas)
Endpoints de tenants.

**Autenticado:**
- `GET /tenants/meu` → Dados da empresa
- `PUT /tenants/meu` (admin) → Atualiza dados

### `src/modules/tenant/tenant.service.ts` (35 linhas)
Serviço de tenants.
- `buscarPorId(id)` → Busca tenant com contagem de usuários
- `atualizar(id, dto)` → Atualiza dados

## Módulo de Usuários

### `src/modules/usuario/usuario.module.ts` (18 linhas)
Módulo de gerenciamento de usuários.

### `src/modules/usuario/usuario.controller.ts` (65 linhas)
Endpoints de usuários.

**Autenticado:**
- `GET /usuarios` → Lista usuários do tenant
- `POST /usuarios` (admin/gerente) → Convida novo usuário
- `DELETE /usuarios/:id` (admin) → Desativa usuário

### `src/modules/usuario/usuario.service.ts` (92 linhas)
Serviço de usuários.
- `listarPorTenant(tenantId)` → Lista com paginação
- `criar(tenantId, dto)` → Cria/convida usuário
- `desativar(tenantId, id)` → Soft delete + revoga tokens

## Módulo Prisma

### `src/modules/prisma/prisma.module.ts` (13 linhas)
Módulo global de acesso ao banco (Dependency Injection).

### `src/modules/prisma/prisma.service.ts` (25 linhas)
Serviço de conexão com PostgreSQL via Prisma.
- Estende PrismaClient
- Conecta ao banco em onModuleInit
- Desconecta em onModuleDestroy

## Data Transfer Objects (DTOs)

### `src/dtos/auth/registrar.dto.ts` (39 linhas)
Validação de entrada para registro.
- `nome` (string, 3+ caracteres)
- `email` (email válido)
- `senha` (8+ caracteres, maiúsculas, minúsculas, números)
- `nomeEmpresa` (string obrigatório)
- `cnpj` (14 dígitos, opcional)
- `telefone` (opcional)

### `src/dtos/auth/login.dto.ts` (16 linhas)
Validação para login.
- `email` (obrigatório)
- `senha` (obrigatório)

### `src/dtos/auth/refresh-token.dto.ts` (12 linhas)
Validação para renovação de token.
- `refreshToken` (UUID obrigatório)

### `src/dtos/auth/trocar-senha.dto.ts` (20 linhas)
Validação para troca de senha.
- `senhaAtual` (obrigatória)
- `novaSenha` (8+ caracteres, validação forte)

### `src/dtos/tenant/atualizar-tenant.dto.ts` (21 linhas)
Validação para atualização de tenant.
- `nome`, `email`, `telefone`, `endereco`, `inscricaoEstadual` (todos opcionais)

### `src/dtos/usuario/criar-usuario.dto.ts` (26 linhas)
Validação para criação de usuário.
- `nome` (obrigatório)
- `email` (obrigatório, email válido)
- `cargo` (opcional, enum: admin/gerente/operador/visualizador)

## Banco de Dados

### `prisma/schema.prisma` (100 linhas)
Schema do banco PostgreSQL.

**Tabelas:**
- `tenants` (empresas)
  - id, nome, cnpj, email, telefone, endereco, inscricaoEstadual
  - plano, status, limiteUsuarios, limitePedidosMes, configuracoes
  - criadoEm, atualizadoEm
  - Índices: status

- `usuarios` (usuários)
  - id, tenantId, nome, email, senhaHash, cargo, status
  - emailVerificado, ultimoLogin, tentativasLogin, bloqueadoAte
  - avatarUrl, preferencias, criadoEm, atualizadoEm
  - Índices: tenantId, email

- `refresh_tokens` (tokens de refresh)
  - id, token, usuarioId, expiraEm, revogado, revogadoEm, criadoEm
  - Índices: usuarioId, token

### `prisma/seed.ts` (80 linhas)
Script de seed para dados de teste.
- Cria tenant "Empresa Teste LTDA"
- Cria usuários com diferentes cargos
- Credenciais: teste@teste.com / Senha123

## Docker

### `Dockerfile` (52 linhas)
Multi-stage build para containerização.

**Stage 1 (builder):**
- Compila TypeScript
- Instala dependências

**Stage 2 (runtime):**
- Apenas código compilado
- Usuário não-root (segurança)
- Health check automático

### `docker-compose.yml` (60 linhas)
Orquestração de containers para desenvolvimento.
- PostgreSQL 16
- Zookeeper (para Kafka)
- Kafka broker
- Volumes para persistência

## Testes

### `test/unit/auth.service.spec.ts` (62 linhas)
Testes unitários do AuthService.
- Mocks do Prisma, JwtService, ConfigService
- Testa registrar, login, refresh
- Validações de erro

### `test/integration/auth.e2e-spec.ts` (82 linhas)
Testes E2E (end-to-end).
- Testa fluxos completos
- Container docker real
- Registrar → Login → Perfil → Refresh

### `test/jest-e2e.json` (11 linhas)
Configuração Jest para testes E2E.

### `jest.config.js` (17 linhas)
Configuração Jest para testes unitários.

## Documentação

### `README.md` (350+ linhas)
Documentação completa da API.
- Quick start
- Endpoints principais
- Fluxo de autenticação
- Estrutura de dados
- Segurança
- Deployment
- Variáveis de ambiente

### `QUICKSTART.md` (220+ linhas)
Guia rápido para iniciar o serviço.
- Pré-requisitos
- Setup inicial
- Configuração do banco
- Exemplos cURL
- Troubleshooting

### `ARCHITECTURE.md` (350+ linhas)
Documentação arquitetural.
- Visão geral
- Camadas da aplicação
- Fluxos de autenticação
- Segurança
- Performance
- Roadmap

### `FILES_MANIFEST.md` (este arquivo)
Documentação de todos os arquivos do projeto.

## Configuração e Ambiente

### `.env.example` (21 linhas)
Template de variáveis de ambiente com comentários.

### `.eslintrc.js` (30 linhas)
Regras de linting (TypeScript, Prettier).

### `.prettierrc` (7 linhas)
Formatação de código (indentação, aspas, etc).

### `.gitignore` (24 linhas)
Arquivos ignorados pelo Git.

## Resumo Estatístico

**Total de arquivos: 38**

**Por categoria:**
- Configuração: 8 arquivos
- TypeScript: 24 arquivos
- Docker: 2 arquivos
- Testes: 3 arquivos
- Documentação: 4 arquivos (incluindo este)
- Banco: 1 arquivo

**Linhas de código (aproximadamente):**
- Source code: ~2,500 linhas
- Testes: ~150 linhas
- Documentação: ~1,000 linhas
- Configuração: ~200 linhas

**Estrutura:**
```
auth-service/
├── src/                              (Source code)
│   ├── main.ts
│   ├── app.module.ts
│   ├── controllers/
│   ├── modules/
│   │   ├── auth/
│   │   ├── tenant/
│   │   ├── usuario/
│   │   └── prisma/
│   └── dtos/
├── prisma/                           (Banco de dados)
│   ├── schema.prisma
│   └── seed.ts
├── test/                             (Testes)
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
├── docker-compose.yml
├── README.md
├── QUICKSTART.md
├── ARCHITECTURE.md
└── FILES_MANIFEST.md                 (este arquivo)
```

---

**Criado em**: Março 2024
**Versão**: 1.0.0
**Status**: Pronto para desenvolvimento e deployment
