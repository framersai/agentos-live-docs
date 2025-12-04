'use client';

import { useState } from 'react';

/**
 * Test Mode Toggle Component
 * 
 * Allows users to switch between test and live mode for their payment providers.
 * Shows clear warnings and indicators for which mode is active.
 */

interface TestModeToggleProps {
  isTestMode: boolean;
  onToggle: (isTestMode: boolean) => Promise<void>;
  disabled?: boolean;
  hasLiveKeys?: boolean;
}

export function TestModeToggle({
  isTestMode,
  onToggle,
  disabled = false,
  hasLiveKeys = false,
}: TestModeToggleProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = async () => {
    if (disabled || loading) return;

    // Show confirmation when switching to live mode
    if (isTestMode && !hasLiveKeys) {
      setShowConfirm(true);
      return;
    }

    if (!isTestMode) {
      // Switching to test mode - no confirmation needed
      setLoading(true);
      await onToggle(true);
      setLoading(false);
      return;
    }

    // Switching to live mode
    setShowConfirm(true);
  };

  const confirmSwitch = async () => {
    setShowConfirm(false);
    setLoading(true);
    await onToggle(!isTestMode);
    setLoading(false);
  };

  return (
    <div className="relative">
      {/* Toggle switch */}
      <div className={`
        p-4 rounded-xl border transition-all duration-300
        ${isTestMode 
          ? 'bg-amber-500/10 border-amber-500/30' 
          : 'bg-emerald-500/10 border-emerald-500/30'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isTestMode ? (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            )}
            <div>
              <h4 className={`font-semibold ${isTestMode ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isTestMode ? 'Test Mode' : 'Live Mode'}
              </h4>
              <p className="text-sm text-gpw-text-muted">
                {isTestMode 
                  ? 'Using test credentials - no real charges'
                  : 'Using live credentials - real payments'}
              </p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={disabled || loading}
            className={`
              relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isTestMode 
                ? 'bg-amber-500 focus:ring-amber-500' 
                : 'bg-emerald-500 focus:ring-emerald-500'}
            `}
          >
            <span className={`
              absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300
              ${isTestMode ? 'left-1' : 'left-7'}
            `}>
              {loading && (
                <svg className="animate-spin w-4 h-4 m-1 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Warning message for test mode */}
        {isTestMode && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Test mode is active.</strong> Use Stripe test card{' '}
              <code className="px-1 py-0.5 rounded bg-amber-500/20 font-mono">
                4242 4242 4242 4242
              </code>{' '}
              for testing.
            </p>
          </div>
        )}

        {/* Live mode indicator */}
        {!isTestMode && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              <strong>Live mode is active.</strong> Real payments will be processed.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="gpw-card p-6 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gpw-text-primary mb-2">
                {isTestMode ? 'Switch to Live Mode?' : 'Switch to Test Mode?'}
              </h3>
              <p className="text-gpw-text-muted">
                {isTestMode 
                  ? hasLiveKeys
                    ? 'Your live credentials will be used. Real payments will be processed.'
                    : 'You need to add live API keys before switching to live mode.'
                  : 'Test mode will use your test credentials. No real charges will be made.'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 gpw-btn-secondary"
              >
                Cancel
              </button>
              {(isTestMode ? hasLiveKeys : true) && (
                <button
                  onClick={confirmSwitch}
                  className={`flex-1 gpw-btn ${isTestMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'} rounded-full`}
                >
                  {isTestMode ? 'Go Live' : 'Use Test Mode'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestModeToggle;


