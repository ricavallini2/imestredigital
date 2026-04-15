# Auth Service - iMestreDigital

Microserviço crítico de Autenticação e Autorização para o iMestreDigital. Gerencia tenants (empresas), usuários, tokens JWT e controle de permissões.

## Características Principais

- **Multi-tenant**: Isolamento completo de dados por tenant
- **JWT com Refresh Tokens**: Segurança implementada com rotação de tokens
- **RBAC (Role-Based Access Control)**: Controle de permissões baseado em cargos
- **Bcrypt**: Hash seguro de senhas (12 rounds)
- **Prisma ORM**: Gerenciamento de banco de dados PostgreSQL
- **Kafka**: Eventos assíncronos para outros serviços
- **Swagger/OpenAPI**: Documentação automática da API

## Quick Start

### 1. Instalação de Dependências

```bash
yarn install
```

### 2. Configuração de Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_service
JWT_SECRET=seu_secret_super_secreto_aqui
KAFKA_BROKERS=localhost:9092
```

### 3. Inicializar Banco de Dados

```bash
# Inicia containers do PostgreSQL e Kafka
docker-compose up -d

# Executa migrations
yarn db:migrate

# (Opcional) Seed de dados para desenvolvimento
yarn db:seed
```

### 4. Executar em Desenvolvimento

```bash
yarn dev
```

A API estará disponível em `http://localhost:3001/api`
A documentação Swagger em `http://localhost:3001/api/docs`

## Endpoints Principais

### Autenticação

- `POST /api/v1/auth/registrar` - Registrar nova empresa + admin
- `POST /api/v1/auth/login` - Login (email + senha)
- `POST /api/v1/auth/refresh` - Renovar access token
- `GET /api/v1/auth/perfil` - Obter perfil do usuário (requer JWT)
- `POST /api/v1/auth/trocar-senha` - Trocar senha (requer JWT)

### Tenants

- `GET /api/v1/tenants/meu` - Obter dados da empresa (requer JWT)
- `PUT /api/v1/tenants/meu` - Atualizar empresa (requer JWT + admin)

### Usuários

- `GET /api/v1/usuarios` - Listar usuários do tenant (requer JWT)
- `POST /api/v1/usuarios` - Criar/convidar usuário (requer JWT + admin/gerente)
- `DELETE /api/v1/usuarios/:id` - Desativar usuário (requer JWT + admin)

## Fluxo de Autenticação

### 1. Registro

```bash
curl -X POST http://localhost:3001/api/v1/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ricardo Cavallini",
    "email": "ricardo@empresa.com",
    "senha": "MinhaSenh@123",
    "nomeEmpresa": "Minha Empresa LTDA",
    "cnpj": "12345678000190"
  }'
```

**Resposta:**
```json
{
  "mensagem": "Empresa registrada com sucesso!",
  "tenant": {
    "id": "uuid-here",
    "nome": "Minha Empresa LTDA",
    "plano": "starter"
  },
  "usuario": {
    "id": "uuid-here",
    "nome": "Ricardo Cavallini",
    "email": "ricardo@empresa.com",
    "cargo": "admin"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid-here",
  "expiresIn": "1h"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ricardo@empresa.com",
    "senha": "MinhaSenh@123"
  }'
```

### 3. Usar Token

```bash
curl -X GET http://localhost:3001/api/v1/auth/perfil \
  -H "Authorization: Bearer eyJhbGc..."
```

### 4. Renovar Token

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "uuid-here"
  }'
```

## Estrutura de Pastas

```
auth-service/
├── src/
│   ├── main.ts                          # Ponto de entrada
│   ├── app.module.ts                    # Módulo raiz
│   ├── controllers/
│   │   └── health.controller.ts         # Health checks
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts      # Passport JWT
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts       # RBAC
│   │   │   └── decorators/
│   │   │       ├── roles.decorator.ts
│   │   │       ├── current-user.decorator.ts
│   │   │       └── tenant-id.decorator.ts
│   │   ├── tenant/
│   │   │   ├── tenant.module.ts
│   │   │   ├── tenant.controller.ts
│   │   │   └── tenant.service.ts
│   │   ├── usuario/
│   │   │   ├── usuario.module.ts
│   │   │   ├── usuario.controller.ts
│   │   │   └── usuario.service.ts
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   └── dtos/
│       ├── auth/
│       │   ├── registrar.dto.ts
│       │   ├── login.dto.ts
│       │   ├── refresh-token.dto.ts
│       │   └── trocar-senha.dto.ts
│       ├── tenant/
│       │   └── atualizar-tenant.dto.ts
│       └── usuario/
│           └── criar-usuario.dto.ts
├── prisma/
│   └── schema.prisma                    # Schema do banco
├── test/                                # Testes
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Modelos de Dados

### Tenant

```typescript
{
  id: string (UUID)
  nome: string
  cnpj?: string (único)
  email: string
  telefone?: string
  endereco?: string
  inscricaoEstadual?: string
  plano: "starter" | "growth" | "pro" | "enterprise"
  status: "ativo" | "suspenso" | "cancelado"
  limiteUsuarios: number (default: 1)
  limitePedidosMes: number (default: 500)
  configuracoes?: JSON
  criadoEm: DateTime
  atualizadoEm: DateTime
}
```

### Usuario

```typescript
{
  id: string (UUID)
  tenantId: string (UUID) // Referência ao tenant
  nome: string
  email: string (único)
  senhaHash: string (bcrypt hash)
  cargo: "admin" | "gerente" | "operador" | "visualizador"
  status: "ativo" | "pendente" | "inativo" | "removido"
  emailVerificado: boolean
  ultimoLogin?: DateTime
  tentativasLogin: number
  bloqueadoAte?: DateTime
  avatarUrl?: string
  preferencias?: JSON
  criadoEm: DateTime
  atualizadoEm: DateTime
}
```

### RefreshToken

```typescript
{
  id: string (UUID)
  token: string (UUID, único)
  usuarioId: string (UUID)
  expiraEm: DateTime
  revogado: boolean
  revogadoEm?: DateTime
  criadoEm: DateTime
}
```

## Segurança

### Senhas

- Hash com bcrypt (12 rounds)
- Nunca armazenar senha em texto plano
- Validação forte: maiúsculas + minúsculas + números

### JWT

- Secret armazenado em variável de ambiente
- Issuer: "imestredigital"
- Audience: "imestredigital-api"
- AccessToken: 1h (curta duração)
- RefreshToken: 7d (longa duração, armazenado no banco)

### Rotação de Tokens

- Ao fazer login, um novo refresh token é gerado
- Ao renovar, o refresh token antigo é revogado
- Se alguém tentar usar um token revogado, é rejeitado

### Multi-tenant

- Cada usuário é vinculado a um único tenant
- Todos os dados incluem `tenantId` no filtro
- Usuário de um tenant NÃO pode acessar dados de outro

## Testes

```bash
# Testes unitários
yarn test:unit

# Testes de integração
yarn test:integration

# Todos os testes com cobertura
yarn test:cov

# E2E (end-to-end)
yarn test:e2e
```

## Build e Deploy

### Build para Produção

```bash
yarn build
```

### Executar em Produção

```bash
yarn start:prod
```

### Docker

```bash
# Build da imagem
docker build -t imestredigital/auth-service:latest .

# Executar container
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="seu_secret" \
  imestredigital/auth-service:latest
```

## Variáveis de Ambiente (Produção)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/auth_service
JWT_SECRET=seu_secret_super_secreto_minimo_32_caracteres
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7
KAFKA_BROKERS=kafka-broker-1:9092,kafka-broker-2:9092
CORS_ORIGINS=https://app.imestredigital.com,https://admin.imestredigital.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=seu_sendgrid_api_key
SMTP_FROM=noreply@imestredigital.com
```

## Próximas Implementações

- [ ] Email verification com confirmação
- [ ] Recuperação de senha via email
- [ ] Two-factor authentication (2FA)
- [ ] Auditoria de logins
- [ ] Rate limiting
- [ ] OAuth2 / OpenID Connect
- [ ] LDAP/Active Directory integration
- [ ] Testes E2E completos

## Contato & Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

MIT - Copyright (c) 2024 iMestreDigital
