/**
 * @file tunnel.module.ts
 * @description Ollama Tunnel module (Rabbit Hole). Provides endpoints for
 * tunnel token management, script download, and heartbeat registration.
 */

import { Module } from '@nestjs/common';
import { TunnelController } from './tunnel.controller.js';
import { TunnelService } from './tunnel.service.js';
import { VaultModule } from '../wunderland/vault/vault.module.js';

@Module({
  imports: [VaultModule],
  controllers: [TunnelController],
  providers: [TunnelService],
  exports: [TunnelService],
})
export class TunnelModule {}
