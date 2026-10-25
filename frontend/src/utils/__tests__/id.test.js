import { describe, it, expect } from 'vitest';
import { uid } from '../id.js';

describe('Unique ID Generator (id.js)', () => {
  it('should generate a non-empty alphanumeric string ID', () => {
    const id = uid();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(5);
    expect(/^[a-z0-9]+$/i.test(id)).toBe(true);
  });

  it('should generate 1,000 distinct IDs without collision', () => {
    const set = new Set();
    for (let i = 0; i < 1000; i++) {
      const id = uid();
      expect(set.has(id)).toBe(false);
      set.add(id);
    }
    expect(set.size).toBe(1000);
  });
});
