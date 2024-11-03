export default function InterviewFeedbackLoading() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">피드백 준비중</h1>
        {/* <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900 mb-4" /> */}
        <div className="relative w-[68px] h-[68px] mb-4 flex items-center justify-center">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute w-3.5 h-1 bg-gray-600 rounded-full dot-fade"
              style={{
                transform: `rotate(${index * 45}deg) translate(20px)`,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          ))}
        </div>
        <p>고생하셨습니다.</p>
        <p>새로고침 버튼을 누르지 말아주세요.</p>
      </div>
    </div>
  );
}