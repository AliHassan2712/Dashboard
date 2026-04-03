import type { Metadata } from "next";
import { Cairo } from 'next/font/google'
import "./globals.css";
import Providers from "../components/shared/Providers";
import { Toaster } from "react-hot-toast"; 


const cairo = Cairo({ 
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '900'],
})


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
      <body className={cairo.className}>
        {/* تغليف التطبيق بمزود المصادقة */}
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}