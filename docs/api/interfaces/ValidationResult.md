# Interface: ValidationResult

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:26](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/compiler/Validator.ts#L26)

The result returned by `GraphValidator.validate()`.

`valid` is `true` iff `errors` is empty — warnings do not affect validity.

## Properties

### errors

> **errors**: `string`[]

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:30](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/compiler/Validator.ts#L30)

Fatal structural problems that would prevent correct execution.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:28](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/compiler/Validator.ts#L28)

`true` when no structural errors were found.

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:32](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/compiler/Validator.ts#L32)

Non-fatal issues that should be reviewed but do not block execution.
