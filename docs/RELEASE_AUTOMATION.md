# Release & Mirroring Workflow

This repository stays private. Anything we share publicly (packages, landing page, client workbench) is exported from here.

## Branches & Tags

- Work happens on `dev`.
- Promote to `master` via PR when you are ready to ship.
- Cut a release by tagging `master` with `vX.Y.Z`. Tags drive publishing, mirroring, and deploys.
- Opt out by adding the `skip-release` label to the merge commit pull request; the automation checks the label before doing any destructive actions.

### Commit style

Stick to `<type>: <message>` (e.g. `fix: normalise persona metadata`). Only use `feat:` when we actually ship something new. Avoid LLM filler.

## Public Targets (confirm before wiring)

| Path                   | Public repo                               |
| ---------------------- | ----------------------------------------- |
| `packages/agentos`     | `github.com/framersai/agentos`      |
| `apps/agentos.sh` | `github.com/framersai/agentos.sh`   |
| `apps/agentos-client`  | `github.com/framersai/agentos-client` |

Create these repos ahead of time (empty, default branch `main`). Grant a deploy key or use a GitHub App token so Actions can push.

## GitHub Actions Outline

### 1. Mirror directories\n\n*(Fresh history commit option:)* For initial publication you can create an orphan commit with `git commit-tree` (see `docs/REPO_MIRRORING.md`). Once those repos have a baseline, the subtree workflow below keeps them in sync.\n\n

Trigger: push of a `v*` tag on `master`.

Steps per target:

1. Checkout with full history.
2. Delete unsafe files (`.env`, internal docs).
3. `git subtree split --prefix <path> temp-branch`.
4. Force push the temp branch to the public repo `main`.

One workflow per directory (`mirror-agentos.yml`, `mirror-landing.yml`, etc.). Same pattern, different prefixes/destinations.

### 2. Publish `@framers/agentos`

Workflow `publish-agentos.yml`:

1. Trigger on `v*` tags unless `skip-release` is set.
2. `pnpm install --frozen-lockfile`.
3. `pnpm --filter @framers/agentos build`.
4. `pnpm --filter @framers/agentos test`.
5. `pnpm --filter @framers/agentos publish --access public` with `NPM_TOKEN`.

Version bumps for the package still happen through PRs before tagging.

### 3. Deploy landing page

We will publish the mirror in `agentos.sh` and deploy from there. For now:

- Build with `pnpm --filter @framersai/agentos.sh build`.
- Export static assets with `next export -o out`.
- Push `out/` to the public repo `gh-pages` branch or sync to the final hosting provider (to be confirmed).

Document the chosen hosting provider once selected (Vercel/S3/etc.).

### 4. AgentOS client

Flow mirrors the landing app:

- Build with `pnpm --filter @framersai/agentos-client build`.
- Artifact ends up in `dist/`.
- TODO: decide deployment target (Linode object storage, container, etc.). Add the deployment command once we have the destination.

## Secrets & Hygiene

- Store secrets in this repo's Settings ? Secrets:
  - `NPM_TOKEN`
  - `AGENTOS_MIRROR_SSH_KEY`
  - `AGENTOS_LANDING_MIRROR_SSH_KEY`
  - `AGENTOS_CLIENT_MIRROR_SSH_KEY`
  - Any hosting credentials used by future deploy jobs.
- Before splitting, explicitly `rm` any `.env` or internal-only files in each target directory.
- Add `.gitignore` rules in the public repos to prevent future leaks (`*.env`, `/docs/internal`).

## Manual Checklist Before Tagging

1. Review the release PR from `dev` ? `master`.
2. Confirm the package version is bumped where needed.
3. Remove any stray `.env` or temporary files.
4. Merge, tag `master` with `vX.Y.Z`, push the tag.
5. Watch the Actions dashboard; re-run jobs if they fail.
6. Update release notes (`gh release create` is handy once artifacts are published).

## Initial One-Time Setup

Complete these steps before the first release so the workflows can publish and mirror automatically.

1. **Create public repositories**
   - `github.com/framersai/agentos`
   - `github.com/framersai/agentos.sh`
   - `github.com/framersai/agentos-client`
   - Leave them empty (default branch `main`).

2. **Generate deploy keys**
   - Run the following for each repo (replace the filename per repo so you keep the keys separate):
     ```bash
     ssh-keygen -t ed25519 -C "agentos mirror" -f ~/.ssh/agentos-mirror
     ```
   - Add the *public* key (`~/.ssh/agentos-mirror.pub`) to the target repo under **Settings ? Deploy keys** and enable “Allow write access”.
   - Add the *private* key as a secret in this private repo (**Settings ? Secrets and variables ? Actions**):
     - `AGENTOS_MIRROR_SSH_KEY` ? private key for `framersai/agentos`
     - `AGENTOS_LANDING_MIRROR_SSH_KEY` ? private key for `framersai/agentos.sh`
     - `AGENTOS_CLIENT_MIRROR_SSH_KEY` ? private key for `framersai/agentos-client`

3. **Add the npm token**
   - Store a publish-capable npm token as `NPM_TOKEN` in the same secrets panel.

4. **Decide hosting targets**
   - Landing page (`agentos.sh`): choose Vercel, GitHub Pages, S3/CloudFront, etc. Update the deploy workflow once selected.
   - Client workbench: decide whether it ships as a static bundle, desktop app, or container, and extend the workflow accordingly.

Once these are in place, pushing a `v*` tag on `master` (without `[skip-release]`) will publish `@framers/agentos` and mirror the apps automatically.

## Open TODOs

- [ ] Confirm public repo names.
- [ ] Pick hosting for `agentos.sh` and document the deploy command.
- [ ] Decide how the client workbench is hosted (Linode plan, Docker image, etc.).
- [ ] Add final `rm` patterns for directories that hold secrets once the team audits them.


