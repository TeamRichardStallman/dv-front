"use client";
import React from "react";
import UserForm from "@/components/user-form";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">회원정보입력</h1>
      <div className="w-full max-w-md p-8 border rounded-lg shadow-md bg-white">
        <UserForm onSubmit={() => {}} />
      </div>
    </div>
  );
};

export default SignupPage;
