import { describe, it, expect } from 'vitest';
import { getPlatformInfo, getRealUrl } from '../platform.js';

describe('Platform Utilities (platform.js)', () => {
  it('getPlatformInfo should return correct metadata for standard platforms', () => {
    const lc = getPlatformInfo('LeetCode');
    expect(lc.short).toBe('LC');
    expect(lc.dot).toContain('amber');

    const gfg = getPlatformInfo('GFG');
    expect(gfg.short).toBe('GFG');
    expect(gfg.dot).toContain('emerald');

    const cf = getPlatformInfo('Codeforces');
    expect(cf.short).toBe('CF');
  });

  it('getPlatformInfo should fallback gracefully for unknown platforms', () => {
    const custom = getPlatformInfo('CustomPlatform');
    expect(custom.short).toBe('CU');
    expect(custom.dot).toBe('bg-slate-400');
  });

  it('getRealUrl should return currentUrl if valid and non-placeholder', () => {
    const customUrl = 'https://custom-oj.org/problem/123';
    expect(getRealUrl('Any Name', 'LeetCode', customUrl)).toBe(customUrl);
  });

  it('getRealUrl should return preconfigured seed URLs for well-known problems', () => {
    const twoSumUrl = getRealUrl('Two Sum', 'LeetCode', '');
    expect(twoSumUrl).toBe('https://leetcode.com/problems/two-sum/');

    const islandsGfgUrl = getRealUrl('Number of Islands', 'GFG', '#');
    expect(islandsGfgUrl).toBe('https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1');
  });

  it('getRealUrl should generate slugified LeetCode URLs for arbitrary problems', () => {
    const dynamicUrl = getRealUrl('Trapping Rain Water II', 'LeetCode', '');
    expect(dynamicUrl).toBe('https://leetcode.com/problems/trapping-rain-water-ii/');
  });

  it('getRealUrl should return Google search fallback for non-LeetCode unmapped problems', () => {
    const searchUrl = getRealUrl('Strange Problem', 'CodeChef', '');
    expect(searchUrl).toContain('https://www.google.com/search?q=Strange%20Problem%20CodeChef');
  });
});
