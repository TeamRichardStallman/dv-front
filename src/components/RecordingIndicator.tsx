import { motion } from "framer-motion";
import { BsMicFill } from "react-icons/bs";

const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const circleVariants = {
    active: {
      scale: [1, 1.3, 1],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    inactive: { scale: 1, opacity: 1 },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative flex items-center justify-center rounded-full bg-primary w-24 h-24"
        initial="inactive"
        animate={isRecording ? "active" : "inactive"}
        variants={circleVariants}
      >
        <BsMicFill className="text-white text-4xl" />
      </motion.div>
      <p className="text-lg font-semibold text-gray-700">
        {isRecording ? "녹음 중..." : "녹음 준비 중..."}
      </p>
    </div>
  );
};

export default RecordingIndicator;
