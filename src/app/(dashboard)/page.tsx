import { getDashboardStats } from "@/src/features/dashboard/actions";
import { DashboardCharts } from "@/src/features/dashboard/components/DashboardCharts";
import { 
  Wallet, Wrench, AlertTriangle, 
  Ticket as TicketIcon, TrendingUp, AlertCircle, Banknote
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// دالة مساعدة لتنسيق وتلوين حالة التذكرة
const getStatusLabel = (status: string) => {
  const map: Record<string, { label: string, color: string }> = {
    OPEN: { label: "مفتوحة", color: "bg-yellow-100 text-yellow-800" },
    IN_PROGRESS: { label: "قيد الصيانة", color: "bg-blue-100 text-blue-800" },
    WAITING_FOR_PARTS: { label: "بانتظار قطع", color: "bg-orange-100 text-orange-800" },
    COMPLETED: { label: "مكتملة", color: "bg-green-100 text-green-800" }
  };
  return map[status] || { label: status, color: "bg-gray-100 text-gray-800" };
};

export default async function DashboardPage() {
  const result = await getDashboardStats();

  if (result.error || !result.data) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        <p className="font-bold">تعذر تحميل الإحصائيات</p>
      </div>
    );
  }

  const stats = result.data;

  // بطاقات الـ KPI
  const kpiCards = [
    { title: "الكاش اليومي (الصندوق)", value: `${stats.todaysCash.toFixed(2)} ₪`, icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "الديون المتبقية بالسوق", value: `${stats.totalDebts.toFixed(2)} ₪`, icon: Wallet, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "إجمالي إيرادات متوقعة", value: `${stats.totalExpectedRevenue.toFixed(2)} ₪`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "تذاكر قيد الصيانة", value: stats.statusCounts.IN_PROGRESS, icon: Wrench, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-500 text-sm mt-1">ملخص أداء الورشة والحالة المالية اليوم</p>
      </div>

      {/* بطاقات الإحصائيات العلوية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <div 
            key={i} 
            className={`bg-white p-6 rounded-2xl border ${card.border} shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-8 duration-700`}
            style={{ animationFillMode: "backwards", animationDelay: `${i * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <h3 className={`text-2xl font-black mt-1 ${card.color}`}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* المخطط والنواقص */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500" style={{ animationFillMode: "backwards" }}>
           <DashboardCharts data={stats.chartData} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700" style={{ animationFillMode: "backwards" }}>
          <div className="absolute top-0 right-0 w-1 h-full bg-red-500"></div>
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h3 className="font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> نواقص المخزون
            </h3>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">{stats.lowStockCount} صنف</span>
          </div>

          {stats.lowStockParts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">المخزون بوضع ممتاز، لا توجد نواقص.</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockParts.map((part: any) => (
                <div key={part.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-red-50 transition-colors">
                  <span className="text-sm font-medium text-gray-800">{part.name}</span>
                  <span className="text-xs font-black px-2 py-1 bg-white border border-red-200 text-red-600 rounded-lg shadow-sm">
                    متبقي: {part.quantity}
                  </span>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link href="/inventory" className="text-xs text-gray-500 hover:text-indigo-600 hover:underline">إدارة المخزون &rarr;</Link>
              </div>
            </div>
          )}
        </div>

        {/* أحدث التذاكر المستلمة */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000" style={{ animationFillMode: "backwards" }}>
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="font-bold flex items-center gap-2 text-gray-800">
              <TicketIcon className="w-5 h-5 text-indigo-500" /> أحدث التذاكر
            </h3>
            <Link href="/tickets" className="text-sm text-indigo-600 hover:underline font-medium">كل التذاكر</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-gray-500 text-xs">
                <tr>
                  <th className="p-3 font-medium rounded-r-lg">رقم التذكرة</th>
                  <th className="p-3 font-medium">اسم الزبون</th>
                  <th className="p-3 font-medium">تاريخ الاستلام</th>
                  <th className="p-3 font-medium rounded-l-lg">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentTickets.map((ticket: any) => {
                  const statusInfo = getStatusLabel(ticket.status);
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-bold text-gray-900 text-xs">
                        <Link href={`/tickets/${ticket.id}`} className="hover:text-indigo-600 hover:underline">
                          #{ticket.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="p-3 font-medium text-gray-800">{ticket.customerName}</td>
                      <td className="p-3 text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {stats.recentTickets.length === 0 && (
              <p className="text-center text-gray-500 py-6 text-sm">لا توجد تذاكر مسجلة بعد.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}