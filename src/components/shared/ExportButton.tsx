"use client";

import * as XLSX from "xlsx";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  data: any[];
  fileName: string;
  sheetName?: string;
}

export const ExportButton = ({ data, fileName, sheetName = "Data" }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (data.length === 0) return alert("لا توجد بيانات لتصديرها");
    
    setIsExporting(true);
    try {
      // تحويل البيانات لشيت
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // تحميل الملف
      XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString('ar-EG')}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-all text-sm border border-emerald-100 shadow-sm"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      تصدير Excel
    </button>
  );
};