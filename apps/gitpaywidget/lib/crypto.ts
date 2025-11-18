import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const SECRET = process.env.KEY_ENCRYPTION_SECRET || 'insecure-key-change-me';
const KEY = scryptSync(SECRET, 'gitpaywidget', 32);

/**
 * Encrypt sensitive credentials (e.g., Stripe secret keys) using AES-256-GCM.
 *
 * @param value - Plaintext string to encrypt.
 * @returns Base64 string containing IV + auth tag + ciphertext.
 */
export function encryptSecret(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

/**
 * Decrypt a secret previously generated with {@link encryptSecret}.
 *
 * @param payload - Base64 string containing encrypted data.
 * @returns Decrypted plaintext string.
 */
export function decryptSecret(payload: string): string {
  const buffer = Buffer.from(payload, 'base64');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const data = buffer.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}
