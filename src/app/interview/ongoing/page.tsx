import { getQuestionsData } from "@/data/questions";
import InterviewOngoingComponent from "@/components/interview/temp/ongoing";

const InterviewOngoingPage = async () => {
  const questions = await getQuestionsData();

  return <InterviewOngoingComponent questions={questions.questions} />;
};

export default InterviewOngoingPage;
