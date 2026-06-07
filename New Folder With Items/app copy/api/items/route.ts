// app/api/items/route.ts
import { type NextRequest, NextResponse } from "next/server";
// مسیر نسبی به db.ts را بر اساس ساختار پوشه خود تنظیم کنید.
// فرض می‌کنیم db.ts در ریشه پروژه و app/api/items/route.ts در app/api/items قرار دارد.
import { getAllItems, createItem, updateItem, deleteItem } from "@/lib/db";

// تعریف Interface برای داده‌های ورودی و خروجی آیتم
interface Item {
  id: number;
  name: string;
  description?: string | null;
}

// Interface برای داده‌های ورودی در POST request
interface CreateItemInput {
  name: string;
  description?: string | null;
}

// Interface برای داده‌های ورودی در PUT request
// همه فیلدها اختیاری هستند چون ممکن است فقط یکی از آن‌ها به‌روزرسانی شود
interface UpdateItemInput {
  name?: string;
  description?: string | null;
}

// --- Handlers برای متدهای HTTP ---

/**
 * دریافت لیست تمام آیتم‌ها
 * متد: GET
 * مسیر: /api/items
 */
export async function GET(request: NextRequest) {
  try {
    const items = getAllItems();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/items - Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * ایجاد یک آیتم جدید
 * متد: POST
 * مسیر: /api/items
 * بدنه درخواست: { "name": "...", "description": "..." }
 */
export async function POST(request: NextRequest) {
  try {
    // مشخص کردن نوع داده بدنه درخواست
    const body: CreateItemInput = await request.json();
    const { name, description } = body;

    // اعتبارسنجی ورودی
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newItem = createItem(name, description);

    if (newItem) {
      // موفقیت در ایجاد، برگرداندن آیتم ایجاد شده با کد 201 Created
      return NextResponse.json(newItem, { status: 201 });
    } else {
      // اگر createItem در db.ts null برگرداند (که نباید در حالت عادی رخ دهد)
      console.error("POST /api/items - createItem returned null unexpectedly.");
      return NextResponse.json(
        { error: "Failed to create item due to an unexpected error" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/items - Error:", error);
    // مدیریت خطای JSON parsing
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create item", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * به‌روزرسانی یک آیتم موجود
 * متد: PUT
 * مسیر: /api/items?id=<itemId>
 * بدنه درخواست: { "name": "...", "description": "..." } (هر کدام اختیاری)
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // بررسی وجود پارامتر ID
    if (!id) {
      return NextResponse.json(
        { error: "ID query parameter is required for update" },
        { status: 400 }
      );
    }

    // مشخص کردن نوع داده بدنه درخواست برای PUT
    const body: UpdateItemInput = await request.json();
    const { name, description } = body;

    // بررسی اینکه حداقل یکی از فیلدها برای به‌روزرسانی ارسال شده باشد
    if (name === undefined && description === undefined) {
      return NextResponse.json(
        { error: "At least name or description must be provided for update" },
        { status: 400 }
      );
    }

    const updatedItem = updateItem(id, name, description);

    if (updatedItem === null) {
      // آیتم با ID مشخص شده پیدا نشد
      return NextResponse.json(
        { error: `Item with ID ${id} not found` },
        { status: 404 }
      );
    }

    // برگرداندن آیتم به‌روز شده
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error(
      `PUT /api/items?id=${request.url.split("?id=")[1]} - Error:`,
      error
    );
    // مدیریت خطای JSON parsing
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update item", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * حذف یک آیتم
 * متد: DELETE
 * مسیر: /api/items?id=<itemId>
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // بررسی وجود پارامتر ID
    if (!id) {
      return NextResponse.json(
        { error: "ID query parameter is required for delete" },
        { status: 400 }
      );
    }

    const changes = deleteItem(id);

    if (changes === 0) {
      // آیتم با ID مشخص شده پیدا نشد
      return NextResponse.json(
        { error: `Item with ID ${id} not found` },
        { status: 404 }
      );
    }

    // موفقیت در حذف
    return NextResponse.json({
      message: `Item with ID ${id} deleted successfully`,
    });
  } catch (error: any) {
    console.error(
      `DELETE /api/items?id=${request.url.split("?id=")[1]} - Error:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 }
    );
  }
}
