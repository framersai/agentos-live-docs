# Function: exportToolAsSkill()

> **exportToolAsSkill**(`tool`): `string`

Defined in: [packages/agentos/src/emergent/SkillExporter.ts:149](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/SkillExporter.ts#L149)

Converts an [EmergentTool](../interfaces/EmergentTool.md) into a SKILL.md markdown string.

The generated SKILL.md follows the standard format used by the curated
skills in `packages/agentos-skills/registry/curated/`. It includes
YAML frontmatter, a purpose section, usage guidance, a parameter table,
and implementation notes.

Sandbox tools receive a redaction notice instead of exposed source code —
the SKILL.md documents the tool's interface without leaking runtime code.

## Parameters

### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to export.

## Returns

`string`

Complete SKILL.md content as a string.

## Example

```ts
import { exportToolAsSkill } from '@framers/agentos/emergent/SkillExporter';

const markdown = exportToolAsSkill(myEmergentTool);
console.log(markdown);
// ---
// name: fetch-data
// version: '1.0.0'
// ...
// ---
// # Fetch Data
// ...
```
