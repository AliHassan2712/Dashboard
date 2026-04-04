"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getDashboardStats, getWorkerDashboardStats } from "../actions";

export function useDashboard() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || "مستخدم";

  const [stats, setStats] = useState<any>(null);
  const [workerStats, setWorkerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      if (isAdmin) {
        const res = await getDashboardStats();
        if (res.success) setStats(res.data);
      } else if (userId) {
        const res = await getWorkerDashboardStats(userId);
        if (res.success) setWorkerStats(res.data);
      }
      setIsLoading(false);
    };
    
    if (userId) fetchAllData();
  }, [isAdmin, userId]);

  return { isAdmin, userName, stats, workerStats, isLoading };
}