import test from 'node:test';
import assert from 'node:assert/strict';

import { ChannelInboundController } from '../modules/wunderland/channels/channel-inbound.controller.js';

test('ChannelInboundController enforces Telegram webhook secret in production unless explicitly allowed', () => {
  const controller = new ChannelInboundController({} as any, {} as any, {} as any);

  const originalNodeEnv = process.env.NODE_ENV;
  const originalSecret = process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET;
  const originalAllow = process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED;

  try {
    process.env.NODE_ENV = 'production';
    delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET;
    delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED;

    assert.throws(() => (controller as any).assertTelegramWebhookSecret(undefined));

    process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED = 'true';
    assert.doesNotThrow(() => (controller as any).assertTelegramWebhookSecret(undefined));

    process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET = 's3cr3t';
    delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED;

    assert.throws(() => (controller as any).assertTelegramWebhookSecret(undefined));
    assert.throws(() => (controller as any).assertTelegramWebhookSecret('wrong'));
    assert.doesNotThrow(() => (controller as any).assertTelegramWebhookSecret('s3cr3t'));

    process.env.NODE_ENV = 'development';
    delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET;
    delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED;

    assert.doesNotThrow(() => (controller as any).assertTelegramWebhookSecret(undefined));
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalSecret === undefined) delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET;
    else process.env.WUNDERLAND_TELEGRAM_WEBHOOK_SECRET = originalSecret;
    if (originalAllow === undefined)
      delete process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED;
    else process.env.WUNDERLAND_TELEGRAM_WEBHOOK_ALLOW_UNAUTHENTICATED = originalAllow;
  }
});
