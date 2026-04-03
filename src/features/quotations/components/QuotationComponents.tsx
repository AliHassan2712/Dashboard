import { FileText, Camera, X, CheckCircle, Phone, MapPin, Building2, Quote } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { UploadButton } from "@/src/lib/uploadthing";
import { siteConfig } from "@/src/config/site";

// 1. مكون نموذج إدخال البيانات
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
           <button onClick={() => updateField('imageUrl', "")} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4"/></button>
         </div>
      ) : (
         <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <UploadButton endpoint="imageUploader" onClientUploadComplete={(res: any) => updateField('imageUrl', res[0].url)} appearance={{ button: "bg-indigo-900 text-white px-4 py-2 text-sm rounded-lg" }} />
         </div>
      )}
    </div>
  </div>
);

// 2. مكون ورقة الـ A4 الخاصة بالطباعة
export const QuotationPrintTemplate = ({ quoteData, priceUsd, currentDate, quoteNumber }: any) => (
  <div id="printable-a4" className="w-full lg:w-2/3 bg-white border border-gray-200 shadow-xl rounded-none sm:rounded-2xl mx-auto overflow-hidden relative font-sans box-border flex flex-col">
    <div className="h-4 w-full bg-gradient-to-r from-indigo-900 to-indigo-600 shrink-0"></div>

    <div className="p-8 sm:p-10 print:p-[15mm] flex-1 flex flex-col bg-white">
      {/* الترويسة */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-gray-200 pb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-900 text-white rounded-xl flex items-center justify-center font-black text-3xl shadow-sm">
            {siteConfig.name.charAt(5)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-indigo-900 tracking-tight">{siteConfig.name}</h1>
            <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">{siteConfig.slogan}</p>
          </div>
        </div>
        <div className="text-left text-sm font-bold text-gray-600 space-y-1.5">
          <p className="flex items-center justify-end gap-2"><Phone className="w-4 h-4 text-indigo-600" /> {siteConfig.phone}</p>
          <p className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4 text-indigo-600" /> {siteConfig.address}</p>
        </div>
      </div>

      {/* عنوان المستند */}
      <div className="text-center mb-6 shrink-0 relative">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
         <div className="relative flex justify-center">
            <span className="bg-white px-6 text-xl sm:text-2xl font-black text-gray-800 tracking-wide flex items-center gap-2">
              <Quote className="w-5 h-5 text-indigo-600" /> عرض سعر فني ومالي
            </span>
         </div>
      </div>

      {/* مربع بيانات العميل */}
      <div className="flex justify-between items-start bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shrink-0">
         <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase">مقدم إلى السادة / Prepared For:</p>
            <p className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" /> 
              {quoteData.customerName || "......................................................."}
            </p>
         </div>
         <div className="text-left space-y-2 border-r-2 border-gray-200 pr-5">
            <p className="text-xs sm:text-sm font-bold text-gray-600"><span className="text-gray-400">التاريخ:</span> {currentDate}</p>
            <p className="text-xs sm:text-sm font-bold text-gray-600"><span className="text-gray-400">المرجع:</span> {quoteNumber}</p>
         </div>
      </div>

      {/* تفاصيل العرض (الصورة + المواصفات) */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 flex-1 min-h-0">
         {quoteData.imageUrl && (
           <div className="w-full sm:w-5/12 bg-white border-2 border-gray-100 rounded-xl overflow-hidden p-2 shadow-sm shrink-0 h-fit">
             <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
               <img src={quoteData.imageUrl} className="w-full h-full object-contain" alt="Product" />
             </div>
           </div>
         )}

         <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 h-fit shadow-sm">
           <h3 className="text-base sm:text-lg font-black text-indigo-900 mb-4 border-b border-gray-100 pb-2">
             {quoteData.modelName || "وصف المنتج / الموديل"}
           </h3>
           <ul className="space-y-3 font-medium text-gray-700 text-xs sm:text-sm">
             {quoteData.specs.split('\n').map((spec: string, index: number) => spec.trim() && (
               <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                 <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                 <span>{spec.trim()}</span>
               </li>
             ))}
           </ul>
         </div>
      </div>

      {/* جدول التسعير */}
      <div className="mb-6 shrink-0 rounded-xl overflow-hidden border border-indigo-900 shadow-sm">
         <table className="w-full text-center">
           <thead className="bg-indigo-900 text-white">
             <tr>
               <th className="p-3 text-xs sm:text-sm font-bold w-1/2">البيـان / الوصـف</th>
               <th className="p-3 text-xs sm:text-sm font-bold border-r border-indigo-700">الإجمالي بالشيكل (ILS)</th>
               <th className="p-3 text-xs sm:text-sm font-bold border-r border-indigo-700">المعادل بالدولار (USD)</th>
             </tr>
           </thead>
           <tbody className="bg-white">
             <tr>
               <td className="p-4 sm:p-5 text-sm font-bold text-gray-800 border-b border-gray-100">إجمالي التوريد والتركيب للمنتج المذكور أعلاه</td>
               <td className="p-4 sm:p-5 font-black text-xl sm:text-2xl text-gray-900 border-r border-b border-gray-100 bg-gray-50">
                 ₪ {quoteData.priceIls || "0.00"}
               </td>
               <td className="p-4 sm:p-5 font-black text-lg sm:text-xl text-indigo-700 border-r border-b border-gray-100 bg-indigo-50/50">
                 $ {priceUsd > 0 ? priceUsd.toFixed(2) : "0.00"}
               </td>
             </tr>
           </tbody>
         </table>
         <div className="bg-white p-2 text-center text-[10px] sm:text-xs font-bold text-gray-400">
            * تم احتساب القيمة بالدولار بناءً على سعر صرف تقريبي ({quoteData.exchangeRate}).
         </div>
      </div>

      {/* الفوتر والتوقيع */}
      <div className="mt-auto shrink-0 pt-4">
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          <div className="col-span-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-black text-indigo-900 mb-2 text-xs sm:text-sm">شروط وملاحظات عامة:</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium whitespace-pre-line leading-relaxed">
              {quoteData.notes}
            </p>
          </div>
          <div className="col-span-4 flex flex-col items-center justify-end pt-2">
            <div className="w-full text-center border-t-2 border-gray-300 pt-2 mb-1">
               <p className="font-bold text-gray-900 text-xs sm:text-sm">توقيع واعتماد الإدارة</p>
               <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase">{siteConfig.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="h-2 w-full bg-indigo-900 shrink-0"></div>
  </div>
);