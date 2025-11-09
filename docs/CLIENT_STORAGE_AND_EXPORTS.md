# AgentOS Client: Local Storage, Export, and Import

This client stores your data locally in your browser using IndexedDB. Nothing is written to the server unless you explicitly send requests to backend endpoints.

## What is stored locally

- Personas (remote + local entries)
- Agencies (your local definitions)
- Sessions (timeline events per session)

## Export options

- Per-session export: in the Session timeline header use “Export session”, “Export agency”, and “Export workflow”.
- Full export: Settings → Data → “Export all” (or the “Export all” button in the Session timeline). Produces a JSON bundle with personas, agencies, and sessions.

## Import

- Use Settings → Data → “Import…”.
- Accepted schema: `agentos-client-export-v1` (produced by this client). Personas, agencies, and sessions are merged into your local store.

## Clear storage

- Settings → Data → “Clear storage” wipes local IndexedDB. Export before clearing if needed.

## Notes

- Session state is local and persistent between reloads. You can delete individual sessions or clear all.
- The server’s AgentOS APIs don’t receive your local library unless you export and move data manually.
- The export format is versioned; future clients can add migrations.

