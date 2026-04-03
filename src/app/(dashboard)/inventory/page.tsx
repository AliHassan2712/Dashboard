"use client";

import { Loader2 } from "lucide-react";
import { useInventory } from "@/src/features/inventory/hooks/useInventory";
import { InventoryModal, InventoryTable, InventoryToolbar } from "@/src/features/inventory/components/InventoryComponents";

export default function InventoryPage() {
  const { state, filteredParts, dispatch, actions } = useInventory();

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. الترويسة وشريط البحث */}
      <InventoryToolbar state={state} dispatch={dispatch} />

      {/* 2. جدول المخزون المفلتر */}
      <InventoryTable parts={filteredParts} dispatch={dispatch} onDelete={actions.handleDelete} />

      {/* 3. نافذة الإضافة/التعديل المُدارة بالـ Modal */}
      <InventoryModal state={state} dispatch={dispatch} onSave={actions.handleSavePart} />

    </div>
  );
}