# Changelog

All notable changes to this project will be documented in this file.

**═══════════════════ v1.6.1 — released 2026-11-13 ═══════════════════**

## [2026-11-13] — Hand-written changelog

**Type:** chore

### Changes

- **Changelog rewritten by hand**: one readable entry per stable release (v0.0.1 → v1.6.0), rebuilt from commits and
  diffs, instead of the single conventional-changelog block listing every commit.
- **No more regeneration at release time**: `release.sh` used to delete `CHANGELOG.md` and rebuild it with
  conventional-changelog, which would have overwritten the hand-written entries. Stable releases now only stamp a
  version delimiter above the new entries through `scripts/stamp-changelog.sh` (idempotent); release candidates are
  not stamped. The `changelog` script and the `conventional-changelog*` dev dependencies are removed.
- `changelog-update` skill documents entry format, ordering and delimiters.
- Verified: stamping a fake v1.6.1 puts the delimiter above the topmost entry, a second run is a no-op.

### Files modified

- `CHANGELOG.md` — rewritten
- `scripts/stamp-changelog.sh` (new) — version delimiter
- `scripts/release.sh` — stamps the changelog on stable releases instead of regenerating it
- `package.json`, `pnpm-lock.yaml` — `changelog` script and `conventional-changelog*` removed
- `.claude/skills/changelog-update/SKILL.md` (new), `.claude/CLAUDE.md`, `.claude/AGENTS.md` — changelog rules

## [2026-11-13] — Migrate to pnpm, dependency update

**Type:** chore

### Changes

- **pnpm 12.18** replaces npm: `packageManager` field, `pnpm-lock.yaml` imported from the npm lockfile (same
  resolved versions), `package-lock.json` removed.
- The local `@keycloakify/angular-email` dependency is now `link:dist/angular-email` (a symlink, as npm's `file:`
  was): install works before `dist` exists, `scripts/refresh-lib.sh` becomes install → build → install.
- `pnpm-workspace.yaml`: the `esbuild` override moves to a catalog (pnpm deprecates the `$esbuild` syntax);
  `allowBuilds` runs only esbuild's postinstall — `@parcel/watcher`, `lmdb` and `msgpackr-extract` only compile from
  source when no prebuilt binary is available; the Angular 22.2.7 packages are excluded from pnpm's minimum release
  age check.
- CI installs with `pnpm/action-setup` + `pnpm install --frozen-lockfile`; publishing still uses `npm publish`
  (OIDC trusted publishing).
- **Format check now real**: `npm run _format --list-different` never forwarded the flag to prettier, so the CI check
  always passed. pnpm forwards it: the 10 files that were out of format have been formatted.
- Development dependencies: Angular 22.2.6 / CLI-build-ssr 22.2.7, Tailwind 4.3.5, juice 12.2.3, postcss plugins,
  eslint 10.14, prettier 3.10, `@types/node` 26. Development Node version moved to `lts/lithium` (26). Library
  peer and runtime dependency ranges are unchanged.
- README: `pnpm add` among the install commands.
- Verified: `pnpm install --frozen-lockfile`, `pnpm build`, `ng lint`, `pnpm render:test` (HTML identical to the npm
  build), `pnpm _format --list-different`.

### Files modified

- `package.json`, `pnpm-workspace.yaml` (new), `pnpm-lock.yaml` (new), `package-lock.json` (removed)
- `.nvmrc` — `lts/lithium`
- `.github/workflows/ci.yaml` — pnpm setup and install
- `scripts/build.sh`, `scripts/refresh-lib.sh`, `scripts/release.sh` — pnpm commands
- `README.md`, `projects/angular-email/README.md` — pnpm install command
- `.gitignore` — `pnpm-debug.log`
- `.claude/CLAUDE.md` — pnpm commands
- `.claude/settings.json` — formatting, `Write(node_modules/**)` deny removed
- Prettier formatting only: `.vscode/settings.json`, `tsconfig.json`, `projects/angular-email/{bin,node}/tsconfig.json`,
  `projects/angular-email/tsconfig.{lib,spec}.json`, `projects/showcase/.postcssrc.json`

**═══════════════════ v1.6.0 — released 2026-10-02 ═══════════════════**

## [2026-10-02] — Outlook fixes for button, image, container and calc()

**Type:** bugfix

### Changes

- **Single-value `calc()` unwrapped.** postcss-calc 11 reduces `calc(4px * 12)` to `calc(48px)` but keeps the wrapper,
  and clients without `calc()` support (Outlook, Outlook.com) drop the whole declaration. The Tailwind
  `cssProcessor` now unwraps single-value `calc()` after postcss-calc; real expressions (`calc(100% - 20px)`) are kept.
- **Button (VML):** the `v:roundrect` used the width for `height`, and `strokecolor` / `fillcolor` were unquoted.
- **Image:** `width` / `height` are emitted as HTML attributes only when set (Outlook sizes images from the
  attributes only); the default `'0'` is gone.
- **Container:** `max-width` gets its `px` unit and is skipped when `disableDefaultStyle` is set.
- CSS processing errors keep the original error as `cause`.
- Dependencies: Angular 22.2, juice 12.2, termost 2, postcss plugins.

**═══════════════════ v1.5.0 — released 2026-08-24 ═══════════════════**

## [2026-08-24] — postcss-calc 11

**Type:** bugfix

### Changes

- `postcss-calc` peer moved to `^11`, which dropped the `preserve` option: the Tailwind `cssProcessor` now calls
  `calc()` without options.
- Dependencies: Angular 22.1.3+.

**═══════════════════ v1.4.0 — released 2026-08-11 ═══════════════════**

## [2026-08-11] — Angular 22.1 CSS variable namespace

**Type:** bugfix

### Changes

- Since Angular 22.1 every custom property in a component stylesheet is compiled to `--%NS%name`, a placeholder the
  browser renderer resolves. With the server renderer it leaked into the output, breaking every `var()`: the render
  pipeline now strips `--%NS%` from both HTML and CSS.
- Dependencies: Angular 22.1, Tailwind 4.3.3.

**═══════════════════ v1.3.0 — released 2026-06-18 ═══════════════════**

## [2026-06-18] — Angular 22

**Type:** chore

### Changes

- Peer and runtime dependencies moved to Angular 22, Tailwind 4.3.

**═══════════════════ v1.2.1 — released 2026-06-07 ═══════════════════**

## [2026-06-07] — CI release pipeline

**Type:** chore

### Changes

- `garronej/ts-ci` replaced by an in-repo script (`.github/scripts/check-version-upgraded.mjs`) that detects version
  bumps; the GitHub release is skipped when it already exists; `npm ci` instead of `npm install`;
  checkout/setup-node v5. Dependabot enabled.

**═══════════════════ v1.2.0 — released 2026-06-07 ═══════════════════**

## [2026-06-07] — Node 22.12+, html-to-text 10, juice 12

**Type:** chore

### Changes

- `engines.node` set to `>=22.12.0`.
- The CLI reads its version through `createRequire` instead of a JSON import attribute.
- Dependencies: html-to-text 10, juice 12, Angular 21.2.

**═══════════════════ v1.1.6 — released 2026-05-11 ═══════════════════**

## [2026-05-11] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed, no functional change.

**═══════════════════ v1.1.5 — released 2026-04-13 ═══════════════════**

## [2026-04-13] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed (Angular 21.2.8), no functional change.

**═══════════════════ v1.1.4 — released 2026-03-23 ═══════════════════**

## [2026-03-23] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed (Angular 21.2.5, Tailwind 4.2.2) and Dependabot security bumps (hono, tar, immutable,
  flatted), no functional change.

**═══════════════════ v1.1.3 — released 2026-02-28 ═══════════════════**

## [2026-02-28] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed (Angular 21.2, Tailwind 4.2) and Dependabot security bumps (qs, tar, hono), no functional
  change.

**═══════════════════ v1.1.2 — released 2026-01-20 ═══════════════════**

## [2026-01-20] — Plain text keeps heading case

**Type:** bugfix
**Ref:** https://github.com/keycloakify/angular-email/issues/15

### Changes

- `html-to-text` uppercased `h1`–`h6` in the plain text version: headings now keep their original case (same line
  breaks as before).
- Dependencies: Angular 21.1.

**═══════════════════ v1.1.1 — released 2026-01-15 ═══════════════════**

## [2026-01-15] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed, no functional change.

**═══════════════════ v1.1.0 — released 2025-12-22 ═══════════════════**

## [2025-12-22] — Angular 21

**Type:** chore

### Changes

- Peer and runtime dependencies moved to Angular 21, Tailwind 4.1.18.
- npm publishing through OIDC trusted publishing instead of an `NPM_TOKEN` secret.

**═══════════════════ v1.0.10 — released 2025-11-15 ═══════════════════**

## [2025-11-15] — CLI entry point split

**Type:** chore

### Changes

- The CLI is split into `bin/main.ts` (command definition, with shebang) and `bin/build.ts` (exported `build`
  function); the bin is now `bin/main.js` instead of `bin/build.mjs`.
- Development Node version moved to `lts/krypton` (24).

**═══════════════════ v1.0.9 — released 2025-10-17 ═══════════════════**

## [2025-10-17] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed, no functional change.

**═══════════════════ v1.0.8 — released 2025-10-13 ═══════════════════**

## [2025-10-13] — CSS variables resolved when inlining

**Type:** feat

### Changes

- juice now runs with `resolveCSSVariables: true`: `var(--x)` references are replaced by their values in the inlined
  styles, since most email clients do not support custom properties.

**═══════════════════ v1.0.7 — released 2025-10-13 ═══════════════════**

## [2025-10-13] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed, no functional change.

**═══════════════════ v1.0.6 — released 2025-09-25 ═══════════════════**

## [2025-09-25] — README: full Keycloakify example

**Type:** docs

### Changes

- README links the Keycloakify Angular email proof of concept and shows the `i18nSourceFile`,
  `environmentVariables` and `assetsDirPath` options of the Keycloakify plugin.

**═══════════════════ v1.0.5 — released 2025-09-18 ═══════════════════**

## [2025-09-18] — Dependency update

**Type:** chore

### Changes

- Dependencies refreshed, no functional change.

**═══════════════════ v1.0.4 — released 2025-09-11 ═══════════════════**

## [2025-09-11] — Angular 20.3 bootstrap context

**Type:** bugfix

### Changes

- Angular 20.3 server rendering passes a `BootstrapContext` to the bootstrap function: `render` now forwards it to
  `bootstrapApplication`.

**═══════════════════ v1.0.3 — released 2025-08-27 ═══════════════════**

## [2025-08-27] — CSS normalized before the cssProcessor

**Type:** bugfix

### Changes

- The `cssProcessor` received the raw extracted CSS: it now gets the normalized one again.

**═══════════════════ v1.0.2 — released 2025-08-27 ═══════════════════**

## [2025-08-27] — cssProcessor type

**Type:** bugfix

### Changes

- `RenderOptions.cssProcessor` type updated to the `(css, html)` signature introduced in 1.0.1.

**═══════════════════ v1.0.1 — released 2025-08-27 ═══════════════════**

## [2025-08-27] — Tailwind classes detected from the rendered HTML

**Type:** bugfix

### Changes

- **`cssProcessor(css, html)`**: the hook also receives the rendered HTML. The Tailwind processor collects every class
  used in it and feeds them to Tailwind through `@source inline(...)`, so utilities are generated even though there
  are no source files to scan.
- Selector unwrapping regex and cheerio loading fixed, which broke CSS under some markups.

**═══════════════════ v1.0.0 — released 2025-08-26 ═══════════════════**

## [2025-08-26] — Tailwind v4 and pluggable CSS processing

**Type:** feat (breaking)
**Ref:** https://github.com/keycloakify/angular-email/pull/3

### Changes

- **Tailwind v4 preset** in CSS (`@import '@keycloakify/angular-email/tailwindcss-preset-email'`), inspired by
  `@maizzle/tailwindcss`: email-safe theme (colors, spacing, text, borders, shadows, filters) and MSO utilities.
  The Tailwind v3 preset and the `tailwindConfig` option are removed.
- **`cssProcessor` hook** in the render options replaces the built-in Tailwind handling: any CSS transformation can be
  plugged in. The ready-made one is exported from `@keycloakify/angular-email/tailwindcss-preset-email/css-processor`
  (Tailwind v4 + postcss calc, custom properties, logical, preset-env).
- Tailwind and the postcss plugins become optional peer dependencies.
- **Externals**: the CLI takes `-o` (output dir) and `-e` (comma-separated packages to keep external in esbuild);
  `toHTML` takes `externals`. Only `juice` is external by default.
- `toHTML` and the CLI locate the bundled entry by its entry point instead of taking the first output.
- Compatibility: 1.x → Angular 20 + Tailwind 4; 0.x stays on Tailwind 3 with bugfixes only.

**═══════════════════ v0.0.8 — released 2025-08-25 ═══════════════════**

## [2025-08-25] — Build script reworked

**Type:** chore

### Changes

- The CLI is compiled by its own esbuild config; the `node` entry is emitted straight into `dist/angular-email/node`
  and declared in the package `exports` (`./node`, ESM + CJS + types).
- README: `tsconfig.json` example for the emails folder.

**═══════════════════ v0.0.7 — released 2025-07-24 ═══════════════════**

## [2025-07-24] — @angular/router allowed dependency

**Type:** bugfix

### Changes

- `@angular/router` added to ng-packagr's `allowedNonPeerDependencies`.

**═══════════════════ v0.0.6 — released 2025-07-24 ═══════════════════**

## [2025-07-24] — Missing @angular/router dependency

**Type:** bugfix

### Changes

- `@angular/router` added to the dependencies (required by `@angular/ssr`).

**═══════════════════ v0.0.5 — released 2025-07-24 ═══════════════════**

## [2025-07-24] — CLI renders templates sequentially

**Type:** bugfix

### Changes

- The CLI fired every template render from a `forEach(async …)` without awaiting them: templates are now rendered one
  after the other, so the command waits for all of them.

**═══════════════════ v0.0.4 — released 2025-07-14 ═══════════════════**

## [2025-07-14] — Angular 20

**Type:** chore

### Changes

- Peer and runtime dependencies moved to Angular 20; `@angular/ssr` added (`provideServerRendering` moved there),
  stable `provideZonelessChangeDetection`, `DOCUMENT` from `@angular/core`.
- README: Tailwind v4 not supported yet.

**═══════════════════ v0.0.3 — released 2025-04-03 ═══════════════════**

## [2025-04-03] — Tailwind v3 through an npm alias

**Type:** feat

### Changes

- Tailwind v3 is installed as `tailwindcss-v3` (`npm:tailwindcss@^3.4.17`), so it no longer clashes with a project
  that uses Tailwind v4.
- Container: no `max-width: undefinedpx` when `width` is not set.

**═══════════════════ v0.0.2 — released 2025-03-31 ═══════════════════**

## [2025-03-31] — ESM bundles and in-house Tailwind preset

**Type:** bugfix

### Changes

- `toHTML` and the CLI bundle templates as ESM (with code splitting) instead of CJS.
- Tailwind v3 email preset shipped by the library (`@keycloakify/angular-email/tailwindcss-preset-email`, based on
  `tailwindcss-preset-email`) instead of depending on the external package; `tailwindcss` becomes a peer dependency.

**═══════════════════ v0.0.1 — released 2025-03-31 ═══════════════════**

## [2025-03-31] — First release

**Type:** feat

### Changes

- First stable release, after 20 release candidates (`0.0.1-rc.1` → `rc.20`, February–March 2025).
- **Components**: `html`, `head`, `body`, `preview`, `container`, `section`, `row`, `column`, `heading`, `text`,
  `link`, `button` (with Outlook VML), `img`, `hr`, `background`, `color-scheme`, `conditional` (MSO comments) and
  `raw` (literal markup that survives Angular escaping).
- **Render pipeline**: Angular SSR (zoneless) with props passed through `setInput`, removal of non-HTML tags, CSS
  inlining with juice, optional pretty print, plain text version with html-to-text.
- **Tailwind v3** support through `tailwindcss-preset-email`.
- **Standalone rendering**: `toHTML` (`/node` entry) and the `keycloakify-angular-email build` CLI bundle templates
  with esbuild and the `angularEsbuildPlugin` (`/esbuild` entry).
