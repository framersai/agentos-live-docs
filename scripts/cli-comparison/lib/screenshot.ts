/**
 * ANSI -> HTML -> PNG screenshot pipeline.
 * Adapted from packages/wunderland/src/cli/export/ with product-branded headers.
 */

import Convert from 'ansi-to-html';
import type { CliProduct } from './types.js';

// Color palettes
const WUNDERLAND_HEX = {
  purple: '#a855f7',
  cyan: '#06b6d4',
  brightCyan: '#22d3ee',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#f59e0b',
  magenta: '#e879f9',
  muted: '#6b7280',
  dim: '#4b5563',
  white: '#f9fafb',
  bg: '#0a0a0f',
};

const OPENCLAW_HEX = {
  purple: '#6366f1',
  cyan: '#3b82f6',
  brightCyan: '#60a5fa',
  green: '#22c55e',
  red: '#ef4444',
  gold: '#f59e0b',
  magenta: '#a78bfa',
  muted: '#6b7280',
  dim: '#4b5563',
  white: '#f9fafb',
  bg: '#0c0c14',
};

const BRAND = {
  openclaw: {
    name: 'OpenClaw',
    accent: '#3b82f6', // blue
    cmdBg: '#0f172a',
    hex: OPENCLAW_HEX,
    watermark: 'openclaw.ai',
  },
  wunderland: {
    name: 'Wunderland',
    accent: '#a855f7', // purple
    cmdBg: '#161b22',
    hex: WUNDERLAND_HEX,
    watermark: 'wunderland.sh',
  },
} as const;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface ScreenshotOptions {
  product: CliProduct;
  commandHeader?: string;
  width?: number;
  watermark?: boolean;
}

/**
 * Convert ANSI terminal output to a full HTML document with branded header.
 */
export function ansiToHtml(ansi: string, opts: ScreenshotOptions): string {
  const brand = BRAND[opts.product];
  const hex = brand.hex;
  const width = opts.width ?? 600;
  const font = "'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace";

  const converter = new Convert({
    fg: hex.white,
    bg: hex.bg,
    newline: true,
    escapeXML: true,
    colors: {
      0: '#1a1a2e',
      1: hex.red,
      2: hex.green,
      3: hex.gold,
      4: hex.cyan,
      5: hex.magenta,
      6: hex.brightCyan,
      7: hex.white,
      8: hex.dim,
      9: '#ff6b6b',
      10: '#4ade80',
      11: '#fbbf24',
      12: '#38bdf8',
      13: hex.magenta,
      14: hex.brightCyan,
      15: '#ffffff',
    } as any,
  });

  const htmlContent = converter.toHtml(ansi);

  const watermark =
    opts.watermark !== false ? `<div class="watermark">${brand.watermark}</div>` : '';

  const cmdHeader = opts.commandHeader
    ? `<div class="cmd-bar">
  <span class="cmd-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></span>
  <span class="product-badge">${brand.name}</span>
  <span class="cmd-text">${escapeHtml(opts.commandHeader)}</span>
</div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: ${hex.bg};
    color: ${hex.white};
    font-family: ${font};
    font-size: 13px;
    line-height: 1.5;
    width: ${width}px;
    min-height: 100px;
    -webkit-font-smoothing: antialiased;
  }
  .cmd-bar {
    background: ${brand.cmdBg};
    border-bottom: 2px solid ${brand.accent};
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 8px 8px 0 0;
  }
  .cmd-dots { display: flex; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-red { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green { background: #28c840; }
  .product-badge {
    background: ${brand.accent};
    color: white;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .cmd-text {
    color: ${hex.brightCyan};
    font-size: 12px;
    font-family: ${font};
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
  .watermark {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid ${hex.dim};
    color: ${hex.muted};
    font-size: 10px;
    text-align: right;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>
${cmdHeader}
<div class="content">
<pre>${htmlContent}</pre>
${watermark}
</div>
</body>
</html>`;
}

/**
 * Render HTML string to PNG via Playwright.
 */
export async function renderPng(html: string, outputPath: string, width = 600): Promise<void> {
  const { chromium } = await import('playwright-core');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    throw new Error('No Chromium found. Run: npx playwright install chromium');
  }

  try {
    const context = await browser.newContext({
      viewport: { width, height: 100 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });

    const bodyHeight = (await page.evaluate('document.body.scrollHeight')) as number;
    await page.setViewportSize({ width, height: bodyHeight + 20 });

    await page.screenshot({ path: outputPath, fullPage: true, type: 'png' });
  } finally {
    await browser.close();
  }
}

/**
 * Take a branded screenshot from ANSI content.
 */
export async function screenshotAnsi(
  ansi: string,
  outputPath: string,
  opts: ScreenshotOptions
): Promise<void> {
  const html = ansiToHtml(ansi, opts);
  await renderPng(html, outputPath, opts.width ?? 600);
}
