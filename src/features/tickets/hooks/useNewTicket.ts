"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { createTicket } from "../actions";
import { createTicketSchema, CreateTicketValues } from "../validations";

export function useNewTicket() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // إعداد الـ Form مع التحقق (Validation)
  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { advancePayment: 0 }
  });

  const onSubmit = async (data: CreateTicketValues) => {
    setIsLoading(true);
    try {
      const result = await createTicket(data);
      if (result.error) {
        toast.error(result.error); 
      } else if (result.success && result.data) {
        toast.success("تم فتح التذكرة بنجاح!");
        router.push(`/tickets/${result.data.id}`); 
      }
    } catch {
      toast.error("حدث خطأ في الاتصال.");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit };
}