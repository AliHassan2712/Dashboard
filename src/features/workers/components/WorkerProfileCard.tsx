import { Phone, User, Wallet } from "lucide-react";
import { WorkerDetailsData } from "@/src/types/worker.types";

export const WorkerProfileCard = ({ worker }: { worker: WorkerDetailsData }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="flex items-center gap-5">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl">
        {worker.name[0]}
      </div>
      <div>
        <h1 className="text-2xl font-black text-gray-900">{worker.name}</h1>
        <div className="flex gap-4 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {worker.phone}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {worker.role}</span>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left min-w-[200px]">
      <p className="text-xs font-bold text-gray-400 uppercase mb-1 text-right">الرصيد المستحق الحالي</p>
      <div className={`text-3xl font-black flex items-center justify-end gap-2 ${worker.currentBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
        {worker.currentBalance.toFixed(2)} ₪
        <Wallet className="w-6 h-6" />
      </div>
    </div>
  </div>
);