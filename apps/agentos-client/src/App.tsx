import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SkipLink } from "@/components/SkipLink";
import { Sidebar } from "@/components/Sidebar";
import { SessionInspector } from "@/components/SessionInspector";
import { RequestComposer, type RequestComposerPayload } from "@/components/RequestComposer";
import { AgencyManager } from "@/components/AgencyManager";
import { PersonaCatalog } from "@/components/PersonaCatalog";
import { WorkflowOverview } from "@/components/WorkflowOverview";
import { openAgentOSStream } from "@/lib/agentosClient";
import { TourOverlay } from "@/components/TourOverlay";
import { ThemePanel } from "@/components/ThemePanel";
import { AboutPanel } from "@/components/AboutPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ImportWizard } from "@/components/ImportWizard";
import { useUiStore } from "@/state/uiStore";
import { usePersonas } from "@/hooks/usePersonas";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { useSessionStore } from "@/state/sessionStore";
import {
  AgentOSChunkType,
  type AgentOSAgencyUpdateChunk,
  type AgentOSWorkflowUpdateChunk
} from "@/types/agentos";

const DEFAULT_PERSONA_ID = "nerf_generalist";

export default function App() {
  const LEFT_TABS = [
    { key: "compose", label: "Compose" },
    { key: "agency", label: "Agency" },
    { key: "personas", label: "Personas" },
    { key: "workflows", label: "Workflows" },
    { key: "settings", label: "Settings" },
    { key: "about", label: "About" },
  ] as const;
  type LeftTabKey = typeof LEFT_TABS[number]["key"];
  const [leftTab, setLeftTab] = useState<LeftTabKey>("compose");
  const [showTour, setShowTour] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const welcomeTourDismissed = useUiStore((s) => s.welcomeTourDismissed);
  const welcomeTourSnoozeUntil = useUiStore((s) => s.welcomeTourSnoozeUntil);
  const dismissWelcomeTour = useUiStore((s) => s.dismissWelcomeTour);
  const snoozeWelcomeTour = useUiStore((s) => s.snoozeWelcomeTour);
  const tourSteps = [
    { selector: '[data-tour="tabs"]', title: 'Panels', body: 'Switch between Compose, Agency, Personas, Workflows, Settings, and About.' },
    { selector: '[data-tour="composer"]', title: 'Compose', body: 'Write prompts, select persona/agency, and submit to start a session.' },
    { selector: '[data-tour="agency-manager"]', title: 'Agency', body: 'Define multi-seat collectives and attach workflows.' },
    { selector: '[data-tour="theme-button"]', title: 'Theme', body: 'Switch theme mode, appearance, and palette (Sakura, Twilight, etc.)' },
    { selector: '[data-tour="import-button"]', title: 'Import', body: 'Import exported personas, agencies, and sessions from JSON.' },
  ];
  const { t } = useTranslation();
  useSystemTheme();
  const personas = useSessionStore((state) => state.personas);
  const agencies = useSessionStore((state) => state.agencies);
  const sessions = useSessionStore((state) => state.sessions);
  const addAgency = useSessionStore((state) => state.addAgency);
  const applyAgencySnapshot = useSessionStore((state) => state.applyAgencySnapshot);
  const applyWorkflowSnapshot = useSessionStore((state) => state.applyWorkflowSnapshot);
  const setPersonas = useSessionStore((state) => state.setPersonas);
  const personaFilters = useSessionStore((state) => state.personaFilters);
  const upsertSession = useSessionStore((state) => state.upsertSession);
  const appendEvent = useSessionStore((state) => state.appendEvent);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const setActiveSession = useSessionStore((state) => state.setActiveSession);

  const streamHandles = useRef<Record<string, () => void>>({});
  const personasQuery = usePersonas({
    filters: {
      search: personaFilters.search.trim() ? personaFilters.search.trim() : undefined,
      capability: personaFilters.capabilities
    }
  });

  const backendReady = Boolean(personasQuery.data && personasQuery.data.length > 0);

  useEffect(() => {
    if (!personasQuery.data) return;
    setPersonas(personasQuery.data);
  }, [personasQuery.data, setPersonas]);

  // Ensure there is at least one default session on first load
  useEffect(() => {
    if (sessions.length > 0) return;
    const firstRemote = personas.find((p) => p.source === 'remote');
    if (!firstRemote) return; // wait until remote personas are loaded
    const sessionId = crypto.randomUUID();
    upsertSession({
      id: sessionId,
      targetType: 'persona',
      displayName: 'Untitled',
      personaId: firstRemote.id,
      status: 'idle',
      events: [],
    });
    setActiveSession(sessionId);
  }, [sessions.length, personas]);

  // Seed a demo agency if none exists, to make the dashboard usable immediately
  useEffect(() => {
    const remotePersonas = personas.filter((p) => p.source === "remote");
    if (agencies.length === 0) {
      const id = "demo-agency";
      const timestamp = new Date().toISOString();
      addAgency({
        id,
        name: "Demo Agency",
        goal: "Demonstrate multi-seat coordination",
        workflowId: undefined,
        participants: [
          { roleId: "lead", personaId: remotePersonas[0]?.id || DEFAULT_PERSONA_ID },
        ],
        metadata: { seeded: true },
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  }, [agencies.length, personas, addAgency]);

  useEffect(() => {
    if (personasQuery.error) {
      console.error("[AgentOS Client] Failed to load personas", personasQuery.error);
    }
  }, [personasQuery.error]);

  // Wire up a global event to open the import wizard from SettingsPanel
  useEffect(() => {
    const open = () => setShowImport(true);
    window.addEventListener('agentos:open-import', open as EventListener);
    return () => window.removeEventListener('agentos:open-import', open as EventListener);
  }, []);

  // Show welcome tour on first load unless dismissed or snoozed
  useEffect(() => {
    if (!welcomeTourDismissed) {
      const now = Date.now();
      if (!welcomeTourSnoozeUntil || now >= welcomeTourSnoozeUntil) {
        setShowTour(true);
      }
    }
  }, [welcomeTourDismissed, welcomeTourSnoozeUntil]);


  const resolvePersonaName = useCallback(
    (personaId?: string | null) => {
      if (!personaId) {
        return t("app.fallbacks.untitledPersona");
      }
      const persona = personas.find((item) => item.id === personaId);
      return persona?.displayName ?? personaId;
    },
    [personas, t]
  );

  const resolveAgencyName = useCallback(
    (agencyId?: string | null) => {
      if (!agencyId) {
        return t("app.fallbacks.agencyCollective");
      }
      const agency = agencies.find((item) => item.id === agencyId);
      return agency?.name ?? agencyId;
    },
    [agencies, t]
  );

  const ensureSession = useCallback(
    (payload: RequestComposerPayload) => {
      const sessionId = activeSessionId ?? crypto.randomUUID();
      if (!activeSessionId) {
        upsertSession({
          id: sessionId,
          targetType: payload.targetType,
          displayName:
            payload.targetType === "agency"
              ? resolveAgencyName(payload.agencyId)
              : resolvePersonaName(payload.personaId),
          personaId: payload.targetType === "persona" ? payload.personaId : undefined,
          agencyId: payload.targetType === "agency" ? payload.agencyId : undefined,
          status: "idle",
          events: []
        });
        setActiveSession(sessionId);
      }
      return sessionId;
    },
    [activeSessionId, resolveAgencyName, resolvePersonaName, setActiveSession, upsertSession]
  );

  const preferDefaultPersona = useCallback((ids: string[]): string | undefined => {
    if (ids.includes('v_researcher')) return 'v_researcher';
    if (ids.includes('nerf_generalist')) return 'nerf_generalist';
    return ids[0];
  }, []);

  const handleCreateSession = useCallback((opts?: { targetType?: 'persona' | 'agency'; personaId?: string; agencyId?: string; displayName?: string }) => {
    const sessionId = crypto.randomUUID();
    const hasAgencies = agencies.length > 0;
    const remoteIds = personas.filter((p) => p.source === 'remote').map((p) => p.id);
    const personaId = opts?.personaId ?? (preferDefaultPersona(remoteIds) ?? personas[0]?.id ?? DEFAULT_PERSONA_ID);
    const agencyId = opts?.agencyId ?? agencies[0]?.id;
    const base = 'Untitled';
    const existing = sessions.filter((s) => s.displayName.startsWith(base)).length;
    const name = existing === 0 ? base : `${base} (${existing})`;
    upsertSession({
      id: sessionId,
      targetType: opts?.targetType ?? (hasAgencies ? "agency" : "persona"),
      displayName: opts?.displayName ?? (opts?.targetType === 'agency' ? resolveAgencyName(agencyId) : name),
      personaId: (opts?.targetType ?? (hasAgencies ? 'agency' : 'persona')) === "persona" ? personaId : undefined,
      agencyId: (opts?.targetType ?? (hasAgencies ? 'agency' : 'persona')) === "agency" ? agencyId : undefined,
      status: "idle",
      events: []
    });
    setActiveSession(sessionId);
  }, [agencies, personas, sessions, resolveAgencyName, setActiveSession, upsertSession, preferDefaultPersona]);

  const handleSubmit = useCallback(
    (payload: RequestComposerPayload) => {
      const sessionId = ensureSession(payload);
      setActiveSession(sessionId);

      streamHandles.current[sessionId]?.();
      delete streamHandles.current[sessionId];

      const displayName =
        payload.targetType === "agency" ? resolveAgencyName(payload.agencyId) : resolvePersonaName(payload.personaId);
      const timestamp = Date.now();

      const agencyDefinition =
        payload.targetType === "agency" ? agencies.find((item) => item.id === payload.agencyId) ?? null : null;

      const remoteIds = personas.filter((p) => p.source === 'remote').map((p) => p.id);
      const preferred = preferDefaultPersona(remoteIds);
      const chosenPersona = payload.personaId && remoteIds.includes(payload.personaId) ? payload.personaId : preferred;
      if (!chosenPersona) {
        appendEvent(sessionId, {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'log',
          payload: { message: 'No personas available. Load remote personas before streaming.', level: 'error' }
        });
        upsertSession({ id: sessionId, status: 'error' });
        return;
      }
      const personaForStream = chosenPersona;

      const workflowDefinitionId = payload.workflowId ?? agencyDefinition?.workflowId;
      const workflowInstanceId = workflowDefinitionId ? `${workflowDefinitionId}-${sessionId}` : undefined;

      const agencyRequest = payload.targetType === "agency"
        ? {
            agencyId: payload.agencyId,
            workflowId: workflowInstanceId ?? undefined,
            goal: agencyDefinition?.goal,
            participants: (agencyDefinition?.participants ?? []).map((participant) => ({
              roleId: participant.roleId,
              personaId: participant.personaId && remoteIds.includes(participant.personaId) ? participant.personaId : (preferred ?? chosenPersona),
            })),
            metadata: agencyDefinition?.metadata
          }
        : undefined;

      const workflowRequest = workflowDefinitionId
        ? {
            definitionId: workflowDefinitionId,
            workflowId: workflowInstanceId,
            conversationId: sessionId,
            metadata: { source: "agentos-client" }
          }
        : undefined;

      upsertSession({
        id: sessionId,
        targetType: payload.targetType,
        displayName,
        personaId: payload.targetType === "persona" ? payload.personaId : undefined,
        agencyId: payload.targetType === "agency" ? payload.agencyId : undefined,
        status: "streaming"
      });

      appendEvent(sessionId, {
        id: crypto.randomUUID(),
        timestamp,
        type: "log",
        payload: {
          message: t("app.logs.userMessage", { displayName, content: payload.input })
        }
      });

      const cleanup = openAgentOSStream(
        {
          sessionId,
          personaId: personaForStream,
          messages: [{ role: "user", content: payload.input }],
          workflowRequest,
          agencyRequest
        },
        {
          onChunk: (chunk) => {
            appendEvent(sessionId, {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              type: chunk.type,
              payload: chunk
            });

            if (chunk.type === AgentOSChunkType.AGENCY_UPDATE) {
              applyAgencySnapshot((chunk as AgentOSAgencyUpdateChunk).agency);
            }

            if (chunk.type === AgentOSChunkType.WORKFLOW_UPDATE) {
              applyWorkflowSnapshot((chunk as AgentOSWorkflowUpdateChunk).workflow);
            }
          },
          onDone: () => {
            upsertSession({ id: sessionId, status: "idle" });
            delete streamHandles.current[sessionId];
          },
          onError: (error) => {
            appendEvent(sessionId, {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              type: "log",
              payload: { message: t("app.logs.streamError", { message: error.message }), level: "error" }
            });
            upsertSession({ id: sessionId, status: "error" });
            delete streamHandles.current[sessionId];
          }
        }
      );

      streamHandles.current[sessionId] = cleanup;
    },
    [agencies, personas, appendEvent, applyAgencySnapshot, applyWorkflowSnapshot, ensureSession, resolveAgencyName, resolvePersonaName, setActiveSession, upsertSession]
  );

  // Removed auto-new-session on tab switch; tabs now only change view and filter.

  return (
    <>
      <SkipLink />
      <div className={`${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-panel'} grid min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-300 ease-out dark:bg-slate-950 dark:text-slate-100`}>
        {/* Navigation Sidebar */}
        {!sidebarCollapsed && <Sidebar onCreateSession={handleCreateSession} onToggleCollapse={() => setSidebarCollapsed(true)} currentTab={leftTab} />}
        
        {/* Main Content Area */}
        <main 
          id="main-content"
          className="flex flex-col gap-6 overflow-y-auto bg-white p-6 transition-colors duration-300 dark:bg-slate-950"
          role="main"
          aria-label={t("app.labels.mainContent", { defaultValue: "Main content area" })}
        >
          {sidebarCollapsed && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                title="Show sidebar"
              >
                Show sidebar
              </button>
            </div>
          )}
          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Left Column: Tabbed coordination */}
            <section className="flex h-full flex-col gap-4" aria-label={t("app.labels.leftPanel", { defaultValue: "Composer and coordination" })}>
              <div
                role="tablist"
                aria-label="Left panel tabs"
                className="rounded-3xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-900/60"
                data-tour="tabs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {LEFT_TABS.map((tab) => {
                    const active = leftTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setLeftTab(tab.key)}
                        className={`${
                          active
                            ? "bg-sky-500 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                        } rounded-full border px-3 py-1.5 transition focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTour(true)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                      title="Launch guided tour"
                    >
                      Tour
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowThemePanel((v) => !v)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                      title="Theme & appearance"
                      data-tour="theme-button"
                    >
                      Theme
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImport(true)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                      title="Import JSON"
                      data-tour="import-button"
                    >
                      Import
                    </button>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400">
                Local-only: Changes here live in your browser until you export/import.
              </div>

              {showThemePanel && <ThemePanel />}
              {leftTab === "compose" && <RequestComposer key={activeSessionId || 'compose'} onSubmit={handleSubmit} disabled={!backendReady} />}
              {leftTab === "agency" && <AgencyManager />}
              {leftTab === "personas" && <PersonaCatalog />}
              {leftTab === "workflows" && <WorkflowOverview />}
              {leftTab === "settings" && <SettingsPanel />}
              {leftTab === "about" && <AboutPanel />}
            </section>

            {/* Right Column: Outputs only with placeholders */}
            <aside
              className="flex h-full flex-col gap-6"
              aria-label={t("app.labels.outputsPanel", { defaultValue: "Outputs and results" })}
            >
              <SessionInspector />
              <div className="border-t border-slate-200 dark:border-white/10" />
              <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60">
                <header className="mb-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Stream status</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live telemetry</h3>
                </header>
                <p className="text-xs text-slate-600 dark:text-slate-400">Metrics and heartbeat placeholders.</p>
              </section>
              <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60">
                <header className="mb-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Analytics</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Usage insights</h3>
                </header>
                <p className="text-xs text-slate-600 dark:text-slate-400">Charts and summaries will appear here.</p>
              </section>
            </aside>
          </div>
        </main>
      </div>
      <TourOverlay
        open={showTour}
        steps={tourSteps}
        onClose={() => setShowTour(false)}
        onDontShowAgain={() => dismissWelcomeTour()}
        onRemindLater={() => snoozeWelcomeTour(24)}
      />
      <ImportWizard open={showImport} onClose={() => setShowImport(false)} />
    </>
  );
}
