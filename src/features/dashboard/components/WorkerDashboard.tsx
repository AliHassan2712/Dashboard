import Link from "next/link";
import { Ticket as TicketIcon, Wallet, ClipboardList, Wrench, ArrowLeftRight } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { WorkerDashboardStats } from "@/src/types";

interface Props {
  workerStats: WorkerDashboardStats | null;
  userName: string;
}

export const WorkerDashboard = ({ workerStats, userName }: Props) => (
  <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-slate-900">أهلاً بك يا  {userName} </h1>
        <p className="text-gray-500 font-medium mt-1">إليك ملخص مهامك ورصيدك الحالي في الورشة</p>
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
      <Link href={ROUTES.TICKETS} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-indigo-600 transition-all group shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <Wrench className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
          </div>
          <div><h3 className="font-black text-lg text-gray-800">تذاكر الصيانة</h3><p className="text-gray-400 text-sm">عرض المهام والبدء بالعمل</p></div>
        </div>
        <ArrowLeftRight className="w-5 h-5 text-gray-300" />
      </Link>
      <Link href="/trials" className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-indigo-600 transition-all group shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <ClipboardList className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
          </div>
          <div><h3 className="font-black text-lg text-gray-800">العهد الشخصية</h3><p className="text-gray-400 text-sm">مراجعة القطع التي بعهدتك</p></div>
        </div>
        <ArrowLeftRight className="w-5 h-5 text-gray-300" />
      </Link>
    </div>
  </div>
);