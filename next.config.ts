import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "uufs.io" } 
    ],
  },
  // تجاهل أخطاء التايب سكريبت أثناء البناء
  typescript: {
    ignoreBuildErrors: true,
  },
  // ملاحظة: إعدادات eslint في النسخة 16 تتم عبر ملف منفصل أو CLI
  // لذا قمنا بإزالتها من هنا لتجنب التحذيرات
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;