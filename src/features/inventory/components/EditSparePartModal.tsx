"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/src/lib/uploadthing";
import { toast } from "react-hot-toast";
import { SparePart } from "@prisma/client";
import { Input } from "@/src/components/ui/Input"; //  استيراد المكون

interface SparePartModalProps {
  part: SparePart | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function SparePartModal({ part, isSaving, onClose, onSave }: SparePartModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    averageCost: 0,
    sellingPrice: 0,
    lowStockAlert: 5,
    imageUrl: ""
  });

  useEffect(() => {
    if (part) {
      setFormData({
        name: part.name,
        quantity: part.quantity,
        averageCost: part.averageCost,
        sellingPrice: part.sellingPrice,
        lowStockAlert: part.lowStockAlert,
        imageUrl: part.imageUrl || ""
      });
    } else {
      setFormData({ name: "", quantity: 0, averageCost: 0, sellingPrice: 0, lowStockAlert: 5, imageUrl: "" });
    }
  }, [part]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">
            {part ? "تعديل بيانات القطعة" : "إضافة قطعة للمخزون"}
          </h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/*  استخدام الـ Input الموحد */}
            <Input 
              label="اسم الصنف" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="الكمية" 
                type="number" 
                required 
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} 
              />
              <Input 
                label="تنبيه النقص" 
                type="number" 
                required 
                value={formData.lowStockAlert} 
                onChange={(e) => setFormData({...formData, lowStockAlert: Number(e.target.value)})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="التكلفة" 
                type="number" 
                step="0.01" 
                leftIcon="₪" 
                required 
                value={formData.averageCost} 
                onChange={(e) => setFormData({...formData, averageCost: Number(e.target.value)})} 
              />
              <Input 
                label="البيع" 
                type="number" 
                step="0.01" 
                leftIcon="₪" 
                required 
                className="font-bold text-green-600" 
                value={formData.sellingPrice} 
                onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 relative group">
            {formData.imageUrl ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md bg-white border">
                <Image src={formData.imageUrl} alt="preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-xl hover:scale-110 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => { setFormData({...formData, imageUrl: res[0].url}); toast.success("تم الرفع بنجاح"); }}
                  appearance={{ button: "bg-indigo-600 px-4 py-2 text-xs w-full rounded-xl" }}
                  content={{ button: "ارفع صورة للصنف" }}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 border-t border-gray-100 pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium">إلغاء</button>
            <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-lg flex items-center gap-2 transition">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {part ? "حفظ التعديلات" : "إضافة الصنف"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}