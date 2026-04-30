"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { useWorkerStatement } from "@/src/features/workers/hooks/useWorkerStatement";
import { WorkerProfileCard } from "@/src/features/workers/components/WorkerProfileCard";
import { WorkerStatementTable } from "@/src/features/workers/components/WorkerStatement";
import { Pagination } from "@/src/components/shared/Pagination";

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // فك الـ Promise للحصول على الـ id (Next.js 15 pattern)
  const { id } = use(params);
  
  // حالة رقم الصفحة للتقليب
  const [currentPage, setCurrentPage] = useState(1);

  // استخدام الـ Hook الجديد
  const { worker, transactions, metadata, isLoading } = useWorkerStatement(id, currentPage);

  // عرض التحميل أثناء جلب البيانات الأساسية
  if (isLoading && !worker) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600 dark:text-brand-400" />
      </div>
    );
  }

  // إذا لم يتم العثور على العامل
  if (!worker) {
    return (
      <div className="text-center py-20 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold">
        عذراً، لم يتم العثور على بيانات هذا الفني.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* الترويسة وزر العودة */}
      <div className="flex items-center justify-between">
        <Link href={ROUTES.WORKERS} className="flex items-center gap-2 text-app-text-secondary-light dark:text-app-text-secondary-dark hover:text-indigo-600 transition font-bold bg-app-card-light dark:bg-app-card-dark px-4 py-2 rounded-xl shadow-sm border border-app-border-light dark:border-app-border-dark w-fit">
          <ArrowRight className="w-5 h-5" /> رجوع لقائمة العمال
        </Link>
      </div>

      {/* بطاقة تعريف العامل ورصيده */}
      <WorkerProfileCard worker={worker} />

      {/* سجل المعاملات المالية (الجدول المسرّع) */}
      <div className="space-y-6">
        <WorkerStatementTable transactions={transactions} />
        
        {/* مكون التقليب */}
        <Pagination 
          currentPage={metadata.currentPage} 
          totalPages={metadata.totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>

    </div>
  );
}