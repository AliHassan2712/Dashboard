import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BadgeDollarSign, Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { SparePart } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  part: SparePart | null;
  onSave: (sparePartId: string, quantity: number, price: number) => Promise<boolean>;
}

export const SellPartModal = ({ isOpen, onClose, part, onSave }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { quantity: 1, price: 0 }
  });

  // تعبئة السعر الافتراضي للقطعة عند فتح النافذة
  useEffect(() => {
    if (isOpen && part) {
      reset({ quantity: 1, price: part.sellingPrice });
    }
  }, [isOpen, part, reset]);

  const onSubmit = async (data: any) => {
    if (!part) return;
    const success = await onSave(part.id, data.quantity, data.price);
    if (success) onClose();
  };

  if (!part) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><BadgeDollarSign className="w-5 h-5 text-success-600 dark:text-success-400" /> بيع مباشر من المخزن</>}>
      <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 border border-app-border-light dark:border-app-border-dark rounded-xl flex justify-between items-center">
        <div>
            <p className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{part.name}</p>
            <p className="text-xs text-app-text-secondary-light dark:text-app-text-secondary-dark mt-1">متوفر في المخزن: <span className="font-black text-brand-600 dark:text-brand-400">{part.quantity} حبة</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="الكمية المباعة"
          type="number"
          error={errors.quantity?.message as string}
          {...register("quantity", {
            valueAsNumber: true,
            min: { value: 1, message: "أقل كمية هي 1" },
            max: { value: part.quantity, message: "الكمية المطلوبة غير متوفرة في المخزن" }
          })}
        />
        
        <Input
          label="سعر البيع للقطعة الواحدة (₪)"
          type="number"
          step="0.01"
          error={errors.price?.message as string}
          {...register("price", {
            valueAsNumber: true,
            min: { value: 0, message: "السعر غير صالح" }
          })}
        />
        
        <button disabled={isSubmitting} type="submit" className="w-full bg-success-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center hover:bg-emerald-700 transition mt-2 shadow-md">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "تأكيد البيع وخصم القطع"}
        </button>
      </form>
    </Modal>
  );
};