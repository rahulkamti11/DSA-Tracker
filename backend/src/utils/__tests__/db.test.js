import { describe, it, expect } from 'vitest';
import { today, addDays, formatProblem } from '../db.js';

describe('Backend DB Utilities (db.js)', () => {
  it('today should return current ISO date string', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('addDays should compute offsets correctly', () => {
    expect(addDays('2026-05-10', 5)).toBe('2026-05-15');
    expect(addDays('2026-05-31', 1)).toBe('2026-06-01');
  });

  it('formatProblem should hydrate SQLite database problem row into client structure', () => {
    const rawDbRow = {
      id: 'prob-101',
      user_id: 'user-001',
      name: 'Valid Anagram',
      diff: 'Easy',
      status: 'Solved',
      coll_id: 'blind75',
      starred: 1,
      notes: 'Use frequency array',
      code: 'class Solution {}',
      language: 'cpp',
      date: '2026-10-20',
      interval: 3,
      next_rev: '2026-10-23',
      rev_count: 2,
      no_rep: 0,
      last_reviewed: '2026-10-20',
      solved_date: '2026-10-20',
      mastered_date: null,
      is_deleted: 0,
      del_date: null,
      created_at: '2026-10-20T10:00:00Z',
      updated_at: '2026-10-20T10:00:00Z',
    };

    const tags = ['String', 'Hash Table'];
    const platforms = [{ platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram/' }];

    const formatted = formatProblem(rawDbRow, tags, platforms);

    expect(formatted.id).toBe('prob-101');
    expect(formatted.userId).toBe('user-001');
    expect(formatted.name).toBe('Valid Anagram');
    expect(formatted.starred).toBe(true);
    expect(formatted.noRep).toBe(false);
    expect(formatted.isDeleted).toBe(false);
    expect(formatted.tags).toEqual(['String', 'Hash Table']);
    expect(formatted.platforms).toEqual(platforms);
  });
});
