# Function: spreadActivation()

> **spreadActivation**(`input`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/SpreadingActivation.ts#L51)

Run spreading activation from seed nodes.

Returns activated nodes sorted by activation level (descending),
excluding seed nodes themselves.

## Parameters

### input

[`SpreadingActivationInput`](../interfaces/SpreadingActivationInput.md)

## Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>
