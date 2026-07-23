'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, Copy, Check, X, Eye, PawPrint, Calendar, Mail, Phone, FileText } from 'lucide-react';
import { updateAppStatus, deleteApp } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

// Хелпер для бейджей статуса
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'new': return { label: 'Новая', classes: 'bg-ice text-white shadow-sm' };
    case 'contacted': return { label: 'В работе', classes: 'bg-rose/15 text-rose' };
    case 'completed': return { label: 'Завершена', classes: 'bg-matcha/15 text-forest' };
    default: return { label: 'Отменена', classes: 'bg-fog text-coal' };
  }
};

const petTypeMap: Record<string, string> = {
  dog: 'Собака',
  cat: 'Кошка'
};

export function ApplicationRow({ app }: { app: any }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const badge = getStatusBadge(app.status);

  // Блокировка скролла при открытой модалке
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateAppStatus(app.id, newStatus);
    });
  };

  const handleDelete = () => {
    if (!confirm('Точно удалить заявку? Действие необратимо.')) return;
    startTransition(async () => {
      await deleteApp(app.id);
    });
  };

  const handleCopyContact = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
        <td className="p-4 text-coal/50 font-medium text-sm">#{app.id}</td>
        <td className="p-4 text-coal/80 text-sm whitespace-nowrap">
          {new Date(app.created_at).toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </td>
        <td className="p-4">
          <strong className="text-coal font-bold block">{app.name}</strong>
          <span className="text-[12px] text-coal/60 truncate block max-w-[140px]">{app.contact}</span>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-forest/10 text-forest">
              <PawPrint size={12} />
            </span>
            <span className="text-sm font-medium text-coal">
              {app.pet_name || 'Не указано'} 
              <span className="text-coal/50 text-xs ml-1">
                ({app.pet_type ? petTypeMap[app.pet_type] || app.pet_type : '?'})
              </span>
            </span>
          </div>
        </td>
        <td className="p-4 max-w-[200px]">
          <div className="truncate text-coal/80 text-sm" title={app.request_text}>
            {app.request_text}
          </div>
        </td>
        <td className="p-4 whitespace-nowrap">
          <span className={`inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badge.classes}`}>
            {badge.label}
          </span>
        </td>
        <td className="p-4">
          <div className="flex gap-1 justify-end items-center">
            {/* Кнопка открытия модалки */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-xl text-coal/60 hover:bg-forest/10 hover:text-forest transition-colors"
              title="Открыть карточку"
            >
              <Eye size={18} />
            </button>
            <select 
              value={app.status} 
              onChange={handleStatusChange}
              disabled={isPending}
              className="px-2 py-1.5 rounded-lg border border-transparent hover:border-forest/15 bg-transparent hover:bg-white text-coal font-medium text-sm outline-none focus:border-forest/40 cursor-pointer transition-all w-8 text-transparent focus:text-coal focus:w-auto focus:bg-white"
              title="Сменить статус"
              style={{ backgroundImage: 'none' }} // Прячем дефолтную стрелку пока не в фокусе
            >
              <option value="new">Новая</option>
              <option value="contacted">В работе</option>
              <option value="completed">Завершена</option>
              <option value="cancelled">Отменена</option>
            </select>
            <button 
              onClick={handleDelete}
              disabled={isPending}
              className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors disabled:opacity-50" 
              title="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

{/* УМНАЯ МОДАЛКА КАРТОЧКИ КЛИЕНТА */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-coal/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[600px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Шапка модалки */}
                <div className="p-6 pb-4 border-b border-forest/10 flex justify-between items-start bg-snow/50">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${badge.classes}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-coal/40">Заявка #{app.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-coal m-0">{app.name}</h3>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-white border border-forest/10 text-coal hover:text-rose hover:border-rose/30 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Тело модалки */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                  
                  {/* Инфо-блоки гридом */}
                  <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                    <div className="bg-snow rounded-2xl p-4 border border-forest/5">
                      <div className="flex items-center gap-2 text-coal/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <PawPrint size={14} /> Питомец
                      </div>
                      <p className="font-bold text-coal text-lg m-0">{app.pet_name || 'Неизвестно'}</p>
                      <p className="text-sm text-coal/60 m-0">{app.pet_type ? petTypeMap[app.pet_type] || app.pet_type : 'Вид не указан'}</p>
                    </div>
                    
                    <div className="bg-snow rounded-2xl p-4 border border-forest/5">
                      <div className="flex items-center gap-2 text-coal/50 text-xs font-bold uppercase tracking-wider mb-2">
                        <Calendar size={14} /> Услуга
                      </div>
                      <p className="font-bold text-coal text-[15px] leading-tight m-0">{app.service}</p>
                      {(app.date || app.time) && (
                        <p className="text-sm text-forest font-medium m-0 mt-1">Желаемое время: {app.date} {app.time}</p>
                      )}
                    </div>
                  </div>

                  {/* Контакты с копированием */}
                  <div>
                    <div className="text-xs font-bold text-coal/50 uppercase tracking-wider mb-3">Связь с клиентом</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-forest/15 hover:border-forest/40 transition-colors bg-white group">
                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-coal/40" />
                          <span className="font-medium text-coal">{app.contact}</span>
                        </div>
                        <button onClick={() => handleCopyContact(app.contact)} className="p-2 rounded-lg bg-snow text-coal/60 hover:text-forest transition-colors">
                          {copied ? <Check size={16} className="text-matcha" /> : <Copy size={16} />}
                        </button>
                      </div>
                      
                      {app.email && (
                        <div className="flex items-center justify-between p-3 rounded-xl border border-forest/15 hover:border-forest/40 transition-colors bg-white group">
                          <div className="flex items-center gap-3">
                            <Mail size={18} className="text-coal/40" />
                            <span className="font-medium text-coal">{app.email}</span>
                          </div>
                          <button onClick={() => handleCopyContact(app.email)} className="p-2 rounded-lg bg-snow text-coal/60 hover:text-forest transition-colors">
                            {copied ? <Check size={16} className="text-matcha" /> : <Copy size={16} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Текст запроса */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-coal/50 uppercase tracking-wider mb-3">
                      <FileText size={14} /> Текст проблемы
                    </div>
                    <div className="p-5 rounded-2xl bg-[#FFFBF7] border border-caramel/20 text-[15px] leading-relaxed text-coal/90 whitespace-pre-wrap">
                      {app.request_text || <span className="italic text-coal/40">Пользователь не оставил комментарий</span>}
                    </div>
                  </div>

                </div>

                {/* Подвал с экшенами */}
                <div className="p-6 border-t border-forest/10 bg-snow/30 flex justify-between items-center max-sm:flex-col max-sm:gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-coal/60">Изменить статус:</span>
                    <select 
                      value={app.status} 
                      onChange={handleStatusChange}
                      disabled={isPending}
                      className="px-4 py-2 rounded-xl border border-forest/20 bg-white text-coal font-bold text-sm outline-none focus:border-forest/50 cursor-pointer shadow-sm"
                    >
                      <option value="new">Новая заявка</option>
                      <option value="contacted">Взята в работу</option>
                      <option value="completed">Завершена (Успех)</option>
                      <option value="cancelled">Отменена</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose font-bold hover:bg-rose/10 transition-colors"
                  >
                    <Trash2 size={16} /> Удалить
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}