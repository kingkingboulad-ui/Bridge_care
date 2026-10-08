import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const backendRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`,
      { email, password }
    );

    const data = backendRes.data;

    if (data.success && data.token) {
      const response = NextResponse.json({
        success: true,
        user: data.user,
      });

      // 1. تنظيف أي كوكيز عالقة من أدوار أخرى قبل حفظ الجديدة
      response.cookies.delete("nurse_token"); // استبدله باسم توكن الممرض إذا كان مختلفاً
      response.cookies.delete("nurse_user"); 

      // 2. إنشاء الكوكيز الجديدة للأدمن
      response.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      });

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
      { success: false, message: error.response?.data?.message || "Authentication failed" },
      { status: error.response?.status || 500 }
    );
  }
}