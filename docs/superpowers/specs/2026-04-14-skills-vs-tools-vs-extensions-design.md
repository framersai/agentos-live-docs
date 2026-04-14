# Design Spec: Skills vs Tools vs Extensions Decision Guide

## Overview

A docs page that explains the three capability systems in AgentOS (Skills, Tools, Extensions), when to use each, and how they compose. Fills the biggest documentation gap identified in the audit. Standalone page in the architecture section.

## Metadata

- **File:** `apps/agentos-live-docs/docs/architecture/skills-vs-tools-vs-extensions.md`
- **Sidebar position:** After tools.md (position 10)
- **Title:** "Skills vs Tools vs Extensions"
- **Target length:** 800-1,200 words

## Structure

### 1. One-sentence summary of each

- Skills: prompt modules that teach the LLM when and how to use capabilities
- Tools: callable functions the LLM invokes during generation
- Extensions: installable packages that provide tools, guardrails, and workflows

### 2. Decision flowchart (Mermaid)

"Do you need the LLM to call a function?" -> Yes -> Tool. No -> "Do you need behavioral instructions injected into the system prompt?" -> Yes -> Skill. No -> "Do you need a reusable package of tools/guardrails?" -> Yes -> Extension.

### 3. Comparison table

| Aspect | Skills | Tools | Extensions |
|--------|--------|-------|------------|
| What it is | SKILL.md file | Function definition | npm package |
| How it loads | SkillRegistry scans directories | Inline on createAgent() or from extensions | ExtensionsRegistry resolves packages |
| What the LLM sees | System prompt text | Function call schema | Nothing directly (provides tools) |
| When it runs | At agent construction (prompt injection) | During generation (function call) | At initialization (tool/guardrail setup) |
| State access | None (prompt-only) | Can capture closures with request-scoped state | Package-scoped config |
| Use case | Behavioral guidelines, workflow instructions | API calls, DB queries, vision analysis, media | Reusable tool packages, guardrail packs |

### 4. The inline tools pattern

The most powerful pattern for production apps: defining tools as closures on `createAgent()` that capture request-scoped state (user ID, session, policy tier). Show the wilds.ai companion example. Explain why this can't come from a registry (needs runtime closures).

### 5. How they compose

Skills teach the LLM how to use tools. Extensions provide tools. All three work together. Show the loading order: extensions resolve tool packages -> tools defined inline or from extensions -> skills injected into system prompt -> LLM sees prompt + tool schemas.

### 6. Common mistakes

- Writing a skill when you need a tool (skill can't execute code)
- Writing an extension when you need an inline tool (extension can't capture request state)
- Skipping skills for complex tools (tool schema alone doesn't teach good judgment)

## Tone

Same as existing architecture docs: direct, technical, code examples where they clarify. No marketing.
