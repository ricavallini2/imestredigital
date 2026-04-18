#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# iMestreDigital - Script de Deploy para VPS
# ═══════════════════════════════════════════════════════════════
# Uso:
#   ./deploy.sh setup          → Primeira vez (instala Docker, configura tudo)
#   ./deploy.sh deploy         → Build + deploy de todos os serviços
#   ./deploy.sh deploy web     → Rebuild apenas o frontend
#   ./deploy.sh deploy auth-service → Rebuild apenas um serviço
#   ./deploy.sh ssl            → Gera/renova certificado SSL
#   ./deploy.sh logs           → Ver logs em tempo real
#   ./deploy.sh status         → Status de todos os containers
#   ./deploy.sh backup         → Backup do banco de dados
#   ./deploy.sh restore FILE   → Restaurar backup
#   ./deploy.sh migrate        → Rodar migrations do Prisma
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ─── Configuração ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOCKER_DIR="$SCRIPT_DIR"
COMPOSE_FILE="$DOCKER_DIR/docker-compose.prod.yml"
ENV_FILE="$DOCKER_DIR/.env.production"
BACKUP_DIR="$PROJECT_ROOT/backups"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERRO]${NC} $1"; }

# ─── Verificações ──────────────────────────────────────────
check_env() {
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Arquivo .env.production não encontrado!"
        log_info "Copie o template: cp .env.production.example .env.production"
        log_info "Depois edite com seus valores: nano .env.production"
        exit 1
    fi
    source "$ENV_FILE"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker não instalado! Execute: ./deploy.sh setup"
        exit 1
    fi
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose V2 não encontrado!"
        exit 1
    fi
}

# ─── Comandos ──────────────────────────────────────────────

cmd_setup() {
    log_info "═══ Configuração Inicial da VPS ═══"

    # Atualizar sistema
    log_info "Atualizando sistema..."
    sudo apt update && sudo apt upgrade -y

    # Instalar dependências
    log_info "Instalando dependências..."
    sudo apt install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        ufw \
        fail2ban \
        htop \
        git

    # Instalar Docker
    if ! command -v docker &> /dev/null; then
        log_info "Instalando Docker..."
        curl -fsSL https://get.docker.com | sudo sh
        sudo usermod -aG docker $USER
        sudo systemctl enable docker
        sudo systemctl start docker
        log_ok "Docker instalado!"
    else
        log_ok "Docker já instalado: $(docker --version)"
    fi

    # Configurar Firewall
    log_info "Configurando firewall..."
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    log_ok "Firewall configurado (SSH, HTTP, HTTPS)"

    # Configurar fail2ban
    log_info "Configurando fail2ban..."
    sudo systemctl enable fail2ban
    sudo systemctl start fail2ban
    log_ok "fail2ban ativo"

    # Configurar swap (importante para VPS com pouca RAM)
    if [ ! -f /swapfile ]; then
        log_info "Criando swap de 2GB..."
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        # Otimizar swappiness para produção
        sudo sysctl vm.swappiness=10
        echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
        log_ok "Swap de 2GB criado"
    else
        log_ok "Swap já existe"
    fi

    # Copiar .env template
    if [ ! -f "$ENV_FILE" ]; then
        cp "$DOCKER_DIR/.env.production.example" "$ENV_FILE"
        log_warn "Arquivo .env.production criado a partir do template."
        log_warn "EDITE AGORA com seus valores: nano $ENV_FILE"
    fi

    log_ok "═══ Setup concluído! ═══"
    log_info "Próximos passos:"
    log_info "  1. Edite: nano $ENV_FILE"
    log_info "  2. SSL:   ./deploy.sh ssl"
    log_info "  3. Deploy: ./deploy.sh deploy"
    echo ""
    log_warn "Se acabou de adicionar seu usuário ao grupo docker,"
    log_warn "faça logout e login novamente para aplicar."
}

cmd_ssl() {
    check_env
    log_info "═══ Configurando SSL com Let's Encrypt ═══"

    DOMAIN="${DOMAIN:?Defina DOMAIN no .env.production}"
    EMAIL="${CERTBOT_EMAIL:?Defina CERTBOT_EMAIL no .env.production}"

    # Substituir domínio no nginx config
    log_info "Configurando Nginx para domínio: $DOMAIN"
    sed -i "s/SEUDOMINIO.COM.BR/$DOMAIN/g" "$DOCKER_DIR/nginx/conf.d/default.conf"

    # Primeiro, subir nginx sem SSL para o desafio ACME
    log_info "Criando configuração temporária HTTP-only..."
    cat > "$DOCKER_DIR/nginx/conf.d/temp-http.conf" << NGINX_EOF
server {
    listen 80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'iMestreDigital - Aguardando SSL...';
        add_header Content-Type text/plain;
    }
}
NGINX_EOF

    # Renomear config HTTPS temporariamente
    if [ -f "$DOCKER_DIR/nginx/conf.d/default.conf" ]; then
        mv "$DOCKER_DIR/nginx/conf.d/default.conf" "$DOCKER_DIR/nginx/conf.d/default.conf.bak"
    fi

    # Subir apenas nginx
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d nginx
    sleep 3

    # Gerar certificado
    log_info "Gerando certificado SSL..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm certbot \
        certbot certonly --webroot \
        -w /var/www/certbot \
        -d "$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --force-renewal

    # Restaurar config HTTPS
    rm -f "$DOCKER_DIR/nginx/conf.d/temp-http.conf"
    if [ -f "$DOCKER_DIR/nginx/conf.d/default.conf.bak" ]; then
        mv "$DOCKER_DIR/nginx/conf.d/default.conf.bak" "$DOCKER_DIR/nginx/conf.d/default.conf"
    fi

    # Restart nginx com SSL
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart nginx

    log_ok "═══ SSL configurado com sucesso! ═══"
    log_info "Certificado será renovado automaticamente pelo Certbot."
}

cmd_deploy() {
    check_env
    check_docker
    log_info "═══ Iniciando Deploy ═══"

    SERVICE="${1:-}"

    # Substituir domínio no nginx config (caso não tenha sido feito)
    if [ -n "${DOMAIN:-}" ]; then
        sed -i "s/SEUDOMINIO.COM.BR/$DOMAIN/g" "$DOCKER_DIR/nginx/conf.d/default.conf" 2>/dev/null || true
    fi

    cd "$PROJECT_ROOT"

    if [ -n "$SERVICE" ]; then
        log_info "Rebuild do serviço: $SERVICE"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            build --no-cache "$SERVICE"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            up -d "$SERVICE"
    else
        log_info "Build de todos os serviços..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            build --parallel

        log_info "Subindo infraestrutura (postgres, redis, redpanda)..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            up -d postgres redis redpanda

        log_info "Aguardando infraestrutura ficar saudável..."
        sleep 10

        log_info "Subindo todos os serviços..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            up -d

        log_info "Rodando migrations..."
        cmd_migrate
    fi

    log_ok "═══ Deploy concluído! ═══"
    cmd_status
}

cmd_migrate() {
    check_env
    log_info "═══ Aplicando Schema ao Banco (prisma db push) ═══"

    SERVICES=(
        "auth-service"
        "catalog-service"
        "inventory-service"
        "order-service"
        "financial-service"
        "fiscal-service"
        "customer-service"
        "notification-service"
        "marketplace-service"
        "ai-service"
    )

    for svc in "${SERVICES[@]}"; do
        log_info "Schema push: $svc"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            exec -T "$svc" npx prisma db push --accept-data-loss 2>&1 | tail -5 || \
            log_warn "db push falhou para $svc — verifique se o container está rodando"
    done

    log_ok "Schema aplicado em todos os serviços"
}

cmd_seed() {
    check_env
    log_info "═══ Rodando Seeds ═══"

    SERVICES=(
        "auth-service"
        "catalog-service"
        "inventory-service"
        "order-service"
        "financial-service"
        "fiscal-service"
        "customer-service"
        "marketplace-service"
        "ai-service"
        "notification-service"
    )

    for svc in "${SERVICES[@]}"; do
        log_info "Seed: $svc"
        # Tenta prisma db seed primeiro; se não tiver config, roda ts-node direto
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
            exec -T "$svc" sh -c 'npx prisma db seed 2>/dev/null || node_modules/.bin/ts-node prisma/seed.ts 2>/dev/null || node_modules/.bin/tsx prisma/seed.ts 2>/dev/null || echo "Seed não disponível"'
    done

    log_ok "Seeds concluídos"
}

cmd_logs() {
    check_docker
    SERVICE="${1:-}"
    if [ -n "$SERVICE" ]; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f "$SERVICE"
    else
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f
    fi
}

cmd_status() {
    check_docker
    echo ""
    log_info "═══ Status dos Containers ═══"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps -a
    echo ""
    log_info "═══ Uso de Recursos ═══"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" 2>/dev/null || true
}

cmd_backup() {
    check_env
    check_docker
    log_info "═══ Backup do Banco de Dados ═══"

    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/imestredigital_backup_${TIMESTAMP}.sql.gz"

    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
        exec -T postgres pg_dumpall -U "${POSTGRES_USER:-imestredigital}" | gzip > "$BACKUP_FILE"

    log_ok "Backup salvo: $BACKUP_FILE"
    log_info "Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"

    # Limpar backups antigos (manter últimos 7)
    ls -tp "$BACKUP_DIR"/imestredigital_backup_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm --
    log_info "Backups antigos limpos (mantidos últimos 7)"
}

cmd_restore() {
    check_env
    check_docker
    BACKUP_FILE="${1:?Uso: ./deploy.sh restore ARQUIVO.sql.gz}"

    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "Arquivo não encontrado: $BACKUP_FILE"
        exit 1
    fi

    log_warn "ATENÇÃO: Isso vai sobrescrever TODOS os dados atuais!"
    read -p "Tem certeza? (digite SIM para confirmar): " CONFIRM
    if [ "$CONFIRM" != "SIM" ]; then
        log_info "Restauração cancelada."
        exit 0
    fi

    log_info "Restaurando backup: $BACKUP_FILE"
    gunzip -c "$BACKUP_FILE" | docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" \
        exec -T postgres psql -U "${POSTGRES_USER:-imestredigital}"

    log_ok "Backup restaurado com sucesso!"
}

cmd_stop() {
    check_docker
    log_info "Parando todos os serviços..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    log_ok "Todos os serviços parados."
}

cmd_restart() {
    check_docker
    SERVICE="${1:-}"
    if [ -n "$SERVICE" ]; then
        log_info "Reiniciando: $SERVICE"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart "$SERVICE"
    else
        log_info "Reiniciando todos os serviços..."
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
    fi
    log_ok "Reinício concluído."
}

cmd_update() {
    check_env
    check_docker
    log_info "═══ Atualizando aplicação (git pull + rebuild) ═══"

    cd "$PROJECT_ROOT"

    log_info "Puxando atualizações do Git..."
    git pull origin main

    log_info "Fazendo rebuild..."
    cmd_deploy

    log_ok "═══ Atualização concluída! ═══"
}

# ─── Help ──────────────────────────────────────────────────
cmd_help() {
    echo ""
    echo "═══ iMestreDigital - Comandos de Deploy ═══"
    echo ""
    echo "  setup              Configuração inicial da VPS (Docker, firewall, swap)"
    echo "  deploy [serviço]   Build e deploy (todos ou um serviço específico)"
    echo "  ssl                Gerar/renovar certificado SSL"
    echo "  migrate            Rodar migrations do Prisma"
    echo "  seed               Rodar seeds do banco"
    echo "  logs [serviço]     Ver logs em tempo real"
    echo "  status             Status e uso de recursos"
    echo "  backup             Backup completo do banco"
    echo "  restore ARQUIVO    Restaurar um backup"
    echo "  stop               Parar todos os serviços"
    echo "  restart [serviço]  Reiniciar serviços"
    echo "  update             Git pull + rebuild + deploy"
    echo "  help               Mostrar esta ajuda"
    echo ""
}

# ─── Router ────────────────────────────────────────────────
COMMAND="${1:-help}"
shift 2>/dev/null || true

case "$COMMAND" in
    setup)   cmd_setup "$@" ;;
    deploy)  cmd_deploy "$@" ;;
    ssl)     cmd_ssl "$@" ;;
    migrate) cmd_migrate "$@" ;;
    seed)    cmd_seed "$@" ;;
    logs)    cmd_logs "$@" ;;
    status)  cmd_status "$@" ;;
    backup)  cmd_backup "$@" ;;
    restore) cmd_restore "$@" ;;
    stop)    cmd_stop "$@" ;;
    restart) cmd_restart "$@" ;;
    update)  cmd_update "$@" ;;
    help)    cmd_help ;;
    *)       log_error "Comando desconhecido: $COMMAND"; cmd_help; exit 1 ;;
esac
