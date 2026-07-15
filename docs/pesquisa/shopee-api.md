# Pesquisa técnica — Shopee Open Platform v2 (integração de ERP, Brasil, 2026)

> **Status da pesquisa**: baseada em documentação de terceiros (SDKs open-source que fazem cobertura declarada de 100% dos endpoints v2), artigos de integradores e páginas do Seller Education Hub BR. **Não foi possível acessar diretamente `open.shopee.com/documents`** (bloqueio de fetch no ambiente de pesquisa) nem o Postman workspace oficial da Shopee — portanto vários valores numéricos (rate limit exato, prazos de token) vêm de fontes secundárias consistentes entre si, mas **precisam ser confirmados no painel do Open Platform antes de virar contrato de código**. Cada seção abaixo marca explicitamente o que é confirmado vs. inferido.
>
> Data da pesquisa: julho/2026.

---

## 0. Fontes usadas

- SDK TypeScript `congminh1254/shopee-sdk` (declara cobertura de 100% dos endpoints v2, documentação em `docs/managers/*.md`) — fonte primária secundária mais estruturada encontrada.
- `wendeehsu.medium.com` — walkthrough de autenticação shop-level.
- `developer.inlinex.com.sg` — guia de integração para sellers (auth, sign, rate limit, endpoints).
- `rollout.com/integration-guides/shopee` — guia de webhooks e API essentials.
- Seller Education Hub Shopee BR (`seller.shopee.com.br/edu/...`) — regras de NF-e, CNPJ/CPF, emissor de nota fiscal.
- Artigos de contabilidade/ERP BR (Tactus, MCO, FiscalPro, Qive) — cruzamento sobre obrigatoriedade de NF-e.
- **Não confirmado por fonte oficial primária** (`open.shopee.com`): marcado item a item abaixo.

---

## 1. Registro de app e autorização shop-level

### 1.1 Registro do app (Partner)
- Cadastro como "Third-party Partner Platform" no Open Platform exige: empresa registrada com documentos legais válidos, produto já em produção/uso real (não é só uma prova de conceito), URL do produto em HTTPS/TLS 1.2, e conta de teste (trial account) para a Shopee validar a integração antes de aprovar.
- Ao aprovar, a Shopee fornece **`partner_id`** e **`partner_key`** (secret usado no HMAC). *(Não confirmado oficialmente: prazo de homologação e se há sandbox/UAT self-service — fontes mencionam ambientes "test/uat/live" mas sem detalhar o processo de solicitação de sandbox.)*

### 1.2 Fluxo de autorização (shop authorization)
Fluxo típico de 3 passos, análogo a OAuth2 mas com sign próprio da Shopee (não é Bearer/OAuth padrão):

1. **Gerar link de autorização** — o partner monta uma URL para `https://partner.shopeemobile.com/api/v2/shop/auth_partner` assinada com HMAC, e redireciona o lojista (seller) para autenticar e conceder acesso à loja.
   - **O link de autorização é válido por apenas 5 minutos** — deve ser gerado sob demanda, não cacheado.
2. **Callback com `code` + `shop_id`** — após o seller aprovar, a Shopee redireciona para a `redirect_url` configurada com `code` (código temporário) e `shop_id`.
3. **Troca do `code` por tokens** — chamada a `POST /api/v2/auth/token/get` (host `partner.shopeemobile.com`) enviando `code`, `shop_id`, `partner_id`, retornando `access_token` e `refresh_token`.

### 1.3 Assinatura (sign / HMAC-SHA256)
Toda requisição à API precisa de um parâmetro `sign` calculado assim:
- **Base string**: concatenação de `partner_id + path + timestamp` (chamadas públicas, ex.: geração do token) **ou** `partner_id + path + timestamp + access_token + shop_id` (chamadas autenticadas de shop).
- **Algoritmo**: HMAC-SHA256, usando `partner_key` como chave secreta, aplicado sobre a base string.
- O `sign` resultante (hex) é enviado como query param junto com `partner_id`, `timestamp`, `access_token`, `shop_id`.
- **Cuidado operacional citado pelas fontes**: o ambiente (`test`/`uat`/`live`) do `partner_id`+`partner_key`+host precisa ser consistente entre si, e o `timestamp` usado no cálculo do sign deve bater exatamente com o enviado na requisição (tolerância de clock-skew não confirmada).

### 1.4 Validade dos tokens
- **`access_token`: 4 horas** (mencionado de forma consistente em múltiplas fontes independentes — Medium, InlinexDev, guia de sign/token).
- **`refresh_token`: 30 dias** (1 mês) — necessário chamar o endpoint de refresh antes de expirar; se o `refresh_token` expirar, é preciso repetir o fluxo completo de autorização (o seller precisa re-autenticar).
- Endpoint de refresh não teve o path exato confirmado nas fontes consultadas, mas segue o mesmo host (`partner.shopeemobile.com`) e módulo `/api/v2/auth/access_token/get` *(nome inferido por convenção do SDK — confirmar no painel oficial)*.

**Confirmar oficialmente antes de implementar em produção**: nomes exatos de todos os paths de `/auth/*`, se existe rota dedicada BR (`partner.shopeemobile.com` vs. algum host regional), e política de expiração exata em caso de app "test" vs. "live".

---

## 2. Products (catálogo)

Cobertura via `ProductManager` (SDK):

| Operação | Descrição |
|---|---|
| `add_item` | Cria produto. Campos: nome, descrição, `category_id`, preço, estoque, até **9 imagens** (por `image_id`, upload prévio), dimensões (comprimento/largura/altura), peso, config. logística, atributos da categoria. Retorna `item_id` + warnings. |
| `update_item` | Atualiza nome, descrição, preço, estoque; permite atualização seletiva de atributos sem reenviar o produto inteiro. |
| `get_category` | Retorna árvore de categorias (raiz ou filhas de um `category_id` pai), com suporte a idioma. |
| `get_attributes` (`getAttributeTree`) | Atributos obrigatórios/opcionais por categoria — tipo (texto, dropdown, combo box), obrigatoriedade, valores permitidos. Necessário para compliance de listagem (isso cobre os campos BR-específicos, mas o SDK não documenta atributos BR nominalmente). |
| `init_tier_variation` | Configura produto com variações (tier, ex.: cor/tamanho): nomes de tier, lista de opções (com imagem opcional por opção), combinações de modelo com SKU, estoque e preço próprios. **Não permite editar tier/variation já existentes via essa mesma chamada** — para variações existentes usar update_stock/update_price por `model_id`. |
| `update_stock` | Atualiza estoque por produto ou por `model_id` (variação). Até **50 variações por chamada** (limite citado por uma fonte, não confirmado oficialmente). |
| `update_price` | Atualiza preço (produto simples ou por `model_id`). |
| `get_brand_list` | Lista marcas filtráveis por categoria (necessário quando a categoria exige marca obrigatória). |
| Upload de imagens | Fluxo de duas etapas: upload da imagem para o CDN da Shopee primeiro (endpoint de media, não detalhado nas fontes) → obtém `image_id` → referencia no payload de `add_item`/`update_item`. |

**Não confirmado**: nomes exatos de endpoints de upload de mídia (`media_space` vs `product` module), limite exato de chamadas de `update_stock`/`update_price` por minuto, e lista completa de atributos obrigatórios específicos do Brasil (NCM/CEST não aparecem no fluxo de catálogo — eles aparecem no fluxo fiscal, ver seção 7).

---

## 3. Orders (pedidos)

Cobertura via `OrderManager`:

### 3.1 Listagem e detalhe
- **`get_order_list`**: parâmetros principais — `time_range_field` (`create_time` ou `update_time`), `time_from`/`time_to` (timestamps Unix), `page_size` (máx. **100**), `cursor` (paginação cursor-based com `next_cursor`/`more`), `order_status` (filtro opcional).
- **`get_order_detail`**: até **50 `order_sn` por chamada**, com `response_optional_fields` para pedir campos específicos (`buyer_username`, `item_list`, `recipient_address`, etc.).

### 3.2 Status flow
Sequência observada nas fontes: **`UNPAID` → `READY_TO_SHIP` → `PROCESSED` → `SHIPPED` → `COMPLETED`**, com desvio possível para **`CANCELLED`**. Estado adicional citado: `INVOICE_PENDING` (relevante para o fluxo fiscal BR — ver seção 7).

### 3.3 Cancelamento
- **`cancel_order`**: parâmetros `order_sn`, `cancel_reason` (códigos como `OUT_OF_STOCK`, `CUSTOMER_REQUEST`), `item_list` (itens específicos, para cancelamento parcial).
- Restrição: só permite cancelamento de pedidos não pagos, ou com consentimento do comprador.
- **`handle_buyer_cancellation`**: aceitar/rejeitar pedido de cancelamento iniciado pelo comprador.

### 3.4 Devoluções / reembolso
- Existe um manager dedicado, **`ReturnsManager`**, descrito genericamente como responsável por "return and refund request management" — **não foi possível confirmar os nomes exatos dos endpoints** (esperado algo como `return.get_return_list` / `return.get_return_detail` / `return.confirm` por convenção de outros módulos, mas nenhuma fonte consultada documentou os nomes reais). **Ação recomendada**: validar diretamente no console do Open Platform ou usar o código-fonte do SDK (não apenas a doc gerada) antes de implementar.

---

## 4. Logistics (envio, etiquetas, first-mile)

Cobertura via `LogisticsManager` + `FirstMileManager`:

### 4.1 Fluxo padrão doméstico
1. **`get_shipping_parameter`**: parâmetros necessários para iniciar o envio de um pedido — retorna requisitos de pickup/dropoff e horários disponíveis.
2. **`ship_order`**: inicia a logística do pedido, com 3 modos:
   - **pickup** — transportadora busca no endereço configurado da loja;
   - **dropoff** — seller entrega em um ponto/filial do parceiro logístico;
   - **non-integrated** — registro manual de código de rastreio (transportadora própria).
3. **`get_tracking_number`**: retorna código de rastreio e número de etiqueta pré-impressa (PLP).
4. **`get_tracking_info`**: histórico detalhado de eventos de rastreio com status e timestamps.

*(Não confirmado: endpoint específico de geração/download do PDF da etiqueta doméstica — as fontes tratam disso de forma indireta via `get_tracking_number`; para first-mile cross-border o fluxo de waybill é diferente, ver 4.2.)*

### 4.2 First-mile (cross-border, ex. CN/KR — não parece ser o fluxo padrão de sellers BR locais)
- `get_channel_list`, `get_courier_delivery_channel_list` — canais/transportadoras disponíveis por região.
- `generate_first_mile_tracking_number` — até **20 tracking numbers por dia de declaração**.
- `bind_first_mile_tracking_number` — vincula pedidos a um tracking number (máx. **50 pedidos por chamada**, **10.000 pedidos no total por tracking number**).
- `get_waybill` — retorna PDF em **base64**, até **50 tracking numbers por requisição**.
- Métodos de envio: `pickup`, `dropoff`, `self_deliver`, `courier_delivery`.
- Status flow: `ORDER_CREATED` → `PICKED_UP` → `DELIVERED` → `ORDER_RECEIVED` (ramos possíveis `CANCELING`/`CANCELED`).

**Relevância para o ERP**: como o iMestreDigital atende sellers brasileiros vendendo no marketplace BR, o fluxo relevante é majoritariamente o **doméstico (4.1)** — o First-Mile (4.2) é para sellers que despacham de CN/KR para outros mercados, não deve ser o caminho principal de implementação salvo necessidade específica de cross-border.

---

## 5. Push / Webhooks

- Configuração feita no **console do Open Platform**, seção "Push Mechanism" — necessário informar e verificar uma **callback URL** para "live push".
- Eventos citados pelas fontes: **`order_status_push`**, **`order_trackingno_push`**, **`package_fulfillment_status_push`**.
- Um artigo cita um formato de payload com `event: "ORDER_STATUS_UPDATE"` contendo `order_sn` e `status` — **não é possível confirmar se esse é o schema real de 2026** ou uma simplificação do artigo.
- **Verificação de assinatura do webhook**: HMAC-SHA256 usando a `partner_key`, valor enviado no header **`x-shopee-signature`** — o endpoint receptor deve validar antes de processar. *(Confirmar formato exato da base string usada pela Shopee para assinar o push — não documentado em nenhuma fonte consultada.)*
- Existe um `PushManager` no SDK descrito apenas como responsável por "webhook and push notification configuration" (provavelmente para configurar a callback URL via API, não para consumir eventos).

**Não confirmado**: lista completa/oficial de todos os tipos de push disponíveis em 2026 (produto, promoção, saldo, etc.), schema JSON completo de cada evento, e política de retry da Shopee em caso de falha no endpoint do parceiro.

---

## 6. Rate limits

- Fonte mais específica encontrada: **10 requisições por segundo por loja (shop-level)**, equivalente a ~600/min, para a maioria dos endpoints.
- Uma fonte secundária menciona "100 requisições por minuto" sem especificar se é por shop ou por partner — **valor inconsistente com a fonte de 10 req/s**, tratar com cautela.
- **Não confirmado oficialmente**: se o limite é uniforme entre todos os endpoints ou se há limites diferenciados por família (ex.: `get_order_list` vs `add_item` vs endpoints de mídia costumam ter budgets próprios em outras plataformas de marketplace — Shopee provavelmente segue padrão similar, mas isso não foi confirmado para v2 em 2026).
- **Ação recomendada antes de dimensionar o worker de sincronização**: consultar a aba "API Rate Limit" no painel do parceiro (geralmente exposta por endpoint/grupo após login), pois esses limites podem variar por tier de parceiro e por país.

---

## 7. Particularidades do marketplace BR (CPF/CNPJ, NF-e)

Este é o ponto mais crítico para o ERP e felizmente o mais bem documentado nas fontes em português:

### 7.1 CPF vs CNPJ
- Vendedores pessoa física (CPF) podem operar na Shopee BR, mas **a partir de faturamento anual ≥ R$ 81 mil, a legislação exige CNPJ e emissão de nota fiscal**.
- A Shopee só libera a emissão de nota fiscal pelo próprio "Emissor de Nota Fiscal" da plataforma para quem tem CNPJ.
- Política de comissão distinta para vendedores CNPJ vs. CPF em 2026 (fonte: Seller Education Hub) — relevante para cálculo de custos no módulo financeiro, mas fora do escopo de API.

### 7.2 NF-e é obrigatória para liberar o envio
- **Confirmado por cruzamento de múltiplas fontes**: mesmo quando não há obrigatoriedade legal (ex. CPF/MEI abaixo do limite), a Shopee **exige que o vendedor esteja pronto para emitir NF-e por CNPJ**, porque a etiqueta de envio só é liberada após a nota fiscal ser validada.
- **Endpoint identificado**: **`upload_invoice_doc`** — usado pelo seller/ERP para **enviar ou consultar a nota fiscal (XML da NF-e)** de um pedido. Fluxo citado: antes do despacho no Brasil, é **obrigatório enviar a NF via `upload_invoice_doc`**, e **o pedido só avança para o status de envio depois que a Shopee valida a nota junto à SEFAZ**.
- Isso implica no ERP: o pedido pode ficar "preso" num estado tipo `INVOICE_PENDING` (citado na seção 3.2) até a NF-e ser aceita pela SEFAZ e o XML/dados serem enviados de volta à Shopee — **fluxo de integração precisa orquestrar**: `order-service` (novo pedido) → `fiscal-service` (emite NF-e via SEFAZ) → chamada a `upload_invoice_doc` na Shopee → só então `logistics.ship_order`.
- **Dados fiscais exigidos no XML/processo**: **NCM** (Nomenclatura Comum do Mercosul), **CEST** (Código Especificador da Substituição Tributária) e **CFOP** (Código Fiscal de Operações e Prestações) — precisam estar configurados por produto/categoria antes da emissão.
- Requisitos adicionais citados por fontes contábeis: **certificado digital A1** e **inscrição estadual** ativa.

### 7.3 FBS (Fulfilled by Shopee) — fluxo de nota fiscal diferente
- Para operações FBS, o fluxo de invoice é assíncrono via job: `generate_fbs_invoices` (parâmetros: datas início/fim, `document_type`, `file_type` — valor `3` retorna PDF **e** XML, `document_status`) → polling em `get_fbs_invoices_result` até status **`READY`** → download do documento.
- **Link de download expira 30 minutos** após gerado.
- Existe também **`get_buyer_invoice_info`**, citado como específico para regiões como Brasil e Polônia — provavelmente retorna dados do comprador necessários para emissão da NF-e (razão social/CPF-CNPJ do destinatário), mas **o schema de resposta não foi confirmado** nas fontes consultadas.

### 7.4 Integração de mercado já existente
- Fontes confirmam que ERPs brasileiros estabelecidos (Bling, Tiny, Qive) já possuem integração de emissão de NF-e centralizada com a Shopee — sugerindo que o fluxo `upload_invoice_doc` é maduro e estável, útil como referência de implementação (engenharia reversa de comportamento, já que a doc oficial não foi acessível nesta pesquisa).

**Não confirmado**: schema exato do XML esperado por `upload_invoice_doc` (se é o XML padrão da NF-e assinado digitalmente, ou um payload JSON com campos extraídos), tempo máximo de SLA da validação SEFAZ-via-Shopee, e comportamento em caso de rejeição da nota (cancelamento automático do pedido vs. reenvio).

---

## 8. Lacunas a resolver antes de implementar (checklist)

1. Confirmar no console oficial (`open.shopee.com`, requer login de parceiro) os **paths exatos** de: `/auth/token/get`, `/auth/access_token/get` (refresh), `upload_invoice_doc`, e todo o módulo `return.*`.
2. Confirmar **rate limit real** por endpoint/grupo (10 req/s é a melhor estimativa disponível, mas não oficial).
3. Confirmar **schema completo do webhook** (`x-shopee-signature`, payload JSON, lista de `push_type` disponíveis) — decisivo para o `notification-service` e para atualização de status em tempo real no `order-service`.
4. Confirmar **schema exato aceito por `upload_invoice_doc`** (XML da NF-e vs. campos estruturados) junto ao time fiscal, pois isso concatena diretamente com o `fiscal-service` (NF-e/SEFAZ) já existente no monorepo.
5. Validar se existe **endpoint/host dedicado para o Brasil** ou se tudo passa por `partner.shopeemobile.com` global.
6. Confirmar **atributos obrigatórios por categoria específicos do Brasil** (o `get_attributes`/`get_category` deve embutir isso, mas precisa teste real com uma categoria BR).

---

## Resumo executivo (10 linhas)

1. Auth é shop-level: link de autorização (5 min de validade) → `code`+`shop_id` → troca por `access_token` (4h) e `refresh_token` (30 dias) via `partner.shopeemobile.com/api/v2/auth/*`.
2. Toda chamada exige `sign` = HMAC-SHA256 de `partner_id+path+timestamp[+access_token+shop_id]` usando o `partner_key`.
3. Produtos: `add_item`/`update_item` (até 9 imagens), `get_category`/`get_attributes` por categoria, `init_tier_variation` para variações, `update_stock`/`update_price` por `model_id`.
4. Pedidos: `get_order_list` (paginação cursor, até 100/página) e `get_order_detail` (até 50 `order_sn`); status `UNPAID→READY_TO_SHIP→PROCESSED→SHIPPED→COMPLETED`, com `CANCELLED` e `INVOICE_PENDING` (BR).
5. Cancelamento via `cancel_order`/`handle_buyer_cancellation`; devoluções via `ReturnsManager`, mas **nomes de endpoint não confirmados** nesta pesquisa.
6. Logística doméstica: `get_shipping_parameter` → `ship_order` (pickup/dropoff/non-integrated) → `get_tracking_number`/`get_tracking_info`; First-Mile (cross-border CN/KR) tem fluxo à parte com waybill em base64, provavelmente não se aplica a sellers BR locais.
7. Push/webhook: configurado no console ("Push Mechanism"), eventos incluem status de pedido e rastreio, assinatura via header `x-shopee-signature` — **schema JSON completo não confirmado**.
8. Rate limit mais citado: **10 req/s por loja**; há menção divergente de "100/min" — **precisa confirmação oficial**.
9. Brasil: NF-e é **obrigatória para liberar o envio** — endpoint `upload_invoice_doc` envia a NF-e, e o pedido só avança para envio após validação SEFAZ via Shopee; exige NCM/CEST/CFOP configurados, CNPJ, certificado digital A1 e inscrição estadual.
10. Maior risco para o roadmap do iMestreDigital: o acoplamento `fiscal-service` (emissão NF-e) → `upload_invoice_doc` (Shopee) → `ship_order` precisa de orquestração de estado (`INVOICE_PENDING`) — recomenda-se validar o schema exato junto ao time fiscal e ao console oficial antes de desenhar o contrato do `marketplace-service`.
