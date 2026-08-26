import { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { db } from "@/lib/db";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Специалисты",
  description: "Команда специалистов Busido-Pesido. Ветеринарные врачи, кинологи и зоопсихологи.",
};

export default function SpecialistsPage() {
  const specialists = db.prepare('SELECT * FROM specialists ORDER BY sort_order ASC').all() as any[];

  return (
    <main className="pt-[108px] pb-[92px] bg-[linear-gradient(180deg,theme(colors.snow),rgba(255,255,255,0))] min-h-screen">
    <BreadcrumbJsonLd 
        items={[
          { name: "Главная", url: "https://busidopesido.ru" },
          { name: "Специалисты", url: "https://busidopesido.ru/specialists" }
        ]} 
      />
      <div className="container">
        <ScrollReveal className="max-w-[820px] mb-[64px]">
          <span className="kicker">КОМАНДА</span>
          <h1 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
            Наши специалисты
          </h1>
          <p className="text-xl text-matcha mt-4">
            Мы работаем в едином подходе, опираясь на доказательную ветеринарную медицину и современную науку о поведении.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-12">
          {specialists.map((spec, index) => (
            <ScrollReveal key={spec.id} delay={index}>
              <article className={`flex gap-10 items-stretch bg-white rounded-[42px] p-8 border border-forest/10 shadow-sm transition-shadow hover:shadow-xl ${index % 2 !== 0 ? 'flex-row-reverse' : ''} mobile:flex-col mobile:p-6`}>
                
                {/* Картинка */}
                <div className="w-[40%] min-h-[400px] mobile:w-full mobile:min-h-[300px] rounded-[28px] overflow-hidden bg-[radial-gradient(circle_at_18%_16%,rgba(111,143,191,0.3),transparent_40%),linear-gradient(145deg,theme(colors.fog),theme(colors.snow))] relative flex items-center justify-center border border-forest/5">
                  {spec.image_url ? (
                    <img src={spec.image_url} alt={spec.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-coal/40 font-bold text-center px-4">Фотография {spec.name.split(' ')[0]}</span>
                  )}
                  {spec.is_main === 1 && (
                    <span className="absolute top-5 left-5 z-10 px-3 py-1.5 rounded-full bg-white text-[11px] font-[900] uppercase tracking-wider text-forest shadow-[0_8px_20px_rgba(30,43,14,0.1)]">
                      Основатель
                    </span>
                  )}
                </div>

                {/* Информация */}
                <div className="w-[60%] flex flex-col justify-center mobile:w-full">
                  <h2 className="text-4xl font-bold text-coal mb-2 mobile:text-3xl">{spec.name}</h2>
                  
                  {/* ОБНОВЛЕННЫЙ БЛОК: Город + Роль */}
                  <div className="flex flex-wrap items-center gap-2 text-[14px] font-[800] mb-6 uppercase tracking-wider">
                    {spec.city && (
                      <>
                        <span className="text-caramel">{spec.city}</span>
                        <span className="text-matcha/40">•</span>
                      </>
                    )}
                    <span className="text-matcha">{spec.role}</span>
                  </div>

                  <h3 className="text-xl font-medium mb-4 text-coal">
                    {spec.short_bio}
                  </h3>

                  <div className="text-coal/75 leading-relaxed max-w-[90%] mb-8">
                    {spec.full_bio.split('\n').filter((p: string) => p.trim()).map((p: string, i: number) => (
                      <p key={i} className="mb-4">{p}</p>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-forest/10">
                    <Link href={`/booking?specialist=${spec.id}`} className="button button-primary">
                      Записаться к специалисту
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </main>
  );
}