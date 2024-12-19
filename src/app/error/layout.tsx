"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import { isLogined } from "@/utils/isLogined";
import Footer from "@/components/footer";

const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} />
      <main className="relative flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ErrorLayout;
