'use client';
import { useToast } from './Toast';

export function UtilityLink({ href, placeholder, children, ...props }: any) {
  const { say } = useToast();
  
  const handleClick = (e: React.MouseEvent) => {
    if (placeholder || href === '#') {
      e.preventDefault();
      say('Рабочая ссылка будет добавлена после утверждения структуры сайта.');
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className="text-forest hover:text-espresso transition-colors font-semibold"
      {...props}
    >
      {children}
    </a>
  );
}

export function UtilityBar() {
  return (
    <div className="bg-gradient-to-r from-fog/90 via-snow to-oat/70 border-b border-forest/15 text-forest text-[12px]">
      <div className="container min-h-[38px] flex items-center justify-between gap-6 max-lg:justify-end">
        <div className="max-lg:hidden font-medium">Ветеринарный врач · Зоотехник-кинолог · Специалист по поведению животных</div>
        <div className="flex gap-[18px] max-md:gap-3">
          <UtilityLink href="#" placeholder="Telegram">Telegram</UtilityLink>
          <UtilityLink href="#" placeholder="Instagram">Instagram</UtilityLink>
          <UtilityLink href="#" placeholder="e-mail">e-mail</UtilityLink>
        </div>
      </div>
    </div>
  );
}