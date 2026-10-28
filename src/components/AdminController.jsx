'use client';
import { useEffect } from 'react';
import { initAdmin } from '../lib/admin-controller';
export default function AdminController() {
  useEffect(() => {
    let dispose;
    const frame = requestAnimationFrame(() => { dispose = initAdmin(); });
    return () => { cancelAnimationFrame(frame); dispose?.(); };
  }, []);
  return null;
}
