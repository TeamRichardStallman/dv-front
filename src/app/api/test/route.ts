import { NextResponse } from "next/server";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return NextResponse.json({ message: "데이터 로딩이 완료되었습니다." });
}
