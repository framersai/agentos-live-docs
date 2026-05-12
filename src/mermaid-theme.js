/**
 * Brand-aware theming for Mermaid diagrams.
 *
 * Mermaid bakes themeVariables hex values directly into the rendered SVG's
 * inline style attributes and direct fill/stroke attributes. To make them
 * follow the Docusaurus color-mode toggle without forcing a re-render, we
 * walk every rendered Mermaid SVG once and rewrite specific brand hex
 * values to var(--mer-*) references. The vars themselves are defined in
 * src/css/custom.css and flip between light and dark values via
 * [data-theme='dark']. Color-mode toggle then repaints the diagram via CSS
 * alone — no Mermaid re-render needed.
 *
 * Loaded as a Docusaurus clientModule. Idempotent: each SVG is patched
 * once (gated by the `data-mer-patched` attribute).
 *
 * @module mermaid-theme
 */

if (typeof window !== 'undefined') {
  /**
   * Light-mode hex → CSS var name. Mermaid emits these exact values when
   * configured with the themeVariables in docusaurus.config.ts. If a hex
   * isn't in the map, it passes through unchanged.
   */
  const FILL_MAP = {
    '#ffffff': '--mer-bg',
    '#eef2ff': '--mer-primary-fill',
    '#3730a3': '--mer-primary-text',
    '#6366f1': '--mer-primary-border',
    '#f1f5f9': '--mer-secondary-fill',
    '#475569': '--mer-secondary-text',
    '#94a3b8': '--mer-line',
    '#f8fafc': '--mer-tertiary',
    '#1e293b': '--mer-text',
    '#cffafe': '--mer-input-fill',
    '#0891b2': '--mer-input-border',
    '#0e7490': '--mer-input-text',
    '#fef3c7': '--mer-data-fill',
    '#f59e0b': '--mer-data-border',
    '#92400e': '--mer-data-text',
    '#dcfce7': '--mer-output-fill',
    '#10b981': '--mer-output-border',
    '#047857': '--mer-output-text',
    '#fee2e2': '--mer-warning-fill',
    '#f43f5e': '--mer-warning-border',
    '#9f1239': '--mer-warning-text',
    '#f3e8ff': '--mer-external-fill',
    '#8b5cf6': '--mer-external-border',
    '#5b21b6': '--mer-external-text',
    // Hardcoded accent colors emitted by `classDef` directives in older
    // diagrams. Map to existing brand vars so dark mode flips them.
    '#0041ff': '--mer-primary-border', // accent class — bright blue
    '#1c1c28': '--mer-text',            // dark-card fill used by some diagrams
    '#f2f2fa': '--mer-bg',              // light text on dark cards
    '#c9a227': '--mer-data-border',     // gold accent
    '#00f5ff': '--mer-input-border',    // cyan accent
  };

  const HEX_RE = new RegExp(
    Object.keys(FILL_MAP)
      .map((h) => h.replace('#', '\\#'))
      .join('|'),
    'gi',
  );

  function patchSvgs() {
    const svgs = document.querySelectorAll(
      '.docusaurus-mermaid-container svg, [id^="mermaid-"]',
    );
    svgs.forEach((svg) => {
      if (svg.hasAttribute('data-mer-patched')) return;
      svg.setAttribute('data-mer-patched', '1');
      svg.querySelectorAll('[style]').forEach((el) => {
        const style = el.getAttribute('style');
        if (!style) return;
        const next = style.replace(HEX_RE, (m) => {
          const key = m.toLowerCase();
          const varName = FILL_MAP[key];
          return varName ? `var(${varName})` : m;
        });
        if (next !== style) el.setAttribute('style', next);
      });
      svg.querySelectorAll('[fill], [stroke]').forEach((el) => {
        ['fill', 'stroke'].forEach((attr) => {
          const v = el.getAttribute(attr);
          if (!v) return;
          const key = v.toLowerCase();
          const varName = FILL_MAP[key];
          if (varName) el.setAttribute(attr, `var(${varName})`);
        });
      });
      // Mermaid `classDef` directives are emitted as CSS rules inside an
      // inline `<style>` element on each rendered SVG. Walk those rules and
      // rewrite the same hex constants so class-based styling also flips
      // between light and dark mode.
      svg.querySelectorAll('style').forEach((styleEl) => {
        const css = styleEl.textContent;
        if (!css) return;
        const next = css.replace(HEX_RE, (m) => {
          const key = m.toLowerCase();
          const varName = FILL_MAP[key];
          return varName ? `var(${varName})` : m;
        });
        if (next !== css) styleEl.textContent = next;
      });
    });
  }

  let patchScheduled = false;
  function schedulePatch() {
    if (patchScheduled) return;
    patchScheduled = true;
    requestAnimationFrame(() => {
      patchScheduled = false;
      patchSvgs();
    });
  }

  if (document.readyState !== 'loading') {
    schedulePatch();
  } else {
    document.addEventListener('DOMContentLoaded', schedulePatch);
  }

  const observer = new MutationObserver(schedulePatch);
  observer.observe(document.body, { childList: true, subtree: true });
}
