import { 
  Package, Trash2, 
  Loader2, Camera, X, Image as ImageIcon 
} from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { toast } from "react-hot-toast";

// ==========================================
// 1. مكون عرض الكروت (Compressor Table)
// ==========================================
export const CompressorTable = ({ compressors, onStatusChange, onDelete }: any) => {
  if (!compressors || compressors.length === 0) {
    return (
      <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-bold flex flex-col items-center gap-3">
        <Package className="w-12 h-12 text-gray-200" />
        <p>لا توجد كمبريسورات جاهزة للبيع حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {compressors.map((comp: any) => {
        const profit = (comp.sellingPrice || 0) - (comp.productionCost || 0);
        
        return (
          <div key={comp.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group relative flex flex-col">
            
            {/* عرض صورة الجهاز */}
            <div className="relative h-48 w-full bg-gray-50 border-b border-gray-100 overflow-hidden">
              {comp.imageUrl ? (
                <img 
                  src={comp.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={comp.modelName} 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                  <ImageIcon className="w-10 h-10" />
                  <span className="text-[10px] font-bold">لا توجد صورة</span>
                </div>
              )}
              
              {/* شارة الحالة فوق الصورة */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${
                  comp.status === 'AVAILABLE' || comp.status === 'READY' ? 'bg-emerald-500 text-white' :
                  comp.status === 'SOLD' ? 'bg-slate-700 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {comp.status === 'AVAILABLE' || comp.status === 'READY' ? 'جاهز للبيع' : 
                   comp.status === 'SOLD' ? 'تم البيع' : 'تحت التجهيز'}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-900 mb-1">{comp.modelName}</h3>
                <p className="text-[10px] font-bold text-gray-400 font-mono">S/N: {comp.serialNumber || "N/A"}</p>
              </div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-5 mt-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">تكلفة الإنتاج:</span>
                  <span className="text-gray-900 font-black">₪ {(comp.productionCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-bold">سعر البيع:</span>
                  <span className="text-emerald-600 font-black">₪ {(comp.sellingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-black text-indigo-600 text-sm">
                  <span className="text-[10px] text-gray-400 uppercase">الربح الصافي</span>
                  <span>₪ {profit.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <select 
                  value={comp.status} 
                  onChange={(e) => onStatusChange(comp.id, e.target.value)}
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold outline-none border-none focus:ring-0 cursor-pointer"
                >
                  <option value="AVAILABLE">متاح للبيع</option>
                  <option value="SOLD">مباع</option>
                  <option value="MAINTENANCE">تحت التجهيز</option>
                </select>
                <button 
                  onClick={() => onDelete(comp.id)} 
                  className="p-2.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 2. مكون نافذة الإضافة (Compressor Modal)
// ==========================================
export const CompressorModal = ({ isOpen, onClose, formData, setFormData, isSubmitting, onSave }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} title={<><Package className="w-5 h-5 text-indigo-600"/> إضافة كمبريسور للمخزون</>} maxWidth="lg">
    <form onSubmit={onSave} className="space-y-5">
      
      {/* قسم رفع الصورة */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Camera className="w-4 h-4" /> صورة الجهاز
        </label>
        
        {formData.imageUrl ? (
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-indigo-100 group">
            <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, imageUrl: "" })}
              className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setFormData({ ...formData, imageUrl: res[0].url });
                toast.success("تم رفع الصورة بنجاح");
              }}
              onUploadError={(error: Error) => {
                toast.error(`خطأ في الرفع: ${error.message}`);
              }}
              appearance={{
                button: "bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm",
                allowedContent: "text-[10px] text-gray-400 font-medium mt-2"
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="الموديل / الوصف" 
          placeholder="مثلاً: كمبريسور 500 لتر" 
          value={formData.model} 
          onChange={e => setFormData({...formData, model: e.target.value})} 
          required 
        />
        <Input 
          label="الرقم التسلسلي (اختياري)" 
          placeholder="S/N: 2024-XXX" 
          value={formData.serialNumber} 
          onChange={e => setFormData({...formData, serialNumber: e.target.value})} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="تكلفة التجهيز (₪)" 
          type="number" 
          step="0.01" 
          value={formData.buildCost} 
          onChange={e => setFormData({...formData, buildCost: e.target.value})} 
          required 
        />
        <Input 
          label="سعر البيع (₪)" 
          type="number" 
          step="0.01" 
          value={formData.sellingPrice} 
          onChange={e => setFormData({...formData, sellingPrice: e.target.value})} 
          required 
        />
      </div>

      <Textarea 
        label="تفاصيل ومواصفات إضافية" 
        rows={3} 
        value={formData.description} 
        onChange={e => setFormData({...formData, description: e.target.value})} 
        placeholder="المحرك، الضمان، تاريخ التجميع..."
      />

      <button 
        disabled={isSubmitting} 
        type="submit" 
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري الحفظ والرفع...</span>
          </>
        ) : (
          "اعتماد وحفظ في المخزن"
        )}
      </button>
    </form>
  </Modal>
);