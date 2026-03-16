/**
 * @file moderation.controller.ts
 * @description REST endpoints for content moderation — flagging, voting,
 * emoji reactions, and review queue.
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../../common/guards/auth.guard.js';
import { ModerationService } from './moderation.service.js';

@Controller()
@UseGuards(AuthGuard)
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  // ---------------------------------------------------------------------------
  // Content Flags
  // ---------------------------------------------------------------------------

  /**
   * POST /wunderland/content/:entityType/:entityId/flag
   * Flag content for review.
   */
  @Post('wunderland/content/:entityType/:entityId/flag')
  async flagContent(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { authorSeedId: string; reason: string; severity?: string }
  ) {
    if (!body.authorSeedId || !body.reason) {
      throw new HttpException('authorSeedId and reason are required', HttpStatus.BAD_REQUEST);
    }
    return this.moderation.flagContent({
      entityType,
      entityId,
      authorSeedId: body.authorSeedId,
      reason: body.reason,
      severity: body.severity ?? 'medium',
    });
  }

  /**
   * GET /wunderland/content/:entityType/:entityId/flags
   * Get all flags for a piece of content.
   */
  @Get('wunderland/content/:entityType/:entityId/flags')
  async getFlags(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    const flags = await this.moderation.getFlags(entityType, entityId);
    return { flags };
  }

  /**
   * GET /wunderland/moderation/queue
   * Get pending (unresolved) flags for review.
   */
  @Get('wunderland/moderation/queue')
  async getReviewQueue(@Query('limit') limit?: string) {
    const flags = await this.moderation.getPendingFlags(
      limit ? Math.min(200, Math.max(1, parseInt(limit, 10) || 50)) : 50
    );
    return { flags, count: (flags as any[]).length };
  }

  /**
   * POST /wunderland/moderation/:flagId/resolve
   * Resolve a flag (mark as reviewed).
   */
  @Post('wunderland/moderation/:flagId/resolve')
  async resolveFlag(@Param('flagId') flagId: string, @Body() body: { resolvedBy: string }) {
    if (!body.resolvedBy) {
      throw new HttpException('resolvedBy is required', HttpStatus.BAD_REQUEST);
    }
    const result = await this.moderation.resolveFlag(flagId, body.resolvedBy);
    if (!result.updated) {
      throw new HttpException('Flag not found or already resolved', HttpStatus.NOT_FOUND);
    }
    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Content Votes
  // ---------------------------------------------------------------------------

  /**
   * POST /wunderland/content/:entityType/:entityId/vote
   * Upvote or downvote content.
   */
  @Post('wunderland/content/:entityType/:entityId/vote')
  async vote(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { voterSeedId: string; direction: number }
  ) {
    if (!body.voterSeedId || (body.direction !== 1 && body.direction !== -1)) {
      throw new HttpException(
        'voterSeedId and direction (1 or -1) are required',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.moderation.vote({
      entityType,
      entityId,
      voterSeedId: body.voterSeedId,
      direction: body.direction,
    });
  }

  /**
   * GET /wunderland/content/:entityType/:entityId/votes
   * Get vote totals for content.
   */
  @Get('wunderland/content/:entityType/:entityId/votes')
  async getVotes(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.moderation.getVotes(entityType, entityId);
  }

  // ---------------------------------------------------------------------------
  // Emoji Reactions
  // ---------------------------------------------------------------------------

  /**
   * POST /wunderland/content/:entityType/:entityId/reactions
   * Add an emoji reaction.
   */
  @Post('wunderland/content/:entityType/:entityId/reactions')
  async addReaction(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { reactorSeedId: string; emoji: string }
  ) {
    if (!body.reactorSeedId || !body.emoji) {
      throw new HttpException('reactorSeedId and emoji are required', HttpStatus.BAD_REQUEST);
    }
    return this.moderation.addReaction({
      entityType,
      entityId,
      reactorSeedId: body.reactorSeedId,
      emoji: body.emoji,
    });
  }

  /**
   * DELETE /wunderland/content/:entityType/:entityId/reactions
   * Remove an emoji reaction.
   */
  @Delete('wunderland/content/:entityType/:entityId/reactions')
  async removeReaction(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { reactorSeedId: string; emoji: string }
  ) {
    if (!body.reactorSeedId || !body.emoji) {
      throw new HttpException('reactorSeedId and emoji are required', HttpStatus.BAD_REQUEST);
    }
    return this.moderation.removeReaction({
      entityType,
      entityId,
      reactorSeedId: body.reactorSeedId,
      emoji: body.emoji,
    });
  }

  /**
   * GET /wunderland/content/:entityType/:entityId/reactions
   * Get all emoji reactions for content (grouped by emoji with counts).
   */
  @Get('wunderland/content/:entityType/:entityId/reactions')
  async getReactions(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.moderation.getReactions(entityType, entityId);
  }
}
