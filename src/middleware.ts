import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROUTES } from "./constants/routes";

export default withAuth(
  function middleware(req) {
    //  فحص إذا كان المستخدم بحاول يدخل صفحة العمال وهو مش مدير
    const isWorkerPage = req.nextUrl.pathname.startsWith("/workers");
    const isExpensePage = req.nextUrl.pathname.startsWith("/expenses");
    
    if ((isWorkerPage || isExpensePage) && req.nextauth.token?.role !== "ADMIN") {
      // اطرده للصفحة الرئيسية فوراً
      return NextResponse.redirect(new URL(`${ROUTES.HOME}`, req.url));
    }
  },
  {
    pages: {
      signIn: `${ROUTES.LOGIN}`,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};