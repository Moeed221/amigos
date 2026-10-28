/** Every controller owns its listeners, observers and clocks. Nothing survives unmount. */
export function createScope() {
  const abort = new AbortController();
  const timers = new Set();
  const intervals = new Set();
  const frames = new Set();
  const observers = new Set();
  let disposed = false;
  return {
    listen(target, event, callback, options = {}) {
      target.addEventListener(event, callback, { ...(typeof options === 'boolean' ? { capture: options } : options), signal: abort.signal });
    },
    setTimeout(callback, delay) {
      const id = window.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
      timers.add(id); return id;
    },
    clearTimeout(id) { window.clearTimeout(id); timers.delete(id); },
    setInterval(callback, delay) {
      const id = window.setInterval(() => { if (!disposed) callback(); }, delay);
      intervals.add(id); return id;
    },
    clearInterval(id) { window.clearInterval(id); intervals.delete(id); },
    requestAnimationFrame(callback) {
      const id = window.requestAnimationFrame(time => { frames.delete(id); if (!disposed) callback(time); });
      frames.add(id); return id;
    },
    IntersectionObserver: class {
      constructor(callback, options) {
        const observer = new window.IntersectionObserver(callback, options);
        observers.add(observer); return observer;
      }
    },
    dispose() {
      disposed = true;
      abort.abort();
      timers.forEach(window.clearTimeout);
      intervals.forEach(window.clearInterval);
      frames.forEach(window.cancelAnimationFrame);
      observers.forEach(observer => observer.disconnect());
      document.body.classList.remove('loaded', 'is-locked', 'menu-open');
      const track = document.getElementById('goTrack');
      if (track) track.onclick = null;
    }
  };
}
