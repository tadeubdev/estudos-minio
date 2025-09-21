# Multi-stage build
FROM node:18-alpine as builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio final
FROM node:18-alpine as production

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do stage de build
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Comando para produção
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
