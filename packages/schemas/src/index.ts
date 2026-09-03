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


export type ProvenanceClass =
  | 'historical-source-claim'
  | 'scholarly-interpretation'
  | 'starlight-interpretation'
  | 'original-starlight-philosophy'
  | 'original-literary-mythic-material'
  | 'arcanea-fiction'
  | 'mixed';

export interface ContentProvenance {
  classification: ProvenanceClass;
  claimIds: string[];
  sourceIds: string[];
  fictionBoundary: boolean;
  humanApproved: boolean;
  canonVersion?: string;
}
