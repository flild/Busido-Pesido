'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  // Блокируем скролл `body`, когда модалка открыта
  useEffect(() => {
    if (content) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [content]);

  const closeModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ openModal: setContent, closeModal }}>
      {children}
      
      <AnimatePresence>
        {content && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto">
            {/* Тёмный фон (Backdrop) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-coal/70 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Сама карточка модалки */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-[min(760px,calc(100%-30px))] my-[6vh] p-10 max-md:p-7 rounded-[30px] border-t-[8px] border-t-rose bg-snow shadow-2xl z-10"
              style={{ backgroundImage: 'radial-gradient(circle at 95% 8%, rgba(111,143,191,0.14), transparent 16rem)' }}
            >
              <button 
                onClick={closeModal}
                className="absolute right-4 top-3 border-0 bg-transparent text-[34px] cursor-pointer text-coal/40 hover:text-rose transition-colors leading-none"
                aria-label="Закрыть"
              >
                ×
              </button>
              
              <div className="modal-content">
                {content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}