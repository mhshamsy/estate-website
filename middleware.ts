// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // بررسی اینکه آیا کاربر لاگین هست یا نه
  const userRole = req.auth?.user?.role; // فرض می‌کنیم role را در Session ذخیره کرده‌اید

  const isAdminRoute = nextUrl.pathname.startsWith("/admin-dashboard");
  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // ۱. اگر کاربر می‌خواهد به پنل ادمین برود اما ادمین نیست
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // ۲. اگر کاربر لاگین کرده است اما می‌خواهد به صفحه لاگین/ثبت‌نام برود
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// تنظیم مسیرهایی که میدل‌ور باید روی آن‌ها اجرا شود
export const config = {
  matcher: ["/admin-dashboard/:path*", "/login", "/register"],
};
