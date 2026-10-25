import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useKeyboardShortcuts from '../useKeyboardShortcuts.js';

describe('useKeyboardShortcuts Hook', () => {
  it('should trigger onEscape when Escape key is pressed', () => {
    const onEscape = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onEscape }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('should trigger onN when N key is pressed outside inputs', () => {
    const onN = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onN }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(onN).toHaveBeenCalledTimes(1);
  });

  it('should trigger onD, onP and onQuestion for respective keys', () => {
    const onD = vi.fn();
    const onP = vi.fn();
    const onQuestion = vi.fn();

    renderHook(() => useKeyboardShortcuts({ onD, onP, onQuestion }));

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));

    expect(onD).toHaveBeenCalledTimes(1);
    expect(onP).toHaveBeenCalledTimes(1);
    expect(onQuestion).toHaveBeenCalledTimes(1);
  });

  it('should ignore shortcuts when typing inside input elements', () => {
    const onN = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onN }));

    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', { key: 'n', bubbles: true });
    input.dispatchEvent(event);

    expect(onN).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
