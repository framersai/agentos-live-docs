export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'awaiting_input'
  | 'errored'
  | 'completed'
  | 'cancelled';

export type WorkflowTaskStatus =
  | 'pending'
  | 'ready'
  | 'in_progress'
  | 'blocked'
  | 'completed'
  | 'skipped'
  | 'failed';

export interface WorkflowTaskInstanceFE {
  definitionId: string;
  status: WorkflowTaskStatus;
  assignedRoleId?: string;
  assignedExecutorId?: string;
  startedAt?: string;
  completedAt?: string;
  output?: unknown;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  } | null;
  metadata?: Record<string, unknown>;
}

export interface WorkflowInstanceFE {
  workflowId: string;
  definitionId: string;
  definitionVersion?: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  conversationId?: string;
  createdByUserId?: string;
  context?: Record<string, unknown>;
  roleAssignments?: Record<string, string>;
  tasks: Record<string, WorkflowTaskInstanceFE>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowEventFE {
  eventId: string;
  workflowId: string;
  definitionId: string;
  taskId?: string;
  timestamp: string;
  type:
    | 'workflow_created'
    | 'workflow_status_changed'
    | 'task_status_changed'
    | 'task_output_emitted'
    | 'guardrail_applied'
    | 'error'
    | 'custom';
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WorkflowProgressUpdateFE {
  workflow: WorkflowInstanceFE;
  recentEvents?: WorkflowEventFE[];
}

export interface WorkflowUpdateEventDetail {
  workflow: WorkflowProgressUpdateFE;
  metadata?: Record<string, unknown>;
}

export interface WorkflowInvocationRequestFE {
  definitionId: string;
  workflowId?: string;
  conversationId?: string;
  context?: Record<string, unknown>;
  roleAssignments?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

