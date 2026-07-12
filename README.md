# Branden Immerzeel - Resume Website

A single-page portfolio and resume website with an interactive 3D scene, live at **[brandenimmerzeel.au](https://brandenimmerzeel.au)**.

The site presents Branden's profile, work experience timeline, skills, tech stack, projects, recommendations, and a contact form, all rendered around a scroll-driven 3D desk scene featuring a rigged avatar.

## Tech stack

### Frontend

| Layer | Technology |
| --- | --- |
| Framework | [Vue 3](https://vuejs.org/) with `<script setup>` single-file components |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict, checked via `vue-tsc`) |
| Build tool | [Vite](https://vite.dev/) |
| 3D rendering | [TresJS](https://tresjs.org/) (`@tresjs/core` + `@tresjs/cientos`) on top of [Three.js](https://threejs.org/) |
| Styling | Hand-written CSS (no framework), scoped per component |

### 3D pipeline

- The avatar and desk scene were modelled, sculpted, and rigged in **Blender** (source `.blend` files are kept out of git; only exported assets are committed).
- Models are exported as **GLB** and **Draco-compressed** to keep `DeskScene.glb` under GitHub's 100 MB file limit.
- The Draco decoder is self-hosted under `client/public/draco/` so there is no external CDN dependency.
- `ScrollyStage.vue` pins the 3D background to the viewport and maps scroll progress to a camera dolly, moving from a tight head/torso close-up in the hero to a full wide desk shot by the Skills section.

### Architecture

- **Static site, no backend.**
  The site originally shipped with an ASP.NET Core API, which was later removed once it added nothing over bundled data.
  All content (profile, experience, projects, recommendations) lives in `client/src/data/fallback.ts` as the single source of truth, and `useApi.ts` hands it to components in a consistent shape.
- **Contact form via `mailto:`.**
  With no server to post to, submitting the form opens the visitor's own mail client pre-filled with the message.

### Testing and quality

- **End-to-end tests** with [Playwright](https://playwright.dev/) under `client/e2e/`, one spec file per site capability (navigation, hero, contact, projects, content, mobile).
  Playwright starts the Vite dev server itself, and tests assert observable DOM behaviour rather than 3D pixels to stay fast and stable.
- **Linting** with ESLint (flat config) using `eslint-plugin-vue` and the Vue TypeScript config, run with `--max-warnings=0`.
- **Type checking** with `vue-tsc` as part of every production build.

### Hosting and deployment

- Hosted on [Vercel](https://vercel.com/) as a static build of `client/` (see `client/vercel.json`).
- SPA rewrites route every path to `index.html`.
- Branching model: day-to-day work happens on `develop`; `master` is the release branch that Vercel deploys to production.

## Process

The site is built with a **spec-driven workflow** using [OpenSpec](https://github.com/Fission-AI/OpenSpec):

1. Each site capability (hero section, experience timeline, projects showcase, mobile experience, and so on) has a living spec under `openspec/specs/`.
2. Changes start as OpenSpec proposals with design notes and task breakdowns under `openspec/changes/`.
3. Implementation follows the tasks, and each capability's Playwright spec file maps directly to its OpenSpec spec, so behaviour stays verifiable.
4. Completed changes are archived and their deltas synced back into the main specs.

Development is agent-assisted: the repo carries Claude Code project skills (`.claude/skills/`) that wrap the OpenSpec propose/apply/archive/sync workflow, and every changeset passes a quality gate (typecheck, lint, e2e tests) before it ships.

## Repository layout

```
client/            Vue 3 + Vite application (the whole deployed site)
  src/components/  Section components and the 3D scene
  src/data/        Bundled site content (source of truth)
  src/assets/      Draco-compressed GLB models
  public/          Static assets: resume PDF, images, icons, Draco decoder
  e2e/             Playwright end-to-end tests
openspec/          Specs, change proposals, and archive (spec-driven workflow)
```

## Getting started

Prerequisites: Node.js 20+.

```bash
cd client
npm install
npm run dev          # start the dev server at http://localhost:5173
```

Other commands (from `client/`):

```bash
npm run build        # type-check and build for production into dist/
npm run preview      # serve the production build locally
npm run lint         # ESLint, zero warnings allowed
npm run test:e2e     # Playwright suite (installs need: npx playwright install chromium)
```
