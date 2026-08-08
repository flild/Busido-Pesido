'use client';

import { useEffect, useRef } from 'react';
import { recordView } from './actions';

export function ViewTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      const sessionKey = `viewed_${slug}`;
      
      // Если в текущей сессии статью не открывали — засчитываем просмотр
      if (!sessionStorage.getItem(sessionKey)) {
        recordView(slug);
        sessionStorage.setItem(sessionKey, 'true');
      }
      
      hasTracked.current = true;
    }
  }, [slug]);

  return null;
}