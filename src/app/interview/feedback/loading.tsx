export default function InterviewFeedbackLoading() {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">로딩 중...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
}
