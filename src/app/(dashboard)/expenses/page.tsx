"use client";

import { useState, useEffect } from "react";
import { Receipt, Truck, TrendingDown, Plus, Calendar, ArrowDownCircle, Store, Loader2, Trash2, X, UserPlus, FileText, Wallet, History } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { ExpenseCategory } from "@prisma/client"; 
import { 
  getFinancialOverview, getExpenses, addExpense, deleteExpense, 
  getSuppliers, getPurchaseInvoices, addSupplier, addPurchaseInvoice,
  getSupplierPayments, addSupplierPayment
} from "@/src/features/expenses/actions";

export default function ExpensesPage() {
  // ================== States ==================
  const [activeTab, setActiveTab] = useState<"expenses" | "purchases" | "payments">("expenses");
  
  const [overview, setOverview] = useState({ totalExpenses: 0, totalPurchases: 0, totalDebts: 0 });
  const [expenses, setExpenses] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", category: "STANDARD" as ExpenseCategory, notes: "" });
  const [purchaseForm, setPurchaseForm] = useState({ supplierId: "", totalAmount: "", paidAmount: "" });
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "" });
  const [paymentForm, setPaymentForm] = useState({ supplierId: "", amount: "", notes: "" });

  // ================== Data Fetching ==================
  const fetchData = async () => {
    setIsLoading(true);
    const [ovRes, expRes, purRes, supRes, payRes] = await Promise.all([
      getFinancialOverview(), getExpenses(), getPurchaseInvoices(), getSuppliers(), getSupplierPayments()
    ]);
    if (ovRes.success && ovRes.data) setOverview(ovRes.data);
    if (expRes.success && expRes.data) setExpenses(expRes.data);
    if (purRes.success && purRes.data) setPurchases(purRes.data);
    if (supRes.success && supRes.data) setSuppliers(supRes.data);
    if (payRes.success && payRes.data) setPayments(payRes.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ================== Handlers ==================
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addExpense({ title: expenseForm.title, amount: parseFloat(expenseForm.amount), category: expenseForm.category, notes: expenseForm.notes });
    if (res.success) {
      toast.success("تم تسجيل المصروف");
      setIsExpenseModalOpen(false); setExpenseForm({ title: "", amount: "", category: "STANDARD", notes: "" }); fetchData();
    } else toast.error(res.error || "حدث خطأ");
    setIsSubmitting(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("تأكيد حذف المصروف؟")) return;
    const res = await deleteExpense(id);
    if (res.success) { toast.success("تم الحذف"); fetchData(); } 
    else toast.error(res.error || "فشل الحذف");
  };

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseForm.supplierId) return toast.error("يرجى اختيار المورد");
    setIsSubmitting(true);
    const res = await addPurchaseInvoice({ supplierId: purchaseForm.supplierId, totalAmount: parseFloat(purchaseForm.totalAmount), paidAmount: parseFloat(purchaseForm.paidAmount || "0") });
    if (res.success) {
      toast.success("تم تسجيل الفاتورة وتحديث ديون المورد");
      setIsPurchaseModalOpen(false); setPurchaseForm({ supplierId: "", totalAmount: "", paidAmount: "" }); fetchData();
    } else toast.error(res.error || "حدث خطأ");
    setIsSubmitting(false);
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addSupplier(supplierForm);
    if (res.success) {
      toast.success("تمت إضافة المورد");
      setIsSupplierModalOpen(false); setSupplierForm({ name: "", phone: "" });
      setPurchaseForm({...purchaseForm, supplierId: res.data?.id || ""}); fetchData();
    } else toast.error(res.error || "حدث خطأ");
    setIsSubmitting(false);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.supplierId) return toast.error("يرجى اختيار المورد");
    setIsSubmitting(true);
    const res = await addSupplierPayment({
      supplierId: paymentForm.supplierId,
      amount: parseFloat(paymentForm.amount),
      notes: paymentForm.notes
    });
    if (res.success) {
      toast.success("تم تسجيل الدفعة وخصمها من ديون التاجر");
      setIsPaymentModalOpen(false); setPaymentForm({ supplierId: "", amount: "", notes: "" }); fetchData();
    } else toast.error(res.error || "حدث خطأ");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* ================== الترويسة العلوية ================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-500" /> إدارة المصاريف والمشتريات
          </h1>
          <p className="text-gray-500 text-sm mt-1">تابع التدفقات المالية، المشتريات، وتسديد دفعات التجار</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button onClick={() => setIsPaymentModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md">
            <Wallet className="w-5 h-5" /> تسديد دفعة للتاجر
          </button>
          <button onClick={() => activeTab === "expenses" ? setIsExpenseModalOpen(true) : setIsPurchaseModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition shadow-md">
            <Plus className="w-5 h-5" /> {activeTab === "expenses" ? "مصروف جديد" : "فاتورة مشتريات"}
          </button>
        </div>
      </div>

      {/* ================== الإحصائيات ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl"><ArrowDownCircle className="w-8 h-8" /></div>
          <div><p className="text-sm font-bold text-gray-500">مصاريف التشغيل الشهرية</p><p className="text-2xl font-black text-rose-600">₪ {overview.totalExpenses.toFixed(2)}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Truck className="w-8 h-8" /></div>
          <div><p className="text-sm font-bold text-gray-500">إجمالي المشتريات الشهرية</p><p className="text-2xl font-black text-indigo-600">₪ {overview.totalPurchases.toFixed(2)}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Store className="w-8 h-8" /></div>
          <div><p className="text-sm font-bold text-gray-500">إجمالي ديون الموردين (علينا)</p><p className="text-2xl font-black text-amber-600">₪ {overview.totalDebts.toFixed(2)}</p></div>
        </div>
      </div>

      {/* ================== منطقة الجداول والتبويبات ================== */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab("expenses")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "expenses" ? "bg-white text-rose-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}>
            <Receipt className="w-5 h-5" /> المصاريف التشغيلية
          </button>
          <button onClick={() => setActiveTab("purchases")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "purchases" ? "bg-white text-indigo-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}>
            <Truck className="w-5 h-5" /> فواتير المشتريات
          </button>
          <button onClick={() => setActiveTab("payments")} className={`whitespace-nowrap flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "payments" ? "bg-white text-emerald-600 shadow-sm border border-gray-200" : "text-gray-500 hover:bg-gray-100"}`}>
            <History className="w-5 h-5" /> سجل دفعات الموردين
          </button>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : activeTab === "expenses" ? (
            // جدول المصاريف
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                  <tr>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">البند (العنوان)</th>
                    <th className="p-4">التصنيف</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد مصاريف مسجلة.</td></tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4"/> {new Date(exp.date).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          {exp.title}
                          {exp.notes && <p className="text-xs text-gray-400 mt-1 font-normal">{exp.notes}</p>}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${exp.category === "STANDARD" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                            {exp.category === "STANDARD" ? "أساسي / تشغيلي" : "نثريات / طوارئ"}
                          </span>
                        </td>
                        <td className="p-4 font-black text-rose-600">₪ {exp.amount.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteExpense(exp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === "purchases" ? (
            // جدول فواتير المشتريات
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                  <tr>
                    <th className="p-4">رقم الفاتورة</th>
                    <th className="p-4">المورد / التاجر</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">الإجمالي</th>
                    <th className="p-4">المدفوع كاش</th>
                    <th className="p-4">المتبقي (دين)</th>
                    <th className="p-4 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchases.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">لا توجد فواتير مشتريات مسجلة.</td></tr>
                  ) : (
                    purchases.map(inv => {
                      const remaining = inv.totalAmount - inv.paidAmount;
                      const status = remaining <= 0 ? "مدفوعة" : (inv.paidAmount > 0 ? "دفع جزئي" : "آجل");
                      const statusColor = remaining <= 0 ? "bg-emerald-50 text-emerald-600" : (inv.paidAmount > 0 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600");
                      
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-bold text-gray-400 font-mono text-xs">#{inv.id.slice(-6).toUpperCase()}</td>
                          <td className="p-4 font-bold text-gray-900">{inv.supplier?.name}</td>
                          <td className="p-4 font-medium text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(inv.date).toLocaleDateString('ar-EG')}</td>
                          <td className="p-4 font-black text-indigo-600">₪ {inv.totalAmount.toFixed(2)}</td>
                          <td className="p-4 font-bold text-emerald-600">₪ {inv.paidAmount.toFixed(2)}</td>
                          <td className="p-4 font-bold text-amber-600">₪ {remaining > 0 ? remaining.toFixed(2) : "0.00"}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${statusColor}`}>{status}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // جدول الدفعات
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b">
                  <tr>
                    <th className="p-4">رقم الحركة</th>
                    <th className="p-4">تاريخ الدفعة</th>
                    <th className="p-4">اسم التاجر / المورد</th>
                    <th className="p-4">البيان / ملاحظات</th>
                    <th className="p-4">المبلغ المسدد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">لا توجد حركات دفع مسجلة.</td></tr>
                  ) : (
                    payments.map(pay => (
                      <tr key={pay.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-mono text-xs text-gray-400">#{pay.id.slice(-6).toUpperCase()}</td>
                        <td className="p-4 font-medium text-gray-500 flex items-center gap-2">
                          <Calendar className="w-4 h-4"/> {new Date(pay.date).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="p-4 font-bold text-gray-800">{pay.supplier?.name}</td>
                        <td className="p-4 text-gray-600">{pay.notes || "دفعة من الحساب"}</td>
                        <td className="p-4 font-black text-emerald-600 text-lg">₪ {pay.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================== النوافذ المنبثقة (Modals) ================== */}

      {/* 1. نافذة إضافة مصروف */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">تسجيل مصروف جديد</h2>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-5">
              <Input label="عنوان المصروف" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="المبلغ (شيكل)" type="number" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required />
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">نوع المصروف</label>
                  <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value as ExpenseCategory})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none font-medium text-gray-900">
                    <option value="STANDARD">أساسي تشغيلي</option>
                    <option value="EXTRA">نثريات وطوارئ</option>
                  </select>
                </div>
              </div>
              <Textarea label="ملاحظات (اختياري)" rows={2} value={expenseForm.notes} onChange={e => setExpenseForm({...expenseForm, notes: e.target.value})} />
              <button disabled={isSubmitting} type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold flex justify-center items-center">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ المصروف"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. نافذة إضافة فاتورة المشتريات / و نافذة المورد الجديد المتداخلة */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600"/> فاتورة مشتريات</h2>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            {isSupplierModalOpen ? (
              <form onSubmit={handleAddSupplier} className="p-6 space-y-5 bg-indigo-50/50">
                <div className="text-center mb-4"><UserPlus className="w-8 h-8 text-indigo-500 mx-auto" /><h3 className="font-bold text-indigo-900 mt-2">إضافة مورد جديد</h3></div>
                <Input label="اسم التاجر / الشركة" value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} required />
                <Input label="رقم الجوال (اختياري)" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} />
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">إلغاء</button>
                  <button disabled={isSubmitting} type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة التاجر"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddPurchase} className="p-6 space-y-5">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">اختر المورد (التاجر)</label>
                    <select value={purchaseForm.supplierId} onChange={e => setPurchaseForm({...purchaseForm, supplierId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none font-medium text-gray-900">
                      <option value="">-- اختر من القائمة --</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <button type="button" onClick={() => setIsSupplierModalOpen(true)} className="bg-indigo-100 text-indigo-700 p-2.5 rounded-xl hover:bg-indigo-200 transition" title="إضافة مورد جديد">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="إجمالي الفاتورة (₪)" type="number" step="0.01" value={purchaseForm.totalAmount} onChange={e => setPurchaseForm({...purchaseForm, totalAmount: e.target.value})} required />
                  <Input label="المدفوع كاش (₪)" type="number" step="0.01" value={purchaseForm.paidAmount} onChange={e => setPurchaseForm({...purchaseForm, paidAmount: e.target.value})} />
                </div>
                
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex justify-between items-center text-sm font-bold">
                  <span className="text-amber-700">الديون المضافة للتاجر:</span>
                  <span className="text-amber-900">₪ {Math.max(0, (parseFloat(purchaseForm.totalAmount || "0") - parseFloat(purchaseForm.paidAmount || "0"))).toFixed(2)}</span>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-black">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الفاتورة"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. نافذة تسديد دفعة لتاجر */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-emerald-700 flex items-center gap-2"><Wallet className="w-5 h-5"/> تسديد دفعة لتاجر</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddPayment} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">اختر التاجر المراد التسديد له</label>
                <select 
                  value={paymentForm.supplierId} 
                  onChange={e => setPaymentForm({...paymentForm, supplierId: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none font-medium text-gray-900"
                >
                  <option value="">-- اختر من القائمة --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (دين: ₪{s.totalDebt})</option>
                  ))}
                </select>
              </div>

              <Input 
                label="المبلغ المسدد (كاش/تحويل)" 
                type="number" step="0.01" 
                value={paymentForm.amount} 
                onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} 
                required 
              />
              
              <Textarea 
                label="البيان / ملاحظات الدفع (اختياري)" 
                placeholder="مثال: دفعة نقدية عن طريق فلان..." 
                rows={2} 
                value={paymentForm.notes} 
                onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})} 
              />

              <button disabled={isSubmitting} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-emerald-700">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الدفعة وخصمها من الدين"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}