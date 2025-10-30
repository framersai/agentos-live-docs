import { useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SessionInspector } from "@/components/SessionInspector";
import { RequestComposer, type RequestComposerPayload } from "@/components/RequestComposer";
import { AgencyManager } from "@/components/AgencyManager";
import { PersonaCatalog } from "@/components/PersonaCatalog";
import { useSessionStore } from "@/state/sessionStore";
import { AgentOSResponseChunkType, type AgentOSResponse } from "@agentos/core";

function resolvePersonaName(personaId: string | undefined, personas: ReturnType<typeof useSessionStore>["personas"]) {
  if (!personaId) {
    return "Untitled persona";
  }
  const persona = personas.find((item) => item.id === personaId);
  return persona?.displayName ?? personaId;
}

function resolveAgencyName(agencyId: string | undefined, agencies: ReturnType<typeof useSessionStore>["agencies"]) {
  if (!agencyId) {
    return "Agency collective";
  }
  const agency = agencies.find((item) => item.id === agencyId);
  return agency?.name ?? agencyId;
}

export default function App() {
  const personas = useSessionStore((state) => state.personas);
  const agencies = useSessionStore((state) => state.agencies);
  const applyAgencySnapshot = useSessionStore((state) => state.applyAgencySnapshot);
  const upsertSession = useSessionStore((state) => state.upsertSession);
  const appendEvent = useSessionStore((state) => state.appendEvent);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const setActiveSession = useSessionStore((state) => state.setActiveSession);

  const ensureSession = useCallback(
    (payload: RequestComposerPayload) => {
      const sessionId = activeSessionId ?? crypto.randomUUID();
      if (!activeSessionId) {
        upsertSession({
          id: sessionId,
          targetType: payload.targetType,
          displayName:
            payload.targetType === "agency"
              ? resolveAgencyName(payload.agencyId, agencies)
              : resolvePersonaName(payload.personaId, personas),
          personaId: payload.targetType === "persona" ? payload.personaId : undefined,
          agencyId: payload.targetType === "agency" ? payload.agencyId : undefined,
          status: "idle",
          events: []
        });
        setActiveSession(sessionId);
      }
      return sessionId;
    },
    [activeSessionId, agencies, personas, setActiveSession, upsertSession]
  );

  const handleCreateSession = useCallback(() => {
    const sessionId = crypto.randomUUID();
    const hasAgencies = agencies.length > 0;
    const personaId = personas[0]?.id;
    const agencyId = agencies[0]?.id;
    upsertSession({
      id: sessionId,
      targetType: hasAgencies ? "agency" : "persona",
      displayName: hasAgencies ? resolveAgencyName(agencyId, agencies) : resolvePersonaName(personaId, personas),
      personaId: hasAgencies ? undefined : personaId,
      agencyId: hasAgencies ? agencyId : undefined,
      status: "idle",
      events: []
    });
    setActiveSession(sessionId);
  }, [agencies, personas, setActiveSession, upsertSession]);

  const handleSubmit = useCallback(
    (payload: RequestComposerPayload) => {
      const sessionId = ensureSession(payload);
      setActiveSession(sessionId);

      const displayName =
        payload.targetType === "agency"
          ? resolveAgencyName(payload.agencyId, agencies)
          : resolvePersonaName(payload.personaId, personas);
      const personaKey = payload.targetType === "agency" ? payload.agencyId ?? "agency" : payload.personaId ?? "persona";
      const timestamp = Date.now();

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
          message: `User -> ${displayName}: ${payload.input}`
        }
      });

      const textDeltaChunk: AgentOSResponse = {
        type: AgentOSResponseChunkType.TEXT_DELTA,
        streamId: sessionId,
        isFinal: false,
        timestamp: new Date(timestamp + 120).toISOString(),
        personaId: personaKey,
        gmiInstanceId: personaKey,
        metadata: { modelId: "gpt-4o-mini" },
        textDelta: "Thinking through tooling..."
      } as AgentOSResponse;

      appendEvent(sessionId, {
        id: crypto.randomUUID(),
        timestamp: timestamp + 150,
        type: textDeltaChunk.type,
        payload: textDeltaChunk
      });

      const toolChunk: AgentOSResponse = {
        type: AgentOSResponseChunkType.TOOL_CALL_REQUEST,
        streamId: sessionId,
        isFinal: false,
        timestamp: new Date(timestamp + 320).toISOString(),
        personaId: personaKey,
        gmiInstanceId: personaKey,
        toolCalls: [
          {
            id: `tool-${sessionId.slice(0, 6)}`,
            name: "searchNotion",
            arguments: { query: payload.input }
          }
        ],
        rationale: "Need fresh telemetry before taking action."
      } as AgentOSResponse;

      appendEvent(sessionId, {
        id: crypto.randomUUID(),
        timestamp: timestamp + 320,
        type: toolChunk.type,
        payload: toolChunk
      });

      if (payload.targetType === "agency") {
        const agencyDefinition = agencies.find((item) => item.id === payload.agencyId);
        const seats = (agencyDefinition?.participants ?? []).map((participant) => ({
          roleId: participant.roleId,
          gmiInstanceId: `${participant.roleId}-${sessionId.slice(0, 8)}`,
          personaId: participant.personaId ?? "unassigned",
          metadata: participant.notes ? { notes: participant.notes } : undefined
        }));
        const agencyChunk: AgentOSResponse = {
          type: AgentOSResponseChunkType.AGENCY_UPDATE,
          streamId: sessionId,
          isFinal: false,
          timestamp: new Date(timestamp + 480).toISOString(),
          personaId: personaKey,
          gmiInstanceId: personaKey,
          agency: {
            agencyId: payload.agencyId ?? `agency-${sessionId.slice(0, 8)}`,
            workflowId: agencyDefinition?.workflowId ?? `workflow-${sessionId.slice(0, 8)}`,
            conversationId: sessionId,
            metadata: {
              goal: agencyDefinition?.goal,
              source: "local-workbench"
            },
            seats
          }
        } as AgentOSResponse;
        applyAgencySnapshot(agencyChunk.agency);
        appendEvent(sessionId, {
          id: crypto.randomUUID(),
          timestamp: timestamp + 480,
          type: agencyChunk.type,
          payload: agencyChunk
        });
      }

      const finalChunk: AgentOSResponse = {
        type: AgentOSResponseChunkType.FINAL_RESPONSE,
        streamId: sessionId,
        isFinal: true,
        timestamp: new Date(timestamp + 900).toISOString(),
        personaId: personaKey,
        gmiInstanceId: personaKey,
        finalResponseText: "Proposed next action: consolidate the audio pipeline telemetry and surface it in the dashboard.",
        usage: {
          promptTokens: 145,
          completionTokens: 98,
          totalTokens: 243
        },
        metadata: { mode: payload.mode }
      } as AgentOSResponse;

      appendEvent(sessionId, {
        id: crypto.randomUUID(),
        timestamp: timestamp + 900,
        type: finalChunk.type,
        payload: finalChunk
      });

      upsertSession({
        id: sessionId,
        status: "idle"
      });
    },
    [agencies, appendEvent, applyAgencySnapshot, ensureSession, personas, setActiveSession, upsertSession]
  );

  return (
    <div className="grid h-screen w-full grid-cols-panel bg-slate-950">
      <Sidebar onCreateSession={handleCreateSession} />
      <div className="flex flex-col gap-6 overflow-hidden bg-slate-950 p-6">
        <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
          <SessionInspector />
          <div className="flex h-full flex-col gap-6">
            <RequestComposer onSubmit={handleSubmit} />
            <AgencyManager />
            <PersonaCatalog />
          </div>
        </div>
      </div>
    </div>
  );
}
