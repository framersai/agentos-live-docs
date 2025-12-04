'use client';

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ProjectSettings {
  accent_hex?: string;
  cta_label?: string;
  custom_css?: string;
}

interface ThemeSettingsProps {
  projectSlug: string | null;
  settings: ProjectSettings;
  onSettingsUpdated: (settings: ProjectSettings) => void;
}

const presetColors = [
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Red', hex: '#ef4444' },
];

export function ThemeSettings({
  projectSlug,
  settings,
  onSettingsUpdated,
}: ThemeSettingsProps) {
  const [localSettings, setLocalSettings] = useState<ProjectSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const changed =
      localSettings.accent_hex !== settings.accent_hex ||
      localSettings.cta_label !== settings.cta_label ||
      localSettings.custom_css !== settings.custom_css;
    setHasChanges(changed);
  }, [localSettings, settings]);

  const handleSave = async () => {
    if (!projectSlug) return;

    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectSlug)}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      onSettingsUpdated(localSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save theme:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gpw-card p-6 space-y-6">
      {/* Color picker */}
      <div>
        <label className="gpw-label">Accent Color</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {presetColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => setLocalSettings({ ...localSettings, accent_hex: color.hex })}
              className={`
                w-10 h-10 rounded-xl transition-all duration-200
                ${localSettings.accent_hex === color.hex
                  ? 'ring-2 ring-offset-2 ring-gpw-purple-500 scale-110'
                  : 'hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={localSettings.accent_hex ?? '#8b5cf6'}
            onChange={(e) => setLocalSettings({ ...localSettings, accent_hex: e.target.value })}
            className="gpw-input font-mono text-sm w-32"
            placeholder="#8b5cf6"
          />
          <div
            className="w-10 h-10 rounded-xl border border-gpw-border"
            style={{ backgroundColor: localSettings.accent_hex ?? '#8b5cf6' }}
          />
        </div>
      </div>

      {/* CTA Label */}
      <div>
        <label htmlFor="cta-label" className="gpw-label">
          Button Label
        </label>
        <input
          type="text"
          id="cta-label"
          value={localSettings.cta_label ?? ''}
          onChange={(e) => setLocalSettings({ ...localSettings, cta_label: e.target.value })}
          className="gpw-input"
          placeholder="Get started"
        />
      </div>

      {/* Custom CSS */}
      <div>
        <label htmlFor="custom-css" className="gpw-label">
          Custom CSS (Advanced)
        </label>
        <textarea
          id="custom-css"
          value={localSettings.custom_css ?? ''}
          onChange={(e) => setLocalSettings({ ...localSettings, custom_css: e.target.value })}
          rows={4}
          className="gpw-textarea font-mono text-sm"
          placeholder=".gpw-plan-card { border-radius: 24px; }"
        />
        <p className="text-xs text-gpw-text-muted mt-1">
          Target <code className="text-gpw-purple-600">.gpw-plan-card</code>,{' '}
          <code className="text-gpw-purple-600">.gpw-plan-button</code>, etc.
        </p>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl bg-gpw-purple-500/5 border border-gpw-border">
        <p className="text-sm font-medium mb-3">Preview</p>
        <button
          className="px-6 py-3 rounded-full font-semibold text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: localSettings.accent_hex ?? '#8b5cf6' }}
        >
          {localSettings.cta_label || 'Get started'}
        </button>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="gpw-btn-primary flex-1"
        >
          {saving ? (
            <>
              <Spinner size={18} />
              Saving...
            </>
          ) : success ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            'Save Theme'
          )}
        </button>
        {hasChanges && (
          <button
            onClick={() => setLocalSettings(settings)}
            className="gpw-btn-ghost"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}





