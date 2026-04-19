# Interface: EditedOutput

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:193](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L193)

Human's edited version of draft output.

## Properties

### changeSummary?

> `optional` **changeSummary**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L201)

Summary of changes

***

### draftId

> **draftId**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:195](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L195)

Original draft ID

***

### editedAt

> **editedAt**: `Date`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:205](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L205)

Timestamp

***

### editedBy

> **editedBy**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:203](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L203)

Who edited

***

### editedContent

> **editedContent**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:197](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L197)

Edited content

***

### feedback?

> `optional` **feedback**: `string`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:207](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L207)

Feedback for agent improvement

***

### hasSignificantChanges

> **hasSignificantChanges**: `boolean`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:199](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/hitl/IHumanInteractionManager.ts#L199)

Whether significant changes were made
