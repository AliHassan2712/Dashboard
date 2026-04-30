"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { getFinancialReport } from "@/src/server/actions/reports.actions";
import { FinancialReportData } from "@/src/types";

const fetcher = async ([_, startDate, endDate]: [string, string | undefined, string | undefined]) => {
  const res = await getFinancialReport({ startDate, endDate });
  if ("error" in res) throw new Error(String(res.error));
  return res.data;
};

export function useReports() {
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string }>({});

  const { data, isLoading } = useSWR(
    ["financial-report", filters.startDate, filters.endDate],
    fetcher,
    { 
      revalidateOnFocus: false, 
      keepPreviousData: true,
      onError: (err) => toast.error(err.message || "خطأ في جلب بيانات التقرير") 
    }
  );

  return { 
    reportData: data as FinancialReportData | undefined, 
    isLoading, 
    filters, 
    setFilters 
  };
}