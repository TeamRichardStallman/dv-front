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
      className={`border rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
        selected ? "bg-primary text-white" : "bg-gray-200 text-black"
      } ${isHovered ? "h-32" : "h-24"}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-bold text-lg">{label}</div>
      {isHovered && (
        <div className="mt-2 text-sm text-black bg-white p-2 rounded-md shadow-md">
          {description}
        </div>
      )}
    </div>
  );
};

export default SettingBtn;
