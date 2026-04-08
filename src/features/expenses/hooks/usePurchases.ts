"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Supplier, SparePart } from "@prisma/client";
import { PurchaseInvoiceWithSupplier } from "@/src/types";
import { getPurchaseInvoices, addPurchaseInvoice, getSuppliers } from "@/src/server/actions/expenses.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { InvoiceFormValues } from "../validations/validations";

export function usePurchases() {
  const [purchases, setPurchases] = useState<PurchaseInvoiceWithSupplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [purRes, supRes, partsRes] = await Promise.all([
      getPurchaseInvoices(), getSuppliers(), getAllSparePartsForDropdown()
    ]);
    if (purRes.success) setPurchases((purRes.data as PurchaseInvoiceWithSupplier[]) || []);
    if (supRes.success) setSuppliers((supRes.data as Supplier[]) || []);
    if (partsRes.success) setSpareParts((partsRes.data as SparePart[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddInvoice = async (data: InvoiceFormValues) => {
    const res = await addPurchaseInvoice(data);
    if (res.success) {
      toast.success("تم اعتماد الفاتورة وتحديث المخزن بنجاح");
      setIsModalOpen(false);
      fetchData();
      return true;
    }
    toast.error(res.error || "حدث خطأ أثناء حفظ الفاتورة");
    return false;
  };

  return { purchases, suppliers, spareParts, isLoading, isModalOpen, setIsModalOpen, actions: { handleAddInvoice, refresh: fetchData } };
}