# Function: validateAgentExport()

> **validateAgentExport**(`config`): `object`

Defined in: [packages/agentos/src/api/agentExport.ts:205](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agentExport.ts#L205)

Validates an export config object without importing it.

Checks structural correctness: schema version, required fields, type
discriminator, and agency-specific field consistency. Does NOT validate
the semantic correctness of the config (e.g. whether the model exists).

## Parameters

### config

`unknown`

Unknown value to validate as an [AgentExportConfig](../interfaces/AgentExportConfig.md).

## Returns

`object`

Object with `valid` boolean and an array of error messages.

### errors

> **errors**: `string`[]

### valid

> **valid**: `boolean`

## Example

```ts
const result = validateAgentExport(someObject);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```
