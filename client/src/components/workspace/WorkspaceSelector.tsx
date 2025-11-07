import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceService, Workspace } from '@/services/workspace.service';
import { toast } from 'sonner';

interface WorkspaceSelectorProps {
  selectedWorkspaceId: number | null;
  onWorkspaceChange: (workspaceId: number) => void;
}

export const WorkspaceSelector = ({ selectedWorkspaceId, onWorkspaceChange }: WorkspaceSelectorProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      const fetchedWorkspaces = await WorkspaceService.getUserWorkspaces();
      setWorkspaces(fetchedWorkspaces);

      // Auto-select first workspace if none selected
      if (!selectedWorkspaceId && fetchedWorkspaces.length > 0) {
        onWorkspaceChange(fetchedWorkspaces[0].id);
      }
    } catch (error: any) {
      console.error('Error loading workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500">
        <Building2 className="h-4 w-4" />
        <span>Loading...</span>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return null;
  }

  // If only one workspace, show it without dropdown
  if (workspaces.length === 1) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600">
        <Building2 className="h-4 w-4" />
        <span>{workspaces[0].name}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
          <Building2 className="h-4 w-4" />
          <span>{selectedWorkspace?.name || 'Select workspace'}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => onWorkspaceChange(workspace.id)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 flex-1">
              <Building2 className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{workspace.name}</span>
                <span className="text-xs text-gray-500">
                  {workspace.type === 'personal' ? 'Personal' : 'Organization'}
                </span>
              </div>
            </div>
            {selectedWorkspaceId === workspace.id && (
              <Check className="h-4 w-4 text-gray-900 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
