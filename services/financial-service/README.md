# Financial Service - iMestreDigital

Microserviço de Gestão Financeira completo para o iMestreDigital ERP.

## 📋 Funcionalidades

- **Contas Financeiras**: Gestão de contas corrente, poupança, caixa, cartão, digital
- **Lançamentos**: Contas a pagar/receber com suporte a parcelamento
- **Categorias**: Hierarquia de categorias para receitas e despesas
- **Recorrências**: Geração automática de lançamentos recorrentes (diário até anual)
- **Fluxo de Caixa**: Geração de relatórios e projeção futura
- **DRE**: Demonstração de Resultado do Exercício
- **Conciliação Bancária**: Reconciliação com extratos bancários

## 🚀 Quick Start

### Instalação

```bash
npm install
```

### Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

### Banco de Dados

Crie as migrations e aplique:

```bash
npm run db:migrate
```

### Desenvolvimento

Inicie o serviço em modo desenvolvimento:

```bash
npm run dev
```

O serviço estará disponível em `http://localhost:3006`

## 📚 API Documentation

Swagger disponível em: `http://localhost:3006/api/docs`

### Endpoints Principais

#### Contas
- `POST /api/v1/contas` - Criar conta
- `GET /api/v1/contas` - Listar contas
- `GET /api/v1/contas/:id` - Obter conta
- `PUT /api/v1/contas/:id` - Atualizar conta
- `DELETE /api/v1/contas/:id` - Desativar conta

#### Lançamentos
- `POST /api/v1/lancamentos` - Criar lançamento
- `GET /api/v1/lancamentos` - Listar (com filtros)
- `GET /api/v1/lancamentos/:id` - Obter lançamento
- `POST /api/v1/lancamentos/:id/pagar` - Registrar pagamento
- `POST /api/v1/lancamentos/:id/parcelar` - Parcelar lançamento
- `DELETE /api/v1/lancamentos/:id` - Cancelar lançamento

#### Categorias
- `POST /api/v1/categorias` - Criar categoria
- `GET /api/v1/categorias` - Listar categorias
- `GET /api/v1/categorias/arvore` - Obter árvore hierárquica
- `PUT /api/v1/categorias/:id` - Atualizar categoria
- `DELETE /api/v1/categorias/:id` - Desativar categoria

#### Recorrências
- `POST /api/v1/recorrencias` - Criar recorrência
- `GET /api/v1/recorrencias` - Listar
- `POST /api/v1/recorrencias/gerar` - Gerar lançamentos

#### Fluxo de Caixa
- `POST /api/v1/fluxo-caixa/gerar` - Gerar relatório
- `GET /api/v1/fluxo-caixa/mensal` - Resumo mensal
- `POST /api/v1/fluxo-caixa/projetar` - Projetar futuro
- `GET /api/v1/fluxo-caixa/saldos` - Saldos por conta

#### DRE
- `POST /api/v1/dre/gerar` - Gerar DRE
- `GET /api/v1/dre` - Listar DREs
- `POST /api/v1/dre/comparar` - Comparar períodos

#### Conciliação
- `POST /api/v1/conciliacao/iniciar` - Iniciar conciliação
- `GET /api/v1/conciliacao/:id` - Obter conciliação
- `POST /api/v1/conciliacao/:id/conciliar` - Conciliar lançamentos
- `POST /api/v1/conciliacao/:id/finalizar` - Finalizar

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── main.ts                 # Ponto de entrada
├── app.module.ts           # Módulo raiz
├── config/
│   └── kafka.config.ts     # Configuração de eventos
├── controllers/
│   └── health.controller.ts
├── dtos/                   # Data Transfer Objects
├── middlewares/
│   └── tenant.middleware.ts
├── modules/
│   ├── prisma/            # Banco de dados
│   ├── cache/             # Redis cache
│   ├── eventos/           # Kafka events
│   ├── conta/
│   ├── lancamento/
│   ├── categoria/
│   ├── recorrencia/
│   ├── fluxo-caixa/
│   ├── dre/
│   └── conciliacao/
prisma/
└── schema.prisma           # Schema do banco
```

### Padrões de Código

- **Repository Pattern**: Acesso ao banco via repositories
- **Service Layer**: Lógica de negócio centralizada
- **DTO**: Validação de entrada com class-validator
- **Cache**: Redis para otimização
- **Kafka Events**: Publicação de eventos para outros serviços
- **Multi-tenancy**: Isolamento por `tenantId` em todas as queries
- **Decimal.js**: Precisão monetária em cálculos

## 🔄 Eventos Kafka

### Publicados
- `lancamento.criado`
- `lancamento.pago`
- `lancamento.atrasado`
- `fluxo-caixa.atualizado`
- `dre.gerado`
- `transferencia.realizada`
- `recorrencia.processada`

### Consumidos
- `pedido.pago` (order-service)
- `pedido.cancelado` (order-service)
- `nota.autorizada` (fiscal-service)

## 🗄️ Banco de Dados

### Modelos Principais

**ContaFinanceira**
- Tipos: CORRENTE, POUPANCA, CAIXA, CARTAO, DIGITAL
- Rastreia saldo e movimentações

**Lancamento**
- Tipos: RECEITA, DESPESA, TRANSFERENCIA
- Status: PENDENTE, PAGO, ATRASADO, CANCELADO
- Suporta parcelamento e recorrência

**CategoriaFinanceira**
- Hierarquia de categorias
- Tipos: RECEITA, DESPESA

**Recorrencia**
- Frequências: DIARIA até ANUAL
- Geração automática de lançamentos

**ConciliacaoBancaria**
- Rastreamento de reconciliações
- Detecção de divergências

**DRE**
- Demonstração mensal/anual
- Cálculo automático de indicadores

## 💾 Variáveis de Ambiente

```
DATABASE_URL=postgresql://...
KAFKA_BROKERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=sua-chave-secreta
PORT=3006
```

## 📦 Dependências Principais

- **NestJS**: Framework HTTP
- **Prisma**: ORM com type-safety
- **Kafka.js**: Message broker
- **Redis/IORedis**: Cache distribuído
- **Decimal.js**: Aritmética de ponto flutuante precisa
- **class-validator**: Validação de DTOs
- **Swagger**: Documentação automática

## 🧪 Testes

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Cobertura
npm run test:cov
```

## 📝 Linting

```bash
# Verificar
npm run lint

# Corrigir
npm run lint:fix
```

## 🚢 Build e Deploy

```bash
# Build
npm run build

# Produção
npm run start:prod
```

## 🐳 Docker

Veja `Dockerfile` para instruções de containerização.

## 📄 Licença

MIT - iMestreDigital © 2026
