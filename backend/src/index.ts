/**
 * Ary Backend Server
 * Entry point for the API server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'net';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { apiRouter } from './api';

// Load environment variables
dotenv.config();

/**
 * Check if a port is available
 */
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
};

/**
 * Find an available port starting from the given port
 */
const findAvailablePort = async (startPort: number, maxAttempts: number = 10): Promise<number> => {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
};

const app = express();
const desiredPort = parseInt(process.env.PORT || '3001', 10);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Try to find an available port
    const PORT = await findAvailablePort(desiredPort);
    
    if (PORT !== desiredPort) {
      logger.warn(`Port ${desiredPort} is in use, using port ${PORT} instead.`);
    }
    
    const server = app.listen(PORT, () => {
      logger.info(`Ary backend server running on port ${PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error('Server error:', { error: err });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', { error });
    process.exit(1);
  }
};

startServer();

export default app;

