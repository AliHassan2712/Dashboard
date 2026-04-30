"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { createTicket } from "@/src/server/actions/tickets.actions";
import { createTicketSchema, CreateTicketValues } from "../validations/validations";
import { ROUTES } from "@/src/constants/paths";

export function useNewTicket() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CreateTicketValues>({
    resolver: zodResolver(createTicketSchema), 
    defaultValues: { advancePayment: 0 }
  });

  const onSubmit = async (data: CreateTicketValues) => {
    setIsLoading(true);
    try {
      const result = await createTicket(data);
      if ("error" in result) {
        toast.error(String(result.error)); 
      } else if (result.data) {
        toast.success("تم فتح التذكرة بنجاح!");
        router.push(ROUTES.TICKET_DETAILS(result.data.id)); 
      }
    } catch {
      toast.error("حدث خطأ في الاتصال.");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit };
}