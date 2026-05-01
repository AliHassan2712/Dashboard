"use client";

import { Loader2, Settings } from "lucide-react";
import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { ProfileForm } from "@/src/features/settings/components/ProfileForm";
import { PasswordForm } from "@/src/features/settings/components/PasswordForm";

export default function SettingsPage() {
  const { isLoading, initialProfile, actions } = useSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">

      {/* الترويسة */}
      <div className="flex items-center gap-3 bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
        <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">إعدادات الحساب</h1>
          <p className="text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium mt-1">إدارة معلومات الدخول وكلمة المرور</p>
        </div>
      </div>

      {/* النماذج */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm
          initialData={initialProfile}
          onSave={actions.handleProfileUpdate}
        />

        <PasswordForm
          onSave={actions.handlePasswordChange}
        />
      </div>

    </div>
  );
}