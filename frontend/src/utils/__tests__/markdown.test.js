import { describe, it, expect } from 'vitest';
import { parseMd } from '../markdown.js';

describe('Markdown Parser (markdown.js)', () => {
  it('should return empty string for empty input', () => {
    expect(parseMd('')).toBe('');
    expect(parseMd(null)).toBe('');
    expect(parseMd(undefined)).toBe('');
  });

  it('should sanitize HTML tags against XSS vulnerabilities', () => {
    const malicious = '<script>alert("hacked")</script><img src="x" onerror="evil()"/>';
    const parsed = parseMd(malicious);
    expect(parsed).not.toContain('<script>');
    expect(parsed).toContain('&lt;script&gt;');
    expect(parsed).toContain('&lt;img');
  });

  it('should format bold and italic text', () => {
    const input = 'This is **bold text** and *italic text*';
    const parsed = parseMd(input);
    expect(parsed).toContain('<strong class="font-bold text-slate-900 dark:text-slate-100">bold text</strong>');
    expect(parsed).toContain('<em>italic text</em>');
  });

  it('should format code blocks and inline code', () => {
    const input = 'Use `const a = 1;` or:\n```\nfunction test() {}\n```';
    const parsed = parseMd(input);
    expect(parsed).toContain('<code');
    expect(parsed).toContain('const a = 1;');
    expect(parsed).toContain('<pre');
    expect(parsed).toContain('function test() {}');
  });

  it('should format markdown lists and newlines', () => {
    const input = '- Item 1\n- Item 2\nLine break';
    const parsed = parseMd(input);
    expect(parsed).toContain('<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">Item 1</li>');
    expect(parsed).toContain('<br/>');
  });
});
