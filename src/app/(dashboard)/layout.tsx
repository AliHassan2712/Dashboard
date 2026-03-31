import Navbar from "@/src/components/shared/Navbar";
import Sidebar from "@/src/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* الشريط الجانبي ثابت هنا وسيطبق على كل صفحات لوحة التحكم */}
      <Sidebar />

      <main className="flex-1 print:p-0 print:m-0 mr-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        {/* هنا سيتم حقن محتوى الصفحات (المخزون، التذاكر، الخ) */}
        <div className="p-6 ">
          {children}
        </div>
      </main>
    </div>
  );
}