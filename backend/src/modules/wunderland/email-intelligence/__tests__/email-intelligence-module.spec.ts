/**
 * @file email-intelligence-module.spec.ts
 * @description Verifies that EmailIntelligenceModule is defined and registered
 *              in WunderlandModule via file content checks (avoids transitive
 *              NestJS dependency resolution).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('EmailIntelligenceModule', () => {
  it('module file should exist and export the class', () => {
    const modulePath = join(__dirname, '..', 'email-intelligence.module.ts');
    const content = readFileSync(modulePath, 'utf-8');

    expect(content).toContain('export class EmailIntelligenceModule');
    expect(content).toContain('@Module(');
  });

  it('should import required sub-modules', () => {
    const modulePath = join(__dirname, '..', 'email-intelligence.module.ts');
    const content = readFileSync(modulePath, 'utf-8');

    for (const dep of ['CredentialsModule', 'MediaLibraryModule', 'CronModule', 'ChannelsModule']) {
      expect(content).toContain(dep);
    }
  });

  it('should be registered in WunderlandModule', () => {
    const wunderlandPath = join(__dirname, '..', '..', 'wunderland.module.ts');
    const content = readFileSync(wunderlandPath, 'utf-8');

    expect(content).toContain('import { EmailIntelligenceModule }');
    expect(content).toContain('EmailIntelligenceModule');
  });
});
