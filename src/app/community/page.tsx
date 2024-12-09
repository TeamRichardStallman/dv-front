"use client";
import React from "react";
import Image from "next/image";
import { postData } from "@/data/postData";

const CommunityPage = () => {
  const posts = postData.data.posts;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">게시글 리스트</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="border rounded-lg shadow-md p-4 flex flex-col"
          >
            <div className="relative w-full h-40 mb-4">
              <Image
                src={post.s3ImageUrl}
                alt={`Post ${post.postId}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex items-center mb-4">
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
            <h2 className="text-xl font-semibold mb-2">{post.jobNameKorean}</h2>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <span className="text-sm text-gray-500">
              생성일: {new Date(post.generatedAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
