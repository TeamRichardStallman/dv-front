"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import PaymentModal from "@/components/payment-modal";
import NoContent from "@/components/no-content";

const apiUrl = `${setUrl}`;

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
      setOwnedTickets([
        { label: "모의 채팅", count: ticketCounts.generalChatBalance },
        { label: "모의 음성", count: ticketCounts.generalVoiceBalance },
        { label: "실전 채팅", count: ticketCounts.realChatBalance },
        { label: "실전 음성", count: ticketCounts.realVoiceBalance },
      ]);
      setTicketTransactions(transformedTicketTransactions);
    } catch (error) {
      console.error("Error fetching Ticket Info: ", error);
    }
  };

  useEffect(() => {
    getTicketInfo();
  }, [activeTab]);

  const handleModalSuccess = () => {
    setShowModal(false);
    getTicketInfo();
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
        onClick={() => setShowModal(true)}
      >
        이용권 결제
      </button>
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        selectedVoucher={selectedVoucher}
        setSelectedVoucher={setSelectedVoucher}
      />
    </div>
  );
};

export default VoucherPage;
