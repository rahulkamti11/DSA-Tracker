import { apiRequest, buildAuthHeaders } from './api';

export const authenticate = ({ authMode, username, email, password, name }) =>
  apiRequest(authMode === 'register' ? '/auth/register' : '/auth/login', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(
      authMode === 'register'
        ? { username, email, password, name }
        : { username, password }
    ),
  });

export const fetchProfile = (token) =>
  apiRequest('/auth/me', {
    headers: buildAuthHeaders(token, false),
  });

export const updateProfile = ({ token, name, username, email, password }) =>
  apiRequest('/auth/me', {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({ name, username, email, password }),
  });

export const deleteAccount = (token) =>
  apiRequest('/auth/me', {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });

export const logActivity = (token) =>
  apiRequest('/auth/activity', {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });

export const syncGuestData = (token, payload = {}) =>
  apiRequest('/auth/sync', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });
