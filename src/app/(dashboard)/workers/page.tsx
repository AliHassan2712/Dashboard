"use client";

import { Loader2 } from "lucide-react";
import { useWorkers } from "@/src/features/workers/hooks/useWorkers";
import { AddWorkerForm } from "@/src/features/workers/components/AddWorkerForm";
import { WorkersTable } from "@/src/features/workers/components/WorkersTable";
import { WorkerTxModal } from "@/src/features/workers/components/WorkerTxModal"; // 👈 استيراد المودال النظيف

export default function WorkersPage() {
  // 👈 استخدام الـ Hook الجديد بدون state أو dispatch
  const { workers, isLoading, txModal, setTxModal, actions } = useWorkers();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. نموذج إضافة فني جديد */}
      <AddWorkerForm onAdd={actions.handleAddWorker} />      
      
      {/* 2. جدول الفنيين وأرصدتهم */}
      <WorkersTable 
        workers={workers} 
        onOpenTxModal={(userId, type) => setTxModal({ isOpen: true, userId, type })} 
        onDelete={actions.handleDelete} 
      />
      
      {/* 3. النافذة المنبثقة الذكية Zod */}
      <WorkerTxModal 
        isOpen={txModal.isOpen} 
        onClose={() => setTxModal({ isOpen: false, userId: "", type: null })}
        workerId={txModal.userId}
        initialType={txModal.type}
        onSave={actions.handleAddTx}
      />

    </div>
  );
}