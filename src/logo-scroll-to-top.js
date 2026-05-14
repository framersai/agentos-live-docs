/**
 * logo-scroll-to-top.js — clicking the navbar logo always lands the
 * user at the top of the page, regardless of where they were scrolled.
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
 * We bind a single delegated click listener on `document` at the
 * capture phase so the handler runs before React Router's own click
 * interception. Modifier keys (cmd/ctrl/shift/alt) skip the handler so
 * "open in new tab" / "open in new window" still work as expected.
 *
 * Scroll fallbacks: we issue scrollTo on `window`, `documentElement`,
 * and `body` because mobile WebKit and some embedded contexts only
 * respond to one of those three. We also flip
 * `history.scrollRestoration` to `'manual'` on first run so the
 * browser doesn't second-guess us after a same-origin navigation.
 *
 * Runs only in the browser; Docusaurus invokes clientModules on both
 * server and client renders, so we guard with `typeof window`.
 */
if (typeof window !== 'undefined') {
  // Disable the browser's automatic scroll restoration so our manual
  // scrollTo wins after navigation. Safe to set every load; idempotent.
  if ('scrollRestoration' in window.history) {
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      /* some embedded contexts forbid this — ignore */
    }
  }

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }
  };

  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a.navbar__brand, a[class*="navbarLogoLink"], a[class*="navbar__logo"]');
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
        // Same-route: router will no-op. Suppress the click and scroll
        // ourselves. Instant scroll is more reliable than smooth on
        // long pages (the user expects a snap reset, not a 2-second
        // animation).
        event.preventDefault();
        scrollToTop();
      } else {
        // Cross-route: let the navigation happen, then force the
        // destination to start at the top. We schedule two passes —
        // one synchronously-ish via rAF for fast network paths, and
        // one delayed via setTimeout for slower mobile reflows where
        // the browser hasn't settled into the new layout yet.
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToTop);
        });
        setTimeout(scrollToTop, 50);
        setTimeout(scrollToTop, 200);
      }
    },
    true, // capture phase: beat React Router's listener
  );
}
