import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

interface UserLayoutProps {
  children: React.ReactNode;
}
const UserLayout = ({ children }: UserLayoutProps) => {
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

export default UserLayout;
