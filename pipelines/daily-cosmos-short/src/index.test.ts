import { describe, expect, it } from 'vitest';
import { moduleId, purpose } from './index.js';

describe('daily-cosmos-short pipeline scaffold', () => {
  it('exposes stable module metadata', () => {
    expect(moduleId).toBe('@starlight-cosmos/daily-cosmos-short');
    expect(purpose).toContain('daily-cosmos-short');
  });
});
