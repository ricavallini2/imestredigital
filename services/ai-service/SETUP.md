# AI Service - Guia de Setup

## Visão Geral

O **AI Service** é o motor de inteligência artificial do iMestreDigital. Ele fornece:

- **iMestreAI**: Assistente conversacional inteligente
- **Análises Automáticas**: Insights sobre vendas, estoque, financeiro
- **Previsão de Demanda**: Recomendações de reposição
- **Classificação Fiscal**: Sugestões de NCM/CFOP
- **Sugestões Inteligentes**: Descrições, preços, respostas de clientes

## Stack Tecnológico

- **Framework**: NestJS
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Mensageria**: Kafka/Redpanda
- **Cache**: Redis
- **IA**: OpenAI GPT-4 (com fallback)
- **Porta**: 3008

## Pré-requisitos

- Node.js 18+ (recomendado 20)
- Docker & Docker Compose (para ambiente local)
- npm ou pnpm
- Chave de API OpenAI (para funcionalidades de IA)

## Instalação Local (com Docker)

### 1. Clone e configure

```bash
cd services/ai-service
cp .env.example .env.development
```

### 2. Configure sua chave OpenAI

```bash
# Editar .env.development e adicionar sua chave
OPENAI_API_KEY=sk-sua-chave-aqui
```

### 3. Inicie os containers

```bash
docker-compose up -d
```

Aguarde até que todos os serviços estejam saudáveis (veja output do docker):
- PostgreSQL ✓
- Redis ✓
- Redpanda (Kafka) ✓

### 4. Setup do Prisma

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Criar/migrar banco de dados
npm run prisma:migrate
```

### 5. Inicie o serviço

```bash
npm run dev
```

O serviço estará disponível em: http://localhost:3008

**Swagger/OpenAPI**: http://localhost:3008/docs

## Instalação em Produção

### 1. Build da imagem Docker

```bash
docker build -t imestre/ai-service:1.0.0 .
```

### 2. Configure variáveis de ambiente

Criar arquivo `.env` com as variáveis de produção:

```bash
# .env (PRODUCTION)
NODE_ENV=production
PORT=3008
DATABASE_URL=postgresql://...@prod-db:5432/imestre_ai
OPENAI_API_KEY=sk-...
KAFKA_BROKERS=kafka-1:29092,kafka-2:29092,kafka-3:29092
REDIS_HOST=redis-cluster
...
```

### 3. Deploy com Docker Swarm ou Kubernetes

```bash
# Docker Swarm
docker service create \
  --name ai-service \
  --port 3008:3008 \
  --env-file .env \
  imestre/ai-service:1.0.0

# Kubernetes
kubectl apply -f k8s/ai-service-deployment.yaml
```

## Estrutura do Projeto

```
ai-service/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Módulo raiz
│   ├── config/                    # Configurações (Kafka, OpenAI)
│   ├── middlewares/               # Tenant middleware
│   └── modules/
│       ├── prisma/                # Camada de dados
│       ├── assistente/            # iMestreAI Chat
│       ├── insights/              # Análises automáticas
│       ├── previsao/              # Previsão de demanda
│       ├── classificacao/         # NCM/CFOP
│       ├── sugestao/              # Preço, descrição, etc
│       ├── eventos/               # Kafka eventos
│       └── saude/                 # Health checks
├── prisma/
│   └── schema.prisma              # Schema do banco
├── package.json
├── docker-compose.yml             # Stack local
├── Dockerfile                     # Imagem Docker
└── README.md
```

## Endpoints Principais

### Assistente (Chat)

```bash
# Iniciar conversa
POST /assistente/conversas
{
  "titulo": "Análise de estoque",
  "contexto": { "modulo": "estoque" }
}

# Enviar mensagem
POST /assistente/conversas/{id}/mensagens
{
  "mensagem": "Qual é meu estoque atual?"
}

# Comando rápido (sem histórico)
POST /assistente/comando
{
  "comando": "Qual foi meu faturamento de hoje?"
}
```

### Insights

```bash
# Listar insights
GET /insights?tipo=VENDA&prioridade=ALTA&apenasNaoLidos=true

# Gerar insights
POST /insights/gerar

# Marcar como lido
PUT /insights/{id}/visualizar
```

### Previsão

```bash
# Prever demanda de produto
POST /previsao/demanda
{
  "produtoId": "prod-123",
  "diasFuturos": 30
}

# Ponto de reposição
POST /previsao/ponto-reposicao
{
  "produtoId": "prod-123"
}
```

### Classificação Fiscal

```bash
# Sugerir NCM
POST /classificacao/ncm
{
  "descricao": "Cabo HDMI 2 metros",
  "categoria": "Eletrônicos"
}

# Validar NCM
GET /classificacao/validar-ncm/85176290
```

### Sugestões

```bash
# Sugerir preço
POST /sugestoes/preco
{
  "produtoId": "prod-123",
  "custoUnitario": 50.00,
  "margemDesejada": 0.3
}

# Gerar descrição
POST /sugestoes/descricao-produto
{
  "produtoId": "prod-123",
  "nome": "Teclado Mecânico RGB",
  "categoria": "Periféricos",
  "caracteristicas": ["RGB", "Layout ABNT2", "Switches MX"],
  "palavrasChave": ["teclado", "gamer", "mecanico"]
}

# Sugerir resposta
POST /sugestoes/resposta-marketplace
{
  "perguntaId": "pergunta-456",
  "pergunta": "Qual é o tempo de entrega?",
  "marketplace": "MERCADO_LIVRE"
}
```

### Health Check

```bash
# Status simples
GET /saude

# Status detalhado
GET /saude/detalhado

# Status do LLM
GET /saude/llm

# Status do banco
GET /saude/db

# Status do Kafka
GET /saude/kafka
```

## Desenvolvimento

### Executar testes

```bash
npm run test
npm run test:cov  # Com cobertura
```

### Linting e formatação

```bash
npm run lint      # ESLint
npm run format    # Prettier
```

### Abrir Prisma Studio

```bash
npm run prisma:studio
```

Acessa http://localhost:5555

## Tópicos Kafka

### Publicados

- `ia.insight_gerado` - Novo insight criado
- `ia.previsao_calculada` - Previsão de demanda calculada
- `ia.sugestao_criada` - Sugestão gerada
- `ia.classificacao_completada` - NCM/CFOP classificado

### Consumidos

- `pedidos.pedido_criado` - Novo pedido (análise de vendas)
- `pedidos.pedido_pago` - Pedido confirmado (atualiza previsões)
- `catalogo.produto_criado` - Novo produto (classificação)
- `estoque.estoque_atualizado` - Estoque mudou (alertas)
- `financeiro.lancamento_criado` - Novo lançamento (insights)
- `fiscal.nota_autorizada` - NF autorizada (registra)

## Troubleshooting

### Erro: `OPENAI_API_KEY not configured`

Configure sua chave no `.env`:
```bash
OPENAI_API_KEY=sk-sua-chave-aqui
```

### Erro: `PostgreSQL connection refused`

Verifique se o container PostgreSQL está rodando:
```bash
docker-compose ps
docker-compose logs postgres
```

### Erro: `Kafka broker unavailable`

Aguarde alguns segundos para o Redpanda inicializar:
```bash
docker-compose logs redpanda
```

### Rate limit de OpenAI excedido

Reduza `RATE_LIMIT_TOKENS_POR_MINUTO` no `.env`.

## Performance

### Otimizações implementadas

- ✓ Cache Redis para descrições (7 dias)
- ✓ Rate limiting por tenant
- ✓ Índices Prisma em queries frequentes
- ✓ Async/await para operações I/O
- ✓ Pool de conexões PostgreSQL

### Monitoramento

Logs estruturados em JSON (via NestJS Logger):
```json
{
  "level": "debug",
  "context": "AssistenteService",
  "message": "Iniciando conversa",
  "timestamp": "2024-03-23T10:00:00.000Z"
}
```

## Contribuindo

1. Crie uma branch: `git checkout -b feat/sua-feature`
2. Siga as regras de código PT-BR
3. Escreva testes para novas funcionalidades
4. Submeta um PR

## Licença

Proprietary - iMestreDigital © 2024
