"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { toast } from "react-hot-toast";
import { Supplier } from "@prisma/client";
import { PurchaseInvoiceWithSupplier, PaginationMetadata, SparePartDropdownOption } from "@/src/types/expense.types";
import { getPaginatedPurchases, addPurchaseInvoice, getSuppliers } from "@/src/server/actions/expenses.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { InvoiceFormValues } from "../validations/validations";

const purchasesFetcher = async (page: number) => {
  const res = await getPaginatedPurchases(page, 10);
  if ("error" in res) throw new Error(String(res.error));
  return res;
};

const suppliersFetcher = async () => {
  const res = await getSuppliers();
  if ("error" in res) throw new Error(String(res.error));
  return res.data as Supplier[];
};

const partsFetcher = async () => {
  const res = await getAllSparePartsForDropdown();
  if ("error" in res) throw new Error(String(res.error));
  return res.data as SparePartDropdownOption[];
};

export function usePurchases(currentPage: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: suppliers } = useSWR("suppliers-list", suppliersFetcher, { revalidateOnFocus: false });
  const { data: spareParts } = useSWR("parts-dropdown", partsFetcher, { revalidateOnFocus: false });
  const { data: purchasesRes, isLoading, mutate: mutatePurchases } = useSWR(["purchases-list", currentPage], () => purchasesFetcher(currentPage), { keepPreviousData: true });

  const handleAddInvoice = useCallback(async (data: InvoiceFormValues) => {
    const res = await addPurchaseInvoice(data);
    if ("error" in res) {
      toast.error(String(res.error)); 
      return false;
    }
    toast.success("تم اعتماد الفاتورة وتحديث المخزن بنجاح");
    setIsModalOpen(false);
    mutatePurchases();
    return true;
  }, [mutatePurchases]);

  return { 
    purchases: (purchasesRes?.data as PurchaseInvoiceWithSupplier[]) || [], 
    metadata: (purchasesRes?.metadata as PaginationMetadata) || { totalItems: 0, totalPages: 1, currentPage: 1 },
    suppliers: suppliers || [], 
    spareParts: spareParts || [], 
    isLoading, isModalOpen, setIsModalOpen, 
    actions: { handleAddInvoice, refresh: mutatePurchases } 
  };
}