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
    <div className="flex items-center justify-center gap-4 mt-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-fit mx-auto print:hidden">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 transition-all"
      >
        <ChevronRight className="w-5 h-5" /> 
      </button>
      
      <span className="text-sm font-bold text-gray-600">
        صفحة <span className="text-indigo-600 font-black">{currentPage}</span> من {totalPages}
      </span>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
});

Pagination.displayName = "Pagination";