import { useState, useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

export function useMotionPreference() {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
  const [paused, setPaused] = useState(() => {
    try {
      return window.localStorage.getItem('portfolio-motion') === 'paused';
    } catch {
      return false;
    }
  });

  function toggleMotion() {
    const next = !paused;
    setPaused(next);
    try {
      window.localStorage.setItem('portfolio-motion', next ? 'paused' : 'on');
    } catch {
      // The control still works when browser storage is unavailable.
    }
  }

  return {
    motionEnabled: !paused && !reducedMotion,
    reducedMotion,
    toggleMotion,
  };
}
