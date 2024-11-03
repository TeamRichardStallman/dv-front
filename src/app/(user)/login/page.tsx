"use client";
import KakaoLoginButton from "@/components/kakao-login-btn";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <SessionProvider>
      <div className="flex flex-col items-center">
        <div className="relative w-[180.5px] h-[100px] mb-4">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
        <h1 className="text-2xl font-bold">면접, 그 이상의 기록</h1>
        <div className="my-8">
          <KakaoLoginButton />
        </div>
      </div>
    </SessionProvider>
  );
}
