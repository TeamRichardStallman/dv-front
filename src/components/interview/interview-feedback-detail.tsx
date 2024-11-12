"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ActiveElement,
  ChartEvent,
  TooltipItem,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { GetUserProps } from "@/app/(user)/auth/page";
import { CircularProgressbar } from "react-circular-progressbar";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { calculateAge } from "@/utils/format";

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
  type: string; // You can make this more specific if the types are known
  fileName: string;
  s3FileUrl: string;
}

interface InterviewDetails {
  interviewId: number;
  interviewTitle: string;
  interviewStatus: "INITIAL" | "IN_PROGRESS" | "FILE_UPLOAD"; // Add other statuses if needed
  interviewType: "TECHNICAL" | "PERSONAL"; // Add other types if needed
  interviewMethod: "CHAT" | "VIDEO" | "VOICE"; // Add other methods if needed
  interviewMode: "REAL" | "GENERAL"; // Add other modes if needed
  job: JobDetails;
  files: InterviewFile[];
}

interface EvaluationCriteria {
  evaluationCriteriaId: number;
  evaluationCriteria: string; // Can be more specific if needed
  feedbackText: string;
  score: number;
}

interface AnswerEvaluationScore {
  answerEvaluationScoreId: number;
  answerEvaluationScoreName: string; // Can be more specific if needed
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

type InterviewFeedbackDetailProps = {
  user: GetUserProps;
  evaluation: EvaluationDetailType;
};

const InterviewFeedbackDetail = ({
  user,
  evaluation,
}: InterviewFeedbackDetailProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScoreDetail, setSelectedScoreDetail] = useState<{
    name: string;
    score: number;
    rationale: string;
  } | null>(null);

  const calculateTotalScore = () => {
    const totalScore = evaluation?.evaluationCriteria
      ? evaluation.evaluationCriteria.reduce(
          (total, criteria) => total + criteria.score,
          0
        )
      : 40;
    const maxScore = evaluation?.evaluationCriteria
      ? evaluation.evaluationCriteria.length * 10
      : 40;
    return (totalScore / maxScore) * 100;
  };

  const totalScore = calculateTotalScore();

  const interviewInfoMap: Record<string, { label: string }> = {
    REAL: { label: "실전면접" },
    TECHNICAL: { label: "기술면접" },
    CHAT: { label: "채팅" },
    PERSONAL: { label: "인성면접" },
    GENERAL: { label: "모의면접" },
    VOICE: { label: "음성" },
    VIDEO: { label: "영상" },
  };

  const criteriaMap: Record<string, { label: string }> = {
    GROWTH_POTENTIAL: { label: "성장 가능성" },
    JOB_FIT: { label: "문제 해결 능력" },
    WORK_ATTITUDE: { label: "협업 능력" },
    TECHNICAL_DEPTH: { label: "기술 이해도" },
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  const selectedAnswerEvaluation = evaluation?.answerEvaluations.find(
    (evaluation) => evaluation.answerEvaluationId === selectedQuestion
  );

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const labelMap = {
    APPROPRIATE_RESPONSE: "적절한 답변",
    LOGICAL_FLOW: "논리적 흐름",
    KEY_TERMS: "핵심 단어",
    CONSISTENCY: "일관성",
    GRAMMATICAL_ERRORS: "문법적 오류",
  };

  const radarData = {
    labels: Object.values(labelMap),
    datasets: [
      {
        label: "평가 점수",
        data: selectedAnswerEvaluation
          ? selectedAnswerEvaluation.answerEvaluationScores.map(
              (score) => score.score
            )
          : [0, 0, 0, 0, 0],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        pointLabels: {
          font: {
            family: "Pretendard",
            size: 12,
            weight: 600,
          },
        },
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"radar">) => {
            const index = context.dataIndex;
            const scoreDetail = selectedAnswerEvaluation
              ? selectedAnswerEvaluation.answerEvaluationScores[index]
              : null;
            return scoreDetail ? `${scoreDetail.score}점` : "";
          },
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const scoreDetails = selectedAnswerEvaluation
          ? selectedAnswerEvaluation.answerEvaluationScores[index]
          : null;
        setSelectedScoreDetail(
          scoreDetails
            ? {
                name: radarData.labels[index],
                score: scoreDetails.score,
                rationale: scoreDetails.rationale,
              }
            : null
        );
      }
    },
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="w-[900px]">
        <div className="mt-2 flex justify-between max-w-4xl p-6 border rounded-lg shadow-lg mb-8">
          <div className="flex flex-col items-center w-1/3 p-4">
            <h3 className="text-lg font-bold mb-4">프로필 정보</h3>
            {user?.s3ProfileImageUrl && (
              <Image
                src={user?.s3ProfileImageUrl}
                alt={`${user?.nickname}의 프로필`}
                width={120}
                height={120}
                className="rounded-full mb-4"
              />
            )}
            <p className="text-xl font-bold">{user?.name}</p>
            <p className="text-md text-gray-500 font-semibold">
              {user?.gender}, {calculateAge(user?.birthdate)}세
            </p>
          </div>

          <div className="flex flex-col items-center w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-4">면접 정보</h3>

            <div className="flex flex-col items-center mb-4 space-y-2">
              <div className="flex justify-center gap-4">
                <span className="flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-base font-semibold min-w-[120px] h-10">
                  {evaluation?.interview.interviewMode &&
                    interviewInfoMap[evaluation?.interview.interviewMode].label}
                </span>
                <span className="flex items-center justify-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-base font-semibold min-w-[120px] h-10">
                  {evaluation?.interview.interviewType &&
                    interviewInfoMap[evaluation?.interview.interviewType].label}
                </span>
              </div>
              <div className="flex justify-center gap-4">
                <span className="flex items-center justify-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-base font-semibold min-w-[120px] h-10">
                  {evaluation?.interview.interviewMethod &&
                    interviewInfoMap[evaluation?.interview.interviewMethod]
                      .label}
                </span>
                <span className="flex items-center justify-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-base font-semibold min-w-[120px] h-10">
                  {evaluation?.interview.job.jobNameKorean}
                </span>
              </div>
            </div>

            <div className="mt-4 w-full">
              <h4 className="text-md text-gray-500 font-bold mb-2">
                [입력한 자료]
              </h4>
              <ul className="border border-gray-300 rounded-lg p-3 bg-gray-50 space-y-2">
                {(evaluation?.interview.files || []).map((file, index) => (
                  <li key={index} className="text-sm font-medium text-gray-700">
                    {file.fileName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3 p-4">
            <h3 className="text-lg font-bold mb-2">총점</h3>
            <div className="w-48 h-48 font-bold">
              <CircularProgressbar
                value={totalScore}
                maxValue={100}
                text={`${totalScore.toFixed(0)}점`}
                styles={{
                  path: { stroke: "var(--primary)" },
                  text: { fill: "#333", fontSize: "20px" },
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 border rounded-lg shadow-lg p-6">
          <ul>
            {evaluation?.evaluationCriteria.map((criteria) => {
              const criteriaLabel =
                criteriaMap[criteria.evaluationCriteria]?.label || "Unknown";
              let color;
              if (criteria.score >= 7) color = "#4CAF50";
              else if (criteria.score >= 4) color = "#FFC107";
              else color = "#F44336";

              return (
                <li
                  key={criteria.evaluationCriteriaId}
                  className="mt-6 mb-6 flex items-center"
                >
                  <div className="w-32 h-32 mr-4 font-semibold flex-shrink-0">
                    <CircularProgressbar
                      value={criteria.score}
                      maxValue={10}
                      text={`${criteria.score}/10`}
                      styles={{
                        path: { stroke: color },
                        text: { fill: color },
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-primary mb-2">
                      {criteriaLabel}
                    </h4>
                    <p className="font-semibold">{criteria.feedbackText}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex w-full mt-8 border rounded-lg shadow-lg p-6">
          <div className="w-1/3 border-r border-gray-300 pr-4">
            <h3 className="text-lg font-bold mb-4">질문 리스트</h3>
            <ul>
              {evaluation?.answerEvaluations.map((evaluation, index) => (
                <li
                  key={evaluation.answerEvaluationId}
                  className={`cursor-pointer p-2 mb-2 font-medium rounded-lg flex items-center ${
                    selectedQuestion === evaluation.answerEvaluationId
                      ? "bg-primary text-white font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    handleQuestionSelect(evaluation.answerEvaluationId)
                  }
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full text-black bg-secondary text-xs mr-2 aspect-square font-black">
                    {index + 1}
                  </span>
                  {evaluation.questionText.length > 50
                    ? `${evaluation.questionText.substring(0, 50)}...`
                    : evaluation.questionText}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-3/4 pl-4">
            {selectedAnswerEvaluation ? (
              <>
                <div className="border-2 border-gray-300 rounded-lg p-4 mb-4">
                  <h3 className="text-xl font-bold mb-2 text-primary">
                    Q. {selectedAnswerEvaluation.questionText}
                  </h3>
                  <p className="text-md font-semibold">
                    A.{" "}
                    {selectedAnswerEvaluation.answerText.length > 180 &&
                    !isExpanded
                      ? `${selectedAnswerEvaluation.answerText.substring(
                          0,
                          180
                        )}...`
                      : selectedAnswerEvaluation.answerText}
                  </p>
                  {selectedAnswerEvaluation.answerText.length > 180 && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={toggleExpand}
                        className="flex items-center text-primary font-bold hover:text-secondary"
                      >
                        {isExpanded ? "간략히" : "더보기"}
                        {isExpanded ? (
                          <AiOutlineUp className="ml-1" />
                        ) : (
                          <AiOutlineDown className="ml-1" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <h4 className="text-xl text-primary font-bold mb-2">
                  [평가 기준별 점수]
                </h4>
                <div className="flex items-start space-x-4">
                  <div className="w-3/5">
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                  <div className="w-2/5 mt-4 p-4 border rounded-lg bg-gray-50 h-[300px] flex flex-col items-center justify-center">
                    {selectedScoreDetail ? (
                      <>
                        <h4 className="text-lg text-primary font-bold mb-2">
                          {selectedScoreDetail.name} (
                          {selectedScoreDetail.score}/10)
                        </h4>
                        <p className="font-medium">
                          {selectedScoreDetail.rationale}
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-gray-500">
                        점수를 클릭해주세요.
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-xl text-primary font-bold mb-2 mt-4">
                  [피드백]
                </h4>
                <div className="flex flex-col justify-between mb-4">
                  <div className="w-full p-4 border rounded-lg bg-gray-50 mb-2">
                    <h4 className="text-md font-bold mb-2 text-primary">
                      잘한점
                    </h4>
                    <p className="text-sm font-semibold">
                      {selectedAnswerEvaluation?.answerFeedbackStrength ||
                        "내용이 없습니다."}
                    </p>
                  </div>

                  <div className="w-full p-4 border rounded-lg bg-gray-50 mb-2">
                    <h4 className="text-md font-bold mb-2 text-primary">
                      개선점
                    </h4>
                    <p className="text-sm font-semibold">
                      {selectedAnswerEvaluation?.answerFeedbackImprovement ||
                        "내용이 없습니다."}
                    </p>
                  </div>

                  <div className="w-full p-4 border rounded-lg bg-gray-50">
                    <h4 className="text-md font-bold mb-2 text-primary">
                      제안사항
                    </h4>
                    <p className="text-sm font-semibold">
                      {selectedAnswerEvaluation?.answerFeedbackSuggestion ||
                        "내용이 없습니다."}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-4 border-2 border-dashed rounded-lg bg-gray-100 text-center">
                <p className="font-bold text-gray-500 text-lg">
                  질문을 선택해주세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackDetail;
