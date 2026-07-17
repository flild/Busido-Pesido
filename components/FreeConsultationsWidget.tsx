'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Обновленный тип данных из БД
export type FreeConsultationDay = {
  date_id: string;
  day_number: number;
  is_available: number; // 0 или 1 из SQLite
  custom_message: string | null;
  slots: string; // JSON строка из SQLite
};

interface Props {
  scheduleData: FreeConsultationDay[];
}

export function FreeConsultationsWidget({ scheduleData }: Props) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', phone: '', petName: '', requestText: '' });
  const [confirmed, setConfirmed] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedDay = scheduleData.find(d => d.date_id === selectedDayId);
  // Парсим слоты безопасно
  const availableSlots = selectedDay ? JSON.parse(selectedDay.slots) : [];

  // Кастомная маска для телефона +7 (XXX) XXX-XX-XX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    
    if (!digits) {
      setFormData({ ...formData, phone: '' });
      return;
    }

    let formatted = '';
    // Если начинается с 7, 8 или 9 (классика для РФ/СНГ)
    if (['7', '8', '9'].includes(digits[0])) {
      const main = digits[0] === '9' ? digits : digits.substring(1);
      formatted = '+7';
      if (main.length > 0) formatted += ` (${main.substring(0, 3)}`;
      if (main.length > 3) formatted += `) ${main.substring(3, 6)}`;
      if (main.length > 6) formatted += `-${main.substring(6, 8)}`;
      if (main.length > 8) formatted += `-${main.substring(8, 10)}`;
    } else {
      // Для международных оставляем просто плюсик
      formatted = `+${digits.substring(0, 15)}`;
    }
    
    setFormData({ ...formData, phone: formatted });
  };

  const handleDaySelect = (day: FreeConsultationDay) => {
    if (day.is_available === 0) return;
    setSelectedDayId(day.date_id);
    setSelectedTime(null);
    setErrorMessage('');
  };

  const handleBook = async () => {
    if (!selectedDay || !selectedTime || !confirmed) return;
    
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/free-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateId: selectedDay.date_id, // обновили поле[cite: 20]
          time: selectedTime,
          ...formData,
          confirmed
        })
      });

      // Сначала проверяем, есть ли вообще тело ответа и JSON ли это
      const contentType = response.headers.get("content-type");
      let data = null;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      // Если статус ответа не 200-299
      if (!response.ok) {
        // Если сервер запросил авторизацию
        if (response.status === 401) {
          throw new Error('Сервер требует авторизацию (401). Доступ к API закрыт.');
        }
        
        // Если у нас есть понятная ошибка от нашего API
        if (data && data.error) {
          throw new Error(data.error);
        }
        
        // Фоллбэк для любых других ошибок (500, 502, 404 и т.д.)
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }

      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Произошла непредвиденная ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Проверка готовности формы (Имя не пустое, Телефон минимум 11 цифр)
  const isFormValid = formData.name.trim().length > 1 && formData.phone.replace(/\D/g, '').length >= 11 && confirmed;

return (
    <div className="mt-10 grid grid-cols-[1.2fr_0.8fr] gap-[34px] tablet:grid-cols-1 items-start">
      
      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-2.5 max-md:grid-cols-4 max-sm:grid-cols-2">
        {scheduleData.map((day) => {
          const isSelected = selectedDayId === day.date_id;
          const parsedSlots = JSON.parse(day.slots);
          const slotsCount = parsedSlots.length;
          
          return (
            <button
              key={day.date_id}
              onClick={() => handleDaySelect(day)}
              disabled={day.is_available === 0 || isSuccess} // Обновили проверку[cite: 20]
              className={`group relative flex flex-col items-center p-4 rounded-[22px] border transition-all duration-300 outline-none
                ${day.is_available === 0 
                  ? 'bg-snow border-forest/5 opacity-50 cursor-not-allowed' 
                  : 'bg-white border-forest/15 hover:border-forest/30 hover:shadow-sm cursor-pointer'}
                ${isSelected ? 'border-transparent shadow-none' : ''}
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeDayBackground"
                  className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-rose to-berry shadow-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span className={`text-[32px] font-[900] leading-none mb-1 transition-colors ${isSelected ? 'text-white' : 'text-coal'}`}>
                  {day.day_number}
                </span>
                <b className={`text-[12px] font-[700] transition-colors text-center leading-tight ${isSelected ? 'text-white/90' : 'text-coal/60'}`}>
                  {day.is_available === 1 ? `${slotsCount} мест` : day.custom_message}
                </b>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Боковая панель оформления */}
      <aside className="p-8 max-md:p-6 rounded-[32px] bg-white text-coal shadow-[0_35px_80px_rgba(30,43,14,0.15)] relative overflow-hidden border border-forest/5">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-gradient-to-bl from-fog to-transparent opacity-50 rounded-bl-[100px] pointer-events-none" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="w-20 h-20 bg-matcha/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-matcha" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-[28px] font-[800] mb-3 leading-tight">Запись подтверждена</h3>
                <p className="text-coal/70 text-[16px] leading-relaxed mb-6">
                  Ярослава свяжется с вами по указанному номеру <b>{formData.phone}</b> накануне консультации для подтверждения звонка.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-snow rounded-full font-bold text-coal hover:bg-fog transition-colors"
                >
                  Закрыть
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="kicker">ОФОРМЛЕНИЕ ЗАЯВКИ</span>
                <h3 className="text-[26px] font-[800] mt-2 mb-2 leading-tight">
                  {selectedDay ? `${selectedDay.day_number} числа` : 'Выберите дату'}
                </h3>
                
                <div className="min-h-[90px] mt-6 mb-6">
                  {!selectedDay ? (
                    <p className="text-coal/60 text-[15px]">Нажмите на любой доступный день в календаре слева.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5 max-sm:grid-cols-2">
                      {/* Мапим распаршенные слоты */}
                      {availableSlots.map((time: string) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2.5 rounded-[14px] font-[800] text-[15px] transition-all duration-200 border outline-none
                            ${selectedTime === time ? 'bg-coal text-white border-coal shadow-md scale-105' : 'bg-snow text-coal border-forest/10 hover:border-forest/30 hover:bg-white'}
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {selectedTime && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4 mb-6">
                        
                        {/* Поля с Label и обязательными отметками */}
                        <div>
                          <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-1.5 ml-1">
                            Ваше имя <span className="text-rose text-[13px] leading-none">*</span>
                          </label>
                          <input 
                            type="text" placeholder="Алексей" required
                            className="w-full p-3.5 rounded-2xl bg-snow border border-forest/10 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/5 outline-none transition-all font-medium text-[15px]"
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-1.5 ml-1">
                            Телефон (Telegram / WhatsApp) <span className="text-rose text-[13px] leading-none">*</span>
                          </label>
                          <input 
                            type="tel" placeholder="+7 (999) 000-00-00" required
                            className="w-full p-3.5 rounded-2xl bg-snow border border-forest/10 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/5 outline-none transition-all font-medium text-[15px]"
                            value={formData.phone} onChange={handlePhoneChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-1.5 ml-1">
                              Питомец
                            </label>
                            <input 
                              type="text" placeholder="Имя"
                              className="w-full p-3.5 rounded-2xl bg-snow border border-forest/10 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/5 outline-none transition-all font-medium text-[15px]"
                              value={formData.petName} onChange={e => setFormData({...formData, petName: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-1.5 ml-1 opacity-0 pointer-events-none">
                              Вид
                            </label>
                            <input 
                              type="text" placeholder="Собака / Кошка"
                              className="w-full p-3.5 rounded-2xl bg-snow border border-forest/10 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/5 outline-none transition-all font-medium text-[15px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-1.5 ml-1">
                            В чем проблема
                          </label>
                          <textarea 
                            placeholder="Кратко опишите ситуацию..." rows={3}
                            className="w-full p-3.5 rounded-2xl bg-snow border border-forest/10 focus:border-forest/30 focus:bg-white focus:ring-4 focus:ring-forest/5 outline-none transition-all font-medium text-[15px] resize-none"
                            value={formData.requestText} onChange={e => setFormData({...formData, requestText: e.target.value})}
                          />
                        </div>
                      </div>

                      <label className={`flex gap-3 items-start p-4 rounded-[18px] border transition-colors cursor-pointer select-none mb-4 ${confirmed ? 'bg-matcha/[0.04] border-matcha/30' : 'bg-snow border-transparent hover:bg-fog'}`}>
                        <input 
                          type="checkbox" className="mt-0.5 w-4 h-4 accent-matcha cursor-pointer shrink-0"
                          checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} 
                        />
                        <span className="text-[13px] font-[600] leading-snug text-coal/80">
                          Подтверждаю, что ранее я не участвовал(а) в бесплатных консультациях. Понимаю, что при нарушении правила заявка будет аннулирована.
                        </span>
                      </label>

                      {errorMessage && (
                        <div className="p-4 mb-4 text-[14px] font-bold text-rose bg-rose/10 rounded-2xl border border-rose/20">
                          {errorMessage}
                        </div>
                      )}

                      <button 
                        className="button button-primary w-full shadow-none disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all" 
                        disabled={!isFormValid || isSubmitting}
                        onClick={handleBook}
                      >
                        {isSubmitting ? 'Отправка...' : `Записаться на ${selectedDay?.day_number} число, ${selectedTime}`}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </div>
  );
}