import test from 'node:test';
import assert from 'node:assert/strict';

import { ChannelAutoReplyService } from '../modules/wunderland/channels/channel-auto-reply.service.js';

test('ChannelAutoReplyService includes persona + mood overlay when personaEnabled=true', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  let capturedSystem = '';
  (svc as any).llmCaller = async (messages: any[]) => {
    capturedSystem = String(messages?.[0]?.content ?? '');
    return { text: 'hello' };
  };

  let moodCalls = 0;
  (svc as any).getDecayedMoodSnapshot = async () => {
    moodCalls += 1;
    return {
      label: 'curious',
      state: { valence: 0.1, arousal: 0.2, dominance: 0.3 },
    };
  };

  const reply = await (svc as any).generateTelegramReply(
    {
      seedId: 'seed_1',
      ownerUserId: 'user_1',
      platformConfig: {},
      conversationId: 'chat_1',
      conversationType: 'group',
      senderName: 'Bob',
      senderPlatformId: '123',
      senderIsBot: false,
      text: 'hello there',
      messageId: 'msg_1',
    },
    { enabled: true, mode: 'all', cooldownSec: 12, personaEnabled: true },
    {
      providerConfig: {
        providerId: 'openai',
        apiKey: 'test',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
      },
      modelOverride: 'gpt-4o-mini',
      agentName: 'TestAgent',
      baseSystemPrompt: 'BASE_SYSTEM_PROMPT_TEST',
      agentBio: 'bio',
      hexacoTraitsJson: '{}',
      securityProfileJson: null,
      inferenceHierarchyJson: null,
      stepUpAuthConfigJson: null,
    }
  );

  assert.equal(reply, 'hello');
  assert.equal(moodCalls, 1);
  assert.ok(capturedSystem.includes('BASE_SYSTEM_PROMPT_TEST'));
  assert.ok(capturedSystem.includes('Current mood: curious'));
  assert.ok(capturedSystem.includes('You are TestAgent (seed_1).'));
  assert.equal(capturedSystem.includes('Do not adopt a distinct persona'), false);
});

test('ChannelAutoReplyService uses neutral assistant prompt when personaEnabled=false', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  let capturedSystem = '';
  (svc as any).llmCaller = async (messages: any[]) => {
    capturedSystem = String(messages?.[0]?.content ?? '');
    return { text: 'ok' };
  };

  let moodCalls = 0;
  (svc as any).getDecayedMoodSnapshot = async () => {
    moodCalls += 1;
    return {
      label: 'curious',
      state: { valence: 0.1, arousal: 0.2, dominance: 0.3 },
    };
  };

  const reply = await (svc as any).generateTelegramReply(
    {
      seedId: 'seed_1',
      ownerUserId: 'user_1',
      platformConfig: {},
      conversationId: 'chat_1',
      conversationType: 'direct',
      senderName: 'Bob',
      senderPlatformId: '123',
      senderIsBot: false,
      text: 'ping',
      messageId: 'msg_1',
    },
    { enabled: true, mode: 'dm', cooldownSec: 12, personaEnabled: false },
    {
      providerConfig: {
        providerId: 'openai',
        apiKey: 'test',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
      },
      modelOverride: 'gpt-4o-mini',
      agentName: 'TestAgent',
      baseSystemPrompt: 'BASE_SYSTEM_PROMPT_TEST',
      agentBio: 'bio',
      hexacoTraitsJson: '{}',
      securityProfileJson: null,
      inferenceHierarchyJson: null,
      stepUpAuthConfigJson: null,
    }
  );

  assert.equal(reply, 'ok');
  assert.equal(moodCalls, 0);
  assert.ok(
    capturedSystem.includes('You are an AI assistant replying to an inbound Telegram message.')
  );
  assert.ok(capturedSystem.includes('Do not adopt a distinct persona, character, or mood.'));
  assert.ok(capturedSystem.includes('Task instructions:'));
  assert.ok(capturedSystem.includes('BASE_SYSTEM_PROMPT_TEST'));
  assert.equal(capturedSystem.includes('Current mood:'), false);
});

test('ChannelAutoReplyService mention gating blocks group messages without @mention', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  const res = svc.queueTelegramAutoReply({
    seedId: 'seed_1',
    ownerUserId: 'user_1',
    platformConfig: {
      botUsername: 'testbot',
      autoReply: { enabled: true, mode: 'mentions', cooldownSec: 0, personaEnabled: true },
    },
    conversationId: 'chat_1',
    conversationType: 'group',
    senderName: 'Bob',
    senderPlatformId: '123',
    senderIsBot: false,
    text: 'hello',
    messageId: 'msg_1',
  } as any);

  assert.deepEqual(res, { queued: false, reason: 'mode_mentions_only' });
});

test('ChannelAutoReplyService enqueues group messages with @mention in mentions mode', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  const enqueued: Array<{ key: string }> = [];
  (svc as any).enqueue = (key: string) => {
    enqueued.push({ key });
  };

  const res = svc.queueTelegramAutoReply({
    seedId: 'seed_1',
    ownerUserId: 'user_1',
    platformConfig: {
      botUsername: 'testbot',
      autoReply: { enabled: true, mode: 'mentions', cooldownSec: 0, personaEnabled: true },
    },
    conversationId: 'chat_1',
    conversationType: 'group',
    senderName: 'Bob',
    senderPlatformId: '123',
    senderIsBot: false,
    text: 'hi @testbot can you help?',
    messageId: 'msg_1',
  } as any);

  assert.deepEqual(res, { queued: true });
  assert.deepEqual(enqueued, [{ key: 'telegram:seed_1:chat_1' }]);
});

test('ChannelAutoReplyService Slack mention gating blocks channel messages without <@botUserId> mention', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  const res = svc.queueSlackAutoReply({
    seedId: 'seed_1',
    ownerUserId: 'user_1',
    platformConfig: {
      botUserId: 'U123',
      autoReply: { enabled: true, mode: 'mentions', cooldownSec: 0, personaEnabled: true },
    },
    conversationId: 'C1',
    conversationType: 'channel',
    senderName: 'U999',
    senderPlatformId: 'U999',
    senderIsBot: false,
    text: 'hello',
    messageId: '1710000000.000200',
  } as any);

  assert.deepEqual(res, { queued: false, reason: 'mode_mentions_only' });
});

test('ChannelAutoReplyService Slack enqueues channel messages with <@botUserId> mention in mentions mode', async () => {
  const svc = new ChannelAutoReplyService({} as any, {} as any, {} as any, {} as any, {} as any);

  const enqueued: Array<{ key: string }> = [];
  (svc as any).enqueue = (key: string) => {
    enqueued.push({ key });
  };

  const res = svc.queueSlackAutoReply({
    seedId: 'seed_1',
    ownerUserId: 'user_1',
    platformConfig: {
      botUserId: 'U123',
      autoReply: { enabled: true, mode: 'mentions', cooldownSec: 0, personaEnabled: true },
    },
    conversationId: 'C1',
    conversationType: 'channel',
    senderName: 'U999',
    senderPlatformId: 'U999',
    senderIsBot: false,
    text: 'hi <@U123> can you help?',
    messageId: '1710000000.000200',
  } as any);

  assert.deepEqual(res, { queued: true });
  assert.deepEqual(enqueued, [{ key: 'slack:seed_1:C1' }]);
});

test('ChannelAutoReplyService agency segmented output parses JSON array', async () => {
  const mockAgentos = {
    isEnabled: () => true,
    getIntegration: () => ({
      executeAgencyWorkflow: async () => ({
        gmiResults: [
          {
            roleId: 'triage',
            personaId: 'v_researcher',
            output: 'Draft a short reply.',
          },
        ],
      }),
    }),
  };

  const svc = new ChannelAutoReplyService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    mockAgentos as any
  );

  (svc as any).llmCaller = async () => ({ text: '["one","two"]' });

  const generated = await (svc as any).generateSlackAgencyReply(
    {
      seedId: 'seed_1',
      ownerUserId: 'user_1',
      platformConfig: { botUserId: 'U123' },
      conversationId: 'C1',
      conversationType: 'channel',
      senderName: 'U999',
      senderPlatformId: 'U999',
      senderIsBot: false,
      text: 'hello',
      messageId: '1710000000.000200',
    },
    {
      enabled: true,
      mode: 'all',
      cooldownSec: 0,
      personaEnabled: false,
      strategy: 'agency',
      outputMode: 'segmented',
      agency: {
        coordinationStrategy: 'static',
        roles: [],
        exposeSeatOutputs: false,
        maxSegments: 4,
        maxSeatOutputChars: 1200,
      },
    },
    {
      providerConfig: {
        providerId: 'openai',
        apiKey: 'test',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
      },
      modelOverride: 'gpt-4o-mini',
      agentName: 'TestAgent',
      baseSystemPrompt: 'BASE_SYSTEM_PROMPT_TEST',
      agentBio: 'bio',
      hexacoTraitsJson: '{}',
      securityProfileJson: null,
      inferenceHierarchyJson: null,
      stepUpAuthConfigJson: null,
    }
  );

  assert.deepEqual(generated.messages, ['one', 'two']);
});

test('ChannelAutoReplyService agency segmented output treats ["NO_REPLY"] as no reply', async () => {
  const mockAgentos = {
    isEnabled: () => true,
    getIntegration: () => ({
      executeAgencyWorkflow: async () => ({
        gmiResults: [
          {
            roleId: 'triage',
            personaId: 'v_researcher',
            output: 'Draft a short reply.',
          },
        ],
      }),
    }),
  };

  const svc = new ChannelAutoReplyService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    mockAgentos as any
  );

  (svc as any).llmCaller = async () => ({ text: '["NO_REPLY"]' });

  const generated = await (svc as any).generateSlackAgencyReply(
    {
      seedId: 'seed_1',
      ownerUserId: 'user_1',
      platformConfig: { botUserId: 'U123' },
      conversationId: 'C1',
      conversationType: 'channel',
      senderName: 'U999',
      senderPlatformId: 'U999',
      senderIsBot: false,
      text: 'hello',
      messageId: '1710000000.000200',
    },
    {
      enabled: true,
      mode: 'all',
      cooldownSec: 0,
      personaEnabled: false,
      strategy: 'agency',
      outputMode: 'segmented',
      agency: {
        coordinationStrategy: 'static',
        roles: [],
        exposeSeatOutputs: false,
        maxSegments: 4,
        maxSeatOutputChars: 1200,
      },
    },
    {
      providerConfig: {
        providerId: 'openai',
        apiKey: 'test',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
      },
      modelOverride: 'gpt-4o-mini',
      agentName: 'TestAgent',
      baseSystemPrompt: 'BASE_SYSTEM_PROMPT_TEST',
      agentBio: 'bio',
      hexacoTraitsJson: '{}',
      securityProfileJson: null,
      inferenceHierarchyJson: null,
      stepUpAuthConfigJson: null,
    }
  );

  assert.deepEqual(generated.messages, []);
});
