import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebase';

/**
 * Extended Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string | undefined;
    emailVerified: boolean;
    name: string | undefined;
  };
}

/**
 * Auth Middleware
 *
 * Verifies Firebase ID token and attaches user info to request
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified || false,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token',
    });
  }
}

/**
 * Optional Auth Middleware
 *
 * Attempts to verify token but doesn't fail if not present
 */
export async function optionalAuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        name: decodedToken.name,
      };
    }

    next();
  } catch (error) {
    // Continue without user info
    next();
  }
}
