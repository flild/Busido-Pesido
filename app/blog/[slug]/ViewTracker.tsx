'use client';

import { useEffect, useRef } from 'react';
import { recordView } from './actions';

export function ViewTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // useRef защищает от двойного срабатывания в React Strict Mode (в режиме разработки)
    if (!hasTracked.current) {
      recordView(slug);
      hasTracked.current = true;
    }
  }, [slug]);

  return null; // Компонент невидимый
}