"use client";

import { useState } from "react";
import { Printer, Loader2, PieChart, Filter, X } from "lucide-react"; 
import { useReports } from "@/src/features/reports/hooks/useReports";
import { Input } from "@/src/components/ui/Input";
import { ExportButton } from "@/src/components/shared/ExportButton"; 
import { PrintReportTemplate } from "@/src/features/reports/components/PrintReportTemplate";

export default function ReportsPage() {
  const { reportData, isLoading, setFilters } = useReports();
  
  const [localStart, setLocalStart] = useState("");
  const [localEnd, setLocalEnd] = useState("");

  const handleApplyFilter = () => {
    setFilters({ startDate: localStart, endDate: localEnd });
  };

  const handleResetFilter = () => {
    setLocalStart("");
    setLocalEnd("");
    setFilters({});
  };

  const prepareExcelData = () => {
    if (!reportData) return [];
    
    return [{
      "الفترة من": localStart || "البداية",
      "الفترة إلى": localEnd || "اليوم",
      "إجمالي الإيرادات (₪)": reportData.period.revenue,
      "إجمالي التكاليف (₪)": reportData.period.expenses + reportData.period.workerPayments + reportData.period.purchasesPaid,
      "صافي الربح (₪)": reportData.period.netCash,
      "إيراد الصيانة والمبيعات": reportData.period.revenue,
      "مصاريف تشغيلية": reportData.period.expenses,
      "رواتب وسلف": reportData.period.workerPayments,
      "تكاليف ومدفوعات للتجار": reportData.period.purchasesPaid,
      "صافي الأصول الكلي للورشة": reportData.totalAssets
    }];
  };

  if (isLoading || !reportData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 print:p-0 print:m-0 animate-in fade-in duration-500">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0 !important; }
          html, body { margin: 0 !important; padding: 0 !important; background-color: white !important; }
          #printable-report {
            position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important;
            width: 210mm !important; height: 297mm !important; background: white !important;
            box-shadow: none !important; border: none !important; z-index: 99999 !important;
          }
        }
      `}} />

      {/* لوحة التحكم العلوية والفلتر */}
      <div className="flex flex-col mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm print:hidden">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">التقارير والميزانية العمومية</h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">نظرة شاملة على رأس المال، والتدفقات النقدية لفترة محددة</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <ExportButton 
              data={prepareExcelData()} 
              fileName={`الميزانية_${localStart || 'شامل'}`} 
              sheetName="الملخص المالي"
            />

            <button onClick={() => window.print()} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white hover:bg-black rounded-xl font-bold transition shadow-xl w-full sm:w-auto justify-center">
              <Printer className="w-5 h-5" /> طباعة
            </button>
          </div>
        </div>

        {/* شريط فلترة التواريخ */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-end gap-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex-1 w-full">
            <Input type="date" label="من تاريخ" value={localStart} onChange={(e) => setLocalStart(e.target.value)} className="bg-white" />
          </div>
          <div className="flex-1 w-full">
            <Input type="date" label="إلى تاريخ" value={localEnd} onChange={(e) => setLocalEnd(e.target.value)} className="bg-white" />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleApplyFilter} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 h-[46px] rounded-xl font-bold hover:bg-indigo-700 transition">
              <Filter className="w-4 h-4" /> تصفية
            </button>
            {(localStart || localEnd) && (
              <button onClick={handleResetFilter} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 h-[46px] rounded-xl font-bold hover:bg-red-100 transition" title="إلغاء التصفية">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* قالب العرض والطباعة */}
      <PrintReportTemplate data={reportData} />

    </div>
  );
}