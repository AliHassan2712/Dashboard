"use client";

import { Loader2 } from "lucide-react";
import { useSettings } from "@/src/features/settings/hooks/useSettings";
import { ProfileForm } from "@/src/features/settings/components/ProfileForm";
import { PasswordForm } from "@/src/features/settings/components/PasswordForm";

export default function SettingsPage() {
  const { 
    isLoading, profileData, setProfileData, 
    isSavingProfile, isSavingPass, 
    handleProfileUpdate, handlePasswordChange 
  } = useSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      
      {/* الترويسة */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h1>
        <p className="text-gray-500 text-sm mt-1">تحديث معلوماتك الشخصية وإعدادات الأمان</p>
      </div>

      {/* النماذج المفصولة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <ProfileForm
          profileData={profileData} 
          setProfileData={setProfileData} 
          isSaving={isSavingProfile} 
          onSubmit={handleProfileUpdate} 
        />
        
        <PasswordForm
          isSaving={isSavingPass} 
          onSubmit={handlePasswordChange} 
        />

      </div>
    </div>
  );
}