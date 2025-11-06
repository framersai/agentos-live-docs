import { useSessionStore } from '@/state/sessionStore';

/**
 * Exports the full client dataset (personas, agencies, sessions) as JSON.
 * The export schema is versioned via the `schema` field for future compatibility.
 */
export function exportAllData(): void {
  const state = useSessionStore.getState();
  const payload = {
    personas: state.personas,
    agencies: state.agencies,
    sessions: state.sessions,
    exportedAt: new Date().toISOString(),
    schema: 'agentos-client-export-v1',
  };
  const data = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agentos-client-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


