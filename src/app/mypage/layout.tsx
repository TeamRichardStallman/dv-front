import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <nav className="bg-gray-100 p-6 shadow-lg rounded-lg fixed top-20 left-8 w-56 h-auto">
          <ul className="space-y-4">
            <li>
              <Link
                href="/mypage/edit"
                className="hover:text-blue-500 font-semibold"
              >
                내 정보 수정
              </Link>
            </li>
            <li>
              <Link
                href="/mypage/profile"
                className="hover:text-blue-500 font-semibold"
              >
                나의 취업 정보
              </Link>
            </li>
            <li>
              <Link
                href="/mypage/feedback"
                className="hover:text-blue-500 font-semibold"
              >
                면접 평가 확인
              </Link>
            </li>
            <li>
              <Link
                href="/mypage/coupon"
                className="hover:text-blue-500 font-semibold"
              >
                쿠폰함
              </Link>
            </li>
            <li>
              <Link
                href="/mypage/voucher"
                className="hover:text-blue-500 font-semibold"
              >
                이용권
              </Link>
            </li>
            <li>
              <Link
                href="/mypage/payment-history"
                className="hover:text-blue-500 font-semibold"
              >
                결제 내역
              </Link>
            </li>
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
