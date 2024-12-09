"use client";
import React, { useState } from "react";
import Image from "next/image";
import { postData } from "@/data/postData";

const CommunityPage = () => {
  const posts = postData.data.posts;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedChannels, setRecommendedChannels] = useState([
    { name: "네이버", tag: "기업", isSubscribed: false },
    { name: "카카오", tag: "기업", isSubscribed: false },
    { name: "백엔드", tag: "직무", isSubscribed: false },
    { name: "프론트엔드", tag: "직무", isSubscribed: false },
    { name: "UX/UI", tag: "직무", isSubscribed: false },
  ]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSubscribe = (index: number) => {
    setRecommendedChannels((prevChannels) =>
      prevChannels.map((channel, i) =>
        i === index
          ? { ...channel, isSubscribed: !channel.isSubscribed }
          : channel
      )
    );
  };

  return (
    <div className="bg-gray-200 min-h-screen w-full relative">
      <div className="absolute top-8 left-4 z-50 bg-white shadow-md rounded-lg w-80 p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery === "" && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">추천 채널</h2>
            {recommendedChannels.map((channel, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded-md mb-2"
              >
                <span className="font-bold">{channel.name}</span>
                <div className="flex items-center">
                  <span className="text-sm font-semibold bg-primary text-white px-3 py-1 rounded-md mr-2">
                    {channel.tag}
                  </span>
                  <button
                    onClick={() => handleSubscribe(index)}
                    className={`text-sm font-semibold rounded-md px-3 py-1 ${
                      channel.isSubscribed
                        ? "bg-gray-500 text-white"
                        : "bg-secondary hover:bg-yellow-400 text-white"
                    }`}
                  >
                    {channel.isSubscribed ? "구독중" : "구독"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
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
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
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
