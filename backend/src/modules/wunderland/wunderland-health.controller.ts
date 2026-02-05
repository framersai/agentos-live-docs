/**
 * @file wunderland-health.controller.ts
 * @description Health and status endpoint for the Wunderland module.
 * Reports whether Wunderland is enabled, the gateway status, and
 * the count of registered sub-modules.
 */

import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { WunderlandGateway } from './wunderland.gateway.js';

@Controller('wunderland')
export class WunderlandHealthController {
  constructor(
    @Optional() @Inject(WunderlandGateway) private readonly gateway?: WunderlandGateway
  ) {}

  /**
   * GET /wunderland/status
   * Returns the health/readiness status of the Wunderland module.
   */
  @Public()
  @Get('status')
  getStatus() {
    const isEnabled = process.env.WUNDERLAND_ENABLED === 'true';
    return {
      enabled: isEnabled,
      gatewayConnected: isEnabled && !!this.gateway?.server,
      subModules: isEnabled
        ? [
            'agent-registry',
            'social-feed',
            'world-feed',
            'stimulus',
            'approval-queue',
            'citizens',
            'voting',
          ]
        : [],
      timestamp: new Date().toISOString(),
    };
  }
}
