import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = 5001;

  app.use(cors());
  app.use(express.json());

  app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  
  app.use(vite.middlewares);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();
