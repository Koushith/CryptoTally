# Passkey Authentication (Client)

## Overview

Frontend implementation of WebAuthn passkey authentication for CryptoTally. Provides passwordless sign-in with biometric authentication (Touch ID, Face ID, Windows Hello) integrated with Firebase authentication.

## Key Features

- **One-Tap Sign In**: Sign in with a single biometric verification
- **Cross-Device Support**: Works on any device with biometric capabilities
- **Passkey Management**: Users can add/remove multiple passkeys
- **Seamless Integration**: Works alongside Google OAuth and Email/Password auth
- **Proper State Management**: Loading states, error handling, and user feedback
- **Browser Support Detection**: Automatically detects passkey support

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Auth Page (Auth.tsx)                  │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │   Google   │  │  Passkey   │  │Email/Password│      │
│  │   OAuth    │  │  Sign In   │  │   Sign In    │      │
│  └────────────┘  └────────────┘  └──────────────┘      │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │  PasskeyService             │
         │  - registerPasskey()        │
         │  - authenticateWithPasskey()│
         │  - listPasskeys()           │
         │  - deletePasskey()          │
         │  - isSupported()            │
         └─────────────┬───────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ WebAuthn│  │   API   │  │Firebase │
    │   API   │  │ Backend │  │  Auth   │
    └─────────┘  └─────────┘  └─────────┘
```

## User Flows

### First-Time Setup (Adding Passkey)

1. User signs in with Google/Email
2. Navigates to Settings → Security
3. Clicks "Add Passkey"
4. Enters device name (e.g., "MacBook Pro")
5. Browser prompts for biometric verification
6. Passkey added to account

### Signing In with Passkey

1. User lands on Auth page
2. Sees "Sign in with Passkey" button (if supported)
3. Clicks button
4. Browser prompts for biometric verification
5. Signed in instantly

### Managing Passkeys

1. User navigates to Settings → Security
2. Views list of registered passkeys
3. Can see:
   - Device name
   - Last used date
   - Device type
4. Can delete passkeys

## Components

### Auth Page (`Auth.tsx`)

Main authentication page with passkey integration.

**Location:** `src/screens/auth/Auth.tsx:52`

**Features:**
- Passkey sign-in button
- Support detection
- Loading states
- Error handling

**State:**
```typescript
const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);
const [passkeySupported, setPasskeySupported] = useState(false);
```

**Handler:**
```typescript
const handlePasskeyAuth = async () => {
  setIsPasskeyLoading(true);
  try {
    await PasskeyService.authenticateWithPasskey();
    toast.success('Welcome! Signed in with passkey');
    navigate('/');
  } catch (error) {
    toast.error(error.message || 'Failed to sign in with passkey');
  } finally {
    setIsPasskeyLoading(false);
  }
};
```

### Security Modal (`SecurityModal.tsx`)

Passkey management interface in Settings.

**Location:** `src/components/settings/modals/SecurityModal.tsx`

**Features:**
- List all passkeys
- Add new passkey
- Delete passkey
- Loading states for each operation
- Confirmation dialogs

**State:**
```typescript
const [passkeys, setPasskeys] = useState<Passkey[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isAddingPasskey, setIsAddingPasskey] = useState(false);
const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
```

### PasskeyService (`passkey.service.ts`)

Core service for all passkey operations.

**Location:** `src/services/passkey.service.ts`

**Methods:**

```typescript
class PasskeyService {
  // Register a new passkey
  static async registerPasskey(
    token: string,
    deviceName?: string
  ): Promise<PasskeyInfo>

  // Sign in with passkey
  static async authenticateWithPasskey(): Promise<UserCredential>

  // List user's passkeys
  static async listPasskeys(token: string): Promise<Passkey[]>

  // Delete a passkey
  static async deletePasskey(token: string, passkeyId: number): Promise<void>

  // Check browser support
  static isSupported(): boolean

  // Check for platform authenticator
  static async isPlatformAuthenticatorAvailable(): Promise<boolean>
}
```

## Installation

### Dependencies

Already installed in package.json:

```json
{
  "@simplewebauthn/browser": "^10.0.0"
}
```

### Browser Support

Passkeys work in:
- ✅ Chrome 109+ (Windows, macOS, Android)
- ✅ Safari 16+ (macOS, iOS)
- ✅ Edge 109+ (Windows)
- ❌ Firefox (partial support, improving)

## Usage

### Detecting Passkey Support

```typescript
useEffect(() => {
  const checkPasskeySupport = async () => {
    const isSupported = PasskeyService.isSupported();
    const isPlatformAvailable =
      await PasskeyService.isPlatformAuthenticatorAvailable();

    setPasskeySupported(isSupported && isPlatformAvailable);
  };
  checkPasskeySupport();
}, []);
```

### Registering a Passkey

```typescript
const handleAddPasskey = async () => {
  try {
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const newPasskey = await PasskeyService.registerPasskey(
      token,
      'MacBook Pro'
    );

    toast.success('Passkey added successfully!');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Authenticating with Passkey

```typescript
const handlePasskeyAuth = async () => {
  try {
    await PasskeyService.authenticateWithPasskey();
    navigate('/');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Listing Passkeys

```typescript
const loadPasskeys = async () => {
  try {
    const user = auth.currentUser;
    const token = await user.getIdToken();

    const data = await PasskeyService.listPasskeys(token);
    setPasskeys(data);
  } catch (error) {
    toast.error('Failed to load passkeys');
  }
};
```

### Deleting a Passkey

```typescript
const handleDeletePasskey = async (id: number) => {
  try {
    const user = auth.currentUser;
    const token = await user.getIdToken();

    await PasskeyService.deletePasskey(token, id);
    toast.success('Passkey removed successfully');
  } catch (error) {
    toast.error('Failed to delete passkey');
  }
};
```

## Error Handling

### Common Errors

**NotAllowedError**
- User cancelled the biometric prompt
- Message: "Authentication cancelled or not allowed"

**InvalidStateError**
- Device already has this passkey registered (registration)
- No passkey found on device (authentication)
- Messages:
  - Registration: "This device already has a passkey registered"
  - Authentication: "No passkey found for this device"

**NotSupportedError**
- Browser/device doesn't support passkeys
- Message: "Passkeys are not supported on this device"

### User-Friendly Messages

The PasskeyService automatically converts WebAuthn errors to user-friendly messages:

```typescript
try {
  await startAuthentication(options);
} catch (error: any) {
  if (error.name === 'NotAllowedError') {
    throw new Error('Authentication cancelled or not allowed');
  }
  if (error.name === 'InvalidStateError') {
    throw new Error('No passkey found for this device');
  }
  if (error.name === 'NotSupportedError') {
    throw new Error('Passkeys are not supported on this device');
  }
  throw error;
}
```

## Testing

### Local Testing

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Use supported browser**
   - Chrome/Edge on Windows (with Windows Hello)
   - Safari on macOS (with Touch ID)
   - Safari on iOS (with Face ID/Touch ID)

3. **Test flow**
   - Sign in with Google/Email
   - Go to Settings → Security
   - Add a passkey
   - Sign out
   - Sign in with passkey

### Testing on Different Devices

**macOS (Touch ID):**
- Use Safari or Chrome
- Passkey stored in iCloud Keychain
- Syncs across Apple devices

**Windows (Windows Hello):**
- Use Chrome or Edge
- Passkey stored in Windows Hello
- Device-specific

**iOS (Face ID/Touch ID):**
- Use Safari
- Passkey stored in iCloud Keychain
- Syncs across Apple devices

**Android:**
- Use Chrome
- Passkey stored in Google Password Manager
- Syncs across Android devices

## Security Considerations

### Client-Side Security

1. **Private keys never leave device**
   - Stored in secure enclave (iOS/macOS)
   - Stored in TPM (Windows)
   - Never transmitted to server

2. **Biometric verification**
   - Required for every authentication
   - Handled by OS, never exposed to JavaScript

3. **Domain binding**
   - Passkeys only work on registered domain
   - Prevents phishing attacks

### Best Practices

1. **Always check support**
   ```typescript
   if (!PasskeyService.isSupported()) {
     // Don't show passkey UI
   }
   ```

2. **Handle errors gracefully**
   ```typescript
   try {
     await PasskeyService.authenticateWithPasskey();
   } catch (error) {
     // Show user-friendly error
     toast.error(error.message);
   }
   ```

3. **Show loading states**
   ```typescript
   <Button disabled={isPasskeyLoading}>
     {isPasskeyLoading ? <Loader2 /> : <Fingerprint />}
   </Button>
   ```

4. **Provide fallback auth**
   - Always show email/password or Google OAuth
   - Passkeys are an additional option, not the only one

## Troubleshooting

### Passkey button not showing

**Check:**
1. Browser support: `PasskeyService.isSupported()`
2. Platform authenticator: `isPlatformAuthenticatorAvailable()`
3. State variable: `passkeySupported` should be true

### "Failed to get registration options"

**Check:**
1. User is authenticated
2. Firebase token is valid
3. Backend is running
4. Network connectivity

### "Passkey not found"

**Possible causes:**
1. Passkey was deleted from device
2. User is on different device
3. iCloud Keychain sync issue (Apple)

### Browser shows wrong passkeys

**Solution:**
1. Clear browser passkey cache
2. Check iCloud Keychain on Apple devices
3. Check Google Password Manager on Android

## Production Checklist

- [ ] HTTPS enabled
- [ ] RP_ID matches production domain
- [ ] Frontend URL configured correctly
- [ ] Error handling for all flows
- [ ] Loading states for all operations
- [ ] Support detection working
- [ ] Tested on multiple browsers/devices
- [ ] User documentation created
- [ ] Fallback authentication available

## Related Documentation

- [User Flow](./USER_FLOW.md) - Detailed user journey
- [Components](./COMPONENTS.md) - Component documentation
- [Server Documentation](../../../../server/docs/features/auth/passkey/README.md)

## References

- [WebAuthn Guide](https://webauthn.guide/)
- [SimpleWebAuthn Browser](https://simplewebauthn.dev/docs/packages/browser)
- [Passkeys.dev](https://passkeys.dev/)
