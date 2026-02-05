'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Sparkles, Info, ChevronDown, ExternalLink, RefreshCw } from 'lucide-react';
import { gradersApi, presetsApi, type GraderPreset } from '@/lib/api';
import type { Grader, GraderType } from '@/lib/types';

const GRADER_TYPES: {
  value: GraderType;
  label: string;
  description: string;
  category: 'deterministic' | 'llm-powered';
  inspiration: string;
  reference?: string;
}[] = [
  {
    value: 'exact-match',
    label: 'Exact Match',
    description: 'Output must match expected string exactly',
    category: 'deterministic',
    inspiration: 'Standard EM metric from SQuAD (Rajpurkar et al., 2016). Simple but effective for factoid QA where exact phrasing matters.',
    reference: 'https://arxiv.org/abs/1606.05250',
  },
  {
    value: 'llm-judge',
    label: 'LLM Judge',
    description: 'Uses an LLM with your rubric to judge pass/fail',
    category: 'llm-powered',
    inspiration: 'Inspired by "Judging LLM-as-a-Judge" (Zheng et al., 2023). Uses a capable model to evaluate responses against a human-written rubric, enabling open-ended quality assessment.',
    reference: 'https://arxiv.org/abs/2306.05685',
  },
  {
    value: 'semantic-similarity',
    label: 'Semantic Similarity',
    description: 'Compares embeddings using cosine similarity',
    category: 'llm-powered',
    inspiration: 'Based on Sentence-BERT (Reimers & Gurevych, 2019). Computes cosine similarity between sentence embeddings, capturing meaning beyond surface-level string matching.',
    reference: 'https://arxiv.org/abs/1908.10084',
  },
  {
    value: 'faithfulness',
    label: 'Faithfulness',
    description: 'Checks if output is faithful to provided context',
    category: 'llm-powered',
    inspiration: 'From the RAGAS framework (Es et al., 2023). Extracts atomic claims from the output and verifies each is supported by the provided context, measuring hallucination rate.',
    reference: 'https://arxiv.org/abs/2309.15217',
  },
  {
    value: 'contains',
    label: 'Contains',
    description: 'Checks if output contains required substrings',
    category: 'deterministic',
    inspiration: 'Common in HELM (Liang et al., 2022) and other eval harnesses. Verifies key terms or phrases appear in the output without requiring exact matches.',
    reference: 'https://arxiv.org/abs/2211.09110',
  },
  {
    value: 'regex',
    label: 'Regex Match',
    description: 'Checks if output matches a regular expression pattern',
    category: 'deterministic',
    inspiration: 'Pattern-based validation used across eval frameworks. Useful for structured outputs (dates, numbers, formats) where the answer must follow a specific pattern.',
  },
  {
    value: 'json-schema',
    label: 'JSON Schema',
    description: 'Validates output is valid JSON matching a schema',
    category: 'deterministic',
    inspiration: 'Inspired by structured output evaluation in function calling and tool-use benchmarks. Validates both syntactic correctness and schema compliance per JSON Schema (RFC draft).',
  },
  {
    value: 'answer-relevancy',
    label: 'Answer Relevancy',
    description: 'Measures if the answer is relevant to the question',
    category: 'llm-powered',
    inspiration: 'From the RAGAS framework (Es et al., 2023). Generates hypothetical questions from the answer and measures cosine similarity to the original question. Penalizes vague or off-topic responses.',
    reference: 'https://arxiv.org/abs/2309.15217',
  },
  {
    value: 'context-relevancy',
    label: 'Context Relevancy',
    description: 'Measures if retrieved context is relevant to the question',
    category: 'llm-powered',
    inspiration: 'From the RAGAS framework (Es et al., 2023). Evaluates whether retrieved passages contain information needed to answer the question, measuring retrieval quality.',
    reference: 'https://arxiv.org/abs/2309.15217',
  },
];

function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block">
      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 max-w-xs text-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
}

export default function GradersPage() {
  const [graders, setGraders] = useState<Grader[]>([]);
  const [presets, setPresets] = useState<GraderPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedGraderId, setExpandedGraderId] = useState<string | null>(null);
  const [editingGrader, setEditingGrader] = useState<Grader | null>(null);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'exact-match' as GraderType,
    rubric: '',
  });

  useEffect(() => {
    loadGraders();
    loadPresets();
  }, []);

  async function loadGraders() {
    try {
      const data = await gradersApi.list();
      setGraders(data);
    } catch (error) {
      console.error('Failed to load graders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPresets() {
    try {
      const data = await presetsApi.getGraderPresets();
      setPresets(data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  }

  async function handleReload() {
    setReloading(true);
    try {
      const result = await gradersApi.reload();
      await loadGraders();
      alert(`Reloaded ${result.loaded} graders from disk.`);
    } catch (error) {
      console.error('Failed to reload graders:', error);
    } finally {
      setReloading(false);
    }
  }

  async function loadPreset(preset: GraderPreset) {
    setLoadingPreset(preset.id);
    try {
      await presetsApi.loadGraderPreset(preset.id);
      await loadGraders();
      setShowPresets(false);
    } catch (error) {
      console.error('Failed to load preset:', error);
    } finally {
      setLoadingPreset(null);
    }
  }

  function openForm(grader?: Grader) {
    if (grader) {
      setEditingGrader(grader);
      setFormData({
        name: grader.name,
        description: grader.description || '',
        type: grader.type,
        rubric: grader.rubric || '',
      });
    } else {
      setEditingGrader(null);
      setFormData({
        name: '',
        description: '',
        type: 'exact-match',
        rubric: '',
      });
    }
    setShowForm(true);
  }

  async function saveGrader() {
    if (!formData.name.trim()) return;

    try {
      if (editingGrader) {
        await gradersApi.update(editingGrader.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          rubric: formData.rubric.trim() || undefined,
        });
      } else {
        await gradersApi.create({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          type: formData.type,
          rubric: formData.rubric.trim() || undefined,
        });
      }
      setShowForm(false);
      setEditingGrader(null);
      loadGraders();
    } catch (error) {
      console.error('Failed to save grader:', error);
    }
  }

  async function deleteGrader(id: string) {
    if (!confirm('Delete this grader?')) return;

    try {
      await gradersApi.delete(id);
      loadGraders();
    } catch (error) {
      console.error('Failed to delete grader:', error);
    }
  }

  const needsRubric = formData.type === 'llm-judge';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Graders</h1>
          <p className="text-muted-foreground mt-1">
            YAML files loaded from <code className="text-xs">backend/graders/</code>. Edit files or use the UI.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReload}
            disabled={reloading}
            className="btn-secondary"
            title="Re-read all YAML files from the graders/ directory"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${reloading ? 'animate-spin' : ''}`} />
            {reloading ? 'Reloading...' : 'Reload from Disk'}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="btn-secondary"
              title="Create a new grader from a pre-configured template"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              From Template
            </button>

            {showPresets && (
              <div className="absolute right-0 mt-2 w-80 card p-2 z-50 shadow-xl max-h-96 overflow-y-auto">
                <div className="text-xs text-muted-foreground px-2 py-1 mb-1">
                  Quick-load pre-configured graders
                </div>
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    disabled={loadingPreset === preset.id}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{preset.name}</span>
                      <Tooltip text={preset.tooltip} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{preset.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => openForm()}
            className="btn-primary"
            title="Create a custom grader with your own evaluation criteria"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Grader
          </button>
        </div>
      </div>

      {/* Expandable guide */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="w-full text-left px-4 py-3 card flex items-center justify-between text-sm hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          How graders work
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showGuide ? 'rotate-180' : ''}`} />
      </button>
      {showGuide && (
        <div className="card p-5 space-y-3 text-sm text-muted-foreground">
          <p>
            A <strong className="text-foreground">grader</strong> defines how to score a candidate&apos;s output against the expected answer. Each grader has a type that determines its evaluation method.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="border border-border p-3 rounded-md">
              <strong className="text-foreground text-xs uppercase">Deterministic</strong>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li><strong>Exact Match</strong> — binary string equality (<a href="https://arxiv.org/abs/1606.05250" target="_blank" rel="noopener" className="underline hover:text-foreground">SQuAD</a>)</li>
                <li><strong>Contains</strong> — checks for required keywords (<a href="https://arxiv.org/abs/2211.09110" target="_blank" rel="noopener" className="underline hover:text-foreground">HELM</a>)</li>
                <li><strong>Regex</strong> — pattern matching</li>
                <li><strong>JSON Schema</strong> — validates JSON structure</li>
              </ul>
            </div>
            <div className="border border-border p-3 rounded-md">
              <strong className="text-foreground text-xs uppercase">LLM-Powered</strong>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li><strong>LLM Judge</strong> — evaluates against a rubric (<a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener" className="underline hover:text-foreground">LLM-as-Judge</a>)</li>
                <li><strong>Semantic Similarity</strong> — embedding cosine distance (<a href="https://arxiv.org/abs/1908.10084" target="_blank" rel="noopener" className="underline hover:text-foreground">Sentence-BERT</a>)</li>
                <li><strong>Faithfulness</strong> — claims grounded in context (<a href="https://arxiv.org/abs/2309.15217" target="_blank" rel="noopener" className="underline hover:text-foreground">RAGAS</a>)</li>
                <li><strong>Answer Relevancy</strong> — answer-question alignment (<a href="https://arxiv.org/abs/2309.15217" target="_blank" rel="noopener" className="underline hover:text-foreground">RAGAS</a>)</li>
                <li><strong>Context Relevancy</strong> — context quality for Q&A (<a href="https://arxiv.org/abs/2309.15217" target="_blank" rel="noopener" className="underline hover:text-foreground">RAGAS</a>)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2">
            <p>
              <strong className="text-foreground">Presets</strong> are available covering all types. For open-ended evaluation, use <strong>LLM Judge</strong> with a custom rubric. For structured output, combine <strong>JSON Schema</strong> with <strong>LLM Judge</strong>.
            </p>
            <div className="text-xs space-y-1 opacity-80">
              <p className="font-medium text-foreground/70">Research & Inspiration</p>
              <ul className="space-y-0.5">
                <li><a href="https://arxiv.org/abs/2309.15217" target="_blank" rel="noopener" className="underline hover:text-foreground">RAGAS</a> — Es et al. 2023. Automated evaluation of retrieval-augmented generation (faithfulness, answer/context relevancy)</li>
                <li><a href="https://arxiv.org/abs/2306.05685" target="_blank" rel="noopener" className="underline hover:text-foreground">LLM-as-Judge</a> — Zheng et al. 2023. Using LLMs to evaluate LLM outputs with rubric-based scoring</li>
                <li><a href="https://arxiv.org/abs/1908.10084" target="_blank" rel="noopener" className="underline hover:text-foreground">Sentence-BERT</a> — Reimers & Gurevych 2019. Sentence embeddings for semantic similarity</li>
                <li><a href="https://arxiv.org/abs/1606.05250" target="_blank" rel="noopener" className="underline hover:text-foreground">SQuAD</a> — Rajpurkar et al. 2016. Reading comprehension benchmark with EM/F1 metrics</li>
                <li><a href="https://arxiv.org/abs/2211.09110" target="_blank" rel="noopener" className="underline hover:text-foreground">HELM</a> — Liang et al. 2022. Holistic evaluation of language models</li>
              </ul>
              <p className="font-medium text-foreground/70 mt-2">Frameworks Referenced</p>
              <ul className="space-y-0.5">
                <li><a href="https://promptfoo.dev" target="_blank" rel="noopener" className="underline hover:text-foreground">promptfoo</a> — Inspired our dataset &times; candidates &times; graders evaluation matrix and the LLM Judge assertion pattern</li>
                <li><a href="https://docs.confident-ai.com" target="_blank" rel="noopener" className="underline hover:text-foreground">DeepEval</a> — Python-based eval framework; inspired RAGAS metric implementations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {graders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground">No graders yet</p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={() => setShowPresets(true)} className="btn-secondary">
              <Sparkles className="h-4 w-4 mr-2" />
              Load a preset
            </button>
            <button onClick={() => openForm()} className="btn-secondary">
              Create from scratch
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {graders.map((grader) => {
            const typeInfo = GRADER_TYPES.find((t) => t.value === grader.type);
            const isExpanded = expandedGraderId === grader.id;
            return (
              <div key={grader.id} className="card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{grader.name}</h3>
                        <span className={`badge text-xs ${typeInfo?.category === 'llm-powered' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                          {typeInfo?.label || grader.type}
                        </span>
                      </div>
                      {grader.description && (
                        <p className="text-sm text-muted-foreground mt-1">{grader.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button
                        onClick={() => openForm(grader)}
                        className="btn-ghost p-2 text-muted-foreground"
                        title="Edit grader"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGrader(grader.id)}
                        className="btn-ghost p-2 text-muted-foreground hover:text-error"
                        title="Delete grader"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Config summary badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {grader.filePath && (
                      <span className="badge bg-muted text-muted-foreground font-mono text-xs">
                        {grader.filePath}
                      </span>
                    )}
                    {grader.config && typeof grader.config === 'object' && 'threshold' in grader.config && (
                      <span className="badge bg-muted text-muted-foreground text-xs">
                        threshold: {String(grader.config.threshold)}
                      </span>
                    )}
                    {grader.rubric && (
                      <span className="badge bg-muted text-muted-foreground text-xs">
                        has rubric
                      </span>
                    )}
                    {grader.config && typeof grader.config === 'object' && 'schema' in grader.config && (
                      <span className="badge bg-muted text-muted-foreground text-xs">
                        has schema
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable details */}
                <button
                  onClick={() => setExpandedGraderId(isExpanded ? null : grader.id)}
                  className="w-full text-left px-4 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <span>Details & Research</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    {/* Rubric */}
                    {grader.rubric && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Rubric</p>
                        <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {grader.rubric}
                        </pre>
                      </div>
                    )}

                    {/* Config */}
                    {grader.config && Object.keys(grader.config).length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Configuration</p>
                        <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {JSON.stringify(grader.config, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Research inspiration — prefer grader's own data from YAML, fall back to type constant */}
                    {(grader.inspiration || typeInfo?.inspiration) && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Technique & Inspiration</p>
                        <p className="text-xs text-muted-foreground">{grader.inspiration || typeInfo?.inspiration}</p>
                        {(grader.reference || typeInfo?.reference) && (
                          <a
                            href={grader.reference || typeInfo?.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground underline hover:text-foreground mt-1 inline-flex items-center gap-1"
                          >
                            Paper <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* File info + Metadata */}
                    <div className="text-[11px] text-muted-foreground/60 pt-1 border-t border-border space-y-0.5">
                      {grader.filePath && (
                        <div><code>{grader.filePath}</code></div>
                      )}
                      <div>
                        ID: <code>{grader.id}</code>
                        {grader.createdAt && <> &middot; Created: {new Date(grader.createdAt).toLocaleDateString()}</>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grader Type Reference Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Grader Type Reference</h2>
        <p className="text-sm text-muted-foreground">
          All available evaluation techniques and the research that inspired them.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {GRADER_TYPES.map((type) => (
            <div key={type.value} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{type.label}</h3>
                <span className={`badge text-[10px] ${type.category === 'llm-powered' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                  {type.category === 'llm-powered' ? 'LLM-Powered' : 'Deterministic'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{type.description}</p>
              <p className="text-xs text-muted-foreground/80">{type.inspiration}</p>
              {type.reference && (
                <a
                  href={type.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground underline hover:text-foreground inline-flex items-center gap-1"
                >
                  Research paper <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingGrader ? 'Edit Grader' : 'Create Grader'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Grader"
                  className="input"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Evaluates responses for..."
                  className="input"
                />
              </div>

              {!editingGrader && (
                <div>
                  <label className="text-sm font-medium block mb-1 flex items-center gap-2">
                    Type
                    <Tooltip text="Choose how the grader evaluates responses" />
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as GraderType })
                    }
                    className="input"
                  >
                    {GRADER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} — {type.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {needsRubric && (
                <div>
                  <label className="text-sm font-medium block mb-1 flex items-center gap-2">
                    Rubric
                    <span className="text-muted-foreground font-normal">
                      (required for LLM Judge)
                    </span>
                    <Tooltip text="Instructions the LLM uses to evaluate responses. Be specific about what passes and fails." />
                  </label>
                  <textarea
                    value={formData.rubric}
                    onChange={(e) => setFormData({ ...formData, rubric: e.target.value })}
                    placeholder="The response should be accurate, concise, and helpful..."
                    className="input min-h-[100px] resize-y"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingGrader(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={saveGrader} className="btn-primary">
                  {editingGrader ? 'Save' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close presets dropdown */}
      {showPresets && <div className="fixed inset-0 z-40" onClick={() => setShowPresets(false)} />}
    </div>
  );
}
