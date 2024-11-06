import Link from "next/link";
import { getEvaluationData } from "@/data/evaluation";

const InterviewFeedbackPage = async () => {
  const data = await getEvaluationData();

  return (
    <>
      <h1>InterviewFeedbackPage</h1>
      <p>{data.message}</p>
      <Link
        href={"/"}
        className="absolute bottom-14 px-6 py-3 bg-primary text-white rounded text-xl"
      >
        홈으로
      </Link>
    </>
  );
};

export default InterviewFeedbackPage;
