"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-background-light text-app-text-primary-light flex transition-colors duration-300 dark:bg-app-background-dark dark:text-app-text-primary-dark" dir="rtl">
      {/* الشريط الجانبي */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 print:p-0 print:m-0 lg:mr-64 flex flex-col min-h-screen transition-all duration-300 w-full overflow-x-hidden">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
