import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SkipLink } from "@/components/SkipLink";
import { Sidebar } from "@/components/Sidebar";
import { SessionInspector } from "@/components/SessionInspector";
import { RequestComposer, type RequestComposerPayload } from "@/components/RequestComposer";
import { AgencyManager } from "@/components/AgencyManager";
import { PersonaCatalog } from "@/components/PersonaCatalog";
import { WorkflowOverview } from "@/components/WorkflowOverview";
import { openAgentOSStream, getLlmStatus } from "@/lib/agentosClient";
import { TourOverlay } from "@/components/TourOverlay";
import { ThemePanel } from "@/components/ThemePanel";
import { AboutPanel } from "@/components/AboutPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ImportWizard } from "@/components/ImportWizard";
import { useUiStore } from "@/state/uiStore";
import { usePersonas } from "@/hooks/usePersonas";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { useSessionStore } from "@/state/sessionStore";
import { useTelemetryStore } from "@/state/telemetryStore";
import React from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function TelemetryView() {
  const perSession = useTelemetryStore((s) => s.perSession);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const m = activeSessionId ? perSession[activeSessionId] : undefined;
  if (!m) return <p className="text-xs text-slate-600 dark:text-slate-400">No telemetry yet.</p>;
  return (
    <dl className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
      <div><dt className="uppercase tracking-widest text-slate-500">Chunks</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.chunks ?? 0}</dd></div>
      <div><dt className="uppercase tracking-widest text-slate-500">Chars</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.textDeltaChars ?? 0}</dd></div>
      <div><dt className="uppercase tracking-widest text-slate-500">Tool calls</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.toolCalls ?? 0}</dd></div>
      <div><dt className="uppercase tracking-widest text-slate-500">Errors</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.errors ?? 0}</dd></div>
      <div><dt className="uppercase tracking-widest text-slate-500">Duration</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.durationMs ? `${Math.round(m.durationMs)}ms` : '-'}</dd></div>
      <div><dt className="uppercase tracking-widest text-slate-500">Tokens</dt><dd className="font-semibold text-slate-900 dark:text-slate-100">{m.finalTokensTotal ?? '-'}</dd></div>
    </dl>
  );
}

function AnalyticsView({ selectedModel, onChangeModel, modelOptions }: { selectedModel?: string; onChangeModel: (model?: string) => void; modelOptions: string[] }) {
  const perSession = useTelemetryStore((s) => s.perSession);
  const activeSessionId = useSessionStore((s) => s.activeSessionId);
  const m = activeSessionId ? perSession[activeSessionId] : undefined;
  const tokens = m?.finalTokensTotal ?? 0;
  const estimateUsd = (tokens: number, model?: string) => {
    // Simple estimate: $0.002 per 1k tokens by default; override for known models if desired
    const per1k = 0.002;
    return ((tokens / 1000) * per1k);
  };
  const cost = estimateUsd(tokens, selectedModel);
  return (
    <div className="text-xs text-slate-600 dark:text-slate-400">
      <div className="mb-2 flex items-center gap-2">
        <label className="text-[11px] uppercase tracking-widest text-slate-500">Model</label>
        <select
          value={selectedModel || ''}
          onChange={(e) => onChangeModel(e.target.value || undefined)}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs dark:border-white/10 dark:bg-slate-900"
        >
          <option value="">System default</option>
          {modelOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <p>Last session tokens: {tokens || '-'}</p>
      <p>Estimated cost: {tokens ? `$${cost.toFixed(4)}` : '-'}</p>
    </div>
  );
}
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
    { key: "workflows", label: "Workflows" }
  ] as const;
  type LeftTabKey = typeof LEFT_TABS[number]["key"];
  const [leftTab, setLeftTab] = useState<LeftTabKey>("compose");
  const [showTour, setShowTour] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined);
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
  const telemetry = useTelemetryStore();
  const personasQuery = usePersonas({
    filters: {
      search: personaFilters.search.trim() ? personaFilters.search.trim() : undefined,
      capability: personaFilters.capabilities
    }
  });

  const backendReady = !personasQuery.isLoading && !personasQuery.isError;

  useEffect(() => {
    if (!personasQuery.data) return;
    setPersonas(personasQuery.data);
  }, [personasQuery.data, setPersonas]);

  // Fetch LLM status to populate model options (parse defaults from provider reasons)
  useEffect(() => {
    (async () => {
      try {
        const status = await getLlmStatus();
        const providers = status?.providers || {};
        const models: string[] = [];
        for (const key of Object.keys(providers)) {
          const p = providers[key];
          if (p?.available && typeof p.reason === 'string') {
            const match = p.reason.match(/default model:\s*([^\)]+)\)/i);
            if (match && match[1]) models.push(match[1]);
          }
        }
        setModelOptions(models);
      } catch {
        setModelOptions([]);
      }
    })();
  }, []);

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

  // Toggle Theme Panel via custom event
  useEffect(() => {
    const toggle = () => setShowThemePanel((v) => !v);
    window.addEventListener('agentos:toggle-theme-panel', toggle as EventListener);
    return () => window.removeEventListener('agentos:toggle-theme-panel', toggle as EventListener);
  }, []);

  // Toggle Tour Overlay via custom event
  useEffect(() => {
    const toggle = () => setShowTour((v) => !v);
    window.addEventListener('agentos:toggle-tour', toggle as EventListener);
    return () => window.removeEventListener('agentos:toggle-tour', toggle as EventListener);
  }, []);

  // Settings / About as modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  useEffect(() => {
    const openSettings = () => setShowSettingsModal(true);
    window.addEventListener('agentos:open-settings', openSettings as EventListener);
    return () => window.removeEventListener('agentos:open-settings', openSettings as EventListener);
  }, []);
  useEffect(() => {
    const openAbout = () => setShowAboutModal(true);
    window.addEventListener('agentos:open-about', openAbout as EventListener);
    return () => window.removeEventListener('agentos:open-about', openAbout as EventListener);
  }, []);

  // Responsive: track desktop vs mobile and auto-collapse sidebar on small screens
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = (matches: boolean) => {
      setIsDesktop(matches);
      if (!matches) {
        setSidebarCollapsed(false); // sidebar visibility handled by mobile overlay
      }
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
      const allIds = personas.map((p) => p.id);
      const preferred = preferDefaultPersona(remoteIds) ?? personas[0]?.id ?? DEFAULT_PERSONA_ID;
      const chosenPersona = (payload.personaId && allIds.includes(payload.personaId)) ? payload.personaId : preferred;
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
              personaId: (participant.personaId && allIds.includes(participant.personaId)) ? participant.personaId : chosenPersona,
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

      telemetry.startStream(sessionId);

      const cleanup = openAgentOSStream(
        {
          sessionId,
          personaId: personaForStream,
          messages: [{ role: "user", content: payload.input }],
          workflowRequest,
          agencyRequest,
          model: selectedModel,
        },
        {
          onChunk: (chunk) => {
            // Debug: surface incoming chunks in console for verification
            try {
              // eslint-disable-next-line no-console
              console.debug('[AgentOS SSE] chunk:', chunk);
            } catch {}
            appendEvent(sessionId, {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              type: chunk.type,
              payload: chunk
            });

            telemetry.noteChunk(sessionId, chunk);

            if (chunk.type === AgentOSChunkType.AGENCY_UPDATE) {
              applyAgencySnapshot((chunk as AgentOSAgencyUpdateChunk).agency);
            }

            if (chunk.type === AgentOSChunkType.WORKFLOW_UPDATE) {
              applyWorkflowSnapshot((chunk as AgentOSWorkflowUpdateChunk).workflow);
            }
          },
          onDone: () => {
            upsertSession({ id: sessionId, status: "idle" });
            telemetry.endStream(sessionId);
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
            telemetry.endStream(sessionId);
            delete streamHandles.current[sessionId];
          }
        }
      );

      streamHandles.current[sessionId] = cleanup;
    },
    [agencies, personas, appendEvent, applyAgencySnapshot, applyWorkflowSnapshot, ensureSession, resolveAgencyName, resolvePersonaName, setActiveSession, upsertSession, selectedModel, telemetry, t]
  );

  // Removed auto-new-session on tab switch; tabs now only change view and filter.

  return (
    <>
      <SkipLink />
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isDesktop && (
              <button
                type="button"
                className="mr-1 inline-flex items-center justify-center rounded-md border border-slate-200 p-1 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
                aria-label="Open sidebar"
                onClick={() => setShowMobileSidebar(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <a href="https://agentos.sh" target="_blank" rel="noreferrer" className="group flex items-center gap-2">
            <img src="/logos/agentos-primary-no-tagline.svg" alt="AgentOS" className="block h-7 w-auto transition-transform group-hover:scale-105 dark:hidden" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} />
            <img src="/logos/agentos-primary-dark-2x.png" alt="AgentOS" className="hidden h-7 w-auto transition-transform group-hover:scale-105 dark:block" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display='none')} />
            </a>
          </div>
          <nav className="flex items-center gap-4">
            <a href="https://agentos.sh/docs" target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400">Docs</a>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400">GitHub</a>
            <a href="https://vca.chat" target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400">Marketplace</a>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900"
                title="Theme settings"
              >
                Theme
              </button>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
      {showThemePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <ThemePanel />
            <div className="mt-3 flex justify-end">
              <button onClick={() => setShowThemePanel(false)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <SettingsPanel />
            <div className="mt-3 flex justify-end">
              <button onClick={() => setShowSettingsModal(false)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <AboutPanel />
            <div className="mt-3 flex justify-end">
              <button onClick={() => setShowAboutModal(false)} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300">Close</button>
            </div>
          </div>
        </div>
      )}
      <div className={`${sidebarCollapsed ? 'grid-cols-1' : 'grid-cols-panel'} grid min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-300 ease-out dark:bg-slate-950 dark:text-slate-100`}>
        {/* Navigation Sidebar */}
        {!sidebarCollapsed && (
          isDesktop ? (
            <Sidebar onCreateSession={handleCreateSession} onToggleCollapse={() => setSidebarCollapsed(true)} currentTab={leftTab} onNavigate={(key) => setLeftTab(key)} />
          ) : (
            showMobileSidebar && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <div className="h-full w-80 max-w-[80%] overflow-y-auto border-r border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
                  <Sidebar onCreateSession={handleCreateSession} onToggleCollapse={() => setShowMobileSidebar(false)} currentTab={leftTab} onNavigate={(key) => { setLeftTab(key); setShowMobileSidebar(false); }} />
                </div>
                <button className="flex-1 bg-black/40" aria-label="Close sidebar overlay" onClick={() => setShowMobileSidebar(false)} />
              </div>
            )
          )
        )}
        
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
              <div className="ml-auto" />
                </div>
              </div>
              {leftTab === 'compose' && <RequestComposer key={activeSessionId || 'compose'} onSubmit={handleSubmit} contextTab={leftTab as any} />}
              {leftTab === 'agency' && <AgencyManager />}
              {leftTab === 'personas' && <PersonaCatalog />}
              {leftTab === 'workflows' && <WorkflowOverview />}
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
                <TelemetryView />
              </section>
              <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60">
                <header className="mb-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Analytics</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Usage insights</h3>
                </header>
                <AnalyticsView selectedModel={selectedModel} onChangeModel={setSelectedModel} modelOptions={modelOptions} />
              </section>
            </aside>
          </div>
        </main>
      </div>
      {/* Footer with tagline */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="uppercase tracking-[0.25em]">AgentOS — Cognitive Operating System</span>
          <div className="flex items-center gap-3">
            <a href="https://agentos.sh" target="_blank" rel="noreferrer" className="hover:text-sky-600">agentos.sh</a>
            <a href="https://github.com/framersai/agentos" target="_blank" rel="noreferrer" className="hover:text-sky-600">GitHub</a>
          </div>
        </div>
      </footer>
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
