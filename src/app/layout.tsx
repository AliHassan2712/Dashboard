import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../providers/Providers";
import { Toaster } from "react-hot-toast"; 
const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} bg-app-background-light text-app-text-primary-light antialiased dark:bg-app-background-dark dark:text-app-text-primary-dark`}>
        {/* تغليف التطبيق بمزود المصادقة */}
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
