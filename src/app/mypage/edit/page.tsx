"use client";
import React, { useEffect, useState } from "react";
import UserForm, { formDataType } from "@/components/user-form";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;

const EditPage = () => {
  const [user, setUser] = useState<GetUserProps>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const getUserMe = async () => {
      try {
        const response = await axios.get<GetUserResponse>(
          `${apiUrl}/user/info`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Signup failed:", error);
      }
    };
    getUserMe();
  }, []);

  const handleSubmit = async (formData: formDataType) => {
    try {
      const response = await axios.put<GetUserResponse>(
        `${apiUrl}/user/info`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setModalMessage(response.data.data.name + "님의 정보가 수정되었습니다.");
      setIsModalVisible(true);
      setUser(response.data.data);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 border rounded-lg shadow-md bg-white">
      <UserForm onSubmit={handleSubmit} isEditPage={true} initUserData={user} />
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="확인"
        cancelButton="취소"
        onClose={() => {
          setIsModalVisible(false);
        }}
        onConfirm={() => {
          setIsModalVisible(false);
        }}
      />
    </div>
  );
};

export default EditPage;
