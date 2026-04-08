"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDashboardStats, getWorkerDashboardStats } from "@/src/server/actions/dashboard.actions";
import { DashboardStats, WorkerDashboardStats } from "@/src/types";

export function useDashboard() {
  const { data: session } = useSession();
  const user = session?.user as { role?: string; id?: string; name?: string } | undefined;
  
  const isAdmin = user?.role === "ADMIN";
  const userId = user?.id;
  const userName = user?.name || "مستخدم";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workerStats, setWorkerStats] = useState<WorkerDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      if (isAdmin) {
        const res = await getDashboardStats();
        if (res.success && res.data) setStats(res.data as DashboardStats);
      } else if (userId) {
        const res = await getWorkerDashboardStats(userId);
        if (res.success && res.data) setWorkerStats(res.data as WorkerDashboardStats);
      }
      setIsLoading(false);
    };
    
    if (userId) fetchAllData();
  }, [isAdmin, userId]);

  return { isAdmin, userName, stats, workerStats, isLoading };
}