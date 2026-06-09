# Architecture

The Starlight Cosmos Engine is a workspace monorepo with six layers: apps, agents, MCP servers, skills, pipelines, and shared packages.

## Runtime domains
- **Apps**: API backbone, mission-control approvals, and web-atlas publishing surface.
- **Agents**: Event-driven workers coordinated by Hermes orchestration.
- **MCP servers**: External capability adapters with audit-focused boundaries.
- **Skills**: Reusable recipes that compose agents and MCP servers.
- **Pipelines**: Declarative DAGs that execute production workflows.
- **Content**: Artifact and metadata storage boundaries.

## Core principles
1. Rights and attribution checks are mandatory gates.
2. Every pipeline stage emits auditable events.
3. Human approval gates exist for high-risk publishing actions.
