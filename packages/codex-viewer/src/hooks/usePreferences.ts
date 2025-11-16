/**
 * Hook for managing user preferences
 * @module codex/hooks/usePreferences
 * 
 * @remarks
 * - Stores preferences in localStorage (client-side only)
 * - Theme (light/dark/sepia), font size, tree density, sidebar defaults
 * - Auto-applies theme and font size to document
 * - No tracking or server sync
 * 
 * @example
 * ```tsx
 * const { preferences, updateTheme, updateFontSize } = usePreferences()
 * 
 * <button onClick={() => updateTheme('dark')}>
 *   Dark Mode
 * </button>
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import type { UserPreferences } from '../lib/localStorage'
import {
  getPreferences,
  updatePreferences as savePreferences,
  resetPreferences as clearPreferences,
} from '../lib/localStorage'

interface UsePreferencesResult {
  /** Current preferences */
  preferences: UserPreferences
  /** Update theme */
  updateTheme: (theme: UserPreferences['theme']) => void
  /** Update font size (0.8 - 1.5) */
  updateFontSize: (size: number) => void
  /** Update tree density */
  updateTreeDensity: (density: UserPreferences['treeDensity']) => void
  /** Update default sidebar mode */
  updateDefaultSidebarMode: (mode: UserPreferences['defaultSidebarMode']) => void
  /** Update sidebar open on mobile default */
  updateSidebarOpenMobile: (open: boolean) => void
  /** Update multiple preferences at once */
  updateMultiple: (updates: Partial<UserPreferences>) => void
  /** Reset to defaults */
  reset: () => void
}

/**
 * Manage user preferences with localStorage persistence
 * 
 * @remarks
 * Automatically loads preferences on mount and applies theme/font size
 * to the document. All preferences are stored client-side only.
 * 
 * @example
 * ```tsx
 * function Settings() {
 *   const { preferences, updateTheme, updateFontSize, reset } = usePreferences()
 *   
 *   return (
 *     <>
 *       <select value={preferences.theme} onChange={(e) => updateTheme(e.target.value)}>
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *         <option value="sepia">Sepia</option>
 *       </select>
 *       
 *       <input
 *         type="range"
 *         min="0.8"
 *         max="1.5"
 *         step="0.1"
 *         value={preferences.fontSize}
 *         onChange={(e) => updateFontSize(parseFloat(e.target.value))}
 *       />
 *       
 *       <button onClick={reset}>Reset to Defaults</button>
 *     </>
 *   )
 * }
 * ```
 */
export function usePreferences(): UsePreferencesResult {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getPreferences())

  // Apply theme class to document
  useEffect(() => {
    if (typeof document === 'undefined') return

    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'sepia')
    // Add current theme
    document.documentElement.classList.add(preferences.theme)
  }, [preferences.theme])

  // Apply font size to document
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.style.setProperty('--codex-font-scale', preferences.fontSize.toString())
  }, [preferences.fontSize])

  const updateTheme = useCallback((theme: UserPreferences['theme']) => {
    const updated = { ...getPreferences(), theme }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const updateFontSize = useCallback((fontSize: number) => {
    // Clamp between 0.8 and 1.5
    const clamped = Math.max(0.8, Math.min(1.5, fontSize))
    const updated = { ...getPreferences(), fontSize: clamped }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const updateTreeDensity = useCallback((treeDensity: UserPreferences['treeDensity']) => {
    const updated = { ...getPreferences(), treeDensity }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const updateDefaultSidebarMode = useCallback((defaultSidebarMode: 'tree' | 'toc') => {
    const updated = { ...getPreferences(), defaultSidebarMode }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const updateSidebarOpenMobile = useCallback((sidebarOpenMobile: boolean) => {
    const updated = { ...getPreferences(), sidebarOpenMobile }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const updateMultiple = useCallback((updates: Partial<UserPreferences>) => {
    const updated = { ...getPreferences(), ...updates }
    savePreferences(updated)
    setPreferences(updated)
  }, [])

  const reset = useCallback(() => {
    clearPreferences()
    setPreferences(getPreferences())
  }, [])

  return {
    preferences,
    updateTheme,
    updateFontSize,
    updateTreeDensity,
    updateDefaultSidebarMode,
    updateSidebarOpenMobile,
    updateMultiple,
    reset,
  }
}

