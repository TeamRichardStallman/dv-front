"use client";
import React, { useEffect, useState } from "react";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import NoContent from "@/components/no-content";

const apiUrl = `${setUrl}`;

const PaymentHistoryPage = () => {
  const [ticketTransactions, setTicketTransactions] = useState<
    GetTicketTransactionDetail[] | []
  >([]);

  useEffect(() => {
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
            : response.data.data.ticketTransactionDetails.map(
                (transaction) => ({
                  ...transaction,
                  generatedAt: new Date(transaction.generatedAt),
                })
              );
        setTicketTransactions(transformedTicketTransactions);
      } catch (error) {
        console.error("Error fetching Ticket Info: ", error);
        throw error;
      }
    };
    getTicketInfo();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div className="w-[900px] h-[500px] overflow-y-auto rounded-lg border border-gray-300 p-6 bg-white space-y-4">
        {ticketTransactions.filter(
          (e) => e.ticketTransactionTypeKorean === "충전"
        ).length === 0 ? (
          <NoContent text="결제 내역이" />
        ) : (
          ticketTransactions
            .filter((e) => e.ticketTransactionTypeKorean === "충전")
            .map((payment, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-300 shadow-md"
              >
                <p className="text-md font-semibold text-primary mb-2">
                  {payment.generatedAt.getFullYear()}.
                  {payment.generatedAt.getMonth()}.
                  {payment.generatedAt.getDate()}
                </p>
                <p className="text-xl font-bold">
                  {payment.interviewModeKorean}{" "}
                  {payment.interviewAssetTypeKorean} 이용권 {payment.amount}장
                  구입
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
