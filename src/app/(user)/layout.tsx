"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";
import { useEffect, useState } from "react";
import { isLogined } from "@/utils/isLogined";

interface UserLayoutProps {
  children: React.ReactNode;
}
const UserLayout = ({ children }: UserLayoutProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLogined());
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} />
      <main className="flex flex-1 justify-center items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
