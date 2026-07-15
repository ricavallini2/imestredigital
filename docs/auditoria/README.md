# Auditoria de Produção — iMestreDigital ERP

Auditoria multi-agente do monorepo (10 microserviços + frontend + infra), 30/06/2026.

## Documentos

- [01 — Roadmap de Produção](01-roadmap-producao.md) — diagnóstico, matriz de maturidade, roadmap em 5 fases, top 15 pendências.
- [02 — Plano Fiscal 100%](02-plano-fiscal-100.md) — estado real do fiscal-service, bloqueadores, 10 etapas técnicas para emitir NF-e/NFC-e, checklist de homologação SEFAZ.
- [03 — Matriz de Maturidade e Achados](03-matriz-maturidade-e-achados.md) — resumo por subsistema.

## Veredito rápido

- **~70% mock / 30% real.** Frontend completo mas roda 100% em mock no dev.
- **Bug raiz sistêmico:** enum drift (o caso `OrigemCliente=WEBSITE`) se repete em quase todos os serviços.
- **3 riscos críticos transversais:** JWT_SECRET não compartilhado; multi-tenancy quebrada em 4 serviços; fiscal-service é mock integral.

> Observação: as sínteses `modeloDados` e `critica` e o mapa `datamodel` não finalizaram (limite de sessão/timeout). Reexecutar depois para completar a análise de integridade cross-service.
