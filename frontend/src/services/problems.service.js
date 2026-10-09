import { apiRequest, buildAuthHeaders } from './api';

export const mapProblem = (problem) => ({ ...problem, id: problem._id || problem.id });

export const fetchProblems = (token) =>
  apiRequest('/problems', {
    headers: buildAuthHeaders(token, false),
  });

export const fetchTrash = (token) =>
  apiRequest('/problems/trash', {
    headers: buildAuthHeaders(token, false),
  });

export const createProblem = (token, payload) =>
  apiRequest('/problems', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

export const updateProblem = (token, problemId, payload) =>
  apiRequest(`/problems/${problemId}`, {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

export const updateProblemTrash = (token, problemId, payload) =>
  apiRequest(`/problems/${problemId}/trash`, {
    method: 'PUT',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

export const emptyTrash = (token) =>
  apiRequest('/problems/trash/empty', {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });

export const deleteProblemPermanently = (token, problemId) =>
  apiRequest(`/problems/${problemId}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token, false),
  });
