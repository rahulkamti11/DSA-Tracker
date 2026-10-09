import { apiRequest, buildAuthHeaders } from './api';

export const fetchCollections = (token) =>
  apiRequest('/collections', {
    headers: buildAuthHeaders(token, false),
  });

export const createCollection = (token, payload) =>
  apiRequest('/collections', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

export const deleteCollection = (token, collectionId) =>
  apiRequest(`/collections/${collectionId}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token, false),
  });
