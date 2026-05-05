# Function: spreadActivation()

> **spreadActivation**(`input`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:51](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/SpreadingActivation.ts#L51)

Run spreading activation from seed nodes.

Returns activated nodes sorted by activation level (descending),
excluding seed nodes themselves.

## Parameters

### input

[`SpreadingActivationInput`](../interfaces/SpreadingActivationInput.md)

## Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>
