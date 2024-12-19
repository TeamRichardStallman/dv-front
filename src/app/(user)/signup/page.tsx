"use client";
import React, { useEffect, useState } from "react";
import UserForm, { formDataType } from "@/components/user-form";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/setLocalStorage";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import { setFcmKey } from "@/utils/setFcmKey";
import { getToken, isSupported } from "firebase/messaging";
import { messaging } from "@/utils/firebaseConfig";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;
const fcmKey = `${setFcmKey}`;

const SignupPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<GetUserProps>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleFirebaseToken = async () => {
    if (typeof window === "undefined") {
      console.warn("Firebase Messaging can only be used in the browser.");
      return;
    }
    try {
      const supported = await isSupported();
      if (!supported) {
        console.warn("Firebase Messaging is not supported in this browser.");
        return;
      }
      if (!messaging) {
        console.error("Messaging is not initialized.");
        return;
      }
      const token = await getToken(messaging, {
        vapidKey: fcmKey,
      });

      console.log("FCM Token:", token);

      if (token) {
        await axios.post(
          `${apiUrl}/fcm/token`,
          { token },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("FCM 토큰 전송 성공");
    } catch (error) {
      console.error("FCM 토큰 처리 중 에러:", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get<GetUserResponse>(`${apiUrl}/user/info`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(response.data.data);
    };

    try {
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleFormSubmit = async (formData: formDataType) => {
    try {
      const response = await axios.post<GetUserResponse>(
        `${apiUrl}/user/info`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setModalMessage(response.data.data.name + "님, 환영합니다.");
      setConfirmModalMessage("웰컴 쿠폰이 발급 되었습니다! 확인해보세요!");
      setIsModalVisible(true);
      setUser(response.data.data);
      setLocalStorage();
      handleFirebaseToken();
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
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="확인"
        cancelButton="취소"
        onClose={() => {
          setIsModalVisible(false);
          setIsConfirmModalVisible(true);
        }}
        onConfirm={() => {
          setIsModalVisible(false);
          setIsConfirmModalVisible(true);
        }}
      />
      <CustomModal
        isVisible={isConfirmModalVisible}
        message={confirmModalMessage}
        confirmButton="웰컴쿠폰 확인하기"
        cancelButton="홈으로"
        onClose={() => {
          setIsConfirmModalVisible(false);
          router.push(`/`);
        }}
        onConfirm={() => router.push(`/mypage/coupon`)}
      />
    </div>
  );
};

export default SignupPage;
