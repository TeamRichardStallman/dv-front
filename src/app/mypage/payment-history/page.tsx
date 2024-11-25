"use client";
import React from "react";

const PaymentHistoryPage = () => {
  const paymentHistory = [
    {
      date: "2024년 11월 18일",
      details: "실전 음성 이용권 3매 구입",
    },
    {
      date: "2024년 11월 15일",
      details: "모의 채팅 이용권 2매 구입",
    },
    {
      date: "2024년 11월 10일",
      details: "실전 채팅 이용권 5매 구입",
    },
    {
      date: "2024년 10월 25일",
      details: "모의 음성 이용권 4매 구입",
    },
    {
      date: "2024년 10월 20일",
      details: "실전 음성 이용권 1매 구입",
    },
    {
      date: "2024년 10월 15일",
      details: "모의 채팅 이용권 6매 구입",
    },
    {
      date: "2024년 10월 10일",
      details: "실전 채팅 이용권 3매 구입",
    },
    {
      date: "2024년 09월 30일",
      details: "모의 음성 이용권 2매 구입",
    },
    {
      date: "2024년 09월 20일",
      details: "실전 채팅 이용권 4매 구입",
    },
    {
      date: "2024년 09월 10일",
      details: "모의 채팅 이용권 7매 구입",
    },
    {
      date: "2024년 08월 25일",
      details: "실전 음성 이용권 2매 구입",
    },
    {
      date: "2024년 08월 15일",
      details: "모의 음성 이용권 3매 구입",
    },
  ];

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white space-y-4">
        {paymentHistory.map((payment, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-300 shadow-md"
          >
            <p className="text-md font-semibold text-primary mb-2">
              {payment.date}
            </p>
            <p className="text-xl font-bold">{payment.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
