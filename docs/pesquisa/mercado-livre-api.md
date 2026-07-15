# API do Mercado Livre para Integração Completa de ERP (Brasil, 2026)

> Pesquisa técnica para o iMestreDigital (marketplace-service, porta 3007).
> Data da pesquisa: julho/2026. Fontes: documentação oficial `developers.mercadolivre.com.br`
> (acesso direto via fetch bloqueado por proteção anti-bot — HTTP 403 — então as informações
> foram reconstruídas via cache de busca/snippets do próprio site oficial, complementadas por
> fontes secundárias). Pontos não confirmados diretamente na fonte primária estão marcados
> explicitamente em **⚠️ Não confirmado**.

---

## 1. Autenticação e Autorização (OAuth 2.0)

### 1.1 Fluxo padrão — Authorization Code Grant

O Mercado Livre usa o fluxo **Authorization Code Grant**, recomendado para aplicações server-side
(Node.js/NestJS se encaixa aqui).

**Passo 1 — Redirecionar o usuário para autorização:**
```
GET https://auth.mercadolivre.com.br/authorization
  ?response_type=code
  &client_id=$APP_ID
  &redirect_uri=$REDIRECT_URI
  &state=$RANDOM_STATE
```
- `redirect_uri` **deve usar HTTPS obrigatoriamente** (exigência de cadastro do app).
- Site de autorização varia por país (`auth.mercadolivre.com.br` para o Brasil).

**Passo 2 — Trocar o `code` pelo `access_token`:**
```
POST https://api.mercadolibre.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=$APP_ID
&client_secret=$SECRET_KEY
&code=$SERVER_GENERATED_AUTHORIZATION_CODE
&redirect_uri=$REDIRECT_URI
```

Resposta típica:
```json
{
  "access_token": "APP_USR-123456-090515-8cc4448aac10d5105474e1351-1234567",
  "token_type": "bearer",
  "expires_in": 21600,
  "scope": "offline_access read write",
  "user_id": 1234567,
  "refresh_token": "TG-5b9032b4e23464aed1f959f-1234567"
}
```

### 1.2 Validade dos tokens

| Token | Validade | Observações |
|---|---|---|
| `access_token` | **6 horas** (`expires_in: 21600` segundos) | Usado no header `Authorization: Bearer $ACCESS_TOKEN` |
| `refresh_token` | **6 meses**, e **uso único** | A cada renovação, o Mercado Livre retorna um `refresh_token` novo — o antigo é invalidado. É obrigatório persistir o novo token a cada troca. |

Renovação:
```
POST https://api.mercadolibre.com/oauth/token
grant_type=refresh_token
&client_id=$APP_ID
&client_secret=$SECRET_KEY
&refresh_token=$REFRESH_TOKEN
```

**Implicação de arquitetura para o iMestreDigital**: como o `refresh_token` é de uso único e
expira em 6 meses, o `marketplace-service` precisa de um job/worker que renove o token
periodicamente (bem antes das 6h de validade do access token) e trate falhas de renovação
(reautenticação manual do tenant) com alerta proativo — se o refresh token expirar sem uso
por 6 meses, o vendedor perde a conexão e precisa refazer o fluxo OAuth do zero.

### 1.3 PKCE (Proof Key for Code Exchange)

- **Opcional**: só se aplica se o app tiver PKCE habilitado nas configurações (na criação/edição
  do app no painel de desenvolvedores).
- Método recomendado: **S256** (SHA-256). O método `plain` existe mas não é recomendado por
  motivos de segurança.
- Parâmetros:
  - `code_verifier`: string aleatória gerada pelo cliente.
  - `code_challenge`: `code_verifier` codificado com o método escolhido.
  - `code_challenge_method`: `S256` ou `plain`.
- Segue o padrão RFC 7636, sem extensões proprietárias identificadas.

**⚠️ Não confirmado**: tamanho mínimo/máximo exato exigido para `code_verifier` na
implementação do Mercado Livre (RFC 7636 padrão define 43–128 caracteres, mas não encontrei
confirmação explícita nas páginas indexadas de que o ML segue exatamente esse intervalo).

### 1.4 Escopos (`scope`)

Os escopos observados na resposta de token são `read`, `write` e `offline_access`
(este último é o que habilita a emissão de `refresh_token`). **⚠️ Não confirmado**: lista
completa e granular de escopos por recurso (o Mercado Livre historicamente não usa escopos
granulares por endpoint como outras APIs — o controle de acesso é feito por
usuário/vendedor autenticado, não por escopo fino).

### 1.5 Multi-conta / multi-seller

- Cada `access_token` está associado a um único `user_id` (seller). Para uma aplicação
  operar múltiplos vendedores (multi-tenant, como o iMestreDigital), é necessário repetir o
  fluxo OAuth **uma vez por seller**, armazenando `access_token` + `refresh_token` +
  `user_id` por tenant.
- Não há um endpoint de "conta mestre" que gerencie subcontas nativamente — cada integração
  de tenant é independente do ponto de vista de autenticação.
- **Recomendação de boas práticas do próprio ML**: restringir por IP o ambiente que usa o
  `access_token` da aplicação.

**Modelo de dados sugerido** (`marketplace-service`): tabela `ml_conexoes` com
`tenantId`, `mlUserId`, `accessToken` (criptografado), `refreshToken` (criptografado),
`expiraEm`, `escopos`, `status`.

---

## 2. Notificações / Webhooks

### 2.1 Configuração

Os tópicos de notificação são configurados no **painel de gerenciamento da aplicação**
(App Manager), especificando uma URL pública de callback (ex.: `https://meuapp.com/webhooks/ml`)
por tópico.

### 2.2 Tópicos principais

| Tópico | Descrição |
|---|---|
| `orders_v2` | Criação e alterações em vendas confirmadas (pedidos) |
| `items` | Alterações em anúncios publicados (preço, estoque, status) |
| `questions` | Perguntas feitas/respondidas em anúncios |
| `shipments` | Criação e alterações em envios de vendas confirmadas |
| `claims` | Reclamações/disputas pós-venda |
| `messages` | Mensagens pós-venda (thread comprador↔vendedor) |

**⚠️ Não confirmado com certeza**: lista exaustiva de todos os tópicos existentes em 2026
(o ML historicamente também expõe `payments`, `fbm_stock_operations`,
`stock-locations`, `price_suggestion`, `catalog_item_competition`, `public_offers`,
`quotations`, `leads_credits`, `flex-handshakes`, entre outros dependendo do vertical/país)
— recomenda-se checar a lista atual e completa diretamente no App Manager antes de
implementar, pois novos tópicos são adicionados com frequência e a disponibilidade
varia por `site_id` (ex.: MLB para Brasil).

### 2.3 Formato do payload

```json
{
  "_id": "5da8a1b24be30a49eb66c52a",
  "resource": "/items/CBT123456789",
  "user_id": 123456789,
  "topic": "items",
  "application_id": 2069392825111111,
  "attempts": 1,
  "sent": "2020-01-09T13:44:33.006Z",
  "received": "2020-01-09T13:44:32.984Z"
}
```

O payload da notificação **não traz o recurso completo** — apenas a referência (`resource`).
O consumidor deve fazer um `GET` autenticado no path indicado para obter os dados atualizados
(ex.: `GET https://api.mercadolibre.com/items/CBT123456789`).

### 2.4 Requisitos de resposta e retry

- O endpoint de callback deve responder **HTTP 200** o mais rápido possível.
- **Prazo recomendado**: responder dentro de **500 ms** para evitar que o tópico seja
  desativado automaticamente pela plataforma por lentidão/indisponibilidade recorrente.
- Em caso de falha (não-200, timeout), o Mercado Livre reenvia com **intervalos
  exponenciais**, citados como aproximadamente **1 hora entre tentativas** em alguns casos
  (⚠️ **não confirmado o número exato de tentativas máximas nem o backoff exato** — a
  documentação indexada menciona "intervalos exponenciais" sem tabela detalhada).
- **Boa prática recomendada pelo próprio ML**: usar fila (queue) — confirmar recebimento
  (200) imediatamente e processar/buscar o recurso de forma assíncrona depois, para não
  gerar timeouts nem sensação de notificações duplicadas.

### 2.5 Assinatura / validação de origem

**⚠️ Não confirmado com uma fonte primária clara**: diferente do **Mercado Pago**, que possui
um mecanismo bem documentado de header `x-signature` (HMAC-SHA256 com `ts` e `v1`) para
validar webhooks de pagamento, **não encontrei confirmação equivalente e explícita, na
documentação de notificações do Mercado Livre (marketplace), de um header de assinatura
HMAC nos webhooks de `orders_v2`/`items`/`questions`/`shipments`/`claims`**. A prática comum
observada em integrações reais é:
1. Validar que o `application_id` no payload corresponde ao ID esperado da própria aplicação.
2. Validar que o `resource` pertence ao `user_id` autenticado/esperado.
3. Sempre buscar o recurso via `GET` autenticado (com o token do tenant) em vez de confiar
   cegamente no conteúdo da notificação — isso naturalmente atua como validação, pois um
   payload forjado não conseguiria autenticar a chamada de leitura subsequente.
4. Restringir o endpoint de callback para aceitar apenas requisições vindas dos ranges de
   IP do Mercado Livre, se disponíveis (não confirmado range específico).

**Recomendação para o iMestreDigital**: não confiar no payload da notificação para nada
além de "houve uma mudança neste recurso" — sempre revalidar buscando o dado real via API
autenticada antes de aplicar qualquer efeito colateral (baixa de estoque, atualização de
pedido, etc.), o que já mitiga o risco de spoofing mesmo sem assinatura documentada.

---

## 3. Anúncios / Items

### 3.1 Publicação (POST /items)

Campos principais no corpo da requisição:

```json
{
  "title": "...",
  "category_id": "MLB1234",
  "price": 199.90,
  "currency_id": "BRL",
  "available_quantity": 10,
  "buying_mode": "buy_it_now",
  "listing_type_id": "gold_special",
  "condition": "new",
  "pictures": [{ "source": "https://.../imagem.jpg" }],
  "attributes": [{ "id": "BRAND", "value_name": "Marca X" }]
}
```

### 3.2 Predição de categoria

```
GET https://api.mercadolibre.com/sites/$SITE_ID/domain_discovery/search?q=$TITULO
```
- `q`: título do produto **em inglês** (peculiaridade confirmada da API — mesmo para o site
  brasileiro MLB, o predictor espera o título em inglês para reconhecimento do domínio).
- `limit`: 1 a 8 (padrão 4).
- `target`: `core` ou `classified` (dependendo da vertical de publicação).
- Retorna `domain_id`, `category_id`, `category_name` e `attributes` (já indicando quais
  atributos são obrigatórios para aquela categoria).
- **Rate limit específico deste endpoint: 400 requisições/minuto.**

### 3.3 Atributos obrigatórios

```
GET /categories/$CATEGORY_ID/technical_specs/input
```
- Atributos com tag `required` → sempre obrigatórios.
- Tag `new_required` → obrigatório apenas quando `condition = new`.
- Tag `conditional_required` → obrigatoriedade depende de outros campos (é necessário
  checar a condição antes de publicar).

### 3.4 Variações de produto

- A categoria precisa ter `attribute_types` contendo `variations`.
- Atributos que permitem variação têm a tag `allow_variations` (ex.: cor, tamanho).
- **Limite confirmado**: máximo de **100 variações** por anúncio — excedendo isso, a API
  retorna erro `400`: `"Variations should not exceed max size of 100"`.

### 3.5 Catálogo vs. anúncio tradicional

- **Anúncio tradicional**: seller cria o item do zero, controla título, ficha técnica e
  fotos.
- **Listagem de catálogo** (`catalog_listing` / `catalog_product_id`): o seller associa sua
  oferta (preço, estoque, condição) a uma ficha de produto já existente e padronizada no
  catálogo do Mercado Livre, competindo em uma única página com outros sellers pelo "buy box"
  (`catalog_item_competition`, "Ganha o Compre" — ⚠️ nome exato do campo/mecanismo não
  confirmado com 100% de certeza na fonte primária). Recomendado para categorias com alta
  concorrência/eletrônicos, pois melhora a exposição, mas cede o controle da ficha técnica
  ao catálogo unificado.

### 3.6 Tipos de listagem (`listing_type_id`) — Brasil (site `MLB`)

| `listing_type_id` | Nome comercial (referência) |
|---|---|
| `gold_pro` | Premium |
| `gold_premium` | Diamante |
| `gold_special` | Clássico |
| `gold` | Ouro |
| `silver` | Prata |
| `bronze` | Bronze |
| `free` | Grátis |

- `gold_pro`: permite oferecer parcelamento sem juros ao comprador (custo adicional para o
  seller, além da comissão de venda).
- `gold_special`: sem parcelamento oferecido pelo seller (só o parcelamento padrão do banco);
  paga apenas a comissão de venda (e custo fixo, se aplicável).
- Consultar listing types disponíveis por categoria:
  `GET /users/$USER_ID/available_listing_types?category_id=$CATEGORY_ID`

### 3.7 Imagens (`pictures`)

- Formatos aceitos: **JPG, JPEG, PNG**.
- Upload aceito via `picture_url` (URL pública, estática e acessível) **ou** multipart
  direto (upload binário).
- Tamanho de arquivo: até **10 MB**.
- Dimensões: recomendado **1200×1200 px**; imagens maiores são redimensionadas
  automaticamente pela plataforma.
- Limite geral de dimensão mencionado: máximo **1920×1920 px** (versão "F"), mínimo
  **500×500 px** (versão "M") — abaixo disso a API rejeita/reporta diagnóstico de não
  conformidade.
- Existe uma **API de diagnóstico de imagens** separada para validar conformidade antes de
  associar ao anúncio.
- Espaço de cor **RGB é preferível a CMYK**.

---

## 4. Pedidos e Pagamentos

### 4.1 Orders

- Recurso principal: `GET /orders/$ORDER_ID` — retorna dados da venda confirmada
  (comprador, itens, valores, status de pagamento).
- Pedidos com múltiplos itens/comprador único no mesmo carrinho são agrupados em **packs**.

### 4.2 Packs

```
GET /packs/$PACK_ID
```
- Um `pack_id` agrupa múltiplas `orders` compradas juntas pelo mesmo comprador (mesmo
  checkout), permitindo consolidar envio/mensagens.
- Endpoint de gestão de packs documentado em "Gestão de packs" (`gestao-packs`).

### 4.3 Billing (faturamento)

```
GET /billing/integration/periods/key/{KEY}/documents
```
Parâmetros:
- `group`: `ML` (Mercado Livre) ou `MP` (Mercado Pago) — se omitido, retorna ambos.
- `document_id`, `document_type` (`BILL` ou `CREDIT_NOTE`) como filtros.
- `limit` (padrão 150, máximo 1000) e `offset` para paginação.
- **Boa prática documentada pelo próprio ML**: não usar esse endpoint em lote/batch —
  consumo sequencial e consulta diária é suficiente, pois os dados não mudam durante o dia.

Há também um fluxo específico de **dados fiscais** (`/faturamento`, `/api-fiscal-faturamento-de-venda`,
`/carregar-nf`) para o seller **enviar a própria NF-e** de venda ao Mercado Livre em modalidades
Flex/Turbo/ME1/Drop Off — relevante para o módulo fiscal do iMestreDigital, pois a
responsabilidade de emissão da NF-e da venda pode ser do seller, não do marketplace.

**⚠️ Não confirmado em detalhe**: estrutura completa de status de pagamento dentro do
objeto `order` (ex.: enum completo de `payments[].status`) — recomenda-se validar
diretamente no schema retornado em ambiente de sandbox/produção antes de mapear para o
enum interno do `financial-service`.

---

## 5. Envios (Shipments)

### 5.1 Mercado Envios 2 (ME2)

Países habilitados: Argentina, Brasil, Colômbia, México, Chile, Uruguai, Peru, Equador.

**Tipos de logística (`logistic_type`)**:
| Tipo | Descrição |
|---|---|
| `drop_off` | Seller leva o pacote a um ponto de coleta/agência |
| `xd_drop_off` | Cross-docking com coleta em ponto físico |
| `cross_docking` | Transportadora retira no endereço do seller |
| `fulfillment` | Estoque armazenado nos CDs do Mercado Livre (Full) |
| `self_service` | **Mercado Envios Flex** — entrega feita pelo próprio seller/motorista parceiro, geralmente no mesmo dia |

### 5.2 Etiquetas de envio

- Endpoint dedicado para gerar etiquetas rapidamente para ME2.
- **Limite confirmado**: até **50 IDs de shipment por requisição** em consultas GET em lote
  (acima disso, erro).
- Em envios **Fulfillment**, o seller **não imprime etiqueta** — essa tarefa é feita
  exclusivamente pela plataforma/operador logístico do ML.

### 5.3 Custos

```
GET /shipments/$SHIPMENT_ID/costs
```
- Retorna o custo de envio a cargo do usuário.
- Parâmetro `save` mostra a economia obtida ao agrupar múltiplos produtos na mesma caixa
  (multi-item no mesmo pacote).

### 5.4 Convivência Full + Flex

Existe documentação dedicada ("Convivência Full e Flex") tratando as regras quando um
mesmo item/SKU tem estoque simultâneo em Fulfillment (Full) e em Flex — relevante para o
módulo de estoque multi-canal do iMestreDigital.

### 5.5 Fulfillment (Full) — estoque distribuído

- Consulta de estoque distribuído: `GET /user-products/$USER_PRODUCT_ID/stock`, retornando
  localização por tipo:
  - `meli_facility`: estoque no CD do Mercado Livre (Full).
  - `selling_address`: estoque no próprio endereço do seller (usado no Flex).
- Operações de Fulfillment: `GET /stock/fulfillment/operations/search` com parâmetros
  `seller_id`, `inventory_id`, `date_from`, `date_to`. Tipos de operação incluem
  `inbound_reception` (entrada de estoque no CD), `sale_confirmation`, entre outros.
- **INBOUND**: processo de envio de mercadoria do seller para o depósito do Mercado Livre —
  exige NF-e de remessa/transferência de titularidade (seller → depósito ML), o que tem
  implicação direta no módulo fiscal (emissão de NF-e de remessa, CFOP específico).
- Endpoint alternativo citado: `/inventories/$INVENTORY_ID/stock/fulfillment`.

**⚠️ Não confirmado**: nomenclatura e schema exatos e atualizados de todos os tipos de
operação de Fulfillment em 2026 — recomenda-se validar contra a resposta real da API antes
de mapear para `movimentacoes` no `inventory-service`.

---

## 6. Perguntas e Mensagens Pós-Venda

### 6.1 Perguntas (Questions)

- Recurso: `/questions/$QUESTION_ID`.
- **Parâmetro `api_version=4`**: retorna perguntas/respostas na estrutura nova (recomendado
  usar sempre essa versão para novos desenvolvimentos).
- Dados de contato do comprador (email, telefone, nome) podem ser obtidos por motivos de
  segurança/pós-venda diretamente no recurso de pergunta, conforme contexto de uso permitido.

### 6.2 Mensagens pós-venda (Post-Sale Messages)

- Recurso baseado em `pack_id`: `GET /messages/packs/$PACK_ID/sellers/$SELLER_ID`.
- Se não houver `pack_id`, usa-se o `order_id` no lugar, **mantendo a mesma estrutura de
  endpoint** (`/packs/...`).
- Consultar mensagens **marca automaticamente como lidas** — para evitar esse efeito
  colateral, usar o parâmetro `mark_as_read=false`.
- **Rate limit específico**: leitura (GET) e escrita (POST/PUT) compartilham, cada uma,
  um limite de **500 requisições/minuto** entre si (ou seja, 500 rpm para o grupo de GETs e
  500 rpm para o grupo de POST/PUT, dentro do recurso de mensagens).
- **Restrição importante de boas práticas**: **proibido envio de mensagens automáticas
  repetitivas ou templates genéricos** — contas que fizerem isso podem ser bloqueadas pela
  plataforma. Qualquer automação de resposta no `ai-service` precisa gerar respostas
  contextualizadas, não templates fixos.

---

## 7. Reclamações e Devoluções (Claims / Returns)

- Recurso de reclamação: `/post-purchase/v1/claims/$CLAIM_ID`.
- Campos incluem `type` (ex.: `mediations`), `reason_id` (ex.: `PDD-0`) e
  `related_entities` (lista de entidades associadas, incluindo devoluções vinculadas).
- Devoluções associadas a uma claim: `GET /post-purchase/v2/claims/$CLAIM_ID/returns`.
- **Tipos de devolução**:
  - `claim`: iniciada via reclamação formal do comprador.
  - `dispute`: resultado de uma disputa/mediação entre comprador e vendedor.
  - `automatic`: iniciada pelo comprador e processada automaticamente pela plataforma
    (sem intervenção do seller).

**⚠️ Não confirmado**: máquina de estados completa de uma claim (todos os `status`
possíveis e transições) e o SLA de resposta esperado do seller em cada etapa — recomenda-se
consultar a doc "Gerenciar reclamações" / "Solicitar mediação" diretamente no painel de
desenvolvedor antes de implementar o fluxo de disputa no `order-service`.

---

## 8. Rate Limits e Boas Práticas

### 8.1 Limite geral

- **1.500 requisições por minuto por seller** é citado como o limite padrão observado.
  Ao exceder, a API retorna **HTTP 429** com corpo vazio.
- Endpoints específicos têm limites próprios e mais restritivos:
  - `domain_discovery` (predição de categoria): **400 req/min**.
  - Mensagens pós-venda: **500 req/min** (GET) + **500 req/min** (POST/PUT), conforme 6.2.
  - Upload de imagens (`pictures`): há limitação de RPM por `app_id` "devido à alta carga de
    processamento do recurso", mas **o número exato não foi confirmado** nas fontes
    disponíveis.

**⚠️ Não confirmado**: se o limite de 1.500 rpm é por `access_token`/seller, por `app_id`
agregando todos os sellers conectados, ou ambos simultaneamente (é comum em APIs de
marketplace haver dupla limitação — por app e por conta conectada). Para um ERP
multi-tenant como o iMestreDigital, isso é crítico: se o limite for por `app_id` global,
o crescimento da base de tenants pode esbarrar no limite agregado e exigir fila de
rate-limiting central no `marketplace-service` (não apenas por tenant).

### 8.2 Boas práticas documentadas oficialmente

- **Não fazer web crawling** — sempre consumir via API oficial.
- Restringir por **IP** o ambiente que usa o `access_token` da aplicação.
- **Proibido envio de mensagens automáticas/templates repetitivos** (bloqueio de conta).
- Usar filas (queue) para processar notificações — confirmar recebimento (200) primeiro,
  processar depois.
- Para billing/faturamento: consumo sequencial e não em lote; consulta diária é suficiente.

### 8.3 Programa de certificação (Developer Partner Program)

- **Tecnicamente não é obrigatório certificar a aplicação para operar em produção** —
  qualquer app registrado no painel de desenvolvedor pode ir a produção após o fluxo OAuth
  padrão.
- A certificação é um **programa opcional de parceria** (Developer Partner Program), com
  níveis/medalhas (ex.: Silver, Platinum) que dão maior visibilidade na App Store do
  Mercado Livre e benefícios de suporte.
- Para certificar: preencher formulário de candidatura, passar por um **Security
  Assessment com nota mínima de 65%**, e cumprir iniciativas mínimas de desenvolvimento
  atribuídas por um "Integration Expert" que acompanha o processo.
- Manutenção do nível/medalha depende da **velocidade de implementação de iniciativas**
  solicitadas pelo Mercado Livre ao longo do tempo.

**⚠️ Não confirmado**: critérios técnicos objetivos e completos do Security Assessment
(ex.: se exige criptografia de tokens em repouso, TLS mínimo, rotação de secrets etc.) —
recomenda-se solicitar o questionário oficial diretamente com o Mercado Livre antes de
buscar certificação, caso o roadmap do iMestreDigital inclua isso.

---

## 9. Recomendações de Arquitetura para o `marketplace-service`

1. **Persistência de credenciais por tenant**: tabela dedicada (`ml_conexoes` ou
   equivalente) com `tenantId`, `mlUserId`, tokens criptografados (nunca em texto plano —
   usar KMS/vault ou ao menos criptografia simétrica com chave fora do banco), e job
   assíncrono de renovação do `refresh_token` com alertas em caso de falha.
2. **Webhook receiver único** (`/webhooks/mercado-livre`) que apenas grava o payload numa
   fila (Kafka, conforme já usado no monorepo) e responde `200` imediatamente — processamento
   pesado (buscar recurso, aplicar side-effects) deve ser assíncrono, dado o requisito de
   resposta rápida (≈500 ms) e o risco de desativação do tópico por lentidão.
3. **Nunca confiar no payload da notificação como fonte de verdade** — sempre buscar o
   recurso via `GET` autenticado antes de aplicar qualquer mudança de estado interna
   (pedido, estoque, financeiro), já que não há confirmação de assinatura HMAC documentada
   para os webhooks de marketplace (diferente do Mercado Pago).
4. **Rate limiting interno no marketplace-service**: implementar um limitador próprio
   (ex.: token bucket por `app_id` + por tenant) para nunca chegar perto do limite de 1.500
   rpm agregado, com fila de prioridade para operações críticas (baixa de estoque, confirmação
   de pedido) sobre operações de baixa prioridade (sincronização de catálogo em lote).
5. **Mapeamento de enums**: os `status` de `orders`, `shipments` e `claims` do Mercado Livre
   devem ser mapeados explicitamente para os enums internos do `order-service` e
   `inventory-service` — dado que a auditoria do projeto já identificou "enum drift" como bug
   raiz em outras integrações, validar esse mapeamento com testes de contrato antes de ligar
   ao ambiente real.
6. **Módulo fiscal**: a integração precisa cobrir tanto a NF-e de **venda** (enviada pelo
   seller ao ML em Flex/Turbo/ME1/Drop Off) quanto a NF-e de **remessa/transferência de
   titularidade** para envio de estoque a um CD Fulfillment (inbound) — dois fluxos fiscais
   distintos que hoje não parecem ter equivalente único no `fiscal-service` atual.

---

## 10. Lacunas explícitas (não confirmadas — validar antes de codar)

- Lista completa e atual de todos os tópicos de webhook disponíveis por `site_id` (MLB).
- Mecanismo de assinatura/validação criptográfica oficial dos webhooks do Mercado Livre
  (marketplace), se existir algum equivalente ao `x-signature` do Mercado Pago.
- Número exato de tentativas de retry de notificação e tabela completa de backoff.
- Se o rate limit de 1.500 rpm é por seller, por app, ou ambos.
- Tamanho exato de `code_verifier`/regras PKCE específicas do Mercado Livre.
- Máquina de estados completa de `claims` e SLA de resposta do seller.
- Critérios técnicos objetivos do Security Assessment do Developer Partner Program.
- Estrutura enum completa de status de pagamento dentro de `orders`.

**Ação recomendada**: antes da Fase 3 (Integração real com marketplaces) do roadmap do
projeto, criar uma conta de desenvolvedor/sandbox no Mercado Livre e validar estes pontos
empiricamente contra a API real, já que o fetch automatizado da documentação oficial foi
bloqueado nesta pesquisa (HTTP 403 em todas as tentativas de acesso direto).

---

## Fontes consultadas

- [Authentication and Authorization — Developers Mercado Livre](https://developers.mercadolivre.com.br/en_us/authentication-and-authorization)
- [Autenticação e Autorização (pt_BR)](https://developers.mercadolivre.com.br/pt_br/autenticacao-e-autorizacao)
- [Obtenção do Access Token](https://developers.mercadolivre.com.br/pt_br/obtencao-do-access-token)
- [Crie uma aplicação no Mercado Livre](https://developers.mercadolivre.com.br/pt_br/crie-uma-aplicacao-no-mercado-livre)
- [Notificações — Developers Mercado Livre](https://developers.mercadolivre.com.br/pt_br/produto-receba-notificacoes)
- [Receive notifications — Global Selling](https://global-selling.mercadolibre.com/devsite/receive-notifications)
- [Manage Claims — Global Selling](https://global-selling.mercadolibre.com/devsite/manage-claims)
- [Gerenciar reclamações](https://developers.mercadolivre.com.br/pt_br/gerenciar-reclamacoes)
- [Gerenciar devoluções](https://developers.mercadolivre.com.br/pt_br/gerenciar-devolucoes)
- [Atributos](https://developers.mercadolivre.com.br/pt_br/atributos)
- [Preditor de categorias](https://developers.mercadolivre.com.br/pt_br/categorizacao-de-produtos)
- [Publicar produtos](https://developers.mercadolivre.com.br/pt_br/publicacao-de-produtos/)
- [Variações](https://developers.mercadolivre.com.br/pt_br/variacoes)
- [Tipos de publicação](https://developers.mercadolivre.com.br/pt_br/tutorial-tipos-de-publicacao-y-atualizacao-de-artigos)
- [Listing types — Global Selling](https://global-selling.mercadolibre.com/devsite/listing-types-and-exposures)
- [Trabalhar com imagens](https://developers.mercadolivre.com.br/pt_br/trabalhar-com-imagens)
- [Validate and upload pictures — Global Selling](https://global-selling.mercadolibre.com/devsite/pictures)
- [Mercado Envios 2](https://developers.mercadolivre.com.br/pt_br/mercado-envios-2)
- [Gerenciamento de envios](https://developers.mercadolivre.com.br/pt_br/gerenciamento-de-envios)
- [Convivência Full e Flex](https://developers.mercadolivre.com.br/pt_br/convivencia-full-e-flex)
- [Estoque distribuído](https://developers.mercadolivre.com.br/pt_br/estoque-distribuido)
- [Envios Fulfillment](https://developers.mercadolivre.com.br/pt_br/envios-fulfillment)
- [Fulfillment — en_us](https://developers.mercadolivre.com.br/en_us/fulfillment)
- [Gestão de packs](https://developers.mercadolivre.com.br/pt_br/gestao-packs)
- [Manage Sales — Global Selling](https://global-selling.mercadolibre.com/devsite/manage-sales-global-selling)
- [Relatórios de faturamento](https://developers.mercadolivre.com.br/relatorios-de-faturamento)
- [Boas práticas — relatórios de faturamento](https://developers.mercadolivre.com.br/pt_br/boas-praticas-para-o-consumo-das-apis-de-relatorios-de-faturamento)
- [Dados para emissão de Nota Fiscal](https://developers.mercadolivre.com.br/pt_br/faturamento)
- [Emitindo Nota Fiscal pelo Mercado Livre](https://developers.mercadolivre.com.br/pt_br/api-fiscal-faturamento-de-venda)
- [Envio de Notas Fiscais para Flex/Turbo/ME1/Drop Off](https://developers.mercadolivre.com.br/pt_br/carregar-nf)
- [Gestão de mensagens pós-venda](https://developers.mercadolivre.com.br/pt_br/mensagens-post-venda)
- [Perguntas e Respostas](https://developers.mercadolivre.com.br/pt_br/perguntas-e-respostas)
- [Boas práticas para usar a plataforma](https://developers.mercadolivre.com.br/pt_br/boas-praticas-para-usar-a-plataforma)
- [Termos e Condições de Uso](https://developers.mercadolivre.com.br/pt_br/termos-e-condicoes)
- [FAQs — Desejo me certificar](https://developers.mercadolivre.com.br/pt_br/faqs-desejo-me-certificar)
- [Developer Partner Program](https://developers.mercadolivre.com.br/pt_br/developer-partner-program)
- [Mercado Pago — Webhooks (referência de padrão de assinatura, sistema distinto do ML marketplace)](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Rollout — Mercado Libre API Essential Guide (fonte secundária)](https://rollout.com/integration-guides/mercado-libre/api-essentials)
- [Rollout — Webhooks em Mercado Libre (fonte secundária)](https://rollout.com/integration-guides/mercado-libre/quick-guide-to-implementing-webhooks-in-mercado-libre)
