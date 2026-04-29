"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2, Search, ClipboardList } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { useTicketsManager } from "@/src/features/tickets/hooks/useTicketsManager";
import { TicketsTable } from "@/src/features/tickets/components/TicketsTable";
import { EditTicketModal } from "@/src/features/tickets/components/EditTicketModal";
import { Pagination } from "@/src/components/shared/Pagination";

export default function TicketsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // تطبيق Debounce لمنع تعليق المتصفح أثناء الكتابة السريعة
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // إرجاع للصفحة الأولى عند كل بحث جديد
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    tickets, metadata, isLoading, 
    isEditModalOpen, setIsEditModalOpen, editingTicket, 
    openEditModal, handleEditSubmit, handleDelete 
  } = useTicketsManager(currentPage, debouncedQuery, statusFilter);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">تذاكر الصيانة</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">إدارة ومتابعة طلبات صيانة الكمبريسورات</p>
          </div>
        </div>
        <Link href={ROUTES.NEW_TICKET} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md w-full sm:w-auto">
          <Plus className="w-5 h-5" /> تذكرة جديدة
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الزبون أو رقم الجوال..." 
            className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none font-bold text-sm shadow-sm" 
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-white border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold text-sm text-gray-600 shadow-sm cursor-pointer"
        >
          <option value="ALL">جميع الحالات</option>
          <option value="OPEN">مفتوحة (قيد الفحص)</option>
          <option value="WAITING_FOR_PARTS">بانتظار القطع</option>
          <option value="IN_PROGRESS">جاري الصيانة</option>
          <option value="COMPLETED">مكتملة</option>
        </select>
      </div>

      {isLoading && tickets.length === 0 ? (
        <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>
      ) : (
        <>
          <TicketsTable tickets={tickets} onEdit={openEditModal} onDelete={handleDelete} />
          
          <Pagination 
            currentPage={metadata.currentPage} 
            totalPages={metadata.totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      <EditTicketModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} ticket={editingTicket} onSubmit={handleEditSubmit} />
    </div>
  );
}