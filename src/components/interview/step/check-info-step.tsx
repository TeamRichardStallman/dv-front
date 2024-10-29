import React from "react";
import NavButtons from "./nav-button";

const CheckInfoStep = ({ onPrev, onNext }: StepProps) => {
  return (
    <>
      <div>
        <button>입력 정보 확인</button>
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
