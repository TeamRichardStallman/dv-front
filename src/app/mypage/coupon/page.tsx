"use client";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import React, { useEffect, useState } from "react";
import NoContent from "@/components/no-content";

const apiUrl = `${setUrl}/coupon`;

const CouponPage = () => {
  const [activeTab, setActiveTab] = useState("owned");
  const [simpleCoupons, setSimpleCoupons] = useState<
    GetSimpleCouponProps[] | null
  >(null);
  const [usedCoupons, setUsedCoupons] = useState<GetUsedCouponProps[] | null>(
    null
  );
  const [expireCoupons, setExpiredCoupons] = useState<
    GetExpiredCouponProps[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "owned") {
          const response = await axios.get<GetSimpleCouponListResponse>(
            `${apiUrl}/user/simple`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const transformedCoupons = response.data.data.coupons.map(
            (coupon) => ({
              ...coupon,
              expireAt: new Date(coupon.expireAt),
            })
          );
          setSimpleCoupons(transformedCoupons);
        } else if (activeTab === "used") {
          const response = await axios.get<GetUsedCouponListResponse>(
            `${apiUrl}/user/used`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const transformedCoupons = response.data.data.coupons.map(
            (coupon) => ({
              ...coupon,
              usedAt: new Date(coupon.usedAt),
            })
          );
          setUsedCoupons(transformedCoupons);
        } else if (activeTab === "expired") {
          const response = await axios.get<GetExpiredCouponListResponse>(
            `${apiUrl}/user/expired`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const transformedCoupons = response.data.data.coupons.map(
            (coupon) => ({
              ...coupon,
              expireAt: new Date(coupon.expireAt),
            })
          );
          setExpiredCoupons(transformedCoupons);
        }
      } catch (error) {
        console.error("Error fetching coupon data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

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
        {activeTab === "owned" ? (
          simpleCoupons === null || simpleCoupons.length === 0 ? (
            <div className="p-4 mb-4 rounded-lg opacity-100">
              <NoContent text="보유 쿠폰이" />
            </div>
          ) : (
            simpleCoupons.map((coupon) => (
              <div
                key={coupon.couponId}
                className="p-4 mb-4 rounded-lg border border-gray-300 shadow-md opacity-100"
              >
                <p className="text-2xl font-bold">
                  {coupon.interviewModeKorean +
                    " " +
                    coupon.interviewAssetTypeKorean +
                    " 쿠폰 " +
                    coupon.chargeAmount +
                    "장"}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  {coupon.couponName}
                </p>
                <div className="mt-4">
                  <p className={`text-sm font-medium ${"text-primary"}`}>
                    사용 기한: {coupon.expireAt.getFullYear()}.
                    {coupon.expireAt.getMonth() + 1}.{coupon.expireAt.getDate()}
                  </p>
                </div>
              </div>
            ))
          )
        ) : activeTab === "used" ? (
          usedCoupons === null || usedCoupons.length === 0 ? (
            <div className="p-4 mb-4 rounded-lg opacity-100">
              <NoContent text="사용한 쿠폰이" />
            </div>
          ) : (
            usedCoupons.map((coupon) => (
              <div
                key={coupon.couponId}
                className={`p-4 mb-4 rounded-lg border border-gray-300 shadow-md ${"opacity-50"}`}
              >
                <p className="text-2xl font-bold">
                  {coupon.interviewModeKorean +
                    " " +
                    coupon.interviewAssetTypeKorean +
                    " 쿠폰 " +
                    coupon.chargeAmount +
                    "장"}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  {coupon.couponName}
                </p>
                <div className="mt-4">
                  <p className={`text-sm font-medium ${"text-primary"}`}>
                    사용 일자: {coupon.usedAt.getFullYear()}.
                    {coupon.usedAt.getMonth() + 1}.{coupon.usedAt.getDate()}
                  </p>
                </div>
              </div>
            ))
          )
        ) : expireCoupons === null || expireCoupons.length === 0 ? (
          <div className="p-4 mb-4 rounded-lg opacity-100">
            <NoContent text="만료된 쿠폰이" />
          </div>
        ) : (
          expireCoupons.map((coupon) => (
            <div
              key={coupon.couponId}
              className={`p-4 mb-4 rounded-lg border border-gray-300 shadow-md ${"opacity-100"}`}
            >
              <p className="text-2xl font-bold">
                {coupon.interviewModeKorean +
                  " " +
                  coupon.interviewAssetTypeKorean +
                  " 쿠폰 " +
                  coupon.chargeAmount +
                  "장"}
              </p>
              <p className="text-lg font-semibold text-gray-600">
                {coupon.couponName}
              </p>
              <div className="mt-4">
                <p className={`text-sm font-medium ${"text-red-500"}`}>
                  만료 일자: {coupon.expireAt.getFullYear()}.
                  {coupon.expireAt.getMonth() + 1}. {coupon.expireAt.getDate()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponPage;
