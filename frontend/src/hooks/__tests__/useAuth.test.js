import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth.js';
import * as authService from '../../services/auth.service.js';

vi.mock('../../services/auth.service.js');

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default guest user if no session is stored', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user.isGuest).toBe(true);
    expect(result.current.user.username).toBe('guest');
    expect(result.current.user.token).toBeNull();
  });

  it('should restore existing user session from localStorage', () => {
    const storedUser = {
      id: 'u-123',
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@example.com',
      token: 'jwt-xyz',
      isGuest: false,
    };
    localStorage.setItem('dsa_session', JSON.stringify(storedUser));

    const { result } = renderHook(() => useAuth());
    expect(result.current.user.isGuest).toBe(false);
    expect(result.current.user.username).toBe('johndoe');
    expect(result.current.user.token).toBe('jwt-xyz');
  });

  it('handleLogout should clear dsa_session and reset to default guest user', () => {
    const storedUser = {
      id: 'u-123',
      username: 'johndoe',
      name: 'John',
      email: 'john@example.com',
      token: 'jwt-xyz',
      isGuest: false,
    };
    localStorage.setItem('dsa_session', JSON.stringify(storedUser));

    const { result } = renderHook(() => useAuth());
    expect(result.current.user.isGuest).toBe(false);

    act(() => {
      result.current.handleLogout();
    });

    expect(result.current.user.isGuest).toBe(true);
    expect(result.current.user.username).toBe('guest');
    expect(localStorage.getItem('dsa_session')).toBeNull();
  });

  it('handleUpdateProfile should reject update if in guest mode', async () => {
    const { result } = renderHook(() => useAuth());

    await expect(
      result.current.handleUpdateProfile({ name: 'New Name' })
    ).rejects.toThrow('Guest profile cannot be modified');
  });
});
