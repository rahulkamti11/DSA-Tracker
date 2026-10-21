import { apiRequest, buildAuthHeaders } from './api';

// Submit feedback (Registered users only)
export const submitFeedback = ({ token, reason, rating, message, email }) =>
  apiRequest('/feedback', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({ reason, rating, message, email }),
  });

// Submit bug report (Anyone, compulsory email)
export const submitBugReport = ({ token, area, message, email, deviceInfo }) =>
  apiRequest('/reports', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({ area, message, email, deviceInfo }),
  });

// Helper to extract device info without asking permissions
export const getClientDeviceInfo = () => {
  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    let browser = 'Browser';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';

    return `${deviceType} (${browser})`;
  } catch {
    return 'Web Client';
  }
};
