import { LoginForm } from "@/src/features/auth/login/components/LoginForm";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation"; 
import { ROUTES } from "@/src/constants/paths";

export default async function LoginPage() {
  // 1. فحص هل المستخدم مسجل دخول أصلاً؟
  const session = await getServerSession(authOptions);

  // 2. إذا كان مسجلاً، اطرده فوراً إلى لوحة التحكم (الرئيسية)
  if (session) {
    redirect(`${ROUTES.HOME}`); 
  }

  // 3. إذا لم يكن مسجلاً، اعرض له صفحة تسجيل الدخول
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-app-card-light dark:bg-app-card-dark rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-app-text-primary-light dark:text-app-text-primary-dark mb-2">ورشة الكمبريسور</h1>
          <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark text-sm">تسجيل الدخول للنظام</p>
        </div>

        <LoginForm />
        
      </div>
    </div>
  );
}