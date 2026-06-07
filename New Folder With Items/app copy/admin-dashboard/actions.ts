// app/actions/uploadImages.ts
'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { propertyDataSchema } from '@/validation/propertySchema';
import { mkdir, writeFile } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// app/actions/updateProperty.ts

const MAX_FILE_SIZE_MB = 2; // باید با مقدار فرم یکی باشد
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function uploadImages(propertyId: string, files: File[]) {
  if (!files || files.length === 0) {
    return { success: false, message: 'هیچ فایلی انتخاب نشده است.' };
  }

  const uploadedUrls: string[] = [];
  // ✅ ساخت آدرس دینامیک بر اساس propertyId
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'properties', propertyId);

  try {
    // ✅ چک مجدد حجم در سرور (برای امنیت)
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return { 
          success: false, 
          message: `فایل ${file.name} بیش از ${MAX_FILE_SIZE_MB} مگابایت حجم دارد.` 
        };
      }
    }

    // ساخت پوشه (اگر وجود ندارد)
    const fs = await import('fs/promises');
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
    console.error('❌ خطا در آپلود تصاویر:', error);
    return { success: false, message: 'خطایی در آپلود تصاویر رخ داد.' };
  }
}



export async function updateProperty(
  id: string,
  data: {
    address1?: string;
    address2?: string;
    city?: string;
    postcode?: string;
    description?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    status?: 'for_sale' | 'draft' | 'withdrawn' | 'sold';
    // ✅ اضافه کردن آرایه جدید از URLهای عکس
    newImages?: string[];
  }
) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: true, message: 'لطفاً ابتدا وارد حساب کاربری شوید.' };
  }

  if (session.user.role !== 'ADMIN') {
    return { error: true, message: 'دسترسی ادمین لازم است.' };
  }

  // اعتبارسنجی داده‌ها (فقط فیلدهایی که ارسال شده‌اند)
  const validation = propertyDataSchema.partial().safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message:
        validation.error.issues?.[0]?.message ?? 'خطایی در فرم رخ داده است.',
    };
  }

  try {
    // ساخت آبجکت داده برای آپدیت
    const updateData: any = {};

    // اضافه کردن فیلدهای متنی فقط اگر وجود دارند
    if (data.address1) updateData.address1 = data.address1;
    if (data.address2 !== undefined) updateData.address2 = data.address2;
    if (data.city) updateData.city = data.city;
    if (data.postcode) updateData.postcode = data.postcode;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.bedrooms !== undefined)
      updateData.bedrooms = Number(data.bedrooms);
    if (data.bathrooms !== undefined)
      updateData.bathrooms = Number(data.bathrooms);
    if (data.status) updateData.status = data.status;

    // ✅ منطق اضافه کردن تصاویر جدید به جدول Image
    if (data.newImages && data.newImages.length > 0) {
      updateData.images = {
        create: data.newImages.map((url) => ({
          url,
        })),
      };
    }

    // انجام آپدیت
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: true, // برای اطمینان از اینکه عکس‌ها اضافه شده‌اند
      },
    });

    revalidatePath('/admin-dashboard');
    revalidatePath(`/property/${id}`);

    return {
      error: false,
      message: 'ملک با موفقیت آپدیت شد.',
      data: updatedProperty,
    };
  } catch (error) {
    console.error('❌ خطا در آپدیت ملک:', error);
    return { error: true, message: 'خطایی در سرور رخ داد.' };
  }
}
