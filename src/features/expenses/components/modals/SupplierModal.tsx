import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { supplierSchema, type SupplierFormValues } from "../../validations/validations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onSave: (data: SupplierFormValues) => Promise<boolean>;
}

export const SupplierModal = ({ isOpen, onClose, onBack, onSave }: Props) => {

  const { register, handleSubmit, reset, formState: { errors ,isSubmitting } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", phone: "" }
  });

  useEffect(() => { if (isOpen) reset({ name: "", phone: "" }); }, [isOpen, reset]);

  const onSubmit = async (data: SupplierFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" /> إضافة مورد جديد</>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="اسم التاجر / الشركة" error={errors.name?.message} {...register("name")} />
        <Input label="رقم الجوال (اختياري)" dir="ltr" className="text-right" error={errors.phone?.message} {...register("phone")} />
        
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-app-text-primary-light dark:text-app-text-primary-dark py-3 rounded-xl font-bold transition hover:bg-gray-200">رجوع للفاتورة</button>
          <button disabled={isSubmitting} type="submit" className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold flex justify-center items-center transition hover:bg-indigo-700">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة التاجر"}
          </button>
        </div>
      </form>
    </Modal>
  );
};