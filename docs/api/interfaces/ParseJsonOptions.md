# Interface: ParseJsonOptions\<_T\>

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:164](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L164)

Options for safe JSON parsing.

## Type Parameters

### _T

`_T` = `any`

## Properties

### attemptFixWithLLM?

> `optional` **attemptFixWithLLM**: `boolean`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:166](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L166)

If true, attempts to use an LLM to fix or extract JSON if standard parsing fails.

***

### llmModelIdForFix?

> `optional` **llmModelIdForFix**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:168](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L168)

Model ID to use for LLM-based fixing.

***

### llmProviderIdForFix?

> `optional` **llmProviderIdForFix**: `string`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:170](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L170)

Provider ID for the LLM fixer.

***

### maxRepairAttempts?

> `optional` **maxRepairAttempts**: `number`

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:177](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L177)

Max repair attempts with LLM if schema validation fails.

***

### targetSchema?

> `optional` **targetSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/nlp/ai\_utilities/IUtilityAI.ts:175](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/nlp/ai_utilities/IUtilityAI.ts#L175)

Optional JSON schema to validate the parsed object against.
If validation fails, the method may return null or attempt to fix again.
