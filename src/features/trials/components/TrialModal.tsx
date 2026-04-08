import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { WorkerOption, PartOption } from "@/src/types";
import { trialSchema, type TrialFormValues } from "../validations/validations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TrialFormValues) => Promise<boolean>;
  workers: WorkerOption[];
  parts: PartOption[];
}

export const TrialModal = ({ isOpen, onClose, onSave, workers, parts }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrialFormValues>({
    resolver: zodResolver(trialSchema) as Resolver<TrialFormValues>,
    defaultValues: { workerId: "", sparePartId: "", qty: 1, notes: "" }
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: TrialFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><ClipboardList className="w-5 h-5 text-indigo-600"/> تسليم قطعة كعهدة</>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">الفني المستلم</label>
          <select 
            {...register("workerId")} 
            className={`w-full bg-white border ${errors.workerId ? 'border-red-300' : 'border-gray-300'} focus:ring-2 rounded-lg px-4 py-2.5 outline-none font-medium`}
          >
            <option value="">-- اختر الفني --</option>
            {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          {errors.workerId && <p className="text-xs text-red-500 font-medium mt-1">{errors.workerId.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">القطعة</label>
          <select 
            {...register("sparePartId")} 
            className={`w-full bg-white border ${errors.sparePartId ? 'border-red-300' : 'border-gray-300'} focus:ring-2 rounded-lg px-4 py-2.5 outline-none font-medium`}
          >
            <option value="">-- اختر القطعة --</option>
            {parts.map(p => <option key={p.id} value={p.id} disabled={p.quantity <= 0}>{p.name} (متوفر: {p.quantity})</option>)}
          </select>
          {errors.sparePartId && <p className="text-xs text-red-500 font-medium mt-1">{errors.sparePartId.message}</p>}
        </div>

        <Input label="الكمية" type="number" error={errors.qty?.message} {...register("qty", { valueAsNumber: true })} />
        <Textarea label="السبب / ملاحظات" rows={2} error={errors.notes?.message} {...register("notes")} placeholder="مثلاً: لتجربتها على كمبريسور الزبون أبو محمد..." />

        <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد العهدة وخصمها من المخزن"}
        </button>
      </form>
    </Modal>
  );
};