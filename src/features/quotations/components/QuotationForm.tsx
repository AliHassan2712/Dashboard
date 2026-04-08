import { FileText, Camera, X } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../validations/validations";
import { deleteFilesFromUploadThing } from "@/src/server/actions/uploadthing.actions";

interface QuotationFormProps {
  form: UseFormReturn<QuotationFormValues>;
}

export const QuotationForm = ({ form }: QuotationFormProps) => {
  const { register, setValue, watch, formState: { errors } } = form;
  const imageUrl = watch("imageUrl");

  return (
    <div className="w-full lg:w-1/3 space-y-6 print:hidden">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 text-indigo-900">
          <FileText className="w-5 h-5" /> بيانات العرض الفني
        </h2>

        <Input label="اسم الزبون / الشركة" placeholder="شركة المقاولات..." error={errors.customerName?.message} {...register("customerName")} />
        <Input label="وصف الجهاز (الموديل)" placeholder="كمبريسور 500 لتر" error={errors.modelName?.message} {...register("modelName")} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="السعر (شيكل)" type="number" step="0.01" className="font-bold text-indigo-700" error={errors.priceIls?.message} {...register("priceIls", { valueAsNumber: true })} />
          <Input label="سعر الصرف ($)" type="number" step="0.01" error={errors.exchangeRate?.message} {...register("exchangeRate", { valueAsNumber: true })} />
        </div>

        <Textarea label="المواصفات الفنية (كل ميزة في سطر)" rows={5} error={errors.specs?.message} {...register("specs")} />
        <Textarea label="الشروط والملاحظات" rows={3} error={errors.notes?.message} {...register("notes")} />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 text-indigo-900">
          <Camera className="w-5 h-5" /> صورة الجهاز المرفقة
        </h2>
        {imageUrl ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
            <img src={imageUrl} className="w-full h-full object-contain" alt="Preview" />
            <button 
              type="button" 
              onClick={async () => {
                if (imageUrl) {
                  setValue('imageUrl', ""); // إخفاء الصورة فوراً
                  await deleteFilesFromUploadThing(imageUrl).catch(console.error); // الحذف الفعلي من السحابة
                }
              }} 
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <UploadButton 
              endpoint="imageUploader" 
              onClientUploadComplete={(res: { url: string }[]) => setValue('imageUrl', res[0].url)} 
              appearance={{ button: "bg-indigo-900 text-white px-4 py-2 text-sm rounded-lg" }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};