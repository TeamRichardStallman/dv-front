import React from "react";
import NavButtons from "./nav-button";

const JobStep = ({ onPrev, onNext }: StepProps) => {
  return (
    <>
      <div>
        <button>프론트엔드</button>
        <button>백엔드</button>
        <button>클라우드</button>
        <button>AI</button>
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

export default JobStep;
