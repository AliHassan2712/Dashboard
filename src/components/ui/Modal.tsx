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
        className={`bg-white rounded-3xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}
        // إيقاف إغلاق النافذة عند النقر داخلها
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {title}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-rose-600 bg-white hover:bg-rose-50 p-2 rounded-full border border-gray-200 transition-colors shadow-sm"
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