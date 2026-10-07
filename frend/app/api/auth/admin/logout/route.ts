import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token"); // حذف الكوكي من Next.js
  return NextResponse.json({ success: true });
}