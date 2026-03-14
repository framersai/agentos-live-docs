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

test('OllamaLlmService supports remote Ollama server URL', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string }> = [];

  globalThis.fetch = (async (url: any) => {
    calls.push({ url: String(url) });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        model: 'llama3',
        message: { role: 'assistant', content: 'remote ok' },
        done: true,
      }),
    } as any;
  }) as any;

  try {
    const svc = new OllamaLlmService({
      providerId: 'ollama',
      apiKey: 'remote-key',
      baseUrl: 'https://ollama.myserver.com',
      defaultModel: 'llama3',
    });

    const resp = await svc.generateChatCompletion([{ role: 'user', content: 'hello' }], 'llama3');
    assert.equal(resp.text, 'remote ok');
    assert.equal(calls[0]?.url, 'https://ollama.myserver.com/api/chat');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OllamaLlmService generateChatCompletionStream yields chunks', async () => {
  const originalFetch = globalThis.fetch;

  // Simulate newline-delimited JSON streaming
  const streamChunks = [
    JSON.stringify({
      model: 'llama3',
      message: { role: 'assistant', content: 'Hello' },
      done: false,
    }) + '\n',
    JSON.stringify({
      model: 'llama3',
      message: { role: 'assistant', content: ' world' },
      done: false,
    }) + '\n',
    JSON.stringify({
      model: 'llama3',
      message: { role: 'assistant', content: '' },
      done: true,
      prompt_eval_count: 10,
      eval_count: 5,
    }) + '\n',
  ];

  globalThis.fetch = (async (_url: any, _init: any) => {
    let chunkIndex = 0;
    return {
      ok: true,
      status: 200,
      body: {
        getReader() {
          return {
            read() {
              if (chunkIndex < streamChunks.length) {
                const chunk = new TextEncoder().encode(streamChunks[chunkIndex]!);
                chunkIndex++;
                return Promise.resolve({ done: false, value: chunk });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
      },
    } as any;
  }) as any;

  try {
    const svc = new OllamaLlmService({
      providerId: 'ollama',
      apiKey: undefined,
      baseUrl: 'http://localhost:11434',
      defaultModel: 'llama3',
    });

    const chunks: Array<{ text: string; done: boolean; usage?: any }> = [];
    for await (const chunk of svc.generateChatCompletionStream(
      [{ role: 'user', content: 'hi' }],
      'llama3'
    )) {
      chunks.push(chunk);
    }

    assert.equal(chunks.length, 3);
    assert.equal(chunks[0]?.text, 'Hello');
    assert.equal(chunks[0]?.done, false);
    assert.equal(chunks[1]?.text, ' world');
    assert.equal(chunks[1]?.done, false);
    assert.equal(chunks[2]?.done, true);
    assert.deepEqual(chunks[2]?.usage, {
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OllamaLlmService generateChatCompletionStream throws on error chunk', async () => {
  const originalFetch = globalThis.fetch;

  const streamChunks = [JSON.stringify({ error: 'model not found' }) + '\n'];

  globalThis.fetch = (async () => {
    let chunkIndex = 0;
    return {
      ok: true,
      status: 200,
      body: {
        getReader() {
          return {
            read() {
              if (chunkIndex < streamChunks.length) {
                const chunk = new TextEncoder().encode(streamChunks[chunkIndex]!);
                chunkIndex++;
                return Promise.resolve({ done: false, value: chunk });
              }
              return Promise.resolve({ done: true, value: undefined });
            },
          };
        },
      },
    } as any;
  }) as any;

  try {
    const svc = new OllamaLlmService({
      providerId: 'ollama',
      apiKey: undefined,
      baseUrl: 'http://localhost:11434',
      defaultModel: 'llama3',
    });

    await assert.rejects(async () => {
      for await (const _chunk of svc.generateChatCompletionStream(
        [{ role: 'user', content: 'hi' }],
        'llama3'
      )) {
        // consume
      }
    }, /model not found/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('OllamaLlmService strips ollama/ prefix from model ID', async () => {
  const originalFetch = globalThis.fetch;
  const calls: Array<{ body: any }> = [];

  globalThis.fetch = (async (_url: any, init: any) => {
    calls.push({ body: JSON.parse(String(init?.body ?? '{}')) });
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
      baseUrl: 'http://localhost:11434',
      defaultModel: 'llama3',
    });

    await svc.generateChatCompletion([{ role: 'user', content: 'hi' }], 'ollama/llama3:8b');
    assert.equal(calls[0]?.body.model, 'llama3:8b');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
