"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, Printer, Loader2 } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { siteConfig } from "@/src/config/site";

import { useTicketDetails } from "@/src/features/tickets/hooks/useTicketDetails";
import { CustomerInfo } from "@/src/features/tickets/components/details/CustomerInfo";
import { PartsTable } from "@/src/features/tickets/components/details/PartsTable";
import { FinancialSidebar } from "@/src/features/tickets/components/details/FinancialSidebar";
import { TicketAttachments } from "@/src/features/tickets/components/details/TicketAttachments";

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const {
    ticketData, inventory, isLoadingData, isSaving, isUpdatingPart,
    status, setStatus, laborCost, setLaborCost, discountPercentage, setDiscountPercentage,
    finance, actions
  } = useTicketDetails(id);

  if (isLoadingData || !ticketData) {
    return (
      <div className="flex justify-center min-h-[60vh] items-center">
        <Loader2 className="animate-spin text-brand-600 dark:text-brand-400 w-12 h-12" />
      </div>
    );
  }

  // تحويل النص المخزن في الداتا بيز لمصفوفة صور
const imagesArray = ticketData.invoiceImageUrl 
  ? ticketData.invoiceImageUrl.split(',').filter(Boolean) 
  : [];
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 print:bg-white print:p-0 print:m-0 print:text-black">

      {/*  ترويسة الطباعة الرسمية */}
      <div className="hidden print:flex flex-col items-center border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-black mb-1">{siteConfig.name}</h1>
        <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium">{siteConfig.slogan}</p>
        <div className="flex gap-6 mt-2 text-sm font-bold">
          <span>{siteConfig.address}</span>
          <span>جوال: {siteConfig.phone}</span>
        </div>
      </div>

      {/* الترويسة العادية وأزرار التحكم */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-center gap-4 bg-app-card-light dark:bg-app-card-dark p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.TICKETS} className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-gray-100 rounded-xl text-app-text-secondary-light dark:text-app-text-secondary-dark transition">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">تذكرة صيانة #{id.slice(-6).toUpperCase()}</h1>
            <p className="text-xs text-app-text-muted-light dark:text-app-text-muted-dark font-bold">الفني المسؤول: {ticketData.worker?.name || "غير محدد"}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-app-text-primary-light dark:text-app-text-primary-dark hover:bg-gray-200 rounded-xl font-bold transition">
            <Printer className="w-4 h-4" /> طباعة الفاتورة
          </button>
          
          <button onClick={actions.handleSaveTicket} disabled={isSaving} className="flex-1 sm:flex-none flex items-center gap-2 bg-brand-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition disabled:opacity-50">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* منطقة العمل الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* القسم الأيمن: بيانات الزبون وجدول القطع والصور */}
        <div className="space-y-6 lg:col-span-2 print:col-span-2">
          <CustomerInfo ticket={ticketData} status={status} setStatus={setStatus} />
          
          <PartsTable 
            parts={ticketData.partsUsed} 
            inventory={inventory} 
            isUpdating={isUpdatingPart} 
            onAdd={actions.handleAddPart} 
            onRemove={actions.handleRemovePart} 
          />

          <TicketAttachments 
            imagesArray={imagesArray} 
            onAddImage={actions.handleUpdateImage} 
            onRemoveImage={actions.handleRemoveImage} 
          />
        </div>

        {/* القسم الأيسر: الحسابات المالية */}
        <div className="space-y-6 lg:col-span-1 print:col-span-1">
          <FinancialSidebar
            finance={finance} 
            laborCost={laborCost} 
            setLaborCost={setLaborCost} 
            discountPercentage={discountPercentage}
            setDiscountPercentage={setDiscountPercentage} 
            payments={ticketData.payments} 
            advancePayment={ticketData.advancePayment}
            onAddPayment={actions.handleAddPayment}
            onDeletePayment={actions.handleDeletePayment}
            onEditPayment={actions.handleEditPayment}
          />
        </div>

      </div>
    </div>
  );
}