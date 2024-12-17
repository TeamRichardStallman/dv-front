"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";
import { useEffect, useState } from "react";
import { isLogined } from "@/utils/isLogined";

interface GuideLayoutProps {
  children: React.ReactNode;
}
const GuideLayout = ({ children }: GuideLayoutProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed bg-white top-0 left-0 w-full z-50">
        <Header loggedIn={loggedIn} />
      </div>
      <main className="relative flex-1 flex flex-col items-center justify-center pt-[64px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuideLayout;
