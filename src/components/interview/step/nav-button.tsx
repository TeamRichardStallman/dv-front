import React from "react";

interface NavButtonsProps extends StepProps, ButtonsProps {}

const NavButtons = ({
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
}: NavButtonsProps) => {
  return (
    <div className="flex justify-between items-center absolute bottom-0 left-0 right-0">
      <button onClick={onPrev}>{prevButtonText}</button>
      <div className="flex gap-3">
        <button onClick={onNext}>{nextButtonText}</button>
      </div>
    </div>
  );
};

export default NavButtons;
