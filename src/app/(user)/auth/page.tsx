'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { setUrl } from '@/utils/setUrl';
import {setLocalStorage} from '@/utils/setLocalStorage';

const apiUrl = `${setUrl}/user`;

export interface GetResponse {
  data: GetUserProps;
}

export interface GetUserProps {
  type: string;
  userId: number;
  socialId: string;
  email: string;
  name: string;
  nickname: string;
  s3ProfileImageUrl: string;
  leave: boolean;
  gender: string;
  birthdate: Date;
}

interface AxiosResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: unknown;
  request?: unknown;
}

function isAxiosError(error: unknown): error is { response: AxiosResponse } {
  return (error as { response: AxiosResponse }).response !== undefined;
}

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        const response = await axios.get<GetResponse>(`${apiUrl}/login`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.data.data.type==="signup") {
          router.push(`/signup?id=${response.data.data.userId}`);
        }else{
            alert(response.data.data.name+"님 환영합니다.");
          setLocalStorage();
          router.push('/');
        }

      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 500) {
            alert("비정상적인 접근입니다.");
            router.push(`/`);
          }
      }
      console.error("Error fetching user info:", error);
      throw error;
      }
    };
    
    handleKakaoLogin();
  }, [router]);
  return (
    <div className='bg-main-blue w-screen h-screen max-w-[500px] pt-32'>
      Loading ...
    </div>
  );
};

export default AuthPage;