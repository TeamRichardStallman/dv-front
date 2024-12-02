"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";
import PaymentModal from "@/components/payment-modal";
import useInterviewStore, { InterviewMode } from "@/stores/useInterviewStore";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";

const apiUrl = `${setUrl}`;

interface TicketResponse {
  totalBalance: number;
  realChatBalance: number;
  realVoiceBalance: number;
  generalChatBalance: number;
  generalVoiceBalance: number;
}

const MethodStep = ({ onPrev, onNext }: StepProps) => {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") as InterviewMode;
  const { updateInterviewField } = useInterviewStore();

  const [interviewMode, setInterviewMode] = useState<InterviewMode>(
    urlType || "GENERAL"
  );
  const [selectedMethod, setSelectedMethod] = useState("CHAT");
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    "실전 채팅" | "실전 음성" | "모의 채팅" | "모의 음성"
  >("실전 채팅");

  useEffect(() => {
    if (urlType) {
      setInterviewMode(urlType);
      updateInterviewField("interviewMode", urlType);
    }
  }, [urlType, updateInterviewField]);

  const fetchTicketInfo = async (): Promise<TicketResponse | null> => {
    try {
      const response = await axios.get<{ data: TicketResponse }>(
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

  const handleNext = async () => {
    const ticketData = await fetchTicketInfo();

    if (!ticketData) {
      alert("티켓 정보를 불러오는 데 실패했습니다.");
      return;
    }

    if (interviewMode === "REAL") {
      if (selectedMethod === "CHAT" && ticketData.realChatBalance <= 0) {
        setSelectedVoucher("실전 채팅");
        setShowModal(true);
        return;
      }
      if (selectedMethod === "VOICE" && ticketData.realVoiceBalance <= 0) {
        setSelectedVoucher("실전 음성");
        setShowModal(true);
        return;
      }
    } else if (interviewMode === "GENERAL") {
      if (selectedMethod === "CHAT" && ticketData.generalChatBalance <= 0) {
        setSelectedVoucher("모의 채팅");
        setShowModal(true);
        return;
      }
      if (selectedMethod === "VOICE" && ticketData.generalVoiceBalance <= 0) {
        setSelectedVoucher("모의 음성");
        setShowModal(true);
        return;
      }
    }

    if (selectedMethod) {
      updateInterviewField("interviewMethod", selectedMethod);
      onNext();
    }
  };

  return (
    <>
      <div className="flex gap-8 justify-center mb-8 max-w-4xl mx-auto">
        <SettingBtn
          label="채팅"
          description="텍스트 기반의 채팅 면접을 진행합니다."
          selected={selectedMethod === "CHAT"}
          onClick={() => setSelectedMethod("CHAT")}
        />
        <SettingBtn
          label="음성"
          description="직접 말하며 음성 면접을 진행합니다."
          selected={selectedMethod === "VOICE"}
          onClick={() => setSelectedMethod("VOICE")}
        />
        <SettingBtn
          label="영상"
          description="COMING SOON!"
          selected={selectedMethod === "VIDEO"}
          onClick={() => setSelectedMethod("VIDEO")}
          disabled={true}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={handleNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />

      {showModal && (
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            const updatedTicketInfo = await fetchTicketInfo();
            if (
              updatedTicketInfo &&
              ((interviewMode === "REAL" &&
                ((selectedMethod === "CHAT" &&
                  updatedTicketInfo.realChatBalance > 0) ||
                  (selectedMethod === "VOICE" &&
                    updatedTicketInfo.realVoiceBalance > 0))) ||
                (interviewMode === "GENERAL" &&
                  ((selectedMethod === "CHAT" &&
                    updatedTicketInfo.generalChatBalance > 0) ||
                    (selectedMethod === "VOICE" &&
                      updatedTicketInfo.generalVoiceBalance > 0))))
            ) {
              setShowModal(false);
            }
          }}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
        />
      )}
    </>
  );
};

export default MethodStep;
