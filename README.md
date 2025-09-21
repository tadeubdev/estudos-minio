# MinIO API com Docker

API Node.js com TypeScript, Express e MinIO configurada com Docker.

## 🚀 Desenvolvimento

Para rodar em modo desenvolvimento:

```bash
# Subir os serviços
docker-compose -f docker-compose-dev.yml up --build

# Parar os serviços
docker-compose -f docker-compose-dev.yml down
```

### Serviços disponíveis em desenvolvimento:
- **API**: http://localhost:3000
- **MinIO Storage**: http://localhost:9000
- **MinIO Console**: http://localhost:9001 (usuário: minioadmin, senha: minioadmin)

## 🏭 Produção

Para rodar em modo produção:

```bash
# Subir os serviços
docker-compose up --build

# Parar os serviços
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
