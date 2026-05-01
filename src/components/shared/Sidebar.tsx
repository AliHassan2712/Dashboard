"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/src/constants/paths";
import { menuItems } from "@/src/constants/menuItems";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();


  const userRole = session?.user?.role || "WORKER";
  const visibleMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* خلفية ضبابية تظهر في الجوال فقط عند فتح القائمة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        print:hidden bg-zinc-950 text-white min-h-screen flex flex-col fixed right-0 top-0 bottom-0 z-40 w-64
        transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-brand-gradient mx-auto">
            COMPRESSOR<span className="text-white">PRO</span>
          </h1>
          <button onClick={onClose} className="lg:hidden p-1 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {visibleMenu.map((item) => {
            // تفعيل اللون الأزرق إذا كنا في الصفحة أو أحد تفرعاتها
            const isActive = pathname === item.href || (item.href !== ROUTES.HOME && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // إغلاق القائمة تلقائياً عند الضغط في الجوال
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-lg shadow-brand-950/30"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
