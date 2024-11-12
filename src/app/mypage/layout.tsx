"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { isLogined } from "@/utils/isLogined";

const menuItems = [
  { name: "내 정보 수정", path: "/mypage/edit" },
  { name: "나의 취업 정보", path: "/mypage/profile" },
  { name: "면접 평가 확인", path: "/mypage/feedback" },
  { name: "쿠폰함", path: "/mypage/coupon" },
  { name: "이용권", path: "/mypage/voucher" },
  { name: "결제 내역", path: "/mypage/payment-history" },
];

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);
  const pathname = usePathname();
  const currentPage =
    menuItems.find((item) => item.path === pathname)?.name || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} />

      <div className="flex flex-1">
        <nav className="bg-gray-100 p-6 shadow-lg rounded-lg fixed top-28 left-8 w-56 h-auto">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`font-bold ${
                    pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:text-primary"
                  } p-2 rounded-lg block`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-grow p-8 ml-auto mr-auto w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-8">{currentPage}</h1>
          <div className="flex w-full max-w-2xl justify-center">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyPageLayout;
