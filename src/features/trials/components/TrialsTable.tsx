import { memo } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { TrialItemData } from "@/src/types";

interface Props {
  trials: TrialItemData[];
  onReturn: (id: string) => void;
  onConsume: (id: string) => void;
}

export const TrialsTable = memo(({ trials, onReturn, onConsume }: Props) => (
  <div className="bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold border-b">
          <tr>
            <th className="p-4">تاريخ التسليم</th>
            <th className="p-4">الفني</th>
            <th className="p-4">القطعة (الكمية)</th>
            <th className="p-4">الملاحظات</th>
            <th className="p-4 text-center">الحالة</th>
            <th className="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {trials.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا توجد قطع تجريبية (عهد) مسجلة.</td></tr>
          ) : (
            trials.map(trial => (
              <tr key={trial.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-xs text-app-text-secondary-light dark:text-app-text-secondary-dark">{new Date(trial.givenAt).toLocaleDateString('ar-EG')}</td>
                <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{trial.worker?.name || "غير محدد"}</td>
                <td className="p-4 font-bold text-brand-600 dark:text-brand-400">{trial.sparePart?.name} <span className="text-xs text-app-text-muted-light dark:text-app-text-muted-dark">({trial.qty} حبة)</span></td>
                <td className="p-4 text-app-text-secondary-light dark:text-app-text-secondary-dark text-xs max-w-[200px] truncate">{trial.notes || "---"}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                    trial.status === 'ACTIVE' ? 'bg-amber-50 text-amber-600' :
                    trial.status === 'RETURNED' ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400' : 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500'
                  }`}>
                    {trial.status === 'ACTIVE' ? 'نشط (معه)' : trial.status === 'RETURNED' ? 'تم الإرجاع' : 'مستهلكة'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {trial.status === 'ACTIVE' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onReturn(trial.id)} className="px-3 py-1.5 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1" title="إرجاع للمخزن">
                        <RotateCcw className="w-3 h-3" /> إرجاع
                      </button>
                      <button onClick={() => onConsume(trial.id)} className="px-3 py-1.5 bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1" title="استهلكت / تلفت">
                        <AlertTriangle className="w-3 h-3" /> استهلاك
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-300 dark:text-zinc-600 font-bold">مغلقة</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
));

TrialsTable.displayName = "TrialsTable";