import "server-only";
import prisma from "@/lib/db";
import { PropertyStatus } from "@/generated/client";
import { Property } from "@/types/property";

type GetPropertiesOptions = {
  filters?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    minBedrooms?: number | null;
    status?: PropertyStatus[] | null;
    city?: string | null;
    ownerId?: string | null;
  };
  pagination?: {
    pageSize?: number;
    page: number;
  };
};

type GetPropertiesResult = {
  data: Property[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const getProperties = async (
  options?: GetPropertiesOptions
): Promise<GetPropertiesResult> => {
  const page = options?.pagination?.page ?? 1;
  const pageSize = options?.pagination?.pageSize ?? 10;
  const { minPrice, maxPrice, minBedrooms, status, city, ownerId } =
    options?.filters ?? {};

  // ساخت شرط فیلترها برای Prisma
  const whereClause: any = {};

  if (minPrice !== null && minPrice !== undefined) {
    whereClause.price = { ...whereClause.price, gte: minPrice };
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    whereClause.price = { ...whereClause.price, lte: maxPrice };
  }

  if (minBedrooms !== null && minBedrooms !== undefined) {
    whereClause.bedrooms = { ...whereClause.bedrooms, gte: minBedrooms };
  }

  if (status && status.length > 0) {
    whereClause.status = { in: status };
  }

  if (city) {
    whereClause.city = { equals: city, mode: "insensitive" }; // insensitive برای حساسیت به حروف بزرگ/کوچک
  }

  if (ownerId) {
    whereClause.ownerId = ownerId;
  }

  // ۱. محاسبه تعداد کل رکوردها (برای صفحه‌بندی)
  const total = await prisma.property.count({ where: whereClause });
  const totalPages = Math.ceil(total / pageSize);

  // ۲. دریافت داده‌های صفحه جاری با مرتب‌سازی
  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: {
      updatedAt: "desc", // جدیدترین اول
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    data: properties as Property[],
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

// دریافت یک ملک با ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
  return property as Property | null;
};

// دریافت ملک‌های یک کاربر
export const getPropertiesByOwner = async (
  ownerId: string
): Promise<Property[]> => {
  const properties = await prisma.property.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
  });
  return properties as Property[];
};
