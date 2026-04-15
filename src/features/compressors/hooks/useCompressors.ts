"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Compressor } from "@prisma/client";
import { 
  getCompressors, 
  addCompressor, 
  updateCompressorStatus, 
  deleteCompressor 
} from "@/src/server/actions/compressors.actions";
import { getAllSparePartsForDropdown } from "@/src/server/actions/inventory.actions"; 
import { CompressorFormValues } from "../validations/validations";

export function useCompressors() {
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [inventory, setInventory] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. جلب البيانات (الكمبريسورات وقطع المخزون معاً)
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [compRes, invRes] = await Promise.all([
      getCompressors(),
      getAllSparePartsForDropdown()
    ]);

    if (compRes.success) {
      setCompressors((compRes.data as Compressor[]) || []);
    } else {
      toast.error(compRes.error || "خطأ في الجلب");
    }

    if (invRes.success) {
      setInventory(invRes.data || []);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // 2. إضافة كمبريسور جديد (تستقبل البيانات النظيفة من Zod مباشرة)
  const handleAdd = async (data: CompressorFormValues) => {
    const res = await addCompressor({
      modelName: data.modelName, 
      serialNumber: data.serialNumber?.trim() || undefined,
      productionCost: data.productionCost, 
      sellingPrice: data.sellingPrice,
      description: data.description,
      imageUrl: data.imageUrl,
      parts: data.parts || [] 
    });

    if (res.success) {
      toast.success("تمت إضافة الكمبريسور للمخزون وخصم القطع بنجاح");
      setIsModalOpen(false); // إغلاق النافذة
      await fetchData();     // تحديث الجدول
      return true;           // إرجاع true للنافذة لكي تقوم بتصفير الحقول (reset)
    } else {
      toast.error(res.error || "فشل الإضافة");
      return false;
    }
  };

  // 3. تحديث حالة الكمبريسور (متاح، مباع، صيانة)
  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateCompressorStatus(id, status);
    if (res.success) {
      toast.success("تم تحديث الحالة");
      await fetchData();
    } else {
      toast.error(res.error || "فشل التحديث");
    }
  };

  // 4. حذف كمبريسور
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await deleteCompressor(id);
    if (res.success) {
      toast.success("تم الحذف");
      await fetchData();
    } else {
      toast.error(res.error || "فشل الحذف");
    }
  };

  return { 
    compressors,
    inventory, // 👈 إرجاع المخزون لكي نمرره للـ Modal 
    isLoading, 
    isModalOpen, 
    setIsModalOpen, 
    fetchData,
    actions: { handleAdd, handleStatusChange, handleDelete } 
  };
}