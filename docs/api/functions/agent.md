# Function: agent()

> **agent**(`opts`): [`Agent`](../interfaces/Agent.md)

Defined in: [packages/agentos/src/api/agent.ts:347](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/agent.ts#L347)

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
