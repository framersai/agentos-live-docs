# Guardrail Serialization & UI Schemas

## Overview

Guardrails can be serialized to JSON for import/export, stored in persona definitions, and managed via UI dashboards. This document defines the standard schemas.

---

## Guardrail Definition Schema

```typescript
interface SerializableGuardrail {
  /** Unique ID for this guardrail instance */
  id: string;
  /** Guardrail type/package name */
  type: string; // e.g., '@framersai/guardrail-keyword'
  /** Display name for UI */
  displayName: string;
  /** Optional description */
  description?: string;
  /** Whether this guardrail is enabled */
  enabled: boolean;
  /** Configuration object (type-specific) */
  config: Record<string, unknown>;
  /** Priority (lower = runs first) */
  priority?: number;
  /** Metadata for UI rendering */
  uiMetadata?: {
    category?: 'safety' | 'privacy' | 'budget' | 'compliance' | 'quality' | 'custom';
    icon?: string;
    color?: string;
  };
}
```

### Example: Keyword Guardrail

```json
{
  "id": "guardrail-pii-protection",
  "type": "@framersai/guardrail-keyword",
  "displayName": "PII Protection",
  "description": "Redacts SSN, email, and phone numbers from agent output",
  "enabled": true,
  "config": {
    "patterns": [
      {
        "regex": "\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "action": "sanitize",
        "replacement": "[SSN]"
      },
      {
        "regex": "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
        "action": "sanitize",
        "replacement": "[EMAIL]",
        "caseSensitive": false
      }
    ],
    "evaluateInput": false,
    "evaluateOutput": true
  },
  "priority": 10,
  "uiMetadata": {
    "category": "privacy",
    "icon": "shield-check",
    "color": "#10b981"
  }
}
```

### Example: LLM Guardrail

```json
{
  "id": "guardrail-medical-advice",
  "type": "@framersai/guardrail-llm-generic",
  "displayName": "Medical Advice Blocker",
  "description": "Uses LLM to detect and block medical diagnosis requests",
  "enabled": true,
  "config": {
    "policyDescription": "Block any request that asks for medical diagnosis, treatment recommendations, or specific health advice. General health information is allowed.",
    "violationAction": "block",
    "evaluateInput": true,
    "evaluateOutput": false,
    "evaluatorModel": "gpt-4o-mini"
  },
  "priority": 5,
  "uiMetadata": {
    "category": "compliance",
    "icon": "hospital",
    "color": "#ef4444"
  }
}
```

---

## Persona Integration

Personas can define their own guardrail stacks:

```json
{
  "id": "customer-support-bot",
  "name": "Customer Support Agent",
  "version": "1.0.0",
  "guardrails": [
    {
      "id": "guardrail-pii",
      "type": "@framersai/guardrail-keyword",
      "enabled": true,
      "config": { /* ... */ }
    },
    {
      "id": "guardrail-cost",
      "type": "@framersai/guardrail-cost-ceiling",
      "enabled": true,
      "config": {
        "maxCostUsd": 0.05
      }
    }
  ]
}
```

---

## UI Dashboard Schema

For `agentos-client` guardrail management UI:

```typescript
interface GuardrailDashboardConfig {
  /** List of guardrails attached to this persona/agency */
  guardrails: SerializableGuardrail[];
  /** Global guardrail settings */
  globalSettings?: {
    /** Enable all guardrails by default */
    enableByDefault: boolean;
    /** Log all guardrail decisions */
    auditMode: boolean;
    /** Show guardrail badges in UI */
    showBadges: boolean;
  };
}
```

### UI Components

**Guardrail card** in persona editor:

```tsx
<GuardrailCard
  guardrail={{
    id: 'guardrail-pii',
    type: '@framersai/guardrail-keyword',
    displayName: 'PII Protection',
    enabled: true,
    uiMetadata: { category: 'privacy', icon: 'shield-check', color: '#10b981' }
  }}
  onToggle={(id, enabled) => /* update */}
  onConfigure={(id) => /* open config modal */}
  onRemove={(id) => /* remove from stack */}
/>
```

**Guardrail config editor:**

```tsx
<GuardrailConfigEditor
  guardrailType="@framersai/guardrail-keyword"
  schema={{
    type: 'object',
    properties: {
      patterns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Keyword or phrase' },
            action: { type: 'string', enum: ['allow', 'flag', 'sanitize', 'block'] },
            replacement: { type: 'string', description: 'Replacement text for sanitize' }
          }
        }
      }
    }
  }}
  value={currentConfig}
  onChange={(newConfig) => /* update */}
/>
```

---

## Import/Export Format

### Export Guardrail Stack

```json
{
  "version": "1.0",
  "exported_at": "2025-11-07T02:30:00Z",
  "source": "agentos-client",
  "guardrails": [
    {
      "id": "guardrail-pii",
      "type": "@framersai/guardrail-keyword",
      "displayName": "PII Protection",
      "enabled": true,
      "config": { /* ... */ },
      "priority": 10
    },
    {
      "id": "guardrail-cost",
      "type": "@framersai/guardrail-cost-ceiling",
      "displayName": "Cost Ceiling",
      "enabled": true,
      "config": { "maxCostUsd": 0.05 },
      "priority": 20
    }
  ]
}
```

### Import Validation

```typescript
import { z } from 'zod';

const SerializableGuardrailSchema = z.object({
  id: z.string(),
  type: z.string().regex(/^@framersai\/guardrail-/),
  displayName: z.string(),
  description: z.string().optional(),
  enabled: z.boolean(),
  config: z.record(z.unknown()),
  priority: z.number().optional(),
  uiMetadata: z.object({
    category: z.enum(['safety', 'privacy', 'budget', 'compliance', 'quality', 'custom']).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  }).optional(),
});

const GuardrailStackSchema = z.object({
  version: z.string(),
  exported_at: z.string(),
  source: z.string().optional(),
  guardrails: z.array(Serializable GuardrailSchema),
});

// Usage
function importGuardrailStack(json: unknown): SerializableGuardrail[] {
  const parsed = GuardrailStackSchema.parse(json);
  return parsed.guardrails;
}
```

---

## Database Schema (Optional Persistence)

If storing guardrail configs in a database:

```sql
CREATE TABLE guardrail_configs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  persona_id VARCHAR(255),
  agency_id UUID,
  guardrail_type VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config JSONB NOT NULL,
  priority INTEGER DEFAULT 100,
  ui_metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guardrail_persona ON guardrail_configs(persona_id);
CREATE INDEX idx_guardrail_user ON guardrail_configs(user_id);
```

---

## React Hook for Guardrails

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { agentosClient } from '@/lib/agentosClient';

export function usePersonaGuardrails(personaId: string) {
  const { data: guardrails, isLoading } = useQuery({
    queryKey: ['guardrails', personaId],
    queryFn: () => agentosClient.getPersonaGuardrails(personaId),
  });

  const addGuardrail = useMutation({
    mutationFn: (guardrail: SerializableGuardrail) =>
      agentosClient.addPersonaGuardrail(personaId, guardrail),
  });

  const updateGuardrail = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SerializableGuardrail> }) =>
      agentosClient.updatePersonaGuardrail(personaId, id, updates),
  });

  const removeGuardrail = useMutation({
    mutationFn: (id: string) => agentosClient.removePersonaGuardrail(personaId, id),
  });

  return {
    guardrails: guardrails ?? [],
    isLoading,
    addGuardrail: addGuardrail.mutate,
    updateGuardrail: updateGuardrail.mutate,
    removeGuardrail: removeGuardrail.mutate,
  };
}
```

---

## Future Enhancements

### Guardrail Marketplace UI

- **Browse**: Search curated and community guardrails
- **Install**: One-click install from registry
- **Configure**: Visual editor for guardrail configs
- **Test**: Sandbox to test guardrails with sample inputs
- **Analytics**: Dashboard showing guardrail trigger rates

### Guardrail Templates

- **Wizard**: Step-by-step guardrail creation
- **Policy builder**: Natural language → guardrail config
- **Testing playground**: Test patterns before deployment

---

## Related Docs

- [HOW_GUARDRAILS_WORK.md](HOW_GUARDRAILS_WORK.md) - Architecture
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- [AgentOS Architecture](../../packages/agentos/docs/ARCHITECTURE.md) - Core system docs

