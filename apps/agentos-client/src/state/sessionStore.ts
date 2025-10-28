import { create } from "zustand";
import type { AgentOSResponse } from "@agentos/core";

export type SessionEvent = {
  id: string;
  timestamp: number;
  type: AgentOSResponse["type"] | "log";
  payload: AgentOSResponse | { message: string; level?: "info" | "warning" | "error" };
};

export interface AgentSession {
  id: string;
  persona: string;
  status: "idle" | "streaming" | "error";
  events: SessionEvent[];
}

interface SessionState {
  sessions: AgentSession[];
  activeSessionId: string | null;
  upsertSession: (session: AgentSession) => void;
  appendEvent: (sessionId: string, event: SessionEvent) => void;
  setActiveSession: (sessionId: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  activeSessionId: null,
  upsertSession: (session) =>
    set((state) => {
      const existingIndex = state.sessions.findIndex((s) => s.id === session.id);
      if (existingIndex === -1) {
        return { sessions: [session, ...state.sessions].slice(0, 25) };
      }
      const nextSessions = [...state.sessions];
      nextSessions[existingIndex] = { ...nextSessions[existingIndex], ...session };
      return { sessions: nextSessions };
    }),
  appendEvent: (sessionId, event) =>
    set((state) => {
      const nextSessions = state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              events: [event, ...session.events].slice(0, 200)
            }
          : session
      );
      return { sessions: nextSessions };
    }),
  setActiveSession: (sessionId) => set({ activeSessionId: sessionId })
}));
