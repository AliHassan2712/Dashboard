"use client";

import { Package, Plus, Search } from "lucide-react";
import { useInventory } from "@/src/features/inventory/hooks/useInventory";
import { InventoryTable } from "@/src/features/inventory/components/InventoryTable";
import { Input } from "@/src/components/ui/Input"; //  استيراد المكون الموحد
import { SparePartModal } from "@/src/features/inventory/components/EditSparePartModal";

export default function InventoryPage() {
  const { 
    parts, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    isModalOpen, 
    setIsModalOpen, 
    editingPart, 
    isSaving, 
    actions 
  } = useInventory();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">المخزون وقطع الغيار</h1>
            <p className="text-xs text-gray-500 mt-1">إدارة الأصناف والكميات المتوفرة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/*  استخدام الـ Input الموحد مع أيقونة البحث */}
          <Input 
            placeholder="بحث عن قطعة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={<Search className="w-4 h-4" />}
            wrapperClassName="w-full md:w-64"
            className="bg-gray-50"
          />
          
          <button 
            onClick={() => actions.openModal(null)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-sm font-bold shadow-lg transition"
          >
            <Plus className="w-5 h-5" /> إضافة صنف
          </button>
        </div>
      </div>

      <InventoryTable 
        parts={parts} 
        isLoading={isLoading} 
        onEdit={(part: any) => actions.openModal(part)} 
        onDelete={actions.handleDelete} 
      />

      {isModalOpen && (
        <SparePartModal
          part={editingPart}
          isSaving={isSaving}
          onClose={() => setIsModalOpen(false)}
          onSave={actions.handleSave}
        />
      )}
      
    </div>
  );
}