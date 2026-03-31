import { Trash2, Wrench } from "lucide-react";
import Select from "react-select";
import { SparePart, TicketPart } from "@prisma/client"; //  استيراد الأنواع

//  تعريف نوع مخصص للقطعة المستهلكة لأنها تحتوي على بيانات القطعة الأصلية (Relation)
type TicketPartWithDetails = TicketPart & {
  sparePart: SparePart;
};

//  تعريف دقيق للخصائص (Props)
interface PartsTableProps {
  parts: TicketPartWithDetails[];
  inventory: SparePart[];
  isUpdating: boolean;
  onAdd: (sparePartId: string) => void;
  onRemove: (ticketPartId: string) => void;
}

export const PartsTable = ({ parts, inventory, isUpdating, onAdd, onRemove }: PartsTableProps) => {
  // تحويل المخزون لصيغة تناسب react-select
  const options = inventory.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sellingPrice} ₪) - متوفر: ${p.quantity}`,
    isDisabled: p.quantity <= 0
  }));

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold flex items-center gap-2 text-sm text-gray-700">
          <Wrench className="w-4 h-4 text-indigo-500" /> قطع الغيار المستخدمة
        </h3>
        <div className="w-full sm:w-64 print:hidden">
          <Select
            placeholder="ابحث عن قطعة..."
            options={options}
            isDisabled={isUpdating}
            onChange={(opt: any) => { if (opt) onAdd(opt.value); }}
            value={null}
            styles={{ control: (base) => ({ ...base, fontSize: '0.875rem', borderRadius: '0.5rem' }) }}
          />
        </div>
      </div>
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50/50 text-gray-400 text-xs border-b">
          <tr>
            <th className="p-3">القطعة</th>
            <th className="p-3">الكمية</th>
            <th className="p-3">السعر</th>
            <th className="p-3 print:hidden text-center">حذف</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parts?.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-800">{p.sparePart.name}</td>
              <td className="p-3">{p.quantity} حبة</td>
              <td className="p-3 font-bold text-indigo-600">{p.priceAtTime * p.quantity} ₪</td>
              <td className="p-3 text-center print:hidden">
                <button onClick={() => onRemove(p.id)} className="text-red-300 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4 mx-auto"/>
                </button>
              </td>
            </tr>
          ))}
          {(!parts || parts.length === 0) && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                لم يتم إضافة أي قطع حتى الآن
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};