"use client";
import React, { useState } from "react";
import CustomModal from "../modal/custom-modal";

const FileUploadButton = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setModalMessage("파일을 선택하세요.");
      setIsModalVisible(true);
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
        throw new Error("Failed to get presigned URL");
      }

      const { presignedUrl } = await response.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      setModalMessage("파일이 성공적으로 업로드되었습니다.");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Upload error:", error);
      setModalMessage("파일 업로드에 실패했습니다. 개발팀에 문의해주세요.");
      setIsModalVisible(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "업로드 중..." : "업로드"}
      </button>
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="확인"
        cancelButton="취소"
        onClose={() => {
          setIsModalVisible(false);
        }}
        onConfirm={() => {
          setIsModalVisible(false);
        }}
      />
    </div>
  );
};

export default FileUploadButton;
