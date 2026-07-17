import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-coal text-white pt-[70px] pb-6 after:absolute after:inset-x-0 after:top-0 after:h-[7px] after:bg-gradient-dopamine">
      <div className="container grid grid-cols-[1.6fr_0.7fr_0.7fr] gap-12 tablet:grid-cols-1">
        <div>
          <div className="flex flex-col items-start gap-1 mb-4">
            <span className="text-forest text-[24px] font-[760] tracking-[0.025em] leading-none drop-shadow-sm">
              BUSIDO-PESIDO
            </span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-white/60 font-[650]">
              поведение · состояние · благополучие
            </span>
          </div>
          <p className="text-oat max-w-[400px]">
            Поведение, состояние и благополучие животных. Авторская система практической помощи владельцам и специалистам.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg mb-2 text-white">Навигация</h3>
          <Link className="text-oat hover:text-white transition-colors" href="/services">Услуги и цены</Link>
          <Link className="text-oat hover:text-white transition-colors" href="/booking">Запись</Link>
          <Link className="text-oat hover:text-white transition-colors" href="/library">Библиотека</Link>
          <Link className="text-oat hover:text-white transition-colors" href="/free-consultations">Бесплатные консультации</Link>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg mb-2 text-white">Связаться</h3>
          <a className="text-oat hover:text-white transition-colors" href="#">e-mail</a>
          <a className="text-oat hover:text-white transition-colors" href="#">Telegram</a>
          <a className="text-oat hover:text-white transition-colors" href="#">Instagram</a>
          <Link className="text-oat hover:text-white transition-colors mt-2 text-matcha font-[800]" href="/booking">Выбрать формат</Link>
        </div>
      </div>
      
      <div className="container border-t border-white/10 mt-10 pt-6 grid grid-cols-2 gap-7 tablet:grid-cols-1">
        <p className="text-[12px] text-caramel">
          Информация на сайте носит просветительский характер и не заменяет очный ветеринарный осмотр, диагностику и лечение. При признаках острого ухудшения или угрозе безопасности требуется обращение в ветеринарную клинику или экстренную службу.
        </p>
        <p className="text-[12px] text-caramel">
          © {new Date().getFullYear()} Busido-Pesido. Копирование, переработка и коммерческое использование авторских материалов допускаются только с письменного разрешения автора.
        </p>
      </div>
      
      <div className="container border-t border-white/10 mt-5 pt-5 text-[12px] text-caramel text-center">
        Busido-Pesido · Ярослава Ковалевская · Поведение, состояние и благополучие животных · Авторская библиотека практических материалов
      </div>
    </footer>
  );
}