const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const buildAuthHeaders = (token, includeJson = true) => {
  const headers = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
};

export const checkBackendHealth = async () => {
  try {
    const healthUrl = `${API_URL}/health`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.status === 200;
  } catch {
    return false;
  }
};
