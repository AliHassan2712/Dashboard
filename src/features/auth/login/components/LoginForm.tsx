"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../validations";
import { Input } from "@/src/components/ui/Input"; 
import { ROUTES } from "@/src/constants/routes";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await signIn("credentials", { ...data, redirect: false });
    setIsLoading(false);

    if (result?.error) setError(result.error);
    else { router.push(`${ROUTES.HOME}`); router.refresh(); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="رقم الهاتف"
        placeholder="0599999999"
        dir="ltr"
        className="text-right"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        label="كلمة المرور"
        type="password"
        placeholder="••••••"
        dir="ltr"
        className="text-right"
        error={errors.password?.message}
        {...register("password")}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition disabled:opacity-70"
      >
        {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}