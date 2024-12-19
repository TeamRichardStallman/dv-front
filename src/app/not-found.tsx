"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import { isLogined } from "@/utils/isLogined";
import Footer from "@/components/footer";

export default function NotFound() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} />
      <main className="relative flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center h-full text-center">
          <div className="text-center text-[50px] font-bold">Oops!</div>
          <div className="text-center text-[20px]">
            페이지를 찾을 수 없습니다.
          </div>
          <div className="relative w-48 h-48 mb-0">
            <Image
              src="/surprised_logo_gray.png"
              alt="비정상적인 접근입니다."
              layout="fill"
              className="object-contain"
              unoptimized
              priority
            />
          </div>
          <Link href="/">
            <button className="bg-secondary w-24 text-white py-2 px-6 rounded-md">
              홈으로
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
