"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  getTicketById, updateTicket, addPartToTicket, 
  removePartFromTicket, addPaymentToTicket, updateTicketInvoiceImage 
} from "../actions";
import { getAllSparePartsForDropdown } from "@/src/features/inventory/actions";

export function useTicketDetails(ticketId: string) {
  const [ticketData, setTicketData] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [status, setStatus] = useState<any>("OPEN");
  const [laborCost, setLaborCost] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0); 
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPart, setIsUpdatingPart] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const ticketResult = await getTicketById(ticketId);
      if (ticketResult?.data) {
        const t = ticketResult.data;
        setTicketData(t);
        setStatus(t.status);
        setLaborCost(t.laborCost || 0);
        setDiscountPercentage(t.discount || 0);
      }
      const inv = await getAllSparePartsForDropdown();
      if (inv.data) setInventory(inv.data);
    } catch (e) {
      toast.error("خطأ في الاتصال بقاعدة البيانات");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => { fetchData(); }, [ticketId]);

  // الحسابات المالية
  const partsTotal = ticketData?.partsUsed?.reduce((sum: number, p: any) => sum + (p.priceAtTime * p.quantity), 0) || 0;
  const subTotal = partsTotal + laborCost;
  const discountAmount = subTotal * (discountPercentage / 100);
  const grandTotal = subTotal - discountAmount;
  const totalPaid = (ticketData?.advancePayment || 0) + (ticketData?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0);
  const remainingAmount = grandTotal - totalPaid;

  const finance = { partsTotal, subTotal, discountAmount, grandTotal, totalPaid, remainingAmount };

  // الأكشنز
  const handleSaveTicket = async () => {
    setIsSaving(true);
    const result = await updateTicket(ticketId, { status, laborCost, discount: discountPercentage });
    if (result.success) toast.success("تم الحفظ");
    setIsSaving(false);
  };

  const handleAddPart = async (sparePartId: string) => {
    if (!sparePartId) return;
    setIsUpdatingPart(true);
    const result = await addPartToTicket({ ticketId, sparePartId, quantity: 1 });
    if (result.success) { toast.success("تمت الإضافة"); fetchData(); }
    setIsUpdatingPart(false);
  };

  const handleRemovePart = async (tpId: string) => {
    setIsUpdatingPart(true);
    await removePartFromTicket(tpId, ticketId);
    fetchData();
    setIsUpdatingPart(false);
  };

  const handleAddPayment = async (amount: number) => {
    const res = await addPaymentToTicket(ticketId, amount);
    if (res.success) { toast.success("تم تسجيل الدفعة"); fetchData(); }
  };

  const handleUpdateImage = async (url: string) => {
    await updateTicketInvoiceImage(ticketId, url);
    fetchData();
  };

  return {
    ticketData, inventory, isLoadingData, isSaving, isUpdatingPart,
    status, setStatus, laborCost, setLaborCost, discountPercentage, setDiscountPercentage,
    finance,
    actions: { handleSaveTicket, handleAddPart, handleRemovePart, handleAddPayment, handleUpdateImage }
  };
}