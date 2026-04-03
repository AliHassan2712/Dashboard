"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Banknote, TrendingDown, Store, Wallet, TrendingUp,
  AlertTriangle, TicketIcon, Package, ArrowRight, Activity,
  Loader2, Calendar, Wrench, CheckCircle, Clock, ClipboardList,
  User, ArrowLeftRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getDashboardStats, getWorkerDashboardStats } from "@/src/features/dashboard/actions";
import { siteConfig } from "@/src/config/site";

// مكون فرعي لبطاقات الإحصائيات
const StatCard = ({ title, value, icon: Icon, color, bg, isCurrency = true }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 ${bg} ${color} rounded-2xl`}><Icon className="w-6 h-6" /></div>
    <div>
      <p className="text-sm font-bold text-gray-500">{title}</p>
      <p className={`text-2xl font-black ${color}`}>
        {isCurrency ? `₪ ${Number(value).toFixed(2)}` : value}
      </p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const userId = (session?.user as any)?.id;

  const [stats, setStats] = useState<any>(null);
  const [workerStats, setWorkerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      if (isAdmin) {
        const res = await getDashboardStats();
        if (res.success) setStats(res.data);
      } else if (userId) {
        const res = await getWorkerDashboardStats(userId);
        if (res.success) setWorkerStats(res.data);
      }
      setIsLoading(false);
    };
    fetchAllData();
  }, [isAdmin, userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ==========================================
  // 🔵 واجهة الفني (WORKER VIEW)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">أهلاً بك يا بطل، {session?.user?.name} 👋</h1>
            <p className="text-gray-500 font-medium mt-1">إليك ملخص مهامك ورصيدك الحالي في الورشة</p>
          </div>
          <div className="hidden sm:block p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <User className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <TicketIcon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <p className="text-indigo-100 font-bold text-sm mb-1">تذاكر قيد العمل</p>
            <h2 className="text-4xl font-black">{workerStats?.openTicketsCount || 0}</h2>
          </div>

          <div className={`${(workerStats?.balance || 0) >= 0 ? 'bg-emerald-600' : 'bg-rose-600'} text-white p-6 rounded-3xl shadow-lg relative overflow-hidden`}>
            <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <p className="opacity-80 font-bold text-sm mb-1">رصيدك المالي (مستحقاتك)</p>
            <h2 className="text-4xl font-black">₪ {(workerStats?.balance || 0).toFixed(2)}</h2>
          </div>

          <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <ClipboardList className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
            <p className="text-slate-400 font-bold text-sm mb-1">قطع (عهدة) بعهدتك</p>
            <h2 className="text-4xl font-black">{workerStats?.activeTrials || 0}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/tickets" className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-indigo-600 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                <Wrench className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-800">تذاكر الصيانة</h3>
                <p className="text-gray-400 text-sm">عرض المهام والبدء بالعمل</p>
              </div>
            </div>
            <ArrowLeftRight className="w-5 h-5 text-gray-300" />
          </Link>

          <Link href="/trials" className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-indigo-600 transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                <ClipboardList className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-800">العهد الشخصية</h3>
                <p className="text-gray-400 text-sm">مراجعة القطع التي بعهدتك</p>
              </div>
            </div>
            <ArrowLeftRight className="w-5 h-5 text-gray-300" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🔴 واجهة المدير (ADMIN VIEW)
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">

      {/* الترويسة */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-300" />
            مرحباً بك في {siteConfig.name}
          </h1>
          <p className="text-indigo-200 font-medium">نظرة عامة على أداء الورشة، الإيرادات، والمخزون اليوم.</p>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 text-center min-w-[150px]">
          <p className="text-sm text-indigo-200 font-bold mb-1">تاريخ اليوم</p>
          <p className="text-xl font-black">{new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}</p>
        </div>
      </div>

      {/* القسم المالي */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-600" /> الملخص المالي والتجاري
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 w-fit mb-4"><Wallet className="w-6 h-6" /></div>
              <p className="text-sm text-gray-600 font-bold">صافي الصندوق (كاش اليوم)</p>
              <h3 className="text-3xl font-black mt-1 text-emerald-600">₪ {(stats?.netCash || 0).toFixed(2)}</h3>
              <p className="text-[10px] text-gray-400 mt-2 font-bold">(المستلم - المصروف)</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:grid lg:grid-cols-4">
            <StatCard title="إجمالي الدخل (اليوم)" value={stats?.todaysCash || 0} icon={TrendingUp} color="text-indigo-600" bg="bg-indigo-50" />
            <StatCard title="مصروفات الدرج (اليوم)" value={stats?.todaysExpenses || 0} icon={TrendingDown} color="text-rose-600" bg="bg-rose-50" />
            <StatCard title="ديون الزبائن (لنا)" value={stats?.totalDebts || 0} icon={Banknote} color="text-blue-600" bg="bg-blue-50" />
            <StatCard title="ديون الموردين (علينا)" value={stats?.totalSupplierDebts || 0} icon={Store} color="text-amber-600" bg="bg-amber-50" />
          </div>
        </div>

        {/* المخطط البياني */}
        {stats?.chartData && stats.chartData.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" /> الأداء المالي لآخر 7 أيام
                </h2>
                <p className="text-gray-500 text-sm mt-1 font-medium">مقارنة بين الإيرادات المحصلة والمصروفات اليومية</p>
              </div>
            </div>

            <div className="h-[300px] w-full text-xs sm:text-sm font-bold">
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
      </div>

      {/* الحالة التشغيلية */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-indigo-600" /> حالة التذاكر والصيانة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="إجمالي التذاكر" value={stats?.totalTickets || 0} isCurrency={false} icon={TicketIcon} color="text-gray-700" bg="bg-gray-100" />
          <StatCard title="مفتوحة (قيد الانتظار)" value={stats?.statusCounts?.OPEN || 0} isCurrency={false} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          <StatCard title="قيد العمل والصيانة" value={stats?.statusCounts?.IN_PROGRESS || 0} isCurrency={false} icon={Activity} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="مكتملة وجاهزة" value={stats?.statusCounts?.COMPLETED || 0} isCurrency={false} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
        </div>
      </div>

      {/* الجداول السريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" /> أحدث التذاكر</h3>
            <Link href="/tickets" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"> عرض الكل <ArrowRight className="w-4 h-4" /> </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <tbody className="divide-y divide-gray-50">
                {stats?.recentTickets?.map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-500">#{ticket.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 font-black text-gray-800">{ticket.customerName}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${ticket.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {ticket.status === 'COMPLETED' ? 'مكتمل' : 'قيد العمل'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-rose-50/30 text-rose-600">
            <h3 className="font-black flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> نواقص المخزون</h3>
          </div>
          <div className="p-4 space-y-3">
            {stats?.lowStockParts?.map((part: any) => (
              <div key={part.id} className="flex justify-between items-center p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
                <span className="font-bold text-gray-800 text-sm truncate">{part.name}</span>
                <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-black">الكمية: {part.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}