import { LayoutDashboard, Ticket, Package, Receipt, Settings, Users, FileText, PieChart, ClipboardList } from "lucide-react";
import { ROUTES } from "./paths";

  export const menuItems = [
    { name: "الرئيسية", icon: LayoutDashboard, href: ROUTES.HOME, roles: ["ADMIN", "WORKER"] },
    { name: "التذاكر والصيانة", icon: Ticket, href: ROUTES.TICKETS, roles: ["ADMIN", "WORKER"] },
    { name: "المخزون والقطع", icon: Package, href: ROUTES.INVENTORY, roles: ["ADMIN", "WORKER"] },
    { name: "المشتريات والمصاريف", icon: Receipt, href: ROUTES.EXPENSES, roles: ["ADMIN"] },
    { name: "عروض الأسعار والكتالوج", icon: FileText, href: ROUTES.QUOTATIONS, roles: ["ADMIN"] },
    { name: "الميزانية والتقارير", icon: PieChart, href: ROUTES.REPORTS, roles: ["ADMIN"] },
    { name: "مخزن الكمبريسورات", icon: Package, href: ROUTES.COMPRESSORS, roles: ["ADMIN"] },
    { name: "العهد والتجارب", icon: ClipboardList, href: ROUTES.TRIALS, roles: ["ADMIN"] },
    { name: "العمال", icon: Users, href: ROUTES.WORKERS, roles: ["ADMIN"] },
    { name: "الإعدادات", icon: Settings, href: ROUTES.SETTINGS, roles: ["ADMIN", "WORKER"] },
  ];
