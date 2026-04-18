# Function: spreadActivation()

> **spreadActivation**(`input`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/SpreadingActivation.ts#L51)

Run spreading activation from seed nodes.

Returns activated nodes sorted by activation level (descending),
excluding seed nodes themselves.

## Parameters

### input

[`SpreadingActivationInput`](../interfaces/SpreadingActivationInput.md)

## Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>
