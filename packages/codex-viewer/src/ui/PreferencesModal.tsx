/**
 * Preferences/settings modal for Codex viewer
 * @module codex/ui/PreferencesModal
 * 
 * @remarks
 * - Theme selection (light/dark/sepia)
 * - Font size slider
 * - Tree density options
 * - Default sidebar mode
 * - Clear cache/data buttons
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Book, Type, LayoutGrid, Sidebar, Trash2 } from 'lucide-react'
import type { UserPreferences } from '../lib/localStorage'
import { clearCodexCache, getCodexCacheStats, type CodexCacheStats } from '../lib/codexCache'

interface PreferencesModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Close modal callback */
  onClose: () => void
  /** Current preferences */
  preferences: UserPreferences
  /** Update theme */
  onThemeChange: (theme: UserPreferences['theme']) => void
  /** Update font size */
  onFontSizeChange: (size: number) => void
  /** Update tree density */
  onTreeDensityChange: (density: UserPreferences['treeDensity']) => void
  /** Update default sidebar mode */
  onSidebarModeChange: (mode: UserPreferences['defaultSidebarMode']) => void
  /** Update sidebar open on mobile */
  onSidebarOpenMobileChange: (open: boolean) => void
  /** Reset to defaults */
  onReset: () => void
  /** Clear all data (bookmarks, history, preferences) */
  onClearAll: () => void
}

/**
 * Modal for managing user preferences
 * 
 * @example
 * ```tsx
 * <PreferencesModal
 *   isOpen={prefsOpen}
 *   onClose={() => setPrefsOpen(false)}
 *   preferences={preferences}
 *   onThemeChange={updateTheme}
 *   onFontSizeChange={updateFontSize}
 *   onTreeDensityChange={updateTreeDensity}
 *   onSidebarModeChange={updateDefaultSidebarMode}
 *   onSidebarOpenMobileChange={updateSidebarOpenMobile}
 *   onReset={reset}
 *   onClearAll={clearAllCodexData}
 * />
 * ```
 */
export default function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onThemeChange,
  onFontSizeChange,
  onTreeDensityChange,
  onSidebarModeChange,
  onSidebarOpenMobileChange,
  onReset,
  onClearAll,
}: PreferencesModalProps) {
  const [cacheStats, setCacheStats] = React.useState<CodexCacheStats | null>(null)
  const [cacheLoading, setCacheLoading] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    setCacheLoading(true)
    getCodexCacheStats()
      .then((stats) => {
        if (!cancelled) {
          setCacheStats(stats)
        }
      })
      .catch((error) => {
        console.warn('[PreferencesModal] Failed to load Codex cache stats', error)
      })
      .finally(() => {
        if (!cancelled) setCacheLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  if (!isOpen) return null

  const humanReadableCacheSize =
    cacheStats && cacheStats.totalBytes > 0
      ? cacheStats.totalBytes > 1024 * 1024
        ? `${(cacheStats.totalBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${(cacheStats.totalBytes / 1024).toFixed(1)} KB`
      : '0 KB'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Preferences</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close preferences"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Theme */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Sun className="w-4 h-4" />
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'sepia'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => onThemeChange(theme)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          preferences.theme === theme
                            ? 'border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-gray-700'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {theme === 'light' && <Sun className="w-5 h-5" />}
                          {theme === 'dark' && <Moon className="w-5 h-5" />}
                          {theme === 'sepia' && <Book className="w-5 h-5" />}
                          <span className="capitalize text-sm font-medium">{theme}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Type className="w-4 h-4" />
                    Font Size: {(preferences.fontSize * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.5"
                    step="0.05"
                    value={preferences.fontSize}
                    onChange={(e) => onFontSizeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>80%</span>
                    <span>150%</span>
                  </div>
                </div>

                {/* Tree Density */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <LayoutGrid className="w-4 h-4" />
                    Tree Density
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['compact', 'normal', 'comfortable'] as const).map((density) => (
                      <button
                        key={density}
                        onClick={() => onTreeDensityChange(density)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.treeDensity === density
                            ? 'border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-gray-700'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="capitalize text-sm font-medium">{density}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Defaults */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Sidebar className="w-4 h-4" />
                    Default Sidebar View
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([{ id: 'tree' as const, label: 'Tree' }, { id: 'toc' as const, label: 'Outline' }]).map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => onSidebarModeChange(mode.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferences.defaultSidebarMode === mode.id
                            ? 'border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-gray-700'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-sm font-medium">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Sidebar */}
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Open Sidebar by Default on Mobile
                    </span>
                    <button
                      onClick={() => onSidebarOpenMobileChange(!preferences.sidebarOpenMobile)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        preferences.sidebarOpenMobile
                          ? 'bg-cyan-600 dark:bg-cyan-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.sidebarOpenMobile ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 dark:border-gray-800" />

                {/* Data Management */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Management</h3>
                    <p className="text-xs text-gray-500">
                      All Codex preferences, bookmarks, history, and cache live only in your browser. Nothing is sent
                      to Frame.dev servers, and GitHub PATs are never stored or cached.
                    </p>
                  </div>

                  {/* Codex SQL Cache */}
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Codex SQL Cache (IndexedDB)
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {cacheLoading
                          ? 'Calculating...'
                          : `Cached strands: ${cacheStats?.totalItems ?? 0} • Approx. size: ${humanReadableCacheSize}`}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            'Clear the Codex SQL cache? This removes locally cached strands but keeps bookmarks and history.'
                          )
                        ) {
                          return
                        }
                        setCacheLoading(true)
                        try {
                          await clearCodexCache()
                          const stats = await getCodexCacheStats()
                          setCacheStats(stats)
                        } finally {
                          setCacheLoading(false)
                        }
                      }}
                      className="py-1.5 px-3 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      disabled={cacheLoading}
                    >
                      {cacheLoading ? 'Clearing…' : 'Clear Cache'}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onReset}
                      className="flex-1 py-2 px-4 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      Reset Preferences
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Clear all bookmarks, history, and preferences? This cannot be undone.')) {
                          onClearAll()
                          onClose()
                        }
                      }}
                      className="flex-1 py-2 px-4 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 text-center">
                  Changes are saved automatically • GDPR compliant (no tracking)
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

