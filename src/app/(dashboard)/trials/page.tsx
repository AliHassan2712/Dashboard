"use client";

import { useState } from "react";
import { ClipboardList, Plus, Loader2 } from "lucide-react";
import { useTrials } from "@/src/features/trials/hooks/useTrials";
import { TrialsTable } from "@/src/features/trials/components/TrialsTable";
import { TrialModal } from "@/src/features/trials/components/TrialModal";
import { Pagination } from "@/src/components/shared/Pagination";

export default function TrialsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    trials, metadata, workers, parts, isLoading, 
    isModalOpen, setIsModalOpen, 
    actions 
  } = useTrials(currentPage); 

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-app-text-primary-light dark:text-app-text-primary-dark">سجل العهد والقطع التجريبية</h1>
            <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark text-sm mt-1 font-medium">متابعة القطع المصروفة للفنيين بغرض التجربة</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition shadow-md w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> صرف عهدة جديدة
        </button>
      </div>

      <div className="space-y-4">
        {isLoading && trials.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-brand-600 dark:text-brand-400" />
          </div>
        ) : (
          <>
            <TrialsTable trials={trials} onReturn={actions.handleReturn} onConsume={actions.handleConsume} />
            
            <Pagination 
              currentPage={metadata.currentPage} 
              totalPages={metadata.totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
      </div>
      
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