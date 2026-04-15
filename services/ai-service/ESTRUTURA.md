# Estrutura Completa do AI Service

## Visão Geral

O AI Service do iMestreDigital está estruturado como um serviço NestJS completo com 6 módulos principais de negócio + 3 módulos de suporte.

**Total de arquivos criados**: 46 arquivos TypeScript/Config
**Porta**: 3008
**Linguagem**: Português do Brasil (PT-BR)

---

## Árvore de Diretórios

```
ai-service/
│
├── 📄 package.json                 # Dependências e scripts
├── 📄 tsconfig.json                # Configuração TypeScript
├── 📄 nest-cli.json                # Configuração NestJS CLI
├── 📄 Dockerfile                   # Imagem Docker
├── 📄 docker-compose.yml           # Stack local (DB + Redis + Kafka)
├── 📄 .env.example                 # Variáveis de exemplo
├── 📄 .env.development             # Variáveis para desenvolvimento
├── 📄 .gitignore                   # Git ignore
├── 📄 SETUP.md                     # Guia de instalação
├── 📄 ESTRUTURA.md                 # Este arquivo
│
├── 📂 prisma/
│   └── 📄 schema.prisma            # Schema do banco de dados
│                                   # Modelos: ConversaIA, MensagemIA, InsightIA,
│                                   # PrevisaoDemanda, SugestaoIA
│
└── 📂 src/
    │
    ├── 📄 main.ts                  # Entry point (port 3008)
    ├── 📄 app.module.ts            # Módulo raiz
    │
    ├── 📂 config/
    │   ├── 📄 kafka.config.ts      # Tópicos Kafka
    │   └── 📄 openai.config.ts     # Configuração OpenAI/LLM
    │
    ├── 📂 middlewares/
    │   └── 📄 tenant.middleware.ts # Multi-tenancy
    │
    └── 📂 modules/
        │
        ├── 📂 prisma/              # [SUPORTE] Camada de dados
        │   ├── 📄 prisma.service.ts
        │   └── 📄 prisma.module.ts
        │
        ├── 📂 assistente/          # [PRINCIPAL] iMestreAI Chat
        │   ├── 📄 assistente.service.ts
        │   ├── 📄 assistente.controller.ts
        │   ├── 📄 assistente.repository.ts
        │   ├── 📄 assistente.module.ts
        │   ├── 📄 llm.service.ts    # Abstração OpenAI
        │   ├── 📂 dtos/
        │   │   ├── 📄 iniciar-conversa.dto.ts
        │   │   ├── 📄 enviar-mensagem.dto.ts
        │   │   └── 📄 comando-rapido.dto.ts
        │   └── 📂 prompts/
        │       └── 📄 system-prompt.ts  # Prompts customizados
        │
        ├── 📂 insights/            # [PRINCIPAL] Análises automáticas
        │   ├── 📄 insights.service.ts
        │   ├── 📄 insights.controller.ts
        │   ├── 📄 insights.repository.ts
        │   └── 📄 insights.module.ts
        │
        ├── 📂 previsao/            # [PRINCIPAL] Previsão de demanda
        │   ├── 📄 previsao.service.ts    # Regressão linear + sazonalidade
        │   ├── 📄 previsao.controller.ts
        │   ├── 📄 previsao.repository.ts
        │   └── 📄 previsao.module.ts
        │
        ├── 📂 classificacao/       # [PRINCIPAL] Classificação fiscal
        │   ├── 📄 classificacao.service.ts # NCM/CFOP via IA
        │   ├── 📄 classificacao.controller.ts
        │   └── 📄 classificacao.module.ts
        │
        ├── 📂 sugestao/            # [PRINCIPAL] Sugestões
        │   ├── 📄 sugestao.service.ts # Preço, descrição, respostas
        │   ├── 📄 sugestao.controller.ts
        │   ├── 📄 sugestao.repository.ts
        │   └── 📄 sugestao.module.ts
        │
        ├── 📂 eventos/             # [SUPORTE] Kafka producer/consumer
        │   ├── 📄 produtor-eventos.service.ts
        │   ├── 📄 consumidor-eventos.service.ts
        │   └── 📄 eventos.module.ts
        │
        └── 📂 saude/               # [SUPORTE] Health checks
            ├── 📄 saude.service.ts
            ├── 📄 saude.controller.ts
            └── 📄 saude.module.ts
```

---

## Módulos de Negócio

### 1. **Assistente** (iMestreAI Chat)
**Path**: `src/modules/assistente/`

**Responsabilidades**:
- Chat conversacional em tempo real
- Processamento de comandos em linguagem natural
- Histórico de conversas
- Abstração do provider de IA (LLMService)

**Endpoints**:
- `POST   /assistente/conversas` - Iniciar conversa
- `GET    /assistente/conversas` - Listar conversas
- `GET    /assistente/conversas/:id` - Obter conversa + histórico
- `POST   /assistente/conversas/:id/mensagens` - Enviar mensagem
- `POST   /assistente/comando` - Comando rápido

**Arquivos principais**:
- `assistente.service.ts` - Lógica de negócio
- `assistente.controller.ts` - Rotas HTTP
- `llm.service.ts` - Integração com OpenAI (rate limiting, custos)
- `prompts/system-prompt.ts` - Templates de prompts

**Banco de dados**:
- `ConversaIA` - Conversas do usuário
- `MensagemIA` - Mensagens (histórico)

---

### 2. **Insights** (Análises Automáticas)
**Path**: `src/modules/insights/`

**Responsabilidades**:
- Gerar análises sobre vendas, estoque, financeiro, fiscal
- Alertas automáticos (estoque crítico, anomalias)
- Insights prioritizados

**Endpoints**:
- `GET    /insights` - Listar com filtros (tipo, prioridade, não-lidos)
- `GET    /insights/:id` - Obter insight
- `PUT    /insights/:id/visualizar` - Marcar como lido
- `POST   /insights/gerar` - Forçar geração

**Tipos de Insight**:
- `VENDA` - Análise de vendas, tendências
- `ESTOQUE` - Produtos críticos/encalhados
- `FINANCEIRO` - Fluxo de caixa
- `FISCAL` - Pendências, anomalias
- `MARKETPLACE` - Avaliações, perguntas

**Banco de dados**:
- `InsightIA` - Insights gerados

---

### 3. **Previsão** (Previsão de Demanda)
**Path**: `src/modules/previsao/`

**Responsabilidades**:
- Calcular previsão de vendas futuras
- Determinar ponto de reposição
- Usar dados históricos + sazonalidade

**Endpoints**:
- `POST   /previsao/demanda` - Prever demanda de produto
- `POST   /previsao/categoria` - Prever demanda de categoria
- `POST   /previsao/ponto-reposicao` - Calcular ponto de reposição
- `GET    /previsao` - Listar previsões

**Algoritmos**:
- Média móvel ponderada (últimos 7 dias)
- Regressão linear simples
- Análise de sazonalidade
- Cálculo de confiança (coeficiente de variação)

**Banco de dados**:
- `PrevisaoDemanda` - Previsões calculadas

---

### 4. **Classificação** (Fiscal)
**Path**: `src/modules/classificacao/`

**Responsabilidades**:
- Sugerir NCM (Nomenclatura Comum do Mercosul)
- Sugerir CFOP (Código Fiscal de Operação)
- Validar NCMs contra tabela TIPI

**Endpoints**:
- `POST   /classificacao/ncm` - Sugerir NCM
- `POST   /classificacao/cfop` - Sugerir CFOP
- `POST   /classificacao/produto/:id` - Classificar produto
- `GET    /classificacao/validar-ncm/:ncm` - Validar NCM

**Características**:
- Usa IA com temperatura baixa (0.1) para precisão
- Banco local de NCMs/CFOPs
- Retorna alíquotas (ICMS, PIS, COFINS)

---

### 5. **Sugestão** (Preço, Descrição, Respostas)
**Path**: `src/modules/sugestao/`

**Responsabilidades**:
- Sugerir preço baseado em custo + mercado
- Gerar descrições otimizadas (SEO)
- Responder perguntas de clientes (marketplace)
- Gerar títulos otimizados por marketplace

**Endpoints**:
- `POST   /sugestoes/resposta-marketplace` - Sugerir resposta
- `POST   /sugestoes/descricao-produto` - Gerar descrição
- `POST   /sugestoes/preco` - Sugerir preço
- `POST   /sugestoes/titulo-anuncio` - Gerar título
- `GET    /sugestoes` - Listar sugestões
- `PUT    /sugestoes/:id/aceitar` - Aceitar sugestão

**Tipos de Sugestão**:
- `PRECO` - Preço recomendado
- `ESTOQUE` - Quantidade sugerida
- `CLASSIFICACAO_FISCAL` - NCM/CFOP
- `RESPOSTA_MARKETPLACE` - Resposta de pergunta
- `DESCRICAO_PRODUTO` - Descrição otimizada

**Otimizações**:
- Cache Redis para descrições (7 dias)
- Histórico de aceitação (ML feedback)

**Banco de dados**:
- `SugestaoIA` - Sugestões geradas

---

## Módulos de Suporte

### 6. **Eventos** (Kafka)
**Path**: `src/modules/eventos/`

**Componentes**:
- `ProdutorEventosService` - Publica eventos
- `ConsumidorEventosService` - Consome eventos

**Tópicos Publicados**:
- `ia.insight_gerado` - Novo insight criado
- `ia.previsao_calculada` - Previsão gerada
- `ia.sugestao_criada` - Sugestão gerada
- `ia.classificacao_completada` - Classificação concluída

**Tópicos Consumidos**:
- `pedidos.pedido_criado` → Análise de vendas
- `pedidos.pedido_pago` → Atualizar previsões
- `catalogo.produto_criado` → Classificar produto
- `estoque.estoque_atualizado` → Alertas
- `financeiro.lancamento_criado` → Insights financeiros
- `fiscal.nota_autorizada` → Registrar operação

---

### 7. **Prisma** (Banco de Dados)
**Path**: `src/modules/prisma/`

**Responsabilidades**:
- Gerenciar conexão PostgreSQL
- Fornecer PrismaClient para todos os módulos

**Modelos**:
1. `ConversaIA` - Conversas do usuário
2. `MensagemIA` - Histórico de mensagens
3. `InsightIA` - Análises geradas
4. `PrevisaoDemanda` - Previsões calculadas
5. `SugestaoIA` - Sugestões geradas

---

### 8. **Saúde** (Health Checks)
**Path**: `src/modules/saude/`

**Endpoints**:
- `GET    /saude` - Status simples
- `GET    /saude/detalhado` - Status de todos componentes
- `GET    /saude/db` - Status PostgreSQL
- `GET    /saude/llm` - Status OpenAI
- `GET    /saude/kafka` - Status Kafka
- `GET    /saude/cache` - Status Redis

---

## Fluxos de Dados

### Fluxo de Chat (Assistente)

```
Usuário envia mensagem
    ↓
POST /assistente/conversas/:id/mensagens
    ↓
AssistenteService.enviarMensagem()
    ↓
[1] Armazenar mensagem do usuário (MensagemIA)
[2] Obter histórico (últimas 10 mensagens)
[3] Construir prompt com contexto
[4] Chamar LLMService.completarComContexto()
    ├─ Verificar rate limit (tokens por minuto)
    ├─ Chamar OpenAI GPT-4
    ├─ Registrar custo/tokens
    └─ Retornar resposta
[5] Armazenar resposta (MensagemIA)
    ↓
Retornar para usuário
```

### Fluxo de Insight

```
Evento Kafka recebido (PEDIDO_PAGO)
    ↓
ConsumidorEventosService.handlePedidoPago()
    ↓
[1] Atualizar previsões de produtos
[2] Analisar padrão de vendas
[3] Gerar insights (se relevante)
[4] Publicar ia.insight_gerado
    ↓
Dashboard recebe notificação
```

### Fluxo de Previsão

```
POST /previsao/demanda
    ↓
PrevisaoService.preverDemanda()
    ↓
[1] Obter 90 dias de histórico de vendas
[2] Calcular média móvel ponderada
[3] Calcular regressão linear
[4] Analisar sazonalidade
[5] Combinar previsões (40% + 40% + 20%)
[6] Calcular confiança
[7] Armazenar em PrevisaoDemanda
[8] Publicar ia.previsao_calculada
    ↓
Retornar previsão + confiança
```

---

## Configurações

### Arquivo .env

**Variáveis principais**:

```bash
# Aplicação
NODE_ENV=development
PORT=3008
LOG_LEVEL=debug

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5433/imestre_ai_db

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ai-service
KAFKA_GROUP_ID=ai-service-group

# Redis
REDIS_HOST=localhost
REDIS_PORT=6380

# Rate Limiting
RATE_LIMIT_TOKENS_POR_MINUTO=10000
RATE_LIMIT_REQUISICOES_POR_MINUTO=100

# Multi-tenancy
DEFAULT_TENANT_ID=tenant-dev-001
```

---

## Stack Tecnológico Resumido

| Componente | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|----------|
| Framework | NestJS | ^10.2.0 | Backend IA |
| ORM | Prisma | ^5.7.0 | Banco de dados |
| Banco | PostgreSQL | 16 | Dados persistentes |
| Cache | Redis | 7 | Cache + rate limit |
| Mensageria | Kafka | Redpanda | Event streaming |
| IA | OpenAI | GPT-4 | Motor de IA |
| APIs | Swagger/OpenAPI | ^7.1.0 | Documentação |
| Runtime | Node.js | 20+ | Execução |

---

## Convenções de Código

✓ **Linguagem**: Português do Brasil (PT-BR)
✓ **Nomenclatura**: camelCase (variáveis), PascalCase (classes)
✓ **Async/Await**: Obrigatório para operações I/O
✓ **Logs**: Estruturados com Logger do NestJS
✓ **Errors**: BadRequestException, NotFoundException, etc
✓ **DTOs**: Validados com class-validator
✓ **Swagger**: Todos endpoints documentados

---

## Próximos Passos (TODO)

- [ ] Integração com serviços reais (HTTP clients)
- [ ] Testes unitários + e2e
- [ ] Scheduled tasks (cronjobs para insights diários)
- [ ] Métricas Prometheus
- [ ] Observabilidade (OpenTelemetry)
- [ ] Rate limiting em Redis (não em memória)
- [ ] Cache warming (preload dados frequentes)
- [ ] Autenticação JWT
- [ ] Autorização (RBAC)
- [ ] Soft deletes para auditoria

---

**Versão**: 1.0.0
**Data**: 2024-03-23
**Autor**: iMestreDigital Team
