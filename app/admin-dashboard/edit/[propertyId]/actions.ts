// actions/properties.ts
'use server';

import  prisma  from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { propertyDataSchema } from '@/validation/propertySchema';

// ✅ تعریف نوع داده ورودی
type UpdatePropertyInput = z.infer<typeof propertyDataSchema>;

export async function updateProperty(id: string, data: UpdatePropertyInput) {
  try {
    // اعتبارسنجی داده‌ها (اگر در فرم انجام نشده باشد)
    const validatedData = propertyDataSchema.parse(data);

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        address1: validatedData.address1,
        address2: validatedData.address2 || null,
        city: validatedData.city,
        postcode: validatedData.postcode,
        price: validatedData.price,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        description: validatedData.description || null,
        status: validatedData.status as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin-dashboard');
    revalidatePath(`/property/${id}`);

    // ✅ بازگشت موفقیت
    return { success: true, message: 'Property updated successfully' };
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      error: true,
      message: 'Failed to update property. Please try again.',
    };
  }
}
