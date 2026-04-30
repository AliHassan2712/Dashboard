import { Trash2, Image as ImageIcon } from "lucide-react";
import { Compressor } from "@prisma/client";

interface CompressorCardProps {
  comp: Compressor;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export const CompressorCard = ({ comp, onStatusChange, onDelete }: CompressorCardProps) => {
  const profit = (comp.sellingPrice || 0) - (comp.productionCost || 0);

  return (
    <div className="bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden hover:shadow-md transition-all group relative flex flex-col">
      <div className="relative h-48 w-full bg-zinc-50 dark:bg-zinc-900 border-b border-app-border-light dark:border-app-border-dark overflow-hidden">
        {comp.imageUrl ? (
          <img 
            src={comp.imageUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt={comp.modelName} 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 gap-2">
            <ImageIcon className="w-10 h-10" />
            <span className="text-[10px] font-bold">لا توجد صورة</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${
            comp.status === 'AVAILABLE' || comp.status === 'READY' ? 'bg-success-500 text-white' :
            comp.status === 'SOLD' ? 'bg-slate-700 text-white' : 'bg-amber-500 text-white'
          }`}>
            {comp.status === 'AVAILABLE' || comp.status === 'READY' ? 'جاهز للبيع' : 
             comp.status === 'SOLD' ? 'تم البيع' : 'تحت التجهيز'}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-black text-app-text-primary-light dark:text-app-text-primary-dark mb-1">{comp.modelName}</h3>
          <p className="text-[10px] font-bold text-app-text-muted-light dark:text-app-text-muted-dark font-mono">S/N: {comp.serialNumber || "N/A"}</p>
        </div>
        
        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-app-border-light dark:border-app-border-dark mb-5 mt-auto">
          <div className="flex justify-between text-xs">
            <span className="text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold">تكلفة الإنتاج:</span>
            <span className="text-app-text-primary-light dark:text-app-text-primary-dark font-black">₪ {(comp.productionCost || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold">سعر البيع:</span>
            <span className="text-success-600 dark:text-success-400 font-black">₪ {(comp.sellingPrice || 0).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center font-black text-brand-600 dark:text-brand-400 text-sm">
            <span className="text-[10px] text-app-text-muted-light dark:text-app-text-muted-dark uppercase">الربح الصافي</span>
            <span>₪ {profit.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <select 
            value={comp.status} 
            onChange={(e) => onStatusChange(comp.id, e.target.value)}
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold outline-none border-none focus:ring-0 cursor-pointer"
          >
            <option value="AVAILABLE">متاح للبيع</option>
            <option value="SOLD">مباع</option>
            <option value="MAINTENANCE">تحت التجهيز</option>
          </select>
          <button 
            onClick={() => onDelete(comp.id)} 
            className="p-2.5 text-zinc-300 dark:text-zinc-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};