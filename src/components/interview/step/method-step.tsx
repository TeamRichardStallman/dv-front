import React from "react";
import NavButtons from "./nav-button";

const MethodStep = ({ onPrev, onNext }: StepProps) => {
  return (
    <>
      <div>
        <button>채팅</button>
        <button>음성</button>
        <button>비디오</button>
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

export default MethodStep;
