---
sidebar_position: 27
---

# Send File to Channel

Send a local file to the user via the current chat channel with platform-aware size limits.

## Overview

The `send_file_to_channel` tool bridges local files to messaging platforms. It checks file size against platform-specific limits and sends via the active chat channel (Telegram, WhatsApp, Discord, Slack).

**Package:** `@framers/agentos-ext-send-file-to-channel`

## Installation

```bash
npm install @framers/agentos-ext-send-file-to-channel
```

## Tool Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | string | Yes | Absolute path to the file |
| `caption` | string | No | Message accompanying the file |

## Platform File Size Limits

| Platform | Limit |
|----------|-------|
| Telegram | 50 MB |
| WhatsApp (Cloud API) | 100 MB |
| WhatsApp (Twilio) | 16 MB |
| Discord | 25 MB |
| Slack | 1 GB |

When a file exceeds the limit, the tool suggests compression instead of failing silently.

## Channel Context

This tool requires a `ChannelContext` injected by the `ChatTaskResponder`. It only works when invoked through a messaging channel — not in CLI or direct API mode.

## Example Workflow

```
User (Telegram): "Send me pic.png from Downloads"
Agent:
  1. local_file_search({ query: "pic.png" })
     → { path: "/Users/me/Downloads/pic.png", size: 2100000 }
  2. send_file_to_channel({ filePath: "/Users/me/Downloads/pic.png", caption: "Here's your file!" })
     → { sent: true, platform: "telegram", fileName: "pic.png", size: 2100000 }
```
