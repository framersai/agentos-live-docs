import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import { ChannelInboundController } from '../modules/wunderland/channels/channel-inbound.controller.js';

test('ChannelInboundController enforces Telegram webhook secret in production unless explicitly allowed', () => {
  const controller = new ChannelInboundController({} as any, {} as any, {} as any, {} as any);

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

test('ChannelInboundController enforces Slack request signing in production unless explicitly allowed', () => {
  const controller = new ChannelInboundController({} as any, {} as any, {} as any, {} as any);

  const originalNodeEnv = process.env.NODE_ENV;
  const originalAllow = process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED;

  try {
    process.env.NODE_ENV = 'production';
    delete process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED;

    // Missing signing secret should fail in prod by default.
    assert.throws(() =>
      (controller as any).assertSlackSignature({
        signingSecret: '',
        timestamp: undefined,
        signature: undefined,
        rawBody: undefined,
      })
    );

    // Allow unauthenticated for dev/test overrides.
    process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED = 'true';
    assert.doesNotThrow(() =>
      (controller as any).assertSlackSignature({
        signingSecret: '',
        timestamp: undefined,
        signature: undefined,
        rawBody: undefined,
      })
    );

    delete process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED;

    const signingSecret = 's3cr3t';
    const rawBody = JSON.stringify({ type: 'event_callback', event: { type: 'message' } });
    const ts = String(Math.floor(Date.now() / 1000));
    const base = `v0:${ts}:${rawBody}`;
    const signature = `v0=${createHmac('sha256', signingSecret).update(base, 'utf8').digest('hex')}`;

    assert.doesNotThrow(() =>
      (controller as any).assertSlackSignature({
        signingSecret,
        timestamp: ts,
        signature,
        rawBody,
      })
    );

    assert.throws(() =>
      (controller as any).assertSlackSignature({
        signingSecret,
        timestamp: ts,
        signature: 'v0=deadbeef',
        rawBody,
      })
    );

    const oldTs = String(Math.floor(Date.now() / 1000) - 60 * 10);
    const oldBase = `v0:${oldTs}:${rawBody}`;
    const oldSig = `v0=${createHmac('sha256', signingSecret).update(oldBase, 'utf8').digest('hex')}`;

    assert.throws(() =>
      (controller as any).assertSlackSignature({
        signingSecret,
        timestamp: oldTs,
        signature: oldSig,
        rawBody,
      })
    );

    process.env.NODE_ENV = 'development';
    assert.doesNotThrow(() =>
      (controller as any).assertSlackSignature({
        signingSecret: '',
        timestamp: undefined,
        signature: undefined,
        rawBody: undefined,
      })
    );
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalAllow === undefined)
      delete process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED;
    else process.env.WUNDERLAND_SLACK_WEBHOOK_ALLOW_UNAUTHENTICATED = originalAllow;
  }
});
