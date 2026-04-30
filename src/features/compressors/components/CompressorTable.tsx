import { memo } from "react";
import { Package } from "lucide-react";
import { Compressor } from "@prisma/client";
import { CompressorCard } from "./CompressorCard";

interface CompressorTableProps {
  compressors: Compressor[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const CompressorTable = memo(({ compressors, onStatusChange, onDelete }: CompressorTableProps) => {
  if (!compressors || compressors.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-app-card-light dark:bg-app-card-dark rounded-3xl border-2 border-dashed border-app-border-light dark:border-app-border-dark text-app-text-muted-light dark:text-app-text-muted-dark font-bold flex flex-col items-center gap-3">
        <Package className="w-12 h-12 text-zinc-200 dark:text-zinc-700" />
        <p>لا توجد كمبريسورات جاهزة للبيع حالياً أو مطابقة للبحث.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {compressors.map((comp) => (
        <CompressorCard 
          key={comp.id} 
          comp={comp} 
          onStatusChange={onStatusChange} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
});

CompressorTable.displayName = "CompressorTable";