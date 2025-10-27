import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Passkey Service
 *
 * Handles WebAuthn passkey operations (registration and authentication)
 * Integrates with Firebase for session management
 */
export class PasskeyService {
  /**
   * Register a new passkey for the authenticated user
   *
   * @param token - Firebase ID token for authentication
   * @param deviceName - Optional friendly name for the passkey
   * @returns Newly created passkey info
   */
  static async registerPasskey(
    token: string,
    deviceName?: string
  ): Promise<{ id: number; name: string; deviceType: string; createdAt: Date }> {
    try {
      // Step 1: Get registration options from server
      const optionsResponse = await fetch(`${API_URL}/api/passkey/registration/options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Failed to get registration options');
      }

      const { data: options } = await optionsResponse.json();

      // Step 2: Prompt user with WebAuthn (browser handles biometric prompt)
      const credential = await startRegistration(options);

      // Step 3: Send credential to server for verification
      const verifyResponse = await fetch(`${API_URL}/api/passkey/registration/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          credential,
          deviceName,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Failed to verify registration');
      }

      const { data } = await verifyResponse.json();
      return data;
    } catch (error: any) {
      console.error('Passkey registration error:', error);

      // User-friendly error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Registration cancelled or not allowed');
      }
      if (error.name === 'InvalidStateError') {
        throw new Error('This device already has a passkey registered');
      }
      if (error.name === 'NotSupportedError') {
        throw new Error('Passkeys are not supported on this device');
      }

      throw error;
    }
  }

  /**
   * Authenticate with a passkey (sign in)
   *
   * @returns Firebase user credential
   */
  static async authenticateWithPasskey(): Promise<any> {
    try {
      // Step 1: Get authentication options from server (public endpoint)
      const optionsResponse = await fetch(`${API_URL}/api/passkey/authentication/options`);

      if (!optionsResponse.ok) {
        const error = await optionsResponse.json();
        throw new Error(error.error || 'Failed to get authentication options');
      }

      const { data: options } = await optionsResponse.json();

      // Step 2: Prompt user with WebAuthn (browser handles biometric prompt)
      const credential = await startAuthentication(options);

      // Step 3: Send credential to server for verification
      const verifyResponse = await fetch(`${API_URL}/api/passkey/authentication/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Failed to verify authentication');
      }

      const { data } = await verifyResponse.json();

      // Step 4: Sign into Firebase with custom token
      const userCredential = await signInWithCustomToken(auth, data.customToken);

      return userCredential;
    } catch (error: any) {
      console.error('Passkey authentication error:', error);

      // User-friendly error messages
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
  }

  /**
   * List all passkeys for the authenticated user
   *
   * @param token - Firebase ID token
   * @returns Array of user's passkeys
   */
  static async listPasskeys(token: string): Promise<
    Array<{
      id: number;
      name: string;
      deviceType: string;
      createdAt: Date;
      lastUsedAt: Date | null;
    }>
  > {
    try {
      const response = await fetch(`${API_URL}/api/passkey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to list passkeys');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('List passkeys error:', error);
      throw error;
    }
  }

  /**
   * Delete a passkey
   *
   * @param token - Firebase ID token
   * @param passkeyId - ID of the passkey to delete
   */
  static async deletePasskey(token: string, passkeyId: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/passkey/${passkeyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete passkey');
      }
    } catch (error) {
      console.error('Delete passkey error:', error);
      throw error;
    }
  }

  /**
   * Check if passkeys are supported on this device/browser
   *
   * @returns true if passkeys are supported
   */
  static isSupported(): boolean {
    return (
      window?.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === 'function'
    );
  }

  /**
   * Check if platform authenticator is available (Touch ID, Face ID, Windows Hello)
   *
   * @returns Promise<boolean>
   */
  static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    try {
      if (!this.isSupported()) {
        return false;
      }

      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error('Platform authenticator check error:', error);
      return false;
    }
  }
}
