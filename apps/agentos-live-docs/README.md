<div align="center">

<p align="center">
  <a href="https://agentos.sh"><img src="../../logos/agentos-primary-no-tagline-transparent-2x.png" alt="AgentOS" height="64" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev" target="_blank" rel="noopener"><img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame.dev" height="40" /></a>
</p>

# AgentOS Live Docs

Adaptive AI intelligence for enterprise-ready agents, documented as part of the Frame.dev ecosystem.

*The OS for humans, the codex of humanity.*

[Frame.dev](https://frame.dev) • [AgentOS](https://agentos.sh) • [Docs](https://docs.agentos.sh)

</div>

---

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


