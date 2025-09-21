# Multi-stage build para Vue.js
FROM node:22-alpine as builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Instalar dependências de desenvolvimento para build
RUN npm install

# Copiar código fonte
COPY . .

# Build da aplicação Vue
RUN npm run build

# Estágio final com Nginx
FROM nginx:alpine as production

# Copiar arquivos buildados do Vue
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta
EXPOSE 80

# Comando para produção
CMD ["nginx", "-g", "daemon off;"]
