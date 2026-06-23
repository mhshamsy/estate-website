"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { propertyDataSchema } from "@/validation/propertySchema";
import { mkdir, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE_MB = 10; // باید با مقدار فرم یکی باشد
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function uploadImages(propertyId: string, files: File[]) {
  if (!files || files.length === 0) {
    return { success: false, message: "هیچ فایلی انتخاب نشده است." };
  }

  const uploadedUrls: string[] = [];
  const uploadDir = join(
    process.cwd(),
    "public",
    "uploads",
    "properties",
    propertyId
  );

  try {
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
          success: false,
          message: `فایل ${file.name} بیش از ${MAX_FILE_SIZE_MB} مگابایت حجم دارد.`,
        };
      }
    }

    // ساخت پوشه (اگر وجود ندارد)
    const fs = await import("fs/promises");
    await fs.mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // ✅ ساخت نام فایل یکتا با UUID + نام اصلی
      const uniqueName = `${uuidv4()}-${file.name}`;
      const filePath = join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);
      // ✅ ساخت آدرس نهایی دینامیک
      uploadedUrls.push(`/uploads/properties/${propertyId}/${uniqueName}`);
    }

    return { success: true, urls: uploadedUrls };
  } catch (error) {
    console.error("❌ خطا در آپلود تصاویر:", error);
    return { success: false, message: "خطایی در آپلود تصاویر رخ داد." };
  }
}

export async function updatePropertiesImages(
  id: string,
  data: {
    newImages?: string[];
    deletedImageIds?: string[]; // ✅ اضافه کردن آیدی عکس‌های حذف شده
  }
) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: true, message: "لطفاً ابتدا وارد حساب کاربری شوید." };
  }

  if (session.user.role !== "ADMIN") {
    return { error: true, message: "دسترسی ادمین لازم است." };
  }

  try {
    // ✅ حذف عکس‌های مشخص شده
    if (data.deletedImageIds && data.deletedImageIds.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: data.deletedImageIds },
          propertyId: id,
        },
      });
    }

    // ✅ اضافه کردن عکس‌های جدید
    if (data.newImages && data.newImages.length > 0) {
      await prisma.image.createMany({
        data: data.newImages.map((url) => ({
          url,
          propertyId: id,
        })),
      });
    }

    revalidatePath("/admin-dashboard");
    revalidatePath(`/property/${id}`);

    return {
      error: false,
      message: "تصاویر با موفقیت به‌روزرسانی شدند.",
    };
  } catch (error) {
    console.error("❌ خطا در به‌روزرسانی تصاویر:", error);
    return { error: true, message: "خطایی در سرور رخ داد." };
  }
}

