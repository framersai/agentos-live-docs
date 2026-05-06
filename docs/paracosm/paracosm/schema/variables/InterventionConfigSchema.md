# Variable: InterventionConfigSchema

> `const` **InterventionConfigSchema**: `ZodObject`\<\{ `adherenceProfile`: `ZodOptional`\<`ZodObject`\<\{ `expected`: `ZodNumber`; `risks`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>\>; `category`: `ZodOptional`\<`ZodString`\>; `description`: `ZodString`; `duration`: `ZodOptional`\<`ZodObject`\<\{ `unit`: `ZodString`; `value`: `ZodNumber`; \}, `$strip`\>\>; `id`: `ZodString`; `mechanism`: `ZodOptional`\<`ZodString`\>; `name`: `ZodString`; `scenarioExtensions`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `targetBehaviors`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:467](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L467)

Counterfactual being tested. Digital-twin = a health protocol; game =
strategic choice; policy sim = policy; clinical trial = treatment arm.

`duration.unit` is not constrained to the scenario's time-unit —
interventions may span multiple scenario time-units or be measured in
different units than the simulation itself ticks on.
