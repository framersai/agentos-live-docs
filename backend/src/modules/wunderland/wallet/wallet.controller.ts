/**
 * @file wallet.controller.ts
 * @description REST API for agent wallet and card management.
 *
 * Routes:
 *   GET    /wunderland/wallet/:seedId               - Wallet overview
 *   GET    /wunderland/wallet/:seedId/transactions   - List transactions
 *   POST   /wunderland/wallet/:seedId/card           - Issue virtual card
 *   POST   /wunderland/wallet/:seedId/card/freeze    - Freeze card
 *   POST   /wunderland/wallet/:seedId/card/unfreeze  - Unfreeze card
 *   POST   /wunderland/wallet/:seedId/card/close     - Close card
 *   GET    /wunderland/wallet/:seedId/card/spending   - Card spending breakdown
 *   GET    /wunderland/wallet/:seedId/policy          - Get spending policy
 *   PATCH  /wunderland/wallet/:seedId/policy          - Update spending policy
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { WalletService } from './wallet.service.js';
import {
  IssueCardDto,
  UpdateSpendingPolicyDto,
  ListWalletTransactionsQueryDto,
} from '../dto/wallet.dto.js';

@Controller('wunderland/wallet')
export class WalletController {
  constructor(@Inject(WalletService) private readonly walletService: WalletService) {}

  private assertPaidAccess(user: any): void {
    const status = user?.subscriptionStatus ?? user?.subscription_status;
    const isPaid = status === 'active' || status === 'trialing' || user?.role === 'admin';
    if (!isPaid) {
      throw new ForbiddenException('Active paid subscription required for wallet management.');
    }
  }

  // ── Wallet overview ──

  @UseGuards(AuthGuard)
  @Get(':seedId')
  async getWalletState(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.getWalletState(userId, seedId);
  }

  // ── Transactions ──

  @UseGuards(AuthGuard)
  @Get(':seedId/transactions')
  async getTransactions(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Query() query: ListWalletTransactionsQueryDto
  ) {
    this.assertPaidAccess(user);
    return this.walletService.getTransactions(userId, seedId, query);
  }

  // ── Card operations ──

  @UseGuards(AuthGuard)
  @Post(':seedId/card')
  @HttpCode(HttpStatus.CREATED)
  async issueCard(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Body() body: IssueCardDto
  ) {
    this.assertPaidAccess(user);
    return this.walletService.issueCard(userId, seedId, body);
  }

  @UseGuards(AuthGuard)
  @Post(':seedId/card/freeze')
  @HttpCode(HttpStatus.OK)
  async freezeCard(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.freezeCard(userId, seedId);
  }

  @UseGuards(AuthGuard)
  @Post(':seedId/card/unfreeze')
  @HttpCode(HttpStatus.OK)
  async unfreezeCard(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.unfreezeCard(userId, seedId);
  }

  @UseGuards(AuthGuard)
  @Post(':seedId/card/close')
  @HttpCode(HttpStatus.OK)
  async closeCard(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.closeCard(userId, seedId);
  }

  @UseGuards(AuthGuard)
  @Get(':seedId/card/spending')
  async getCardSpending(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.getCardSpending(userId, seedId);
  }

  // ── Spending policy ──

  @UseGuards(AuthGuard)
  @Get(':seedId/policy')
  async getPolicy(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.walletService.getPolicy(userId, seedId);
  }

  @UseGuards(AuthGuard)
  @Patch(':seedId/policy')
  async updatePolicy(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Body() body: UpdateSpendingPolicyDto
  ) {
    this.assertPaidAccess(user);
    return this.walletService.updatePolicy(userId, seedId, body);
  }
}
