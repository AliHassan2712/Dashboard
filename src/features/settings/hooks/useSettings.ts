"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getUserProfile, updateProfile, changePassword } from "../actions";

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: "", phone: "", role: "" });
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  // تحميل البيانات
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

  // حفظ الملف الشخصي
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    const res = await updateProfile({ name: profileData.name, phone: profileData.phone });
    if (res.success) {
      toast.success("تم تحديث البيانات الشخصية بنجاح ✨");
    } else {
      toast.error(res.error || "فشل تحديث البيانات");
    }
    setIsSavingProfile(false);
  };

  // تغيير كلمة المرور
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPass(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const currentPass = formData.get("currentPass") as string;
    const newPass = formData.get("newPass") as string;
    const confirmPass = formData.get("confirmPass") as string;

    if (newPass !== confirmPass) {
      toast.error("كلمة المرور الجديدة غير متطابقة ❌");
      setIsSavingPass(false);
      return;
    }

    if (newPass.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل ⚠️");
      setIsSavingPass(false);
      return;
    }

    const res = await changePassword({ currentPass, newPass });
    if (res.success) {
      toast.success("تم تغيير كلمة المرور بنجاح 🔒");
      form.reset();
    } else {
      toast.error(res.error || "فشل تغيير كلمة المرور");
    }
    setIsSavingPass(false);
  };

  return {
    isLoading,
    profileData,
    setProfileData,
    isSavingProfile,
    isSavingPass,
    handleProfileUpdate,
    handlePasswordChange
  };
}