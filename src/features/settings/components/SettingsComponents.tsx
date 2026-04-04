import { Input } from "@/src/components/ui/Input";
import { User, ShieldCheck, Save, Lock, Loader2 } from "lucide-react";

// --- 1. مكون تحديث البيانات الشخصية ---
export const ProfileForm = ({ profileData, setProfileData, isSaving, onSubmit }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
    <div className="flex items-center gap-3 mb-6 border-b pb-4">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User className="w-5 h-5" /></div>
      <h2 className="text-lg font-bold text-gray-800">المعلومات الشخصية</h2>
    </div>

    <form onSubmit={onSubmit} className="space-y-5">
      <Input 
        label="الاسم الكامل" 
        value={profileData.name} 
        onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
        required 
      />
      <Input 
        label="رقم الهاتف (للدخول)" 
        value={profileData.phone} 
        onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
        dir="ltr" 
        className="text-right" 
        required 
      />
      
      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">الدور / الصلاحية</label>
        <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 px-4 py-3 rounded-lg flex items-center gap-2 font-bold cursor-not-allowed">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {profileData.role === "ADMIN" ? "مدير النظام" : "فني / عامل"}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">* لا يمكنك تغيير صلاحيتك بنفسك.</p>
      </div>

      <button disabled={isSaving} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2">
        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        حفظ البيانات
      </button>
    </form>
  </div>
);

// --- 2. مكون تغيير كلمة المرور ---
export const PasswordForm = ({ isSaving, onSubmit }: any) => (
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