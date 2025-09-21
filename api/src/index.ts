import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import * as Minio from 'minio';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const app = express();
const port = process.env.PORT || 3000;

// Configuração do MinIO
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = 'estudos';

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar bucket se não existir
const initializeBucket = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`✅ Bucket "${BUCKET_NAME}" criado com sucesso`);
    } else {
      console.log(`✅ Bucket "${BUCKET_NAME}" já existe`);
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar bucket:', error);
  }
};

// Rota Hello World
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'API MinIO - Gerenciador de Arquivos',
    bucket: BUCKET_NAME,
    timestamp: new Date().toISOString()
  });
});

// Rota para listar arquivos do bucket com paginação
app.get('/api/files', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const files: any[] = [];
    const stream = minioClient.listObjects(BUCKET_NAME, '', true);

    // Coletar todos os arquivos
    for await (const obj of stream) {
      if (obj.name) {
        const stat = await minioClient.statObject(BUCKET_NAME, obj.name);
        files.push({
          name: obj.name,
          size: obj.size || 0,
          lastModified: obj.lastModified || new Date(),
          etag: obj.etag,
        });
      }
    }

    // Ordenar por data de modificação (mais recente primeiro)
    files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    // Aplicar paginação
    const paginatedFiles = files.slice(skip, skip + limit);
    const hasMore = files.length > skip + limit;

    res.json({
      files: paginatedFiles,
      pagination: {
        page,
        limit,
        total: files.length,
        hasMore,
      },
    });

  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar arquivos',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota para visualizar um arquivo específico
app.get('/api/files/:fileName/view', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    
    // Verificar se o arquivo existe
    await minioClient.statObject(BUCKET_NAME, fileName);
    
    // Obter stream do arquivo
    const stream = await minioClient.getObject(BUCKET_NAME, fileName);
    
    // Definir headers apropriados
    const stat = await minioClient.statObject(BUCKET_NAME, fileName);
    res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 ano
    
    // Pipe do stream para a resposta
    stream.pipe(res);

  } catch (error) {
    console.error('Erro ao obter arquivo:', error);
    if (error instanceof Error && error.message.includes('NoSuchKey')) {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    } else {
      res.status(500).json({ 
        error: 'Erro ao obter arquivo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
});

// Rota para fazer upload de arquivo
app.post('/api/upload', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const file = req.file;
    
    // Validação adicional do tipo de arquivo
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Apenas arquivos de imagem são permitidos!' });
    }

    const fileName = `${Date.now()}_${file.originalname}`;

    // Fazer upload para o MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        'Original-Name': file.originalname,
      }
    );

    res.json({
      message: 'Arquivo enviado com sucesso!',
      fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ 
      error: 'Erro ao fazer upload do arquivo',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota para deletar arquivo
app.delete('/api/files/:fileName', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    
    // Verificar se o arquivo existe antes de tentar deletar
    await minioClient.statObject(BUCKET_NAME, fileName);
    
    // Deletar o arquivo
    await minioClient.removeObject(BUCKET_NAME, fileName);
    
    res.json({
      message: 'Arquivo removido com sucesso!',
      fileName,
    });

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    if (error instanceof Error && error.message.includes('NoSuchKey')) {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    } else {
      res.status(500).json({ 
        error: 'Erro ao deletar arquivo',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
});

// Rota de health check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Testar conexão com MinIO
    await minioClient.listBuckets();
    
    res.json({
      status: 'OK',
      message: 'API funcionando corretamente',
      minio: 'Conectado',
      bucket: BUCKET_NAME,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Erro na conexão com MinIO',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erro:', err.stack);
  
  if (err.message.includes('File too large')) {
    return res.status(413).json({ error: 'Arquivo muito grande. Máximo permitido: 10MB' });
  }
  
  if (err.message.includes('Apenas arquivos de imagem')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    await initializeBucket();
    
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📁 Bucket: ${BUCKET_NAME}`);
      console.log(`🗃️  MinIO: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
