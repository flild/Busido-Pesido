'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItemProps {
  question: string;
  answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border rounded-[20px] p-5 transition-colors duration-300 ${
        isOpen
          ? 'border-rose/35 bg-[linear-gradient(135deg,#ffffff,rgba(240,114,150,0.07))]'
          : 'border-forest/15 bg-white'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left outline-none group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className={`font-[900] transition-colors duration-300 ${
            isOpen ? 'text-forest' : 'text-coal'
          }`}
        >
          {question}
        </span>
        
        {/* Добавил шеврон для визуального фидбека — без него UI выглядит слепым */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
          className="ml-4 shrink-0 text-forest/50"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 7.5L10 12.5L5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>
      
      {/* AnimatePresence управляет жизненным циклом компонента при удалении из DOM */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden" // Важно для обрезки текста при схлопывании высоты
          >
            {/* Добавили pt-4 вместо mt-4, чтобы margin не выпадал из расчета высоты Framer Motion */}
            <p className="pt-4 text-matcha">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}