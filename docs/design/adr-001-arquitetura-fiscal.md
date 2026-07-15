# ADR-001 — Arquitetura de emissão fiscal (NF-e/NFC-e)

**Status:** Decidido · 03/07/2026 · Base: `docs/pesquisa/nfe-stack-nodejs.md` + `docs/auditoria/02-plano-fiscal-100.md`

## Decisão

**Arquitetura HÍBRIDA com port/adapter**: o `fiscal-service` mantém o **domínio fiscal completo e próprio** (configuração por tenant, engine de tributos, numeração, guarda de XML), mas a **transmissão à SEFAZ vai por provedor terceirizado** na v1, atrás de uma interface `ProvedorFiscalPort`.

- **v1 (produção rápida):** adapter **Focus NFe** (preço público R$59,90–629,90/mês + R$0,05–0,15/nota, multi-empresa por tenant, NF-e/NFC-e/CCe/cancelamento/inutilização, DANFE PDF, webhooks de status, homologação e produção).
- **v2 (quando volume justificar):** adapter de **emissão própria** (nfewizard-io GPL-3.0 + xml-crypto ≥6.0.1 + node-forge ≥1.4.0 + validação XSD), reutilizando todo o domínio já construído. GPL-3.0 é aceitável para SaaS (sem distribuição de binário).

## Por quê

1. **Time-to-production semanas, não meses.** A auditoria estimou emissão própria em 3×XL (muitos meses-engenheiro). O mandato é produção o quanto antes.
2. **Risco regulatório terceirizado no pior momento possível:** a Reforma Tributária (IBS/CBS) está mudando layouts e regras ativamente em 2026; provedores absorvem as Notas Técnicas.
3. **A Shopee BLOQUEIA envio sem NF-e** (`INVOICE_PENDING` → `upload_invoice_doc` → `ship_order`). Fiscal rápido destrava o marketplace — dependência crítica entre Fases 2 e 3.
4. **Multi-tenant nativo:** Focus NFe modela 1 empresa por tenant com certificado A1 armazenado lá (reduz nossa superfície de risco de custódia de certificado na v1).
5. **Sem lock-in:** o domínio (modelo de NF, tributação, numeração, XML armazenado) é nosso; o provedor é um detalhe atrás do port. Trocar de provedor ou internalizar = escrever outro adapter.

## O que continua NOSSO (obrigatório em qualquer cenário)

- **Configuração fiscal por tenant:** regime tributário, CSC/idCSC (NFC-e), séries e numeração, naturezas de operação, certificado (referência).
- **Engine de tributos:** CFOP/CST/CSOSN/NCM/CEST por produto e operação, ICMS/ST/DIFAL/FCP/IPI/PIS/COFINS conforme regime — o provedor valida/transmite, mas quem calcula e preenche é o ERP.
- **Ciclo de vida da NF:** rascunho → emitida → autorizada/rejeitada/denegada → cancelada/CCe; eventos Kafka; vínculo pedido↔NF.
- **Guarda dos XMLs autorizados** (5 anos) e DANFE/DANFCe (HTML print já existente como fallback; PDF do provedor como primário).
- **Etapa 0 de segurança** (já em execução na Fase 0): JWT verify, RolesGuard, unidade monetária em reais/Decimal.

## Consequências

- Fase 2 reescopada: (a) domínio fiscal + engine de tributos + config por tenant; (b) `ProvedorFiscalPort` + `FocusNFeAdapter`; (c) fluxo NFC-e para PDV; (d) integração pedido→NF→marketplace. Os webservices SOAP diretos da SEFAZ saem do caminho crítico.
- Ação do usuário (avisar com antecedência): criar conta Focus NFe (homologação é gratuita) e, para produção, certificado A1 do tenant.
- Custo por nota vira linha de custo variável do SaaS (repassável no pricing por plano).

## Prioridade de marketplaces (Fase 3, da pesquisa)

1. **Mercado Livre** (OAuth 6h/refresh 6m uso único, webhooks por referência, 1500 rpm) — primeiro.
2. **Shopee** (HMAC-SHA256, NF-e obrigatória p/ envio) — depois do fiscal v1 funcionar.
3. **Shein** — iniciar credenciamento cedo (lead time manual incerto).
4. TikTok Shop (via hub, tático) · 5. Amazon SP-API · 6. Magalu (spike de validação antes).
