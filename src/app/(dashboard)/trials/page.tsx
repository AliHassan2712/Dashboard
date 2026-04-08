"use client";

import { ClipboardList, Plus, Loader2 } from "lucide-react";
import { useTrials } from "@/src/features/trials/hooks/useTrials";
import { TrialsTable } from "@/src/features/trials/components/TrialsTable";
import { TrialModal } from "@/src/features/trials/components/TrialModal";

export default function TrialsPage() {
  const { 
    trials, workers, parts, isLoading, 
    isModalOpen, setIsModalOpen, 
    actions 
  } = useTrials();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سجل العهد والقطع التجريبية</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">متابعة القطع المصروفة للفنيين بغرض التجربة</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition shadow-md w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> صرف عهدة جديدة
        </button>
      </div>

      <TrialsTable trials={trials} onReturn={actions.handleReturn} onConsume={actions.handleConsume} />
      
      <TrialModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={actions.handleAddTrial} 
        workers={workers} 
        parts={parts} 
      />

    </div>
  );
}