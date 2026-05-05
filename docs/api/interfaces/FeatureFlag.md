# Interface: FeatureFlag

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:25](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/tools/permissions/IToolPermissionManager.ts#L25)

## Interface

FeatureFlag

## Description

Defines the structure for a feature flag, used to gate access to tools
based on user subscriptions or specific entitlements.

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:27](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/tools/permissions/IToolPermissionManager.ts#L27)

Optional. A human-readable description of the feature.

***

### flag

> **flag**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:26](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/tools/permissions/IToolPermissionManager.ts#L26)

The unique string identifier for the feature flag (e.g., "CAN_USE_ADVANCED_SEARCH_TOOL").
