/**
 * Authentication Middleware
 * JWT token verification
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }

    // Attach user ID to request
    req.userId = (decoded as { userId: string }).userId;
    next();
  });
}

