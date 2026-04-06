"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getFinancialReport } from "@/src/server/actions/reports.actions";
import { FinancialReportData } from "@/src/types";

export function useReports() {
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string }>({});

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    const res = await getFinancialReport(filters);
    if (res.success && res.data) {
      setReportData(res.data as FinancialReportData);
    } else {
      toast.error(res.error || "خطأ في جلب البيانات");
    }
    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { reportData, isLoading, filters, setFilters };
}