"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const currentPath = usePathname();

  const menuItems = [
    { name: "내 정보 수정", path: "/mypage/edit" },
    { name: "나의 취업 정보", path: "/mypage/profile" },
    { name: "면접 평가 확인", path: "/mypage/feedback" },
    { name: "쿠폰함", path: "/mypage/coupon" },
    { name: "이용권", path: "/mypage/voucher" },
    { name: "결제 내역", path: "/mypage/payment-history" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <nav className="bg-gray-100 p-6 shadow-lg rounded-lg fixed top-20 left-8 w-56 h-auto">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <span
                    className={`font-bold block px-4 py-2 rounded-lg ${
                      currentPath === item.path
                        ? "bg-primary text-white"
                        : "hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow p-8 ml-auto mr-auto w-full max-w-4xl flex justify-center items-center">
          <div className="w-full">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MyPageLayout;
