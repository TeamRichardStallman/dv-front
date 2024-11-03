import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

interface InterviewLayoutProps {
  children: React.ReactNode;
}
const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="relative flex-1 flex flex-col items-center justify-start">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default InterviewLayout;
