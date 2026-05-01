"use client";

import { Printer } from "lucide-react";
import { useQuotation } from "@/src/features/quotations/hooks/useQuotations";
import { QuotationPrintTemplate } from "@/src/features/quotations/components/QuotationPrintTemplate";
import { QuotationForm } from "@/src/features/quotations/components/QuotationForm";

export default function QuotationPage() {
  const { form, quoteData, priceUsd, currentDate, quoteNumber } = useQuotation();

  const handlePrint = () => {
    form.handleSubmit(() => {
      window.print();
    })();
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 print:p-0 print:m-0 animate-in fade-in duration-500">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0 !important; }
          html, body { margin: 0 !important; padding: 0 !important; background-color: white !important; }
          #printable-a4 {
            position: absolute !important; top: 0 !important; left: 0 !important; margin: 0 !important;
            width: 210mm !important; height: 297mm !important; background: white !important;
            box-shadow: none !important; border: none !important; z-index: 99999 !important;
          }
        }
      `}} />

      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-app-text-primary-light dark:text-app-text-primary-dark">إنشاء عرض السعر</h1>
          <p className="text-app-text-secondary-light dark:text-app-text-secondary-dark text-sm mt-1">تجهيز عرض فني ومالي رسمي ومعتمد للزبائن</p>
        </div>
        <button 
          onClick={handlePrint} 
          className="flex items-center gap-2 px-8 py-3 bg-brand-950 text-white hover:bg-black rounded-xl font-bold transition shadow-xl"
        >
          <Printer className="w-5 h-5" /> طباعة العرض الرسمي
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 print:block print:gap-0">
        <QuotationForm form={form} />

        <QuotationPrintTemplate
          quoteData={quoteData as any} 
          priceUsd={priceUsd} 
          currentDate={currentDate} 
          quoteNumber={quoteNumber} 
        />
      </div>
    </div>
  );
}