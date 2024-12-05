"use client";
import { useCallback, useEffect, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { formatTime } from "@/utils/format";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MicRecorder from "mic-recorder-to-mp3";

const MAX_TIME = 180;

const InterviewOngoingPage = () => {
  const questions = QUESTIONS.questions;
  const router = useRouter();
  const [, setAnswers] = useState<
    {
      question_id: number;
      answer_text: string;
      answer_time: number;
      audio_url?: string;
    }[]
  >([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [recorder, setRecorder] = useState<MicRecorder>(new MicRecorder());
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mp3Recorder = new MicRecorder({ bitRate: 64 });

  const startRecording = async () => {
    try {
      await mp3Recorder.start();
      console.log("녹음 시작");
      setRecorder(mp3Recorder);
      console.log("녹음 중,.,");
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("녹음 중지");
      const [buffer, blob] = await recorder.stop().getMp3();
      console.log("녹음 데이터: ", buffer, blob);
      console.log("buffer length:", buffer.slice.length);
      console.log("blob size:", blob.size);
      console.log("blob type:", blob.type);
      const newAudioUrl = URL.createObjectURL(blob);
      setAudioUrl(newAudioUrl);
      setIsRecording(false);
      console.log("녹음 데이터 url: ", newAudioUrl);
      return blob;
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextQuestion = useCallback(async () => {
    setTimeLeft(MAX_TIME);
    const newAudioBlob = await stopRecording();

    const formData = new FormData();

    if (newAudioBlob) {
      formData.append(
        "file",
        newAudioBlob,
        `audio_question_${questions[currentQuestionIndex].question_id}.mp3`
      );
    }

    let audioUrl = "";
    if (formData) {
      try {
        toast.info("Presigned URL 요청 중...");
        const response = await fetch("/api/s3/uploadFiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: `audio_question_${questions[currentQuestionIndex].question_id}.mp3`,
            fileType: "audio/mp3",
          }),
        });
        if (!response.ok) {
          throw new Error("Presigned URL 요청 실패");
        }

        const { presignedUrl } = await response.json();

        toast.info("S3에 파일 업로드 중...");
        await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": "audio/mp3" },
          body: formData,
        });

        audioUrl = presignedUrl.split("?")[0];
        toast.success("녹음 파일이 성공적으로 업로드되었습니다!");
      } catch (error) {
        console.error("S3 업로드 중 오류 발생:", error);
        toast.error("녹음 파일 업로드에 실패했습니다.");
      }
    }

    if (currentQuestionIndex === questions.length - 1) {
      setAnswers((prevAnswers) => {
        const newAnswers = [
          ...prevAnswers,
          {
            question_id: questions[currentQuestionIndex].question_id,
            answer_text: answerText,
            answer_time: MAX_TIME - timeLeft,
            audio_url: audioUrl,
          },
        ];
        console.log("Submit answers to backend:", newAnswers);
        return newAnswers;
      });
      router.push("/interview/feedback");
    } else {
      setAnswers((prevAnswers) => {
        const newAnswers = [
          ...prevAnswers,
          {
            question_id: questions[currentQuestionIndex].question_id,
            answer_text: answerText,
            answer_time: MAX_TIME - timeLeft,
            audio_url: audioUrl,
          },
        ];
        console.log("Save answers:", newAnswers);
        return newAnswers;
      });
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText("");
      setAudioUrl(null);
    }
  }, [
    questions,
    currentQuestionIndex,
    answerText,
    timeLeft,
    router,
    audioUrl,
    isRecording,
  ]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  };

  useEffect(() => {
    if (timeLeft === 1) {
      toast.info("시간이 초과되어 다음 질문으로 넘어갑니다.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      handleNextQuestion();
    }
  }, [timeLeft, handleNextQuestion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          return MAX_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  return (
    <div className="h-[65vh] flex flex-col items-center">
      <ToastContainer />
      <div className="flex gap-4 items-center mb-12 font-bold">
        <h1 className="text-3xl">OOO님의 실전/기술 면접</h1>
        <div className="text-xl rounded-md px-4 py-3 bg-[#BDC3C7] text-white w-35 h-15">
          OO 직무
        </div>
      </div>

      <div className="flex flex-col w-[900px] gap-6">
        <div className="flex w-full bg-primary font-semibold text-white rounded-md items-center justify-center p-3 text-lg">
          Q{currentQuestionIndex + 1}.{" "}
          {questions[currentQuestionIndex].question_text}
        </div>
        <textarea
          className="w-full h-72 border-2 font-medium rounded-md p-3"
          placeholder="답변을 작성해주세요."
          value={answerText}
          onChange={handleAnswerChange}
        />
      </div>

      <div className="flex w-full justify-between py-6 items-center">
        <button
          onClick={startRecording}
          className={`px-6 py-3 rounded font-semibold text-xl ${
            isRecording
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white"
          }`}
          disabled={isRecording}
        >
          녹음 시작
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill={timeLeft <= 30 ? "#FF0000" : "#000000"}
              viewBox="0 0 256 256"
            >
              <path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"></path>
            </svg>
            <span
              className={`text-xl font-semibold ${
                timeLeft <= 30 ? "text-red-500" : "text-black"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            className="px-6 py-3 bg-secondary text-white rounded font-semibold text-xl"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex === questions.length - 1 ? "제출" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewOngoingPage;
