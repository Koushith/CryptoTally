import { Router } from 'express';
import { PasskeyController } from '../controllers/passkey.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * Passkey Routes
 *
 * /api/passkey/*
 */

// Registration (requires authentication)
router.get('/registration/options', authMiddleware, PasskeyController.generateRegistrationOptions);
router.post('/registration/verify', authMiddleware, PasskeyController.verifyRegistration);

// Authentication (public - for sign in)
router.get('/authentication/options', PasskeyController.generateAuthenticationOptions);
router.post('/authentication/verify', PasskeyController.verifyAuthentication);

// Management (requires authentication)
router.get('/', authMiddleware, PasskeyController.listPasskeys);
router.delete('/:id', authMiddleware, PasskeyController.deletePasskey);

export default router;
