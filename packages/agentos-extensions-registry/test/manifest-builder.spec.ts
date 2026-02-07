/**
 * Unit tests for createCuratedManifest and registry helpers.
 */

import { describe, it, expect, vi } from 'vitest';
import { createCuratedManifest, getAvailableExtensions, getAvailableChannels } from '../src/index';

describe('createCuratedManifest', () => {
  it('should return a manifest object with packs array', async () => {
    const manifest = await createCuratedManifest({ channels: 'none', tools: 'none' });
    expect(manifest).toHaveProperty('packs');
    expect(Array.isArray(manifest.packs)).toBe(true);
  });

  it('should return empty packs when channels and tools are "none"', async () => {
    const manifest = await createCuratedManifest({ channels: 'none', tools: 'none' });
    expect(manifest.packs).toHaveLength(0);
  });

  it('should attempt to load all channels when channels="all"', async () => {
    const manifest = await createCuratedManifest({ channels: 'all', tools: 'none' });
    // If any channel packs are available, they should all be channel-* identifiers.
    expect(
      manifest.packs.every((p) => String(p.identifier || '').startsWith('registry:channel-'))
    ).toBe(true);
  });

  it('should attempt to load all tools when tools="all"', async () => {
    const manifest = await createCuratedManifest({ channels: 'none', tools: 'all' });
    const ids = manifest.packs.map((p) => p.identifier).filter(Boolean);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain('registry:web-search');
    expect(ids).toContain('registry:web-browser');
    expect(ids).toContain('registry:cli-executor');
    expect(ids).toContain('registry:giphy');
    expect(ids).toContain('registry:image-search');
    expect(ids).toContain('registry:voice-synthesis');
    expect(ids).toContain('registry:news-search');
  });

  it('should filter channels by platform name', async () => {
    const manifest = await createCuratedManifest({
      channels: ['telegram', 'discord'],
      tools: 'none',
    });
    const allowed = new Set(['registry:channel-telegram', 'registry:channel-discord']);
    expect(manifest.packs.every((p) => allowed.has(String(p.identifier)))).toBe(true);
  });

  it('should apply priority overrides', async () => {
    const manifest = await createCuratedManifest({
      channels: 'none',
      tools: ['web-search'],
      overrides: { 'web-search': { priority: 999 } },
    });
    expect(manifest.packs).toHaveLength(1);
    expect(manifest.packs[0]?.identifier).toBe('registry:web-search');
    expect(manifest.packs[0]?.priority).toBe(999);
  });

  it('should skip disabled extensions via overrides', async () => {
    const manifest = await createCuratedManifest({
      channels: 'none',
      tools: 'all',
      overrides: {
        'web-search': { enabled: false },
        'cli-executor': { enabled: false },
      },
    });
    const ids = manifest.packs.map((p) => p.identifier).filter(Boolean);
    expect(ids).not.toContain('registry:web-search');
    expect(ids).not.toContain('registry:cli-executor');
    expect(ids.length).toBeGreaterThan(0);
  });

  it('should pass secrets to extension factories', async () => {
    const manifest = await createCuratedManifest({
      channels: 'none',
      tools: ['web-search'],
      secrets: { 'serper.apiKey': 'test-serper-key' },
    });
    expect(manifest.packs).toHaveLength(1);

    const pack = await manifest.packs[0]!.factory();
    const webSearch = pack.descriptors.find((d: any) => d.kind === 'tool' && d.id === 'web_search')
      ?.payload as any;
    expect(webSearch?.name).toBe('web_search');

    const fetchSpy = vi.fn(async () => ({ ok: true, json: async () => ({ organic: [] }) }));
    // @ts-expect-error - test shim
    globalThis.fetch = fetchSpy;

    await webSearch.execute(
      { query: 'hello', maxResults: 1 },
      { gmiId: 'test-gmi', personaId: 'test-persona', userContext: { userId: 'test-user' } }
    );

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://google.serper.dev/search',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-API-KEY': 'test-serper-key' }),
      })
    );
  });

  it('should handle basePriority offset', async () => {
    const manifest = await createCuratedManifest({
      channels: 'none',
      tools: 'none',
      basePriority: 100,
    });
    expect(manifest.packs).toEqual([]);
  });
});

describe('getAvailableExtensions', () => {
  it('should return an array', async () => {
    const extensions = await getAvailableExtensions();
    expect(Array.isArray(extensions)).toBe(true);
  });
});

describe('getAvailableChannels', () => {
  it('should return an array', async () => {
    const channels = await getAvailableChannels();
    expect(Array.isArray(channels)).toBe(true);
  });
});
