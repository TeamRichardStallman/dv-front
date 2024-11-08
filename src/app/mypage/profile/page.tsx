"use client";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<string>("자기소개서");
  const [fileList, setFileList] = useState<{ name: string; type: string }[]>([
    { name: "자기소개서_1.pdf", type: "자기소개서" },
    { name: "포트폴리오_1.pdf", type: "포트폴리오" },
    { name: "이력서_1.pdf", type: "이력서" },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setPdfUrl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setPdfUrl(URL.createObjectURL(file)); // 선택한 파일의 URL 생성
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    // 선택된 파일에 대한 URL 설정해야 함
    if (fileName) {
      setPdfUrl(`/pdf/${fileName}`); // 서버랑 연동해서 실제 URL로 수정해야 함
    } else {
      setPdfUrl(null);
    }
  };

  const handleSave = () => {
    if (!selectedFile) {
      toast.error("파일을 선택해주세요.");
      return;
    }

    const newFile = { name: selectedFile, type: activeTab };
    setFileList((prev) => [...prev, newFile]);
    toast.success(`${activeTab}에 저장되었습니다.`);
    setSelectedFile(null);
    setPdfUrl(null);
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
          disabled
          style={{
            cursor: "not-allowed",
            opacity: activeTab === "포트폴리오" ? 1 : 0.5,
          }}
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
          disabled
          style={{
            cursor: "not-allowed",
            opacity: activeTab === "이력서" ? 1 : 0.5,
          }}
        >
          이력서
        </button>
        <select
          className="ml-4 border rounded-lg p-2 w-1/3"
          onChange={handleSelectChange}
        >
          <option value="">파일 선택</option>
          {fileList
            .filter((file) => file.type === activeTab)
            .map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
        </select>
      </div>

      <div className="w-[900px] h-[450px] border rounded-lg overflow-hidden mt-4 flex items-center justify-center">
        {pdfUrl ? (
          <iframe src={pdfUrl} width="100%" height="100%" />
        ) : (
          <p className="text-gray-500">파일을 선택해주세요.</p>
        )}
      </div>

      <div className="flex items-center justify-end w-[900px] mt-4">
        <label className="flex items-center cursor-pointer">
          <AiOutlinePaperClip className="text-primary text-4xl mr-2" />
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf"
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
          />
        </label>
        <span className="text-sm text-gray-600 mr-2">{selectedFile}</span>
        <button
          onClick={handleSave}
          className="py-2 px-6 bg-primary font-semibold text-white rounded-lg ml-2 whitespace-nowrap"
        >
          저장
        </button>
      </div>

      <ToastContainer
        position="bottom-right"
        toastStyle={{ fontWeight: "500" }}
      />
    </div>
  );
};

export default ProfilePage;
