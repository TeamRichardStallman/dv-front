"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import { PostCreateRequestDto } from "@/app/community/page";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: PostCreateRequestDto, file: File | null) => void;
  user: {
    userId: number;
    nickname: string;
    s3ProfileImageUrl: string;
  } | null;
}

const PostModal: FC<PostModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const [content, setContent] = useState("");
  const [jobKoreanName, setJobKoreanName] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading] = useState(false);
  const supportedExtensions = ["image/jpeg", "image/jpg", "image/png"];

  const handleImageSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!supportedExtensions.includes(selectedFile.type)) {
        alert("JPG, JPEG, PNG 파일만 업로드 가능합니다.");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRealSubmit = async () => {
    try {
      onSubmit(
        {
          jobKoreanName:
            jobKoreanName === "클라우드" ? "인프라" : jobKoreanName,
          content,
          s3ImageUrl: null,
          interviewId: null,
          overallEvaluationId: null,
          postType: "POST",
        },
        file
      );
      setContent("");
      setJobKoreanName("");
      setUploadedImage(null);
      setFile(null);
      onClose();
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  const handleSubmit = async () => {
    if (jobKoreanName) {
      if (content && content.length > 0) {
        handleRealSubmit();
      } else {
        alert("내용을 입력해주세요.");
        return;
      }
    } else {
      alert("직무를 선택해주세요.");
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={user?.s3ProfileImageUrl || "/profile-img.png"}
                alt="Profile"
                width={48}
                height={48}
              />
            </div>
            <span className="ml-2 font-bold">{user?.nickname}</span>
          </div>
          <select
            value={jobKoreanName}
            onChange={(e) => setJobKoreanName(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">직무 선택</option>
            <option value="백엔드">백엔드</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="클라우드">인프라</option>
            <option value="인공지능">인공지능</option>
          </select>
        </div>
        <input type="file" onChange={handleImageSet} accept="image/*" />
        {uploadedImage && (
          <div className="relative mt-4 w-full h-64">
            <Image
              src={uploadedImage}
              alt="Preview"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full mt-4 p-2 border rounded"
        />
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "업로드 중..." : "작성 완료"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
