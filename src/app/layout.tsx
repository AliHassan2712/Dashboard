import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/shared/Providers";
import { Toaster } from "react-hot-toast"; //  استدعاء المكتبة
const inter = Inter({ subsets: ["latin", "arabic"] });

export const metadata: Metadata = {
  title: "نظام إدارة ورشة الكمبريسور",
  description: "نظام إداري مخصص لورش صيانة وتجميع الكمبريسورات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        {/* تغليف التطبيق بمزود المصادقة */}
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}