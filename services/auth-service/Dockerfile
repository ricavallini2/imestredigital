# ─── Stage 1: Build ─────────────────────────────────────────────

FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências do sistema
RUN apk add --no-cache python3 make g++

# Copia arquivos de configuração
COPY package.json yarn.lock ./
COPY tsconfig.json nest-cli.json ./
COPY src ./src
COPY prisma ./prisma

# Instala dependências
RUN yarn install --frozen-lockfile

# Compila TypeScript
RUN yarn build

# ─── Stage 2: Runtime ───────────────────────────────────────────

FROM node:20-alpine

WORKDIR /app

# Instala dumb-init para melhor gerenciamento de sinais
RUN apk add --no-cache dumb-init

# Copia node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia arquivos compilados
COPY --from=builder /app/dist ./dist

# Copia prisma para migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Cria usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
