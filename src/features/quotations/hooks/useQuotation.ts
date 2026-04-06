"use client";

import { useState, useEffect } from "react";
import { QuoteData } from "@/src/types";

export function useQuotation() {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    customerName: "",
    modelName: "",
    specs: "",
    priceIls: "",
    exchangeRate: "3.75",
    imageUrl: "",
    notes: "1. الأسعار سارية لمدة أسبوع من تاريخ العرض.\n2. السعر يشمل التوريد والتركيب والتشغيل المبدئي.\n3. الضمان لمدة عام كامل ضد العيوب المصنعية."
  });

  const [priceUsd, setPriceUsd] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");

  useEffect(() => {
    const ils = parseFloat(quoteData.priceIls) || 0;
    const rate = parseFloat(quoteData.exchangeRate) || 1;
    setPriceUsd(ils / rate);
  }, [quoteData.priceIls, quoteData.exchangeRate]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
    setQuoteNumber(`QT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  }, []);

  const updateField = (field: keyof QuoteData, value: string) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  return { quoteData, updateField, priceUsd, currentDate, quoteNumber };
}