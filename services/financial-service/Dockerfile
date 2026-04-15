# ═══════════════════════════════════════════════════════════════
# Financial Service - Dockerfile
# ═══════════════════════════════════════════════════════════════

# ─── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json tsconfig.json ./
COPY prisma ./prisma

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src ./src

# Build
RUN npm run build

# ─── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Variáveis de ambiente
ENV NODE_ENV=production

# Instalar dumb-init para sinalização apropriada
RUN apk add --no-cache dumb-init

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código compilado
COPY --from=builder /build/dist ./dist

# Copiar Prisma
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/node_modules/.prisma ./node_modules/.prisma

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3006/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Executar com dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão
CMD ["node", "dist/main"]

EXPOSE 3006
