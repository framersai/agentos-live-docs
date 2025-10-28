import { useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SessionInspector } from "@/components/SessionInspector";
import { RequestComposer } from "@/components/RequestComposer";
import { useSessionStore } from "@/state/sessionStore";
import type { AgentOSResponse } from "@agentos/core";

export default function App() {
  const upsertSession = useSessionStore((state) => state.upsertSession);
  const appendEvent = useSessionStore((state) => state.appendEvent);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const setActiveSession = useSessionStore((state) => state.setActiveSession);

  const ensureSession = useCallback(
    (personaId: string) => {
      const id = activeSessionId ?? crypto.randomUUID();
      if (!activeSessionId) {
        upsertSession({
          id,
          persona: personaId,
          status: "idle",
          events: []
        });
        setActiveSession(id);
      }
      return activeSessionId ?? id;
    },
    [activeSessionId, setActiveSession, upsertSession]
  );

  const handleCreateSession = () => {
    const sessionId = crypto.randomUUID();
    upsertSession({
      id: sessionId,
      persona: "atlas-systems-architect",
      status: "idle",
      events: []
    });
    setActiveSession(sessionId);
  };

  const handleSubmit = ({ persona, input, mode }: { persona: string; input: string; mode: "chat" | "voice" }) => {
    const sessionId = ensureSession(persona);
    const timestamp = Date.now();

    upsertSession({
      id: sessionId,
      persona,
      status: "streaming",
      events: []
    });

    appendEvent(sessionId, {
      id: crypto.randomUUID(),
      timestamp,
      type: "log",
      payload: { message: ?? User () ?  }
    });

    const syntheticChunk: AgentOSResponse = {
      type: "TEXT_DELTA",
      streamId: sessionId,
      isFinal: false,
      timestamp: new Date().toISOString(),
      personaId: persona,
      gmiInstanceId: persona,
      metadata: { modelId: "gpt-4o-mini" },
      textDelta: "Thinking through tooling...",
      usage: {
        promptTokens: 110,
        completionTokens: 42,
        totalTokens: 152
      }
    } as AgentOSResponse;

    appendEvent(sessionId, {
      id: crypto.randomUUID(),
      timestamp: timestamp + 200,
      type: syntheticChunk.type,
      payload: syntheticChunk
    });

    appendEvent(sessionId, {
      id: crypto.randomUUID(),
      timestamp: timestamp + 350,
      type: "TOOL_CALL_REQUEST",
      payload: {
        type: "TOOL_CALL_REQUEST",
        streamId: sessionId,
        isFinal: false,
        timestamp: new Date(timestamp + 350).toISOString(),
        toolCall: {
          id: "tool-search",
          name: "searchNotion",
          arguments: { query: input }
        }
      } as AgentOSResponse
    });

    appendEvent(sessionId, {
      id: crypto.randomUUID(),
      timestamp: timestamp + 900,
      type: "FINAL_RESPONSE",
      payload: {
        type: "FINAL_RESPONSE",
        streamId: sessionId,
        isFinal: true,
        timestamp: new Date(timestamp + 900).toISOString(),
        finalResponseText: "Proposed next action: consolidate the audio pipeline telemetry and surface it in the dashboard.",
        metadata: { modelId: "gpt-4o" },
        usage: {
          promptTokens: 145,
          completionTokens: 98,
          totalTokens: 243
        }
      } as AgentOSResponse
    });

    upsertSession({
      id: sessionId,
      persona,
      status: "idle",
      events: []
    });
  };

  return (
    <div className="grid h-screen w-full grid-cols-panel bg-slate-950">
      <Sidebar onCreateSession={handleCreateSession} />
      <div className="flex flex-col gap-6 overflow-hidden bg-slate-950 p-6">
        <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SessionInspector />
          </div>
          <div>
            <RequestComposer onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
