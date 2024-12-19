// "use client";

// import { motion } from "framer-motion";
// import { BsMicFill } from "react-icons/bs";

// const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
//   const ringVariants = {
//     active: {
//       scale: [1, 1.3, 1],
//       opacity: [0.5, 0.2, 0.5],
//       borderColor: ["#60a5fa", "#c084fc"],
//       transition: {
//         duration: 1.2,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     },
//     inactive: {
//       scale: 1,
//       opacity: 0.3,
//       borderColor: "#cbd5e1",
//     },
//   };

//   const highlightVariants = {
//     active: {
//       rotate: [0, 360],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "linear",
//       },
//     },
//     inactive: { rotate: 0 },
//   };

//   return (
//     <div className="relative flex flex-col items-center gap-4">
//       <motion.div className="relative flex items-center justify-center rounded-full w-32 h-32 bg-white">
//         <BsMicFill className="text-blue-600 text-4xl z-10" />

//         <motion.div
//           className="absolute inset-0 rounded-full border-4"
//           variants={ringVariants}
//           initial="inactive"
//           animate={isRecording ? "active" : "inactive"}
//         />

//         <motion.div
//           className="absolute inset-0 rounded-full border-[6px] border-transparent"
//           style={{
//             borderTopColor: "rgba(96, 165, 250, 0.5)",
//             borderBottomColor: "rgba(192, 132, 252, 0.5)",
//           }}
//           variants={highlightVariants}
//           animate={isRecording ? "active" : "inactive"}
//         />
//       </motion.div>
//       <p className="mt-5 text-lg font-semibold text-gray-500">
//         {isRecording ? "답변 중" : "답변을 준비해주세요"}
//       </p>
//     </div>
//   );
// };

// export default RecordingIndicator;

"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsMicFill } from "react-icons/bs";

const CameraIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    console.log("isRecording", isRecording);
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
        setIsCameraOn(false);
      }
    };

    enableCamera();
    console.log("isCameraOn", isCameraOn);
    // else {
    //   if (videoRef.current && videoRef.current.srcObject) {
    //     const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //     tracks.forEach((track) => track.stop());
    //     videoRef.current.srcObject = null;
    //     setIsCameraOn(false);
    //   }
    // }
  }, []);

  const borderVariants = {
    active: {
      borderColor: ["#60a5fa", "#c084fc"],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    inactive: {
      borderColor: "#cbd5e1",
    },
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <motion.div
        className="relative w-64 h-64 rounded-full overflow-hidden border-4"
        variants={borderVariants}
        animate={isRecording ? "active" : "inactive"}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>
      <BsMicFill className="text-blue-600 text-4xl z-10" />

      <p className="mt-5 text-lg font-semibold text-gray-500">
        {isRecording ? "답변 중" : "답변을 준비해주세요"}
      </p>
    </div>
  );
};

export default CameraIndicator;
