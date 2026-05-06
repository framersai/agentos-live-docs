# Variable: ProviderErrorSchema

> `const` **ProviderErrorSchema**: `ZodObject`\<\{ `actionUrl`: `ZodOptional`\<`ZodString`\>; `kind`: `ZodEnum`\<\{ `auth`: `"auth"`; `network`: `"network"`; `quota`: `"quota"`; `rate_limit`: `"rate_limit"`; `unknown`: `"unknown"`; \}\>; `message`: `ZodString`; `provider`: `ZodString`; \}, `$strip`\>

Defined in: [apps/paracosm/src/engine/schema/primitives.ts:508](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/schema/primitives.ts#L508)

Classified provider error on terminal failure. Matches
the runtime provider-error classifier.
