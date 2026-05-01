import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { TicketListItem } from "@/src/types";
import { updateTicketSchema, type UpdateTicketFormValues } from "../validations/validations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketListItem | null;
  onSubmit: (data: UpdateTicketFormValues) => Promise<boolean>;
}

export const EditTicketModal = ({ isOpen, onClose, ticket, onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateTicketFormValues>({
    resolver: zodResolver(updateTicketSchema)
  });

  // تعبئة الحقول تلقائياً ببيانات التذكرة عند فتح النافذة
  useEffect(() => {
    if (ticket && isOpen) {
      reset({
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone,
        compressorModel: ticket.compressorModel || "",
        issueDescription: ticket.issueDescription || ""
      });
    }
  }, [ticket, isOpen, reset]);

  const handleFormSubmit = async (data: UpdateTicketFormValues) => {
    await onSubmit(data); 
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تعديل البيانات الأساسية للتذكرة">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        
        <Input label="اسم الزبون" error={errors.customerName?.message} {...register("customerName")} />
        <Input label="رقم الجوال" dir="ltr" className="text-right" error={errors.customerPhone?.message} {...register("customerPhone")} />
        <Input label="موديل الجهاز" error={errors.compressorModel?.message} {...register("compressorModel")} />
        <Textarea label="وصف المشكلة" rows={3} error={errors.issueDescription?.message} {...register("issueDescription")} />
        
        <button disabled={isSubmitting} type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ التعديلات"}
        </button>

      </form>
    </Modal>
  );
};