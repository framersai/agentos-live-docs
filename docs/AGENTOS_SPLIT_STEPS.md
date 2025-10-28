# AgentOS Repository Extraction Plan

Current repo: `manicinc/voice-chat-assistant`  
Target AgentOS repo: `wearetheframers/agentos`

## Step-by-step

### 1. Verify AgentOS package builds cleanly
```bash
npm --prefix packages/agentos run build
```
_Expected: tsc + tsc-alias finish with zero errors; `packages/agentos/dist` populated._

### 2. Create a subtree branch with AgentOS history
```bash
git subtree split --prefix packages/agentos -b agentos-split
git branch --list agentos-split  # confirm branch exists
```
_Expected: git prints the split commit hash, new branch `agentos-split` created._

### 3. Initialize the new repo locally
```bash
mkdir ../agentos && cd ../agentos
git init
git pull ../voice-chat-assistant agentos-split
```
_Expected: empty repo initialized, subtree history pulled into the new directory root._

### 4. Push to GitHub `wearetheframers/agentos`
```bash
git remote add origin git@github.com:wearetheframers/agentos.git
git push -u origin agentos-split:main
```
_Expected: remote branch `main` created on GitHub containing AgentOS sources._

### 5. Update Voice Chat Assistant to consume the external repo
1. Edit `backend/package.json` (and anywhere else) to point `@agentos/core` at the GitHub dependency, e.g.:
   ```json
   "@agentos/core": "github:wearetheframers/agentos#main"
   ```
2. Reinstall:
   ```bash
   pnpm install
   ```

### 6. (Optional) Remove `packages/agentos` from the VCA repo
```bash
git rm -r packages/agentos
git commit -m "chore: consume agentos from external repo"
```

From here, all AgentOS development happens in `wearetheframers/agentos`; VCA upgrades by bumping the dependency.

