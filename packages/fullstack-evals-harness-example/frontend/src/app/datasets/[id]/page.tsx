'use client';

import { useState, useEffect, use, useCallback } from 'react';
import {
  ArrowLeft,
  FileJson,
  FileSpreadsheet,
  Save,
  Plus,
  X,
  FileText,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { datasetsApi, promptsApi } from '@/lib/api';
import type { Dataset, TestCase, Candidate } from '@/lib/types';

interface EditableCase {
  input: string;
  expectedOutput: string;
  context: string;
  metadata: string;
}

function toEditable(tc: TestCase): EditableCase {
  return {
    input: tc.input,
    expectedOutput: tc.expectedOutput || '',
    context: tc.context || '',
    metadata: tc.metadata ? JSON.stringify(tc.metadata) : '',
  };
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1">
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-64 text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
}

export default function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedCases, setEditedCases] = useState<EditableCase[]>([]);
  const [originalCases, setOriginalCases] = useState<EditableCase[]>([]);
  const [linkedPrompts, setLinkedPrompts] = useState<Candidate[]>([]);

  useEffect(() => {
    loadDataset();
    loadLinkedPrompts();
  }, [id]);

  async function loadDataset() {
    try {
      const data = await datasetsApi.get(id);
      setDataset(data);
      const cases = (data.testCases || []).map(toEditable);
      setEditedCases(cases);
      setOriginalCases(cases);
    } catch (error) {
      console.error('Failed to load dataset:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadLinkedPrompts() {
    try {
      const all = await promptsApi.list();
      setLinkedPrompts(all.filter((p) => p.recommendedDatasets?.includes(id)));
    } catch {
      // non-critical
    }
  }

  const isDirty = useCallback(() => {
    if (editedCases.length !== originalCases.length) return true;
    return editedCases.some(
      (ec, i) =>
        ec.input !== originalCases[i].input ||
        ec.expectedOutput !== originalCases[i].expectedOutput ||
        ec.context !== originalCases[i].context ||
        ec.metadata !== originalCases[i].metadata,
    );
  }, [editedCases, originalCases]);

  function updateCase(index: number, field: keyof EditableCase, value: string) {
    setEditedCases((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addRow() {
    setEditedCases((prev) => [
      ...prev,
      { input: '', expectedOutput: '', context: '', metadata: '' },
    ]);
  }

  function removeRow(index: number) {
    setEditedCases((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const testCases = editedCases
        .filter((ec) => ec.input.trim())
        .map((ec) => {
          let metadata: Record<string, unknown> | undefined;
          if (ec.metadata.trim()) {
            try {
              metadata = JSON.parse(ec.metadata);
            } catch {
              // ignore invalid JSON
            }
          }
          return {
            input: ec.input,
            expectedOutput: ec.expectedOutput || undefined,
            context: ec.context || undefined,
            metadata,
          };
        });

      const updated = await datasetsApi.update(id, { testCases });
      setDataset(updated);
      const cases = (updated.testCases || []).map(toEditable);
      setEditedCases(cases);
      setOriginalCases(cases);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save dataset. Check the console for details.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Dataset not found</p>
        <Link href="/datasets" className="btn-secondary mt-4">
          Back to datasets
        </Link>
      </div>
    );
  }

  const dirty = isDirty();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/datasets" className="btn-ghost p-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{dataset.name}</h1>
            {dataset.description && (
              <p className="text-muted-foreground">{dataset.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn-primary"
            title="Save changes to CSV on disk"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save to Disk'}
          </button>
          <a
            href={datasetsApi.exportCsvUrl(id)}
            download
            className="btn-secondary"
            title="Download as CSV"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </a>
          <a
            href={datasetsApi.exportJsonUrl(id)}
            download
            className="btn-secondary"
            title="Download as JSON"
          >
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </a>
        </div>
      </div>

      {/* File info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{editedCases.length} test cases</span>
        {dataset.filePath && (
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <code className="text-xs">{dataset.filePath}</code>
          </span>
        )}
        {dataset.metaPath && (
          <span>
            <code className="text-xs">{dataset.metaPath}</code>
          </span>
        )}
        {dirty && (
          <span className="text-amber-500 font-medium">Unsaved changes</span>
        )}
      </div>

      {/* Linked prompts */}
      {linkedPrompts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Used by:</span>
          {linkedPrompts.map((p) => (
            <a
              key={p.id}
              href={`/candidates/${p.id}`}
              className="badge bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors text-xs"
            >
              {p.name}
            </a>
          ))}
        </div>
      )}

      {/* Editable test cases table */}
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-10">#</th>
              <th>
                <span className="flex items-center">
                  Input
                  <Tooltip text="Required. The query or prompt that will be sent to the LLM candidate during evaluation." />
                </span>
              </th>
              <th>
                <span className="flex items-center">
                  Expected Output
                  <Tooltip text="Optional. The ground truth answer used by graders like exact-match, contains, and semantic-similarity to compare against the LLM's response." />
                </span>
              </th>
              <th>
                <span className="flex items-center">
                  Context
                  <span className="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
                  <Tooltip text="Optional. Supporting context for RAGAS-style faithfulness evaluation. Provides the source material the LLM should reference — used to detect hallucinations (claims not supported by context)." />
                </span>
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {editedCases.map((ec, idx) => (
              <tr key={idx} className="group">
                <td className="text-muted-foreground text-xs align-top pt-3">
                  {idx + 1}
                </td>
                <td className="p-1">
                  <textarea
                    value={ec.input}
                    onChange={(e) => updateCase(idx, 'input', e.target.value)}
                    className="input min-h-[60px] resize-y text-sm font-mono w-full"
                    placeholder="Input text..."
                  />
                </td>
                <td className="p-1">
                  <textarea
                    value={ec.expectedOutput}
                    onChange={(e) =>
                      updateCase(idx, 'expectedOutput', e.target.value)
                    }
                    className="input min-h-[60px] resize-y text-sm font-mono w-full"
                    placeholder="Expected output..."
                  />
                </td>
                <td className="p-1">
                  <textarea
                    value={ec.context}
                    onChange={(e) => updateCase(idx, 'context', e.target.value)}
                    className="input min-h-[60px] resize-y text-sm font-mono w-full"
                    placeholder="Context..."
                  />
                </td>
                <td className="align-top pt-2">
                  <button
                    onClick={() => removeRow(idx)}
                    className="btn-ghost p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                    title="Remove row"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <button onClick={addRow} className="btn-secondary w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Test Case
      </button>
    </div>
  );
}
