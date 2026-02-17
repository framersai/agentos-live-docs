/**
 * @file vault.module.ts
 * @description Module for user-level API key vault endpoints.
 */

import { Module } from '@nestjs/common';
import { VaultController } from './vault.controller.js';
import { VaultService } from './vault.service.js';

@Module({
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
