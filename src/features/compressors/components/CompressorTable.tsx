import { Package } from "lucide-react";
import { Compressor } from "@prisma/client";
import { CompressorCard } from "./CompressorCard";

interface CompressorTableProps {
  compressors: Compressor[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const CompressorTable = ({ compressors, onStatusChange, onDelete }: CompressorTableProps) => {
  if (!compressors || compressors.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-bold flex flex-col items-center gap-3">
        <Package className="w-12 h-12 text-gray-200" />
        <p>لا توجد كمبريسورات جاهزة للبيع حالياً.</p>
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
};