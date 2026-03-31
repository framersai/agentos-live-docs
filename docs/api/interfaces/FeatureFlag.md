# Interface: FeatureFlag

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:25](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L25)

## Interface

FeatureFlag

## Description

Defines the structure for a feature flag, used to gate access to tools
based on user subscriptions or specific entitlements.

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:27](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L27)

Optional. A human-readable description of the feature.

***

### flag

> **flag**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:26](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/tools/permissions/IToolPermissionManager.ts#L26)

The unique string identifier for the feature flag (e.g., "CAN_USE_ADVANCED_SEARCH_TOOL").
