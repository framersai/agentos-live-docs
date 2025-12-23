/**
 * Tldraw Canvas Wrapper Component
 * React wrapper for tldraw infinite canvas
 * @module shared/CanvasEditor/TldrawWrapper
 */

import React, { useEffect, useCallback } from 'react'
import { Tldraw, TLUiOverrides, Editor, TldrawEditorProps } from 'tldraw'
import 'tldraw/tldraw.css'

interface TldrawWrapperProps {
  /** Initial canvas data (tldraw JSON snapshot) */
  initialData?: string
  /** Callback when canvas data changes */
  onChange?: (data: string) => void
  /** Whether canvas is read-only */
  readOnly?: boolean
  /** Custom theme colors */
  theme?: 'light' | 'dark'
  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number
}

/**
 * Tldraw infinite canvas wrapper
 *
 * @remarks
 * - Provides infinite whiteboard for visual note-taking
 * - Auto-saves changes with configurable interval
 * - Supports light/dark themes
 * - Exports/imports tldraw snapshot format
 * - Read-only mode for viewing
 *
 * @example
 * ```tsx
 * <TldrawWrapper
 *   initialData={savedCanvasData}
 *   onChange={(data) => saveToBackend(data)}
 *   theme="dark"
 *   autoSaveInterval={2000}
 * />
 * ```
 */
export default function TldrawWrapper({
  initialData,
  onChange,
  readOnly = false,
  theme = 'light',
  autoSaveInterval = 2000,
}: TldrawWrapperProps) {
  const [editor, setEditor] = React.useState<Editor | null>(null)
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  /**
   * Handle editor mount
   */
  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor)

    // Load initial data if provided
    if (initialData) {
      try {
        const snapshot = JSON.parse(initialData)
        editor.store.loadSnapshot(snapshot)
      } catch (error) {
        console.error('Failed to load initial canvas data:', error)
      }
    }
  }, [initialData])

  /**
   * Auto-save canvas data
   */
  const saveCanvasData = useCallback(() => {
    if (!editor || !onChange) return

    try {
      const snapshot = editor.store.getSnapshot()
      const data = JSON.stringify(snapshot)
      onChange(data)
    } catch (error) {
      console.error('Failed to save canvas data:', error)
    }
  }, [editor, onChange])

  /**
   * Set up auto-save interval
   */
  useEffect(() => {
    if (!editor || !onChange || readOnly) return

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // Set up new auto-save interval
    autoSaveTimerRef.current = setInterval(() => {
      saveCanvasData()
    }, autoSaveInterval)

    // Save on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
      saveCanvasData()
    }
  }, [editor, onChange, readOnly, autoSaveInterval, saveCanvasData])

  /**
   * Custom UI overrides for theming
   */
  const uiOverrides: TLUiOverrides = {
    tools(editor, tools) {
      // Keep all default tools
      return tools
    },
  }

  return (
    <div
      className="tldraw-wrapper"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <Tldraw
        onMount={handleMount}
        overrides={uiOverrides}
        inferDarkMode={theme === 'dark'}
        className={`tldraw-canvas tldraw-canvas-${theme}`}
      />
    </div>
  )
}
