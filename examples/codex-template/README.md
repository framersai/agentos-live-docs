# Codex Template

Starter repository for launching your own analog knowledge OS with **@framers/codex-viewer**. This mirrors the exact weave → loom → strand structure that powers [frame.dev/codex](https://frame.dev/codex).

## Quick start

```bash
git clone https://github.com/framersai/codex-template
cd codex-template
cp env.example .env.local
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to explore the embedded viewer.

### Docker / Compose

```bash
docker compose up --build
```

The site will be available on `http://localhost:3000`. Override env vars via `docker-compose.yml`.

## Repository layout

```
codex-template
├─ app/                     # Next.js App Router entry
│  ├─ layout.tsx            # Imports @framers/codex-viewer CSS + fonts
│  └─ page.tsx              # Hero, instructions, embedded viewer
├─ components/
│  └─ EmbeddedCodex.tsx     # Client component that renders <CodexViewer />
├─ weaves/                  # Your knowledge fabric (OpenStrand docs mirrored here)
│  └─ openstrand/
├─ codex.config.json        # Optional global metadata + links
├─ env.example              # Copy to .env.local and tweak owner/repo/branch
└─ package.json             # Next.js + @framers/codex-viewer dependency
```

### Weave schema overview

| Layer | Description | Example in repo |
| --- | --- | --- |
| Fabric | Entire knowledge base (`weaves/`) | this repo |
| Weave | Top-level collection | `weaves/openstrand` |
| Loom | Folder inside a weave | `weaves/openstrand/schema` |
| Strand | Markdown file | `weaves/openstrand/schema/hierarchy.md` |

Each `loom.yaml` contains metadata (title, summary, tags). Each strand can include YAML frontmatter; the viewer parses and surfaces it in the metadata panel.

### OpenStrand content mirrored

Instead of lorem ipsum, this template mirrors the official OpenStrand schema docs:

- `openstrand/overview.md` – explains weave/loom/strand concepts
- `openstrand/schema/**` – hierarchy + metadata reference
- `openstrand/playbooks/**` – indexing/publishing guides

Feel free to keep these strands as living docs or replace them with your own knowledge base once you understand the structure.

## Configuration

Set up environment variables (copy `env.example` → `.env.local`):

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_CODEX_REPO_OWNER` | GitHub org or user | `framersai` |
| `NEXT_PUBLIC_CODEX_REPO_NAME` | Repository to read (`weaves/` lives here) | `codex-template` |
| `NEXT_PUBLIC_CODEX_REPO_BRANCH` | Branch to pull from | `main` |

> Codex content is streamed directly from GitHub’s Content + Trees API. Push your markdown first, then run the template locally or deploy to Vercel/Netlify.

## Deployment

1. Push your fork/template repo to GitHub.
2. Connect to Vercel, Netlify, or your host of choice.
3. Set the three `NEXT_PUBLIC_CODEX_*` env vars in your hosting dashboard.
4. Deploy. The `/` route includes the embedded viewer; link directly to `/` or mount under `/codex` if you integrate into a larger site.

## Extending

- Add more weaves/looms/strands by dropping folders + markdown files under `weaves/`.
- Enable analytics exactly like `frame.dev` by embedding the `Analytics` component from the main repo (optional).
- Want mobile/desktop installability? Add a `public/manifest.json` (see `apps/frame.dev/public/manifest.json` for reference).

## Where to learn more

- Documentation + schema guide: **[frame.dev/codex](https://frame.dev/codex)**
- Component API reference: [`packages/codex-viewer/README.md`](../../packages/codex-viewer/README.md)
- NPM: [@framers/codex-viewer](https://www.npmjs.com/package/@framers/codex-viewer)
- Starter issues & roadmap: [GitHub Issues](https://github.com/framersai/codex-template/issues)
- Questions: [team@frame.dev](mailto:team@frame.dev)

## License

MIT © Frame.dev — feel free to fork, remix, and deploy.

