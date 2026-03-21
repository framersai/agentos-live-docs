# Email Intelligence Assistant — Re-Verification Audit

Last audited: 2026-03-20
Audited against local `master`

## Audit Outcome

The backend/core email-intelligence implementation is now present on `master` and was re-verified locally after the merge recovery.

Confirmed:

- merge commit `21934f27` re-merges the orphaned PR #49 work into `master`
- the backend email-intelligence module exists and is registered
- Gmail OAuth routes and service methods exist
- email-intelligence schema/tables exist
- credential metadata/expiry support exists
- targeted backend tests pass after one migration fix made during this audit

Not fully verified from the current working tree:

- submodule-backed extension/UI/registry artifacts, because several submodules in this checkout are not at the commits recorded by the superproject

## Verified Merge State

Verified from local git history:

- current branch: `master`
- merge commit present: `21934f27e1f478af08f98ac45b9794429690c7ee`
- merge parents: `dd6aa4a1` and `9a22bc7f`

The merge commit message and diffstat match the claimed recovery of PR #49.

## Backend Verification

### Module presence

Verified local module root:

- `backend/src/modules/wunderland/email-intelligence/`

Verified contents include:

- controller
- DTOs
- providers
- extractors
- reports
- 10 services
- test suite

### Module registration

Verified in source:

- `backend/src/modules/wunderland/wunderland.module.ts`

Current module wiring includes both:

- `EmailIntegrationModule`
- `EmailIntelligenceModule`

### Gmail OAuth

Verified in source:

- `backend/src/modules/wunderland/channels/channel-oauth.controller.ts`
- `backend/src/modules/wunderland/channels/channel-oauth.service.ts`

Current code includes:

- `GET /wunderland/channels/oauth/gmail/initiate`
- `POST /wunderland/channels/oauth/gmail/callback`
- `initiateGmailOAuth(...)`
- `handleGmailCallback(...)`

### Schema and migrations

Verified in source:

- `backend/src/core/database/appDatabase.ts`
- `backend/src/modules/wunderland/credentials/credentials.service.ts`
- `backend/src/modules/wunderland/dto/credentials.dto.ts`
- `backend/src/modules/wunderland/media-library/media-library.service.ts`

Verified implemented:

- `wunderland_email_accounts`
- `wunderland_email_synced_messages`
- `wunderland_email_attachments`
- `wunderland_email_projects`
- `wunderland_email_project_threads`
- `wunderland_email_digests`
- `wunderland_email_rate_limits`
- `source_type` and `source_ref` on media assets
- `metadata` and `expires_at` for credentials

## Issue Found During Re-Verification

### Fixed: missing compatibility migration for `wunderbots.sealed_at`

Problem:

- Gmail OAuth tests failed with `no such column: sealed_at`
- root cause was a migration gap for older `wunderbots` tables
- the fresh `CREATE TABLE wunderbots` path already had `sealed_at`, but the compatibility migration path did not backfill it

Fix made during this audit:

- added `ensureColumnExists(...)` migrations for:
  - `wunderbots.storage_policy`
  - `wunderbots.sealed_at`

File changed:

- `backend/src/core/database/appDatabase.ts`

## Test Verification

Passed locally:

- `pnpm exec vitest run src/modules/wunderland/email-intelligence/__tests__/gmail-oauth.spec.ts src/modules/wunderland/email-intelligence/__tests__/email-tables.spec.ts`

Result:

- 2 test files passed
- 17 tests passed

Notes:

- an earlier attempt used the wrong runner for mixed test styles and is not relevant to the final backend verification result
- `email-intelligence-module.spec.ts` appears to be written for Node's built-in test runner rather than Vitest, so it was validated by source inspection instead of the above Vitest command

## Submodule Verification Caveat

The merge commit updates several submodule pointers:

- `apps/rabbithole`
- `packages/agentos-extensions`
- `packages/agentos-extensions-registry`
- `packages/agentos-skills-registry`
- `packages/wunderland`

In this checkout, those submodules are not all aligned with the superproject-recorded commits.

Observed during audit:

- `apps/rabbithole`, `packages/agentos-extensions`, `packages/agentos-extensions-registry`, `packages/agentos-skills-registry`, and `packages/wunderland` are not all checked out at the SHAs recorded by `master`
- `apps/rabbithole` and `packages/wunderland` also have local working-tree modifications
- attempts to fetch some superproject-recorded SHAs for the AgentOS extension/registry submodules from their configured remotes returned `not our ref`

Interpretation:

- backend verification is solid
- extension/UI/registry verification is incomplete from this local checkout
- if those submodule SHAs were not pushed to their canonical remotes, checkout reproducibility remains a release risk

## Practical Status

As of this audit:

- the earlier claim that the implementation was entirely missing is no longer correct
- the backend email-intelligence implementation is real and present on `master`
- one real migration bug was fixed during verification
- the remaining open concern is submodule integrity and reproducibility, not the existence of the backend feature itself

## Recommended Next Steps

1. Verify that the submodule SHAs recorded by `master` exist on the intended remotes and can be checked out cleanly.
2. Re-run the extension/UI verification from a clean clone with `git submodule update --init --recursive`.
3. If desired, replace this audit note with a final implementation summary only after the submodule-backed artifacts are reproducibly available.
