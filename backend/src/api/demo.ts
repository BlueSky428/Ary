/**
 * Demo/Landing Page API
 * Handles interactive demo for landing page
 * No authentication required - public endpoint
 */

import { Router } from 'express';
import { demoInferenceEngine } from '../core/inference/demoEngine';

export const demoRouter = Router();

/**
 * POST /api/demo/analyze
 * Analyzes user input from landing page demo
 * Returns minimal competence profile
 */
demoRouter.post('/analyze', async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array is required',
      });
    }

    // Extract text from messages
    const conversationText = messages
      .map((msg: { content: string }) => msg.content)
      .join(' ');

    // Run simple keyword-based inference
    const signals = demoInferenceEngine.analyze(conversationText);

    // Return minimal profile (no user data stored)
    res.json({
      success: true,
      data: {
        signals,
        message: 'This is a demo. Sign up to experience the full Ary companion.',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/demo/waitlist
 * Adds email to waitlist
 */
demoRouter.post('/waitlist', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required',
      });
    }

    // TODO: Store email in database (waitlist table)
    // For now, just return success
    res.json({
      success: true,
      message: 'Thank you for joining the waitlist!',
    });
  } catch (error) {
    next(error);
  }
});

