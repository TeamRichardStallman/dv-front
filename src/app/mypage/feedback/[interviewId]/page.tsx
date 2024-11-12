"use client";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { setUrl } from "@/utils/setUrl";
import {
  EvaluationDetailType,
  GetEvaluationResponse,
} from "@/app/interview/feedback/[interviewId]/page";
import InterviewFeedbackDetail from "@/components/interview/interview-feedback-detail";
import { GetResponse, GetUserProps } from "@/app/(user)/auth/page";

const apiUrl = `${setUrl}`;

interface MyInterviewFeedbackDetailPageProps {
  params: Promise<{ interviewId: string }>;
}

const MyInterviewFeedbackDetailPage = ({
  params,
}: MyInterviewFeedbackDetailPageProps) => {
  const { interviewId } = use(params);
  const [user, setUser] = useState<GetUserProps>();
  const [evaluation, setEvaluation] = useState<EvaluationDetailType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!interviewId) return;
    const fetchUser = async () => {
      const userResponse = await axios.get<GetResponse>(`${apiUrl}/user/info`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setUser(userResponse.data.data);
    };

    const fetchEvaluationDetail = async () => {
      try {
        const response = await axios.get<GetEvaluationResponse>(
          `${apiUrl}/evaluation/${interviewId}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setEvaluation(response.data.data);
      } catch (error) {
        console.error("Failed to fetch evaluation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchEvaluationDetail();
  }, [interviewId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!evaluation)
    return (
      <p className="text-center text-red-500">
        Failed to load evaluation details.
      </p>
    );

  return (
    <div className="container mx-auto p-4">
      {evaluation && user && (
        <InterviewFeedbackDetail user={user} evaluation={evaluation} />
      )}
    </div>
  );
};

export default MyInterviewFeedbackDetailPage;
