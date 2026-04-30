# Function: buildCapabilityYaml()

> **buildCapabilityYaml**(`tool`): `string`

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:296](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/SkillExporter.ts#L296)

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
