'use client';

import { useEffect, useRef, useState } from 'react';
import { recordReadCompletion, recordFeedback } from './actions';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function ArticleFeedback({ slug }: { slug: string }) {
  const observerRef = useRef<HTMLDivElement>(null);
  const hasReadRef = useRef(false); // Никаких стейтов для невидимых данных
  
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);

  // 1. Трекинг дочитывания (строго через Ref)
  useEffect(() => {
    const sessionKey = `read_${slug}`;
    
    if (sessionStorage.getItem(sessionKey)) {
      hasReadRef.current = true;
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasReadRef.current) {
        hasReadRef.current = true;
        sessionStorage.setItem(sessionKey, 'true');
        recordReadCompletion(slug);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [slug]);

  // 2. Восстановление голоса (Асинхронно, без каскадных рендеров)
  useEffect(() => {
    let isMounted = true;

    const loadVote = async () => {
      const localVote = localStorage.getItem(`voted_${slug}`);
      if (isMounted && (localVote === 'yes' || localVote === 'no')) {
        setVoted(localVote);
      }
    };

    loadVote();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // 3. Обработчик голосования
  const handleVote = async (isLike: boolean) => {
    if (voted) return;
    const voteType = isLike ? 'yes' : 'no';
    setVoted(voteType);
    localStorage.setItem(`voted_${slug}`, voteType);
    await recordFeedback(slug, isLike);
  };

  return (
    <div ref={observerRef} className="mt-16 pt-12 border-t border-forest/15 flex flex-col items-center justify-center gap-5">
      <span className="font-bold text-coal text-[20px]">Эта статья была полезна?</span>
      <div className="flex gap-4">
        <button 
          onClick={() => handleVote(true)}
          disabled={voted !== null}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${voted === 'yes' ? 'bg-matcha text-white shadow-md' : voted === 'no' ? 'bg-snow text-coal/30 opacity-50 cursor-not-allowed' : 'bg-snow text-coal hover:bg-matcha/10 hover:text-matcha'}`}
        >
          <ThumbsUp size={20} /> Да
        </button>
        <button 
          onClick={() => handleVote(false)}
          disabled={voted !== null}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${voted === 'no' ? 'bg-rose text-white shadow-md' : voted === 'yes' ? 'bg-snow text-coal/30 opacity-50 cursor-not-allowed' : 'bg-snow text-coal hover:bg-rose/10 hover:text-rose'}`}
        >
          <ThumbsDown size={20} /> Нет
        </button>
      </div>
      {voted && <span className="text-sm text-coal/50 font-medium">Спасибо за ваш отзыв!</span>}
    </div>
  );
}