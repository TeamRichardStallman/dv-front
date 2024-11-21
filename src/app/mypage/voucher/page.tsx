"use client";
import React, { useState } from "react";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState("owned");
  const [showModal, setShowModal] = useState(false);

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

  const handlePurchaseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
        <div className="relative w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white grid grid-cols-2 gap-6">
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

      <button
        className="mt-4 px-6 py-3 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary-dark"
        onClick={handlePurchaseClick}
      >
        이용권 결제
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">이용권 결제</h2>
            <p className="text-gray-600 font-semibold mb-6">
              결제를 진행하시겠습니까?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 font-semibold rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                취소
              </button>
              <button
                className="px-4 py-2 font-semibold rounded-lg bg-primary text-white hover:bg-primary-dark"
                onClick={() => {
                  alert("결제가 완료되었습니다.");
                  handleCloseModal();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPage;
