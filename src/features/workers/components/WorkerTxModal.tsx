import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Banknote } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { TypesWorkerTransaction } from "@prisma/client";
import { workerTxSchema, type WorkerTxValues } from "../validations/validations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  initialType: TypesWorkerTransaction | null;
  onSave: (data: WorkerTxValues, userId: string) => Promise<boolean>;
}

export const WorkerTxModal = ({ isOpen, onClose, workerId, initialType, onSave }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<WorkerTxValues>({
    resolver: zodResolver(workerTxSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({ amount: 0, type: initialType || "ADVANCE", notes: "" });
    }
  }, [isOpen, initialType, reset]);

  const onSubmit = async (data: WorkerTxValues) => {
    const success = await onSave(data, workerId);
    if (success) onClose();
  };

  const title = initialType === 'STAKE' ? "إضافة استحقاق / راتب" : initialType === 'ADVANCE' ? "تسجيل سلفة / سحب" : "عملية مالية";
  const iconColor = initialType === 'STAKE' ? "text-emerald-600" : "text-rose-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><Banknote className={`w-5 h-5 ${iconColor}`} /> {title}</>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("type")} />

        <Input label="المبلغ (₪)" type="number" step="0.01" error={errors.amount?.message} {...register("amount", { valueAsNumber: true })} />
        <Input label="البيان / الملاحظات (اختياري)" placeholder="مثال: دفعة من الراتب، مكافأة إضافية..." error={errors.notes?.message} {...register("notes")} />

        <button disabled={isSubmitting} type="submit" className={`w-full text-white py-3 rounded-xl font-bold flex justify-center items-center mt-2 transition ${initialType === 'STAKE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد العملية وخصمها من الرصيد"}
        </button>
      </form>
    </Modal>
  );
};