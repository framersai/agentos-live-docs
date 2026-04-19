import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const MONO_ROOT = resolve(ROOT, '..');
const require = createRequire(import.meta.url);

test('publication manifest exists and canonicalizes the skills section', () => {
  const manifestPath = resolve(MONO_ROOT, 'packages/agentos/docs/publication-manifest.cjs');
  assert.equal(existsSync(manifestPath), true);

  const { publicationManifest } = require(manifestPath);
  const byDestination = new Map(publicationManifest.map((entry) => [entry.dest, entry]));

  assert.equal(byDestination.has('skills/overview.md'), true);
  assert.equal(
    byDestination.get('skills/overview.md')?.sourcePath,
    'packages/agentos/docs/SKILLS_OVERVIEW.md',
  );
  assert.equal(byDestination.has('skills/agentos-skills.md'), true);
  assert.equal(byDestination.has('skills/skills-extension.md'), false);
});

test('publication inventory rejects duplicate destinations and missing sources', () => {
  const manifestPath = resolve(MONO_ROOT, 'packages/agentos/docs/publication-manifest.cjs');
  const { buildPublicationInventory } = require(manifestPath);
  const inventory = buildPublicationInventory(MONO_ROOT);

  assert.deepEqual(inventory.duplicates, []);
  assert.deepEqual(inventory.missingSources, []);
  assert.equal(inventory.generatedDestinations.includes('getting-started/high-level-api.md'), true);
});

test('publication manifest covers the full public docs surface, including static and built-in pages', () => {
  const manifestPath = resolve(MONO_ROOT, 'packages/agentos/docs/publication-manifest.cjs');
  const { publicationManifest } = require(manifestPath);
  const byDestination = new Map(publicationManifest.map((entry) => [entry.dest, entry]));

  assert.equal(
    byDestination.get('architecture/skills-vs-tools-vs-extensions.md')?.sourcePath,
    'apps/agentos-live-docs/docs/architecture/skills-vs-tools-vs-extensions.md',
  );
  assert.equal(
    byDestination.get('features/video-pipeline.md')?.sourcePath,
    'apps/agentos-live-docs/static-docs/features/video-pipeline.md',
  );
  assert.equal(
    byDestination.get('features/llm-output-validation.md')?.sourcePath,
    'apps/agentos-live-docs/docs/features/llm-output-validation.md',
  );
  assert.equal(
    byDestination.get('extensions/built-in/code-safety.md')?.sourcePath,
    'apps/agentos-live-docs/static-docs/extensions/built-in/code-safety.md',
  );
  assert.equal(byDestination.has('extensions/built-in/content-policy-rewriter.md'), true);
  assert.equal(byDestination.has('extensions/built-in/local-file-search.md'), true);
});

test('publication inventory script resolves the monorepo root correctly', () => {
  execFileSync('node', ['packages/agentos/scripts/build-publication-inventory.mjs'], {
    cwd: MONO_ROOT,
    stdio: 'pipe',
  });
});

test('guide sidebar is derived from the canonical manifest', () => {
  const manifestPath = resolve(MONO_ROOT, 'packages/agentos/docs/publication-manifest.cjs');
  const { buildGuideSidebar } = require(manifestPath);
  const items = buildGuideSidebar();
  const serialized = JSON.stringify(items);

  assert.match(serialized, /skills\/agentos-skills/);
  assert.doesNotMatch(serialized, /skills\/skills-extension/);
  assert.match(serialized, /getting-started\/high-level-api/);
  assert.match(serialized, /Official Extensions/);
  assert.match(serialized, /extensions\/built-in\/code-safety/);
  assert.match(serialized, /features\/video-pipeline/);
  assert.match(serialized, /architecture\/skills-vs-tools-vs-extensions/);
});

test('pull-docs publishes the canonical skills content routes', () => {
  execFileSync('node', ['scripts/pull-docs.mjs'], {
    cwd: resolve(MONO_ROOT, 'apps/agentos-live-docs'),
    stdio: 'pipe',
  });

  assert.equal(
    existsSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docs/skills/agentos-skills.md')),
    true,
  );
  assert.equal(
    existsSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docs/skills/skills-extension.md')),
    false,
  );
  assert.equal(
    existsSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docs/extensions/built-in/code-safety.md')),
    true,
  );
  assert.equal(
    existsSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docs/superpowers/specs/2026-04-14-skills-vs-tools-vs-extensions-design.md')),
    false,
  );
});

test('public docs tree has no unmanaged markdown after sync', () => {
  const manifestPath = resolve(MONO_ROOT, 'packages/agentos/docs/publication-manifest.cjs');
  const { publicationManifest } = require(manifestPath);
  const docsRoot = resolve(MONO_ROOT, 'apps/agentos-live-docs/docs');
  const managed = new Set(publicationManifest.map((entry) => entry.dest));
  const orphans = [];

  execFileSync('node', ['scripts/pull-docs.mjs'], {
    cwd: resolve(MONO_ROOT, 'apps/agentos-live-docs'),
    stdio: 'pipe',
  });

  function walk(dir, prefix = '') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const absolute = resolve(dir, entry.name);
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        walk(absolute, relative);
        continue;
      }

      if (!entry.isFile() || !relative.endsWith('.md')) continue;
      if (relative === 'index.md') continue;

      const root = relative.split('/')[0];
      if (root === 'api' || root === 'paracosm') continue;
      if (!managed.has(relative)) orphans.push(relative);
    }
  }

  walk(docsRoot);
  assert.deepEqual(orphans.sort(), []);
});

test('pull-docs check mode detects stale generated docs', () => {
  const docsRoot = resolve(MONO_ROOT, 'apps/agentos-live-docs/docs');
  const target = resolve(docsRoot, 'skills/agentos-skills.md');
  const original = readFileSync(target, 'utf8');

  writeFileSync(target, `${original}\n<!-- drift -->\n`);

  try {
    assert.throws(() => {
      execFileSync('node', ['scripts/pull-docs.mjs', '--check'], {
        cwd: resolve(MONO_ROOT, 'apps/agentos-live-docs'),
        stdio: 'pipe',
      });
    });
  } finally {
    writeFileSync(target, original);
  }
});

test('publication verification scripts are wired into the docs packages', () => {
  const liveDocsPackage = require(resolve(MONO_ROOT, 'apps/agentos-live-docs/package.json'));
  const agentosPackage = require(resolve(MONO_ROOT, 'packages/agentos/package.json'));
  const docusaurusConfig = readFileSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docusaurus.config.ts'), 'utf8');

  assert.equal(
    liveDocsPackage.scripts['verify:publication'],
    'AGENTOS_DOCS_STRICT=1 node --test scripts/publication-contract.test.mjs scripts/pull-docs-links.test.mjs && AGENTOS_DOCS_STRICT=1 node scripts/pull-docs.mjs --check && AGENTOS_DOCS_STRICT=1 npm run build',
  );
  assert.equal(
    agentosPackage.scripts['docs:verify'],
    'node scripts/build-publication-inventory.mjs && pnpm --dir ../../ --filter @framersai/agentos-live-docs run verify:publication && npx vitest run src/api/runtime/__tests__/docs-alignment.test.ts',
  );
  assert.match(docusaurusConfig, /to: '\/skills\/overview'/);
  assert.doesNotMatch(docusaurusConfig, /skills\/skills-extension/);
});

test('production docs config throws on broken links and markdown drift', () => {
  const docusaurusConfig = readFileSync(resolve(MONO_ROOT, 'apps/agentos-live-docs/docusaurus.config.ts'), 'utf8');

  assert.match(docusaurusConfig, /onBrokenLinks:\s*strictDocs \? 'throw' : 'warn'/);
  assert.match(docusaurusConfig, /onBrokenMarkdownLinks:\s*strictDocs \? 'throw' : 'warn'/);
});
