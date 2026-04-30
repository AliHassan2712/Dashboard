import { memo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = memo(({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 bg-app-card-light p-4 rounded-2xl border border-app-border-light shadow-premium w-fit mx-auto print:hidden dark:bg-app-card-dark dark:border-app-border-dark dark:shadow-premium-dark">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg bg-zinc-50 text-app-text-secondary-light hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 transition-all dark:bg-zinc-900 dark:text-app-text-secondary-dark dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
      >
        <ChevronRight className="w-5 h-5" /> 
      </button>
      
      <span className="text-sm font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">
        صفحة <span className="text-brand-600 font-black dark:text-brand-300">{currentPage}</span> من {totalPages}
      </span>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg bg-zinc-50 text-app-text-secondary-light hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 transition-all dark:bg-zinc-900 dark:text-app-text-secondary-dark dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
});

Pagination.displayName = "Pagination";
