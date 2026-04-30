import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getWorkerDetails } from "@/src/server/actions/workers.actions"; 
import { ROUTES } from "@/src/constants/paths";
import { WorkerProfileCard } from "@/src/features/workers/components/WorkerProfileCard";
import { WorkerWithTransactions } from "@/src/types";
import { WorkerStatementTable } from "@/src/features/workers/components/WorkerStatement";

export default async function WorkerStatementPage({ params }: { params: Promise<{ id: string }> }) {
  // في Next.js 15 الـ params عبارة عن Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const res = await getWorkerDetails(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const worker = res.data as WorkerWithTransactions;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* زر العودة */}
      <Link 
        href={ROUTES.WORKERS} 
        className="inline-flex items-center gap-2 text-app-text-secondary-light dark:text-app-text-secondary-dark hover:text-indigo-600 transition-colors font-bold bg-app-card-light dark:bg-app-card-dark px-4 py-2 rounded-xl shadow-sm border border-app-border-light dark:border-app-border-dark w-fit"
      >
        <ArrowRight className="w-5 h-5" />
        العودة لقائمة الفنيين
      </Link>

      {/* بطاقة معلومات الفني */}
      <WorkerProfileCard worker={worker} />

      {/* جدول كشف الحساب المحدث */}
      <WorkerStatementTable transactions={worker.transactions} />
      
    </div>
  );
}