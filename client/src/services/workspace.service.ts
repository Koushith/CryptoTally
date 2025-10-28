import { AuthService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: 'personal' | 'organization';
  logoUrl: string | null;
  createdAt: string;
  ownerId: number;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  memberCount: number;
  isOwner: boolean;
}

export interface TeamMember {
  id: number;
  userId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
  lastActive: string | null;
  status: 'active' | 'pending';
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  type?: 'personal' | 'organization';
}

export interface InviteMemberPayload {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UpdateMemberRolePayload {
  role: 'admin' | 'editor' | 'viewer';
}

export interface InvitationDetails {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  workspace: {
    id: number;
    name: string;
    type: 'personal' | 'organization';
  };
  inviter: {
    name: string;
  };
  expiresAt: string;
}

export interface WorkspaceInvitation {
  id: number;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  invitedBy: {
    name: string;
  };
}

/**
 * Workspace Service
 *
 * Handles workspace and team management operations
 */
export class WorkspaceService {
  /**
   * Get all workspaces for the current user
   */
  static async getUserWorkspaces(): Promise<Workspace[]> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get workspaces error:', error);
      throw error;
    }
  }

  /**
   * Create a new workspace
   */
  static async createWorkspace(payload: CreateWorkspacePayload): Promise<Workspace> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workspace');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Create workspace error:', error);
      throw error;
    }
  }

  /**
   * Get team members for a workspace
   */
  static async getTeamMembers(workspaceId: number): Promise<TeamMember[]> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace/${workspaceId}/members`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get team members error:', error);
      throw error;
    }
  }

  /**
   * Invite a member to workspace
   */
  static async inviteMember(
    workspaceId: number,
    payload: InviteMemberPayload
  ): Promise<void> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Invite member error:', error);
      throw error;
    }
  }

  /**
   * Update member role
   */
  static async updateMemberRole(
    workspaceId: number,
    memberId: number,
    payload: UpdateMemberRolePayload
  ): Promise<void> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(
        `${API_URL}/api/workspace/${workspaceId}/members/${memberId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update member role');
      }
    } catch (error) {
      console.error('Update member role error:', error);
      throw error;
    }
  }

  /**
   * Remove member from workspace
   */
  static async removeMember(workspaceId: number, memberId: number): Promise<void> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(
        `${API_URL}/api/workspace/${workspaceId}/members/${memberId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Remove member error:', error);
      throw error;
    }
  }

  /**
   * Get invitation details by token (PUBLIC - no auth required)
   */
  static async getInvitationDetails(token: string): Promise<InvitationDetails> {
    try {
      const response = await fetch(`${API_URL}/api/workspace/invite/${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get invitation details');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get invitation details error:', error);
      throw error;
    }
  }

  /**
   * Accept workspace invitation
   */
  static async acceptInvitation(token: string): Promise<void> {
    try {
      const authToken = await AuthService.getIdToken();
      if (!authToken) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace/invite/${token}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      throw error;
    }
  }

  /**
   * Get all invitations for a workspace
   */
  static async getWorkspaceInvitations(workspaceId: number): Promise<WorkspaceInvitation[]> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${API_URL}/api/workspace/${workspaceId}/invitations`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Get invitations error:', error);
      throw error;
    }
  }

  /**
   * Revoke a pending invitation
   */
  static async revokeInvitation(workspaceId: number, invitationId: number): Promise<void> {
    try {
      const token = await AuthService.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(
        `${API_URL}/api/workspace/${workspaceId}/invitations/${invitationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to revoke invitation');
      }
    } catch (error) {
      console.error('Revoke invitation error:', error);
      throw error;
    }
  }
}
