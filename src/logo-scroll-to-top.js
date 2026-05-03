/**
 * logo-scroll-to-top.js — clicking the navbar logo always lands the
 * user at the top of the home page, regardless of where they were
 * scrolled.
 *
 * Two distinct cases to cover:
 *
 *  1. Already on `/` (or the locale root). The router no-ops on the
 *     navigation, so without intervention the page stays scrolled
 *     wherever it was. We preventDefault + scroll instantly.
 *
 *  2. On a sub-page (e.g. /features/cognitive-memory) and scrolled
 *     down. Clicking the logo navigates to `/`. Docusaurus generally
 *     scrolls the destination to the top, but the browser's
 *     `history.scrollRestoration` default of `auto` can race with the
 *     route change and restore a stale scroll offset on history-style
 *     transitions. We let the navigation happen, then schedule a
 *     scrollTo(0) after the route transition.
 *
 * We bind a single delegated click listener on document. Modifier keys
 * (cmd/ctrl/shift/alt) skip the handler so "open in new tab" / "open
 * in new window" still work as expected.
 *
 * Runs only in the browser; Docusaurus invokes clientModules on both
 * server and client renders, so we guard with `typeof window`.
 */
if (typeof window !== 'undefined') {
  document.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    const link = event.target.closest('a.navbar__brand');
    if (!link) return;

    let targetPath;
    try {
      targetPath = new URL(link.href, window.location.origin).pathname;
    } catch {
      return;
    }

    const here = window.location.pathname;
    const sameRoute =
      targetPath === here ||
      targetPath + '/' === here ||
      targetPath === here + '/';

    if (sameRoute) {
      // Same-route: router will no-op, so suppress the click and
      // scroll ourselves with smooth animation for a "reset" feel.
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Cross-route: let the navigation happen, then force the
      // destination to start at the top. Two rAFs to land after
      // react-router's commit + Docusaurus's scroll handler.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'auto' });
        });
      });
    }
  });
}
