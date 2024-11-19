"use client";
import { MultiFileUploadPanelDataType } from "@/data/profileData";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface MultiFileUploadPanelProps {
  files: MultiFileUploadPanelDataType[];
  submitButtonText?: string;
  submitButtonColor?: string;
  onSubmitButtonClick?: (files: string[]) => void;
}

const MultiFileUploadPanel = ({
  files,
  submitButtonText = "저장",
  submitButtonColor = "bg-primary",
  onSubmitButtonClick,
}: MultiFileUploadPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("coverLetter");
  const [fileList, setFileList] = useState<{ name: string; type: string }[]>([
    { name: "자기소개서_1.pdf", type: "coverLetter" },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>("");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedFile(null);
    setPdfUrl(null);
    setIsManualInput(false);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);
    if (fileName) {
      setPdfUrl(`/pdf/${fileName}`);
      setIsManualInput(false);
    } else {
      setPdfUrl(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setPdfUrl(URL.createObjectURL(file));
      setIsManualInput(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          const decoder = new TextDecoder("utf-8");
          decoder.decode(e.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
      setFile(file || null);
    }
  };

  const handleManualInput = () => {
    setIsManualInput(true);
    setPdfUrl(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (isManualInput && !manualText.trim()) {
      toast.error("텍스트를 입력해주세요.");
      return;
    }

    if (!isManualInput && !selectedFile) {
      toast.error("파일을 선택해주세요.");
      return;
    }

    if (isManualInput) {
      toast.success(`${activeTab}에 텍스트가 저장되었습니다.`);
    } else {
      const newFile = { name: selectedFile!, type: activeTab };
      setFileList((prev) => [...prev, newFile]);
      toast.success(`${activeTab}에 파일이 저장되었습니다.`);
      await handleUpload();
    }

    setSelectedFile(null);
    setPdfUrl(null);
    setManualText("");
  };

  const handleSubmitButtonClick = () => {
    handleSave();
    if (onSubmitButtonClick) {
      if (isManualInput) {
        onSubmitButtonClick([manualText]);
      } else if (selectedFile) {
        onSubmitButtonClick([`cover-letters/${selectedFile}`]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요.");

    setUploading(true);

    try {
      const response = await fetch("/api/s3/uploadFiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `cover-letters/${file.name}`,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { presignedUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="flex items-center justify-between w-[900px] mb-4">
        <div className="flex space-x-4 font-semibold">
          {files.map((file, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(file.type)}
              className={`py-2 px-6 rounded-lg ${
                activeTab === file.type
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-secondary"
              }`}
              style={{
                cursor: "pointer",
              }}
            >
              {file.name}
            </button>
          ))}
        </div>

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

        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <AiOutlinePaperClip className="text-primary text-4xl" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.txt,.md"
              onClick={(e) => {
                e.currentTarget.value = "";
              }}
            />
          </label>

          <button
            onClick={handleManualInput}
            className="py-2 px-6 font-semibold text-white rounded-lg bg-primary"
          >
            직접입력
          </button>

          <button
            onClick={handleSubmitButtonClick}
            className={`py-2 px-6 font-semibold text-white rounded-lg whitespace-nowrap ${submitButtonColor}`}
          >
            {uploading ? "업로드 중..." : submitButtonText}
          </button>
        </div>
      </div>

      <div className="w-[900px] h-[450px] border rounded-lg overflow-hidden mt-4 flex items-center justify-center">
        {isManualInput ? (
          <textarea
            className="w-full h-full p-4 border-none focus:outline-none resize-none"
            placeholder="텍스트를 입력하세요."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
          />
        ) : pdfUrl ? (
          <iframe src={pdfUrl} width="100%" height="100%" />
        ) : (
          <p className="text-gray-500">
            텍스트 파일을 선택하거나 직접 입력하세요.
          </p>
        )}
      </div>
      {selectedFile && (
        <div className="mt-2 text-gray-500 font-medium">
          파일명: {selectedFile}
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        toastStyle={{ fontWeight: "500" }}
      />
    </div>
  );
};

export default MultiFileUploadPanel;
