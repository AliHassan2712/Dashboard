import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { passwordSchema, PasswordFormValues } from "../validations/validations";

interface Props {
  onSave: (data: PasswordFormValues) => Promise<boolean>;
}

export const PasswordForm = ({ onSave }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    const success = await onSave(data);
    if (success) reset(); // تصفير الحقول بعد النجاح
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Lock className="w-5 h-5" /></div>
        <h2 className="text-lg font-bold text-gray-800">الأمان وكلمة المرور</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="كلمة المرور الحالية" type="password" error={errors.currentPass?.message} {...register("currentPass")} />
        <div className="border-t border-gray-100 pt-5 space-y-5">
          <Input label="كلمة المرور الجديدة" type="password" error={errors.newPass?.message} {...register("newPass")} />
          <Input label="تأكيد كلمة المرور الجديدة" type="password" error={errors.confirmPass?.message} {...register("confirmPass")} />
        </div>

        <button disabled={isSubmitting} className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          تحديث كلمة المرور
        </button>
      </form>
    </div>
  );
};