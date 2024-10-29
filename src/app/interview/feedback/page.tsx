import Link from "next/link";

const InterviewFeedbackPage = () => {
  return (
    <>
      <h1>InterviewFeedbackPage</h1>
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
