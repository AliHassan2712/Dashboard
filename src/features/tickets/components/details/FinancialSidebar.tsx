import { Receipt, CreditCard, Plus, Percent, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { Payment } from "@prisma/client";
import { Input } from "@/src/components/ui/Input";
import { FinanceData } from "@/src/types";


interface FinancialSidebarProps {
  finance: FinanceData;
  laborCost: number;
  setLaborCost: (val: number) => void;
  discountPercentage: number;
  setDiscountPercentage: (val: number) => void;
  payments: Payment[];
  advancePayment: number;
  onAddPayment: (amount: number) => void;
  onEditPayment: (paymentId: string, newAmount: number) => void;
  onDeletePayment: (paymentId: string) => void;
}

export const FinancialSidebar = ({
  finance, laborCost, setLaborCost, discountPercentage,
  setDiscountPercentage, payments, advancePayment, onAddPayment, onEditPayment, onDeletePayment
}: FinancialSidebarProps) => {

  const [newPayment, setNewPayment] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5 sticky top-6">
      <h3 className="font-bold border-b pb-3 flex items-center gap-2 text-sm">
        <Receipt className="w-4 h-4 text-green-500" /> الحساب المالي
      </h3>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center text-gray-500">
          <span>إجمالي القطع:</span>
          <span className="font-medium text-gray-900">{finance.partsTotal.toFixed(2)} ₪</span>
        </div>

        {/*  حقل أجرة اليد بالمكون الموحد */}
        <div className="flex justify-between items-center">
          <span>أجرة اليد الصافية:</span>
          <Input
            type="number"
            wrapperClassName="w-24"
            className="text-center font-bold !py-1.5"
            value={laborCost || ""}
            onChange={(e) => setLaborCost(Number(e.target.value))}
          />
        </div>

        {/*  حقل الخصم بالمكون الموحد */}
        <div className="flex justify-between items-center text-red-500">
          <span className="flex items-center gap-1">الخصم <Percent className="w-3 h-3" />:</span>
          <Input
            type="number"
            wrapperClassName="w-24"
            className="text-center font-bold text-red-600 border-red-100 focus:ring-red-100 !py-1.5"
            value={discountPercentage || ""}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between font-bold text-xl border-t pt-4 text-indigo-700 bg-indigo-50/50 p-2 rounded-lg">
          <span>الإجمالي:</span>
          <span>{finance.grandTotal.toFixed(2)} ₪</span>
        </div>
      </div>

      <div className="pt-2 border-t space-y-4">
        <h4 className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
          <CreditCard className="w-3 h-3" /> سجل الدفعات
        </h4>
        <div className="space-y-2  pr-1">
          <div className="flex justify-between text-xs p-3 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
            <div className="flex flex-col"><span className="font-bold">دفعة مقدمة</span></div>
            <span className="font-black text-sm">{advancePayment.toFixed(2)} ₪</span>
          </div>
          {payments?.map((p) => (
            <div key={p.id} className="flex justify-between items-center text-xs p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 group">
              <div className="flex flex-col">
                <span className="font-bold">دفعة إضافية</span>
                <span className="text-[10px] opacity-70">{new Date(p.createdAt).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-sm">{p.amount.toFixed(2)} ₪</span>
                <div className="flex gap-1  group-hover:opacity-100 transition-opacity print:hidden">
                  <button onClick={() => {
                    const newAmt = prompt("أدخل المبلغ الجديد:", p.amount.toString());
                    if (newAmt && !isNaN(Number(newAmt))) onEditPayment(p.id, Number(newAmt));
                  }} className="text-blue-500 hover:text-blue-700"><Edit className="w-3 h-3" /></button>
                  <button onClick={() => onDeletePayment(p.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* حقل إضافة دفعة جديدة  */}
        <div className="flex gap-2 print:hidden pt-2 items-center">
          <Input
            type="number"
            leftIcon="₪"
            value={newPayment}
            onChange={(e) => setNewPayment(e.target.value)}
            placeholder="المبلغ..."
            wrapperClassName="flex-1"
            className="bg-gray-50 !py-2"
          />
          <button
            onClick={() => {
              if (Number(newPayment) > 0) {
                onAddPayment(Number(newPayment));
                setNewPayment("");
              }
            }}
            className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition h-fit"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-2xl mt-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between text-xs opacity-60 mb-2">
            <span>المدفوع:</span>
            <span>{finance.totalPaid.toFixed(2)} ₪</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="font-bold text-sm">المتبقي:</span>
            <span className={`font-black text-2xl ${finance.remainingAmount <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
              {finance.remainingAmount <= 0 ? "خالص (0)" : `${finance.remainingAmount.toFixed(2)} ₪`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};