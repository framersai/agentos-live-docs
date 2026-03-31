---
sidebar_position: 25
---

# Local File Search

Search for files on the local filesystem by fuzzy name matching with configurable denylist filtering.

## Overview

The `local_file_search` tool finds files across the host filesystem using fuzzy name matching. Results are ranked by relevance (exact match > starts with > contains > fuzzy Levenshtein). A configurable denylist prevents exposure of sensitive directories and file types.

**Package:** `@framers/agentos-ext-local-file-search`

## Installation

```bash
npm install @framers/agentos-ext-local-file-search
```

## Configuration

```json title="agent.config.json"
{
  "fileSearch": {
    "denylist": ["/proc", "/sys", "/dev", "node_modules", ".git", ".ssh", "*.key", "*.pem"],
    "maxResults": 10,
    "maxDepth": 10,
    "timeoutMs": 10000
  }
}
```

## Tool Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Filename or partial filename |
| `directory` | string | No | Specific directory to search |

## Example

```
User: "Find the report I downloaded yesterday"
Agent: local_file_search({ query: "report", directory: "/Users/me/Downloads" })
Result: [
  { path: "/Users/me/Downloads/Q4-report.pdf", size: 2100000, mimeType: "application/pdf" },
  { path: "/Users/me/Downloads/report-draft.docx", size: 450000, mimeType: "application/vnd.openxmlformats..." }
]
```

## Security

The denylist is enforced at the directory level (early termination) and file level (glob patterns). Sensitive paths like `.ssh`, `.gnupg`, `.aws`, and files matching `*.key` or `*.pem` are excluded by default.

The full filesystem is searchable by default (denylist-filtered). To restrict to specific directories, configure allowed paths in `agent.config.json` or pass a `directory` parameter.
