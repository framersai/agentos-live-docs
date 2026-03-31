# Type Alias: JSONSchemaObject

> **JSONSchemaObject** = `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/tools/ITool.ts#L29)

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
