import { Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../config/database';
import { users, workspaces, workspaceMembers } from '../db/schema';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Auth Controller
 *
 * Handles user authentication and syncing with PostgreSQL
 */
export class AuthController {
  /**
   * Sync Firebase user with PostgreSQL
   *
   * Creates or updates user record in PostgreSQL database
   */
  static async syncUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { uid, email, emailVerified, name } = req.user;
      const { photoUrl, authProvider } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
        });
      }

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.firebaseUid, uid))
        .limit(1);

      let user;

      if (existingUser.length > 0) {
        // Update existing user
        const [updatedUser] = await db
          .update(users)
          .set({
            email,
            name,
            photoUrl,
            emailVerified,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.firebaseUid, uid))
          .returning();

        user = updatedUser;
      } else {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            firebaseUid: uid,
            email,
            name,
            photoUrl,
            authProvider: authProvider || 'email',
            emailVerified,
            lastLoginAt: new Date(),
          })
          .returning();

        user = newUser;

        // Auto-create personal workspace for new user
        const workspaceName = name ? `${name}'s Workspace` : `${email.split('@')[0]}'s Workspace`;
        const baseSlug = workspaceName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        const slug = `${baseSlug}-${Date.now()}`;

        const [personalWorkspace] = await db
          .insert(workspaces)
          .values({
            name: workspaceName,
            slug,
            description: 'Your personal workspace',
            type: 'personal',
            ownerId: newUser.id,
          })
          .returning();

        // Add user as admin member of their personal workspace
        await db.insert(workspaceMembers).values({
          workspaceId: personalWorkspace.id,
          userId: newUser.id,
          role: 'admin',
          joinedAt: new Date(),
          isActive: true,
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          name: user.name,
          photoUrl: user.photoUrl,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      console.error('Sync user error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to sync user',
      });
    }
  }

  /**
   * Get current user profile
   *
   * Returns the user's profile from PostgreSQL
   */
  static async getProfile(req: AuthRequest, res: Response) {
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

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          firebaseUid: user.firebaseUid,
          email: user.email,
          name: user.name,
          photoUrl: user.photoUrl,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get user profile',
      });
    }
  }

  /**
   * Verify token endpoint
   *
   * Simple endpoint to check if token is valid
   */
  static async verifyToken(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          uid: req.user.uid,
          email: req.user.email,
          emailVerified: req.user.emailVerified,
        },
      });
    } catch (error) {
      console.error('Verify token error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify token',
      });
    }
  }

  /**
   * Sign out endpoint
   *
   * Sends Clear-Site-Data header to clear browser cache, cookies, and storage
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data
   */
  static async signOut(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Send Clear-Site-Data header to clear browser data
      // This is the MDN-recommended approach for secure sign out
      res.setHeader('Clear-Site-Data', '"cache", "cookies", "storage"');

      return res.status(200).json({
        success: true,
        message: 'Signed out successfully',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to sign out',
      });
    }
  }
}
