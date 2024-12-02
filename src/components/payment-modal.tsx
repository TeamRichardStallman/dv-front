"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";

const apiUrl = `${setUrl}`;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedVoucher: "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성";
  setSelectedVoucher: React.Dispatch<
    React.SetStateAction<"모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성">
  >;
}

interface Coupon {
  couponId: number;
  couponName: string;
  interviewModeKorean: string;
  interviewAssetTypeKorean: string;
  chargeAmount: number;
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

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedVoucher,
  setSelectedVoucher,
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const voucherPrices: Record<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성",
    number
  > = {
    "모의 채팅": 5000,
    "모의 음성": 7000,
    "실전 채팅": 10000,
    "실전 음성": 12000,
  };

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios.get<{ data: { coupons: Coupon[] } }>(
        `${apiUrl}/coupon/user/simple`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setCoupons(
        response.data.data.coupons.filter(
          (coupon) =>
            `${coupon.interviewModeKorean} ${coupon.interviewAssetTypeKorean}` ===
            selectedVoucher
        )
      );
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  }, [selectedVoucher]);

  useEffect(() => {
    if (isOpen) {
      fetchCoupons();
      setSelectedCouponId(null);
      setSelectedQuantity(1);
    }
  }, [isOpen, selectedVoucher, fetchCoupons]);

  useEffect(() => {
    const selectedCoupon = coupons.find(
      (coupon) => coupon.couponId === selectedCouponId
    );
    if (selectedCoupon) {
      setSelectedQuantity(selectedCoupon.chargeAmount);
    }
  }, [selectedCouponId, coupons]);

  const calculatePrice = () => {
    const selectedCoupon = coupons.find(
      (coupon) => coupon.couponId === selectedCouponId
    );

    const discount = selectedCoupon
      ? selectedCoupon.chargeAmount * voucherPrices[selectedVoucher]
      : 0;

    const total = voucherPrices[selectedVoucher] * selectedQuantity - discount;

    return Math.max(0, total);
  };

  const handleConfirm = async () => {
    if (!selectedCouponId) {
      alert("쿠폰을 선택하세요.");
      return;
    }

    if (calculatePrice() > 0) {
      alert("추가 결제가 필요합니다. 매수를 조정하거나 쿠폰을 확인해주세요.");
      const selectedCoupon = coupons.find(
        (coupon) => coupon.couponId === selectedCouponId
      );
      if (selectedCoupon) {
        setSelectedQuantity(selectedCoupon.chargeAmount);
      }
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
          `${selectedVoucher} 이용권 ${response.data.data.chargedTicketTransactionInfo.ticketTransactionDetail.amount}장이 충전되었습니다.`
        );
        onSuccess();
      } else {
        alert("결제 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("Error using coupon:", error);
      alert("결제 실패");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] space-y-6">
        <h2 className="text-xl font-bold">이용권 결제</h2>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(voucherPrices).map((voucher) => (
            <button
              key={voucher}
              onClick={() =>
                setSelectedVoucher(voucher as keyof typeof voucherPrices)
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
          <label htmlFor="couponSelect" className="block text-lg font-semibold">
            쿠폰 선택
          </label>
          <select
            id="couponSelect"
            className="w-full p-2 border rounded-md"
            onChange={(e) => setSelectedCouponId(Number(e.target.value))}
            value={selectedCouponId || ""}
          >
            <option value="">쿠폰을 선택하세요</option>
            {coupons.map((coupon) => (
              <option key={coupon.couponId} value={coupon.couponId}>
                {coupon.couponName} ({coupon.chargeAmount}장 할인)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="quantitySelect"
            className="block text-lg font-semibold"
          >
            매수 선택
          </label>
          <input
            type="number"
            id="quantitySelect"
            className="w-full p-2 border rounded-md"
            min={
              coupons.find((coupon) => coupon.couponId === selectedCouponId)
                ?.chargeAmount || 1
            }
            max={99}
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(Number(e.target.value))}
          />
        </div>

        <p className="text-right text-xl font-bold">
          결제 금액: {calculatePrice()}원
        </p>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 font-semibold rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 font-semibold rounded-lg bg-primary text-white hover:bg-primary-dark"
            onClick={handleConfirm}
          >
            결제
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
