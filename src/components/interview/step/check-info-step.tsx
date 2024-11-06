"use client";
import NavButtons from "./nav-button";
import { getMappedValue } from "@/app/stores/mappings";
import useInterviewStore from "@/app/stores/useInterviewStore";

const CheckInfoStep = ({ onPrev, onNext }: StepProps) => {
  const { interview, setInterview } = useInterviewStore();

  const handleNext = () => {
    onNext();
    setInterview({
      interviewType: null,
      interviewMode: null,
      interviewMethod: null,
      jobId: null,
      files: [],
    });
  };

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="font-semibold border-2 border-secondary w-[900px] h-[300px] p-6 rounded-lg text-center">
          <p className="mb-2">
            면접 모드:{" "}
            {getMappedValue("interviewMode", interview.interviewMode ?? "")}
          </p>
          <p className="mb-2">
            면접 유형:{" "}
            {getMappedValue("interviewType", interview.interviewType ?? "")}
          </p>
          <p className="mb-2">
            면접 방식:{" "}
            {getMappedValue("interviewMethod", interview.interviewMethod ?? "")}
          </p>
          <p className="mb-2">
            선택 직무: {getMappedValue("jobId", interview.jobId ?? "")}
          </p>
          <p className="mb-4">입력한 문서: 자기소개서</p>
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
        onNext={handleNext}
        prevButtonText="이전"
        nextButtonText="다음"
      />
    </>
  );
};

export default CheckInfoStep;
