# Guia de Deploy — iMestreDigital na VPS Hostinger

## Requisitos da VPS

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| RAM | 4 GB | 8 GB |
| CPU | 2 vCPU | 4 vCPU |
| Disco | 40 GB SSD | 80 GB SSD |
| SO | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

> Com 4GB de RAM, recomendo desativar Elasticsearch, Kibana e Grafana (são opcionais via profiles).

---

## Passo a Passo

### 1. Acessar a VPS

```bash
ssh root@SEU_IP_DA_VPS
```

### 2. Criar usuário (não usar root em produção)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 3. Clonar o repositório

```bash
cd ~
git clone https://SEU_REPOSITORIO.git imestredigital
cd imestredigital
```

### 4. Setup inicial (instala Docker, firewall, swap)

```bash
cd infra/docker
chmod +x deploy.sh
./deploy.sh setup
```

Isso instala automaticamente: Docker, ufw (firewall), fail2ban, swap de 2GB.

**Importante:** Faça logout e login depois do setup para o grupo docker funcionar:
```bash
exit
su - deploy
```

### 5. Configurar variáveis de ambiente

```bash
cd ~/imestredigital/infra/docker
nano .env.production
```

Preencha **obrigatoriamente**:

```env
DOMAIN=seudominio.com.br
POSTGRES_PASSWORD=SenhaForte123!@#
REDIS_PASSWORD=OutraSenhaForte456!@#
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
CERTBOT_EMAIL=seu@email.com
```

**Dica para gerar senhas seguras:**
```bash
openssl rand -base64 32    # senha aleatória
openssl rand -base64 64    # para JWT secrets
```

### 6. Configurar SSL (HTTPS)

Certifique-se que o DNS do domínio já aponta para o IP da VPS, depois:

```bash
./deploy.sh ssl
```

### 7. Deploy!

```bash
./deploy.sh deploy
```

O primeiro build demora ~10-15 minutos (baixa imagens Docker e compila tudo). Deploys subsequentes são mais rápidos por causa do cache.

### 8. Verificar

```bash
./deploy.sh status
```

Acesse `https://seudominio.com.br` no navegador.

---

## Comandos do Dia a Dia

```bash
# Ver status de tudo
./deploy.sh status

# Ver logs (todos ou de um serviço)
./deploy.sh logs
./deploy.sh logs web
./deploy.sh logs auth-service

# Atualizar após git push
./deploy.sh update

# Rebuild apenas o frontend
./deploy.sh deploy web

# Rebuild apenas um microserviço
./deploy.sh deploy catalog-service

# Backup do banco
./deploy.sh backup

# Restaurar backup
./deploy.sh restore backups/imestredigital_backup_20260414_120000.sql.gz

# Rodar migrations
./deploy.sh migrate

# Reiniciar tudo ou um serviço
./deploy.sh restart
./deploy.sh restart redis

# Parar tudo
./deploy.sh stop
```

---

## Uso de Memória Estimado

| Serviço | RAM |
|---------|-----|
| PostgreSQL | ~512 MB |
| Redis | ~128 MB |
| Redpanda | ~256 MB |
| Nginx | ~32 MB |
| Next.js (web) | ~384 MB |
| 10 microserviços NestJS | ~2.5 GB (250 MB cada) |
| **Total base** | **~3.8 GB** |
| Swap (emergência) | 2 GB |

Com 4GB de RAM + 2GB swap, funciona no limite. Com 8GB, fica confortável.

---

## Dicas para VPS com 4GB

Se a RAM estiver apertada, você pode subir gradualmente:

```bash
# Subir só infra + frontend (usa mock APIs)
docker compose -f docker-compose.prod.yml --env-file .env.production \
  up -d postgres redis redpanda nginx web

# Depois adicionar serviços conforme necessário
docker compose -f docker-compose.prod.yml --env-file .env.production \
  up -d auth-service catalog-service
```

---

## Backup Automático (Cron)

```bash
# Editar crontab
crontab -e

# Backup diário às 3h da manhã
0 3 * * * /home/deploy/imestredigital/infra/docker/deploy.sh backup >> /var/log/imestredigital-backup.log 2>&1
```

---

## Monitoramento

```bash
# Uso de recursos em tempo real
docker stats

# Ver espaço em disco
df -h

# Ver uso de memória
free -h

# Logs de um container específico
docker logs imestredigital-web --tail 100 -f
```

---

## Troubleshooting

**Container reiniciando em loop:**
```bash
docker logs NOME_DO_CONTAINER --tail 50
```

**Banco de dados não conecta:**
```bash
docker exec -it imestredigital-postgres psql -U imestredigital -l
```

**SSL não funciona:**
- Verifique se o DNS aponta para o IP correto: `dig seudominio.com.br`
- Recrie o certificado: `./deploy.sh ssl`

**Memória insuficiente:**
```bash
# Ver qual container usa mais
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

# Reiniciar um container que está usando muita memória
docker restart NOME_DO_CONTAINER
```

---

## Estrutura de Arquivos Criados

```
infra/docker/
├── docker-compose.prod.yml     ← Stack completa de produção
├── docker-compose.dev.yml      ← Stack de desenvolvimento (já existia)
├── .env.production.example     ← Template de variáveis
├── .env.production             ← Suas variáveis (NÃO committar!)
├── deploy.sh                   ← Script de deploy automatizado
├── init-db.sql                 ← Inicialização dos databases
├── Dockerfile.web              ← Build do frontend
├── Dockerfile.service          ← Build dos microserviços
└── nginx/
    ├── nginx.conf              ← Config principal do Nginx
    └── conf.d/
        ├── default.conf        ← Server block (rotas → serviços)
        └── proxy_params.conf   ← Headers de proxy
```
