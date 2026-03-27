import {LoginForm} from "@/src/features/auth/login/components/LoginForm";
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ورشة الكمبريسور</h1>
          <p className="text-gray-500 text-sm">تسجيل الدخول للنظام</p>
        </div>

        {/* استدعاء الواجهة المفصولة هنا */}
        <LoginForm />
        
      </div>
    </div>
  );
}