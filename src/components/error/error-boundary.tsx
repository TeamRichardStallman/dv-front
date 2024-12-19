"use client";

import React from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-6">오류 발생!</h1>
          <p className="text-xl mb-8">
            문제가 발생했습니다. 다시 시도해주세요.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
