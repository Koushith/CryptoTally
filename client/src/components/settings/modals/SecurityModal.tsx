import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Loader2, Trash2, Plus, Smartphone, Laptop } from 'lucide-react';
import { PasskeyService } from '@/services/passkey.service';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
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

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Passkey {
  id: number;
  name: string;
  deviceType: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [passkeyName, setPasskeyName] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Load passkeys when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPasskeys();
    }
  }, [isOpen]);

  const loadPasskeys = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to manage passkeys');
        return;
      }

      const token = await user.getIdToken();
      const data = await PasskeyService.listPasskeys(token);
      setPasskeys(data);
    } catch (error: any) {
      console.error('Load passkeys error:', error);
      toast.error('Failed to load passkeys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPasskey = async () => {
    if (!passkeyName.trim()) {
      toast.error('Please enter a name for your passkey');
      return;
    }

    try {
      setIsAddingPasskey(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to add a passkey');
        return;
      }

      const token = await user.getIdToken();
      const newPasskey = await PasskeyService.registerPasskey(token, passkeyName.trim());

      setPasskeys([...passkeys, newPasskey as Passkey]);
      setPasskeyName('');
      setShowAddDialog(false);
      toast.success('Passkey added successfully!');
    } catch (error: any) {
      console.error('Add passkey error:', error);
      toast.error(error.message || 'Failed to add passkey');
    } finally {
      setIsAddingPasskey(false);
    }
  };

  const handleDeletePasskey = async (id: number) => {
    try {
      setIsDeletingId(id);
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to delete a passkey');
        return;
      }

      const token = await user.getIdToken();
      await PasskeyService.deletePasskey(token, id);

      setPasskeys(passkeys.filter((pk) => pk.id !== id));
      setDeleteConfirmId(null);
      toast.success('Passkey removed successfully');
    } catch (error: any) {
      console.error('Delete passkey error:', error);
      toast.error('Failed to delete passkey');
    } finally {
      setIsDeletingId(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'singleDevice' || deviceType === 'platform') {
      return <Smartphone className="h-5 w-5 text-gray-600" />;
    }
    return <Laptop className="h-5 w-5 text-gray-600" />;
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Security Settings</SheetTitle>
            <SheetDescription>
              Manage your passkeys and account security
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Passkeys Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Passkeys</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fast, secure sign-in with biometrics
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add
                </Button>
              </div>

              {/* Passkeys List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : passkeys.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <Fingerprint className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">No passkeys added</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Add a passkey for faster, more secure sign-in
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {passkeys.map((passkey) => (
                    <div
                      key={passkey.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="mt-0.5">{getDeviceIcon(passkey.deviceType)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {passkey.name}
                            </h4>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-xs text-gray-500">
                                Added {formatDate(passkey.createdAt)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Last used {formatDate(passkey.lastUsedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmId(passkey.id)}
                          disabled={isDeletingId === passkey.id}
                          className="shrink-0"
                        >
                          {isDeletingId === passkey.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Passkey Dialog */}
      <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add a new passkey</AlertDialogTitle>
            <AlertDialogDescription>
              Give your passkey a name to help you identify it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="passkey-name" className="text-sm font-medium">
              Passkey name
            </Label>
            <Input
              id="passkey-name"
              placeholder="e.g., MacBook Pro, iPhone"
              value={passkeyName}
              onChange={(e) => setPasskeyName(e.target.value)}
              className="mt-2"
              disabled={isAddingPasskey}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAddingPasskey}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddPasskey}
              disabled={isAddingPasskey || !passkeyName.trim()}
            >
              {isAddingPasskey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Passkey'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove passkey?</AlertDialogTitle>
            <AlertDialogDescription>
              This passkey will no longer work for signing in. You can always add it
              back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeletePasskey(deleteConfirmId)}
              disabled={isDeletingId !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingId !== null ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
