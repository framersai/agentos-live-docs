const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const { collectHtmlFiles, getSkippedTopLevelDirs } = require('./search-manifest.js');

function writeFile(filePath, content = '<html></html>') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

test('collectHtmlFiles skips expensive top-level directories by default', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-manifest-'));

  writeFile(path.join(tmpDir, 'guides', 'index.html'));
  writeFile(path.join(tmpDir, 'blog', 'post', 'index.html'));
  writeFile(path.join(tmpDir, 'api', 'classes', 'Foo.html'));
  writeFile(path.join(tmpDir, 'paracosm', 'interfaces', 'Bar.html'));
  writeFile(path.join(tmpDir, 'assets', 'ignored.html'));

  const files = collectHtmlFiles(tmpDir).map((file) => path.relative(tmpDir, file)).sort();

  assert.deepEqual(files, ['blog/post/index.html', 'guides/index.html']);
});

test('collectHtmlFiles accepts extra skipped directories via environment', () => {
  const previous = process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS;
  process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS = 'guides';

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-manifest-'));
  writeFile(path.join(tmpDir, 'guides', 'index.html'));
  writeFile(path.join(tmpDir, 'reference', 'index.html'));

  const files = collectHtmlFiles(tmpDir).map((file) => path.relative(tmpDir, file)).sort();
  assert.deepEqual(files, ['reference/index.html']);

  if (previous === undefined) {
    delete process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS;
  } else {
    process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS = previous;
  }
});

test('getSkippedTopLevelDirs merges defaults with environment additions', () => {
  const previous = process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS;
  process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS = 'guides,reference';

  const skippedDirs = Array.from(getSkippedTopLevelDirs()).sort();

  assert.deepEqual(skippedDirs, [
    '__server',
    'api',
    'assets',
    'guides',
    'paracosm',
    'reference',
  ]);

  if (previous === undefined) {
    delete process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS;
  } else {
    process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS = previous;
  }
});
