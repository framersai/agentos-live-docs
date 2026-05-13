/**
 * scroll-top-on-navigate.js — reset scroll position to the top of the
 * page on every route change.
 *
 * Docusaurus uses client-side React-Router navigation for internal
 * links, which by default does NOT reset scroll position when the
 * destination is a different page. Result: click a link from the
 * footer of a long page and the new page renders mid-scroll instead of
 * at its title. Users perceive this as "the link didn't work" or "the
 * page is empty" because the visible viewport is whatever was on
 * screen before the click.
 *
 * Docusaurus' clientModule API exposes `onRouteUpdate` and
 * `onRouteDidUpdate`. We force a top-of-page scroll on every route
 * change EXCEPT in-page anchor jumps (where the destination is a
 * heading on the same page and we want the anchor scroll to win).
 *
 * In-page anchor jumps are detected by comparing the previous and new
 * pathnames — same path means it was a hash-only navigation, and we
 * leave it alone so the browser/CSS scroll-padding-top handles it.
 */

export function onRouteDidUpdate({ location, previousLocation }) {
  if (typeof window === 'undefined') return;

  // Same pathname (just hash change) → leave the anchor scroll alone.
  // The scroll-padding-top rule in custom.css already lands the target
  // heading below the sticky navbar.
  if (
    previousLocation &&
    location.pathname === previousLocation.pathname &&
    location.search === previousLocation.search
  ) {
    return;
  }

  // Different page (or first load). If the URL carries a hash, let
  // the browser's native anchor scroll handle it. Otherwise force
  // scroll to top.
  if (location.hash) return;

  // Two rAFs so we land after React Router's commit and Docusaurus'
  // own scroll handler. Instant (not smooth) so the new page never
  // appears to "fall" from a stale offset.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  });
}
