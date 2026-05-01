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
    <div id="printable-report" className="bg-app-card-light dark:bg-app-card-dark border border-app-border-light dark:border-app-border-dark shadow-xl rounded-2xl mx-auto overflow-hidden font-sans flex flex-col print:shadow-none print:border-none">
      <div className="h-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 shrink-0"></div>
      
      <div className="p-8 sm:p-10 flex-1 flex flex-col">
        {/* الترويسة */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-app-border-light dark:border-app-border-dark pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-3xl">
              {siteConfig.name.charAt(5)}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">كشف الميزانية والتدفقات</h1>
              <p className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark mt-1">{siteConfig.name}</p>
            </div>
          </div>
          <div className="text-left text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark space-y-1">
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
            <h3 className="font-black text-success-700 dark:text-success-300 flex items-center gap-2 border-b-2 border-success-100 dark:border-success-900/50 pb-2">
              <TrendingUp className="w-5 h-5" /> الأصول الملموسة والمستحقات (+)
            </h3>
            <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-xl flex justify-between items-center border border-success-100 dark:border-success-900/50">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-success-500" />
                <div><p className="text-sm font-bold text-emerald-900">البضاعة بالمخزن</p></div>
              </div>
              <p className="font-black text-xl text-success-700 dark:text-success-300">₪ {data.inventoryCost.toLocaleString()}</p>
            </div>
            <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-xl flex justify-between items-center border border-success-100 dark:border-success-900/50">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-success-500" />
                <div><p className="text-sm font-bold text-emerald-900">ديون الزبائن لنا</p></div>
              </div>
              <p className="font-black text-xl text-success-700 dark:text-success-300">₪ {data.totalCustomerDebts.toLocaleString()}</p>
            </div>
            <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-xl flex justify-between items-center border border-success-100 dark:border-success-900/50">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-success-500" />
                <div><p className="text-sm font-bold text-emerald-900">إجمالي الصندوق (تراكمي)</p></div>
              </div>
              <p className="font-black text-xl text-success-700 dark:text-success-300">₪ {data.totalNetCashAllTime.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-danger-700 dark:text-danger-400 flex items-center gap-2 border-b-2 border-danger-100 dark:border-danger-900/50 pb-2">
              <TrendingDown className="w-5 h-5" /> الالتزامات المالية (-)
            </h3>
            <div className="bg-danger-50 dark:bg-danger-900/20 p-4 rounded-xl flex justify-between items-center border border-danger-100 dark:border-danger-900/50">
              <div className="flex items-center gap-3">
                <Store className="w-8 h-8 text-danger-500" />
                <div><p className="text-sm font-bold text-rose-900">ديون التجار علينا</p></div>
              </div>
              <p className="font-black text-xl text-danger-700 dark:text-danger-400">₪ {data.totalSupplierDebts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* التدفقات النقدية */}
        <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 rounded-xl p-4 mb-4 flex items-center gap-3">
          <CalendarRange className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <div>
            <h3 className="font-black text-brand-950 dark:text-brand-100 text-sm">التدفقات النقدية (الإيراد والمصروف)</h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{periodText}</p>
          </div>
        </div>

        <div className="bg-app-card-light dark:bg-app-card-dark rounded-xl border border-app-border-light dark:border-app-border-dark overflow-hidden shadow-sm">
          <table className="w-full text-right text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold">
              <tr>
                <th className="p-4">البيان</th>
                <th className="p-4 border-r border-app-border-light dark:border-app-border-dark">الداخل للصندوق (+)</th>
                <th className="p-4 border-r border-app-border-light dark:border-app-border-dark">الخارج من الصندوق (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">إيرادات التذاكر والمبيعات</td>
                <td className="p-4 font-black text-success-600 dark:text-success-400 border-r border-app-border-light dark:border-app-border-dark">₪ {data.period.revenue.toLocaleString()}</td>
                <td className="p-4 text-app-text-muted-light dark:text-app-text-muted-dark border-r border-app-border-light dark:border-app-border-dark">---</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">المصروفات التشغيلية</td>
                <td className="p-4 text-app-text-muted-light dark:text-app-text-muted-dark border-r border-app-border-light dark:border-app-border-dark">---</td>
                <td className="p-4 font-black text-danger-600 dark:text-danger-500 border-r border-app-border-light dark:border-app-border-dark">₪ {data.period.expenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">دفعات للتجار والموردين</td>
                <td className="p-4 text-app-text-muted-light dark:text-app-text-muted-dark border-r border-app-border-light dark:border-app-border-dark">---</td>
                <td className="p-4 font-black text-danger-600 dark:text-danger-500 border-r border-app-border-light dark:border-app-border-dark">₪ {data.period.purchasesPaid.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">رواتب وسلف العمال</td>
                <td className="p-4 text-app-text-muted-light dark:text-app-text-muted-dark border-r border-app-border-light dark:border-app-border-dark">---</td>
                <td className="p-4 font-black text-danger-600 dark:text-danger-500 border-r border-app-border-light dark:border-app-border-dark">₪ {data.period.workerPayments.toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="bg-brand-50 dark:bg-brand-950/40 font-black text-base border-t-2 border-brand-200 dark:border-brand-900/60">
              <tr>
                <td className="p-4 text-brand-950 dark:text-brand-100">صافي الصندوق في هذه الفترة</td>
                <td colSpan={2} className={`p-4 text-center border-r border-brand-200 dark:border-brand-900/60 ${data.period.netCash >= 0 ? 'text-success-700 dark:text-success-300' : 'text-danger-700 dark:text-danger-400'}`}>
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