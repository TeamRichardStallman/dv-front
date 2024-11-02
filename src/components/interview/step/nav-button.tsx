import React from "react";

interface NavButtonsProps extends StepProps, ButtonsProps {}

const NavButtons = ({
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
}: NavButtonsProps) => {
  return (
    <div className="flex justify-between items-center w-full mt-8">
      <button onClick={onPrev}>{prevButtonText}</button>
      <div className="flex gap-3">
        <button onClick={onNext}>{nextButtonText}</button>
      </div>
    </div>
  );
};

export default NavButtons;
