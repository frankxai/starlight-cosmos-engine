import { describe, expect, it } from 'vitest';
import { isPublishableProvenance, normalizeIngest, validateRights } from './index.js';

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

  it('requires evidence for historical claims', () => {
    expect(
      isPublishableProvenance({
        classification: 'historical-source-claim',
        claimIds: [],
        sourceIds: [],
        fictionBoundary: false,
        humanApproved: true,
      })
    ).toBe(false);
  });

  it('requires a visible fiction boundary and human approval', () => {
    expect(
      isPublishableProvenance({
        classification: 'arcanea-fiction',
        claimIds: [],
        sourceIds: [],
        fictionBoundary: true,
        humanApproved: true,
      })
    ).toBe(true);

    expect(
      isPublishableProvenance({
        classification: 'arcanea-fiction',
        claimIds: [],
        sourceIds: [],
        fictionBoundary: false,
        humanApproved: true,
      })
    ).toBe(false);
  });
});
