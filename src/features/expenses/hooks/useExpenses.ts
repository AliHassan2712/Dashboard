"use client";

import { useReducer, useEffect, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Expense, Supplier, SparePart } from "@prisma/client";
import { ExpensesState, PurchaseInvoiceWithSupplier, SupplierPaymentWithSupplier } from "@/src/types";
import { Action, initialState } from "@/src/constants/expenses";
import { getFinancialOverview, getExpenses, addExpense, deleteExpense, getPurchaseInvoices, addPurchaseInvoice, getSuppliers, getSupplierPayments, updateSupplierPayment, addSupplierPayment, addSupplier, deleteSupplierPayment } from "@/src/server/actions/expenses.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { ExpenseFormValues, InvoiceFormValues, PaymentFormValues, SupplierFormValues } from "../validations/validations";

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
        spareParts: partsRes.success ? (partsRes as { success: true; data: SparePart[] }).data : [], isLoading: false,
      }
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddExpense = async (data: ExpenseFormValues) => {
    const res = await addExpense({
      title: data.title,
      amount: data.amount,
      category: data.category,
      notes: data.notes || ""
    });

    if (res.success) {
      toast.success("تم تسجيل المصروف");
      fetchData();
      return true;
    } else {
      toast.error(res.error || "خطأ");
      return false;
    }
  };
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    const res = await deleteExpense(id);
    if (res.success) { toast.success("تم الحذف"); fetchData(); }
  };

  const handleAddSupplier = async (data: SupplierFormValues) => {
    const res = await addSupplier({ name: data.name, phone: data.phone });
    if (res.success) {
      toast.success("تمت إضافة المورد بنجاح");
      fetchData();
      dispatch({ type: "OPEN_MODAL", payload: "purchase" });
      return true;
    } else {
      toast.error(res.error || "خطأ");
      return false;
    }
  };

  const handleSavePayment = async (data: PaymentFormValues) => {
    let res;
    if (state.editingPaymentId) {
      res = await updateSupplierPayment(state.editingPaymentId, { amount: data.amount, notes: data.notes || "" });
    } else {
      res = await addSupplierPayment({ supplierId: data.supplierId, amount: data.amount, notes: data.notes || "" });
    }

    if (res.success) {
      toast.success(state.editingPaymentId ? "تم تعديل الدفعة بنجاح" : "تم تسجيل الدفعة وخصمها من الدين");
      fetchData();
      return true;
    } else {
      toast.error(res.error || "خطأ في تسجيل الدفعة");
      return false;
    }
  };

  const openLedger = (supplierId: string) => {
    dispatch({ type: "SET_DATA", payload: { ledgerSupplierId: supplierId } });
    dispatch({ type: "OPEN_MODAL", payload: "ledger" });
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


  const handleAddPurchase = async (e: FormEvent) => {
    e.preventDefault();
    const { supplierId, paidAmount, notes, items } = state.forms.purchase;

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
      dispatch({ type: "UPDATE_FORM", form: "purchase", field: "notes", value: "" });
      fetchData();
    } else toast.error(res.error || "خطأ");
    dispatch({ type: "SET_SUBMITTING", payload: false });
  };


// 3. دالة إضافة فاتورة المشتريات
  const handleAddInvoice = async (data: InvoiceFormValues) => {
    
    // نبعت البيانات المجهزة (formattedData) بدل (data)
    const res = await addPurchaseInvoice(data); 
    
    if (res.success) {
      toast.success("تم اعتماد الفاتورة وتحديث المخزن بنجاح");
      fetchData(); 
      return true; 
    } else {
      toast.error(res.error || "حدث خطأ أثناء حفظ الفاتورة");
      return false;
    }
  };

  
  return {
    state,
    dispatch,
    actions: {
      handleAddExpense, handleDeleteExpense, handleAddPurchase, handleAddSupplier,
      handleDeletePayment, openEditPayment, openLedger, handleSavePayment , handleAddInvoice
    }
  };
}