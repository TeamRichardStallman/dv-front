import React from "react";
import NavButtons from "./nav-button";

const TypeStep = ({ onPrev, onNext }: StepProps) => {
  return (
    <>
      <div>
        <button>기술면접</button>
        <button>인성면접</button>
      </div>
      <NavButtons
        onPrev={onPrev}
        onNext={onNext}
        prevButtonText="홈으로"
        nextButtonText="다음"
      />
    </>
  );
};

export default TypeStep;
