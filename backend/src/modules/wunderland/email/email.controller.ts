import {
  Inject,
  Controller,
  Get,
  Post,
  Delete,
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
import { EmailIntegrationService } from './email.service.js';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

class EmailStatusQueryDto {
  @IsString()
  @MaxLength(128)
  seedId!: string;
}

class EmailSendTestDto {
  @IsString()
  @MaxLength(128)
  seedId!: string;

  @IsEmail()
  @MaxLength(320)
  to!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  from?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20_000)
  text?: string;
}

class EmailSendDto {
  @IsString()
  @MaxLength(128)
  seedId!: string;

  @IsEmail()
  @MaxLength(320)
  to!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  from?: string;

  @IsString()
  @MaxLength(160)
  subject!: string;

  @IsString()
  @MaxLength(80_000)
  text!: string;
}

@Controller('wunderland/email')
export class EmailIntegrationController {
  constructor(@Inject(EmailIntegrationService) private readonly email: EmailIntegrationService) {}

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

  @UseGuards(AuthGuard)
  @Get('status')
  async getStatus(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Query() query: EmailStatusQueryDto
  ) {
    this.assertPaidAccess(user);
    return this.email.getStatus(userId, query.seedId);
  }

  @UseGuards(AuthGuard)
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async test(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Body() body: EmailSendTestDto
  ) {
    this.assertPaidAccess(user);
    return this.email.sendTestEmail(userId, body);
  }

  @UseGuards(AuthGuard)
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Body() body: EmailSendDto
  ) {
    this.assertPaidAccess(user);
    return this.email.sendEmail(userId, body);
  }

  // ── Message history (sent / drafts) ────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Get('messages')
  async listMessages(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Query() query: { folder?: string; seedId?: string; limit?: string; offset?: string }
  ) {
    this.assertPaidAccess(user);
    return this.email.listMessages(userId, {
      folder: query.folder,
      seedId: query.seedId,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      offset: query.offset ? parseInt(query.offset, 10) : undefined,
    });
  }

  @UseGuards(AuthGuard)
  @Get('messages/:id')
  async getMessage(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('id') messageId: string
  ) {
    this.assertPaidAccess(user);
    const message = await this.email.getMessage(userId, messageId);
    if (!message) throw new ForbiddenException('Message not found.');
    return { message };
  }

  @UseGuards(AuthGuard)
  @Post('drafts')
  @HttpCode(HttpStatus.CREATED)
  async saveDraft(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      seedId: string;
      to?: string;
      from?: string;
      subject?: string;
      body?: string;
      draftId?: string;
    }
  ) {
    this.assertPaidAccess(user);
    if (!body.seedId) throw new ForbiddenException('seedId is required.');
    const draft = await this.email.saveDraft(userId, body);
    return { draft };
  }

  @UseGuards(AuthGuard)
  @Delete('messages/:id')
  async deleteMessage(
    @CurrentUser() user: any,
    @CurrentUser('id') userId: string,
    @Param('id') messageId: string
  ) {
    this.assertPaidAccess(user);
    const deleted = await this.email.deleteMessage(userId, messageId);
    if (!deleted) throw new ForbiddenException('Message not found.');
    return { ok: true };
  }
}
