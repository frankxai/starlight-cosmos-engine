# Repository Instructions

This repo is part of the FrankX / Starlight / Arcanea agent estate.

## Classification

- Repo: starlight-cosmos-engine
- Class: agent-substrate
- Default health command: `npm run build`
- Remote: https://github.com/frankxai/starlight-cosmos-engine.git

## What This Repo Is

An npm-workspaces monorepo scaffold for a cosmos-content production system (space imagery/research
into published stories via an agent + pipeline pipeline). Six layers: `apps/` (api, mission-control,
web-atlas), `agents/` (event-driven workers), `mcp-servers/` (external capability adapters),
`skills/`, `pipelines/` (declarative DAGs), and shared `packages/` (contracts, infra).

**Honest status (see `README.md` "What's actually implemented"):** only `packages/schemas` and
`apps/api` have real logic today; everything else under `agents/`, `mcp-servers/`, `pipelines/`,
`skills/`, and most of `packages/` is intentional stub scaffolding (`moduleId` + `purpose` export
only). Do not assume a module works because the folder exists — check `README.md`'s verified-state
table before building on top of any layer.

## Real Commands

CI (`.github/workflows/ci.yml`) runs: install -> lint -> typecheck -> test -> build, all via npm
workspaces (this repo uses npm, not pnpm — respect the existing lockfile/tooling rather than
introducing pnpm here).

- `npm run build` — builds all workspaces (primary health check)
- `npm run lint`, `npm run typecheck`, `npm test` — see root `package.json` for exact workspace scripts

## Agent Rules

- Read this file before making changes.
- Preserve existing user work and unrelated dirty files.
- Keep edits scoped to the requested task.
- Prefer existing repo conventions over new abstractions.
- Run the health command before handoff when feasible.
- Do not publish secrets, private memory, credentials, or internal-only strategy.
- Follow `docs/ontology-and-provenance-boundary.md`: classify substantial claims and never collapse Starlight, real traditions, science, and Arcanea fiction.\n- Follow `docs/architecture.md` layer boundaries: rights/attribution checks are mandatory gates,
  every pipeline stage emits an auditable event, human approval gates sit in front of high-risk
  publishing actions.

## Class-Specific Guidance

- This is agent-substrate: changes here affect how other agents/pipelines are expected to run.
- When filling in a stub module, update the README's verified-state table in the same change —
  do not let the "honest status" claims drift from actual code.
- See `docs/roadmap.md` for phase sequencing before adding new layers/modules.

## Handoff

Summarize changed files, validation run, risks, and any follow-up needed.

## Design Taste Kernel

For any site, app, landing page, dashboard, visual identity, brand, motion, media, social, or frontend task, apply the shared Design Taste Kernel before handoff:

- C:\Users\frank\starlight\repos\DESIGN_TASTE.md
- C:\Users\frank\starlight\repos\WEB_EXPERIENCE_STANDARD.md
- C:\Users\frank\starlight\repos\MOTION_TASTE_RUBRIC.md
- C:\Users\frank\starlight\repos\MULTI_AGENT_DESIGN_COUNCIL.md
- C:\Users\frank\starlight\repos\VISUAL_QA_GATE.md

When motion, scroll, generated media, GIF/video, or premium polish matters, route through the Motion Design Studio plugin/skills and verify the result visually.
