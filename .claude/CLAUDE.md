# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

`@keycloakify/angular-email` is a library for authoring **HTML emails as Angular components**, inspired by [jsx-email](https://github.com/shellscape/jsx-email)/react-email. You write Angular standalone components, and the library renders them to email-client-safe HTML (with inlined CSS) or plain text using Angular's server-side rendering. It is primarily used to build Keycloak email themes via [keycloakify-emails](https://github.com/keycloakify/keycloakify).

The repo is an Angular CLI **workspace** containing two projects:

- `projects/angular-email/` — the published library (component primitives + render pipeline + CLI + esbuild plugin).
- `projects/showcase/emails/` — example email components used as render fixtures (not a served app; not registered in `angular.json`).

## Commands

```sh
npm run build          # full library build → dist/angular-email (see scripts/build.sh)
npm run watch          # ng build --watch of the library only
npm run lint           # ng lint --fix (angular-eslint, scoped to the library project)
npm run format         # prettier --write across **/*.{ts,html,json,md}
npm run render:test    # render showcase/emails → dist/emails using the local CLI
npm run release        # version bump + changelog + tag (main branch only; see scripts/release.sh)
```

There is **no unit-test setup** in this repo. "Testing" a change means rendering email components and inspecting the HTML output (`npm run render:test`, or the `toHTML`/`render` APIs).

`scripts/refresh-lib.sh` rebuilds the library and reinstalls it as a local `file:` dependency — use it to iterate on the library while consuming it from the workspace root.

## Build Pipeline (why `build` is a shell script, not one command)

`scripts/build.sh` runs four steps because the package has several distinct entry shapes that need different bundlers:

1. `ng build angular-email` — ng-packagr builds the Angular component library (`src/index.ts`) into `dist/angular-email`. CSS assets under `tailwindcss-preset-email/` and the `LICENSE.md`/`README.md` are copied as assets (see `ng-package.json`).
2. `bin/esbuild.config.js` — esbuild-transpiles the CLI (`bin/*.ts`) → `dist/angular-email/bin`.
3. `node/esbuild.config.js` — bundles the standalone `node` entry (`node/index.ts`) to **both** ESM (`index.js`) and CJS (`index.cjs`).
4. `tsc` over `node/tsconfig.json` — emits `.d.ts` types for the `node` entry.

The published package's subpath exports are declared in `projects/angular-email/package.json` `exports`/`bin`:
- main entry → the component library
- `/node` → `toHTML` standalone renderer
- `/esbuild` → `angularEsbuildPlugin` (separate ng-packagr secondary entry under `esbuild/`)
- `/tailwindcss-preset-email` and `/tailwindcss-preset-email/css-processor` → Tailwind v4 email preset CSS + a PostCSS processor

## Rendering Architecture

The core is `projects/angular-email/src/lib/render.ts`. The `render()` pipeline:

1. **Bootstrap + SSR** (`renderNgComponent`): bootstraps the component with `provideZonelessChangeDetection()` + `provideServerRendering()`, injects `props` via `componentRef.setInput()` (honoring `signalInputsPrefix`, e.g. `$`), and renders to HTML via `@angular/platform-server`'s `renderApplication` into a `<selector></selector>` document. `<style>` tag contents are extracted here.
2. **Normalize** (`normalizeNgHtml`): strips the wrapper selector and removes any non-standard tag not in the `HTMLElements` allowlist (`utils.ts`) — this is how Angular-internal/component-selector markup is dropped while keeping real HTML + MSO/Outlook tags (`o:OfficeDocumentSettings`, `angular-email-raw`, etc.).
3. **Transform** (`applyHtmlTransformations`): collapses whitespace and expands `[data-html]` placeholder elements into raw markup.
4. **CSS**: extracted `<style>` CSS is normalized and optionally run through `options.cssProcessor` (the Tailwind preset's `cssProcessor` does Tailwind v4 compilation + PostCSS: custom-properties, calc, logical, preset-env, and inlining/removal of `--tw-*` vars).
5. **Inline** (`inlineCss`): `juice` inlines the CSS into element `style=` attributes; `pretty` optionally formats. For plain text, `html-to-text` is used instead, skipping images/preview and special-casing `angular-email-raw`.

Notable cross-cutting detail: HTML entity juggling (`&lt;`/`&gt;`/`&#x24;`) and the **raw component escaping** (`escapeForRawComponent`/`unescapeForRawComponent` in `utils.ts`) exist so that literal markup and MSO conditional comments survive Angular's escaping and juice's processing. When editing the render/transform regexes, preserve these round-trips.

## Component Conventions

Library primitives live in `src/lib/components/<name>/`, exported from `src/index.ts`. Follow the existing pattern when adding/editing one:

- Standalone components, `selector: 'ng-email-*'`, `changeDetection: ChangeDetectionStrategy.OnPush`.
- Inputs use **signal inputs with `$`-prefixed property names and a clean `alias`**: `$href = input<string>(undefined, { alias: 'href' })`. The `$` prefix is convention (and ties into `signalInputsPrefix`); the alias is the public input name.
- Email components that ship styles use `encapsulation: ViewEncapsulation.None` so CSS lands in a global `<style>` the pipeline can extract (see `projects/showcase/emails/app/app.component.ts`).
- Outlook/MSO support is hand-authored as conditional-comment HTML inside `computed()` strings (see `button.component.ts`'s VML `v:roundrect`).

## Standalone / CLI Rendering

- **CLI** (`bin/main.ts` via `termost`): `keycloakify-angular-email build -p <emailsDir> -o <outDir> -e <externals>`. `bin/build.ts` esbuild-bundles each `*.ts` template (using `angularEsbuildPlugin`), dynamically imports it, and calls its exported `renderToHtml()`, writing `<name>.html` per template. `juice` is always marked external; pass other CSS-processing packages via `-e`.
- **Programmatic** (`node/index.ts`): `toHTML({ filePath, props, externals })` does the same bundle-then-import for a single component file and returns the HTML string. Use this for dynamic props / server environments.

## Decision Protocol

When analysis reveals multiple valid implementation approaches, always stop and present the options clearly before writing any code. Wait for explicit confirmation of which approach to take. Never pick one unilaterally.

@AGENTS.md
