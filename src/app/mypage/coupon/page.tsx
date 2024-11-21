"use client";
import React, { useState } from "react";

const CouponPage = () => {
  const [activeTab, setActiveTab] = useState("owned");

  const coupons = [
    {
      id: 1,
      title: "모의 채팅 이용권 쿠폰",
      reason: "[11월 출첵 이벤트] 5일 연속 출석",
      expiry: "2024년 11월 30일 23시까지",
    },
    {
      id: 2,
      title: "모의 음성 이용권 쿠폰",
      reason: "[가을 감사 이벤트] 신규 가입 축하",
      expiry: "2024년 12월 15일 23시까지",
    },
    {
      id: 3,
      title: "실전 채팅 이용권 쿠폰",
      reason: "[추천인 이벤트] 친구 초대 성공",
      expiry: "2024년 12월 20일 23시까지",
    },
    {
      id: 4,
      title: "실전 음성 이용권 쿠폰",
      reason: "[연말 감사 이벤트] 감사 인사",
      expiry: "2024년 12월 31일 23시까지",
    },
    {
      id: 5,
      title: "모의 채팅 이용권 쿠폰",
      reason: "[겨울 특별 이벤트] 첫 구매 혜택",
      expiry: "2025년 01월 10일 23시까지",
    },
    {
      id: 6,
      title: "모의 음성 이용권 쿠폰",
      reason: "[신년 출석 이벤트] 3일 연속 출석",
      expiry: "2025년 01월 15일 23시까지",
    },
    {
      id: 7,
      title: "실전 채팅 이용권 쿠폰",
      reason: "[기존 회원 감사 이벤트] 꾸준한 이용 감사",
      expiry: "2025년 02월 01일 23시까지",
    },
    {
      id: 8,
      title: "실전 음성 이용권 쿠폰",
      reason: "[봄맞이 이벤트] 추천 친구 가입",
      expiry: "2025년 03월 01일 23시까지",
    },
  ];

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="flex space-x-4">
        {["owned", "used", "expired"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "owned"
              ? "보유쿠폰"
              : tab === "used"
              ? "사용완료"
              : "기간만료"}
          </button>
        ))}
      </div>

      <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="p-4 mb-4 rounded-lg border border-gray-300 shadow-md"
          >
            <p className="text-2xl font-bold">{coupon.title}</p>
            <p className="text-lg font-semibold text-gray-600">
              {coupon.reason}
            </p>
            <div className="mt-4">
              <p className="text-sm font-medium text-primary">
                {coupon.expiry}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponPage;
