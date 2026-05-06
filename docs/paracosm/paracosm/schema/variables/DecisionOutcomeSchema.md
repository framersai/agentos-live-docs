# Variable: DecisionOutcomeSchema

> `const` **DecisionOutcomeSchema**: `ZodEnum`\<\{ `conservative_failure`: `"conservative_failure"`; `conservative_success`: `"conservative_success"`; `risky_failure`: `"risky_failure"`; `risky_success`: `"risky_success"`; \}\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:388](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L388)

Outcome classification for a decision. Paracosm-native values; a
scenario that doesn't map onto risk/conservative semantics leaves this
undefined.
