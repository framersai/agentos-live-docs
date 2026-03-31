# Function: buildCapabilityYaml()

> **buildCapabilityYaml**(`tool`): `string`

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:296](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/SkillExporter.ts#L296)

Builds a CAPABILITY.yaml content string for an emergent tool.

The format matches the schema expected by the capability manifest scanner:
```yaml
id: tool:<name>
kind: tool
name: <name>
displayName: <Title Case Name>
description: <description>
category: emergent
tags: [generated, ...]
inputSchema: { ... }
outputSchema: { ... }
skillContent: ./SKILL.md
```

## Parameters

### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to export.

## Returns

`string`

CAPABILITY.yaml content string.
