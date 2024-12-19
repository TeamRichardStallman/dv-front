"use client";
import React from "react";
import Image from "next/image";

type PositionBtnProps = {
  label: string;
  imageSrc: string;
  selected: boolean;
  onClick: () => void;
};

const PositionBtn = ({
  label,
  imageSrc,
  selected,
  onClick,
}: PositionBtnProps) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-6 text-center cursor-pointer transition-all duration-300 transform flex flex-col items-center ${
        selected
          ? "bg-primary text-white scale-105 shadow-lg"
          : "bg-gray-100 text-black hover:shadow-md"
      }`}
      style={{ width: "200px", height: "240px" }}
    >
      <div className="flex justify-center mb-6">
        <Image
          src={imageSrc}
          alt={`${label} 이미지`}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
      <div className="font-bold text-xl mt-auto">{label}</div>{" "}
    </div>
  );
};

export default PositionBtn;
