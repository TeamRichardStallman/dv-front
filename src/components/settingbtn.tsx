"use client";
import { useState } from "react";

type ButtonProps = {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
};

const SettingBtn = ({ label, description, selected, onClick }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative border rounded-3xl w-[400px] h-[300px] flex items-center justify-center text-center cursor-pointer transition-all duration-300 ${
        selected ? "bg-primary text-white" : "bg-gray-200 text-black"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`font-bold text-4xl tracking-widest transition-transform duration-300 ${
          isHovered ? "-translate-y-2" : ""
        }`}
      >
        {label}
      </div>

      {/* 설명 영역 */}
      {isHovered && (
        <div
          className="absolute bottom-4 text-sm text-black bg-white p-3 rounded-md shadow-md transition-opacity duration-300 opacity-100"
          style={{ width: "90%" }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default SettingBtn;
