"use client";
import React, { useState } from "react";

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState("owned");
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성"
  >("모의 채팅");
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

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

  const voucherPrices: Record<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성",
    number
  > = {
    "모의 채팅": 5000,
    "모의 음성": 7000,
    "실전 채팅": 10000,
    "실전 음성": 12000,
  };

  const coupons = [
    { id: 1, label: "11월 출첵 쿠폰", discount: "모의 채팅" },
    { id: 2, label: "가을 감사 쿠폰", discount: "모의 음성" },
    { id: 3, label: "추천인 이벤트 쿠폰", discount: "실전 채팅" },
  ];

  const handlePurchaseClick = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVoucher("모의 채팅");
    setSelectedCoupon(null);
    setSelectedQuantity(1);
  };

  const handleConfirmPurchase = () => {
    alert(
      `결제가 완료되었습니다. ${selectedVoucher} 이용권 ${selectedQuantity}매가 충전되었습니다. ${
        selectedCoupon ? "(쿠폰 사용)" : ""
      }`
    );
    handleCloseModal();
  };

  const calculatePrice = () =>
    selectedVoucher && !selectedCoupon
      ? voucherPrices[selectedVoucher] * selectedQuantity
      : 0;

  const handleVoucherClick = (
    voucher: "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성"
  ) => {
    setSelectedVoucher(voucher);
    setSelectedCoupon(null);
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
          <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] space-y-6">
            <h2 className="text-xl font-bold">이용권 결제</h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(voucherPrices).map((voucher) => (
                <button
                  key={voucher}
                  onClick={() =>
                    handleVoucherClick(voucher as keyof typeof voucherPrices)
                  }
                  className={`py-3 px-4 rounded-lg font-semibold ${
                    selectedVoucher === voucher
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {voucher}
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="couponSelect"
                className="block text-lg font-semibold mb-2"
              >
                쿠폰 선택
              </label>
              <select
                id="couponSelect"
                className="w-full p-2 border rounded-md"
                onChange={(e) => setSelectedCoupon(e.target.value || null)}
                value={selectedCoupon || ""}
              >
                <option value="">쿠폰을 선택하세요</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.discount}>
                    {coupon.label} ({coupon.discount})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label
                  htmlFor="quantitySelect"
                  className="block text-lg font-semibold mb-2"
                >
                  매수 선택
                </label>
                <input
                  type="number"
                  id="quantitySelect"
                  min="1"
                  max="99"
                  value={selectedQuantity}
                  onChange={(e) =>
                    setSelectedQuantity(
                      Math.min(99, Math.max(1, Number(e.target.value)))
                    )
                  }
                  className="w-24 p-2 border rounded-md text-center"
                />
              </div>
              <p className="text-right text-xl font-bold">
                결제 금액:{" "}
                <span className="text-primary">{calculatePrice()}원</span>
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 font-semibold rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                취소
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-lg ${
                  selectedVoucher
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
                onClick={selectedVoucher ? handleConfirmPurchase : undefined}
                disabled={!selectedVoucher}
              >
                결제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPage;
