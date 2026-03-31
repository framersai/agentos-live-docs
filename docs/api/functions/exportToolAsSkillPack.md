# Function: exportToolAsSkillPack()

> **exportToolAsSkillPack**(`tool`, `outputDir`): `Promise`\<\{ `capabilityPath`: `string`; `skillPath`: `string`; \}\>

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:376](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/SkillExporter.ts#L376)

Exports an emergent tool as a full skill pack (SKILL.md + CAPABILITY.yaml).

Creates a directory named after the tool under `outputDir`, containing both
files. This directory structure is compatible with the
capability manifest scanner and can be placed in any scan directory
(`~/.wunderland/capabilities/`, `./.wunderland/capabilities/`, etc.) for
automatic discovery.

## Parameters

### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to export.

### outputDir

`string`

Base directory where the skill subdirectory will be created.

## Returns

`Promise`\<\{ `capabilityPath`: `string`; `skillPath`: `string`; \}\>

Paths to the written SKILL.md and CAPABILITY.yaml files.

## Throws

If the filesystem writes fail (permissions, disk full, etc.).

## Example

```ts
const { skillPath, capabilityPath } = await exportToolAsSkillPack(
  myTool,
  '/home/user/.wunderland/capabilities',
);
// skillPath     => "/home/user/.wunderland/capabilities/my-tool/SKILL.md"
// capabilityPath => "/home/user/.wunderland/capabilities/my-tool/CAPABILITY.yaml"
```
