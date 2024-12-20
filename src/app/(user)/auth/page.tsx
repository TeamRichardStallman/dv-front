"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { setUrl } from "@/utils/setUrl";
import { setLocalStorage } from "@/utils/setLocalStorage";
import Loading from "@/components/loading";
import { requestPermissionAndGetToken } from "@/utils/requestFcmToken";
import CustomModal from "@/components/modal/custom-modal";

const apiUrl = `${setUrl}`;

function isAxiosError(error: unknown): error is { response: AxiosResponse } {
  return (error as { response: AxiosResponse }).response !== undefined;
}

const AuthPage = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const handleFirebaseToken = async () => {
      try {
        const token = await requestPermissionAndGetToken();

        if (token !== null && token !== undefined) {
          console.log("FCM token 처리 완: ", token);
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
          console.log("FCM 토큰 전송 성공");
        }
      } catch (error) {
        console.error("FCM 토큰 처리 중 에러:", error);
      }
    };
    const handleKakaoLogin = async () => {
      try {
        const response = await axios.get<GetUserResponse>(
          `${apiUrl}/user/login`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.data.type === "signup") {
          router.push(`/signup?id=${response.data.data.userId}`);
        } else {
          setLocalStorage();
          console.log("setLocalStorage");
          handleFirebaseToken();
          console.log("handleFirebaseToken");
          router.push("/");
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 500) {
            setModalMessage("비정상적인 접근입니다.");
            setIsModalVisible(true);
          }
        }
        console.error("Error fetching user info:", error);
        throw error;
      }
    };

    handleKakaoLogin();
  }, [router]);
  return (
    <>
      <Loading title="로그인 중..." />
      <CustomModal
        isVisible={isModalVisible}
        message={modalMessage}
        confirmButton="다시 로그인하기"
        cancelButton="홈으로"
        onClose={() => {
          setIsModalVisible(false);
          router.push("/");
        }}
        onConfirm={() => {
          router.push("/login");
        }}
      />
    </>
  );
};

export default AuthPage;
