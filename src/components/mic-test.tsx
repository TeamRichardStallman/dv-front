import React, { useEffect, useState } from "react";

interface MicTestProps {
  handleSetReady: (isReady: boolean) => void;
}

const MicTest = ({ handleSetReady }: MicTestProps) => {
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

          if (scaledVolume > 20) {
            setIsMicrophoneChecked(true);
          }

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
      console.error("오디오 파일 재생에 실패했습니다.");
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

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full space-x-48">
        <div className="w-1/2 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">음성 테스트</h2>
          {!microphonePermission ? (
            <p className="text-red-500">
              마이크 접근 권한이 필요합니다. 설정을 확인해주세요.
            </p>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex flex-col-reverse items-center space-y-1 space-y-reverse">
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
              <p className="text-black font-semibold">음성 인식 중...</p>
              <button
                className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                  isMicrophoneChecked
                    ? "bg-green-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isMicrophoneChecked}
              >
                {isMicrophoneChecked ? "음성 인식 완료 ✓" : "테스트 완료"}
              </button>
            </div>
          )}
        </div>

        <div className="w-1/2 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">오디오 테스트</h2>
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={togglePlayAudio}
              className={`relative w-64 h-[147px] px-4 py-2 rounded-lg text-white font-bold ${
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
            <button
              onClick={() => setIsAudioChecked(true)}
              className={`w-64 h-12 px-4 py-2 rounded-lg text-white font-bold ${
                isAudioChecked ? "bg-green-500" : "bg-gray-400"
              }`}
              disabled={!isPlaying && !isAudioChecked}
            >
              {isAudioChecked ? "오디오 체크 완료 ✓" : "확인 완료"}
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

export default MicTest;
