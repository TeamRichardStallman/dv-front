"use client";
import React, { FC, useState } from "react";
import Image from "next/image";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: {
    jobKoreanName: string;
    content: string;
    s3ImageUrl: string;
    interviewId: number;
    overallEvaluationId: number;
    postType: string;
  }) => void;
  user: {
    nickname: string;
    s3ProfileImageUrl: string;
  } | null;
}

const PostModal: FC<PostModalProps> = ({ isOpen, onClose, onSubmit, user }) => {
  const [content, setContent] = useState("");
  const [jobKoreanName, setJobKoreanName] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] h-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          {user && (
            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={user.s3ProfileImageUrl}
                  alt={`${user.nickname}의 프로필`}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
              <span className="font-bold text-lg">{user.nickname}</span>
            </div>
          )}
          <select
            value={jobKoreanName}
            onChange={(e) => setJobKoreanName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">직무를 선택하세요</option>
            <option value="백엔드">백엔드</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="UX/UI">UX/UI</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-500 text-sm font-bold mb-2">
            사진 업로드
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadedImage && (
            <div className="mt-4 relative w-full h-96 rounded-md overflow-hidden border">
              <Image
                src={uploadedImage}
                alt="Uploaded Preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요.."
          className="w-full p-2 border font-medium border-gray-300 rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 font-bold text-white rounded-lg hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSubmit({
                jobKoreanName,
                content,
                s3ImageUrl: uploadedImage || "https://example.com/image.jpg",
                interviewId: 1,
                overallEvaluationId: 2,
                postType: "INTERVIEW",
              });
              setContent("");
              setJobKoreanName("");
              setUploadedImage(null);
              onClose();
            }}
            className="px-4 py-2 bg-primary font-bold text-white rounded-lg hover:bg-blue-600"
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
