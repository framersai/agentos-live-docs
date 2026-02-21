/**
 * @file vault.controller.ts
 * @description API endpoints for user-level API key vault management.
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { VaultService } from './vault.service.js';
import {
  CreateVaultKeyDto,
  UpdateVaultKeyDto,
  RotateVaultKeyDto,
  BulkCreateVaultKeysDto,
  BulkSetAssignmentsDto,
} from '../dto/vault.dto.js';

@Controller('wunderland/vault')
export class VaultController {
  constructor(@Inject(VaultService) private readonly vaultService: VaultService) {}

  private assertPaidAccess(user: any): void {
    const status =
      (typeof user?.subscriptionStatus === 'string' && user.subscriptionStatus) ||
      (typeof user?.subscription_status === 'string' && user.subscription_status) ||
      '';
    const tier = typeof user?.tier === 'string' ? user.tier : '';
    const mode = typeof user?.mode === 'string' ? user.mode : '';
    const isPaid =
      mode === 'global' ||
      tier === 'unlimited' ||
      status === 'active' ||
      status === 'trialing' ||
      status === 'unlimited';
    if (!isPaid) {
      throw new ForbiddenException('Active paid subscription required.');
    }
  }

  /* ── Key CRUD ────────────────────────────────────────────────────────────── */

  @UseGuards(AuthGuard)
  @Get('keys')
  async listKeys(@CurrentUser() user: any, @CurrentUser('id') userId: string) {
    this.assertPaidAccess(user);
    return this.vaultService.listKeys(userId);
  }

  @UseGuards(AuthGuard)
  @Post('keys')
  @HttpCode(HttpStatus.CREATED)
  async createKey(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Body() body: CreateVaultKeyDto
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.createKey(userId, body);
  }

  @UseGuards(AuthGuard)
  @Post('keys/bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Body() body: BulkCreateVaultKeysDto
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.bulkCreate(userId, body.keys);
  }

  @UseGuards(AuthGuard)
  @Patch('keys/:keyId')
  async updateKey(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('keyId') keyId: string,
    @Body() body: UpdateVaultKeyDto
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.updateKey(userId, keyId, body);
  }

  @UseGuards(AuthGuard)
  @Post('keys/:keyId/rotate')
  async rotateKey(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('keyId') keyId: string,
    @Body() body: RotateVaultKeyDto
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.rotateKey(userId, keyId, body);
  }

  @UseGuards(AuthGuard)
  @Delete('keys/:keyId')
  async deleteKey(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('keyId') keyId: string
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.deleteKey(userId, keyId);
  }

  /* ── Agent assignments ──────────────────────────────────────────────────── */

  @UseGuards(AuthGuard)
  @Get('assignments/:seedId')
  async getAssignments(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.getAssignments(userId, seedId);
  }

  @UseGuards(AuthGuard)
  @Put('assignments/:seedId')
  async bulkSetAssignments(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Body() body: BulkSetAssignmentsDto
  ) {
    this.assertPaidAccess(user);
    return this.vaultService.bulkSetAssignments(userId, seedId, body.assignments);
  }
}
