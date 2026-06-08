import type { AgentEnvelope, PipelineEvent, RightsMetadata } from '@starlight-cosmos/schemas';

export interface IngestRequest {
  source: string;
  topic: string;
}

export interface NormalizedAsset {
  id: string;
  source: string;
  topic: string;
  normalizedAt: string;
}

export const normalizeIngest = (request: IngestRequest): NormalizedAsset => ({
  id: crypto.randomUUID(),
  source: request.source,
  topic: request.topic,
  normalizedAt: new Date().toISOString(),
});

export const validateRights = (rights: RightsMetadata): boolean =>
  [rights.sourceId, rights.sourceUrl, rights.licenseType, rights.creatorName, rights.attributionText].every(Boolean);

export const orchestratePipelineEvent = (pipeline: string, step: string): PipelineEvent => ({
  pipeline,
  step,
  correlationId: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  payload: {},
});

export const toAgentEnvelope = (agent: string, rights: RightsMetadata): AgentEnvelope => ({
  agent,
  intent: 'execute',
  payload: {},
  rights,
});
