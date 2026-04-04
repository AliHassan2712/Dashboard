import { Camera, X } from "lucide-react";
import { UploadButton } from "@/src/lib/uploadthing";

export const TicketAttachments = ({ imagesArray, onAddImage, onRemoveImage }: any) => {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm print:hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2 text-sm text-indigo-600">
          <Camera className="w-5 h-5" /> المرفقات وصور الفواتير
        </h3>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            res.forEach((file: any) => onAddImage(file.url));
          }}
          appearance={{ button: "bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200" }}
          content={{ button: "إضافة صور" }}
        />
      </div>

      {imagesArray.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imagesArray.map((img: string, index: number) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
              <img src={img} alt={`مرفق ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => { if (confirm("هل أنت متأكد من حذف هذه الصورة؟")) onRemoveImage(img); }}
                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-sm text-gray-500 font-medium">لا توجد صور مرفقة حالياً</p>
        </div>
      )}
    </div>
  );
};