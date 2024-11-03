"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const KakaoLoginButton = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div
        className="relative w-[200.5px] h-[60px] cursor-pointer"
        onClick={() => signIn("kakao")}
      >
        <Image
          src="/kakao_login_large_narrow.png"
          alt="Kakao Oauth Login Button"
          fill
          className="object-contain"
          unoptimized
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl mb-4">안녕하세요, {session?.user?.name} 님!</p>
      <button
        onClick={() => signOut()}
        className="w-[200.5px] h-[50px] bg-gray-600 text-white text-lg font-semibold rounded-md flex items-center justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
      >
        로그아웃
      </button>
    </div>
  );
};

export default KakaoLoginButton;
