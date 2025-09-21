# MinIO Full Stack Application

Aplicação completa com API Node.js/TypeScript, Frontend Vue.js/TypeScript e MinIO, tudo orquestrado com Docker.

## 📁 Estrutura do Projeto

```
├── api/                    # API Node.js + TypeScript + Express
│   ├── src/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── app/                    # Frontend Vue.js + TypeScript + Vite
│   ├── src/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── nginx/                  # Configurações do Nginx
│   ├── nginx.conf
│   └── default.conf
├── docker-compose.yml      # Compose para produção
└── docker-compose-dev.yml  # Compose para desenvolvimento
```

## 🚀 Desenvolvimento

Para rodar em modo desenvolvimento:

```bash
# Subir todos os serviços
docker-compose -f docker-compose-dev.yml up --build

# Parar os serviços
docker-compose -f docker-compose-dev.yml down

# Rebuild específico
docker-compose -f docker-compose-dev.yml up --build api
docker-compose -f docker-compose-dev.yml up --build frontend
```

### Serviços disponíveis em desenvolvimento:
- **Frontend Vue.js**: http://localhost:5173 (Vite dev server)
- **API Node.js**: http://localhost:3000
- **MinIO Storage**: http://localhost:9000
- **MinIO Console**: http://localhost:9001 (usuário: minioadmin, senha: minioadmin)

## 🏭 Produção

Para rodar em modo produção:

```bash
# Subir todos os serviços
docker-compose up --build

# Parar os serviços
docker-compose down
```

### Serviços disponíveis em produção:
- **Frontend (via Nginx)**: http://localhost:80
- **API**: http://localhost:80/api/
- **MinIO Console**: http://localhost:80/minio/
- **MinIO Storage**: http://localhost:9000
- **Frontend direto**: http://localhost:8080

## 🔧 Tecnologias

### Backend (API)
- **Node.js 18** + **TypeScript**
- **Express.js** para API REST
- **Nodemon** para hot reload em desenvolvimento
- **Multi-stage Docker build** para otimização

### Frontend (App)
- **Vue.js 3** + **TypeScript**
- **Vite** para bundling e dev server
- **Hot Module Replacement** em desenvolvimento
- **Nginx** para serving em produção

### Infrastructure
- **MinIO** para object storage
- **Docker** + **Docker Compose**
- **Nginx** como reverse proxy em produção

## 🏗️ Comandos Úteis

### Desenvolvimento local (sem Docker)
```bash
# API
cd api && npm install && npm run dev

# Frontend
cd app && npm install && npm run dev
```

### Docker - Serviços individuais
```bash
# Apenas MinIO
docker-compose -f docker-compose-dev.yml up minio

# Apenas API
docker-compose -f docker-compose-dev.yml up api

# Apenas Frontend
docker-compose -f docker-compose-dev.yml up frontend
```

### Build para produção
```bash
# Build das imagens
docker-compose build

# Build específico
docker-compose build api
docker-compose build frontend
```

## 🔐 Configuração MinIO

### Credenciais padrão:
- **Usuário**: minioadmin
- **Senha**: minioadmin

### Variáveis de ambiente da API:
```bash
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
```

## 🚦 Rotas da API

- `GET /` - Hello World
- `GET /api/hello` - Hello World da API com timestamp

## 📝 Próximos passos

1. ✅ Estrutura separada API/Frontend
2. ✅ Docker containers configurados
3. ✅ Vue.js app criado
4. 🔄 Integrar MinIO SDK na API
5. 🔄 Criar interface Vue.js para upload/download
6. 🔄 Implementar autenticação
7. 🔄 Testes automatizados
docker-compose down
```

### Serviços disponíveis em produção:
- **Frontend (Nginx)**: http://localhost:80
- **API**: http://localhost:80/api/
- **MinIO Console**: http://localhost:80/minio/
- **MinIO Storage**: http://localhost:9000

## 📁 Estrutura

```
├── src/                    # Código fonte da API
├── nginx/                  # Configurações do Nginx
├── Dockerfile             # Docker para produção
├── Dockerfile.dev         # Docker para desenvolvimento
├── docker-compose.yml     # Compose para produção
└── docker-compose-dev.yml # Compose para desenvolvimento
```

## 🔧 Configuração

### Variáveis de ambiente MinIO:
- `MINIO_ROOT_USER`: minioadmin
- `MINIO_ROOT_PASSWORD`: minioadmin

### Rotas da API:
- `GET /` - Hello World
- `GET /api/hello` - Hello World da API
