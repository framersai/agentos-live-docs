# Interface: IPersonaDefinition

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:370](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L370)

The primary interface defining a complete Persona for a Generalized Mind Instance (GMI).

## Interface

IPersonaDefinition

## Properties

### activationKeywords?

> `optional` **activationKeywords**: `string`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:453](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L453)

Natural language keywords enabling auto-activation in multi-persona environments.

***

### allowedCapabilities?

> `optional` **allowedCapabilities**: `string`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:408](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L408)

Abstract capability flags enabling conditional UI / workflow features (e.g., 'web_search').

***

### allowedInputModalities?

> `optional` **allowedInputModalities**: (`"text"` \| `"audio_transcription"` \| `"vision_image_url"` \| `"vision_image_base64"`)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:413](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L413)

Whitelisted input modalities persona accepts (driver for validation in interaction layer).

***

### allowedOutputModalities?

> `optional` **allowedOutputModalities**: (`"text"` \| `"audio_tts"` \| `"image_generation_tool_result"`)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:415](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L415)

Output modalities persona can produce (text, TTS synthesized, image generation results).

***

### avatarConfig?

> `optional` **avatarConfig**: [`PersonaAvatarConfig`](PersonaAvatarConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:419](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L419)

Visual avatar / representation metadata (image URL, animation style).

***

### baseSystemPrompt

> **baseSystemPrompt**: `string` \| \{ `template`: `string`; `variables?`: `string`[]; \} \| `object`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:389](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L389)

Base system prompt (or structured template) establishing foundational directives.
Supports:
 - Raw string
 - Templated object { template, variables[] }
 - Ordered array of prompt fragments with priority for deterministic merging.

***

### cognitiveMemoryConfig?

> `optional` **cognitiveMemoryConfig**: [`CognitiveMemoryPersonaConfig`](CognitiveMemoryPersonaConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:433](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L433)

Cognitive memory system per-persona overrides (encoding, decay, working memory capacity, etc.).

***

### contextualPromptElements?

> `optional` **contextualPromptElements**: [`ContextualPromptElement`](ContextualPromptElement.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:446](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L446)

Dynamic contextual prompt elements evaluated per turn for fine-grained adaptation.

***

### conversationContextConfig?

> `optional` **conversationContextConfig**: [`PersonaConversationContextConfig`](PersonaConversationContextConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:435](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L435)

Conversation context override strategy (message importance heuristics, summarization triggers).

***

### costSavingStrategy?

> `optional` **costSavingStrategy**: `"always_cheapest"` \| `"balance_quality_cost"` \| `"prioritize_quality"` \| `"user_preference"`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:400](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L400)

High-level cost strategy guiding router decisions.

***

### customFields?

> `optional` **customFields**: `Record`\<`string`, `any`\> & `object`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:462](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L462)

Arbitrary extension fields and structured defaults for user/task contexts.

#### Type Declaration

##### defaultWorkingMemoryConfig?

> `optional` **defaultWorkingMemoryConfig**: `any`

Working memory default config attached at GMI instantiation time.

##### initialTaskContext?

> `optional` **initialTaskContext**: `Partial`\<[`PersonaTaskContextDefaults`](PersonaTaskContextDefaults.md)\>

Initial task framing values (e.g., domain, complexity baseline).

##### initialUserContext?

> `optional` **initialUserContext**: `Partial`\<[`PersonaUserContextDefaults`](PersonaUserContextDefaults.md)\>

Initial inferred or declared user context values.

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:426](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L426)

Default output language (BCP‑47) used when user preference unspecified.

***

### defaultModelCompletionOptions?

> `optional` **defaultModelCompletionOptions**: `Partial`\<`ModelCompletionOptions`\>

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:396](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L396)

Baseline completion option overrides (temperature, maxTokens, presence penalties, etc.).

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:392](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L392)

Default model id to target for this persona's typical tasks (can be routed or overridden).

***

### defaultProviderId?

> `optional` **defaultProviderId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:394](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L394)

Preferred provider if same model family exists across vendors (helps routing heuristics).

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:378](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L378)

Rich description of goals, domain focus, and behavioral nuance.

***

### embeddedTools?

> `optional` **embeddedTools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:410](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L410)

Inline tool instances embedded directly (rare; typically tools live in registry).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:372](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L372)

Stable unique identifier for the persona (used for activation & persistence).

***

### initialMemoryImprints?

> `optional` **initialMemoryImprints**: `object`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:460](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L460)

Seed working memory imprints establishing initial context (preferences, calibration data).

#### description?

> `optional` **description**: `string`

#### key

> **key**: `string`

#### value

> **value**: `any`

***

### isCreatorPersona?

> `optional` **isCreatorPersona**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:449](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L449)

Allows persona to perform privileged creation/update of other personas.

***

### isPublic?

> `optional` **isPublic**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:451](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L451)

If true persona is globally discoverable subject to subscription tier gating.

***

### label?

> `optional` **label**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:376](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L376)

Optional short label (e.g., abbreviation) for compact UI contexts.

***

### memoryConfig?

> `optional` **memoryConfig**: [`PersonaMemoryConfig`](PersonaMemoryConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:431](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L431)

Memory subsystem tuning (retention horizons, summarization cadence, pinning rules).

***

### metaPrompts?

> `optional` **metaPrompts**: [`MetaPromptDefinition`](MetaPromptDefinition.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:438](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L438)

System or self-reflective prompts guiding meta-cognition, self-correction, or planning loops.

***

### minSubscriptionTier?

> `optional` **minSubscriptionTier**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:457](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L457)

Minimum subscription tier required to access persona (e.g., 'pro', 'enterprise').

***

### modelTargetPreferences?

> `optional` **modelTargetPreferences**: [`ModelTargetPreference`](ModelTargetPreference.md)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:398](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L398)

Ordered preferences describing desired model traits (cost/perf/latency) for dynamic selection.

***

### moodAdaptation?

> `optional` **moodAdaptation**: [`PersonaMoodAdaptationConfig`](PersonaMoodAdaptationConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:424](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L424)

Rules controlling adaptive mood shifts & modulation of tone.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:374](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L374)

Human-readable name surfaced in UI selection lists.

***

### personalityTraits?

> `optional` **personalityTraits**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:422](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L422)

Arbitrary personality trait map (e.g., { humor_level: 0.7, pedagogical_style: 'socratic' }).

***

### promptEngineConfigOverrides?

> `optional` **promptEngineConfigOverrides**: `Partial`\<[`PromptEngineConfig`](PromptEngineConfig.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:403](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L403)

Partial overrides merged onto global PromptEngine configuration for persona specialization.

***

### requiredSecrets?

> `optional` **requiredSecrets**: `string`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:471](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L471)

Named secrets (API keys, credentials) this persona depends on.

***

### sentimentTracking?

> `optional` **sentimentTracking**: [`SentimentTrackingConfig`](SentimentTrackingConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:444](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L444)

Sentiment tracking configuration. Controls whether the GMI analyzes user emotional state
and triggers event-based metaprompts (frustration recovery, confusion clarification, etc.).
Opt-in: disabled by default. Turn_interval metaprompts (like self-reflection) always work regardless.

***

### strengths?

> `optional` **strengths**: `string`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:455](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L455)

Strength tag list aiding search & recommendation (e.g., ['typescript', 'design_reviews']).

***

### toolIds?

> `optional` **toolIds**: `string`[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:406](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L406)

Referenced tool identifiers persona is permitted to invoke.

***

### uiInteractionStyle?

> `optional` **uiInteractionStyle**: `"suggestive"` \| `"directive"` \| `"collaborative"` \| `"silent"`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:428](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L428)

High-level interaction posture for UI behaviors (suggestive hints vs directive instructions).

***

### version

> **version**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:380](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L380)

Semantic version of persona definition; bump on behavioral / config changes (e.g., '1.2.0').

***

### voiceConfig?

> `optional` **voiceConfig**: [`PersonaVoiceConfig`](PersonaVoiceConfig.md)

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:417](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L417)

Voice synthesis configuration (preferred voice id, style, speed).
