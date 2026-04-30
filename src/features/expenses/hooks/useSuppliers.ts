"use client";

import { useState, useCallback } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { toast } from "react-hot-toast";
import { Supplier } from "@prisma/client";
import { SupplierPaymentWithSupplier, PaginationMetadata } from "@/src/types/expense.types";
import { getPaginatedPayments, addSupplier, addSupplierPayment, updateSupplierPayment, deleteSupplierPayment, getSuppliers } from "@/src/server/actions/expenses.actions";
import { SupplierFormValues, PaymentFormValues } from "../validations/validations";

const paymentsFetcher = async (page: number) => {
  const res = await getPaginatedPayments(page, 10);
  if (res.error) throw new Error(res.error);
  return res;
};

const suppliersFetcher = async () => {
  const res = await getSuppliers();
  return res.data as Supplier[];
};

export function useSuppliers(currentPage: number) {
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; editingId: string | null }>({ isOpen: false, editingId: null });
  const [ledgerSupplierId, setLedgerSupplierId] = useState<string | null>(null);

  const { data: suppliers } = useSWR("suppliers-list", suppliersFetcher, { revalidateOnFocus: false });
  const { data: paymentsRes, isLoading, mutate: mutatePayments } = useSWR(["payments-list", currentPage], () => paymentsFetcher(currentPage), { keepPreviousData: true });

  const handleAddSupplier = useCallback(async (data: SupplierFormValues) => {
    const res = await addSupplier({ name: data.name, phone: data.phone });
    if (res.success) {
      toast.success("تمت إضافة المورد بنجاح");
      setIsSupplierModalOpen(false);
      globalMutate("suppliers-list"); 
      return true;
    }
    toast.error(res.error || "خطأ"); 
    return false;
  }, []);

  const handleSavePayment = useCallback(async (data: PaymentFormValues) => {
    let res;
    if (paymentModal.editingId) {
      res = await updateSupplierPayment(paymentModal.editingId, { amount: data.amount, notes: data.notes || "" });
    } else {
      res = await addSupplierPayment({ supplierId: data.supplierId, amount: data.amount, notes: data.notes || "" });
    }

    if (res.success) {
      toast.success(paymentModal.editingId ? "تم تعديل الدفعة بنجاح" : "تم تسجيل الدفعة بنجاح");
      setPaymentModal({ isOpen: false, editingId: null });
      mutatePayments(); 
      globalMutate("financial-overview");
      return true;
    }
    toast.error(res.error || "خطأ في تسجيل الدفعة"); 
    return false;
  }, [paymentModal.editingId, mutatePayments]);

  const handleDeletePayment = useCallback(async (id: string) => {
    if (!confirm("تحذير: حذف الدفعة سيعيد المبلغ كدين على الورشة. هل أنت متأكد؟")) return;
    const res = await deleteSupplierPayment(id);
    if (res.success) { 
      toast.success("تم حذف الدفعة وتحديث الرصيد"); 
      mutatePayments(); 
      globalMutate("financial-overview"); 
    } else {
      toast.error(res.error || "خطأ");
    }
  }, [mutatePayments]);

  return {
    suppliers: suppliers || [],
    payments: (paymentsRes?.data as SupplierPaymentWithSupplier[]) || [], 
    metadata: (paymentsRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    isLoading, 
    isSupplierModalOpen, 
    setIsSupplierModalOpen, 
    paymentModal, 
    setPaymentModal, 
    ledgerSupplierId, 
    setLedgerSupplierId,
    actions: { handleAddSupplier, handleSavePayment, handleDeletePayment, refresh: mutatePayments }
  };
}