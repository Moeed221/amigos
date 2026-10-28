'use client';
import { useEffect } from 'react';
import { initStorefront } from '../lib/storefront-controller';
export default function StorefrontController() {
  useEffect(() => {
    let dispose;
    const frame = requestAnimationFrame(() => { dispose = initStorefront(); });
    return () => { cancelAnimationFrame(frame); dispose?.(); };
  }, []);
  return null;
}
