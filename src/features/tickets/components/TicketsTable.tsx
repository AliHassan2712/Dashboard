import Link from "next/link";
import { Ticket as TicketIcon } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export const TicketsTable = ({ tickets }: { tickets: any[] }) => {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                <TicketIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>لا توجد أي تذاكر صيانة حتى الآن.</p>
                <Link href={ROUTES.NEW_TICKET} className="text-indigo-600 hover:underline text-sm mt-2 inline-block font-bold">
                    اضغط هنا لإنشاء أول تذكرة
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                        <tr>
                            <th className="px-4 py-3 font-medium">رقم التذكرة</th>
                            <th className="px-4 py-3 font-medium">الزبون</th>
                            <th className="px-4 py-3 font-medium">تاريخ الدخول</th>
                            <th className="px-4 py-3 font-medium">الحالة</th>
                            <th className="px-4 py-3 font-medium">عدد القطع المستهلكة</th>
                            <th className="px-4 py-3 font-medium text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tickets.map((ticket: any) => (
                            <tr key={ticket.id} className="hover:bg-gray-50/50 transition">
                                <td className="px-4 py-3 font-bold text-gray-400 font-mono text-xs">
                                    #{ticket.id.slice(-6).toUpperCase()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-900">{ticket.customerName}</div>
                                    <div className="text-xs text-gray-500 mt-1">{ticket.customerPhone}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-medium">
                                    {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${ticket.status === 'OPEN' ? 'bg-amber-50 text-amber-600' :
                                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                                                ticket.status === 'WAITING_FOR_PARTS' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {ticket.status === 'OPEN' ? 'مفتوحة' :
                                            ticket.status === 'IN_PROGRESS' ? 'قيد الصيانة' :
                                                ticket.status === 'WAITING_FOR_PARTS' ? 'بانتظار قطع' : 'مكتملة'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-gray-700">
                                    {ticket.partsUsed?.length || 0} قطع
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Link href={ROUTES.TICKET_DETAILS(ticket.id)} className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                        عرض التفاصيل
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
