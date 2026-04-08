"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getUserProfile, updateProfile, changePassword } from "@/src/server/actions/settings.actions";
import { ProfileFormValues, PasswordFormValues } from "../validations/validations";

export function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialProfile, setInitialProfile] = useState<{ name: string; phone: string; role: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getUserProfile();
      if (res.success && res.data) {
        setInitialProfile(res.data as any);
      } else {
        toast.error(res.error || "تعذر تحميل البيانات");
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    const res = await updateProfile(data);
    if (res.success) {
      toast.success("تم تحديث البيانات الشخصية بنجاح");
      return true;
    }
    toast.error(res.error || "فشل تحديث البيانات");
    return false;
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    const res = await changePassword({ currentPass: data.currentPass, newPass: data.newPass });
    if (res.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      return true;
    }
    toast.error(res.error || "فشل تغيير كلمة المرور");
    return false;
  };

  return { isLoading, initialProfile, actions: { handleProfileUpdate, handlePasswordChange } };
}