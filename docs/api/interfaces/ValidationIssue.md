# Interface: ValidationIssue

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:368](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L368)

A single validation issue found during schema validation.

## Properties

### actual?

> `optional` **actual**: `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:382](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L382)

Actual value that was found

***

### expected?

> `optional` **expected**: `unknown`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:379](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L379)

Expected value or constraint

***

### keyword

> **keyword**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:376](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L376)

The keyword that failed validation

***

### message

> **message**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:373](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L373)

Error message describing the issue

***

### path

> **path**: `string`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:370](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L370)

JSON Pointer path to the invalid value

***

### severity

> **severity**: `"error"` \| `"warning"`

Defined in: [packages/agentos/src/structured/output/IStructuredOutputManager.ts:385](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/structured/output/IStructuredOutputManager.ts#L385)

Severity of the issue
