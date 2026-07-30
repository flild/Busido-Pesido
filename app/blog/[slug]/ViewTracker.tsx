'use client';

import { useEffect, useRef } from 'react';
import { recordView } from './actions';

export function ViewTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // useRef надежно защищает от двойного вызова (особенно в Strict Mode)
    if (!hasTracked.current) {
      recordView(slug);
      hasTracked.current = true;
    }
  }, [slug]);

  return null;
}