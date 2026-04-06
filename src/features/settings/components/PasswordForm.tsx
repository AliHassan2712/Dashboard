import { FormEvent } from "react";
import { Input } from "@/src/components/ui/Input";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";

interface PasswordFormProps {
  isSaving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const PasswordForm = ({ isSaving, onSubmit }: PasswordFormProps) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
    <div className="flex items-center gap-3 mb-6 border-b pb-4">
      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Lock className="w-5 h-5" /></div>
      <h2 className="text-lg font-bold text-gray-800">الأمان وكلمة المرور</h2>
    </div>

    <form onSubmit={onSubmit} className="space-y-5">
      <Input label="كلمة المرور الحالية" name="currentPass" type="password" required />
      <div className="border-t border-gray-100 pt-5 space-y-5">
        <Input label="كلمة المرور الجديدة" name="newPass" type="password" required />
        <Input label="تأكيد كلمة المرور الجديدة" name="confirmPass" type="password" required />
      </div>

      <button disabled={isSaving} className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2">
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
        تحديث كلمة المرور
      </button>
    </form>
  </div>
);