# Passkey API Documentation

## Base URL

```
http://localhost:8000/api/passkey (development)
https://api.cryptotally.com/api/passkey (production)
```

## Authentication

Most endpoints require Firebase ID token authentication:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### 1. Get Registration Options

Generate WebAuthn registration options for creating a new passkey.

**Endpoint:** `GET /api/passkey/registration/options`

**Authentication:** Required (Bearer token)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "challenge": "random_base64url_string",
    "rp": {
      "name": "CryptoTally",
      "id": "localhost"
    },
    "user": {
      "id": "base64url_encoded_user_id",
      "name": "user@example.com",
      "displayName": "User Name"
    },
    "pubKeyCredParams": [
      { "type": "public-key", "alg": -7 },
      { "type": "public-key", "alg": -257 }
    ],
    "timeout": 60000,
    "excludeCredentials": [
      {
        "id": "existing_credential_id",
        "type": "public-key",
        "transports": ["internal"]
      }
    ],
    "authenticatorSelection": {
      "residentKey": "preferred",
      "userVerification": "preferred",
      "authenticatorAttachment": "platform"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found in database
- `500 Internal Server Error` - Server error

---

### 2. Verify Registration

Verify and store a newly created passkey credential.

**Endpoint:** `POST /api/passkey/registration/verify`

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "credential": {
    "id": "credential_id_base64url",
    "rawId": "credential_id_base64url",
    "response": {
      "clientDataJSON": "base64url_encoded_json",
      "attestationObject": "base64url_encoded_attestation"
    },
    "type": "public-key"
  },
  "deviceName": "MacBook Pro" // Optional
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "MacBook Pro",
    "deviceType": "singleDevice",
    "createdAt": "2024-10-28T10:30:00.000Z"
  },
  "message": "Passkey registered successfully"
}
```

**Error Responses:**

- `400 Bad Request`
  ```json
  {
    "success": false,
    "error": "Credential is required"
  }
  ```
  ```json
  {
    "success": false,
    "error": "No pending registration"
  }
  ```
  ```json
  {
    "success": false,
    "error": "Challenge expired"
  }
  ```
  ```json
  {
    "success": false,
    "error": "Verification failed"
  }
  ```
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 3. Get Authentication Options

Generate WebAuthn authentication options for signing in with a passkey.

**Endpoint:** `GET /api/passkey/authentication/options`

**Authentication:** None (Public endpoint)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "challenge": "random_base64url_string",
    "timeout": 60000,
    "rpId": "localhost",
    "userVerification": "preferred",
    "allowCredentials": []
  }
}
```

**Notes:**
- Empty `allowCredentials` array enables discoverable credentials
- Client browser will show list of available passkeys

**Error Responses:**

- `500 Internal Server Error` - Server error

---

### 4. Verify Authentication

Verify passkey signature and create Firebase custom token.

**Endpoint:** `POST /api/passkey/authentication/verify`

**Authentication:** None (Public endpoint)

**Request Body:**

```json
{
  "credential": {
    "id": "credential_id_base64url",
    "rawId": "credential_id_base64url",
    "response": {
      "clientDataJSON": "base64url_encoded_json",
      "authenticatorData": "base64url_encoded_data",
      "signature": "base64url_encoded_signature",
      "userHandle": "base64url_encoded_user_id"
    },
    "type": "public-key"
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "customToken": "firebase_custom_token_string",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "photoUrl": "https://..."
    }
  },
  "message": "Authentication successful"
}
```

**Error Responses:**

- `400 Bad Request`
  ```json
  {
    "success": false,
    "error": "Credential is required"
  }
  ```
  ```json
  {
    "success": false,
    "error": "No pending authentication"
  }
  ```
  ```json
  {
    "success": false,
    "error": "Challenge expired"
  }
  ```
  ```json
  {
    "success": false,
    "error": "Verification failed"
  }
  ```
- `404 Not Found`
  ```json
  {
    "success": false,
    "error": "Passkey not found"
  }
  ```
  ```json
  {
    "success": false,
    "error": "User not found"
  }
  ```
- `500 Internal Server Error` - Server error

---

### 5. List Passkeys

Get all passkeys registered for the authenticated user.

**Endpoint:** `GET /api/passkey`

**Authentication:** Required (Bearer token)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MacBook Pro",
      "deviceType": "singleDevice",
      "createdAt": "2024-10-28T10:30:00.000Z",
      "lastUsedAt": "2024-10-28T11:00:00.000Z"
    },
    {
      "id": 2,
      "name": "iPhone 15",
      "deviceType": "platform",
      "createdAt": "2024-10-27T15:00:00.000Z",
      "lastUsedAt": null
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 6. Delete Passkey

Remove a passkey from the user's account.

**Endpoint:** `DELETE /api/passkey/:id`

**Authentication:** Required (Bearer token)

**URL Parameters:**
- `id` - Passkey ID (integer)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Passkey deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found`
  ```json
  {
    "success": false,
    "error": "User not found"
  }
  ```
  ```json
  {
    "success": false,
    "error": "Passkey not found"
  }
  ```
  **Note:** Also returns 404 if passkey belongs to different user
- `500 Internal Server Error` - Server error

---

## Common Error Responses

### Authentication Errors

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Validation Errors

```json
{
  "success": false,
  "error": "Credential is required"
}
```

### Server Errors

```json
{
  "success": false,
  "error": "Failed to generate registration options"
}
```

## Rate Limiting

**Note:** Consider implementing rate limiting on authentication endpoints to prevent abuse:

- Registration options: 10 requests/minute per user
- Authentication options: 20 requests/minute per IP
- Verification endpoints: 5 requests/minute per IP

## Security Notes

### Challenge Expiration
All challenges expire after 5 minutes and are single-use.

### Credential Binding
Credentials are bound to:
- User account (cannot be transferred)
- Domain (RP_ID)
- Origin (verified on every authentication)

### Signature Counter
The server tracks signature counters to detect credential cloning:
- Counter must increase with each authentication
- If counter doesn't increase, credential may be compromised

### HTTPS Requirement
Production deployment requires HTTPS. WebAuthn will not work over HTTP except for localhost.

## Testing

### Using cURL

**Get registration options:**
```bash
TOKEN=$(firebase auth:print-token)
curl -X GET http://localhost:8000/api/passkey/registration/options \
  -H "Authorization: Bearer $TOKEN"
```

**List passkeys:**
```bash
curl -X GET http://localhost:8000/api/passkey \
  -H "Authorization: Bearer $TOKEN"
```

**Delete passkey:**
```bash
curl -X DELETE http://localhost:8000/api/passkey/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman/Insomnia

1. Set `Authorization` header: `Bearer <firebase_token>`
2. Set `Content-Type` header: `application/json`
3. Send requests to endpoints

**Note:** Browser-based testing is required for full WebAuthn flow (registration/authentication verification) as it requires the Web Authentication API.

## WebAuthn Flow Diagram

```
Registration:
┌─────────┐    GET /registration/options    ┌────────┐
│ Client  │──────────────────────────────────►│ Server │
└─────────┘                                   └────────┘
     │                                             │
     │          PublicKeyCredentialCreationOptions│
     │◄────────────────────────────────────────────┘
     │
     ├── navigator.credentials.create()
     │   (Browser prompts for biometric)
     │
     │         POST /registration/verify
     │         + PublicKeyCredential         ┌────────┐
     ├─────────────────────────────────────►│ Server │
     │                                       └────────┘
     │                                            │
     │                                            ├── Verify credential
     │                                            ├── Store public key
     │                                            ├── Delete challenge
     │                                            │
     │         Success response                   │
     │◄───────────────────────────────────────────┘


Authentication:
┌─────────┐    GET /authentication/options   ┌────────┐
│ Client  │──────────────────────────────────►│ Server │
└─────────┘                                   └────────┘
     │                                             │
     │          PublicKeyCredentialRequestOptions │
     │◄────────────────────────────────────────────┘
     │
     ├── navigator.credentials.get()
     │   (Browser prompts for biometric)
     │
     │         POST /authentication/verify
     │         + PublicKeyCredential         ┌────────┐
     ├─────────────────────────────────────►│ Server │
     │                                       └────────┘
     │                                            │
     │                                            ├── Verify signature
     │                                            ├── Update counter
     │                                            ├── Create custom token
     │                                            ├── Delete challenge
     │                                            │
     │         Firebase custom token              │
     │◄───────────────────────────────────────────┘
     │
     ├── signInWithCustomToken(customToken)
     │
     └── Authenticated!
```

## Related Documentation

- [README.md](./README.md) - Overview and quick start
- [SPEC.md](./SPEC.md) - Detailed specification
