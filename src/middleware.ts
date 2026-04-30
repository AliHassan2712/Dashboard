import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROUTES } from "./constants/paths";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // قائمة المسارات التي لا يدخلها إلا المسؤول (Admin)
    const adminOnlyPaths = ["/workers", "/expenses", "/reports", "/transactions", "/compressors"];

    const isSensitivePage = adminOnlyPaths.some(path => pathname.startsWith(path));
    if (isSensitivePage && role !== "ADMIN") {
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