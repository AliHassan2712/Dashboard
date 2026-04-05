"use client";

import { useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import {  Expense, Supplier } from "@prisma/client";
import { ExpensesState, PurchaseInvoiceWithSupplier, SupplierPaymentWithSupplier } from "@/src/types";
import { 
  getFinancialOverview, getExpenses, getPurchaseInvoices, 
  getSuppliers, getSupplierPayments, addExpense, 
  addPurchaseInvoice, addSupplier, addSupplierPayment, deleteExpense 
} from "../actions";
import { getAllSparePartsForDropdown } from "../../inventory/actions"; 
import { Action, initialState } from "@/src/constants/expenses";



function reducer(state: ExpensesState, action: Action): ExpensesState {
  switch (action.type) {
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_LOADING": return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload };
    case "SET_DATA": return { ...state, ...action.payload };
    case "OPEN_MODAL": return { ...state, modals: { ...initialState.modals, [action.payload]: true } };
    case "CLOSE_MODALS": return { ...state, modals: initialState.modals };
    case "UPDATE_FORM": return { ...state, forms: { ...state.forms, [action.form]: { ...state.forms[action.form], [action.field]: action.value } } };
    default: return state;
  }
}

export function useExpenses() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const [ovRes, expRes, purRes, supRes, payRes, partsRes] = await Promise.all([
      getFinancialOverview(), getExpenses(), getPurchaseInvoices(), 
      getSuppliers(), getSupplierPayments(), getAllSparePartsForDropdown()
    ]);
    
    dispatch({
      type: "SET_DATA",
      payload: {
        overview: ovRes.data || initialState.overview,
        expenses: (expRes.data as Expense[]) || [],
        purchases: (purRes.data as PurchaseInvoiceWithSupplier[]) || [],
        suppliers: (supRes.data as Supplier[]) || [],
        payments: (payRes.data as SupplierPaymentWithSupplier[]) || [],
        spareParts: partsRes.data || [],
        isLoading: false,
      }
    });
  };

  useEffect(() => { fetchData(); }, []);

  // ... (نفس دوال المصاريف والمورد والدفعات بدون تغيير)
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addExpense({
      title: state.forms.expense.title, amount: parseFloat(state.forms.expense.amount), 
      category: state.forms.expense.category, notes: state.forms.expense.notes
    });
    if (res.success) { toast.success("تم تسجيل المصروف"); dispatch({ type: "CLOSE_MODALS" }); dispatch({ type: "UPDATE_FORM", form: "expense", field: "title", value: ""}); fetchData(); } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    const res = await deleteExpense(id);
    if (res.success) { toast.success("تم الحذف"); fetchData(); }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addSupplier(state.forms.supplier);
    if (res.success) {
      toast.success("تمت إضافة المورد");
      dispatch({ type: "OPEN_MODAL", payload: "purchase" });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "supplierId", value: res.data?.id });
      fetchData();
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addSupplierPayment({
      supplierId: state.forms.payment.supplierId, amount: parseFloat(state.forms.payment.amount), notes: state.forms.payment.notes
    });
    if (res.success) { toast.success("تم التسديد"); dispatch({ type: "CLOSE_MODALS" }); fetchData(); } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  //  الدالة الأهم: حفظ فاتورة المشتريات
  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const { supplierId, paidAmount, items } = state.forms.purchase;
    
    if (items.length === 0) return toast.error("يجب إضافة صنف واحد على الأقل للفاتورة");
    if (items.some(i => !i.sparePartId || !i.quantity || !i.unitCost)) return toast.error("يرجى إكمال بيانات كل الأصناف");

    // حساب الإجمالي أوتوماتيكياً
    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitCost)), 0);

    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addPurchaseInvoice({
      supplierId,
      totalAmount,
      paidAmount: parseFloat(paidAmount || "0"),
      items: items.map(i => ({ sparePartId: i.sparePartId, quantity: Number(i.quantity), unitCost: Number(i.unitCost) }))
    });
    if (res.success) {
      toast.success("تم تسجيل الفاتورة وإضافة البضاعة للمخزون!");
      dispatch({ type: "CLOSE_MODALS" });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "items", value: [] });
      fetchData();
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  return { state, dispatch, actions: { handleAddExpense, handleDeleteExpense, handleAddPurchase, handleAddSupplier, handleAddPayment } };
}