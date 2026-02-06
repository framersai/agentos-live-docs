'use client';

import { useState, useEffect } from 'react';
import { Settings, Zap, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { settingsApi, LlmSettings, ConnectionTestResult } from '@/lib/api';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-5.x, GPT-4.1, o3/o4 reasoning models' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude Opus 4.6, Sonnet 4.5, Haiku models' },
  { id: 'ollama', name: 'Ollama (Local)', description: 'Run models locally with Ollama' },
] as const;

const DEFAULT_MODELS: Record<string, string[]> = {
  openai: ['gpt-5.2', 'gpt-5.1', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-4o', 'gpt-4o-mini', 'o3', 'o4-mini', 'o3-mini', 'o1'],
  anthropic: ['claude-opus-4-6', 'claude-opus-4-5-20251101', 'claude-sonnet-4-5-20250929', 'claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001', 'claude-haiku-3-5'],
  ollama: ['dolphin-llama3:8b', 'llama3.2:3b', 'llama3:8b', 'mistral', 'codellama', 'gemma:7b', 'phi3'],
};

/** Pricing per 1M tokens: in (input) · out (output) */
const MODEL_PRICING: Record<string, string> = {
  'gpt-5.2': 'in: $1.75 · out: $14 /1M tok',
  'gpt-5.1': 'in: $1.25 · out: $10 /1M tok',
  'gpt-5': 'in: $1.25 · out: $10 /1M tok',
  'gpt-5-mini': 'in: $0.25 · out: $2 /1M tok',
  'gpt-5-nano': 'in: $0.05 · out: $0.40 /1M tok',
  'gpt-4.1': 'in: $2 · out: $8 /1M tok',
  'gpt-4.1-mini': 'in: $0.40 · out: $1.60 /1M tok',
  'gpt-4.1-nano': 'in: $0.10 · out: $0.40 /1M tok',
  'gpt-4o': 'in: $2.50 · out: $10 /1M tok',
  'gpt-4o-mini': 'in: $0.15 · out: $0.60 /1M tok',
  'o3': 'in: $2 · out: $8 /1M tok',
  'o4-mini': 'in: $1.10 · out: $4.40 /1M tok',
  'o3-mini': 'in: $0.55 · out: $2.20 /1M tok',
  'o1': 'in: $15 · out: $60 /1M tok',
  'claude-opus-4-6': 'in: $5 · out: $25 /1M tok',
  'claude-opus-4-5-20251101': 'in: $5 · out: $25 /1M tok',
  'claude-sonnet-4-5-20250929': 'in: $3 · out: $15 /1M tok',
  'claude-sonnet-4-20250514': 'in: $3 · out: $15 /1M tok',
  'claude-haiku-4-5-20251001': 'in: $1 · out: $5 /1M tok',
  'claude-haiku-3-5': 'in: $0.80 · out: $4 /1M tok',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<LlmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Local form state
  const [formData, setFormData] = useState<Partial<LlmSettings>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await settingsApi.getLlmSettings();
      setSettings(data);
      setFormData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  function updateFormData(updates: Partial<LlmSettings>) {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
    setTestResult(null);
  }

  async function saveSettings() {
    try {
      setSaving(true);
      const updated = await settingsApi.updateLlmSettings(formData);
      setSettings(updated);
      setFormData(updated);
      setHasChanges(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function testConnection() {
    try {
      setTesting(true);
      setTestResult(null);
      // Save first if there are changes
      if (hasChanges) {
        await saveSettings();
      }
      const result = await settingsApi.testConnection();
      setTestResult(result);
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  }

  async function resetToDefaults() {
    if (!confirm('Reset all settings to defaults?')) return;

    try {
      setSaving(true);
      const data = await settingsApi.resetToDefaults();
      setSettings(data.llm);
      setFormData(data.llm);
      setHasChanges(false);
      setTestResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="section-title flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="section-subtitle">
          Configure LLM provider, model, and API credentials. Changes apply immediately.
        </p>
      </div>

      {error && (
        <div className="card p-4 border-[hsl(var(--error))]">
          <p className="text-[hsl(var(--error))] font-medium">{error}</p>
        </div>
      )}

      {/* Provider Selection */}
      <div className="card p-6">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-4">LLM Provider</h2>

        <div className="space-y-3">
          {PROVIDERS.map((provider) => (
            <label
              key={provider.id}
              className={`
                flex items-start gap-4 p-4 cursor-pointer transition-all
                ${formData.provider === provider.id ? 'card-inset' : 'card-flat hover:bg-muted/50'}
              `}
            >
              <input
                type="radio"
                name="provider"
                value={provider.id}
                checked={formData.provider === provider.id}
                onChange={() => {
                  updateFormData({
                    provider: provider.id,
                    model: DEFAULT_MODELS[provider.id][0],
                    apiKey: provider.id === 'ollama' ? undefined : formData.apiKey,
                    baseUrl: provider.id === 'ollama' ? 'http://localhost:11434' : undefined,
                  });
                }}
                className="mt-1"
              />
              <div>
                <div className="font-bold">{provider.name}</div>
                <div className="text-sm text-muted-foreground">{provider.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Model & Configuration */}
      <div className="card p-6">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-4">Model Configuration</h2>

        <div className="space-y-4">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              className="input"
              value={formData.model || ''}
              onChange={(e) => updateFormData({ model: e.target.value })}
            >
              {(DEFAULT_MODELS[formData.provider || 'ollama'] || []).map((model) => (
                <option key={model} value={model}>
                  {model}{MODEL_PRICING[model] ? ` (${MODEL_PRICING[model]})` : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Or enter a custom model name below
            </p>
            <input
              type="text"
              className="input mt-2"
              placeholder="Custom model name..."
              value={formData.model || ''}
              onChange={(e) => updateFormData({ model: e.target.value })}
            />
          </div>

          {/* API Key (for cloud providers) */}
          {formData.provider !== 'ollama' && (
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                className="input font-mono"
                placeholder={`Enter your ${formData.provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key...`}
                value={formData.apiKey || ''}
                onChange={(e) => updateFormData({ apiKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.provider === 'openai'
                  ? 'Get your key at platform.openai.com/api-keys'
                  : 'Get your key at console.anthropic.com'}
              </p>
            </div>
          )}

          {/* Base URL (for Ollama) */}
          {formData.provider === 'ollama' && (
            <div>
              <label className="block text-sm font-medium mb-2">Ollama URL</label>
              <input
                type="text"
                className="input font-mono"
                placeholder="http://localhost:11434"
                value={formData.baseUrl || ''}
                onChange={(e) => updateFormData({ baseUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: http://localhost:11434
              </p>
            </div>
          )}

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Temperature: {formData.temperature?.toFixed(1) || '0.7'}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={formData.temperature || 0.7}
              onChange={(e) => updateFormData({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Deterministic</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-medium mb-2">Max Tokens</label>
            <input
              type="number"
              className="input"
              min="100"
              max="8192"
              step="100"
              value={formData.maxTokens || 1024}
              onChange={(e) => updateFormData({ maxTokens: parseInt(e.target.value, 10) })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum tokens for LLM responses (100-8192)
            </p>
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className="card p-6">
        <h2 className="text-lg font-bold uppercase tracking-wide mb-4">Connection Test</h2>

        <div className="flex items-center gap-4">
          <button
            onClick={testConnection}
            disabled={testing}
            className="btn-secondary"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </button>

          {testResult && (
            <div
              className={`flex items-center gap-2 ${
                testResult.success ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--error))]'
              }`}
            >
              {testResult.success ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span className="text-sm">{testResult.message}</span>
              {testResult.latencyMs && (
                <span className="text-xs text-muted-foreground">
                  ({testResult.latencyMs}ms)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetToDefaults}
          disabled={saving}
          className="btn-ghost"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </button>

        <div className="flex items-center gap-4">
          {hasChanges && (
            <span className="text-sm text-muted-foreground">Unsaved changes</span>
          )}
          <button
            onClick={saveSettings}
            disabled={saving || !hasChanges}
            className="btn-primary"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
