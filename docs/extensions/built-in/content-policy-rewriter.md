---
sidebar_position: 28
---

# Content Policy Rewriter

Hybrid keyword + LLM content policy guardrail with 8 configurable categories and 4 presets.

## Overview

The content policy rewriter is an opt-in guardrail extension that filters agent output through a two-layer pipeline:

1. **Keyword pre-filter** (streaming, zero-cost) — catches obvious violations instantly
2. **LLM policy judge** (final response) — classifies and optionally rewrites subtle violations

Agents are uncensored by default. This extension only activates when explicitly enabled.

**Package:** `@framers/agentos-ext-content-policy-rewriter`

## Categories

| Category | Default Action | Description |
|----------|---------------|-------------|
| `illegal_harmful` | BLOCK | CSAM, sexual assault, bestiality, exploitation |
| `adult` | SANITIZE | Consensual sexually explicit content |
| `profanity` | SANITIZE | Slurs, vulgar language |
| `violence` | SANITIZE | Graphic violence descriptions |
| `self_harm` | BLOCK | Self-harm, suicide instructions |
| `hate_speech` | SANITIZE | Discriminatory content |
| `illegal_activity` | BLOCK | Drug synthesis, weapons |
| `custom` | configurable | User-defined policy rules |

All categories default to **disabled**. Only `illegal_harmful` is enabled by default when the extension is installed with zero config.

## Presets

```json title="agent.config.json"
// Uncensored — zero filtering
{ "guardrails": { "contentPolicy": "uncensored" } }

// Uncensored but block CSAM/assault
{ "guardrails": { "contentPolicy": "uncensored-safe" } }

// Family-friendly — all categories enabled
{ "guardrails": { "contentPolicy": "family-friendly" } }

// Enterprise — all categories + custom rules
{ "guardrails": { "contentPolicy": {
  "preset": "enterprise",
  "customRules": "Never mention competitor products by name."
} } }
```

## Per-Category Configuration

```json title="agent.config.json"
{
  "guardrails": {
    "contentPolicy": {
      "enabled": true,
      "categories": {
        "illegal_harmful": { "enabled": true, "action": "block" },
        "adult": { "enabled": true, "action": "sanitize" },
        "profanity": { "enabled": false },
        "violence": { "enabled": true, "action": "sanitize" }
      }
    }
  }
}
```

## Actions

- **BLOCK** — reject the response entirely, return a policy violation message
- **SANITIZE** — rewrite the response to remove violations while preserving meaning and tone
