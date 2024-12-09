"use client";
import React, { useState } from "react";
import Image from "next/image";
import { postData } from "@/data/postData";

const CommunityPage = () => {
  const posts = postData.data.posts;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-200 min-h-screen w-full relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">구독 피드</h1>
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <div
              key={post.postId}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="relative w-10 h-10 mr-3">
                    <Image
                      src={post.authorProfileUrl}
                      alt={`${post.authorNickname}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {post.authorNickname}
                  </span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                  {post.jobNameKorean}
                </span>
              </div>
              <div className="relative w-full h-96">
                <Image
                  src={post.s3ImageUrl}
                  alt={`Post ${post.postId}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-800 mb-3">{post.content}</p>
                <span className="text-sm text-gray-500">
                  {new Date(post.generatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-8 right-8 flex flex-col items-end">
        {isMenuOpen && (
          <div className="flex flex-col items-end mb-4 space-y-3">
            <div className="flex items-center">
              <span className="mr-3 text-black font-bold">글쓰기</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-300">
                <Image
                  src="/icons/write-icon.png"
                  alt="글쓰기"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-black font-bold">면접 공유</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-300">
                <Image
                  src="/icons/interview-share-icon.png"
                  alt="면접 공유"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-black font-bold">피드백 공유</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-300">
                <Image
                  src="/icons/feedback-share-icon.png"
                  alt="피드백 공유"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="w-15 h-15 flex items-center justify-center rounded-full shadow-md"
        >
          <Image
            src="/icons/icon-plus-circle.png"
            alt={isMenuOpen ? "Close menu" : "Open menu"}
            width={55}
            height={55}
          />
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;
