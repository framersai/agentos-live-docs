import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from '../../lib/crypto';

describe('Crypto Integration', () => {
  beforeAll(() => {
    process.env.KEY_ENCRYPTION_SECRET = 'test-secret-key-for-unit-tests-only';
  });

  it('encrypts and decrypts text correctly', async () => {
    const plaintext = 'supersecret-api-key-12345';
    const encrypted = await encrypt(plaintext);

    expect(encrypted).not.toBe(plaintext);
    expect(encrypted).toContain(':'); // format: iv:ciphertext

    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('encrypts JSON objects', async () => {
    const secretObj = {
      apiKey: 'sk_test_123',
      webhookSecret: 'whsec_456',
    };
    const plaintext = JSON.stringify(secretObj);

    const encrypted = await encrypt(plaintext);
    const decrypted = await decrypt(encrypted);

    expect(JSON.parse(decrypted)).toEqual(secretObj);
  });

  it('produces different ciphertext for same plaintext (unique IV)', async () => {
    const plaintext = 'same-secret';
    const encrypted1 = await encrypt(plaintext);
    const encrypted2 = await encrypt(plaintext);

    expect(encrypted1).not.toBe(encrypted2);

    const decrypted1 = await decrypt(encrypted1);
    const decrypted2 = await decrypt(encrypted2);

    expect(decrypted1).toBe(plaintext);
    expect(decrypted2).toBe(plaintext);
  });

  it('throws on invalid ciphertext format', async () => {
    await expect(decrypt('invalid')).rejects.toThrow();
  });

  it('throws if KEY_ENCRYPTION_SECRET is missing', async () => {
    const original = process.env.KEY_ENCRYPTION_SECRET;
    delete process.env.KEY_ENCRYPTION_SECRET;

    await expect(encrypt('test')).rejects.toThrow(/KEY_ENCRYPTION_SECRET/);

    process.env.KEY_ENCRYPTION_SECRET = original;
  });
});
