"use server";

import prisma from "@/src/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/src/constants/paths";
import { handleError } from "@/src/lib/errorHandler";

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
    return handleError(error, "فشل جلب البيانات");
  }
}

export async function updateProfile(data: { name: string; phone: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: data.name, phone: data.phone }
    });
    
    revalidatePath(ROUTES.SETTINGS || "/settings");
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === 'P2002') {
      return handleError(error, "رقم الهاتف هذا مستخدم لحساب آخر!");
    }
    return handleError(error, "حدث خطأ أثناء حفظ البيانات");
  }
}

export async function changePassword(data: { currentPass: string; newPass: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "المستخدم غير موجود" };

    const isValid = await bcrypt.compare(data.currentPass, user.password);
    if (!isValid) return { error: "كلمة المرور الحالية غير صحيحة" };

    const hashedNewPassword = await bcrypt.hash(data.newPass, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  } catch (error) {
    return handleError(error, "فشل تغيير كلمة المرور");
  }
}