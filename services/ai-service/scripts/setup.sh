#!/bin/bash

# Script de setup do AI Service
# Prepara o ambiente para desenvolvimento e produção

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Setup do AI Service - iMestreDigital${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

# 1. Verificar pré-requisitos
echo -e "${YELLOW}[1/6] Verificando pré-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale Node.js 18+${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm não encontrado${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Instale Docker${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
echo -e "${GREEN}✓ npm $(npm -v)${NC}"
echo -e "${GREEN}✓ Docker instalado${NC}"

# 2. Instalar dependências
echo -e "\n${YELLOW}[2/6] Instalando dependências npm...${NC}"

if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✓ Dependências já instaladas${NC}"
fi

# 3. Setup de arquivo .env
echo -e "\n${YELLOW}[3/6] Configurando variáveis de ambiente...${NC}"

if [ ! -f ".env.development" ]; then
    cp .env.example .env.development
    echo -e "${GREEN}✓ Arquivo .env.development criado${NC}"
    echo -e "${YELLOW}  IMPORTANTE: Configure OPENAI_API_KEY em .env.development${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env.development já existe${NC}"
fi

# 4. Iniciar containers Docker
echo -e "\n${YELLOW}[4/6] Iniciando containers Docker...${NC}"

docker-compose up -d

echo -e "${GREEN}✓ Aguardando inicialização dos serviços...${NC}"
sleep 10

# 5. Setup Prisma
echo -e "\n${YELLOW}[5/6] Configurando Prisma...${NC}"

npm run prisma:generate

if npm run prisma:migrate -- --name initial 2>/dev/null; then
    echo -e "${GREEN}✓ Banco de dados migrado${NC}"
else
    echo -e "${YELLOW}! Possível erro na migração (pode ser normal se já existir)${NC}"
fi

# 6. Verificação final
echo -e "\n${YELLOW}[6/6] Verificando health...${NC}"

sleep 5

# Tentar conectar ao PostgreSQL
if docker-compose exec -T postgres pg_isready -U ia_user &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL OK${NC}"
else
    echo -e "${RED}✗ PostgreSQL não respondendo${NC}"
fi

# Tentar conectar ao Redis
if docker-compose exec -T redis redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✓ Redis OK${NC}"
else
    echo -e "${RED}✗ Redis não respondendo${NC}"
fi

# Verificar Kafka
if docker-compose exec -T redpanda rpk cluster info &> /dev/null; then
    echo -e "${GREEN}✓ Kafka/Redpanda OK${NC}"
else
    echo -e "${YELLOW}! Kafka/Redpanda ainda inicializando...${NC}"
fi

# Conclusão
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup concluído com sucesso!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Próximos passos:${NC}"
echo -e "1. Configure OPENAI_API_KEY em .env.development"
echo -e "2. Inicie o servidor: ${GREEN}npm run dev${NC}"
echo -e "3. Acesse Swagger: ${GREEN}http://localhost:3008/docs${NC}"
echo -e "4. Abra Prisma Studio: ${GREEN}npm run prisma:studio${NC}\n"

echo -e "${YELLOW}Serviços disponíveis:${NC}"
echo -e "• API: http://localhost:3008"
echo -e "• Swagger: http://localhost:3008/docs"
echo -e "• PostgreSQL: localhost:5433"
echo -e "• Redis: localhost:6380"
echo -e "• Kafka: localhost:9092"
echo -e "• Prisma Studio: http://localhost:5555\n"

exit 0
