import { memo } from "react";
import { Edit, Trash2, AlertTriangle, BadgeDollarSign } from "lucide-react";
import { SparePart } from "@prisma/client";

interface InventoryTableProps {
  parts: SparePart[];
  onOpenEditModal: (part: SparePart) => void;
  onDelete: (id: string, name: string) => void;
  onOpenSellModal: (part: SparePart) => void;
}

export const InventoryTable = memo(({ parts, onOpenEditModal, onDelete, onOpenSellModal }: InventoryTableProps) => (
  <div className="bg-app-card-light dark:bg-app-card-dark rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900 text-app-text-muted-light dark:text-app-text-muted-dark font-bold border-b">
          <tr>
            <th className="p-4">اسم القطعة</th>
            <th className="p-4 text-center">الكمية المتوفرة</th>
            <th className="p-4">سعر التكلفة (₪)</th>
            <th className="p-4">سعر البيع (₪)</th>
            <th className="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parts.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-10 text-app-text-muted-light dark:text-app-text-muted-dark">لا توجد قطع مطابقة.</td></tr>
          ) : (
            parts.map(part => {
              const isLowStock = part.quantity <= part.lowStockAlert;
              return (
                <tr key={part.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{part.name}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs ${isLowStock ? 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-500' : 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400'}`}>
                      {isLowStock && <AlertTriangle className="w-3 h-3" />}
                      {part.quantity}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-app-text-secondary-light dark:text-app-text-secondary-dark">₪ {part.averageCost?.toFixed(2) || "0.00"}</td>
                  <td className="p-4 font-black text-brand-600 dark:text-brand-400">₪ {part.sellingPrice.toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => onOpenSellModal(part)}
                      className="p-2 text-success-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      title="بيع مباشر"
                    >
                      <BadgeDollarSign className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenEditModal(part)}
                      className="p-2 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(part.id, part.name)}
                      className="p-2 text-app-text-muted-light dark:text-app-text-muted-dark hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
));

InventoryTable.displayName = "InventoryTable";