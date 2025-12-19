/**
 * API Router
 * Main router for all API endpoints
 */

import { Router } from 'express';
import { authRouter } from './auth';
import { sessionsRouter } from './sessions';
import { competenceRouter } from './competence';
import { vaultRouter } from './vault';
import { demoRouter } from './demo';

export const apiRouter = Router();

// API versioning
apiRouter.use('/v1', (req, res, next) => {
  // Add version header
  res.setHeader('X-API-Version', '1.0');
  next();
});

// Route handlers
apiRouter.use('/auth', authRouter);
apiRouter.use('/sessions', sessionsRouter);
apiRouter.use('/competence', competenceRouter);
apiRouter.use('/vault', vaultRouter);
apiRouter.use('/demo', demoRouter);

