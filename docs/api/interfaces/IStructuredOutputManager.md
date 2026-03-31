# Interface: IStructuredOutputManager

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:624](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L624)

Interface for the Structured Output Manager.

The Structured Output Manager provides a unified API for generating
LLM outputs that conform to predefined JSON Schemas. It handles:

- **Strategy Selection**: Choosing the best approach for the provider/model
- **Schema Validation**: Ensuring outputs match the schema
- **Retry Logic**: Automatic retries with feedback on validation failures
- **Function Calling**: Parallel tool use with argument validation
- **Entity Extraction**: Pulling structured data from unstructured text

## Examples

```typescript
// Simple structured generation
const result = await manager.generate({
  prompt: 'List the top 3 programming languages',
  schema: {
    type: 'object',
    properties: {
      languages: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            popularity: { type: 'integer', minimum: 1, maximum: 100 },
          },
          required: ['name', 'popularity'],
        },
        minItems: 3,
        maxItems: 3,
      },
    },
    required: ['languages'],
  },
  schemaName: 'ProgrammingLanguages',
});

if (result.success) {
  result.data.languages.forEach(lang => {
    console.log(`${lang.name}: ${lang.popularity}%`);
  });
}
```

```typescript
// Parallel function calling
const result = await manager.generateFunctionCalls({
  prompt: 'Search for weather in NYC and stock price of AAPL',
  functions: [
    {
      name: 'get_weather',
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          units: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['city'],
      },
      handler: async (args) => fetchWeather(args.city, args.units),
    },
    {
      name: 'get_stock_price',
      description: 'Get current stock price',
      parameters: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
        },
        required: ['symbol'],
      },
      handler: async (args) => fetchStockPrice(args.symbol),
    },
  ],
  maxParallelCalls: 5,
});

// Both functions called in parallel
result.calls.forEach(call => {
  console.log(`${call.functionName}: ${JSON.stringify(call.executionResult)}`);
});
```

## Methods

### extractEntities()

> **extractEntities**\<`T`\>(`options`): `Promise`\<[`EntityExtractionResult`](EntityExtractionResult.md)\<`T`\>\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:708](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L708)

Extracts structured entities from unstructured text.

Useful for NER, data extraction, and information retrieval tasks.

#### Type Parameters

##### T

`T` = `unknown`

Expected type of extracted entities

#### Parameters

##### options

[`EntityExtractionOptions`](EntityExtractionOptions.md)

Extraction options

#### Returns

`Promise`\<[`EntityExtractionResult`](EntityExtractionResult.md)\<`T`\>\>

Promise resolving to extraction results

#### Example

```typescript
const result = await manager.extractEntities<Person>({
  text: 'John Doe (john@example.com) met Jane Smith (jane@example.com)',
  entitySchema: personSchema,
  taskName: 'PersonExtraction',
  extractAll: true,
});

result.entities.forEach(person => {
  console.log(`Found: ${person.name} - ${person.email}`);
});
```

***

### generate()

> **generate**\<`T`\>(`options`): `Promise`\<[`StructuredGenerationResult`](StructuredGenerationResult.md)\<`T`\>\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:655](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L655)

Generates structured output conforming to the given schema.

#### Type Parameters

##### T

`T` = `unknown`

Expected type of the output data

#### Parameters

##### options

[`StructuredGenerationOptions`](StructuredGenerationOptions.md)

Generation options including prompt and schema

#### Returns

`Promise`\<[`StructuredGenerationResult`](StructuredGenerationResult.md)\<`T`\>\>

Promise resolving to the generation result

#### Throws

If generation fails after all retries

#### Example

```typescript
const result = await manager.generate<Person>({
  prompt: 'Extract person info from: John Doe, 30, john@example.com',
  schema: personSchema,
  schemaName: 'Person',
  strict: true,
});

if (result.success) {
  console.log(result.data.name); // Type-safe access
}
```

***

### generateFunctionCalls()

> **generateFunctionCalls**(`options`): `Promise`\<[`ParallelFunctionCallResult`](ParallelFunctionCallResult.md)\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:683](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L683)

Generates parallel function/tool calls.

This method enables the LLM to call multiple functions in a single
response, useful for parallel data fetching or multi-step operations.

#### Parameters

##### options

[`ParallelFunctionCallOptions`](ParallelFunctionCallOptions.md)

Function call options

#### Returns

`Promise`\<[`ParallelFunctionCallResult`](ParallelFunctionCallResult.md)\>

Promise resolving to function call results

#### Example

```typescript
const result = await manager.generateFunctionCalls({
  prompt: 'Get the weather in Paris and London',
  functions: [weatherFunction],
  maxParallelCalls: 10,
});

// Execute all calls in parallel
await Promise.all(result.calls.map(async call => {
  const fn = functions.find(f => f.name === call.functionName);
  if (fn?.handler) {
    call.executionResult = await fn.handler(call.arguments);
  }
}));
```

***

### getSchema()

> **getSchema**(`name`): [`JSONSchema`](JSONSchema.md) \| `undefined`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:807](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L807)

Gets a registered schema by name.

#### Parameters

##### name

`string`

Schema name

#### Returns

[`JSONSchema`](JSONSchema.md) \| `undefined`

Schema or undefined if not found

***

### getStatistics()

> **getStatistics**(): [`StructuredOutputStats`](StructuredOutputStats.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:814](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L814)

Gets statistics about structured output operations.

#### Returns

[`StructuredOutputStats`](StructuredOutputStats.md)

Current statistics

***

### initialize()

> **initialize**(`logger?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:630](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L630)

Initializes the manager with optional configuration.

#### Parameters

##### logger?

[`ILogger`](ILogger.md)

Logger instance for debugging

#### Returns

`Promise`\<`void`\>

***

### parseJSON()

> **parseJSON**(`jsonString`): `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:759](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L759)

Parses JSON string with error recovery.

Attempts to extract valid JSON from potentially malformed output,
handling common LLM output issues like:
- Markdown code blocks
- Trailing commas
- Unquoted keys
- Single quotes

#### Parameters

##### jsonString

`string`

String to parse

#### Returns

`unknown`

Parsed object or null if parsing fails

#### Example

```typescript
// Handles markdown-wrapped JSON
const data = manager.parseJSON('```json\n{"name": "John"}\n```');
// Returns: { name: 'John' }

// Handles trailing commas
const data2 = manager.parseJSON('{"a": 1, "b": 2,}');
// Returns: { a: 1, b: 2 }
```

***

### recommendStrategy()

> **recommendStrategy**(`providerId`, `modelId`, `schema`): [`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:769](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L769)

Determines the best strategy for a given provider/model.

#### Parameters

##### providerId

`string`

LLM provider ID

##### modelId

`string`

Model ID

##### schema

[`JSONSchema`](JSONSchema.md)

Schema to generate for

#### Returns

[`StructuredOutputStrategy`](../type-aliases/StructuredOutputStrategy.md)

Recommended strategy

***

### registerSchema()

> **registerSchema**(`name`, `schema`): `void`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:799](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L799)

Registers a custom schema for reuse.

#### Parameters

##### name

`string`

Schema name for reference

##### schema

[`JSONSchema`](JSONSchema.md)

Schema definition

#### Returns

`void`

#### Example

```typescript
manager.registerSchema('Address', {
  type: 'object',
  properties: {
    street: { type: 'string' },
    city: { type: 'string' },
    country: { type: 'string' },
    postalCode: { type: 'string' },
  },
  required: ['street', 'city', 'country'],
});

// Use in other schemas via $ref
const orderSchema = {
  type: 'object',
  properties: {
    shippingAddress: { $ref: '#/$defs/Address' },
  },
};
```

***

### resetStatistics()

> **resetStatistics**(): `void`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:819](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L819)

Resets statistics counters.

#### Returns

`void`

***

### validate()

> **validate**(`data`, `schema`, `strict?`): [`ValidationIssue`](ValidationIssue.md)[]

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:733](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/structured/output/IStructuredOutputManager.ts#L733)

Validates data against a JSON Schema.

#### Parameters

##### data

`unknown`

Data to validate

##### schema

[`JSONSchema`](JSONSchema.md)

Schema to validate against

##### strict?

`boolean`

Whether to fail on additional properties

#### Returns

[`ValidationIssue`](ValidationIssue.md)[]

Array of validation issues (empty if valid)

#### Example

```typescript
const issues = manager.validate(
  { name: 'John', age: -5 },
  personSchema,
  true
);

if (issues.length > 0) {
  issues.forEach(issue => {
    console.log(`${issue.path}: ${issue.message}`);
  });
}
```
