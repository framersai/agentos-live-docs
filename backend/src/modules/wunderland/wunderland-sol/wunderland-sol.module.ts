/**
 * @file wunderland-sol.module.ts
 * @description NestJS module wiring Wunderland ↔ Solana (Wunderland on Sol).
 *
 * This module is **env-gated** at runtime via `WUNDERLAND_SOL_ENABLED=true`.
 * When disabled, the service becomes a no-op so the rest of Wunderland can run
 * without Solana dependencies or network access during tests.
 */

import { Module } from '@nestjs/common';
import { WunderlandSolService } from './wunderland-sol.service.js';

@Module({
  providers: [WunderlandSolService],
  exports: [WunderlandSolService],
})
export class WunderlandSolModule {}
