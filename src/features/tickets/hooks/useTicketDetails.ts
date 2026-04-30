"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getTicketById, updateTicket, addPartToTicket,
  removePartFromTicket, addPaymentToTicket, updateTicketInvoiceImage,
  deleteTicketPayment, updateTicketPayment
} from "@/src/server/actions/tickets.actions";
import { TicketWithDetails } from "@/src/types";
import { SparePart, TicketStatus } from "@prisma/client";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions";
import { deleteFilesFromUploadThing } from "@/src/server/actions/uploadthing.actions";

export function useTicketDetails(ticketId: string) {
  const [ticketData, setTicketData] = useState<TicketWithDetails | null>(null);
  const [inventory, setInventory] = useState<SparePart[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [status, setStatus] = useState<TicketStatus>("OPEN");
  const [laborCost, setLaborCost] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPart, setIsUpdatingPart] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const ticketResult = await getTicketById(ticketId);
      if ("error" in ticketResult) {
        toast.error(String(ticketResult.error));
      } else if (ticketResult.data) {
        const t = ticketResult.data as TicketWithDetails;
        setTicketData(t);
        setStatus(t.status);
        setLaborCost(t.laborCost || 0);
        setDiscountPercentage(t.discount || 0);
      }
      const inv = await getAllSparePartsForDropdown();
      if (!("error" in inv) && inv.data) setInventory(inv.data as SparePart[]);
    } catch {
      toast.error("خطأ في الاتصال بقاعدة البيانات");
    } finally {
      setIsLoadingData(false);
    }
  }, [ticketId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const partsTotal = ticketData?.partsUsed?.reduce((sum, p) => sum + (p.priceAtTime * p.quantity), 0) || 0;
  const subTotal = partsTotal + laborCost;
  const discountAmount = subTotal * (discountPercentage / 100);
  const grandTotal = subTotal - discountAmount;
  const totalPaid = (ticketData?.advancePayment || 0) + (ticketData?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0);
  const remainingAmount = grandTotal - totalPaid;

  const finance = { partsTotal, subTotal, discountAmount, grandTotal, totalPaid, remainingAmount };

  const handleSaveTicket = async () => {
    setIsSaving(true);
    const result = await updateTicket(ticketId, { status, laborCost, discount: discountPercentage });
    if ("error" in result) toast.error(String(result.error));
    else toast.success("تم الحفظ");
    setIsSaving(false);
  };

  const handleAddPart = async (sparePartId: string) => {
    if (!sparePartId) return;
    setIsUpdatingPart(true);
    const result = await addPartToTicket({ ticketId, sparePartId, quantity: 1 });
    if ("error" in result) toast.error(String(result.error));
    else { toast.success("تمت الإضافة"); fetchData(); }
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
    if ("error" in res) toast.error(String(res.error));
    else { toast.success("تم تسجيل الدفعة"); fetchData(); }
  };

  const handleUpdateImage = async (url: string) => {
    const currentUrls = ticketData?.invoiceImageUrl || "";
    const newUrls = currentUrls ? `${currentUrls},${url}` : url;
    await updateTicketInvoiceImage(ticketId, newUrls);
    fetchData();
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    setIsUpdatingPart(true); 
    try {
      const currentUrls = ticketData?.invoiceImageUrl || "";
      const newUrls = currentUrls.split(',').filter(u => u !== urlToRemove).join(',');
      await updateTicketInvoiceImage(ticketId, newUrls);
      const deleteRes = await deleteFilesFromUploadThing(urlToRemove);
      if ("error" in deleteRes) toast.error("تم إزالة الصورة من التذكرة، ولكن حدث خطأ في السحابة");
      else toast.success("تم مسح الصورة من النظام والسحابة بنجاح");
      fetchData();
    } catch {
      toast.error("حدث خطأ غير متوقع أثناء مسح الصورة");
    } finally {
      setIsUpdatingPart(false);
    }
  };

  const handleEditPayment = async (paymentId: string, newAmount: number) => {
    const res = await updateTicketPayment(paymentId, newAmount, ticketId);
    if ("error" in res) toast.error(String(res.error));
    else { toast.success("تم تعديل الدفعة"); fetchData(); }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if(!confirm("هل أنت متأكد من حذف الدفعة؟")) return;
    const res = await deleteTicketPayment(paymentId, ticketId);
    if ("error" in res) toast.error(String(res.error));
    else { toast.success("تم حذف الدفعة"); fetchData(); }
  };

  return {
    ticketData, inventory, isLoadingData, isSaving, isUpdatingPart,
    status, setStatus, laborCost, setLaborCost, discountPercentage, setDiscountPercentage,
    finance,
    actions: { handleSaveTicket, handleAddPart, handleRemovePart, handleAddPayment, handleUpdateImage, handleRemoveImage, handleDeletePayment, handleEditPayment }
  };
}