"use client";
import { MultiFileUploadPanelDataType } from "@/data/profileData";
import React, { useState } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import mammoth from "mammoth";
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
  const [fileList, setFileList] = useState<
    { id: string; name: string; type: string }[]
  >([{ id: uuidv4(), name: "자기소개서_1.pdf", type: "coverLetter" }]);
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
      const selected = fileList.find((file) => file.name === fileName);
      setPdfUrl(selected ? `/pdf/${selected.name}` : null);
      setIsManualInput(false);
    } else {
      setPdfUrl(null);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (isManualInput) {
      setModalState({
        show: true,
        message: "현재 입력 중인 내용이 사라집니다. 파일을 선택하시겠습니까?",
      });
      setPendingFile(file || null);
    } else if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const newFile = {
      id: uuidv4(),
      name: file.name,
      type: activeTab,
    };

    setFileList((prev) => [...prev, newFile]);
    setSelectedFile(newFile.name);
    setPdfUrl(null);
    setIsManualInput(false);

    if (file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          const arrayBuffer = e.target.result;
          try {
            const { value } = await mammoth.extractRawText({ arrayBuffer });
            const encodedContent = encodeURIComponent(value);
            setPdfUrl(`data:text/html;charset=utf-8,${encodedContent}`);
          } catch {
            toast.error("DOCX 파일 처리 중 오류가 발생했습니다.");
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const encodedContent = encodeURIComponent(e.target.result as string);
          setPdfUrl(`data:text/html;charset=utf-8,${encodedContent}`);
        }
      };
      reader.readAsText(file);
    } else {
      toast.error("지원하지 않는 파일 형식입니다.");
    }

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

  const handleModalConfirm = async () => {
    setModalState({ show: false, message: "" });
    if (pendingFile) {
      await processFile(pendingFile);
      setPendingFile(null);
    } else {
      setIsManualInput(true);
      setPdfUrl(null);
      setSelectedFile(null);
    }
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

    let savedFileName = "";

    if (isManualInput) {
      const fileName = `자기소개서-${new Date()
        .toISOString()
        .slice(0, 10)}.txt`;
      const textBlob = new Blob([manualText], { type: "text/plain" });
      const textFile = new File([textBlob], fileName);

      setFileList((prev) => [
        ...prev,
        { id: uuidv4(), name: fileName, type: activeTab },
      ]);

      await handleUpload(textFile);

      savedFileName = fileName;
      toast.success(`${activeTab}에 텍스트 파일이 저장되었습니다.`);
    } else {
      const newFile = { id: uuidv4(), name: selectedFile!, type: activeTab };
      setFileList((prev) => [...prev, newFile]);
      savedFileName = selectedFile!;
      toast.success(`${activeTab}에 파일이 저장되었습니다.`);
      await handleUpload(file!);
    }

    if (onSubmitButtonClick) {
      onSubmitButtonClick([`cover-letters/${savedFileName}`]);
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

  const handleUpload = async (uploadFile: File) => {
    if (!uploadFile) {
      toast.error("파일이 선택되지 않았습니다.");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/s3/uploadFiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `cover-letters/${uploadFile.name}`,
          fileType: uploadFile.type,
        }),
      });

      if (!response.ok) {
        throw new Error("서버에서 URL을 가져오지 못했습니다.");
      }

      const { presignedUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadFile.type },
        body: uploadFile,
      });

      toast.success("파일이 성공적으로 업로드되었습니다.");
    } catch {
      toast.error("업로드 중 오류가 발생했습니다.");
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
          onCancel={() => setModalState({ show: false, message: "" })}
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
              <option key={file.id} value={file.name}>
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
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title="file-preview"
          />
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
