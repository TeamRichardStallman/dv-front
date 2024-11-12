"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { GetResponse, GetUserProps } from "@/app/(user)/auth/page";
import Loading from "@/components/loading";
import useQuestionRequest from "@/stores/useQuestionRequest";
import { setUrl } from "@/utils/setUrl";
import InterviewFeedbackDetail from "@/components/interview/interview-feedback-detail";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface JobDetails {
  jobId: number;
  jobName: string;
  jobNameKorean: string;
  jobDescription: string;
}

interface InterviewFile {
  fileId: number;
  type: string;
  fileName: string;
  s3FileUrl: string;
}

interface InterviewDetails {
  interviewId: number;
  interviewTitle: string;
  interviewStatus: "INITIAL" | "IN_PROGRESS" | "FILE_UPLOAD";
  interviewType: "TECHNICAL" | "PERSONAL";
  interviewMethod: "CHAT" | "VIDEO" | "VOICE";
  interviewMode: "REAL" | "GENERAL";
  job: JobDetails;
  files: InterviewFile[];
}

interface EvaluationCriteria {
  evaluationCriteriaId: number;
  evaluationCriteria: string;
  feedbackText: string;
  score: number;
}

interface AnswerEvaluationScore {
  answerEvaluationScoreId: number;
  answerEvaluationScoreName: string;
  score: number;
  rationale: string;
}

interface AnswerEvaluation {
  answerEvaluationId: number;
  questionText: string;
  answerText: string;
  answerFeedbackStrength: string;
  answerFeedbackImprovement: string;
  answerFeedbackSuggestion: string;
  answerEvaluationScores: AnswerEvaluationScore[];
}

export interface EvaluationDetailType {
  interview: InterviewDetails;
  evaluationCriteria: EvaluationCriteria[];
  answerEvaluations: AnswerEvaluation[];
}

export interface GetEvaluationResponse {
  data: EvaluationDetailType;
}

const apiUrl = `${setUrl}`;

const InterviewFeedbackDetailPage = () => {
  const { questionRequest, setQuestionRequest } = useQuestionRequest();
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationDetailType>();
  const [user, setUser] = useState<GetUserProps>();

  const hasFetched = useRef(false);

  useEffect(() => {
    const sendInitialQuestion = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get<GetResponse>(
          `${apiUrl}/user/info`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setUser(userResponse.data.data);

        const evalResponse = await axios.post<GetEvaluationResponse>(
          `${apiUrl}/evaluation`,
          { interviewId: questionRequest.interviewId },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(evalResponse);

        setEvaluation(evalResponse.data.data);

        setQuestionRequest({
          interviewId: undefined,
          interviewTitle: undefined,
          interviewStatus: undefined,
          interviewType: undefined,
          interviewMethod: undefined,
          interviewMode: undefined,
          jobId: undefined,
          files: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched.current && questionRequest) {
      hasFetched.current = true;
      sendInitialQuestion();
    }
  }, [questionRequest, setQuestionRequest]);

  return (
    <div>
      {!loading && user && evaluation ? (
        <InterviewFeedbackDetail user={user} evaluation={evaluation} />
      ) : (
        <Loading title="피드백 준비중" description="고생하셨습니다." />
      )}
    </div>
  );
};

export default InterviewFeedbackDetailPage;
