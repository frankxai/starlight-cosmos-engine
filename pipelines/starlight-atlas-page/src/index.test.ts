import { describe, expect, it } from 'vitest';
import { moduleId, purpose } from './index.js';

describe('starlight-atlas-page pipeline scaffold', () => {
  it('exposes stable module metadata', () => {
    expect(moduleId).toBe('@starlight-cosmos/starlight-atlas-page');
    expect(purpose).toContain('starlight-atlas-page');
  });
});
