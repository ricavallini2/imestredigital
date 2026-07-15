# Panorama 2026 — Integrações de Marketplace (além de Mercado Livre/Shopee)

> Pesquisa técnica para o iMestreDigital (ERP SaaS multi-tenant BR). Foco: Amazon SP-API, Magalu, Shein, TikTok Shop e hubs de integração (Anymarket, Bling, Olist/Tiny, Plugg.to).
> Data da pesquisa: julho/2026. Fontes primárias (documentação oficial) priorizadas; onde só havia fonte secundária, está marcado.

---

## 1. Amazon SP-API (Brasil)

### 1.1 Autenticação (LWA — Login with Amazon)

- Endpoint de token: `POST https://api.amazon.com/auth/o2/token`.
- **Dois grant types**:
  - `grant_type=refresh_token` — fluxo padrão, usado após o seller autorizar o app (via Selling Partner Appstore ou Website Authorization Workflow, no caso de apps públicos, ou self-authorization para apps privados/próprios). Requer `refresh_token` + `client_id` + `client_secret`. Retorna `access_token` (expira em **1 hora**).
  - `grant_type=client_credentials` — chamado de "grantless operations", não precisa de autorização prévia do seller. Usa `scope` em vez de `refresh_token`. Escopos grantless documentados:
    - `sellingpartnerapi::notifications` (Notifications API)
    - `sellingpartnerapi::client_credential:rotation` (Application Management API — rotação de client secret)
- Distinção importante: **apps privados** (uso interno, 1 seller) fazem self-authorization; **apps públicos** (para vender a múltiplos sellers, modelo SaaS) precisam passar pelo fluxo de autorização via Appstore/Website Authorization Workflow — isso implica processo de certificação da Amazon antes de comercializar.

Fonte: [Connecting to the Selling Partner API](https://developer-docs.amazon/sp-api/docs/connecting-to-the-selling-partner-api), [LWA Credentials FAQ](https://developer-docs.amazon.com/sp-api/docs/lwa-credentials-faq)

### 1.2 Rate limits (token bucket) — valores confirmados na doc oficial

A SP-API usa **token bucket**: cada operação tem uma taxa de reposição (req/s) e um "burst" (tamanho do balde). O limite é por **par aplicação+conta do seller** (não é uma cota global do app) e pode ser "estático" (igual pra todo mundo) ou "dinâmico" (ajustado por métricas do seller, não por frequência de uso). O header `x-amzn-RateLimit-Limit` informa o limite vigente por operação, mas nem sempre está presente na resposta.

| API / Operação | Taxa (req/s) | Burst |
|---|---|---|
| Orders `getOrders` | 0.0167 (~1/min) | 20 |
| Orders `getOrder` | 0.5 | 30 |
| Orders `getOrderItems` | 0.5 | 30 |
| Feeds `createFeed` | 0.0083 | 15 (+ limite adicional de 5 submissões/5min para `JSON_LISTINGS_FEED`) |
| Feeds `getFeed` | 2 | 15 |
| Feeds `getFeeds` (lista) | 0.0222 | 10 |
| Feeds `cancelFeed` | 2 | 15 |
| Listings `putListingsItem` | 5/s (conta+app) / 100/s (app) | 5 |
| Listings `patchListingsItem` | 5/s (conta+app) / 500/s (app) | 5 |
| Listings `getListingsItem` | 5/s (conta+app) / 100/s (app) | 5 |
| Listings `deleteListingsItem` | 5/s (conta+app) / 100/s (app) | 5 |

Regra geral: "requests are rate-limited by whichever threshold you reach first" — múltiplos limites (por operação, por relacionamento de produto, por app) podem se aplicar simultaneamente.

Fontes: [Usage Plans and Rate Limits](https://developer-docs.amazon.com/sp-api/docs/usage-plans-and-rate-limits), [Orders API Rate Limits](https://developer-docs.amazon.com/sp-api/docs/orders-api-rate-limits), [Feeds API Rate Limits](https://developer-docs.amazon.com/sp-api/docs/feeds-api-rate-limits), [Listings Items API Rate Limits](https://developer-docs.amazon.com/sp-api/docs/listings-items-api-rate-limits)

**Implicação prática para o ERP**: `getOrders` com 1 req/min sustentado é o gargalo clássico — a estratégia correta é usar `createdAfter`/`LastUpdatedAfter` combinado com **notificações** (seção 1.4) para não depender de polling agressivo, e usar Feeds em lote (não uma chamada por SKU) para updates de preço/estoque.

### 1.3 Feeds vs Listings Items — quando usar cada uma

- **Feeds API (2021-06-30)**: operações em lote/assíncronas (upload de arquivo, processamento em fila, resultado consultado depois via `getFeed`). Indicada para bulk update de milhares de SKUs (preço, estoque, catálogo).
- **Listings Items API (2021-08-01)**: operações síncronas item a item (`putListingsItem` cria/substitui, `patchListingsItem` faz update parcial — JSON Patch). Melhor para updates pontuais e resposta imediata de validação (inclusive endpoint de "validation preview").

### 1.4 MFN vs FBA no Brasil

- **MFN (Merchant Fulfilled Network)** é o termo formal para o que a Amazon hoje chama predominantemente de **FBM (Fulfilled by Merchant)** — são sinônimos na prática atual; a documentação recente da Amazon usa "FBM" com mais frequência, mas a SP-API e os nomes de notificação ainda usam `MFN` (ex.: `LISTINGS_ITEM_MFN_QUANTITY_CHANGE`, endpoint "Subscribe to MFN notifications").
- **FBA no Brasil**: a Amazon opera 12+ centros de fulfillment no Brasil (concentração em SP). Existe também o programa **"Remote Fulfillment with FBA"**, que permite a sellers com estoque nos EUA atender clientes no Canadá, México **e Brasil** sem manter estoque local — relevante para PMEs que já vendem FBA nos EUA e querem expandir para BR sem novo estoque.
- Não foi possível confirmar em fonte oficial se há diferenças de rate limit ou de schema de API entre operar MFN e FBA no marketplace brasileiro especificamente — a documentação de rate limits da SP-API não segmenta por país/fulfillment method, então presume-se que os limites da tabela acima valem igualmente para BR.
- Nota lateral (não crítica para integração): a Amazon descontinuou todos os serviços de "FBA prep" em 1º/jan/2026, e mudou a janela de reembolso automático de FBM de 2 dias úteis para 4 dias corridos a partir de 26/jan/2026 — mudanças operacionais, não de API.

Fontes: [Subscribe to MFN notifications](https://developer-docs.amazon.com/sp-api/docs/subscribe-to-mfn-notifications), [Remote Fulfillment with FBA](https://sell.amazon.com/fulfillment-by-amazon/remote-fulfillment), [The 2026 Guide to Amazon FBM](https://kase.com/blog/guide-to-amazon-fbm-fulfilled-by-merchant/) (fonte secundária para a mudança de refund window)

### 1.5 Notificações (Notifications API + SQS/EventBridge)

- Modelo **event-driven**: em vez de só fazer polling, o app cria uma "destination" (`createDestination`) apontando para uma fila **SQS standard** (não suporta FIFO) ou um **EventBridge** rule/bus, e então assina (`subscribe`) os tipos de evento desejados.
- Tipos de notificação relevantes para e-commerce: `ORDER_CHANGE` (mudança de pedido — o tutorial oficial da Amazon é especificamente sobre assinar esse evento), `LISTINGS_ITEM_STATUS_CHANGE`, `LISTINGS_ITEM_ISSUES_CHANGE`, `LISTINGS_ITEM_MFN_QUANTITY_CHANGE`, `BRANDED_ITEM_CONTENT_CHANGE`, `ITEM_PRODUCT_TYPE_CHANGE`.
- Recomendação de arquitetura: uma "destination" por tipo de recurso (sqs ou eventBridge), não misturar.
- Autenticação para consumir/gerenciar notificações usa o escopo grantless `sellingpartnerapi::notifications` (client_credentials, seção 1.1).

Fontes: [Notifications API — event-driven architecture](https://developer-docs.amazon.com/sp-api/docs/sp-api-event-driven-architecture), [Set up notifications with SQS](https://developer-docs.amazon.com/sp-api/docs/set-up-notifications-with-amazon-sqs), [Set up notifications with EventBridge](https://developer-docs.amazon.com/sp-api/docs/set-up-notifications-with-amazon-eventbridge)

---

## 2. Magalu / Magazine Luiza Marketplace

### 2.1 Estado atual (2026)

- Existe portal developer self-service oficial: **developers.magalu.com** ("Magalu Devs"), com criação de client de aplicação, documentação, roadmap e changelog público de releases.
- Histórico recente de releases confirma evolução ativa da API:
  - **ago/2024**: SAC Release 1 (leitura de tickets/mensagens)
  - **nov/2024**: Produtos/Catálogo — eventos de SKU, atualização parcial, webhooks
  - **dez/2024**: SAC Release 2 (anexos, eventos, logística reversa) e Pedidos (consultas, webhooks, etiquetas)
- Não foi possível confirmar, nas fontes acessadas, releases específicos datados de 2025/2026 — o changelog público mais recente encontrado vai até dez/2024; presume-se que a API continuou evoluindo, mas isso **não está confirmado** com data recente.

### 2.2 Autenticação — OAuth 2.0 Authorization Code

- Fluxo: **Authorization Code** (não há evidência de suporte a `client_credentials` para operações sem seller, ao contrário da Amazon).
- Passos: (1) redirecionar seller para tela de consentimento; (2) login do seller em **ID Magalu**; (3) seller aprova os scopes; (4) redirect de volta com `code`; (5) troca server-to-server do `code` por tokens; (6) refresh via `refresh_token`.
- URL de autorização: `https://id.magalu.com/login?client_id=<ID>&redirect_uri=<URI>&scope=<SCOPES>&response_type=code&choose_tenants=true`
- Endpoint de token: `POST https://id.magalu.com/oauth/token`
- Código de autorização expira em **10 minutos**, uso único.
- `choose_tenants=true` é necessário quando o seller administra múltiplas lojas/CNPJs sob a mesma conta ID Magalu.
- Scopes documentados incluem (granularidade `contexto:recurso:ação`): `open:portfolio:read` (catálogo/preço/SKU/estoque), `open:order-order:read` (pedidos) — e categorias adicionais para invoice (nota fiscal) e logistics (expedição/etiquetas), cujos nomes exatos não foram confirmados no conteúdo acessado.

Fonte: [Autenticação e Autorização — Magalu Devs](https://developers.magalu.com/docs/first-steps/create-an-application/authentication-authorization/index.html), [Como Integrar com as APIs do Grupo Magalu](https://developers.magalu.com/docs/first-steps/create-an-application/)

### 2.3 Caminho de integração para sellers pequenos

- **IntegraCommerce** é citado por múltiplas fontes (FAQs de ERPs concorrentes, hubs) como "o integrador oficial" histórico do marketplace Magalu — mas o portal `developers.magalu.com` sugere que hoje a Magalu também oferece API própria direta (OAuth2 self-service), não apenas via IntegraCommerce.
- **Não foi possível confirmar com certeza** se, em 2026, IntegraCommerce continua sendo obrigatório/preferencial para sellers pequenos ou se é uma camada legada mantida em paralelo à API direta nova. Documentação da IntegraCommerce (`in.integracommerce.com.br/Documentation/Patterns`, `api.integracommerce.com.br`) segue online e ativa, o que sugere convivência dos dois caminhos.
- Para um ERP SaaS como o iMestreDigital, a rota tecnicamente mais robusta e "futureproof" é integrar direto via `developers.magalu.com` (OAuth2 + webhooks), evitando dependência de um integrador terceiro que pode ter sua própria camada de rate limit e defasagem de features.

---

## 3. Shein Marketplace Brasil e TikTok Shop Brasil

### 3.1 Shein

- A Shein **tem uma plataforma OpenAPI global própria e documentada publicamente**: `open.sheincorp.com` (Developer Platform) e `openapi-portal.sheincorp.com`. Cobre publicação/edição de produto, gestão de pedido/fulfillment (incluindo agendamento de entrega e geração de etiqueta), upload de tracking, atualização de status de pedido, e devoluções.
- Autenticação usa **Application ID** (client id) + chave secreta (`open key id` / `secret key`), mas o processo de obtenção de credenciais para o mercado brasileiro passa por **contato direto com o suporte da Shein** (não é um simples "criar app" self-service como Amazon/Magalu) — é preciso solicitar o token de acesso e as chaves manualmente, e há distinção entre ambiente de produção e pré-produção (homologação).
- Isso é consistente com o padrão observado nos hubs (Bling, Olist/Tiny, Omie, Base.com, Plugg.to, Magis5, Anymarket) que já anunciam integração nativa/bidirecional com Shein — a integração sincroniza preço/estoque do ERP para o catálogo Shein, e importa pedidos, mas **só pedidos com pagamento confirmado** (não importa pedidos pendentes de pagamento).
- Contexto de negócio: a Shein projeta somar 40 a 50 mil revendedores brasileiros até o fim de 2026 (fonte secundária/imprensa) — mercado em forte expansão, o que reforça prioridade de integração.
- **Não confirmado**: rate limits específicos, versionamento da API, e se o processo de homologação tem SLA de aprovação previsível para um novo integrador (ERP) que não seja um dos hubs já estabelecidos.

Fontes: [SHEIN Developer Platform](https://open.sheincorp.com/), [Benefits of API Authorization — SHEIN Developer Platform](https://open.sheincorp.com/documents/system/2169474d-1d4a-41a9-b9fd-427f63f54a63), [Bling — Shein marketplace](https://blog.bling.com.br/shein-marketplace/)

### 3.2 TikTok Shop Brasil

- TikTok Shop chegou ao Brasil em **8/maio/2025**. Crescimento relatado: 102x no GMV médio diário no primeiro ano; criadores cresceram 46x em 2026 vs. ano anterior (fontes: newsroom TikTok e imprensa especializada — números de marketing, tratar com cautela).
- Existe **TikTok Shop Partner Center** (`partner.tiktokshop.com`) com portal de developer onboarding self-service:登録 se faz escolhendo região de negócio (campo que só pode ser definido **uma vez**, sem alteração posterior) e mercado-alvo, depois criando um **App & Service** — dois tipos possíveis: **Public App** (publicado na App Store do TikTok Shop, para revenda a múltiplos sellers) ou **Custom App** (uso interno/distribuição direta a sellers específicos, sem publicação na loja de apps).
- **Não foi possível confirmar diretamente na documentação oficial (conteúdo truncado nas tentativas de fetch) se a região Brasil já está disponível como opção selecionável no onboarding de developer** — evidência indireta forte de que sim: hubs brasileiros estabelecidos (Bling, Olist/Tiny, Anymarket, Plugg.to, Magis5, Base.com) já anunciam integração nativa e funcional com TikTok Shop Brasil, o que exige que ao menos essas empresas tenham conseguido credenciamento de app parceiro. Isso sugere que a API já é acessível para BR, mas por canal de parceiro/hub mais do que auto-serviço amplamente divulgado para qualquer ERP pequeno.
- Pelo menos um ERP menor (Data System) relatou publicamente, em conteúdo consultado, que **ainda não tinha** integração direta com TikTok Shop — confirma que nem todo ERP consegue/tem essa integração pronta, reforçando que o caminho de homologação tem barreira de entrada (processo de aprovação, não é instantâneo).

Fontes: [TikTok Shop Partner Center — Developer Onboarding](https://partner.tiktokshop.com/docv2/page/developer-onboarding), [TikTok Shop cresce 102 vezes — Newsroom TikTok](https://newsroom.tiktok.com/tiktok-shop-cresce-102-vezes-em-seu-primeiro-ano-no-brasil?lang=pt-BR), [Integração TikTok Shop — TecnoSpeed](https://blog.tecnospeed.com.br/integracao-tiktok-shop/)

---

## 4. Hubs de integração (Anymarket, Bling, Olist/Tiny, Plugg.to)

### 4.1 Modelo geral: hub vs. integração direta

Um **hub** (Anymarket, Plugg.to, e o módulo de marketplace do Bling/Tiny) atua como camada intermediária: você integra **uma vez** com o hub (via API própria dele) e o hub já mantém as integrações individuais com dezenas/centenas de marketplaces, absorvendo mudanças de schema, rate limit e regras de cada canal.

| | Hub | Integração direta |
|---|---|---|
| **Esforço inicial** | Baixo — 1 integração cobre N marketplaces | Alto — 1 integração por marketplace (auth, schema, rate limit, webhooks próprios) |
| **Manutenção contínua** | Responsabilidade do hub (breaking changes absorvidas por ele) | Responsabilidade do próprio ERP — precisa acompanhar changelogs de cada marketplace |
| **Custo recorrente** | Mensalidade do hub (R$50–900+/mês) somada às taxas do próprio marketplace | Sem mensalidade de terceiro, mas custo de engenharia (dev + manutenção) é maior |
| **Latência/controle de dados** | Uma camada a mais (pode atrasar sincronismo de estoque/pedido em minutos) | Tempo real, sem intermediário |
| **Cobertura de marketplace novo/nicho** | Depende do hub já ter feito a integração (nem sempre cobre 100% dos recursos da API nativa) | Cobertura total das capacidades da API do marketplace |
| **Diferenciação competitiva do ERP** | Baixa — todo mundo usando o mesmo hub tem a mesma limitação | Alta — permite features exclusivas (ex.: IA sobre dados de pedido em tempo real) |

### 4.2 Anymarket

- Planos por volume: **Standard** (6 contas de marketplace, 5.000 SKUs, 5 usuários), **Performance** (10 contas, 10.000 SKUs, 8 usuários), **Enterprise** (20 contas, 20.000 SKUs, 15 usuários). Preços não publicados no site — modelo "consulte" — mas fonte de mercado indica planos a partir de **R$399/mês**.
- Mais de 100–150 marketplaces integrados (o número varia entre fontes: 100 vs 150+), incluindo mais de 30 plataformas de e-commerce/ERP (VTEX, Nuvemshop, Tray, Magento, etc.).
- Acesso à própria API do Anymarket (para backoffice e para marketplaces) só é liberado nos planos Performance/Enterprise — plano de entrada (Standard) não tem API própria liberada, o que é uma limitação relevante se o objetivo é o ERP se conectar programaticamente.

Fontes: [Planos ANYMARKET](https://anymarket.com.br/planos/), [Developer Platform Anymarket](https://developers.anymarket.com.br/api/v2)

### 4.3 Bling

- Alteração de planos em abril/2026: **Cobalto** R$55/mês, **Mercúrio** R$110/mês, **Titânio** R$185/mês, **Platina** R$450/mês, **Diamante** R$650/mês (fonte: comunicado oficial Bling + agregadores — números batem entre fontes).
- Diferenciação entre planos é principalmente por **limite de importação de pedidos/mês** vindos de integrações (marketplace, API) — pedidos manuais, PDV e loja virtual própria não consomem esse limite.
- Bling é ao mesmo tempo ERP completo (emissão de NF-e, financeiro) e hub de marketplace — não é um hub "puro"; é a opção mais popular para PMEs que querem uma ferramenta só.

Fontes: [Planos e Preços — Bling](https://www.bling.com.br/planos-e-precos), [Alteração nos planos e preços do Bling em abril de 2026](https://ajuda.bling.com.br/hc/pt-br/articles/30224184866583-Altera%C3%A7%C3%A3o-nos-planos-e-pre%C3%A7os-do-Bling-em-abril-de-2026)

### 4.4 Olist (Tiny ERP)

- Planos 2026 (fonte secundária consolidada, não confirmada em página oficial de preços durante esta pesquisa): **Avance** R$59/mês (R$49 anual), **Construa** R$159/mês (R$119 anual), **Impulsione** R$349/mês (R$259 anual), **Domine** R$849/mês (R$639 anual).
- Diferencial de posicionamento vs. Bling: pedidos/notas/usuários **ilimitados** em todos os planos — a diferenciação é por outras features (multi-depósito, automações, suporte), não por cota de pedidos. Isso dá previsibilidade de custo melhor para operação que cresce em volume de pedidos mas não quer trocar de plano com frequência.
- Tiny também integra nativamente com hubs terceiros (Anymarket, Plugg.to) — ou seja, dá pra usar Tiny como ERP e ainda assim usar um hub por cima para marketplaces que o Tiny não cobre nativamente.

### 4.5 Plugg.to

- Modelo de preço mais favorável a quem quer integrar muitos canais: mensalidade fixa **a partir de ~R$54/mês** (plano básico) e, a partir do plano **Pro**, **sem taxa adicional por marketplace conectado** — você paga um valor fixo e conecta quantos canais quiser.
- Mais de 80 marketplaces/canais suportados, incluindo Amazon, Mercado Livre, Shopee, Magalu, Carrefour, iFood, Rappi, Dafiti, Netshoes, Renner, Riachuelo, C&A, Kanui, Consulta Remédios.
- Modelo de preço é o inverso do Anymarket (que cobra por faixa de SKU/conta) — Plugg.to aposta em previsibilidade de custo mesmo com catálogo grande, desde que o gargalo não seja SKU mas sim número de canais.

**Ressalva geral sobre preços dos hubs**: valores de Anymarket, Bling e Olist mudaram pelo menos uma vez em 2026 (Bling em abril/2026); todos os preços acima devem ser tratados como referência de ordem de grandeza, não cotação vigente — confirmar diretamente no site de cada fornecedor antes de orçamento.

---

## 5. Recomendação de prioridade de integração para o iMestreDigital

Critérios: (a) maturidade/estabilidade da API oficial, (b) alcance de mercado no Brasil, (c) esforço de implementação, (d) já ter contrato existente com hub que reduz esforço.

1. **Continuar priorizando Mercado Livre e Shopee** (já no roadmap conforme `docs/design/` e Fase 3 do plano interno) — maior volume de GMV no Brasil, APIs maduras.
2. **Shein Marketplace (via API direta ou hub já contratado)** — prioridade alta: crescimento anunciado agressivo (40–50 mil revendedores até fim de 2026), API OpenAPI documentada publicamente, mas onboarding exige contato manual com suporte Shein — recomendado iniciar solicitação de credenciais cedo, pois o lead time de aprovação é desconhecido e pode ser o gargalo real, não o desenvolvimento em si.
3. **TikTok Shop Brasil** — prioridade média-alta: crescimento explosivo confirmado por múltiplas fontes, mas API própria tem barreira de homologação (Public App exige processo de review da TikTok, similar a app store); caminho mais rápido no curto prazo é integrar via um hub que já tenha credenciamento (Anymarket/Plugg.to/Bling) enquanto se avalia se vale o esforço de virar "Custom App" homologado direto.
4. **Amazon SP-API (Brasil)** — prioridade média: API extremamente madura e bem documentada (a mais madura de todas pesquisadas), mas rate limits agressivos (ex.: `getOrders` a 1 req/min) tornam obrigatório desenhar desde o início com **Notifications API + SQS/EventBridge** em vez de polling — maior esforço de engenharia inicial (infra AWS do lado do ERP para consumir fila/eventos), porém uma vez feito é o mais estável a longo prazo. Amazon Brasil ainda tem GMV menor que Mercado Livre/Shopee para a maioria das categorias de PME, o que justifica vir depois desses.
5. **Magalu Marketplace** — prioridade média: API OAuth2 própria documentada e webhooks disponíveis, mas o histórico de changelog público mais recente confirmado é de dez/2024 (não foi possível confirmar atividade de release em 2025/2026), e há ambiguidade sobre o papel do IntegraCommerce hoje — recomenda-se um pequeno spike técnico (criar client de teste em developers.magalu.com) antes de comprometer sprint cheio, para validar se a doc pública está atualizada e completa.

**Sobre usar hub vs. integração direta**: para o iMestreDigital como produto SaaS que vende a terceiros (não é operação própria de e-commerce), a recomendação é **integração direta com Mercado Livre, Shopee e Amazon** (onde o volume de tenants justifica o investimento e a API é estável), e **avaliar hub (Plugg.to pelo modelo de preço fixo, ou Anymarket pelo alcance) como atalho tático para Shein, TikTok Shop e Magalu no curto prazo**, migrando para integração direta desses três conforme a base de clientes crescer e o custo por tenant do hub deixar de compensar frente ao custo de manutenção própria.

---

## 6. O que não foi possível confirmar (lacunas explícitas)

- Rate limits atuais **exatos** por operação da API do Magalu (não documentados publicamente nas páginas acessadas — só a estrutura de scopes/OAuth foi confirmada).
- Rate limits e SLA de homologação da API da Shein para um novo integrador não-hub.
- Se a região "Brasil" já aparece formalmente como opção no onboarding self-service do TikTok Shop Partner Center (inferido indiretamente via hubs já integrados, não confirmado na doc oficial acessada).
- Atividade de release da API Magalu em 2025/2026 (changelog público mais recente confirmado é dez/2024).
- Preços atuais exatos e vigentes de Anymarket (site oficial não publica valor, só "consultar") e confirmação em página oficial de preços da Olist Tiny em 2026 (dado veio de fonte agregadora, não da página oficial da Olist).
- Diferenças de rate limit/comportamento de API entre MFN e FBA especificamente no marketplace brasileiro da Amazon (a documentação de rate limits não segmenta por país/fulfillment method).
