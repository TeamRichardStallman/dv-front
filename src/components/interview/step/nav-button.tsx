import React from "react";

interface NavButtonsProps extends StepProps {
  prevButtonText: string;
  nextButtonText: string;
}

const NavButtons = ({
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
}: NavButtonsProps) => {
  return (
    <div className="flex gap-4 mt-8 font-semibold">
      <button
        onClick={onPrev}
        className="bg-secondary w-24 text-white py-2 px-6 rounded-md"
      >
        {prevButtonText}
      </button>
      <button
        onClick={onNext}
        className="bg-secondary w-24 text-white py-2 px-6 rounded-md"
      >
        {nextButtonText}
      </button>
    </div>
  );
};

export default NavButtons;
