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

/** Recursively collect every .html file under `dir`, skipping assets/server dirs. */
function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip non-content directories
      if (entry.name === 'assets' || entry.name === '__server') continue;
      results.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

/** Strip HTML tags and collapse whitespace. */
function stripTags(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/&\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = function searchManifestPlugin(_context, _options) {
  return {
    name: 'search-manifest',

    async postBuild({ outDir }) {
      const htmlFiles = collectHtmlFiles(outDir);
      const manifest = [];

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
      fs.writeFileSync(outPath, JSON.stringify(deduped));

      console.log(
        `[search-manifest] Wrote ${deduped.length} entries to search-docs.json (${(Buffer.byteLength(JSON.stringify(deduped)) / 1024).toFixed(1)} KB)`
      );
    },
  };
};
