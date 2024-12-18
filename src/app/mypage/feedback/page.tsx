"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import Link from "next/link";

const apiUrl = `${setUrl}`;

const typeMap: Record<string, string> = {
  TECHNICAL: "기술",
  PERSONAL: "인성",
};

const methodMap: Record<string, string> = {
  CHAT: "채팅",
  VOICE: "음성",
};

const modeMap: Record<string, string> = {
  GENERAL: "모의",
  REAL: "실전",
};

const formatTitle = (title: string): string => {
  const [date, type, method, mode] = title.split("_");
  return `${modeMap[mode] || mode}/${typeMap[type] || type}/${
    methodMap[method] || method
  } 면접결과지 (${date})`;
};

const InterviewFeedbackListPage = () => {
  const [interviews, setInterviews] = useState<EvaluationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get<GetEvaluationListResponse>(
          `${apiUrl}/interview/evaluation`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const sortedEvaluations = response.data.data.interviews.sort(
          (a, b) => b.interviewId - a.interviewId
        );
        setInterviews(sortedEvaluations);
      } catch (error) {
        console.error("Failed to fetch interview/evaluations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <ul className="flex flex-col gap-4">
        {interviews.map((evaluation) => (
          <Link
            href={`/mypage/feedback/${evaluation.interviewId}`}
            key={evaluation.interviewId}
          >
            <div className="border p-4 py-8 rounded-lg shadow-md bg-white hover:bg-gray-50 cursor-pointer">
              <h3 className="text-xl font-semibold">
                {formatTitle(evaluation.interviewTitle)}
              </h3>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default InterviewFeedbackListPage;
