import test from 'node:test';
import assert from 'node:assert/strict';

import { OllamaLlmService } from '../core/llm/ollama.llm.service.js';

test('OllamaLlmService calls /api/chat and maps response', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; init: any }> = [];

  globalThis.fetch = (async (url: any, init: any) => {
    calls.push({ url: String(url), init });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        model: 'llama3.1:8b',
        message: { role: 'assistant', content: 'hello' },
        done: true,
        prompt_eval_count: 12,
        eval_count: 7,
      }),
    } as any;
  }) as any;

  try {
    const svc = new OllamaLlmService({
      providerId: 'ollama',
      apiKey: undefined,
      baseUrl: 'https://abc123.trycloudflare.com',
      defaultModel: 'llama3.1:8b',
    });

    const resp = await svc.generateChatCompletion(
      [
        { role: 'system', content: 'system' },
        { role: 'user', content: 'user' },
      ],
      'llama3.1:8b',
      { temperature: 0.2, max_tokens: 64 }
    );

    assert.equal(resp.text, 'hello');
    assert.deepEqual(resp.usage, { prompt_tokens: 12, completion_tokens: 7, total_tokens: 19 });
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.url, 'https://abc123.trycloudflare.com/api/chat');
    const body = JSON.parse(String(calls[0]?.init?.body ?? '{}'));
    assert.equal(body.model, 'llama3.1:8b');
    assert.equal(body.stream, false);
    assert.equal(body.options.temperature, 0.2);
    assert.equal(body.options.num_predict, 64);
    assert.equal(Array.isArray(body.messages), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OllamaLlmService accepts a baseUrl ending in /api', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string }> = [];

  globalThis.fetch = (async (url: any) => {
    calls.push({ url: String(url) });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        model: 'llama3',
        message: { role: 'assistant', content: 'ok' },
        done: true,
      }),
    } as any;
  }) as any;

  try {
    const svc = new OllamaLlmService({
      providerId: 'ollama',
      apiKey: undefined,
      baseUrl: 'http://localhost:11434/api',
      defaultModel: 'llama3',
    });

    await svc.generateChatCompletion([{ role: 'user', content: 'ping' }], 'llama3');
    assert.equal(calls[0]?.url, 'http://localhost:11434/api/chat');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
