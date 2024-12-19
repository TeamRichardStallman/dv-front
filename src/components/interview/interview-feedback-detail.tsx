"use client";
import React, { useState } from "react";
import Image from "next/image";
import RadarChartWithDetail from "@/components/radar-chart";
import EvaluationCriteriaList from "@/components/EvaluationCriteriaList";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { calculateAge } from "@/utils/format";
import {
  COMMON_LABELS,
  TECHNICAL_CRITERIA,
  PERSONAL_CRITERIA,
  VOICE_CRITERIA,
} from "@/constants/evaluationLabels";

const getLabelMapByType = (type: string) => {
  switch (type) {
    case "TECHNICAL":
      return TECHNICAL_CRITERIA.reduce(
        (map, key) => ({ ...map, [key]: COMMON_LABELS[key] }),
        {}
      );
    case "PERSONAL":
      return PERSONAL_CRITERIA.reduce(
        (map, key) => ({ ...map, [key]: COMMON_LABELS[key] }),
        {}
      );
    case "VOICE":
      return VOICE_CRITERIA.reduce(
        (map, key) => ({ ...map, [key]: COMMON_LABELS[key] }),
        {}
      );
    default:
      return {};
  }
};

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const interviewInfoMap: Record<string, { label: string }> = {
  REAL: { label: "실전 면접" },
  TECHNICAL: { label: "기술 면접" },
  CHAT: { label: "채팅" },
  PERSONAL: { label: "인성 면접" },
  GENERAL: { label: "모의 면접" },
  VOICE: { label: "음성" },
  VIDEO: { label: "영상" },
};

export const jobsMap: Record<number, { label: string; imageSrc: string }> = {
  2: { label: "프론트엔드", imageSrc: "/frontend.png" },
  1: { label: "백엔드", imageSrc: "/backend.png" },
  3: { label: "클라우드", imageSrc: "/cloud.png" },
  4: { label: "인공지능", imageSrc: "/ai.png" },
};

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

  const generMap: Record<string, { label: string }> = {
    MAN: { label: "남성" },
    WOMAN: { label: "여성" },
  };

  const baseCriteriaMap: Record<string, { label: string }> = {
    GROWTH_POTENTIAL: { label: "성장 가능성" },
    JOB_FIT: { label: "문제 해결 능력" },
    WORK_ATTITUDE: { label: "협업 능력" },
    TECHNICAL_DEPTH: { label: "기술 이해도" },
  };

  const voiceCriteriaMap: Record<string, { label: string }> = {
    CLARITY: { label: "명확성" },
    FLUENCY: { label: "유창성" },
    WORD_REPETITION: { label: "단어 반복" },
  };

  const criteriaMap =
    evaluation?.interview.interviewMethod === "VOICE"
      ? { ...baseCriteriaMap, ...voiceCriteriaMap }
      : baseCriteriaMap;

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  const selectedAnswerEvaluation = evaluation?.answerEvaluations.find(
    (evaluation) => evaluation.answerEvaluationId === selectedQuestion
  );

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="w-[900px]">
        <div className="mt-2 flex justify-between max-w-4xl p-6 border rounded-lg shadow-lg mb-8">
          <div className="flex flex-col items-center w-1/3 p-4">
            <h3 className="text-lg font-bold mb-4">프로필 정보</h3>
            {user?.s3ProfileImageUrl && (
              <div className="w-36 h-36 mb-4 rounded-full overflow-hidden">
                <Image
                  src={user?.s3ProfileImageUrl}
                  alt={`${user?.nickname}의 프로필`}
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <p className="text-xl font-bold">{user?.name}</p>
            <p className="text-md text-gray-500 font-semibold">
              {user?.gender && generMap[user?.gender].label},{" "}
              {calculateAge(user?.birthdate)}세
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
              {evaluation?.interview.interviewMode !== "GENERAL" && (
                <>
                  <h4 className="text-md text-gray-500 font-bold mb-2">
                    [입력한 자료]
                  </h4>
                  <ul className="border border-gray-300 rounded-lg p-3 bg-gray-50 space-y-2">
                    {(evaluation?.interview.files || []).map((file, index) => (
                      <li
                        key={index}
                        className="text-sm font-medium text-gray-700"
                      >
                        {file.fileName}
                      </li>
                    ))}
                  </ul>
                </>
              )}
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
          <EvaluationCriteriaList
            criteriaList={evaluation?.evaluationCriteria.filter(
              (criteria) =>
                !["CLARITY", "FLUENCY", "WORD_REPETITION"].includes(
                  criteria.evaluationCriteria
                )
            )}
            criteriaMap={criteriaMap}
            sectionTitle="[전반적인 평가]"
          />
          {evaluation?.interview.interviewMethod === "VOICE" && (
            <EvaluationCriteriaList
              criteriaList={evaluation?.evaluationCriteria.filter((criteria) =>
                ["CLARITY", "FLUENCY", "WORD_REPETITION"].includes(
                  criteria.evaluationCriteria
                )
              )}
              criteriaMap={criteriaMap}
              sectionTitle="[전체 음성 평가]"
            />
          )}
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
                  <RadarChartWithDetail
                    labelMap={getLabelMapByType(
                      evaluation?.interview.interviewType || ""
                    )}
                    evaluationScores={
                      selectedAnswerEvaluation?.answerEvaluationScores || []
                    }
                  />
                </div>
                {evaluation?.interview.interviewMethod === "VOICE" && (
                  <>
                    <h4 className="text-xl text-primary font-bold mb-2">
                      [음성 기준별 점수]
                    </h4>
                    <div className="flex items-start space-x-4 mt-8">
                      <RadarChartWithDetail
                        labelMap={getLabelMapByType("VOICE")}
                        evaluationScores={
                          selectedAnswerEvaluation?.answerEvaluationScores.filter(
                            (score) =>
                              ["STUTTER", "PRONUNCIATION", "WPM"].includes(
                                score.answerEvaluationScoreName
                              )
                          ) || []
                        }
                      />
                    </div>
                  </>
                )}
                <h4 className="text-xl text-primary font-bold mb-2">
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
