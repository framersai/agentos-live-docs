'use client';

import { useState, useEffect } from 'react';
import {
  Bot,
  Globe,
  Play,
  Loader2,
  RefreshCw,
  Info,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { promptsApi } from '@/lib/api';
import type { Candidate } from '@/lib/types';

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

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{ output: string; latencyMs: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const loadCandidates = async () => {
    try {
      const data = await promptsApi.list();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleReload = async () => {
    setReloading(true);
    try {
      const result = await promptsApi.reload();
      await loadCandidates();
      alert(`Reloaded ${result.loaded} prompts from disk.`);
    } catch (error) {
      console.error('Failed to reload prompts:', error);
    } finally {
      setReloading(false);
    }
  };

  const handleTest = async (candidate: Candidate) => {
    if (!testInput.trim()) return;
    setTestResult(null);
    try {
      const result = await promptsApi.test(candidate.id, { input: testInput });
      setTestResult(result);
    } catch (error) {
      setTestResult({
        output: '',
        latencyMs: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prompts</h1>
          <p className="text-sm text-muted-foreground">
            Prompt templates loaded from markdown files. Edit the <code>.md</code> files to change prompts.
          </p>
        </div>
        <button
          onClick={handleReload}
          disabled={reloading}
          className="btn-secondary flex items-center gap-2"
          title="Re-read all .md files from the prompts/ directory"
        >
          <RefreshCw className={`h-4 w-4 ${reloading ? 'animate-spin' : ''}`} />
          Reload from Disk
        </button>
      </div>

      {/* Expandable guide */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="w-full text-left px-4 py-3 card flex items-center justify-between text-sm hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          How prompts work
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showGuide ? 'rotate-180' : ''}`} />
      </button>
      {showGuide && (
        <div className="card p-5 space-y-3 text-sm text-muted-foreground">
          <p>
            Each <strong className="text-foreground">prompt</strong> is a markdown file in <code>backend/prompts/</code>. The filename (minus <code>.md</code>) becomes the prompt ID.
          </p>
          <div className="border border-border p-3 rounded-md">
            <strong className="text-foreground text-xs uppercase">File format</strong>
            <pre className="mt-1 text-xs font-mono whitespace-pre-wrap">{`---
name: My Prompt
description: What this prompt does
runner: llm_prompt
temperature: 0
user_template: "{{input}}"
recommended_graders: faithfulness-strict:0.5, llm-judge-helpful:0.3, semantic-high:0.2
recommended_datasets: context-qa
grader_rationale: Faithfulness is primary. Helpfulness and semantic similarity are secondary.
notes: Testing notes here
---
Your system prompt text goes here.`}</pre>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="border border-border p-3 rounded-md">
              <strong className="text-foreground text-xs uppercase">LLM Prompt</strong>
              <p className="mt-1 text-xs">System prompt + user template sent to an LLM. Use <code>{'{{input}}'}</code>, <code>{'{{context}}'}</code>, <code>{'{{metadata.*}}'}</code> for template variables.</p>
            </div>
            <div className="border border-border p-3 rounded-md">
              <strong className="text-foreground text-xs uppercase">HTTP Endpoint</strong>
              <p className="mt-1 text-xs">Calls an external API with the test case data. Set <code>runner: http_endpoint</code> and add <code>endpoint_url</code>, <code>endpoint_method</code> fields.</p>
            </div>
          </div>
          <p className="border-t border-border pt-3">
            <strong className="text-foreground">To add a new prompt:</strong> Create a new <code>.md</code> file in <code>backend/prompts/</code>, then click <strong>Reload from Disk</strong>. To edit, change the file and reload.
          </p>
          <p>
            <strong className="text-foreground">Testing variations:</strong> Create multiple prompts with different system instructions (short vs long, strict vs loose) and run them in the same experiment to compare. The <strong>Play</strong> button lets you test with a single input first.
          </p>
        </div>
      )}

      {/* Prompt list */}
      {candidates.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No prompts found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add <code>.md</code> files to <code>backend/prompts/</code> and click Reload.
          </p>
          <button onClick={handleReload} className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload from Disk
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {candidate.runnerType === 'llm_prompt' ? (
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">{candidate.name}</h3>
                    {candidate.description && (
                      <p className="text-xs text-muted-foreground">{candidate.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (testingId === candidate.id) {
                        setTestingId(null);
                        setTestResult(null);
                      } else {
                        setTestingId(candidate.id);
                        setTestInput('');
                        setTestResult(null);
                      }
                    }}
                    className="btn-ghost p-2"
                    title="Test this prompt with a sample input"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge bg-muted text-muted-foreground font-mono text-xs">
                  prompts/{candidate.id}.md
                </span>
                <span className="badge bg-muted text-muted-foreground">
                  {candidate.runnerType === 'llm_prompt' ? 'LLM Prompt' : 'HTTP Endpoint'}
                </span>
                {candidate.modelConfig?.provider && (
                  <span className="badge bg-muted text-muted-foreground">
                    {candidate.modelConfig.provider}
                  </span>
                )}
                {candidate.modelConfig?.temperature !== undefined && (
                  <span className="badge bg-muted text-muted-foreground">
                    temp: {candidate.modelConfig.temperature}
                  </span>
                )}
              </div>

              {/* Recommended graders/datasets */}
              {(candidate.recommendedGraders?.length || candidate.recommendedDatasets?.length) && (
                <div className="text-xs space-y-1">
                  {candidate.recommendedGraders && candidate.recommendedGraders.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
                      <span className="opacity-60">Graders:</span>
                      {candidate.recommendedGraders.map((g) => {
                        const weight = candidate.graderWeights?.[g];
                        const hasWeight = weight != null && weight !== 1;
                        return (
                          <span key={g} className="badge bg-muted/50 text-muted-foreground text-[10px]">
                            {g}{hasWeight && <span className="ml-0.5 text-foreground/70">{Math.round(weight * 100)}%</span>}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {candidate.graderRationale && (
                    <p className="text-muted-foreground/80 pl-0.5">
                      <span className="opacity-60">Why: </span>{candidate.graderRationale}
                    </p>
                  )}
                  {candidate.recommendedDatasets && candidate.recommendedDatasets.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-muted-foreground">
                      <span className="opacity-60">Datasets:</span>
                      {candidate.recommendedDatasets.map((d) => (
                        <span key={d} className="badge bg-muted/50 text-muted-foreground text-[10px]">{d}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {candidate.notes && (
                <p className="text-xs text-muted-foreground italic">{candidate.notes}</p>
              )}

              {/* System prompt preview (expandable) */}
              {candidate.systemPrompt && (
                <div>
                  <button
                    onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedId === candidate.id ? 'rotate-180' : ''}`} />
                    System prompt
                  </button>
                  {expandedId === candidate.id ? (
                    <pre className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono whitespace-pre-wrap mt-1 max-h-60 overflow-y-auto">
                      {candidate.systemPrompt}
                    </pre>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono overflow-hidden mt-1">
                      {candidate.systemPrompt.substring(0, 120)}
                      {candidate.systemPrompt.length > 120 && '...'}
                    </div>
                  )}
                </div>
              )}

              {/* User template preview */}
              {candidate.userPromptTemplate && candidate.userPromptTemplate !== '{{input}}' && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded font-mono overflow-hidden">
                  <span className="opacity-50">Template:</span>{' '}
                  {candidate.userPromptTemplate.substring(0, 120)}
                  {candidate.userPromptTemplate.length > 120 && '...'}
                </div>
              )}

              {/* Test panel */}
              {testingId === candidate.id && (
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Enter test input..."
                      className="input flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleTest(candidate)}
                    />
                    <button
                      onClick={() => handleTest(candidate)}
                      className="btn-primary"
                      disabled={!testInput.trim()}
                    >
                      Run
                    </button>
                  </div>
                  {testResult && (
                    <div
                      className={`text-xs p-2 rounded ${testResult.error ? 'bg-red-500/10 text-red-500' : 'bg-muted'}`}
                    >
                      {testResult.error ? (
                        <p>Error: {testResult.error}</p>
                      ) : (
                        <>
                          <p className="font-mono whitespace-pre-wrap">{testResult.output}</p>
                          <p className="text-muted-foreground mt-1">{testResult.latencyMs}ms</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
