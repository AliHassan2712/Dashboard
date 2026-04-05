import { Ticket as TicketIcon, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getAllTickets } from "@/src/features/tickets/actions";
import { TicketsTable } from "@/src/features/tickets/components/TicketsComponents";


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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      {/* الترويسة وأزرار التحكم */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TicketIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">تذاكر الصيانة</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">إدارة ومتابعة طلبات صيانة الكمبريسورات للزبائن</p>
          </div>
        </div>

        <Link 
          href="/tickets/new" 
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> فتح تذكرة جديدة
        </Link>
      </div>

      {/* استدعاء مكون الجدول  */}
      <TicketsTable tickets={result.data || []} />
      
    </div>
  );
}