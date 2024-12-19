import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";

type EvaluationCriteria = {
  evaluationCriteriaId: number;
  evaluationCriteria: string;
  score: number;
  feedbackText: string;
};

type CriteriaMap = Record<string, { label: string }>;

type EvaluationCriteriaListProps = {
  criteriaList: EvaluationCriteria[];
  criteriaMap: CriteriaMap;
  sectionTitle: string;
};

const EvaluationCriteriaList: React.FC<EvaluationCriteriaListProps> = ({
  criteriaList,
  criteriaMap,
  sectionTitle,
}) => {
  if (!criteriaList.length) return null;

  return (
    <div className="mb-6">
      <h4 className="text-xl font-extrabold text-primary mb-4">
        {sectionTitle}
      </h4>
      <ul>
        {criteriaList.map((criteria) => {
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
  );
};

export default EvaluationCriteriaList;
