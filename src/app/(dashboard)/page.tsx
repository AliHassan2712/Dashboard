"use client";

import { Loader2 } from "lucide-react";
import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { AdminDashboard } from "@/src/features/dashboard/components/AdminDashboard";
import { WorkerDashboard } from "@/src/features/dashboard/components/WorkerDashboard";

export default function DashboardPage() {
  const { isAdmin, userName, stats, workerStats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard stats={stats} />;
  }

  return <WorkerDashboard workerStats={workerStats} userName={userName} />;
}
