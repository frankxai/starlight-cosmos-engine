import { describe, expect, it } from 'vitest';
import { moduleId, purpose } from './index.js';

describe('research-digest pipeline scaffold', () => {
  it('exposes stable module metadata', () => {
    expect(moduleId).toBe('@starlight-cosmos/research-digest');
    expect(purpose).toContain('research-digest');
  });
});
