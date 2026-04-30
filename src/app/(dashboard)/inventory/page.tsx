"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useInventory } from "@/src/features/inventory/hooks/useInventory";
import { InventoryToolbar } from "@/src/features/inventory/components/InventoryToolbar";
import { InventoryTable } from "@/src/features/inventory/components/InventoryTable";
import { InventoryModal } from "@/src/features/inventory/components/InventoryModal";
import { SellPartModal } from "@/src/features/inventory/components/SellPartModal"; 
import { Pagination } from "@/src/components/shared/Pagination";

export default function InventoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // تطبيق تأخير البحث لمنع التعليق
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { 
    parts, metadata, isLoading, 
    isModalOpen, setIsModalOpen, editingPart, 
    sellModal, setSellModal, actions  
  } = useInventory(currentPage, debouncedQuery);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <InventoryToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAddModal={actions.openAddModal} 
      />

      {isLoading && parts.length === 0 ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 animate-spin text-brand-600 dark:text-brand-400" />
        </div>
      ) : (
        <>
          <InventoryTable 
            parts={parts} 
            onOpenEditModal={actions.openEditModal} 
            onDelete={actions.handleDelete} 
            onOpenSellModal={actions.openSellModal}
          />
          
          <Pagination 
            currentPage={metadata.currentPage} 
            totalPages={metadata.totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      <InventoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editingPart}
        onSave={actions.handleSavePart} 
      />

      <SellPartModal 
        isOpen={sellModal.isOpen}
        onClose={() => setSellModal({ isOpen: false, part: null })}
        part={sellModal.part}
        onSave={actions.handleSellPart}
      />
    </div>
  );
}