# Passkey Authentication (Server)

## Overview

WebAuthn passkey authentication implementation for CryptoTally. Provides passwordless sign-in using biometric authentication (Touch ID, Face ID, Windows Hello) while maintaining Firebase authentication compatibility.

## Key Features

- **WebAuthn Standards-Compliant**: Implements W3C WebAuthn specification
- **Firebase Integration**: Creates custom tokens for seamless Firebase authentication
- **Platform Authenticators**: Supports Touch ID, Face ID, Windows Hello
- **Multi-Device Support**: Users can register multiple passkeys
- **Replay Protection**: Signature counters prevent credential reuse
- **Phishing Resistant**: Domain binding prevents phishing attacks

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Client    │◄────►│    Server    │◄────►│  Database  │
│  (Browser)  │      │   (Express)  │      │ (Postgres) │
└─────────────┘      └──────────────┘      └────────────┘
      │                      │                     │
      │                      │                     │
      ▼                      ▼                     ▼
WebAuthn API         @simplewebauthn        passkeys table
 (Browser)              /server           challenges table
```

## Quick Start

### Prerequisites

- PostgreSQL database
- Firebase Admin SDK configured
- HTTPS or localhost (WebAuthn requirement)

### Environment Variables

```env
# WebAuthn Configuration
RP_ID=localhost                    # or your domain
FRONTEND_URL=http://localhost:5173 # or your frontend URL

# Firebase
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_key
FIREBASE_PROJECT_ID=your_project_id
```

### Database Schema

Run migrations to create required tables:

```bash
npm run migrate
```

This creates:
- `passkeys` - Stores WebAuthn credentials
- `passkeys_challenges` - Temporary challenge storage (5-minute TTL)

## Authentication Flow

### Registration Flow

1. **Client requests registration options**
   - `GET /api/passkey/registration/options`
   - Requires: Bearer token (Firebase ID token)
   - Returns: PublicKeyCredentialCreationOptions

2. **Client creates credential**
   - Browser prompts for biometric authentication
   - Private key stored securely on device
   - Public key credential returned

3. **Client verifies registration**
   - `POST /api/passkey/registration/verify`
   - Server verifies credential and stores public key

### Authentication Flow

1. **Client requests authentication options**
   - `GET /api/passkey/authentication/options`
   - Public endpoint (no auth required)
   - Returns: PublicKeyCredentialRequestOptions

2. **Client signs challenge**
   - Browser prompts for biometric authentication
   - Device signs challenge with private key

3. **Client verifies authentication**
   - `POST /api/passkey/authentication/verify`
   - Server verifies signature
   - Returns: Firebase custom token
   - Client signs into Firebase with custom token

## API Endpoints

See [API.md](./API.md) for detailed API documentation.

## Security Considerations

### Challenge Management
- Challenges expire after 5 minutes
- One-time use (deleted after verification)
- Cryptographically random (base64url encoded)

### Credential Storage
- Public keys only (private keys never leave device)
- Base64url encoding for safe database storage
- Signature counters for replay protection

### Domain Binding
- Credentials bound to RP_ID domain
- Origin verification on every authentication
- Prevents phishing attacks

### Firebase Integration
- Custom tokens created only after successful verification
- Same Firebase account across all auth methods
- No password exposure

## Troubleshooting

### "Passkey not found"
- Credential ID mismatch
- User may have deleted the passkey
- Check database for credential ID

### "Challenge expired"
- Challenges expire after 5 minutes
- User took too long to complete authentication
- Retry the flow

### "Origin mismatch"
- FRONTEND_URL doesn't match actual origin
- Check environment configuration
- Verify HTTPS setup in production

### "No pending registration/authentication"
- Challenge not found in database
- May have been deleted or expired
- Retry from step 1

## Development

### Testing Passkeys Locally

1. **Use localhost** (WebAuthn allows localhost without HTTPS)
2. **Browser support**: Use Chrome, Edge, or Safari
3. **Device support**: Ensure device has Touch ID/Face ID or security key

### Testing Registration

```bash
# Register a passkey
curl -X GET http://localhost:8000/api/passkey/registration/options \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### Testing Authentication

```bash
# Get authentication options
curl -X GET http://localhost:8000/api/passkey/authentication/options
```

## Production Considerations

### HTTPS Required
- WebAuthn requires HTTPS in production
- Use valid SSL certificate
- Update RP_ID to your domain

### RP_ID Configuration
```env
# Development
RP_ID=localhost

# Production
RP_ID=cryptotally.com
```

### Challenge Cleanup
Consider adding a cron job to clean up expired challenges:

```typescript
// Clean up challenges older than 10 minutes
await db
  .delete(passkeysChallenges)
  .where(lt(passkeysChallenges.expiresAt, new Date()));
```

## Related Documentation

- [API Documentation](./API.md)
- [Database Schema](./SPEC.md)
- [Client Documentation](../../../../client/docs/features/auth/passkey/README.md)

## References

- [WebAuthn Specification](https://www.w3.org/TR/webauthn-2/)
- [SimpleWebAuthn Documentation](https://simplewebauthn.dev/)
- [Firebase Custom Tokens](https://firebase.google.com/docs/auth/admin/create-custom-tokens)
