interface Question {
  question_id: number;
  question_excerpt: string;
  question_text: string;
  question_intent: string;
  key_terms: string[];
}

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
  questionCount: number;
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

interface EvaluationDetailType {
  interview: InterviewDetails;
  evaluationCriteria: EvaluationCriteria[];
  answerEvaluations: AnswerEvaluation[];
}

interface GetEvaluationResponse {
  data: EvaluationDetailType;
}

interface Answer {
  answerText: string;
  s3AudioUrl: string;
  s3VideoUrl: string;
}

interface InterviewAnswerRequest {
  interviewId: number;
  answerQuestionId: number;
  nextQuestionId?: number;
  answer: Answer;
}

interface QuestionResponseData {
  interview: InterviewDetails;
  currentQuestionId: number;
  currentQuestionText: string;
  currendQuestionS3AudioUrl: string;
  nextQuestionId?: number;
  nextQuestionText?: string;
  nextQuestionS3AudioUrl: string;
  hasNext: boolean;
}

interface QuestionResponse {
  code: number;
  message: string;
  data: QuestionResponseData;
}

interface EvaluationInfo {
  interviewTitle: string;
  interviewId: number;
}

interface GetEvaluationListResponse {
  code: number;
  message: string;
  data: {
    interviews: EvaluationInfo[];
  };
}

interface ApiResponse {
  code: number;
  message: string;
  data: InterviewDetails;
}

interface InterviewAddFileResponse {
  code: number;
  message: string;
  data: InterviewAddFileDetails;
}

interface InterviewAddFileDetails {
  interviewId: number;
  interviewTitle: string;
  interviewStatus: "INITIAL" | "IN_PROGRESS" | "FILE_UPLOAD";
  interviewType: "TECHNICAL" | "PERSONAL";
  interviewMethod: "CHAT" | "VIDEO" | "VOICE";
  interviewMode: "REAL" | "GENERAL";
  job: JobDetails;
  questionCount: number;
  file: InterviewFile;
}

interface GetFileListResponse {
  code: number;
  message: string;
  data: InterviewFileList;
}

interface InterviewFileList {
  coverLetters: InterviewFileProps[];
}

interface InterviewFileProps {
  fileId: number;
  fileName: string;
  type: string;
  s3FileUrl: string | null;
}
