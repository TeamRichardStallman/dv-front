import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

interface InterviewingPageProps {
  children: React.ReactNode;
}
const InterviewingPage = ({ children }: InterviewingPageProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default InterviewingPage;
