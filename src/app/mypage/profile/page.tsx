"use client";
import React, { useState } from "react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("자기소개서");
  const [fileList] = useState([
    { name: "자기소개서_1.pdf", type: "자기소개서" },
    { name: "포트폴리오_1.pdf", type: "포트폴리오" },
    { name: "이력서_1.pdf", type: "이력서" },
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="flex items-center mb-4 font-semibold space-x-4 w-[1000px] justify-center">
        <button
          onClick={() => handleTabChange("자기소개서")}
          className={`py-2 px-6 rounded-lg ${
            activeTab === "자기소개서"
              ? "bg-primary text-white"
              : "bg-gray-200 hover:bg-secondary"
          }`}
        >
          자기소개서
        </button>
        <button
          onClick={() => handleTabChange("포트폴리오")}
          className={`py-2 px-6 rounded-lg ${
            activeTab === "포트폴리오"
              ? "bg-primary text-white"
              : "bg-gray-200 hover:bg-secondary"
          }`}
        >
          포트폴리오
        </button>
        <button
          onClick={() => handleTabChange("이력서")}
          className={`py-2 px-6 rounded-lg ${
            activeTab === "이력서"
              ? "bg-primary text-white"
              : "bg-gray-200 hover:bg-secondary"
          }`}
        >
          이력서
        </button>
        <select className="ml-4 border rounded-lg p-2 w-1/3">
          {fileList
            .filter((file) => file.type === activeTab)
            .map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default ProfilePage;
