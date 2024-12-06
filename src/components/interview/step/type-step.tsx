"use client";
import { useState, useEffect } from "react";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";
import useInterviewStore, { InterviewType } from "@/stores/useInterviewStore";
import { useSearchParams } from "next/navigation";

const TypeStep = ({ onPrev, onNext }: StepProps) => {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") || "GENERAL";
  const [selectedType, setSelectedType] = useState<InterviewType>(() =>
    urlType === "GENERAL" ? "TECHNICAL" : undefined
  );
  const [interviewMode, setInterviewMode] = useState<string>(urlType);
  const { updateInterviewField } = useInterviewStore();

  useEffect(() => {
    console.log("urlType:", urlType);
    if (urlType === "REAL" || urlType === "GENERAL") {
      setInterviewMode(urlType);
      updateInterviewField("interviewMode", urlType);
    } else {
      console.error("Invalid or missing urlType:", urlType);
    }
  }, [urlType, updateInterviewField]);

  const handleClick = () => {
    if (selectedType) {
      updateInterviewField("interviewType", selectedType);
    }
  };

  return (
    <>
      <div className="flex gap-16 justify-center">
        <SettingBtn
          label="기술면접"
          description="관심 직무를 기반으로 기술적 지식, 문제 해결 능력, 실무 적용 역량을 평가하는 면접"
          selected={selectedType === "TECHNICAL"}
          onClick={() => setSelectedType("TECHNICAL")}
        />
        <SettingBtn
          label="인성면접"
          description="지원자의 성격, 가치관, 대인관계 능력 등을 질문을 통해 직접 확인하고 평가하는 면접"
          selected={selectedType === "PERSONAL"}
          onClick={() => {
            if (interviewMode !== "GENERAL") {
              setSelectedType("PERSONAL");
            }
          }}
          disabled={interviewMode === "GENERAL"}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={() => {
          if (selectedType) {
            onNext();
            handleClick();
          }
        }}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!selectedType}
      />
    </>
  );
};

export default TypeStep;
