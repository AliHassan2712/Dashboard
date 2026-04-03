import { ClipboardList, Plus, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";

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

export const TrialModal = ({ isOpen, onClose, formData, setFormData, isSubmitting, onSave, workers, parts }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title={<><ClipboardList className="w-5 h-5 text-indigo-600"/> تسليم قطعة كعهدة</>}>
    <form onSubmit={onSave} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700">الفني المستلم</label>
        <select value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium">
          <option value="">-- اختر الفني --</option>
          {workers.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700">القطعة</label>
        <select value={formData.sparePartId} onChange={e => setFormData({...formData, sparePartId: e.target.value})} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium">
          <option value="">-- اختر القطعة --</option>
          {parts.map((p: any) => <option key={p.id} value={p.id} disabled={p.quantity <= 0}>{p.name} (متوفر: {p.quantity})</option>)}
        </select>
      </div>

      <Input label="الكمية" type="number" min="1" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} required />
      <Textarea label="السبب / ملاحظات" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="مثلاً: لتجربتها على كمبريسور الزبون أبو محمد..." />

      <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد العهدة وخصمها من المخزن"}
      </button>
    </form>
  </Modal>
);