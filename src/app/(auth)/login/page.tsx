import { LoginForm } from "@/src/features/auth/login/components/LoginForm";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation"; 
import { ROUTES } from "@/src/constants/routes";

export default async function LoginPage() {
  // 1. فحص هل المستخدم مسجل دخول أصلاً؟
  const session = await getServerSession(authOptions);

  // 2. إذا كان مسجلاً، اطرده فوراً إلى لوحة التحكم (الرئيسية)
  if (session) {
    redirect(`${ROUTES.HOME}`); 
  }

  // 3. إذا لم يكن مسجلاً، اعرض له صفحة تسجيل الدخول
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ورشة الكمبريسور</h1>
          <p className="text-gray-500 text-sm">تسجيل الدخول للنظام</p>
        </div>

        <LoginForm />
        
      </div>
    </div>
  );
}