import { withAuth } from "next-auth/middleware";

// نستخدم withAuth من NextAuth لحماية المسارات
export default withAuth({
  pages: {
    signIn: "/login", // إذا لم يكن مسجل دخول، اذهب به إلى هنا
  },
});

// هنا نحدد ما هي الصفحات التي يجب حمايتها
export const config = {
  matcher: [
    /*
     * قم بحماية كل المسارات في الموقع باستثناء:
     * 1. /api (مسارات الواجهة الخلفية)
     * 2. /_next (ملفات النظام الداخلية لـ Next.js)
     * 3. /login (صفحة تسجيل الدخول نفسها، لا يعقل أن نحميها من الزوار!)
     * 4. الصور والملفات الثابتة
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};