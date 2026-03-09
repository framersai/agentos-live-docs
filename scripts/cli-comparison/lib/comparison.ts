/**
 * Side-by-side comparison renderer.
 * Generates HTML with two columns (OpenClaw left, Wunderland right)
 * and renders to PNG via Playwright.
 */

import type { ComparisonPair } from './types.js';
import { ansiToHtml } from './screenshot.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build a side-by-side comparison HTML document.
 */
export function buildComparisonHtml(pair: ComparisonPair): string {
  const font = "'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace";

  // Generate inner HTML for each side
  const leftHtml = pair.openclaw
    ? ansiToHtml(pair.openclaw.ansiContent, {
        product: 'openclaw',
        commandHeader: pair.openclaw.label,
        width: 600,
        watermark: false,
      })
    : null;

  const rightHtml = pair.wunderland
    ? ansiToHtml(pair.wunderland.ansiContent, {
        product: 'wunderland',
        commandHeader: pair.wunderland.label,
        width: 600,
        watermark: false,
      })
    : null;

  // Extract just the <body> content from each inner HTML
  const extractBody = (html: string) => {
    const match = html.match(/<body>([\s\S]*)<\/body>/);
    return match ? match[1] : html;
  };

  const leftBody = leftHtml
    ? extractBody(leftHtml)
    : `
    <div style="display:flex;align-items:center;justify-content:center;height:300px;color:#6b7280;font-size:14px;">
      N/A &mdash; Not available in OpenClaw
    </div>`;

  const rightBody = rightHtml
    ? extractBody(rightHtml)
    : `
    <div style="display:flex;align-items:center;justify-content:center;height:300px;color:#6b7280;font-size:14px;">
      N/A &mdash; Not available in Wunderland
    </div>`;

  const diffNotes =
    pair.differenceNotes.length > 0
      ? `<div class="diff-section">
    <div class="diff-title">Differences</div>
    <ul class="diff-list">
      ${pair.differenceNotes.map((n) => `<li>${escapeHtml(n)}</li>`).join('\n      ')}
    </ul>
  </div>`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #050508;
    color: #f9fafb;
    font-family: ${font};
    font-size: 13px;
    line-height: 1.5;
    width: 1280px;
    -webkit-font-smoothing: antialiased;
  }
  .header {
    background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%);
    border-bottom: 1px solid #30363d;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #e2e8f0;
  }
  .header-step {
    font-size: 12px;
    color: #6b7280;
    background: #1e293b;
    padding: 4px 12px;
    border-radius: 12px;
  }
  .columns {
    display: flex;
    gap: 2px;
    background: #1e293b;
  }
  .column {
    flex: 1;
    background: #0a0a0f;
    min-height: 200px;
    overflow: hidden;
  }
  .column-left .cmd-bar { border-bottom-color: #3b82f6; }
  .column-right .cmd-bar { border-bottom-color: #a855f7; }
  .diff-section {
    background: #0f172a;
    border-top: 1px solid #30363d;
    padding: 16px 24px;
  }
  .diff-title {
    font-size: 12px;
    font-weight: 600;
    color: #f59e0b;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .diff-list {
    list-style: none;
    padding: 0;
  }
  .diff-list li {
    color: #94a3b8;
    font-size: 12px;
    padding: 2px 0;
  }
  .diff-list li::before {
    content: "\\2022  ";
    color: #f59e0b;
  }
  .footer {
    background: #050508;
    border-top: 1px solid #1e293b;
    padding: 8px 24px;
    text-align: center;
    color: #4b5563;
    font-size: 10px;
  }
  /* Inherit inner HTML styles */
  .cmd-bar {
    background: #161b22;
    border-bottom: 2px solid #6b7280;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 0;
  }
  .cmd-dots { display: flex; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green { background: #28c840; }
  .product-badge {
    color: white;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .cmd-text {
    color: #22d3ee;
    font-size: 12px;
    letter-spacing: 0.3px;
  }
  .content { padding: 24px; }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
</style>
</head>
<body>
<div class="header">
  <span class="header-title">${escapeHtml(pair.label)}</span>
  <span class="header-step">${escapeHtml(pair.pairId)}</span>
</div>
<div class="columns">
  <div class="column column-left">${leftBody}</div>
  <div class="column column-right">${rightBody}</div>
</div>
${diffNotes}
<div class="footer">OpenClaw vs Wunderland CLI Comparison</div>
</body>
</html>`;
}

/**
 * Render a comparison pair to a PNG file.
 */
export async function renderComparisonPng(pair: ComparisonPair, outputPath: string): Promise<void> {
  const { chromium } = await import('playwright-core');
  const html = buildComparisonHtml(pair);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    throw new Error('No Chromium found. Run: npx playwright install chromium');
  }

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 100 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });

    const bodyHeight = (await page.evaluate('document.body.scrollHeight')) as number;
    await page.setViewportSize({ width: 1280, height: bodyHeight + 20 });

    await page.screenshot({ path: outputPath, fullPage: true, type: 'png' });
  } finally {
    await browser.close();
  }
}
