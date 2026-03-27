import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* الشريط الجانبي (ثابت على اليمين) */}
      <Sidebar />

      {/* المحتوى الرئيسي (يأخذ باقي المساحة) */}
      <main className="flex-1 mr-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        <div className="p-6">
          {/* محتوى الصفحة */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">أهلاً بك في نظام إدارة ورشة الكمبريسور</h2>
            <p className="text-gray-500">تم تسجيل الدخول بنجاح. من هنا يمكنك إدارة جميع عمليات الورشة.</p>
          </div>
        </div>
      </main>
    </div>
  );
}