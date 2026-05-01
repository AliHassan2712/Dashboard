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
      if ("error" in res) {
        toast.error(String(res.error));
      } else if (res.data) {
        setInitialProfile(res.data);
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    const res = await updateProfile(data);
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم تحديث البيانات الشخصية بنجاح");
    return true;
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    const res = await changePassword({ currentPass: data.currentPass, newPass: data.newPass });
    if ("error" in res) {
      toast.error(String(res.error));
      return false;
    }
    toast.success("تم تغيير كلمة المرور بنجاح");
    return true;
  };

  return { isLoading, initialProfile, actions: { handleProfileUpdate, handlePasswordChange } };
}