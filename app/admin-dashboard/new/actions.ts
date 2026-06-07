'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { propertyDataSchema } from '@/validation/propertySchema';
import { revalidatePath } from 'next/cache';

export default async function createProperty(data: {
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: 'for_sale' | 'draft' | 'withdrawn' | 'sold';
  images?: string[]; // ✅ اجازه دادن به آرایه خالی یا undefined
}) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: true, message: 'لطفاً وارد شوید.' };
  }

  // 2. اعتبارسنجی داده‌ها
  const validation = propertyDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues?.[0]?.message ?? 'خطا در فرم.',
    };
  }

  try {
    const processedData: any = {
      ...validation.data,
      price: Number(validation.data.price),
      bedrooms: Number(validation.data.bedrooms),
      bathrooms: Number(validation.data.bathrooms),
    };

    // ✅ 3. اضافه کردن owner (کاربر فعلی)
    // فرض می‌کنیم session.user.id شناسه کاربر است
    processedData.owner = {
      connect: {
        id: session.user.id, // ✅ این خط مشکل را حل می‌کند
      },
    };

    // 4. اضافه کردن تصاویر اگر وجود داشته باشند
    if (data.images && data.images.length > 0) {
      processedData.images = {
        create: data.images.map((url) => ({ url })),
      };
    }

    // 5. ذخیره در دیتابیس
    const newProperty = await prisma.property.create({
      data: processedData,
      include: {
        images: true,
      },
    });

    revalidatePath('/admin-dashboard');

    return {
      error: false,
      message: 'ملک با موفقیت ثبت شد.',
      data: newProperty,
    };
  } catch (error) {
    console.error('❌ خطا در ذخیره ملک:', error);
    return { error: true, message: 'خطایی در سرور رخ داد.' };
  }
}