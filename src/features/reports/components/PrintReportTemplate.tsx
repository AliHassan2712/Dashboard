import { Building2, Wallet, Package, Store, Users, TrendingUp, TrendingDown, CalendarRange } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { FinancialReportData } from "@/src/types";

interface Props {
  data: FinancialReportData;
}

export const PrintReportTemplate = ({ data }: Props) => {
  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString('ar-EG');
  
  const hasPeriodFilter = data.period.startDate || data.period.endDate;
  const periodText = hasPeriodFilter 
    ? `من ${data.period.startDate ? new Date(data.period.startDate).toLocaleDateString('ar-EG') : 'البداية'} إلى ${data.period.endDate ? new Date(data.period.endDate).toLocaleDateString('ar-EG') : 'اليوم'}`
    : "لكل الأوقات (تراكمي شامل)";

  return (
    <div id="printable-report" className="bg-white border border-gray-200 shadow-xl rounded-2xl mx-auto overflow-hidden font-sans flex flex-col print:shadow-none print:border-none">
      <div className="h-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 shrink-0"></div>
      
      <div className="p-8 sm:p-10 flex-1 flex flex-col">
        {/* الترويسة */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-3xl">
              {siteConfig.name.charAt(5)}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">كشف الميزانية والتدفقات</h1>
              <p className="text-sm font-bold text-gray-500 mt-1">{siteConfig.name}</p>
            </div>
          </div>
          <div className="text-left text-sm font-bold text-gray-600 space-y-1">
            <p>تاريخ التقرير: {today}</p>
            <p>وقت الإصدار: {time}</p>
          </div>
        </div>

        {/* الكارت الرئيسي (رأس المال الكلي) */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 mb-8 shadow-lg flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-slate-300 font-bold mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> صافي الأصول (قيمة الورشة الكلية اليوم)
            </p>
            <h2 className={`text-4xl sm:text-5xl font-black tracking-tight ${data.totalAssets >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₪ {data.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-slate-400 mt-3 font-medium">
              * المعادلة: (السيولة + ديون الزبائن + المخزون) - (ديون التجار).
            </p>
          </div>
        </div>

        {/* شبكة الأصول الثابتة */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-black text-emerald-700 flex items-center gap-2 border-b-2 border-emerald-100 pb-2">
              <TrendingUp className="w-5 h-5" /> الأصول الملموسة والمستحقات (+)
            </h3>
            <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center border border-emerald-100">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-500" />
                <div><p className="text-sm font-bold text-emerald-900">البضاعة بالمخزن</p></div>
              </div>
              <p className="font-black text-xl text-emerald-700">₪ {data.inventoryCost.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center border border-emerald-100">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-500" />
                <div><p className="text-sm font-bold text-emerald-900">ديون الزبائن لنا</p></div>
              </div>
              <p className="font-black text-xl text-emerald-700">₪ {data.totalCustomerDebts.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center border border-emerald-100">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-emerald-500" />
                <div><p className="text-sm font-bold text-emerald-900">إجمالي الصندوق (تراكمي)</p></div>
              </div>
              <p className="font-black text-xl text-emerald-700">₪ {data.totalNetCashAllTime.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-rose-700 flex items-center gap-2 border-b-2 border-rose-100 pb-2">
              <TrendingDown className="w-5 h-5" /> الالتزامات المالية (-)
            </h3>
            <div className="bg-rose-50 p-4 rounded-xl flex justify-between items-center border border-rose-100">
              <div className="flex items-center gap-3">
                <Store className="w-8 h-8 text-rose-500" />
                <div><p className="text-sm font-bold text-rose-900">ديون التجار علينا</p></div>
              </div>
              <p className="font-black text-xl text-rose-700">₪ {data.totalSupplierDebts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* التدفقات النقدية */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4 flex items-center gap-3">
          <CalendarRange className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="font-black text-indigo-900 text-sm">التدفقات النقدية (الإيراد والمصروف)</h3>
            <p className="text-xs text-indigo-600 font-bold">{periodText}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="p-4">البيان</th>
                <th className="p-4 border-r border-gray-200">الداخل للصندوق (+)</th>
                <th className="p-4 border-r border-gray-200">الخارج من الصندوق (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-bold text-gray-800">إيرادات التذاكر والمبيعات</td>
                <td className="p-4 font-black text-emerald-600 border-r border-gray-100">₪ {data.period.revenue.toLocaleString()}</td>
                <td className="p-4 text-gray-400 border-r border-gray-100">---</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-800">المصروفات التشغيلية</td>
                <td className="p-4 text-gray-400 border-r border-gray-100">---</td>
                <td className="p-4 font-black text-rose-600 border-r border-gray-100">₪ {data.period.expenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-800">دفعات للتجار والموردين</td>
                <td className="p-4 text-gray-400 border-r border-gray-100">---</td>
                <td className="p-4 font-black text-rose-600 border-r border-gray-100">₪ {data.period.purchasesPaid.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-gray-800">رواتب وسلف العمال</td>
                <td className="p-4 text-gray-400 border-r border-gray-100">---</td>
                <td className="p-4 font-black text-rose-600 border-r border-gray-100">₪ {data.period.workerPayments.toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="bg-indigo-50 font-black text-base border-t-2 border-indigo-200">
              <tr>
                <td className="p-4 text-indigo-900">صافي الصندوق في هذه الفترة</td>
                <td colSpan={2} className={`p-4 text-center border-r border-indigo-200 ${data.period.netCash >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ₪ {data.period.netCash.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  );
};