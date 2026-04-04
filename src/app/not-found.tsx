import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4" dir="rtl">
      <h2 className="text-4xl font-black text-indigo-900 mb-2">404</h2>
      <p className="text-gray-500 font-medium mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة في النظام.</p>
      <Link 
        href={ROUTES.HOME} 
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}