import { describe, expect, it } from 'vitest';
import { encryptSecret, decryptSecret } from '../lib/crypto';

describe('crypto helpers', () => {
  it('round trips secret value', () => {
    const ciphertext = encryptSecret('super-secret');
    expect(ciphertext).not.toEqual('super-secret');
    const plaintext = decryptSecret(ciphertext);
    expect(plaintext).toEqual('super-secret');
  });
});
