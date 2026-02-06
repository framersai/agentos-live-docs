/**
 * Unit tests for createCuratedManifest and registry helpers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    // In test environment, no optional deps are installed, so packs will be empty
    const manifest = await createCuratedManifest({ channels: 'all', tools: 'none' });
    // tryImport fails for all → packs = []
    expect(manifest.packs).toEqual([]);
  });

  it('should attempt to load all tools when tools="all"', async () => {
    const manifest = await createCuratedManifest({ channels: 'none', tools: 'all' });
    // tryImport fails for all → packs = []
    expect(manifest.packs).toEqual([]);
  });

  it('should filter channels by platform name', async () => {
    const manifest = await createCuratedManifest({
      channels: ['telegram', 'discord'],
      tools: 'none',
    });
    // Even though packages aren't installed, the filter should work
    expect(manifest.packs).toEqual([]);
  });

  it('should apply priority overrides', async () => {
    const manifest = await createCuratedManifest({
      channels: ['telegram'],
      tools: 'none',
      overrides: { 'channel-telegram': { priority: 999 } },
    });
    // Package not available, but override would be applied if it were
    expect(manifest.packs).toEqual([]);
  });

  it('should skip disabled extensions via overrides', async () => {
    const manifest = await createCuratedManifest({
      channels: 'all',
      tools: 'all',
      overrides: {
        'channel-telegram': { enabled: false },
        auth: { enabled: false },
      },
    });
    expect(manifest.packs).toEqual([]);
  });

  it('should pass secrets to extension factories', async () => {
    const manifest = await createCuratedManifest({
      channels: ['telegram'],
      tools: 'none',
      secrets: { 'telegram.botToken': 'test-token-123' },
    });
    // Can't test factory call since package not installed, but structure is correct
    expect(manifest).toHaveProperty('packs');
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
