import {  RotateCcw, AlertTriangle } from "lucide-react";


export const TrialsTable = ({ trials, onReturn, onConsume }: any) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-gray-50 text-gray-500 font-bold border-b">
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
            <tr><td colSpan={6} className="text-center py-10 text-gray-400">لا توجد قطع تجريبية (عهد) مسجلة.</td></tr>
          ) : (
            trials.map((trial: any) => (
              <tr key={trial.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-xs text-gray-500">{new Date(trial.givenAt).toLocaleDateString('ar-EG')}</td>
                <td className="p-4 font-bold text-gray-900">{trial.worker?.name || "غير محدد"}</td>
                <td className="p-4 font-bold text-indigo-600">{trial.sparePart?.name} <span className="text-xs text-gray-400">({trial.qty} حبة)</span></td>
                <td className="p-4 text-gray-500 text-xs max-w-[200px] truncate">{trial.notes || "---"}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                    trial.status === 'ACTIVE' ? 'bg-amber-50 text-amber-600' :
                    trial.status === 'RETURNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {trial.status === 'ACTIVE' ? 'نشط (معه)' : trial.status === 'RETURNED' ? 'تم الإرجاع' : 'مستهلكة'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {trial.status === 'ACTIVE' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onReturn(trial.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1" title="إرجاع للمخزن">
                        <RotateCcw className="w-3 h-3" /> إرجاع
                      </button>
                      <button onClick={() => onConsume(trial.id)} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1" title="استهلكت / تلفت">
                        <AlertTriangle className="w-3 h-3" /> استهلاك
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 font-bold">مغلقة</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);