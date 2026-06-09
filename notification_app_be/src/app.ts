import express from 'express';
import dotenv from 'dotenv';
import priorityRoutes from './routes/priority.routes';

// Load environment variables from .env if present
dotenv.config();

const app = express();
app.use(express.json());

// Mount priority routes
app.use(priorityRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler (simple)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`notification_app_be listening on ${port}`));

export default app;
