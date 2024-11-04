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
          ? "bg-gray-300 text-gray-500"
          : "bg-gray-200 text-black"
      } ${disabled ? "opacity-60" : ""} ${!disabled ? "cursor-pointer" : ""}`}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`font-bold text-4xl tracking-widest transition-transform duration-300 ${
          isHovered && !disabled ? "-translate-y-2" : ""
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

      {disabled && isHovered && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center text-black font-bold text-lg rounded-3xl">
          아직 사용할 수 없습니다.
        </div>
      )}
    </div>
  );
};

export default SettingBtn;
