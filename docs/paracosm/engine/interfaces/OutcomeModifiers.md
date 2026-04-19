# Interface: OutcomeModifiers

Defined in: [engine/effect-registry.ts:11](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/effect-registry.ts#L11)

## Properties

### noise

> **noise**: `number`

Defined in: [engine/effect-registry.ts:13](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/effect-registry.ts#L13)

***

### personalityBonus

> **personalityBonus**: `number`

Defined in: [engine/effect-registry.ts:12](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/effect-registry.ts#L12)

***

### toolModifiers?

> `optional` **toolModifiers**: `object`

Defined in: [engine/effect-registry.ts:25](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/effect-registry.ts#L25)

Tool intelligence factor. Forging computational tools is a tradeoff:
  newToolsThisEvent      tools forged THIS event (consume time/compute,
                         rejection risk, but enable insight)
  reuseCountThisEvent    invocations of previously-forged tools
                         (cheap, pure upside — institutional knowledge)
  forgeFailures          failed forge attempts this event (judge
                         rejected — wasted department effort)
  totalToolsForRun       cumulative unique tools over the run
                         (innovation index — diminishing returns)

#### forgeFailures

> **forgeFailures**: `number`

#### newToolsThisEvent

> **newToolsThisEvent**: `number`

#### reuseCountThisEvent

> **reuseCountThisEvent**: `number`

#### totalToolsForRun

> **totalToolsForRun**: `number`
