import { useState } from "react";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";

const TypeStep = ({ onPrev, onNext }: StepProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <>
      <div className="flex gap-16 justify-center">
        <SettingBtn
          label="기술면접"
          description="관심 직무를 기반으로 기술적 지식, 문제 해결 능력, 실무 적용 역량을 평가하는 면접"
          selected={selectedType === "Tech"}
          onClick={() => setSelectedType("Tech")}
        />
        <SettingBtn
          label="인성면접"
          description="지원자의 성격, 가치관, 대인관계 능력 등을 질문을 통해 직접 확인하고 평가하는 면접"
          selected={selectedType === "Soft"}
          onClick={() => setSelectedType("Soft")}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={() => {
          if(selectedType) {
            onNext({interviewType: selectedType==="Tech"?"TECHNICAL":"PERSONAL"})
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
