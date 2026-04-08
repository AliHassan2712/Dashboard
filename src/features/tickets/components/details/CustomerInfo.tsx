import { Ticket, TicketStatus } from "@prisma/client";

interface CustomerInfoProps {
  ticket: Ticket;
  status: TicketStatus;
  setStatus: (newStatus: TicketStatus) => void;
}

export const CustomerInfo = ({ ticket, status, setStatus }: CustomerInfoProps) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
    <div>
      <p className="text-xs text-gray-400 mb-1">اسم الزبون</p>
      <p className="font-bold text-gray-900">{ticket.customerName}</p>
      <p className="text-sm text-gray-500 mt-1">{ticket.customerPhone}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400 mb-1">موديل الجهاز</p>
      <p className="font-bold text-gray-900">{ticket.compressorModel || "غير محدد"}</p>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TicketStatus)}
        className="mt-2 text-xs border rounded-md p-1 bg-gray-50 outline-none cursor-pointer hover:bg-gray-100 transition"
      >
        <option value="OPEN">مفتوحة</option>
        <option value="IN_PROGRESS">قيد الصيانة</option>
        <option value="WAITING_FOR_PARTS">بانتظار قطع</option>
        <option value="COMPLETED">مكتملة</option>
      </select>
    </div>
    <div className="col-span-1 sm:col-span-2 border-t pt-4 mt-2">
      <p className="text-xs text-gray-400 mb-2">وصف العطل / شكوى الزبون:</p>
      <p className="text-sm bg-gray-50 p-4 rounded-xl leading-relaxed italic text-gray-700 border border-gray-100">
        &quot;{ticket.issueDescription || "لا يوجد وصف مسجل"}&quot;
      </p>
    </div>
  </div>
);