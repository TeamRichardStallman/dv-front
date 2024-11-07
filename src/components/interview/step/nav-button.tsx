import LoadingSpinner from "@/components/loading-spinner";
import React from "react";

interface NavButtonsProps extends StepProps, ButtonsProps {
  isLoading?: boolean;
  disabled?: boolean;
  disabledToolTipText?: string;
}

const NavButtons = ({
  isLoading,
  onPrev,
  onNext,
  prevButtonText,
  nextButtonText,
  disabled = false,
  disabledToolTipText = "버튼을 클릭해주세요",
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
          onClick={!isLoading || !disabled ? onNext : undefined}
          className={`py-2 px-6 rounded-md text-white ${
            isLoading || disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondary"
          }`}
          disabled={isLoading || disabled}
        >
          {isLoading ? <LoadingSpinner /> : nextButtonText}
        </button>
        {disabled && (
          <div
            className="absolute invisible group-hover:visible -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded-md shadow-md z-10"
            style={{ whiteSpace: "nowrap" }}
          >
            {disabledToolTipText}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavButtons;
