import { ReactNode } from "react";
import { X } from "lucide-react";
import { maxWidthClasses } from "@/src/constants/maxWidthClasses";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "md" }: ModalProps) => {
  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className={`bg-app-card-light rounded-3xl w-full ${maxWidthClasses[maxWidth]} shadow-premium overflow-hidden animate-in zoom-in-95 duration-200 dark:bg-app-card-dark dark:shadow-premium-dark`}
        // إيقاف إغلاق النافذة عند النقر داخلها
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-6 border-b border-app-border-light bg-zinc-50/70 dark:border-app-border-dark dark:bg-zinc-900/70">
          <div className="text-xl font-bold text-app-text-primary-light flex items-center gap-2 dark:text-app-text-primary-dark">
            {title}
          </div>
          <button 
            onClick={onClose} 
            className="text-app-text-muted-light hover:text-danger-600 bg-app-card-light hover:bg-danger-50 p-2 rounded-full border border-app-border-light transition-colors shadow-sm dark:text-app-text-muted-dark dark:bg-app-card-dark dark:border-app-border-dark dark:hover:text-danger-500 dark:hover:bg-danger-900/25"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* المحتوى الداخلي (النموذج أو البيانات) */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
