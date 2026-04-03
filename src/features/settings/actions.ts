"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";

// 1. جلب بيانات المستخدم الحالي
export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, phone: true, role: true }
    });
    
    if (!user) return { error: "المستخدم غير موجود" };
    return { success: true, data: user };
  } catch (error) {
    return { error: "فشل جلب البيانات" };
  }
}

// 2. تحديث الاسم ورقم الهاتف
export async function updateProfile(data: { name: string; phone: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name, phone: data.phone }
    });
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') return { error: "رقم الهاتف هذا مستخدم لحساب آخر!" };
    return { error: "حدث خطأ أثناء حفظ البيانات" };
  }
}

// 3. تغيير كلمة المرور
export async function changePassword(data: { currentPass: string; newPass: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "المستخدم غير موجود" };

    // التحقق من كلمة المرور القديمة
    const isValid = await bcrypt.compare(data.currentPass, user.password);
    if (!isValid) return { error: "كلمة المرور الحالية غير صحيحة" };

    // تشفير وحفظ الجديدة
    const hashedNewPassword = await bcrypt.hash(data.newPass, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    return { error: "فشل تغيير كلمة المرور" };
  }
}