'use server';

import { passwordMatchSchema } from '@/validation/passwordMatchSchema';
import z from 'zod';
import { hash } from 'bcryptjs';
import prisma from '@/lib/db';

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  const newUserSchema = z
    .object({ email: z.string().email() })
    .and(passwordMatchSchema);

  const parsed = newUserSchema.safeParse({ email, password, passwordConfirm });

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues[0]?.message ?? 'An error occurred',
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    // ۲. بررسی می‌کنیم آیا کاربر وجود دارد یا خیر (برای تعیین ادمین اول)
    const userCount = await prisma.user.count();

    // اگر تعداد کاربران صفر بود، یعنی این اولین ثبت نام است
    const initialRole = userCount === 0 ? "ADMIN" : "USER";

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: initialRole, // نقش به صورت خودکار تعیین می‌شود
      },
    });

    return { error: false, message: "Registered successfully" }; // <-- موفقیت آمیز
  } catch (e: any) {
    // Prisma unique constraint (email already exists)
    if (e?.code === 'P2002') {
      return {
        error: true,
        message: 'An account is already registered with that email address',
      };
    }

    // Catch any other unexpected errors
    return {
      error: true,
      message: e?.message ?? 'An unexpected error occurred', // <-- پیام خطای دقیق تر
    };
  }
};
