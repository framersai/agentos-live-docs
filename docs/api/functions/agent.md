# Function: agent()

> **agent**(`opts`): [`Agent`](../interfaces/Agent.md)

Defined in: [packages/agentos/src/api/agent.ts:194](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agent.ts#L194)

Creates a lightweight stateful agent backed by in-memory session storage.

The agent wraps [generateText](generateText.md) and [streamText](streamText.md) with a persistent
system prompt built from `instructions`, `name`, and `personality` fields.
Multiple independent sessions can be opened via `Agent.session()`.

## Parameters

### opts

[`AgentOptions`](../interfaces/AgentOptions.md)

Agent configuration including model, instructions, and optional tools.
  All `BaseAgentConfig` fields are accepted; advanced fields (rag, discovery,
  permissions, emergent, voice, guardrails, etc.) are stored but not actively
  wired in the lightweight layer — they are consumed by `agency()` and the full runtime.

## Returns

[`Agent`](../interfaces/Agent.md)

An [Agent](../interfaces/Agent.md) instance with `generate`, `stream`, `session`, and `close` methods.

## Example

```ts
const myAgent = agent({ model: 'openai:gpt-4o', instructions: 'You are a helpful assistant.' });
const session = myAgent.session('user-123');
const reply = await session.send('Hello!');
console.log(reply.text);
```
