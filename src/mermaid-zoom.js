/**
 * Global click-to-zoom for all Mermaid diagrams in Docusaurus.
 *
 * Loaded as a clientModule — attaches a delegated click handler that
 * opens any `.mermaid svg` in a full-screen modal overlay. Press Escape
 * or click outside to close.
 */

if (typeof window !== 'undefined') {
  /** Create the modal overlay (lazily, once). */
  let modal = null;

  function getModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'mermaid-zoom-modal';
    Object.assign(modal.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '99999',
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(6px)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      cursor: 'zoom-out',
    });

    const inner = document.createElement('div');
    Object.assign(inner.style, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      overflow: 'auto',
      background: 'var(--ifm-background-color, #1b1b1d)',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      position: 'relative',
    });
    inner.id = 'mermaid-zoom-inner';

    const close = document.createElement('button');
    close.textContent = '✕ Close';
    Object.assign(close.style, {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
      background: 'none',
      border: '1px solid var(--ifm-color-emphasis-300, #444)',
      borderRadius: '6px',
      padding: '0.25rem 0.75rem',
      cursor: 'pointer',
      color: 'var(--ifm-font-color-base, #fff)',
      fontSize: '0.8rem',
      zIndex: '1',
    });
    close.addEventListener('click', () => hideModal());

    inner.appendChild(close);
    modal.appendChild(inner);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    return modal;
  }

  function showModal(svgElement) {
    const m = getModal();
    const inner = document.getElementById('mermaid-zoom-inner');

    // Clone the SVG so the original stays in place
    const existing = inner.querySelector('svg');
    if (existing) existing.remove();

    const clone = svgElement.cloneNode(true);
    // Make it fill the modal
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.maxHeight = '80vh';
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    inner.appendChild(clone);

    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
  });

  // Delegated click handler — any click on a mermaid SVG opens the zoom
  document.addEventListener('click', (e) => {
    const svg = e.target.closest('.docusaurus-mermaid-container svg, [class*="mermaid"] svg');
    if (!svg) return;

    // Don't trigger on links inside the SVG
    if (e.target.closest('a')) return;

    e.preventDefault();
    e.stopPropagation();
    showModal(svg);
  });

  // Add zoom-in cursor to all mermaid diagrams
  const style = document.createElement('style');
  style.textContent = `
    .docusaurus-mermaid-container svg,
    [class*="mermaid"] svg {
      cursor: zoom-in;
      transition: opacity 0.15s ease;
    }
    .docusaurus-mermaid-container svg:hover,
    [class*="mermaid"] svg:hover {
      opacity: 0.85;
    }
  `;
  document.head.appendChild(style);
}
