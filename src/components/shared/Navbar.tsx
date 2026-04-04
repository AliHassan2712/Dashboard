"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Menu } from "lucide-react";
import { ROUTES } from "@/src/constants/routes"; 

export default function Navbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="print:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">      
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button onClick={onOpenSidebar} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">نظام الإدارة</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <User className="w-5 h-5 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {session?.user?.name || "مستخدم"}
            </span>
            <span className="text-xs text-gray-500">
              {session?.user?.role === "ADMIN" ? "مدير نظام" : "فني / عامل"}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:block">خروج</span>
        </button>
      </div>
    </header>
  );
}