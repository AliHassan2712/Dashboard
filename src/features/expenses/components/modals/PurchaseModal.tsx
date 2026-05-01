import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, ShoppingCart, Trash2, Calculator } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import { InvoiceFormInput, invoiceSchema, type InvoiceFormValues } from "../../validations/validations";
import { Supplier } from "@prisma/client";
import { SparePartDropdownOption } from "@/src/types/expense.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  spareParts: SparePartDropdownOption[];
  onSave: (data: InvoiceFormValues) => Promise<boolean>;
  onOpenSupplierModal: () => void;
}

export const PurchaseModal = ({ isOpen, onClose, suppliers, spareParts, onSave, onOpenSupplierModal }: Props) => {
  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<InvoiceFormInput, any, InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { supplierId: "", totalAmount: 0, paidAmount: 0, notes: "", items: [] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const items = watch("items");
  const paidAmount = watch("paidAmount") || 0;

  const calculatedTotal = items?.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const cost = Number(item.unitCost) || 0;
    return sum + (qty * cost);
  }, 0) || 0;

  const remainingDebt = calculatedTotal - paidAmount;

  useEffect(() => {
    setValue("totalAmount", calculatedTotal);
  }, [calculatedTotal, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({ supplierId: "", totalAmount: 0, paidAmount: 0, notes: "", items: [] });
      append({ sparePartId: "", isNew: false, quantity: 1, unitCost: 0, notes: "" });
    }
  }, [isOpen, reset, append]);

  const onSubmit = async (data: InvoiceFormValues) => {
    const success = await onSave(data);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<><ShoppingCart className="w-5 h-5 text-brand-600 dark:text-brand-400" /> فاتورة مشتريات جديدة</>} maxWidth="2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-app-border-light dark:border-app-border-dark">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-app-text-primary-light dark:text-app-text-primary-dark flex justify-between">
              <span>التاجر / المورد</span>
              <button type="button" onClick={onOpenSupplierModal} className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline">+ مورد جديد</button>
            </label>
            <select {...register("supplierId")} className={`w-full bg-app-card-light dark:bg-app-card-dark border ${errors.supplierId ? 'border-danger-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-lg px-3 py-2.5 outline-none transition`}>
              <option value="">-- اختر التاجر --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.supplierId && <p className="text-xs text-danger-500 font-medium">{errors.supplierId.message as string}</p>}
          </div>
          
          <Input 
            label="المبلغ المدفوع كاش (₪)" 
            type="number" 
            step="0.01" 
            error={errors.paidAmount?.message as string} 
            {...register("paidAmount", { valueAsNumber: true })} 
          />

          <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/60 rounded-lg p-3 flex flex-col justify-center items-center text-brand-950 dark:text-brand-100 shadow-inner">
            <span className="text-xs font-bold mb-1 flex items-center gap-1"><Calculator className="w-3 h-3"/> إجمالي الفاتورة التلقائي</span>
            <span className="text-2xl font-black">₪ {calculatedTotal.toFixed(2)}</span>
            {remainingDebt > 0 && (
              <span className="text-[10px] font-bold text-danger-600 dark:text-danger-500 mt-1">يُقيد كدين: ₪ {remainingDebt.toFixed(2)}</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-app-text-primary-light dark:text-app-text-primary-dark">أصناف الفاتورة</h3>
            <button type="button" onClick={() => append({ sparePartId: "", isNew: false, quantity: 1, unitCost: 0 })} className="text-sm bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-indigo-100 transition">
              <Plus className="w-4 h-4" /> إضافة صنف
            </button>
          </div>

          {errors.items?.root && <p className="text-sm text-danger-500 font-medium">{errors.items.root.message}</p>}

          <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
            {fields.map((field, index) => {
              const isNewPart = watch(`items.${index}.isNew`);

              return (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-app-card-light dark:bg-app-card-dark border border-app-border-light dark:border-app-border-dark p-3 rounded-xl relative items-start">
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-app-text-secondary-light dark:text-app-text-secondary-dark">القطعة</label>
                    <select {...register(`items.${index}.sparePartId`)} disabled={isNewPart} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-app-border-light dark:border-app-border-dark rounded-lg px-2 py-2 text-sm outline-none">
                      <option value="">-- اختر من المخزن --</option>
                      {spareParts.map(p => <option key={p.id} value={p.id}>{p.name} (متوفر: {p.quantity})</option>)}
                    </select>
                    <label className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 mt-1 cursor-pointer">
                      <input type="checkbox" {...register(`items.${index}.isNew`)} className="rounded text-brand-600 dark:text-brand-400" />
                      صنف جديد غير موجود بالمخزن؟
                    </label>
                  </div>

                  {isNewPart && (
                    <div className="md:col-span-3 space-y-2">
                      <Input label="اسم القطعة الجديدة" className="h-9 text-sm" {...register(`items.${index}.newItemName`)} />
                      <Input label="سعر البيع المقترح للزبون" type="number" step="0.01" className="h-9 text-sm" {...register(`items.${index}.newItemSellingPrice`, { valueAsNumber: true })} />
                    </div>
                  )}

                  <div className={`grid grid-cols-2 gap-2 ${isNewPart ? 'md:col-span-3' : 'md:col-span-5'}`}>
                    <Input label="الكمية" type="number" className="h-9 text-sm" error={errors.items?.[index]?.quantity?.message} {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                    <Input label="تكلفة الوحدة (₪)" type="number" step="0.01" className="h-9 text-sm" error={errors.items?.[index]?.unitCost?.message} {...register(`items.${index}.unitCost`, { valueAsNumber: true })} />
                  </div>

                  <div className="md:col-span-3 flex gap-2 items-end">
                    <div className="flex-1">
                      <Input label="ملاحظات القطعة" className="h-9 text-sm" {...register(`items.${index}.notes`)} />
                    </div>
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="bg-danger-50 dark:bg-danger-900/20 text-danger-500 p-2 rounded-lg hover:bg-red-100 transition h-9 mb-[2px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "اعتماد الفاتورة وتحديث المخزن والديون"}
        </button>
      </form>
    </Modal>
  );
};