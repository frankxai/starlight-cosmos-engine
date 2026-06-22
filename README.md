# starlight-cosmos-engine

Monorepo foundation for Starlight Cosmos production systems.

> **STATUS: SCAFFOLD (v0).** The monorepo structure, tooling, and package contracts below are real and wired. The implementations inside `apps/`, `agents/`, `mcp-servers/`, `skills/`, and `pipelines/` are mostly empty stubs. Nothing here is production-deployed yet — treat this as a foundation to build on, not a working system.

## Structure
- `apps/` — web-atlas, mission-control, api
- `agents/` — orchestration and specialist workers
- `mcp-servers/` — external capability adapters
- `skills/` — reusable production recipes
- `pipelines/` — declarative DAG workflows
- `packages/` — shared config/contracts/infra utilities
- `content/` — drafts, approved outputs, renders, rights ledger, metadata
- `docs/` — architecture and governance docs

## Getting started
1. `npm install`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`
