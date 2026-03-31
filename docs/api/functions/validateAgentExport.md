# Function: validateAgentExport()

> **validateAgentExport**(`config`): `object`

Defined in: [packages/agentos/src/api/agentExport.ts:381](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L381)

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
