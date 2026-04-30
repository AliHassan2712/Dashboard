"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Loader2, Package, Search, Filter } from "lucide-react";
import { useCompressors } from "@/src/features/compressors/hooks/useCompressors";
import { ExportButton } from "@/src/components/shared/ExportButton";
import { CompressorModal } from "@/src/features/compressors/components/CompressorModal";
import { CompressorTable } from "@/src/features/compressors/components/CompressorTable";
import { Pagination } from "@/src/components/shared/Pagination";
import { Compressor } from "@prisma/client";

export default function CompressorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // تطبيق التأخير (Debounce) لمنع الـ Lag أثناء البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // إرجاع للصفحة الأولى عند البحث
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    compressors, metadata, isLoading, isModalOpen, setIsModalOpen, 
    fetchData, actions, inventory
  } = useCompressors(currentPage, debouncedQuery);

  // تجهيز البيانات المصدرة للإكسل من الصفحة الحالية
  const excelData = compressors.map((c: Compressor) => ({
    "الموديل/الوصف": c.modelName,
    "الرقم التسلسلي": c.serialNumber || "لا يوجد",
    "تكلفة الإنتاج (₪)": c.productionCost,
    "سعر البيع (₪)": c.sellingPrice,
    "الربح المتوقع (₪)": c.sellingPrice - c.productionCost,
    "الحالة": c.status === 'AVAILABLE' || c.status === 'READY' ? 'جاهز للبيع' : c.status === 'SOLD' ? 'تم البيع' : 'صيانة',
    "تاريخ الإضافة": new Date(c.createdAt).toLocaleDateString('ar-EG'),
  }));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-app-card-light dark:bg-app-card-dark p-6 rounded-[2.5rem] border border-app-border-light dark:border-app-border-dark shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">مخزن الكمبريسورات الجاهزة</h1>
            <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium text-sm">إدارة الأجهزة المعدة للبيع وتتبع أرباحها</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ExportButton data={excelData} fileName="تقرير_مخزن_الكمبريسورات" sheetName="الأجهزة الجاهزة" />

          <button onClick={() => fetchData()} className="p-3 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="تحديث البيانات">
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            <span>إضافة جهاز جديد</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted-light dark:text-app-text-muted-dark w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="بحث بالموديل أو الرقم التسلسلي..." 
            className="w-full pr-12 pl-4 py-4 bg-app-card-light dark:bg-app-card-dark border border-app-border-light dark:border-app-border-dark rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-app-card-light dark:bg-app-card-dark border border-app-border-light dark:border-app-border-dark rounded-2xl text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold text-sm cursor-default shadow-sm">
          <Filter className="w-4 h-4" /> تصفية تلقائية
        </button>
      </div>

      {isLoading && compressors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-brand-600 dark:text-brand-400" />
          <p className="text-app-text-muted-light dark:text-app-text-muted-dark font-bold animate-pulse">جاري جلب بيانات المخزن...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <CompressorTable 
            compressors={compressors} 
            onStatusChange={actions.handleStatusChange} 
            onDelete={actions.handleDelete} 
          />
          <Pagination 
            currentPage={metadata.currentPage} 
            totalPages={metadata.totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}

      {/* النافذة المنبثقة للإضافة (ممررين الـ Types الصح) */}
      <CompressorModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={actions.handleAdd} 
        inventory={inventory as any} // هنا استثناء بسيط لعدم تعديل Modal داخلياً
      />
    </div>
  );
}
