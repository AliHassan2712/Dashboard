import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Camera, X, Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { compressorSchema, type CompressorFormValues } from "../validations/validations";
import { deleteFilesFromUploadThing } from "@/src/server/actions/uploadthing.actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompressorFormValues) => Promise<boolean>;
}

export const CompressorModal = ({ isOpen, onClose, onSave }: Props) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CompressorFormValues>({
    resolver: zodResolver(compressorSchema),
    defaultValues: { modelName: "", serialNumber: "", productionCost: 0, sellingPrice: 0, description: "", imageUrl: "" }
  });

  const imageUrl = watch("imageUrl"); 

  useEffect(() => {
    if (isOpen) reset(); 
  }, [isOpen, reset]);

  const onSubmit = async (data: CompressorFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><Package className="w-5 h-5 text-indigo-600"/> إضافة كمبريسور للمخزون</>} maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Camera className="w-4 h-4" /> صورة الجهاز
          </label>
          
          {imageUrl ? (
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-indigo-100 group">
              <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
              <button 
                type="button" 
                onClick={async () => {
                  const url = watch("imageUrl");
                  if (url) {
                    setValue("imageUrl", ""); // إخفاء الصورة فوراً
                    await deleteFilesFromUploadThing(url).catch(console.error); // الحذف الفعلي من السحابة
                  }
                }} 
                className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col items-center justify-center gap-2">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => setValue("imageUrl", res[0].url)}
                appearance={{ button: "bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm" }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="الموديل / الوصف" error={errors.modelName?.message} {...register("modelName")} />
          <Input label="الرقم التسلسلي (اختياري)" error={errors.serialNumber?.message} {...register("serialNumber")} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="تكلفة التجهيز (₪)" type="number" step="0.01" error={errors.productionCost?.message} {...register("productionCost", { valueAsNumber: true })} />
          <Input label="سعر البيع (₪)" type="number" step="0.01" error={errors.sellingPrice?.message} {...register("sellingPrice", { valueAsNumber: true })} />
        </div>

        <Textarea label="تفاصيل ومواصفات إضافية" rows={3} error={errors.description?.message} {...register("description")} />

        <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black transition-all flex justify-center items-center gap-2">
          {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /><span>جاري الحفظ...</span></> : "اعتماد وحفظ في المخزن"}
        </button>
      </form>
    </Modal>
  );
};