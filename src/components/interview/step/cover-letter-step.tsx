import React from "react";
import NavButtons from "./nav-button";

const CoverLetterStep = ({ onPrev, onNext }: StepProps) => {
  return (
    <>
      <div>
        <button>자기소개서 입력</button>
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

export default CoverLetterStep;
