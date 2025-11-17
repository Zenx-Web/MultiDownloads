import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

/**
 * Middleware to verify authentication
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const result = await verifyToken(token);

    if (result.error || !result.user) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    // Attach user to request object
    (req as any).user = result.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional auth middleware - continues even if no auth token
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const result = await verifyToken(token);

      if (result.user && !result.error) {
        (req as any).user = result.user;
      }
    }

    next();
  } catch (error) {
    // Continue even if auth fails
    next();
  }
};
