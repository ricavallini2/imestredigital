FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Build
RUN npm run build

# Expor porta
EXPOSE 3009

# Comando de inicialização
CMD ["node", "dist/main"]
