# Variable: DecisionOutcomeSchema

> `const` **DecisionOutcomeSchema**: `ZodEnum`\<\{ `conservative_failure`: `"conservative_failure"`; `conservative_success`: `"conservative_success"`; `risky_failure`: `"risky_failure"`; `risky_success`: `"risky_success"`; \}\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:388](https://github.com/framersai/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/schema/primitives.ts#L388)

Outcome classification for a decision. Paracosm-native values; a
scenario that doesn't map onto risk/conservative semantics leaves this
undefined.
