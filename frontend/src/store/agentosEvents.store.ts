import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface WorkflowUpdateEvent {
  timestamp: number;
  workflow: unknown;
  metadata?: unknown;
}

export interface AgencyUpdateEvent {
  timestamp: number;
  agency: unknown;
  metadata?: unknown;
}

export const useAgentosEventsStore = defineStore('agentosEvents', () => {
  const workflowUpdates = ref<WorkflowUpdateEvent[]>([]);
  const agencyUpdates = ref<AgencyUpdateEvent[]>([]);

  function addWorkflowUpdate(event: WorkflowUpdateEvent): void {
    workflowUpdates.value.push(event);
    if (workflowUpdates.value.length > 1000) workflowUpdates.value.shift();
  }

  function addAgencyUpdate(event: AgencyUpdateEvent): void {
    agencyUpdates.value.push(event);
    if (agencyUpdates.value.length > 1000) agencyUpdates.value.shift();
  }

  function clear(): void {
    workflowUpdates.value = [];
    agencyUpdates.value = [];
  }

  return { workflowUpdates, agencyUpdates, addWorkflowUpdate, addAgencyUpdate, clear };
});


