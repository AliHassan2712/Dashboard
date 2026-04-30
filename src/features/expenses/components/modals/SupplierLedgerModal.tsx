import { useState, useEffect } from "react";
import { Store, Loader2, FileText, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { getSupplierStatement } from "@/src/server/actions/expenses.actions";
import { SupplierStatementData } from "@/src/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string | null;
}

type LedgerRow = {
  id: string;
  date: Date;
  isInvoice: boolean;
  amountIn: number; 
  amountOut: number; 
  notes: string;
};

export const SupplierLedgerModal = ({ isOpen, onClose, supplierId }: Props) => {
  const [ledger, setLedger] = useState<SupplierStatementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && supplierId) {
      setIsLoading(true);
      getSupplierStatement(supplierId).then(res => {
        if (res.success && res.data) setLedger(res.data as SupplierStatementData);
        setIsLoading(false);
      });
    } else {
      setLedger(null);
    }
  }, [isOpen, supplierId]);

  const getSortedRows = (): LedgerRow[] => {
    if (!ledger) return [];
    const rows: LedgerRow[] = [
      ...ledger.invoices.map(inv => ({
        id: inv.id,
        date: new Date(inv.date),
        isInvoice: true,
        amountIn: inv.totalAmount,
        amountOut: inv.paidAmount,
        notes: `فاتورة مشتريات #${inv.id.slice(-5).toUpperCase()}`
      })),
      ...ledger.payments.map(pay => ({
        id: pay.id,
        date: new Date(pay.date),
        isInvoice: false,
        amountIn: 0,
        amountOut: pay.amount,
        notes: pay.notes || "دفعة نقدية من الحساب"
      }))
    ];
    return rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const sortedRows = getSortedRows();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><Store className="w-5 h-5 text-brand-600 dark:text-brand-400" /> كشف حساب تفصيلي</>} maxWidth="2xl">
      {isLoading || !ledger ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-brand-600 dark:text-brand-400" /></div>
      ) : (
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            {/* زخرفة خلفية */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Store className="w-8 h-8 text-brand-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">اسم المورد / الشركة</p>
                <h2 className="text-3xl font-black text-white tracking-tight">{ledger.name}</h2>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> نشط
                </p>
              </div>
            </div>
            
            <div className="relative z-10 text-center md:text-left bg-white/10 px-8 py-5 rounded-2xl border border-white/20 backdrop-blur-md min-w-[200px]">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">إجمالي الرصيد المستحق (له)</p>
              <p className="text-4xl font-black text-white flex items-center justify-center md:justify-end gap-2">
                <span className="text-xl text-rose-400">₪</span>
                {ledger.totalDebt.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-app-card-light dark:bg-app-card-dark rounded-3xl border border-app-border-light dark:border-app-border-dark overflow-hidden shadow-sm">
            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50/80 text-app-text-secondary-light dark:text-app-text-secondary-dark font-bold sticky top-0 z-10 backdrop-blur-sm border-b border-app-border-light dark:border-app-border-dark">
                  <tr>
                    <th className="p-4 whitespace-nowrap">التاريخ</th>
                    <th className="p-4">البيان والحركة</th>
                    <th className="p-4 text-center text-danger-600 dark:text-danger-500 bg-rose-50/50">مدين (مشتريات)</th>
                    <th className="p-4 text-center text-success-600 dark:text-success-400 bg-emerald-50/50">دائن (دفعات)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {sortedRows.map((item, i) => (
                    <tr key={`${item.id}-${i}`} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 text-xs text-app-text-secondary-light dark:text-app-text-secondary-dark font-mono">
                        {item.date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.isInvoice ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-500' : 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'}`}>
                            {item.isInvoice ? <ArrowDownRight className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                          </div>
                          <div>
                            <p className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{item.notes}</p>
                            <p className="text-[10px] text-app-text-muted-light dark:text-app-text-muted-dark mt-0.5">{item.isInvoice ? 'قيد فاتورة مشتريات' : 'سند صرف نقدي'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center bg-rose-50/10 group-hover:bg-rose-50/30 transition-colors">
                        {item.amountIn > 0 ? <span className="font-black text-danger-600 dark:text-danger-500 text-base">₪ {item.amountIn.toFixed(2)}</span> : <span className="text-zinc-300 dark:text-zinc-600">-</span>}
                      </td>
                      <td className="p-4 text-center bg-emerald-50/10 group-hover:bg-emerald-50/30 transition-colors">
                        {item.amountOut > 0 ? <span className="font-black text-success-600 dark:text-success-400 text-base">₪ {item.amountOut.toFixed(2)}</span> : <span className="text-zinc-300 dark:text-zinc-600">-</span>}
                      </td>
                    </tr>
                  ))}
                  {sortedRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-12">
                        <div className="flex flex-col items-center justify-center text-app-text-muted-light dark:text-app-text-muted-dark space-y-3">
                          <FileText className="w-12 h-12 opacity-20" />
                          <p className="text-lg font-bold">لا توجد حركات مالية</p>
                          <p className="text-sm">لم يتم تسجيل أي فواتير أو دفعات لهذا المورد بعد.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};