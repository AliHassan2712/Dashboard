import Image from "next/image";
import { Image as ImageIcon, Edit2, Trash2, Loader2 } from "lucide-react";
import { SparePart } from "@prisma/client"; 

// تعريف واضح للخصائص التي يستقبلها المكون (بدون any)
interface InventoryTableProps {
  parts: SparePart[];
  isLoading: boolean;
  onEdit: (part: SparePart) => void;
  onDelete: (id: string) => void;
}

export const InventoryTable = ({ parts, isLoading, onEdit, onDelete }: InventoryTableProps) => {
  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50/50 text-gray-500 text-xs border-b">
          <tr>
            <th className="p-4 w-20 text-center">الصورة</th>
            <th className="p-4">الاسم</th>
            <th className="p-4 text-center">الكمية</th>
            <th className="p-4">سعر التكلفة</th>
            <th className="p-4">سعر البيع</th>
            <th className="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parts.map((part) => (
            <tr key={part.id} className="hover:bg-gray-50 transition">
              <td className="p-3">
                {part.imageUrl ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border mx-auto">
                    <Image src={part.imageUrl} alt={part.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-dashed flex items-center justify-center mx-auto text-gray-300">
                    <ImageIcon className="w-5 h-5"/>
                  </div>
                )}
              </td>
              <td className="p-4 font-bold text-gray-900">{part.name}</td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${part.quantity <= part.lowStockAlert ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {part.quantity}
                </span>
              </td>
              <td className="p-4 text-gray-500">{part.averageCost} ₪</td>
              <td className="p-4 font-black text-indigo-600">{part.sellingPrice} ₪</td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit(part)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(part.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};