// app/admin/navigator/page.tsx
import { db } from "@/lib/db";
import NavigatorForm from "./NavigatorForm";

export default function NavigatorAdminPage() {
  // Достаем шаги (граф)
  const navRow = db.prepare("SELECT value FROM settings WHERE key = 'navigator_steps'").get() as { value: string } | undefined;
  const initialSteps = navRow ? JSON.parse(navRow.value) : { nodes: [], edges: [] };
  
  // ДОСТАЕМ ФОРМАТЫ ИЗ БД
  const formats = db.prepare("SELECT * FROM services ORDER BY sort_order").all() as any[];

  return (
    <div className="container py-8">
      <h1 className="text-[32px] font-bold mb-6 text-coal">Настройка навигатора</h1>
      {/* Прокидываем ОБА пропа, чтобы тайпскрипт не ругался */}
      <NavigatorForm initialSteps={initialSteps} formats={formats} />
    </div>
  );
}