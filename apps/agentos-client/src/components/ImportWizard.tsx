import { useState, useRef } from 'react';
import { useSessionStore, type PersonaDefinition, type AgencyDefinition, type AgentSession } from '@/state/sessionStore';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Allows importing personas, agencies, and sessions from a JSON export
 * produced by `exportAllData()` or compatible schema. Data is merged into
 * the local IndexedDB-backed store without server writes.
 */
export function ImportWizard({ open, onClose }: ImportWizardProps) {
  const addPersona = useSessionStore((s) => s.addPersona);
  const addAgency = useSessionStore((s) => s.addAgency);
  const upsertSession = useSessionStore((s) => s.upsertSession);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string>('');

  if (!open) return null;

  const handlePickFile = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      let personasImported = 0;
      let agenciesImported = 0;
      let sessionsImported = 0;

      const tryArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);

      for (const p of tryArray(json.personas)) {
        const persona: PersonaDefinition = {
          id: String(p.id || crypto.randomUUID()),
          displayName: String(p.displayName || p.name || 'Imported persona'),
          description: typeof p.description === 'string' ? p.description : undefined,
          tags: Array.isArray(p.tags) ? p.tags : [],
          traits: Array.isArray(p.traits) ? p.traits : [],
          source: 'local',
        };
        addPersona(persona);
        personasImported += 1;
      }

      for (const a of tryArray(json.agencies)) {
        const agency: AgencyDefinition = {
          id: String(a.id || `agency-${crypto.randomUUID().slice(0, 8)}`),
          name: String(a.name || 'Imported agency'),
          goal: typeof a.goal === 'string' ? a.goal : undefined,
          workflowId: typeof a.workflowId === 'string' ? a.workflowId : undefined,
          participants: Array.isArray(a.participants) ? a.participants : [],
          metadata: typeof a.metadata === 'object' && a.metadata ? a.metadata : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addAgency(agency);
        agenciesImported += 1;
      }

      for (const s of tryArray(json.sessions)) {
        const session: AgentSession = {
          id: String(s.id || crypto.randomUUID()),
          targetType: s.targetType === 'agency' ? 'agency' : 'persona',
          displayName: String(s.displayName || 'Imported session'),
          personaId: s.personaId,
          agencyId: s.agencyId,
          status: 'idle',
          events: Array.isArray(s.events) ? s.events : [],
        };
        upsertSession(session);
        sessionsImported += 1;
      }

      setMessage(`Imported ${personasImported} persona(s), ${agenciesImported} agency(ies), ${sessionsImported} session(s).`);
    } catch (err: any) {
      setMessage(`Import failed: ${err?.message || String(err)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Import</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
          >
            Close
          </button>
        </header>
        <p className="text-sm text-slate-600 dark:text-slate-300">Select a JSON file exported from this app. Import supports personas and agencies.</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePickFile}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Choose file
          </button>
          <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }} />
        </div>
        {message && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{message}</p>}
      </div>
    </div>
  );
}


