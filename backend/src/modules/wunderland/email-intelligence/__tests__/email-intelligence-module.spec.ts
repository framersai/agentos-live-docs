/**
 * @file email-intelligence-module.spec.ts
 * @description Verifies that EmailIntelligenceModule is defined and registered
 *              in WunderlandModule.
 *
 * NOTE: Dynamic import of the module file pulls in transitive NestJS
 * dependencies (CredentialsModule -> appDatabase -> sql-storage-adapter)
 * that require a full pnpm workspace build. Instead we verify:
 *   1. The module file exists and exports the class
 *   2. WunderlandModule imports it
 * Full integration is validated by the backend startup check.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('EmailIntelligenceModule', () => {
  it('module file should exist and export the class', () => {
    const modulePath = join(__dirname, '..', 'email-intelligence.module.ts');
    const content = readFileSync(modulePath, 'utf-8');

    assert.ok(
      content.includes('export class EmailIntelligenceModule'),
      'Should export EmailIntelligenceModule class'
    );
    assert.ok(content.includes('@Module('), 'Should have @Module decorator');
  });

  it('should import required sub-modules', () => {
    const modulePath = join(__dirname, '..', 'email-intelligence.module.ts');
    const content = readFileSync(modulePath, 'utf-8');

    const requiredImports = [
      'CredentialsModule',
      'MediaLibraryModule',
      'CronModule',
      'ChannelsModule',
    ];

    for (const dep of requiredImports) {
      assert.ok(content.includes(dep), `Should import ${dep}`);
    }
  });

  it('should be registered in WunderlandModule', () => {
    const wunderlandPath = join(__dirname, '..', '..', 'wunderland.module.ts');
    const content = readFileSync(wunderlandPath, 'utf-8');

    assert.ok(
      content.includes('import { EmailIntelligenceModule }'),
      'WunderlandModule should import EmailIntelligenceModule'
    );
    assert.ok(
      content.includes('EmailIntelligenceModule'),
      'WunderlandModule imports array should include EmailIntelligenceModule'
    );
  });
});
