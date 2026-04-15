#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# iMestreDigital - Setup Completo do Ambiente de Desenvolvimento
# ═══════════════════════════════════════════════════════════════
# Uso: bash scripts/setup.sh [--skip-docker] [--skip-install] [--seed-only]
# ═══════════════════════════════════════════════════════════════

set -e

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não encontrado. Instale Node.js 20+ antes de continuar."
  exit 1
fi

# Vai para a raiz do projeto
cd "$(dirname "$0")/.."

# Delega para o script Node.js cross-platform
node scripts/setup.js "$@"
