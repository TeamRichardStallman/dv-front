"use client";
import React from "react";
import NavButtons from "./nav-button";
import useInterviewStore, { Interview } from "@/stores/useInterviewStore";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { interviewInfoMap } from "../interview-feedback-detail";
import { getFileName } from "@/utils/format";

interface Job {
  jobId: number;
  jobName: string;
  jobNameKorean: string;
  jobDescription: string;
}

interface File {
  fileId: number;
  type: string;
  fileName: string;
  s3FileUrl: string;
}

interface InterviewData {
  interviewId: number;
  interviewTitle: string;
  interviewStatus: string;
  interviewType: string;
  interviewMethod: string;
  interviewMode: string;
  job: Job;
  files: File[];
}

interface ApiResponse {
  code: number;
  message: string;
  data: InterviewData;
}

const apiUrl = `${setUrl}`;
interface StepSubmitProps extends StepProps {
  onSubmit: (interviewId: number) => void;
}

const CheckInfoStep = ({ onPrev, onNext, onSubmit }: StepSubmitProps) => {
  const { interview } = useInterviewStore();
  const { setQuestionRequest } = useQuestionRequest();

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
          files: [
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
          files: [
            {
              type: "COVER_LETTER",
              filePath: data.data.files[0].s3FileUrl,
            },
          ],
          jobId: data.data.job.jobId,
        });
        onNext();
        onSubmit(data.data.interviewId);
      }
    } catch (error) {
      console.error("stepup data transfer failed:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="font-semibold border-2 border-secondary w-[900px] h-[300px] p-6 rounded-lg text-center">
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
          {interview.files[0] && (
            <p className="mb-4">
              자기소개서: {getFileName(interview.files[0])}
            </p>
          )}
          <p className="font-bold text-lg mt-10">
            위 정보가 맞는지 확인해주세요.
          </p>
          <p className="text-gray-600">
            질문이 생성된 이후에는 이용권 환불이 불가합니다.
          </p>
        </div>
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={handleClick}
        prevButtonText="이전"
        nextButtonText="면접 시작"
      />
    </>
  );
};

export default CheckInfoStep;
