"use client";

import { useState, useEffect } from "react";
import { getUserProfile, updateProfile, changePassword } from "@/src/features/settings/actions";
import { Input } from "@/src/components/ui/Input";
import { toast } from "react-hot-toast";
import { User, ShieldCheck, Save, Lock, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: "", phone: "", role: "" });
  
  // States لحالة الحفظ
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    const loadProfile = async () => {
      const res = await getUserProfile();
      if (res.success && res.data) {
        setProfileData({
          name: res.data.name,
          phone: res.data.phone,
          role: res.data.role
        });
      } else {
        toast.error(res.error || "تعذر تحميل البيانات");
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  // دالة حفظ الملف الشخصي
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    const res = await updateProfile({ name: profileData.name, phone: profileData.phone });
    if (res.success) {
      toast.success("تم تحديث البيانات الشخصية بنجاح");
      if (profileData.phone !== profileData.phone) {
         toast.success("ملاحظة: ستحتاج لاستخدام رقم الهاتف الجديد في تسجيل الدخول القادم", { duration: 5000 });
      }
    } else {
      toast.error(res.error);
    }
    setIsSavingProfile(false);
  };

  // دالة تغيير كلمة المرور
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPass(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const currentPass = formData.get("currentPass") as string;
    const newPass = formData.get("newPass") as string;
    const confirmPass = formData.get("confirmPass") as string;

    if (newPass !== confirmPass) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      setIsSavingPass(false);
      return;
    }

    if (newPass.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setIsSavingPass(false);
      return;
    }

    const res = await changePassword({ currentPass, newPass });
    if (res.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      form.reset();
    } else {
      toast.error(res.error);
    }
    setIsSavingPass(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h1>
        <p className="text-gray-500 text-sm mt-1">تحديث معلوماتك الشخصية وإعدادات الأمان</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* قسم البيانات الشخصية */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><User className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-gray-800">المعلومات الشخصية</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
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

            <button disabled={isSavingProfile} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2">
              {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ البيانات
            </button>
          </form>
        </div>

        {/* قسم تغيير كلمة المرور */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Lock className="w-5 h-5" /></div>
            <h2 className="text-lg font-bold text-gray-800">الأمان وكلمة المرور</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <Input 
              label="كلمة المرور الحالية" 
              name="currentPass" 
              type="password" 
              required 
            />
            <div className="border-t border-gray-100 pt-5 space-y-5">
              <Input 
                label="كلمة المرور الجديدة" 
                name="newPass" 
                type="password" 
                required 
              />
              <Input 
                label="تأكيد كلمة المرور الجديدة" 
                name="confirmPass" 
                type="password" 
                required 
              />
            </div>

            <button disabled={isSavingPass} className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2">
              {isSavingPass ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              تحديث كلمة المرور
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}