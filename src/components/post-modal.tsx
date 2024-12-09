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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">게시글 작성</h2>
        <div className="flex items-center mb-4">
          {user && (
            <>
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-4">
                <Image
                  src={user.s3ProfileImageUrl}
                  alt={`${user.nickname}의 프로필`}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
              <span className="font-bold">{user.nickname}</span>
            </>
          )}
        </div>
        <select
          value={jobKoreanName}
          onChange={(e) => setJobKoreanName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="">직무를 선택하세요</option>
          <option value="백엔드">백엔드</option>
          <option value="프론트엔드">프론트엔드</option>
          <option value="UX/UI">UX/UI</option>
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full p-2 border border-gray-300 rounded-md resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSubmit({
                jobKoreanName,
                content,
                s3ImageUrl: "https://example.com/image.jpg",
                interviewId: 1,
                overallEvaluationId: 2,
                postType: "INTERVIEW",
              });
              setContent("");
              setJobKoreanName("");
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
