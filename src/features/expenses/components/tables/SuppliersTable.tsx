import { Store, FileText, Phone } from "lucide-react";
import { Supplier } from "@prisma/client";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onOpenLedger: (supplierId: string) => void;
}

export const SuppliersTable = ({ suppliers, onOpenLedger }: SuppliersTableProps) => (
  <div className="overflow-x-auto p-2">
    <table className="w-full text-right border-separate border-spacing-y-3">
      <thead>
        <tr className="text-sm text-gray-400 font-bold px-4">
          <th className="px-6 py-2 font-medium">اسم المورد / التاجر</th>
          <th className="px-6 py-2 font-medium">معلومات الاتصال</th>
          <th className="px-6 py-2 font-medium text-rose-500">إجمالي الرصيد المستحق</th>
          <th className="px-6 py-2 font-medium text-center">كشف الحساب</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
              لا يوجد تجار مسجلين حالياً.
            </td>
          </tr>
        ) : (
          suppliers.map(supplier => (
            <tr key={supplier.id} className="bg-white group hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
              
              {/* اسم التاجر مع أيقونة بارزة */}
              <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-100 group-hover:border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg">{supplier.name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">مورد معتمد</p>
                  </div>
                </div>
              </td>

              {/* رقم الجوال */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-indigo-100">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span dir="ltr">{supplier.phone || "لا يوجد رقم"}</span>
                </div>
              </td>

              {/* الرصيد بتصميم بارز */}
              <td className="px-6 py-4 border-y border-gray-100 group-hover:border-indigo-100">
                <div className="bg-rose-50/50 px-4 py-2 rounded-xl inline-block border border-rose-100/50">
                  <span className="text-xs font-bold text-rose-400 ml-1">₪</span>
                  <span className="font-black text-xl text-rose-600">{supplier.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </td>

              {/* زر كشف الحساب */}
              <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-100 group-hover:border-indigo-100 text-center">
                <button 
                  onClick={() => onOpenLedger(supplier.id)} 
                  className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-sm hover:shadow-indigo-200/50"
                >
                  <FileText className="w-4 h-4" /> 
                  <span>عرض التفاصيل</span>
                </button>
              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);