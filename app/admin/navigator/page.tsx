import { db } from '@/lib/db';
import NavigatorForm from './NavigatorForm';

export default async function AdminNavigator() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'navigator_steps'").get() as { value: string } | undefined;
  const steps = row ? JSON.parse(row.value) : [];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Редактор Навигатора</h1>
        <p className="text-coal/60 mt-2">Настройка графа вопросов для главной страницы.</p>
      </div>
      <NavigatorForm initialSteps={steps} />
    </>
  );
}