"use client";
import React from "react";
import UserForm from "@/components/user-form";
import { useRouter } from "next/navigation";
import { GetResponse } from "@/app/oauth2/authorization/kakao/page";
import { setLocalStorage } from "@/utils/setLocalStorage";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";

const apiUrl = `${setUrl}`;

const SignupPage = () => {
  const router = useRouter();
  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await axios.put<GetResponse>(`${apiUrl}/user/info`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Signup successful:", response.data);
      
      alert(response.data.data.name+"님, 환영합니다.");
      setLocalStorage();
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">회원정보입력</h1>
      <div className="w-full max-w-md p-8 border rounded-lg shadow-md bg-white">
        <UserForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default SignupPage;
