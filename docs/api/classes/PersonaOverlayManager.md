# Class: PersonaOverlayManager

Defined in: [packages/agentos/src/cognitive\_substrate/persona\_overlays/PersonaOverlayManager.ts:13](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/persona_overlays/PersonaOverlayManager.ts#L13)

Applies evolution rules to personas and produces runtime overlays that can be persisted
alongside workflow instances.

## Constructors

### Constructor

> **new PersonaOverlayManager**(): `PersonaOverlayManager`

#### Returns

`PersonaOverlayManager`

## Methods

### applyRules()

> **applyRules**(`args`): [`PersonaStateOverlay`](../interfaces/PersonaStateOverlay.md)

Defined in: [packages/agentos/src/cognitive\_substrate/persona\_overlays/PersonaOverlayManager.ts:19](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/persona_overlays/PersonaOverlayManager.ts#L19)

Evaluates the supplied rules against the context and returns an updated overlay.

#### Parameters

##### args

[`ApplyPersonaRulesArgs`](../interfaces/ApplyPersonaRulesArgs.md)

Persona, rules, context, and existing overlay information.

#### Returns

[`PersonaStateOverlay`](../interfaces/PersonaStateOverlay.md)

Overlay capturing the persona patches that should be applied.

***

### resolvePersona()

> **resolvePersona**(`persona`, `overlay?`): [`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)

Defined in: [packages/agentos/src/cognitive\_substrate/persona\_overlays/PersonaOverlayManager.ts:72](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/persona_overlays/PersonaOverlayManager.ts#L72)

Merges the base persona definition with an overlay to produce the effective persona.

#### Parameters

##### persona

[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)

Base persona definition.

##### overlay?

[`PersonaStateOverlay`](../interfaces/PersonaStateOverlay.md)

Overlay generated from applied rules.

#### Returns

[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)

Persona definition with applied patches.

***

### shouldApplyRule()

> `protected` **shouldApplyRule**(`rule`, `context`): `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/persona\_overlays/PersonaOverlayManager.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/persona_overlays/PersonaOverlayManager.ts#L97)

Determines whether a given rule should be applied. Placeholder implementation that
always returns false until a trigger DSL is defined.

#### Parameters

##### rule

[`PersonaEvolutionRule`](../interfaces/PersonaEvolutionRule.md)

Evolution rule under consideration.

##### context

[`PersonaEvolutionContext`](../interfaces/PersonaEvolutionContext.md)

Signals captured during workflow execution.

#### Returns

`boolean`

`true` when the rule should be applied.
