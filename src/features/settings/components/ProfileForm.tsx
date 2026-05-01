import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { User, ShieldCheck, Save, Loader2 } from "lucide-react";
import { profileSchema, ProfileFormValues } from "../validations/validations";

interface Props {
  initialData: { name: string; phone: string; role: string } | null;
  onSave: (data: ProfileFormValues) => Promise<boolean>;
}

export const ProfileForm = ({ initialData, onSave }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    if (initialData) reset({ name: initialData.name, phone: initialData.phone });
  }, [initialData, reset]);

  return (
    <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-lg"><User className="w-5 h-5" /></div>
        <h2 className="text-lg font-bold text-app-text-primary-light dark:text-app-text-primary-dark">المعلومات الشخصية</h2>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <Input label="الاسم الكامل" error={errors.name?.message} {...register("name")} />
        <Input label="رقم الهاتف (للدخول)" dir="ltr" className="text-right" error={errors.phone?.message} {...register("phone")} />
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-app-text-primary-light dark:text-app-text-primary-dark mb-2">الدور / الصلاحية</label>
          <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-app-border-light dark:border-app-border-dark text-app-text-secondary-light dark:text-app-text-secondary-dark px-4 py-3 rounded-lg flex items-center gap-2 font-bold cursor-not-allowed">
            <ShieldCheck className="w-4 h-4 text-success-500" />
            {initialData?.role === "ADMIN" ? "مدير النظام" : "فني / عامل"}
          </div>
        </div>

        <button disabled={isSubmitting} className="w-full mt-4 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          حفظ البيانات
        </button>
      </form>
    </div>
  );
};