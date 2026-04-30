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
    <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500 rounded-lg"><Lock className="w-5 h-5" /></div>
        <h2 className="text-lg font-bold text-app-text-primary-light dark:text-app-text-primary-dark">الأمان وكلمة المرور</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="كلمة المرور الحالية" type="password" error={errors.currentPass?.message} {...register("currentPass")} />
        <div className="border-t border-app-border-light dark:border-app-border-dark pt-5 space-y-5">
          <Input label="كلمة المرور الجديدة" type="password" error={errors.newPass?.message} {...register("newPass")} />
          <Input label="تأكيد كلمة المرور الجديدة" type="password" error={errors.confirmPass?.message} {...register("confirmPass")} />
        </div>

        <button disabled={isSubmitting} className="w-full mt-4 bg-zinc-950 dark:bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          تحديث كلمة المرور
        </button>
      </form>
    </div>
  );
};