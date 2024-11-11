"use client";
import React, { useEffect, useState } from "react";
import UserForm, { formDataType } from "@/components/user-form";
import { GetResponse, GetUserProps } from "@/app/(user)/auth/page";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";

const apiUrl = `${setUrl}`;

const EditPage = () => {
  const [user, setUser] = useState<GetUserProps>();

  useEffect(() => {
    const getUserMe = async () => {
      try {
        const response = await axios.get<GetResponse>(`${apiUrl}/user/info`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error("Signup failed:", error);
      }
    };
    getUserMe();
  }, []);

  const handleSubmit = async (formData: formDataType) => {
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

      alert(response.data.data.name + "님의 정보가 수정되었습니다.");

      setUser(response.data.data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md p-8 border rounded-lg shadow-md bg-white">
      <UserForm onSubmit={handleSubmit} isEditPage={true} initUserData={user} />
    </div>
  );
};

export default EditPage;
