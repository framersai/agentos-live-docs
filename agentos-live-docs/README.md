# AgentOS Live Docs

Adaptive AI intelligence for enterprise-ready agents.

This repository hosts the public documentation site at `https://docs.agentos.sh`, deployed with GitHub Pages.

## Structure

- `index.html` – Landing for docs site
- `docs/` – Place generated TypeDoc output here (static HTML)
- `CNAME` – Custom domain for Pages
- `.nojekyll` – Ensure static assets under `docs/` aren’t processed by Jekyll

## Publishing

Pages is deployed via GitHub Actions on push to `master`. To publish:

1. Generate TypeDoc artifacts in your AgentOS repo:
   ```bash
   pnpm --filter @framers/agentos run docs
   ```
   Copy the generated static output into this repo’s `docs/` directory.

2. Commit and push to `master`:
   ```bash
   git add -A && git commit -m "docs: publish TypeDoc" && git push origin master
   ```

## License

MIT © FramersAI / Frame.dev


