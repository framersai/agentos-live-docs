// inject-noindex.js — postBuild plugin that marks the auto-generated TypeDoc
// reference trees (`/api/**`, `/paracosm/**`) as `noindex, follow`.
//
// Why this exists
// ---------------
// TypeDoc emits ~1,970 member pages (interfaces, classes, functions,
// type-aliases, variables, enums + the re-exported `z`/zod namespace tree).
// That is ~93% of the route table. Google crawls them, decides they are thin
// auto-generated boilerplate, and parks them under "Discovered/Crawled —
// currently not indexed" in Search Console — which also dampens indexing of
// the authored guides by making the whole site look low-value.
//
// Removing them from the sitemap (see `sitemap.ignorePatterns` in
// docusaurus.config.ts) stops Google discovering them via the sitemap, but
// does not reclassify the ones already discovered. A server-rendered
// `noindex` does: on the next crawl Google moves each page to the intentional
// "Excluded by 'noindex' tag" bucket and drops it from the index. The two
// changes are complementary — sitemap exclusion for crawl budget, noindex for
// a clean, intentional index state.
//
// `follow` (not `nofollow`) keeps link equity flowing and lets Google keep
// discovering authored guides that the reference pages cross-link to.
//
// The section landing pages (`/api`, `/paracosm`) are deliberately preserved
// as indexable hubs: this plugin never touches the `<section>/index.html`
// file, and the sitemap globs (`/api/**`, `/paracosm/**`) do not match the
// bare landing route, so landing page and sitemap stay consistent.
//
// GitHub Pages serves no custom headers, so an `X-Robots-Tag` header is not an
// option here — the directive has to live in the HTML, which is why this runs
// as a postBuild HTML rewrite rather than a header rule.

const fs = require('fs');
const path = require('path');

/** @type {(s: string) => string} */
const ROBOTS_META = '<meta name="robots" content="noindex, follow">';
const GOOGLEBOT_META = '<meta name="googlebot" content="noindex">';

/**
 * Rewrite the robots/googlebot directives in one HTML document to noindex.
 * Returns the patched string, or null when nothing changed.
 * @param {string} html
 * @returns {string | null}
 */
function applyNoindex(html) {
  let out = html;

  // Replace whatever robots/googlebot meta the global headTags injected
  // (`index, follow, max-image-preview:large, ...`). Tolerant of attribute
  // order and single/double quotes.
  out = out.replace(
    /<meta\b[^>]*\bname=("|')robots\1[^>]*>/gi,
    ROBOTS_META,
  );
  out = out.replace(
    /<meta\b[^>]*\bname=("|')googlebot\1[^>]*>/gi,
    GOOGLEBOT_META,
  );

  // Safety net: if a page somehow shipped without a robots meta, add one.
  if (!/<meta\b[^>]*\bname=("|')robots\1[^>]*>/i.test(out)) {
    out = out.replace('</head>', `${ROBOTS_META}</head>`);
  }

  return out === html ? null : out;
}

/**
 * Recursively yield every *.html file under `dir`, skipping the directory's
 * own `index.html` (the section landing we keep indexable).
 * @param {string} dir
 * @param {string} landingIndex absolute path of the index.html to preserve
 * @returns {string[]}
 */
function collectMemberHtml(dir, landingIndex) {
  /** @type {string[]} */
  const files = [];
  /** @type {string[]} */
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name.endsWith('.html') && full !== landingIndex) {
        files.push(full);
      }
    }
  }
  return files;
}

/**
 * @param {unknown} _context
 * @param {{ dirs?: string[] }} [options]
 */
module.exports = function injectNoindexPlugin(_context, options = {}) {
  const dirs = options.dirs && options.dirs.length ? options.dirs : ['api', 'paracosm'];
  return {
    name: 'inject-noindex',
    async postBuild({ outDir }) {
      let patched = 0;
      const touchedSections = [];
      for (const dir of dirs) {
        const root = path.join(outDir, dir);
        if (!fs.existsSync(root)) continue; // guides-only builds skip api/paracosm
        const landingIndex = path.join(root, 'index.html');
        let sectionCount = 0;
        for (const file of collectMemberHtml(root, landingIndex)) {
          const next = applyNoindex(fs.readFileSync(file, 'utf8'));
          if (next !== null) {
            fs.writeFileSync(file, next);
            sectionCount += 1;
          }
        }
        if (sectionCount > 0) {
          patched += sectionCount;
          touchedSections.push(`${dir} (${sectionCount})`);
        }
      }
      if (patched > 0) {
        console.log(
          `[inject-noindex] set noindex on ${patched} reference pages: ${touchedSections.join(', ')}. Landing pages left indexable.`,
        );
      } else {
        console.log('[inject-noindex] no api/paracosm pages found (guides-only build?) — nothing to do.');
      }
    },
  };
};
