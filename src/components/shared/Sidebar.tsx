"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 👈 استيراد الجلسة
import { LayoutDashboard, Ticket, Package, Receipt, Settings, Users, FileText } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // 👈 جلب بيانات المستخدم الحالي

  // 👈 تعريف القوائم مع تحديد من يسمح له برؤيتها
  const menuItems = [
    { name: "الرئيسية", icon: LayoutDashboard, href: "/", roles: ["ADMIN", "WORKER"] },
    { name: "التذاكر والصيانة", icon: Ticket, href: "/tickets", roles: ["ADMIN", "WORKER"] },
    { name: "المخزون والقطع", icon: Package, href: "/inventory", roles: ["ADMIN", "WORKER"] }, // ممكن تخفيها لو حبيت
    { name: "المشتريات والمصاريف", icon: Receipt, href: "/expenses", roles: ["ADMIN"] }, // للمدير فقط
    { name: "عروض الأسعار والكتالوج", icon: FileText, href: "/quotations", roles: ["ADMIN"] },
    { name: "العمال", icon: Users, href: "/workers", roles: ["ADMIN"] }, // للمدير فقط
    { name: "الإعدادات", icon: Settings, href: "/settings", roles: ["ADMIN", "WORKER"] },
  ];

  // فلترة القوائم بناءً على صلاحية المستخدم
  const userRole = session?.user?.role || "WORKER";
  const visibleMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="print:hidden w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed right-0 top-0 bottom-0 z-20">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">
          COMPRESSOR<span className="text-white">PRO</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {visibleMenu.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}