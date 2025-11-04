# Mirroring subdirectories to public repos

The private monorepo remains the source of truth. When we want to publish
individual packages/apps we split the history of the relevant subdirectory and
push it to the public repository under the `framersai` organisation.

## Current mappings

| Path                | Public repo                              |
| ------------------- | ---------------------------------------- |
| `packages/agentos`  | `git@github.com:framersai/agentos.git`   |
| `apps/agentos.sh`   | `git@github.com:framersai/agentos.sh.git`|
| `apps/agentos-client` | `git@github.com:framersai/agentos-client.git` |

> `packages/sql-storage-adapter` is intentionally excluded for now.

## Scripted workflow

The helper script `scripts/mirror-subtrees.sh` wraps `git subtree split` for the
targets above. By default it only creates local branches so you can review the
output. Pass `--push` to publish the branches to the remote repositories.

```bash
# Preview the branches that would be created
./scripts/mirror-subtrees.sh

# Split and force-push to the public remotes
./scripts/mirror-subtrees.sh --push
```

Before pushing, ensure you have write access to the destination repositories
(`git remote -v` should list the SSH URLs shown above). Each run will overwrite
the `main` branch of the public repo, which is expected because we control the
history centrally.

## One-time setup checklist

- Create the public repositories under `framersai` (empty, default branch
  `main`).
- Add deploy keys or configure your local SSH access so the script can push.
- Optional: set up GitHub Actions secrets (`AGENTOS_MIRROR_SSH_KEY`,
  `AGENTOS_LANDING_MIRROR_SSH_KEY`, `AGENTOS_CLIENT_MIRROR_SSH_KEY`) so the
  automation can run the same script.

The rest of the release automation lives in `docs/RELEASE_AUTOMATION.md`.


## Fresh repository bootstrap

For the first public release we can create history-free commits directly from this workspace. Example for the AgentOS core package:

```bash
TREE=$(git rev-parse HEAD:packages/agentos)
COMMIT=$(echo "Initial release: v0.1.0" | git commit-tree "$TREE")
git push git@github.com:framersai/agentos.git "$COMMIT":main
```

Repeat for `apps/agentos.sh` and `apps/agentos-client` by swapping the prefix/path. This seeds the public repository with a clean `main` branch containing only the desired snapshot.
