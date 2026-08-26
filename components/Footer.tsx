// components/Footer.tsx
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { SiTelegram } from '@icons-pack/react-simple-icons';

export function Footer() {
  return (
    <footer className="relative bg-coal text-white pt-[70px] pb-6 after:absolute after:inset-x-0 after:top-0 after:h-[7px] after:bg-gradient-dopamine">
      <div className="container grid grid-cols-[1.6fr_0.7fr_0.7fr] gap-12 tablet:grid-cols-1">
        
        {/* Логотип и описание */}
        <div>
          <div className="flex flex-col items-start gap-1 mb-4">
            <span className="text-forest text-[24px] font-[760] tracking-[0.025em] leading-none drop-shadow-sm">
              БУСИДО-ПЁСИДО
            </span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-white/60 font-[650]">
              поведение · состояние · благополучие
            </span>
          </div>
          <p className="text-oat max-w-[400px]">
            Поведение, состояние и благополучие животных. Экспертная система практической помощи владельцам и специалистам.
          </p>
        </div>
        
        {/* Навигация */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-[900] tracking-widest uppercase mb-2 text-white/40">Навигация</h3>
          <Link className="text-[15px] font-[600] text-oat hover:text-white transition-colors" href="/services">Услуги и цены</Link>
          <Link className="text-[15px] font-[600] text-oat hover:text-white transition-colors" href="/booking">Запись на консультацию</Link>
          <Link className="text-[15px] font-[600] text-oat hover:text-white transition-colors" href="/blog">Блог / Статьи</Link>
          <Link className="text-[15px] font-[600] text-oat hover:text-white transition-colors" href="/free-consultations">Бесплатная помощь</Link>
        </div>
        
        {/* Контакты */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[13px] font-[900] tracking-widest uppercase mb-2 text-white/40">Связаться с нами</h3>
          
          <a className="flex items-center gap-2 text-[15px] font-[600] text-oat hover:text-white transition-colors" href="mailto:info@busidopesido.ru">
            <Mail size={16} />
            <span>info@busidopesido.ru</span>
          </a>
          
          <a 
            className="flex items-center gap-2 text-[15px] font-[600] text-oat hover:text-white transition-colors" 
            href="https://t.me/busidopesido" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <SiTelegram size={16} />
            <span>Telegram-канал</span>
          </a>

          <Link className="inline-flex items-center justify-center px-5 py-2.5 mt-4 rounded-xl bg-forest/20 text-matcha font-[800] text-[14px] hover:bg-forest/40 transition-colors self-start" href="/booking">
            Выбрать формат работы
          </Link>
        </div>
      </div>
      
      {/* Юридическая часть */}
      <div className="container border-t border-white/10 mt-12 pt-8 grid grid-cols-2 gap-8 tablet:grid-cols-1">
        <p className="text-[12px] leading-relaxed text-white/40">
          Информация на сайте носит просветительский характер и не заменяет очный ветеринарный осмотр, диагностику и лечение. При признаках острого ухудшения состояния или угрозе безопасности требуется обращение в ветеринарную клинику или экстренную службу.
        </p>
        <p className="text-[12px] leading-relaxed text-white/40">
          © {new Date().getFullYear()} Бусидо-Пёсидо. Все права защищены. Копирование, переработка и коммерческое использование материалов допускаются только с письменного разрешения команды проекта.
        </p>
      </div>
    </footer>
  );
}