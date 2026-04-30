import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { Loader2 } from "lucide-react";
import { sparePartSchema, type SparePartFormValues } from "../validations/validations";
import { SparePart } from "@prisma/client";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: SparePart | null | undefined;
  onSave: (data: SparePartFormValues) => Promise<boolean>;
}

export const InventoryModal = ({ isOpen, onClose, editData, onSave }: InventoryModalProps) => {
  const { register, handleSubmit, reset, formState: { errors ,isSubmitting } } = useForm<SparePartFormValues>({
    resolver: zodResolver(sparePartSchema) as any,
    defaultValues: { quantity: 0, averageCost: 0, sellingPrice: 0, lowStockAlert: 5 }
  });

  // تعبئة البيانات تلقائياً في حالة "التعديل"، أو تصفيرها في حالة "الإضافة"
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        reset({
          name: editData.name,
          quantity: editData.quantity,
          averageCost: editData.averageCost || 0,
          sellingPrice: editData.sellingPrice,
          lowStockAlert: editData.lowStockAlert
        });
      } else {
        reset({ name: "", quantity: 0, averageCost: 0, sellingPrice: 0, lowStockAlert: 5 });
      }
    }
  }, [isOpen, editData, reset]);

  const onSubmit = async (data: SparePartFormValues) => {
    const success = await onSave(data);
    if (success) onClose(); 
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editData ? "تعديل بيانات القطعة" : "إضافة قطعة جديدة"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input 
          label="اسم القطعة" 
          error={errors.name?.message}
          {...register("name")} 
        />
        
        <Input 
          label="الكمية المتوفرة" 
          type="number" 
          error={errors.quantity?.message}
          {...register("quantity")} 
        />

        <div className="grid grid-cols-2 gap-4 border-t border-app-border-light dark:border-app-border-dark pt-4 mt-2">
          <Input 
            label="سعر التكلفة/الشراء (₪)" 
            type="number" step="0.01" 
            error={errors.averageCost?.message}
            {...register("averageCost")} 
          />
          <Input 
            label="سعر البيع للزبون (₪)" 
            type="number" step="0.01" 
            error={errors.sellingPrice?.message}
            {...register("sellingPrice")} 
          />
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
          <Input 
            label="تنبيه النواقص (متى يظهر التنبيه؟)" 
            type="number" 
            error={errors.lowStockAlert?.message}
            {...register("lowStockAlert")} 
          />
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ بيانات القطعة"}
        </button>
      </form>
    </Modal>
  );
};