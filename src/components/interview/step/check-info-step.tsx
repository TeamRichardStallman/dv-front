"use client";
import React, { useEffect, useState } from "react";
import NavButtons from "./nav-button";
import useInterviewStore, { Interview } from "@/stores/useInterviewStore";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { interviewInfoMap } from "../interview-feedback-detail";
import { getFileName } from "@/utils/format";
import Loading from "@/components/loading";
import PaymentModal from "@/components/payment-modal";

const apiUrl = `${setUrl}`;
interface StepSubmitProps extends StepProps {
  onSubmit: (interviewId: number) => void;
}

const CheckInfoStep = ({ onPrev, onNext, onSubmit }: StepSubmitProps) => {
  const { interview } = useInterviewStore();
  const { setQuestionRequest } = useQuestionRequest();
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(
    interview.interviewMode === "GENERAL" ? 3 : 5
  );
  const [countTicket, setCountTicket] = useState(100);
  const [loading, setLoading] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<
    "모의 채팅" | "모의 음성" | "실전 채팅" | "실전 음성"
  >("실전 채팅");
  const [showModal, setShowModal] = useState(false);
  const [possible, setPossible] = useState(false);
  const [, setIsQuestionCountSelected] = useState(false);

  useEffect(() => {
    let hasFetched = false;

    const getUserTicketInfo = async () => {
      if (!hasFetched) {
        hasFetched = true;
        setLoading(true);
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
          const ticketData = response.data.data;

          if (selectedQuestionCount > 0) {
            if (interview.interviewMode === "GENERAL") {
              setSelectedVoucher("모의 채팅");
              setCountTicket(ticketData.generalChatBalance);
              setPossible(countTicket >= 3);
            } else if (interview.interviewMode === "REAL") {
              setSelectedVoucher("실전 채팅");
              setCountTicket(ticketData.realChatBalance);
              setPossible(countTicket >= selectedQuestionCount / 5);
            }
          } else {
            setPossible(false);
          }

          return ticketData;
        } catch (error) {
          console.error("Error fetching ticket info:", error);
          return null;
        } finally {
          setLoading(false);
        }
      }
    };
    getUserTicketInfo();
  }, [selectedQuestionCount, countTicket]);

  const jobs = [
    { label: "프론트엔드", imageSrc: "/frontend.png", id: 2 },
    { label: "백엔드", imageSrc: "/backend.png", id: 1 },
    { label: "클라우드", imageSrc: "/cloud.png", id: 3 },
    { label: "인공지능", imageSrc: "/ai.png", id: 4 },
  ];

  const getJobLabelById = (jobId: number) => {
    const job = jobs.find((job) => job.id === jobId);
    return job ? job.label : "직업을 찾을 수 없습니다";
  };

  const getInterviewTitle = (interview: Interview) => {
    const now = new Date();
    const formattedDate = now.toISOString().substring(0, 10); // YYYY-MM-DD 형식
    return `${formattedDate}_${interview.interviewType}_${interview.interviewMethod}_${interview.interviewMode}_면접`;
  };

  const handleClick = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/interview`,
        {
          interviewTitle: getInterviewTitle(interview),
          interviewType: interview.interviewType,
          interviewMethod: interview.interviewMethod,
          interviewMode: interview.interviewMode,
          jobId: interview.jobId,
          questionCount: selectedQuestionCount,
          files:
            interview.interviewMode === "GENERAL"
              ? null
              : [
                  {
                    type: "COVER_LETTER",
                    filePath: interview.files[0],
                  },
                ],
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.data) {
        const data = response.data;
        setQuestionRequest({
          interviewId: data.data.interviewId,
          interviewTitle: data.data.interviewTitle,
          interviewStatus: data.data.interviewStatus,
          interviewType: data.data.interviewType,
          interviewMethod: data.data.interviewMethod,
          interviewMode: data.data.interviewMode,
          questionCount: data.data.questionCount,
          files:
            data.data.interviewMode === "GENERAL"
              ? undefined
              : [
                  {
                    type: "COVER_LETTER",
                    filePath: data.data.files[0].s3FileUrl,
                  },
                ],
          jobId: data.data.job.jobId,
        });
        if (
          confirm(
            "이용권 " +
              (interview.interviewMode === "GENERAL"
                ? selectedQuestionCount / 3
                : selectedQuestionCount / 5) +
              "장 사용 예정입니다. \n면접을 시작하시겠습니까?"
          )
        ) {
          onNext();
          onSubmit(data.data.interviewId);
        }
      }
    } catch (error) {
      console.error("stepup data transfer failed:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        {loading ? (
          <div className="font-semibold border-2 border-secondary w-[900px] h-[360px] p-6 rounded-lg text-center">
            <Loading title="정보 확인 중" description="잠시만 기다려주세요." />
          </div>
        ) : (
          <div className="font-semibold border-2 border-secondary w-[900px] p-6 rounded-lg text-center inline-block">
            <p className="mb-2">
              면접 모드:{" "}
              {interview.interviewMode &&
                interviewInfoMap[interview.interviewMode].label}
            </p>
            <p className="mb-2">
              면접 유형:{" "}
              {interview.interviewType &&
                interviewInfoMap[interview.interviewType].label}
            </p>
            <p className="mb-2">
              면접 방식:{" "}
              {interview.interviewMethod &&
                interviewInfoMap[interview.interviewMethod].label}
            </p>
            <p className="mb-2">
              선택 직무: {interview.jobId && getJobLabelById(interview.jobId)}
            </p>
            {interview.interviewMode === "GENERAL" ? (
              <p className="mb-2">질문 개수: {selectedQuestionCount}개</p>
            ) : (
              <div>
                질문 개수:{" "}
                <select
                  id="questionCountSelect"
                  className="p-2 border rounded-md mb-2"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setIsQuestionCountSelected(true);
                    }
                    setSelectedQuestionCount(Number(e.target.value));
                  }}
                  value={selectedQuestionCount || ""}
                >
                  <option value="">선택</option>
                  <option value="5">5개</option>
                  <option value="10">10개</option>
                  <option value="15">15개</option>
                </select>
              </div>
            )}

            {interview.interviewMode === "REAL"
              ? interview.files[0] && (
                  <p className="mb-4">
                    자기소개서: {getFileName(interview.files[0])}
                  </p>
                )
              : null}
            {possible ? (
              selectedQuestionCount !== 0 ? (
                <div>
                  <p className="font-bold text-lg mt-10">
                    위 정보가 맞는지 확인해주세요.
                  </p>
                  <p className="text-gray-600">
                    질문이 생성된 이후에는 이용권 환불이 불가합니다.
                  </p>
                  <p className="text-gray-600 mt-4">
                    보유 이용권: {countTicket}장 | 필요 이용권:{" "}
                    {interview.interviewMode === "GENERAL"
                      ? selectedQuestionCount / 3
                      : selectedQuestionCount / 5}
                    장
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-lg mt-10">
                    질문 개수를 선택해주세요.
                  </p>
                </div>
              )
            ) : selectedQuestionCount !== 0 ? (
              <div>
                <p className="font-bold text-lg mt-10">
                  보유 이용권이 부족합니다. 결제 후 이용해주세요.
                </p>
                <p className="text-gray-600 mt-4">
                  보유 이용권: {countTicket}장 | 필요 이용권:
                  {interview.interviewMode === "GENERAL"
                    ? selectedQuestionCount / 3
                    : selectedQuestionCount / 5}
                  장
                </p>
                <button
                  className="mt-4 px-6 py-3 rounded-lg bg-primary text-white font-bold shadow-md hover:bg-primary-dark"
                  onClick={() => setShowModal(true)}
                >
                  이용권 결제
                </button>
              </div>
            ) : (
              <div>
                <p className="font-bold text-lg mt-10">
                  질문 개수를 선택해주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {possible ? (
        <NavButtons
          onPrev={onPrev}
          onNext={handleClick}
          prevButtonText="이전"
          nextButtonText="면접 시작"
        />
      ) : (
        <NavButtons
          onPrev={onPrev}
          onNext={handleClick}
          prevButtonText="이전"
          nextButtonText="면접 시작"
          disabled={true}
        />
      )}
      {showModal && (
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            setShowModal(false);
            setCountTicket(-1);
          }}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
        />
      )}
    </>
  );
};

export default CheckInfoStep;
