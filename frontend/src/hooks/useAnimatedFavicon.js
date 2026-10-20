import { useEffect } from 'react';

// 12 mathematically computed frames for Orbital Cadence
const TOTAL_FRAMES = 12;
const orbit1 = { a: 20, b: 14, angleDeg: -25, speedMult: 2.0 };
const orbit2 = { a: 34, b: 24, angleDeg: 35, speedMult: -1.0 };
const orbit3 = { a: 46, b: 32, angleDeg: -5, speedMult: 1.0 };

function getRotatedPoint(a, b, thetaDeg, progressAngleRad) {
  const thetaRad = thetaDeg * (Math.PI / 180);
  const xPrime = a * Math.cos(progressAngleRad);
  const yPrime = b * Math.sin(progressAngleRad);
  const x = 64 + (xPrime * Math.cos(thetaRad) - yPrime * Math.sin(thetaRad));
  const y = 64 + (xPrime * Math.sin(thetaRad) + yPrime * Math.cos(thetaRad));
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

function buildSvgFrame(frameIndex) {
  const frac = frameIndex / TOTAL_FRAMES;
  const angle1 = frac * 2 * Math.PI * orbit1.speedMult;
  const angle2 = (frac * 2 * Math.PI * orbit2.speedMult) + Math.PI / 4;
  const angle3 = (frac * 2 * Math.PI * orbit3.speedMult) + (2 * Math.PI / 3);

  const p1 = getRotatedPoint(orbit1.a, orbit1.b, orbit1.angleDeg, angle1);
  const p2 = getRotatedPoint(orbit2.a, orbit2.b, orbit2.angleDeg, angle2);
  const p3 = getRotatedPoint(orbit3.a, orbit3.b, orbit3.angleDeg, angle3);

  const dash1 = (frameIndex * 8) % 90;
  const dash2 = (frameIndex * -12) % 160;
  const dash3 = (frameIndex * 14) % 230;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 128 128" fill="none">
    <defs>
      <linearGradient id="o1" x1="64" y1="38" x2="64" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="o2" x1="64" y1="24" x2="64" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#4F46E5"/>
      </linearGradient>
      <linearGradient id="o3" x1="64" y1="12" x2="64" y2="116" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="112" height="112" rx="28" fill="#13192B" stroke="#1E293B" stroke-width="2"/>
    <ellipse cx="64" cy="64" rx="20" ry="14" stroke="url(#o1)" stroke-width="2.5" stroke-dasharray="60 30" stroke-dashoffset="${dash1}" stroke-linecap="round" transform="rotate(-25 64 64)"/>
    <ellipse cx="64" cy="64" rx="34" ry="24" stroke="url(#o2)" stroke-width="2.5" stroke-dasharray="120 40" stroke-dashoffset="${dash2}" stroke-linecap="round" transform="rotate(35 64 64)"/>
    <ellipse cx="64" cy="64" rx="46" ry="32" stroke="url(#o3)" stroke-width="2.5" stroke-dasharray="180 50" stroke-dashoffset="${dash3}" stroke-linecap="round" transform="rotate(-5 64 64)"/>
    <circle cx="64" cy="64" r="10" fill="#0284C7" stroke="#13192B" stroke-width="2.5"/>
    <circle cx="64" cy="64" r="4" fill="#FFFFFF"/>
    <circle cx="${p1.x}" cy="${p1.y}" r="4.5" fill="#38BDF8" stroke="#13192B" stroke-width="1.8"/>
    <circle cx="${p2.x}" cy="${p2.y}" r="5" fill="#818CF8" stroke="#13192B" stroke-width="1.8"/>
    <circle cx="${p3.x}" cy="${p3.y}" r="5.5" fill="#34D399" stroke="#13192B" stroke-width="1.8"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Pre-render frames once
const precomputedFrames = Array.from({ length: TOTAL_FRAMES }, (_, i) => buildSvgFrame(i));

export default function useAnimatedFavicon(enabled = true, intervalMs = 90) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }

    const defaultFavicon = link.href || '/favicon.svg';
    let frame = 0;
    let timer = null;

    const tick = () => {
      if (document.hidden) return; // Pause while user is on another tab to save battery
      link.href = precomputedFrames[frame];
      frame = (frame + 1) % TOTAL_FRAMES;
    };

    const start = () => {
      if (!timer) timer = setInterval(tick, intervalMs);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (link) link.href = defaultFavicon;
    };
  }, [enabled, intervalMs]);
}
