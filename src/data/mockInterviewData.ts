export const mockInterviewData = {
  code: 200,
  message: "SUCCESS",
  data: {
    interview: {
      interviewId: 1,
      interviewTitle: "면접 제목",
      interviewStatus: "INITIAL",
      interviewType: "TECHNICAL",
      interviewMethod: "CHAT",
      interviewMode: "GENERAL",
      job: {
        jobId: 1,
        jobName: "BACK_END",
        jobNameKorean: "백엔드",
        jobDescription: "백엔드 직무입니다.",
      },
      files: [],
    },
    evaluationCriteria: [
      {
        evaluationCriteriaId: 1,
        evaluationCriteria: "GROWTH_POTENTIAL",
        feedbackText: "성장 가능성이 매우 높습니다.",
        score: 8,
      },
      {
        evaluationCriteriaId: 2,
        evaluationCriteria: "JOB_FIT",
        feedbackText: "자격이 잘 맞습니다.",
        score: 3,
      },
      {
        evaluationCriteriaId: 3,
        evaluationCriteria: "WORK_ATTITUDE",
        feedbackText: "긍정적인 태도를 보였습니다.",
        score: 7,
      },
      {
        evaluationCriteriaId: 4,
        evaluationCriteria: "TECHNICAL_DEPTH",
        feedbackText: "기술적인 깊이는 양호하나 추가 학습이 필요합니다.",
        score: 6,
      },
    ],
    answerEvaluations: [
      {
        answerEvaluationId: 1,
        questionText:
          "최근 프로젝트에서 사용한 기술 스택에 대해 설명해 주세요.",
        answerText:
          "저는 최근 프로젝트에서 Node.js와 Express.js를 사용하여 RESTful API를 개발했습니다. 데이터베이스로는 MongoDB를 활용했으며, 클라이언트 측에서는 React를 사용하여 사용자 인터페이스를 구현했습니다.",
        answerFeedbackStrength:
          "프로젝트에 대한 이해가 깊고, 사용한 기술 스택에 대해 구체적으로 설명할 수 있었습니다.",
        answerFeedbackImprovement:
          "다소 기술적인 용어가 많아 비전문가에게는 이해하기 어려울 수 있습니다. 좀 더 쉬운 용어를 사용하면 좋겠습니다.",
        answerFeedbackSuggestion:
          "비전문가를 고려하여 설명할 때는 용어를 쉽게 풀어서 설명하는 연습을 해보세요.",
        answerEvaluationScores: [
          {
            answerEvaluationScoreId: 1,
            answerEvaluationScoreName: "APPROPRIATE_RESPONSE",
            score: 8,
            rationale:
              "전반적으로 적절한 응답이었으며, 질문에 잘 답변했습니다.",
          },
          {
            answerEvaluationScoreId: 2,
            answerEvaluationScoreName: "LOGICAL_FLOW",
            score: 7,
            rationale:
              "논리적 흐름이 있었지만, 추가적인 설명이 필요할 수 있습니다.",
          },
          {
            answerEvaluationScoreId: 3,
            answerEvaluationScoreName: "KEY_TERMS",
            score: 9,
            rationale: "주요 용어를 적절히 사용하였습니다.",
          },
          {
            answerEvaluationScoreId: 4,
            answerEvaluationScoreName: "CONSISTENCY",
            score: 8,
            rationale: "응답이 일관성 있었습니다.",
          },
          {
            answerEvaluationScoreId: 5,
            answerEvaluationScoreName: "GRAMMATICAL_ERRORS",
            score: 5,
            rationale: "몇 가지 문법 오류가 있었습니다.",
          },
        ],
      },
      {
        answerEvaluationId: 2,
        questionText: "이전 직장에서 맡았던 주요 업무는 무엇이었나요?",
        answerText:
          "이전 직장에서는 백엔드 개발자로서 API 개발 및 데이터베이스 관리 업무를 수행했습니다. 고객 요구사항에 맞춰 새로운 기능을 구현하고, 성능 최적화를 위한 작업도 진행했습니다.",
        answerFeedbackStrength:
          "주요 업무에 대한 경험이 풍부하며, 구체적인 예시를 들어 설명한 점이 좋았습니다.",
        answerFeedbackImprovement:
          "업무의 구체적인 성과나 지표를 함께 설명하면 더 좋을 것 같습니다.",
        answerFeedbackSuggestion:
          "각 업무의 성과를 정리하여 면접 시 활용할 수 있도록 준비하세요.",
        answerEvaluationScores: [
          {
            answerEvaluationScoreId: 1,
            answerEvaluationScoreName: "APPROPRIATE_RESPONSE",
            score: 9,
            rationale: "상당히 적절한 응답으로, 경험이 잘 드러났습니다.",
          },
          {
            answerEvaluationScoreId: 2,
            answerEvaluationScoreName: "LOGICAL_FLOW",
            score: 8,
            rationale: "응답의 논리적 흐름이 좋았습니다.",
          },
          {
            answerEvaluationScoreId: 3,
            answerEvaluationScoreName: "KEY_TERMS",
            score: 7,
            rationale:
              "주요 용어의 사용이 적절했으나 추가 설명이 필요했습니다.",
          },
          {
            answerEvaluationScoreId: 4,
            answerEvaluationScoreName: "CONSISTENCY",
            score: 9,
            rationale: "응답이 일관적이고 명확했습니다.",
          },
          {
            answerEvaluationScoreId: 5,
            answerEvaluationScoreName: "GRAMMATICAL_ERRORS",
            score: 6,
            rationale:
              "전반적으로 문제는 없으나, 일부 어색한 표현이 있었습니다.",
          },
        ],
      },
      {
        answerEvaluationId: 3,
        questionText: "어떤 방법으로 문제를 해결했는지 설명해 주세요.",
        answerText:
          "문제를 해결하기 위해서는 먼저 문제를 분석하고, 적절한 해결책을 모색했습니다. 필요한 경우 팀원들과의 협업을 통해 다양한 의견을 수렴하여 문제를 해결했습니다.",
        answerFeedbackStrength:
          "문제 해결 과정에 대한 체계적인 접근 방식이 인상적이었습니다.",
        answerFeedbackImprovement:
          "조금 더 구체적인 사례를 들어 설명할 수 있으면 좋겠습니다.",
        answerFeedbackSuggestion:
          "실제 사례를 통해 문제 해결 방법을 설명하는 연습을 해보세요.",
        answerEvaluationScores: [
          {
            answerEvaluationScoreId: 1,
            answerEvaluationScoreName: "APPROPRIATE_RESPONSE",
            score: 8,
            rationale: "응답이 적절하며 문제 해결 방식이 잘 드러났습니다.",
          },
          {
            answerEvaluationScoreId: 2,
            answerEvaluationScoreName: "LOGICAL_FLOW",
            score: 7,
            rationale: "조금 더 명확한 흐름이 필요했습니다.",
          },
          {
            answerEvaluationScoreId: 3,
            answerEvaluationScoreName: "KEY_TERMS",
            score: 8,
            rationale: "적절한 용어를 사용하였습니다.",
          },
          {
            answerEvaluationScoreId: 4,
            answerEvaluationScoreName: "CONSISTENCY",
            score: 7,
            rationale: "일관성이 있었지만, 더 명확히 설명할 필요가 있습니다.",
          },
          {
            answerEvaluationScoreId: 5,
            answerEvaluationScoreName: "GRAMMATICAL_ERRORS",
            score: 5,
            rationale: "일부 문법 오류가 있었습니다.",
          },
        ],
      },
      {
        answerEvaluationId: 4,
        questionText: "자신의 강점은 무엇이라고 생각하나요?",
        answerText:
          "저의 강점은 문제 해결 능력과 팀워크입니다. 문제를 분석하고 해결하는 데 있어 주도적으로 나서는 편이며, 팀원들과의 협업을 통해 더 나은 결과를 이끌어냅니다.",
        answerFeedbackStrength: "강점에 대한 자신감이 엿보였습니다.",
        answerFeedbackImprovement:
          "구체적인 사례를 들어주면 더욱 좋을 것 같습니다.",
        answerFeedbackSuggestion:
          "자신의 강점을 잘 보여줄 수 있는 사례를 준비하세요.",
        answerEvaluationScores: [
          {
            answerEvaluationScoreId: 1,
            answerEvaluationScoreName: "APPROPRIATE_RESPONSE",
            score: 9,
            rationale: "적절한 응답으로 강점이 잘 드러났습니다.",
          },
          {
            answerEvaluationScoreId: 2,
            answerEvaluationScoreName: "LOGICAL_FLOW",
            score: 8,
            rationale: "응답의 흐름이 좋았습니다.",
          },
          {
            answerEvaluationScoreId: 3,
            answerEvaluationScoreName: "KEY_TERMS",
            score: 7,
            rationale: "주요 용어를 적절히 사용하였습니다.",
          },
          {
            answerEvaluationScoreId: 4,
            answerEvaluationScoreName: "CONSISTENCY",
            score: 9,
            rationale: "응답이 일관성 있었습니다.",
          },
          {
            answerEvaluationScoreId: 5,
            answerEvaluationScoreName: "GRAMMATICAL_ERRORS",
            score: 4,
            rationale: "약간의 문법 오류가 있었습니다.",
          },
        ],
      },
      {
        answerEvaluationId: 5,
        questionText: "앞으로의 계획은 무엇인가요?",
        answerText:
          "앞으로 더 많은 프로젝트를 경험하며, 기술적 깊이를 더해 나갈 계획입니다. 또한, 최신 기술 트렌드에 맞춰 학습을 지속할 예정입니다.",
        answerFeedbackStrength: "미래에 대한 계획이 잘 서져 있어 긍정적입니다.",
        answerFeedbackImprovement:
          "좀 더 구체적인 목표를 제시하면 좋을 것 같습니다.",
        answerFeedbackSuggestion:
          "단기 및 장기 목표를 나누어 명확히 설정하세요.",
        answerEvaluationScores: [
          {
            answerEvaluationScoreId: 1,
            answerEvaluationScoreName: "APPROPRIATE_RESPONSE",
            score: 8,
            rationale: "전반적으로 적절한 응답이었습니다.",
          },
          {
            answerEvaluationScoreId: 2,
            answerEvaluationScoreName: "LOGICAL_FLOW",
            score: 7,
            rationale: "응답의 흐름이 좋지만, 추가 설명이 필요했습니다.",
          },
          {
            answerEvaluationScoreId: 3,
            answerEvaluationScoreName: "KEY_TERMS",
            score: 6,
            rationale: "주요 용어를 잘 사용하였습니다.",
          },
          {
            answerEvaluationScoreId: 4,
            answerEvaluationScoreName: "CONSISTENCY",
            score: 7,
            rationale: "일관성이 있었지만, 더 명확히 설명할 필요가 있습니다.",
          },
          {
            answerEvaluationScoreId: 5,
            answerEvaluationScoreName: "GRAMMATICAL_ERRORS",
            score: 3,
            rationale: "몇 가지 문법 오류가 있었습니다.",
          },
        ],
      },
    ],
  },
};
