"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Printer, Loader2, Camera, X } from "lucide-react";
import { UploadButton } from "@/src/lib/uploadthing";

// استدعاء الهوك والمكونات المنفصلة
import { useTicketDetails } from "@/src/features/tickets/hooks/useTicketDetails";
import { CustomerInfo } from "@/src/features/tickets/components/details/CustomerInfo";
import { PartsTable } from "@/src/features/tickets/components/details/PartsTable";
import { FinancialSidebar } from "@/src/features/tickets/components/details/FinancialSidebar";

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // استخراج كل الداتا والأكشنز من الهوك (عزل تام للمنطق)
  const { 
    ticketData, inventory, isLoadingData, isSaving, isUpdatingPart,
    status, setStatus, laborCost, setLaborCost, discountPercentage, setDiscountPercentage,
    finance, actions 
  } = useTicketDetails(id);

  if (isLoadingData || !ticketData) {
    return <div className="flex justify-center min-h-[60vh] items-center"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 print:bg-white print:p-0">
      
      {/* الترويسة وأزرار التحكم */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/tickets" className="p-2 hover:bg-gray-100 rounded-full text-gray-400"><ArrowRight className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold">تذكرة #{id.slice(-6).toUpperCase()}</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => window.print()} className="p-2.5 bg-gray-800 text-white rounded-xl shadow-md"><Printer className="w-5 h-5" /></button>
          <button onClick={actions.handleSaveTicket} disabled={isSaving} className="flex-1 sm:flex-none bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg disabled:opacity-50">
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <CustomerInfo ticket={ticketData} status={status} setStatus={setStatus} />
          
          <PartsTable parts={ticketData.partsUsed} inventory={inventory} isUpdating={isUpdatingPart} onAdd={actions.handleAddPart} onRemove={actions.handleRemovePart} />

          {/* صورة الفاتورة (ممكن تفصلها لاحقاً لملف لحالها لو حبيت) */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
             <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-indigo-600"><Camera className="w-4 h-4" /> أرشفة الفاتورة</h3>
             {ticketData.invoiceImageUrl ? (
               <div className="relative group aspect-[16/9] rounded-xl overflow-hidden border bg-gray-100">
                 <Image src={ticketData.invoiceImageUrl} alt="Invoice Scan" fill className="object-contain" />
                 <button onClick={() => { if(confirm("حذف؟")) actions.handleUpdateImage(""); }} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"><X className="w-5 h-5"/></button>
               </div>
             ) : (
               <div className="flex justify-center p-10 border-2 border-dashed rounded-xl bg-gray-50 print:hidden">
                  <UploadButton endpoint="imageUploader" onClientUploadComplete={(res: any) => actions.handleUpdateImage(res[0].url)} />
               </div>
             )}
          </div>

        </div>

        <div className="space-y-6">
          <FinancialSidebar 
            finance={finance} laborCost={laborCost} setLaborCost={setLaborCost} discountPercentage={discountPercentage} setDiscountPercentage={setDiscountPercentage} 
            payments={ticketData.payments} advancePayment={ticketData.advancePayment} onAddPayment={actions.handleAddPayment} 
          />
        </div>
      </div>
    </div>
  );
}