/**
 * Global click-to-zoom viewer for diagrams in Docusaurus.
 *
 * Catches:
 * - Inline Mermaid SVGs rendered by @docusaurus/theme-mermaid
 * - <img> tags pointing at /img/diagrams/*.svg (hand-crafted hero SVGs)
 *
 * Features:
 * - Click any diagram to open full-screen modal
 * - Default zoom: 100%
 * - +/- zoom controls (10% steps, range 50%-400%)
 * - Mouse wheel zoom
 * - Pan with click-drag
 * - Reset button returns to 100%
 * - Close: X button, Escape key, click backdrop
 *
 * Loaded as a Docusaurus clientModule.
 *
 * @module mermaid-zoom
 */

if (typeof window !== 'undefined') {
  let modal = null;
  let currentZoom = 100;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;

  const MIN_ZOOM = 50;
  const MAX_ZOOM = 400;
  const DEFAULT_ZOOM = 100;
  const ZOOM_STEP = 10;

  function getModal() {
    if (modal) return modal;

    /* ---- Backdrop ---- */
    modal = document.createElement('div');
    modal.id = 'mermaid-zoom-modal';
    Object.assign(modal.style, {
      position: 'fixed', inset: '0', zIndex: '99999',
      background: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(8px)',
      display: 'none', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    });

    /* ---- Toolbar ---- */
    const toolbar = document.createElement('div');
    Object.assign(toolbar.style, {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)',
      borderRadius: '8px', marginBottom: '0.75rem', userSelect: 'none',
    });

    const btnStyle = {
      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer',
      color: '#fff', fontSize: '0.85rem', fontWeight: '600',
      transition: 'background 0.15s',
    };

    const zoomOut = document.createElement('button');
    zoomOut.textContent = '−';
    zoomOut.title = 'Zoom out';
    Object.assign(zoomOut.style, btnStyle);
    zoomOut.addEventListener('click', () => setZoom(currentZoom - ZOOM_STEP));
    zoomOut.addEventListener('mouseenter', () => zoomOut.style.background = 'rgba(255,255,255,0.2)');
    zoomOut.addEventListener('mouseleave', () => zoomOut.style.background = 'rgba(255,255,255,0.1)');

    const zoomLabel = document.createElement('span');
    zoomLabel.id = 'mermaid-zoom-label';
    Object.assign(zoomLabel.style, {
      color: '#fff', fontSize: '0.8rem', minWidth: '3.5rem',
      textAlign: 'center', fontFamily: 'monospace',
    });
    zoomLabel.textContent = '100%';

    const zoomIn = document.createElement('button');
    zoomIn.textContent = '+';
    zoomIn.title = 'Zoom in';
    Object.assign(zoomIn.style, btnStyle);
    zoomIn.addEventListener('click', () => setZoom(currentZoom + ZOOM_STEP));
    zoomIn.addEventListener('mouseenter', () => zoomIn.style.background = 'rgba(255,255,255,0.2)');
    zoomIn.addEventListener('mouseleave', () => zoomIn.style.background = 'rgba(255,255,255,0.1)');

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.title = 'Reset to 100%';
    Object.assign(resetBtn.style, { ...btnStyle, marginLeft: '0.25rem' });
    resetBtn.addEventListener('click', () => { setZoom(DEFAULT_ZOOM); panX = 0; panY = 0; applyTransform(); });
    resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(255,255,255,0.2)');
    resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(255,255,255,0.1)');

    const sep = document.createElement('span');
    Object.assign(sep.style, { width: '1px', height: '1.2rem', background: 'rgba(255,255,255,0.2)', margin: '0 0.25rem' });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.title = 'Close (Escape)';
    Object.assign(closeBtn.style, { ...btnStyle, marginLeft: '0.5rem' });
    closeBtn.addEventListener('click', () => hideModal());
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,0.2)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.1)');

    toolbar.append(zoomOut, zoomLabel, zoomIn, resetBtn, sep.cloneNode(), closeBtn);

    /* ---- SVG container ---- */
    /* Background follows Docusaurus' data-theme (applied in showModal via
     * applyThemeToModal). We also set color-scheme so inlined SVGs that use
     * @media (prefers-color-scheme) inside their own <style> blocks resolve
     * against this property rather than the OS preference. The combination
     * keeps modal background and SVG render mode aligned even when the OS
     * scheme and the Docusaurus toggle disagree. */
    const container = document.createElement('div');
    container.id = 'mermaid-zoom-container';
    Object.assign(container.style, {
      overflow: 'hidden', borderRadius: '12px',
      maxWidth: '95vw', maxHeight: 'calc(90vh - 4rem)',
      width: '100%', cursor: 'grab', position: 'relative',
    });

    const svgWrap = document.createElement('div');
    svgWrap.id = 'mermaid-zoom-svg-wrap';
    Object.assign(svgWrap.style, {
      transformOrigin: '0 0', transition: 'transform 0.1s ease-out',
      padding: '2rem',
    });
    container.appendChild(svgWrap);

    /* Pan handlers */
    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isPanning = true;
      panStartX = e.clientX - panX;
      panStartY = e.clientY - panY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      panX = e.clientX - panStartX;
      panY = e.clientY - panStartY;
      applyTransform();
    });
    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = 'grab';
      }
    });

    /* Mouse wheel zoom */
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom(currentZoom + delta);
    }, { passive: false });

    modal.append(toolbar, container);
    document.body.appendChild(modal);

    /* Click backdrop to close */
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    return modal;
  }

  function applyTransform() {
    const wrap = document.getElementById('mermaid-zoom-svg-wrap');
    if (wrap) {
      const scale = currentZoom / 100;
      wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }
  }

  function setZoom(value) {
    currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
    const label = document.getElementById('mermaid-zoom-label');
    if (label) label.textContent = currentZoom + '%';
    applyTransform();
  }

  /* Apply Docusaurus theme to the modal container + svgWrap so the modal
   * background matches the page UI and any inlined SVG resolves its own
   * @media (prefers-color-scheme) queries against the modal's color-scheme,
   * not against the OS preference. This is what fixes the
   * "light modal · dark-rendered SVG" mismatch when the user toggles
   * Docusaurus' dark theme while the OS is set to light (or vice-versa). */
  function applyThemeToModal() {
    const container = document.getElementById('mermaid-zoom-container');
    const svgWrap = document.getElementById('mermaid-zoom-svg-wrap');
    if (!container) return;
    const dsTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = dsTheme === 'dark';
    container.style.background = isDark ? '#0f172a' : '#ffffff';
    container.style.colorScheme = isDark ? 'dark' : 'light';
    if (svgWrap) svgWrap.style.colorScheme = isDark ? 'dark' : 'light';
  }

  function showModal(node) {
    const m = getModal();
    const wrap = document.getElementById('mermaid-zoom-svg-wrap');

    /* Reset state */
    currentZoom = DEFAULT_ZOOM;
    panX = 0;
    panY = 0;

    /* Clear any prior content (svg or img) */
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

    /* Match modal background + color-scheme to Docusaurus theme. */
    applyThemeToModal();

    /* For <img> sources we fetch and inline the SVG so its @media queries
     * resolve against the modal's color-scheme (which we just set above)
     * instead of the OS preference. Browsers loading SVG via <img> use the
     * OS color-scheme regardless of document context, so a user with OS=dark
     * and Docusaurus=light would otherwise see dark-mode SVG colors on a
     * light modal — the unreadable result the user reported. Inlining means
     * the SVG's internal @media (prefers-color-scheme) now follows the
     * modal's color-scheme CSS property and produces matching contrast. */
    if (node.tagName === 'IMG' && node.src) {
      /* Show a placeholder clone immediately so the modal isn't empty
       * during the fetch round-trip. The inline replacement happens once
       * the SVG body arrives. */
      const placeholder = node.cloneNode(true);
      placeholder.style.width = '100%';
      placeholder.style.height = 'auto';
      placeholder.style.display = 'block';
      placeholder.removeAttribute('width');
      placeholder.removeAttribute('height');
      placeholder.style.borderRadius = '0';
      placeholder.style.margin = '0';
      placeholder.style.pointerEvents = 'none';
      placeholder.style.opacity = '0.4';
      wrap.appendChild(placeholder);

      fetch(node.src)
        .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
        .then((svgText) => {
          /* Same-origin SVG only — security guard on parsed content. */
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = doc.querySelector('svg');
          if (!svgEl) return;
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.display = 'block';
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.style.pointerEvents = 'none';
          /* Swap placeholder for inlined SVG. */
          while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
          wrap.appendChild(svgEl);
        })
        .catch(() => {
          /* Fetch failed (likely CORS) — keep the placeholder, restore
           * full opacity so the user still sees something. */
          placeholder.style.opacity = '1';
        });
    } else {
      /* Mermaid SVG already lives in the document — clone it as before. */
      const clone = node.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.style.display = 'block';
      clone.removeAttribute('width');
      clone.removeAttribute('height');
      clone.style.borderRadius = '0';
      clone.style.margin = '0';
      clone.style.pointerEvents = 'none';
      wrap.appendChild(clone);
    }

    /* Update label */
    const label = document.getElementById('mermaid-zoom-label');
    if (label) label.textContent = DEFAULT_ZOOM + '%';

    applyTransform();
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      isPanning = false;
    }
  }

  /* Escape closes */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
    if (!modal || modal.style.display === 'none') return;
    if (e.key === '+' || e.key === '=') setZoom(currentZoom + ZOOM_STEP);
    if (e.key === '-' || e.key === '_') setZoom(currentZoom - ZOOM_STEP);
    if (e.key === '0') { setZoom(DEFAULT_ZOOM); panX = 0; panY = 0; applyTransform(); }
  });

  /* Delegated click on any mermaid SVG or hero diagram <img> */
  document.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;

    const svg = e.target.closest('.docusaurus-mermaid-container svg, [class*="mermaid"] svg');
    if (svg) {
      e.preventDefault();
      e.stopPropagation();
      showModal(svg);
      return;
    }

    /* Hand-crafted hero diagrams. Docusaurus' markdown img loader either
     * inlines small SVGs as data:image/svg+xml URIs OR copies the file
     * to /assets/images/<name>-<hash>.svg via webpack, so the original
     * /img/diagrams/ path is gone by the time the img reaches the DOM.
     * Match all three forms. */
    const img = e.target.closest(
      'img[src*="/img/diagrams/"], ' +
      'img[src^="data:image/svg+xml"], ' +
      'img[src*="/assets/images/"][src$=".svg"]'
    );
    if (img) {
      e.preventDefault();
      e.stopPropagation();
      showModal(img);
      return;
    }
  });

  /* Cursor + hover styles for both diagram surfaces, plus the modal background */
  const style = document.createElement('style');
  style.textContent = `
    .docusaurus-mermaid-container svg,
    [class*="mermaid"] svg,
    img[src*="/img/diagrams/"],
    img[src^="data:image/svg+xml"],
    img[src*="/assets/images/"][src$=".svg"] {
      cursor: zoom-in;
      transition: opacity 0.15s ease, box-shadow 0.15s ease;
      border-radius: 8px;
    }
    .docusaurus-mermaid-container svg:hover,
    [class*="mermaid"] svg:hover,
    img[src*="/img/diagrams/"]:hover,
    img[src^="data:image/svg+xml"]:hover,
    img[src*="/assets/images/"][src$=".svg"]:hover {
      opacity: 0.92;
      box-shadow: 0 0 0 2px var(--ifm-color-primary-light, #6366f1);
    }

    /* Zoom-hint wrapper. The script wraps every diagram img/svg in this
     * container on init so we can render a persistent corner badge that
     * says the image is interactive. The badge is pointer-events: none
     * so clicks fall through to the delegated zoom handler. */
    .mer-zoom-wrap {
      position: relative;
      display: inline-block;
      max-width: 100%;
      line-height: 0;
    }
    .mer-zoom-wrap > img,
    .mer-zoom-wrap > svg {
      display: block;
      max-width: 100%;
      height: auto;
    }
    .mer-zoom-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.55rem;
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
      color: #ffffff;
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(4px);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.02em;
      opacity: 0.85;
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .mer-zoom-wrap:hover .mer-zoom-badge {
      opacity: 1;
      transform: scale(1.04);
    }
    [data-theme='light'] .mer-zoom-badge {
      background: rgba(99, 102, 241, 0.92);
    }

    /* Mermaid containers get the same hint via ::after pseudo. The container
     * already has position: relative from Docusaurus theme styles. */
    .docusaurus-mermaid-container[data-mer-zoom-hint] {
      position: relative;
    }
    .docusaurus-mermaid-container[data-mer-zoom-hint]::after {
      content: '⊕ Click to expand';
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0.3rem 0.55rem;
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
      color: #ffffff;
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(4px);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.02em;
      opacity: 0.85;
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .docusaurus-mermaid-container[data-mer-zoom-hint]:hover::after {
      opacity: 1;
      transform: scale(1.04);
    }
    [data-theme='light'] .docusaurus-mermaid-container[data-mer-zoom-hint]::after {
      background: rgba(99, 102, 241, 0.92);
    }

    /* Modal canvas background: fallback only. The actual background is set
     * via JS in applyThemeToModal() based on Docusaurus' data-theme so the
     * modal matches the page UI regardless of OS prefers-color-scheme. */
    #mermaid-zoom-container {
      background: #ffffff;
    }
    [data-theme='dark'] #mermaid-zoom-container {
      background: #0f172a;
    }
  `;
  document.head.appendChild(style);

  /* Wrap each diagram image in a relative container with a persistent
   * "Click to expand" badge. The badge can't live as a sibling alone
   * because the img sits inside a markdown <p>, and CSS can't position
   * an arbitrary element relative to an inline img. So we wrap.
   *
   * Mermaid SVGs are skipped here — they already live inside
   * .docusaurus-mermaid-container which has its own layout assumptions;
   * the corner badge for those is rendered via ::after on the container
   * in mermaid-theme.js styles (see below). */
  function wrapDiagrams() {
    const candidates = document.querySelectorAll(
      'img[src*="/img/diagrams/"]:not([data-mer-wrapped]), ' +
      'img[src^="data:image/svg+xml"]:not([data-mer-wrapped]), ' +
      'img[src*="/assets/images/"][src$=".svg"]:not([data-mer-wrapped])'
    );
    candidates.forEach((node) => {
      if (node.dataset && node.dataset.merWrapped) return;
      /* Skip if already inside a wrap (defensive against double-mount). */
      if (node.parentElement && node.parentElement.classList.contains('mer-zoom-wrap')) {
        node.dataset.merWrapped = '1';
        return;
      }
      const wrap = document.createElement('span');
      wrap.className = 'mer-zoom-wrap';
      node.parentNode.insertBefore(wrap, node);
      wrap.appendChild(node);
      const badge = document.createElement('span');
      badge.className = 'mer-zoom-badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-1px"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>Click to expand';
      wrap.appendChild(badge);
      node.dataset.merWrapped = '1';
    });
    /* Mermaid containers: add a corner badge via class flip so the existing
     * container layout stays intact. The CSS adds the badge with ::after. */
    document.querySelectorAll('.docusaurus-mermaid-container:not([data-mer-zoom-hint])').forEach((c) => {
      c.dataset.merZoomHint = '1';
    });
  }

  if (document.readyState !== 'loading') {
    wrapDiagrams();
  } else {
    document.addEventListener('DOMContentLoaded', wrapDiagrams);
  }
  /* Catch images that mount after first paint (lazy-rendered docs pages,
   * client-side route transitions, Mermaid re-renders). */
  const wrapObserver = new MutationObserver(() => wrapDiagrams());
  if (typeof document !== 'undefined' && document.body) {
    wrapObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      wrapObserver.observe(document.body, { childList: true, subtree: true });
    });
  }
}
