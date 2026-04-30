import { Camera, X } from "lucide-react";
import { UploadButton } from "@/src/lib/uploadthing";

interface TicketAttachmentsProps {
  imagesArray: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (url: string) => void;
}

export const TicketAttachments = ({ imagesArray, onAddImage, onRemoveImage }: TicketAttachmentsProps) => {
  return (
    <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border shadow-sm print:hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
          <Camera className="w-5 h-5" /> المرفقات وصور الفواتير
        </h3>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            res.forEach((file) => onAddImage(file.url));
          }}
          appearance={{ button: "bg-zinc-100 dark:bg-zinc-800 text-app-text-primary-light dark:text-app-text-primary-dark px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200" }}
          content={{ button: "إضافة صور" }}
        />
      </div>

      {imagesArray.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {imagesArray.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-app-border-light dark:border-app-border-dark bg-zinc-50 dark:bg-zinc-900">
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
        <div className="text-center p-8 border-2 border-dashed border-app-border-light dark:border-app-border-dark rounded-xl bg-zinc-50/70 dark:bg-zinc-900/70">
          <p className="text-sm text-app-text-secondary-light dark:text-app-text-secondary-dark font-medium">لا توجد صور مرفقة حالياً</p>
        </div>
      )}
    </div>
  );
};