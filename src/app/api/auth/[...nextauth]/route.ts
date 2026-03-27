import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/src/app/lib/prisma";

export const authOptions: NextAuthOptions = {
    // 1. تحديد طريقة تسجيل الدخول (بالصلاحيات المخصصة: رقم الهاتف وكلمة المرور)
    providers: [
        CredentialsProvider({
            name: "Phone Number",
            credentials: {
                phone: { label: "Phone", type: "text", placeholder: "05XXXXXXXX" },
                password: { label: "Password", type: "password" }
            },
            // الدالة التي تتحقق من صحة البيانات
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("الرجاء إدخال رقم الهاتف وكلمة المرور");
                }

                // البحث عن المستخدم في قاعدة البيانات عبر Prisma
                const user = await prisma.user.findUnique({
                    where: {
                        phone: credentials.phone,
                    },
                });

                if (!user) {
                    throw new Error("رقم الهاتف غير مسجل في النظام");
                }

                // مقارنة كلمة المرور المدخلة مع كلمة المرور المشفرة في قاعدة البيانات
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("كلمة المرور غير صحيحة");
                }

                // إذا نجح التحقق، نرجع بيانات المستخدم ليتم حفظها في الجلسة
                return {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role, // مهم جداً لنظام الصلاحيات (عامل أم مدير)
                };
            }
        })
    ],

    // 2. إعدادات الجلسة (نستخدم JWT لأننا لا نستخدم محول قاعدة بيانات لـ NextAuth)
    session: {
        strategy: "jwt",
    },

    // 3. تمرير البيانات الإضافية (مثل الدور والـ ID) إلى الجلسة
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },

    // 4. تخصيص صفحات تسجيل الدخول (سنبنيها في الخطوة القادمة)
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };