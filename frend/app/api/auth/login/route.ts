import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. إرسال الطلب إلى خادم Express
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    // في حال فشل تسجيل الدخول في الباك إند
    if (!backendResponse.ok || !data.token) {
      return NextResponse.json(
        { success: false, message: data.message || "فشل تسجيل الدخول" },
        { status: backendResponse.status }
      );
    }

    // 2. زرع الكوكي رسمياً في نطاق Next.js
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 ساعة
    });

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Proxy login error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ في الخادم الداخلي" },
      { status: 500 }
    );
  }
}


