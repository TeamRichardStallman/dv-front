import React, { useEffect, useRef, useState } from "react";

interface VideoTestProps {
  handleSetReady: (isReady: boolean) => void;
}

const VideoTest = ({ handleSetReady }: VideoTestProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const activeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setupWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasWebcam(true);
          console.log("turn on the camera");

          // 비디오 스트림이 실제로 재생되는지 확인
          videoRef.current.onplaying = () => {
            setIsActive(true);
            // 2초 동안 스트림이 활성화되어 있으면 준비 완료로 간주
            activeTimerRef.current = setTimeout(() => {
              setIsReady(true);
              // handleSetReady(true);
            }, 2000);
          };
        }
      } catch (error) {
        console.error("웹캠 접근 오류:", error);
        setHasWebcam(false);
      }
    };

    setupWebcam();

    return () => {
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [handleSetReady]);

  // 비디오 프레임이 어두운지 확인하는 함수
  const checkVideoActive = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // 프레임의 평균 밝기 계산
    let totalBrightness = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      totalBrightness += (r + g + b) / 3;
    }
    const averageBrightness = totalBrightness / (pixels.length / 4);

    // 평균 밝기가 특정 임계값보다 높으면 활성 상태로 간주
    setIsActive(averageBrightness > 30);
  };

  // 주기적으로 비디오 활성 상태 체크
  useEffect(() => {
    if (!hasWebcam) return;

    const checkInterval = setInterval(checkVideoActive, 1000);
    return () => clearInterval(checkInterval);
  }, [hasWebcam]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full space-x-48">
        <div className="w-1/2 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">영상 테스트</h2>
          {/* {!hasWebcam ? (
            <p className="text-red-500">
              카메라 접근 권한이 필요합니다. 설정을 확인해주세요.
            </p>
          ) : ( */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-64 h-48 rounded-lg bg-gray-200"
                autoPlay
                playsInline
                muted
              />
              <div
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                  isActive ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <p className="text-sm text-gray-600">
              {isActive
                ? isReady
                  ? "화면 테스트 완료 ✓"
                  : "영상 확인 중... 잠시만 기다려주세요"
                : "카메라를 확인해주세요"}
            </p>
            <button
              className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                isReady ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isReady}
            >
              {isReady ? "영상 테스트 완료 ✓" : "테스트 진행 중..."}
            </button>
          </div>
          {/* )} */}
        </div>

        <div className="w-1/2 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">오디오 테스트</h2>
          <div className="flex flex-col items-center space-y-2"></div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button>면접 시작</button>
      </div>
    </div>
  );
};

export default VideoTest;
