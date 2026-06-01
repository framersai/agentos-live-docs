# Function: wrapForgeTool()

> **wrapForgeTool**(`options`): [`ITool`](../interfaces/ITool.md)

Defined in: [packages/agentos/src/cognition/emergent/wrapForgeTool.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/wrapForgeTool.ts#L104)

Wrap the raw ForgeToolMetaTool so each forge attempt gets normalized,
pre-validated, captured, and logged.

Normalization fixes: stringified-JSON fields, mode synonyms (`code`,
`javascript`, `js` → `sandbox`; `composed`, `composition`, `chain`,
`pipeline` → `compose`), missing allowlist / code body / steps /
schemas / testCases. After normalization, the shape validator runs;
on failure the judge is skipped and a rejection record is captured
immediately. On success, the raw meta-tool executes and the result's
verdict is folded into a capture record.

## Parameters

### options

[`WrapForgeToolOptions`](../interfaces/WrapForgeToolOptions.md)

## Returns

[`ITool`](../interfaces/ITool.md)
