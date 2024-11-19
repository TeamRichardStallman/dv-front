"use client";
import { MultiFileUploadPanelDataType } from "@/data/profileData";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-[500px]">
      <p className="mb-8 text-lg font-semibold text-gray-800">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="py-2 px-4 bg-gray-300 rounded-lg text-gray-800 font-semibold"
        >
          취소
        </button>
        <button
          onClick={onConfirm}
          className="py-2 px-4 bg-primary text-white rounded-lg font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  </div>
);

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
  const [modalState, setModalState] = useState({
    show: false,
    message: "",
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);

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
    if (isManualInput) {
      setModalState({
        show: true,
        message: "현재 입력 중인 내용이 사라집니다. 파일을 선택하시겠습니까?",
      });
      setPendingFile(file || null);
    } else if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
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
    setFile(file);
  };

  const handleManualInput = () => {
    if (selectedFile) {
      setModalState({
        show: true,
        message: "현재 선택된 파일이 해제됩니다. 직접 입력을 진행하시겠습니까?",
      });
    } else {
      setIsManualInput(true);
      setPdfUrl(null);
      setSelectedFile(null);
    }
  };

  const handleModalConfirm = () => {
    setModalState({ show: false, message: "" });
    if (pendingFile) {
      processFile(pendingFile);
      setPendingFile(null);
    } else {
      setIsManualInput(true);
      setPdfUrl(null);
      setSelectedFile(null);
    }
  };

  const handleModalCancel = () => {
    setModalState({ show: false, message: "" });
    setPendingFile(null);
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
    if (!file) {
      toast.error("파일이 선택되지 않았습니다.");
      return;
    }

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
        throw new Error("서버에서 URL을 가져오지 못했습니다.");
      }

      const { presignedUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      toast.success("파일이 성공적으로 업로드되었습니다.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`업로드 실패: ${error.message}`);
      } else {
        toast.error("업로드 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {modalState.show && (
        <Modal
          message={modalState.message}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      )}
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
          <p className="text-gray-500">파일을 선택하거나 직접 입력하세요.</p>
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
