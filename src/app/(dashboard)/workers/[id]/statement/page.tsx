import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getWorkerDetails } from "@/src/features/workers/actions";
import { ROUTES } from "@/src/constants/routes";
import { WorkerProfileCard } from "@/src/features/workers/components/WorkerProfileCard";
import { TransactionTable } from "@/src/features/workers/components/TransactionTable";

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getWorkerDetails(id);

  if (result.error || !result.data) {
    return notFound();
  }

  const worker = result.data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <Link href={ROUTES.WORKERS} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition font-bold text-sm">
          <ArrowRight className="w-5 h-5" /> رجوع لقائمة العمال
        </Link>
      </div>

      <WorkerProfileCard worker={worker} />
      <TransactionTable transactions={worker.transactions} />

    </div>
  );
}