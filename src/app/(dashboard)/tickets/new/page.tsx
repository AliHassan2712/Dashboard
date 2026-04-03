"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNewTicket } from "@/src/features/tickets/hooks/useNewTicket";
import { NewTicketForm } from "@/src/features/tickets/components/TicketsComponents";

export default function NewTicketPage() {
  const { form, isLoading, onSubmit } = useNewTicket();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* الترويسة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <Link href="/tickets" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">إنشاء تذكرة صيانة</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">فتح طلب صيانة جديد وتسجيل بيانات الزبون والجهاز</p>
        </div>
      </div>

      {/* استدعاء نموذج الإضافة النظيف */}
      <NewTicketForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
      
    </div>
  );
}