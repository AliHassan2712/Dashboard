  import { ArrowUpCircle, ArrowDownCircle, FileText } from "lucide-react";
  
  export const getTypeText = (type: string) => {
    switch (type) {
      case 'STAKE': return { label: "استحقاق تذكرة", color: "text-emerald-600", bg: "bg-emerald-50", icon: ArrowUpCircle };
      case 'BONUS': return { label: "مكافأة", color: "text-blue-600", bg: "bg-blue-50", icon: ArrowUpCircle };
      case 'ADVANCE': return { label: "سلفة مسبقة", color: "text-amber-600", bg: "bg-amber-50", icon: ArrowDownCircle };
      case 'PAYOUT': return { label: "دفع راتب", color: "text-rose-600", bg: "bg-rose-50", icon: ArrowDownCircle };
      default: return { label: "غير معروف", color: "text-gray-600", bg: "bg-gray-50", icon: FileText };
    }
  };
