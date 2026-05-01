import Link from 'next/link';
import { ROUTES } from '@/src/constants/paths';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-center px-4" dir="rtl">
      <h2 className="text-4xl font-black text-brand-950 dark:text-brand-100 mb-2">404</h2>
      <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة في النظام.</p>
      <Link 
        href={ROUTES.HOME} 
        className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}