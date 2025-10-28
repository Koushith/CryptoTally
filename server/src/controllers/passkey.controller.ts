import { Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from '@simplewebauthn/server';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../config/database';
import { users, passkeys, passkeysChallenges } from '../db/schema';
import { AuthRequest } from '../middleware/auth.middleware';
import { admin } from '../config/firebase';

// WebAuthn configuration
const rpName = 'CryptoTally';
const rpID = process.env.RP_ID || 'localhost';
const origin = process.env.FRONTEND_URL || 'http://localhost:5173';

// Log configuration on startup
console.log('🔐 WebAuthn Configuration:', {
  rpName,
  rpID,
  origin,
  environment: process.env.NODE_ENV,
});

/**
 * Passkey Controller
 *
 * Handles WebAuthn passkey registration and authentication
 * Integrates with Firebase for session management
 */
export class PasskeyController {
  /**
   * Generate registration options
   *
   * Step 1 of passkey registration
   * Returns options for browser's navigator.credentials.create()
   */
  static async generateRegistrationOptions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, req.user.uid))
        .limit(1);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Get existing passkeys for this user
      const userPasskeys = await db
        .select()
        .from(passkeys)
        .where(eq(passkeys.userId, user.id));

      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: new TextEncoder().encode(user.id.toString()),
        userName: user.email,
        userDisplayName: user.name || user.email,
        // Prevent re-registration of existing credentials
        excludeCredentials: userPasskeys.map((pk) => ({
          id: pk.credentialId,
          transports: pk.transports ? JSON.parse(pk.transports) : undefined,
        })),
        authenticatorSelection: {
          residentKey: 'preferred', // Allow device-bound keys
          userVerification: 'preferred', // Biometric/PIN preferred
          authenticatorAttachment: 'platform', // Platform authenticators (Touch ID, Face ID) preferred
        },
      });

      // Store challenge for verification
      await db.insert(passkeysChallenges).values({
        challenge: options.challenge,
        userId: user.id,
        type: 'registration',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      return res.status(200).json({
        success: true,
        data: options,
      });
    } catch (error) {
      console.error('Generate registration options error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate registration options',
      });
    }
  }

  /**
   * Verify registration response
   *
   * Step 2 of passkey registration
   * Verifies the credential created by the browser
   */
  static async verifyRegistration(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { credential, deviceName } = req.body as {
        credential: RegistrationResponseJSON;
        deviceName?: string;
      };

      if (!credential) {
        return res.status(400).json({
          success: false,
          error: 'Credential is required',
        });
      }

      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, req.user.uid))
        .limit(1);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Get and verify challenge
      const [challengeRecord] = await db
        .select()
        .from(passkeysChallenges)
        .where(
          and(
            eq(passkeysChallenges.userId, user.id),
            eq(passkeysChallenges.type, 'registration')
          )
        )
        .orderBy(desc(passkeysChallenges.createdAt))
        .limit(1);

      if (!challengeRecord) {
        return res.status(400).json({
          success: false,
          error: 'No pending registration',
        });
      }

      if (new Date() > challengeRecord.expiresAt) {
        await db
          .delete(passkeysChallenges)
          .where(eq(passkeysChallenges.id, challengeRecord.id));
        return res.status(400).json({
          success: false,
          error: 'Challenge expired',
        });
      }

      // Verify the registration response
      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });

      if (!verification.verified || !verification.registrationInfo) {
        return res.status(400).json({
          success: false,
          error: 'Verification failed',
        });
      }

      const { credential: cred, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      // Store the passkey
      const [newPasskey] = await db
        .insert(passkeys)
        .values({
          userId: user.id,
          credentialId: cred.id,
          publicKey: Buffer.from(cred.publicKey).toString('base64url'),
          counter: cred.counter,
          deviceType: credentialDeviceType,
          backupEligible: credentialBackedUp,
          backupState: credentialBackedUp,
          transports: credential.response.transports
            ? JSON.stringify(credential.response.transports)
            : null,
          name: deviceName || `Passkey ${Date.now()}`,
        })
        .returning();

      // Delete used challenge
      await db
        .delete(passkeysChallenges)
        .where(eq(passkeysChallenges.id, challengeRecord.id));

      return res.status(200).json({
        success: true,
        data: {
          id: newPasskey.id,
          name: newPasskey.name,
          deviceType: newPasskey.deviceType,
          createdAt: newPasskey.createdAt,
        },
        message: 'Passkey registered successfully',
      });
    } catch (error: any) {
      console.error('Verify registration error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      return res.status(500).json({
        success: false,
        error: 'Failed to verify registration',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Generate authentication options
   *
   * Step 1 of passkey authentication (sign in)
   * Returns options for browser's navigator.credentials.get()
   */
  static async generateAuthenticationOptions(req: AuthRequest, res: Response) {
    try {
      // For authentication, we don't require user to be logged in
      // They can authenticate with any registered passkey

      const options = await generateAuthenticationOptions({
        rpID,
        userVerification: 'preferred',
        // Allow any registered passkey (discoverable credentials)
        allowCredentials: [],
      });

      // Store challenge (no userId since user not authenticated yet)
      await db.insert(passkeysChallenges).values({
        challenge: options.challenge,
        type: 'authentication',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      });

      return res.status(200).json({
        success: true,
        data: options,
      });
    } catch (error) {
      console.error('Generate authentication options error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate authentication options',
      });
    }
  }

  /**
   * Verify authentication response
   *
   * Step 2 of passkey authentication (sign in)
   * Verifies the signature and creates Firebase custom token
   */
  static async verifyAuthentication(req: AuthRequest, res: Response) {
    try {
      const { credential } = req.body as {
        credential: AuthenticationResponseJSON;
      };

      if (!credential) {
        return res.status(400).json({
          success: false,
          error: 'Credential is required',
        });
      }

      // Get challenge
      const [challengeRecord] = await db
        .select()
        .from(passkeysChallenges)
        .where(eq(passkeysChallenges.type, 'authentication'))
        .orderBy(desc(passkeysChallenges.createdAt))
        .limit(1);

      if (!challengeRecord) {
        return res.status(400).json({
          success: false,
          error: 'No pending authentication',
        });
      }

      if (new Date() > challengeRecord.expiresAt) {
        await db
          .delete(passkeysChallenges)
          .where(eq(passkeysChallenges.id, challengeRecord.id));
        return res.status(400).json({
          success: false,
          error: 'Challenge expired',
        });
      }

      // Find the passkey by credential ID
      const credentialIdBase64 = Buffer.from(credential.id, 'base64url').toString('base64url');
      const [passkey] = await db
        .select()
        .from(passkeys)
        .where(eq(passkeys.credentialId, credentialIdBase64))
        .limit(1);

      if (!passkey) {
        return res.status(404).json({
          success: false,
          error: 'Passkey not found',
        });
      }

      // Verify the authentication response
      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: passkey.credentialId,
          publicKey: Buffer.from(passkey.publicKey, 'base64url'),
          counter: passkey.counter,
        },
      });

      if (!verification.verified) {
        return res.status(400).json({
          success: false,
          error: 'Verification failed',
        });
      }

      // Update counter
      await db
        .update(passkeys)
        .set({
          counter: verification.authenticationInfo.newCounter,
          lastUsedAt: new Date(),
        })
        .where(eq(passkeys.id, passkey.id));

      // Get user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, passkey.userId))
        .limit(1);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Create Firebase custom token
      const customToken = await admin.auth().createCustomToken(user.firebaseUid);

      // Delete used challenge
      await db
        .delete(passkeysChallenges)
        .where(eq(passkeysChallenges.id, challengeRecord.id));

      return res.status(200).json({
        success: true,
        data: {
          customToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            photoUrl: user.photoUrl,
          },
        },
        message: 'Authentication successful',
      });
    } catch (error) {
      console.error('Verify authentication error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify authentication',
      });
    }
  }

  /**
   * List user's passkeys
   *
   * Returns all passkeys registered for the authenticated user
   */
  static async listPasskeys(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, req.user.uid))
        .limit(1);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const userPasskeys = await db
        .select({
          id: passkeys.id,
          name: passkeys.name,
          deviceType: passkeys.deviceType,
          createdAt: passkeys.createdAt,
          lastUsedAt: passkeys.lastUsedAt,
        })
        .from(passkeys)
        .where(eq(passkeys.userId, user.id));

      return res.status(200).json({
        success: true,
        data: userPasskeys,
      });
    } catch (error) {
      console.error('List passkeys error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to list passkeys',
      });
    }
  }

  /**
   * Delete a passkey
   *
   * Removes a passkey from user's account
   */
  static async deletePasskey(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, req.user.uid))
        .limit(1);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Verify passkey belongs to user
      const [passkey] = await db
        .select()
        .from(passkeys)
        .where(and(eq(passkeys.id, parseInt(id)), eq(passkeys.userId, user.id)))
        .limit(1);

      if (!passkey) {
        return res.status(404).json({
          success: false,
          error: 'Passkey not found',
        });
      }

      // Delete passkey
      await db.delete(passkeys).where(eq(passkeys.id, parseInt(id)));

      return res.status(200).json({
        success: true,
        message: 'Passkey deleted successfully',
      });
    } catch (error) {
      console.error('Delete passkey error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete passkey',
      });
    }
  }
}
