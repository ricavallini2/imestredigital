# Quick Start - Auth Service

Guia rápido para iniciar o Auth Service em desenvolvimento.

## 1. Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- Yarn ou NPM

## 2. Clonagem e Setup Inicial

```bash
# Entrar no diretório
cd services/auth-service

# Instalar dependências
yarn install
```

## 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo exemplo
cp .env.example .env.local

# Editar conforme necessário
nano .env.local
```

Configuração mínima para desenvolvimento:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/auth_service
JWT_SECRET=dev-secret-change-in-production
KAFKA_BROKERS=localhost:9092
```

## 4. Iniciar Banco de Dados e Kafka

```bash
# Iniciar containers
docker-compose up -d

# Verificar se estão rodando
docker-compose ps
```

Você verá:
- PostgreSQL em `localhost:5432`
- Kafka em `localhost:9092`

## 5. Configurar Banco de Dados

```bash
# Executar migrations
yarn db:migrate

# (Opcional) Inserir dados de teste
yarn db:seed
```

## 6. Iniciar o Serviço

```bash
# Modo desenvolvimento (com hot reload)
yarn dev
```

Você verá:
```
🔐 Auth Service rodando na porta 3001
📚 Docs: http://localhost:3001/api/docs
```

## 7. Testar a API

### Acessar Documentação Swagger

```
http://localhost:3001/api/docs
```

### Registrar um Novo Tenant

```bash
curl -X POST http://localhost:3001/api/v1/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@empresa.com",
    "senha": "MinhaSenh@123",
    "nomeEmpresa": "Empresa Maria LTDA",
    "cnpj": "12345678000190"
  }'
```

**Resposta esperada:**
```json
{
  "mensagem": "Empresa registrada com sucesso!",
  "tenant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Empresa Maria LTDA",
    "plano": "starter"
  },
  "usuario": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "nome": "Maria Silva",
    "email": "maria@empresa.com",
    "cargo": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440002",
  "expiresIn": "1h"
}
```

### Fazer Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@empresa.com",
    "senha": "MinhaSenh@123"
  }'
```

### Acessar Perfil (Requer JWT)

```bash
# Substitua TOKEN pelo accessToken retornado no login
curl -X GET http://localhost:3001/api/v1/auth/perfil \
  -H "Authorization: Bearer TOKEN"
```

## 8. Usar Dados de Teste

Se você executou `yarn db:seed`, pode usar:

```bash
# Admin
Email: teste@teste.com
Senha: Senha123

# Gerente
Email: gerente@teste.com
Senha: Senha123

# Operador
Email: operador@teste.com
Senha: Senha123

# Visualizador
Email: visualizador@teste.com
Senha: Senha123
```

Exemplo:

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@teste.com",
    "senha": "Senha123"
  }'
```

## 9. Visualizar Banco de Dados

```bash
# Abrir Prisma Studio (interface visual do banco)
yarn db:studio
```

Você poderá acessar em `http://localhost:5555` para navegar pelos dados.

## 10. Parar e Limpar

```bash
# Parar containers
docker-compose down

# Parar container e remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Parar o servidor Node
# Ctrl+C no terminal
```

## Troubleshooting

### Erro: "EADDRINUSE: address already in use :::3001"

A porta 3001 já está em uso. Mude em `.env.local`:

```env
PORT=3002
```

### Erro: "could not connect to server"

PostgreSQL não está rodando. Verifique:

```bash
docker-compose ps
docker-compose logs postgres
```

### Erro: "KAFKA BROKER NOT AVAILABLE"

Kafka não iniciou corretamente:

```bash
docker-compose restart kafka zookeeper
docker-compose logs kafka
```

### Erro: "JWT Secret not found"

Verifique se `JWT_SECRET` está definido em `.env.local`.

### Erro: "Relation does not exist"

Migrations não foram executadas:

```bash
yarn db:migrate
```

## Próximos Passos

1. Explorar endpoints no Swagger: `http://localhost:3001/api/docs`
2. Criar usuários adicionais: `POST /api/v1/usuarios`
3. Testar autorização por cargo (RBAC)
4. Integrar com outros serviços via Kafka
5. Implementar testes: `yarn test`

## Estrutura de Diretórios Importantes

```
services/auth-service/
├── src/
│   ├── main.ts                    # Ponto de entrada
│   ├── modules/
│   │   ├── auth/                  # Lógica de autenticação
│   │   ├── tenant/                # Gerenciamento de empresas
│   │   └── usuario/               # Gerenciamento de usuários
│   └── dtos/                      # Data Transfer Objects
├── prisma/
│   ├── schema.prisma              # Schema do banco (IMPORTANTE!)
│   └── seed.ts                    # Dados de teste
├── test/                          # Testes
├── docker-compose.yml             # PostgreSQL + Kafka
├── .env.example                   # Template de variáveis
└── README.md                      # Documentação completa
```

## Mais Informações

Veja `README.md` para documentação completa da API.

---

**Dúvidas?** Abra uma issue no repositório!
