'use client';
import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      setProgress(Math.min(100, (doc.scrollTop / max) * 100));
    };

    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress);

    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[999] h-1 pointer-events-none" aria-hidden="true">
      <i 
        className="block h-full w-0 bg-gradient-dopamine shadow-[0_0_18px_rgba(225,77,117,0.34)] transition-all duration-150 ease-out" 
        style={{ width: `${progress}%` }}
      ></i>
    </div>
  );
}