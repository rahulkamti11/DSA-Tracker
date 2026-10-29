import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useData from '../useData.js';

vi.mock('../../services/problems.service.js', () => ({
  fetchProblems: vi.fn().mockResolvedValue([]),
  fetchTrash: vi.fn().mockResolvedValue([]),
  mapProblem: vi.fn((p) => p),
  createProblem: vi.fn().mockResolvedValue({}),
  updateProblem: vi.fn().mockResolvedValue({}),
  updateProblemTrash: vi.fn().mockResolvedValue({}),
  deleteProblemPermanently: vi.fn().mockResolvedValue({}),
  emptyTrash: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/collections.service.js', () => ({
  fetchCollections: vi.fn().mockResolvedValue([]),
  createCollection: vi.fn().mockResolvedValue({}),
  deleteCollection: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../services/auth.service.js', () => ({
  fetchProfile: vi.fn().mockResolvedValue({}),
  logActivity: vi.fn().mockResolvedValue({}),
}));

describe('useData Hook', () => {
  const guestUser = { username: 'guest', isGuest: true, token: null };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty collections and empty problems list', () => {
    const { result } = renderHook(() => useData(guestUser));
    expect(result.current.problems).toEqual([]);
    expect(result.current.collections).toEqual([]);
    expect(result.current.trash).toEqual([]);
  });

  it('saveProblem should create a problem and persist to scoped localStorage', async () => {
    const { result } = renderHook(() => useData(guestUser));

    await act(async () => {
      await result.current.saveProblem({
        name: 'Invert Binary Tree',
        diff: 'Easy',
        status: 'Solved',
        tags: 'Tree, Recursion',
        platforms: [{ platform: 'LeetCode', url: 'https://leetcode.com/problems/invert-binary-tree/' }],
        reminderInDays: 3,
      });
    });

    expect(result.current.problems.length).toBe(1);
    expect(result.current.problems[0].name).toBe('Invert Binary Tree');
    expect(result.current.problems[0].diff).toBe('Easy');
    expect(result.current.problems[0].tags).toEqual(['Tree', 'Recursion']);

    const cached = JSON.parse(localStorage.getItem('dsa_local_problems_guest'));
    expect(cached.length).toBe(1);
    expect(cached[0].name).toBe('Invert Binary Tree');
  });

  it('deleteProblem should soft-delete problem and move to trash', async () => {
    const { result } = renderHook(() => useData(guestUser));

    await act(async () => {
      await result.current.saveProblem({
        name: 'Course Schedule',
        diff: 'Medium',
        status: 'Solved',
      });
    });

    const problemId = result.current.problems[0].id;

    await act(async () => {
      await result.current.deleteProblem(problemId);
    });

    expect(result.current.problems.length).toBe(0);
    expect(result.current.trash.length).toBe(1);
    expect(result.current.trash[0].name).toBe('Course Schedule');
  });

  it('restoreProblem should move problem from trash back to active list', async () => {
    const { result } = renderHook(() => useData(guestUser));

    await act(async () => {
      await result.current.saveProblem({
        name: 'Subsets',
        diff: 'Medium',
      });
    });

    const problemId = result.current.problems[0].id;
    await act(async () => {
      await result.current.deleteProblem(problemId);
    });

    expect(result.current.trash.length).toBe(1);

    await act(async () => {
      await result.current.restoreProblem(problemId);
    });

    expect(result.current.trash.length).toBe(0);
    expect(result.current.problems.length).toBe(1);
    expect(result.current.problems[0].name).toBe('Subsets');
  });

  it('toggleStar should toggle starred flag on problem', async () => {
    const { result } = renderHook(() => useData(guestUser));

    await act(async () => {
      await result.current.saveProblem({
        name: 'Climbing Stairs',
        diff: 'Easy',
        starred: false,
      });
    });

    const problemId = result.current.problems[0].id;
    expect(result.current.problems[0].starred).toBe(false);

    await act(async () => {
      await result.current.toggleStar(problemId);
    });

    expect(result.current.problems[0].starred).toBe(true);
  });

  it('addCollection and deleteCollection should manage custom collections and detach problems', async () => {
    const { result } = renderHook(() => useData(guestUser));

    let createdColl;
    await act(async () => {
      createdColl = await result.current.addCollection('Blind 75', 'Essential patterns', 'indigo');
    });

    expect(result.current.collections.some((c) => c.name === 'Blind 75')).toBe(true);

    // Save problem in this collection
    await act(async () => {
      await result.current.saveProblem({
        name: '3Sum',
        collId: createdColl.id,
      });
    });

    expect(result.current.problems[0].collId).toBe(createdColl.id);

    // Delete collection
    await act(async () => {
      await result.current.deleteCollection(createdColl.id);
    });

    expect(result.current.collections.some((c) => c.id === createdColl.id)).toBe(false);
    expect(result.current.problems[0].collId).toBe('');
  });
});
