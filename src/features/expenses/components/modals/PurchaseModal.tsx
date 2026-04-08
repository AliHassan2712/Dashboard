import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { InvoiceFormInput, invoiceSchema, type InvoiceFormValues } from "../../validations/validations";
import { Supplier, SparePart } from "@prisma/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  spareParts: SparePart[];
  onSave: (data: InvoiceFormValues) => Promise<boolean>;
  onOpenSupplierModal: () => void;
}

export const PurchaseModal = ({ isOpen, onClose, suppliers, spareParts, onSave, onOpenSupplierModal }: Props) => {

  const { register, control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<InvoiceFormInput,any, InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { supplierId: "", totalAmount: 0, paidAmount: 0, notes: "", items: [] }
  });

  // إدارة مصفوفة القطع (الأصناف)
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (isOpen) {
      reset({ supplierId: "", totalAmount: 0, paidAmount: 0, notes: "", items: [] });
      // إضافة سطر فارغ تلقائياً عند فتح النافذة
      append({ sparePartId: "", isNew: false, quantity: 1, unitCost: 0, notes: "" });
    }
  }, [isOpen, reset, append]);

  const onSubmit = async (data: InvoiceFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><ShoppingCart className="w-5 h-5 text-indigo-600" /> فاتورة مشتريات جديدة</>} maxWidth="2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* 1. بيانات الفاتورة الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              <span>التاجر / المورد</span>
              <button type="button" onClick={onOpenSupplierModal} className="text-xs text-indigo-600 font-bold hover:underline">+ مورد جديد</button>
            </label>
            <select {...register("supplierId")} className={`w-full bg-white border ${errors.supplierId ? 'border-red-300' : 'border-gray-300'} rounded-lg px-3 py-2 outline-none`}>
              <option value="">-- اختر التاجر --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <Input label="إجمالي الفاتورة (₪)" type="number" step="0.01" error={errors.totalAmount?.message} {...register("totalAmount", { valueAsNumber: true })} />
          <Input label="المبلغ المدفوع (₪)" type="number" step="0.01" error={errors.paidAmount?.message} {...register("paidAmount", { valueAsNumber: true })} />
        </div>

        {/* 2. أصناف الفاتورة */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">أصناف الفاتورة</h3>
            <button type="button" onClick={() => append({ sparePartId: "", isNew: false, quantity: 1, unitCost: 0 })} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-indigo-100 transition">
              <Plus className="w-4 h-4" /> إضافة صنف
            </button>
          </div>

          {errors.items?.root && <p className="text-sm text-red-500 font-medium">{errors.items.root.message}</p>}

          <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
            {fields.map((field, index) => {
              // مراقبة هل المستخدم اختار "صنف جديد" لهذا السطر تحديداً
              const isNewPart = watch(`items.${index}.isNew`);

              return (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-gray-200 p-3 rounded-xl relative items-start">

                  {/* اختيار القطعة */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">القطعة</label>
                    <select {...register(`items.${index}.sparePartId`)} disabled={isNewPart} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none">
                      <option value="">-- اختر من المخزن --</option>
                      {spareParts.map(p => <option key={p.id} value={p.id}>{p.name} (متوفر: {p.quantity})</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 mt-1 cursor-pointer">
                      <input type="checkbox" {...register(`items.${index}.isNew`)} className="rounded text-indigo-600" />
                      صنف جديد غير موجود بالمخزن؟
                    </label>
                  </div>

                  {/* إذا كان الصنف جديداً، إظهار حقول إضافية */}
                  {isNewPart && (
                    <div className="md:col-span-3 space-y-2">
                      <Input label="اسم القطعة الجديدة" className="h-9 text-sm" {...register(`items.${index}.newItemName`)} />
                      <Input label="سعر البيع المقترح للزبون" type="number" step="0.01" className="h-9 text-sm" {...register(`items.${index}.newItemSellingPrice`, { valueAsNumber: true })} />
                    </div>
                  )}

                  {/* الكمية والتكلفة */}
                  <div className={`grid grid-cols-2 gap-2 ${isNewPart ? 'md:col-span-3' : 'md:col-span-5'}`}>
                    <Input label="الكمية" type="number" className="h-9 text-sm" error={errors.items?.[index]?.quantity?.message} {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                    <Input label="تكلفة الوحدة (₪)" type="number" step="0.01" className="h-9 text-sm" error={errors.items?.[index]?.unitCost?.message} {...register(`items.${index}.unitCost`, { valueAsNumber: true })} />
                  </div>

                  {/* الملاحظات وزر الحذف */}
                  <div className="md:col-span-3 flex gap-2 items-end">
                    <div className="flex-1">
                      <Input label="ملاحظات القطعة" className="h-9 text-sm" {...register(`items.${index}.notes`)} />
                    </div>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition h-9 mb-[2px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الفاتورة وتحديث المخزن والديون"}
        </button>
      </form>
    </Modal>
  );
};