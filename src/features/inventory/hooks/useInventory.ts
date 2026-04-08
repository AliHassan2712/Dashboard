"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { getInventory, addSparePart, updateSparePart, deleteSparePart } from "@/src/server/actions/inventory.actions"; 
import { SparePartFormValues } from "../validations/validations"; 

export function useInventory() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);

  const fetchInventory = async () => {
    setIsLoading(true);
    const res = await getInventory(); 
    if (res.success) setParts((res.data as SparePart[]) || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleSavePart = async (data: SparePartFormValues) => {
    let res;
    if (editingPart) {
      res = await updateSparePart(editingPart.id, data);
    } else {
      res = await addSparePart(data); 
    }

    if (res.success) {
      toast.success(editingPart ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
      setIsModalOpen(false);
      setEditingPart(null);
      fetchInventory();
      return true; 
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحفظ");
      return false;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القطعة (${name}) نهائياً؟`)) {
      const res = await deleteSparePart(id);
      if (res.success) { 
        toast.success("تم الحذف"); 
        fetchInventory(); 
      } else { 
        toast.error(res.error || "حدث خطأ أثناء الحذف"); 
      }
    }
  };

  // دوال مساعدة لفتح النوافذ
  const openAddModal = () => {
    setEditingPart(null);
    setIsModalOpen(true);
  };

  const openEditModal = (part: SparePart) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { 
    filteredParts, searchQuery, setSearchQuery, isLoading, 
    isModalOpen, setIsModalOpen, editingPart, 
    actions: { handleSavePart, handleDelete, openAddModal, openEditModal } 
  };
}