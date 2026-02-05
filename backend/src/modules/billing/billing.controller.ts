/**
 * @file billing.controller.ts
 * @description NestJS controller for subscription billing endpoints. Delegates
 * to the existing Express route handlers via the passthrough pattern (@Req/@Res)
 * to maintain full API compatibility during the migration.
 *
 * Routes migrated:
 *   POST /billing/checkout            -> postCheckoutSession  (authenticated)
 *   GET  /billing/status/:checkoutId  -> getCheckoutStatus    (authenticated)
 *   POST /billing/webhook             -> postLemonWebhook     (public - webhook)
 */

import { Controller, Post, Get, Req, Res, Param, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import {
  postCheckoutSession,
  getCheckoutStatus,
  postLemonWebhook,
} from '../../features/billing/billing.routes.js';

/**
 * Handles all `/billing` prefixed routes for subscription management.
 *
 * Checkout and status endpoints require authentication via {@link AuthGuard}.
 * The webhook endpoint is public because it receives callbacks from the
 * payment provider (Lemon Squeezy).
 */
@Controller('billing')
export class BillingController {
  /**
   * POST /billing/checkout
   * Creates a new checkout session for the authenticated user. Requires a
   * valid subscription plan and configured billing provider.
   */
  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(@Req() req: Request, @Res() res: Response): Promise<void> {
    return postCheckoutSession(req, res);
  }

  /**
   * GET /billing/status/:checkoutId
   * Retrieves the status of a previously created checkout session. On
   * successful payment, returns a fresh auth token for the upgraded user.
   */
  @UseGuards(AuthGuard)
  @Get('status/:checkoutId')
  async getStatus(
    @Param('checkoutId') _checkoutId: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    return getCheckoutStatus(req, res);
  }

  /**
   * POST /billing/webhook
   * Receives and processes Lemon Squeezy webhook events (e.g. subscription
   * created/updated). Public endpoint -- signature verification is handled
   * within the route handler itself.
   */
  @Public()
  @Post('webhook')
  async webhook(@Req() req: Request, @Res() res: Response): Promise<void> {
    return postLemonWebhook(req, res);
  }
}
