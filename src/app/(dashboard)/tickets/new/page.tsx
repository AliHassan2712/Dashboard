"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNewTicket } from "@/src/features/tickets/hooks/useNewTicket";
import { NewTicketForm } from "@/src/features/tickets/components/NewTicketForm";

export default function NewTicketPage() {
  const { form, isLoading, onSubmit } = useNewTicket();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* الترويسة */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
        <Link href="/tickets" className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-gray-100 rounded-xl text-app-text-secondary-light dark:text-app-text-secondary-dark transition">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-app-text-primary-light dark:text-app-text-primary-dark">إنشاء تذكرة صيانة</h1>
          <p className="text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark mt-1 font-medium">فتح طلب صيانة جديد وتسجيل بيانات الزبون والجهاز</p>
        </div>
      </div>

      {/* استدعاء نموذج الإضافة  */}
      <NewTicketForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
      
    </div>
  );
}