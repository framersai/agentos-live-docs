# Email Intelligence Assistant — Plan Overview

> **Spec:** `docs/superpowers/specs/2026-03-19-email-intelligence-assistant-design.md`

This feature is decomposed into 6 independent plans, each producing working, testable software:

| Plan | Name                                                                                        | Depends On | Status  |
| ---- | ------------------------------------------------------------------------------------------- | ---------- | ------- |
| 1    | [Prerequisites & Schema Migrations](2026-03-19-email-intelligence-1-prerequisites.md)       | None       | Ready   |
| 2    | [Backend Core (Provider + Sync + Threads)](2026-03-19-email-intelligence-2-backend-core.md) | Plan 1     | Ready   |
| 3    | Intelligence Layer (RAG + Projects + Attachments)                                           | Plan 2     | Pending |
| 4    | Reports & Digests                                                                           | Plans 2, 3 | Pending |
| 5    | Extension Pack (ITool implementations)                                                      | Plan 2     | Pending |
| 6    | Rabbithole Dashboard UI                                                                     | Plans 2, 3 | Pending |

Plans 3-6 will be written after Plans 1-2 land.
