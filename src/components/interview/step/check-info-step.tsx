import React from "react";
import NavButtons from "./nav-button";

const CheckInfoStep = ({ onPrev, onNext, interviewData }: StepCheckProps) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="font-semibold border-2 border-secondary w-[900px] h-[300px] p-6 rounded-lg text-center">
          <p className="mb-2">면접 모드: {interviewData.interviewMode==="GENERAL"?"모의":"실전"}</p>
          <p className="mb-2">면접 유형: {interviewData.interviewType==="TECHNICAL"?"기술":"인성"}</p>
          <p className="mb-2">면접 방식: {interviewData.interviewMethod==="CHAT"?"채팅":interviewData.interviewMethod==="VOICE"?"음성":"영상"}</p>
          <p className="mb-2">선택 직무: {interviewData.jobId===1?"백엔드":interviewData.jobId===2?"프론트엔드":interviewData.jobId===3?"클라우드":"인공지능"}</p>
          {interviewData.interviewMode==="REAL"?
            <p className="mb-4">자기소개서: {interviewData.interviewMode}</p>:""}
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
