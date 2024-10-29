import Link from "next/link";
import React from "react";

const InterviewPage = () => {
  return (
    <div>
      <div className="flex gap-4">
        <Link href={"/interview/setup"} className="border px-4 py-2">
          모의면접
        </Link>
        <Link href={"/interview/setup"} className="border px-4 py-2">
          실전면접
        </Link>
      </div>
    </div>
  );
};

export default InterviewPage;
