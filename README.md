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
- **Node.js 22** + **TypeScript**
- **Express.js** para API REST
- **MinIO SDK** para gerenciamento de arquivos
- **Multer** para upload de arquivos
- **CORS** para permitir requisições do frontend
- **Nodemon** para hot reload em desenvolvimento
- **Multi-stage Docker build** para otimização

### Frontend (App)
- **Vue.js 3** + **TypeScript**
- **Vite** para bundling e dev server (requer Node.js 22+)
- **Tailwind CSS** para estilização
- **SweetAlert2** para alertas e confirmações
- **Axios** para requisições HTTP
- **Hot Module Replacement** em desenvolvimento
- **Nginx** para serving em produção

### Infrastructure
- **MinIO** para object storage
- **Docker** + **Docker Compose**
- **Nginx** como reverse proxy em produção

## 🚦 API Endpoints

### Arquivos
- `GET /api/files` - Listar arquivos com paginação
  - Query params: `page` (número da página), `limit` (arquivos por página)
- `GET /api/files/:fileName/view` - Visualizar arquivo específico
- `POST /api/upload` - Upload de imagem (FormData com campo 'file')
- `DELETE /api/files/:fileName` - Deletar arquivo específico

### Sistema
- `GET /` - Informações da API
- `GET /api/health` - Status da API e conexão com MinIO

### Validações
- Apenas imagens são aceitas (PNG, JPG, JPEG, GIF, WebP)
- Tamanho máximo: 10MB por arquivo
- Bucket utilizado: `estudos`

## 🎨 Funcionalidades do Frontend

### Interface Principal
- ✅ **Título e subtítulo** centralizados
- ✅ **Lista de arquivos** com thumbnails para imagens
- ✅ **Informações do arquivo**: nome, tamanho, data de modificação
- ✅ **Botão de remoção** com confirmação via SweetAlert2
- ✅ **Loading states** para operações assíncronas

### Sistema de Upload
- ✅ **Área de drag & drop** (visual)
- ✅ **Validação de tipo** (apenas imagens)
- ✅ **Validação de tamanho** (máximo 10MB)
- ✅ **Preview da imagem** selecionada
- ✅ **Barra de progresso** durante upload
- ✅ **Feedback visual** com SweetAlert2

### Funcionalidades Avançadas
- ✅ **Scroll infinito** para carregar mais arquivos
- ✅ **Paginação automática** (10 arquivos por vez)
- ✅ **Cache de imagens** com headers apropriados
- ✅ **Estados de loading** para todas as operações
- ✅ **Tratamento de erros** com mensagens amigáveis

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

## 📝 Status do Projeto

### ✅ Concluído
1. ✅ Estrutura separada API/Frontend
2. ✅ Docker containers configurados para dev e produção
3. ✅ Vue.js app com Tailwind CSS
4. ✅ Interface completa de gerenciamento de arquivos
5. ✅ Upload de imagens com validação e preview
6. ✅ Lista de arquivos com scroll infinito
7. ✅ Integração completa com MinIO
8. ✅ Sistema de confirmação para deleções
9. ✅ API REST completa para gerenciamento de arquivos
10. ✅ Tratamento de erros e loading states

### 🔄 Melhorias Futuras
- 🔄 Drag & drop funcional para upload
- 🔄 Suporte a múltiplos arquivos
- 🔄 Sistema de pastas/organização
- 🔄 Busca e filtros
- 🔄 Autenticação e autorização
- 🔄 Testes automatizados
- 🔄 Compressão automática de imagens
- 🔄 Metadados customizados

## 🚀 Como Testar

1. **Iniciar em desenvolvimento:**
   ```bash
   docker-compose -f docker-compose-dev.yml up --build
   ```

2. **Acessar a aplicação:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000
   - MinIO Console: http://localhost:9001

3. **Testar funcionalidades:**
   - Upload de imagens (PNG, JPG, JPEG, GIF)
   - Visualização da lista de arquivos
   - Remoção de arquivos com confirmação
   - Scroll infinito (adicione vários arquivos)
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
