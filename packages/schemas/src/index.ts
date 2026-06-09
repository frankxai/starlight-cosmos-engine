export type ContentStatus = 'draft' | 'approved' | 'rendered' | 'published';

export interface RightsMetadata {
  sourceId: string;
  sourceUrl: string;
  licenseType: string;
  creatorName: string;
  attributionText: string;
}

export interface PipelineEvent<TPayload = Record<string, unknown>> {
  pipeline: string;
  step: string;
  correlationId: string;
  timestamp: string;
  payload: TPayload;
}

export interface AgentEnvelope<TPayload = Record<string, unknown>> {
  agent: string;
  intent: string;
  payload: TPayload;
  rights: RightsMetadata;
}
