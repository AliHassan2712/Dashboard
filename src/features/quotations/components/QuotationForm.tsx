import { FileText, Camera, X } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";

export const QuotationForm = ({ quoteData, updateField }: any) => (
    <div className="w-full lg:w-1/3 space-y-6 print:hidden">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 text-indigo-900">
                <FileText className="w-5 h-5" /> بيانات العرض الفني
            </h2>

            <Input label="اسم الزبون / الشركة" placeholder="شركة المقاولات..." value={quoteData.customerName} onChange={(e) => updateField('customerName', e.target.value)} />
            <Input label="وصف الجهاز (الموديل)" placeholder="كمبريسور 500 لتر" value={quoteData.modelName} onChange={(e) => updateField('modelName', e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
                <Input label="السعر (شيكل)" type="number" className="font-bold text-indigo-700" value={quoteData.priceIls} onChange={(e) => updateField('priceIls', e.target.value)} />
                <Input label="سعر الصرف ($)" type="number" value={quoteData.exchangeRate} onChange={(e) => updateField('exchangeRate', e.target.value)} />
            </div>

            <Textarea label="المواصفات الفنية (كل ميزة في سطر)" rows={5} value={quoteData.specs} onChange={(e) => updateField('specs', e.target.value)} />
            <Textarea label="الشروط والملاحظات" rows={3} value={quoteData.notes} onChange={(e) => updateField('notes', e.target.value)} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="font-bold flex items-center gap-2 border-b border-gray-100 pb-3 mb-4 text-indigo-900">
                <Camera className="w-5 h-5" /> صورة الجهاز المرفقة
            </h2>
            {quoteData.imageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <img src={quoteData.imageUrl} className="w-full h-full object-contain" alt="Preview" />
                    <button onClick={() => updateField('imageUrl', "")} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
            ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <UploadButton endpoint="imageUploader" onClientUploadComplete={(res: any) => updateField('imageUrl', res[0].url)} appearance={{ button: "bg-indigo-900 text-white px-4 py-2 text-sm rounded-lg" }} />
                </div>
            )}
        </div>
    </div>
);