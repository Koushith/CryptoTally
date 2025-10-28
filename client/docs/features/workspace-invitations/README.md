# Workspace Invitations - Client Documentation

> Frontend implementation of magic link workspace invitations

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](./SPEC.md) | Complete client-side specification, component architecture, and UI details |

### Related Server Documentation

Backend documentation: `/server/docs/features/workspace-invitations/`
- API endpoints
- Security architecture
- Database schema
- Token generation

## 🎨 UI Components

### 1. Workspace Page (`/workspace`)

Main workspace management interface with invitation features.

**Key Features:**
- Send invitations (dialog)
- View team members
- View all invitations (pending, accepted, expired, revoked)
- Revoke pending invitations
- Switch between workspaces

**Component:** `/client/src/screens/workspace/Workspace.tsx`

**Screenshots:**

```
┌─────────────────────────────────────────────────────┐
│  Workspace & Team                            [+ New]│
├─────────────────────────────────────────────────────┤
│                                                      │
│  🏢 My Organization                                 │
│     3 members · organization                    Owner│
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Team Members                    [Invite Member]│  │
│  ├──────────────────────────────────────────────┤  │
│  │ 👤 John Doe          john@example.com   Admin│  │
│  │ 👤 Jane Smith        jane@example.com  Editor│  │
│  │ 👤 Bob Wilson        bob@example.com   Viewer│  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Pending Invitations              2 pending    │  │
│  ├──────────────────────────────────────────────┤  │
│  │ 📧 new@example.com   Viewer   🟡 Pending  [×]│  │
│  │    Invited by John Doe · Jan 28, 2025         │  │
│  │                                                │  │
│  │ 📧 user@example.com  Editor   ✅ Accepted    │  │
│  │    Accepted Jan 29, 2025                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 2. Accept Invitation Page (`/invite/:token`)

Beautiful invitation acceptance interface.

**Key Features:**
- Display invitation details
- Show workspace information
- Explain role permissions
- Handle authenticated/unauthenticated users
- Smart redirect flow

**Component:** `/client/src/screens/invite/AcceptInvite.tsx`

**Screenshots:**

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│          🎉 You're invited!                          │
│                                                      │
│     ┌─────────────────────────────────────┐        │
│     │  🏢 My Organization                  │        │
│     │     You're invited as Viewer         │        │
│     └─────────────────────────────────────┘        │
│                                                      │
│  Invited by: John Doe                               │
│  Invited on: January 28, 2025                       │
│  Expires: February 4, 2025                          │
│                                                      │
│  ┌─────────────────────────────────────────┐       │
│  │ Role Permissions                         │       │
│  │ ════════════════                         │       │
│  │                                           │       │
│  │ 👁️  Read-only access to:                │       │
│  │   • View wallets and transactions        │       │
│  │   • View reports                         │       │
│  │   • View workspace settings              │       │
│  └─────────────────────────────────────────┘       │
│                                                      │
│  [           Accept Invitation           ]          │
│                                                      │
│  Or sign in with the invited email address          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 3. Invite Member Dialog

Modal for sending invitations.

**Features:**
- Email input with validation
- Role selector with icons
- Role descriptions
- Visual feedback

**Dialog Preview:**

```
┌─────────────────────────────────────────┐
│  Invite Team Member                  [×]│
├─────────────────────────────────────────┤
│                                          │
│  Email address                           │
│  ┌────────────────────────────────────┐ │
│  │ teammate@example.com               │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Role                                    │
│  ┌────────────────────────────────────┐ │
│  │ Viewer                          ▼  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Role Permissions                        │
│  ────────────────                        │
│  👁️  Viewer: Read-only access           │
│  🛡️  Editor: Can edit transactions      │
│  👑 Admin: Full access                   │
│                                          │
│         [Cancel]  [Send Invitation]      │
└─────────────────────────────────────────┘
```

## 🔄 User Flows

### Flow 1: Admin Sends Invitation

```typescript
// 1. User clicks "Invite Member"
setIsInviteMemberOpen(true);

// 2. User fills form
setInviteEmail('new@example.com');
setInviteRole('viewer');

// 3. Submit
await WorkspaceService.inviteMember(workspaceId, {
  email: inviteEmail,
  role: inviteRole
});

// 4. Success feedback
toast.success('Invitation sent!');
setIsInviteMemberOpen(false);

// 5. Refresh data
await fetchInvitations();
```

### Flow 2: User Accepts (Not Logged In)

```typescript
// 1. Load invitation page
const { token } = useParams();

// 2. Fetch invitation details (public)
const invitation = await WorkspaceService.getInvitationDetails(token);

// 3. Display details
<InvitationDetails data={invitation} />

// 4. User clicks "Accept"
if (!user) {
  // Redirect to auth with token
  navigate(`/auth?invite=${token}`);
  return;
}

// 5. After auth, redirect back
// URL: /invite/{token}

// 6. Accept invitation
await WorkspaceService.acceptInvitation(token);

// 7. Success
toast.success('Invitation accepted!');

// 8. Redirect to workspace
setTimeout(() => navigate('/workspace'), 1500);
```

### Flow 3: Admin Views & Revokes

```typescript
// 1. Load invitations
const invitations = await WorkspaceService.getWorkspaceInvitations(
  currentWorkspace.id
);

// 2. Display with status badges
{invitations.map(inv => (
  <InvitationCard
    key={inv.id}
    invitation={inv}
    onRevoke={() => handleRevoke(inv.id)}
  />
))}

// 3. Admin clicks revoke
const handleRevoke = async (invitationId) => {
  await WorkspaceService.revokeInvitation(
    currentWorkspace.id,
    invitationId
  );

  toast.success('Invitation revoked');
  await fetchInvitations(); // Refresh
};
```

## 🎨 Styling & Theme

### Color Scheme

**Status Colors:**
```typescript
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  revoked: 'bg-gray-100 text-gray-700 border-gray-200',
};
```

**Role Colors:**
```typescript
const roleColors = {
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
  editor: 'bg-blue-100 text-blue-700 border-blue-200',
  viewer: 'bg-gray-100 text-gray-700 border-gray-200',
};
```

### Icons

**Status Icons:**
- 🟡 Pending: `Clock` from lucide-react
- ✅ Accepted: `CheckCircle`
- ❌ Expired: `XCircle`
- 🚫 Revoked: `Ban`

**Role Icons:**
- 👑 Admin: `Crown`
- 🛡️ Editor: `Shield`
- 👁️ Viewer: `Eye`

## 📱 Responsive Design

### Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

### Mobile Optimizations

- Stack all elements vertically
- Full-width buttons
- Touch-friendly hit targets (min 44px)
- Bottom sheet dialogs (future)
- Swipe gestures (future)

## 🔧 State Management

### Local State (useState)

```typescript
// Component-level state
const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);

// UI state
const [isLoading, setIsLoading] = useState(false);
const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
```

### Form State

```typescript
// Controlled inputs
const [inviteEmail, setInviteEmail] = useState('');
const [inviteRole, setInviteRole] = useState<Role>('viewer');

// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(inviteEmail);
```

### Future: Global State (Zustand)

```typescript
// Potential future store
interface WorkspaceStore {
  currentWorkspace: Workspace | null;
  invitations: WorkspaceInvitation[];
  setCurrentWorkspace: (ws: Workspace) => void;
  refreshInvitations: () => Promise<void>;
}
```

## 🧪 Testing

### Component Tests

```typescript
describe('WorkspacePage', () => {
  it('renders workspace info', () => {
    render(<WorkspacePage />);
    expect(screen.getByText('My Organization')).toBeInTheDocument();
  });

  it('opens invite dialog', async () => {
    render(<WorkspacePage />);
    const button = screen.getByText('Invite Member');
    fireEvent.click(button);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('sends invitation', async () => {
    // Mock API
    const mockInvite = jest.fn();
    WorkspaceService.inviteMember = mockInvite;

    render(<WorkspacePage />);
    // ... fill form and submit
    expect(mockInvite).toHaveBeenCalledWith(1, {
      email: 'new@example.com',
      role: 'viewer'
    });
  });
});
```

### Integration Tests

```typescript
describe('Invitation Flow', () => {
  it('completes full invitation acceptance', async () => {
    // 1. Load accept page
    render(<AcceptInvitePage />, {
      route: '/invite/abc123'
    });

    // 2. See invitation details
    await waitFor(() => {
      expect(screen.getByText('My Organization')).toBeInTheDocument();
    });

    // 3. Click accept (not logged in)
    fireEvent.click(screen.getByText('Accept Invitation'));

    // 4. Redirected to auth
    expect(mockNavigate).toHaveBeenCalledWith('/auth?invite=abc123');

    // 5. After auth, back to invite page
    // 6. Auto-accept
    // 7. Redirect to workspace
  });
});
```

## 🐛 Error Handling

### User-Friendly Messages

```typescript
const getErrorMessage = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (message.includes('already been sent')) {
    return 'This user already has a pending invitation';
  }
  if (message.includes('expired')) {
    return 'This invitation has expired. Please request a new one.';
  }
  if (message.includes('email')) {
    return 'This invitation was sent to a different email address';
  }
  if (message.includes('revoked')) {
    return 'This invitation has been canceled';
  }

  return 'Something went wrong. Please try again.';
};
```

### Error Boundaries

```typescript
<ErrorBoundary FallbackComponent={ErrorScreen}>
  <AcceptInvitePage />
</ErrorBoundary>
```

## ♿ Accessibility

### Keyboard Navigation

```typescript
// Tab order
1. Invite button
2. Email input
3. Role selector
4. Send button
5. Invitation cards
6. Revoke buttons

// Keyboard shortcuts
Enter: Submit form
Escape: Close dialog
Tab: Next element
Shift+Tab: Previous element
```

### Screen Reader Support

```typescript
// ARIA labels
<button aria-label="Send invitation to teammate">
  <Mail className="h-4 w-4" />
</button>

// Role descriptions
<Badge
  role="status"
  aria-label={`Invitation status: ${status}`}
>
  {status}
</Badge>

// Loading states
{isLoading && (
  <div role="status" aria-live="polite">
    Loading invitations...
  </div>
)}
```

## 📦 Dependencies

### Core Libraries

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^7.0.0",
  "lucide-react": "^0.263.0",
  "sonner": "^1.0.0"
}
```

### UI Components

```json
{
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "@radix-ui/react-select": "^2.0.0",
  "class-variance-authority": "^0.7.0",
  "tailwind-merge": "^2.0.0"
}
```

## 🔗 Related Files

### Components
- `/client/src/screens/workspace/Workspace.tsx`
- `/client/src/screens/invite/AcceptInvite.tsx`
- `/client/src/components/ui/*` (shadcn components)

### Services
- `/client/src/services/workspace.service.ts`
- `/client/src/services/auth.service.ts`

### Types
- `/client/src/types/workspace.ts` (future)
- Defined inline in service file currently

### Routing
- `/client/src/App.tsx` (route definitions)
- `/client/src/components/ProtectedRoute.tsx`

## 📊 Performance

### Optimization Strategies

```typescript
// Parallel data fetching
useEffect(() => {
  if (currentWorkspace) {
    Promise.all([
      fetchTeamMembers(),
      fetchInvitations()
    ]);
  }
}, [currentWorkspace]);

// Memoized computations
const pendingCount = useMemo(
  () => invitations.filter(i => i.status === 'pending').length,
  [invitations]
);

// Debounced search (future)
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

### Bundle Size

Current (estimated):
- Workspace page: ~15KB (gzipped)
- Accept page: ~8KB (gzipped)
- Service: ~2KB (gzipped)

## 🚀 Future Enhancements

### Phase 2
- [ ] Bulk invitation UI
- [ ] Invitation history timeline
- [ ] Custom invitation templates
- [ ] Invitation link preview
- [ ] Resend invitation button

### Phase 3
- [ ] Real-time invitation updates (WebSocket)
- [ ] Invitation analytics dashboard
- [ ] Team invitation links UI
- [ ] Advanced filtering/search
- [ ] Export invitation reports

## 📝 Changelog

### v1.0.0 (2025-01-28)
- ✨ Initial implementation
- 🎨 Beautiful UI components
- 📱 Responsive design
- ♿ Accessibility support
- 🔄 Complete user flows

---

**Last Updated:** 2025-01-28
**Component Library:** shadcn/ui + Radix
**State Management:** React useState (local)
**Styling:** Tailwind CSS
