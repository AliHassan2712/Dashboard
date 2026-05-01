import { Phone, User, Wallet } from "lucide-react";
import { WorkerDetailsData } from "@/src/types/worker.types";

export const WorkerProfileCard = ({ worker }: { worker: WorkerDetailsData }) => (
  <div className="bg-app-card-light dark:bg-app-card-dark p-8 rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="flex items-center gap-5">
      <div className="w-16 h-16 bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center font-black text-2xl">
        {worker.name[0]}
      </div>
      <div>
        <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">{worker.name}</h1>
        <div className="flex gap-4 mt-1 text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {worker.phone}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {worker.role}</span>
        </div>
      </div>
    </div>
    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-app-border-light dark:border-app-border-dark text-left min-w-[200px]">
      <p className="text-xs font-bold text-app-text-muted-light dark:text-app-text-muted-dark uppercase mb-1 text-right">الرصيد المستحق الحالي</p>
      <div className={`text-3xl font-black flex items-center justify-end gap-2 ${worker.currentBalance >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-500'}`}>
        {worker.currentBalance.toFixed(2)} ₪
        <Wallet className="w-6 h-6" />
      </div>
    </div>
  </div>
);