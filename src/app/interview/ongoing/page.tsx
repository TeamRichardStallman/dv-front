import Link from "next/link";

const InterviewOngoingPage = () => {
  return (
    <>
      <h1>InterviewOngoingPage</h1>
      <Link
        href={"/interview/feedback"}
        className="absolute bottom-14 px-6 py-3 bg-primary text-white rounded text-xl"
      >
        다음
      </Link>
    </>
  );
};

export default InterviewOngoingPage;
