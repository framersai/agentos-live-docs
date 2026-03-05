/**
 * @file media-library.controller.ts
 * @description API endpoints for agent media asset management.
 */

import {
  Inject,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import { MediaLibraryService } from './media-library.service.js';

@Controller('wunderland/media')
export class MediaLibraryController {
  constructor(
    @Inject(MediaLibraryService) private readonly mediaService: MediaLibraryService,
  ) {}

  /* -------------------------------------------------------------- */
  /*  Access guard (same pattern as CredentialsController)            */
  /* -------------------------------------------------------------- */

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

  /* -------------------------------------------------------------- */
  /*  Upload                                                         */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('seedId') seedId: string,
    @Body('tags') tags?: string,
  ) {
    this.assertPaidAccess(user);

    return this.mediaService.upload({
      seedId,
      ownerUserId: userId,
      file: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      tags: tags ? JSON.parse(tags) : [],
    });
  }

  /* -------------------------------------------------------------- */
  /*  List                                                           */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Get()
  async list(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Query('seedId') seedId?: string,
    @Query('tags') tags?: string,
    @Query('mimeType') mimeType?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    this.assertPaidAccess(user);

    return this.mediaService.listAssets(
      userId,
      seedId,
      tags ? tags.split(',') : undefined,
      mimeType,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  /* -------------------------------------------------------------- */
  /*  Get single asset                                               */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Get(':id')
  async getAsset(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.assertPaidAccess(user);

    const asset = await this.mediaService.getAsset(id);
    if (!asset) throw new NotFoundException(`Media asset "${id}" not found.`);
    return asset;
  }

  /* -------------------------------------------------------------- */
  /*  Download / stream file                                         */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Get(':id/file')
  async getAssetFile(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    this.assertPaidAccess(user);

    const result = await this.mediaService.getAssetFile(id, userId);
    if (!result) throw new NotFoundException(`Media asset file "${id}" not found.`);

    res.set({
      'Content-Type': result.mimeType,
      'Content-Disposition': `inline; filename="${result.filename}"`,
      'Content-Length': result.buffer.length,
    });
    res.send(result.buffer);
  }

  /* -------------------------------------------------------------- */
  /*  Delete                                                         */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteAsset(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    this.assertPaidAccess(user);

    const deleted = await this.mediaService.deleteAsset(id, userId);
    if (!deleted) throw new NotFoundException(`Media asset "${id}" not found.`);
    return { id, deleted: true };
  }

  /* -------------------------------------------------------------- */
  /*  Update tags                                                    */
  /* -------------------------------------------------------------- */

  @UseGuards(AuthGuard)
  @Post(':id/tags')
  async tagAsset(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('tags') tags: string[],
  ) {
    this.assertPaidAccess(user);

    const updated = await this.mediaService.tagAsset(id, userId, tags);
    if (!updated) throw new NotFoundException(`Media asset "${id}" not found.`);
    return updated;
  }
}
