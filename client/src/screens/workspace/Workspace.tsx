import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  Settings,
  Crown,
  Shield,
  Eye,
  Trash2,
  Mail,
  Loader2,
  ChevronDown,
  Check,
  Clock,
  XCircle,
  CheckCircle,
  Ban,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  WorkspaceService,
  type Workspace,
  type TeamMember,
  type WorkspaceInvitation,
} from '@/services/workspace.service';
import { auth } from '@/lib/firebase';

export const WorkspacePage = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);

  // Dialog states
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newWorkspaceType, setNewWorkspaceType] = useState<'personal' | 'organization'>('organization');

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Fetch team members and invitations when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      fetchTeamMembers();
      fetchInvitations();
    }
  }, [currentWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const workspaceList = await WorkspaceService.getUserWorkspaces();
      setWorkspaces(workspaceList);

      // Set the first workspace as current (usually the personal workspace)
      if (workspaceList.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(workspaceList[0]);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    if (!currentWorkspace) return;

    try {
      setIsLoadingMembers(true);
      const members = await WorkspaceService.getTeamMembers(currentWorkspace.id);
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const fetchInvitations = async () => {
    if (!currentWorkspace) return;

    try {
      setIsLoadingInvitations(true);
      const invites = await WorkspaceService.getWorkspaceInvitations(currentWorkspace.id);
      setInvitations(invites);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleRevokeInvitation = async (invitationId: number) => {
    if (!currentWorkspace) return;

    try {
      await WorkspaceService.revokeInvitation(currentWorkspace.id, invitationId);
      toast.success('Invitation revoked');
      await fetchInvitations(); // Refresh the list
    } catch (error) {
      console.error('Failed to revoke invitation:', error);
      toast.error('Failed to revoke invitation');
    }
  };

  const handleInviteMember = async () => {
    if (!currentWorkspace) return;

    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await WorkspaceService.inviteMember(currentWorkspace.id, {
        email: inviteEmail,
        role: inviteRole,
      });

      setInviteEmail('');
      setInviteRole('viewer');
      setIsInviteMemberOpen(false);
      toast.success(`Invitation sent to ${inviteEmail}`);

      // Refresh team members and invitations
      fetchTeamMembers();
      fetchInvitations();
    } catch (error: any) {
      console.error('Failed to invite member:', error);
      toast.error(error.message || 'Failed to invite member');
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!currentWorkspace) return;

    try {
      await WorkspaceService.removeMember(currentWorkspace.id, member.id);
      setMemberToRemove(null);
      toast.success(`${member.name} removed from workspace`);

      // Refresh team members
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleUpdateMemberRole = async (memberId: number, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!currentWorkspace) return;

    try {
      await WorkspaceService.updateMemberRole(currentWorkspace.id, memberId, { role: newRole });
      toast.success('Member role updated');

      // Refresh team members
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Failed to update member role:', error);
      toast.error(error.message || 'Failed to update member role');
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    try {
      const newWorkspace = await WorkspaceService.createWorkspace({
        name: newWorkspaceName,
        description: newWorkspaceDescription,
        type: newWorkspaceType,
      });

      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setNewWorkspaceType('organization');
      setIsCreateWorkspaceOpen(false);
      toast.success('Workspace created successfully');

      // Refresh workspaces and set new workspace as current
      await fetchWorkspaces();
      setCurrentWorkspace(newWorkspace);
    } catch (error: any) {
      console.error('Failed to create workspace:', error);
      toast.error(error.message || 'Failed to create workspace');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'editor':
        return <Shield className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'editor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      case 'revoked':
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'revoked':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // No workspace state
  if (!currentWorkspace) {
    return (
      <div className="min-h-screen">
        <div className="w-full max-w-6xl">
          <PageHeader title="Workspace & Team" description="Manage your workspaces and collaborate with team members" />
          <Card className="p-12 border-2 border-dashed border-gray-200 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your First Workspace</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Workspaces help you organize your crypto transactions. Start by creating a personal workspace or an
              organization workspace for your team.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setNewWorkspaceName(
                    `${auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'My'}'s Workspace`
                  );
                  setNewWorkspaceDescription('Your personal workspace');
                  setNewWorkspaceType('personal');
                  setIsCreateWorkspaceOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Personal Workspace
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewWorkspaceName('');
                  setNewWorkspaceDescription('');
                  setNewWorkspaceType('organization');
                  setIsCreateWorkspaceOpen(true);
                }}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </Card>
        </div>

        {/* Create Workspace Dialog (duplicate here for empty state) */}
        <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>Create a workspace to organize your crypto transactions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name *</Label>
                <Input
                  id="workspace-name"
                  type="text"
                  placeholder="My Organization"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description (optional)</Label>
                <Input
                  id="workspace-description"
                  type="text"
                  placeholder="A brief description of this workspace"
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Workspace & Team" description="Manage your workspaces and collaborate with team members" />
          <Button
            onClick={() => {
              setNewWorkspaceName('');
              setNewWorkspaceDescription('');
              setNewWorkspaceType('organization');
              setIsCreateWorkspaceOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Workspace Switcher */}
        {workspaces.length > 1 && (
          <Card className="p-4 mb-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Workspace</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-gray-900">{currentWorkspace.name}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel className="text-xs text-gray-500">Switch Workspace</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {workspaces.map((workspace) => (
                        <DropdownMenuItem
                          key={workspace.id}
                          onClick={() => setCurrentWorkspace(workspace)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium text-sm">{workspace.name}</div>
                                <div className="text-xs text-gray-500">
                                  {workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''} ·{' '}
                                  {workspace.type}
                                </div>
                              </div>
                            </div>
                            {currentWorkspace.id === workspace.id && <Check className="h-4 w-4 text-primary" />}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </Card>
        )}

        {/* Current Workspace Info */}
        <Card className="p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-300 shadow-md">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentWorkspace.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{currentWorkspace.description || 'No description'}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {currentWorkspace.memberCount} {currentWorkspace.memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentWorkspace.type === 'personal' ? 'Personal' : 'Organization'}
                  </Badge>
                  {currentWorkspace.isOwner && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Owner
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {currentWorkspace.isOwner && (
              <Button variant="outline" size="sm" onClick={() => toast.info('Workspace settings coming soon')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </Card>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
              <p className="text-sm text-gray-500 mt-1">
                Invite and manage team members with different permission levels
              </p>
            </div>
            {currentWorkspace.isOwner && (
              <Button onClick={() => setIsInviteMemberOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>

          {isLoadingMembers ? (
            <Card className="p-12 border border-gray-200 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading team members...</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="p-4 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12 border-2 border-gray-100">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white font-semibold">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                          {member.status === 'pending' && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{member.email}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400">Joined {formatDate(member.joinedAt)}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">Active {formatDate(member.lastActive)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentWorkspace.isOwner && member.role !== 'admin' ? (
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleUpdateMemberRole(member.id, value as any)}
                        >
                          <SelectTrigger className="w-32 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" />
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="editor">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span>Editor</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="viewer">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>Viewer</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getRoleColor(member.role)} border`}>
                          <span className="mr-1.5">{getRoleIcon(member.role)}</span>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      )}

                      {currentWorkspace.isOwner && member.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {teamMembers.length === 0 && (
                <Card className="p-12 border-2 border-dashed border-gray-200 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No team members yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Invite team members to collaborate on this workspace</p>
                  <Button onClick={() => setIsInviteMemberOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite First Member
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Pending Invitations Section */}
        {invitations.length > 0 && (
          <div className="space-y-4 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
                <p className="text-sm text-gray-500 mt-1">Invitations sent to users who haven't joined yet</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {invitations.filter((inv) => inv.status === 'pending').length} pending
              </Badge>
            </div>

            {isLoadingInvitations ? (
              <Card className="p-12 border border-gray-200 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading invitations...</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {invitations.map((invitation) => (
                  <Card
                    key={invitation.id}
                    className="p-4 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-100">
                          <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{invitation.email}</h4>
                            <Badge className={`${getStatusColor(invitation.status)} border text-xs`}>
                              <span className="mr-1">{getStatusIcon(invitation.status)}</span>
                              {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Invited by {invitation.invitedBy.name} •{' '}
                            {new Date(invitation.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          {invitation.status === 'pending' && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Expires on{' '}
                              {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRoleColor(invitation.role)} border`}>
                          <span className="mr-1.5">{getRoleIcon(invitation.role)}</span>
                          {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                        </Badge>

                        {currentWorkspace?.isOwner && invitation.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>Send an invitation to collaborate on this workspace</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      <span>Admin - Full access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Editor - Can edit</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Viewer - Read only</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>Create a new organization workspace to collaborate with your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name *</Label>
              <Input
                id="workspace-name"
                type="text"
                placeholder="My Organization"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description (optional)</Label>
              <Input
                id="workspace-description"
                type="text"
                placeholder="A brief description of this workspace"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove?.name} will lose access to this workspace. You can always invite them back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
