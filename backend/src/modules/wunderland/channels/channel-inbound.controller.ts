/**
 * @file channel-inbound.controller.ts
 * @description Public webhook endpoints for inbound channel messages.
 *
 * Currently supported:
 * - Telegram bot webhooks -> `POST /api/wunderland/channels/inbound/telegram/:seedId`
 */

import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator.js';
import { DatabaseService } from '../../../database/database.service.js';
import { ChannelBridgeService } from './channel-bridge.service.js';
import { ChannelAutoReplyService } from './channel-auto-reply.service.js';

type TelegramUpdate = {
  update_id?: number;
  message?: any;
  edited_message?: any;
  channel_post?: any;
  edited_channel_post?: any;
};

type ParsedInboundMessage = {
  conversationId: string;
  conversationType: 'direct' | 'group' | 'channel' | 'thread';
  senderName: string;
  senderPlatformId: string;
  senderIsBot: boolean;
  text: string;
  messageId: string;
  replyToMessageId?: string;
  timestampIso: string;
};

function parseTelegramUpdate(update: TelegramUpdate): ParsedInboundMessage | null {
  const msg =
    update?.message ||
    update?.edited_message ||
    update?.channel_post ||
    update?.edited_channel_post;
  if (!msg) return null;

  const chat = msg.chat;
  const chatId = chat?.id;
  if (chatId === undefined || chatId === null) return null;

  const conversationId = String(chatId);
  const chatType = String(chat?.type ?? 'private').toLowerCase();
  const conversationType: ParsedInboundMessage['conversationType'] =
    chatType === 'channel'
      ? 'channel'
      : chatType === 'group' || chatType === 'supergroup'
        ? 'group'
        : 'direct';

  const text = String(msg.text ?? msg.caption ?? '').trim();
  if (!text) return null;

  const from = msg.from;
  const senderChat = msg.sender_chat;
  const senderIsBot = Boolean(from?.is_bot);
  const senderPlatformId = from?.id
    ? String(from.id)
    : senderChat?.id
      ? String(senderChat.id)
      : 'unknown';

  const senderName = (() => {
    if (from) {
      const uname = typeof from.username === 'string' ? from.username : '';
      const first = typeof from.first_name === 'string' ? from.first_name : '';
      const last = typeof from.last_name === 'string' ? from.last_name : '';
      const full = `${first} ${last}`.trim();
      return (uname && `@${uname}`) || full || senderPlatformId;
    }
    if (senderChat) {
      const title = typeof senderChat.title === 'string' ? senderChat.title : '';
      const uname = typeof senderChat.username === 'string' ? senderChat.username : '';
      return (uname && `@${uname}`) || title || senderPlatformId;
    }
    return senderPlatformId;
  })();

  const messageId = msg.message_id ? String(msg.message_id) : '';
  const replyToMessageId =
    msg.reply_to_message?.message_id !== undefined && msg.reply_to_message?.message_id !== null
      ? String(msg.reply_to_message.message_id)
      : undefined;
  const dateSec = typeof msg.date === 'number' ? msg.date : null;
  const timestampIso = new Date(
    dateSec && Number.isFinite(dateSec) ? dateSec * 1000 : Date.now()
  ).toISOString();

  return {
    conversationId,
    conversationType,
    senderName,
    senderPlatformId,
    senderIsBot,
    text,
    messageId,
    replyToMessageId,
    timestampIso,
  };
}

@Controller('wunderland/channels/inbound')
export class ChannelInboundController {
  constructor(
    private readonly db: DatabaseService,
    private readonly channelBridge: ChannelBridgeService,
    private readonly channelAutoReply: ChannelAutoReplyService
  ) {}

  private assertTelegramWebhookSecret(provided: string | undefined): void {
    const expected = (process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET || '').trim();
    if (!expected) return; // allow unauthenticated webhook in dev if secret isn't set
    if (!provided || provided !== expected) {
      throw new ForbiddenException('Forbidden.');
    }
  }

  /**
   * Telegram webhook receiver.
   *
   * Security:
   * - If `WUNDERLAND_TELEGRAM_WEBHOOK_SECRET` is set, require
   *   `X-Telegram-Bot-Api-Secret-Token` to match.
   */
  @Public()
  @Post('telegram/:seedId')
  @HttpCode(HttpStatus.OK)
  async telegramInbound(
    @Param('seedId') seedId: string,
    @Headers('x-telegram-bot-api-secret-token') secret: string | undefined,
    @Body() body: TelegramUpdate
  ): Promise<{ ok: true; ignored?: boolean; eventId?: string }> {
    this.assertTelegramWebhookSecret(secret);

    // Ignore edits to avoid duplicate/retroactive auto-replies.
    if (body?.edited_message || body?.edited_channel_post) {
      return { ok: true, ignored: true };
    }

    const binding = await this.db.get<{
      binding_id: string;
      owner_user_id: string;
      platform_config: string | null;
    }>(
      `SELECT binding_id, owner_user_id, platform_config FROM wunderland_channel_bindings
       WHERE seed_id = ? AND platform = 'telegram' AND is_active = 1
       LIMIT 1`,
      [seedId]
    );
    if (!binding) return { ok: true, ignored: true };

    const parsed = parseTelegramUpdate(body);
    if (!parsed) return { ok: true, ignored: true };
    if (parsed.senderIsBot) return { ok: true, ignored: true };

    const updateId = typeof body?.update_id === 'number' ? body.update_id : null;
    const eventId = updateId
      ? `telegram:${seedId}:${updateId}`
      : `telegram:${seedId}:${parsed.conversationId}:${parsed.messageId || Date.now()}`;

    const now = Date.now();
    // Idempotency: Telegram may retry deliveries; avoid duplicate session bumps and auto-replies.
    const dedupe = await this.db.run(
      `INSERT OR IGNORE INTO wunderland_channel_inbound_events
        (event_id, seed_id, platform, conversation_id, created_at)
       VALUES (?, ?, 'telegram', ?, ?)`,
      [eventId, seedId, parsed.conversationId, now]
    );
    if (Number(dedupe?.changes ?? 0) === 0) {
      return { ok: true, ignored: true, eventId };
    }

    // Best-effort pruning (keep 7 days of dedupe ids).
    const pruneBefore = now - 7 * 24 * 60 * 60 * 1000;
    void this.db
      .run(`DELETE FROM wunderland_channel_inbound_events WHERE created_at < ?`, [pruneBefore])
      .catch(() => undefined);

    await this.channelBridge.handleInboundMessage({
      seedId,
      platform: 'telegram',
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      text: parsed.text,
      messageId: parsed.messageId || `tg-${Date.now()}`,
      timestamp: parsed.timestampIso,
      isOwner: false,
    });

    let platformConfig: Record<string, unknown> = {};
    try {
      platformConfig = JSON.parse(String(binding.platform_config || '{}'));
    } catch {
      platformConfig = {};
    }

    this.channelAutoReply.queueTelegramAutoReply({
      seedId,
      ownerUserId: String(binding.owner_user_id),
      platformConfig,
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      senderIsBot: parsed.senderIsBot,
      text: parsed.text,
      messageId: parsed.messageId || String(updateId || ''),
      ...(parsed.replyToMessageId ? { replyToMessageId: parsed.replyToMessageId } : null),
    });

    return { ok: true, eventId };
  }
}
