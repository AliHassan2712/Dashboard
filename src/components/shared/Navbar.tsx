"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { ROUTES } from "@/src/constants/paths";
import { useTheme } from "@/src/providers/ThemeProvider";

export default function Navbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="print:hidden bg-app-card-light/90 border-b border-app-border-light h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm backdrop-blur-xl transition-colors dark:bg-app-card-dark/90 dark:border-app-border-dark dark:shadow-premium-dark">
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 text-app-text-secondary-light hover:bg-zinc-100 rounded-lg transition dark:text-app-text-secondary-dark dark:hover:bg-zinc-800"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-xl font-semibold text-app-text-primary-light hidden sm:block dark:text-app-text-primary-dark">
          نظام الإدارة
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 text-app-text-secondary-light hover:text-brand-600 hover:bg-brand-50 rounded-lg border border-app-border-light transition dark:text-app-text-secondary-dark dark:border-app-border-dark dark:hover:text-brand-300 dark:hover:bg-brand-950/40"
          title={isDark ? "Light mode" : "Dark mode"}
          aria-label={isDark ? "Light mode" : "Dark mode"}
        >
          {mounted ? (
            isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )
          ) : (
            <span className="block h-5 w-5" />
          )}
        </button>

        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-app-border-light transition-colors dark:bg-zinc-900 dark:border-app-border-dark">
          <User className="w-5 h-5 text-app-text-secondary-light dark:text-app-text-secondary-dark" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-app-text-primary-light dark:text-app-text-primary-dark">
              {session?.user?.name || "مستخدم"}
            </span>
            <span className="text-xs text-app-text-secondary-light dark:text-app-text-secondary-dark">
              {session?.user?.role === "ADMIN" ? "مدير نظام" : "فني / عامل"}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition flex items-center gap-2 dark:text-danger-500 dark:hover:bg-danger-900/25"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:block">خروج</span>
        </button>
      </div>
    </header>
  );
}
