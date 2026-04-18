# Interface: ValidationResult

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/compiler/Validator.ts#L26)

The result returned by `GraphValidator.validate()`.

`valid` is `true` iff `errors` is empty — warnings do not affect validity.

## Properties

### errors

> **errors**: `string`[]

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:30](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/compiler/Validator.ts#L30)

Fatal structural problems that would prevent correct execution.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:28](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/compiler/Validator.ts#L28)

`true` when no structural errors were found.

***

### warnings

> **warnings**: `string`[]

Defined in: [packages/agentos/src/orchestration/compiler/Validator.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/compiler/Validator.ts#L32)

Non-fatal issues that should be reviewed but do not block execution.
