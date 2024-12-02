"use client";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import React, { useEffect, useState } from "react";
import {
  GetSimpleCouponListResponse,
  GetSimpleCouponProps,
} from "../coupon/page";
import NoContent from "@/components/no-content";

const apiUrl = `${setUrl}`;

export interface GetTicketResponse {
  data: GetTicketUserInfo;
}

interface GetTicketUserInfo {
  userCountInfo: GetTicketUserCountInfo;
  ticketTransactionDetails: GetTicketTransactionDetail[];
}

interface GetTicketUserCountInfo {
  totalBalance: number;
  realChatBalance: number;
  realVoiceBalance: number;
  generalChatBalance: number;
  generalVoiceBalance: number;
}

export interface GetTicketTransactionDetail {
  ticketTransactionId: number;
  amount: number;
  ticketTransactionType: string;
  ticketTransactionTypeKorean: string;
  ticketTransactionMethod: string;
  ticketTransactionMethodKorean: string;
  interviewMode: string;
  interviewModeKorean: string;
  interviewAssetType: string;
  interviewAssetTypeKorean: string;
  description: string;
  generatedAt: Date;
}

interface CouponUseResponse {
  code: number;
  message: string;
  data: {
    usedCouponInfo: {
      couponId: number;
      chargeAmount: number;
    };
    chargedTicketTransactionInfo: {
      ticketTransactionDetail: {
        amount: number;
        description: string;
      };
    };
  };
}

interface OwnedTicket {
  label: string;
  count: number | null | undefined;
}

const VoucherPage = () => {
  const [activeTab, setActiveTab] = useState("owned");
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성"
  >("모의 채팅");
  const [ownedTickets, setOwnedTickets] = useState<OwnedTicket[] | null>(null);
  const [ticketTransactions, setTicketTransactions] = useState<
    GetTicketTransactionDetail[] | []
  >([]);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [selectedCouponId, setSelectedCouponId] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [coupons, setCoupons] = useState<GetSimpleCouponProps[] | []>([]);

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.interviewModeKorean + " " + coupon.interviewAssetTypeKorean ===
      selectedVoucher
  );

  const getTicketInfo = async () => {
    try {
      const response = await axios.get<GetTicketResponse>(
        `${apiUrl}/ticket/user`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const transformedTicketTransactions =
        response.data.data.ticketTransactionDetails.length === 0
          ? []
          : response.data.data.ticketTransactionDetails.map((transaction) => ({
              ...transaction,
              generatedAt: new Date(transaction.generatedAt),
            }));
      const ticketCounts = response.data.data.userCountInfo;
      const ownedTicketResponse = {
        generalChatBalance: ticketCounts.generalChatBalance,
        generalVoiceBalance: ticketCounts.generalVoiceBalance,
        realChatBalance: ticketCounts.realChatBalance,
        realVoiceBalance: ticketCounts.realVoiceBalance,
      };
      setOwnedTickets([
        { label: "모의 채팅", count: ownedTicketResponse.generalChatBalance },
        {
          label: "모의 음성",
          count: ownedTicketResponse.generalVoiceBalance,
        },
        { label: "실전 채팅", count: ownedTicketResponse.realChatBalance },
        { label: "실전 음성", count: ownedTicketResponse.realVoiceBalance },
      ]);
      setTicketTransactions(transformedTicketTransactions);
    } catch (error) {
      console.error("Error fetching Ticket Info: ", error);
    }
  };

  useEffect(() => {
    getTicketInfo();
  }, [activeTab, showModal]);

  const getPaymentCouponList = async () => {
    try {
      const response = await axios.get<GetSimpleCouponListResponse>(
        `${apiUrl}/coupon/user/simple`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transformedCoupons = response.data.data.coupons.map((coupon) => ({
        ...coupon,
        expireAt: new Date(coupon.expireAt),
      }));
      setCoupons(transformedCoupons);
    } catch (error) {
      console.error("Error fetching Payment Coupon List: ", error);
    }
  };

  useEffect(() => {
    getPaymentCouponList();
  }, [activeTab, showModal]);

  const handlePurchaseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVoucher("모의 채팅");
    setSelectedCoupon(null);
    setSelectedQuantity(1);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedCouponId) {
      alert("쿠폰을 선택하세요.");
      return;
    }

    try {
      const response = await axios.post<CouponUseResponse>(
        `${apiUrl}/coupon/use`,
        { couponId: selectedCouponId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 200) {
        alert(
          `결제가 완료되었습니다. ${selectedVoucher} 이용권 ${response.data.data.chargedTicketTransactionInfo.ticketTransactionDetail.amount}장이 충전되었습니다.`
        );
        setShowModal(false);
        await getTicketInfo();
      } else {
        alert("결제 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("Error using coupon:", error);
      alert("쿠폰 사용에 실패했습니다.");
    }
  };

  const calculatePrice = () => {
    const chosenCoupon = selectedCoupon
      ? coupons.find(
          (coupon) =>
            coupon.interviewModeKorean +
              " " +
              coupon.interviewAssetTypeKorean ===
            selectedCoupon
        ) || {
          interviewAssetTypeKorean: "",
          interviewModeKorean: "",
          chargeAmount: 0,
        }
      : {
          interviewAssetTypeKorean: "",
          interviewModeKorean: "",
          chargeAmount: 0,
        };
    const chosenType =
      chosenCoupon?.interviewModeKorean === "실전"
        ? chosenCoupon.interviewAssetTypeKorean === "채팅"
          ? "실전 채팅"
          : "실전 음성"
        : chosenCoupon?.interviewAssetTypeKorean === "채팅"
        ? "모의 채팅"
        : "모의 음성";
    const couponType: "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성" =
      chosenType;
    if (selectedVoucher && !selectedCoupon) {
      return voucherPrices[selectedVoucher] * selectedQuantity;
    } else {
      return (
        voucherPrices[selectedVoucher] * selectedQuantity -
        voucherPrices[couponType] * chosenCoupon?.chargeAmount
      );
    }
  };

  const voucherPrices: Record<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성",
    number
  > = {
    "모의 채팅": 5000,
    "모의 음성": 7000,
    "실전 채팅": 10000,
    "실전 음성": 12000,
  };

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
          {ownedTickets === null || ownedTickets.length === 0 ? (
            <div>에러</div>
          ) : (
            ownedTickets.map((voucher) => (
              <div
                key={voucher.label}
                className="p-4 rounded-lg border border-gray-300 shadow-md text-center"
              >
                <p className="mt-10 text-4xl font-extrabold">{voucher.label}</p>
                <p className="text-3xl font-semibold text-primary mt-6">
                  {voucher.count}장
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "used" && (
        <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white space-y-4">
          {ticketTransactions === null ||
          ticketTransactions.filter(
            (ticket) => ticket.ticketTransactionType === "USE"
          ).length === 0 ? (
            <div className="p-4 mb-4 rounded-lg opacity-100">
              <NoContent text="이용권 사용 내역이" />
            </div>
          ) : (
            ticketTransactions
              .filter((ticket) => ticket.ticketTransactionType === "USE")
              .map((voucher) => (
                <div
                  key={voucher.ticketTransactionId}
                  className="p-4 rounded-lg border border-gray-300 shadow-md text-left"
                >
                  <p className="text-2xl font-semibold">
                    {voucher.interviewModeKorean}{" "}
                    {voucher.interviewAssetTypeKorean} 이용권 {voucher.amount}장
                  </p>
                  <p className="mt-4 text-md font-medium text-red-500">
                    사용 일자: {voucher.generatedAt.getFullYear()}.
                    {voucher.generatedAt.getMonth() + 1}.
                    {voucher.generatedAt.getDate()}
                  </p>
                </div>
              ))
          )}
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
                onChange={(e) => {
                  const selected = e.target.value || null;
                  const selectedIndex = e.target.selectedIndex;
                  const selectedOption = e.target.options[selectedIndex];
                  const selectedKey = selectedOption.getAttribute("data-key");
                  setSelectedCoupon(selected);
                  if (selectedKey) {
                    setSelectedCouponId(Number(selectedKey));
                  } else {
                    setSelectedCouponId(0);
                  }

                  const maxQuantity =
                    coupons.find(
                      (coupon) =>
                        coupon.interviewModeKorean +
                          " " +
                          coupon.interviewAssetTypeKorean ===
                        selected
                    )?.chargeAmount ?? 1;
                  setSelectedQuantity(maxQuantity);
                }}
                value={selectedCoupon || ""}
              >
                <option value="">쿠폰을 선택하세요</option>
                {filteredCoupons === null || filteredCoupons.length === 0 ? (
                  <option value="">사용 가능한 쿠폰이 없습니다.</option>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <option
                      key={coupon.couponId}
                      value={
                        coupon.interviewModeKorean +
                        " " +
                        coupon.interviewAssetTypeKorean
                      }
                      data-key={coupon.couponId}
                    >
                      {coupon.couponName} (
                      {coupon.interviewModeKorean +
                        " " +
                        coupon.interviewAssetTypeKorean +
                        " " +
                        coupon.chargeAmount +
                        "장"}
                      )
                    </option>
                  ))
                )}
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
                  min={
                    selectedCoupon
                      ? coupons.find(
                          (coupon) =>
                            coupon.interviewModeKorean +
                              " " +
                              coupon.interviewAssetTypeKorean ===
                            selectedCoupon
                        )?.chargeAmount || 1
                      : 1
                  }
                  max={
                    selectedCoupon
                      ? coupons.find(
                          (coupon) =>
                            coupon.interviewModeKorean +
                              " " +
                              coupon.interviewAssetTypeKorean ===
                            selectedCoupon
                        )?.chargeAmount || 99
                      : 99
                  }
                  value={selectedQuantity}
                  onChange={(e) => {
                    const maxQuantity = selectedCoupon
                      ? coupons.find(
                          (coupon) =>
                            coupon.interviewModeKorean +
                              " " +
                              coupon.interviewAssetTypeKorean ===
                            selectedCoupon
                        )?.chargeAmount || 99
                      : 99;

                    const minQuantity = selectedCoupon
                      ? coupons.find(
                          (coupon) =>
                            coupon.interviewModeKorean +
                              " " +
                              coupon.interviewAssetTypeKorean ===
                            selectedCoupon
                        )?.chargeAmount || 1
                      : 1;

                    setSelectedQuantity(
                      Math.min(
                        maxQuantity,
                        Math.max(minQuantity, Number(e.target.value))
                      )
                    );
                  }}
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
                onClick={() =>
                  selectedVoucher ? handleConfirmPurchase() : undefined
                }
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
