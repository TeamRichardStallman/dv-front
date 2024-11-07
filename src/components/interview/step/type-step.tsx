import { useEffect, useState } from "react";
import NavButtons from "./nav-button";
import SettingBtn from "@/components/settingbtn";
import useInterviewStore from "@/stores/useInterviewStore";

type Type = "TECHNICAL" | "PERSONAL";

const TypeStep = ({ onPrev, onNext }: StepProps) => {
  const { interview, updateInterviewField } = useInterviewStore();
  const [selectedType, setSelectedType] = useState<Type | null>(
    interview.interviewType ?? null
  );

  useEffect(() => {
    if (selectedType) {
      updateInterviewField("interviewType", selectedType);
    }
  }, [selectedType, updateInterviewField]);

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
          onClick={() => setSelectedType("PERSONAL")}
        />
      </div>

      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="이전"
        nextButtonText="다음"
        disabled={!selectedType}
        disabledToolTipText="면접 유형을 선택해주세요."
      />
    </>
  );
};

export default TypeStep;
