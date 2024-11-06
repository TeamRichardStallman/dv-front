interface Score {
  score: number;
  rationale: string;
}

interface Feedback {
  Strengths: string;
  Improvement: string;
  Suggestion: string;
}

interface AnswerEvaluation {
  question_id: number;
  scores: {
    "Appropriate Response": Score;
    "Logical Flow": Score;
    "Key Terms": Score;
    Consistency: Score;
    "Grammatical Errors": Score;
  };
  feedback: Feedback;
}

interface OverallEvaluation {
  job_fit: {
    score: number;
    feedback: string;
  };
  growth_potential: {
    score: number;
    feedback: string;
  };
  work_attitude: {
    score: number;
    feedback: string;
  };
  technical_depth: {
    score: number;
    feedback: string;
  };
}

interface EvaluationData {
  answer_evaluations: AnswerEvaluation[];
  overall_evaluation: OverallEvaluation;
}

export type { EvaluationData };
