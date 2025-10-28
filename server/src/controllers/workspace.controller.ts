import { Response, Request } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../config/database';
import { users, workspaces, workspaceMembers, workspaceInvitations } from '../db/schema';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateInvitationToken, getTokenExpirationDate, isTokenExpired } from '../utils/token.util';
import { EmailService } from '../services/email.service';

/**
 * Workspace Controller
 *
 * Handles workspace and team management operations
 */
export class WorkspaceController {
  /**
   * Get all workspaces for the authenticated user
   */
  static async getUserWorkspaces(req: AuthRequest, res: Response) {
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

      // Get all workspaces where user is a member
      const userWorkspaces = await db
        .select({
          id: workspaces.id,
          name: workspaces.name,
          slug: workspaces.slug,
          description: workspaces.description,
          type: workspaces.type,
          logoUrl: workspaces.logoUrl,
          createdAt: workspaces.createdAt,
          ownerId: workspaces.ownerId,
          role: workspaceMembers.role,
          isActive: workspaceMembers.isActive,
        })
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(
          and(
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        );

      // Get member counts for each workspace
      const workspacesWithCounts = await Promise.all(
        userWorkspaces.map(async (workspace) => {
          const [memberCount] = await db
            .select({ count: workspaceMembers.id })
            .from(workspaceMembers)
            .where(
              and(
                eq(workspaceMembers.workspaceId, workspace.id),
                eq(workspaceMembers.isActive, true)
              )
            );

          return {
            ...workspace,
            memberCount: Number(memberCount.count) || 1,
            isOwner: workspace.ownerId === user.id,
          };
        })
      );

      return res.status(200).json({
        success: true,
        data: workspacesWithCounts,
      });
    } catch (error) {
      console.error('Get user workspaces error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch workspaces',
      });
    }
  }

  /**
   * Create a new workspace
   */
  static async createWorkspace(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { name, description, type = 'organization' } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Workspace name is required',
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

      // Generate unique slug
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      const slug = `${baseSlug}-${Date.now()}`;

      // Create workspace
      const [newWorkspace] = await db
        .insert(workspaces)
        .values({
          name: name.trim(),
          slug,
          description: description?.trim() || null,
          type,
          ownerId: user.id,
        })
        .returning();

      // Add creator as admin member
      await db.insert(workspaceMembers).values({
        workspaceId: newWorkspace.id,
        userId: user.id,
        role: 'admin',
        joinedAt: new Date(),
        isActive: true,
      });

      return res.status(201).json({
        success: true,
        data: {
          ...newWorkspace,
          memberCount: 1,
          isOwner: true,
        },
        message: 'Workspace created successfully',
      });
    } catch (error) {
      console.error('Create workspace error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create workspace',
      });
    }
  }

  /**
   * Get team members for a workspace
   */
  static async getTeamMembers(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId } = req.params;

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

      // Verify user has access to this workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Get all active team members
      const members = await db
        .select({
          id: workspaceMembers.id,
          userId: users.id,
          name: users.name,
          email: users.email,
          photoUrl: users.photoUrl,
          role: workspaceMembers.role,
          joinedAt: workspaceMembers.joinedAt,
          lastLoginAt: users.lastLoginAt,
          isActive: workspaceMembers.isActive,
        })
        .from(workspaceMembers)
        .innerJoin(users, eq(workspaceMembers.userId, users.id))
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.isActive, true)
          )
        );

      return res.status(200).json({
        success: true,
        data: members.map(member => ({
          id: member.id,
          userId: member.userId,
          name: member.name || member.email.split('@')[0],
          email: member.email,
          avatarUrl: member.photoUrl,
          role: member.role,
          joinedAt: member.joinedAt,
          lastActive: member.lastLoginAt,
          status: 'active',
        })),
      });
    } catch (error) {
      console.error('Get team members error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch team members',
      });
    }
  }

  /**
   * Invite a member to workspace via magic link
   * Sends invitation email with secure token
   * User doesn't need to exist on platform yet
   */
  static async inviteMember(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId } = req.params;
      const { email, role = 'viewer' } = req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
        });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Validate role
      if (!['admin', 'editor', 'viewer'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be admin, editor, or viewer',
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

      // Get workspace info
      const [workspace] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, parseInt(workspaceId)))
        .limit(1);

      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: 'Workspace not found',
        });
      }

      // Verify user is admin of this workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!membership || membership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can invite members',
        });
      }

      // Check if user is already a member
      const [invitedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (invitedUser) {
        const [existingMember] = await db
          .select()
          .from(workspaceMembers)
          .where(
            and(
              eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
              eq(workspaceMembers.userId, invitedUser.id),
              eq(workspaceMembers.isActive, true)
            )
          )
          .limit(1);

        if (existingMember) {
          return res.status(400).json({
            success: false,
            error: 'User is already a member of this workspace',
          });
        }
      }

      // Check for existing pending invitation
      const [existingInvitation] = await db
        .select()
        .from(workspaceInvitations)
        .where(
          and(
            eq(workspaceInvitations.workspaceId, parseInt(workspaceId)),
            eq(workspaceInvitations.email, normalizedEmail),
            eq(workspaceInvitations.status, 'pending')
          )
        )
        .limit(1);

      if (existingInvitation) {
        return res.status(400).json({
          success: false,
          error: 'An invitation has already been sent to this email',
        });
      }

      // Generate secure invitation token
      const token = generateInvitationToken();
      const expiresAt = getTokenExpirationDate(7); // 7 days

      // Create invitation record
      await db.insert(workspaceInvitations).values({
        workspaceId: parseInt(workspaceId),
        email: normalizedEmail,
        role,
        token,
        invitedBy: user.id,
        expiresAt,
        status: 'pending',
      });

      // Send invitation email
      await EmailService.sendWorkspaceInvitation({
        to: normalizedEmail,
        workspaceName: workspace.name,
        inviterName: user.name || user.email,
        role,
        inviteToken: token,
        expiresAt,
      });

      return res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: {
          email: normalizedEmail,
          role,
          expiresAt,
        },
      });
    } catch (error) {
      console.error('Invite member error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send invitation',
      });
    }
  }

  /**
   * Update member role
   */
  static async updateMemberRole(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId, memberId } = req.params;
      const { role } = req.body;

      if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be admin, editor, or viewer',
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

      // Verify user is admin of this workspace
      const [adminMembership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!adminMembership || adminMembership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can update member roles',
        });
      }

      // Get the member to update
      const [memberToUpdate] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.id, parseInt(memberId)),
            eq(workspaceMembers.workspaceId, parseInt(workspaceId))
          )
        )
        .limit(1);

      if (!memberToUpdate) {
        return res.status(404).json({
          success: false,
          error: 'Member not found',
        });
      }

      // Prevent removing last admin
      if (memberToUpdate.role === 'admin' && role !== 'admin') {
        const [adminCount] = await db
          .select({ count: workspaceMembers.id })
          .from(workspaceMembers)
          .where(
            and(
              eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
              eq(workspaceMembers.role, 'admin'),
              eq(workspaceMembers.isActive, true)
            )
          );

        if (Number(adminCount.count) <= 1) {
          return res.status(400).json({
            success: false,
            error: 'Cannot remove the last admin from workspace',
          });
        }
      }

      // Update member role
      await db
        .update(workspaceMembers)
        .set({ role })
        .where(eq(workspaceMembers.id, parseInt(memberId)));

      return res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
      });
    } catch (error) {
      console.error('Update member role error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update member role',
      });
    }
  }

  /**
   * Remove member from workspace
   */
  static async removeMember(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId, memberId } = req.params;

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

      // Verify user is admin of this workspace
      const [adminMembership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!adminMembership || adminMembership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can remove members',
        });
      }

      // Get the member to remove
      const [memberToRemove] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.id, parseInt(memberId)),
            eq(workspaceMembers.workspaceId, parseInt(workspaceId))
          )
        )
        .limit(1);

      if (!memberToRemove) {
        return res.status(404).json({
          success: false,
          error: 'Member not found',
        });
      }

      // Prevent removing last admin
      if (memberToRemove.role === 'admin') {
        const [adminCount] = await db
          .select({ count: workspaceMembers.id })
          .from(workspaceMembers)
          .where(
            and(
              eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
              eq(workspaceMembers.role, 'admin'),
              eq(workspaceMembers.isActive, true)
            )
          );

        if (Number(adminCount.count) <= 1) {
          return res.status(400).json({
            success: false,
            error: 'Cannot remove the last admin from workspace',
          });
        }
      }

      // Soft delete member (set isActive to false)
      await db
        .update(workspaceMembers)
        .set({ isActive: false })
        .where(eq(workspaceMembers.id, parseInt(memberId)));

      return res.status(200).json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Remove member error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to remove member',
      });
    }
  }

  /**
   * Get invitation details by token (public endpoint)
   * Returns workspace info if invitation is valid
   */
  static async getInvitationByToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required',
        });
      }

      // Find invitation
      const [invitation] = await db
        .select()
        .from(workspaceInvitations)
        .where(eq(workspaceInvitations.token, token))
        .limit(1);

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: 'Invitation not found',
        });
      }

      // Check if already accepted
      if (invitation.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'This invitation has already been accepted',
        });
      }

      // Check if revoked
      if (invitation.status === 'revoked') {
        return res.status(400).json({
          success: false,
          error: 'This invitation has been revoked',
        });
      }

      // Check if expired
      if (isTokenExpired(invitation.expiresAt)) {
        // Mark as expired
        await db
          .update(workspaceInvitations)
          .set({ status: 'expired' })
          .where(eq(workspaceInvitations.id, invitation.id));

        return res.status(400).json({
          success: false,
          error: 'This invitation has expired',
        });
      }

      // Get workspace details
      const [workspace] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, invitation.workspaceId))
        .limit(1);

      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: 'Workspace not found',
        });
      }

      // Get inviter details
      const [inviter] = await db
        .select()
        .from(users)
        .where(eq(users.id, invitation.invitedBy))
        .limit(1);

      return res.status(200).json({
        success: true,
        data: {
          email: invitation.email,
          role: invitation.role,
          workspace: {
            id: workspace.id,
            name: workspace.name,
            type: workspace.type,
          },
          inviter: {
            name: inviter?.name || inviter?.email || 'Unknown',
          },
          expiresAt: invitation.expiresAt,
        },
      });
    } catch (error) {
      console.error('Get invitation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get invitation details',
      });
    }
  }

  /**
   * Accept workspace invitation (requires auth)
   * One-time use - marks invitation as accepted
   */
  static async acceptInvitation(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required',
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

      // Find invitation
      const [invitation] = await db
        .select()
        .from(workspaceInvitations)
        .where(eq(workspaceInvitations.token, token))
        .limit(1);

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: 'Invitation not found',
        });
      }

      // Verify email matches
      if (invitation.email !== user.email.toLowerCase()) {
        return res.status(403).json({
          success: false,
          error: 'This invitation was sent to a different email address',
        });
      }

      // Check if already accepted
      if (invitation.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'This invitation has already been accepted',
        });
      }

      // Check if revoked
      if (invitation.status === 'revoked') {
        return res.status(400).json({
          success: false,
          error: 'This invitation has been revoked',
        });
      }

      // Check if expired
      if (isTokenExpired(invitation.expiresAt)) {
        // Mark as expired
        await db
          .update(workspaceInvitations)
          .set({ status: 'expired' })
          .where(eq(workspaceInvitations.id, invitation.id));

        return res.status(400).json({
          success: false,
          error: 'This invitation has expired',
        });
      }

      // Check if user is already a member
      const [existingMember] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, invitation.workspaceId),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (existingMember) {
        // Mark invitation as accepted even though already a member
        await db
          .update(workspaceInvitations)
          .set({
            status: 'accepted',
            acceptedAt: new Date(),
          })
          .where(eq(workspaceInvitations.id, invitation.id));

        return res.status(200).json({
          success: true,
          message: 'You are already a member of this workspace',
          data: {
            workspaceId: invitation.workspaceId,
          },
        });
      }

      // Add user to workspace
      await db.insert(workspaceMembers).values({
        workspaceId: invitation.workspaceId,
        userId: user.id,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
        invitedAt: invitation.createdAt,
        joinedAt: new Date(),
        isActive: true,
      });

      // Mark invitation as accepted (ONE-TIME USE - cannot be reused)
      await db
        .update(workspaceInvitations)
        .set({
          status: 'accepted',
          acceptedAt: new Date(),
        })
        .where(eq(workspaceInvitations.id, invitation.id));

      return res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully',
        data: {
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        },
      });
    } catch (error) {
      console.error('Accept invitation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to accept invitation',
      });
    }
  }

  /**
   * Get pending invitations for a workspace
   */
  static async getWorkspaceInvitations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId } = req.params;

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

      // Verify user is member of this workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!membership) {
        return res.status(403).json({
          success: false,
          error: 'You do not have access to this workspace',
        });
      }

      // Get all invitations for this workspace (pending, accepted, expired)
      const invitations = await db
        .select({
          id: workspaceInvitations.id,
          email: workspaceInvitations.email,
          role: workspaceInvitations.role,
          status: workspaceInvitations.status,
          expiresAt: workspaceInvitations.expiresAt,
          acceptedAt: workspaceInvitations.acceptedAt,
          createdAt: workspaceInvitations.createdAt,
          invitedBy: workspaceInvitations.invitedBy,
          inviterName: users.name,
          inviterEmail: users.email,
        })
        .from(workspaceInvitations)
        .leftJoin(users, eq(workspaceInvitations.invitedBy, users.id))
        .where(eq(workspaceInvitations.workspaceId, parseInt(workspaceId)))
        .orderBy(workspaceInvitations.createdAt);

      // Auto-expire any expired invitations
      const now = new Date();
      for (const invitation of invitations) {
        if (
          invitation.status === 'pending' &&
          isTokenExpired(invitation.expiresAt)
        ) {
          await db
            .update(workspaceInvitations)
            .set({ status: 'expired' })
            .where(eq(workspaceInvitations.id, invitation.id));
          invitation.status = 'expired';
        }
      }

      return res.status(200).json({
        success: true,
        data: invitations.map((inv) => ({
          id: inv.id,
          email: inv.email,
          role: inv.role,
          status: inv.status,
          expiresAt: inv.expiresAt,
          acceptedAt: inv.acceptedAt,
          createdAt: inv.createdAt,
          invitedBy: {
            name: inv.inviterName || inv.inviterEmail || 'Unknown',
          },
        })),
      });
    } catch (error) {
      console.error('Get workspace invitations error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch invitations',
      });
    }
  }

  /**
   * Revoke a pending invitation
   */
  static async revokeInvitation(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId, invitationId } = req.params;

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

      // Verify user is admin of this workspace
      const [membership] = await db
        .select()
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, parseInt(workspaceId)),
            eq(workspaceMembers.userId, user.id),
            eq(workspaceMembers.isActive, true)
          )
        )
        .limit(1);

      if (!membership || membership.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can revoke invitations',
        });
      }

      // Get invitation
      const [invitation] = await db
        .select()
        .from(workspaceInvitations)
        .where(eq(workspaceInvitations.id, parseInt(invitationId)))
        .limit(1);

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: 'Invitation not found',
        });
      }

      if (invitation.workspaceId !== parseInt(workspaceId)) {
        return res.status(403).json({
          success: false,
          error: 'Invitation does not belong to this workspace',
        });
      }

      if (invitation.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: `Cannot revoke ${invitation.status} invitation`,
        });
      }

      // Revoke invitation
      await db
        .update(workspaceInvitations)
        .set({ status: 'revoked' })
        .where(eq(workspaceInvitations.id, parseInt(invitationId)));

      return res.status(200).json({
        success: true,
        message: 'Invitation revoked successfully',
      });
    } catch (error) {
      console.error('Revoke invitation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to revoke invitation',
      });
    }
  }
}
