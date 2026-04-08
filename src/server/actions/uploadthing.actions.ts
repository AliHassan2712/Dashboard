"use server";

import { UTApi } from "uploadthing/server";

// تهيئة الخدمة للاتصال بسيرفرات UploadThing
const utapi = new UTApi();

/**
 * دالة لحذف ملف واحد أو عدة ملفات من UploadThing باستخدام الرابط (URL)
 */
export async function deleteFilesFromUploadThing(fileUrls: string | string[]) {
  try {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    
    // استخراج الـ fileKey من الروابط (UploadThing يعتمد على الـ Key للحذف)
    const fileKeys = urls
      .map(url => url.split('/f/')[1])
      .filter(Boolean); // فلترة أي قيم فارغة

    if (fileKeys.length === 0) return { success: false, error: "لم يتم العثور على مفاتيح ملفات صالحة" };

    // إرسال أمر الحذف الفيزيائي للسيرفرات
    await utapi.deleteFiles(fileKeys);
    
    return { success: true };
  } catch (error) {
    console.error("🔴 [UploadThing Delete Error]:", error);
    return { success: false, error: "فشل حذف الملف من خوادم التخزين" };
  }
}