import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. إرسال الطلب إلى الباك إند (Express)
    const backendRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`,
      { email, password }
    );

    const data = backendRes.data;

    // 2. إذا نجح الدخول واستلمنا التوكن، ننشئ الكوكي الآمن هنا
    if (data.success && data.token) {
      const response = NextResponse.json({
        success: true,
        user: data.user,
      });

      // كوكي التوكن (HttpOnly للحد من ثغرات XSS)
      response.cookies.set("token", data.token, {
        httpOnly: true, // 👈 الحماية الأهم
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // لأننا الآن على نفس الدومين
        path: "/",
        maxAge: 24 * 60 * 60, // يوم واحد
      });

      // كوكي بيانات المستخدم (لنعرض اسمه في الهيدر)
      response.cookies.set("user", JSON.stringify(data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      });

      return response;
    }

    return NextResponse.json(data, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Authentication failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}