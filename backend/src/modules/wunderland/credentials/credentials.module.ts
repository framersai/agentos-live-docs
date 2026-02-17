/**
 * @file credentials.module.ts
 * @description Module for credential vault endpoints + unified credential resolver.
 */

import { Module, forwardRef } from '@nestjs/common';
import { CredentialsController } from './credentials.controller.js';
import { CredentialsService } from './credentials.service.js';
import { CredentialResolverService } from './credential-resolver.service.js';
import { VaultModule } from '../vault/vault.module.js';

@Module({
  imports: [forwardRef(() => VaultModule)],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialResolverService],
  exports: [CredentialsService, CredentialResolverService],
})
export class CredentialsModule {}
