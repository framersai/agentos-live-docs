# Function: isBankId()

> **isBankId**(`s`): s is "WORLD" \| "EXPERIENCE" \| "OPINION" \| "OBSERVATION"

Defined in: [packages/agentos/src/memory/retrieval/typed-network/types.ts:36](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/types.ts#L36)

Type guard: narrows an arbitrary string to [BankId](../type-aliases/BankId.md). Use to
validate untrusted inputs (LLM extraction output, deserialized
persistence) before routing into the typed network.

## Parameters

### s

`string`

## Returns

s is "WORLD" \| "EXPERIENCE" \| "OPINION" \| "OBSERVATION"
