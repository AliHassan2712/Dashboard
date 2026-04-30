import { memo } from "react";
import Link from "next/link";
import { Edit, Ticket as TicketIcon, Trash2 } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { TicketListItem } from "@/src/types";

interface TicketsTableProps {
  tickets: TicketListItem[];
  onEdit: (ticket: TicketListItem) => void;
  onDelete: (id: string, name: string) => void;
}

export const TicketsTable = memo(({ tickets, onEdit, onDelete }: TicketsTableProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-app-text-secondary-light bg-app-card-light rounded-xl shadow-sm border border-app-border-light dark:text-app-text-secondary-dark dark:bg-app-card-dark dark:border-app-border-dark">
        <TicketIcon className="w-12 h-12 text-app-text-muted-light mx-auto mb-3 dark:text-app-text-muted-dark" />
        <p>لا توجد أي تذاكر مطابقة لعملية البحث.</p>
      </div>
    );
  }

  return (
    <div className="bg-app-card-light rounded-xl shadow-sm border border-app-border-light overflow-hidden dark:bg-app-card-dark dark:border-app-border-dark">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-zinc-50 text-app-text-secondary-light border-b border-app-border-light dark:bg-zinc-900 dark:text-app-text-secondary-dark dark:border-app-border-dark">
            <tr>
              <th className="px-4 py-3 font-medium">رقم التذكرة</th>
              <th className="px-4 py-3 font-medium">الزبون</th>
              <th className="px-4 py-3 font-medium">تاريخ الدخول</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-zinc-50/70 transition dark:hover:bg-zinc-900/70">
                <td className="px-4 py-3 font-bold text-app-text-muted-light font-mono text-xs dark:text-app-text-muted-dark">
                  #{ticket.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark">{ticket.customerName}</div>
                  <div className="text-xs text-app-text-secondary-light mt-1 dark:text-app-text-secondary-dark">{ticket.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-app-text-secondary-light font-medium dark:text-app-text-secondary-dark">
                  {new Date(ticket.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                    ticket.status === "OPEN"
                      ? "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-500"
                      : ticket.status === "IN_PROGRESS"
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400"
                        : ticket.status === "WAITING_FOR_PARTS"
                          ? "bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-500"
                          : "bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400"
                  }`}>
                    {ticket.status === "OPEN"
                      ? "مفتوحة"
                      : ticket.status === "IN_PROGRESS"
                        ? "قيد الصيانة"
                        : ticket.status === "WAITING_FOR_PARTS"
                          ? "بانتظار قطع"
                          : "مكتملة"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <Link href={ROUTES.TICKET_DETAILS(ticket.id)} className="text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg text-xs font-bold transition dark:text-brand-400 dark:bg-brand-950/40 dark:hover:bg-brand-950/60">
                    التفاصيل
                  </Link>
                  <button onClick={() => onEdit(ticket)} className="p-1.5 text-app-text-muted-light hover:text-brand-600 hover:bg-brand-50 rounded-lg transition dark:text-app-text-muted-dark dark:hover:text-brand-400 dark:hover:bg-brand-950/40">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(ticket.id, ticket.customerName)} className="p-1.5 text-app-text-muted-light hover:text-danger-600 hover:bg-danger-50 rounded-lg transition dark:text-app-text-muted-dark dark:hover:text-danger-500 dark:hover:bg-danger-900/20">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TicketsTable.displayName = "TicketsTable";
