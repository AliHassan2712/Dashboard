import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Camera, X, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { compressorSchema, type CompressorFormValues } from "../validations/validations";
import { deleteFilesFromUploadThing } from "@/src/server/actions/uploadthing.actions";
import type { SparePart } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompressorFormValues) => Promise<boolean>;
  inventory: SparePart[];
}

export const CompressorModal = ({ isOpen, onClose, onSave, inventory }: Props) => {
  // 1. استخراج control اللازم لعمل useFieldArray
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CompressorFormValues>({
    resolver: zodResolver(compressorSchema),
    defaultValues: {
      modelName: "",
      serialNumber: "",
      productionCost: 0,
      sellingPrice: 0,
      description: "",
      imageUrl: "",
      parts: []
    }
  });

  // 2. تفعيل useFieldArray لإدارة قائمة القطع المسحوبة
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts"
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: CompressorFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  const handleSafeClose = async () => {
    const currentImageUrl = watch("imageUrl");

    // إذا كان هناك صورة مرفوعة، والنموذج ليس في حالة إرسال
    if (currentImageUrl && !isSubmitting) {
      try {
        setValue("imageUrl", ""); // تفريغ الحقل فوراً كشكل مرئي
        await deleteFilesFromUploadThing(currentImageUrl); // حذفها من السحابة
      } catch (err) {
        console.error("Failed to cleanup unused image:", err);
      }
    }

    reset(); // تصفير الحقول
    onClose(); // إغلاق النافذة الحقيقية
  };


  return (
    <Modal isOpen={isOpen} onClose={handleSafeClose} title={<><Package className="w-5 h-5 text-indigo-600" /> إضافة كمبريسور للمخزون</>} maxWidth="lg">      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Camera className="w-4 h-4" /> صورة الجهاز
        </label>

        {imageUrl ? (
          <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-indigo-100 group">
            <Image src={imageUrl} fill className="object-cover" alt="Preview" />
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

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700">قطع تم سحبها للكمبريسور</label>
          <button
            type="button"
            onClick={() => append({ sparePartId: "", quantity: 1, unitCost: 0 })}
            className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-indigo-100 transition"
          >
            <Plus className="w-4 h-4" /> إضافة قطعة
          </button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {fields.length === 0 && (
            <div className="text-center text-xs text-gray-400 py-2">لم يتم إضافة أي قطع. (اختياري)</div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded-xl border border-gray-200">
              <div className="flex-1">
                <select
                  {...register(`parts.${index}.sparePartId`)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg outline-none"
                >
                  <option value="">-- اختر القطعة --</option>
                  {inventory?.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                      {p.name} (متوفر: {p.quantity})
                    </option>
                  ))}
                </select>
                {errors.parts?.[index]?.sparePartId && (
                  <span className="text-[10px] text-red-500">{errors.parts[index]?.sparePartId?.message}</span>
                )}
              </div>
              <div className="w-20">
                <Input
                  type="number"
                  placeholder="الكمية"
                  className="!py-1.5 text-xs"
                  {...register(`parts.${index}.quantity`, { valueAsNumber: true })}
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="التكلفة (₪)"
                  className="!py-1.5 text-xs"
                  {...register(`parts.${index}.unitCost`, { valueAsNumber: true })}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-1 p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black transition-all flex justify-center items-center gap-2 shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200">
        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /><span>جاري الحفظ والخصم من المخزن...</span></> : "اعتماد وحفظ في المخزن"}
      </button>
    </form>
    </Modal>
  );
};