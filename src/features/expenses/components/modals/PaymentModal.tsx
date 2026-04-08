import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Modal } from "@/src/components/ui/Modal";
import { paymentSchema, type PaymentFormValues } from "../../validations/validations";
import { Supplier } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  editData?: PaymentFormValues | null; 
  onSave: (data: PaymentFormValues) => Promise<boolean>;
}

export const PaymentModal = ({ isOpen, onClose, suppliers, editData, onSave }: Props) => {

  const { register, handleSubmit, reset, formState: { errors ,isSubmitting } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { supplierId: "", amount: 0, notes: "" }
  });

  // تعبئة البيانات عند الفتح للتعديل، أو تصفيرها للإضافة
  useEffect(() => {
    if (isOpen) {
      reset(editData || { supplierId: "", amount: 0, notes: "" });
    }
  }, [isOpen, editData, reset]);

  const onSubmit = async (data: PaymentFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><Wallet className="w-5 h-5 text-emerald-600" /> {editData ? "تعديل دفعة التاجر" : "تسديد دفعة لتاجر"}</>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">اختر التاجر المراد التسديد له</label>
          <select 
            {...register("supplierId")} 
            className={`w-full bg-white border ${errors.supplierId ? 'border-red-300 focus:ring-red-100' : 'border-gray-300 focus:ring-indigo-100'} focus:ring-2 rounded-lg px-4 py-2.5 outline-none font-medium transition`}
          >
            <option value="">-- اختر من القائمة --</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} (دين: ₪{s.totalDebt})</option>)}
          </select>
          {errors.supplierId && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.supplierId.message}</p>}
        </div>
        
        <Input 
          label="المبلغ المسدد (كاش/تحويل)" 
          type="number" step="0.01" 
          error={errors.amount?.message} 
          {...register("amount", { valueAsNumber: true })} 
        />
        
        <Textarea 
          label="البيان / ملاحظات الدفع (اختياري)" 
          rows={2} 
          error={errors.notes?.message} 
          {...register("notes")} 
        />
        
        <button disabled={isSubmitting} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-emerald-700 mt-2 transition">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الدفعة وخصمها من الدين"}
        </button>
      </form>
    </Modal>
  );
};