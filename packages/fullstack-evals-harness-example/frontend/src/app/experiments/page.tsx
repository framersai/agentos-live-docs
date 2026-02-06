'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Check, X, Loader2, Bot, Info, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { datasetsApi, gradersApi, promptsApi, experimentsApi } from '@/lib/api';
import type {
  Dataset,
  Grader,
  Candidate,
  Experiment,
  ExperimentProgress,
  ExperimentStats,
  CandidateComparison,
} from '@/lib/types';

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

export default function ExperimentsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [graders, setGraders] = useState<Grader[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedGraders, setSelectedGraders] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Results view
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
  const [activeStats, setActiveStats] = useState<ExperimentStats | null>(null);
  const [baselineCandidateId, setBaselineCandidateId] = useState<string>('');
  const [challengerCandidateId, setChallengerCandidateId] = useState<string>('');
  const [comparison, setComparison] = useState<CandidateComparison | null>(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-select recommended candidates when dataset changes
  useEffect(() => {
    if (!selectedDataset || candidates.length === 0) return;
    const recommended: string[] = [];
    for (const c of candidates) {
      if (c.recommendedDatasets?.includes(selectedDataset)) {
        recommended.push(c.id);
      }
    }
    if (recommended.length > 0) {
      setSelectedCandidates(recommended);
    }
  }, [selectedDataset, candidates]);

  async function loadData() {
    try {
      const [datasetsData, gradersData, candidatesData, experimentsData] = await Promise.all([
        datasetsApi.list(),
        gradersApi.list(),
        promptsApi.list(),
        experimentsApi.list(),
      ]);
      setDatasets(datasetsData);
      setGraders(gradersData);
      setCandidates(candidatesData);
      setSelectedCandidates((prev) =>
        prev.filter((id) => candidatesData.some((candidate) => candidate.id === id)),
      );
      setExperiments(experimentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleGrader = useCallback((graderId: string) => {
    setSelectedGraders((prev) =>
      prev.includes(graderId)
        ? prev.filter((id) => id !== graderId)
        : [...prev, graderId]
    );
  }, []);

  const toggleCandidate = useCallback((candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  }, []);

  const selectAllCandidates = useCallback(() => {
    setSelectedCandidates(candidates.map((candidate) => candidate.id));
  }, [candidates]);

  const clearCandidateSelection = useCallback(() => {
    setSelectedCandidates([]);
  }, []);

  const toggleCandidateFamily = useCallback((familyIds: string[]) => {
    setSelectedCandidates((prev) => {
      const allSelected = familyIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !familyIds.includes(id));
      }
      return Array.from(new Set([...prev, ...familyIds]));
    });
  }, []);

  async function runExperiment() {
    if (!selectedDataset || selectedGraders.length === 0) return;

    setIsRunning(true);
    setProgress(null);

    try {
      const experiment = await experimentsApi.create({
        datasetId: selectedDataset,
        graderIds: selectedGraders,
        candidateIds: selectedCandidates.length > 0 ? selectedCandidates : undefined,
      });

      // Connect to SSE stream for progress
      const eventSource = experimentsApi.streamProgress(experiment.id);

      eventSource.onmessage = (event) => {
        const data: ExperimentProgress = JSON.parse(event.data);

        if (data.type === 'progress' || data.type === 'result') {
          setProgress({ current: data.current || 0, total: data.total || 1 });
        }

        if (data.type === 'complete') {
          eventSource.close();
          setIsRunning(false);
          setProgress(null);
          loadData();
          viewExperiment(experiment.id);
        }

        if (data.type === 'error' && !data.testCaseId) {
          console.error('Experiment error:', data.error);
          eventSource.close();
          setIsRunning(false);
          setProgress(null);
          loadData();
        }
      };

      eventSource.onerror = () => {
        // Let EventSource auto-reconnect on transient disconnects.
        if (eventSource.readyState === 0) {
          return;
        }
        eventSource.close();
        setIsRunning(false);
        setProgress(null);
        loadData();
      };
    } catch (error) {
      console.error('Failed to run experiment:', error);
      setIsRunning(false);
    }
  }

  async function viewExperiment(experimentId: string) {
    try {
      const [experiment, stats] = await Promise.all([
        experimentsApi.get(experimentId),
        experimentsApi.getStats(experimentId),
      ]);
      setActiveExperiment(experiment);
      setActiveStats(stats);

      // Load the dataset for this experiment
      const dataset = await datasetsApi.get(experiment.datasetId);
      setActiveDataset(dataset);
    } catch (error) {
      console.error('Failed to load experiment:', error);
    }
  }

  // Determine if active experiment has candidates
  const hasCandidates = !!(
    activeExperiment?.candidateIds && activeExperiment.candidateIds.length > 0
  );
  const baseCandidates = candidates.filter((candidate) => !candidate.parentId);
  const baseIds = new Set(baseCandidates.map((candidate) => candidate.id));
  const variantsByParent = new Map<string, Candidate[]>();

  for (const candidate of candidates) {
    if (!candidate.parentId || !baseIds.has(candidate.parentId)) continue;
    const variants = variantsByParent.get(candidate.parentId) || [];
    variants.push(candidate);
    variantsByParent.set(candidate.parentId, variants);
  }

  const candidateFamilies = baseCandidates.map((base) => {
    const variants = variantsByParent.get(base.id) || [];
    return {
      key: base.id,
      label: base.name,
      members: [base, ...variants],
    };
  });

  const orphanVariants = candidates.filter(
    (candidate) => candidate.parentId && !baseIds.has(candidate.parentId),
  );
  for (const orphan of orphanVariants) {
    candidateFamilies.push({
      key: orphan.id,
      label: orphan.name,
      members: [orphan],
    });
  }

  // Compute recommended datasets from selected candidates
  const recommendedDatasetIds: Set<string> = new Set();
  for (const candidateId of selectedCandidates) {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate?.recommendedDatasets) {
      for (const dsId of candidate.recommendedDatasets) {
        recommendedDatasetIds.add(dsId);
      }
    }
  }

  // Compute which candidates match the selected dataset
  const candidatesForDataset: Set<string> = new Set();
  if (selectedDataset) {
    for (const candidate of candidates) {
      if (candidate.recommendedDatasets?.includes(selectedDataset)) {
        candidatesForDataset.add(candidate.id);
      }
    }
  }

  const selectedDatasetMeta = datasets.find((dataset) => dataset.id === selectedDataset);
  const selectedCaseCount = selectedDatasetMeta?.testCaseCount || 0;
  const candidateRunCount = selectedCandidates.length > 0 ? selectedCandidates.length : 1;
  const estimatedEvaluations = selectedDatasetMeta
    ? selectedCaseCount * selectedGraders.length * candidateRunCount
    : 0;

  const sortedCandidateStats = activeStats?.candidateStats
    ? [...activeStats.candidateStats].sort(
        (a, b) =>
          (b.weightedScore ?? b.avgScore) - (a.weightedScore ?? a.avgScore)
      )
    : [];
  const bestCandidateId = sortedCandidateStats[0]?.candidateId;
  const activeCandidateIds = activeExperiment?.candidateIds ?? [];
  const compareCandidateOptions = activeCandidateIds.map((candidateId) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return {
      id: candidateId,
      name: candidate?.name || candidateId,
    };
  });
  const testCaseById = new Map((activeDataset?.testCases ?? []).map((tc) => [tc.id, tc]));
  const rankedCandidateIds = sortedCandidateStats
    .map((cs) => cs.candidateId)
    .filter((id) => activeCandidateIds.includes(id));
  const activeCandidateSignature = activeCandidateIds.join('|');
  const rankedCandidateSignature = rankedCandidateIds.join('|');

  useEffect(() => {
    if (!activeExperiment || !hasCandidates || activeCandidateIds.length < 2) {
      setBaselineCandidateId('');
      setChallengerCandidateId('');
      setComparison(null);
      setCompareError(null);
      return;
    }

    const fallbackIds = rankedCandidateIds.length > 0 ? rankedCandidateIds : activeCandidateIds;
    const nextBaseline = fallbackIds.includes(baselineCandidateId)
      ? baselineCandidateId
      : fallbackIds[0];
    const nextChallenger =
      fallbackIds.includes(challengerCandidateId) && challengerCandidateId !== nextBaseline
        ? challengerCandidateId
        : fallbackIds.find((id) => id !== nextBaseline) ?? '';

    setBaselineCandidateId(nextBaseline);
    setChallengerCandidateId(nextChallenger);
    setComparison(null);
    setCompareError(null);
  }, [
    activeExperiment?.id,
    hasCandidates,
    activeCandidateSignature,
    rankedCandidateSignature,
  ]);

  useEffect(() => {
    setComparison(null);
    setCompareError(null);
  }, [activeExperiment?.id, baselineCandidateId, challengerCandidateId]);

  async function runComparison() {
    if (!activeExperiment || !baselineCandidateId || !challengerCandidateId) return;
    if (baselineCandidateId === challengerCandidateId) {
      setCompareError('Baseline and challenger must be different candidates.');
      return;
    }

    setComparing(true);
    setCompareError(null);
    try {
      const data = await experimentsApi.compare(
        activeExperiment.id,
        baselineCandidateId,
        challengerCandidateId,
      );
      setComparison(data);
    } catch (error) {
      console.error('Failed to compare candidates:', error);
      setCompareError('Failed to load comparison. Try again.');
      setComparison(null);
    } finally {
      setComparing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Experiments</h1>
        <p className="text-muted-foreground mt-1">
          Run candidates and graders against datasets
        </p>
      </div>

      {/* Expandable walkthrough */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="w-full text-left px-4 py-3 card flex items-center justify-between text-sm hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          Quick start guide
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showGuide ? 'rotate-180' : ''}`} />
      </button>
      {showGuide && (
        <div className="card p-5 space-y-3 text-sm text-muted-foreground">
          <p className="text-foreground font-medium">Run your first experiment in 4 steps:</p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>
              <strong className="text-foreground">Load a dataset</strong> — Go to{' '}
              <Link href="/datasets" className="underline hover:text-foreground">Datasets</Link>{' '}
              and choose one of the loaded CSV datasets (or upload your own CSV).
            </li>
            <li>
              <strong className="text-foreground">Choose graders</strong> — Go to{' '}
              <Link href="/graders" className="underline hover:text-foreground">Graders</Link>{' '}
              to create/edit grader definitions, then select one or more graders here.
            </li>
            <li>
              <strong className="text-foreground">Select candidates</strong> (optional) — Go to{' '}
              <Link href="/candidates" className="underline hover:text-foreground">Candidates</Link>{' '}
              to review prompt files. Each candidate is a prompt configuration (system prompt + template + model settings).
              Without candidates, graders evaluate the expected output directly (useful for testing grader behavior).
            </li>
            <li>
              <strong className="text-foreground">Run the experiment</strong> — Select your dataset, toggle graders,
              optionally select candidates below, and click <strong>Run Experiment</strong>. Results stream in real-time
              with pass/fail badges. Hover over any result for the score, reason, and generated output.
            </li>
          </ol>
          <div className="border-t border-border pt-3 space-y-2">
            <p className="text-foreground font-medium">Suggested first experiments:</p>
            <ul className="list-disc ml-5 space-y-1 text-xs">
              <li><strong>Extraction quality:</strong> Research Paper Extraction dataset + Strict JSON Extractor + Loose JSON Extractor candidates + Paper Extraction Schema + Extraction Completeness graders. Compare strict (nulls for unknowns) vs loose (infers missing data).</li>
              <li><strong>Summarization:</strong> Summarization dataset + Summarizer + Concise Summarizer candidates + Faithfulness + Semantic Similarity graders. Does brevity hurt faithfulness?</li>
              <li><strong>Grounding check:</strong> Q&amp;A with Context dataset + Full Structured Analyst + Citation-Focused Analyst candidates + Faithfulness grader. Which analysis style scores higher on grounding?</li>
            </ul>
          </div>
          <div className="border-t border-border pt-3 space-y-1">
            <p className="text-foreground font-medium">Where is data stored?</p>
            <p className="text-xs">
              <strong className="text-foreground">Disk (definitions):</strong> Datasets (<code>backend/datasets/*.csv</code>),
              prompts (<code>backend/prompts/*.md</code>), graders (<code>backend/graders/*.yaml</code>).
              All editable on disk or via the UI — changes write back to files immediately.
            </p>
            <p className="text-xs">
              <strong className="text-foreground">SQLite (runtime only):</strong> Experiment runs, results, and settings.
              You can delete the database and start fresh — all definitions reload from disk automatically.
            </p>
          </div>
        </div>
      )}

      {/* Run Form */}
      <div className="card p-6 space-y-4">
        <h2 className="font-medium">Run New Experiment</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium block mb-2 flex items-center gap-2">
              Dataset <span className="text-red-400 text-xs">*</span>
              <Tooltip text="The test cases to evaluate. Each has input, expected output, and optional context." />
            </label>
            {datasets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No datasets available. Create one first.
              </p>
            ) : (
              <>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="input"
                  disabled={isRunning}
                >
                  <option value="">Select a dataset...</option>
                  {datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {recommendedDatasetIds.size > 0 && recommendedDatasetIds.has(ds.id) ? '\u2605 ' : ''}
                      {ds.name} ({ds.testCaseCount || 0} cases)
                    </option>
                  ))}
                </select>
                {recommendedDatasetIds.size > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-foreground">{'\u2605'}</span> Recommended for selected candidates
                  </p>
                )}
              </>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-2 flex items-center gap-2">
              Graders <span className="text-red-400 text-xs">*</span>
              <Tooltip text="How to score outputs. Toggle one or more. Each grader runs independently on every test case." />
            </label>
            {graders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No graders available. Create one first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {graders.map((grader) => (
                  <button
                    key={grader.id}
                    onClick={() => toggleGrader(grader.id)}
                    disabled={isRunning}
                    className={`
                      px-3 py-1.5 text-sm rounded-md border transition-colors
                      ${
                        selectedGraders.includes(grader.id)
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground/50'
                      }
                      ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {grader.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Candidate selection */}
        {candidates.length > 0 && (
          <div>
            <label className="text-sm font-medium block mb-2 flex items-center gap-2">
              Candidates <span className="text-red-400 text-xs">*</span>
              <Tooltip text="Prompt configurations that generate output for each test case. Select one or more to compare." />
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={selectAllCandidates}
                disabled={isRunning || candidates.length === 0}
                className="btn-secondary px-3 py-1 text-xs"
              >
                Select all
              </button>
              <button
                onClick={clearCandidateSelection}
                disabled={isRunning || selectedCandidates.length === 0}
                className="btn-secondary px-3 py-1 text-xs"
              >
                Clear
              </button>
              {candidatesForDataset.size > 0 && selectedDataset && (
                <button
                  onClick={() => setSelectedCandidates(Array.from(candidatesForDataset))}
                  disabled={isRunning}
                  className="btn-secondary px-3 py-1 text-xs"
                >
                  Select recommended
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                {selectedCandidates.length} selected
              </span>
            </div>
            {candidatesForDataset.size > 0 && selectedDataset && selectedCandidates.length === 0 && (
              <p className="text-xs text-muted-foreground mb-2">
                <span className="text-foreground">{'\u2605'}</span>{' '}
                {candidatesForDataset.size} candidate{candidatesForDataset.size !== 1 ? 's' : ''} designed for{' '}
                <strong className="text-foreground">{selectedDatasetMeta?.name || selectedDataset}</strong>
              </p>
            )}
            <div className="space-y-3">
              {candidateFamilies.map((family) => {
                const familyIds = family.members.map((member) => member.id);
                const selectedInFamily = familyIds.filter((id) => selectedCandidates.includes(id)).length;
                const allFamilySelected = selectedInFamily === familyIds.length;
                const familyPartiallySelected = selectedInFamily > 0 && !allFamilySelected;

                return (
                  <div key={family.key} className="border border-border rounded-md p-2">
                    {family.members.length > 1 && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          {family.label} family ({family.members.length})
                        </span>
                        <button
                          onClick={() => toggleCandidateFamily(familyIds)}
                          disabled={isRunning}
                          className="btn-secondary px-2 py-1 text-xs"
                        >
                          {allFamilySelected
                            ? 'Deselect family'
                            : familyPartiallySelected
                            ? 'Select remaining'
                            : 'Select family'}
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {family.members.map((candidate) => {
                        const isSelected = selectedCandidates.includes(candidate.id);
                        const isVariant = Boolean(candidate.parentId);
                        const matchesDataset = candidatesForDataset.has(candidate.id);

                        return (
                          <button
                            key={candidate.id}
                            onClick={() => toggleCandidate(candidate.id)}
                            disabled={isRunning}
                            className={`
                              px-3 py-1.5 text-sm rounded-md border transition-colors flex items-center gap-1.5
                              ${
                                isSelected
                                  ? 'bg-foreground text-background border-foreground'
                                  : matchesDataset && selectedDataset
                                  ? 'border-foreground/30 bg-muted/50 hover:border-foreground/50'
                                  : 'border-border hover:border-foreground/50'
                              }
                              ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            title={candidate.id}
                          >
                            <Bot className="h-3 w-3" />
                            {candidate.name}
                            {isVariant && (
                              <span className="text-[10px] opacity-70">
                                ({candidate.variantLabel || 'variant'})
                              </span>
                            )}
                            {matchesDataset && selectedDataset && !isSelected && (
                              <span className="text-[10px] opacity-50">{'\u2605'}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedCandidates.length === 0 && (
              <p className="text-xs text-red-400/80 mt-1">
                Select at least one candidate to run the experiment
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={runExperiment}
            disabled={!selectedDataset || selectedGraders.length === 0 || selectedCandidates.length === 0 || isRunning}
            className="btn-primary"
            title="Run all test cases through selected candidates and grade the outputs"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Experiment
              </>
            )}
          </button>

          {progress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              {progress.current} / {progress.total}
            </div>
          )}
        </div>
        {selectedDatasetMeta && selectedGraders.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Estimated evaluations: {estimatedEvaluations} ({selectedCaseCount} cases ×{' '}
            {selectedCandidates.length > 0 ? `${selectedCandidates.length} candidate(s)` : 'baseline'} ×{' '}
            {selectedGraders.length} grader(s))
          </p>
        )}
      </div>

      {/* Results View */}
      {activeExperiment && activeDataset && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-medium">
              Results: {activeExperiment.name || 'Experiment'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Dataset: {activeDataset.name} · Status: {activeExperiment.status}
              {hasCandidates && ` · ${activeExperiment.candidateIds!.length} candidate(s)`}
            </p>
          </div>

          {/* Candidate score summary */}
          {hasCandidates && sortedCandidateStats.length > 0 && (
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex flex-wrap gap-4">
                {sortedCandidateStats.map((cs) => {
                  const candidate = candidates.find((c) => c.id === cs.candidateId);
                  const hasWeighted = cs.weightedScore != null && Math.abs((cs.weightedScore ?? 0) - cs.avgScore) > 0.001;
                  return (
                    <div key={cs.candidateId} className="text-sm">
                      <span className="font-medium">{candidate?.name || cs.candidateId}</span>
                      {cs.candidateId === bestCandidateId && (
                        <span className="ml-2 badge badge-pass">Best</span>
                      )}
                      <span className="text-muted-foreground ml-2">
                        Avg: {(cs.avgScore * 100).toFixed(0)}%
                      </span>
                      {hasWeighted && (
                        <span className="ml-2 text-foreground" title="Weighted score using the prompt's grader weight configuration">
                          Weighted: {((cs.weightedScore ?? 0) * 100).toFixed(0)}%
                        </span>
                      )}
                      <span className="text-muted-foreground ml-2">
                        ({cs.passed}/{cs.total} passed)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Candidate comparison */}
          {hasCandidates && activeCandidateIds.length >= 2 && (
            <div className="px-4 py-3 border-b border-border space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Baseline</label>
                  <select
                    value={baselineCandidateId}
                    onChange={(e) => setBaselineCandidateId(e.target.value)}
                    className="input text-sm"
                    disabled={comparing}
                  >
                    {compareCandidateOptions.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Challenger</label>
                  <select
                    value={challengerCandidateId}
                    onChange={(e) => setChallengerCandidateId(e.target.value)}
                    className="input text-sm"
                    disabled={comparing}
                  >
                    {compareCandidateOptions.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={runComparison}
                  disabled={
                    comparing ||
                    !baselineCandidateId ||
                    !challengerCandidateId ||
                    baselineCandidateId === challengerCandidateId
                  }
                  className="btn-secondary"
                >
                  {comparing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    'Compare'
                  )}
                </button>
              </div>

              {compareError && (
                <p className="text-sm text-red-600">{compareError}</p>
              )}

              {comparison && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>
                      Baseline pass rate:{' '}
                      <strong>{(comparison.summary.baselinePassRate * 100).toFixed(1)}%</strong>
                    </span>
                    <span>
                      Challenger pass rate:{' '}
                      <strong>{(comparison.summary.challengerPassRate * 100).toFixed(1)}%</strong>
                    </span>
                    <span>
                      Delta:{' '}
                      <strong className={comparison.summary.deltaPassRate >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {comparison.summary.deltaPassRate >= 0 ? '+' : ''}
                        {(comparison.summary.deltaPassRate * 100).toFixed(1)}%
                      </strong>
                    </span>
                    <span className="text-muted-foreground">
                      Improved: {comparison.summary.improved} · Regressed: {comparison.summary.regressed} · Same: {comparison.summary.same}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Test Case</th>
                          <th>Grader</th>
                          <th>Baseline</th>
                          <th>Challenger</th>
                          <th>Delta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.comparisons.map((item) => {
                          const testCase = testCaseById.get(item.testCaseId);
                          const grader = graders.find((g) => g.id === item.graderId);

                          return (
                            <tr key={`${item.testCaseId}-${item.graderId}`}>
                              <td className="font-mono text-xs max-w-[280px] truncate" title={testCase?.input || item.testCaseId}>
                                {testCase?.input || item.testCaseId}
                              </td>
                              <td>{grader?.name || item.graderId}</td>
                              <td>{item.baseline.pass ? 'Pass' : 'Fail'}</td>
                              <td>{item.challenger.pass ? 'Pass' : 'Fail'}</td>
                              <td>
                                {item.delta === 'improved' && <span className="badge badge-pass">Improved</span>}
                                {item.delta === 'regressed' && <span className="badge badge-fail">Regressed</span>}
                                {item.delta === 'same' && <span className="text-muted-foreground">Same</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeExperiment.results && activeExperiment.results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Input</th>
                    {hasCandidates ? (
                      // Multi-candidate: columns grouped by candidate, sub-columns by grader
                      activeExperiment.candidateIds!.map((candidateId) => {
                        const candidate = candidates.find((c) => c.id === candidateId);
                        return activeExperiment.graderIds.map((graderId) => {
                          const grader = graders.find((g) => g.id === graderId);
                          return (
                            <th key={`${candidateId}-${graderId}`}>
                              <div className="text-xs">
                                <div className="font-medium">{candidate?.name || candidateId.slice(0, 8)}</div>
                                <div className="text-muted-foreground font-normal">{grader?.name || graderId.slice(0, 8)}</div>
                              </div>
                            </th>
                          );
                        });
                      })
                    ) : (
                      // Legacy: single column per grader
                      activeExperiment.graderIds.map((graderId) => {
                        const grader = graders.find((g) => g.id === graderId);
                        return <th key={graderId}>{grader?.name || graderId}</th>;
                      })
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeDataset.testCases?.map((tc) => (
                    <tr key={tc.id}>
                      <td className="font-mono text-sm max-w-[200px] truncate">
                        {tc.input}
                      </td>
                      {hasCandidates
                        ? activeExperiment.candidateIds!.map((candidateId) =>
                            activeExperiment.graderIds.map((graderId) => {
                              const result = activeExperiment.results?.find(
                                (r) =>
                                  r.testCaseId === tc.id &&
                                  r.graderId === graderId &&
                                  r.candidateId === candidateId
                              );
                              return (
                                <td key={`${candidateId}-${graderId}`}>
                                  {result ? (
                                    <ResultCell result={result} />
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              );
                            })
                          )
                        : activeExperiment.graderIds.map((graderId) => {
                            const result = activeExperiment.results?.find(
                              (r) => r.testCaseId === tc.id && r.graderId === graderId
                            );
                            return (
                              <td key={graderId}>
                                {result ? (
                                  <ResultCell result={result} />
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            );
                          })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No results yet
            </div>
          )}
        </div>
      )}

      {/* Past Experiments */}
      {experiments.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-medium">Past Experiments</h2>
          <div className="grid gap-2">
            {experiments.slice(0, 10).map((exp) => {
              const dataset = datasets.find((d) => d.id === exp.datasetId);
              const hasCands = exp.candidateIds && exp.candidateIds.length > 0;
              return (
                <button
                  key={exp.id}
                  onClick={() => viewExperiment(exp.id)}
                  className={`
                    card p-3 text-left hover:bg-muted/50 transition-colors
                    ${activeExperiment?.id === exp.id ? 'ring-2 ring-foreground' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{exp.name || 'Experiment'}</p>
                      <p className="text-sm text-muted-foreground">
                        {dataset?.name || 'Unknown dataset'} ·{' '}
                        {exp.graderIds.length} grader(s)
                        {hasCands && ` · ${exp.candidateIds!.length} candidate(s)`}
                      </p>
                    </div>
                    <span
                      className={`badge ${
                        exp.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : exp.status === 'failed'
                          ? 'bg-error/20 text-error'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCell({ result }: { result: { pass: boolean; score?: number; reason?: string; generatedOutput?: string; latencyMs?: number } }) {
  return (
    <div className="group relative">
      <span className={`badge ${result.pass ? 'badge-pass' : 'badge-fail'}`}>
        {result.pass ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
        {result.pass ? 'Pass' : 'Fail'}
      </span>

      <div className="absolute hidden group-hover:block z-10 bottom-full left-0 mb-2 w-72 p-2 bg-card border border-border rounded-md shadow-lg text-xs">
        <p className="font-medium mb-1">
          Score: {((result.score || 0) * 100).toFixed(0)}%
          {result.latencyMs !== undefined && (
            <span className="text-muted-foreground ml-2">{result.latencyMs}ms</span>
          )}
        </p>
        <p className="text-muted-foreground">{result.reason}</p>
        {result.generatedOutput && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="font-medium mb-0.5">Generated Output:</p>
            <p className="text-muted-foreground font-mono whitespace-pre-wrap">
              {result.generatedOutput.substring(0, 200)}
              {result.generatedOutput.length > 200 && '...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
