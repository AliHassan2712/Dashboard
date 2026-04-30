"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getDashboardStats, getWorkerDashboardStats } from "@/src/server/actions/dashboard.actions";
import { DashboardStats, WorkerDashboardStats } from "@/src/types";

const fetcher = async ([_, role, userId]: [string, string, string]) => {
  if (role === "ADMIN") {
    const res = await getDashboardStats();
    if ("error" in res) throw new Error(String(res.error));
    return res.data;
  } else {
    const res = await getWorkerDashboardStats(userId);
    if ("error" in res) throw new Error(String(res.error));
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

  const { data, isLoading: swrLoading } = useSWR(
    status === "authenticated" && userId ? ["dashboard-stats", userRole, userId] : null,
    fetcher,
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  return { 
    isAdmin, 
    userName, 
    stats: isAdmin ? (data as DashboardStats) : null, 
    workerStats: !isAdmin ? (data as WorkerDashboardStats) : null, 
    isLoading: status === "loading" || swrLoading 
  };
}