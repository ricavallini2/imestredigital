#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# iMestreDigital - Seed de Dados para Desenvolvimento
# ═══════════════════════════════════════════════════════════════
# Executa os seeds de todos os serviços na ordem correta.
# O auth-service deve rodar primeiro (cria tenant e usuários).
#
# Uso: bash scripts/seed-all.sh
#   ou: node scripts/setup.js --seed-only
# ═══════════════════════════════════════════════════════════════

# Delega para o script Node.js
cd "$(dirname "$0")/.."
node scripts/setup.js --seed-only --skip-docker --skip-install
