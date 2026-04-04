"use client";

import { useState, useEffect } from "react";
import type { Compressor } from "@prisma/client";
import { 
  Plus, RefreshCw, Loader2, Package, 
  Search, Filter, LayoutGrid 
} from "lucide-react";
import { toast } from "react-hot-toast";

// استيراد المكونات التي أنشأناها سابقاً
import { 
  getCompressors, 
  addCompressor, 
  updateCompressorStatus, 
  deleteCompressor 
} from "@/src/features/compressors/actions";
import { 
  CompressorTable, 
  CompressorModal 
} from "@/src/features/compressors/components/CompressorComponents";
import { ExportButton } from "@/src/components/shared/ExportButton";

export default function CompressorsPage() {
  // --- States ---
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    serialNumber: "",
    model: "",
    buildCost: "",
    sellingPrice: "",
    description: "",
    imageUrl: "" // حقل الصورة الذي أضفناه
  });

  // --- Actions ---
  const fetchData = async () => {
    setIsLoading(true);
    const res = await getCompressors();
    if (res.success) {
      setCompressors(res.data);
    } else {
      toast.error("فشل تحميل البيانات");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await addCompressor({
      serialNumber: formData.serialNumber,
      modelName: formData.model,
      productionCost: parseFloat(formData.buildCost),
      sellingPrice: parseFloat(formData.sellingPrice),
      description: formData.description,
      imageUrl: formData.imageUrl
    });

    if (res.success) {
      toast.success("تمت إضافة الكمبريسور للمخزن");
      setIsModalOpen(false);
      setFormData({ serialNumber: "", model: "", buildCost: "", sellingPrice: "", description: "", imageUrl: "" });
      fetchData();
    } else {
      toast.error(res.error || "حدث خطأ ما");
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateCompressorStatus(id, newStatus);
    if (res.success) {
      toast.success("تم تحديث الحالة");
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الجهاز نهائياً؟")) {
      const res = await deleteCompressor(id);
      if (res.success) {
        toast.success("تم الحذف بنجاح");
        fetchData();
      }
    }
  };

  // --- تجهيز البيانات للتصدير ---
  const excelData = compressors.map((c: any) => ({
    "الموديل/الوصف": c.modelName,
    "الرقم التسلسلي": c.serialNumber || "لا يوجد",
    "تكلفة الإنتاج (₪)": c.productionCost,
    "سعر البيع (₪)": c.sellingPrice,
    "الربح المتوقع (₪)": c.sellingPrice - c.productionCost,
    "الحالة": c.status === 'AVAILABLE' ? 'جاهز للبيع' : c.status === 'SOLD' ? 'تم البيع' : 'صيانة',
    "تاريخ الإضافة": new Date(c.createdAt).toLocaleDateString('ar-EG'),
  }));

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* الترويسة (Header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">مخزن الكمبريسورات الجاهزة</h1>
            <p className="text-gray-500 font-medium text-sm">إدارة الأجهزة المعدة للبيع وتتبع أرباحها</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* زر التصدير الجديد */}
          <ExportButton 
            data={excelData} 
            fileName="تقرير_مخزن_الكمبريسورات" 
            sheetName="الأجهزة الجاهزة"
          />

          <button 
            onClick={fetchData}
            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة جهاز جديد</span>
          </button>
        </div>
      </div>

      {/* شريط الأدوات السريع (البحث والفلترة) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="بحث بالموديل أو الرقم التسلسلي..." 
            className="w-full pr-12 pl-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
          <Filter className="w-4 h-4" />
          تصفية
        </button>
      </div>

      {/* محتوى الصفحة الرئيسي */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-gray-400 font-bold animate-pulse">جاري جلب بيانات المخزن...</p>
        </div>
      ) : (
        <CompressorTable 
          compressors={compressors} 
          onStatusChange={handleStatusChange} 
          onDelete={handleDelete} 
        />
      )}

      {/* النافذة المنبثقة للإضافة */}
      <CompressorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        formData={formData} 
        setFormData={setFormData} 
        isSubmitting={isSubmitting} 
        onSave={handleSave} 
      />

    </div>
  );
}