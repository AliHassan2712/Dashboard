"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quotationSchema, type QuotationFormValues } from "../validations/validations";

export function useQuotation() {
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      customerName: "",
      modelName: "",
      specs: "",
      priceIls: 0,
      exchangeRate: 3.75,
      imageUrl: "",
      notes: "1. الأسعار سارية لمدة أسبوع من تاريخ العرض.\n2. السعر يشمل التوريد والتركيب والتشغيل المبدئي.\n3. الضمان لمدة عام كامل ضد العيوب المصنعية."
    }
  });

  // 2. مراقبة التغييرات الحية لطباعتها على ورقة A4 مباشرة
  const quoteData = form.watch();

  const [priceUsd, setPriceUsd] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");

  // 3. الحساب التلقائي للـ USD
  useEffect(() => {
    const ils = Number(quoteData.priceIls) || 0;
    const rate = Number(quoteData.exchangeRate) || 1;
    setPriceUsd(rate > 0 ? ils / rate : 0);
  }, [quoteData.priceIls, quoteData.exchangeRate]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
    setQuoteNumber(`QT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  }, []);

  return { form, quoteData, priceUsd, currentDate, quoteNumber };
}