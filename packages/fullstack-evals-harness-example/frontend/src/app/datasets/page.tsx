'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { datasetsApi } from '@/lib/api';
import type { Dataset } from '@/lib/types';

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    loadDatasets();
  }, []);

  async function loadDatasets() {
    try {
      const data = await datasetsApi.list();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createDataset() {
    if (!newName.trim()) return;

    try {
      await datasetsApi.create({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
      });
      setNewName('');
      setNewDescription('');
      setShowCreateModal(false);
      loadDatasets();
    } catch (error) {
      console.error('Failed to create dataset:', error);
    }
  }

  async function deleteDataset(id: string) {
    if (!confirm('Delete this dataset and all its test cases?')) return;

    try {
      await datasetsApi.delete(id);
      loadDatasets();
    } catch (error) {
      console.error('Failed to delete dataset:', error);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your test case collections
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Dataset
        </button>
      </div>

      {datasets.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground">No datasets yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-secondary mt-4"
          >
            Create your first dataset
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="card p-4 flex items-center justify-between">
              <Link
                href={`/datasets/${dataset.id}`}
                className="flex-1 flex items-center gap-4 hover:opacity-80"
              >
                <div>
                  <h3 className="font-medium">{dataset.name}</h3>
                  {dataset.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {dataset.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {dataset.testCaseCount || 0} test cases
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteDataset(dataset.id);
                }}
                className="btn-ghost p-2 text-muted-foreground hover:text-error ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Dataset</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="My Dataset"
                  className="input"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="A collection of test cases for..."
                  className="input"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={createDataset} className="btn-primary">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
