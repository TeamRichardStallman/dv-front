import Link from "next/link";
import Image from "next/image";
import { setLocalStorage } from "@/utils/setLocalStorage";
import { setUrl } from "@/utils/setUrl";
import axios from "axios";
import { clearFcmToken } from "@/utils/requestFcmToken";

const apiUrl = `${setUrl}`;

interface HeaderProps {
  loggedIn: boolean;
}

export default function Header({ loggedIn }: HeaderProps) {
  const handleLogout = async () => {
    setLocalStorage("false");
    clearFcmToken();

    await axios.post(
      `${apiUrl}/user/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    window.location.href = "/login";
  };

  return (
    <header className="relative flex h-16 justify-between items-center px-8 border-b">
      <Link href="/">
        <div className="relative w-[72.2px] h-[40px]">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex gap-8">
          <li>
            <Link
              href="/interview"
              className="font-bold hover:text-primary hover:underline"
            >
              면접연습
            </Link>
          </li>
          <li>
            <Link
              href="/community"
              className="font-bold hover:text-primary hover:underline"
            >
              커뮤니티
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="font-bold hover:text-primary hover:underline"
            >
              가이드
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            {loggedIn === true ? (
              <div className="flex gap-4">
                <Link
                  href="/mypage/edit"
                  className="font-bold hover:text-primary hover:underline"
                >
                  마이페이지
                </Link>
                <div
                  className="font-bold hover:text-primary hover:underline cursor-pointer"
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="font-bold hover:text-primary hover:underline"
              >
                로그인
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
