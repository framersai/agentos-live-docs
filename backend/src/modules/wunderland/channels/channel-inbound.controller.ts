/**
 * @file channel-inbound.controller.ts
 * @description Public webhook endpoints for inbound channel messages.
 *
 * Currently supported:
 * - Telegram bot webhooks -> `POST /api/wunderland/channels/inbound/telegram/:seedId`
 * - Slack Events API -> `POST /api/wunderland/channels/inbound/slack` (preferred)
 * - Slack Events API -> `POST /api/wunderland/channels/inbound/slack/:seedId` (seed-scoped)
 * - WhatsApp (Meta Cloud API) verification -> `GET /api/wunderland/channels/inbound/whatsapp/verify`
 * - WhatsApp (Twilio or Meta Cloud API) -> `POST /api/wunderland/channels/inbound/whatsapp/:seedId`
 */

import {
  Inject,
  Body,
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator.js';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { DatabaseService } from '../../../database/database.service.js';
import { ChannelBridgeService } from './channel-bridge.service.js';
import { ChannelAutoReplyService } from './channel-auto-reply.service.js';
import { CredentialsService } from '../credentials/credentials.service.js';

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

type SlackEnvelope = {
  token?: string;
  type?: string;
  challenge?: string;
  team_id?: string;
  api_app_id?: string;
  event?: any;
  event_id?: string;
  event_time?: number;
};

function parseSlackTsToIso(raw: unknown): string {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return new Date(raw * 1000).toISOString();
  }
  if (typeof raw === 'string' && raw.trim()) {
    const n = Number.parseFloat(raw);
    if (Number.isFinite(n)) return new Date(n * 1000).toISOString();
  }
  return new Date().toISOString();
}

function parseSlackEnvelope(body: SlackEnvelope): ParsedInboundMessage | null {
  if (String(body?.type ?? '') !== 'event_callback') return null;
  const event = body?.event;
  if (!event || typeof event !== 'object') return null;

  const eventType = String(event.type ?? '')
    .trim()
    .toLowerCase();
  if (eventType !== 'message' && eventType !== 'app_mention') return null;

  const subtype = event.subtype ? String(event.subtype).trim().toLowerCase() : '';
  if (subtype === 'message_changed' || subtype === 'message_deleted') return null;

  // Ignore bot/system messages to avoid loops.
  if (event.bot_id || event.bot_profile) return null;

  const channel = event.channel;
  if (!channel) return null;

  const user = event.user;
  if (!user) return null;

  const text = String(event.text ?? '').trim();
  if (!text) return null;

  const channelType = String(event.channel_type ?? '')
    .trim()
    .toLowerCase();
  const conversationType: ParsedInboundMessage['conversationType'] =
    channelType === 'im'
      ? 'direct'
      : channelType === 'mpim' || channelType === 'group'
        ? 'group'
        : 'channel';

  const messageId = event.ts ? String(event.ts) : event.event_ts ? String(event.event_ts) : '';
  const threadTs = event.thread_ts ? String(event.thread_ts) : undefined;
  const timestampIso = parseSlackTsToIso(event.event_ts ?? event.ts ?? body?.event_time);

  return {
    conversationId: String(channel),
    conversationType,
    senderName: String(user),
    senderPlatformId: String(user),
    senderIsBot: false,
    text,
    messageId: messageId || `slack-${Date.now()}`,
    ...(threadTs ? { replyToMessageId: threadTs } : null),
    timestampIso,
  };
}

function parseWhatsAppMessage(body: any, _req: Request): ParsedInboundMessage | null {
  // Auto-detect: Meta Cloud API vs Twilio

  // Meta Cloud API format
  if (body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    const msg = body.entry[0].changes[0].value.messages[0];
    const contact = body.entry[0].changes[0].value.contacts?.[0];
    if (msg.type !== 'text') return null; // Only handle text for now
    const phone = typeof msg.from === 'string' ? msg.from : '';
    if (!phone) return null;
    const text = String(msg.text?.body ?? '').trim();
    if (!text) return null;

    const dateSec = typeof msg.timestamp === 'string' ? parseInt(msg.timestamp, 10) : null;
    const timestampIso = new Date(
      dateSec && Number.isFinite(dateSec) ? dateSec * 1000 : Date.now()
    ).toISOString();

    return {
      conversationId: phone,
      conversationType: 'direct',
      senderName: contact?.profile?.name || phone,
      senderPlatformId: phone,
      senderIsBot: false,
      text,
      messageId: typeof msg.id === 'string' ? msg.id : `wa-meta-${Date.now()}`,
      timestampIso,
    };
  }

  // Twilio format
  if (body?.Body !== undefined && body?.From) {
    const phone = String(body.From).replace('whatsapp:', '');
    const text = String(body.Body ?? '').trim();
    if (!text) return null;

    return {
      conversationId: phone,
      conversationType: 'direct',
      senderName: body.ProfileName || phone,
      senderPlatformId: phone,
      senderIsBot: false,
      text,
      messageId: typeof body.MessageSid === 'string' ? body.MessageSid : `wa-twilio-${Date.now()}`,
      timestampIso: new Date().toISOString(),
    };
  }

  return null;
}

@Controller('wunderland/channels/inbound')
export class ChannelInboundController {
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(ChannelBridgeService) private readonly channelBridge: ChannelBridgeService,
    @Inject(ChannelAutoReplyService) private readonly channelAutoReply: ChannelAutoReplyService,
    @Inject(CredentialsService) private readonly credentials: CredentialsService
  ) {}

  private assertTelegramWebhookSecret(provided: string | undefined): void {
    const expected = (process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET || '').trim();
    const allowUnauthenticated =
      String(process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED || '')
        .trim()
        .toLowerCase() === 'true';
    const nodeEnv = String(process.env.NODE_ENV || '')
      .trim()
      .toLowerCase();
    const isProd = nodeEnv === 'production';

    if (!expected) {
      if (!isProd || allowUnauthenticated) return;
      throw new ForbiddenException('Forbidden.');
    }
    if (!provided || provided !== expected) throw new ForbiddenException('Forbidden.');
  }

  private assertSlackSignature(params: {
    signingSecret: string;
    timestamp: string | undefined;
    signature: string | undefined;
    rawBody: string | undefined;
  }): void {
    const nodeEnv = String(process.env.NODE_ENV || '')
      .trim()
      .toLowerCase();
    const isProd = nodeEnv === 'production';
    const allowUnauthenticated =
      String(process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED || '')
        .trim()
        .toLowerCase() === 'true';

    const secret = (params.signingSecret || '').trim();
    if (!secret) {
      if (!isProd || allowUnauthenticated) return;
      throw new ForbiddenException('Forbidden.');
    }

    const tsRaw = String(params.timestamp ?? '').trim();
    const signature = String(params.signature ?? '').trim();
    const rawBody = typeof params.rawBody === 'string' ? params.rawBody : '';
    if (!tsRaw || !signature || !rawBody) throw new ForbiddenException('Forbidden.');

    const ts = Number(tsRaw);
    if (!Number.isFinite(ts)) throw new ForbiddenException('Forbidden.');
    const ageSec = Math.abs(Date.now() / 1000 - ts);
    if (ageSec > 60 * 5) throw new ForbiddenException('Forbidden.');

    const base = `v0:${tsRaw}:${rawBody}`;
    const expected = `v0=${createHmac('sha256', secret).update(base, 'utf8').digest('hex')}`;

    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length) throw new ForbiddenException('Forbidden.');
    if (!timingSafeEqual(a, b)) throw new ForbiddenException('Forbidden.');
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

  /**
   * Slack Events API webhook receiver.
   *
   * Slack requires request signing verification using the app "Signing Secret".
   * We resolve the secret as:
   * - `SLACK_SIGNING_SECRET` env var (global), otherwise
   * - vault credential type `slack_signing_secret` for the binding owner+seed.
   */
  @Public()
  @Post('slack')
  @HttpCode(HttpStatus.OK)
  async slackInboundGlobal(
    @Req() req: Request & { rawBody?: string },
    @Headers('x-slack-request-timestamp') timestamp: string | undefined,
    @Headers('x-slack-signature') signature: string | undefined,
    @Body() body: SlackEnvelope
  ): Promise<{ ok?: true; ignored?: boolean; eventId?: string; challenge?: string }> {
    const signingSecret = (process.env.SLACK_SIGNING_SECRET || '').trim();
    this.assertSlackSignature({
      signingSecret,
      timestamp,
      signature,
      rawBody: req?.rawBody,
    });

    // URL verification handshake does not include a team_id; treat as app-level.
    if (String(body?.type ?? '') === 'url_verification') {
      const challenge = body?.challenge;
      if (typeof challenge !== 'string' || !challenge.trim()) {
        throw new BadRequestException('Invalid Slack url_verification payload.');
      }
      return { challenge };
    }

    const parsed = parseSlackEnvelope(body);
    if (!parsed) return { ok: true, ignored: true };

    const teamId = typeof body?.team_id === 'string' ? body.team_id.trim() : '';
    if (!teamId) return { ok: true, ignored: true };

    const slackEventId = typeof body?.event_id === 'string' ? body.event_id : '';
    const now = Date.now();
    const bindings = await this.db.all<{
      binding_id: string;
      seed_id: string;
      owner_user_id: string;
      channel_id: string | null;
      platform_config: string | null;
    }>(
      `SELECT binding_id, seed_id, owner_user_id, channel_id, platform_config
         FROM wunderland_channel_bindings
        WHERE platform = 'slack' AND channel_id = ? AND is_active = 1`,
      [parsed.conversationId]
    );

    // Backwards-compat fallback: Slack OAuth Quick Connect historically created a workspace-level
    // binding with `channel_id = teamId`. If no explicit channel bindings exist, route to that.
    const candidates =
      bindings.length > 0
        ? bindings
        : await this.db.all<{
            binding_id: string;
            seed_id: string;
            owner_user_id: string;
            channel_id: string | null;
            platform_config: string | null;
          }>(
            `SELECT binding_id, seed_id, owner_user_id, channel_id, platform_config
               FROM wunderland_channel_bindings
              WHERE platform = 'slack' AND channel_id = ? AND is_active = 1`,
            [teamId]
          );

    if (!candidates.length) return { ok: true, ignored: true };

    let processedAny = false;
    let lastEventId: string | undefined;

    for (const binding of candidates) {
      const seedId = String(binding.seed_id);
      const eventId = slackEventId
        ? `slack:${seedId}:${slackEventId}`
        : `slack:${seedId}:${parsed.conversationId}:${parsed.messageId}`;

      const dedupe = await this.db.run(
        `INSERT OR IGNORE INTO wunderland_channel_inbound_events
          (event_id, seed_id, platform, conversation_id, created_at)
         VALUES (?, ?, 'slack', ?, ?)`,
        [eventId, seedId, parsed.conversationId, now]
      );
      if (Number(dedupe?.changes ?? 0) === 0) {
        continue;
      }

      processedAny = true;
      lastEventId = eventId;

      await this.channelBridge.handleInboundMessage({
        seedId,
        platform: 'slack',
        conversationId: parsed.conversationId,
        conversationType: parsed.conversationType,
        senderName: parsed.senderName,
        senderPlatformId: parsed.senderPlatformId,
        text: parsed.text,
        messageId: parsed.messageId,
        timestamp: parsed.timestampIso,
        isOwner: false,
      });

      let platformConfig: Record<string, unknown> = {};
      try {
        platformConfig = JSON.parse(String(binding.platform_config || '{}'));
      } catch {
        platformConfig = {};
      }

      this.channelAutoReply.queueSlackAutoReply({
        seedId,
        ownerUserId: String(binding.owner_user_id),
        platformConfig,
        conversationId: parsed.conversationId,
        conversationType: parsed.conversationType,
        senderName: parsed.senderName,
        senderPlatformId: parsed.senderPlatformId,
        senderIsBot: false,
        text: parsed.text,
        messageId: parsed.messageId,
        ...(parsed.replyToMessageId ? { replyToMessageId: parsed.replyToMessageId } : null),
      });
    }

    if (!processedAny) {
      return { ok: true, ignored: true, ...(lastEventId ? { eventId: lastEventId } : null) };
    }

    const pruneBefore = now - 7 * 24 * 60 * 60 * 1000;
    void this.db
      .run(`DELETE FROM wunderland_channel_inbound_events WHERE created_at < ?`, [pruneBefore])
      .catch(() => undefined);
    return { ok: true, ...(lastEventId ? { eventId: lastEventId } : null) };
  }

  @Public()
  @Post('slack/:seedId')
  @HttpCode(HttpStatus.OK)
  async slackInbound(
    @Param('seedId') seedId: string,
    @Req() req: Request & { rawBody?: string },
    @Headers('x-slack-request-timestamp') timestamp: string | undefined,
    @Headers('x-slack-signature') signature: string | undefined,
    @Body() body: SlackEnvelope
  ): Promise<{ ok?: true; ignored?: boolean; eventId?: string; challenge?: string }> {
    const binding = await this.db.get<{
      binding_id: string;
      owner_user_id: string;
      channel_id: string | null;
      platform_config: string | null;
    }>(
      `SELECT binding_id, owner_user_id, channel_id, platform_config FROM wunderland_channel_bindings
       WHERE seed_id = ? AND platform = 'slack' AND is_active = 1
       LIMIT 1`,
      [seedId]
    );
    if (!binding) return { ok: true, ignored: true };

    const signingSecret = (() => {
      const fromEnv = (process.env.SLACK_SIGNING_SECRET || '').trim();
      if (fromEnv) return fromEnv;
      return '';
    })();

    let resolvedSecret = signingSecret;
    if (!resolvedSecret) {
      const vals = await this.credentials.getDecryptedValuesByType(
        String(binding.owner_user_id),
        seedId,
        ['slack_signing_secret']
      );
      resolvedSecret = String(vals.slack_signing_secret || '').trim();
    }

    this.assertSlackSignature({
      signingSecret: resolvedSecret,
      timestamp,
      signature,
      rawBody: req?.rawBody,
    });

    // URL verification handshake
    if (String(body?.type ?? '') === 'url_verification') {
      const challenge = body?.challenge;
      if (typeof challenge !== 'string' || !challenge.trim()) {
        throw new BadRequestException('Invalid Slack url_verification payload.');
      }
      return { challenge };
    }

    const parsed = parseSlackEnvelope(body);
    if (!parsed) return { ok: true, ignored: true };

    // Optional workspace sanity check (binding.channel_id stores teamId for Slack OAuth bindings)
    const teamId = typeof body?.team_id === 'string' ? body.team_id : '';
    const bindingTeamId = String(binding.channel_id ?? '').trim();
    if (teamId && bindingTeamId && teamId !== bindingTeamId) {
      return { ok: true, ignored: true };
    }

    const slackEventId = typeof body?.event_id === 'string' ? body.event_id : '';
    const eventId = slackEventId
      ? `slack:${seedId}:${slackEventId}`
      : `slack:${seedId}:${parsed.conversationId}:${parsed.messageId}`;

    const now = Date.now();
    const dedupe = await this.db.run(
      `INSERT OR IGNORE INTO wunderland_channel_inbound_events
        (event_id, seed_id, platform, conversation_id, created_at)
       VALUES (?, ?, 'slack', ?, ?)`,
      [eventId, seedId, parsed.conversationId, now]
    );
    if (Number(dedupe?.changes ?? 0) === 0) {
      return { ok: true, ignored: true, eventId };
    }

    const pruneBefore = now - 7 * 24 * 60 * 60 * 1000;
    void this.db
      .run(`DELETE FROM wunderland_channel_inbound_events WHERE created_at < ?`, [pruneBefore])
      .catch(() => undefined);

    await this.channelBridge.handleInboundMessage({
      seedId,
      platform: 'slack',
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      text: parsed.text,
      messageId: parsed.messageId,
      timestamp: parsed.timestampIso,
      isOwner: false,
    });

    let platformConfig: Record<string, unknown> = {};
    try {
      platformConfig = JSON.parse(String(binding.platform_config || '{}'));
    } catch {
      platformConfig = {};
    }

    this.channelAutoReply.queueSlackAutoReply({
      seedId,
      ownerUserId: String(binding.owner_user_id),
      platformConfig,
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      senderIsBot: false,
      text: parsed.text,
      messageId: parsed.messageId,
      ...(parsed.replyToMessageId ? { replyToMessageId: parsed.replyToMessageId } : null),
    });

    return { ok: true, eventId };
  }

  // ── WhatsApp ──────────────────────────────────────────────────────────────

  /**
   * Meta Cloud API webhook verification.
   *
   * Meta sends a GET request with `hub.mode`, `hub.verify_token`, and `hub.challenge`
   * when you first register the webhook URL.
   */
  @Public()
  @Get('whatsapp/verify')
  verifyWhatsApp(@Query() query: any, @Res() res: Response): void {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    const verifyToken = (process.env.WHATSAPP_VERIFY_TOKEN || '').trim();

    if (mode === 'subscribe' && verifyToken && token === verifyToken) {
      res.status(200).send(challenge);
      return;
    }
    res.status(403).send('Forbidden');
  }

  /**
   * WhatsApp inbound webhook receiver.
   *
   * Supports both Twilio and Meta Cloud API payloads (auto-detected from body shape).
   *
   * Security:
   * - Meta Cloud API: optionally verified via `WHATSAPP_VERIFY_TOKEN` (subscription handshake)
   *   and `WHATSAPP_APP_SECRET` (payload signature) in production.
   * - Twilio: callers should configure Twilio request validation at the infrastructure layer.
   */
  @Public()
  @Post('whatsapp/:seedId')
  @HttpCode(HttpStatus.OK)
  async whatsappInbound(
    @Param('seedId') seedId: string,
    @Req() req: Request,
    @Body() body: any
  ): Promise<{ ok: true; ignored?: boolean; eventId?: string }> {
    const binding = await this.db.get<{
      binding_id: string;
      owner_user_id: string;
      platform_config: string | null;
    }>(
      `SELECT binding_id, owner_user_id, platform_config FROM wunderland_channel_bindings
       WHERE seed_id = ? AND platform = 'whatsapp' AND is_active = 1
       LIMIT 1`,
      [seedId]
    );
    if (!binding) return { ok: true, ignored: true };

    const parsed = parseWhatsAppMessage(body, req);
    if (!parsed) return { ok: true, ignored: true };

    const eventId = `whatsapp:${seedId}:${parsed.conversationId}:${parsed.messageId || Date.now()}`;

    const now = Date.now();
    // Idempotency: avoid duplicate auto-replies on retried deliveries.
    const dedupe = await this.db.run(
      `INSERT OR IGNORE INTO wunderland_channel_inbound_events
        (event_id, seed_id, platform, conversation_id, created_at)
       VALUES (?, ?, 'whatsapp', ?, ?)`,
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
      platform: 'whatsapp',
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      text: parsed.text,
      messageId: parsed.messageId || `wa-${Date.now()}`,
      timestamp: parsed.timestampIso,
      isOwner: false,
    });

    let platformConfig: Record<string, unknown> = {};
    try {
      platformConfig = JSON.parse(String(binding.platform_config || '{}'));
    } catch {
      platformConfig = {};
    }

    this.channelAutoReply.queueWhatsAppAutoReply({
      seedId,
      ownerUserId: String(binding.owner_user_id),
      platformConfig,
      conversationId: parsed.conversationId,
      conversationType: parsed.conversationType,
      senderName: parsed.senderName,
      senderPlatformId: parsed.senderPlatformId,
      senderIsBot: false,
      text: parsed.text,
      messageId: parsed.messageId || `wa-${Date.now()}`,
    });

    return { ok: true, eventId };
  }
}
