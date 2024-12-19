"use client";
import React, { useEffect, useState } from "react";
import NavButtons from "./nav-button";
import useInterviewStore, { Interview } from "@/stores/useInterviewStore";
import { setUrl } from "@/utils/setUrl";
import { toast } from "react-toastify";
import axios from "axios";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { interviewInfoMap } from "../interview-feedback-detail";
import { getFileName } from "@/utils/format";
import Loading from "@/components/loading";
import PaymentModal from "@/components/payment-modal";
import useFileStore from "@/stores/useFileStore";

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
  const { interviewFile } = useFileStore();
  const [filePath, setFilePath] = useState("");

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

          if (interview.interviewMode === "GENERAL") {
            if (interview.interviewMethod === "CHAT") {
              setSelectedVoucher("모의 채팅");
              setCountTicket(ticketData.generalChatBalance);
            } else if (interview.interviewMethod === "VOICE") {
              setSelectedVoucher("모의 음성");
              setCountTicket(ticketData.generalVoiceBalance);
            }
            setPossible(countTicket >= 1);
          } else if (interview.interviewMode === "REAL") {
            if (interview.interviewMethod === "CHAT") {
              setSelectedVoucher("실전 채팅");
              setCountTicket(ticketData.realChatBalance);
            } else if (interview.interviewMethod === "VOICE") {
              setSelectedVoucher("실전 음성");
              setCountTicket(ticketData.realVoiceBalance);
            }
            setPossible(countTicket >= selectedQuestionCount / 5);
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
  }, [
    selectedQuestionCount,
    countTicket,
    interview.interviewMethod,
    interview.interviewMode,
  ]);

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
          interviewMethod:
            interview.interviewMethod === "CHAT" ? "CHAT" : "VOICE",
          interviewMode: interview.interviewMode,
          jobId: interview.jobId,
          questionCount: selectedQuestionCount,
          files: null,
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
        if (interview.interviewMode === "REAL") {
          const preSignedResponse = await axios.get<GetPreSignedUrlResponse>(
            `${apiUrl}/file/cover-letter/${
              response.data.data.interviewId
            }/cover-letter.${
              interviewFile.file?.name.split(".")[1]
            }/upload-url`,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.data && interviewFile.file) {
            const temp = preSignedResponse.data.data.preSignedUrl;
            setFilePath(preSignedResponse.data.data.objectKey);
            if (temp) {
              toast.info("S3에 파일 업로드 중...");
              fetch(temp, {
                method: "PUT",
                headers: { "Content-Type": interviewFile.file?.type },
                body: interviewFile.file,
              });

              await axios.put<InterviewAddFileResponse>(
                `${apiUrl}/interview`,
                {
                  interviewId: data.data.interviewId,
                  coverLetter: {
                    type: "COVER_LETTER",
                    filePath: preSignedResponse.data.data.objectKey,
                  },
                },
                {
                  withCredentials: true,
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
            } else {
              toast.warn("S3 업로드를 건너뜁니다. Presigned URL이 없습니다.");
              console.warn("Presigned URL이 없습니다.");
            }
            // }
          }
        }

        setQuestionRequest({
          interviewId: data.data.interviewId,
          interviewTitle: data.data.interviewTitle,
          interviewStatus: data.data.interviewStatus,
          interviewType: data.data.interviewType,
          interviewMethod:
            data.data.interviewMethod === "CHAT" ? "CHAT" : "VOICE",
          interviewMode: data.data.interviewMode,
          questionCount: data.data.questionCount,
          files:
            data.data.interviewMode === "GENERAL"
              ? undefined
              : [
                  {
                    type: "COVER_LETTER",
                    filePath: filePath,
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
