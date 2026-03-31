import { Ticket as TicketIcon, Plus, Search, Filter, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getAllTickets } from "@/src/features/tickets/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketsPage() {
  const result = await getAllTickets();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">تذاكر الصيانة</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h2 className="text-lg font-bold">تعذر عرض التذاكر</h2>
          <p className="text-sm">{result.error}</p>
        </div>
      </div>
    );
  }

  const tickets = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <TicketIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تذاكر الصيانة</h1>
            <p className="text-sm text-gray-500">إدارة ومتابعة طلبات صيانة الكمبريسورات</p>
          </div>
        </div>

        <Link 
          href="/tickets/new" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          تذكرة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>لا توجد أي تذاكر صيانة حتى الآن.</p>
            <Link href="/tickets/new" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
              اضغط هنا لإنشاء أول تذكرة
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">رقم التذكرة</th>
                  <th className="px-4 py-3 font-medium">الزبون</th>
                  <th className="px-4 py-3 font-medium">تاريخ الدخول</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium">عدد القطع المستهلكة</th>
                  <th className="px-4 py-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 font-bold text-gray-900 text-xs">
                      #{ticket.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{ticket.customerName}</div>
                      <div className="text-xs text-gray-500 dir-ltr text-right">{ticket.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'WAITING_FOR_PARTS' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status === 'OPEN' ? 'مفتوحة' : 
                         ticket.status === 'IN_PROGRESS' ? 'قيد الصيانة' :
                         ticket.status === 'WAITING_FOR_PARTS' ? 'بانتظار قطع' : 'مكتملة'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {/*  التعديل هنا: partsUsed بدل ticketParts */}
                      {ticket.partsUsed?.length || 0} قطع
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/tickets/${ticket.id}`} className="text-indigo-600 hover:underline text-sm font-medium">
                        عرض التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}