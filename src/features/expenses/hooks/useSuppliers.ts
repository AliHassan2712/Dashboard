"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Supplier } from "@prisma/client";
import { SupplierPaymentWithSupplier } from "@/src/types";
import { getSuppliers, getSupplierPayments, addSupplier, addSupplierPayment, updateSupplierPayment, deleteSupplierPayment } from "@/src/server/actions/expenses.actions";
import { SupplierFormValues, PaymentFormValues } from "../validations/validations";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [payments, setPayments] = useState<SupplierPaymentWithSupplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالات النوافذ المنبثقة
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; editingId: string | null }>({ isOpen: false, editingId: null });
  const [ledgerSupplierId, setLedgerSupplierId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [supRes, payRes] = await Promise.all([getSuppliers(), getSupplierPayments()]);
    if (supRes.success) setSuppliers((supRes.data as Supplier[]) || []);
    if (payRes.success) setPayments((payRes.data as SupplierPaymentWithSupplier[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddSupplier = async (data: SupplierFormValues) => {
    const res = await addSupplier({ name: data.name, phone: data.phone });
    if (res.success) {
      toast.success("تمت إضافة المورد بنجاح");
      setIsSupplierModalOpen(false);
      fetchData();
      return true;
    }
    toast.error(res.error || "خطأ"); return false;
  };

  const handleSavePayment = async (data: PaymentFormValues) => {
    let res;
    if (paymentModal.editingId) {
      res = await updateSupplierPayment(paymentModal.editingId, { amount: data.amount, notes: data.notes || "" });
    } else {
      res = await addSupplierPayment({ supplierId: data.supplierId, amount: data.amount, notes: data.notes || "" });
    }

    if (res.success) {
      toast.success(paymentModal.editingId ? "تم تعديل الدفعة بنجاح" : "تم تسجيل الدفعة وخصمها من الدين");
      setPaymentModal({ isOpen: false, editingId: null });
      fetchData();
      return true;
    }
    toast.error(res.error || "خطأ في تسجيل الدفعة"); return false;
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("تحذير: حذف الدفعة سيعيد المبلغ كدين على الورشة. هل أنت متأكد؟")) return;
    const res = await deleteSupplierPayment(id);
    if (res.success) { toast.success("تم حذف الدفعة وتحديث الرصيد التلقائي"); fetchData(); }
    else toast.error(res.error || "خطأ");
  };

  return {
    suppliers, payments, isLoading,
    isSupplierModalOpen, setIsSupplierModalOpen,
    paymentModal, setPaymentModal,
    ledgerSupplierId, setLedgerSupplierId,
    actions: { handleAddSupplier, handleSavePayment, handleDeletePayment, refresh: fetchData }
  };
}