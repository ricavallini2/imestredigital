# Stack Node.js/TypeScript para emissão de NF-e (mod. 55) e NFC-e (mod. 65) — 2026

> Pesquisa técnica para embasar a implementação de emissão fiscal própria no
> `fiscal-service` (NestJS 10) do iMestreDigital. Data da pesquisa: julho/2026.
> Fontes primárias priorizadas (SEFAZ, npm, GitHub); onde não foi possível
> confirmar com fonte oficial 2026, está marcado explicitamente em **⚠️ Não
> confirmado**.

---

## 1. Bibliotecas Node ativas para DF-e

| Biblioteca | Repo | Licença | Última atividade | Cobre | Maturidade |
|---|---|---|---|---|---|
| **nfewizard-io** | `nfewizard-org/nfewizard-io` (monorepo modular) | GPL-3.0 | Pacotes `@nfewizard/*` publicados nos últimos 1-2 meses (2025-2026) | XML, assinatura, transmissão SOAP, eventos (cancelamento, carta de correção, ciência da operação), consulta de protocolo, Distribuição DFe, NFC-e (`@nfewizard/nfce`), DANFE (`@nfewizard/danfe`, pacote separado), validação XSD com mensagens de erro humanizadas | **Mais ativa do ecossistema hoje.** 272 stars / 43 forks, múltiplos contribuidores ativos. Suporta NT 2025.002 v1.35 (Reforma Tributária). Arquitetura modular reduz bundle até 77% |
| **node-dfe** (`lealhugui/node-dfe`) | GitHub | não confirmada explicitamente na busca | **Última publicação npm: ~2 anos atrás (v0.0.25)** | Emissão NF-e/NFC-e mod. 55/65, síncrono e assíncrono, todos os estados | Historicamente citada como referência, mas **parece abandonada/estagnada** — risco para novo projeto |
| **node-mde** (`lucashpmelo/node-mde`) | GitHub | ⚠️ não confirmada | ⚠️ não confirmada | Apenas Distribuição DFe / Manifestação do Destinatário (consulta NF-e destinada + eventos de manifestação) — **não emite**, só consulta/manifesta | Escopo estreito, complementar |
| **djf-nfe** | — | ⚠️ **Não foi possível localizar/confirmar este pacote nas buscas realizadas.** Pode estar depreciado, renomeado, ou ser uma referência desatualizada | — | — |
| **brasil-interface** | — | ⚠️ **Não localizado nas buscas.** Não aparece nos resultados de npm/GitHub pesquisados; possivelmente confundido com outro pacote (ex. `brasil-js/danfe`, que existe e é analisado na seção 6) | — | — |

**Conclusão da seção:** o único projeto com sinais claros de manutenção ativa e cobertura ampla em 2026 é o **ecossistema nfewizard-io** (agora modularizado em pacotes `@nfewizard/*` — note que existiram nomes de pacote inconsistentes entre `@nfewizard-io/nfce` e `@nfewizard/nfce`, então confirme o escopo correto no momento da instalação). `node-dfe` é utilizável como referência de estrutura de payload, mas não deve ser dependência de produção sem fork ativo. `djf-nfe` e `brasil-interface` não puderam ser verificados — trate como não confiáveis até prova em contrário.

Recomendação prática: mesmo usando nfewizard-io como referência/inspiração, para um SaaS multi-tenant com múltiplos certificados A1 por tenant, é comum acabar **construindo camada própria por cima** (a lib resolve XML/assinatura/transmissão, mas o gerenciamento de certificados por tenant, filas, retries e persistência é sempre customizado).

---

## 2. Assinatura XMLDSig em Node

### xml-crypto
- Suporta **SHA1, SHA256, SHA512** para digest e **RSA-SHA1, RSA-SHA256, RSA-SHA512** para assinatura — a lib não impõe algoritmo, quem decide é o schema de destino (SEFAZ).
- Canonicalização padrão: **Exclusive Canonicalization** (`http://www.w3.org/2001/10/xml-exc-c14n#`), que é o exigido pelo padrão de NF-e.
- **⚠️ Vulnerabilidade crítica confirmada**: CVE-2025-29775 / CVE-2025-29774 ("SAMLStorm") — bypass de verificação de assinatura via manipulação de comentários dentro do `DigestValue`. Corrigido nas versões **2.1.6, 3.2.1 e 6.0.1+**. **Ação obrigatória**: fixar `xml-crypto` em versão ≥ essas, nunca usar versão antiga só porque "funciona".
- Essa CVE é sobre *verificação* (consumo de assinatura de terceiros, cenário SAML/SSO) — o caso de uso do fiscal-service é majoritariamente *emissão* (assinar XML próprio), que é menos exposto a esse vetor, mas a mesma dependência deve estar atualizada de qualquer forma.

### O algoritmo exigido pela SEFAZ é RSA-SHA1 (não SHA256)
- Confirmado via Nota Técnica sobre PAA (Provedor de Assinatura e Autorização) da SEFAZ: **"a aplicação do PAA deve assinar o conteúdo do atributo Id da NFe/Evento com padrão de assinatura assimétrica RSA-SHA1"**, com `SignatureValue` em base64 e chave pública no grupo `RSAKeyValue` (padrão XML Signature).
- Isso é **contraintuitivo** — RSA-SHA1 é criptograficamente fraco e depreciado em quase todo outro contexto (TLS, SAML), mas o padrão de assinatura de NF-e no Brasil **ainda usa SHA-1 no digest/signature em 2026** por compatibilidade histórica com o schema XMLDSig definido há a duas décadas pela SEFAZ. Isso é uma particularidade regulatória, não uma falha de implementação.
- **⚠️ Recomendação**: confirmar esse ponto contra o Manual de Orientação do Contribuinte (MOC) vigente antes de codificar — a fonte encontrada (Nota Técnica sobre PAA) é consistente com o conhecimento histórico de mercado, mas não constitui o texto normativo primário (que é o MOC / Schemas XSD publicados pela SEFAZ). Trate como **alta confiança, não 100% confirmado no documento raiz**.

### node-forge para PKCS#12 (.pfx)
- Fluxo padrão: ler o `.pfx` como binário → `forge.asn1.fromDer()` → `forge.pkcs12.pkcs12FromAsn1(asn1, senha)` → `getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })` (ou `keyBag`) para a chave privada, e `certBag` para o certificado → `forge.pki.privateKeyToPem()` / `forge.pki.certificateToPem()` para converter para PEM (formato que `xml-crypto`/`https.Agent` consomem).
- Identificação do bag correto: por `friendlyName` ou, de forma mais confiável, por `localKeyIdHex` (certificados emitidos por algumas ACs não preenchem `friendlyName` de forma previsível).
- **⚠️ Vulnerabilidades críticas confirmadas em node-forge**:
  - **CVE-2026-33896**: bypass de validação de certificado — `pki.verifyCertificateChain()` não impõe corretamente `basicConstraints` da RFC 5280 quando um certificado intermediário não tem essa extensão, permitindo que um certificado folha atue como CA.
  - **CVE-2026-33894**: bypass de autenticação — verificação de assinatura RSASSA PKCS#1 v1.5 aceita incorretamente assinaturas forjadas quando usada com chaves de expoente público baixo (e=3).
  - **Ambas corrigidas na versão 1.4.0.** Status geral do pacote: "Sustainable" (~36,6M downloads/semana), mas **é mandatório fixar `node-forge >= 1.4.0`** no `package.json` do fiscal-service. Como o node-forge aqui é usado só para extrair PFX (não para validar cadeia de certificado de terceiros em runtime crítico de auth), o risco prático dessas CVEs no seu caso de uso é menor — mas não há motivo para não atualizar.

---

## 3. Comunicação SOAP + mTLS com SEFAZ em Node

- **Certificado exigido**: A1 (arquivo, .pfx/.p12) válido, emitido por AC credenciada ICP-Brasil. Certificado A3 (token/smartcard) é tecnicamente possível mas **inviável em servidor headless multi-tenant** — exigiria HSM ou middleware PKCS#11, fora do escopo de uma automação SaaS. Trate suporte a A3 como não prioritário/fora de escopo para o MVP.
- **Configuração via `https.Agent`**: opções `pfx` (Buffer do arquivo) + `passphrase` (senha do certificado) substituem `cert`/`key` separados; se `pfx` não for fornecido, `cert` e `key` (extraídos previamente, ex. via node-forge) passam a ser obrigatórios.
- **Bibliotecas SOAP**: `soap` (npm) e forks como `strong-soap` permitem passar essas opções via `wsdl_options` ou construindo um `https.Agent` customizado e injetando no cliente. Existe uma classe `ClientSSLSecurityPFX` em algumas variantes que aceita Buffer ou path do PFX diretamente.
- **Armadilhas confirmadas nas buscas**:
  1. **Erros silenciosos na criação do client**: `soap.createClient()` pode retornar sucesso mesmo com certificado mal configurado — o erro só aparece na **chamada real do método SOAP** (timeout, "socket hang up", ou rejeição de handshake TLS). Sempre testar a chamada fim-a-fim, não só a criação do client.
  2. **WSDL da SEFAZ é rígido**: geração automática de envelope SOAP por libs genéricas frequentemente não bate exatamente com o que o webservice espera (namespaces, ordem de elementos) — é comum construir o envelope SOAP manualmente como string/XML e enviar via `https.request` puro em vez de confiar 100% na abstração da lib `soap`.
  3. **Charset**: o padrão histórico de vários webservices SEFAZ é `ISO-8859-1`, mas os schemas atuais de NF-e (schema XML v4.00) trabalham em `UTF-8` — inconsistências de charset entre camadas (arquivo, envelope SOAP, resposta) são uma fonte clássica de rejeição/erro de parsing. **⚠️ Não foi possível confirmar com fonte 2026 se todos os webservices já migraram totalmente para UTF-8** — validar empiricamente contra o ambiente de homologação de cada UF/SVRS antes de assumir um único charset.
  4. **Certificado vencido/revogado** não gera erro claro do lado do client Node — o handshake TLS falha de forma genérica; é necessário monitorar proativamente a validade do certificado por tenant (alertar 30 dias antes do vencimento).
  5. **Timeout**: SEFAZ pode demorar ou cair em contingência sem aviso — implementar timeout explícito + fallback para SVC (Sefaz Virtual de Contingência) é obrigatório, não opcional.

---

## 4. Autorizadores por UF (SVRS / SVAN / SVC-AN / SVC-RS) — 2026

**Fonte oficial e canônica**: **Portal Nacional da NF-e** —
`https://www.nfe.fazenda.gov.br/portal/webServices.aspx` (produção) e o
espelho de homologação `https://hom.nfe.fazenda.gov.br/portal/webServices.aspx`.
Esta é a **única fonte que deve ser consultada em tempo de implementação/deploy**,
pois a alocação de UFs por autorizador muda administrativamente. A tabela abaixo
é um retrato colhido nesta pesquisa (julho/2026) e **não deve ser hardcoded
como verdade permanente** — o serviço fiscal deveria idealmente buscar/cachear
essa tabela periodicamente ou, no mínimo, ser fácil de atualizar via config.

| Autorizador | UFs (conforme observado, jul/2026) | Observação |
|---|---|---|
| **SVAN** (Sefaz Virtual Ambiente Nacional) | MA | |
| **SVRS** (Sefaz Virtual RS) — Consulta Cadastro | AC, ES, RN, PB, SC | serviço específico de consulta de cadastro, difere do de autorização |
| **SVRS** — demais serviços NF-e | AC, AL, AP, CE, DF, ES, PA, PB, PI, RJ, RN, RO, RR, SC, SE, TO | |
| **SVC-AN** (contingência nacional) | AC, AL, AP, CE, DF, ES, MG, PA, PB, PI, RJ, RN, RO, RR, RS, SC, SE, SP, TO | usado só em contingência, não em operação normal |
| **SVC-RS** (contingência RS) | AM, BA, GO, MA, MS, MT, PE, PR | idem — contingência |

Estados grandes com **webservice próprio** (não SVRS/SVAN) tipicamente incluem SP, MG, RS, PR, BA, entre outros para operação normal — **⚠️ a lista exata de "autorizador próprio vs SVRS" por UF não foi extraída com precisão total nesta pesquisa** (o fetch direto ao portal oficial falhou por erro de certificado SSL na ferramenta de busca, e os resultados via WebSearch trouxeram tabelas parciais/secundárias, algumas de blogs terceiros como Qive/Gálago, não o documento primário). **Ação recomendada**: antes de codificar o roteamento de UF→endpoint, baixar manualmente a tabela XLS/PDF "Web Services" publicada no portal oficial (há uma tabela consolidada com colunas Autorização/Retorno Autorização/Consulta Situação/Inutilização/Consulta Cadastro/Recepção Evento/Download NF-e/Status Serviço por UF).

O portal do SVRS (`https://dfe-portal.svrs.rs.gov.br/Nfe/Servicos` e `/Nfe/Documentos`) também publica os WSDLs e a lista de UFs atendidas, e é a segunda fonte mais confiável.

---

## 5. QR Code NFC-e 2.0 e CSC

- **Formato URL — NFC-e emitida online (sem contingência)**:
  `http://<dominio>/nfce/qrcode?p=<chave_acesso>|<versao_qrcode>|<tipo_ambiente>|<id_csc>|<hash>`

- **Formato URL — NFC-e em contingência offline** (mais campos, pois o app do consumidor não tem como validar online de imediato):
  `http://<dominio>/nfce/qrcode/?p=<chave_acesso>|<versao_qrcode>|<tipo_ambiente>|<dia_emissao>|<valor_total>|<digVal>|<id_csc>|<hash>`

- **CSC (Código de Segurança do Contribuinte)**: código alfanumérico de 16 a 36 bytes, conhecido apenas pela SEFAZ e pelo contribuinte — funciona como um "segredo compartilhado" para gerar o hash do QR Code sem expor a chave privada do certificado a cada nota.

- **Geração do hash**: concatenar os parâmetros (chave de acesso, versão do QR Code, tipo de ambiente, identificador do CSC) separados por `|`, adicionar o CSC ao final, aplicar **SHA-1** e converter para hexadecimal (40 bytes) — **note que aqui também é SHA-1**, consistente com o padrão histórico da SEFAZ nesse aspecto específico do QR Code (diferente do SHA-256 mais comum em specs modernas).

- Documento de referência citado nas buscas: "Manual de Especificações Técnicas do DANFE NFC-e" (versão de manual observada: v6.0, março/2025) — **⚠️ confirmar a versão vigente exata em 2026 diretamente no portal da NFC-e antes de implementar**, pois manuais de padrão costumam ter revisões incrementais (o texto de busca menciona tanto "QR Code 2.0" quanto referências a "QR Code 3.00" em fontes de terceiros — há inconsistência entre fontes secundárias sobre se a versão vigente é 2.0 ou já evoluiu para 3.00 em alguma UF. **Isso precisa ser verificado no manual oficial antes de codificar**, não assumir 2.0 cegamente).

- **⚠️ Nota importante não plenamente confirmada**: há menção em fontes de terceiros (Nota Gateway) a um processo de "fim do CSC" previsto para 2025/2026 no contexto da Reforma Tributária / NF-e nacional unificada. Não foi possível confirmar com fonte primária se isso já está em vigor ou é apenas uma proposta — **tratar como sinal de alerta para revisitar esta seção quando a implementação começar**, dado o timeline (Reforma Tributária mudando várias regras fiscais em paralelo).

---

## 6. Geração de DANFE (PDF) e DANFCe (térmica) em Node

| Biblioteca | Uso | Observação |
|---|---|---|
| **`brasil-js/danfe`** | Gera DANFE em PDF nativamente em Node | Módulo dedicado, com classes para Emitente/Destinatário/Transportador/Endereço. Maturidade e atividade recente **não confirmadas** nesta pesquisa — verificar último commit antes de adotar como dependência crítica |
| **`@nfewizard/danfe`** | Pacote irmão do ecossistema nfewizard-io, publicado separadamente | Mais alinhado com o resto da stack se você já for usar nfewizard-io/xml, reduz retrabalho de mapeamento de dados |
| **pdfmake** | Motor de geração de PDF genérico (não específico de DANFE) | Bom para layout declarativo (objeto JS → PDF), controle fino de posicionamento — útil se for construir o layout do zero seguindo o Manual de Padrões do DANFE |
| **Puppeteer/Playwright (HTML→PDF)** | Renderizar um template HTML/CSS do DANFE e converter para PDF via Chromium headless | Abordagem popular na prática por permitir usar CSS para replicar o layout oficial com precisão visual, ao custo de maior footprint (Chromium) |
| **DANFCe (térmica 80mm/58mm)** | Geralmente não é "PDF" no sentido tradicional — comandos ESC/POS diretos ou impressão de HTML simplificado renderizado no navegador do PDV | **Nenhuma biblioteca Node específica e madura para ESC/POS+DANFCe foi encontrada nesta busca** — no mercado brasileiro isso é tipicamente resolvido client-side (impressão via navegador/`window.print()`, que é exatamente o padrão que o projeto já usa em `fiscal/[id]/nfce/`) |

**Observação de arquitetura**: dado que o CLAUDE.md do projeto já documenta um padrão de impressão via páginas Next.js com `window.print()` para DANFE/NFC-e (`fiscal/[id]/danfe/`, `fiscal/[id]/nfce/`), a abordagem **HTML/CSS + impressão do navegador** é consistente com o que já existe no frontend — não necessariamente é preciso gerar PDF no backend NestJS; pode-se manter a geração visual no Next.js e usar o backend apenas para os dados oficiais (XML, chave de acesso, protocolo).

---

## 7. Validação de XML contra XSD em Node

| Opção | Prós | Contras |
|---|---|---|
| **libxmljs2-xsd** (fork mantido de `node-libxml-xsd`, que dependia do `libxmljs` não mantido) | ~309k downloads/semana, validação XSD 1.0 completa via libxml (bindings nativos), suporta XSD com `<xs:include>` | Depende de binding nativo (compilação C++) — pode complicar builds em Docker multi-stage/Alpine; paths de include relativos precisam ser resolvidos a partir do diretório de execução |
| **xsd-schema-validator** | Mais simples, cross-platform, ~24.5k downloads/semana | Menos robusto para schemas complexos/aninhados como os da NF-e (que têm múltiplos XSDs importados) |
| **fast-xml-parser** | Rápido, puro JS, sem binding nativo | **Não faz validação XSD** — só parseia. Pode ser usado para parsing geral, mas não substitui validação de schema |
| **Chamar `xmllint` via `child_process`** | Ferramenta madura (libxml2 CLI), amplamente usada em pipelines de outras linguagens | Exige `xmllint` instalado na imagem Docker (pacote `libxml2-utils` no Debian/Ubuntu); overhead de spawn de processo por validação; não é "Node nativo" mas é robusto e testado há décadas |

**Recomendação**: `libxmljs2-xsd` é a opção mais usada no ecossistema Node para esse caso (maior base de downloads, ativamente citada como solução primária). Para um microserviço NestJS containerizado, isso significa garantir que a imagem Docker tenha as dependências nativas de build (`node-gyp`, `python3`, `make`, `g++`) na etapa de build multi-stage, e que a imagem final só carregue os binários compilados. Alternativa mais simples de operar (menos frágil em build) é `xmllint` via `child_process`, trocando robustez de binding nativo por dependência de pacote de sistema — ambas são válidas; a escolha é uma decisão de trade-off DevOps, não técnica pura.

---

## 8. Build vs Buy — APIs de emissão terceirizadas (preços jul/2026)

| Provedor | Plano de entrada | Preço aproximado/nota extra | Observações |
|---|---|---|---|
| **Focus NFe** | Solo: R$ 89,90/mês (100 notas, 1 CNPJ) | R$ 0,10/nota extra (NF-e) | Sem taxa de setup, sem fidelidade, 30 dias trial. Plano **Growth**: R$ 548/mês, 4.000 notas, CNPJs ilimitados, R$ 0,12/nota extra. Plano **Retail (NFC-e)**: R$ 59,90/mês, 500 NFC-e + 100 NF-e, R$ 0,05/NFC-e extra e R$ 0,15/NF-e extra. **Retail+**: R$ 629,90/mês, 9.000 NFC-e + 1.000 NF-e. Enterprise (>50 mil notas/mês): sob consulta |
| **eNotas** | Básico: R$ 137/mês (até 50 notas) | — | Plus: R$ 247/mês (até 500 notas, já com API REST). Pro: R$ 347/mês, notas ilimitadas. **⚠️ Foco aparente em NFS-e (serviço)** — confirmar cobertura de NF-e/NFC-e (produto) antes de considerar, pois o plano básico parece voltado a serviços |
| **NFe.io** | Preço não obtido nesta pesquisa | ⚠️ não confirmado | Site direciona para contato comercial / páginas de preço segmentadas por tipo de nota (`/precos/emissao-nfe/`, `/precos/emissao-nfce/`, `/precos/emissao-nfse/`) — **valores específicos não confirmados**, requer contato direto |
| **TecnoSpeed / PlugNotas** | ⚠️ não confirmado | ⚠️ não confirmado | Cobertura ampla (1.600+ municípios, todos estados), suporta Node.js/JavaScript nativamente, webhook de notificação de autorização, retorna PDF+XML automaticamente. Preço não divulgado publicamente nas fontes buscadas — modelo tipicamente por volume/negociação direta |
| **Migrate** | ⚠️ não pesquisado a fundo — não apareceu com destaque nos resultados | ⚠️ não confirmado | — |

### Build (emissão própria) vs Buy (API terceirizada)

**Buy — prós:**
- Elimina a complexidade regulatória (SEFAZ muda regras, schemas, e webservices por UF com frequência — o provedor absorve esse custo de manutenção)
- Sem necessidade de gerenciar certificados A1 de cada tenant no seu próprio banco de segredos com a criticidade que isso exige (ainda que você precise coletar o certificado do tenant de qualquer forma se ele fizer questão de usar o próprio CNPJ)
- Suporte a contingência, DANFE, QR Code e conformidade já embutidos
- Modelo de custo variável, previsível, escala com uso

**Buy — contras:**
- Custo por nota se torna relevante em volume alto (ex. 50.000 notas/mês em Focus NFe Enterprise ainda é "sob consulta", mas nos planos públicos o custo marginal gira em R$ 0,10–0,15/nota — para um ERP multi-tenant que fatura em nome de centenas de PMEs, isso pode virar uma parcela não trivial do custo de operação, e reduz margem se não for repassado corretamente)
- Dependência de terceiro para SLA/disponibilidade do seu core de faturamento (se a API do provedor cair, seus tenants não emitem nota)
- Menor controle sobre customizações finas de layout de DANFE/regras fiscais muito específicas
- Ainda assim é necessário built um camada de abstração própria por cima (multi-tenant, filas, retries, cache de config), então "buy" não elimina 100% do trabalho de engenharia — apenas o pedaço mais regulatório/complexo (assinatura, transmissão SOAP, schemas)

**Build — prós:**
- Controle total, sem custo marginal por nota (só infraestrutura própria)
- Diferencial competitivo se "emissão fiscal nativa e robusta" for parte do pitch do produto
- Nenhuma dependência de terceiro no caminho crítico de faturamento

**Build — contras:**
- Custo de manutenção regulatória contínuo e não trivial: schemas mudam, Reforma Tributária está em andamento explicitamente durante 2026 (mencionada em várias fontes desta pesquisa), autorizadores por UF mudam, notas técnicas são publicadas com frequência
- Necessário lidar com armazenamento seguro de certificados A1 por tenant (criptografia em repouso, rotação, alertas de expiração) — superfície de risco de segurança relevante em um SaaS multi-tenant
- Complexidade de contingência (SVC-AN/SVC-RS) e monitoramento de disponibilidade dos webservices da SEFAZ por UF
- Tempo de desenvolvimento não trivial antes do primeiro tenant conseguir emitir nota em produção

---

## 9. Recomendação de arquitetura para o iMestreDigital

Dado o contexto do projeto — **SaaS multi-tenant para PME brasileira**, ainda em Fase 0/estabilização segundo o roadmap interno (`docs/auditoria/`), com o módulo fiscal (`fiscal-service`) ainda majoritariamente mock — a recomendação é uma **arquitetura híbrida em duas etapas**, não build puro nem buy puro:

### Fase imediata (MVP fiscal real, dentro da Fase 2 do roadmap)
**Buy via API terceirizada** (Focus NFe ou PlugNotas/TecnoSpeed como principais candidatos, dado suporte nativo a Node.js e webhooks) atrás de uma **interface/abstração própria** dentro do `fiscal-service`:

- Definir uma camada `ProvedorFiscalPort` (interface) no NestJS com métodos como `emitirNfe()`, `emitirNfce()`, `cancelar()`, `cartaCorrecao()`, `consultarStatus()` — implementada inicialmente por um `FocusNfeAdapter` (ou equivalente).
- Isso permite validar o produto/negócio (PMEs realmente emitindo notas, feedback de UX do fluxo fiscal) sem pagar o custo de engenharia de assinatura XMLDSig, mTLS/SOAP, autorizadores por UF e contingência **antes** de saber se o volume justifica.
- Custo inicial baixo (planos de R$ 60–115/mês cobrem a maioria das PMEs pequenas) e sem necessidade de gerenciar certificado A1 de cada tenant diretamente no seu storage — embora ainda seja preciso repassar o certificado do tenant ao provedor, o que já resolve boa parte do problema de custódia se o provedor tiver essa responsabilidade contratual.

### Fase de maturidade (gatilho: volume de notas ou tenants grandes o suficiente para o custo marginal por nota pesar na margem)
**Migrar tenants de alto volume para emissão própria**, mantendo a mesma interface `ProvedorFiscalPort` com uma segunda implementação `EmissaoPropriaAdapter` construída sobre:
- `nfewizard-io` (ou fork próprio inspirado nele) para geração de XML + assinatura + transmissão
- `xml-crypto >= 6.0.1` (RSA-SHA1 conforme exigido) + `node-forge >= 1.4.0` para certificados
- `libxmljs2-xsd` para validação de schema antes de transmitir (evita rejeição por erro estrutural, que custa tempo e re-tentativas)
- Endpoint de UF resolvido dinamicamente a partir de uma tabela de configuração atualizável (não hardcoded), espelhando o portal oficial da NF-e
- DANFE/DANFC-e reaproveitando o padrão já existente no frontend (`window.print()` + HTML/CSS), sem necessidade de gerar PDF no backend

Isso permite que **tenants pequenos continuem no provedor terceirizado indefinidamente** (menor risco operacional para eles) enquanto tenants grandes ou o próprio plano de monetização do iMestreDigital justificam absorver a complexidade regulatória só onde o retorno compensa — evitando o cenário de "construir tudo antes de validar demanda", que é um risco real dado que o roadmap interno já identifica ~70% do sistema como mock e um bug raiz de "enum drift" ainda em estabilização (Fase 0).

**Ponto de atenção transversal**: independentemente da rota escolhida, a Reforma Tributária está mudando regras fiscais brasileiras ativamente em 2026 (mencionada em múltiplas fontes desta pesquisa, incluindo notas técicas recentes de NF-e). Isso reforça a tese de começar com um provedor terceirizado que absorve esse custo de acompanhamento regulatório, adiando o "build" para quando o cenário normativo estiver mais estável ou quando o volume de tenants justificar claramente o investimento.

---

## Resumo do que não pôde ser confirmado com fonte primária 2026

1. Pacote **djf-nfe** — não localizado nas buscas.
2. Pacote **brasil-interface** — não localizado nas buscas.
3. Tabela completa e definitiva de "autorizador próprio vs SVRS" por UF — fetch direto ao portal oficial falhou (erro de certificado SSL na ferramenta); dados aqui vêm de buscas agregadas, não da tabela primária. **Consultar `nfe.fazenda.gov.br/portal/webServices.aspx` manualmente antes de implementar o roteamento.**
4. Versão exata vigente do QR Code NFC-e em 2026 (2.0 vs possível 3.00) — fontes secundárias divergem.
5. Se o CSC está de fato em processo de descontinuação por conta da Reforma Tributária — mencionado por uma fonte secundária (Nota Gateway), não confirmado em documento oficial.
6. Preços de NFe.io, TecnoSpeed/PlugNotas e Migrate — não divulgados publicamente nas fontes acessadas.
7. Se todos os webservices SEFAZ já padronizaram para UTF-8 ou se ISO-8859-1 ainda persiste em algum canal — não confirmado para 2026 especificamente.
8. Maturidade/atividade recente de `brasil-js/danfe` — não verificada diretamente (data de último commit não obtida).
9. O texto normativo primário (MOC) confirmando RSA-SHA1 como algoritmo obrigatório — inferido de Nota Técnica sobre PAA, alta confiança mas não é o documento-fonte definitivo.

---

### Fontes principais consultadas
- https://github.com/nfewizard-org/nfewizard-io
- https://github.com/lealhugui/node-dfe
- https://github.com/lucashpmelo/node-mde
- https://www.npmjs.com/package/xml-crypto · https://github.com/node-saml/xml-crypto
- https://www.npmjs.com/package/node-forge · https://www.sentinelone.com/vulnerability-database/cve-2026-33896/ · https://www.sentinelone.com/vulnerability-database/cve-2026-33894/
- https://workos.com/blog/samlstorm (CVE-2025-29775/29774 do xml-crypto)
- https://www.nfe.fazenda.gov.br/portal/webServices.aspx
- https://dfe-portal.svrs.rs.gov.br/Nfe/Servicos
- https://oobj.com.br/bc/qrcode-nfce-40/ · https://blog.oobj.com.br/qr-code-2-0-nfce-4-0/
- https://focusnfe.com.br/precos/
- https://enotass.com.br/notas · https://nfe.io/precos/emissao-nfe/
- https://plugnotas.com.br/nfe/
- https://github.com/brasil-js/danfe
- https://github.com/cdegalitt/libxmljs2-xsd · https://npmtrends.com/fast-xml-parser-vs-libxml-xsd-vs-libxmljs-vs-libxmljs2-vs-react-xml-parser-vs-xml-js-vs-xml2js-vs-xsd-schema-validator
