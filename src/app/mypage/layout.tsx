"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { isLogined } from "@/utils/isLogined";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";

const apiUrl = `${setUrl}`;

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
  const [, setNickname] = useState("Loading...");
  const [licenseCounts, setLicenseCounts] = useState<LicenseCounts>({
    mockChat: 0,
    mockVoice: 0,
    realChat: 0,
    realVoice: 0,
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    setLoggedIn(isLogined());
    const getMyPageUserInfo = async () => {
      try {
        const response = await axios.get<GetMyPageResponse>(
          `${apiUrl}/user/my-page`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setNickname(response.data.data.user.nickname);
        setLicenseCounts({
          mockChat: response.data.data.ticketInfo.generalChatBalance,
          mockVoice: response.data.data.ticketInfo.generalVoiceBalance,
          realChat: response.data.data.ticketInfo.realChatBalance,
          realVoice: response.data.data.ticketInfo.realVoiceBalance,
        });
        setUserInfo(response.data.data.user);
      } catch (error) {
        console.error("Error fetching Simple Coupon List: ", error);
        throw error;
      }
    };
    getMyPageUserInfo();
  }, []);

  const pathname = usePathname();
  const currentPage =
    menuItems.find((item) => item.path === pathname)?.name || "";

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} />

      <div className="flex flex-1 relative">
        <div className="absolute bg-gray-100 p-4 shadow-lg rounded-lg top-8 left-8 w-[240px]">
          <h3 className="text-lg font-bold mb-2">{userInfo?.nickname}</h3>
          <p className="text-sm font-semibold mb-1">
            모의 채팅/음성: {licenseCounts?.mockChat}/{licenseCounts?.mockVoice}
          </p>
          <p className="text-sm font-semibold">
            실전 채팅/음성: {licenseCounts?.realChat}/{licenseCounts?.realVoice}
          </p>
        </div>

        <nav className="absolute bg-gray-100 p-6 shadow-lg rounded-lg top-40 left-8 w-[240px]">
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

        <main className="flex-grow flex justify-center items-start p-8">
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center">
              {currentPage}
            </h1>
            <div className="w-full">{children}</div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MyPageLayout;
