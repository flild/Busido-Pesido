'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ToastContextType {
  say: (text: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ text: string; show: boolean }>({ text: '', show: false });

  const say = (text: string) => {
    setToast({ text, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ say }}>
      {children}
      <div 
        className={`fixed right-5 bottom-5 max-w-[380px] px-[18px] py-[14px] rounded-2xl bg-coal text-white shadow-2xl z-[100] transition-all duration-300 ease-out pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}`}
        role="alert"
      >
        {toast.text}
      </div>
    </ToastContext.Provider>
  );
}