import { useState, useEffect, FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { Input } from "@/src/components/ui/Input";
import { Textarea } from "@/src/components/ui/Textarea";
import { TicketListItem, UpdateTicketInput } from "@/src/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketListItem | null;
  onSubmit: (e: FormEvent, data: UpdateTicketInput) => void;
  isSubmitting: boolean;
}

export const EditTicketModal = ({ isOpen, onClose, ticket, onSubmit, isSubmitting }: Props) => {
  const [formData, setFormData] = useState<UpdateTicketInput>({
    customerName: "",
    customerPhone: "",
    compressorModel: "",
    issueDescription: ""
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        customerName: ticket.customerName,
        customerPhone: ticket.customerPhone,
        compressorModel: ticket.compressorModel || "",
        issueDescription: ticket.issueDescription || ""
      });
    }
  }, [ticket]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تعديل البيانات الأساسية للتذكرة">
      <form onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
        <Input label="اسم الزبون" value={formData.customerName || ""} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required />
        <Input label="رقم الجوال" dir="ltr" className="text-right" value={formData.customerPhone || ""} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} required />
        <Input label="موديل الجهاز" value={formData.compressorModel || ""} onChange={(e) => setFormData({...formData, compressorModel: e.target.value})} />
        <Textarea label="وصف المشكلة" rows={3} value={formData.issueDescription || ""} onChange={(e) => setFormData({...formData, issueDescription: e.target.value})} />
        
        <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center hover:bg-indigo-700 mt-2 transition">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ التعديلات"}
        </button>
      </form>
    </Modal>
  );
};