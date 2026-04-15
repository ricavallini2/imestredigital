# ═══════════════════════════════════════════════════════════════
# Dockerfile - Order Service
# ═══════════════════════════════════════════════════════════════

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependências
RUN npm ci

# Copiar source
COPY src ./src
COPY prisma ./prisma

# Build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar Prisma schema
COPY prisma ./prisma

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Exposar porta
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run
CMD ["node", "dist/main"]
