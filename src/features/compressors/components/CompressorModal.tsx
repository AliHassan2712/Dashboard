import { 
  Package, 
  Loader2, Camera, X, 
} from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { toast } from "react-hot-toast";


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