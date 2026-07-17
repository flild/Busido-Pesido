'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceFormat } from './FormatsSection';

interface Props {
  format: ServiceFormat;
  activeBorderColor?: string;
  onClose?: () => void;
}

export function ServiceInteractive({ format, activeBorderColor, onClose }: Props) {
  const [step, setStep] = useState(0);

  // Динамически парсим шаги из БД. useMemo нужен, чтобы не пересобирать массив на каждый чих стейта
  const stepsData = useMemo(() => {
    try {
      return JSON.parse(format.steps) as string[][];
    } catch (e) {
      console.error("Ошибка парсинга шагов для:", format.id);
      return [];
    }
  }, [format.steps]);

  if (!stepsData || stepsData.length === 0) return null;

  const stepData = stepsData[step] || stepsData[0];

  return (
    <div className={`p-[38px] max-md:p-[24px] rounded-[38px] bg-white border border-forest/15 shadow-[0_24px_70px_rgba(30,43,14,0.08)] border-t-[6px] ${activeBorderColor || 'border-t-forest'} transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-2 border-b border-forest/10 pb-6">
        <h3 className="text-[32px] max-md:text-[26px] leading-tight m-0 font-bold text-coal">{format.title}</h3>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-snow text-coal/50 hover:bg-fog hover:text-coal transition-colors max-md:absolute max-md:top-6 max-md:right-6"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-[300px_1fr] max-lg:grid-cols-1 gap-[32px]">
        <div className="flex flex-col gap-1.5 max-lg:flex-row max-lg:overflow-x-auto pb-2 scrollbar-hide">
          {stepsData.map((x, i) => (
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
                ШАГ {step + 1} ИЗ {stepsData.length}
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
            <Link className="button button-dark px-8" href={format.link}>
              {format.link_text}
            </Link>
            <button 
              className="w-12 h-12 rounded-full border border-forest/15 bg-white cursor-pointer flex items-center justify-center hover:bg-fog disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xl font-bold text-coal" 
              disabled={step === stepsData.length - 1} 
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