'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  Globe,
  Save,
  Play,
  Loader2,
  ChevronDown,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { promptsApi, datasetsApi, settingsApi } from '@/lib/api';
import type { Candidate, Dataset } from '@/lib/types';

interface LlmSettings {
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface EditableCandidate {
  name: string;
  description: string;
  runnerType: 'llm_prompt' | 'http_endpoint';
  systemPrompt: string;
  userPromptTemplate: string;
  temperature: string;
  maxTokens: string;
  provider: string;
  model: string;
  endpointUrl: string;
  endpointMethod: string;
  endpointBodyTemplate: string;
  recommendedGraders: string;
  graderRationale: string;
  recommendedDatasets: string;
  notes: string;
}

function toEditable(c: Candidate, settings?: LlmSettings): EditableCandidate {
  // Serialize weighted grader list back to "id:weight, id2:weight2" format
  const graderStr = c.recommendedGraders
    ? c.recommendedGraders
        .map((g) => {
          const w = c.graderWeights?.[g];
          return w != null && w !== 1 ? `${g}:${w}` : g;
        })
        .join(', ')
    : '';

  // Use settings as defaults for model config if candidate doesn't have its own values
  return {
    name: c.name || '',
    description: c.description || '',
    runnerType: c.runnerType || 'llm_prompt',
    systemPrompt: c.systemPrompt || '',
    userPromptTemplate: c.userPromptTemplate || '',
    temperature: c.modelConfig?.temperature !== undefined
      ? String(c.modelConfig.temperature)
      : (settings?.temperature !== undefined ? String(settings.temperature) : ''),
    maxTokens: c.modelConfig?.maxTokens !== undefined
      ? String(c.modelConfig.maxTokens)
      : (settings?.maxTokens !== undefined ? String(settings.maxTokens) : ''),
    provider: (c.modelConfig?.provider as string) || settings?.provider || '',
    model: (c.modelConfig?.model as string) || settings?.model || '',
    endpointUrl: c.endpointUrl || '',
    endpointMethod: c.endpointMethod || '',
    endpointBodyTemplate: c.endpointBodyTemplate || '',
    recommendedGraders: graderStr,
    graderRationale: c.graderRationale || '',
    recommendedDatasets: c.recommendedDatasets?.join(', ') || '',
    notes: c.notes || '',
  };
}

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [edited, setEdited] = useState<EditableCandidate | null>(null);
  const [original, setOriginal] = useState<EditableCandidate | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [llmDefaults, setLlmDefaults] = useState<LlmSettings | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{
    output: string;
    latencyMs: number;
    error?: string;
  } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [c, ds, settings] = await Promise.all([
          promptsApi.get(id),
          datasetsApi.list(),
          settingsApi.getLlmSettings().catch(() => null),
        ]);
        setCandidate(c);
        setLlmDefaults(settings);
        // Use settings as defaults for model config fields if candidate doesn't have values
        const e = toEditable(c, settings || undefined);
        setEdited(e);
        setOriginal(e);
        setDatasets(ds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prompt');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const isDirty = useCallback(() => {
    if (!edited || !original) return false;
    return JSON.stringify(edited) !== JSON.stringify(original);
  }, [edited, original]);

  const handleSave = async () => {
    if (!edited || !candidate) return;
    setSaving(true);
    try {
      // Parse weighted grader list
      const graderEntries = edited.recommendedGraders
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const recommendedGraders: string[] = [];
      const graderWeights: Record<string, number> = {};
      for (const entry of graderEntries) {
        const colonIdx = entry.lastIndexOf(':');
        if (colonIdx > 0) {
          const maybeWeight = parseFloat(entry.slice(colonIdx + 1));
          if (!isNaN(maybeWeight)) {
            const gId = entry.slice(0, colonIdx);
            recommendedGraders.push(gId);
            graderWeights[gId] = maybeWeight;
            continue;
          }
        }
        recommendedGraders.push(entry);
        graderWeights[entry] = 1.0;
      }

      const recommendedDatasets = edited.recommendedDatasets
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await promptsApi.update(id, {
        name: edited.name,
        description: edited.description || undefined,
        runnerType: edited.runnerType,
        systemPrompt: edited.systemPrompt,
        userPromptTemplate: edited.userPromptTemplate || undefined,
        temperature: edited.temperature ? parseFloat(edited.temperature) : undefined,
        maxTokens: edited.maxTokens ? parseInt(edited.maxTokens, 10) : undefined,
        provider: edited.provider || undefined,
        model: edited.model || undefined,
        endpointUrl: edited.endpointUrl || undefined,
        endpointMethod: edited.endpointMethod || undefined,
        endpointBodyTemplate: edited.endpointBodyTemplate || undefined,
        recommendedGraders: recommendedGraders.length > 0 ? recommendedGraders : undefined,
        graderWeights: Object.keys(graderWeights).length > 0 ? graderWeights : undefined,
        recommendedDatasets: recommendedDatasets.length > 0 ? recommendedDatasets : undefined,
        graderRationale: edited.graderRationale || undefined,
        notes: edited.notes || undefined,
      });
      setCandidate(updated);
      const e = toEditable(updated);
      setEdited(e);
      setOriginal(e);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (original) setEdited({ ...original });
  };

  const handleTest = async () => {
    if (!testInput.trim()) return;
    setTestResult(null);
    try {
      const result = await promptsApi.test(id, { input: testInput });
      setTestResult(result);
    } catch (err) {
      setTestResult({
        output: '',
        latencyMs: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const updateField = (field: keyof EditableCandidate, value: string) => {
    if (!edited) return;
    setEdited({ ...edited, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !candidate || !edited) {
    return (
      <div className="space-y-4">
        <Link
          href="/candidates"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Prompts
        </Link>
        <div className="card p-8 text-center">
          <p className="text-red-500">{error || 'Prompt not found'}</p>
        </div>
      </div>
    );
  }

  // Find linked datasets
  const linkedDatasets = datasets.filter(
    (d) => candidate.recommendedDatasets?.includes(d.id),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/candidates"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              {candidate.runnerType === 'llm_prompt' ? (
                <Bot className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              <h1 className="text-2xl font-semibold">{candidate.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              <code className="text-xs">prompts/{id}.md</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty() && (
            <span className="text-xs text-amber-500">Unsaved changes</span>
          )}
          <button
            onClick={handleReset}
            disabled={!isDirty() || saving}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty() || saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save to Disk
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main editing area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic info */}
          <div className="card p-4 space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Basic Info
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium block mb-1">Name</label>
                <input
                  type="text"
                  value={edited.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">
                  Runner Type
                </label>
                <select
                  value={edited.runnerType}
                  onChange={(e) =>
                    updateField(
                      'runnerType',
                      e.target.value as 'llm_prompt' | 'http_endpoint',
                    )
                  }
                  className="input"
                >
                  <option value="llm_prompt">LLM Prompt</option>
                  <option value="http_endpoint">HTTP Endpoint</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">
                Description
              </label>
              <input
                type="text"
                value={edited.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="input"
                placeholder="What does this prompt do?"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="card p-4 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              System Prompt
            </h2>
            <textarea
              value={edited.systemPrompt}
              onChange={(e) => updateField('systemPrompt', e.target.value)}
              className="input font-mono text-sm min-h-[200px] resize-y"
              placeholder="Enter system prompt..."
            />
          </div>

          {/* User Template */}
          <div className="card p-4 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              User Prompt Template
            </h2>
            <p className="text-xs text-muted-foreground">
              Use {'{{input}}'}, {'{{context}}'}, {'{{metadata.*}}'} as
              template variables.
            </p>
            <input
              type="text"
              value={edited.userPromptTemplate}
              onChange={(e) =>
                updateField('userPromptTemplate', e.target.value)
              }
              className="input font-mono text-sm"
              placeholder="{{input}}"
            />
          </div>

          {/* Model Config (for LLM prompts) */}
          {edited.runnerType === 'llm_prompt' && (
            <div className="card p-4 space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Model Configuration
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={edited.provider}
                    onChange={(e) => updateField('provider', e.target.value)}
                    className="input"
                    placeholder="e.g., openai, anthropic"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={edited.model}
                    onChange={(e) => updateField('model', e.target.value)}
                    className="input"
                    placeholder="e.g., gpt-4, claude-3-opus"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Temperature
                  </label>
                  <input
                    type="text"
                    value={edited.temperature}
                    onChange={(e) => updateField('temperature', e.target.value)}
                    className="input"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="text"
                    value={edited.maxTokens}
                    onChange={(e) => updateField('maxTokens', e.target.value)}
                    className="input"
                    placeholder="e.g., 1024"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Endpoint Config (for HTTP endpoints) */}
          {edited.runnerType === 'http_endpoint' && (
            <div className="card p-4 space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Endpoint Configuration
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium block mb-1">
                    Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={edited.endpointUrl}
                    onChange={(e) =>
                      updateField('endpointUrl', e.target.value)
                    }
                    className="input"
                    placeholder="https://api.example.com/generate"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    HTTP Method
                  </label>
                  <select
                    value={edited.endpointMethod || 'POST'}
                    onChange={(e) =>
                      updateField('endpointMethod', e.target.value)
                    }
                    className="input"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">
                  Body Template (JSON)
                </label>
                <textarea
                  value={edited.endpointBodyTemplate}
                  onChange={(e) =>
                    updateField('endpointBodyTemplate', e.target.value)
                  }
                  className="input font-mono text-sm min-h-[100px] resize-y"
                  placeholder='{"prompt": "{{input}}"}'
                />
              </div>
            </div>
          )}

          {/* Advanced / Recommendations */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-left px-4 py-3 flex items-center justify-between text-sm hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-muted-foreground uppercase tracking-wide text-xs">
                Recommendations & Notes
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>
            {showAdvanced && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Recommended Graders
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-1">
                    Comma-separated. Append :weight for weighted scoring (e.g.{' '}
                    <code>faithfulness-strict:0.5, llm-judge-helpful:0.3</code>)
                  </p>
                  <input
                    type="text"
                    value={edited.recommendedGraders}
                    onChange={(e) =>
                      updateField('recommendedGraders', e.target.value)
                    }
                    className="input font-mono text-sm"
                    placeholder="grader-id:0.5, other-grader:0.3"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Grader Rationale
                  </label>
                  <input
                    type="text"
                    value={edited.graderRationale}
                    onChange={(e) =>
                      updateField('graderRationale', e.target.value)
                    }
                    className="input"
                    placeholder="Why these graders and weights?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Recommended Datasets
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-1">
                    Comma-separated dataset IDs
                  </p>
                  <input
                    type="text"
                    value={edited.recommendedDatasets}
                    onChange={(e) =>
                      updateField('recommendedDatasets', e.target.value)
                    }
                    className="input font-mono text-sm"
                    placeholder="context-qa, research-paper-extraction"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Notes
                  </label>
                  <textarea
                    value={edited.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="input min-h-[80px] resize-y"
                    placeholder="Testing notes, changelog, etc."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* File info */}
          <div className="card p-4 space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Source File
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <code className="text-xs">prompts/{id}.md</code>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Edit the <code>.md</code> file directly or use this form. Changes
              are saved to disk immediately.
            </p>
          </div>

          {/* Linked datasets */}
          {linkedDatasets.length > 0 && (
            <div className="card p-4 space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Linked Datasets
              </h3>
              <div className="space-y-1">
                {linkedDatasets.map((d) => (
                  <Link
                    key={d.id}
                    href={`/datasets/${d.id}`}
                    className="block text-sm hover:text-foreground text-muted-foreground transition-colors"
                  >
                    {d.name}{' '}
                    <span className="text-xs opacity-60">
                      ({d.testCaseCount || 0} cases)
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick test */}
          <div className="card p-4 space-y-3">
            <button
              onClick={() => setShowTest(!showTest)}
              className="w-full text-left flex items-center justify-between"
            >
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Play className="h-3.5 w-3.5" />
                Quick Test
              </h3>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${showTest ? 'rotate-180' : ''}`}
              />
            </button>
            {showTest && (
              <div className="space-y-2">
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter test input..."
                  className="input text-sm min-h-[80px] resize-y"
                />
                <button
                  onClick={handleTest}
                  disabled={!testInput.trim()}
                  className="btn-primary w-full"
                >
                  Run Test
                </button>
                {testResult && (
                  <div
                    className={`text-xs p-3 rounded ${testResult.error ? 'bg-red-500/10 text-red-500' : 'bg-muted'}`}
                  >
                    {testResult.error ? (
                      <p>Error: {testResult.error}</p>
                    ) : (
                      <>
                        <p className="font-mono whitespace-pre-wrap">
                          {testResult.output}
                        </p>
                        <p className="text-muted-foreground mt-2">
                          {testResult.latencyMs}ms
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Raw frontmatter preview */}
          <div className="card p-4 space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Frontmatter Preview
            </h3>
            <pre className="text-[11px] text-muted-foreground bg-muted/50 p-2 rounded font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {buildPreviewFrontmatter(edited)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPreviewFrontmatter(e: EditableCandidate): string {
  const lines: string[] = ['---'];
  lines.push(`name: ${e.name}`);
  if (e.description) lines.push(`description: ${e.description}`);
  lines.push(`runner: ${e.runnerType}`);
  if (e.temperature) lines.push(`temperature: ${e.temperature}`);
  if (e.maxTokens) lines.push(`max_tokens: ${e.maxTokens}`);
  if (e.provider) lines.push(`provider: ${e.provider}`);
  if (e.model) lines.push(`model: ${e.model}`);
  if (e.userPromptTemplate)
    lines.push(`user_template: "${e.userPromptTemplate}"`);
  if (e.endpointUrl) lines.push(`endpoint_url: ${e.endpointUrl}`);
  if (e.endpointMethod) lines.push(`endpoint_method: ${e.endpointMethod}`);
  if (e.recommendedGraders)
    lines.push(`recommended_graders: ${e.recommendedGraders}`);
  if (e.recommendedDatasets)
    lines.push(`recommended_datasets: ${e.recommendedDatasets}`);
  if (e.graderRationale) lines.push(`grader_rationale: ${e.graderRationale}`);
  if (e.notes) lines.push(`notes: ${e.notes}`);
  lines.push('---');
  return lines.join('\n');
}
