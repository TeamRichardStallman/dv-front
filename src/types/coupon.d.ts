interface GetSimpleCouponListResponse {
  data: GetSimpleCouponList;
}

interface GetUsedCouponListResponse {
  data: GetUsedCouponList;
}

interface GetExpiredCouponListResponse {
  data: GetExpiredCouponList;
}

interface GetSimpleCouponList {
  coupons: GetSimpleCouponProps[];
}

interface GetUsedCouponList {
  coupons: GetUsedCouponProps[];
}

interface GetExpiredCouponList {
  coupons: GetExpiredCouponProps[];
}

interface GetSimpleCouponProps {
  couponId: number;
  chargeAmount: number;
  couponName: string;
  interviewModeKorean: string;
  interviewAssetTypeKorean: string;
  expireAt: Date;
}

interface GetUsedCouponProps {
  couponId: number;
  chargeAmount: number;
  couponName: string;
  interviewModeKorean: string;
  interviewAssetTypeKorean: string;
  usedAt: Date;
}

interface GetExpiredCouponProps {
  couponId: number;
  chargeAmount: number;
  couponName: string;
  interviewModeKorean: string;
  interviewAssetTypeKorean: string;
  expireAt: Date;
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
