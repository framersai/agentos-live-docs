/**
 * Analytics loader — conditionally injects Microsoft Clarity and any
 * future analytics scripts based on the user's consent preferences.
 *
 * Environment variables (set in .env):
 *   NEXT_PUBLIC_CLARITY_ID   — Microsoft Clarity project ID
 *
 * The loader listens for `rh-consent-change` events so scripts are
 * injected / removed in real-time when the user updates their consent.
 */

import { getConsent, type ConsentPreferences } from './consent';

let clarityLoaded = false;

// ---------------------------------------------------------------------------
// Microsoft Clarity
// ---------------------------------------------------------------------------

function loadClarity(): void {
  if (clarityLoaded) return;
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return;

  clarityLoaded = true;

  // Standard Clarity bootstrap snippet
  const w = window as unknown as Record<string, unknown>;
  w['clarity'] =
    w['clarity'] ||
    function (...args: unknown[]) {
      (w['clarity'] as unknown[]).push(args);
    };
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://www.clarity.ms/tag/' + id;
  const y = document.getElementsByTagName('script')[0];
  y?.parentNode?.insertBefore(t, y);
}

function unloadClarity(): void {
  if (!clarityLoaded) return;
  // Remove injected script tag
  const scripts = document.querySelectorAll('script[src*="clarity.ms"]');
  scripts.forEach((s) => s.remove());
  // Clear Clarity global
  delete (window as unknown as Record<string, unknown>)['clarity'];
  clarityLoaded = false;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

function applyConsent(prefs: ConsentPreferences | null): void {
  if (prefs?.analytics) {
    loadClarity();
  } else {
    unloadClarity();
  }
}

/**
 * Initialise analytics. Call once in layout/root component.
 * Reads current consent and subscribes to future changes.
 */
export function initAnalytics(): () => void {
  applyConsent(getConsent());

  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentPreferences>).detail;
    applyConsent(detail);
  };

  window.addEventListener('rh-consent-change', handler);
  return () => window.removeEventListener('rh-consent-change', handler);
}
