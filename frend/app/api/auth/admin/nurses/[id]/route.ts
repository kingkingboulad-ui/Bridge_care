import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. استخراج التوكن من Next.js
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. إرسال الطلب إلى الباك إند (Express) مع إرفاق التوكن يدوياً في الـ Headers
    const backendRes = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/nurses/${params.id}`, // 👈 تأكد أن هذا يطابق مسار الحذف في Express
      {
        headers: {
          Cookie: `token=${token}`, // نرسل التوكن لكي يقرأه السيرفر
        },
      }
    );

    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Delete failed",
      },
      { status: error.response?.status || 500 }
    );
  }
}