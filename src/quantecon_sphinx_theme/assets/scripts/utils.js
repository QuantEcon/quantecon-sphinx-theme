/**
 * Utility functions — Shared helpers
 */

/**
 * Throttle a function to run at most once per `wait` ms.
 */
export function throttle(fn, wait) {
  let lastTime = 0;
  let rafId = null;

  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!rafId) {
      rafId = requestAnimationFrame(() => {
        lastTime = Date.now();
        rafId = null;
        fn.apply(this, args);
      });
    }
  };
}

/**
 * Debounce a function to only run after `wait` ms of inactivity.
 */
export function debounce(fn, wait) {
  let timeoutId = null;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}
