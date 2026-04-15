"use client";

import { Loader2 } from "lucide-react";
import { useInventory } from "@/src/features/inventory/hooks/useInventory";
import { InventoryToolbar } from "@/src/features/inventory/components/InventoryToolbar";
import { InventoryTable } from "@/src/features/inventory/components/InventoryTable";
import { InventoryModal } from "@/src/features/inventory/components/InventoryModal";
import { SellPartModal } from "@/src/features/inventory/components/SellPartModal"; 

export default function InventoryPage() {
  const { 
    filteredParts, searchQuery, setSearchQuery, isLoading, 
    isModalOpen, setIsModalOpen, editingPart, 
    sellModal, setSellModal, actions  
  } = useInventory();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      <InventoryToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAddModal={actions.openAddModal} 
      />

      <InventoryTable 
        parts={filteredParts} 
        onOpenEditModal={actions.openEditModal} 
        onDelete={actions.handleDelete} 
        onOpenSellModal={actions.openSellModal}
      />

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