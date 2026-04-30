import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { Modal } from "@/src/components/ui/Modal";
import { expenseSchema, type ExpenseFormValues } from "../../validations/validations";
import { ExpenseCategory } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormValues) => Promise<boolean>;
}

export const ExpenseModal = ({ isOpen, onClose, onSave }: Props) => {

  const { register, handleSubmit, reset, formState: { errors , isSubmitting } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { title: "", amount: 0, category: ExpenseCategory.STANDARD, notes: "" }
  });

  // تصفير الحقول عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      reset({ title: "", amount: 0, category: ExpenseCategory.STANDARD, notes: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ExpenseFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تسجيل مصروف جديد">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input 
          label="عنوان المصروف" 
          error={errors.title?.message}
          {...register("title")} 
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="المبلغ (شيكل)" 
            type="number" 
            step="0.01" 
            error={errors.amount?.message}
            {...register("amount", { valueAsNumber: true })}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-app-text-primary-light dark:text-app-text-primary-dark">نوع المصروف</label>
            <select 
              {...register("category")} 
              className="w-full bg-app-card-light dark:bg-app-card-dark border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-100 rounded-lg px-4 py-2.5 outline-none font-medium transition"
            >
              <option value="STANDARD">أساسي تشغيلي</option>
              <option value="EXTRA">نثريات وطوارئ</option>
            </select>
          </div>
        </div>
        <Textarea 
          label="ملاحظات (اختياري)" 
          rows={2} 
          error={errors.notes?.message}
          {...register("notes")} 
        />
        <button disabled={isSubmitting} type="submit" className="w-full bg-danger-600 text-white py-3 rounded-xl font-bold flex justify-center items-center mt-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ المصروف"}
        </button>
      </form>
    </Modal>
  );
};