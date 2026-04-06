import { Dispatch, SetStateAction, FormEvent } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { TrialFormData, WorkerOption, PartOption } from "@/src/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: TrialFormData;
  setFormData: Dispatch<SetStateAction<TrialFormData>>;
  isSubmitting: boolean;
  onSave: (e: FormEvent) => void;
  workers: WorkerOption[];
  parts: PartOption[];
}

export const TrialModal = ({ isOpen, onClose, formData, setFormData, isSubmitting, onSave, workers, parts }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} title={<><ClipboardList className="w-5 h-5 text-indigo-600"/> تسليم قطعة كعهدة</>}>
    <form onSubmit={onSave} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700">الفني المستلم</label>
        <select value={formData.workerId} onChange={e => setFormData({...formData, workerId: e.target.value})} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium">
          <option value="">-- اختر الفني --</option>
          {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700">القطعة</label>
        <select value={formData.sparePartId} onChange={e => setFormData({...formData, sparePartId: e.target.value})} required className="w-full bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium">
          <option value="">-- اختر القطعة --</option>
          {parts.map(p => <option key={p.id} value={p.id} disabled={p.quantity <= 0}>{p.name} (متوفر: {p.quantity})</option>)}
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