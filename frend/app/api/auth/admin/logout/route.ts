import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies(); // تم إزالة await من هنا
  
  cookieStore.delete("token");
  cookieStore.delete("user");
  cookieStore.delete("admin_user");

  return NextResponse.json({ success: true });
}