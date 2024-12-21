"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import SettingBtn from "@/components/settingbtn";
import PaymentModal from "@/components/payment-modal";
import useInterviewStore, { InterviewMode } from "@/stores/useInterviewStore";
import CustomModal from "@/components/modal/custom-modal";
import { useRouter } from "next/navigation";

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
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [PermissionModalMessage, setPermissionModalMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const permission = Notification.requestPermission();
    async function permissionGrant() {
      if ((await permission) !== "granted") {
        setPermissionModalMessage(
          "면접 서비스를 이용하시러면 브라우저 알림 권한을 허용해주세요. 방법은 가이드를 참고해주세요."
        );
        setIsPermissionModalVisible(true);
        return;
      }
    }
    permissionGrant();
  }, []);

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
      <CustomModal
        isVisible={isPermissionModalVisible}
        message={PermissionModalMessage}
        confirmButton="가이드 보러 가기"
        cancelButton="홈으로"
        onClose={() => {
          router.push("/");
        }}
        onConfirm={() => {
          router.push(
            "/guide#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%95%8C%EB%A6%BC-%EC%84%A4%EC%A0%95-%EB%B0%A9%EB%B2%95"
          );
        }}
      />
    </div>
  );
};

export default InterviewPage;
