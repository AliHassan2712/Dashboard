export function handleError(error: unknown, customMessage: string) {
  // 1. طباعة الخطأ الحقيقي في السيرفر (Terminal) عشان تتبعه كمطور
  console.error(`🔴 [Server Error] ${customMessage}:`, error);

  // 2. إرجاع رسالة آمنة ونظيفة للواجهة (العميل)
  return { 
    success: false, 
    error: customMessage 
  };
}