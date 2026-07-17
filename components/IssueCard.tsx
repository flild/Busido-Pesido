'use client';
import { useModal } from './Modal';
import Link from 'next/link';
import { TiltCard } from './TiltCard';

const issueDetails: Record<string, { label: string, title: string, text: string, view: string, first: string, accentColor: string, hoverColor: string, bgColor: string }> = {
  fear: {
    label: "СТРАХИ И ИЗБЕГАНИЕ",
    title: "Сначала оцениваем дистанцию и возможность восстановиться",
    text: "Важны ранние сигналы, интенсивность реакции, возможность отхода, скорость восстановления, сон, аппетит и предшествующий опыт.",
    view: "контекст · расстояние · восстановление",
    first: "снижение нагрузки и безопасное управление",
    accentColor: "border-t-matcha", hoverColor: "hover:border-matcha", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(216,211,179,0.28))]"
  },
  reactivity: {
    label: "РЕАКТИВНОСТЬ И ВОЗБУЖДЕНИЕ",
    title: "Ищем момент, с которого начинает расти возбуждение",
    text: "Разбираются фиксация, натяжение поводка, социальное ожидание, маршруты, накопленная нагрузка и последствия прямого подхода.",
    view: "порог · фиксация · последствия",
    first: "дистанция, дуги движения и ранняя ориентировка",
    accentColor: "border-t-rose", hoverColor: "hover:border-rose", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(240,114,150,0.12))]"
  },
  defense: {
    label: "ЗАЩИТНОЕ ПОВЕДЕНИЕ",
    title: "Приоритетом становится безопасность и функция реакции",
    text: "Анализируются прикосновения, ограничение движения, ресурсы, пространство, возможная боль и история принуждения.",
    view: "риск · предшествующие события · функция",
    first: "управление ситуацией и медицинская проверка",
    accentColor: "border-t-espresso", hoverColor: "hover:border-espresso", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.15))]"
  },
  separation: {
    label: "ТРЕВОГА ОДИНОЧЕСТВА",
    title: "Нужны видео и временная шкала первых минут после ухода",
    text: "Важны вокализация, движение, слюнотечение, разрушение, сон и способность оставаться отдельно от человека внутри дома.",
    view: "латентность · интенсивность · восстановление",
    first: "сбор видео и ограничение длительности одиночества",
    accentColor: "border-t-ice", hoverColor: "hover:border-ice", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.13))]"
  },
  puppy: {
    label: "ЩЕНКИ И ПОДРОСТКИ",
    title: "Возрастные возможности сопоставляются со сном и нагрузкой",
    text: "Разбираются прикусывание, туалет, прогулки, социализация, бытовые процедуры, возбуждение и способность переходить к отдыху.",
    view: "возраст · сон · среда",
    first: "упрощение режима и обучение бытовым навыкам",
    accentColor: "border-t-berry", hoverColor: "hover:border-berry", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(240,114,150,0.1))]"
  },
  cats: {
    label: "ПОВЕДЕНИЕ КОШЕК",
    title: "Сначала оцениваем ресурсы, маршруты и соматический вклад",
    text: "Важны лотки, высота, укрытия, вода, еда, когтеточки, переноска, контакты между животными и контроль дистанции.",
    view: "ресурсы · пространство · здоровье",
    first: "карта среды и разделение ресурсов",
    accentColor: "border-t-caramel", hoverColor: "hover:border-caramel", bgColor: "bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.14))]"
  }
};

interface IssueProps {
  id: string;
  num: string;
  title: string;
  text: string;
}

export function IssueCard({ id, num, title, text }: IssueProps) {
  const { openModal } = useModal();
  const d = issueDetails[id];

  const handleClick = () => {
    if (!d) return;
    openModal(
      <>
        <span className="kicker">{d.label}</span>
        <h2 className="text-3xl my-3">{d.title}</h2>
        <p className="text-xl text-matcha my-4">{d.text}</p>
        <div className="grid grid-cols-2 gap-2.5 my-6 mobile:grid-cols-1">
          <div className="p-4 rounded-2xl bg-white border border-forest/15">
            <b className="block text-[10px] text-forest">ОСОБЕННО ВАЖНО</b>
            <span className="block mt-1 text-[13px] text-coal/70">{d.view}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-forest/15">
            <b className="block text-[10px] text-forest">ПЕРВЫЙ ШАГ</b>
            <span className="block mt-1 text-[13px] text-coal/70">{d.first}</span>
          </div>
        </div>
        <Link className="button button-primary" href="/booking">Подобрать формат работы</Link>
      </>
    );
  };

return (
    <TiltCard 
      className={`card relative overflow-hidden cursor-pointer transition-all duration-200 border-t-[6px] ${d.accentColor} ${d.hoverColor} hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(30,43,14,0.13)] outline-none focus:-translate-y-2 focus:shadow-[0_26px_60px_rgba(30,43,14,0.13)] focus:border-b focus:border-x group ${d.bgColor}`} 
    >
      <div
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className="h-full outline-none"
      >
        <span className="font-[950] text-matcha">{num}</span>
        <h3 className="text-[25px] mt-[34px] mb-3 leading-tight">{title}</h3>
        <p className="text-coal/60 mb-6">{text}</p>
        
        <div className={`absolute right-[18px] bottom-[16px] text-[9px] tracking-[0.11em] uppercase font-[800] ${d.accentColor.replace('border-t-', 'text-')} opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity`}>
          открыть
        </div>
      </div>
    </TiltCard>
  );
}