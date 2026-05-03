#!/usr/bin/env node
/**
 * inject-sitemap-stylesheet.mjs — patch the Docusaurus-generated sitemap
 * to reference our XSL stylesheet so browsers render it as a styled
 * table instead of a wall of raw XML.
 *
 * Modern Chrome (100+) stopped auto-rendering XML as a tree view, so a
 * sitemap without `<?xml-stylesheet?>` shows up as monospaced text and
 * humans report "the sitemap looks like plaintext, not XML". Google
 * still parses the underlying XML — the directive only affects browser
 * rendering.
 *
 * Sitemaps must start with the XML declaration, so we splice the
 * stylesheet directive AFTER it.
 *
 * @docusaurus/plugin-sitemap doesn't expose a transform hook for this,
 * so we patch the file post-build.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const buildDir = path.resolve(process.cwd(), 'build');
const sitemapPath = path.join(buildDir, 'sitemap.xml');

async function run() {
  let xml;
  try {
    xml = await fs.readFile(sitemapPath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('[inject-sitemap-stylesheet] No sitemap.xml in build/ — skipping.');
      return;
    }
    throw error;
  }

  if (xml.includes('<?xml-stylesheet')) {
    console.log('[inject-sitemap-stylesheet] Stylesheet directive already present — skipping.');
    return;
  }

  // The XML declaration is required to be first, so splice after it.
  const patched = xml.replace(
    /(<\?xml[^?]*\?>)/,
    '$1\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
  );

  await fs.writeFile(sitemapPath, patched, 'utf-8');
  console.log('[inject-sitemap-stylesheet] Injected <?xml-stylesheet?> directive into sitemap.xml');
}

run().catch((error) => {
  console.error('[inject-sitemap-stylesheet] Fatal error:', error);
  process.exit(1);
});
