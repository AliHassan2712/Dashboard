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
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User className="w-5 h-5" /></div>
        <h2 className="text-lg font-bold text-gray-800">المعلومات الشخصية</h2>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <Input label="الاسم الكامل" error={errors.name?.message} {...register("name")} />
        <Input label="رقم الهاتف (للدخول)" dir="ltr" className="text-right" error={errors.phone?.message} {...register("phone")} />
        
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">الدور / الصلاحية</label>
          <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg flex items-center gap-2 font-bold cursor-not-allowed">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {initialData?.role === "ADMIN" ? "مدير النظام" : "فني / عامل"}
          </div>
        </div>

        <button disabled={isSubmitting} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          حفظ البيانات
        </button>
      </form>
    </div>
  );
};