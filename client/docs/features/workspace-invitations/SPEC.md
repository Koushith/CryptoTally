# Workspace Invitations - Client Specification

## Overview

Client-side implementation of the workspace invitation system, providing UI/UX for sending, viewing, accepting, and managing workspace invitations.

## Components Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  CLIENT ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  WorkspacePage   │  Main workspace management page
└────────┬─────────┘
         │
         ├─► InviteMemberDialog    (Send invitations)
         ├─► TeamMembersList       (Show active members)
         ├─► InvitationsList       (Show pending/accepted/expired)
         └─► WorkspaceSwitcher     (Switch between workspaces)

┌──────────────────┐
│ AcceptInvitePage │  Public invitation acceptance page
└────────┬─────────┘
         │
         ├─► InvitationDetails    (Show workspace/role info)
         ├─► RolePermissions      (Explain role capabilities)
         └─► AcceptButton         (Accept or redirect to auth)

┌──────────────────┐
│ WorkspaceService │  API client for workspace operations
└────────┬─────────┘
         │
         ├─► inviteMember()
         ├─► getInvitationDetails()
         ├─► acceptInvitation()
         ├─► getWorkspaceInvitations()
         └─► revokeInvitation()
```

## UI Components

### 1. Workspace Page

**Location:** `/client/src/screens/workspace/Workspace.tsx`

**Features:**
- View current workspace info
- Switch between workspaces (dropdown)
- View team members list
- Send invitations (dialog)
- View pending/accepted/expired invitations
- Revoke pending invitations
- Update member roles
- Remove members

**State Management:**
```typescript
const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
const [isLoadingMembers, setIsLoadingMembers] = useState(false);
const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
```

**User Actions:**
- Click "Invite Member" → Opens dialog
- Fill email and select role → Send invitation
- View invitations section → See all statuses
- Click revoke (X icon) → Revoke pending invitation
- Switch workspace → Load new data

### 2. Invite Member Dialog

**Component:** Dialog modal within WorkspacePage

**Fields:**
- Email input (validated)
- Role selector (admin/editor/viewer)
- Role descriptions with icons

**Validation:**
```typescript
// Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(inviteEmail)) {
  toast.error('Please enter a valid email address');
  return;
}

// Required fields
if (!inviteEmail.trim()) {
  toast.error('Please enter an email address');
  return;
}
```

**Success Flow:**
1. User fills form
2. Click "Send Invitation"
3. API call to `/api/workspace/:id/members`
4. Show success toast
5. Close dialog
6. Refresh team members list
7. Refresh invitations list

**Error Handling:**
- Invalid email → Toast error
- Duplicate invitation → Toast error with message
- Network error → Toast error
- Server error → Toast error

### 3. Accept Invitation Page

**Location:** `/client/src/screens/invite/AcceptInvite.tsx`

**Route:** `/invite/:token`

**Features:**
- Display invitation details (workspace, role, inviter)
- Show role permissions explanation
- Handle authenticated/unauthenticated users
- Accept invitation or redirect to auth
- Show loading states
- Handle expired/revoked invitations

**State Flow:**
```
Component Mount
     │
     ▼
Check user auth
     │
     ├─► Authenticated → Show "Accept" button
     │
     └─► Not authenticated → Show "Sign in to accept" button
           │
           ▼
         Click button
           │
           ▼
         Redirect to /auth?invite={token}
           │
           ▼
         User signs up/in
           │
           ▼
         Redirect back to /invite/{token}
           │
           ▼
         Auto-accept invitation
           │
           ▼
         Redirect to workspace
```

**UI Sections:**

1. **Header Section**
   - Gradient background
   - "You're invited!" title
   - Workspace name badge
   - Role badge with icon

2. **Details Section**
   - Inviter name
   - Invitation date
   - Expiration date (if pending)
   - Workspace type

3. **Permissions Section**
   - Role description
   - Permission list based on role
   - Icon indicators

4. **Action Section**
   - Accept button (primary)
   - Sign in prompt (if not authenticated)
   - Success/error messages

### 4. Invitations List

**Component:** Section within WorkspacePage

**Features:**
- Shows all invitations for current workspace
- Color-coded status badges
- Status icons (clock, checkmark, X, ban)
- Invitation details (email, role, dates)
- Revoke button for pending invitations (admin only)
- Auto-refreshes after actions

**Status Display:**

| Status | Color | Icon | Badge Text |
|--------|-------|------|-----------|
| Pending | Yellow | Clock | Pending |
| Accepted | Green | CheckCircle | Accepted |
| Expired | Red | XCircle | Expired |
| Revoked | Gray | Ban | Revoked |

**Conditional Rendering:**
```typescript
{invitations.length > 0 && (
  <div className="space-y-4 mt-8">
    <div className="flex items-center justify-between">
      <h3>Pending Invitations</h3>
      <Badge>{pendingCount} pending</Badge>
    </div>
    {/* Invitation cards */}
  </div>
)}
```

### 5. Workspace Switcher

**Component:** Dropdown menu in WorkspacePage

**Features:**
- Shows only when user has 2+ workspaces
- Displays workspace name, member count, type
- Checkmark on current selection
- Smooth transition when switching

**UI:**
```
Current Workspace
[My Organization ▼]

Dropdown:
  ✓ My Organization
    3 members · organization

  Personal Workspace
    1 member · personal
```

## Service Layer

**Location:** `/client/src/services/workspace.service.ts`

### API Methods

#### 1. `inviteMember(workspaceId, payload)`

```typescript
interface InviteMemberPayload {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

await WorkspaceService.inviteMember(1, {
  email: 'user@example.com',
  role: 'viewer'
});
```

#### 2. `getInvitationDetails(token)`

```typescript
const invitation = await WorkspaceService.getInvitationDetails(token);
// Returns: InvitationDetails
```

#### 3. `acceptInvitation(token)`

```typescript
await WorkspaceService.acceptInvitation(token);
// Redirects to workspace on success
```

#### 4. `getWorkspaceInvitations(workspaceId)`

```typescript
const invitations = await WorkspaceService.getWorkspaceInvitations(1);
// Returns: WorkspaceInvitation[]
```

#### 5. `revokeInvitation(workspaceId, invitationId)`

```typescript
await WorkspaceService.revokeInvitation(1, 5);
// Invitation status → 'revoked'
```

## TypeScript Types

```typescript
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
```

## Routing

```typescript
// Public route
{
  path: '/invite/:token',
  element: <AcceptInvitePage />,
  errorElement: <ErrorScreen />,
}

// Protected route
{
  path: '/workspace',
  element: (
    <ProtectedRoute>
      <AppShell>
        <WorkspacePage />
      </AppShell>
    </ProtectedRoute>
  ),
}
```

## User Flows

### Flow 1: Admin Invites New Member

```
1. Admin navigates to /workspace
2. Clicks "Invite Member" button
3. Dialog opens
4. Enters email: "newuser@example.com"
5. Selects role: "Viewer"
6. Clicks "Send Invitation"
7. Loading spinner shows
8. Success toast: "Invitation sent to newuser@example.com"
9. Dialog closes
10. Invitations list refreshes
11. New invitation appears with "Pending" badge
```

### Flow 2: User Accepts Invitation (Not Logged In)

```
1. User clicks email link: /invite/abc123
2. AcceptInvitePage loads
3. Fetches invitation details (public API)
4. Shows workspace info, role, permissions
5. User clicks "Accept Invitation"
6. Detects no auth token
7. Redirects to: /auth?invite=abc123
8. User signs up/logs in
9. Redirects back to: /invite/abc123
10. Auto-accepts invitation (API call)
11. Success toast: "Invitation accepted!"
12. Redirects to: /workspace
13. User sees new workspace
```

### Flow 3: User Accepts Invitation (Already Logged In)

```
1. User (logged in) clicks email link
2. AcceptInvitePage loads
3. Fetches invitation details
4. Detects auth token exists
5. Shows "Accept Invitation" button
6. User clicks button
7. API call: POST /invite/abc123/accept
8. Success response
9. Toast: "Invitation accepted!"
10. Wait 1.5s for toast
11. Redirect to /workspace
12. Workspace list refreshes
13. New workspace appears
```

### Flow 4: Admin Views Invitations

```
1. Admin navigates to /workspace
2. Workspace page loads
3. API call: GET /workspace/1/invitations
4. Invitations list renders
5. Shows grouped by status:
   - Pending (yellow badges)
   - Accepted (green badges)
   - Expired (red badges)
   - Revoked (gray badges)
6. Each invitation shows:
   - Email
   - Role badge
   - Status badge
   - Invited by
   - Dates
   - Revoke button (if pending & admin)
```

### Flow 5: Admin Revokes Invitation

```
1. Admin views invitations list
2. Sees pending invitation
3. Hovers over revoke button (X icon)
4. Clicks revoke button
5. API call: DELETE /workspace/1/invitations/5
6. Loading state (button disabled)
7. Success response
8. Toast: "Invitation revoked"
9. Invitations list refreshes
10. Status badge updates to "Revoked"
11. Revoke button disappears
```

## Error Handling

### Client-Side Errors

```typescript
try {
  await WorkspaceService.inviteMember(workspaceId, payload);
  toast.success('Invitation sent!');
} catch (error: any) {
  if (error.message.includes('already been sent')) {
    toast.error('This user already has a pending invitation');
  } else if (error.message.includes('Invalid email')) {
    toast.error('Please enter a valid email address');
  } else {
    toast.error('Failed to send invitation. Please try again.');
  }
}
```

### Network Errors

```typescript
// Timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, {
    signal: controller.signal,
    // ... other options
  });
} catch (error) {
  if (error.name === 'AbortError') {
    toast.error('Request timed out. Please try again.');
  } else {
    toast.error('Network error. Check your connection.');
  }
} finally {
  clearTimeout(timeoutId);
}
```

### API Error Response Handling

```typescript
if (!response.ok) {
  const errorData = await response.json();

  // Handle specific HTTP codes
  switch (response.status) {
    case 400:
      throw new Error(errorData.error || 'Invalid request');
    case 401:
      // Redirect to login
      navigate('/auth');
      throw new Error('Please log in to continue');
    case 403:
      throw new Error(errorData.error || 'Permission denied');
    case 404:
      throw new Error('Invitation not found');
    case 500:
      throw new Error('Server error. Please try again later.');
    default:
      throw new Error('An unexpected error occurred');
  }
}
```

## Loading States

### Skeleton Loaders

```typescript
// Workspace loading
{isLoading && (
  <Card className="p-12 text-center">
    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
    <p>Loading workspace...</p>
  </Card>
)}

// Members loading
{isLoadingMembers && (
  <Card className="p-12 text-center">
    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
    <p>Loading team members...</p>
  </Card>
)}

// Invitations loading
{isLoadingInvitations && (
  <Card className="p-12 text-center">
    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
    <p>Loading invitations...</p>
  </Card>
)}
```

### Button Loading States

```typescript
<Button
  onClick={handleInvite}
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Sending...
    </>
  ) : (
    <>
      <Mail className="h-4 w-4 mr-2" />
      Send Invitation
    </>
  )}
</Button>
```

## Responsive Design

### Desktop (1024px+)
- Two-column layout
- Full-width dialogs (600px max)
- Spacious cards
- Hover effects on interactive elements

### Tablet (768px - 1023px)
- Single column layout
- Adjusted card spacing
- Touch-friendly buttons
- Dropdown menus

### Mobile (< 768px)
- Stack all elements
- Full-width buttons
- Bottom sheet for dialogs (future)
- Simplified table views

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close dialogs
- Arrow keys in dropdowns

### Screen Readers
- ARIA labels on all icons
- Role descriptions
- Status announcements
- Error messages

### Color Contrast
- WCAG AA compliance
- Status badges with icons (not color alone)
- High contrast text
- Focus indicators

## Performance Optimization

### Data Fetching

```typescript
// Parallel fetching
useEffect(() => {
  if (currentWorkspace) {
    Promise.all([
      fetchTeamMembers(),
      fetchInvitations()
    ]);
  }
}, [currentWorkspace]);
```

### Debounced Search (Future)

```typescript
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      // Search invitations/members
    }, 300),
  []
);
```

### Memoization

```typescript
const filteredInvitations = useMemo(
  () => invitations.filter(inv => inv.status === 'pending'),
  [invitations]
);
```

## Testing Strategy

### Unit Tests
- Service methods
- Utility functions
- Type conversions
- Validation logic

### Component Tests
- Dialog open/close
- Form validation
- Button states
- Error displays

### Integration Tests
- Complete invitation flow
- API interaction
- Navigation
- State updates

### E2E Tests
- Full user journeys
- Cross-browser testing
- Mobile testing
- Error scenarios

## References

- Server API: `/server/docs/features/workspace-invitations/API.md`
- Server Spec: `/server/docs/features/workspace-invitations/SPEC.md`
- Component code: `/client/src/screens/workspace/Workspace.tsx`
- Accept page: `/client/src/screens/invite/AcceptInvite.tsx`
- Service: `/client/src/services/workspace.service.ts`
