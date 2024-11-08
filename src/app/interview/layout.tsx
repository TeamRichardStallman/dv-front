"use client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";
import { useEffect, useState } from "react";
import { isLogined } from "@/utils/isLogined";

interface InterviewLayoutProps {
  children: React.ReactNode;
}
const InterviewLayout = ({ children }: InterviewLayoutProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn}/>
      <main className="relative flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default InterviewLayout;
