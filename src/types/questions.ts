interface Question {
  question_id: number;
  question_excerpt: string;
  question_text: string;
  question_intent: string;
  key_terms: string[];
}

interface QuestionsData {
  questions: Question[];
}

export type { QuestionsData };
