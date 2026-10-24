import { describe, expect, it } from 'vitest';
import { normalizeIngest, validateRights, orchestratePipelineEvent, toAgentEnvelope } from './index.js';

describe('api contracts', () => {
  it('normalizes ingest payloads', () => {
    const result = normalizeIngest({ source: 'nasa', topic: 'galaxies' });
    expect(result.source).toBe('nasa');
  });

  it('validates rights metadata', () => {
    expect(
      validateRights({
        sourceId: 'id',
        sourceUrl: 'https://example.com',
        licenseType: 'CC BY 4.0',
        creatorName: 'NASA',
        attributionText: 'Image courtesy of NASA',
      })
    ).toBe(true);
  });

  it('rejects incomplete rights metadata', () => {
    expect(
      validateRights({
        sourceId: '',
        sourceUrl: 'https://example.com',
        licenseType: 'CC BY 4.0',
        creatorName: 'NASA',
        attributionText: 'Image courtesy of NASA',
      })
    ).toBe(false);
  });

  it('orchestrates pipeline events', () => {
    const event = orchestratePipelineEvent('daily-cosmos-short', 'ingest');
    expect(event.pipeline).toBe('daily-cosmos-short');
    expect(event.step).toBe('ingest');
    expect(typeof event.correlationId).toBe('string');
    expect(typeof event.timestamp).toBe('string');
    expect(event.payload).toEqual({});
  });

  it('creates an agent envelope', () => {
    const rights = {
      sourceId: 'id',
      sourceUrl: 'https://example.com',
      licenseType: 'CC BY 4.0',
      creatorName: 'NASA',
      attributionText: 'Image courtesy of NASA',
    };
    const envelope = toAgentEnvelope('scriptwriter-agent', rights);
    expect(envelope.agent).toBe('scriptwriter-agent');
    expect(envelope.intent).toBe('execute');
    expect(envelope.rights).toEqual(rights);
    expect(envelope.payload).toEqual({});
  });
});
