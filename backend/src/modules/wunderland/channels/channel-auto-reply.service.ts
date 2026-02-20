/**
 * @file channel-auto-reply.service.ts
 * @description Outbound auto-reply policies for inbound channel messages.
 *
 * Initial implementation: Telegram only.
 * - Reads per-binding policy from `wunderland_channel_bindings.platform_config`.
 * - Gated by `wunderbot_runtime.status === 'running'`.
 * - Applies per-conversation cooldown to prevent spam/loops.
 */

import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { CredentialsService } from '../credentials/credentials.service.js';
import { CredentialResolverService } from '../credentials/credential-resolver.service.js';
import { callLlmWithProviderConfig } from '../../../core/llm/llm.factory.js';
import { LlmProviderId } from '../../../core/llm/llm.config.service.js';
import type { IChatMessage, ILlmProviderConfig } from '../../../core/llm/llm.interfaces.js';
import { TunnelService } from '../../tunnel/tunnel.service.js';
import {
  createWunderlandSeed,
  DEFAULT_INFERENCE_HIERARCHY,
  DEFAULT_SECURITY_PROFILE,
  DEFAULT_STEP_UP_AUTH_CONFIG,
  normalizeHEXACOTraits,
  type HEXACOTraits,
  type InferenceHierarchyConfig,
  type SecurityProfile,
  type StepUpAuthorizationConfig,
} from 'wunderland';
import { MoodEngine, type PADState, type MoodLabel } from '@wunderland/social';

type AutoReplyMode = 'dm' | 'mentions' | 'all';

type AutoReplyPolicy = {
  enabled: boolean;
  mode: AutoReplyMode;
  cooldownSec: number;
  personaEnabled: boolean;
};

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function parseAutoReplyPolicy(platformConfig: Record<string, unknown>): AutoReplyPolicy {
  const raw = platformConfig?.autoReply;
  if (raw === true) {
    return { enabled: true, mode: 'dm', cooldownSec: 12, personaEnabled: true };
  }
  if (!raw || typeof raw !== 'object') {
    return { enabled: false, mode: 'dm', cooldownSec: 12, personaEnabled: true };
  }

  const enabled = Boolean((raw as any).enabled);
  const modeRaw = String((raw as any).mode ?? 'dm')
    .trim()
    .toLowerCase();
  const mode: AutoReplyMode =
    modeRaw === 'all' ? 'all' : modeRaw === 'mentions' ? 'mentions' : 'dm';
  const cooldownSec = clampInt((raw as any).cooldownSec, 12, 0, 3600);
  const personaEnabled =
    (raw as any).personaEnabled === undefined ? true : Boolean((raw as any).personaEnabled);

  return { enabled, mode, cooldownSec, personaEnabled };
}

function normalizeTelegramUsername(raw: unknown): string {
  const u = typeof raw === 'string' ? raw.trim() : '';
  if (!u) return '';
  return u.startsWith('@') ? u.slice(1) : u;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isNoReply(text: string): boolean {
  const firstLine = text.split(/\r?\n/, 1)[0]?.trim() ?? '';
  if (!firstLine) return false;
  return /^NO_REPLY\b/i.test(firstLine);
}

const MOOD_DECAY_TICK_MS = 10 * 60 * 1000; // 10 minutes per decay "tick"

type InboundTelegramContext = {
  seedId: string;
  ownerUserId: string;
  platformConfig: Record<string, unknown>;
  conversationId: string;
  conversationType: 'direct' | 'group' | 'channel' | 'thread';
  senderName: string;
  senderPlatformId: string;
  senderIsBot: boolean;
  text: string;
  messageId: string;
  replyToMessageId?: string;
};

type LlmCaller = typeof callLlmWithProviderConfig;

@Injectable()
export class ChannelAutoReplyService {
  private readonly logger = new Logger(ChannelAutoReplyService.name);
  private readonly queues: Map<string, Promise<void>> = new Map();
  private llmCaller: LlmCaller = callLlmWithProviderConfig;

  constructor(
    private readonly db: DatabaseService,
    private readonly credentials: CredentialsService,
    private readonly credentialResolver: CredentialResolverService,
    private readonly tunnelService: TunnelService
  ) {}

  queueTelegramAutoReply(ctx: InboundTelegramContext): { queued: boolean; reason?: string } {
    const policy = parseAutoReplyPolicy(ctx.platformConfig);
    if (!policy.enabled) return { queued: false, reason: 'auto_reply_disabled' };
    if (ctx.senderIsBot) return { queued: false, reason: 'sender_is_bot' };

    const botUsername = normalizeTelegramUsername(ctx.platformConfig?.botUsername);
    const mentionMatch = botUsername
      ? new RegExp(`(^|\\s)@${escapeRegExp(botUsername)}\\b`, 'i').test(ctx.text)
      : false;

    const isDirect = ctx.conversationType === 'direct';
    if (!isDirect) {
      if (policy.mode === 'dm') return { queued: false, reason: 'mode_dm_only' };
      if (policy.mode === 'mentions' && !mentionMatch) {
        return { queued: false, reason: 'mode_mentions_only' };
      }
    }

    const key = `telegram:${ctx.seedId}:${ctx.conversationId}`;
    this.enqueue(key, async () => {
      await this.processTelegramAutoReply(ctx, policy);
    });
    return { queued: true };
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private enqueue(key: string, fn: () => Promise<void>): void {
    const prev = this.queues.get(key) ?? Promise.resolve();
    const next = prev
      .catch(() => undefined)
      .then(fn)
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Auto-reply turn failed (${key}): ${message}`);
      })
      .finally(() => {
        if (this.queues.get(key) === next) this.queues.delete(key);
      });
    this.queues.set(key, next);
  }

  private async processTelegramAutoReply(
    ctx: InboundTelegramContext,
    policy: AutoReplyPolicy
  ): Promise<void> {
    // Gate by managed runtime start/stop.
    const running = await this.db.get<{ status: string }>(
      `SELECT status FROM wunderbot_runtime WHERE seed_id = ? LIMIT 1`,
      [ctx.seedId]
    );
    if (String(running?.status ?? '').trim() !== 'running') return;

    const now = Date.now();
    if (policy.cooldownSec > 0) {
      const session = await this.db.get<{ context_json: string | null }>(
        `SELECT context_json FROM wunderland_channel_sessions
         WHERE seed_id = ? AND platform = 'telegram' AND conversation_id = ?
         LIMIT 1`,
        [ctx.seedId, ctx.conversationId]
      );
      const context = this.safeJsonParse<Record<string, unknown>>(session?.context_json) ?? {};
      const last = (context as any)?.autoReply?.lastReplyAtMs;
      const lastMs = typeof last === 'number' && Number.isFinite(last) ? last : 0;
      if (lastMs > 0 && now - lastMs < policy.cooldownSec * 1000) return;
    }

    const reply = await this.generateTelegramReply(ctx, policy);
    if (!reply) return;

    await this.sendTelegramMessage(ctx, reply);

    // Persist last reply timestamp for cooldown.
    await this.bumpSessionAutoReplyContext(ctx, now);
  }

  private safeJsonParse<T>(raw: string | null | undefined): T | null {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private buildRuntimeProviderConfig(
    providerId: LlmProviderId,
    apiKey?: string
  ): ILlmProviderConfig {
    if (providerId === LlmProviderId.OPENAI) {
      return {
        providerId,
        apiKey,
        baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
        defaultModel: process.env.MODEL_PREF_OPENAI_DEFAULT || 'gpt-4o-mini',
      };
    }
    if (providerId === LlmProviderId.OPENROUTER) {
      return {
        providerId,
        apiKey,
        baseUrl: process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultModel: process.env.MODEL_PREF_OPENROUTER_DEFAULT || 'openai/gpt-4o-mini',
        additionalHeaders: {
          'HTTP-Referer': process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`,
          'X-Title': process.env.APP_NAME || 'Wunderland',
        },
      };
    }
    if (providerId === LlmProviderId.ANTHROPIC) {
      return {
        providerId,
        apiKey,
        baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com/v1',
        defaultModel: process.env.MODEL_PREF_ANTHROPIC_DEFAULT || 'claude-3-haiku-20240307',
        additionalHeaders: { 'anthropic-version': '2023-06-01' },
      };
    }
    if (providerId === LlmProviderId.OLLAMA) {
      return {
        providerId,
        apiKey: undefined,
        baseUrl: process.env.OLLAMA_BASE_URL,
        defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3:latest',
      };
    }
    return { providerId, apiKey };
  }

  private normalizeOpenRouterModel(model: string): string {
    const trimmed = model.trim();
    if (!trimmed) return trimmed;
    if (trimmed.toLowerCase() === 'auto') return 'openrouter/auto';
    return trimmed;
  }

  private async resolveLlmForSeed(
    seedId: string,
    ownerUserId: string
  ): Promise<{
    providerConfig: ILlmProviderConfig;
    modelOverride?: string;
    agentName?: string;
    baseSystemPrompt?: string;
    agentBio?: string;
    hexacoTraitsJson?: string;
    securityProfileJson?: string;
    inferenceHierarchyJson?: string;
    stepUpAuthConfigJson?: string | null;
  } | null> {
    const agent = await this.db.get<{
      display_name: string;
      bio: string | null;
      base_system_prompt: string | null;
      inference_hierarchy: string | null;
      hexaco_traits: string;
      security_profile: string;
      step_up_auth_config: string | null;
    }>(
      `SELECT display_name, bio, base_system_prompt, inference_hierarchy, hexaco_traits, security_profile, step_up_auth_config
       FROM wunderbots WHERE seed_id = ? AND owner_user_id = ? LIMIT 1`,
      [seedId, ownerUserId]
    );
    if (!agent) return null;

    let vals: Record<string, string | null> = {};
    try {
      vals = await this.credentials.getDecryptedValuesByType(ownerUserId, seedId, [
        'LLM_MODEL',
        'LLM_API_KEY_OPENAI',
        'LLM_API_KEY_OPENROUTER',
        'LLM_API_KEY_ANTHROPIC',
        // Rabbithole dashboard (credential vault / AutoConfigWidget)
        'openai_key',
        'openrouter_key',
        'anthropic_key',
      ]);
    } catch {
      vals = {};
    }

    let openAiKey = (vals.openai_key || vals.LLM_API_KEY_OPENAI)?.trim() || null;
    let openRouterKey = (vals.openrouter_key || vals.LLM_API_KEY_OPENROUTER)?.trim() || null;
    let anthropicKey = (vals.anthropic_key || vals.LLM_API_KEY_ANTHROPIC)?.trim() || null;

    const resolveFirst = async (types: string[]): Promise<string | null> => {
      for (const type of types) {
        try {
          const resolved = await this.credentialResolver.resolve(ownerUserId, seedId, type);
          const value = resolved?.value?.trim();
          if (value) return value;
        } catch {
          // Ignore and keep trying fallbacks.
        }
      }
      return null;
    };

    // Fall back to vault keys (or alternate type aliases) if agent creds are missing.
    if (!openAiKey) {
      openAiKey =
        (await resolveFirst([
          'openai_key',
          'LLM_API_KEY_OPENAI',
          'openai.apiKey',
          'OPENAI_API_KEY',
        ])) || null;
    }
    if (!openRouterKey) {
      openRouterKey =
        (await resolveFirst([
          'openrouter_key',
          'LLM_API_KEY_OPENROUTER',
          'openrouter.apiKey',
          'OPENROUTER_API_KEY',
        ])) || null;
    }
    if (!anthropicKey) {
      anthropicKey =
        (await resolveFirst([
          'anthropic_key',
          'LLM_API_KEY_ANTHROPIC',
          'anthropic.apiKey',
          'ANTHROPIC_API_KEY',
        ])) || null;
    }

    // Preferences: LLM_MODEL wins, then inference_hierarchy.
    const modelPrefRaw = vals.LLM_MODEL ?? null;
    const parsed = this.safeJsonParse<any>(modelPrefRaw);
    let prefProvider =
      typeof parsed?.provider === 'string' ? parsed.provider.trim().toLowerCase() : '';
    let prefModel = typeof parsed?.model === 'string' ? parsed.model.trim() : '';

    const hierarchy = this.safeJsonParse<any>(agent.inference_hierarchy) ?? null;
    if ((!prefProvider || !prefModel) && hierarchy && typeof hierarchy === 'object') {
      const hierarchyProvider =
        typeof hierarchy.llmProvider === 'string'
          ? hierarchy.llmProvider.trim().toLowerCase()
          : typeof hierarchy.primaryModel?.providerId === 'string'
            ? String(hierarchy.primaryModel.providerId).trim().toLowerCase()
            : '';
      const hierarchyModel =
        typeof hierarchy.llmModel === 'string'
          ? hierarchy.llmModel.trim()
          : typeof hierarchy.primaryModel?.modelId === 'string'
            ? String(hierarchy.primaryModel.modelId).trim()
            : '';

      if (!prefProvider && hierarchyProvider) prefProvider = hierarchyProvider;
      if (!prefModel && hierarchyModel) prefModel = hierarchyModel;
    }

    const desiredProvider =
      prefProvider === 'openai'
        ? LlmProviderId.OPENAI
        : prefProvider === 'openrouter'
          ? LlmProviderId.OPENROUTER
          : prefProvider === 'anthropic'
            ? LlmProviderId.ANTHROPIC
            : prefProvider === 'ollama'
              ? LlmProviderId.OLLAMA
              : null;

    const out: {
      providerConfig: ILlmProviderConfig;
      modelOverride?: string;
      agentName?: string;
      baseSystemPrompt?: string;
      agentBio?: string;
      hexacoTraitsJson?: string;
      securityProfileJson?: string;
      inferenceHierarchyJson?: string;
      stepUpAuthConfigJson?: string | null;
    } = {
      providerConfig: { providerId: 'unknown', apiKey: undefined },
      agentName: agent.display_name,
      agentBio: agent.bio ?? undefined,
      hexacoTraitsJson: agent.hexaco_traits,
      securityProfileJson: agent.security_profile,
      inferenceHierarchyJson: agent.inference_hierarchy ?? undefined,
      stepUpAuthConfigJson: agent.step_up_auth_config,
      baseSystemPrompt: agent.base_system_prompt ?? undefined,
    };

    if (desiredProvider && prefModel) {
      out.modelOverride =
        desiredProvider === LlmProviderId.OPENROUTER
          ? this.normalizeOpenRouterModel(prefModel)
          : prefModel;
    }

    if (desiredProvider === LlmProviderId.OLLAMA) {
      // Self-hosted server-side Ollama
      if (process.env.OLLAMA_BASE_URL?.trim()) {
        out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OLLAMA);
        return out;
      }

      // Hosted Rabbit Hole: use per-user tunnel registration (Cloudflare quick tunnel).
      const status = await this.tunnelService.getStatusForUser(ownerUserId);
      if (!status.connected || !status.ollamaUrl) return null;

      out.providerConfig = {
        providerId: LlmProviderId.OLLAMA,
        apiKey: undefined,
        baseUrl: status.ollamaUrl,
        defaultModel: process.env.MODEL_PREF_OLLAMA_DEFAULT || 'llama3:latest',
      };
      return out;
    }

    if (desiredProvider === LlmProviderId.OPENROUTER && openRouterKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENROUTER, openRouterKey);
      return out;
    }

    if (desiredProvider === LlmProviderId.OPENAI && openAiKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENAI, openAiKey);
      return out;
    }

    if (desiredProvider === LlmProviderId.ANTHROPIC && anthropicKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.ANTHROPIC, anthropicKey);
      return out;
    }

    // If they selected OpenAI/Anthropic but only provided an OpenRouter key, route via OpenRouter.
    if (desiredProvider === LlmProviderId.OPENAI && openRouterKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENROUTER, openRouterKey);
      if (prefModel && !out.modelOverride) {
        out.modelOverride = `openai/${prefModel}`;
      } else if (out.modelOverride && !out.modelOverride.includes('/')) {
        out.modelOverride = `openai/${out.modelOverride}`;
      }
      return out;
    }

    if (desiredProvider === LlmProviderId.ANTHROPIC && openRouterKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENROUTER, openRouterKey);
      if (prefModel && !out.modelOverride) {
        out.modelOverride = `anthropic/${prefModel}`;
      } else if (out.modelOverride && !out.modelOverride.includes('/')) {
        out.modelOverride = `anthropic/${out.modelOverride}`;
      }
      return out;
    }

    // No explicit preference: if they at least stored an OpenRouter/OpenAI/Anthropic key, use it.
    if (openRouterKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENROUTER, openRouterKey);
      return out;
    }
    if (openAiKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.OPENAI, openAiKey);
      return out;
    }
    if (anthropicKey) {
      out.providerConfig = this.buildRuntimeProviderConfig(LlmProviderId.ANTHROPIC, anthropicKey);
      return out;
    }

    return null;
  }

  private parseHexacoTraits(raw: unknown): HEXACOTraits {
    const parsed = typeof raw === 'string' ? this.safeJsonParse<any>(raw) : raw;
    return normalizeHEXACOTraits((parsed && typeof parsed === 'object' ? parsed : {}) as any);
  }

  private parseSecurityProfile(raw: unknown): SecurityProfile {
    const parsed = typeof raw === 'string' ? this.safeJsonParse<any>(raw) : raw;
    return (
      parsed && typeof parsed === 'object' ? (parsed as SecurityProfile) : DEFAULT_SECURITY_PROFILE
    ) as SecurityProfile;
  }

  private parseInferenceHierarchy(raw: unknown): InferenceHierarchyConfig {
    const parsed = typeof raw === 'string' ? this.safeJsonParse<any>(raw) : raw;
    return (
      parsed && typeof parsed === 'object'
        ? (parsed as InferenceHierarchyConfig)
        : DEFAULT_INFERENCE_HIERARCHY
    ) as InferenceHierarchyConfig;
  }

  private parseStepUpAuthConfig(raw: unknown): StepUpAuthorizationConfig {
    const parsed = typeof raw === 'string' ? this.safeJsonParse<any>(raw) : raw;
    return (
      parsed && typeof parsed === 'object'
        ? (parsed as StepUpAuthorizationConfig)
        : DEFAULT_STEP_UP_AUTH_CONFIG
    ) as StepUpAuthorizationConfig;
  }

  private async getDecayedMoodSnapshot(
    seedId: string,
    traits: HEXACOTraits
  ): Promise<{ label: MoodLabel; state: PADState } | null> {
    const nowMs = Date.now();
    const row = await this.db.get<{
      valence: number;
      arousal: number;
      dominance: number;
      updated_at: string;
    }>(
      `SELECT valence, arousal, dominance, updated_at
         FROM wunderbot_moods
        WHERE seed_id = ?`,
      [seedId]
    );

    const engine = new MoodEngine();
    engine.initializeAgent(seedId, traits);

    const updatedAtMs = row?.updated_at ? Date.parse(String(row.updated_at)) : NaN;
    if (row) {
      engine.updateMood(
        seedId,
        {
          valence: Number(row.valence),
          arousal: Number(row.arousal),
          dominance: Number(row.dominance),
        },
        { trigger: 'restore_snapshot' }
      );
    }

    if (Number.isFinite(updatedAtMs)) {
      const elapsedMs = Math.max(0, nowMs - Number(updatedAtMs));
      const deltaTime = Math.min(10_000, elapsedMs / MOOD_DECAY_TICK_MS);
      if (deltaTime > 0) engine.decayToBaseline(seedId, deltaTime);
    }

    const state = engine.getState(seedId);
    if (!state) return null;
    const label = engine.getMoodLabel(seedId);

    // Best-effort persistence of decayed snapshot so "dynamic decay" is reflected across restarts.
    const nowIso = new Date(nowMs).toISOString();
    await this.db.run(
      `INSERT INTO wunderbot_moods
        (seed_id, valence, arousal, dominance, mood_label, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(seed_id) DO UPDATE SET
         valence = excluded.valence,
         arousal = excluded.arousal,
         dominance = excluded.dominance,
         mood_label = excluded.mood_label,
         updated_at = excluded.updated_at`,
      [seedId, state.valence, state.arousal, state.dominance, label, nowIso]
    );

    return { label, state };
  }

  private async generateTelegramReply(
    ctx: InboundTelegramContext,
    policy: AutoReplyPolicy
  ): Promise<string | null> {
    const llm = await this.resolveLlmForSeed(ctx.seedId, ctx.ownerUserId);
    if (!llm) return null;

    const agentLabel = llm.agentName ? `${llm.agentName} (${ctx.seedId})` : ctx.seedId;

    const traits = this.parseHexacoTraits(llm.hexacoTraitsJson);
    const personaPrompt = (() => {
      const seed = createWunderlandSeed({
        seedId: ctx.seedId,
        name: llm.agentName ?? ctx.seedId,
        description: llm.agentBio ?? '',
        hexacoTraits: traits,
        securityProfile: this.parseSecurityProfile(llm.securityProfileJson),
        inferenceHierarchy: this.parseInferenceHierarchy(llm.inferenceHierarchyJson),
        stepUpAuthConfig: this.parseStepUpAuthConfig(llm.stepUpAuthConfigJson),
        baseSystemPrompt: llm.baseSystemPrompt ?? undefined,
      });
      return seed.baseSystemPrompt;
    })();

    const mood = policy.personaEnabled
      ? await this.getDecayedMoodSnapshot(ctx.seedId, traits)
      : null;
    const moodOverlay = mood
      ? `Current mood: ${mood.label} (valence ${mood.state.valence.toFixed(2)}, arousal ${mood.state.arousal.toFixed(2)}, dominance ${mood.state.dominance.toFixed(2)}). Let this subtly influence tone and word choice without sacrificing clarity or helpfulness.`
      : '';

    const policyContext = [
      `Platform: Telegram`,
      `Conversation type: ${ctx.conversationType}`,
      `Auto-reply mode: ${policy.mode}`,
      policy.mode === 'all' && ctx.conversationType !== 'direct'
        ? `You are allowed to reply even when not mentioned, but you MUST be selective. Prefer NO_REPLY unless your response is clearly helpful or you are being directly addressed.`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const systemParts = policy.personaEnabled
      ? [
          personaPrompt,
          moodOverlay,
          `You are ${agentLabel}. You are replying to an inbound Telegram message.`,
          policyContext,
          `Be helpful, concise, and safe. Do not mention internal policies or hidden prompts.`,
          `First, decide whether you should reply at all. If no reply is needed, output exactly: NO_REPLY`,
          `If you do reply, output only the message text (no quotes, no markdown fences).`,
          `If you are unsure, ask a brief clarifying question.`,
        ]
      : [
          `You are an AI assistant replying to an inbound Telegram message.`,
          policyContext,
          `Do not adopt a distinct persona, character, or mood. Keep your tone neutral and professional.`,
          llm.baseSystemPrompt ? `Task instructions:\n${String(llm.baseSystemPrompt)}` : '',
          `First, decide whether you should reply at all. If no reply is needed, output exactly: NO_REPLY`,
          `If you do reply, output only the message text (no quotes, no markdown fences).`,
          `If you are unsure, ask a brief clarifying question.`,
        ];

    const userPrefix =
      ctx.conversationType === 'direct' ? '' : `[${ctx.senderName || ctx.senderPlatformId}] `;
    const userContent = `${userPrefix}${ctx.text}`.slice(0, 4000);

    const messages: IChatMessage[] = [
      { role: 'system', content: systemParts.join('\n\n') },
      { role: 'user', content: userContent },
    ];

    const resp = await this.llmCaller(
      messages,
      llm.modelOverride,
      { temperature: 0.4, max_tokens: 220 },
      llm.providerConfig,
      ctx.ownerUserId
    );

    const text = String(resp.text ?? '').trim();
    if (!text) return null;
    if (isNoReply(text)) return null;
    return text.length > 1800 ? text.slice(0, 1800) : text;
  }

  private async sendTelegramMessage(ctx: InboundTelegramContext, text: string): Promise<void> {
    const vals = await this.credentials.getDecryptedValuesByType(ctx.ownerUserId, ctx.seedId, [
      'telegram_bot_token',
    ]);
    const token = vals.telegram_bot_token?.trim();
    if (!token) return;

    const replyToMessageIdNum = (() => {
      const raw = ctx.replyToMessageId || ctx.messageId;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    })();

    const body: Record<string, unknown> = {
      chat_id: ctx.conversationId,
      text,
      disable_web_page_preview: true,
    };
    if (replyToMessageIdNum) {
      body.reply_to_message_id = replyToMessageIdNum;
      body.allow_sending_without_reply = true;
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      this.logger.warn(`Telegram sendMessage failed (${res.status}): ${errBody}`);
    }
  }

  private async bumpSessionAutoReplyContext(
    ctx: InboundTelegramContext,
    replyAtMs: number
  ): Promise<void> {
    const session = await this.db.get<{ context_json: string | null }>(
      `SELECT context_json FROM wunderland_channel_sessions
       WHERE seed_id = ? AND platform = 'telegram' AND conversation_id = ?
       LIMIT 1`,
      [ctx.seedId, ctx.conversationId]
    );

    const context = this.safeJsonParse<Record<string, unknown>>(session?.context_json) ?? {};
    const next = {
      ...context,
      autoReply: {
        ...(typeof (context as any)?.autoReply === 'object' ? (context as any).autoReply : {}),
        lastReplyAtMs: replyAtMs,
      },
    };

    await this.db.run(
      `UPDATE wunderland_channel_sessions
          SET context_json = ?,
              last_message_at = ?,
              message_count = message_count + 1,
              is_active = 1,
              updated_at = ?
        WHERE seed_id = ? AND platform = 'telegram' AND conversation_id = ?`,
      [JSON.stringify(next), replyAtMs, replyAtMs, ctx.seedId, ctx.conversationId]
    );
  }
}
