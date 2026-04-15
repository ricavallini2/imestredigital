# Architecture - Auth Service

Documentação arquitetural do Auth Service, o serviço mais crítico do iMestreDigital.

## Visão Geral

O Auth Service é responsável por:

1. **Autenticação**: Login com email/senha
2. **Autorização**: Controle de acesso baseado em cargos (RBAC)
3. **Tokens**: Emissão e validação de JWT com refresh tokens
4. **Multi-tenant**: Isolamento completo de dados por empresa
5. **Usuários**: CRUD de usuários dentro de cada tenant
6. **Segurança**: Hash de senhas, rotação de tokens, revogação

## Camadas da Aplicação

### 1. Controllers (HTTP)

```
src/modules/auth/auth.controller.ts
src/modules/tenant/tenant.controller.ts
src/modules/usuario/usuario.controller.ts
src/controllers/health.controller.ts
```

**Responsabilidades:**
- Receber requisições HTTP
- Validar entrada (DTOs)
- Chamar serviços
- Retornar respostas formatadas

### 2. Services (Lógica de Negócio)

```
src/modules/auth/auth.service.ts
src/modules/tenant/tenant.service.ts
src/modules/usuario/usuario.service.ts
```

**Responsabilidades:**
- Lógica de negócio
- Validações
- Transações do banco
- Erros (exceções)

### 3. Data Access (Prisma)

```
src/modules/prisma/prisma.service.ts
```

**Responsabilidades:**
- Conexão com PostgreSQL
- Executar queries
- Transações ACID

### 4. Estratégias de Autenticação (Passport)

```
src/modules/auth/strategies/jwt.strategy.ts
```

**Responsabilidades:**
- Extrair JWT do header
- Validar assinatura
- Verificar expiração
- Injetar dados em req.user

## Fluxo de Autenticação

### Registro (Sign Up)

```
POST /auth/registrar
    ↓
[Validação: email único, CNPJ único]
    ↓
Criar Tenant (empresa) + Usuário Admin
    ↓
Hash da senha com bcrypt (12 rounds)
    ↓
Gerar Access Token (JWT, 1h)
    ↓
Gerar Refresh Token (UUID, armazenar no banco, 7d)
    ↓
Retornar tokens + dados do tenant
    ↓
[TODO] Publicar evento TENANT_CRIADO no Kafka
[TODO] Enviar email de confirmação
```

### Login

```
POST /auth/login
    ↓
[Validação: email obrigatório, senha obrigatória]
    ↓
Buscar usuário pelo email
    ↓
[Erros] Usuário não existe → UnauthorizedException
[Erros] Usuário desativado → UnauthorizedException
[Erros] Tenant suspenso → UnauthorizedException
    ↓
Comparar senha com bcrypt.compare()
    ↓
[Erro] Senha incorreta → UnauthorizedException (erro genérico)
    ↓
Atualizar ultimoLogin
    ↓
Gerar Access Token (JWT, 1h)
    ↓
Gerar Refresh Token (UUID, armazenar no banco, 7d)
    ↓
[TODO] Publicar evento USUARIO_LOGADO no Kafka
    ↓
Retornar tokens + dados do usuário e tenant
```

### Requisição Autenticada

```
GET /api/v1/perfil
    ↑
[Header] Authorization: Bearer <JWT>
    ↓
JwtAuthGuard
    ↓
PassportStrategy extrai token do header
    ↓
Valida assinatura (secret + issuer + audience)
    ↓
[Erro] Token expirado → UnauthorizedException
[Erro] Token inválido → UnauthorizedException
    ↓
JwtStrategy.validate()
    ↓
Busca usuário no banco (verificar se ainda ativo)
    ↓
[Erro] Usuário deletado → UnauthorizedException
    ↓
Injeta dados em req.user
    ↓
Controller pode acessar:
  - req.user.usuarioId
  - req.user.tenantId
  - req.user.cargo
  - req.user.email
```

### Renovação de Token (Refresh)

```
POST /auth/refresh
    ↓
[Body] { refreshToken: "uuid-aqui" }
    ↓
Busca RefreshToken no banco
    ↓
[Erro] Não encontrado → UnauthorizedException
[Erro] Já revogado → UnauthorizedException
[Erro] Expirado → UnauthorizedException
    ↓
Revoga o refresh token antigo
    ↓
Gera novo par (Access + Refresh) tokens
    ↓
Salva novo refresh token no banco
    ↓
Retorna novos tokens
```

## Estrutura de Dados

### Tenant (Empresa)

```typescript
{
  id: UUID                           // Identificador único
  nome: string                       // Nome da empresa
  cnpj?: string (UNIQUE)             // CNPJ (opcional, único)
  email: string                      // Email principal
  telefone?: string                  // Telefone
  endereco?: string                  // Endereço
  inscricaoEstadual?: string         // IE

  // Plano e limites
  plano: "starter" | "growth" | "pro" | "enterprise"
  status: "ativo" | "suspenso" | "cancelado"
  limiteUsuarios: number             // Máximo de usuários permitidos
  limitePedidosMes: number           // Máximo de pedidos/mês

  // Flexibilidade
  configuracoes?: JSON               // Configurações customizadas por tenant

  // Timestamps
  criadoEm: DateTime
  atualizadoEm: DateTime
}
```

**Índices para performance:**
- `status` (filtrar tenants ativos)

### Usuario (Usuário)

```typescript
{
  id: UUID                           // Identificador único
  tenantId: UUID                     // Referência ao tenant (chave estrangeira)

  // Identidade
  nome: string
  email: string (UNIQUE)             // Email único globalmente
  senhaHash: string                  // Hash bcrypt (NUNCA texto plano)

  // Controle de acesso
  cargo: "admin" | "gerente" | "operador" | "visualizador"
  status: "ativo" | "pendente" | "inativo" | "removido"

  // Segurança
  emailVerificado: boolean
  ultimoLogin?: DateTime             // Último login bem-sucedido
  tentativasLogin: number            // Contador para detecção de força bruta
  bloqueadoAte?: DateTime            // Bloqueio temporário após muitas tentativas

  // Preferências
  avatarUrl?: string
  preferencias?: JSON                // Preferências do usuário

  // Timestamps
  criadoEm: DateTime
  atualizadoEm: DateTime
}
```

**Índices para performance:**
- `tenantId` (filtrar usuários por empresa)
- `email` (busca rápida por email)

### RefreshToken (Token de Refresh)

```typescript
{
  id: UUID                           // Identificador interno
  token: string (UNIQUE)             // UUID aleatório (o token em si)
  usuarioId: UUID                    // Referência ao usuário

  // Validade
  expiraEm: DateTime                 // Quando expira (usualmente 7 dias)
  revogado: boolean                  // Se foi revogado (rotação de token)
  revogadoEm?: DateTime              // Quando foi revogado

  criadoEm: DateTime
}
```

**Índices para performance:**
- `usuarioId` (buscar tokens de um usuário)
- `token` (validar um refresh token específico)

**Política de Cascata:**
- Quando um usuário é deletado, seus refresh tokens também são (ON DELETE CASCADE)

## Segurança

### Senhas

- **Hash**: bcrypt com 12 rounds (iterações)
- **Validação**: Mínimo 8 caracteres, letras maiúsculas, minúsculas e números
- **Comparação**: bcrypt.compare() em tempo constante (protege contra timing attacks)
- **Armazenamento**: Somente hash, nunca texto plano

### JWT (Access Token)

- **Algoritmo**: HS256 (HMAC SHA-256)
- **Secret**: Variável de ambiente (mínimo 32 caracteres em produção)
- **Duração**: 1 hora (curta)
- **Payload**:
  ```json
  {
    "sub": "usuario-id",      // Subject (ID do usuário)
    "tenantId": "tenant-id",  // Identificador do tenant
    "email": "user@email.com",
    "cargo": "admin",
    "iss": "imestredigital",  // Issuer
    "aud": "imestredigital-api", // Audience
    "iat": 1234567890,        // Issued At
    "exp": 1234567890 + 3600  // Expiration (1 hora depois)
  }
  ```

### Refresh Token

- **Tipo**: UUID v4 (aleatório, 128 bits de entropia)
- **Duração**: 7 dias
- **Rotação**: Cada uso revoga o antigo (mitigação de roubo)
- **Armazenamento**: Banco de dados PostgreSQL
- **Transport**: No corpo da resposta (não em cookie, por enquanto)

### Multi-tenant

- **Isolamento**: Cada usuário pertence a exatamente um tenant
- **Filtragem**: Todo query incluir `tenantId` no WHERE
- **Guards**: RolesGuard verifica cargo, não cargos globais

### CORS

- **Configurável**: CORS_ORIGINS em variáveis de ambiente
- **Em desenvolvimento**: localhost:3000, localhost:3001
- **Em produção**: Apenas domínios autorizados

### Validação de Entrada

- **DTOs**: Todas as requisições passam por class-validator
- **Whitelist**: Campos extra são rejeitados
- **Transform**: Conversões automáticas de tipo
- **Mensagens**: Erros descritivos em português

## Módulos NestJS

### AuthModule

```
├── AuthController
│   ├── POST /registrar
│   ├── POST /login
│   ├── POST /refresh
│   ├── GET /perfil
│   └── POST /trocar-senha
│
├── AuthService
│   ├── registrar()
│   ├── login()
│   ├── refresh()
│   ├── obterPerfil()
│   ├── trocarSenha()
│   └── gerarTokens() [PRIVADO]
│
├── JwtStrategy (Passport)
├── JwtAuthGuard
├── RolesGuard
├── RolesDecorator
├── CurrentUserDecorator
└── TenantIdDecorator
```

### TenantModule

```
├── TenantController
│   ├── GET /tenants/meu
│   └── PUT /tenants/meu
│
└── TenantService
    ├── buscarPorId()
    └── atualizar()
```

### UsuarioModule

```
├── UsuarioController
│   ├── GET /usuarios
│   ├── POST /usuarios (convidar)
│   └── DELETE /usuarios/:id
│
└── UsuarioService
    ├── listarPorTenant()
    ├── criar()
    └── desativar()
```

### PrismaModule

```
└── PrismaService
    ├── $connect() [onModuleInit]
    └── $disconnect() [onModuleDestroy]
```

## Integrações Externas

### Kafka (Mensageria)

**Eventos a publicar:**

```
auth.tenant.criado
├── tenantId
├── nome
├── cnpj
└── criadoEm

auth.usuario.logado
├── usuarioId
├── tenantId
├── email
└── loginEm

auth.usuario.criado
├── usuarioId
├── tenantId
├── nome
├── email
└── cargo
```

**Eventos a consumir:**
(Nenhum no momento)

### Email

**Casos de uso:**

```
auth.email.confirmacao
├── usuarioId
├── email
├── nome
└── linkConfirmacao

auth.email.esqueci-senha
├── usuarioId
├── email
└── linkRecuperacao

auth.email.convite-usuario
├── usuarioId
├── email
├── nomeEmpresa
└── linkAceitar
```

## Performance e Escalabilidade

### Banco de Dados

- **Índices**: Criados em `tenantId`, `email`, `status`, `token`
- **Queries**: Otimizadas com select específico (não SELECT *)
- **Transações**: Atomicidade em registros + login
- **Conexões**: Pool padrão do Prisma (10 conexões)

### Caching

**Futuro:**
- Redis para cache de refresh tokens (revogação em tempo real)
- Redis para rate limiting (detecção de força bruta)

### Rate Limiting

**Futuro:**
- Limitar 5 tentativas de login falhadas por IP
- Limitar 10 requisições por minuto por usuário

## Testes

### Unitários (`test/unit/`)

- Testes isolados de serviços
- Mocks do Prisma e JwtService
- Validações e erros

### Integração (`test/integration/`)

- Testes E2E completos
- Container Docker com banco real
- Fluxos completos: Registrar → Login → Acessar Perfil

### Cobertura

- Objetivo: >80% de cobertura de código
- Execute: `yarn test:cov`

## Deployment

### Docker

**Multi-stage build:**
1. Build stage: Compila TypeScript
2. Runtime stage: Apenas código compilado + node_modules

**Health checks:**
- Endpoint: `/health`
- Verificação a cada 30s
- Timeout: 10s

### Kubernetes

**Configurações recomendadas:**

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 40
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 20
  periodSeconds: 10

resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

## Roadmap

- [ ] Email verification
- [ ] Forgot password flow
- [ ] 2FA (two-factor authentication)
- [ ] OAuth2 / OpenID Connect
- [ ] LDAP integration
- [ ] Auditoria de logins
- [ ] Rate limiting automático
- [ ] IP whitelist/blacklist
- [ ] Session management
- [ ] Device management

---

**Última atualização**: Março 2024
**Versão**: 1.0.0
