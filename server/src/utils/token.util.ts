import { randomBytes } from 'crypto';

/**
 * Token Utility
 *
 * Generates cryptographically secure random tokens for invitations
 * Security features:
 * - Uses Node's crypto.randomBytes for cryptographic security
 * - URL-safe base64 encoding
 * - Sufficient entropy (32 bytes = 256 bits of entropy)
 * - Tokens are unique and cannot be guessed
 */

/**
 * Generate a cryptographically secure random token
 *
 * @param length - Number of random bytes (default: 32)
 * @returns URL-safe base64 encoded token
 *
 * Example output: "x3kF9mL2pQ8vN7wR5tY1zH6jK4bM0cS8"
 */
export function generateSecureToken(length: number = 32): string {
  // Generate cryptographically secure random bytes
  const buffer = randomBytes(length);

  // Convert to URL-safe base64 (replace +/ with -_ and remove padding =)
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate an invitation token
 * Uses 32 bytes for high entropy (256 bits)
 */
export function generateInvitationToken(): string {
  return generateSecureToken(32);
}

/**
 * Calculate token expiration date
 *
 * @param days - Number of days until expiration (default: 7)
 * @returns Date object for expiration
 */
export function getTokenExpirationDate(days: number = 7): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
}

/**
 * Check if a token has expired
 *
 * @param expiresAt - Expiration date
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}
