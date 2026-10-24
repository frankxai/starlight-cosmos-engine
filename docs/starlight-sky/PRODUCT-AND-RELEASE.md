# Starlight Sky — first product contract

**Status:** proposed vertical and locally testable sky geometry, not a deployed app. 26 September 2026.

## Decision

Build a consumer observer experience whose loop is **point → identify → ask → explore → retain**. Its scientific positions are computed; AI interprets sourced evidence. The first release follows the Moon from the user's sky to a model of a viable lunar habitat. “Starlight Sky” is a working name: SIS already uses “Starlight Explorer” for an unrelated deployment experience.

The Cosmos Engine remains the source-ingestion, attribution, and scientific-content production authority. `apps/api/src/sky.ts` begins an app-facing, deterministic geometry boundary here; do not turn the entire content-production scaffold into a mobile runtime by implication. Before a mobile build, decide whether the client belongs in the existing Web Atlas app or another registered product repository, and record the repository/domain owner in the portfolio registry. SIS owns agent capability, evidence and memory contracts; Knowledge Tree owns public capability relationships; Academy owns mission presentation. No private SIS vault data enters a public Cosmos build.

## Who and what

- **Primary audience:** curious adults who repeatedly observe the sky and want an accurate, personal guide.
- **First buyer hypothesis:** astronomy clubs, observatories, and premium experience venues for guided group sessions. Validate pricing with real buyers; do not infer demand from downloads.
- **First session:** permission rationale; sky orientation; tap Moon or one of a bounded set of bright targets; ask one question; see the claim and source; open one short habitat simulation; save or export an observation without requiring an account.
- **Return value:** tonight's recommended target and the next question that follows the user's prior observation, with explicit opt-in memory and deletion/export controls.
- **Non-goals for the first release:** arbitrary star-image recognition, high-precision astrometry, telescope control, asteroid extraction valuations, hosted autonomous science agents, headset store release, medical or financial advice, credential issuance, and launch or flight software.

## Current evidence

On main at `12e1be25a7a471a226c32c0b04ad6c8ac7ad44aa`, Cosmos has implemented `packages/schemas` and `apps/api` ingestion/rights primitives. `apps/web-atlas`, specialist agents, MCP adapters, and pipelines are stubs. Draft PR #6 adds provenance classifications but is not merged. This first PR adds `apps/api/src/sky.ts` and a synthetic geometry test; it does not claim a real catalog, mobile sensor adapter, or measured outdoor accuracy. The existing content roadmap remains intact; the first observation vertical is an additional product proposal, not a silent rewrite of that roadmap.

## Boundary and data contract

1. The phone supplies UTC time, approximate latitude/longitude, device orientation, estimated uncertainty, and center selection radius. Location permission denial falls back to a manually chosen city; camera denial keeps a map-only mode; sensor absence keeps searchable catalog mode. No raw video or exact location is uploaded by default.
2. The geometry module converts **versioned fixed equatorial targets** to topocentric horizontal directions with approximate mean sidereal time, or accepts **moving targets** with already computed horizontal positions from a versioned ephemeris adapter. The current calculation ignores precession, nutation, proper motion, parallax and refraction. Those limits and catalog epoch must be addressed before accuracy claims.
3. Resolution returns a ranked target list and one of `matched`, `ambiguous`, `out-of-field`, `needs-calibration`, `no-candidates`. A match is a geometric candidate, never proof that camera pixels contain the object. The UI exposes ambiguous candidates and the current accuracy state; it never silently chooses a nearby object.
4. Object facts are separate records: `object_id`, `claim_id`, source URL/identifier, source revision/date, evidence class, uncertainty and usage rights. Versioned catalog and ephemeris adapters own their scientific license and attribution. The existing `RightsMetadata` is necessary for publishable media but does not by itself establish scientific accuracy; PR #6's provenance gate should be reconciled before publishing research claims.
5. Conversation tool calls use stable object IDs and versions (`resolve_sky_target`, `get_object_evidence`, `run_lunar_habitat_model`, `save_observation`). A guide can paraphrase approved claims and declare unknowns; it cannot write new scientific facts to the catalog. Long-form content preparation uses bounded specialist agents and human scientific review.
6. Observation memory is user-owned and off by default beyond local session state. An export includes time, coarse or optional location, object ID, content revisions, user note and simulation parameters. Private SIS memory integration waits for an authenticated, consented projection; public teaching content has no route back to a private vault.

## Release sequence and ownership

| Gate                          | Time with founder + two focused builders | Owner                  | Result and exit test                                                                                                                                                                                                                                           |
| ----------------------------- | ---------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0: geometry + contract       | Week 1                                   | Engineering            | This module passes tests, its uncertainty and limitations are documented, and one repo/product owner is recorded.                                                                                                                                              |
| G1: outdoor interaction spike | Weeks 1–3                                | Mobile/graphics        | Two physical Android models and three viewing locations; night-use controls, permission fallbacks, synthetic replay, calibration logging. Compare selected targets to independently computed positions. No public accuracy claim until residuals are measured. |
| G2: complete Moon journey     | Weeks 3–6                                | Experience + science   | From real pointing to source-backed explanation, one inspectable habitat model, and portable observation; test at 360px and large screens, with reduced motion, screen reader, and offline fallback.                                                           |
| G3: paid beta                 | Weeks 7–12                               | Product + full stack   | Bounded assistant, five reviewed journeys, support, billing, crash/cost telemetry, deletion/export, and store closed test where required. Inspect 30 observed sessions and seek ten paying individuals plus two paid venue pilots before scaling scope.        |
| G4: extensions                | Months 4–9                               | Separate domain owners | Academy missions, mineral spectroscopy, then one funded XR pilot; biology, fusion, and industrial intelligence each need expert review and a buyer or learning outcome.                                                                                        |

These durations are capacity estimates. A solo founder without another experienced builder should plan 4–6 months for G3. G0 has no design or store release claim.

## Design and performance contract

The first frame is the actual sky, not a feature dashboard. One primary target marker, a restrained horizon, highly legible labels, a quiet “ask” affordance, and a compact evidence drawer. Use a true night palette with optional red preservation mode. Distinct visual states communicate computed observation, archival image, simulation, and imagined future; transitions never imply a photograph of an unobserved planet. Avoid a decorative constellation mesh obscuring objects.

Design tokens, typography, motion, and imagery must be recorded against the shared Design Taste Kernel before the UI PR; its locally referenced files are not available in this repo checkout. The mobile owner must acquire them from the canonical design authority before sign-off, not invent a replacement. Support larger text, contrast, one-hand reach, haptic feedback without relying on it, reduced motion, explicit audio control, loading/error/recovery, and outdoor glare. Establish budgets in the device spike: target immediate local label response, 60 fps during panning on agreed test devices, and measured cold start, battery drain, sensor accuracy and download size. Record actual measurements and regressions rather than claiming a score from desktop emulation.

## Agent operating contract

One human product authority accepts scope, scientific claims, price and public release. Agent tasks have a bounded branch, file ownership, input revision, budget, tests and stop condition. The first five responsibilities are:

| Lane                 | Owns                                         | Must demonstrate                                                                                      |
| -------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Astronomy engineer   | Catalog epoch, geometry, ephemeris adapter   | Reference cases, uncertainty analysis, polar/longitude/date boundaries                                |
| Mobile engineer      | Sensor fusion, calibration, offline behavior | Physical-device video and logged residuals with location redacted                                     |
| Experience designer  | First-session comprehension and night UI     | Real screenshots, touch/keyboard/a11y review, qualitative sessions                                    |
| Evidence editor      | Five claims and licensed media               | Source revisions, rights, scientific reviewer disposition                                             |
| Adversarial reviewer | Cross-lane claims and failure states         | Tries to elicit fabricated coordinates and tests denied permissions, stale data and ambiguous matches |

Require CI green on the exact commit, one independent review, and a short release receipt: revision, devices, data sources, measured accuracy, UX evidence, runtime and inference cost, risks, rollback. Tokens are budgeted by deliverable and accepted tests; a high token count is not a quality signal. A proposed G0–G3 cumulative envelope is 20–50M development tokens, recalculated after G1; it is not a commitment to spend. At most two implementation lanes should change the same runtime concurrently. Agents may prepare research and variants, but claim publication, pricing, partner contact, spending and release use the normal human-governed gates.

## Rollout and recovery

Keep the pure geometry library reversible and additive. Version the catalog and ephemeris separately. A bad data release rolls back to its last reviewed version without changing app code. Failed sensor checks fall back to a searchable map, and an unavailable guide leaves local identification and cached source cards usable. AI outages never affect deterministic pointing. Log aggregate orientation-error and crash metrics without retaining exact observer locations. Store the last successful content revision locally and report staleness. Promotions go from local → preview → closed device beta → production only with exact-revision evidence.

## Decisions before G1

- Name and repository/product authority: “Starlight Sky” remains provisional; avoid conflict with SIS's already deployed “Starlight Explorer” name.
- Select and license a small bright-object catalog; record epoch, magnitude definition, update cadence, usage rights, and a reference ephemeris for moving bodies.
- Resolve draft Cosmos #6's provenance dependency and the portfolio registry's conflicting orchestration authority before cross-repo production integration. Neither blocks the pure geometry spike.
- Choose physical test devices, then establish honest sensor accuracy and performance budgets from measurements.
