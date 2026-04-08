import { AlertCircle } from "lucide-react";
import { getAllTickets } from "@/src/server/actions/tickets.actions";
import { TicketsManager } from "@/src/features/tickets/components/TicketsManager";
import { TicketListItem } from "@/src/types";

export default async function TicketsPage() {
  const result = await getAllTickets();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h2 className="text-lg font-bold">تعذر عرض التذاكر</h2>
          <p className="text-sm font-medium">{result.error}</p>
        </div>
      </div>
    );
  }

  // تسليم البيانات كـ Props للمكون الذي يدير البحث والتعديل
  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      <TicketsManager initialTickets={(result.data as TicketListItem[]) || []} />
    </div>
  );
}