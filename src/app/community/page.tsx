"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import PostModal from "@/components/post-modal";
import NoContent from "@/components/no-content";

export interface PostCreateRequestDto {
  jobKoreanName: string;
  content: string;
  s3ImageUrl: string | null;
  interviewId: number | null;
  overallEvaluationId: number | null;
  postType: string;
}

interface GetUserResponse {
  data: {
    userId: number;
    socialId: string;
    email: string;
    username: string;
    name: string;
    nickname: string;
    s3ProfileImageUrl: string;
    leave: boolean;
    gender: string;
    birthdate: string;
  };
}

interface PostCreateResponse {
  data: Post;
}

interface GetPostResponse {
  data: PostResponse;
}

interface PostList {
  posts: Post[];
}

interface Post {
  postId: number;
  authorId: number;
  authorNickname: string;
  authorProfileUrl: string;
  jobName: string;
  jobNameKorean: string;
  content: string;
  s3ImageUrl: string;
  interview: InterviewDetails;
  evaluation: EvaluationDetailType;
  postType: string;
  generatedAt: Date;
}

export interface PostResponse {
  data: PostList;
}

const apiUrl = `${setUrl}`;

const CommunityPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<GetUserResponse["data"] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendedChannels, setRecommendedChannels] = useState([
    { name: "백엔드", tag: "직무", isSubscribed: false, jobId: 1 },
    { name: "프론트엔드", tag: "직무", isSubscribed: false, jobId: 2 },
    { name: "인프라", tag: "직무", isSubscribed: false, jobId: 3 },
    { name: "인공지능", tag: "직무", isSubscribed: false, jobId: 4 },
  ]);
  const [activeFeed, setActiveFeed] = useState<"USER" | "SUBSCRIPTION">(
    "SUBSCRIPTION"
  );

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openModal = async () => {
    try {
      const userResponse = await axios.get<GetUserResponse>(
        `${apiUrl}/user/info`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setUser(userResponse.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
    }
  };

  interface SubscriptionListResponse {
    data: Subscription[];
  }

  interface Subscription {
    subscriptionId: number;
    userId: number;
    jobId: number;
    subscribedAt: Date;
  }

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axios.get<SubscriptionListResponse>(
          `${apiUrl}/subscription/user`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const subscribedJobs = response.data.data;
        setRecommendedChannels((prev) =>
          prev.map((channel) => ({
            ...channel,
            isSubscribed: subscribedJobs.some((e) => e.jobId === channel.jobId),
          }))
        );
      } catch (error) {
        console.error("구독 상태 불러오기 실패:", error);
      }
    };
    if (activeFeed === "SUBSCRIPTION") {
      fetchSubscriptionPosts();
    } else if (activeFeed === "USER") {
      fetchMyPosts();
    }

    fetchSubscriptionStatus();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePostSubmit = async (
    postData: PostCreateRequestDto,
    file: File | null
  ) => {
    try {
      const response = await axios.post<PostCreateResponse>(
        `${apiUrl}/post`,
        {
          jobKoreanName: postData.jobKoreanName,
          content: postData.content,
          s3ImageUrl: postData.s3ImageUrl ? postData.s3ImageUrl : null,
          postType: "POST",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        if (file) {
          const preSignedResponse = await axios.get<GetPreSignedUrlResponse>(
            `${apiUrl}/file/post-image/${encodeURIComponent(file.name)}/${
              data.postId
            }/upload-url`,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );

          const presignedUrl = preSignedResponse.data.data.preSignedUrl;
          if (presignedUrl) {
            fetch(presignedUrl, {
              method: "PUT",
              headers: { "Content-Type": file.type },
              body: file,
            }).catch((error) => {
              console.error(error);
            });

            const updatedPost = await axios.put<PostCreateResponse>(
              `${apiUrl}/post/image`,
              {
                imageUrl: preSignedResponse.data.data.objectKey,
                postId: data.postId,
              },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }
        }
      }
      fetchMyPosts();
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await axios.get<PostResponse>(`${apiUrl}/post/search`, {
        params: { keyword: searchQuery },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      const { data } = response.data;

      setSearchResults(data.posts);
    } catch (error) {
      console.error("게시글 검색 실패:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get<PostResponse>(`${apiUrl}/post/user`, {
        withCredentials: true,
      });
      setPosts(response.data.data.posts);
      setSearchResults([]);
      setActiveFeed("USER");
    } catch (error) {
      console.error("내 피드 가져오기 실패:", error);
    }
  };

  const fetchSubscriptionPosts = async () => {
    try {
      const response = await axios.get<PostResponse>(
        `${apiUrl}/post/subscription`,
        {
          withCredentials: true,
          params: { page: 0 },
        }
      );
      setPosts(response.data.data.posts);
      setSearchResults([]);
      setActiveFeed("SUBSCRIPTION");
    } catch (error) {
      console.error("구독 피드 가져오기 실패:", error);
    }
  };

  const createSubscription = async (jobId: number, index: number) => {
    try {
      await axios.post(
        `${apiUrl}/subscription`,
        { jobId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRecommendedChannels((prev) =>
        prev.map((channel, i) =>
          i === index ? { ...channel, isSubscribed: true } : channel
        )
      );
    } catch (error) {
      console.error("구독 생성 실패:", error);
    }
  };

  const deactivateSubscription = async (jobId: number, index: number) => {
    try {
      await axios.delete(`${apiUrl}/subscription/${jobId}`, {
        withCredentials: true,
      });
      setRecommendedChannels((prev) =>
        prev.map((channel, i) =>
          i === index ? { ...channel, isSubscribed: false } : channel
        )
      );
    } catch (error) {
      console.error("구독 취소 실패:", error);
    }
  };

  const handleSubscribeClick = (
    jobId: number,
    isSubscribed: boolean,
    index: number
  ) => {
    if (isSubscribed) {
      deactivateSubscription(jobId, index);
    } else {
      createSubscription(jobId, index);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen w-full relative">
      <div className="fixed top-24 left-4 z-40 bg-white shadow-md rounded-lg w-80 p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery === "" && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 font-semibold mb-2">
              추천 채널
            </p>
            {recommendedChannels.map((channel, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 rounded-md mb-2"
              >
                <div>
                  <span className="font-bold mr-2">{channel.name}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mr-2">
                    직무
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleSubscribeClick(
                        channel.jobId,
                        channel.isSubscribed,
                        index
                      )
                    }
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
        <div className="flex gap-2 mb-4">
          <button
            onClick={fetchSubscriptionPosts}
            className={`px-4 py-2 rounded-md font-bold ${
              activeFeed === "SUBSCRIPTION"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            구독 피드
          </button>
          <button
            onClick={fetchMyPosts}
            className={`px-4 py-2 rounded-md font-bold ${
              activeFeed === "USER" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            내 피드
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {(searchResults && searchResults.length > 0) ||
          (posts && posts.length > 0) ? (
            (searchResults.length > 0 ? searchResults : posts).map((post) =>
              post.s3ImageUrl ? (
                <div
                  key={post.postId}
                  className="bg-white shadow-md rounded-lg overflow-hidden border"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3">
                        <Image
                          src={
                            post.authorProfileUrl
                              ? `https://ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com/${post.authorProfileUrl}`
                              : "/profile-img.png"
                          }
                          alt={`${post.authorNickname}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                          onError={() =>
                            console.error(
                              "이미지 로드 실패. URL:",
                              post.authorProfileUrl
                            )
                          }
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
                      objectFit="contain"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(post.generatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  key={post.postId}
                  className="bg-white shadow-md rounded-lg overflow-hidden border"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3">
                        <Image
                          src={
                            post.authorProfileUrl
                              ? `https://ktb-8-dev-bucket.s3.ap-northeast-2.amazonaws.com/${post.authorProfileUrl}`
                              : "/profile-img.png"
                          }
                          alt={`${post.authorNickname}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                          onError={() =>
                            console.error(
                              "이미지 로드 실패. URL:",
                              post.authorProfileUrl
                            )
                          }
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

                  <div className="p-4">
                    <p className="text-gray-800 mb-3">{post.content}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(post.generatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border pb-16">
              <NoContent
                text={
                  activeFeed === "SUBSCRIPTION" ? "구독 정보가" : "내 게시글이"
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-end">
        {isMenuOpen && (
          <div className="flex flex-col items-end mb-4 space-y-3">
            <div
              className="flex items-center cursor-pointer"
              onClick={openModal}
            >
              <span className="mr-3 text-black font-bold">글쓰기</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white">
                <Image
                  src="/icons/write-icon.svg"
                  alt="글쓰기"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            {/* 잠시 안녕 */}
            {/* <div className="flex items-center">
              <span className="mr-3 text-black font-bold">면접 공유</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white">
                <Image
                  src="/icons/interview-share-icon.svg"
                  alt="면접 공유"
                  width={36}
                  height={36}
                />
              </div>
            </div> */}
            {/* <div className="flex items-center">
              <span className="mr-3 text-black font-bold">피드백 공유</span>
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white">
                <Image
                  src="/icons/feedback-share-icon.svg"
                  alt="피드백 공유"
                  width={24}
                  height={24}
                />
              </div>
            </div> */}
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="w-15 h-15 flex items-center justify-center rounded-full"
        >
          <Image
            src="/icons/icon-plus-circle.svg"
            alt={isMenuOpen ? "Close menu" : "Open menu"}
            width={55}
            height={55}
          />
        </button>
      </div>
      <PostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePostSubmit}
        user={user}
      />
    </div>
  );
};

export default CommunityPage;
