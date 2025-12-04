'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ConsentState = 'pending' | 'accepted' | 'declined' | 'customized';

interface CookiePreferences {
  essential: boolean; // Always true - Supabase auth
  analytics: boolean; // Google Analytics
  marketing: boolean; // Microsoft Clarity, tracking pixels
}

const CONSENT_KEY = 'gpw:cookie-consent';
const PREFS_KEY = 'gpw:cookie-preferences';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences and initialize scripts
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs) as CookiePreferences;
        setPreferences(prefs);
        initializeTracking(prefs);
      }
    }
  }, []);

  const initializeTracking = (prefs: CookiePreferences) => {
    // Initialize Google Analytics if consented
    if (prefs.analytics && typeof window !== 'undefined') {
      // GA4 initialization
      const gaId = process.env.NEXT_PUBLIC_GA_ID;
      if (gaId && !document.querySelector(`script[src*="googletagmanager"]`)) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', gaId);
      }
    }

    // Initialize Microsoft Clarity if consented
    if (prefs.marketing && typeof window !== 'undefined') {
      const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
      if (clarityId && !document.querySelector(`script[src*="clarity"]`)) {
        (function(c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
          c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
          t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
          y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", clarityId);
      }
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    saveConsent('accepted', allAccepted);
  };

  const handleDeclineAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    saveConsent('declined', essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsent('customized', preferences);
    setShowPreferences(false);
  };

  const saveConsent = (state: ConsentState, prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, state);
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    initializeTracking(prefs);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Banner */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in-up"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="gpw-container">
          <div className="gpw-card p-6 md:p-8 max-w-4xl mx-auto shadow-gpw-xl">
            {!showPreferences ? (
              // Simple consent view
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🍪</span>
                    <h3 className="font-semibold text-lg">We value your privacy</h3>
                  </div>
                  <p className="text-sm text-gpw-text-muted">
                    We use cookies to enhance your experience, analyze site traffic, and understand where our visitors come from.{' '}
                    <Link href="/cookies" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="gpw-btn-ghost text-sm px-4 py-2"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleDeclineAll}
                    className="gpw-btn-secondary text-sm px-4 py-2"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="gpw-btn-primary text-sm px-5 py-2"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            ) : (
              // Preferences view
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="gpw-btn-ghost p-2"
                    aria-label="Close preferences"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="mt-1 rounded text-gpw-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Essential Cookies</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gpw-purple-500/20 text-gpw-purple-600 dark:text-gpw-purple-400">
                          Always on
                        </span>
                      </div>
                      <p className="text-sm text-gpw-text-muted mt-1">
                        Required for authentication and core functionality (Supabase).
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="mt-1 rounded text-gpw-purple-600 focus:ring-gpw-purple-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">Analytics Cookies</span>
                      <p className="text-sm text-gpw-text-muted mt-1">
                        Help us understand how visitors interact with our site (Google Analytics).
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="mt-1 rounded text-gpw-purple-600 focus:ring-gpw-purple-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">Marketing & Experience</span>
                      <p className="text-sm text-gpw-text-muted mt-1">
                        Used to improve user experience and site performance (Microsoft Clarity).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleDeclineAll}
                    className="gpw-btn-secondary text-sm px-4 py-2"
                  >
                    Decline All
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="gpw-btn-primary text-sm px-5 py-2"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Type declarations for window
declare global {
  interface Window {
    dataLayer: any[];
    clarity: any;
  }
}

