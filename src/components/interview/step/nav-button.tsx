import React, { ComponentPropsWithoutRef } from "react";

interface NavButtonsProps
  extends StepProps,
    ButtonsProps,
    ComponentPropsWithoutRef<"button"> {
  disabled?: boolean;
  tooltipMessage?: string;
}

const NavButtons = ({
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
  disabled = false,
  tooltipMessage = "버튼을 클릭해주세요",
}: NavButtonsProps) => {
  return (
    <div className="flex gap-4 mt-8 font-semibold justify-center relative">
      <button
        onClick={onPrev}
        className="bg-secondary text-white py-2 px-6 rounded-md"
      >
        {prevButtonText}
      </button>
      <div className="relative group">
        <button
          onClick={!disabled ? onNext : undefined}
          className={`py-2 px-6 rounded-md text-white ${
            disabled ? "bg-gray-400 cursor-not-allowed" : "bg-secondary"
          }`}
          disabled={disabled}
        >
          {nextButtonText}
        </button>
        {disabled && (
          <div
            className="absolute invisible group-hover:visible -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-md shadow-md z-10"
            style={{ whiteSpace: "nowrap" }}
          >
            {tooltipMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavButtons;
