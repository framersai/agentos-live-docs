/* eslint-disable no-undef */
/**
 * @fileoverview Docusaurus postBuild plugin — generates a lightweight
 * `search-docs.json` manifest for the agentos.sh marketing-site DocSearch.
 *
 * The `@easyops-cn/docusaurus-search-local` plugin outputs a ~16 MB serialised
 * lunr index that is unusable for a simple fetch-and-filter search.  This plugin
 * walks every `index.html` in the build output, extracts the first ~500 chars of
 * article text, and writes a compact JSON array (~50-100 KB) that the marketing
 * site can fetch and search against without pulling the full lunr index.
 *
 * Output format:
 * ```json
 * [{ "t": "Page Title", "u": "/features/cognitive-memory", "c": "first 500 chars …" }]
 * ```
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SKIPPED_TOP_LEVEL_DIRS = new Set(['assets', '__server', 'api', 'paracosm']);
const NON_CONTENT_BLOCK_RE = /<(script|style|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi;
const HTML_TOKEN_RE = /<[^>]+>|&#x([0-9a-f]+);|&#(\d+);|&([a-z]+);|\s+/gi;

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '-',
  mdash: '-',
  hellip: '...',
};

/** Recursively collect every .html file under `dir`, skipping assets/server dirs. */
function getSkippedTopLevelDirs() {
  const raw = process.env.AGENTOS_DOCS_SEARCH_MANIFEST_SKIP_DIRS ?? '';
  const extraDirs = raw
    .split(',')
    .map((dir) => dir.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_SKIPPED_TOP_LEVEL_DIRS, ...extraDirs]);
}

/** Recursively collect every .html file under `dir`, skipping configured top-level dirs. */
function collectHtmlFiles(dir, skippedTopLevelDirs = getSkippedTopLevelDirs(), depth = 0) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (depth === 0 && skippedTopLevelDirs.has(entry.name)) continue;
      results.push(...collectHtmlFiles(full, skippedTopLevelDirs, depth + 1));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

/** Strip HTML tags and collapse whitespace. */
function stripTags(html) {
  return html
    .replace(NON_CONTENT_BLOCK_RE, ' ')
    .replace(HTML_TOKEN_RE, (_match, hex, dec, entity) => {
      if (hex) return decodeCodePoint(parseInt(hex, 16));
      if (dec) return decodeCodePoint(parseInt(dec, 10));
      if (entity) return NAMED_ENTITIES[entity.toLowerCase()] ?? ' ';
      return ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeCodePoint(value) {
  if (!Number.isFinite(value) || value <= 0) return ' ';
  try {
    return String.fromCodePoint(value);
  } catch {
    return ' ';
  }
}

function searchManifestPlugin(_context, _options) {
  return {
    name: 'search-manifest',

    async postBuild({ outDir }) {
      const htmlFiles = collectHtmlFiles(outDir);
      const manifest = [];

      console.log(`[search-manifest] Indexing ${htmlFiles.length} HTML files...`);

      for (const file of htmlFiles) {
        const html = fs.readFileSync(file, 'utf-8');

        // Extract <title> (Docusaurus adds data-rh="true" attribute)
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/);
        let title = titleMatch ? titleMatch[1] : '';
        // Strip trailing " | Site Name" suffix
        title = title.replace(/\s*\|.*$/, '').trim();

        // Extract article body (Docusaurus wraps content in <article>)
        const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
        const rawText = articleMatch ? stripTags(articleMatch[1]) : '';
        const excerpt = rawText.slice(0, 500);

        // Derive URL path from file path relative to outDir
        let url;
        if (file.endsWith('/index.html') || file.endsWith('\\index.html')) {
          url = '/' + path.relative(outDir, path.dirname(file)).replace(/\\/g, '/');
        } else {
          // standalone .html file (e.g. cognitive-memory.html)
          url =
            '/' +
            path
              .relative(outDir, file)
              .replace(/\\/g, '/')
              .replace(/\.html$/, '');
        }
        if (url === '/.') url = '/';

        // Skip 404, search, and empty pages
        if (!title || url.includes('/404') || url.includes('/search')) continue;
        // Skip TypeDoc individual member pages (too granular)
        if (url.match(/\/api\/(classes|interfaces|enums|functions|variables|type-aliases)\//))
          continue;

        manifest.push({ t: title, u: url, c: excerpt });
      }

      // De-duplicate by URL (index.html and standalone .html may overlap)
      const seen = new Set();
      const deduped = manifest.filter((entry) => {
        if (seen.has(entry.u)) return false;
        seen.add(entry.u);
        return true;
      });

      // Sort alphabetically by title for deterministic output
      deduped.sort((a, b) => a.t.localeCompare(b.t));

      const outPath = path.join(outDir, 'search-docs.json');
      const json = JSON.stringify(deduped);
      fs.writeFileSync(outPath, json);

      console.log(
        `[search-manifest] Wrote ${deduped.length} entries to search-docs.json (${(Buffer.byteLength(json) / 1024).toFixed(1)} KB)`
      );
    },
  };
}

module.exports = searchManifestPlugin;
module.exports.collectHtmlFiles = collectHtmlFiles;
module.exports.getSkippedTopLevelDirs = getSkippedTopLevelDirs;
module.exports.stripTags = stripTags;
