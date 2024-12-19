import React, { useEffect, useRef, useState } from "react";

interface VideoTestProps {
  handleSetReady: (isVideoChecked: boolean) => void;
}

const VideoTest = ({ handleSetReady }: VideoTestProps) => {
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMicrophoneChecked, setIsMicrophoneChecked] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [isVideoChecked, setIsVideoChecked] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);

  useEffect(() => {
    if (!hasWebcam) return;

    const checkInterval = setInterval(checkVideoActive, 1000);
    return () => clearInterval(checkInterval);
  }, [hasWebcam]);

  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicrophonePermission(true);

        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          const scaledVolume = Math.min(100, volume * 1.5);
          setVolumeLevel(Math.floor(scaledVolume));

          //   if (scaledVolume > 20) {
          //     setIsMicrophoneChecked(true);
          //   }

          requestAnimationFrame(updateVolume);
        };

        source.connect(analyser);
        updateVolume();
      } catch (error) {
        console.error("마이크 접근 오류:", error);
        setMicrophonePermission(false);
      }
    };

    requestMicrophoneAccess();
  }, []);

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
            setIsVideoActive(true);
          };
        }
      } catch (error) {
        console.error("웹캠 접근 오류:", error);
        setHasWebcam(false);
      }
    };

    setupWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [handleSetReady]);

  const togglePlayAudio = () => {
    if (isPlaying && audioInstance) {
      audioInstance.pause();
      setAudioProgress(0);
      setIsPlaying(false);
      setAudioInstance(null);
      if (intervalId) {
        clearInterval(intervalId);
      }
      return;
    }

    const audio = new Audio("/audiotest.mp3");
    setAudioInstance(audio);
    setIsPlaying(true);
    setAudioProgress(0);

    audio.play();
    const newIntervalId = setInterval(() => {
      if (audio.ended) {
        clearInterval(newIntervalId);
        setAudioProgress(100);
        setIsPlaying(false);
      } else {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    }, 100);

    setIntervalId(newIntervalId);

    audio.onended = () => {
      clearInterval(newIntervalId);
      setAudioProgress(100);
      setIsPlaying(false);
      setAudioInstance(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      alert("오디오 파일 재생에 실패했습니다.");
    };
  };

  const handleClickStartButton = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setAudioInstance(null);
    }

    handleSetReady(true);
  };

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
    setIsVideoActive(averageBrightness > 30);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full gap-20">
        <div className="w-1/2 flex flex-col items-center">
          <h2 className="text-xl font-bold">음성 테스트</h2>
          {!microphonePermission ? (
            <p className="text-red-500">
              마이크 접근 권한이 필요합니다. 설정을 확인해주세요.
            </p>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <div className="flex flex-col-reverse items-center w-64 h-48 gap-1.5 justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-md transition-all duration-300 ${
                      volumeLevel >= (i + 1) * 10
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                    style={{ width: `${20 + i * 5}px` }}
                  ></div>
                ))}
              </div>
              {!isMicrophoneChecked ? (
                <p className="text-black font-semibold">음성 인식 중...</p>
              ) : (
                <p className="block h-6" />
              )}
              <button
                onClick={() => setIsMicrophoneChecked(true)}
                className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                  isMicrophoneChecked
                    ? "bg-green-500"
                    : "bg-gray-400 cursor-pointer"
                }`}
              >
                {isMicrophoneChecked ? "음성 인식 완료 ✓" : "음성 체크"}
              </button>
            </div>
          )}
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">영상 테스트</h2>
            <div className="flex flex-col gap-3 items-center">
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
                    isVideoActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
              {!isVideoChecked ? (
                <p className="text-black font-semibold">영상 확인 중...</p>
              ) : (
                <p className="block h-6" />
              )}
              <button
                onClick={() => setIsVideoChecked(true)}
                className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                  isVideoChecked ? "bg-green-500" : "bg-gray-400"
                }`}
                disabled={!isVideoActive && !isVideoChecked}
              >
                {isVideoChecked ? "카메라 체크 완료 ✓" : "카메라 체크"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-xl font-bold">오디오 테스트</h2>
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={togglePlayAudio}
              className={`relative w-64 h-48 px-4 py-2 rounded-lg text-white font-bold ${
                isPlaying ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              style={{
                background: isPlaying
                  ? `linear-gradient(to right, #3b82f6 ${audioProgress}%, #e5e7eb ${audioProgress}%)`
                  : "",
              }}
            >
              {isPlaying ? "재생 중..." : "오디오 재생"}
            </button>
            {!isAudioChecked ? (
              <p className="text-black font-semibold">오디오 확인 중...</p>
            ) : (
              <p className="block h-6" />
            )}
            <button
              onClick={() => setIsAudioChecked(true)}
              className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                isAudioChecked
                  ? "bg-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isPlaying && !isAudioChecked}
            >
              {isAudioChecked ? "오디오 체크 완료 ✓" : "오디오 체크"}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleClickStartButton}
        className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold mt-24 ${
          isMicrophoneChecked && isAudioChecked
            ? "bg-primary"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isMicrophoneChecked || !isAudioChecked}
      >
        면접 시작
      </button>
    </div>
  );
};

export default VideoTest;
