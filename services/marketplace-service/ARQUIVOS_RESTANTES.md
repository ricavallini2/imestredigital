# Arquivos Restantes - Marketplace Service

## Módulos Faltando

Os seguintes módulos precisam ser criados seguindo o padrão já estabelecido:

### 1. CONTA-MARKETPLACE CONTROLLER
`src/modules/conta-marketplace/conta-marketplace.controller.ts`

```typescript
@Controller('api/v1/contas')
@ApiTags('Contas Marketplace')
export class ContaMarketplaceController {
  // GET /api/v1/contas - listar
  // POST /api/v1/contas - conectar
  // GET /api/v1/contas/:id - detalhes
  // DELETE /api/v1/contas/:id - desconectar
  // POST /api/v1/contas/:id/renovar-token - renovar token
  // GET /api/v1/contas/:id/status - status
  // GET /api/v1/contas/callback/mercado-livre - OAuth callback
}
```

### 2. ANUNCIO SERVICE, REPOSITORY E CONTROLLER
`src/modules/anuncio/`

- `anuncio.repository.ts` - CRUD anúncios
- `anuncio.service.ts` - Lógica de negócio (criar, atualizar, pausar, sincronizar)
- `anuncio.controller.ts` - Endpoints REST

### 3. PEDIDO-MARKETPLACE SERVICE, REPOSITORY E CONTROLLER
`src/modules/pedido-marketplace/`

- `pedido-marketplace.repository.ts` - CRUD pedidos
- `pedido-marketplace.service.ts` - Importar pedidos, sincronizar status
- `pedido-marketplace.controller.ts` - Endpoints REST

### 4. PERGUNTA SERVICE, REPOSITORY E CONTROLLER
`src/modules/pergunta/`

- `pergunta.repository.ts` - CRUD perguntas
- `pergunta.service.ts` - Listar, responder, sugerir resposta IA
- `pergunta.controller.ts` - Endpoints REST

### 5. SINCRONIZACAO SERVICE, REPOSITORY E CONTROLLER
`src/modules/sincronizacao/`

- `sincronizacao.repository.ts` - CRUD logs de sincronização
- `sincronizacao.service.ts` - Orquestrar sincronização de produtos, pedidos, estoque, preços
- `sincronizacao.controller.ts` - Endpoints REST e agendamento

### 6. MÓDULOS COM EXPORTS
- `src/modules/conta-marketplace/conta-marketplace.module.ts`
- `src/modules/anuncio/anuncio.module.ts`
- `src/modules/pedido-marketplace/pedido-marketplace.module.ts`
- `src/modules/pergunta/pergunta.module.ts`
- `src/modules/sincronizacao/sincronizacao.module.ts`

## Pattern Seguido

Todos os módulos devem seguir este padrão:

```
src/modules/[modulo]/
├── [modulo].repository.ts    - Operações BD
├── [modulo].service.ts       - Lógica de negócio
├── [modulo].controller.ts    - Endpoints HTTP
├── [modulo].module.ts        - Módulo NestJS
└── dtos/                      - (já criados na raiz)
```

## Funcionalidades Principais por Módulo

### Anúncio
- Criar anúncio automático ao receber evento PRODUTO_CRIADO
- Atualizar anúncio quando produto é modificado
- Sincronizar estoque bidirecionalmente
- Sincronizar preços
- Pausar, reativar, encerrar anúncios
- Listar com filtros (marketplace, status, produto)
- Obter métricas de vendas

### Pedido Marketplace
- Importar pedidos periodicamente
- Sincronizar status
- Enviar rastreio
- Converter para pedido interno
- Listar com filtros (marketplace, status, data)

### Pergunta
- Importar perguntas pendentes
- Responder perguntas
- Listar pendentes
- Sugerir resposta com IA (placeholder)

### Sincronização
- Sincronização completa ou parcial
- Sincronizar produtos (criar/atualizar)
- Sincronizar estoque
- Sincronizar preços
- Sincronizar pedidos
- Sincronizar perguntas
- Agendamento automático
- Histórico de sincronizações

## DTOs Já Criados
✅ conectar-marketplace.dto.ts
✅ criar-anuncio.dto.ts
✅ filtro-anuncio.dto.ts
✅ filtro-pedido-marketplace.dto.ts
✅ responder-pergunta.dto.ts
✅ sincronizar.dto.ts

## Prioridade de Implementação
1. Anuncio (base para sincronização)
2. Pedido-Marketplace (importar pedidos)
3. Sincronização (orquestrador)
4. Pergunta (comunicação com cliente)

## Notas Importantes
- Todos em PT-BR
- Multi-tenancy em todas as queries
- Usar eventos Kafka
- Cache Redis
- Swagger documentation
- Testes unitários quando possível
