'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { gradersApi } from '@/lib/api';
import type { Grader, GraderType } from '@/lib/types';

const GRADER_TYPES: { value: GraderType; label: string; description: string }[] = [
  {
    value: 'exact-match',
    label: 'Exact Match',
    description: 'Output must match expected string exactly',
  },
  {
    value: 'llm-judge',
    label: 'LLM Judge',
    description: 'Uses an LLM with your rubric to judge pass/fail',
  },
  {
    value: 'semantic-similarity',
    label: 'Semantic Similarity',
    description: 'Compares embeddings using cosine similarity',
  },
  {
    value: 'faithfulness',
    label: 'Faithfulness',
    description: 'Checks if output is faithful to provided context (RAGAS-inspired)',
  },
];

export default function GradersPage() {
  const [graders, setGraders] = useState<Grader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGrader, setEditingGrader] = useState<Grader | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'exact-match' as GraderType,
    rubric: '',
  });

  useEffect(() => {
    loadGraders();
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
            Define evaluation criteria for your test cases
          </p>
        </div>
        <button onClick={() => openForm()} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Grader
        </button>
      </div>

      {graders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground">No graders yet</p>
          <button onClick={() => openForm()} className="btn-secondary mt-4">
            Create your first grader
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {graders.map((grader) => {
            const typeInfo = GRADER_TYPES.find((t) => t.value === grader.type);
            return (
              <div key={grader.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{grader.name}</h3>
                      <span className="badge bg-muted text-muted-foreground">
                        {typeInfo?.label || grader.type}
                      </span>
                    </div>
                    {grader.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {grader.description}
                      </p>
                    )}
                    {grader.rubric && (
                      <p className="text-xs text-muted-foreground mt-2 font-mono truncate">
                        Rubric: {grader.rubric.slice(0, 100)}
                        {grader.rubric.length > 100 ? '...' : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => openForm(grader)}
                      className="btn-ghost p-2 text-muted-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteGrader(grader.id)}
                      className="btn-ghost p-2 text-muted-foreground hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                  <label className="text-sm font-medium block mb-1">Type</label>
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
                  <label className="text-sm font-medium block mb-1">
                    Rubric
                    <span className="text-muted-foreground font-normal ml-1">
                      (required for LLM Judge)
                    </span>
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
    </div>
  );
}
