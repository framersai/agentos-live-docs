---
sidebar_position: 26
---

# Zip Files

Create zip archives from local files for sharing via chat channels.

## Overview

The `zip_files` tool creates compressed zip archives from one or more local files. Designed to work with `local_file_search` and `send_file_to_channel` for end-to-end file relay workflows.

**Package:** `@framers/agentos-ext-zip-files`

## Installation

```bash
npm install @framers/agentos-ext-zip-files
```

## Tool Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `files` | string[] | Yes | Array of absolute file paths |
| `outputName` | string | No | Zip filename (without `.zip`) |

## Example

```
User: "Zip up my project files and send them to me"
Agent:
  1. local_file_search({ query: "project" })
  2. zip_files({ files: ["/path/a.ts", "/path/b.ts"], outputName: "project-files" })
  3. send_file_to_channel({ filePath: "/tmp/wunderland-zips/project-files.zip" })
```

## Behavior

- **Output:** `/tmp/wunderland-zips/<name>.zip`
- **Compression:** zlib level 6
- **Max input size:** 500 MB total
- **Auto-cleanup:** Zips older than 1 hour deleted on each invocation
- **Validation:** All input paths verified before archiving

## Dependencies

Uses the `archiver` npm package for cross-platform zip creation.
