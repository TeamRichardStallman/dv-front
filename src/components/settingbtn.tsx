"use client";
import { useState } from "react";

type ButtonProps = {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const SettingBtn = ({
  label,
  description,
  selected,
  onClick,
  disabled = false,
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const descriptionWords = description.split(" ");

  return (
    <div
      className={`relative border rounded-3xl w-[400px] h-[300px] flex items-center justify-center text-center transition-all duration-300 ${
        selected
          ? "bg-primary text-white"
          : disabled
          ? "bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
          : isHovered
          ? "bg-primary text-white cursor-pointer"
          : "bg-gray-200 text-black cursor-pointer"
      }`}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
    >
      <div
        className={`font-bold text-4xl tracking-widest transition-transform duration-300 ${
          selected || (isHovered && !disabled) ? "-translate-y-12" : ""
        }`}
      >
        {label}
      </div>

      <div
        className={`absolute bottom-6 text-base font-medium bg-white bg-opacity-90 p-5 rounded-lg shadow-lg transition-all duration-500 transform ${
          disabled || selected || (isHovered && !disabled)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
        style={{
          width: "90%",
          minHeight: "4rem",
          color: disabled ? "gray" : "black",
        }}
      >
        {descriptionWords.map((word, index) => (
          <span key={index} className="inline-block mr-1">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SettingBtn;
