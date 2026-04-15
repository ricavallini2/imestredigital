# ═══════════════════════════════════════════════════════════════
# iMestreDigital - Setup Completo do Ambiente de Desenvolvimento
# ═══════════════════════════════════════════════════════════════
# Uso: .\scripts\setup.ps1 [--skip-docker] [--skip-install] [--seed-only]
#
# Para permitir execução no PowerShell:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# ═══════════════════════════════════════════════════════════════

# Verifica se Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js nao encontrado. Instale Node.js 20+ antes de continuar."
    exit 1
}

# Vai para a raiz do projeto
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "..")

# Delega para o script Node.js cross-platform
node scripts/setup.js @args
