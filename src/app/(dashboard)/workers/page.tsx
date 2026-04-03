"use client";

import { Loader2 } from "lucide-react";
import { useWorkers } from "@/src/features/workers/hooks/useWorkers";
import { AddWorkerForm, WorkersTable, WorkerTransactionModal } from "@/src/features/workers/components/WorkersComponents";

export default function WorkersPage() {
  const { state, dispatch, actions } = useWorkers();

  // لو البيانات لسا بتتحمل، نعرض الأنيميشن
  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. نموذج إضافة فني جديد */}
      <AddWorkerForm state={state} dispatch={dispatch} onAdd={actions.handleAddWorker} />
      
      {/* 2. جدول الفنيين وأرصدتهم */}
      <WorkersTable workers={state.workers} dispatch={dispatch} onDelete={actions.handleDelete} />
      
      {/* 3. النافذة المنبثقة (المدارة بواسطة الـ Modal الموحد) */}
      <WorkerTransactionModal state={state} dispatch={dispatch} onConfirm={actions.handleConfirmTx} />

    </div>
  );
}