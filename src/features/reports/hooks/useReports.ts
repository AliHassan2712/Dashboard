"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getFinancialReport } from "../actions";

export function useReports() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string }>({});

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    // نمرر الـ filters مباشرة ككائن واحد
    const res = await getFinancialReport(filters);
    if (res.success) {
      setReportData(res.data);
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