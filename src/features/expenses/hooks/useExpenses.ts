"use client";

import { useReducer, useEffect, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Expense, Supplier, ExpenseCategory } from "@prisma/client";
import { ExpensesState, PurchaseInvoiceWithSupplier, SupplierPaymentWithSupplier } from "@/src/types";
import { Action, initialState } from "@/src/constants/expenses";
import { 
  getFinancialOverview, getExpenses, getPurchaseInvoices, 
  getSuppliers, getSupplierPayments, addExpense, 
  addPurchaseInvoice, addSupplier, addSupplierPayment, deleteExpense,
  updateSupplierPayment, deleteSupplierPayment
} from "@/src/server/actions/expenses.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";

function reducer(state: ExpensesState, action: Action): ExpensesState {
  switch (action.type) {
    case "SET_TAB": return { ...state, activeTab: action.payload as ExpensesState["activeTab"] };
    case "SET_LOADING": return { ...state, isLoading: action.payload as boolean };
    case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload as boolean };
    case "SET_DATA": return { ...state, ...(action.payload as Partial<ExpensesState>) };
    case "OPEN_MODAL": return { ...state, modals: { ...initialState.modals, [action.payload as string]: true } };
    case "CLOSE_MODALS": return { ...state, modals: initialState.modals, editingPaymentId: null, ledgerSupplierId: null };
    case "UPDATE_FORM": 
      return { 
        ...state, 
        forms: { 
          ...state.forms, 
          [action.form]: { 
            ...state.forms[action.form], 
            [action.field]: action.value 
          } 
        } 
      };
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
        spareParts: (partsRes.data as any[]) || [], 
        isLoading: false,
      }
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddExpense = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addExpense({
      title: state.forms.expense.title, 
      amount: parseFloat(state.forms.expense.amount), 
      category: state.forms.expense.category as ExpenseCategory, 
      notes: state.forms.expense.notes
    });
    if (res.success) { 
      toast.success("تم تسجيل المصروف"); 
      dispatch({ type: "CLOSE_MODALS" }); 
      dispatch({ type: "UPDATE_FORM", form: "expense", field: "title", value: ""}); 
      dispatch({ type: "UPDATE_FORM", form: "expense", field: "amount", value: ""}); 
      fetchData(); 
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    const res = await deleteExpense(id);
    if (res.success) { toast.success("تم الحذف"); fetchData(); }
  };

  const handleAddSupplier = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addSupplier({ name: state.forms.supplier.name, phone: state.forms.supplier.phone });
    if (res.success) {
      toast.success("تمت إضافة المورد بنجاح");
      dispatch({ type: "OPEN_MODAL", payload: "purchase" });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "supplierId", value: res.data?.id || "" });
      fetchData();
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const openLedger = (supplierId: string) => {
    dispatch({ type: "SET_DATA", payload: { ledgerSupplierId: supplierId } });
    dispatch({ type: "OPEN_MODAL", payload: "ledger" });
  };

  const handleAddPayment = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", payload: true });
    const res = await addSupplierPayment({
      supplierId: state.forms.payment.supplierId, 
      amount: parseFloat(state.forms.payment.amount), 
      notes: state.forms.payment.notes
    });
    if (res.success) { 
        toast.success("تم تسجيل الدفعة وخصمها من الرصيد"); 
        dispatch({ type: "CLOSE_MODALS" }); 
        dispatch({ type: "UPDATE_FORM", form: "payment", field: "amount", value: "" });
        dispatch({ type: "UPDATE_FORM", form: "payment", field: "notes", value: "" });
        fetchData(); 
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("تحذير: حذف الدفعة سيعيد المبلغ كدين على الورشة. هل أنت متأكد؟")) return;
    const res = await deleteSupplierPayment(id);
    if (res.success) { toast.success("تم حذف الدفعة وتحديث الرصيد التلقائي"); fetchData(); }
    else toast.error(res.error || "خطأ");
  };

  const openEditPayment = (pay: SupplierPaymentWithSupplier) => {
    dispatch({ type: "UPDATE_FORM", form: "payment", field: "amount", value: pay.amount.toString() });
    dispatch({ type: "UPDATE_FORM", form: "payment", field: "notes", value: pay.notes || "" });
    dispatch({ type: "UPDATE_FORM", form: "payment", field: "supplierId", value: pay.supplierId });
    dispatch({ type: "SET_DATA", payload: { editingPaymentId: pay.id } });
    dispatch({ type: "OPEN_MODAL", payload: "editPayment" });
  };

  const handleEditPaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.editingPaymentId) return;
    dispatch({ type: "SET_SUBMITTING", payload: true });
    
    const res = await updateSupplierPayment(state.editingPaymentId, {
      amount: parseFloat(state.forms.payment.amount),
      notes: state.forms.payment.notes
    });

    if (res.success) {
      toast.success("تم تعديل الدفعة وتحديث رصيد التاجر");
      dispatch({ type: "CLOSE_MODALS" });
      dispatch({ type: "UPDATE_FORM", form: "payment", field: "amount", value: "" });
      dispatch({ type: "UPDATE_FORM", form: "payment", field: "notes", value: "" });
      fetchData();
    } else toast.error(res.error || "خطأ");
    
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  const handleAddPurchase = async (e: FormEvent) => {
    e.preventDefault();
    const { supplierId, paidAmount,notes, items } = state.forms.purchase;
    
    if (items.length === 0) return toast.error("يجب إضافة صنف واحد على الأقل للفاتورة");
    if (items.some(i => (!i.sparePartId && !i.isNew) || !i.quantity || !i.unitCost)) return toast.error("يرجى إكمال بيانات كل الأصناف");
    if (items.some(i => i.isNew && !i.newItemName)) return toast.error("يرجى إدخال اسم الصنف الجديد");

    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitCost)), 0);

    dispatch({ type: "SET_SUBMITTING", payload: true });
    
    const processedItems = items.map(i => ({
        sparePartId: i.sparePartId,
        isNew: i.isNew,
        newItemName: i.newItemName,
        newItemSellingPrice: i.newItemSellingPrice ? parseFloat(i.newItemSellingPrice) : undefined,
        quantity: Number(i.quantity),
        unitCost: Number(i.unitCost),
        notes: i.notes
    }));

    const res = await addPurchaseInvoice({
      supplierId,
      totalAmount,
      paidAmount: parseFloat(paidAmount || "0"),
      notes,
      items: processedItems
    });
    
    if (res.success) {
      toast.success("تم تسجيل الفاتورة وإضافة البضاعة للمخزون!");
      dispatch({ type: "CLOSE_MODALS" });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "items", value: [] });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "paidAmount", value: "" });
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "notes", value: "" }); // 👈 تصفير الوصف
      fetchData();
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };

  return { 
    state, 
    dispatch, 
    actions: { 
        handleAddExpense, handleDeleteExpense, handleAddPurchase, handleAddSupplier, 
        handleAddPayment, handleDeletePayment, handleEditPaymentSubmit, openEditPayment, openLedger
    } 
  };
}