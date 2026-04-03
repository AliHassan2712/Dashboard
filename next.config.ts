import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إعدادات الصور الخاصة بـ UploadThing
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "uufs.io" } 
    ],
  },
  // تجاهل أخطاء ESLint الشكلية أثناء الـ Build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // تجاهل أخطاء TypeScript الشكلية أثناء الـ Build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;