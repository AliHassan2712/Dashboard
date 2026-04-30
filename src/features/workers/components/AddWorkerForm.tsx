import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { Plus, UserPlus, Loader2 } from "lucide-react";
import { addWorkerSchema, type AddWorkerValues } from "../validations/validations";

interface AddWorkerFormProps {
  onAdd: (data: AddWorkerValues) => Promise<boolean>; 
}

export const AddWorkerForm = ({ onAdd }: AddWorkerFormProps) => {

  const { register, handleSubmit, reset, formState: { errors ,isSubmitting } } = useForm<AddWorkerValues>({
    resolver: zodResolver(addWorkerSchema),
  });

  const onSubmit = async (data: AddWorkerValues) => {
    const success = await onAdd(data);
    if (success) reset();
  };

  return (
    <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-600 dark:text-brand-400">
        <UserPlus className="w-5 h-5" /> تسجيل فني جديد
      </h2>
      
      {/* تم إزالة items-start ليعود التمدد الافتراضي ويضبط المحاذاة */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input 
          label="الاسم" 
          error={errors.name?.message} 
          {...register("name")} 
        />
        
        <Input 
          label="الهاتف" 
          dir="ltr"
          className="text-right"
          error={errors.phone?.message} 
          {...register("phone")} 
        />
        
        <Input 
          label="كلمة المرور" 
          type="password" 
          error={errors.password?.message} 
          {...register("password")} 
        />
        
        <div className="flex items-end pb-1">
          <button 
            type="submit"
            disabled={isSubmitting} 
            className="w-full bg-brand-600 text-white h-[42px] rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} إضافة
          </button>
        </div>
      </form>
    </div>
  );
};