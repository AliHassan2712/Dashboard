import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // اسم مسار الرفع (سنستخدمه في الواجهة الأمامية)
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } }) 
    .onUploadComplete(async ({ metadata, file }) => {
      // هذه الدالة تعمل بعد نجاح رفع الصورة
      return { uploadedBy: "Admin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;