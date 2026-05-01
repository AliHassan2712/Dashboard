import Link from "next/link";
import { Activity, Wallet, TrendingDown, Store, TrendingUp, Calendar, AlertTriangle, ArrowRight, Banknote, LucideIcon } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ROUTES } from "@/src/constants/paths";
import { siteConfig } from "@/src/config/site";
import { DashboardStats } from "@/src/types";

// مكون مصغر لبطاقات الإحصائيات
const StatCard = ({ title, value, icon: Icon, color, bg }: { title: string, value: number, icon: LucideIcon, color: string, bg: string }) => (  <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 ${bg} ${color} rounded-2xl`}><Icon className="w-6 h-6" /></div>
    <div>
      <p className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">{title}</p>
      <p className={`text-2xl font-black ${color}`}>₪ {Number(value).toFixed(2)}</p>
    </div>
  </div>
);

export const AdminDashboard = ({ stats }: { stats: DashboardStats | null }) => {
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-brand-300" /> مرحباً بك في {siteConfig.name}
          </h1>
          <p className="text-brand-200 font-medium">نظرة عامة على أداء الورشة، الإيرادات، والمخزون اليوم.</p>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 text-center min-w-[150px]">
          <p className="text-sm text-brand-200 font-bold mb-1">تاريخ اليوم</p>
          <p className="text-xl font-black">{new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border-2 border-success-500 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-success-50 dark:bg-success-900/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="p-3 rounded-xl bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 w-fit mb-4"><Wallet className="w-6 h-6" /></div>
            <p className="text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold">صافي الصندوق (كاش اليوم)</p>
            <h3 className="text-3xl font-black mt-1 text-success-600 dark:text-success-400">₪ {(stats.netCash || 0).toFixed(2)}</h3>
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4 lg:grid lg:grid-cols-4">
          <StatCard title="إجمالي الدخل (اليوم)" value={stats.todaysCash || 0} icon={TrendingUp} color="text-brand-600 dark:text-brand-400" bg="bg-brand-50 dark:bg-brand-950/40" />
          <StatCard title="مصروفات الدرج (اليوم)" value={stats.todaysExpenses || 0} icon={TrendingDown} color="text-danger-600 dark:text-danger-500" bg="bg-danger-50 dark:bg-danger-900/20" />
          <StatCard title="ديون الزبائن (لنا)" value={stats.totalDebts || 0} icon={Banknote} color="text-brand-600 dark:text-brand-400" bg="bg-brand-50 dark:bg-brand-950/40" />
          <StatCard title="ديون الموردين (علينا)" value={stats.totalSupplierDebts || 0} icon={Store} color="text-amber-600" bg="bg-amber-50" />
        </div>
      </div>

      {stats.chartData && stats.chartData.length > 0 && (
        <div className="bg-app-card-light dark:bg-app-card-dark p-6 sm:p-8 rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-black text-app-text-primary-light dark:text-app-text-primary-dark flex items-center gap-2">
                <Activity className="w-6 h-6 text-brand-600 dark:text-brand-400" /> الأداء المالي لآخر 7 أيام
              </h2>
              <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark text-sm mt-1 font-medium">مقارنة بين الإيرادات المحصلة والمصروفات اليومية</p>
            </div>
          </div>

          <div className="h-[300px] w-full text-xs sm:text-sm font-bold" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" name="الإيرادات (₪)" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" name="المصروفات (₪)" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-zinc-50/70 dark:bg-zinc-900/70">
            <h3 className="font-black text-app-text-primary-light dark:text-app-text-primary-dark flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-500 dark:text-brand-400" /> أحدث التذاكر</h3>
            <Link href={ROUTES.TICKETS} className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-indigo-700 flex items-center gap-1"> عرض الكل <ArrowRight className="w-4 h-4" /> </Link>
          </div>
          <table className="w-full text-right text-sm">
            <tbody className="divide-y divide-gray-50">
              {stats.recentTickets?.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">#{ticket.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-black text-app-text-primary-light dark:text-app-text-primary-dark">{ticket.customerName}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-lg text-[10px] font-black ${ticket.status === 'COMPLETED' ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400' : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'}`}>{ticket.status === 'COMPLETED' ? 'مكتمل' : 'قيد العمل'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-rose-50/30 text-danger-600 dark:text-danger-500">
            <h3 className="font-black flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> نواقص المخزون</h3>
          </div>
          <div className="p-4 space-y-3">
            {stats.lowStockParts?.map((part) => (
              <div key={part.id} className="flex justify-between items-center p-3 bg-app-card-light dark:bg-app-card-dark border border-danger-100 dark:border-danger-900/50 rounded-xl shadow-sm">
                <span className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark text-sm truncate">{part.name}</span>
                <span className="bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500 px-3 py-1 rounded-lg text-xs font-black">الكمية: {part.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};