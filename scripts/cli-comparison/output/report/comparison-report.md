# OpenClaw vs Wunderland: Feature Comparison Report

Generated: 2026-03-04T19:28:04.317Z
OpenClaw version: 2026.3.2
Wunderland version: wunderland v0.36.1

## Executive Summary

| Category           | OpenClaw                | Wunderland                                     |
| ------------------ | ----------------------- | ---------------------------------------------- |
| Onboarding steps   | ~9                      | 9 (QuickStart) / 19 (Advanced)                 |
| LLM providers      | ~4                      | 13                                             |
| Channel platforms  | ~8                      | 29                                             |
| Security features  | Binary (enable/disable) | 5-tier pipeline (Pre-LLM + Dual-LLM + Signing) |
| Personality system | None                    | HEXACO 6-factor, 5 presets + custom            |
| Voice (TTS/STT)    | None                    | 3 TTS + 3 STT providers                        |
| Observability      | Basic logs              | OpenTelemetry (3 presets)                      |
| Extension catalog  | ~10                     | 23+ tools, 18 skills                           |
| Agent presets      | None                    | 8 presets + 3 deployment templates             |
| Export/Import      | None                    | wunderland export/import + seal/verify-seal    |
| Dashboard          | Built-in web UI         | Separate (AgentOS Workbench)                   |
| Daemon mode        | Built-in                | Not included                                   |

---

## Command Comparisons

### Help

![cmd-help](../comparisons/cmd-help.png)

- Wunderland has 17+ commands vs OpenClaw ~12
- Wunderland adds: seal, list-presets, skills, models, plugins, export, import

### Version

![cmd-version](../comparisons/cmd-version.png)

- Different versioning: OpenClaw uses calendar (2026.x.x), Wunderland uses semver (0.x.x)

### Doctor-Health-Check

![cmd-doctor-health-check](../comparisons/cmd-doctor-health-check.png)

- Both check system health
- Wunderland checks HEXACO personality config, security tier, and extension health

### Status

![cmd-status](../comparisons/cmd-status.png)

- Wunderland shows security tier, personality preset, active channels

### Models

![cmd-models](../comparisons/cmd-models.png)

- Wunderland supports 13 LLM providers vs OpenClaw ~4
- Wunderland includes SmallModelResolver for cost optimization

### Skills

![cmd-skills](../comparisons/cmd-skills.png)

- Wunderland has 18 curated skills with SKILL.md descriptors
- OpenClaw uses community skill repository

### Agent Presets

![cmd-agent-presets](../comparisons/cmd-agent-presets.png)

- Wunderland-only: 8 agent presets (research, support, creative, code-review, data, security, devops, personal)
- Each preset includes HEXACO traits, security tier, skill suggestions, persona document

### Channels

![cmd-channels](../comparisons/cmd-channels.png)

- Wunderland: 29 channel platforms
- OpenClaw: ~8 channel platforms
- Wunderland adds: Signal, iMessage, Zalo, Nostr, Twitch, Line, Feishu, Mattermost, NextcloudTalk, Tlon

## Setup Wizard Comparisons

### Security Acknowledgment

![setup-security-ack](../comparisons/setup-security-ack.png)

- OpenClaw-only: requires security acknowledgment before setup begins

### Setup Mode Selection

![setup-mode](../comparisons/setup-mode.png)

- Both offer QuickStart vs Advanced; OpenClaw calls it "Onboarding mode"

### Agent / Workspace Name

![setup-name](../comparisons/setup-name.png)

- OpenClaw: "workspace directory", Wunderland: "agent name"

### Observability Config

![setup-observability](../comparisons/setup-observability.png)

- Wunderland-only: OpenTelemetry configuration (off/traces+metrics/full)

### LLM Provider

![setup-provider](../comparisons/setup-provider.png)

- OpenClaw: ~30 providers (model/auth provider), Wunderland: 13 providers multi-select

### Auth Method

![setup-auth-method](../comparisons/setup-auth-method.png)

- OpenClaw-only: OAuth (Codex) vs API key auth; Wunderland uses direct API key only

### API Key Provision

![setup-key-provision](../comparisons/setup-key-provision.png)

- OpenClaw-only: choose how to provide API key (paste, env var, etc.)

### Use Existing Key

![setup-use-env-key](../comparisons/setup-use-env-key.png)

- OpenClaw auto-detects OPENAI_API_KEY from environment

### API Key Input

![setup-api-key](../comparisons/setup-api-key.png)

- Both require API key; Wunderland also offers .env paste import

### Model Selection

![setup-model](../comparisons/setup-model.png)

- Similar model selection; Wunderland includes SmallModelResolver for cost optimization

### Channel Selection

![setup-channels](../comparisons/setup-channels.png)

- OpenClaw: ~20 channels, Wunderland: ~30 platforms with emoji icons

### Daemon / Background Mode

![setup-daemon](../comparisons/setup-daemon.png)

- OpenClaw-only: built-in daemon mode (LaunchAgent/systemd)

### Skills Selection

![setup-skills](../comparisons/setup-skills.png)

- Both have skills; Wunderland skills appear in Advanced mode with paginated catalog

### Review & Confirm

![setup-review](../comparisons/setup-review.png)

- Both show review/summary before finalizing

## Wunderland-Only Features

1. **Security Pipeline** — 5 named tiers (dangerous/permissive/balanced/strict/paranoid) with Pre-LLM classifier, Dual-LLM auditor, output signing
2. **HEXACO Personality** — 6-factor personality model with 5 presets (Helpful, Creative, Analytical, Empathetic, Decisive) + custom sliders
3. **Voice Integration** — TTS (OpenAI/ElevenLabs/Piper) + STT (Whisper/Deepgram/SpeechRecognition)
4. **OpenTelemetry Observability** — Traces, metrics, logs with 3 configuration presets
5. **Agent Export/Import** — Portable agent manifests via `wunderland export/import`
6. **Output Signing** — Cryptographic seal verification via `wunderland seal/verify-seal`
7. **Extended Channels** — 29 platforms vs ~8 (adds Signal, iMessage, Zalo, Nostr, Twitch, Line, Feishu, etc.)
8. **18 Curated Skills** — SKILL.md-based skill descriptors with auto-loading via PresetSkillResolver
9. **8 Agent Presets** — Pre-configured personas with HEXACO traits, security, skills, channels
10. **Style Adaptation** — Learns user communication preferences (formality, verbosity, technicality)
11. **Capability Discovery** — Semantic tool discovery via embeddings + graph reranking

## OpenClaw-Only Features

1. **Built-in Dashboard** — `openclaw dashboard` opens web UI for browser-based chat
2. **Daemon Mode** — Background process management (LaunchAgent on macOS, systemd on Linux)
3. **Health Check in Onboarding** — Connectivity verification as part of setup wizard
4. **Gateway Architecture** — WebSocket gateway for multi-client connections

## Recommendations for Feature Parity

### Wunderland should add:

- Built-in web dashboard (or integrate AgentOS Workbench as default)
- Daemon/background mode for always-on agents
- Health check step in setup wizard

### OpenClaw could benefit from:

- Security tiers beyond binary enable/disable
- HEXACO personality for consistent agent behavior
- OpenTelemetry observability
- Agent preset system
- Larger channel ecosystem
