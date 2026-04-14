# Function: writeSkillFile()

> **writeSkillFile**(`tool`, `outputDir`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:340](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/emergent/SkillExporter.ts#L340)

Writes a SKILL.md file to disk for an emergent tool.

Creates the output directory if it does not exist. The file is written to
`<outputDir>/<tool.name>/SKILL.md`.

## Parameters

### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to export.

### outputDir

`string`

Base directory where the skill subdirectory will be created.

## Returns

`Promise`\<`string`\>

Absolute path to the written SKILL.md file.

## Throws

If the filesystem write fails (permissions, disk full, etc.).

## Example

```ts
const skillPath = await writeSkillFile(myTool, '/home/user/.wunderland/capabilities');
// => "/home/user/.wunderland/capabilities/my-tool/SKILL.md"
```
