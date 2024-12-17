"use client";

import React, { useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  TooltipItem,
  Tooltip,
  Legend,
  ActiveElement,
  ChartEvent,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export type RadarChartWithDetailProps = {
  labelMap: Record<string, string>;
  evaluationScores: { score: number; rationale: string }[];
};

const RadarChartWithDetail = ({
  labelMap,
  evaluationScores,
}: RadarChartWithDetailProps) => {
  const [selectedScoreDetail, setSelectedScoreDetail] = useState<{
    name: string;
    score: number;
    rationale: string;
  } | null>(null);

  const radarData = {
    labels: Object.values(labelMap),
    datasets: [
      {
        label: "평가 점수",
        data: evaluationScores.map((score) => score.score),
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
        ticks: { stepSize: 2 },
        pointLabels: { font: { family: "Pretendard", size: 12, weight: 600 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"radar">) => {
            const index = context.dataIndex;
            const scoreDetail = evaluationScores[index];
            return scoreDetail ? `${scoreDetail.score}점` : "";
          },
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const scoreDetail = evaluationScores[index];
        setSelectedScoreDetail({
          name: Object.values(labelMap)[index],
          score: scoreDetail.score,
          rationale: scoreDetail.rationale,
        });
      }
    },
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="w-3/5 flex justify-center items-center">
        <div style={{ width: "100%", height: "400px" }}>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="w-2/5 mt-4 p-4 border rounded-lg bg-gray-50 h-[300px] flex flex-col items-center justify-center">
        {selectedScoreDetail ? (
          <>
            <h4 className="text-lg text-primary font-bold mb-2">
              {selectedScoreDetail.name} ({selectedScoreDetail.score}/10)
            </h4>
            <p className="font-medium text-center">
              {selectedScoreDetail.rationale}
            </p>
          </>
        ) : (
          <p className="font-bold text-gray-500 text-center">
            점수를 클릭하여 세부 평가를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default RadarChartWithDetail;
