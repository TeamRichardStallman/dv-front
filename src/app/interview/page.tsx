"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import SettingBtn from "@/components/settingbtn";
import PaymentModal from "@/components/payment-modal";
import useInterviewStore, { InterviewMode } from "@/stores/useInterviewStore";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;

const InterviewPage = () => {
  const [mode, setMode] = useState<InterviewMode>();
  const { updateInterviewField } = useInterviewStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성"
  >("실전 채팅");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchTicketInfo = async (): Promise<TicketCountInfo | null> => {
    try {
      const response = await axios.get<{ data: TicketCountInfo }>(
        `${apiUrl}/ticket/user/count`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching ticket info:", error);
      return null;
    }
  };

  const handleNextClick = async () => {
    const data = await fetchTicketInfo();

    if (!data) {
      setModalMessage("티켓 정보를 불러오는 데 실패했습니다.");
      setIsModalVisible(true);
      return;
    }

    if (mode === "GENERAL") {
      if (data.generalChatBalance > 0 || data.generalVoiceBalance > 0) {
        updateInterviewField("interviewMode", mode);
        window.location.href = `/interview/setup?type=${mode}`;
      } else {
        setSelectedVoucher("모의 채팅");
        setShowModal(true);
      }
    } else if (mode === "REAL") {
      if (data.realChatBalance > 0 || data.realVoiceBalance > 0) {
        updateInterviewField("interviewMode", mode);
        window.location.href = `/interview/setup?type=${mode}`;
      } else {
        setSelectedVoucher("실전 채팅");
        setShowModal(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center text-[50px] font-bold mb-16">
        면접 모드 선택
      </div>

      <div className="flex gap-16">
        <SettingBtn
          label="모의면접"
          description="선택한 관심 직무를 기반으로 가상면접을 진행합니다."
          selected={mode === "GENERAL"}
          onClick={() => {
            setMode("GENERAL");
            setSelectedVoucher("모의 채팅");
          }}
        />
        <SettingBtn
          label="실전면접"
          description="선택한 직무와 자소서, 이력서 등을 기반으로 개인 맞춤화 가상면접을 진행합니다."
          selected={mode === "REAL"}
          onClick={() => {
            setMode("REAL");
            setSelectedVoucher("실전 채팅");
          }}
        />
      </div>

      <div className="flex gap-4 mt-8 font-semibold relative">
        <Link href="/">
          <button className="bg-secondary w-24 text-white py-2 px-6 rounded-md">
            홈으로
          </button>
        </Link>
        <button
          className="bg-secondary w-24 py-2 px-6 rounded-md text-white"
          onClick={handleNextClick}
        >
          다음
        </button>
      </div>

      {showModal && (
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            const updatedTicketInfo = await fetchTicketInfo();
            if (
              updatedTicketInfo &&
              ((mode === "GENERAL" &&
                (updatedTicketInfo.generalChatBalance > 0 ||
                  updatedTicketInfo.generalVoiceBalance > 0)) ||
                (mode === "REAL" &&
                  (updatedTicketInfo.realChatBalance > 0 ||
                    updatedTicketInfo.realVoiceBalance > 0)))
            ) {
              setShowModal(false);
            }
          }}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
        />
      )}
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="다시 시도"
        cancelButton="취소"
        onClose={() => {
          setIsModalVisible(false);
        }}
        onConfirm={() => {
          handleNextClick();
        }}
      />
    </div>
  );
};

export default InterviewPage;
