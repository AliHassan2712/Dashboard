"use client";

import { use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Printer, Loader2, Camera, X } from "lucide-react";
import { UploadButton } from "@/src/lib/uploadthing";

import { useTicketDetails } from "@/src/features/tickets/hooks/useTicketDetails";
import { CustomerInfo } from "@/src/features/tickets/components/details/CustomerInfo";
import { PartsTable } from "@/src/features/tickets/components/details/PartsTable";
import { FinancialSidebar } from "@/src/features/tickets/components/details/FinancialSidebar";
import { siteConfig } from "@/src/config/site";

export default function TicketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  
  // ملاحظة: قمنا بإلغاء قيود isAdmin لعرض المبالغ للجميع (أدمن وفني)
const isAdmin = (session?.user as any)?.role === "ADMIN" || (session?.user as any)?.role === "WORKER";
  const {
    ticketData, inventory, isLoadingData, isSaving, isUpdatingPart,
    status, setStatus, laborCost, setLaborCost, discountPercentage, setDiscountPercentage,
    finance, actions
  } = useTicketDetails(id);

  if (isLoadingData || !ticketData) {
    return <div className="flex justify-center min-h-[60vh] items-center"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;
  }

  // تحويل النص المخزن في الداتا بيز لمصفوفة صور
  const imagesArray = ticketData.invoiceImageUrl ? ticketData.invoiceImageUrl.split(',') : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 print:bg-white print:p-0 print:m-0 print:text-black">

      {/* 🖨️ ترويسة الطباعة الرسمية */}
      <div className="hidden print:flex flex-col items-center border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-black mb-1">{siteConfig.name}</h1>
        <p className="text-gray-600 font-medium">{siteConfig.slogan}</p>
        <div className="flex gap-6 mt-2 text-sm font-bold">
          <span>{siteConfig.address}</span>
          <span>جوال: {siteConfig.phone}</span>
        </div>
      </div>

      {/* الترويسة العادية وأزرار التحكم */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/tickets" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">تذكرة صيانة #{id.slice(-6).toUpperCase()}</h1>
            <p className="text-xs text-gray-400 font-bold">الفني المسؤول: {ticketData.worker?.name || "غير محدد"}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* زر الطباعة متاح للجميع الآن */}
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold transition">
            <Printer className="w-4 h-4" /> طباعة الفاتورة
          </button>
          
          <button onClick={actions.handleSaveTicket} disabled={isSaving} className="flex-1 sm:flex-none flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-md transition disabled:opacity-50">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* منطقة العمل الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* القسم الأيمن: بيانات الزبون وجدول القطع */}
        <div className="space-y-6 lg:col-span-2 print:col-span-2">
<CustomerInfo ticket={ticketData} status={status} setStatus={(val: any) => setStatus(val)} />          <PartsTable 
             parts={ticketData.partsUsed} 
             inventory={inventory} 
             isUpdating={isUpdatingPart} 
             onAdd={actions.handleAddPart} 
             onRemove={actions.handleRemovePart} 
          />

          {/* 📸 قسم أرشفة الصور والمرفقات */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm print:hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2 text-sm text-indigo-600">
                <Camera className="w-5 h-5" /> المرفقات وصور الفواتير
              </h3>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: any) => {
                  res.forEach((file: any) => actions.handleUpdateImage(file.url));
                }}
                appearance={{ button: "bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200" }}
                content={{ button: "إضافة صور" }}
              />
            </div>

            {imagesArray.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imagesArray.map((img: string, index: number) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                    <img src={img} alt={`مرفق ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => { if (confirm("حذف الصورة؟")) actions.handleRemoveImage(img); }}
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <p className="text-sm text-gray-500 font-medium">لا توجد صور مرفقة حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* القسم الأيسر: الحسابات المالية (متاح الآن للفني والأدمن) */}
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
          />
        </div>

      </div>
    </div>
  );
}