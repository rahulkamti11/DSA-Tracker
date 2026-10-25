import { describe, it, expect } from 'vitest';
import { today, addDays, formatDate } from '../date.js';

describe('Date Utilities (date.js)', () => {
  it('today() should return a valid YYYY-MM-DD formatted date string', () => {
    const res = today();
    expect(res).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const dateObj = new Date(res);
    expect(isNaN(dateObj.getTime())).toBe(false);
  });

  it('addDays() should correctly add positive days', () => {
    const base = '2026-10-23';
    expect(addDays(base, 3)).toBe('2026-10-26');
    expect(addDays(base, 7)).toBe('2026-10-30');
  });

  it('addDays() should correctly handle month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('addDays() should correctly subtract days with negative values', () => {
    expect(addDays('2026-10-23', -5)).toBe('2026-10-18');
  });

  it('formatDate() should return empty string if date is null/undefined', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('formatDate() should format valid date strings into human-readable format', () => {
    const formatted = formatDate('2026-10-23');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('23');
  });
});
