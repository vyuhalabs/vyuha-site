# vyuha-site

The public website of vyuha, at https://vyuhalabs.github.io/vyuha-site. Astro, static output.

- Setup: Node 22 (`nvm use`, from `.nvmrc`) and pnpm, then `pnpm install`.
- Run: `pnpm dev`, then open http://localhost:4321/vyuha-site/.
- Build: `pnpm build` writes `dist/`; `pnpm preview` serves it.
- Check: `pnpm check` (astro check), `pnpm typecheck`, `pnpm lint` (Biome), `pnpm links` (after a build), `pnpm test`.
- Deploy: merge to `main`; the `deploy` workflow builds with `SITE_URL` and publishes to GitHub Pages.
- Every pull request runs the `build` and `quality` workflows. Notes on the site itself are in `docs/`.
