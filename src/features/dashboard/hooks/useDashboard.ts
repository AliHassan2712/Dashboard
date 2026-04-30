"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getDashboardStats, getWorkerDashboardStats } from "@/src/server/actions/dashboard.actions";
import { DashboardStats, WorkerDashboardStats } from "@/src/types";

// دالة الجلب الموحدة للداشبورد بناءً على الصلاحية
const fetcher = async ([_, role, userId]: [string, string, string]) => {
  if (role === "ADMIN") {
    const res = await getDashboardStats();
    if (res.error) throw new Error(res.error);
    return res.data;
  } else {
    const res = await getWorkerDashboardStats(userId);
    if (res.error) throw new Error(res.error);
    return res.data;
  }
};

export function useDashboard() {
  const { data: session, status } = useSession();
  const user = session?.user as { role?: string; id?: string; name?: string } | undefined;
  
  const isAdmin = user?.role === "ADMIN";
  const userId = user?.id || "";
  const userName = user?.name || "مستخدم";
  const userRole = user?.role || "";

  // SWR: لن يبدأ الجلب إلا بعد أن نتأكد أن الـ Session قد تم تحميله (status === 'authenticated')
  const { data, isLoading: swrLoading } = useSWR(
    status === "authenticated" && userId ? ["dashboard-stats", userRole, userId] : null,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const isLoading = status === "loading" || swrLoading;

  return { 
    isAdmin, 
    userName, 
    stats: isAdmin ? (data as DashboardStats) : null, 
    workerStats: !isAdmin ? (data as WorkerDashboardStats) : null, 
    isLoading 
  };
}