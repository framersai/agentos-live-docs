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
import { GuidedTour } from "@/components/GuidedTour";
import { ThemePanel } from "@/components/ThemePanel";
import { AboutPanel } from "@/components/AboutPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
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
  const { t } = useTranslation();
  useSystemTheme();
  const personas = useSessionStore((state) => state.personas);
  const agencies = useSessionStore((state) => state.agencies);
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

  useEffect(() => {
    if (!personasQuery.data || personasQuery.data.length === 0) {
      return;
    }
    setPersonas(personasQuery.data);
  }, [personasQuery.data, setPersonas]);

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

  const handleCreateSession = useCallback(() => {
    const sessionId = crypto.randomUUID();
    const hasAgencies = agencies.length > 0;
    const personaId = personas[0]?.id;
    const agencyId = agencies[0]?.id;
    upsertSession({
      id: sessionId,
      targetType: hasAgencies ? "agency" : "persona",
      displayName: hasAgencies ? resolveAgencyName(agencyId) : resolvePersonaName(personaId),
      personaId: hasAgencies ? undefined : personaId,
      agencyId: hasAgencies ? agencyId : undefined,
      status: "idle",
      events: []
    });
    setActiveSession(sessionId);
  }, [agencies, personas, resolveAgencyName, resolvePersonaName, setActiveSession, upsertSession]);

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

      const fallbackPersonaId = personas[0]?.id ?? DEFAULT_PERSONA_ID;

      // For agency runs, rely on agency participants; do not force a personaId param
      const personaForStream = payload.targetType === "agency" ? undefined : payload.personaId ?? fallbackPersonaId;

      const workflowDefinitionId = payload.workflowId ?? agencyDefinition?.workflowId;
      const workflowInstanceId = workflowDefinitionId ? `${workflowDefinitionId}-${sessionId}` : undefined;

      const agencyRequest = payload.targetType === "agency"
        ? {
            agencyId: payload.agencyId,
            workflowId: workflowInstanceId ?? undefined,
            goal: agencyDefinition?.goal,
            participants: (agencyDefinition?.participants ?? []).map((participant) => ({
              roleId: participant.roleId,
              personaId: participant.personaId
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

  return (
    <>
      <SkipLink />
      <div className="grid min-h-screen w-full grid-cols-panel bg-slate-50 text-slate-900 transition-colors duration-300 ease-out dark:bg-slate-950 dark:text-slate-100">
        {/* Navigation Sidebar */}
        <Sidebar onCreateSession={handleCreateSession} />
        
        {/* Main Content Area */}
        <main 
          id="main-content"
          className="flex flex-col gap-6 overflow-y-auto bg-white p-6 transition-colors duration-300 dark:bg-slate-950"
          role="main"
          aria-label={t("app.labels.mainContent", { defaultValue: "Main content area" })}
        >
          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Left Column: Tabbed coordination */}
            <section className="flex h-full flex-col gap-4" aria-label={t("app.labels.leftPanel", { defaultValue: "Composer and coordination" })}>
              <div
                role="tablist"
                aria-label="Left panel tabs"
                className="rounded-3xl border border-slate-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-slate-900/60"
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
                    >
                      Theme
                    </button>
                  </div>
                </div>
              </div>

              {showThemePanel && <ThemePanel />}
              {leftTab === "compose" && <RequestComposer onSubmit={handleSubmit} />}
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
      <GuidedTour open={showTour} onClose={() => setShowTour(false)} />
    </>
  );
}
