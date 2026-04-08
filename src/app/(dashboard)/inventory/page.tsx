"use client";

import { Loader2 } from "lucide-react";
import { useInventory } from "@/src/features/inventory/hooks/useInventory";
import { InventoryToolbar } from "@/src/features/inventory/components/InventoryToolbar";
import { InventoryTable } from "@/src/features/inventory/components/InventoryTable";
import { InventoryModal } from "@/src/features/inventory/components/InventoryModal";

export default function InventoryPage() {
  const { 
    filteredParts, searchQuery, setSearchQuery, isLoading, 
    isModalOpen, setIsModalOpen, editingPart, actions 
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
      
      {/* الترويسة وشريط البحث */}
      <InventoryToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAddModal={actions.openAddModal} 
      />

      {/* جدول المخزون المفلتر */}
      <InventoryTable 
        parts={filteredParts} 
        onOpenEditModal={actions.openEditModal} 
        onDelete={actions.handleDelete} 
      />

      {/* نافذة الإضافة/التعديل */}
      <InventoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editingPart}
        onSave={actions.handleSavePart} 
      />
    </div>
  );
}