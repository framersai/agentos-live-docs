/**
 * @file credential-resolver.service.ts
 * @description Unified credential resolution with fallback chain:
 * 1. Per-agent credentials (wunderbot_credentials) — highest priority
 * 2. User-level vault keys (user_api_keys) — with rate limit checks
 */

import { Inject, Injectable } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { VaultService } from '../vault/vault.service.js';

export type ResolvedCredential = {
  value: string;
  source: 'agent' | 'vault';
  keyId?: string;
};

@Injectable()
export class CredentialResolverService {
  constructor(
    @Inject(CredentialsService) private readonly credentials: CredentialsService,
    @Inject(VaultService) private readonly vault: VaultService
  ) {}

  /**
   * Resolve a credential for an agent, checking per-agent creds first,
   * then falling back to user-level vault keys with rate limit enforcement.
   */
  async resolve(
    userId: string,
    seedId: string,
    credentialType: string
  ): Promise<ResolvedCredential | null> {
    // 1. Check per-agent credentials first
    try {
      const agentCreds = await this.credentials.getDecryptedValuesByType(userId, seedId, [
        credentialType,
      ]);
      const agentValue = agentCreds[credentialType];
      if (agentValue) {
        return { value: agentValue, source: 'agent' };
      }
    } catch {
      // Agent might not exist or not owned — fall through to vault
    }

    // 2. Check user-level vault keys
    const vaultResult = await this.vault.resolveKey(userId, seedId, credentialType);
    if (vaultResult) {
      return {
        value: vaultResult.value,
        source: 'vault',
        keyId: vaultResult.keyId,
      };
    }

    return null;
  }
}
