"use client";

import Link from "next/link";
import { Ticket as TicketIcon, Plus, Search } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { TicketListItem } from "@/src/types";
import { useTicketsManager } from "../hooks/useTicketsManager";
import { TicketsTable } from "./TicketsTable";
import { EditTicketModal } from "./EditTicketModal";

export const TicketsManager = ({ initialTickets }: { initialTickets: TicketListItem[] }) => {
  const {
    searchQuery, setSearchQuery,
    filteredTickets, handleDelete,
    isEditModalOpen, setIsEditModalOpen,
    editingTicket, openEditModal,
    handleEditSubmit, isSubmitting
  } = useTicketsManager(initialTickets);

  return (
    <div className="space-y-6">
      {/* الترويسة وشريط البحث */}
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

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* حقل البحث السريع */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="بحث بالرقم أو الاسم..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 outline-none text-sm transition"
            />
          </div>
          <Link 
            href={ROUTES.NEW_TICKET} 
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> تذكرة جديدة
          </Link>
        </div>
      </div>

      {/* استدعاء الجدول المفلتر */}
      <TicketsTable tickets={filteredTickets} onEdit={openEditModal} onDelete={handleDelete} />

      {/* نافذة التعديل */}
      <EditTicketModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        ticket={editingTicket} 
        onSubmit={handleEditSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};