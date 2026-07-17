'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/*
 * ПЛАН ДЛЯ АДМИНКИ:
 * Этот объект `servicesData` тоже должен собираться на сервере из JSON-колонки `steps`
 * таблицы `services` и передаваться сюда пропсом.
 */
// Мы добавили объект theme для каждого формата, чтобы визуально связывать его с карточкой
const servicesData: Record<string, { title: string, price: string, steps: string[][] }> = {
  online: { title: "Онлайн-консультация", price: "6 000 ₽", steps: [["Кому подходит", "Владельцам собак и кошек, которым нужен полный анализ поведения, состояния, среды и дальнейшего маршрута."], ["Что подготовить", "Анкету, короткие видео, медицинские документы, описание режима, питания и основных контекстов."], ["Как проходит", "Разбираем историю случая, состояние, поддерживающие условия, риски и первые изменения."], ["Что вы получаете", "Письменную рекомендацию, приоритеты на первые недели, упражнения и критерии прогресса."], ["Обратная связь", "До 7 дней по вопросам выполнения рекомендаций."], ["Правила общения", "Сообщения объединяются в содержательные блоки, видео присылаются с описанием контекста."], ["Оплата и перенос", "Полная предоплата. Один перенос при предупреждении не позднее чем за 24 часа."], ["Альтернатива", "При необходимости регулярной корректировки лучше выбрать сопровождение."]] },
  offline: { title: "Очная / выездная консультация", price: "8 000 ₽", steps: [["Кому подходит", "Когда важно увидеть среду, прогулку, бытовые процедуры или взаимодействие животных."], ["Что подготовить", "Анкету, адрес, видео эпизодов, медицинские документы и перечень контекстов."], ["Как проходит", "Я наблюдаю взаимодействия, оцениваю среду и показываю первые безопасные шаги."], ["Что вы получаете", "Письменную рекомендацию, схему среды и план упражнений."], ["Обратная связь", "До 7 дней после встречи."], ["Правила общения", "Опасное поведение искусственно не провоцируется."], ["Оплата и перенос", "Полная предоплата. Транспортные расходы могут рассчитываться отдельно."], ["Альтернатива", "Если очная встреча небезопасна, начинаем с онлайн-разбора."]] },
  support: { title: "Онлайн-сопровождение", price: "22 000 ₽", steps: [["Кому подходит", "Для сложных, длительных или нестабильных случаев, где одной встречи недостаточно."], ["Что подготовить", "Анкету, видео, медицинские документы и готовность вести короткие отчёты."], ["Как проходит", "Работа строится циклами: наблюдение, анализ, корректировка, новый критерий."], ["Что вы получаете", "Домашние задания, их проверку, разбор видео и обновление плана."], ["Обратная связь", "В течение согласованного периода сопровождения."], ["Правила общения", "Отчёты и вопросы присылаются в согласованном формате."], ["Оплата и перенос", "Возможна гибкая рассрочка на 2, 4 или более частых платежа."], ["Альтернатива", "Для первичного понимания запроса можно начать с разовой консультации."]] },
  second: { title: "Ветеринарное второе мнение", price: "2 500 ₽", steps: [["Кому подходит", "Когда нужно оценить полноту диагностики и логику медицинского маршрута."], ["Что подготовить", "Заключения, анализы, протоколы исследований, назначения и хронологию симптомов."], ["Как проходит", "Я анализирую документы и при необходимости задаю уточняющие вопросы."], ["Что вы получаете", "Письменный разбор и рекомендации по дальнейшей диагностике."], ["Обратная связь", "Одно уточнение по готовому разбору в течение 3 дней."], ["Правила общения", "Формат не заменяет очный осмотр и не используется при экстренных состояниях."], ["Оплата и перенос", "Полная предоплата после оценки объёма документов."], ["Альтернатива", "При поведенческом запросе дополнительно выбирается консультация."]] }
};

interface Props {
  activeServiceKey: string | null;
  activeBorderColor?: string; // Добавили пропс для цвета верхней границы
  onClose?: () => void;
}

export function ServiceInteractive({ activeServiceKey, activeBorderColor, onClose }: Props) {
  const [step, setStep] = useState(0);

  if (!activeServiceKey || !servicesData[activeServiceKey]) return null;

  const s = servicesData[activeServiceKey];
  const stepData = s.steps[step];

  return (
    // Принимаем цвет динамически (если нет — дефолтный зеленый)
    <div className={`p-[38px] max-md:p-[24px] rounded-[38px] bg-white border border-forest/15 shadow-[0_24px_70px_rgba(30,43,14,0.08)] border-t-[6px] ${activeBorderColor || 'border-t-forest'} transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-2 border-b border-forest/10 pb-6">
        <h3 className="text-[32px] max-md:text-[26px] leading-tight m-0 font-bold text-coal">{s.title}</h3>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-snow text-coal/50 hover:bg-fog hover:text-coal transition-colors max-md:absolute max-md:top-6 max-md:right-6"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-[300px_1fr] max-lg:grid-cols-1 gap-[32px]">
        {/* Список кнопок-шагов */}
        <div className="flex flex-col gap-1.5 max-lg:flex-row max-lg:overflow-x-auto pb-2 scrollbar-hide">
          {s.steps.map((x, i) => (
            <button 
              key={i}
              className={`p-4 text-left font-[820] cursor-pointer rounded-2xl transition-all duration-200 border-none max-lg:min-w-[205px] ${i === step ? "bg-forest text-white shadow-md scale-[1.02]" : "bg-snow/50 text-coal/80 hover:bg-fog/50"}`}
              onClick={() => setStep(i)}
            >
              <span className="opacity-60 mr-2 text-[12px]">{String(i + 1).padStart(2, "0")}</span>
              {x[0]}
            </button>
          ))}
        </div>
        
        {/* Окно контента с плавной анимацией и фиксированной высотой */}
        <div className="min-h-[280px] p-[38px] max-md:p-[24px] rounded-[28px] bg-gradient-to-br from-snow to-fog/30 flex flex-col relative overflow-hidden border border-white/50">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <span className="inline-block px-2.5 py-1 rounded-md bg-white/60 text-[10px] font-black text-matcha tracking-widest uppercase mb-5">
                ШАГ {step + 1} ИЗ {s.steps.length}
              </span>
              <h4 className="text-[28px] max-md:text-[24px] mb-4 leading-tight font-bold text-coal">{stepData[0]}</h4>
              <p className="text-coal/80 text-lg leading-relaxed">{stepData[1]}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-forest/10">
            <button 
              className="w-12 h-12 rounded-full border border-forest/15 bg-white cursor-pointer flex items-center justify-center hover:bg-fog disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xl font-bold text-coal" 
              disabled={step === 0} 
              onClick={() => setStep(step - 1)}
            >
              ←
            </button>
            <Link className="button button-dark px-8" href={`/booking?service=${activeServiceKey}`}>
              Перейти к записи
            </Link>
            <button 
              className="w-12 h-12 rounded-full border border-forest/15 bg-white cursor-pointer flex items-center justify-center hover:bg-fog disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xl font-bold text-coal" 
              disabled={step === s.steps.length - 1} 
              onClick={() => setStep(step + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}