# Passkey User Flows

## Overview

This document outlines all user journeys related to passkey authentication in CryptoTally.

---

## Flow 1: First-Time User (Setting Up Passkey)

### Scenario
A user who signed up with Google OAuth wants to add a passkey for faster future logins.

### Steps

```
┌─────────────────────────────────────────┐
│  Step 1: User Signs In with Google     │
│  ┌───────────────────────────────────┐ │
│  │  Auth Page                         │ │
│  │  • User clicks "Continue with      │ │
│  │    Google"                         │ │
│  │  • Completes Google OAuth          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 2: Navigate to Settings           │
│  ┌───────────────────────────────────┐ │
│  │  Dashboard                         │ │
│  │  • User clicks profile/settings    │ │
│  │  • Navigates to Settings page      │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 3: Open Security Settings         │
│  ┌───────────────────────────────────┐ │
│  │  Settings Page                     │ │
│  │  • User sees Security card         │ │
│  │  • Clicks on "Security"            │ │
│  │  • SecurityModal opens             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 4: View Current Passkeys          │
│  ┌───────────────────────────────────┐ │
│  │  SecurityModal                     │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ Passkeys                    │  │ │
│  │  │ No passkeys added           │  │ │
│  │  │ [Add Passkey]               │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 5: Add Passkey Dialog             │
│  ┌───────────────────────────────────┐ │
│  │  Add Passkey Dialog                │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ Passkey name:               │  │ │
│  │  │ [MacBook Pro____________]   │  │ │
│  │  │                             │  │ │
│  │  │ [Cancel]  [Add Passkey]     │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 6: Browser Biometric Prompt       │
│  ┌───────────────────────────────────┐ │
│  │  System Prompt (OS-level)          │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │  Touch ID to continue        │  │ │
│  │  │                              │  │ │
│  │  │      👆                      │  │ │
│  │  │                              │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 7: Passkey Added Successfully     │
│  ┌───────────────────────────────────┐ │
│  │  SecurityModal                     │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ 💻 MacBook Pro              │  │ │
│  │  │ Added Oct 28, 2024          │  │ │
│  │  │ Last used Never             │  │ │
│  │  │                       [🗑️]  │  │ │
│  │  └─────────────────────────────┘  │ │
│  │  [Add] ← Can add more             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Success Criteria
- ✅ Passkey appears in list
- ✅ Toast: "Passkey added successfully!"
- ✅ User can see device name and creation date

### Error Scenarios

**User cancels biometric prompt:**
- ❌ Toast: "Registration cancelled or not allowed"
- ℹ️ Dialog stays open, user can retry

**Device already has passkey:**
- ❌ Toast: "This device already has a passkey registered"
- ℹ️ User should use existing passkey instead

**Browser doesn't support passkeys:**
- 🚫 "Add Passkey" button not visible
- ℹ️ Only shows if `passkeySupported === true`

---

## Flow 2: Returning User (Sign In with Passkey)

### Scenario
A user who previously added a passkey wants to sign in.

### Steps

```
┌─────────────────────────────────────────┐
│  Step 1: User Lands on Auth Page        │
│  ┌───────────────────────────────────┐ │
│  │  Auth Page                         │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ [Continue with Google]      │  │ │
│  │  │ [👆 Sign in with Passkey]   │  │ │  ← Visible!
│  │  │                             │  │ │
│  │  │ ─────── Or with email ───── │  │ │
│  │  │ Email: [____________]       │  │ │
│  │  │ Password: [_________]       │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 2: Click Passkey Button           │
│  ┌───────────────────────────────────┐ │
│  │  Auth Page                         │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ [⏳ Sign in with Passkey]   │  │  ← Loading
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 3: Browser Biometric Prompt       │
│  ┌───────────────────────────────────┐ │
│  │  System Prompt (OS-level)          │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │  Touch ID to sign in to      │  │ │
│  │  │  CryptoTally                 │  │ │
│  │  │                              │  │ │
│  │  │      👆                      │  │ │
│  │  │                              │  │ │
│  │  │  user@example.com            │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 4: Signed In!                     │
│  ┌───────────────────────────────────┐ │
│  │  Dashboard                         │ │
│  │  • Toast: "Welcome! Signed in     │ │
│  │    with passkey"                  │ │
│  │  • User redirected to dashboard   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Success Criteria
- ✅ User authenticated in <2 seconds
- ✅ Toast: "Welcome! Signed in with passkey"
- ✅ Redirected to dashboard
- ✅ Same Firebase session as Google/Email auth

### Error Scenarios

**User cancels biometric prompt:**
- ❌ Toast: "Authentication cancelled or not allowed"
- ℹ️ User stays on Auth page, can retry or use different method

**No passkey found on device:**
- ❌ Toast: "No passkey found for this device"
- ℹ️ User should use Google/Email auth instead

**Network error:**
- ❌ Toast: "Failed to sign in with passkey"
- ℹ️ User can retry or use different method

---

## Flow 3: Managing Multiple Passkeys

### Scenario
A user with multiple devices wants to add passkeys for each device.

### Current State
```
┌─────────────────────────────────────┐
│  SecurityModal                       │
│  ┌─────────────────────────────┐    │
│  │ Passkeys              [Add] │    │
│  │                             │    │
│  │ 💻 MacBook Pro              │    │
│  │ Added Oct 28, 2024          │    │
│  │ Last used 5 min ago   [🗑️] │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Adding Second Passkey (iPhone)

```
1. User clicks [Add]
2. Enters "iPhone 15"
3. Confirms biometric on iPhone
4. New passkey added:

┌─────────────────────────────────────┐
│  SecurityModal                       │
│  ┌─────────────────────────────┐    │
│  │ Passkeys              [Add] │    │
│  │                             │    │
│  │ 💻 MacBook Pro              │    │
│  │ Added Oct 28, 2024          │    │
│  │ Last used 5 min ago   [🗑️] │    │
│  │                             │    │
│  │ 📱 iPhone 15                │    │
│  │ Added Oct 28, 2024          │    │
│  │ Last used Never       [🗑️] │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Benefits
- ✅ Sign in from any device with biometric
- ✅ Passkeys sync via iCloud Keychain (Apple) or Google Password Manager (Android)
- ✅ Each device shows separately for management

---

## Flow 4: Removing a Passkey

### Scenario
A user sells their old device and wants to remove its passkey.

### Steps

```
┌─────────────────────────────────────────┐
│  Step 1: View Passkeys in Security      │
│  ┌───────────────────────────────────┐ │
│  │ 💻 MacBook Pro (Current)          │ │
│  │                            [🗑️]   │ │
│  │                                   │ │
│  │ 💻 Old MacBook (Sold)             │ │  ← Want to remove
│  │                            [🗑️]   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 2: Click Delete Button            │
│  ┌───────────────────────────────────┐ │
│  │  Confirmation Dialog               │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ Remove passkey?             │  │ │
│  │  │                             │  │ │
│  │  │ This passkey will no longer │  │ │
│  │  │ work for signing in.        │  │ │
│  │  │                             │  │ │
│  │  │ [Cancel]  [Remove]          │  │ │
│  │  └─────────────────────────────┘  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Step 3: Passkey Removed                │
│  ┌───────────────────────────────────┐ │
│  │  SecurityModal                     │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ 💻 MacBook Pro              │  │ │
│  │  │                       [🗑️]  │  │ │
│  │  └─────────────────────────────┘  │ │
│  │  • Toast: "Passkey removed         │ │
│  │    successfully"                   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Success Criteria
- ✅ Passkey removed from database
- ✅ Passkey removed from list
- ✅ Toast: "Passkey removed successfully"
- ✅ User can still sign in with other passkeys or methods

### Security Notes
- ⚠️ Removing passkey from database doesn't delete it from the physical device
- ℹ️ Old device can no longer authenticate with removed passkey
- ✅ No security risk - credential is worthless without server's public key

---

## Flow 5: Browser Doesn't Support Passkeys

### Scenario
User tries to access CryptoTally from an unsupported browser.

### What User Sees

```
┌─────────────────────────────────────────┐
│  Auth Page (Unsupported Browser)        │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │ [Continue with Google]            │ │
│  │                                   │ │  ← No passkey button!
│  │ ─────── Or with email ─────       │ │
│  │ Email: [____________]             │ │
│  │ Password: [_________]             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### In Settings

```
┌─────────────────────────────────────────┐
│  SecurityModal (Unsupported Browser)     │
│  ┌───────────────────────────────────┐ │
│  │  Passkeys              [Add]      │ │  ← Add button shown
│  │  No passkeys added                │ │
│  │                                   │ │
│  │  If user clicks [Add]:            │ │
│  │  ❌ Toast: "Passkeys are not      │ │
│  │     supported on this device"     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Fallback Behavior
- ✅ User can still use Google OAuth or Email/Password
- ✅ No passkey UI on Auth page
- ℹ️ Error message if attempting to add passkey

### Supported Browsers
- ✅ Chrome 109+ (Windows, macOS, Android)
- ✅ Safari 16+ (macOS, iOS)
- ✅ Edge 109+ (Windows)
- ⚠️ Firefox (improving, check support)

---

## Flow 6: Cross-Device Passkey Sync

### Scenario (Apple Ecosystem)
User adds passkey on MacBook, automatically available on iPhone.

```
MacBook (Add Passkey)
         │
         ▼
   iCloud Keychain
         │
         ▼
iPhone (Passkey Available)
```

### Steps

1. **On MacBook:**
   - User adds passkey "Apple Devices"
   - Confirms with Touch ID
   - Passkey stored in iCloud Keychain

2. **On iPhone (moments later):**
   - User visits CryptoTally
   - Sees "Sign in with Passkey" button
   - Taps button
   - Confirms with Face ID
   - Signed in!

### Platform-Specific Sync

**Apple (iCloud Keychain):**
- ✅ Syncs across Mac, iPhone, iPad
- ✅ Requires same Apple ID
- ✅ Automatic, no user action needed

**Google (Password Manager):**
- ✅ Syncs across Android devices
- ✅ Requires same Google account
- ✅ Automatic sync

**Windows:**
- ❌ No cross-device sync
- ℹ️ Passkeys device-specific (TPM-bound)

---

## State Transitions

### Loading States

```
idle
  │
  ├─► [Click Sign In with Passkey]
  │         │
  │         ▼
  │   isPasskeyLoading = true
  │         │
  │         ├─► [Success]
  │         │     │
  │         │     ▼
  │         │   isPasskeyLoading = false
  │         │   Navigate to dashboard
  │         │
  │         └─► [Error]
  │               │
  │               ▼
  │         isPasskeyLoading = false
  │         Show error toast
  │
  └─► [idle]
```

### Passkey List States

```
Initial: isLoading = true
     │
     ▼
Load passkeys
     │
     ├─► [Success]
     │     │
     │     ▼
     │   isLoading = false
     │   Display passkeys
     │
     └─► [Error]
           │
           ▼
         isLoading = false
         Show error message
```

---

## User Experience Goals

### Speed
- ⚡ Sign in < 2 seconds
- 🎯 One tap authentication
- ⏱️ No typing required

### Security
- 🔒 Biometric verification
- 🛡️ Phishing-resistant
- 🔐 No password to forget

### Simplicity
- 👆 One button sign in
- 📱 Works across devices
- ✅ Intuitive management

### Fallback
- 🔄 Always show alternative auth methods
- ℹ️ Clear error messages
- 🔁 Easy to retry

---

## Edge Cases

### Multiple Accounts
- User has multiple CryptoTally accounts
- Browser shows list of available passkeys
- User selects correct account

### Passkey Deleted from Device
- User deleted passkey from iCloud Keychain
- Server still has record
- User can delete from Settings
- Or add new passkey

### Server-Client Mismatch
- User has passkey on device
- Server doesn't recognize it
- Error: "Passkey not found"
- User should add new passkey

### Network Failure During Registration
- Passkey created on device
- Request to server fails
- User should retry registration
- New challenge generated

---

## Analytics Events

Track these events for monitoring:

```typescript
// Sign In
analytics.logEvent('passkey_signin_started');
analytics.logEvent('passkey_signin_success');
analytics.logEvent('passkey_signin_failed', { error });

// Registration
analytics.logEvent('passkey_registration_started');
analytics.logEvent('passkey_registration_success');
analytics.logEvent('passkey_registration_failed', { error });

// Management
analytics.logEvent('passkey_deleted');
analytics.logEvent('passkey_list_viewed');

// Support Detection
analytics.logEvent('passkey_support_detected', {
  isSupported,
  isPlatformAvailable,
});
```

---

## Related Documentation

- [README.md](./README.md) - Overview
- [COMPONENTS.md](./COMPONENTS.md) - Component details
- [Server API](../../../../server/docs/features/auth/passkey/API.md)
