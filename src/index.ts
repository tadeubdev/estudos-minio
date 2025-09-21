import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Rota Hello World
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

// Rota adicional de exemplo
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ 
    message: 'Hello from API!',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app;
