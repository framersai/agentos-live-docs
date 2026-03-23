# Persistent Markdown Working Memory

## Goal

Add a Mastra-style persistent markdown working memory to AgentOS. A `.md` file per agent that the agent reads and rewrites via tools, injected into system prompts every turn. Coexists with the existing Baddeley cognitive working memory.

## Architecture

A markdown file at `~/.wunderland/agents/{seedId}/working-memory.md` serves as persistent context the agent maintains across sessions. Two ITool implementations (`update_working_memory`, `read_working_memory`) let the agent read and fully replace the file contents. The PromptEngine injects the file contents into the system prompt before the Baddeley cognitive slots on every turn.

## Components

### 1. File Storage

- **Path**: `~/.wunderland/agents/{seedId}/working-memory.md`
- **Created on first start** if it doesn't exist, using the configured template
- **Human-editable**: users can open and modify the file directly
- **Agent picks up external changes** on the next turn (reads fresh each time)

### 2. Default Template

Configurable via `agent.config.json`:

```json
{
  "workingMemoryTemplate": "# Working Memory\n\n## User Profile\n- **Name**:\n- **Preferences**:\n\n## Current Context\n- **Active Topics**:\n- **Recent Requests**:\n\n## Notes\n"
}
```

Falls back to the built-in default if not set. The agent can organically restructure the template over time — it's a starting point, not a constraint.

### 3. Tools

**`update_working_memory`** (ITool)

- Input: `{ content: string }` — full replacement markdown
- Writes the entire file contents (replace semantics, not merge)
- Returns `{ success: true, tokensUsed: number }`
- Max content size: 2000 tokens (~8KB) to prevent prompt budget bloat

**`read_working_memory`** (ITool)

- Input: `{}` (no args)
- Returns `{ content: string }` — current file contents
- Also available implicitly via system prompt injection, but explicit read is useful for agents that want to reason about their memory before updating

### 4. System Prompt Injection

On every turn, the PromptEngine:

1. Reads `working-memory.md` from disk
2. Prepends it as a `## Persistent Memory` block in the system prompt
3. Placed BEFORE the Baddeley cognitive slots (`## Active Context`)
4. Budget: configurable, default ~500 tokens (~5% of total prompt budget)
5. If file is empty or missing, section is omitted

### 5. Prompt Budget Allocation (updated)

```
Persistent memory (markdown):  5%   ← NEW
Working memory (Baddeley):    15%
Semantic recall:              40%   ← reduced from 45%
Recent episodic:              25%
Prospective alerts:            5%
Graph associations:            5%
Observation notes:             5%
```

### 6. Coexistence with Baddeley

The two systems serve different purposes:

|          | Markdown Working Memory        | Baddeley Cognitive Working Memory       |
| -------- | ------------------------------ | --------------------------------------- |
| Purpose  | Persistent user context        | In-session attention modeling           |
| Lifespan | Across sessions (file on disk) | Single session (in-memory)              |
| Updates  | Agent explicitly calls tool    | Automatic activation decay              |
| Format   | Free-form markdown             | Structured slots with activation levels |
| Budget   | ~5% of prompt                  | ~15% of prompt                          |

Both are injected into the system prompt. They don't interfere.

## Files

| Action | File                                                                  | Responsibility                              |
| ------ | --------------------------------------------------------------------- | ------------------------------------------- |
| Create | `packages/agentos/src/memory/working/MarkdownWorkingMemory.ts`        | File read/write, template management        |
| Create | `packages/agentos/src/memory/working/UpdateWorkingMemoryTool.ts`      | ITool for agent to rewrite file             |
| Create | `packages/agentos/src/memory/working/ReadWorkingMemoryTool.ts`        | ITool for agent to read file                |
| Modify | `packages/agentos/src/memory/prompt/MemoryPromptAssembler.ts`         | Inject markdown memory into prompt          |
| Modify | `packages/agentos/src/memory/config.ts`                               | Add budget allocation for persistent memory |
| Modify | `packages/wunderland/src/cli/commands/start/extension-loader.ts`      | Create file on first start, register tools  |
| Create | `packages/agentos/tests/memory/working/MarkdownWorkingMemory.spec.ts` | Unit tests                                  |

## Error Handling

- File read fails → log warning, omit section from prompt, continue
- File write fails → return `{ success: false, error }` from tool
- Content exceeds 2000 tokens → truncate with warning in tool response
- Invalid UTF-8 → replace with empty template

## Testing

- Unit: read/write/create operations on MarkdownWorkingMemory
- Unit: tool input validation, size limits
- Unit: prompt assembly includes persistent memory block
- Integration: agent calls update_working_memory, content appears in next turn's prompt
