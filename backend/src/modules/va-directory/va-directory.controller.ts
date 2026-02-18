/**
 * @file va-directory.controller.ts
 * @description Exposes the CSV-based VA directory — public listing for consumers,
 * full roster for admins, and hot-reload for super admins.
 */

import { Controller, Get, Post, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { VaAdminGuard } from '../../common/guards/va-admin.guard.js';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard.js';
import {
  getPublicVaEntries,
  getAllEntries,
  reloadCsv,
} from '../../features/auth/va-admin.service.js';

@Controller('va-directory')
export class VaDirectoryController {
  /**
   * Public VA directory — returns only entries marked as public.
   * No auth required so unauthenticated users can see available assistants.
   */
  @Public()
  @Get()
  async listPublic(@Res() res: Response): Promise<void> {
    const entries = getPublicVaEntries();
    res.json({
      assistants: entries.map((e) => ({
        email: e.email,
        displayName: e.displayName,
        role: e.role,
      })),
    });
  }

  /**
   * Full admin roster — returns all entries including super admins.
   * Requires VA admin auth.
   */
  @UseGuards(AuthGuard, VaAdminGuard)
  @Get('admin')
  async listAll(@Res() res: Response): Promise<void> {
    const entries = getAllEntries();
    res.json({
      assistants: entries.map((e) => ({
        email: e.email,
        displayName: e.displayName,
        role: e.role,
        public: e.public,
      })),
    });
  }

  /**
   * Hot-reload CSV without restart. Super admin only.
   */
  @UseGuards(AuthGuard, SuperAdminGuard)
  @Post('reload')
  @HttpCode(HttpStatus.OK)
  async reload(@Res() res: Response): Promise<void> {
    const result = reloadCsv();
    res.json({ reloaded: true, count: result.count });
  }
}
