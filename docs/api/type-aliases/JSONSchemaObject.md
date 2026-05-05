# Type Alias: JSONSchemaObject

> **JSONSchemaObject** = `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:29](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/tools/ITool.ts#L29)

Represents a JSON schema definition.
This type is used to define the expected structure for tool inputs and outputs,
enabling validation and clear contracts for LLMs.

## See

https://json-schema.org/

## Example

```ts
const schema: JSONSchemaObject = {
type: "object",
properties: {
query: { type: "string", description: "The search query." },
max_results: { type: "integer", minimum: 1, default: 5 }
},
required: ["query"]
};
```
