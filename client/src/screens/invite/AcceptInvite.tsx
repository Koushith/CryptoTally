import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Crown, Shield, Eye, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { WorkspaceService, type InvitationDetails } from '@/services/workspace.service';

export const AcceptInvitePage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);
      const details = await WorkspaceService.getInvitationDetails(token);
      setInvitation(details);
    } catch (error: any) {
      console.error('Failed to fetch invitation:', error);
      setError(error.message || 'Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!token) return;

    // If not logged in, redirect to auth with invitation token
    if (!user) {
      navigate(`/auth?invite=${token}`);
      return;
    }

    try {
      setIsAccepting(true);
      await WorkspaceService.acceptInvitation(token);
      toast.success('Invitation accepted! Redirecting to workspace...');

      // Redirect to workspace page after short delay
      setTimeout(() => {
        navigate('/workspace');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to accept invitation:', error);
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setIsAccepting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5" />;
      case 'editor':
        return <Shield className="h-5 w-5" />;
      case 'viewer':
        return <Eye className="h-5 w-5" />;
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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access to all features, can manage team members and workspace settings';
      case 'editor':
        return 'Can add wallets, tag transactions, and create reports';
      case 'viewer':
        return 'Read-only access to view wallets, transactions, and reports';
      default:
        return '';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md w-full">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">
            {error || 'This invitation link is invalid or has expired.'}
          </p>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 border-b">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">You're invited!</h1>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">{invitation.inviter.name}</span> invited you to join
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{invitation.workspace.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {invitation.workspace.type === 'personal' ? 'Personal' : 'Organization'}
                  </Badge>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">to: {invitation.email}</span>
                </div>
              </div>
              <Badge className={`${getRoleColor(invitation.role)} border px-3 py-1`}>
                <span className="mr-1.5">{getRoleIcon(invitation.role)}</span>
                <span className="capitalize">{invitation.role}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Role Permissions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Role & Permissions</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg ${getRoleColor(invitation.role)} flex items-center justify-center shrink-0`}>
                  {getRoleIcon(invitation.role)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">{invitation.role}</h4>
                  <p className="text-xs text-gray-600 mt-1">{getRoleDescription(invitation.role)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiration Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Clock className="h-4 w-4" />
            <span>
              This invitation expires on{' '}
              {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                {user.email?.toLowerCase() === invitation.email.toLowerCase() ? (
                  <>
                    <Button
                      onClick={handleAcceptInvitation}
                      disabled={isAccepting}
                      size="lg"
                      className="w-full"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Accept Invitation
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/workspace')} size="lg" className="w-full">
                      Maybe Later
                    </Button>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800 mb-3">
                      This invitation was sent to <strong>{invitation.email}</strong>, but you're signed in as{' '}
                      <strong>{user.email}</strong>.
                    </p>
                    <Button onClick={() => navigate('/auth?invite=' + token)} variant="outline" size="sm">
                      Sign in with correct account
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 text-center mb-2">
                  Sign in or create an account to accept this invitation
                </p>
                <Button onClick={() => navigate('/auth?invite=' + token)} size="lg" className="w-full">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Continue to Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
