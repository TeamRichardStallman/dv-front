"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import Link from "next/link";
export interface EvaluationInfo {
  interviewTitle: string;
  interviewId: number;
}

export interface GetEvaluationListResponse {
  code: number;
  message: string;
  data: {
    evaluationInfos: EvaluationInfo[];
  };
}

const apiUrl = `${setUrl}`;

const InterviewFeedbackListPage = () => {
  const [evaluationInfos, setEvaluationInfos] = useState<EvaluationInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get<GetEvaluationListResponse>(
          `${apiUrl}/evaluation`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const sortedEvaluations = response.data.data.evaluationInfos.sort(
          (a, b) => b.interviewId - a.interviewId
        );
        setEvaluationInfos(sortedEvaluations);
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [apiUrl]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <ul className="flex flex-col gap-4">
        {evaluationInfos.map((evaluation) => (
          <Link
            href={`/mypage/feedback/${evaluation.interviewId}`}
            key={evaluation.interviewId}
          >
            <div className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-50 cursor-pointer">
              <h3 className="text-lg font-semibold">
                {evaluation.interviewTitle}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {evaluation.interviewId}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default InterviewFeedbackListPage;
