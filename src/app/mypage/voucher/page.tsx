"use client";
import React, { useState } from "react";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState("owned");

  const ownedVouchers = [
    { label: "모의 채팅", count: 4 },
    { label: "모의 음성", count: 2 },
    { label: "실전 채팅", count: 3 },
    { label: "실전 음성", count: 1 },
  ];

  const usedVouchers = [
    {
      label: "모의 채팅",
      usedCount: 2,
      usedDate: "2024년 11월 18일",
    },
    {
      label: "실전 채팅",
      usedCount: 3,
      usedDate: "2024년 11월 15일",
    },
    {
      label: "실전 음성",
      usedCount: 1,
      usedDate: "2024년 11월 14일",
    },
  ];

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="flex space-x-4">
        {["owned", "used"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "owned" ? "보유이용권" : "사용완료"}
          </button>
        ))}
      </div>

      {activeTab === "owned" && (
        <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white grid grid-cols-2 gap-6">
          {ownedVouchers.map((voucher) => (
            <div
              key={voucher.label}
              className="p-4 rounded-lg border border-gray-300 shadow-md text-center"
            >
              <p className="mt-10 text-4xl font-extrabold">{voucher.label}</p>
              <p className="text-3xl font-semibold text-primary mt-6">
                {voucher.count}개
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "used" && (
        <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white space-y-4">
          {usedVouchers.map((voucher) => (
            <div
              key={voucher.label}
              className="p-4 rounded-lg border border-gray-300 shadow-md text-left"
            >
              <p className="text-2xl font-semibold">
                {voucher.label} 이용권 {voucher.usedCount}매
              </p>
              <p className="mt-4 text-md font-medium text-red-500">
                {voucher.usedDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherPage;
