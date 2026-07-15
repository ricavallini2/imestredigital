# Plano de Implementação Fiscal 100% — iMestreDigital (NF-e mod. 55 + NFC-e mod. 65)

> Documento técnico para tornar o `fiscal-service` apto a emitir documentos fiscais **válidos em produção**. Escrito honestamente: hoje o serviço **não emite uma única nota fiscal legal**.

---

## 1. Estado atual do `fiscal-service` (real vs stub)

### O que é REAL (casca CRUD funcional)
- **Persistência Prisma/PostgreSQL**: criação de rascunho, listagem, busca por id, paginação e filtros funcionam de verdade.
- **Cache Redis** (1h) na busca de nota por id.
- **Geração da CHAVE DE ACESSO** — o único ponto fiscalmente correto. `chave-acesso.util.ts` calcula o DV por módulo 11 (pesos 2–9 da direita para a esquerda, resto<2 ⇒ 0, senão 11−resto), monta 43+1=44 dígitos no layout certo, e tem `validar`/`extrair` coerentes. Suporta modelo 55 e 65.
- **Persistência de eventos** (`EventoFiscal`) e estrutura de blocos do SPED (TXT gerado).
- **Produtor Kafka** cabeado (emite `NOTA_AUTORIZADA`, `NOTA_REJEITADA`, etc.) — embora alguns publishers nunca sejam chamados.

### O que é STUB / MOCK (todo o núcleo fiscal — 0% do caminho legal é real)
| Componente | Estado | Detalhe |
|---|---|---|
| **Assinatura digital** | Stub puro | `assinatura.service.ts:25` tem TODO; calcula SHA-256 truncado de 20 chars e injeta como **comentário XML**. Não há XMLDSig, C14N, RSA-SHA1, nem carga do `.pfx`. |
| **Validação de certificado** | Fake | `validarCertificado()` nunca abre o PKCS#12; retorna sempre `valido:true` e validade fabricada (hoje+1 ano). |
| **Comunicação SEFAZ** | Simulação total | Todos os métodos retornam `cStat` hardcoded (100/135/102). **Em PRODUÇÃO cai no mesmo mock** (loga warning e simula). Protocolos = `Date.now()+random`. |
| **XML-builder** | Inválido p/ 4.00 | Raiz minúscula `nfe`/`infNfe` (deveria ser `NFe`/`infNFe`); CNPJ emitente `00000000000000`; cUF/cMun/UF fixos em SP (35/3550308); `cDV='0'`; faltam `pag`, `infRespTec`, `vTotTrib`, ICMSTot consistente, PIS/COFINS com base. Sem `<Signature>`. |
| **Engine de impostos** | Rudimentar | Só multiplica `valorTotal × alíquota` da `RegraFiscal` por NCM. Sem ST, CSOSN, DIFAL, FCP, IPI, redução de base, monofásico, CST×CFOP. |
| **Endpoint `calcular-impostos`** | Stub | Controller devolve `{mensagem:'em desenvolvimento'}`. |
| **DANFE / DANFCe** | Stub | Devolve `{mensagem:'DANFE em desenvolvimento'}`. Nenhuma lib de PDF. |
| **QR Code NFC-e** | Ausente | `tokenCsc`/`idCsc` existem no schema mas nunca usados. |
| **Consumers Kafka** | No-op | `PEDIDO_FATURAR` e `PRODUTO_ATUALIZADO` têm lógica comentada. |
| **SPED** | Apuração errada | `E110` repete débito em débito/saldo/recolher; `C190` não consolida; **bug de unidade** (divide por 100). |

### Bugs estruturais transversais
1. **Drift de unidade monetária** (sistêmico): DTO diz centavos, schema é `Decimal(19,2)` em reais, repository faz `Math.round`, xml/sped dividem por 100 → valores **100× menores**.
2. **Segurança crítica**: senha do certificado em **texto puro**; `.pfx` sem criptografia; `TenantMiddleware` usa `jwt.decode` **sem verificar assinatura**; **nenhum AuthGuard** — qualquer um forja `tenantId` e emite/cancela nota de outro tenant.
3. **Interligações quebradas**: NF não puxa pedido/cliente/produto reais; destinatário vem 100% do payload (mesmo padrão do bug `origem=WEBSITE` de enum drift).
4. **`chNFe` do evento = UUID** (`notaFiscalId.substring(0,44)`) em vez da `chaveAcesso` real.
5. **Numeração sem transação/lock** → risco de duplicidade (viola `@@unique`) ou buracos.
6. **Colisão de rota** `POST /inutilizar` com `/:id`.
7. **Enum drift fiscal**: `tpEvento` cancelamento como `110110` (correto: **110111**); CST "00-60" comentado mas só "00" implementado; NCM/CFOP/CEST como String livre sem validação.

---

## 2. Bloqueadores de produção (sem isto é impossível emitir)

1. **Assinatura digital XMLDSig real** (RSA-SHA1 + C14N exclusiva + Reference/Transforms + KeyInfo/X509). Sem isso a SEFAZ rejeita **100%** das notas.
2. **Parse + validação real do certificado A1** (`.pfx`) e **armazenamento seguro da senha** (hoje texto puro) — pré-requisito de assinar e de mTLS.
3. **Comunicação SOAP real com a SEFAZ** via HTTPS **mTLS**, por UF/ambiente, com lote + polling de recibo. Hoje 100% simulado, inclusive em produção.
4. **XML NF-e 4.00 válido contra XSD**: remover hardcodes, corrigir casing (`NFe`/`infNFe`), incluir `pag`, `infRespTec`, ICMS por CST/CSOSN, PIS/COFINS com base, `vTotTrib`, e o elemento `<Signature>`.
5. **NFC-e (mod. 65)**: grupo `infNFeSupl` + **QR Code** (hash SHA-1 com CSC/idCSC) + URL de consulta por UF.
6. **Numeração atômica** por tenant/UF/modelo/série (transação + lock ou sequência), com persistência de **inutilização** de faixas.
7. **Correção do bug de unidade monetária** (centavos vs reais) — senão toda nota e escrituração ficam 100× erradas.
8. **Tabela de endpoints SEFAZ por UF + contingência** (SVC-AN/SVC-RS para NF-e; offline `tpEmis=9` para NFC-e).
9. **DANFE (A4) e DANFCe (80mm)** com código de barras Code128 / QR Code.
10. **Guarda do XML autorizado** (`nfeProc` assinado + protocolo) com retenção de **5 anos**.
11. **Autenticação real** (JwtAuthGuard que **verifica** o token) + guard por papel para emitir/cancelar.

---

## 3. Plano técnico em etapas

> **Decisão de arquitetura recomendada:** **não reimplementar tudo do zero.** Adotar bibliotecas consolidadas para os pontos de risco regulatório (assinatura, SOAP/mTLS, QR Code, DANFE). Avaliar uma lib de DF-e (ex.: `node-dfe`/`node-nfe` ou equivalente mantido) para acelerar, mas encapsulada atrás de uma interface própria (`ProvedorDfe`) para não acoplar o domínio à lib.

---

### Etapa 0 — Fundação de segurança e correções bloqueantes baratas `(M)`
**Objetivo:** travar buracos de segurança e bugs sistêmicos antes de construir o resto.

**Tarefas:**
- Implementar `JwtAuthGuard` que **verifica assinatura** (`jwt.verify`, não `decode`); remover fallback `dev-secret-trocar-em-producao` (falhar se faltar env).
- `RolesGuard` por papel: `emitir`/`cancelar` só `admin`|`gerente`.
- Corrigir `TenantMiddleware`: `tenantId` só de token verificado.
- **Padronizar unidade monetária**: definir convenção única (**reais com `Decimal(19,2)`** — recomendado). Remover todas as `÷100`/`Math.round`; usar `Prisma.Decimal` / `decimal.js` ponta a ponta (DTO → service → repository → xml/sped).
- Corrigir colisão de rota (`@Post('inutilizar')` antes de `@Post(':id/...')` ou prefixo dedicado).
- Corrigir `chNFe` do evento → usar `nota.chaveAcesso`.
- Corrigir enum drift: `tpEvento` cancelamento = `110111`; CCe = `110110`.

**Libs:** `@nestjs/passport`, `passport-jwt`, `decimal.js`.
**Critério de aceite:** request sem JWT válido → 401; `tenantId` forjado rejeitado; teste de unidade monetária prova R$ 1.234,56 idêntico em DTO/DB/XML/SPED; rota `/inutilizar` resolve corretamente.

---

### Etapa 1 — Certificado A1: parse, validação e armazenamento seguro `(M)`
**Objetivo:** carregar o `.pfx` de verdade, validar, e guardar com criptografia.

**Tarefas:**
- `validarCertificado()` real com **`node-forge`**: abrir PKCS#12 com a senha, extrair chave privada + cadeia X.509, ler `notAfter` real, validar cadeia ICP-Brasil.
- **Envelope encryption**: `certificadoDigital` e `senhaCertificado` cifrados com **AES-256-GCM** (chave em KMS/Vault; em dev, `FISCAL_CRYPTO_KEY` por env). Persistir `iv`/`authTag`/`salt`.
- Bloquear emissão se certificado vencido (`emitirNota` consulta `notAfter` real).
- Redaction de senha em logs; `FileInterceptor` com `limits` (tamanho) e validação de tipo.
- Migration: adicionar colunas de cripto; remover senha em texto puro.

**Libs:** `node-forge`, `crypto` (nativo), opcional `@aws-sdk/client-kms` ou `node-vault`.
**Critério de aceite:** upload de `.pfx` real retorna `notAfter` correto; senha errada → erro; dump do DB não expõe senha/pfx em claro; emissão com cert vencido é bloqueada.

---

### Etapa 2 — XML NF-e 4.00 válido + assinatura XMLDSig `(XL)`
**Objetivo:** produzir XML que passa no XSD oficial e é assinado conforme padrão SEFAZ.

**Tarefas (XML):**
- Reescrever `xml-builder` com casing correto (`NFe`/`infNFe`/`Signature`), `Id="NFe<chave44>"`.
- Usar dados **reais** do tenant: `cUF`, `cMun`, `UF`, `CNPJ` do emitente vindos do `ConfiguracaoFiscal`.
- Propagar `cNF` e `cDV` da chave para `ide.cNF`/`ide.cDV` (acoplamento hoje inexistente).
- Grupos obrigatórios: `ide` (com `tpEmis`, `tpAmb`, `indFinal`, `idDest` calculado), `emit` (com CRT do regime), `dest`, `det` por item, `total/ICMSTot` consistente, **`pag`** (`detPag` com `tPag`/`vPag`), `transp`, `infRespTec`, `vTotTrib` (Lei 12.741).
- Em **homologação**: forçar `dest.xNome = "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"`.
- **Validar contra XSD oficial 4.00** antes de transmitir.

**Tarefas (assinatura):**
- `assinarXml()` real: **canonicalização C14N exclusiva**, `DigestMethod` SHA-1, `SignatureMethod` RSA-SHA1, `Reference URI="#NFe<chave>"`, Transforms (`enveloped-signature` + C14N), `KeyInfo/X509Data`. `<Signature>` inserido **dentro de `<NFe>`**.

**Libs:** `xmlbuilder2` (já presente), **`xml-crypto`** (XMLDSig), `node-forge` (chave/cert), **`libxmljs2`** ou `fast-xml-parser` + XSDs oficiais para validação.
**Critério de aceite:** XML validado contra XSD `nfe_v4.00.xsd` sem erros; assinatura verificável (digest/signature válidos); emitente reflete o tenant real, não SP hardcoded.

---

### Etapa 3 — Engine de tributação completo `(XL)`
**Objetivo:** calcular impostos corretos por CST/CSOSN/CFOP/NCM/regime.

**Tarefas:**
- Modelar `RegraFiscal` estendida: ST (`pMVAST`, `pRedBCST`, `pICMSST`), FCP/FCP-ST, redução de base, monofásico, CSOSN por regime, CEST.
- **ICMS próprio** por CST (00/10/20/40/41/51/60/70/90) e **CSOSN** (101/102/201/202/500/900) para Simples.
- **ICMS-ST**: base ST com MVA, `vBCST`, `vICMSST`.
- **DIFAL** (EC 87/2015): grupo `ICMSUFDest` quando interestadual a consumidor final; `idDest=2`.
- **FCP / FCP-ST**.
- **IPI** por CST e enquadramento.
- **PIS/COFINS** por CST com `vBC/pPIS/vPIS` e `vBC/pCOFINS/vCOFINS` (cumulativo/não-cumulativo/monofásico).
- Implementar de fato `POST /calcular-impostos` (controller stub).
- `buscarRegraAplicavel` passar `cfop` (hoje passa `null`); suporte a faixa/curinga de NCM.
- Validar NCM/CFOP/CEST/origem contra tabelas oficiais (evitar enum drift).

**Libs:** `decimal.js` (precisão), tabelas IBPT/NCM como dataset versionado.
**Critério de aceite:** suíte de testes com casos reais (Simples CSOSN 102; ICMS 00; ST CST 10; DIFAL interestadual; monofásico) batendo com calculadora de referência; XML do item monta todos os grupos.

---

### Etapa 4 — Webservices SEFAZ (homologação → produção) `(XL)`
**Objetivo:** transmitir de verdade, por UF e ambiente.

**Tarefas:**
- Cliente **SOAP HTTPS com mTLS** usando o certificado A1 (agent TLS com `pfx`+`passphrase`).
- **Tabela de endpoints por UF/ambiente** (autorizadores próprios + SVAN/SVRS/SVC).
- Implementar serviços: `NFeAutorizacao4` (lote + `NFeRetAutorizacao4` polling do `nRec`), `NFeConsultaProtocolo4`, `NFeStatusServico4`, `NFeRecepcaoEvento4`, `NFeInutilizacao4`, `NFeConsultaCadastro4`.
- Parse do retorno (`cStat`/`xMotivo`/`protNFe`), montar **`nfeProc`** (XML assinado + protocolo) e persistir.
- **Mapa de códigos de rejeição** + fluxo correção/reenvio; tratar **denegação** (`cStat` 110/301/302 → status `DENEGADA`).
- Remover o fallback de mock em produção.

**Libs:** `soap` ou `axios` + `https.Agent` (mTLS) + envelope SOAP manual, `xml2js` (já presente) para parse.
**Critério de aceite:** em homologação, nota retorna `cStat=100` **real** da SEFAZ; rejeição real é capturada e mapeada; `nfeProc` persistido.

---

### Etapa 5 — Numeração/série atômica + inutilização `(M)`
**Objetivo:** sequência sem duplicidade/buracos e auditável.

**Tarefas:**
- Numeração via **transação + `SELECT ... FOR UPDATE`** (ou sequence dedicada) por `tenant/UF/modelo/série`. Reserva do número só na autorização; em rejeição definitiva, registrar buraco para inutilização.
- Incremento na **mesma transação** da nota.
- Modelar `InutilizacaoNumeracao` (faixa, justificativa, protocolo, xmlRetorno) e persistir resultado de `NFeInutilizacao4`.

**Libs:** Prisma `$transaction`, Postgres advisory locks.
**Critério de aceite:** teste de concorrência (N requests paralelos) não gera número duplicado; faixa inutilizada fica persistida e auditável.

---

### Etapa 6 — NFC-e (mod. 65): infNFeSupl + QR Code + CSC `(L)`
**Objetivo:** emitir NFC-e com QR Code válido.

**Tarefas:**
- Builder específico mod. 65: grupo **`infNFeSupl`** (`qrCode` + `urlChave`).
- Cálculo do **QR Code 2.0**: concatenação dos parâmetros + hash SHA-1 com **CSC/idCSC** (cifrados, Etapa 1); URL de consulta por UF.
- **Contingência offline NFC-e** (`tpEmis=9`) + fila de retransmissão ao voltar a conexão.

**Libs:** `qrcode` (render), `crypto` (SHA-1 do hash).
**Critério de aceite:** QR Code lido por leitor oficial bate com a chave/assinatura; NFC-e autorizada em homologação; emissão offline transmite ao reconectar.

---

### Etapa 7 — Eventos (cancelamento / CCe / inutilização) + contingência NF-e `(M)`
**Objetivo:** eventos válidos e fluxos de contingência.

**Tarefas:**
- `gerarXmlEvento` com `chNFe` = `nota.chaveAcesso` (44 díg.), `tpEvento` correto (cancelamento **110111**, CCe **110110**), `nSeqEvento`, assinatura do evento.
- CCe: `detEvento` com `xCorrecao` + `xCondUso` obrigatório; validação de prazo.
- Cancelamento: validação de prazo (24h NF-e), persistir `dhRegEvento`.
- **Contingência SVC-AN/SVC-RS** (NF-e): roteamento quando autorizadora indisponível, ajuste de `tpEmis`/recálculo de `cDV`.

**Critério de aceite:** cancelamento/CCe autorizados em homologação com chave correta; contingência roteia para SVC e autoriza.

---

### Etapa 8 — DANFE / DANFCe (PDF) `(L)`
**Objetivo:** documentos auxiliares para acompanhar a mercadoria.

**Tarefas:**
- **DANFE A4** (NF-e) com layout oficial + código de barras **Code128** da chave.
- **DANFCe 80mm** (NFC-e) com QR Code + dados do consumidor.
- Endpoints `GET /:id/danfe` e `/:id/danfce` retornando PDF (substituir placeholder).
- Reaproveitar as print pages do frontend (`fiscal/[id]/danfe`, `nfce`) como fallback HTML→print.

**Libs:** `pdfkit` ou `puppeteer` (HTML→PDF), `bwip-js` (Code128), `qrcode`.
**Critério de aceite:** PDF abre com chave/itens/totais corretos e código de barras/QR legíveis.

---

### Etapa 9 — Interligações cross-service + automação Kafka `(L)`
**Objetivo:** NF puxar dados reais e faturar pedido automaticamente.

**Tarefas:**
- Ao montar NF: **buscar cliente** no `customer-service` por `clienteId` (validar CPF/CNPJ/IE/endereço — evita o padrão enum-drift), **produto** no `catalog-service` (NCM/CFOP/CEST), **pedido** no `order-service`.
- Validar consistência cross-service por convenção de ID (`pedido.clienteId == customer_service.Cliente.id`).
- Implementar consumer **`PEDIDO_FATURAR`** (gera NF automaticamente) com **idempotência/dedup**.
- Transactional outbox para não perder eventos.

**Critério de aceite:** faturar um pedido gera NF com destinatário/itens reais; reentrega do evento não duplica nota.

---

### Etapa 10 — SPED + guarda de XML 5 anos `(L)`
**Objetivo:** escrituração válida no PVA e retenção legal.

**Tarefas:**
- Corrigir apuração: `E110` (débito ≠ saldo ≠ recolher), `C190` consolidando por CST/CFOP/alíquota, `M200/M600` reais (com `M100/M500`), `COD_ITEM` = código real do produto (não UUID).
- Corrigir unidade monetária no SPED (herda Etapa 0).
- **Guarda dos XMLs autorizados** (`nfeProc`): storage com retenção 5 anos, backup, exportação; armazenar XML de envio assinado **e** retorno.
- Validar no **PVA**.

**Libs:** storage (S3/MinIO) para os XMLs, validação manual no PVA.
**Critério de aceite:** TXT importa sem erro no PVA; XMLs recuperáveis por período/tenant.

---

## 4. Sequência recomendada

**Fase A — Fundação (pré-requisito de tudo):** Etapa 0 → Etapa 1.

**Fase B — MVP emissão NF-e em HOMOLOGAÇÃO:** Etapa 2 (XML+assinatura) → Etapa 3 (engine, escopo mínimo: ICMS 00 + CSOSN 102 + PIS/COFINS) → Etapa 5 (numeração) → Etapa 4 (SEFAZ homologação). **Marco: primeira NF-e autorizada de verdade em homologação.**

**Fase C — Completar NF-e:** Etapa 7 (eventos/contingência) → Etapa 8 (DANFE) → ampliar Etapa 3 (ST/DIFAL/FCP/IPI).

**Fase D — NFC-e:** Etapa 6 (infNFeSupl/QR/CSC + offline) → DANFCe (parte da Etapa 8).

**Fase E — Produção:** virar ambiente para produção na Etapa 4 (após checklist §5) → Etapa 9 (automação) → Etapa 10 (SPED + guarda).

---

## 5. Checklist de homologação SEFAZ

Antes de produção, validar em **ambiente de homologação** (`tpAmb=2`):

- [ ] Certificado A1 carregado, validado (`notAfter` real) e cifrado em repouso.
- [ ] XML validado contra **XSD 4.00** (`nfe_v4.00.xsd`) sem erros de schema.
- [ ] Assinatura XMLDSig verificável (digest + signature válidos).
- [ ] `dest.xNome` forçado para `"NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL"`.
- [ ] **NFeStatusServico4** retorna serviço operacional (conectividade mTLS OK).
- [ ] **Autorização** de uma NF-e modelo 55: `cStat=100`.
- [ ] **Rejeição proposital** (ex.: NCM inválido) capturada e mapeada corretamente.
- [ ] **Cancelamento** (110111) autorizado, com `chNFe` correta.
- [ ] **Carta de Correção** (110110) com `xCondUso`, autorizada.
- [ ] **Inutilização** de faixa autorizada e **persistida**.
- [ ] **NFC-e** modelo 65 autorizada; **QR Code** lido por app oficial e consistente.
- [ ] Contingência **SVC** (NF-e) e **offline `tpEmis=9`** (NFC-e) testadas.
- [ ] **DANFE/DANFCe** geram PDF com código de barras/QR legíveis.
- [ ] Numeração: teste de **concorrência** sem duplicidade/buraco.
- [ ] `nfeProc` (XML assinado + protocolo) persistido e recuperável.
- [ ] SPED Fiscal/Contribuições importam no **PVA** sem erro.
- [ ] Multi-tenant: nota de um tenant não acessível/emitível por outro (Guard + tenantId verificado).
- [ ] Cross-service: `clienteId`/`pedidoId`/`produtoId` validados contra os serviços de origem.

---

## 6. Estimativa de esforço e ordem

| Ordem | Etapa | Esforço | Fase |
|---|---|---|---|
| 1 | Etapa 0 — Segurança + correções bloqueantes (JWT, unidade monetária, rotas, chNFe, enums) | **M** | A |
| 2 | Etapa 1 — Certificado A1 (parse + cripto repouso) | **M** | A |
| 3 | Etapa 2 — XML 4.00 válido + assinatura XMLDSig | **XL** | B |
| 4 | Etapa 3 — Engine de tributação (MVP → completo) | **XL** | B/C |
| 5 | Etapa 5 — Numeração atômica + inutilização | **M** | B |
| 6 | Etapa 4 — Webservices SEFAZ (homolog → prod) | **XL** | B/E |
| 7 | Etapa 7 — Eventos + contingência NF-e | **M** | C |
| 8 | Etapa 8 — DANFE / DANFCe (PDF) | **L** | C/D |
| 9 | Etapa 6 — NFC-e (infNFeSupl/QR/CSC + offline) | **L** | D |
| 10 | Etapa 9 — Cross-service + automação Kafka | **L** | E |
| 11 | Etapa 10 — SPED + guarda de XML 5 anos | **L** | E |

**Esforço total agregado:** ~3× XL + 1× M(crít.) + vários L/M → ordem de **muitos meses-engenheiro**. O caminho crítico para o **primeiro documento legal em homologação** é **Etapas 0 → 1 → 2 → 3(mínimo) → 5 → 4**.

> **Recomendação final:** encapsular assinatura/SOAP/QR/DANFE atrás de uma interface `ProvedorDfe` e avaliar adotar biblioteca de DF-e consolidada para reduzir risco regulatório — reimplementar XMLDSig e o protocolo SEFAZ do zero é a maior fonte de risco e atraso.