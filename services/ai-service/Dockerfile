# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma client
RUN npm run prisma:generate

# Build da aplicação
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar Prisma schema
COPY prisma ./prisma

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Criar diretório para logs
RUN mkdir -p /app/logs

# Exposar porta
EXPOSE 3008

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3008/saude', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["npm", "start"]
