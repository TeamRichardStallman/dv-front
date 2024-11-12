"use client";
import React, { useState } from "react";
import UserForm, { formDataType } from "@/components/user-form";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/setLocalStorage";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import { GetResponse, GetUserProps } from "../auth/page";

const apiUrl = `${setUrl}`;

const SignupPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<GetUserProps>();

  const handleFormSubmit = async (formData: formDataType) => {
    try {
      const response = await axios.put<GetResponse>(
        `${apiUrl}/user/info`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.data.name + "님, 환영합니다.");
      setUser(response.data.data);
      setLocalStorage();
      router.push("/");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">회원가입</h1>
      <div className="w-full min-w-[420px] max-w-2xl p-8 border rounded-lg shadow-md bg-white">
        <UserForm onSubmit={handleFormSubmit} initUserData={user} />
      </div>
    </div>
  );
};

export default SignupPage;
