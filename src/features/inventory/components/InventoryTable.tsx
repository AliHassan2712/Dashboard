import { Edit, Trash2, AlertTriangle, BadgeDollarSign } from "lucide-react";
import { SparePart } from "@prisma/client";

interface InventoryTableProps {
  parts: SparePart[];
  onOpenEditModal: (part: SparePart) => void;
  onDelete: (id: string, name: string) => void;
  onOpenSellModal: (part: SparePart) => void;
}

export const InventoryTable = ({ parts, onOpenEditModal, onDelete, onOpenSellModal }: InventoryTableProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-gray-50 text-gray-400 font-bold border-b">
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
            <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد قطع مطابقة.</td></tr>
          ) : (
            parts.map(part => {
              const isLowStock = part.quantity <= part.lowStockAlert;
              return (
                <tr key={part.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800">{part.name}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs ${isLowStock ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {isLowStock && <AlertTriangle className="w-3 h-3" />}
                      {part.quantity}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-500">₪ {part.averageCost?.toFixed(2) || "0.00"}</td>
                  <td className="p-4 font-black text-indigo-600">₪ {part.sellingPrice.toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => onOpenSellModal(part)}
                      className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      title="بيع مباشر"
                    >
                      <BadgeDollarSign className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenEditModal(part)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(part.id, part.name)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
);