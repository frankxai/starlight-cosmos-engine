import { describe, expect, it } from 'vitest';
import { normalizeIngest, validateRights } from './index.js';

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
});
