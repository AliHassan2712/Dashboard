import { memo } from "react";
import Link from "next/link";
import { Trash2, ChevronLeft, FileText } from "lucide-react";
import { TypesWorkerTransaction } from "@prisma/client";
import { WorkerWithCurrentBalance } from "@/src/types/worker.types";

interface WorkersTableProps {
  workers: WorkerWithCurrentBalance[];
  onOpenTxModal: (userId: string, type: TypesWorkerTransaction) => void; 
  onDelete: (id: string, name: string) => void;
}

export const WorkersTable = memo(({ workers, onOpenTxModal, onDelete }: WorkersTableProps) => (
  <div className="bg-app-card-light dark:bg-app-card-dark rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
    <table className="w-full text-right text-sm">
      <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-muted-light dark:text-app-text-muted-dark text-xs">
        <tr>
          <th className="p-4">الفني</th>
          <th className="p-4">الرصيد الحالي</th>
          <th className="p-4 text-center">إجراءات مالية</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {workers.length === 0 ? (
          <tr><td colSpan={3} className="text-center p-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا يوجد عمال مسجلين.</td></tr>
        ) : (
          workers.map(worker => (
            <tr key={worker.id} className="hover:bg-gray-50/50 transition group">
              <td className="p-4">
                <Link href={`/workers/${worker.id}`} className="flex flex-col group-hover:text-indigo-600 transition">
                  <span className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark decoration-brand-200 dark:decoration-brand-800 group-hover:underline underline-offset-4">{worker.name}</span>
                  <span className="text-[10px] text-app-text-muted-light dark:text-app-text-muted-dark flex items-center gap-0.5 mt-1">
                    <FileText className="w-3 h-3" /> عرض كشف الحساب المفصل <ChevronLeft className="w-3 h-3" />
                  </span>
                </Link>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full font-black text-xs ${worker.currentBalance >= 0 ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300' : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400'}`}>
                  {worker.currentBalance.toFixed(2)} ₪
                </span>
              </td>
              <td className="p-4 flex justify-center items-center gap-2">
                <button onClick={() => onOpenTxModal(worker.id, 'STAKE')} className="bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-success-100 dark:border-success-900/50 hover:bg-emerald-500 hover:text-white transition-all">استحقاق</button>
                <button onClick={() => onOpenTxModal(worker.id, 'ADVANCE')} className="bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-danger-100 dark:border-danger-900/50 hover:bg-rose-500 hover:text-white transition-all">سلفة</button>
                <button onClick={() => onOpenTxModal(worker.id, 'PAYOUT')} className="bg-zinc-900 dark:bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-black transition">تصفية</button>
                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                <button onClick={() => onDelete(worker.id, worker.name)} className="p-1.5 text-zinc-300 dark:text-zinc-600 hover:text-rose-600 transition-colors" title="حذف العامل">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
));

WorkersTable.displayName = "WorkersTable";