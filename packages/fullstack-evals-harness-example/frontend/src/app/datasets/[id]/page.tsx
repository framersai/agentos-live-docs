'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { datasetsApi } from '@/lib/api';
import type { Dataset } from '@/lib/types';

export default function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDataset();
  }, [id]);

  async function loadDataset() {
    try {
      const data = await datasetsApi.get(id);
      setDataset(data);
    } catch (error) {
      console.error('Failed to load dataset:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
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

      <p className="text-sm text-muted-foreground">
        {dataset.testCases?.length || 0} test cases
        {dataset.source === 'file' && (
          <> &middot; loaded from <code className="text-xs">{id}.csv</code></>
        )}
      </p>

      {dataset.testCases && dataset.testCases.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th className="w-1/3">Input</th>
                <th className="w-1/3">Expected Output</th>
                <th className="w-1/4">Context</th>
              </tr>
            </thead>
            <tbody>
              {dataset.testCases.map((tc, idx) => (
                <tr key={tc.id}>
                  <td className="text-muted-foreground text-xs">{idx + 1}</td>
                  <td>
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {tc.input}
                    </pre>
                  </td>
                  <td>
                    <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                      {tc.expectedOutput || '—'}
                    </pre>
                  </td>
                  <td>
                    <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground max-w-[300px] truncate">
                      {tc.context || '—'}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground">No test cases in this dataset</p>
        </div>
      )}
    </div>
  );
}
