"use server";

import { UTApi } from "uploadthing/server";
import { handleError } from "@/src/lib/errorHandler";

const utapi = new UTApi();

export async function deleteFilesFromUploadThing(fileUrls: string | string[]) {
  try {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    
    const fileKeys = urls
      .map(url => url.split('/f/')[1])
      .filter(Boolean);

    if (fileKeys.length === 0) return { success: false, error: "لم يتم العثور على مفاتيح ملفات صالحة" };

    await utapi.deleteFiles(fileKeys);
    
    return { success: true };
  } catch (error) {
    return handleError(error, "فشل حذف الملف من خوادم التخزين");
  }
}