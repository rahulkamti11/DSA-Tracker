/**
 * Safe mobile haptic feedback helper using the Web Vibration API.
 * Automatically no-ops on unsupported platforms (e.g. desktop browsers, iOS Safari where vibrate is disabled).
 */
export function triggerHaptic(duration = 12) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignored if vibration is blocked by browser policy
    }
  }
}
