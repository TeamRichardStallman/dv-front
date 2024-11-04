import React from "react";

interface NavButtonsProps extends StepProps, ButtonsProps {
  disabled?: boolean;
}

const NavButtons = ({
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
  disabled = false,
}: NavButtonsProps) => {
  return (
    <div className="flex gap-4 mt-8 font-semibold justify-center">
      <button
        onClick={onPrev}
        className="bg-secondary w-24 text-white py-2 px-6 rounded-md"
      >
        {prevButtonText}
      </button>
      <button
        onClick={!disabled ? onNext : undefined}
        className={`w-24 py-2 px-6 rounded-md text-white ${
          disabled ? "bg-gray-400 cursor-not-allowed" : "bg-secondary"
        }`}
        disabled={disabled}
      >
        {nextButtonText}
      </button>
    </div>
  );
};

export default NavButtons;
