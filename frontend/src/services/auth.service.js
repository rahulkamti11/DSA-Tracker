import { apiRequest, buildAuthHeaders } from './api';

export const guestLogin = () => apiRequest('/auth/guest-login', { method: 'POST' });

export const authenticate = ({ authMode, username, password, name }) =>
  apiRequest(authMode === 'register' ? '/auth/register' : '/auth/login', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(authMode === 'register' ? { username, password, name } : { username, password }),
  });

export const fetchProfile = (token) =>
  apiRequest('/auth/me', {
    headers: buildAuthHeaders(token, false),
  });

export const updateProfile = ({ token, name, username, password }) =>
  apiRequest('/auth/me', {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({ name, username, password }),
  });

export const logActivity = (token) =>
  apiRequest('/auth/activity', {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });

export const syncGuestData = (token) =>
  apiRequest('/auth/sync', {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });
