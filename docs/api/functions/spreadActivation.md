# Function: spreadActivation()

> **spreadActivation**(`input`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/graph/SpreadingActivation.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/graph/SpreadingActivation.ts#L51)

Run spreading activation from seed nodes.

Returns activated nodes sorted by activation level (descending),
excluding seed nodes themselves.

## Parameters

### input

[`SpreadingActivationInput`](../interfaces/SpreadingActivationInput.md)

## Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>
