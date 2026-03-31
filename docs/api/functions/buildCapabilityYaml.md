# Function: buildCapabilityYaml()

> **buildCapabilityYaml**(`tool`): `string`

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:296](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/SkillExporter.ts#L296)

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
