"use client";
import React from "react";
import NavButtons from "./nav-button";
import useInterviewStore from "@/stores/useInterviewStore";

const CheckInfoStep = ({ onPrev, onNext }: StepProps) => {
  const { interview } = useInterviewStore();

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

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="font-semibold border-2 border-secondary w-[900px] h-[300px] p-6 rounded-lg text-center">
          <p className="mb-2">면접 모드: {interview.interviewMode}</p>
          <p className="mb-2">면접 유형: {interview.interviewType}</p>
          <p className="mb-2">면접 방식: {interview.interviewMethod}</p>
          <p className="mb-2">
            선택 직무: {interview.jobId && getJobLabelById(interview.jobId)}
          </p>
          {interview.files[0] && (
            <p className="mb-4">자기소개서: {interview.files[0]}</p>
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
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default CheckInfoStep;
