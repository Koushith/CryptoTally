import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * Auth Routes
 *
 * /api/auth/*
 */

// POST /api/auth/sync - Sync Firebase user with PostgreSQL
router.post('/sync', authMiddleware, AuthController.syncUser);

// GET /api/auth/profile - Get current user profile
router.get('/profile', authMiddleware, AuthController.getProfile);

// GET /api/auth/verify - Verify auth token
router.get('/verify', authMiddleware, AuthController.verifyToken);

// POST /api/auth/signout - Sign out and clear browser data
router.post('/signout', authMiddleware, AuthController.signOut);

export default router;
