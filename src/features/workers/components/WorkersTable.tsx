import Link from "next/link";
import { Trash2, ChevronLeft, FileText } from "lucide-react";
import { WorkerWithTransactions } from "@/src/types";
import { TypesWorkerTransaction } from "@prisma/client";

interface WorkersTableProps {
  workers: WorkerWithTransactions[];
  onOpenTxModal: (userId: string, type: TypesWorkerTransaction) => void; 
  onDelete: (id: string, name: string) => void;
}

export const WorkersTable = ({ workers, onOpenTxModal, onDelete }: WorkersTableProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <table className="w-full text-right text-sm">
      <thead className="bg-gray-50 text-gray-400 text-xs">
        <tr>
          <th className="p-4">الفني</th>
          <th className="p-4">الرصيد الحالي</th>
          <th className="p-4 text-center">إجراءات مالية</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {workers.map(worker => (
          <tr key={worker.id} className="hover:bg-gray-50/50 transition group">
            <td className="p-4">
              <Link href={`/workers/${worker.id}`} className="flex flex-col group-hover:text-indigo-600 transition">
                <span className="font-bold text-gray-800 decoration-indigo-200 group-hover:underline underline-offset-4">{worker.name}</span>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-1">
                  <FileText className="w-3 h-3" /> عرض كشف الحساب المفصل <ChevronLeft className="w-3 h-3" />
                </span>
              </Link>
            </td>
            <td className="p-4">
              <span className={`px-3 py-1 rounded-full font-black text-xs ${worker.currentBalance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {worker.currentBalance.toFixed(2)} ₪
              </span>
            </td>
            <td className="p-4 flex justify-center items-center gap-2">
              <button onClick={() => onOpenTxModal(worker.id, 'STAKE')} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all">استحقاق</button>
              <button onClick={() => onOpenTxModal(worker.id, 'ADVANCE')} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">سلفة</button>
              <button onClick={() => onOpenTxModal(worker.id, 'PAYOUT')} className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-black transition">تصفية</button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button onClick={() => onDelete(worker.id, worker.name)} className="p-1.5 text-gray-300 hover:text-rose-600 transition-colors" title="حذف العامل">
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);