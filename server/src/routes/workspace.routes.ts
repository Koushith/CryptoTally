import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspace.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * Workspace Routes
 *
 * /api/workspace/*
 */

// GET /api/workspace - Get all workspaces for the authenticated user
router.get('/', authMiddleware, WorkspaceController.getUserWorkspaces);

// POST /api/workspace - Create a new workspace
router.post('/', authMiddleware, WorkspaceController.createWorkspace);

// GET /api/workspace/:workspaceId/members - Get team members for a workspace
router.get('/:workspaceId/members', authMiddleware, WorkspaceController.getTeamMembers);

// POST /api/workspace/:workspaceId/members - Invite a member to workspace via magic link
router.post('/:workspaceId/members', authMiddleware, WorkspaceController.inviteMember);

// PATCH /api/workspace/:workspaceId/members/:memberId - Update member role
router.patch('/:workspaceId/members/:memberId', authMiddleware, WorkspaceController.updateMemberRole);

// DELETE /api/workspace/:workspaceId/members/:memberId - Remove member from workspace
router.delete('/:workspaceId/members/:memberId', authMiddleware, WorkspaceController.removeMember);

/**
 * Invitation Routes
 */

// GET /api/workspace/invite/:token - Get invitation details by token (PUBLIC)
router.get('/invite/:token', WorkspaceController.getInvitationByToken);

// POST /api/workspace/invite/:token/accept - Accept invitation (REQUIRES AUTH)
router.post('/invite/:token/accept', authMiddleware, WorkspaceController.acceptInvitation);

// GET /api/workspace/:workspaceId/invitations - Get all invitations for a workspace
router.get('/:workspaceId/invitations', authMiddleware, WorkspaceController.getWorkspaceInvitations);

// DELETE /api/workspace/:workspaceId/invitations/:invitationId - Revoke an invitation
router.delete('/:workspaceId/invitations/:invitationId', authMiddleware, WorkspaceController.revokeInvitation);

export default router;
